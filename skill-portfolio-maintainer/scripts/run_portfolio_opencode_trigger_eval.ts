#!/usr/bin/env bun

import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { skillPortfolioWorkspace } from "../../scripts/lib/layout.ts";

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

type TimedCommandResult = {
  stdoutText: string;
  stderrText: string;
  exitCode: number | null;
  signal: string | null;
  timedOut: boolean;
};

type Args = {
  help: boolean;
  workspace: string | null;
  workspaceProvided: boolean;
  model: string;
  runsPerQuery: number;
  timeoutSeconds: number;
  concurrency: number;
};

const DEFAULT_MODEL = "minimax-coding-plan/MiniMax-M2.5";
const DEFAULT_WORKSPACE_PROFILE = "opencode-minimax-m2-5";
const HELP_TEXT = `Usage:
  bun scripts/run_portfolio_opencode_trigger_eval.ts [--workspace <path>] [--model <provider/model>] [--runs-per-query <n>] [--timeout-seconds <n>] [--concurrency <n>]

Options:
  --workspace <path>       Portfolio workspace (default: derived from model)
  --model <id>             OpenCode model ID (default: minimax-coding-plan/MiniMax-M2.5)
  --runs-per-query <n>     Runs per query (default: 3)
  --timeout-seconds <n>    Per-run timeout in seconds (default: 60)
  --concurrency <n>        Number of concurrent runs (default: 3)
  --help                   Show this help text
`;

