#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

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
  evalIds: Set<number> | null;
  help: boolean;
};

type GradedExpectation = {
  text: string;
  passed: boolean;
  evidence: string;
};

type RunSummary = {
  label: string;
  passRate: number;
  total: number;
  passed: number;
  tokens: number | null;
};

const HELP_TEXT = `Usage:
  bun scripts/grade_opencode_evals.ts [--workspace <path>] [--eval <ids>]

Options:
  --workspace <path>  Iteration workspace (default: ../spring-persistence-engineer-workspace/iteration-1)
  --skill-root <path> Skill root (default: parent of this scripts directory)
  --eval <ids>        Comma-separated eval ids, for example 1 or 1,4
  --help              Show this help text
`;

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes("--help")) {
    return {
      workspace: "",
      skillRoot: "",
      evalIds: null,
      help: true,
    };
  }

  let workspace = resolve(import.meta.dir, "..", "..", "spring-persistence-engineer-workspace", "iteration-1");
  let skillRoot = resolve(import.meta.dir, "..");
  let evalIds: Set<number> | null = null;

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
    throw new Error(`Unsupported argument: ${arg}`);
  }

  return { workspace, skillRoot, evalIds, help: false };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function containsPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
}

function countDistinctVendors(text: string): number {
  const vendors = [
    /postgres(?:ql)?/i,
    /mysql/i,
    /mariadb/i,
    /sql server/i,
    /oracle/i,
  ];
  return vendors.filter((pattern) => pattern.test(text)).length;
}

function officialCitationExpectation(text: string): GradedExpectation {
  const evidence = containsPattern(text, [
    /docs\.spring\.io/i,
    /docs\.hibernate\.org/i,
    /docs\.jboss\.org/i,
    /jakarta\.ee\//i,
    /postgresql\.org\/docs/i,
    /dev\.mysql\.com\/doc/i,
    /mariadb\.com\/kb/i,
    /learn\.microsoft\.com/i,
    /docs\.oracle\.com/i,
  ]);

  return {
    text: "The answer cites at least one official Spring, Hibernate, or vendor source.",
    passed: evidence !== null,
    evidence: evidence ? `Matched official source marker: ${evidence}` : "No official source URL found.",
  };
}

function repoGroundingExpectation(text: string, files: string[]): GradedExpectation {
  const basenames = files.map((filePath) => filePath.split("/").pop() ?? filePath);
  const stems = basenames.map((name) => name.replace(/\.[^.]+$/, ""));
  const fileMatch = basenames.find((name) => text.toLowerCase().includes(name.toLowerCase()));
  const stemMatch = stems.find((name) => name.length > 0 && text.toLowerCase().includes(name.toLowerCase()));
  const genericMatch = containsPattern(text, [/pom\.xml/i, /@Entity/i, /@Version/i, /@EntityGraph/i, /application\.yml/i]);

  return {
    text: "The answer grounds the recommendation in local repo artifacts before proposing a fix.",
    passed: Boolean(fileMatch || stemMatch || genericMatch),
    evidence: fileMatch
      ? `Matched file reference: ${fileMatch}`
      : stemMatch
        ? `Matched file stem: ${stemMatch}`
      : genericMatch
        ? `Matched repo-grounding term: ${genericMatch}`
        : "No file-specific or repo-specific grounding terms found.",
  };
}

function laneExpectation(text: string, lane: "boot3" | "boot4"): GradedExpectation {
  const boot3Match = /boot 3(?:\.5)?|hibernate 6(?:\.6)?|jakarta persistence 3\.1/i.test(text);
  const boot4Match = /boot 4(?:\.0)?|hibernate 7(?:\.2)?|jakarta persistence 3\.2/i.test(text);
  const passed = lane === "boot3" ? boot3Match && !/use hibernate 7 directly on boot 3/i.test(text) : boot4Match;

  return {
    text: lane === "boot3" ? "The answer identifies the Boot 3.5 / Hibernate 6.6 lane." : "The answer identifies the Boot 4 / Hibernate 7.2 lane.",
    passed,
    evidence: passed ? "Detected the expected compatibility lane." : "The expected lane was not stated clearly.",
  };
}

function vendorComparisonExpectation(text: string, minVendors: number): GradedExpectation {
  const count = countDistinctVendors(text);
  return {
    text: `The answer compares at least ${minVendors} distinct RDBMS vendors.`,
    passed: count >= minVendors,
    evidence: `Detected ${count} vendor names.`,
  };
}

