import { asList, fail, parseArgs, readYamlMap, type JsonMap, writeFileEnsured } from "./_common";

function textBlobFromEvents(contract: JsonMap): string {
  const pieces: string[] = [];
  for (const key of ["domain_events", "integration_events"]) {
    for (const event of asList(contract[key])) {
      if (!event || typeof event !== "object" || Array.isArray(event)) continue;
      const e = event as JsonMap;
      for (const field of ["name", "trigger", "description", "notes", "consistency_note"]) {
        const v = e[field];
        if (typeof v === "string") pieces.push(v.toLowerCase());
      }
    }
  }
  return pieces.join("\n");
}

function validate(contract: JsonMap, strict: boolean): JsonMap {
  const aggregates = asList(contract.aggregates);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (aggregates.length === 0) {
    errors.push("No aggregates found. Provide at least one aggregate in 'aggregates'.");
  }

  const seenPairs = new Set<string>();
  const aggregateNames: Array<{ name: string; context: string; invariants: string[] }> = [];

  aggregates.forEach((agg, idx) => {
    const path = `aggregates[${idx}]`;
    if (!agg || typeof agg !== "object" || Array.isArray(agg)) {
      errors.push(`${path} must be a mapping`);
      return;
    }

    const a = agg as JsonMap;
    const name = String(a.name ?? "").trim();
    const context = String(a.context ?? "").trim();
    const repo = String(a.repository ?? "").trim();
    const invariantsRaw = a.invariants;

    if (!name) errors.push(`${path}.name is required`);
    if (!context) errors.push(`${path}.context is required`);
    if (!repo) warnings.push(`${path}.repository is empty`);

    const pair = `${context.toLowerCase()}::${name.toLowerCase()}`;
    if (context && name && seenPairs.has(pair)) {
      errors.push(`Duplicate aggregate name '${name}' in context '${context}'`);
    }
    if (context && name) seenPairs.add(pair);

    const cleanedInvariants: string[] = [];
    if (!Array.isArray(invariantsRaw) || invariantsRaw.length === 0) {
      errors.push(`${path}.invariants must be a non-empty list`);
    } else {
      invariantsRaw.forEach((inv, invIdx) => {
        if (typeof inv !== "string" || !inv.trim()) {
          errors.push(`${path}.invariants[${invIdx}] must be a non-empty string`);
          return;
        }
        cleanedInvariants.push(inv.trim());
      });
    }

    aggregateNames.push({ name, context, invariants: cleanedInvariants });
  });

  const eventText = textBlobFromEvents(contract);
  const lowered = aggregateNames
    .filter((a) => Boolean(a.name))
    .map((a) => ({ name: a.name.toLowerCase(), context: a.context, invariants: a.invariants }));

  for (const agg of lowered) {
    for (const invariant of agg.invariants) {
      const invariantLower = invariant.toLowerCase();
      for (const other of lowered) {
        if (other.name === agg.name) continue;
        const pat = new RegExp(`\\b${other.name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
        if (!pat.test(invariantLower)) continue;

        warnings.push(
          `Invariant in aggregate '${agg.name}' references aggregate '${other.name}'. Prefer ID references and eventual consistency.`,
        );

        const hasEvidence =
          (eventText.includes(agg.name) && eventText.includes(other.name)) ||
          eventText.includes("saga") ||
          eventText.includes("compens");

        if (!hasEvidence) {
          warnings.push(`Cross-aggregate reference '${agg.name}' -> '${other.name}' has no visible saga/event evidence.`);
        }
      }
    }
  }

  const passed = errors.length === 0 && (!strict || warnings.length === 0);
  return {
    passed,
    strict,
    errors,
    warnings,
    summary: {
      aggregate_count: aggregates.length,
      error_count: errors.length,
      warning_count: warnings.length,
    },
  };
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input;
  if (typeof input !== "string") fail("--input is required");

  const strict = Boolean(args.strict);
  const output = typeof args.output === "string" ? args.output : undefined;

  let report: JsonMap;
  try {
    report = validate(readYamlMap(input), strict);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  const text = JSON.stringify(report, null, 2);
  console.log(text);
  if (output) writeFileEnsured(output, `${text}\n`);

  process.exit(Boolean(report.passed) ? 0 : 1);
}

main();
