#!/usr/bin/env bun

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { homedir } from "node:os";

type Skill = { name: string; status: "core" | "merge" | "archive" | "retire"; storage_path: string };
type Manifest = { skills: Skill[] };
type Issue = { kind: "shadow" | "broken" | "divergent" | "config"; path: string; detail: string };

const repoRoot = resolve(import.meta.dir, "..");
const manifest = JSON.parse(readFileSync(join(repoRoot, "skills.json"), "utf8")) as Manifest;
const home = homedir();
const core = new Map(
  manifest.skills.filter((skill) => skill.status === "core").map((skill) => [skill.name, join(repoRoot, skill.storage_path)]),
);
const managedNames = new Set([...manifest.skills.map((skill) => skill.name), "skill-creator"]);
const removeOnlyRoots = [join(home, ".codex/skills"), join(home, ".config/opencode/skills")];
const compatibilityRoots = [join(home, ".claude/skills"), join(home, ".gemini/antigravity/skills")];
const opencodeConfig = join(home, ".config/opencode/opencode.json");
const repoInstructions = [
  "coding-principles.md",
  "task-execution.md",
  "testing-and-verification.md",
  "repo-discovery.md",
  "skill-routing.md",
].map((file) => `~/.agents/skills/_shared/global/docs/${file}`);

function isManagedEntry(name: string): boolean {
  if (managedNames.has(name)) return true;
  return [...managedNames].some((managed) => name.startsWith(`${managed}.bak-`));
}

function lexists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function entries(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root).filter(isManagedEntry).map((name) => join(root, name));
}

function targetOf(path: string): string | null {
  try {
    if (!lstatSync(path).isSymbolicLink()) return null;
    return resolve(dirname(path), readlinkSync(path));
  } catch {
    return null;
  }
}

function auditConfig(): Issue[] {
  if (!existsSync(opencodeConfig)) return [{ kind: "config", path: opencodeConfig, detail: "missing OpenCode config" }];
  const config = JSON.parse(readFileSync(opencodeConfig, "utf8")) as { instructions?: unknown };
  const instructions = Array.isArray(config.instructions) ? config.instructions : [];
  const missing = repoInstructions.filter((item) => !instructions.includes(item));
  return missing.length ? [{ kind: "config", path: opencodeConfig, detail: `missing instructions: ${missing.join(", ")}` }] : [];
}

function audit(): Issue[] {
  const issues: Issue[] = [];

  for (const root of removeOnlyRoots) {
    for (const path of entries(root)) {
      issues.push({ kind: "shadow", path, detail: "repo-owned skill shadows canonical ~/.agents/skills" });
    }
  }

  for (const root of compatibilityRoots) {
    for (const path of entries(root)) {
      const name = path.split("/").pop()!;
      const expected = core.get(name);
      if (!expected) {
        issues.push({ kind: "shadow", path, detail: "archived, retired, backup, or legacy skill remains discoverable" });
        continue;
      }
      const target = targetOf(path);
      if (!target) {
        issues.push({ kind: "divergent", path, detail: "same-name entry is not a compatibility symlink" });
      } else if (!existsSync(path)) {
        issues.push({ kind: "broken", path, detail: `broken link to ${target}` });
      } else if (realpathSync(path) !== realpathSync(expected)) {
        issues.push({ kind: "divergent", path, detail: `points to ${target}, expected ${expected}` });
      }
    }

    for (const [name] of core) {
      const path = join(root, name);
      if (!lexists(path)) issues.push({ kind: "broken", path, detail: "missing compatibility link" });
    }
  }

  return [...issues, ...auditConfig()];
}

function timestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function backupPathFor(path: string, backupRoot: string): string {
  return join(backupRoot, relative(home, path));
}

function moveToBackup(path: string, backupRoot: string, moved: Array<{ source: string; backup: string }>): void {
  if (!lexists(path)) return;
  const destination = backupPathFor(path, backupRoot);
  mkdirSync(dirname(destination), { recursive: true });
  try {
    renameSync(path, destination);
  } catch {
    cpSync(path, destination, { recursive: true, dereference: false });
    throw new Error(`Could not atomically move ${path}; copied to ${destination} but left source untouched.`);
  }
  moved.push({ source: path, backup: destination });
}

function mergeOpenCodeConfig(backupRoot: string, moved: Array<{ source: string; backup: string }>): void {
  mkdirSync(dirname(opencodeConfig), { recursive: true });
  const config = existsSync(opencodeConfig)
    ? (JSON.parse(readFileSync(opencodeConfig, "utf8")) as Record<string, unknown>)
    : { $schema: "https://opencode.ai/config.json" };
  const current = Array.isArray(config.instructions) ? (config.instructions as string[]) : [];
  const retained = current.filter((item) => !item.startsWith("~/.agents/skills/_shared/global/docs/"));
  const next = { ...config, instructions: [...retained, ...repoInstructions] };
  const rendered = `${JSON.stringify(next, null, 2)}\n`;
  if (existsSync(opencodeConfig) && readFileSync(opencodeConfig, "utf8") === rendered) return;
  moveToBackup(opencodeConfig, backupRoot, moved);
  writeFileSync(opencodeConfig, rendered, "utf8");
}

function apply(): string {
  const backupRoot = join(home, ".agents/skills-runtime-backup", timestamp());
  const moved: Array<{ source: string; backup: string }> = [];

  for (const root of removeOnlyRoots) {
    for (const path of entries(root)) moveToBackup(path, backupRoot, moved);
  }

  for (const root of compatibilityRoots) {
    mkdirSync(root, { recursive: true });
    for (const path of entries(root)) moveToBackup(path, backupRoot, moved);
    for (const [name, target] of core) symlinkSync(target, join(root, name));
  }

  mergeOpenCodeConfig(backupRoot, moved);
  mkdirSync(backupRoot, { recursive: true });
  writeFileSync(join(backupRoot, "manifest.json"), `${JSON.stringify({ created_at: new Date().toISOString(), moved }, null, 2)}\n`);
  return backupRoot;
}

const shouldApply = process.argv.includes("--apply");
const shouldCheck = process.argv.includes("--check") || !shouldApply;
let backupRoot: string | null = null;

if (shouldApply) backupRoot = apply();
if (shouldCheck || shouldApply) {
  const issues = audit();
  if (issues.length) {
    for (const issue of issues) process.stderr.write(`${issue.kind}\t${issue.path}\t${issue.detail}\n`);
    process.exit(1);
  }
}

process.stdout.write(`Agent projections OK${backupRoot ? `; backup=${backupRoot}` : ""}\n`);
