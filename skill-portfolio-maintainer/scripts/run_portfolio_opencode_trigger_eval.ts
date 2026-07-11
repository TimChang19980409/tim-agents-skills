#!/usr/bin/env bun

import { spawn } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { firstSkillCall } from "../../scripts/lib/opencode-skill-events.ts";

type TriggerCase = {
  id: string;
  kind: "positive" | "boundary" | "null";
  expected_skill: string | null;
  prompt: string;
  pair?: string;
};
type RunResult = {
  caseId: string;
  expectedSkill: string | null;
  firstSkill: string | null;
  run: number;
  passed: boolean;
  timedOut: boolean;
  infraFailure: boolean;
};
type Options = {
  model: string;
  workspace: string;
  suite: "full" | "boundary";
  caseId: string | null;
  runs: number;
  timeoutSeconds: number;
  concurrency: number;
  warmup: boolean;
  enforce: boolean;
};

const repoRoot = resolve(import.meta.dir, "../..");
const mainModel = "opencode/nemotron-3-ultra-free";
const boundaryModel = "opencode/north-mini-code-free";

function option(argv: string[], name: string): string | undefined {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseArgs(argv: string[]): Options {
  const suite = option(argv, "--suite") === "boundary" ? "boundary" : "full";
  const model = option(argv, "--model") ?? (suite === "boundary" ? boundaryModel : mainModel);
  return {
    model,
    suite,
    caseId: option(argv, "--case") ?? null,
    workspace: resolve(
      option(argv, "--workspace") ?? join(repoRoot, "_benchmarks/skill-portfolio-workspace", `opencode-${slug(model.replace("opencode/", ""))}`),
    ),
    runs: Number(option(argv, "--runs-per-query") ?? "2"),
    timeoutSeconds: Number(option(argv, "--timeout-seconds") ?? "120"),
    concurrency: Number(option(argv, "--concurrency") ?? "2"),
    warmup: !argv.includes("--no-warmup"),
    enforce: argv.includes("--enforce"),
  };
}

function runCommand(command: string[], env: NodeJS.ProcessEnv, timeoutSeconds: number, stopOnFirstSkill = false): Promise<{ stdout: string; stderr: string; code: number | null; timedOut: boolean }> {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command[0], command.slice(1), { env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let stopping = false;
    child.stdout.on("data", (chunk) => {
      stdout.push(Buffer.from(chunk));
      if (!stopping && stopOnFirstSkill && firstSkillCall(Buffer.concat(stdout).toString("utf8"))) {
        stopping = true;
        if (child.pid) {
          try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); }
        }
      }
    });
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.once("error", reject);
    let timedOut = false;
    let forceTimer: NodeJS.Timeout | null = null;
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid) {
        try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); }
        forceTimer = setTimeout(() => {
          try { process.kill(-child.pid!, "SIGKILL"); } catch { child.kill("SIGKILL"); }
        }, 2_000);
      }
    }, timeoutSeconds * 1000);
    child.once("close", (code) => {
      clearTimeout(timer);
      if (forceTimer) clearTimeout(forceTimer);
      resolveRun({ stdout: Buffer.concat(stdout).toString("utf8"), stderr: Buffer.concat(stderr).toString("utf8"), code, timedOut });
    });
  });
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function run(): Promise<void> {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, limit) }, run));
  return results;
}

