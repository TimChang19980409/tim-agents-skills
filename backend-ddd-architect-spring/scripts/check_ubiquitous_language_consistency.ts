import { asList, fail, parseArgs, readYamlMap, type JsonMap, writeFileEnsured } from "./_common";

function normalizeTerm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractTerms(contract: JsonMap): { terms: string[]; duplicates: string[]; undefinedTerms: string[] } {
  const terms: string[] = [];
  const duplicates: string[] = [];
  const undefinedTerms: string[] = [];
  const seen = new Set<string>();

  asList(contract.ubiquitous_language).forEach((item, idx) => {
    let term = "";
    let definition: unknown;

    if (typeof item === "string") {
      term = item.trim();
    } else if (item && typeof item === "object" && !Array.isArray(item)) {
      const map = item as JsonMap;
      term = String(map.term ?? "").trim();
      definition = map.definition;
    }

    const normalized = term ? normalizeTerm(term) : "";
    if (!normalized) {
      undefinedTerms.push(`ubiquitous_language[${idx}] has empty term`);
      return;
    }

    if (seen.has(normalized)) duplicates.push(term);
    seen.add(normalized);
    terms.push(normalized);

    if (item && typeof item === "object" && !Array.isArray(item)) {
      if (typeof definition !== "string" || !definition.trim()) {
        undefinedTerms.push(`term '${term}' has no definition`);
      }
    }
  });

  return { terms, duplicates, undefinedTerms };
}

function gatherText(contract: JsonMap): string {
  const fields = [
    "domain_vision",
    "subdomains",
    "bounded_contexts",
    "context_map_relationships",
    "aggregates",
    "domain_events",
    "integration_events",
    "api_contracts",
    "frontend_slices",
    "decision_log",
  ];

  const chunks: string[] = [];

  const walk = (value: unknown): void => {
    if (typeof value === "string") {
      chunks.push(value.toLowerCase());
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => walk(v));
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach((v) => walk(v));
    }
  };

  fields.forEach((field) => walk(contract[field]));
  return chunks.join("\n");
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildReport(contract: JsonMap, minCoverage: number): JsonMap {
  const { terms, duplicates, undefinedTerms } = extractTerms(contract);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (terms.length === 0) errors.push("No terms found in ubiquitous_language");
  if (duplicates.length > 0) errors.push(`Duplicate terms: ${JSON.stringify([...new Set(duplicates)].sort())}`);
  if (undefinedTerms.length > 0) warnings.push(...undefinedTerms);

  const text = gatherText(contract);
  const usedTerms: string[] = [];
  const unusedTerms: string[] = [];

  terms.forEach((term) => {
    const pat = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
    if (pat.test(text)) usedTerms.push(term);
    else unusedTerms.push(term);
  });

  const coverage = terms.length === 0 ? 0 : usedTerms.length / terms.length;
  if (coverage < minCoverage) {
    warnings.push(
      `Coverage ${(coverage * 100).toFixed(2)}% is below min-coverage ${(minCoverage * 100).toFixed(2)}%. Add terms to architecture artifacts or remove unused terms.`,
    );
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    summary: {
      term_count: terms.length,
      used_term_count: usedTerms.length,
      unused_term_count: unusedTerms.length,
      coverage: Number(coverage.toFixed(4)),
      min_coverage: minCoverage,
    },
    unused_terms: unusedTerms,
  };
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input;
  if (typeof input !== "string") fail("--input is required");

  const minCoverageRaw = args["min-coverage"];
  const minCoverage = typeof minCoverageRaw === "string" ? Number(minCoverageRaw) : 0.7;
  if (Number.isNaN(minCoverage) || minCoverage < 0 || minCoverage > 1) {
    fail("--min-coverage must be between 0 and 1");
  }

  const output = typeof args.output === "string" ? args.output : undefined;

  let report: JsonMap;
  try {
    report = buildReport(readYamlMap(input), minCoverage);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  const text = JSON.stringify(report, null, 2);
  console.log(text);
  if (output) writeFileEnsured(output, `${text}\n`);

  process.exit(Boolean(report.passed) ? 0 : 1);
}

main();
