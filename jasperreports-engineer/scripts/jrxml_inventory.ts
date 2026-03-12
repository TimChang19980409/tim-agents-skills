#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type OutputFormat = "json" | "markdown";

type CliOptions = {
  root: string;
  glob: string;
  format: OutputFormat;
  help: boolean;
};

type NamedType = {
  name: string;
  class: string | null;
};

type VariableSummary = NamedType & {
  calculation: string | null;
  resetType: string | null;
  expression: string | null;
};

type GroupSummary = {
  name: string;
  expression: string | null;
};

type DatasetSummary = {
  name: string;
  queryLanguage: string | null;
  queryText: string;
  parameters: NamedType[];
  fields: NamedType[];
  variables: VariableSummary[];
};

type SubreportSummary = {
  expression: string | null;
  connectionExpression: string | null;
  dataSourceExpression: string | null;
  parameters: string[];
};

type ComponentSummary = {
  type: string;
  dataset: string | null;
  datasetParameters: string[];
};

type FontSummary = {
  fontName: string | null;
  pdfFontName: string | null;
  pdfEncoding: string | null;
  isPdfEmbedded: string | null;
};

type ReportSummary = {
  file: string;
  language: string | null;
  queryLanguage: string | null;
  queryText: string;
  parameters: NamedType[];
  fields: NamedType[];
  variables: VariableSummary[];
  groups: GroupSummary[];
  datasets: DatasetSummary[];
  subreports: SubreportSummary[];
  components: ComponentSummary[];
  fonts: FontSummary[];
  imports: string[];
  warnings: string[];
};

type XmlNode = {
  name: string;
  attrs: Record<string, string>;
  children: XmlNode[];
  textParts: string[];
};