function evalSpecificExpectations(evalCase: EvalCase, text: string): GradedExpectation[] {
  if (evalCase.id === 1) {
    return [
      laneExpectation(text, "boot3"),
      {
        text: "The answer discusses identifier strategy tradeoffs for Boot 3 / Hibernate 6.",
        passed: /sequence|identity|uuid/i.test(text),
        evidence: containsPattern(text, [/sequence/i, /identity/i, /uuid/i]) ?? "No identifier strategy term found.",
      },
    ];
  }

  if (evalCase.id === 2) {
    return [
      laneExpectation(text, "boot4"),
      {
        text: "The answer mentions JSON mapping or SQL type handling for Hibernate 7.",
        passed: /json|SqlTypes\.JSON|@JdbcTypeCode/i.test(text),
        evidence: containsPattern(text, [/json/i, /SqlTypes\.JSON/i, /@JdbcTypeCode/i]) ?? "No JSON mapping clue found.",
      },
    ];
  }

  if (evalCase.id === 3) {
    return [
      {
        text: "The answer distinguishes PostgreSQL jsonb from a fully normalized design.",
        passed: /postgres(?:ql)?.*jsonb|jsonb.*normalize|normalized/i.test(text),
        evidence: containsPattern(text, [/jsonb/i, /normalized/i]) ?? "No jsonb or normalization clue found.",
      },
    ];
  }

  if (evalCase.id === 4) {
    return [
      {
        text: "The answer discusses MySQL UUID storage explicitly.",
        passed: /mysql/i.test(text) && /(binary\(16\)|char\(36\)|uuid_to_bin|uuid)/i.test(text),
        evidence: containsPattern(text, [/binary\(16\)/i, /char\(36\)/i, /uuid_to_bin/i, /uuid/i]) ?? "No MySQL UUID storage clue found.",
      },
    ];
  }

  if (evalCase.id === 5) {
    return [
      {
        text: "The answer calls out MariaDB JSON alias behavior instead of assuming MySQL parity.",
        passed: /mariadb/i.test(text) && /(alias|longtext|not the same as mysql|json alias)/i.test(text),
        evidence: containsPattern(text, [/alias/i, /longtext/i, /not the same as mysql/i]) ?? "No MariaDB JSON alias clue found.",
      },
    ];
  }

  if (evalCase.id === 6) {
    return [
      vendorComparisonExpectation(text, 3),
      {
        text: "The answer discusses SQL Server or Oracle identity and UUID tradeoffs.",
        passed: /(sql server|oracle)/i.test(text) && /(identity|uniqueidentifier|sys_guid|sequence)/i.test(text),
        evidence: containsPattern(text, [/identity/i, /uniqueidentifier/i, /sys_guid/i, /sequence/i]) ?? "No SQL Server/Oracle identifier clue found.",
      },
    ];
  }

  if (evalCase.id === 7) {
    return [
      {
        text: "The answer proposes a fetch-plan fix such as @EntityGraph, join fetch, or projection.",
        passed: /@EntityGraph|entity graph|join fetch|projection/i.test(text),
        evidence: containsPattern(text, [/@EntityGraph/i, /entity graph/i, /join fetch/i, /projection/i]) ?? "No fetch-plan clue found.",
      },
    ];
  }

  if (evalCase.id === 8) {
    return [
      {
        text: "The answer mentions optimistic or pessimistic locking and a transaction boundary.",
        passed: /@Version|optimistic|pessimistic|transaction/i.test(text),
        evidence: containsPattern(text, [/@Version/i, /optimistic/i, /pessimistic/i, /transaction/i]) ?? "No locking clue found.",
      },
    ];
  }

  if (evalCase.id === 9) {
    return [
      {
        text: "The answer recommends projections, Specifications, or both.",
        passed: /projection|specification/i.test(text),
        evidence: containsPattern(text, [/projection/i, /specification/i]) ?? "No projections or Specifications clue found.",
      },
    ];
  }

  if (evalCase.id === 10) {
    return [
      {
        text: "The answer discusses batching and persistence-context hygiene.",
        passed: /batch|flush|clear|persistence context/i.test(text),
        evidence: containsPattern(text, [/batch/i, /flush/i, /clear/i, /persistence context/i]) ?? "No batching clue found.",
      },
      {
        text: "The answer calls out identity or sequence implications for batching.",
        passed: /identity|sequence/i.test(text),
        evidence: containsPattern(text, [/identity/i, /sequence/i]) ?? "No identity or sequence clue found.",
      },
    ];
  }

  if (evalCase.id === 11) {
    return [
      {
        text: "The answer mentions soft delete, auditing, and migration-first strategy.",
        passed: /soft delete|deleted_at|audit|createdDate|migration|ddl-auto/i.test(text),
        evidence: containsPattern(text, [/soft delete/i, /deleted_at/i, /audit/i, /migration/i, /ddl-auto/i]) ?? "No soft delete or migration clue found.",
      },
    ];
  }

  if (evalCase.id === 12) {
    return [
      vendorComparisonExpectation(text, 4),
      {
        text: "The answer frames the result as a portability decision rather than one-vendor syntax.",
        passed: /portab|cross[- ]vendor|tradeoff/i.test(text),
        evidence: containsPattern(text, [/portab/i, /cross[- ]vendor/i, /tradeoff/i]) ?? "No portability framing clue found.",
      },
    ];
  }

  return [];
}

