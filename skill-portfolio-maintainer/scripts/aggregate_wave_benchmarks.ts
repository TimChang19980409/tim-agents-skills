#!/usr/bin/env bun

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { skillWorkspaceDir, triggerRegressionSummaryPath, waveBenchmarksDir, waveGroupPath } from "../../scripts/lib/layout.ts";

type WaveGroup = {
  wave: string;
  skills: string[];
  trigger_regressions?: Array<{
    file: string;
    skill?: string;
  }>;
};

type BenchmarkRow = {
  eval_id: number;
  eval_name: string;
  with_skill: {
    passRate: number;
    total: number;
    passed: number;
    selectedExpectation?: {
      text: string;
      passed: boolean;
    } | null;
  } | null;
  without_skill: {
    passRate: number;
    total: number;
    passed: number;
    selectedExpectation?: {
      text: string;
      passed: boolean;
    } | null;
  } | null;
  delta: number | null;
};

type BenchmarkJson = {
  skill_name: string;
  rows: BenchmarkRow[];
  summary: {
    comparable_evals: number;
    with_skill_average_pass_rate: number | null;
    without_skill_average_pass_rate: number | null;
    with_skill_wins: number;
    selected_pass_count?: number | null;
    selected_total?: number | null;
    selected_pass_rate?: number | null;
  };
};

type EvalMetadata = {
  eval_id: number;
  eval_name: string;
  assertions: string[];
};

type GradingJson = {
  expectations: Array<{
    text: string;
    passed: boolean;
  }>;
};

type TriggerRegressionSummary = {
  queries: number;
  passed: number;
  pass_rate: number;
  by_file: Array<{
    file: string;
    queries: number;
    passed: number;
    pass_rate: number;
  }>;
} | null;

type CliOptions = {
  wave: string;
  outputDir: string;
  help: boolean;
};

