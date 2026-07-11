#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expandHomePath, GLOBAL_DOC_FILES, projectionSnapshotPath } from "./lib/layout.ts";
import { buildProjectionSpec, loadSkillsManifest } from "./lib/projections.ts";

const repoRoot = resolve(import.meta.dir, "..");
const manifest = loadSkillsManifest(repoRoot);
const projectionSpec = buildProjectionSpec(manifest);
const errors: string[] = [];

function readText(relativePath: string): string {
  const absolutePath = resolve(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function expectFile(relativePath: string): void {
  if (!existsSync(resolve(repoRoot, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function hasDocImport(text: string, file: string, docPath: string): boolean {
  return [`@docs/${file}`, `@${docPath}`, `@${expandHomePath(docPath)}`].some((importLine) => text.includes(importLine));
}

for (const relativePath of [
  "AGENTS.md",
  "CLAUDE.md",
  "_shared/global/AGENTS.md",
  "_shared/global/CLAUDE.md",
  "_shared/global/GEMINI.md",
  "_shared/cursor/user-rules.md",
  "_shared/repo/skills-repo.md",
  "_shared/opencode/opencode.json",
]) {
  expectFile(relativePath);
}

for (const file of GLOBAL_DOC_FILES) {
  expectFile(`_shared/global/docs/${file}`);
}

for (const file of ["planner.md", "researcher.md", "reviewer.md"]) {
  expectFile(`_shared/opencode/agents/${file}`);
}

const rootAgents = readText("AGENTS.md");
if (!rootAgents.includes("_shared/repo/skills-repo.md")) {
  errors.push("Root AGENTS.md must point to _shared/repo/skills-repo.md.");
}

const rootClaude = readText("CLAUDE.md");
if (!rootClaude.includes("@_shared/repo/skills-repo.md")) {
  errors.push("Root CLAUDE.md must import @_shared/repo/skills-repo.md.");
}

const globalAgents = readText("_shared/global/AGENTS.md");
for (const docPath of projectionSpec.shared.global_docs) {
  if (!globalAgents.includes(docPath)) {
    errors.push(`_shared/global/AGENTS.md must reference ${docPath}`);
  }
}
for (const forbidden of ["_shared/repo/skills-repo.md", "GLOBAL_SKILL_AUDIT", "JAVA_SPRING_PERSISTENCE_AUDIT_DELTA"]) {
  if (globalAgents.includes(forbidden)) {
    errors.push(`_shared/global/AGENTS.md must stay cross-repo and not mention ${forbidden}`);
  }
}

const globalClaude = readText("_shared/global/CLAUDE.md");
for (const [index, file] of GLOBAL_DOC_FILES.entries()) {
  const docPath = projectionSpec.shared.global_docs[index] ?? "";
  if (!hasDocImport(globalClaude, file, docPath)) {
    errors.push(`_shared/global/CLAUDE.md must import ${file}.`);
  }
}
for (const forbidden of ["skills-repo.md", "GLOBAL_SKILL_AUDIT", "JAVA_SPRING_PERSISTENCE_AUDIT_DELTA"]) {
  if (globalClaude.includes(forbidden)) {
    errors.push(`_shared/global/CLAUDE.md must stay cross-repo and not mention ${forbidden}`);
  }
}

const globalGemini = readText("_shared/global/GEMINI.md");
for (const [index, file] of GLOBAL_DOC_FILES.entries()) {
  const docPath = projectionSpec.shared.global_docs[index] ?? "";
  if (!hasDocImport(globalGemini, file, docPath)) {
    errors.push(`_shared/global/GEMINI.md must import ${file}.`);
  }
}
for (const forbidden of ["skills-repo.md", "GLOBAL_SKILL_AUDIT", "JAVA_SPRING_PERSISTENCE_AUDIT_DELTA"]) {
  if (globalGemini.includes(forbidden)) {
    errors.push(`_shared/global/GEMINI.md must stay cross-repo and not mention ${forbidden}`);
  }
}

const cursorUserRules = readText("_shared/cursor/user-rules.md");
for (const docPath of projectionSpec.shared.global_docs) {
  if (!cursorUserRules.includes(docPath)) {
    errors.push(`_shared/cursor/user-rules.md must reference ${docPath}`);
  }
}
if (!cursorUserRules.includes("~/.agents/skills")) {
  errors.push("_shared/cursor/user-rules.md must mention the canonical skills root ~/.agents/skills.");
}

const opencodeConfigText = readText("_shared/opencode/opencode.json");
const opencodeConfig = (opencodeConfigText
  ? JSON.parse(opencodeConfigText)
  : {}) as {
  instructions?: string[];
};

if (!Array.isArray(opencodeConfig.instructions)) {
  errors.push("_shared/opencode/opencode.json must declare an instructions array.");
} else if (JSON.stringify(opencodeConfig.instructions) !== JSON.stringify(projectionSpec.projections.opencode.instructions)) {
  errors.push("_shared/opencode/opencode.json instructions must match the projection spec.");
}

const snapshotPath = projectionSnapshotPath(repoRoot);
if (!existsSync(snapshotPath)) {
  errors.push(`Missing projection snapshot: ${snapshotPath.replace(`${repoRoot}/`, "")}`);
} else {
  const expected = `${JSON.stringify(projectionSpec, null, 2)}\n`;
  const actual = readFileSync(snapshotPath, "utf8");
  if (actual !== expected) {
    errors.push("Projection snapshot is out of date. Run `bun scripts/render-agent-projections.ts --write`.");
  }
}

if (errors.length > 0) {
  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Agent context files OK\n");
