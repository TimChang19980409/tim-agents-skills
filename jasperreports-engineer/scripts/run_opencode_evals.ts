#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type RunSet = "both" | "with_skill" | "without_skill";

type EvalCase = {
  id: number;
  name?: string;
  prompt: string;
  expected_output: string;
  files: string[];
  expectations: string[];
  fixture_dir?: string;
};

type EvalManifest = {
  skill_name: string;
  evals: EvalCase[];
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
  type?: string;
  timestamp?: number;
  sessionID?: string;
  part?: {
    type?: string;
    text?: string;
    reason?: string;
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
  bun scripts/run_opencode_evals.ts [--workspace <path>] [--model <provider/model>] [--eval <ids>] [--run-set both|with_skill|without_skill] [--timeout-ms <ms>] [--prepare-only]

Options:
  --workspace <path>   Iteration workspace (default: ../jasperreports-engineer-workspace/iteration-1)
  --skill-root <path>  Skill root (default: parent of this scripts directory)
  --model <id>         OpenCode model ID (default: minimax-coding-plan/MiniMax-M2.5)
  --eval <ids>         Comma-separated eval ids, for example 1 or 1,3
  --run-set <mode>     both, with_skill, or without_skill (default: both)
  --timeout-ms <ms>    Per-run OpenCode timeout in milliseconds (default: 180000)
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

  const defaultSkillRoot = resolve(import.meta.dir, "..");
  const defaultWorkspace = resolve(import.meta.dir, "..", "..", "jasperreports-engineer-workspace", "iteration-1");

  let workspace = defaultWorkspace;
  let skillRoot = defaultSkillRoot;
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
      const parsed = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --timeout-ms value: ${value}`);
      }
      timeoutMs = parsed;
      continue;
    }
    if (arg === "--prepare-only") {
      prepareOnly = true;
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
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

function listFiles(root: string, relativeBase = root): { path: string; bytes: number; lines: number }[] {
  const items: { path: string; bytes: number; lines: number }[] = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === ".opencode" || entry.name === ".git") {
      continue;
    }

    const absolutePath = join(root, entry.name);
    if (entry.isDirectory()) {
      items.push(...listFiles(absolutePath, relativeBase));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

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

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function resolveRunConfigs(runSet: RunSet): RunConfig[] {
  if (runSet === "with_skill") {
    return [{ name: "with_skill", skillEnabled: true }];
  }
  if (runSet === "without_skill") {
    return [{ name: "without_skill", skillEnabled: false }];
  }
  return [
    { name: "with_skill", skillEnabled: true },
    { name: "without_skill", skillEnabled: false },
  ];
}

function runInventory(skillRoot: string, projectDir: string, contextDir: string): void {
  const command = ["bun", join(skillRoot, "scripts", "jrxml_inventory.ts"), "--root", projectDir, "--format", "json"];
  const jsonResult = spawnSync(command[0], command.slice(1), {
    cwd: projectDir,
    encoding: "utf8",
  });

  if (jsonResult.status === 0) {
    writeFileSync(join(contextDir, "jrxml-inventory.json"), jsonResult.stdout, "utf8");
  } else {
    writeFileSync(join(contextDir, "jrxml-inventory-error.log"), jsonResult.stderr || jsonResult.stdout, "utf8");
  }

  const markdownResult = spawnSync(command[0], [command[1], "--root", projectDir, "--format", "markdown"], {
    cwd: projectDir,
    encoding: "utf8",
  });

  if (markdownResult.status === 0) {
    writeFileSync(join(contextDir, "jrxml-inventory.md"), markdownResult.stdout, "utf8");
  }
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
  durationMs: number | null;
  tokenSummary: { total: number | null; input: number | null; output: number | null; reasoning: number | null };
  cost: number | null;
  rawEvents: ParsedEvent[];
} {
  const events = parseJsonEvents(rawOutput);
  const textParts = events
    .filter((event) => event.type === "text" && event.part?.type === "text")
    .map((event) => event.part?.text?.trim())
    .filter((value): value is string => Boolean(value));

  const timestamps = events.map((event) => event.timestamp).filter((value): value is number => typeof value === "number");
  const stepFinish = [...events].reverse().find((event) => event.type === "step_finish");

  const unsanitizedText = textParts.join("\n\n") || rawError.trim() || rawOutput.trim();
  const finalText = unsanitizedText.replace(/<think>[\s\S]*?<\/think>\s*/gi, "").trim();
  return {
    finalText: finalText.length > 0 ? finalText : "(no final text emitted)",
    sessionId: events.find((event) => event.sessionID)?.sessionID ?? null,
    durationMs: timestamps.length >= 2 ? Math.max(...timestamps) - Math.min(...timestamps) : null,
    tokenSummary: {
      total: stepFinish?.part?.tokens?.total ?? null,
      input: stepFinish?.part?.tokens?.input ?? null,
      output: stepFinish?.part?.tokens?.output ?? null,
      reasoning: stepFinish?.part?.tokens?.reasoning ?? null,
    },
    cost: stepFinish?.part?.cost ?? null,
    rawEvents: events,
  };
}

function shellEscape(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

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
    if (!existsSync(fixtureDir) || !statSync(fixtureDir).isDirectory()) {
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
    });

    for (const config of resolveRunConfigs(options.runSet)) {
      const runDir = join(evalDir, config.name);
      const projectDir = join(runDir, "project");
      const outputsDir = join(runDir, "outputs");
      const contextDir = join(runDir, "context");

      rmSync(runDir, { recursive: true, force: true });
      ensureDir(outputsDir);
      ensureDir(contextDir);

      cpSync(fixtureDir, projectDir, { recursive: true });

      if (config.skillEnabled) {
        const skillTarget = join(projectDir, ".opencode", "skills", "jasperreports-engineer");
        ensureDir(join(projectDir, ".opencode", "skills"));
        cpSync(options.skillRoot, skillTarget, { recursive: true });
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
          "",
          "## Files",
          "",
          ...stagedFiles.map((item) => `- ${item.path} (${item.lines} lines, ${item.bytes} bytes)`),
          "",
        ].join("\n"),
        "utf8"
      );
      runInventory(options.skillRoot, projectDir, contextDir);

      writeFileSync(join(runDir, "prompt.md"), `${evalCase.prompt}\n`, "utf8");

      const attachedFiles = evalCase.files.map((filePath) => {
        const relativeFromFixture = relative(resolve(options.skillRoot, evalCase.fixture_dir ?? ""), resolve(options.skillRoot, filePath));
        return join(projectDir, relativeFromFixture);
      });

      const command = [
        "opencode",
        "run",
        evalCase.prompt,
        "--model",
        options.model,
        "--format",
        "json",
        "--dir",
        projectDir,
        "--title",
        `jasperreports-eval-${evalCase.id}-${config.name}`,
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
        opencode_config: workspaceConfigPath,
        command,
      };

      if (options.prepareOnly) {
        writeJson(join(runDir, "run.json"), {
          ...baseRunMetadata,
          status: "prepared",
        });
        continue;
      }

      const startedAt = new Date().toISOString();
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
      const endedAt = new Date().toISOString();

      writeFileSync(join(outputsDir, "raw.jsonl"), result.stdout ?? "", "utf8");
      writeFileSync(join(outputsDir, "stderr.log"), result.stderr ?? "", "utf8");

      const summary = summarizeRun(result.stdout ?? "", result.stderr ?? "");
      writeFileSync(join(outputsDir, "final.md"), `${summary.finalText.trim()}\n`, "utf8");

      writeJson(join(runDir, "run.json"), {
        ...baseRunMetadata,
        status: result.status === 0 ? "completed" : result.error?.name === "Error" && `${result.error}`.includes("ETIMEDOUT") ? "timed_out" : "failed",
        exit_code: result.status,
        signal: result.signal,
        error: result.error ? String(result.error) : null,
        started_at: startedAt,
        ended_at: endedAt,
        session_id: summary.sessionId,
        duration_ms: summary.durationMs,
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
