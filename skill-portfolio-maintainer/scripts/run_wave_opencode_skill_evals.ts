#!/usr/bin/env bun

import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { skillWorkspaceDir, waveBenchmarksDir, waveGroupPath } from "../../scripts/lib/layout.ts";

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
  status: "core" | "merge" | "archive" | "retire";
  storage_path: string;
  entry_file: "SKILL.md" | "ARCHIVE.md" | "RETIRED.md";
};

type TriggerQuery =
  | {
      query: string;
      should_trigger: boolean;
      skill: string;
      id?: string;
    }
  | {
      query: string;
      expected_skill: string;
      id?: string;
    };

type CliOptions = {
  wave: string;
  model: string;
  timeoutMs: number;
  skipSkillEvals: boolean;
  skipTriggerRegressions: boolean;
  help: boolean;
};

type ParsedEvent = {
  part?: {
    type?: string;
    text?: string;
  };
};

const HELP_TEXT = `Usage:
  bun scripts/run_wave_opencode_skill_evals.ts --wave <wave-id> [--model <provider/model>] [--timeout-ms <ms>] [--skip-skill-evals] [--skip-trigger-regressions]

Options:
  --wave <id>                 Wave id, for example wave-2
  --model <id>                OpenCode model ID (default: minimax-coding-plan/MiniMax-M2.5)
  --timeout-ms <ms>           Per-skill outcome timeout (default: 180000)
  --skip-skill-evals          Reuse existing per-skill benchmark outputs and skip outcome execution
  --skip-trigger-regressions  Skip wave-specific legacy trigger regressions
  --help                      Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return {
      wave: "",
      model: "minimax-coding-plan/MiniMax-M2.5",
      timeoutMs: 180000,
      skipSkillEvals: false,
      skipTriggerRegressions: false,
      help: true,
    };
  }

  let wave = "";
  let model = "minimax-coding-plan/MiniMax-M2.5";
  let timeoutMs = 180000;
  let skipSkillEvals = false;
  let skipTriggerRegressions = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--wave" || arg.startsWith("--wave=")) {
      wave = arg.includes("=") ? arg.slice("--wave=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--model" || arg.startsWith("--model=")) {
      model = arg.includes("=") ? arg.slice("--model=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--timeout-ms" || arg.startsWith("--timeout-ms=")) {
      const value = arg.includes("=") ? arg.slice("--timeout-ms=".length) : argv[++index] ?? "";
      timeoutMs = Number.parseInt(value, 10);
      continue;
    }
    if (arg === "--skip-skill-evals") {
      skipSkillEvals = true;
      continue;
    }
    if (arg === "--skip-trigger-regressions") {
      skipTriggerRegressions = true;
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!wave) {
    throw new Error("--wave is required");
  }

  return { wave, model, timeoutMs, skipSkillEvals, skipTriggerRegressions, help: false };
}

function readDescription(entryPath: string): string {
  const text = readFileSync(entryPath, "utf8");
  const singleLine = text.match(/^description:\s*(.+)$/m);
  if (singleLine) {
    return singleLine[1].trim().replace(/^['"]|['"]$/g, "");
  }
  const multiLine = text.match(/^description:\s*[>|]-?\s*\n([\s\S]*?)\n(?:[A-Za-z0-9_-]+:|---$)/m);
  if (!multiLine) return "No description parsed.";
  return multiLine[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function shouldCopySkillEntry(sourceRoot: string, absolutePath: string): boolean {
  const relativePath = absolutePath.slice(sourceRoot.length).replace(/^\/+/, "");
  if (relativePath.length === 0) return true;
  const topLevel = relativePath.split("/")[0];
  if (topLevel === "evals" || topLevel.endsWith("-workspace") || topLevel === ".git" || topLevel === "node_modules") {
    return false;
  }
  return true;
}

function stageSkill(repoRoot: string, skill: SkillRecord, targetSkillsDir: string): { name: string; target: string; description: string } {
  const sourceRoot = join(repoRoot, skill.storage_path);
  const targetRoot = join(targetSkillsDir, skill.name);
  cpSync(sourceRoot, targetRoot, {
    recursive: true,
    filter: (sourcePath) => shouldCopySkillEntry(sourceRoot, sourcePath),
  });

  const entryPath = join(sourceRoot, skill.status === "archive" || skill.status === "merge" ? "ARCHIVE.md" : "SKILL.md");
  const targetEntry = join(targetRoot, skill.status === "archive" || skill.status === "merge" ? "ARCHIVE.md" : "SKILL.md");
  if ((skill.status === "archive" || skill.status === "merge") && existsSync(targetEntry)) {
    writeFileSync(join(targetRoot, "SKILL.md"), readFileSync(targetEntry, "utf8"), "utf8");
  }

  return {
    name: skill.name,
    target: targetRoot,
    description: readDescription(entryPath),
  };
}

function parseTriggeredSkill(rawOutput: string, allowedSkills: string[]): string | null {
  const lines = rawOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let finalText = "";
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as ParsedEvent;
      if (parsed.part?.type === "text" && parsed.part.text) {
        finalText = parsed.part.text.trim();
      }
    } catch {
      continue;
    }
  }

  const exact = allowedSkills.find((skill) => finalText === skill);
  if (exact) return exact;

  const firstMention = allowedSkills.find((skill) => finalText.includes(skill));
  return firstMention ?? null;
}

function runCommand(command: string[], cwd: string, timeoutMs: number): { stdout: string; stderr: string } {
  const result = spawnSync(command[0], command.slice(1), {
    cwd,
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`${command[0]} failed (${result.status ?? "null"}): ${result.stderr || result.stdout || "no output"}`);
  }

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function normalizeTriggerQueries(
  root: string,
  entry: NonNullable<WaveGroup["trigger_regressions"]>[number]
): Array<{ id: string; query: string; expectedSkill: string | null; forbiddenSkill: string | null }> {
  const filePath = join(root, entry.file);
  const value = JSON.parse(readFileSync(filePath, "utf8")) as TriggerQuery[];

  if (!Array.isArray(value)) {
    throw new Error(`Trigger regression file must be an array: ${filePath}`);
  }

  return value.map((item, index) => {
    if ("expected_skill" in item) {
      return {
        id: item.id ?? `${basename(entry.file)}-${index + 1}`,
        query: item.query,
        expectedSkill: item.expected_skill,
        forbiddenSkill: null,
      };
    }

    if (!entry.skill && !("skill" in item && typeof item.skill === "string")) {
      throw new Error(`Trigger regression file requires an associated skill: ${filePath}`);
    }

    const skill = entry.skill ?? ("skill" in item ? item.skill : null);
    if (!skill) {
      throw new Error(`Could not resolve skill for trigger regression item: ${filePath}`);
    }

    return {
      id: item.id ?? `${basename(entry.file)}-${index + 1}`,
      query: item.query,
      expectedSkill: item.should_trigger ? skill : null,
      forbiddenSkill: item.should_trigger ? null : skill,
    };
  });
}

function runTriggerRegressions(root: string, group: WaveGroup, model: string): void {
  if (!group.trigger_regressions || group.trigger_regressions.length === 0) return;

  const manifest = JSON.parse(readFileSync(join(root, "skills.json"), "utf8")) as { skills: SkillRecord[] };
  const skillMap = new Map(manifest.skills.map((skill) => [skill.name, skill]));
  const tempDir = mkdtempSync(join(tmpdir(), `wave-trigger-${group.wave}-`));
  const projectDir = join(tempDir, "project");
  const skillsDir = join(projectDir, ".opencode", "skills");
  mkdirSync(skillsDir, { recursive: true });

  const stagedSkills = group.skills.map((skillName) => {
    const skill = skillMap.get(skillName);
    if (!skill) {
      throw new Error(`Unknown skill in wave group: ${skillName}`);
    }
    return stageSkill(root, skill, skillsDir);
  });

  writeFileSync(
    join(projectDir, "AGENTS.md"),
    [
      "## Skills",
      "A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills available in this trigger benchmark workspace.",
      "### Available skills",
      ...stagedSkills.map((skill) => `- ${skill.name}: ${skill.description} (file: ${join(skill.target, "SKILL.md")})`),
      "### How to use skills",
      "- Trigger rules: If the user request clearly matches a skill description shown above, you must use that skill for that turn.",
      "- Choose the single best skill for the request. Do not return multiple skills.",
    ].join("\n"),
    "utf8"
  );

  writeFileSync(
    join(projectDir, "opencode.json"),
    `${JSON.stringify(
      {
        $schema: "https://opencode.ai/config.json",
        model,
        permission: {
          bash: { "*": "allow" },
          edit: { "*": "deny" },
          write: { "*": "deny" },
        },
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const results: Array<{
    file: string;
    id: string;
    query: string;
    expected_skill: string | null;
    forbidden_skill: string | null;
    triggered_skill: string | null;
    passed: boolean;
  }> = [];

  for (const entry of group.trigger_regressions) {
    const normalized = normalizeTriggerQueries(root, entry);
    for (const query of normalized) {
      const command = [
        "opencode",
        "run",
        [
          "Using the available skills in this workspace, choose exactly one skill for the user request below.",
          `Reply with only one skill name from this list: ${group.skills.join(", ")}.`,
          "",
          query.query,
        ].join("\n"),
        "--model",
        model,
        "--format",
        "json",
        "--dir",
        projectDir,
      ];

      const result = spawnSync(command[0], command.slice(1), {
        cwd: projectDir,
        env: {
          ...process.env,
          OPENCODE_CONFIG: join(projectDir, "opencode.json"),
        },
        encoding: "utf8",
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024,
      });

      const triggeredSkill = parseTriggeredSkill(result.stdout ?? "", group.skills);
      const passed =
        query.expectedSkill !== null
          ? triggeredSkill === query.expectedSkill
          : query.forbiddenSkill !== null
            ? triggeredSkill !== query.forbiddenSkill
            : false;

      results.push({
        file: entry.file,
        id: query.id,
        query: query.query,
        expected_skill: query.expectedSkill,
        forbidden_skill: query.forbiddenSkill,
        triggered_skill: triggeredSkill,
        passed,
      });
    }
  }

  const byFile = group.trigger_regressions.map((entry) => {
    const subset = results.filter((item) => item.file === entry.file);
    const passed = subset.filter((item) => item.passed).length;
    return {
      file: entry.file,
      queries: subset.length,
      passed,
      pass_rate: subset.length === 0 ? 0 : Number((passed / subset.length).toFixed(4)),
    };
  });

  const passed = results.filter((item) => item.passed).length;
  const summary = {
    queries: results.length,
    passed,
    pass_rate: results.length === 0 ? 0 : Number((passed / results.length).toFixed(4)),
    by_file: byFile,
    results,
  };

  const outDir = waveBenchmarksDir(root);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${group.wave}-trigger-regressions.json`), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  writeFileSync(
    join(outDir, `${group.wave}-trigger-regressions.md`),
    [
      `# ${group.wave} Trigger Regressions`,
      "",
      "| File | Passed | Queries | Pass Rate |",
      "| --- | --- | --- | --- |",
      ...byFile.map((row) => `| ${row.file} | ${row.passed} | ${row.queries} | ${Math.round(row.pass_rate * 100)}% |`),
      "",
      `- total queries: ${summary.queries}`,
      `- passed: ${summary.passed}`,
      `- pass rate: ${Math.round(summary.pass_rate * 100)}%`,
    ].join("\n") + "\n",
    "utf8"
  );

  rmSync(tempDir, { recursive: true, force: true });
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const root = resolve(import.meta.dir, "..", "..");
  const groupPath = waveGroupPath(root, options.wave);
  if (!existsSync(groupPath)) {
    throw new Error(`Wave group not found: ${groupPath}`);
  }
  const group = JSON.parse(readFileSync(groupPath, "utf8")) as WaveGroup;

  if (!options.skipSkillEvals) {
    for (const skillName of group.skills) {
      const skillRoot = join(root, skillName);
      const workspace = skillWorkspaceDir(root, skillName);

      runCommand(
        [
          "bun",
          join(root, "skill-portfolio-maintainer", "scripts", "run_opencode_skill_evals.ts"),
          "--skill-root",
          skillRoot,
          "--workspace",
          workspace,
          "--model",
          options.model,
          "--timeout-ms",
          String(options.timeoutMs),
        ],
        root,
        Math.max(options.timeoutMs * 6, 180000)
      );

      runCommand(
        [
          "bun",
          join(root, "skill-portfolio-maintainer", "scripts", "grade_opencode_skill_evals.ts"),
          "--skill-root",
          skillRoot,
          "--workspace",
          workspace,
        ],
        root,
        120000
      );
    }
  }

  if (!options.skipTriggerRegressions) {
    runTriggerRegressions(root, group, options.model);
  }

  runCommand(
    [
      "bun",
      join(root, "skill-portfolio-maintainer", "scripts", "aggregate_wave_benchmarks.ts"),
      "--wave",
      group.wave,
    ],
    root,
    120000
  );

  for (const skillName of group.skills) {
    runCommand(
      [
        "bun",
        join(root, "skill-portfolio-maintainer", "scripts", "cleanup_compact_benchmark_workspace.ts"),
        "--workspace",
        skillWorkspaceDir(root, skillName),
      ],
      root,
      120000
    );
  }

  process.stdout.write(`Completed ${group.wave} benchmarks with model ${options.model}\n`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