const HELP_TEXT = `Usage:
  bun scripts/aggregate_wave_benchmarks.ts --wave <wave-id> [--output-dir <path>]

Options:
  --wave <id>         Wave id, for example wave-1
  --output-dir <dir>  Output directory (default: <repo>/_benchmarks/wave-benchmarks)
  --help              Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return { wave: "", outputDir: "", help: true };
  }

  let wave = "";
  let outputDir = waveBenchmarksDir(resolve(import.meta.dir, "..", ".."));

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--wave" || arg.startsWith("--wave=")) {
      wave = arg.includes("=") ? arg.slice("--wave=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--output-dir" || arg.startsWith("--output-dir=")) {
      outputDir = resolve(arg.includes("=") ? arg.slice("--output-dir=".length) : argv[++index] ?? "");
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!wave) {
    throw new Error("--wave is required");
  }

  return { wave, outputDir, help: false };
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

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
}

function loadSelectedPasses(workspace: string, benchmark: BenchmarkJson): {
  selected_pass_rate: number | null;
  selected_pass_count: number;
  selected_total: number;
} {
  if (typeof benchmark.summary.selected_total === "number" && benchmark.summary.selected_total > 0) {
    return {
      selected_pass_rate: benchmark.summary.selected_pass_rate ?? null,
      selected_pass_count: benchmark.summary.selected_pass_count ?? 0,
      selected_total: benchmark.summary.selected_total,
    };
  }

  let selectedPassCount = 0;
  let selectedTotal = 0;

  for (const row of benchmark.rows) {
    const selectedExpectation = row.with_skill?.selectedExpectation ?? null;
    if (!selectedExpectation) continue;
    selectedTotal += 1;
    if (selectedExpectation.passed) {
      selectedPassCount += 1;
    }
  }

  if (selectedTotal > 0) {
    return {
      selected_pass_rate: Number((selectedPassCount / selectedTotal).toFixed(4)),
      selected_pass_count: selectedPassCount,
      selected_total: selectedTotal,
    };
  }

  selectedPassCount = 0;
  selectedTotal = 0;

  for (const row of benchmark.rows) {
    const evalDir = join(workspace, `eval-${row.eval_id}-${slugify(row.eval_name)}`);
    const metadataPath = join(evalDir, "eval_metadata.json");
    const gradingPath = join(evalDir, "with_skill", "grading.json");
    if (!existsSync(metadataPath) || !existsSync(gradingPath)) continue;

    const metadata = JSON.parse(readFileSync(metadataPath, "utf8")) as EvalMetadata;
    if (!Array.isArray(metadata.assertions) || metadata.assertions.length === 0) continue;
    const firstAssertion = metadata.assertions[0] ?? "";
    if (!firstAssertion.startsWith("contains:Selected:") && !firstAssertion.startsWith("containsAny:Selected:")) {
      continue;
    }

    const grading = JSON.parse(readFileSync(gradingPath, "utf8")) as GradingJson;
    const firstExpectation = grading.expectations[0];
    selectedTotal += 1;
    if (firstExpectation?.passed) {
      selectedPassCount += 1;
    }
  }

  return {
    selected_pass_rate: selectedTotal === 0 ? null : Number((selectedPassCount / selectedTotal).toFixed(4)),
    selected_pass_count: selectedPassCount,
    selected_total: selectedTotal,
  };
}

function loadTriggerRegressionSummary(root: string, wave: string): TriggerRegressionSummary {
  const triggerPath = triggerRegressionSummaryPath(root, wave);
  if (!existsSync(triggerPath)) {
    return null;
  }

  const value = JSON.parse(readFileSync(triggerPath, "utf8")) as TriggerRegressionSummary;
  return value;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const root = resolve(import.meta.dir, "..", "..");
  const groupPath = waveGroupPath(root, options.wave);
  if (!existsSync(groupPath)) {
    throw new Error(`Wave group not found: ${groupPath}`);
  }

  const group = JSON.parse(readFileSync(groupPath, "utf8")) as WaveGroup;
  mkdirSync(options.outputDir, { recursive: true });

  const skillRows = group.skills.map((skillName) => {
    const workspace = skillWorkspaceDir(root, skillName);
    const benchmarkPath = join(workspace, "benchmark.json");
    if (!existsSync(benchmarkPath)) {
      throw new Error(`Missing benchmark.json for ${skillName}: ${benchmarkPath}`);
    }

    const benchmark = JSON.parse(readFileSync(benchmarkPath, "utf8")) as BenchmarkJson;
    const withSkillValues = benchmark.rows
      .map((row) => row.with_skill?.passRate ?? null)
      .filter((value): value is number => value !== null);
    const withoutSkillValues = benchmark.rows
      .map((row) => row.without_skill?.passRate ?? null)
      .filter((value): value is number => value !== null);
    const atLeastSeventyFive = withSkillValues.filter((value) => value >= 0.75).length;
    const selected = loadSelectedPasses(workspace, benchmark);

    return {
      skill: skillName,
      workspace,
      comparable_evals: benchmark.summary.comparable_evals,
      with_skill_average_pass_rate: average(withSkillValues),
      without_skill_average_pass_rate: average(withoutSkillValues),
      with_skill_wins: benchmark.summary.with_skill_wins,
      evals_at_or_above_75: atLeastSeventyFive,
      total_evals: benchmark.rows.length,
      selected_pass_rate: selected.selected_pass_rate,
      selected_pass_count: selected.selected_pass_count,
      selected_total: selected.selected_total,
      passes_threshold:
        (average(withSkillValues) ?? 0) >= 0.85 &&
        atLeastSeventyFive >= Math.max(0, benchmark.rows.length - 1) &&
        (selected.selected_total === 0 || selected.selected_pass_count === selected.selected_total),
    };
  });

  const allWithSkill = skillRows
    .map((row) => row.with_skill_average_pass_rate)
    .filter((value): value is number => value !== null);
  const allWithoutSkill = skillRows
    .map((row) => row.without_skill_average_pass_rate)
    .filter((value): value is number => value !== null);
  const triggerSummary = loadTriggerRegressionSummary(root, options.wave);

  const summary = {
    wave: group.wave,
    generated_at: new Date().toISOString(),
    skills: skillRows,
    summary: {
      skill_count: skillRows.length,
      passing_skills: skillRows.filter((row) => row.passes_threshold).length,
      all_skills_green: skillRows.every((row) => row.passes_threshold),
      with_skill_average_pass_rate: average(allWithSkill),
      without_skill_average_pass_rate: average(allWithoutSkill),
      trigger_regressions: triggerSummary,
    },
  };

  writeJson(join(options.outputDir, `${options.wave}.json`), summary);

  const markdown = [
    `# ${group.wave} Benchmark Summary`,
    "",
    "| Skill | With Skill Avg | Baseline Avg | >=75% Evals | Selected Pass | Status |",
    "| --- | --- | --- | --- | --- | --- |",
    ...skillRows.map((row) => {
      const withSkill = row.with_skill_average_pass_rate === null ? "n/a" : `${Math.round(row.with_skill_average_pass_rate * 100)}%`;
      const withoutSkill = row.without_skill_average_pass_rate === null ? "n/a" : `${Math.round(row.without_skill_average_pass_rate * 100)}%`;
      const selected =
        row.selected_pass_rate === null ? "n/a" : `${row.selected_pass_count}/${row.selected_total} (${Math.round(row.selected_pass_rate * 100)}%)`;
      return `| ${row.skill} | ${withSkill} | ${withoutSkill} | ${row.evals_at_or_above_75}/${row.total_evals} | ${selected} | ${row.passes_threshold ? "green" : "needs-work"} |`;
    }),
    "",
    `- skill count: ${summary.summary.skill_count}`,
    `- passing skills: ${summary.summary.passing_skills}`,
    `- all skills green: ${summary.summary.all_skills_green ? "yes" : "no"}`,
    `- with-skill average: ${summary.summary.with_skill_average_pass_rate === null ? "n/a" : `${Math.round(summary.summary.with_skill_average_pass_rate * 100)}%`}`,
    `- baseline average: ${summary.summary.without_skill_average_pass_rate === null ? "n/a" : `${Math.round(summary.summary.without_skill_average_pass_rate * 100)}%`}`,
  ];

  if (triggerSummary) {
    markdown.push(
      "",
      "## Trigger Regressions",
      "",
      `- queries: ${triggerSummary.queries}`,
      `- passed: ${triggerSummary.passed}`,
      `- pass rate: ${Math.round(triggerSummary.pass_rate * 100)}%`
    );
  }

  writeFileSync(join(options.outputDir, `${options.wave}.md`), `${markdown.join("\n")}\n`, "utf8");
  process.stdout.write(`Aggregated ${group.wave} benchmarks into ${options.outputDir}\n`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
