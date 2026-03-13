#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

type RunSet = "both" | "with_skill" | "without_skill";

type EvalCase = {
  id: number;
  name?: string;
  prompt: string;
  expected_output: string;
  files: string[];
  expectations: string[];
  fixture_dir?: string;
  support_skills?: string[];
};

type EvalManifest = {
  skill_name: string;
  evals: EvalCase[];
};

type SkillRecord = {
  name: string;
  storage_path: string;
  status: "core" | "merge" | "archive" | "retire";
  entry_file: "SKILL.md" | "ARCHIVE.md" | "RETIRED.md";
};

type CliOptions = {
  workspace: string;
  skillRoot: string;
  model: string;
  evalIds: Set<number> | null;
  prepareOnly: boolean;
  runSet: RunSet;
  timeoutMs: number;
  help: boolean;
};

type RunConfig = {
  name: "with_skill" | "without_skill";
  skillEnabled: boolean;
};

type ParsedEvent = {
  sessionID?: string;
  part?: {
    type?: string;
    text?: string;
    cost?: number;
    tokens?: {
      total?: number;
      input?: number;
      output?: number;
      reasoning?: number;
    };
  };
};

const HELP_TEXT = `Usage:
  bun scripts/run_opencode_skill_evals.ts [--skill-root <path>] [--workspace <path>] [--model <provider/model>] [--eval <ids>] [--run-set both|with_skill|without_skill] [--timeout-ms <ms>] [--prepare-only]

Options:
  --skill-root <path>  Skill root (default: current skill directory)
  --workspace <path>   Iteration workspace (default: sibling <skill>-workspace/iteration-1)
  --model <id>         OpenCode model ID (default: minimax-coding-plan/MiniMax-M2.5)
  --eval <ids>         Comma-separated eval ids
  --run-set <mode>     both, with_skill, or without_skill
  --timeout-ms <ms>    Per-run timeout in milliseconds
  --prepare-only       Stage runs and command files without calling OpenCode
  --help               Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return {
      workspace: "",
      skillRoot: "",
      model: "minimax-coding-plan/MiniMax-M2.5",
      evalIds: null,
      prepareOnly: false,
      runSet: "both",
      timeoutMs: 180000,
      help: true,
    };
  }

  let skillRoot = resolve(import.meta.dir, "..", "..", "frontend-dev-guidelines");
  let workspace = resolve(import.meta.dir, "..", "..", "frontend-dev-guidelines-workspace", "iteration-1");
  let model = "minimax-coding-plan/MiniMax-M2.5";
  let evalIds: Set<number> | null = null;
  let prepareOnly = false;
  let runSet: RunSet = "both";
  let timeoutMs = 180000;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--workspace" || arg.startsWith("--workspace=")) {
      workspace = resolve(arg.includes("=") ? arg.slice("--workspace=".length) : argv[++index] ?? "");
      continue;
    }
    if (arg === "--skill-root" || arg.startsWith("--skill-root=")) {
      skillRoot = resolve(arg.includes("=") ? arg.slice("--skill-root=".length) : argv[++index] ?? "");
      continue;
    }
    if (arg === "--model" || arg.startsWith("--model=")) {
      model = arg.includes("=") ? arg.slice("--model=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--eval" || arg.startsWith("--eval=")) {
      const value = arg.includes("=") ? arg.slice("--eval=".length) : argv[++index] ?? "";
      evalIds = new Set(
        value
          .split(",")
          .map((item) => Number.parseInt(item.trim(), 10))
          .filter((item) => Number.isInteger(item))
      );
      continue;
    }
    if (arg === "--run-set" || arg.startsWith("--run-set=")) {
      const value = arg.includes("=") ? arg.slice("--run-set=".length) : argv[++index] ?? "";
      if (value === "both" || value === "with_skill" || value === "without_skill") {
        runSet = value;
      } else {
        throw new Error(`Unsupported --run-set value: ${value}`);
      }
      continue;
    }
    if (arg === "--timeout-ms" || arg.startsWith("--timeout-ms=")) {
      const value = arg.includes("=") ? arg.slice("--timeout-ms=".length) : argv[++index] ?? "";
      timeoutMs = Number.parseInt(value, 10);
      continue;
    }
    if (arg === "--prepare-only") {
      prepareOnly = true;
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!argv.some((arg) => arg.startsWith("--workspace"))) {
    workspace = resolve(skillRoot, "..", `${basename(skillRoot)}-workspace`, "iteration-1");
  }

  return { workspace, skillRoot, model, evalIds, prepareOnly, runSet, timeoutMs, help: false };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function listFiles(root: string, relativeBase = root): { path: string; bytes: number; lines: number }[] {
  const items: { path: string; bytes: number; lines: number }[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === ".opencode" || entry.name === ".git") continue;
    const absolutePath = join(root, entry.name);
    if (entry.isDirectory()) {
      items.push(...listFiles(absolutePath, relativeBase));
      continue;
    }
    if (!entry.isFile()) continue;
    const content = readFileSync(absolutePath, "utf8");
    items.push({
      path: relative(relativeBase, absolutePath).replaceAll("\\", "/"),
      bytes: Buffer.byteLength(content),
      lines: content.length === 0 ? 0 : content.split(/\r?\n/).length,
    });
  }
  return items.sort((left, right) => left.path.localeCompare(right.path));
}

function renderTree(root: string, prefix = ""): string[] {
  const lines: string[] = [];
  const entries = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.name !== ".opencode" && entry.name !== ".git")
    .sort((left, right) => left.name.localeCompare(right.name));

  entries.forEach((entry, index) => {
    const connector = index === entries.length - 1 ? "└── " : "├── ";
    lines.push(`${prefix}${connector}${entry.name}`);
    if (entry.isDirectory()) {
      const nextPrefix = `${prefix}${index === entries.length - 1 ? "    " : "│   "}`;
      lines.push(...renderTree(join(root, entry.name), nextPrefix));
    }
  });

  return lines;
}

function resolveRunConfigs(runSet: RunSet): RunConfig[] {
  if (runSet === "with_skill") return [{ name: "with_skill", skillEnabled: true }];
  if (runSet === "without_skill") return [{ name: "without_skill", skillEnabled: false }];
  return [
    { name: "with_skill", skillEnabled: true },
    { name: "without_skill", skillEnabled: false },
  ];
}

function shouldCopySkillEntry(sourceRoot: string, absolutePath: string): boolean {
  const relativePath = relative(sourceRoot, absolutePath).replaceAll("\\", "/");
  if (relativePath.length === 0) return true;
  const topLevel = relativePath.split("/")[0];
  if (topLevel === "evals" || topLevel.endsWith("-workspace") || topLevel === ".git" || topLevel === "node_modules") {
    return false;
  }
  return true;
}

function copySkillTree(sourceRoot: string, targetRoot: string): void {
  cpSync(sourceRoot, targetRoot, {
    recursive: true,
    filter: (sourcePath) => shouldCopySkillEntry(sourceRoot, sourcePath),
  });
}

function parseJsonEvents(rawOutput: string): ParsedEvent[] {
  return rawOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("{") && line.endsWith("}"))
    .map((line) => {
      try {
        return JSON.parse(line) as ParsedEvent;
      } catch {
        return null;
      }
    })
    .filter((event): event is ParsedEvent => event !== null);
}

function summarizeRun(rawOutput: string, rawError: string): {
  finalText: string;
  sessionId: string | null;
  cost: number | null;
  tokenSummary: ParsedEvent["part"]["tokens"] | null;
} {
  const events = parseJsonEvents(rawOutput);
  let finalText = "";
  let sessionId: string | null = null;
  let cost: number | null = null;
  let tokenSummary: ParsedEvent["part"]["tokens"] | null = null;

  for (const event of events) {
    if (event.sessionID) sessionId = event.sessionID;
    if (event.part?.type === "text" && event.part.text) finalText = event.part.text;
    if (typeof event.part?.cost === "number") cost = event.part.cost;
    if (event.part?.tokens) tokenSummary = event.part.tokens;
  }

  if (finalText.length === 0 && rawError.trim().length > 0) {
    finalText = rawError.trim();
  }

  return { finalText, sessionId, cost, tokenSummary };
}

function shellEscape(value: string): string {
  if (/^[A-Za-z0-9_./:=+-]+$/.test(value)) return value;
  return `'${value.replaceAll("'", `'\"'\"'`)}'`;
}