function gradeRun(evalCase: EvalCase, text: string): GradedExpectation[] {
  return [
    officialCitationExpectation(text),
    repoGroundingExpectation(text, evalCase.files),
    ...evalSpecificExpectations(evalCase, text),
  ];
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  const manifest = JSON.parse(readFileSync(join(options.skillRoot, "evals", "evals.json"), "utf8")) as EvalManifest;
  const evalCases = manifest.evals.filter((evalCase) => !options.evalIds || options.evalIds.has(evalCase.id));

  const benchmarkRows: Array<{
    eval_id: number;
    eval_name: string;
    with_skill: RunSummary | null;
    without_skill: RunSummary | null;
    delta: number | null;
  }> = [];

  for (const evalCase of evalCases) {
    const evalDir = join(options.workspace, `eval-${evalCase.id}-${slugify(evalCase.name ?? `eval-${evalCase.id}`)}`);
    const runSummaries = new Map<string, RunSummary>();

    for (const configName of ["with_skill", "without_skill"] as const) {
      const runDir = join(evalDir, configName);
      const finalPath = join(runDir, "outputs", "final.md");
      if (!existsSync(finalPath)) {
        continue;
      }

      const text = readFileSync(finalPath, "utf8");
      const expectations = gradeRun(evalCase, text);
      const passed = expectations.filter((item) => item.passed).length;
      const total = expectations.length;
      const passRate = total === 0 ? 0 : passed / total;

      const runMetadataPath = join(runDir, "run.json");
      const runMetadata = existsSync(runMetadataPath)
        ? (JSON.parse(readFileSync(runMetadataPath, "utf8")) as { duration_ms?: number; tokens?: { total?: number } })
        : {};

      writeJson(join(runDir, "grading.json"), {
        expectations,
        summary: {
          passed,
          failed: total - passed,
          total,
          pass_rate: Number(passRate.toFixed(4)),
        },
        execution_metrics: {
          tool_calls: {},
          total_tool_calls: 0,
          total_steps: 0,
          errors_encountered: 0,
          output_chars: text.length,
          transcript_chars: existsSync(join(runDir, "outputs", "raw.jsonl")) ? readFileSync(join(runDir, "outputs", "raw.jsonl"), "utf8").length : 0,
        },
        timing: {
          total_duration_seconds:
            typeof runMetadata.duration_ms === "number"
              ? Number((runMetadata.duration_ms / 1000).toFixed(1))
              : null,
        },
        claims: [],
        user_notes_summary: {
          uncertainties: [],
          needs_review: [],
          workarounds: [],
        },
      });

      runSummaries.set(configName, {
        label: configName,
        passRate,
        total,
        passed,
        tokens: runMetadata.tokens?.total ?? null,
      });
    }

    const withSkill = runSummaries.get("with_skill") ?? null;
    const withoutSkill = runSummaries.get("without_skill") ?? null;
    benchmarkRows.push({
      eval_id: evalCase.id,
      eval_name: evalCase.name ?? `eval-${evalCase.id}`,
      with_skill: withSkill,
      without_skill: withoutSkill,
      delta: withSkill && withoutSkill ? Number((withSkill.passRate - withoutSkill.passRate).toFixed(4)) : null,
    });
  }

  const comparableRows = benchmarkRows.filter((row) => row.with_skill && row.without_skill);
  const wins = comparableRows.filter((row) => row.delta !== null && row.delta > 0).length;

  const average = (selector: (row: typeof benchmarkRows[number]) => number | null): number | null => {
    const values = comparableRows.map(selector).filter((value): value is number => value !== null);
    if (values.length === 0) return null;
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
  };

  writeJson(join(options.workspace, "benchmark.json"), {
    skill_name: manifest.skill_name,
    generated_at: new Date().toISOString(),
    rows: benchmarkRows,
    summary: {
      comparable_evals: comparableRows.length,
      with_skill_average_pass_rate: average((row) => row.with_skill?.passRate ?? null),
      without_skill_average_pass_rate: average((row) => row.without_skill?.passRate ?? null),
      with_skill_wins: wins,
    },
  });

  const markdown = [
    `# ${manifest.skill_name} Benchmark`,
    "",
    "| Eval | With Skill | Baseline | Delta |",
    "| --- | --- | --- | --- |",
    ...benchmarkRows.map((row) => {
      const withSkill = row.with_skill ? `${Math.round(row.with_skill.passRate * 100)}% (${row.with_skill.passed}/${row.with_skill.total})` : "n/a";
      const withoutSkill = row.without_skill ? `${Math.round(row.without_skill.passRate * 100)}% (${row.without_skill.passed}/${row.without_skill.total})` : "n/a";
      const delta = row.delta === null ? "n/a" : `${row.delta > 0 ? "+" : ""}${(row.delta * 100).toFixed(0)}%`;
      return `| ${row.eval_name} | ${withSkill} | ${withoutSkill} | ${delta} |`;
    }),
    "",
    `- comparable evals: ${comparableRows.length}`,
    `- with-skill wins: ${wins}`,
  ].join("\n");

  writeFileSync(join(options.workspace, "benchmark.md"), `${markdown}\n`, "utf8");
  process.stdout.write(`Graded ${benchmarkRows.length} eval(s) in ${options.workspace}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
