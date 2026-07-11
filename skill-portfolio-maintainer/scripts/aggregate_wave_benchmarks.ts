#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { skillWorkspaceDir, waveBenchmarksDir, waveGroupPath } from "../../scripts/lib/layout.ts";

type Benchmark = {
  rows: Array<{ with_skill: { passRate: number } | null; without_skill: { passRate: number } | null; delta: number | null }>;
};

function arg(name: string): string | undefined {
  const inline = process.argv.find((item) => item.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function average(values: number[]): number | null {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4)) : null;
}

const root = resolve(import.meta.dir, "../..");
const wave = arg("--wave");
if (!wave) throw new Error("--wave is required");
const outputDir = resolve(arg("--output-dir") ?? waveBenchmarksDir(root));
const group = JSON.parse(readFileSync(waveGroupPath(root, wave), "utf8")) as { wave: string; skills: string[] };

const skills = group.skills.map((skill) => {
  const path = join(skillWorkspaceDir(root, skill), "benchmark.json");
  if (!existsSync(path)) throw new Error(`Missing compact benchmark: ${path}`);
  const benchmark = JSON.parse(readFileSync(path, "utf8")) as Benchmark;
  const withSkill = benchmark.rows.flatMap((row) => row.with_skill ? [row.with_skill.passRate] : []);
  const baseline = benchmark.rows.flatMap((row) => row.without_skill ? [row.without_skill.passRate] : []);
  const withAverage = average(withSkill);
  const baselineAverage = average(baseline);
  const gainCases = benchmark.rows.filter((row) => row.delta !== null && row.delta > 0).length;
  return {
    skill,
    evals: benchmark.rows.length,
    with_skill_average_pass_rate: withAverage,
    baseline_average_pass_rate: baselineAverage,
    gain_cases: gainCases,
    passes_threshold: (withAverage ?? 0) >= 0.8 && (baselineAverage === null || (withAverage ?? 0) >= baselineAverage) && gainCases >= 1,
  };
});

const summary = {
  wave: group.wave,
  generated_at: new Date().toISOString(),
  skills,
  with_skill_average_pass_rate: average(skills.flatMap((item) => item.with_skill_average_pass_rate === null ? [] : [item.with_skill_average_pass_rate])),
  baseline_average_pass_rate: average(skills.flatMap((item) => item.baseline_average_pass_rate === null ? [] : [item.baseline_average_pass_rate])),
  passing_skills: skills.filter((item) => item.passes_threshold).length,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, `${wave}.json`), `${JSON.stringify(summary, null, 2)}\n`);
const pct = (value: number | null) => value === null ? "n/a" : `${Math.round(value * 100)}%`;
const markdown = [
  `# ${wave} Outcome Benchmark`, "",
  "| Skill | With skill | Baseline | Gain cases | Status |",
  "| --- | ---: | ---: | ---: | --- |",
  ...skills.map((item) => `| ${item.skill} | ${pct(item.with_skill_average_pass_rate)} | ${pct(item.baseline_average_pass_rate)} | ${item.gain_cases} | ${item.passes_threshold ? "pass" : "needs-work"} |`),
  "", `- portfolio with-skill average: ${pct(summary.with_skill_average_pass_rate)}`,
  `- portfolio baseline average: ${pct(summary.baseline_average_pass_rate)}`,
  `- passing skills: ${summary.passing_skills}/${skills.length}`,
];
writeFileSync(join(outputDir, `${wave}.md`), `${markdown.join("\n")}\n`);
process.stdout.write(`Aggregated ${skills.length} outcome benchmarks for ${wave}.\n`);
