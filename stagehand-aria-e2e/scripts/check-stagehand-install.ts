#!/usr/bin/env bun
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const cwd = process.cwd();

const packages = [
  "@browserbasehq/stagehand",
  "playwright-core",
  "@playwright/test",
  "dotenv",
  "zod",
  "deepmerge",
];

function major(version: string | null): number | null {
  if (!version) {
    return null;
  }

  const match = version.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function resolveVersion(pkgName: string): { installed: boolean; version: string | null; path: string | null } {
  try {
    const packageJsonPath = require.resolve(`${pkgName}/package.json`, { paths: [cwd] });
    const packageJson = require(packageJsonPath) as { version?: string };
    return {
      installed: true,
      version: packageJson.version ?? null,
      path: dirname(packageJsonPath),
    };
  } catch {
    return { installed: false, version: null, path: null };
  }
}

console.log(`cwd: ${cwd}`);

let missing = 0;
let invalid = 0;
const bunVersion = (globalThis as typeof globalThis & { Bun?: { version?: string } }).Bun?.version ?? null;

if (bunVersion) {
  console.log(`[ok] bun@${bunVersion}`);
} else {
  invalid += 1;
  console.log("[invalid] expected Bun runtime");
}

for (const pkg of packages) {
  const info = resolveVersion(pkg);
  if (!info.installed) {
    missing += 1;
    console.log(`[missing] ${pkg}`);
    continue;
  }

  if (pkg === "@browserbasehq/stagehand") {
    const pkgMajor = major(info.version);
    if (pkgMajor === null || pkgMajor < 3) {
      invalid += 1;
      console.log(`[invalid] ${pkg}@${info.version} (Stagehand v3+ required)`);
      continue;
    }
  }

  console.log(`[ok] ${pkg}@${info.version}`);
}

const lockfiles = ["bun.lock", "package.json"].filter((f) => existsSync(join(cwd, f)));
console.log(`files: ${lockfiles.join(", ") || "none"}`);

if (missing > 0 || invalid > 0) {
  process.exitCode = 1;
}
