#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
  --workspace <path>  Iteration workspace (default: ../jasperreports-engineer-workspace/iteration-1)
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

  let workspace = resolve(import.meta.dir, "..", "..", "jasperreports-engineer-workspace", "iteration-1");
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

function containsPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
}

function officialCitationExpectation(text: string): GradedExpectation {
  const evidence = containsPattern(text, [
    /jasperreports\.sourceforge\.net/i,
    /community\.jaspersoft\.com/i,
    /github\.com\/Jaspersoft\/jasperreports/i,
  ]);

  return {
    text: "The answer cites at least one official JasperReports or Jaspersoft source.",
    passed: evidence !== null,
    evidence: evidence ? `Matched official source marker: ${evidence}` : "No official source URL found.",
  };
}

function repoGroundingExpectation(text: string, files: string[]): GradedExpectation {
  const basenames = files.map((filePath) => filePath.split("/").pop() ?? filePath);
  const fileMatch = basenames.find((name) => text.toLowerCase().includes(name.toLowerCase()));
  const genericMatch = containsPattern(text, [/pom\.xml/i, /\.jrxml/i, /JasperFillManager/i, /JRBeanCollectionDataSource/i]);

  return {
    text: "The answer grounds the diagnosis in local repo artifacts before proposing a fix.",
    passed: Boolean(fileMatch || genericMatch),
    evidence: fileMatch
      ? `Matched file reference: ${fileMatch}`
      : genericMatch
        ? `Matched repo-grounding term: ${genericMatch}`
        : "No file-specific or repo-specific grounding terms found.",
  };
}

function serverBoundaryExpectation(text: string): GradedExpectation {
  const mentionsServer = /jasperreports server|jasperserver/i.test(text);
  const explicitBoundary = /not .*jasperreports server|outside .*jasperreports server|without .*jasperreports server/i.test(text);

  return {
    text: "The answer stays within JasperReports Library or Studio scope and does not prescribe JasperReports Server.",
    passed: !mentionsServer || explicitBoundary,
    evidence: mentionsServer && !explicitBoundary ? "Detected JasperReports Server guidance." : "No JasperReports Server drift detected.",
  };
}

function evalSpecificExpectations(evalCase: EvalCase, text: string): GradedExpectation[] {
  if (evalCase.id === 1) {
    const datasourceMatch = containsPattern(text, [
      /REPORT_CONNECTION/i,
      /dataSourceExpression/i,
      /JRBeanCollectionDataSource/i,
      /LINE_ITEMS_DATA_SOURCE/i,
      /subreportParameter/i,
    ]);
    return [
      {
        text: "The answer identifies the subreport datasource or parameter wiring issue.",
        passed: datasourceMatch !== null,
        evidence: datasourceMatch ? `Matched datasource wiring term: ${datasourceMatch}` : "No subreport datasource or parameter wiring clue found.",
      },
    ];
  }

  if (evalCase.id === 2) {
    const recompileMatch = containsPattern(text, [/recompile/i, /re-compile/i, /compiled .*same version/i, /regenerate .*\.jasper/i]);
    const versionMatch = containsPattern(text, [/version mismatch/i, /6\.x/i, /7\.0/i, /old \.jasper/i, /stale .*\.jasper/i]);
    return [
      {
        text: "The answer recommends recompiling or regenerating templates with the runtime JasperReports version.",
        passed: recompileMatch !== null,
        evidence: recompileMatch ? `Matched recompilation term: ${recompileMatch}` : "No recompilation guidance found.",
      },
      {
        text: "The answer calls out a 6.x to 7.x or stale .jasper version mismatch risk.",
        passed: versionMatch !== null,
        evidence: versionMatch ? `Matched migration term: ${versionMatch}` : "No migration mismatch clue found.",
      },
    ];
  }

  if (evalCase.id === 3) {
    const fontExtensionMatch = containsPattern(text, [/font extension/i, /fonts\.xml/i, /JRFontNotFoundException/i]);
    const encodingMatch = containsPattern(text, [/Identity-H/i, /pdfEncoding/i]);
    const embedMatch = containsPattern(text, [/isPdfEmbedded/i, /embedded/i]);
    return [
      {
        text: "The answer recommends packaging a JasperReports font extension or equivalent runtime font bundle.",
        passed: fontExtensionMatch !== null,
        evidence: fontExtensionMatch ? `Matched font packaging term: ${fontExtensionMatch}` : "No font extension guidance found.",
      },
      {
        text: "The answer mentions Unicode-safe PDF encoding such as Identity-H or pdfEncoding.",
        passed: encodingMatch !== null,
        evidence: encodingMatch ? `Matched encoding term: ${encodingMatch}` : "No PDF encoding guidance found.",
      },
      {
        text: "The answer mentions embedding the font for PDF export portability.",
        passed: embedMatch !== null,
        evidence: embedMatch ? `Matched embedding term: ${embedMatch}` : "No font embedding guidance found.",
      },
    ];
  }

  if (evalCase.id === 4) {
    const virtualizerMatch = containsPattern(text, [/REPORT_VIRTUALIZER/i, /JRSwapFileVirtualizer/i, /JRFileVirtualizer/i]);
    const compileMatch = containsPattern(text, [/compile once/i, /cache/i, /precompile/i, /\.jasper/i, /JasperCompileManager/i]);
    const jsonMatch = containsPattern(text, [/JsonDataSource/i, /JSON/i]);
    return [
      {
        text: "The answer recommends a JasperReports virtualizer for the large fill operation.",
        passed: virtualizerMatch !== null,
        evidence: virtualizerMatch ? `Matched virtualizer term: ${virtualizerMatch}` : "No virtualizer guidance found.",
      },
      {
        text: "The answer distinguishes compile strategy from runtime fill or export work.",
        passed: compileMatch !== null,
        evidence: compileMatch ? `Matched compile strategy term: ${compileMatch}` : "No compile or cache guidance found.",
      },
      {
        text: "The answer recognizes the JSON datasource context.",
        passed: jsonMatch !== null,
        evidence: jsonMatch ? `Matched JSON term: ${jsonMatch}` : "No JSON datasource clue found.",
      },
    ];
  }

  return [];
}

function gradeRun(evalCase: EvalCase, text: string): GradedExpectation[] {
  return [
    officialCitationExpectation(text),
    repoGroundingExpectation(text, evalCase.files),
    serverBoundaryExpectation(text),
    ...evalSpecificExpectations(evalCase, text),
  ];
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
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

  const wins = benchmarkRows.filter((row) => row.delta !== null && row.delta > 0).length;
  const comparableRows = benchmarkRows.filter((row) => row.with_skill && row.without_skill);
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
