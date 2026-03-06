import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export type JsonMap = Record<string, unknown>;

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = true;
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

export function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function readYamlMap(path: string): JsonMap {
  if (!existsSync(path)) {
    throw new Error(`input file not found: ${path}`);
  }

  const yamlText = readFileSync(path, "utf8");
  const data = Bun.YAML.parse(yamlText);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Contract root must be a YAML mapping");
  }

  return data as JsonMap;
}

export function writeFileEnsured(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function fail(msg: string): never {
  console.error(`ERROR: ${msg}`);
  process.exit(2);
}