function setupRuntime(model: string): { root: string; project: string; env: NodeJS.ProcessEnv } {
  const root = mkdtempSync(join(tmpdir(), "agent-skill-trigger-"));
  const project = join(root, "project");
  const skillDir = join(project, ".opencode/skills");
  const home = join(root, "home");
  const configDir = join(root, "config-dir");
  mkdirSync(skillDir, { recursive: true });
  mkdirSync(home, { recursive: true });
  mkdirSync(configDir, { recursive: true });

  const manifest = JSON.parse(readFileSync(join(repoRoot, "skills.json"), "utf8")) as { skills: Array<{ name: string; status: string; storage_path: string }> };
  for (const skill of manifest.skills.filter((entry) => entry.status === "core")) {
    symlinkSync(join(repoRoot, skill.storage_path), join(skillDir, skill.name));
  }

  const configPath = join(root, "opencode.json");
  writeFileSync(configPath, `${JSON.stringify({
    $schema: "https://opencode.ai/config.json",
    model,
    permission: { skill: "allow", read: "allow", bash: "deny", edit: "deny", write: "deny", webfetch: "deny", task: "deny" },
  }, null, 2)}\n`);

  return {
    root,
    project,
    env: {
      ...process.env,
      HOME: home,
      XDG_CONFIG_HOME: join(root, "xdg-config"),
      XDG_DATA_HOME: process.env.XDG_DATA_HOME ?? join(homedir(), ".local/share"),
      OPENCODE_CONFIG: configPath,
      OPENCODE_CONFIG_DIR: configDir,
    },
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const suite = JSON.parse(readFileSync(join(repoRoot, "_benchmarks/benchmark-groups/portfolio-trigger-cases.json"), "utf8")) as { cases: TriggerCase[] };
  let cases = options.suite === "boundary" ? suite.cases.filter((item) => item.kind !== "positive") : suite.cases;
  if (options.caseId) cases = cases.filter((item) => item.id === options.caseId);
  if (!cases.length) throw new Error("No trigger cases selected.");

  const runtime = setupRuntime(options.model);
  const commandFor = (prompt: string) => ["opencode", "run", "--pure", "--format", "json", "--dir", runtime.project, "--model", options.model, prompt];

  try {
    if (options.warmup) await runCommand(commandFor("Reply with OK."), runtime.env, options.timeoutSeconds);
    const jobs = cases.flatMap((testCase) => Array.from({ length: options.runs }, (_, index) => ({ testCase, run: index + 1 })));
    const results = await mapLimit(jobs, options.concurrency, async ({ testCase, run }) => {
      const execution = await runCommand(commandFor(testCase.prompt), runtime.env, options.timeoutSeconds, testCase.expected_skill !== null);
      const firstSkill = firstSkillCall(execution.stdout);
      const infraFailure = !execution.timedOut && execution.code !== 0 && firstSkill === null;
      return {
        caseId: testCase.id,
        expectedSkill: testCase.expected_skill,
        firstSkill,
        run,
        passed: !infraFailure && firstSkill === testCase.expected_skill,
        timedOut: execution.timedOut,
        infraFailure,
      } satisfies RunResult;
    });

    const byId = new Map(cases.map((item) => [item.id, item]));
    const ratio = (items: RunResult[], predicate: (item: RunResult) => boolean) => items.length ? items.filter(predicate).length / items.length : 0;
    const positive = results.filter((item) => byId.get(item.caseId)?.kind === "positive");
    const boundary = results.filter((item) => byId.get(item.caseId)?.kind === "boundary");
    const nullCases = results.filter((item) => byId.get(item.caseId)?.kind === "null");
    const perSkill = [...new Set(cases.filter((item) => item.kind === "positive").map((item) => item.expected_skill!))].sort().map((skill) => {
      const selected = positive.filter((item) => item.expectedSkill === skill);
      return { skill, runs: selected.length, positive_recall: ratio(selected, (item) => item.passed) };
    });
    const macro = perSkill.length ? perSkill.reduce((sum, item) => sum + item.positive_recall, 0) / perSkill.length : 0;
    const wrongSkillRate = ratio(results, (item) => item.firstSkill !== null && item.firstSkill !== item.expectedSkill);
    const timeoutRate = ratio(results, (item) => item.timedOut);
    const boundaryAccuracy = ratio(boundary, (item) => item.passed);
    const nullPrecision = ratio(nullCases, (item) => item.passed);
    const thresholds = options.model === boundaryModel
      ? { boundary_accuracy: 0.75, null_precision: 0.75, timeout_rate_max: 0.05 }
      : { macro_first_skill_accuracy: 0.90, per_skill_positive_recall_min: 0.75, boundary_accuracy: 0.85, wrong_skill_rate_max: 0.05, null_precision: 0.90, timeout_rate_max: 0.03 };
    const thresholdPass = options.model === boundaryModel
      ? boundaryAccuracy >= 0.75 && nullPrecision >= 0.75 && timeoutRate <= 0.05
      : macro >= 0.90 && perSkill.every((item) => item.positive_recall >= 0.75) && boundaryAccuracy >= 0.85 && wrongSkillRate <= 0.05 && nullPrecision >= 0.90 && timeoutRate <= 0.03;

    const compactCases = cases.map((testCase) => {
      const selected = results.filter((item) => item.caseId === testCase.id);
      return {
        id: testCase.id,
        kind: testCase.kind,
        expected_skill: testCase.expected_skill,
        first_skill_counts: Object.fromEntries([...new Set(selected.map((item) => item.firstSkill ?? "<none>"))].map((name) => [name, selected.filter((item) => (item.firstSkill ?? "<none>") === name).length])),
        accuracy: ratio(selected, (item) => item.passed),
        timeouts: selected.filter((item) => item.timedOut).length,
        infra_failures: selected.filter((item) => item.infraFailure).length,
      };
    });
    const benchmark = {
      generated_at: new Date().toISOString(), model: options.model, suite: options.suite,
      cases: cases.length, runs_per_case: options.runs,
      status: options.caseId ? "smoke" : results.some((item) => item.infraFailure) ? "completed_with_infra_failures" : thresholdPass ? "passed" : "failed",
      metrics: { macro_first_skill_accuracy: macro, boundary_accuracy: boundaryAccuracy, wrong_skill_rate: wrongSkillRate, null_case_precision: nullPrecision, timeout_rate: timeoutRate, infra_failures: results.filter((item) => item.infraFailure).length },
      thresholds, per_skill: perSkill, results: compactCases,
    };

    mkdirSync(options.workspace, { recursive: true });
    writeFileSync(join(options.workspace, "benchmark.json"), `${JSON.stringify(benchmark, null, 2)}\n`);
    writeFileSync(join(options.workspace, "opencode.json"), `${JSON.stringify({ model: options.model, pure: true, runs_per_case: options.runs, timeout_seconds: options.timeoutSeconds, concurrency: options.concurrency }, null, 2)}\n`);
    writeFileSync(join(options.workspace, "README.md"), `# Natural Trigger Benchmark\n\nModel: \`${options.model}\`  \nSuite: \`${options.suite}\`  \nSource: \`_benchmarks/benchmark-groups/portfolio-trigger-cases.json\`\n\nRaw transcripts, stderr, runtime homes, and staged skills are intentionally not retained.\n`);
    const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
    writeFileSync(join(options.workspace, "benchmark.md"), `# Trigger Benchmark\n\n- Status: **${benchmark.status}**\n- Model: \`${options.model}\`\n- Cases/runs: ${cases.length}/${results.length}\n- Macro first-skill accuracy: ${percent(macro)}\n- Boundary accuracy: ${percent(boundaryAccuracy)}\n- Wrong-skill rate: ${percent(wrongSkillRate)}\n- Null-case precision: ${percent(nullPrecision)}\n- Timeout rate: ${percent(timeoutRate)}\n- Infra failures: ${benchmark.metrics.infra_failures}\n`);
    process.stdout.write(`${JSON.stringify(benchmark.metrics)}\n`);
    if (options.enforce && !thresholdPass) process.exitCode = 2;
  } finally {
    rmSync(runtime.root, { recursive: true, force: true });
  }
}

if (import.meta.main) await main();
