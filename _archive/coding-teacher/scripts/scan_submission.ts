#!/usr/bin/env bun
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";

const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".turbo",
  ".cache",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".venv",
  "venv",
  "target",
  ".gradle",
  ".idea",
  ".vscode",
]);

const DEFAULT_IGNORE_FILES = new Set(["pnpm-lock.yaml", "package-lock.json", "yarn.lock", "bun.lockb"]);

const ECOSYSTEM_MARKERS: Record<string, Set<string>> = {
  node: new Set(["package.json", "pnpm-workspace.yaml", "tsconfig.json"]),
  python: new Set(["pyproject.toml", "requirements.txt", "Pipfile", "poetry.lock"]),
  java: new Set(["pom.xml", "build.gradle", "build.gradle.kts", "settings.gradle", "settings.gradle.kts"]),
  go: new Set(["go.mod", "go.sum"]),
  rust: new Set(["Cargo.toml", "Cargo.lock"]),
  dotnet: new Set([".sln"]),
};

const ENTRYPOINT_CANDIDATES: Record<string, Set<string>> = {
  node: new Set(["src/index.ts", "src/index.js", "src/main.ts", "src/main.js", "index.ts", "index.js"]),
  python: new Set(["main.py", "app.py", "__main__.py"]),
  go: new Set(["main.go"]),
  rust: new Set(["src/main.rs"]),
};

type Args = {
  path: string;
  maxFiles: number;
  maxBytesPerFile: number;
  treeDepth: number;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    path: "",
    maxFiles: 4000,
    maxBytesPerFile: 1_000_000,
    treeDepth: 4,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--path") {
      args.path = argv[++i] ?? "";
    } else if (token === "--max-files") {
      args.maxFiles = Number(argv[++i] ?? args.maxFiles);
    } else if (token === "--max-bytes-per-file") {
      args.maxBytesPerFile = Number(argv[++i] ?? args.maxBytesPerFile);
    } else if (token === "--tree-depth") {
      args.treeDepth = Number(argv[++i] ?? args.treeDepth);
    }
  }

  if (!args.path) {
    console.error("Usage: bun scripts/scan_submission.ts --path <submission-folder> [--max-files N] [--max-bytes-per-file N] [--tree-depth N]");
    process.exit(1);
  }

  return args;
}

function isProbablyBinary(path: string, maxProbeBytes = 8192): boolean {
  try {
    const chunk = readFileSync(path).subarray(0, maxProbeBytes);
    return chunk.includes(0);
  } catch {
    return true;
  }
}

function countTextLines(path: string, maxBytes: number): number | null {
  try {
    const st = statSync(path);
    if (st.size > maxBytes) return null;
    if (isProbablyBinary(path)) return null;
    const content = readFileSync(path, "utf8");
    if (!content) return 0;
    return content.split(/\r\n|\r|\n/).length;
  } catch {
    return null;
  }
}

function relPosix(root: string, file: string): string {
  return relative(root, file).split("\\").join("/");
}

function buildTreePreview(paths: string[], maxDepth: number): string[] {
  const nodes = new Map<string, Set<string>>();

  for (const rel of paths) {
    const parts = rel.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    const depth = Math.min(parts.length, maxDepth);

    for (let d = 1; d <= depth; d += 1) {
      const parentKey = parts.slice(0, d - 1).join("/");
      if (!nodes.has(parentKey)) {
        nodes.set(parentKey, new Set());
      }
      nodes.get(parentKey)!.add(parts[d - 1]);
    }
  }

  const lines: string[] = [];

  function walk(prefix: string[], indent: string): void {
    const key = prefix.join("/");
    const children = Array.from(nodes.get(key) ?? []).sort();
    for (const name of children) {
      lines.push(`${indent}${name}`);
      walk([...prefix, name], `${indent}  `);
    }
  }

  walk([], "");
  return lines;
}

function listFiles(root: string, maxFiles: number): { files: string[]; capped: boolean } {
  const files: string[] = [];
  let capped = false;

  function walk(dir: string): void {
    if (capped) return;

    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (capped) break;

      const name = entry.name;
      if (name.startsWith(".")) {
        continue;
      }

      const full = join(dir, name);

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORE_DIRS.has(name) || name === "__MACOSX") {
          continue;
        }
        walk(full);
        continue;
      }

      if (!entry.isFile()) continue;
      if (DEFAULT_IGNORE_FILES.has(name)) continue;

      files.push(full);
      if (files.length >= maxFiles) {
        capped = true;
      }
    }
  }

  walk(root);
  return { files, capped };
}

