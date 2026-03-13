#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

type EvalCase = {
  id: number;
  name?: string;
  prompt: string;
  expected_output: string;
  files: string[];
  expectations: string[];
};

type EvalManifest = {
  skill_name: string;
  evals: EvalCase[];
};

type CliOptions = {
  workspace: string;
  skillRoot: string;
  evalIds: Set<number> | null;
  help: boolean;
};

type GradedExpectation = {
  text: string;
  passed: boolean;
  evidence: string;
};

type RunSummary = {
  label: string;
  passRate: number;
  total: number;
  passed: number;
  tokens: number | null;
};

const HELP_TEXT = `Usage:
  bun scripts/grade_opencode_skill_evals.ts [--skill-root <path>] [--workspace <path>] [--eval <ids>]

Options:
  --workspace <path>  Iteration workspace (default: sibling <skill>-workspace/iteration-1)
  --skill-root <path> Skill root
  --eval <ids>        Comma-separated eval ids
  --help              Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return { workspace: "", skillRoot: "", evalIds: null, help: true };
  }

  let skillRoot = resolve(import.meta.dir, "..", "..", "frontend-dev-guidelines");
  let workspace = resolve(import.meta.dir, "..", "..", "frontend-dev-guidelines-workspace", "iteration-1");
  let evalIds: Set<number> | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--workspace" || arg.startsWith("--workspace=")) {
      workspace = resolve(arg.includes("=") ? arg.slice("--workspace=".length) : argv[++index] ?? "");
      continue;
    }
    if (arg === "--skill-root" || arg.startsWith("--skill-root=")) {
      skillRoot = resolve(arg.includes("=") ? arg.slice("--skill-root=".length) : argv[++index] ?? "");
      continue;
    }
    if (arg === "--eval" || arg.startsWith("--eval=")) {
      const value = arg.includes("=") ? arg.slice("--eval=".length) : argv[++index] ?? "";
      evalIds = new Set(
        value
          .split(",")
          .map((item) => Number.parseInt(item.trim(), 10))
          .filter((item) => Number.isInteger(item))
      );
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!argv.some((arg) => arg.startsWith("--workspace"))) {
    workspace = resolve(skillRoot, "..", `${skillRoot.split("/").pop()}-workspace`, "iteration-1");
  }

  return { workspace, skillRoot, evalIds, help: false };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function decodeExpectation(expectation: string, text: string): GradedExpectation {
  const [prefix, ...rest] = expectation.split(":");
  const payload = rest.join(":");

  if (prefix === "contains") {
    const passed = text.includes(payload);
    return {
      text: `The output contains "${payload}"`,
      passed,
      evidence: passed ? `Matched literal substring: ${payload}` : `Missing literal substring: ${payload}`,
    };
  }

  if (prefix === "notContains") {
    const passed = !text.includes(payload);
    return {
      text: `The output does not contain "${payload}"`,
      passed,
      evidence: passed ? `Confirmed absence of literal substring: ${payload}` : `Unexpected literal substring present: ${payload}`,
    };
  }

  if (prefix === "containsAny") {
    const options = payload.split("|").filter(Boolean);
    const match = options.find((option) => text.includes(option));
    return {
      text: `The output contains any of: ${options.join(", ")}`,
      passed: Boolean(match),
      evidence: match ? `Matched literal substring: ${match}` : "No listed literal substring matched.",
    };
  }

  if (prefix === "containsAll") {
    const options = payload.split("|").filter(Boolean);
    const missing = options.filter((option) => !text.includes(option));
    return {
      text: `The output contains all of: ${options.join(", ")}`,
      passed: missing.length === 0,
      evidence: missing.length === 0 ? "All literal substrings matched." : `Missing literal substrings: ${missing.join(", ")}`,
    };
  }

  if (prefix === "regex") {
    const regex = new RegExp(payload, "i");
    const match = text.match(regex);
    return {
      text: `The output matches /${payload}/i`,
      passed: match !== null,
      evidence: match ? `Matched regex: ${match[0]}` : `No regex match for /${payload}/i`,
    };
  }

  return {
    text: expectation,
    passed: text.includes(expectation),
    evidence: text.includes(expectation) ? `Matched raw expectation string: ${expectation}` : `No match for raw expectation string: ${expectation}`,
  };
}

function gradeRun(evalCase: EvalCase, text: string): GradedExpectation[] {
  return evalCase.expectations.map((expectation) => decodeExpectation(expectation, text));
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const manifest = JSON.parse(readFileSync(join(options.skillRoot, "evals", "evals.json"), "utf8")) as EvalManifest;
  const evalCases = manifest.evals.filter((evalCase) => !options.evalIds || options.evalIds.has(evalCase.id));

  const benchmarkRows: Array<{
    eval_id: number;
    eval_name: string;
    with_skill: RunSummary | null;
    without_skill: RunSummary | null;
    delta: number | null;
  }> = [];

  for (const evalCase of evalCases) {
    const evalDir = join(options.workspace, `eval-${evalCase.id}-${slugify(evalCase.name ?? `eval-${evalCase.id}`)}`);
    const runSummaries = new Map<string, RunSummary>();

    for (const configName of ["with_skill", "without_skill"] as const) {
      const runDir = join(evalDir, configName);
      const finalPath = join(runDir, "outputs", "final.md");
      if (!existsSync(finalPath)) {
        continue;
      }

      const text = readFileSync(finalPath, "utf8");
      const expectations = gradeRun(evalCase, text);
      const passed = expectations.filter((item) => item.passed).length;
      const total = expectations.length;
      const passRate = total === 0 ? 0 : passed / total;

      const runMetadataPath = join(runDir, "run.json");
      const runMetadata = existsSync(runMetadataPath)
        ? (JSON.parse(readFileSync(runMetadataPath, "utf8")) as { tokens?: { total?: number } })
        : {};

      writeJson(join(runDir, "grading.json"), {
        expectations,
        summary: {
          passed,
          failed: total - passed,
          total,
          pass_rate: Number(passRate.toFixed(4)),
        },
      });

      runSummaries.set(configName, {
        label: configName,
        passRate,
        total,
        passed,
        tokens: runMetadata.tokens?.total ?? null,
      });
    }

    const withSkill = runSummaries.get("with_skill") ?? null;
    const withoutSkill = runSummaries.get("without_skill") ?? null;
    benchmarkRows.push({
      eval_id: evalCase.id,
      eval_name: evalCase.name ?? `eval-${evalCase.id}`,
      with_skill: withSkill,
      without_skill: withoutSkill,
      delta: withSkill && withoutSkill ? Number((withSkill.passRate - withoutSkill.passRate).toFixed(4)) : null,
    });
  }

  const comparableRows = benchmarkRows.filter((row) => row.with_skill && row.without_skill);
  const wins = comparableRows.filter((row) => row.delta !== null && row.delta > 0).length;

  const average = (selector: (row: typeof benchmarkRows[number]) => number | null): number | null => {
    const values = comparableRows.map(selector).filter((value): value is number => value !== null);
    if (values.length === 0) return null;
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
  };

  writeJson(join(options.workspace, "benchmark.json"), {
    skill_name: manifest.skill_name,
    generated_at: new Date().toISOString(),
    rows: benchmarkRows,
    summary: {
      comparable_evals: comparableRows.length,
      with_skill_average_pass_rate: average((row) => row.with_skill?.passRate ?? null),
      without_skill_average_pass_rate: average((row) => row.without_skill?.passRate ?? null),
      with_skill_wins: wins,
    },
  });

  const markdown = [
    `# ${manifest.skill_name} Benchmark`,
    "",
    "| Eval | With Skill | Baseline | Delta |",
    "| --- | --- | --- | --- |",
    ...benchmarkRows.map((row) => {
      const withSkill = row.with_skill ? `${Math.round(row.with_skill.passRate * 100)}% (${row.with_skill.passed}/${row.with_skill.total})` : "n/a";
      const withoutSkill = row.without_skill ? `${Math.round(row.without_skill.passRate * 100)}% (${row.without_skill.passed}/${row.without_skill.total})` : "n/a";
      const delta = row.delta === null ? "n/a" : `${row.delta > 0 ? "+" : ""}${(row.delta * 100).toFixed(0)}%`;
      return `| ${row.eval_name} | ${withSkill} | ${withoutSkill} | ${delta} |`;
    }),
    "",
    `- comparable evals: ${comparableRows.length}`,
    `- with-skill wins: ${wins}`,
  ].join("\n");

  writeFileSync(join(options.workspace, "benchmark.md"), `${markdown}\n`, "utf8");
  process.stdout.write(`Graded ${benchmarkRows.length} eval(s) in ${options.workspace}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