function parseArgs(argv: string[]): Args {
  if (argv.includes("--help")) {
    return {
      help: true,
      workspace: null,
      workspaceProvided: false,
      model: DEFAULT_MODEL,
      runsPerQuery: 3,
      timeoutSeconds: 60,
      concurrency: 3,
    };
  }

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

  function hasOption(name: string): boolean {
    return args.has(name) || Array.from(args.keys()).some((key) => key.startsWith(`${name}=`));
  }

  function getOption(name: string): string | undefined {
    const direct = args.get(name);
    if (direct !== undefined) {
      return direct;
    }
    for (const [key, value] of args.entries()) {
      if (key.startsWith(`${name}=`)) {
        return key.slice(name.length + 1) || value;
      }
    }
    return undefined;
  }

  return {
    help: false,
    workspace: hasOption("--workspace") ? resolve(getOption("--workspace") ?? "") : null,
    workspaceProvided: hasOption("--workspace"),
    model: getOption("--model") ?? DEFAULT_MODEL,
    runsPerQuery: Number(getOption("--runs-per-query") ?? "3"),
    // Portfolio trigger runs are latency-sensitive; a slightly longer timeout and
    // lower concurrency reduce benchmark noise from empty timed-out runs.
    timeoutSeconds: Number(getOption("--timeout-seconds") ?? "60"),
    concurrency: Number(getOption("--concurrency") ?? "3"),
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function workspaceProfileForModel(model: string): string {
  if (model === DEFAULT_MODEL) {
    return DEFAULT_WORKSPACE_PROFILE;
  }
  if (model === "cursor/auto") {
    return "opencode-cursor-auto";
  }
  if (model.startsWith("opencode/")) {
    return `opencode-${slugify(model.slice("opencode/".length))}`;
  }
  return `opencode-${slugify(model)}`;
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
    .map((skill) => {
      const intentTags = skill.intentTags.length > 0 ? ` Task signals: ${skill.intentTags.join("; ")}.` : "";
      return `- ${skill.name}: ${skill.description}${intentTags} (file: ${join(skill.path, "SKILL.md")})`;
    })
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

function streamToText(stream: NodeJS.ReadableStream | null): Promise<string> {
  if (!stream) return Promise.resolve("");

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function runTimedCommand(cmd: string[], timeoutSeconds: number): Promise<TimedCommandResult> {
  const proc = spawn(cmd[0], cmd.slice(1), {
    detached: true,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdoutPromise = streamToText(proc.stdout);
  const stderrPromise = streamToText(proc.stderr);
  let timedOut = false;
  let forceKillTimer: NodeJS.Timeout | null = null;

  function killProcessGroup(signal: NodeJS.Signals): void {
    if (!proc.pid) return;
    try {
      process.kill(-proc.pid, signal);
    } catch {
      try {
        proc.kill(signal);
      } catch {
        // The process may have exited between the timeout and the kill attempt.
      }
    }
  }

  const timeout = setTimeout(() => {
    timedOut = true;
    killProcessGroup("SIGTERM");
    forceKillTimer = setTimeout(() => killProcessGroup("SIGKILL"), 2_000);
    forceKillTimer.unref();
  }, timeoutSeconds * 1000);

  const exit = await new Promise<{ exitCode: number | null; signal: string | null }>((resolve, reject) => {
    proc.once("error", reject);
    proc.once("close", (exitCode, signal) => resolve({ exitCode, signal }));
  });

  clearTimeout(timeout);
  if (forceKillTimer) clearTimeout(forceKillTimer);

  const stdoutText = await stdoutPromise;
  const stderrText = await stderrPromise;
  return { ...exit, stdoutText, stderrText, timedOut };
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

  const { stdoutText, stderrText, exitCode, signal, timedOut } = await runTimedCommand(cmd, timeoutSeconds);
  const timeoutText = timedOut ? `\n# TIMEOUT\ntimeout_seconds=${timeoutSeconds}` : "";
  await writeFile(rawLogPath, stdoutText + (stderrText ? `\n# STDERR\n${stderrText}` : "") + timeoutText);

  const triggeredSkill = detectTriggeredSkill(stdoutText, skills);
  const exitStatus = exitCode === 0 && !signal ? "" : ` (exit ${exitCode ?? signal ?? "unknown"}${timedOut ? ", timeout" : ""})`;
  return {
    evalId: query.id,
    expectedSkill: query.expected_skill,
    run,
    triggeredSkill,
    passed: triggeredSkill === query.expected_skill,
    rawLogPath: rawLogPath + exitStatus,
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

function average(values: Array<number | null>) {
  const numericValues = values.filter((value): value is number => value !== null);
  if (numericValues.length === 0) return null;
  return Number((numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length).toFixed(4));
}

function formatRate(value: number | null): string {
  return value === null ? "n/a" : `${Math.round(value * 100)}%`;
}

function buildWorkspaceReadme(workspace: string, model: string): string {
  return [
    "# Portfolio Trigger Benchmark Workspace",
    "",
    `- workspace: ${workspace}`,
    `- model: ${model}`,
    "- retained artifacts: `benchmark.json`, `benchmark.md`, `opencode.json`, `README.md`",
    "- cleaned artifacts: `results.json`, `AGENTS.md`, `eval-set.json`, `runs/`, and `eval-*` directories",
    "",
    "Use this workspace as the compact summary for a portfolio trigger run.",
  ].join("\n");
}

function buildWorkspaceConfig(model: string): string {
  return `${JSON.stringify(
    {
      $schema: "https://opencode.ai/config.json",
      model,
      permission: {
        bash: { "*": "allow" },
        edit: { "*": "deny" },
        write: { "*": "deny" },
      },
    },
    null,
    2
  )}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const root = resolve(import.meta.dir, "..", "..");
  const skills = await loadCoreSkills(root);
  const evalSet = buildEvalSet(skills);
  const workspace = args.workspaceProvided && args.workspace ? args.workspace : skillPortfolioWorkspace(root, workspaceProfileForModel(args.model));

  await rm(workspace, { recursive: true, force: true });
  await mkdir(workspace, { recursive: true });
  await writeFile(join(workspace, "README.md"), `${buildWorkspaceReadme(workspace, args.model)}\n`);
  await writeFile(join(workspace, "opencode.json"), buildWorkspaceConfig(args.model));
  await writeFile(join(workspace, "AGENTS.md"), buildAgentsContent(skills));
  await writeFile(join(workspace, "eval-set.json"), JSON.stringify(evalSet, null, 2));

  const allRuns = evalSet.flatMap((query) =>
    Array.from({ length: args.runsPerQuery }, (_, index) => ({ query, run: index + 1 }))
  );

  const results: RunResult[] = [];
  let completedRuns = 0;
  await runWithConcurrency(allRuns, args.concurrency, async (item) => {
    results.push(await runOne(workspace, item.query, item.run, skills, args.model, args.timeoutSeconds));
    completedRuns += 1;
    if (completedRuns % 25 === 0 || completedRuns === allRuns.length) {
      console.error(`Completed ${completedRuns}/${allRuns.length} OpenCode trigger runs`);
    }
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
      pass_rate: runs.length === 0 ? null : Number((correctRuns / runs.length).toFixed(4)),
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
      timed_out_runs: ownRuns.filter((run) => run.timedOut).length,
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
    status: results.length === 0 ? "no_runs" : "completed",
    total_queries: querySummary.length,
    total_runs: results.length,
    timed_out_runs: results.filter((result) => result.timedOut).length,
    query_pass_rate: average(querySummary.map((query) => query.pass_rate)),
    run_pass_rate: average(results.map((result) => (result.passed ? 1 : 0))),
  };

  const benchmark = {
    workspace,
    generated_at: new Date().toISOString(),
    overall,
    per_skill: perSkill,
    queries: querySummary,
  };

  const markdown = [
    "# Portfolio Trigger Benchmark",
    "",
    `- model: ${args.model}`,
    `- status: ${overall.status}`,
    `- total queries: ${overall.total_queries}`,
    `- total runs: ${overall.total_runs}`,
    `- query pass rate: ${formatRate(overall.query_pass_rate)}`,
    `- run pass rate: ${formatRate(overall.run_pass_rate)}`,
    "",
    `- timed out runs: ${overall.timed_out_runs}`,
    "",
    "| Skill | Queries | Timed Out Runs | Query Pass Rate | Run Pass Rate | False Positive Rate |",
    "| --- | --- | --- | --- | --- | --- |",
    ...perSkill.map((row) => {
      const queryRate = formatRate(row.query_pass_rate);
      const runRate = formatRate(row.run_pass_rate);
      const falsePositive = formatRate(row.false_positive_rate);
      return `| ${row.skill} | ${row.queries} | ${row.timed_out_runs} | ${queryRate} | ${runRate} | ${falsePositive} |`;
    }),
  ].join("\n");

  await writeFile(join(workspace, "results.json"), JSON.stringify({ overall, perSkill, querySummary, runs: results }, null, 2));
  await writeFile(join(workspace, "benchmark.json"), JSON.stringify(benchmark, null, 2));
  await writeFile(join(workspace, "benchmark.md"), `${markdown}\n`);
  console.log(JSON.stringify(benchmark, null, 2));
}

await main();
