#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { skillWorkspaceDir, waveGroupPath } from "../../scripts/lib/layout.ts";

function value(name: string): string | undefined {
  const inline = process.argv.find((item) => item.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function run(command: string[], timeout: number): void {
  const result = spawnSync(command[0], command.slice(1), { cwd: root, env: process.env, encoding: "utf8", timeout, maxBuffer: 10 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command[0]} failed`);
  if (result.stdout) process.stdout.write(result.stdout);
}

const root = resolve(import.meta.dir, "../..");
const wave = value("--wave");
const model = value("--model") ?? "opencode/nemotron-3-ultra-free";
const timeoutMs = Number(value("--timeout-ms") ?? "180000");
const skipOutcomes = process.argv.includes("--skip-skill-evals");
if (!wave) throw new Error("--wave is required");

const groupPath = waveGroupPath(root, wave);
if (!existsSync(groupPath)) throw new Error(`Wave group not found: ${groupPath}`);
const group = JSON.parse(readFileSync(groupPath, "utf8")) as { wave: string; skills: string[] };

if (!skipOutcomes) {
  for (const skill of group.skills) {
    const workspace = skillWorkspaceDir(root, skill);
    run(["bun", join(import.meta.dir, "run_opencode_skill_evals.ts"), "--skill-root", join(root, skill), "--workspace", workspace, "--model", model, "--timeout-ms", String(timeoutMs)], Math.max(timeoutMs * 8, 240000));
    run(["bun", join(import.meta.dir, "grade_opencode_skill_evals.ts"), "--skill-root", join(root, skill), "--workspace", workspace], 120000);
    run(["bun", join(import.meta.dir, "cleanup_compact_benchmark_workspace.ts"), "--workspace", workspace], 120000);
  }
}

run(["bun", join(import.meta.dir, "aggregate_wave_benchmarks.ts"), "--wave", group.wave], 120000);
process.stdout.write(`Completed ${group.wave} outcome benchmarks with ${model}.\n`);
