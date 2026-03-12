#!/usr/bin/env bun

import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

type SkillStatus = "core" | "merge" | "archive" | "retire";

type SkillRecord = {
  name: string;
  family: string;
  status: SkillStatus;
  host: string | null;
  storage_path: string;
  entry_file: "SKILL.md" | "ARCHIVE.md" | "RETIRED.md";
  notes: string;
  vendored_from?: string;
};

const root = resolve(import.meta.dir, "..");
const manifestPath = join(root, "skills.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  skills: SkillRecord[];
};

const errors: string[] = [];

if (!Array.isArray(manifest.skills)) {
  errors.push("skills.json must contain a top-level skills array.");
}

const skills = manifest.skills ?? [];
const allowedStatuses = new Set<SkillStatus>(["core", "merge", "archive", "retire"]);
const seenNames = new Set<string>();

for (const skill of skills) {
  if (seenNames.has(skill.name)) {
    errors.push(`Duplicate skill name in manifest: ${skill.name}`);
  }
  seenNames.add(skill.name);

  if (!allowedStatuses.has(skill.status)) {
    errors.push(`Invalid status for ${skill.name}: ${skill.status}`);
  }

  if (skill.storage_path.startsWith("/")) {
    errors.push(`storage_path must be relative for ${skill.name}`);
  }

  const absoluteDir = join(root, skill.storage_path);
  const absoluteEntry = join(absoluteDir, skill.entry_file);

  if (!existsSync(absoluteDir)) {
    errors.push(`Missing directory for ${skill.name}: ${skill.storage_path}`);
    continue;
  }

  if (!existsSync(absoluteEntry)) {
    errors.push(`Missing entry file for ${skill.name}: ${skill.storage_path}/${skill.entry_file}`);
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
  }

  if (skill.status === "merge" || skill.status === "archive") {
    if (!skill.storage_path.startsWith("_archive/")) {
      errors.push(`${skill.status} skill ${skill.name} must live under _archive/`);
    }
    if (skill.entry_file !== "ARCHIVE.md") {
      errors.push(`${skill.status} skill ${skill.name} must use ARCHIVE.md`);
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

  if (skill.status === "merge" && !skill.host) {
    errors.push(`Merged skill ${skill.name} must declare a host`);
  }
}

const coreSkills = skills.filter((skill) => skill.status === "core");
const coreNames = new Set(coreSkills.map((skill) => skill.name));

if (coreSkills.length !== 13) {
  errors.push(`Expected 13 core skills, found ${coreSkills.length}`);
}

for (const skill of skills.filter((item) => item.status === "merge")) {
  if (!skill.host || !coreNames.has(skill.host)) {
    errors.push(`Merged skill ${skill.name} points to an invalid host: ${skill.host ?? "null"}`);
  }
}

const topLevelSkillDirs = readdirSync(root, { withFileTypes: true })
  .filter((entry) => (entry.isDirectory() || entry.isSymbolicLink()) && existsSync(join(root, entry.name, "SKILL.md")))
  .map((entry) => entry.name)
  .sort();

const manifestTopLevelCore = coreSkills.map((skill) => skill.storage_path).sort();

if (topLevelSkillDirs.length !== 13) {
  errors.push(`Expected 13 top-level SKILL.md entrypoints, found ${topLevelSkillDirs.length}`);
}

if (JSON.stringify(topLevelSkillDirs) !== JSON.stringify(manifestTopLevelCore)) {
  errors.push(
    `Top-level SKILL.md entries do not match manifest core roster.\nManifest: ${manifestTopLevelCore.join(", ")}\nActual: ${topLevelSkillDirs.join(", ")}`
  );
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
