#!/usr/bin/env bun

import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { expandHomePath, skillWorkspaceDir, waveBenchmarkSummaryPath, waveGroupPath } from "./lib/layout.ts";
import { buildProjectionSpec, type SkillsManifest } from "./lib/projections.ts";

type SkillStatus = "core" | "merge" | "archive" | "retire";
type SkillRole = "host" | "specialist" | "policy" | "utility" | "extension" | "gate";
type ExecutionMode = "inline" | "manual" | "forked";
type WaveGroup = {
  wave: string;
  skills: string[];
  trigger_regressions?: Array<{
    file: string;
    skill?: string;
  }>;
};

type SkillRecord = {
  name: string;
  family: string;
  status: SkillStatus;
  host: string | null;
  storage_path: string;
  entry_file: "SKILL.md" | "ARCHIVE.md" | "RETIRED.md";
  notes: string;
  vendored_from?: string;
  role: SkillRole | null;
  execution_mode: ExecutionMode | null;
  intent_tags: string[];
  task_playbooks: string[];
  decision_guides: string[];
  archive_extensions: string[];
  delegates_to: string[];
  eval_suite: string | null;
  portability: string;
};

const root = resolve(import.meta.dir, "..");
const manifestPath = join(root, "skills.json");
const EXPECTED_CORE_SKILLS = 17;

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  schema_version?: number;
  framework?: {
    name?: string;
    canonical_root?: string;
    portability?: string;
  };
  projections?: {
    codex?: {
      global_agents?: string;
    };
    claude?: {
      global_memory?: string;
      skill_dir?: string;
    };
    gemini?: {
      global_memory?: string;
    };
    antigravity?: {
      global_memory?: string;
      skill_dir?: string;
    };
    cursor?: {
      user_rules?: string;
    };
    opencode?: {
      global_agents?: string;
      global_agents_dir?: string;
      global_config?: string;
    };
  };
  skills: SkillRecord[];
};

const errors: string[] = [];

const NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9_]+)*$/;

function validateName(name: string): void {
  if (!NAME_REGEX.test(name)) {
    errors.push(`Skill name "${name}" must match kebab-case or backup pattern ^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9_]+)*$`);
  }
}

if (manifest.schema_version !== 4) {
  errors.push(`skills.json must declare schema_version 4 (found: ${manifest.schema_version ?? "missing"})`);
}

if (!manifest.framework?.canonical_root || !manifest.framework.portability) {
  errors.push("skills.json must declare framework.canonical_root and framework.portability.");
}

const hasProjectionConfig =
  Boolean(
    manifest.projections?.codex?.global_agents &&
      manifest.projections?.claude?.global_memory &&
      manifest.projections?.claude?.skill_dir &&
      manifest.projections?.gemini?.global_memory &&
      manifest.projections?.antigravity?.global_memory &&
      manifest.projections?.antigravity?.skill_dir &&
      manifest.projections?.cursor?.user_rules &&
      manifest.projections?.opencode?.global_agents &&
      manifest.projections?.opencode?.global_agents_dir &&
      manifest.projections?.opencode?.global_config
  );

if (
  !manifest.projections?.codex?.global_agents ||
  !manifest.projections?.claude?.global_memory ||
  !manifest.projections?.claude?.skill_dir ||
  !manifest.projections?.gemini?.global_memory ||
  !manifest.projections?.antigravity?.global_memory ||
  !manifest.projections?.antigravity?.skill_dir ||
  !manifest.projections?.cursor?.user_rules ||
  !manifest.projections?.opencode?.global_agents ||
  !manifest.projections?.opencode?.global_agents_dir ||
  !manifest.projections?.opencode?.global_config
) {
  errors.push(
    "skills.json must declare projections.codex.global_agents, projections.claude.{global_memory,skill_dir}, projections.gemini.global_memory, projections.antigravity.{global_memory,skill_dir}, projections.cursor.user_rules, and projections.opencode.{global_agents,global_agents_dir,global_config}."
  );
}