function loadManifest(root: string) {
  return JSON.parse(readFileSync(join(root, "skills.json"), "utf8")) as { skills: SkillRecord[] };
}

function readDescription(entryPath: string): string {
  const text = readFileSync(entryPath, "utf8");
  const singleLine = text.match(/^description:\s*(.+)$/m);
  if (singleLine) return singleLine[1].trim().replace(/^['"]|['"]$/g, "");
  const multiLine = text.match(/^description:\s*[>|]-?\s*\n([\s\S]*?)\n(?:[A-Za-z0-9_-]+:|---$)/m);
  if (!multiLine) return "No description parsed.";
  return multiLine[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function stageSkillByName(repoRoot: string, name: string, projectDir: string): { name: string; target: string; description: string } {
  const manifest = loadManifest(repoRoot);
  const skill = manifest.skills.find((item) => item.name === name);
  if (!skill) {
    throw new Error(`Unknown support skill: ${name}`);
  }

  const sourceRoot = join(repoRoot, skill.storage_path);
  const targetRoot = join(projectDir, ".opencode", "skills", name);
  ensureDir(join(projectDir, ".opencode", "skills"));
  copySkillTree(sourceRoot, targetRoot);

  const entryName = skill.status === "archive" || skill.status === "merge" ? "ARCHIVE.md" : "SKILL.md";
  const sourceEntry = join(sourceRoot, entryName);
  const targetEntry = join(targetRoot, entryName);
  if ((skill.status === "archive" || skill.status === "merge") && existsSync(targetEntry)) {
    writeFileSync(join(targetRoot, "SKILL.md"), readFileSync(targetEntry, "utf8"), "utf8");
  }

  return {
    name,
    target: targetRoot,
    description: readDescription(sourceEntry),
  };
}

function writeAgentsFile(projectDir: string, stagedSkills: { name: string; target: string; description: string }[]): void {
  const skillLines = stagedSkills
    .map((skill) => `- ${skill.name}: ${skill.description} (file: ${join(skill.target, "SKILL.md")})`)
    .join("\n");

  const content = `## Skills
A skill is a set of local instructions to follow that is stored in a \`SKILL.md\` file. Below is the list of skills available in this workspace.
### Available skills
${skillLines}
### How to use skills
- Trigger rules: If the user request clearly matches a skill description shown above, you must use that skill for that turn.
- How to use a skill:
  1) Open its \`SKILL.md\`.
  2) Read only enough to follow the workflow.
  3) If \`references/\` exists, load only the files needed for the task.
`;
  writeFileSync(join(projectDir, "AGENTS.md"), content, "utf8");
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const repoRoot = resolve(options.skillRoot, "..");
  const manifestPath = join(options.skillRoot, "evals", "evals.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as EvalManifest;

  ensureDir(options.workspace);
  const workspaceConfigPath = join(options.workspace, "opencode.json");
  if (!existsSync(workspaceConfigPath)) {
    throw new Error(`Workspace config not found: ${workspaceConfigPath}`);
  }

  const selectedEvals = manifest.evals.filter((evalCase) => !options.evalIds || options.evalIds.has(evalCase.id));
  if (selectedEvals.length === 0) {
    throw new Error("No evals matched the selection.");
  }

  for (const evalCase of selectedEvals) {
    const fixtureDir = resolve(options.skillRoot, evalCase.fixture_dir ?? "");
    if (evalCase.fixture_dir && (!existsSync(fixtureDir) || !statSync(fixtureDir).isDirectory())) {
      throw new Error(`Fixture directory not found for eval ${evalCase.id}: ${fixtureDir}`);
    }

    const evalSlug = slugify(evalCase.name ?? `eval-${evalCase.id}`);
    const evalDir = join(options.workspace, `eval-${evalCase.id}-${evalSlug}`);
    ensureDir(evalDir);

    writeJson(join(evalDir, "eval_metadata.json"), {
      eval_id: evalCase.id,
      eval_name: evalCase.name ?? `eval-${evalCase.id}`,
      prompt: evalCase.prompt,
      assertions: evalCase.expectations,
      expected_output: evalCase.expected_output,
      support_skills: evalCase.support_skills ?? [],
    });

    for (const config of resolveRunConfigs(options.runSet)) {
      const runDir = join(evalDir, config.name);
      const projectDir = join(runDir, "project");
      const outputsDir = join(runDir, "outputs");
      const contextDir = join(runDir, "context");

      rmSync(runDir, { recursive: true, force: true });
      ensureDir(outputsDir);
      ensureDir(contextDir);

      if (evalCase.fixture_dir) {
        cpSync(fixtureDir, projectDir, { recursive: true });
      } else {
        ensureDir(projectDir);
      }

      const stagedSkills = [];
      if (config.skillEnabled) {
        stagedSkills.push(stageSkillByName(repoRoot, basename(options.skillRoot), projectDir));
        for (const supportSkill of evalCase.support_skills ?? []) {
          stagedSkills.push(stageSkillByName(repoRoot, supportSkill, projectDir));
        }
        writeAgentsFile(projectDir, stagedSkills);
      }

      const stagedFiles = listFiles(projectDir);
      writeJson(join(contextDir, "files.json"), stagedFiles);
      writeFileSync(join(contextDir, "tree.txt"), `${renderTree(projectDir).join("\n")}\n`, "utf8");
      writeFileSync(
        join(contextDir, "input-summary.md"),
        [
          "# Input Summary",
          "",
          `- eval: ${evalCase.name ?? evalCase.id}`,
          `- configuration: ${config.name}`,
          `- model: ${options.model}`,
          `- project_dir: ${projectDir}`,
          `- staged_skills: ${stagedSkills.map((item) => item.name).join(", ") || "none"}`,
          "",
          "## Files",
          "",
          ...stagedFiles.map((item) => `- ${item.path} (${item.lines} lines, ${item.bytes} bytes)`),
          "",
        ].join("\n"),
        "utf8"
      );

      writeFileSync(join(runDir, "prompt.md"), `${evalCase.prompt}\n`, "utf8");

      const attachedFiles = evalCase.files.map((filePath) => {
        const baseDir = resolve(options.skillRoot, evalCase.fixture_dir ?? "");
        const relativeFromFixture = relative(baseDir, resolve(options.skillRoot, filePath));
        return join(projectDir, relativeFromFixture);
      });

      const taskPrompt = config.skillEnabled
        ? `${evalCase.prompt}\n\nUse any matching local skill in this workspace and follow its response contract exactly.`
        : evalCase.prompt;

      const command = [
        "opencode",
        "run",
        taskPrompt,
        "--model",
        options.model,
        "--format",
        "json",
        "--dir",
        projectDir,
        "--title",
        `${manifest.skill_name}-eval-${evalCase.id}-${config.name}`,
      ];

      for (const attachedFile of attachedFiles) {
        command.push("--file", attachedFile);
      }

      writeFileSync(join(runDir, "command.txt"), `${command.map(shellEscape).join(" ")}\n`, "utf8");

      const baseRunMetadata = {
        eval_id: evalCase.id,
        eval_name: evalCase.name ?? `eval-${evalCase.id}`,
        configuration: config.name,
        skill_enabled: config.skillEnabled,
        model: options.model,
        timeout_ms: options.timeoutMs,
        project_dir: projectDir,
        prompt_path: join(runDir, "prompt.md"),
        attached_files: attachedFiles,
        staged_skills: stagedSkills.map((item) => item.name),
        opencode_config: workspaceConfigPath,
        command,
        task_prompt: taskPrompt,
      };

      if (options.prepareOnly) {
        writeJson(join(runDir, "run.json"), {
          ...baseRunMetadata,
          status: "prepared",
        });
        continue;
      }

      const result = spawnSync(command[0], command.slice(1), {
        cwd: projectDir,
        env: {
          ...process.env,
          OPENCODE_CONFIG: workspaceConfigPath,
        },
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
        timeout: options.timeoutMs,
        killSignal: "SIGTERM",
      });

      writeFileSync(join(outputsDir, "raw.jsonl"), result.stdout ?? "", "utf8");
      writeFileSync(join(outputsDir, "stderr.log"), result.stderr ?? "", "utf8");

      const summary = summarizeRun(result.stdout ?? "", result.stderr ?? "");
      writeFileSync(join(outputsDir, "final.md"), `${summary.finalText.trim()}\n`, "utf8");

      writeJson(join(runDir, "run.json"), {
        ...baseRunMetadata,
        status:
          result.status === 0 ? "completed" : result.error?.name === "Error" && `${result.error}`.includes("ETIMEDOUT") ? "timed_out" : "failed",
        exit_code: result.status,
        signal: result.signal,
        error: result.error ? String(result.error) : null,
        session_id: summary.sessionId,
        cost: summary.cost,
        tokens: summary.tokenSummary,
      });
    }
  }

  process.stdout.write(`${options.prepareOnly ? "Prepared" : "Executed"} ${selectedEvals.length} eval(s) in ${options.workspace}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
