#!/usr/bin/env bun

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

type EvalItem = {
  id: string;
  expected_skill: "java-pro" | "spring-boot-engineer";
  query: string;
};

type SkillConfig = {
  name: "java-pro" | "spring-boot-engineer";
  path: string;
  description: string;
};

type RunResult = {
  evalId: string;
  run: number;
  expectedSkill: string;
  triggeredSkill: string | null;
  passed: boolean;
  rawLogPath: string;
  timedOut: boolean;
  runner: "codex" | "opencode";
};

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args.set(token, "true");
      continue;
    }
    args.set(token, next);
    i += 1;
  }
  return args;
}

function getRequired(args: Map<string, string>, key: string) {
  const value = args.get(key);
  if (!value) {
    throw new Error(`Missing required argument: ${key}`);
  }
  return value;
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

async function loadSkill(path: string, override?: string): Promise<SkillConfig> {
  const content = await readFile(join(path, "SKILL.md"), "utf8");
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  if (!nameMatch) {
    throw new Error(`Could not parse skill name from ${path}`);
  }
  const name = nameMatch[1].trim().replace(/^['"]|['"]$/g, "") as SkillConfig["name"];
  return {
    name,
    path,
    description: override ?? getDescription(content),
  };
}

function escapeDescription(description: string) {
  return description.replaceAll('"', '\\"');
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
- Discovery: The list above is the skills available in this session.
- Trigger rules: If the user request clearly matches a skill description shown above, you must use that skill for that turn.
- How to use a skill:
  1) Open its \`SKILL.md\`.
  2) Read only enough to follow the workflow.
  3) If \`references/\` exists, load only the files needed for the task.
- Coordination and sequencing:
  - Choose the minimal set of skills that covers the request.
  - Announce which skill you are using and why in one short line.
- Safety and fallback:
  - If a skill cannot be applied cleanly, say so briefly and continue with the best fallback.
`;
}

async function runOne(
  workspace: string,
  item: EvalItem,
  run: number,
  skills: SkillConfig[],
  runner: "codex" | "opencode",
  model?: string,
  timeoutSeconds = 30,
): Promise<RunResult> {
  const runDir = join(workspace, "runs", item.id, `run-${run}`);
  await mkdir(runDir, { recursive: true });
  const logPath = join(runDir, "codex.jsonl");
  const lastMessagePath = join(runDir, "last-message.txt");

  const cmd =
    runner === "codex"
      ? buildCodexCommand(workspace, lastMessagePath, item.query, model)
      : buildOpencodeCommand(workspace, item.query, model);

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
  await writeFile(logPath, stdoutText + (stderrText ? `\n# STDERR\n${stderrText}` : ""));

  const triggered =
    runner === "codex"
      ? detectTriggeredSkillFromCodex(stdoutText, skills)
      : detectTriggeredSkillFromOpencode(stdoutText);
  return {
    evalId: item.id,
    run,
    expectedSkill: item.expected_skill,
    triggeredSkill: triggered,
    passed: triggered === item.expected_skill,
    rawLogPath: logPath + (exitCode === 0 ? "" : ` (exit ${exitCode})`),
    timedOut,
    runner,
  };
}

function buildCodexCommand(workspace: string, lastMessagePath: string, query: string, model?: string) {
  const cmd = [
    "codex",
    "exec",
    "--json",
    "--skip-git-repo-check",
    "-C",
    workspace,
    "--output-last-message",
    lastMessagePath,
  ];

  if (model) {
    cmd.push("--model", model);
  }

  cmd.push(query);
  return cmd;
}

function buildOpencodeCommand(workspace: string, query: string, model?: string) {
  const prompt = [
    "Using the available skills in this workspace, choose exactly one skill for the user request below.",
    "Reply with only one of these skill names: java-pro or spring-boot-engineer.",
    "",
    query,
  ].join("\n");

  const cmd = [
    "opencode",
    "run",
    "--format",
    "json",
    "--dir",
    workspace,
  ];

  if (model) {
    cmd.push("--model", model);
  }

  cmd.push(prompt);
  return cmd;
}

function detectTriggeredSkillFromCodex(stdoutText: string, skills: SkillConfig[]) {
  const lines = stdoutText.split("\n").map((line) => line.trim()).filter(Boolean);
  const seen: string[] = [];

  for (const line of lines) {
    let parsed: any;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }

    const item = parsed.item;
    if (!item) continue;
    const haystack = JSON.stringify(item);
    for (const skill of skills) {
      const skillPath = join(skill.path, "SKILL.md");
      if (haystack.includes(skillPath)) {
        seen.push(skill.name);
      }
    }
  }

  return seen[0] ?? null;
}

function detectTriggeredSkillFromOpencode(stdoutText: string) {
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
      lastText = String(parsed.part.text);
    }
  }

  if (lastText.includes("spring-boot-engineer")) return "spring-boot-engineer";
  if (lastText.includes("java-pro")) return "java-pro";
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const evalSetPath = getRequired(args, "--eval-set");
  const workspace = getRequired(args, "--workspace");
  const runsPerQuery = Number(args.get("--runs-per-query") ?? "2");
  const timeoutSeconds = Number(args.get("--timeout-seconds") ?? "30");
  const runner = (args.get("--runner") ?? "codex") as "codex" | "opencode";
  const model = args.get("--model");
  const javaSkillPath = getRequired(args, "--java-skill");
  const springSkillPath = getRequired(args, "--spring-skill");
  const javaDescription = args.get("--java-description");
  const springDescription = args.get("--spring-description");

  const evalSet = JSON.parse(await readFile(evalSetPath, "utf8")) as EvalItem[];
  const skills = [
    await loadSkill(javaSkillPath, javaDescription),
    await loadSkill(springSkillPath, springDescription),
  ];

  await rm(workspace, { recursive: true, force: true });
  await mkdir(workspace, { recursive: true });
  await writeFile(join(workspace, "AGENTS.md"), buildAgentsContent(skills));
  await writeFile(join(workspace, "eval-set.json"), JSON.stringify(evalSet, null, 2));

  const results: RunResult[] = [];
  for (const item of evalSet) {
    for (let run = 1; run <= runsPerQuery; run += 1) {
      results.push(await runOne(workspace, item, run, skills, runner, model, timeoutSeconds));
    }
  }

  const grouped = new Map<string, RunResult[]>();
  for (const result of results) {
    const key = result.evalId;
    const list = grouped.get(key) ?? [];
    list.push(result);
    grouped.set(key, list);
  }

  const summary = evalSet.map((item) => {
    const runs = grouped.get(item.id) ?? [];
    const hitCount = runs.filter((run) => run.triggeredSkill === item.expected_skill).length;
    const firstTriggered = runs[0]?.triggeredSkill ?? null;
    return {
      id: item.id,
      expected_skill: item.expected_skill,
      query: item.query,
      runs: runs.length,
      correct_runs: hitCount,
      pass: hitCount >= Math.ceil(runs.length / 2),
      first_triggered_skill: firstTriggered,
      triggered_breakdown: Object.fromEntries(
        [...new Set(runs.map((run) => run.triggeredSkill ?? "none"))].map((name) => [
          name,
          runs.filter((run) => (run.triggeredSkill ?? "none") === name).length,
        ]),
      ),
    };
  });

  const overall = {
    total_queries: summary.length,
    passed_queries: summary.filter((item) => item.pass).length,
    failed_queries: summary.filter((item) => !item.pass).length,
    total_runs: results.length,
    passed_runs: results.filter((item) => item.passed).length,
  };

  const output = {
    workspace,
    runner,
    skills: skills.map((skill) => ({
      name: skill.name,
      path: skill.path,
      description: skill.description,
    })),
    overall,
    summary,
    runs: results,
  };

  await writeFile(join(workspace, "results.json"), JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

await main();