if (!Array.isArray(manifest.skills)) {
  errors.push("skills.json must contain a top-level skills array.");
}

const skills = manifest.skills ?? [];
const allowedStatuses = new Set<SkillStatus>(["core", "merge", "archive", "retire"]);
const allowedRoles = new Set<SkillRole>(["host", "specialist", "policy", "utility", "extension", "gate"]);
const allowedExecutionModes = new Set<ExecutionMode>(["inline", "manual", "forked"]);
const seenNames = new Set<string>();

function readSkillFile(path: string): string {
  return readFileSync(path, "utf8");
}

function lineCount(text: string): number {
  return text.length === 0 ? 0 : text.split(/\r?\n/).length;
}

function parseDescriptionLength(text: string): number | null {
  const singleLine = text.match(/^description:\s*(.+)$/m);
  if (singleLine) {
    return singleLine[1].trim().length;
  }

  const multiLine = text.match(/^description:\s*[>|]-?\s*\n([\s\S]*?)\n(?:[A-Za-z0-9_-]+:|---$)/m);
  if (!multiLine) {
    return null;
  }

  return multiLine[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ").length;
}

function ensureRelativePaths(skill: SkillRecord, absoluteDir: string): void {
  for (const relativePath of [...skill.task_playbooks, ...skill.decision_guides]) {
    if (relativePath.startsWith("/")) {
      errors.push(`${skill.name} must use relative playbook paths: ${relativePath}`);
      continue;
    }
    if (!existsSync(join(absoluteDir, relativePath))) {
      errors.push(`${skill.name} references a missing framework file: ${relativePath}`);
    }
  }

  if (skill.eval_suite) {
    if (skill.eval_suite.startsWith("/")) {
      errors.push(`${skill.name} must use a relative eval_suite path: ${skill.eval_suite}`);
    } else if (!existsSync(join(absoluteDir, skill.eval_suite))) {
      errors.push(`${skill.name} references a missing eval_suite: ${skill.eval_suite}`);
    }
  }
}

function archiveDocHasMetadata(absoluteEntry: string): boolean {
  const text = readSkillFile(absoluteEntry);
  return /- Host owner:\s*`[^`]+`/m.test(text) && /- Load when:\s*\S/m.test(text);
}

function validateWaveWorkspace(skillName: string): void {
  const workspace = skillWorkspaceDir(root, skillName);
  for (const relativePath of ["README.md", "opencode.json", "benchmark.json", "benchmark.md"]) {
    if (!existsSync(join(workspace, relativePath))) {
      errors.push(`${skillName} is missing workspace artifact: _benchmarks/${skillName}-workspace/iteration-1/${relativePath}`);
    }
  }
}

function validateProjectionSymlink(source: string, target: string): void {
  const absoluteSource = expandHomePath(source);

  try {
    const stats = lstatSync(absoluteSource);
    if (stats.isSymbolicLink() && !existsSync(absoluteSource)) {
      errors.push(`Broken projection symlink: ${source} -> ${target}`);
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      errors.push(`Could not inspect projection path ${source}: ${String(error)}`);
    }
  }
}

for (const skill of skills) {
  if (seenNames.has(skill.name)) {
    errors.push(`Duplicate skill name in manifest: ${skill.name}`);
  }
  seenNames.add(skill.name);

  validateName(skill.name);

  if (skill.vendored_from && skill.status === "core") {
    console.warn(`Warning: skill ${skill.name} has vendored_from and status=core — ensure source is maintained: ${skill.vendored_from}`);
  }

  if (!allowedStatuses.has(skill.status)) {
    errors.push(`Invalid status for ${skill.name}: ${skill.status}`);
  }

  if (skill.storage_path.startsWith("/")) {
    errors.push(`storage_path must be relative for ${skill.name}`);
  }

  if (!Array.isArray(skill.intent_tags) || !Array.isArray(skill.task_playbooks) || !Array.isArray(skill.decision_guides)) {
    errors.push(`${skill.name} must use array values for intent_tags, task_playbooks, and decision_guides.`);
  }

  if (!Array.isArray(skill.archive_extensions) || !Array.isArray(skill.delegates_to)) {
    errors.push(`${skill.name} must use array values for archive_extensions and delegates_to.`);
  }

  if (skill.portability !== "portable-first") {
    errors.push(`${skill.name} must currently declare portability as portable-first.`);
  }

  const absoluteDir = join(root, skill.storage_path);
  const absoluteEntry = join(absoluteDir, skill.entry_file);

  if (!existsSync(absoluteDir)) {
    errors.push(`Missing directory for ${skill.name}: ${skill.storage_path}`);
    continue;
  }

  if (!existsSync(absoluteEntry)) {
    errors.push(`Missing entry file for ${skill.name}: ${skill.storage_path}/${skill.entry_file}`);
    continue;
  }

  ensureRelativePaths(skill, absoluteDir);

  if (skill.status === "retire") {
    if (skill.role !== null) {
      errors.push(`Retired skill ${skill.name} must use role=null.`);
    }
    if (skill.execution_mode !== null) {
      errors.push(`Retired skill ${skill.name} must use execution_mode=null.`);
    }
  } else {
    if (!skill.role || !allowedRoles.has(skill.role)) {
      errors.push(`Invalid role for ${skill.name}: ${skill.role ?? "null"}`);
    }
    if (!skill.execution_mode || !allowedExecutionModes.has(skill.execution_mode)) {
      errors.push(`Invalid execution_mode for ${skill.name}: ${skill.execution_mode ?? "null"}`);
    }
  }

  if (skill.status === "core") {
    if (skill.entry_file !== "SKILL.md") {
      errors.push(`Core skill ${skill.name} must use SKILL.md`);
    }
    if (skill.storage_path.includes("/")) {
      errors.push(`Core skill ${skill.name} must stay at the top level`);
    }
    if (lstatSync(absoluteDir).isSymbolicLink()) {
      errors.push(`Core skill ${skill.name} must not be a symlink`);
    }
    if (skill.host !== null) {
      errors.push(`Core skill ${skill.name} must not declare a host`);
    }
    if (skill.role === "extension") {
      errors.push(`Core skill ${skill.name} cannot use extension role.`);
    }
    if (skill.intent_tags.length === 0) {
      errors.push(`Core skill ${skill.name} must declare at least one intent tag.`);
    }

    const skillText = readSkillFile(absoluteEntry);
    const skillLines = lineCount(skillText);
    if (skillLines > 500) {
      errors.push(`Core skill ${skill.name} exceeds the 500-line router budget (${skillLines}).`);
    }

    const descriptionLength = parseDescriptionLength(skillText);
    if (descriptionLength === null) {
      errors.push(`Could not parse description from ${skill.name}/SKILL.md`);
    } else if (descriptionLength > 1024) {
      errors.push(`Description for ${skill.name} exceeds 1024 characters (${descriptionLength}).`);
    }

    if (skill.role === "host" || skill.role === "gate") {
      if (skill.task_playbooks.length === 0) {
        errors.push(`Host skill ${skill.name} must declare task_playbooks.`);
      }
      if (skill.decision_guides.length === 0) {
        errors.push(`Host skill ${skill.name} must declare decision_guides.`);
      }
      if (!skill.eval_suite) {
        errors.push(`Host skill ${skill.name} must declare an eval_suite.`);
      }
    }
  }

  if (skill.status === "merge" || skill.status === "archive") {
    if (!skill.storage_path.startsWith("_archive/")) {
      errors.push(`${skill.status} skill ${skill.name} must live under _archive/`);
    }
    if (skill.entry_file !== "ARCHIVE.md") {
      errors.push(`${skill.status} skill ${skill.name} must use ARCHIVE.md`);
    }
    if (skill.role !== "extension") {
      errors.push(`${skill.status} skill ${skill.name} must use role=extension.`);
    }
    if (skill.execution_mode !== "manual") {
      errors.push(`${skill.status} skill ${skill.name} must use execution_mode=manual.`);
    }
    if (!archiveDocHasMetadata(absoluteEntry)) {
      errors.push(`${skill.name}/ARCHIVE.md must declare Host owner and Load when metadata.`);
    }
  }

  if (skill.status === "retire") {
    if (!skill.storage_path.startsWith("_retired/")) {
      errors.push(`Retired skill ${skill.name} must live under _retired/`);
    }
    if (skill.entry_file !== "RETIRED.md") {
      errors.push(`Retired skill ${skill.name} must use RETIRED.md`);
    }
  }
}

const skillMap = new Map(skills.map((skill) => [skill.name, skill]));
const coreSkills = skills.filter((skill) => skill.status === "core");
const coreNames = new Set(coreSkills.map((skill) => skill.name));

const waveGroupPaths = ["wave-1", "wave-2", "wave-3"].map((wave) => waveGroupPath(root, wave));
const groupedSkills = new Set<string>();

for (const groupPath of waveGroupPaths) {
  if (!existsSync(groupPath)) {
    errors.push(`Missing benchmark group manifest: ${groupPath.replace(`${root}/`, "")}`);
    continue;
  }

  const group = JSON.parse(readFileSync(groupPath, "utf8")) as WaveGroup;
  if (!Array.isArray(group.skills) || group.skills.length === 0) {
    errors.push(`Benchmark group must declare at least one skill: ${groupPath.replace(`${root}/`, "")}`);
    continue;
  }

  for (const skillName of group.skills) {
    groupedSkills.add(skillName);
    const skill = skillMap.get(skillName);
    if (!skill) {
      errors.push(`Benchmark group references unknown skill ${skillName}: ${groupPath.replace(`${root}/`, "")}`);
      continue;
    }
    if (skill.status !== "core") {
      errors.push(`Benchmark group skill ${skillName} must be core: ${groupPath.replace(`${root}/`, "")}`);
      continue;
    }
    if (skill.task_playbooks.length < 4) {
      errors.push(`Benchmark group skill ${skillName} must declare at least 4 task_playbooks.`);
    }
    if (skill.decision_guides.length < 1) {
      errors.push(`Benchmark group skill ${skillName} must declare at least 1 decision guide.`);
    }
    if (!skill.eval_suite) {
      errors.push(`Benchmark group skill ${skillName} must declare an eval_suite.`);
    }
    validateWaveWorkspace(skillName);
  }

  if (group.trigger_regressions) {
    for (const entry of group.trigger_regressions) {
      if (!entry.file || !existsSync(join(root, entry.file))) {
        errors.push(`Missing trigger regression source in ${groupPath.replace(`${root}/`, "")}: ${entry.file ?? "missing file key"}`);
      }
      if (entry.skill && !skillMap.has(entry.skill)) {
        errors.push(`Trigger regression entry references unknown skill ${entry.skill}: ${groupPath.replace(`${root}/`, "")}`);
      }
    }
  }
}

if (coreSkills.length !== EXPECTED_CORE_SKILLS) {
  errors.push(`Expected ${EXPECTED_CORE_SKILLS} core skills, found ${coreSkills.length}`);
}

for (const wave of ["wave-1", "wave-2", "wave-3"]) {
  for (const extension of ["json", "md"]) {
    const summaryPath = waveBenchmarkSummaryPath(root, wave, extension as "json" | "md");
    if (!existsSync(summaryPath)) {
      errors.push(`Missing wave benchmark summary: ${summaryPath.replace(`${root}/`, "")}`);
    }
  }
}

for (const skill of skills.filter((item) => item.status === "merge" || item.status === "archive")) {
  if (!skill.host || !coreNames.has(skill.host)) {
    errors.push(`Extension skill ${skill.name} must point to a valid core host (found: ${skill.host ?? "null"})`);
  }
}

for (const skill of skills.filter((item) => item.status === "core")) {
  for (const delegate of skill.delegates_to) {
    if (!skillMap.has(delegate)) {
      errors.push(`${skill.name} delegates to a missing skill: ${delegate}`);
    }
    if (delegate === skill.name) {
      errors.push(`${skill.name} cannot delegate to itself.`);
    }
  }

  for (const extension of skill.archive_extensions) {
    const extensionSkill = skillMap.get(extension);
    if (!extensionSkill) {
      errors.push(`${skill.name} references an unknown archive extension: ${extension}`);
      continue;
    }
    if (!(extensionSkill.status === "archive" || extensionSkill.status === "merge")) {
      errors.push(`${skill.name} archive_extensions must point to archive/merge entries: ${extension}`);
    }
    if (extensionSkill.host !== skill.name) {
      errors.push(`${skill.name} must own archive extension ${extension} in skills.json (found host: ${extensionSkill.host ?? "null"})`);
    }
  }
}

const topLevelSkillDirs = readdirSync(root, { withFileTypes: true })
  .filter((entry) => (entry.isDirectory() || entry.isSymbolicLink()) && existsSync(join(root, entry.name, "SKILL.md")))
  .map((entry) => entry.name)
  .sort();

const manifestTopLevelCore = coreSkills.map((skill) => skill.storage_path).sort();

if (topLevelSkillDirs.length !== EXPECTED_CORE_SKILLS) {
  errors.push(`Expected ${EXPECTED_CORE_SKILLS} top-level SKILL.md entrypoints, found ${topLevelSkillDirs.length}`);
}

if (JSON.stringify(topLevelSkillDirs) !== JSON.stringify(manifestTopLevelCore)) {
  errors.push(
    `Top-level SKILL.md entries do not match manifest core roster.\nManifest: ${manifestTopLevelCore.join(", ")}\nActual: ${topLevelSkillDirs.join(", ")}`
  );
}

if (!existsSync(join(root, "_shared"))) {
  errors.push("Missing _shared directory.");
}

if (!existsSync(join(root, "_benchmarks"))) {
  errors.push("Missing _benchmarks directory.");
}

if (hasProjectionConfig) {
  const projectionSpec = buildProjectionSpec(manifest as unknown as SkillsManifest);
  const links = [
    ...projectionSpec.projections.codex,
    ...projectionSpec.projections.claude.memory,
    ...projectionSpec.projections.claude.skill_links,
    ...projectionSpec.projections.gemini.memory,
    ...projectionSpec.projections.antigravity.memory,
    ...projectionSpec.projections.antigravity.skill_links,
    ...projectionSpec.projections.cursor.user_rules,
    ...projectionSpec.projections.opencode.global_links,
    ...projectionSpec.projections.opencode.agent_links,
  ];

  for (const link of links) {
    validateProjectionSymlink(link.source, link.target);
  }
}

function collectSkillFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectSkillFiles(absolutePath));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      found.push(absolutePath);
    }
  }
  return found;
}

const archiveSkillFiles = collectSkillFiles(join(root, "_archive"));
const retiredSkillFiles = collectSkillFiles(join(root, "_retired"));

if (archiveSkillFiles.length > 0) {
  errors.push(`_archive must not contain SKILL.md files:\n${archiveSkillFiles.join("\n")}`);
}

if (retiredSkillFiles.length > 0) {
  errors.push(`_retired must not contain SKILL.md files:\n${retiredSkillFiles.join("\n")}`);
}

if (errors.length > 0) {
  console.error("Skill portfolio validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const counts = skills.reduce<Record<SkillStatus, number>>(
  (acc, skill) => {
    acc[skill.status] += 1;
    return acc;
  },
  { core: 0, merge: 0, archive: 0, retire: 0 }
);

console.log("Skill portfolio validation passed.");
console.log(`core=${counts.core} merge=${counts.merge} archive=${counts.archive} retire=${counts.retire}`);
