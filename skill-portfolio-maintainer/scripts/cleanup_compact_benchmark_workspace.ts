#!/usr/bin/env bun

import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

type CliOptions = {
  workspace: string;
  help: boolean;
};

const HELP_TEXT = `Usage:
  bun scripts/cleanup_compact_benchmark_workspace.ts --workspace <path>

Options:
  --workspace <path>  Benchmark workspace to compact
  --help              Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return { workspace: "", help: true };
  }

  let workspace = "";
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--workspace" || arg.startsWith("--workspace=")) {
      workspace = resolve(arg.includes("=") ? arg.slice("--workspace=".length) : argv[++index] ?? "");
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!workspace) {
    throw new Error("--workspace is required");
  }

  return { workspace, help: false };
}

function removeIfExists(target: string): boolean {
  if (!existsSync(target)) return false;
  rmSync(target, { recursive: true, force: true });
  return true;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const removed: string[] = [];
  for (const name of readdirSync(options.workspace)) {
    if (!name.startsWith("eval-")) continue;
    const target = join(options.workspace, name);
    if (removeIfExists(target)) removed.push(name);
  }

  for (const extra of ["AGENTS.md", "eval-set.json", "results.json", "runs"]) {
    const target = join(options.workspace, extra);
    if (removeIfExists(target)) removed.push(extra);
  }

  process.stdout.write(`Compacted ${options.workspace}\n`);
  if (removed.length > 0) {
    process.stdout.write(`Removed: ${removed.join(", ")}\n`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