function main(): number {
  const args = parseArgs(process.argv.slice(2));
  const root = resolve(args.path.replace(/^~(?=$|\/)/, process.env.HOME ?? "~"));

  const result: Record<string, unknown> = {
    root,
    ok: false,
    warnings: [] as string[],
    errors: [] as string[],
    file_count: 0,
    files: [] as string[],
    tree_preview: [] as string[],
    extensions: {} as Record<string, number>,
    loc_estimate: null,
    ecosystems: [] as string[],
    entrypoints: [] as string[],
    markers: {} as Record<string, string[]>,
  };

  try {
    const st = statSync(root);
    if (!st.isDirectory()) {
      (result.errors as string[]).push("Submission path does not exist or is not a directory.");
      console.log(JSON.stringify(result, null, 2));
      return 2;
    }
  } catch {
    (result.errors as string[]).push("Submission path does not exist or is not a directory.");
    console.log(JSON.stringify(result, null, 2));
    return 2;
  }

  try {
    const gitStat = statSync(join(root, ".git"));
    if (gitStat.isDirectory()) {
      (result.errors as string[]).push(
        "Submission folder contains .git; looks like a repo root. Submit a step subfolder path instead.",
      );
      console.log(JSON.stringify(result, null, 2));
      return 3;
    }
  } catch {
    // ignore
  }

  const { files, capped } = listFiles(root, args.maxFiles);
  result.file_count = files.length;
  if (capped) {
    (result.warnings as string[]).push(`File enumeration capped at ${args.maxFiles}.`);
  }

  const relPaths = files.map((f) => relPosix(root, f)).sort();

  const extCounter = new Map<string, number>();
  const markersFound: Record<string, string[]> = {};
  for (const eco of Object.keys(ECOSYSTEM_MARKERS)) {
    markersFound[eco] = [];
  }

  const entrypointsFound = new Set<string>();
  let totalLoc = 0;
  let locFilesCounted = 0;
  let skippedLargeOrBinary = 0;

  for (let i = 0; i < files.length; i += 1) {
    const absPath = files[i];
    const relPath = relPaths[i];

    const ext = absPath.includes(".") ? `.${absPath.split(".").pop()!.toLowerCase()}` : "";
    extCounter.set(ext, (extCounter.get(ext) ?? 0) + 1);

    const filename = absPath.split(/[\\/]/).pop() ?? "";
    for (const [eco, markers] of Object.entries(ECOSYSTEM_MARKERS)) {
      if (markers.has(filename)) {
        markersFound[eco].push(relPath);
      }
    }

    for (const candidates of Object.values(ENTRYPOINT_CANDIDATES)) {
      if (candidates.has(relPath)) {
        entrypointsFound.add(relPath);
      }
    }

    const loc = countTextLines(absPath, args.maxBytesPerFile);
    if (loc === null) {
      skippedLargeOrBinary += 1;
    } else {
      totalLoc += loc;
      locFilesCounted += 1;
    }
  }

  result.files = relPaths.slice(0, 500);
  result.tree_preview = buildTreePreview(relPaths, args.treeDepth);

  const sortedExt = Array.from(extCounter.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30);
  result.extensions = Object.fromEntries(sortedExt);

  const ecosystems = Object.entries(markersFound)
    .filter(([, paths]) => paths.length > 0)
    .map(([eco]) => eco);
  result.ecosystems = ecosystems;
  result.markers = Object.fromEntries(
    Object.entries(markersFound)
      .filter(([, paths]) => paths.length > 0)
      .map(([eco, paths]) => [eco, paths.slice(0, 10)]),
  );

  const javaMainCandidates = relPaths.filter((p) => p.startsWith("src/main/java/") && p.endsWith(".java"));
  for (const p of javaMainCandidates.slice(0, 3)) {
    entrypointsFound.add(p);
  }

  result.entrypoints = Array.from(entrypointsFound).sort().slice(0, 20);

  if (locFilesCounted > 0) {
    result.loc_estimate = {
      total: totalLoc,
      counted_files: locFilesCounted,
      skipped_large_or_binary: skippedLargeOrBinary,
      max_bytes_per_file: args.maxBytesPerFile,
    };
  }

  if (skippedLargeOrBinary > 0) {
    (result.warnings as string[]).push(
      `Skipped ${skippedLargeOrBinary} file(s) for LOC (binary or larger than max-bytes-per-file).`,
    );
  }

  result.ok = true;
  console.log(JSON.stringify(result, null, 2));
  return 0;
}

if (import.meta.main) {
  process.exit(main());
}
