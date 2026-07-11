#!/usr/bin/env bun

import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

type Skill = { name: string; status: string; storage_path: string; eval_suite: string | null };
type TriggerCase = { id: string; kind: "positive" | "boundary" | "null"; expected_skill: string | null; prompt: string; pair?: string };

const root = resolve(import.meta.dir, "..");
const manifest = JSON.parse(readFileSync(join(root, "skills.json"), "utf8")) as { skills: Skill[] };
const suite = JSON.parse(readFileSync(join(root, "_benchmarks/benchmark-groups/portfolio-trigger-cases.json"), "utf8")) as { schema_version: number; cases: TriggerCase[] };
const core = manifest.skills.filter((skill) => skill.status === "core");
const coreNames = new Set(core.map((skill) => skill.name));
const errors: string[] = [];

if (suite.schema_version !== 1) errors.push("Trigger suite must use schema_version 1.");
if (suite.cases.length !== 100) errors.push(`Trigger suite must contain 100 cases (found ${suite.cases.length}).`);
if (new Set(suite.cases.map((item) => item.id)).size !== suite.cases.length) errors.push("Trigger case ids must be unique.");

const kinds = { positive: 0, boundary: 0, null: 0 };
for (const testCase of suite.cases) {
  kinds[testCase.kind] += 1;
  if (!testCase.prompt.trim()) errors.push(`${testCase.id} has an empty prompt.`);
  if (testCase.expected_skill !== null && !coreNames.has(testCase.expected_skill)) errors.push(`${testCase.id} expects a non-core skill: ${testCase.expected_skill}.`);
  if (testCase.kind === "null" && testCase.expected_skill !== null) errors.push(`${testCase.id} null case must expect no skill.`);
}
if (kinds.positive !== 64 || kinds.boundary !== 24 || kinds.null !== 12) errors.push(`Expected 64 positive, 24 boundary, and 12 null cases; found ${JSON.stringify(kinds)}.`);

for (const skill of core) {
  const positives = suite.cases.filter((item) => item.kind === "positive" && item.expected_skill === skill.name);
  if (positives.length !== 4) errors.push(`${skill.name} must have exactly 4 central positive cases (found ${positives.length}).`);
  if (!positives.some((item) => /[\u3400-\u9fff]/u.test(item.prompt))) errors.push(`${skill.name} needs at least one Traditional Chinese positive case.`);
  if (!skill.eval_suite) {
    errors.push(`${skill.name} must declare an outcome eval suite.`);
    continue;
  }
  const outcome = JSON.parse(readFileSync(join(root, skill.storage_path, skill.eval_suite), "utf8")) as { evals: Array<{ id: number; prompt: string; expectations: string[] }> };
  if (outcome.evals.length < 3) errors.push(`${skill.name} must have at least 3 concrete outcome evals.`);
  for (const item of outcome.evals) {
    if (item.prompt.includes("Selected:") || item.expectations.some((expectation) => expectation.includes("Selected:"))) errors.push(`${skill.name} outcome eval ${item.id} uses retired Selected: scaffolding.`);
    if (item.expectations.length < 2) errors.push(`${skill.name} outcome eval ${item.id} needs at least 2 outcome expectations.`);
  }
}

const pairs = new Map<string, number>();
for (const testCase of suite.cases.filter((item) => item.kind === "boundary")) {
  if (!testCase.pair) errors.push(`${testCase.id} boundary case is missing pair.`);
  else pairs.set(testCase.pair, (pairs.get(testCase.pair) ?? 0) + 1);
}
if (pairs.size !== 12 || [...pairs.values()].some((count) => count !== 2)) errors.push("Boundary suite must contain 12 named pairs with 2 directions each.");

for (const retiredName of ["brainstorming", "bun-ts-scripting-policy", "ppt-generation", "skill-creator"]) {
  if (suite.cases.some((item) => item.expected_skill === retiredName)) errors.push(`Archived/legacy skill appears as an expected trigger: ${retiredName}.`);
}

function scanRetainedArtifacts(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "runs" || entry.name === "project" || entry.name.startsWith("eval-")) errors.push(`Raw benchmark directory retained: ${path}`);
      else scanRetainedArtifacts(path);
    } else if (["results.json", "stderr.log", "raw.jsonl", "codex.jsonl"].includes(entry.name)) {
      errors.push(`Raw benchmark file retained: ${path}`);
    }
  }
}

scanRetainedArtifacts(join(root, "_benchmarks"));

if (errors.length) {
  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Trigger and outcome suite schemas OK (64 positive, 24 boundary, 12 null).\n");
