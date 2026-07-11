#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { projectionSnapshotPath } from "./lib/layout.ts";
import { buildProjectionSpec, loadSkillsManifest } from "./lib/projections.ts";

type CliOptions = {
  check: boolean;
  write: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  return {
    check: argv.includes("--check"),
    write: argv.includes("--write"),
  };
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = resolve(import.meta.dir, "..");
  const snapshotPath = projectionSnapshotPath(repoRoot);
  const manifest = loadSkillsManifest(repoRoot);
  const rendered = `${JSON.stringify(buildProjectionSpec(manifest), null, 2)}\n`;

  if (options.write) {
    mkdirSync(dirname(snapshotPath), { recursive: true });
    writeFileSync(snapshotPath, rendered, "utf8");
  }

  if (options.check) {
    if (!existsSync(snapshotPath)) {
      throw new Error(`Projection snapshot not found: ${snapshotPath}`);
    }
    const existing = readFileSync(snapshotPath, "utf8");
    if (existing !== rendered) {
      throw new Error("Projection snapshot is out of date. Run `bun scripts/render-agent-projections.ts --write`.");
    }
    process.stdout.write("Projection snapshot OK\n");
    return;
  }

  process.stdout.write(rendered);
}

main();
