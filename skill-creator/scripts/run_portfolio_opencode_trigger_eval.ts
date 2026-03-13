#!/usr/bin/env bun

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

type SkillRecord = {
  name: string;
  status: "core" | "merge" | "archive" | "retire";
  storage_path: string;
  intent_tags: string[];
};

type SkillConfig = {
  name: string;
  path: string;
  description: string;
  intentTags: string[];
};

type EvalQuery = {
  id: string;
  expected_skill: string;
  source_tag: string;
  prompt: string;
};

type RunResult = {
  evalId: string;
  expectedSkill: string;
  run: number;
  triggeredSkill: string | null;
  passed: boolean;
  rawLogPath: string;
  timedOut: boolean;
};

type Args = {
  workspace: string;
  model: string;
  runsPerQuery: number;
  timeoutSeconds: number;
  concurrency: number;
};

const DEFAULT_WORKSPACE = resolve(import.meta.dir, "..", "..", "skill-portfolio-workspace", "opencode-minimax-m2-5");
const DEFAULT_MODEL = "minimax-coding-plan/MiniMax-M2.5";

function parseArgs(argv: string[]): Args {
  const args = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args.set(token, "true");
      continue;
    }
    args.set(token, next);
    index += 1;
  }

  return {
    workspace: resolve(args.get("--workspace") ?? DEFAULT_WORKSPACE),
    model: args.get("--model") ?? DEFAULT_MODEL,
    runsPerQuery: Number(args.get("--runs-per-query") ?? "3"),
    timeoutSeconds: Number(args.get("--timeout-seconds") ?? "30"),
    concurrency: Number(args.get("--concurrency") ?? "6"),
  };
}

