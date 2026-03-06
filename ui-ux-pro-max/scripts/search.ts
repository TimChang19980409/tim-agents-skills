#!/usr/bin/env bun
/**
 * UI/UX Pro Max Search - BM25 search engine for UI/UX style guides
 * Usage: bun scripts/search.ts "<query>" [--domain <domain>] [--stack <stack>] [--max-results 3]
 *        bun scripts/search.ts "<query>" --design-system [-p "Project Name"]
 *        bun scripts/search.ts "<query>" --design-system --persist [-p "Project Name"] [--page "dashboard"]
 */

import { AVAILABLE_STACKS, CSV_CONFIG, MAX_RESULTS, search, searchStack } from "./core.ts";
import { generateDesignSystem } from "./design_system.ts";

type ParsedArgs = {
  query: string;
  domain?: string;
  stack?: string;
  maxResults: number;
  asJson: boolean;
  designSystem: boolean;
  projectName?: string;
  format: "ascii" | "markdown";
  persist: boolean;
  page?: string;
  outputDir?: string;
};

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = {
    query: "",
    maxResults: MAX_RESULTS,
    asJson: false,
    designSystem: false,
    format: "ascii",
    persist: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith("-") && !out.query) {
      out.query = token;
      continue;
    }

    switch (token) {
      case "--domain":
      case "-d":
        out.domain = argv[++i];
        break;
      case "--stack":
      case "-s":
        out.stack = argv[++i];
        break;
      case "--max-results":
      case "-n":
        out.maxResults = Number(argv[++i] ?? MAX_RESULTS);
        break;
      case "--json":
        out.asJson = true;
        break;
      case "--design-system":
      case "-ds":
        out.designSystem = true;
        break;
      case "--project-name":
      case "-p":
        out.projectName = argv[++i];
        break;
      case "--format":
      case "-f": {
        const value = argv[++i];
        out.format = value === "markdown" ? "markdown" : "ascii";
        break;
      }
      case "--persist":
        out.persist = true;
        break;
      case "--page":
        out.page = argv[++i];
        break;
      case "--output-dir":
      case "-o":
        out.outputDir = argv[++i];
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      default:
        break;
    }
  }

  if (!out.query) {
    printHelp();
    process.exit(1);
  }

  return out;
}

function printHelp(): void {
  console.log("UI/UX Pro Max Search");
  console.log();
  console.log("Usage:");
  console.log("  bun scripts/search.ts \"<query>\" [--domain <domain>] [--stack <stack>] [--max-results 3]");
  console.log("  bun scripts/search.ts \"<query>\" --design-system [-p \"Project Name\"]");
  console.log("  bun scripts/search.ts \"<query>\" --design-system --persist [-p \"Project Name\"] [--page \"dashboard\"]");
  console.log();
  console.log(`Domains: ${Object.keys(CSV_CONFIG).join(", ")}`);
  console.log(`Stacks: ${AVAILABLE_STACKS.join(", ")}`);
}

function formatOutput(result: Record<string, unknown>): string {
  if (result.error) {
    return `Error: ${result.error}`;
  }

  const output: string[] = [];
  if (result.stack) {
    output.push("## UI Pro Max Stack Guidelines");
    output.push(`**Stack:** ${result.stack} | **Query:** ${result.query}`);
  } else {
    output.push("## UI Pro Max Search Results");
    output.push(`**Domain:** ${result.domain} | **Query:** ${result.query}`);
  }

  output.push(`**Source:** ${result.file} | **Found:** ${result.count} results\n`);

  const rows = Array.isArray(result.results) ? (result.results as Array<Record<string, unknown>>) : [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    output.push(`### Result ${i + 1}`);
    for (const [key, value] of Object.entries(row)) {
      let valueStr = String(value ?? "");
      if (valueStr.length > 300) {
        valueStr = `${valueStr.slice(0, 300)}...`;
      }
      output.push(`- **${key}:** ${valueStr}`);
    }
    output.push("");
  }

  return output.join("\n");
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.designSystem) {
    const result = generateDesignSystem(args.query, args.projectName, args.format, args.persist, args.page, args.outputDir);
    console.log(result);

    if (args.persist) {
      const projectSlug = (args.projectName ?? "default").toLowerCase().replace(/\s+/g, "-");
      console.log(`\n${"=".repeat(60)}`);
      console.log(`✅ Design system persisted to design-system/${projectSlug}/`);
      console.log(`   📄 design-system/${projectSlug}/MASTER.md (Global Source of Truth)`);
      if (args.page) {
        const pageFilename = args.page.toLowerCase().replace(/\s+/g, "-");
        console.log(`   📄 design-system/${projectSlug}/pages/${pageFilename}.md (Page Overrides)`);
      }
      console.log("");
      console.log(`📖 Usage: When building a page, check design-system/${projectSlug}/pages/[page].md first.`);
      console.log(`   If exists, its rules override MASTER.md. Otherwise, use MASTER.md.`);
      console.log("=".repeat(60));
    }
    return;
  }

  if (args.stack) {
    const result = searchStack(args.query, args.stack, args.maxResults);
    if (args.asJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatOutput(result));
    }
    return;
  }

  const result = search(args.query, args.domain, args.maxResults);
  if (args.asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatOutput(result));
  }
}

if (import.meta.main) {
  main();
}