const HELP_TEXT = `Usage:
  bun scripts/jrxml_inventory.ts --root <path> [--glob <pattern>] [--format json|markdown]

Options:
  --root <path>      Root directory to scan for .jrxml files
  --glob <pattern>   Glob filter relative to root (default: **/*.jrxml)
  --format <format>  json or markdown (default: json)
  --help             Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return {
      root: "",
      glob: "**/*.jrxml",
      format: "json",
      help: true,
    };
  }

  let root = "";
  let glob = "**/*.jrxml";
  let format: OutputFormat = "json";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root" || arg.startsWith("--root=")) {
      root = arg.includes("=") ? arg.slice("--root=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--glob" || arg.startsWith("--glob=")) {
      glob = arg.includes("=") ? arg.slice("--glob=".length) : argv[++index] ?? "";
      continue;
    }
    if (arg === "--format" || arg.startsWith("--format=")) {
      const value = arg.includes("=") ? arg.slice("--format=".length) : argv[++index] ?? "";
      if (value === "json" || value === "markdown") {
        format = value;
      } else {
        throw new Error(`Unsupported format: ${value}`);
      }
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!root) {
    throw new Error("--root is required");
  }

  return { root, glob, format, help: false };
}

function toPosixPath(input: string): string {
  return input.replaceAll("\\", "/");
}

function globToRegExp(pattern: string): RegExp {
  const normalized = toPosixPath(pattern);
  let source = "^";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (char === "*") {
      if (next === "*") {
        source += ".*";
        index += 1;
      } else {
        source += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      source += ".";
      continue;
    }

    source += /[|\\{}()[\]^$+?.]/.test(char) ? `\\${char}` : char;
  }

  source += "$";
  return new RegExp(source);
}

function collectFiles(root: string): string[] {
  const found: string[] = [];

  function walk(currentDir: string): void {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") {
        continue;
      }
      const absolutePath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
      } else if (entry.isFile() && entry.name.endsWith(".jrxml")) {
        found.push(absolutePath);
      }
    }
  }

  walk(root);
  return found.sort((left, right) => left.localeCompare(right));
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").replace(/\r\n/g, "\n").trim();
}

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const matcher = /([A-Za-z0-9_:\-.]+)\s*=\s*("([^"]*)"|'([^']*)')/g;

  for (const match of source.matchAll(matcher)) {
    attrs[match[1]] = match[3] ?? match[4] ?? "";
  }

  return attrs;
}

function localName(name: string): string {
  return name.split(":").pop() ?? name;
}

function readTag(rawXml: string, startIndex: number): { content: string; endIndex: number } {
  let index = startIndex + 1;
  let quote: string | null = null;

  while (index < rawXml.length) {
    const char = rawXml[index];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      index += 1;
      continue;
    }

    if (char === ">") {
      return {
        content: rawXml.slice(startIndex + 1, index),
        endIndex: index + 1,
      };
    }

    index += 1;
  }

  throw new Error("Unterminated XML tag");
}

function parseXml(rawXml: string): XmlNode {
  const xml = rawXml.replace(/^\uFEFF/, "");
  const stack: XmlNode[] = [];
  let root: XmlNode | null = null;
  let index = 0;

  while (index < xml.length) {
    if (xml.startsWith("<!--", index)) {
      const end = xml.indexOf("-->", index + 4);
      index = end === -1 ? xml.length : end + 3;
      continue;
    }

    if (xml.startsWith("<?", index)) {
      const end = xml.indexOf("?>", index + 2);
      index = end === -1 ? xml.length : end + 2;
      continue;
    }

    if (xml.startsWith("<![CDATA[", index)) {
      const end = xml.indexOf("]]>", index + 9);
      const text = end === -1 ? xml.slice(index + 9) : xml.slice(index + 9, end);
      if (stack.length > 0 && text.length > 0) {
        stack[stack.length - 1].textParts.push(text);
      }
      index = end === -1 ? xml.length : end + 3;
      continue;
    }

    if (xml[index] === "<") {
      if (xml[index + 1] === "!") {
        const end = xml.indexOf(">", index + 2);
        index = end === -1 ? xml.length : end + 1;
        continue;
      }

      const { content, endIndex } = readTag(xml, index);
      const trimmed = content.trim();

      if (trimmed.startsWith("/")) {
        stack.pop();
        index = endIndex;
        continue;
      }

      const selfClosing = trimmed.endsWith("/");
      const body = selfClosing ? trimmed.slice(0, -1).trim() : trimmed;
      const spaceIndex = body.search(/\s/);
      const tagName = spaceIndex === -1 ? body : body.slice(0, spaceIndex);
      const attrSource = spaceIndex === -1 ? "" : body.slice(spaceIndex + 1);
      const node: XmlNode = {
        name: localName(tagName),
        attrs: parseAttributes(attrSource),
        children: [],
        textParts: [],
      };

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node);
      } else {
        root = node;
      }

      if (!selfClosing) {
        stack.push(node);
      }

      index = endIndex;
      continue;
    }

    const nextTag = xml.indexOf("<", index);
    const text = nextTag === -1 ? xml.slice(index) : xml.slice(index, nextTag);
    if (stack.length > 0 && text.length > 0) {
      stack[stack.length - 1].textParts.push(text);
    }
    index = nextTag === -1 ? xml.length : nextTag;
  }

  if (!root) {
    throw new Error("No root XML element found");
  }

  return root;
}

function elementChildren(node: XmlNode, name?: string): XmlNode[] {
  if (!name) return node.children;
  return node.children.filter((child) => child.name === name);
}

function descendants(node: XmlNode, name?: string): XmlNode[] {
  const result: XmlNode[] = [];
  for (const child of node.children) {
    if (!name || child.name === name) {
      result.push(child);
    }
    result.push(...descendants(child, name));
  }
  return result;
}

function nodeText(node: XmlNode | undefined): string | null {
  if (!node) return null;
  const ownText = node.textParts.join("");
  const childText = node.children.map((child) => nodeText(child) ?? "").join("");
  return normalizeText(`${ownText}${childText}`);
}

function childText(node: XmlNode, name: string): string | null {
  return nodeText(elementChildren(node, name)[0]);
}

function namedTypesFrom(parent: XmlNode, name: string): NamedType[] {
  return elementChildren(parent, name).map((node) => ({
    name: node.attrs.name ?? "",
    class: node.attrs.class ?? null,
  }));
}

function variablesFrom(parent: XmlNode): VariableSummary[] {
  return elementChildren(parent, "variable").map((node) => ({
    name: node.attrs.name ?? "",
    class: node.attrs.class ?? null,
    calculation: node.attrs.calculation ?? null,
    resetType: node.attrs.resetType ?? null,
    expression: childText(node, "variableExpression"),
  }));
}

function groupsFrom(parent: XmlNode): GroupSummary[] {
  return elementChildren(parent, "group").map((node) => ({
    name: node.attrs.name ?? "",
    expression: childText(node, "groupExpression"),
  }));
}

function datasetsFrom(root: XmlNode): DatasetSummary[] {
  return elementChildren(root, "subDataset").map((dataset) => {
    const query = elementChildren(dataset, "queryString")[0];
    return {
      name: dataset.attrs.name ?? "",
      queryLanguage: query?.attrs.language ?? null,
      queryText: nodeText(query) ?? "",
      parameters: namedTypesFrom(dataset, "parameter"),
      fields: namedTypesFrom(dataset, "field"),
      variables: variablesFrom(dataset),
    };
  });
}

function subreportsFrom(root: XmlNode): SubreportSummary[] {
  return descendants(root, "subreport").map((subreport) => ({
    expression: childText(subreport, "subreportExpression"),
    connectionExpression: childText(subreport, "connectionExpression"),
    dataSourceExpression: childText(subreport, "dataSourceExpression"),
    parameters: elementChildren(subreport, "subreportParameter").map((parameter) => parameter.attrs.name ?? ""),
  }));
}

function componentsFrom(root: XmlNode): ComponentSummary[] {
  return descendants(root, "componentElement").map((componentElement) => {
    const component = componentElement.children.find((child) => child.name !== "reportElement") ?? null;
    const datasetRun = component ? descendants(component, "datasetRun")[0] ?? null : null;
    return {
      type: component?.name ?? "unknown",
      dataset: datasetRun?.attrs.subDataset ?? null,
      datasetParameters: datasetRun ? elementChildren(datasetRun, "datasetParameter").map((parameter) => parameter.attrs.name ?? "") : [],
    };
  });
}

function fontsFrom(root: XmlNode): FontSummary[] {
  const dedupe = new Map<string, FontSummary>();

  for (const node of descendants(root)) {
    const hasFontAttributes =
      node.name === "font" ||
      node.attrs.fontName !== undefined ||
      node.attrs.pdfFontName !== undefined ||
      node.attrs.pdfEncoding !== undefined ||
      node.attrs.isPdfEmbedded !== undefined;

    if (!hasFontAttributes) {
      continue;
    }

    const summary: FontSummary = {
      fontName: node.attrs.fontName ?? null,
      pdfFontName: node.attrs.pdfFontName ?? null,
      pdfEncoding: node.attrs.pdfEncoding ?? null,
      isPdfEmbedded: node.attrs.isPdfEmbedded ?? null,
    };

    const key = JSON.stringify(summary);
    if (!dedupe.has(key)) {
      dedupe.set(key, summary);
    }
  }

  return Array.from(dedupe.values());
}

function importsFrom(root: XmlNode): string[] {
  return elementChildren(root, "import")
    .map((node) => node.attrs.value ?? nodeText(node) ?? "")
    .filter((value) => value.length > 0);
}

function parseReport(filePath: string, rootPath: string): ReportSummary {
  const xml = readFileSync(filePath, "utf8");
  const warnings: string[] = [];
  let root: XmlNode;

  try {
    root = parseXml(xml);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnings.push(message);
    return {
      file: toPosixPath(relative(rootPath, filePath)),
      language: null,
      queryLanguage: null,
      queryText: "",
      parameters: [],
      fields: [],
      variables: [],
      groups: [],
      datasets: [],
      subreports: [],
      components: [],
      fonts: [],
      imports: [],
      warnings,
    };
  }

  const query = elementChildren(root, "queryString")[0];

  return {
    file: toPosixPath(relative(rootPath, filePath)),
    language: root.attrs.language ?? null,
    queryLanguage: query?.attrs.language ?? null,
    queryText: nodeText(query) ?? "",
    parameters: namedTypesFrom(root, "parameter"),
    fields: namedTypesFrom(root, "field"),
    variables: variablesFrom(root),
    groups: groupsFrom(root),
    datasets: datasetsFrom(root),
    subreports: subreportsFrom(root),
    components: componentsFrom(root),
    fonts: fontsFrom(root),
    imports: importsFrom(root),
    warnings,
  };
}

function renderMarkdown(reports: ReportSummary[]): string {
  if (reports.length === 0) {
    return "# JRXML Inventory\n\nNo `.jrxml` files found.\n";
  }

  const lines = ["# JRXML Inventory", ""];

  for (const report of reports) {
    lines.push(`## ${report.file}`);
    lines.push(`- language: ${report.language ?? "n/a"}`);
    lines.push(`- queryLanguage: ${report.queryLanguage ?? "n/a"}`);
    lines.push(`- queryText: ${report.queryText || "(empty)"}`);
    lines.push(`- parameters: ${report.parameters.map((item) => item.name).join(", ") || "(none)"}`);
    lines.push(`- fields: ${report.fields.map((item) => item.name).join(", ") || "(none)"}`);
    lines.push(`- variables: ${report.variables.map((item) => item.name).join(", ") || "(none)"}`);
    lines.push(`- groups: ${report.groups.map((item) => item.name).join(", ") || "(none)"}`);
    lines.push(`- datasets: ${report.datasets.map((item) => item.name).join(", ") || "(none)"}`);
    lines.push(`- subreports: ${report.subreports.length}`);
    lines.push(`- components: ${report.components.map((item) => item.type).join(", ") || "(none)"}`);
    lines.push(`- fonts: ${report.fonts.map((item) => item.fontName ?? item.pdfFontName ?? "unnamed").join(", ") || "(none)"}`);
    lines.push(`- imports: ${report.imports.join(", ") || "(none)"}`);
    if (report.warnings.length > 0) {
      lines.push(`- warnings: ${report.warnings.join(" | ")}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(HELP_TEXT);
      return;
    }

    const root = resolve(options.root);
    if (!existsSync(root) || !statSync(root).isDirectory()) {
      throw new Error(`Root directory not found: ${root}`);
    }

    const matcher = globToRegExp(options.glob);
    const reports = collectFiles(root)
      .filter((filePath) => matcher.test(toPosixPath(relative(root, filePath))))
      .map((filePath) => parseReport(filePath, root));

    if (options.format === "markdown") {
      process.stdout.write(renderMarkdown(reports));
      return;
    }

    process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

void main();