function getDescription(skillContent: string) {
  const match = skillContent.match(/^description:\s*(.+)$/m);
  if (match) {
    return match[1].trim().replace(/^['"]|['"]$/g, "");
  }
  const multiline = skillContent.match(/^description:\s*[>|]-?\s*\n([\s\S]*?)\n(?:[A-Za-z0-9_-]+:|---$)/m);
  if (multiline) {
    return multiline[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ");
  }
  throw new Error("Could not parse skill description");
}

async function loadCoreSkills(root: string): Promise<SkillConfig[]> {
  const manifest = JSON.parse(await readFile(join(root, "skills.json"), "utf8")) as { skills: SkillRecord[] };
  const coreSkills = manifest.skills.filter((skill) => skill.status === "core");
  const loaded = await Promise.all(
    coreSkills.map(async (skill) => {
      const path = join(root, skill.storage_path);
      const content = await readFile(join(path, "SKILL.md"), "utf8");
      return {
        name: skill.name,
        path,
        description: getDescription(content),
        intentTags: skill.intent_tags.slice(0, 4),
      } satisfies SkillConfig;
    })
  );
  return loaded.sort((left, right) => left.name.localeCompare(right.name));
}

function buildAgentsContent(skills: SkillConfig[]) {
  const skillLines = skills
    .map((skill) => `- ${skill.name}: ${skill.description} (file: ${join(skill.path, "SKILL.md")})`)
    .join("\n");

  return `## Skills
A skill is a set of local instructions to follow that is stored in a \`SKILL.md\` file. Below is the list of skills available in this benchmark workspace.
### Available skills
${skillLines}
### How to use skills
- Trigger rules: If the user request clearly matches a skill description shown above, you must use that skill for that turn.
- Choose the single best skill for the request. Do not return multiple skills.
- How to use a skill:
  1) Open its \`SKILL.md\`.
  2) Read only enough to follow the workflow.
  3) If \`references/\` exists, load only the files needed for the task.
`;
}

function buildEvalSet(skills: SkillConfig[]): EvalQuery[] {
  const templates = [
    (tag: string) => `A user asks for help with ${tag}. Which single skill should handle this request?`,
    (tag: string) => `Pick the best local skill for this task: ${tag}.`,
    (tag: string) => `Route this request to one skill only: ${tag}.`,
  ];

  const queries: EvalQuery[] = [];
  for (const skill of skills) {
    const tags = skill.intentTags.length > 0 ? skill.intentTags : [skill.name];
    for (const tag of tags) {
      for (const template of templates) {
        const prompt = template(tag);
        queries.push({
          id: `${skill.name}-${queries.filter((query) => query.expected_skill === skill.name).length + 1}`.replaceAll("/", "-"),
          expected_skill: skill.name,
          source_tag: tag,
          prompt,
        });
      }
    }
  }
  return queries;
}

function detectTriggeredSkill(stdoutText: string, skills: SkillConfig[]) {
  const lines = stdoutText.split("\n").map((line) => line.trim()).filter(Boolean);
  let lastText = "";

  for (const line of lines) {
    let parsed: any;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (parsed.type === "text" && parsed.part?.text) {
      lastText = String(parsed.part.text).trim();
    }
  }

  const exact = skills.find((skill) => lastText === skill.name);
  if (exact) return exact.name;

  const firstMention = skills.find((skill) => lastText.includes(skill.name));
  return firstMention?.name ?? null;
}

async function runOne(
  workspace: string,
  query: EvalQuery,
  run: number,
  skills: SkillConfig[],
  model: string,
  timeoutSeconds: number
): Promise<RunResult> {
  const runDir = join(workspace, "runs", query.expected_skill, query.id, `run-${run}`);
  await mkdir(runDir, { recursive: true });
  const rawLogPath = join(runDir, "opencode.jsonl");

  const prompt = [
    "Using the available skills in this workspace, choose exactly one skill for the user request below.",
    `Reply with only one skill name from this list: ${skills.map((skill) => skill.name).join(", ")}.`,
    "",
    query.prompt,
  ].join("\n");

  const cmd = [
    "opencode",
    "run",
    "--format",
    "json",
    "--dir",
    workspace,
    "--model",
    model,
    prompt,
  ];

  const proc = Bun.spawn(cmd, {
    stdout: "pipe",
    stderr: "pipe",
    env: process.env,
  });

  const stdoutPromise = new Response(proc.stdout).text();
  const stderrPromise = new Response(proc.stderr).text();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    proc.kill();
  }, timeoutSeconds * 1000);

  const exitCode = await proc.exited;
  clearTimeout(timeout);

  const stdoutText = await stdoutPromise;
  const stderrText = await stderrPromise;
  await writeFile(rawLogPath, stdoutText + (stderrText ? `\n# STDERR\n${stderrText}` : ""));

  const triggeredSkill = detectTriggeredSkill(stdoutText, skills);
  return {
    evalId: query.id,
    expectedSkill: query.expected_skill,
    run,
    triggeredSkill,
    passed: triggeredSkill === query.expected_skill,
    rawLogPath: rawLogPath + (exitCode === 0 ? "" : ` (exit ${exitCode})`),
    timedOut,
  };
}

async function runWithConcurrency<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>) {
  let nextIndex = 0;

  async function runner() {
    while (nextIndex < items.length) {
      const current = items[nextIndex];
      nextIndex += 1;
      await worker(current);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => runner()));
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = resolve(import.meta.dir, "..", "..");
  const skills = await loadCoreSkills(root);
  const evalSet = buildEvalSet(skills);

  await rm(args.workspace, { recursive: true, force: true });
  await mkdir(args.workspace, { recursive: true });
  await writeFile(join(args.workspace, "AGENTS.md"), buildAgentsContent(skills));
  await writeFile(join(args.workspace, "eval-set.json"), JSON.stringify(evalSet, null, 2));

  const allRuns = evalSet.flatMap((query) =>
    Array.from({ length: args.runsPerQuery }, (_, index) => ({ query, run: index + 1 }))
  );

  const results: RunResult[] = [];
  await runWithConcurrency(allRuns, args.concurrency, async (item) => {
    results.push(await runOne(args.workspace, item.query, item.run, skills, args.model, args.timeoutSeconds));
  });

  const querySummary = evalSet.map((query) => {
    const runs = results.filter((result) => result.evalId === query.id);
    const correctRuns = runs.filter((result) => result.passed).length;
    return {
      id: query.id,
      expected_skill: query.expected_skill,
      source_tag: query.source_tag,
      prompt: query.prompt,
      runs: runs.length,
      correct_runs: correctRuns,
      pass_rate: Number((correctRuns / Math.max(1, runs.length)).toFixed(4)),
    };
  });

  const perSkill = skills.map((skill) => {
    const ownQueries = querySummary.filter((query) => query.expected_skill === skill.name);
    const ownRuns = results.filter((result) => result.expectedSkill === skill.name);
    const foreignRuns = results.filter((result) => result.expectedSkill !== skill.name);
    const falsePositives = foreignRuns.filter((result) => result.triggeredSkill === skill.name).length;
    return {
      skill: skill.name,
      queries: ownQueries.length,
      query_pass_rate: average(ownQueries.map((query) => query.pass_rate)),
      run_pass_rate: average(
        ownRuns.map((run) => (run.passed ? 1 : 0))
      ),
      false_positive_rate:
        foreignRuns.length === 0 ? null : Number((falsePositives / foreignRuns.length).toFixed(4)),
    };
  });

  const overall = {
    model: args.model,
    total_queries: querySummary.length,
    total_runs: results.length,
    query_pass_rate: average(querySummary.map((query) => query.pass_rate)),
    run_pass_rate: average(results.map((result) => (result.passed ? 1 : 0))),
  };

  const benchmark = {
    workspace: args.workspace,
    generated_at: new Date().toISOString(),
    overall,
    per_skill: perSkill,
    queries: querySummary,
  };

  const markdown = [
    "# Portfolio Trigger Benchmark",
    "",
    `- model: ${args.model}`,
    `- total queries: ${overall.total_queries}`,
    `- total runs: ${overall.total_runs}`,
    `- query pass rate: ${Math.round((overall.query_pass_rate ?? 0) * 100)}%`,
    `- run pass rate: ${Math.round((overall.run_pass_rate ?? 0) * 100)}%`,
    "",
    "| Skill | Queries | Query Pass Rate | Run Pass Rate | False Positive Rate |",
    "| --- | --- | --- | --- | --- |",
    ...perSkill.map((row) => {
      const queryRate = row.query_pass_rate === null ? "n/a" : `${Math.round(row.query_pass_rate * 100)}%`;
      const runRate = row.run_pass_rate === null ? "n/a" : `${Math.round(row.run_pass_rate * 100)}%`;
      const falsePositive = row.false_positive_rate === null ? "n/a" : `${Math.round(row.false_positive_rate * 100)}%`;
      return `| ${row.skill} | ${row.queries} | ${queryRate} | ${runRate} | ${falsePositive} |`;
    }),
  ].join("\n");

  await writeFile(join(args.workspace, "results.json"), JSON.stringify({ overall, perSkill, querySummary, runs: results }, null, 2));
  await writeFile(join(args.workspace, "benchmark.json"), JSON.stringify(benchmark, null, 2));
  await writeFile(join(args.workspace, "benchmark.md"), `${markdown}\n`);
  console.log(JSON.stringify(benchmark, null, 2));
}

await main();
