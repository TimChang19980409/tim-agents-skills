---
name: jasperreports-engineer
description: |
  Analyze, troubleshoot, and implement JasperReports Library and Jaspersoft Studio work in Java repos.
  Use when requests mention JasperReports, JRXML, Jaspersoft Studio, JasperFillManager, JasperExportManager,
  JRBeanCollectionDataSource, subreports, datasetRun, font extensions, virtualizers, PDF/XLS/HTML export,
  or 6.x/7.x migration. Read local JRXML, build, and integration files first, prefer official Jasper docs
  before community sources, and end research-backed answers with a `## Sources` section that includes at least
  one official JasperReports or Jaspersoft URL. Do not use for JasperReports Server unless explicitly asked.
---

# JasperReports Engineer

Use this skill for JasperReports Library and Jaspersoft Studio implementation work inside Java repositories.
This skill is optimized for repo-grounded diagnosis and concrete fixes, not generic JasperReports Server guidance.

## Scope And Boundaries

- Cover JRXML authoring, compile and fill pipelines, exporter behavior, Studio preview/runtime mismatches, fonts, subreports, datasets, and migration issues.
- Read local `*.jrxml`, `*.jasper`, `pom.xml` or Gradle files, and Java or Spring integration code before concluding.
- Prefer official JasperReports and Jaspersoft sources first.
- Use community links only to supplement official docs with common failure modes or migration anecdotes.
- Do not drift into JasperReports Server repository, scheduling, or server deployment advice unless the user explicitly asks for that product.

## Workflow

1. Inventory the repo.
- Find report templates with `rg --files -g '*.jrxml' -g '*.jasper'`.
- Find runtime integration points with `rg -n "Jasper(Fill|Export|Compile|Print)|JRBeanCollectionDataSource|JsonDataSource|JRSwapFileVirtualizer|JRFileVirtualizer|JasperReportsContext"`.
- Inspect `pom.xml`, `build.gradle*`, and any Studio metadata or report resource directories.

2. Summarize report structure before deep reading.
- Run `bun scripts/jrxml_inventory.ts --root <path> --format json` when JRXML files are present.
- Use the inventory output to identify parameters, datasets, subreports, components, fonts, and query language before opening full templates.

3. Classify the task.
- Choose one primary lane: `new-report`, `runtime-error`, `studio-runtime-mismatch`, `font-export`, `performance`, or `migration`.
- Keep the primary lane explicit in the answer so the user sees the reasoning frame.

4. Diagnose from local evidence first.
- Anchor the root cause in file names, parameter names, expressions, exporter calls, or version declarations from the repo.
- If evidence is incomplete, say what is inferred versus directly observed.

5. Pull the minimum official references needed.
- Load only the relevant reference file from `references/`.
- Follow the official-source map before reaching for community sources.
- When the answer is research-backed, carry at least one direct official URL from the reference file into the final response.
- Do not treat generic mentions such as "Ultimate Guide", "Context7", or "official docs" as a substitute for an actual official JasperReports or Jaspersoft link.

6. Recommend the smallest safe fix.
- Prefer parameter wiring, datasource corrections, version alignment, or compile-cache fixes before broad rewrites.
- When Studio preview differs from app runtime, explain both sides separately.

## Canonical Official URLs

Use at least one exact URL from this list in every research-backed answer. Pick the URL that matches the primary lane.

- Subreport and datasource runtime issues: `https://jasperreports.sourceforge.net/sample.reference/subreport/README.html`
- Table or datasetRun issues: `https://jasperreports.sourceforge.net/sample.reference/table/README.html`
- Bean datasource API details: `https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/data/JRBeanCollectionDataSource.html`
- Font and PDF export issues: `https://jasperreports.sourceforge.net/sample.reference/fonts/README.html`
- Font runtime exception details: `https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html`
- Performance and virtualizer issues: `https://jasperreports.sourceforge.net/sample.reference/virtualizer/README.html`
- Configuration properties: `https://jasperreports.sourceforge.net/config.reference.html`
- Fill pipeline and runtime API details: `https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JasperFillManager.html`
- Studio preview and compatibility issues: `https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/`
- 6.x to 7.x migration and release status: `https://github.com/Jaspersoft/jasperreports/releases`

Never cite `Context7`, generic "official docs", or a bare GitHub repo root as the only source when a more specific canonical URL above exists.

## Lane Checklists

Apply the checklist for the primary lane before finalizing the answer.

### `runtime-error`
- State whether the failing pattern is JDBC connection based or `JRDataSource` based.
- If a subreport or child dataset uses beans or JSON, prefer `dataSourceExpression` over `REPORT_CONNECTION`.
- If the fix depends on a field or parameter not shown in the repo, label it as an inference.
- Include a direct official URL for the relevant datasource or subreport sample.
- If the issue is specifically a subreport or blank child report, end with this exact line in `## Sources`:
  - `Official: https://jasperreports.sourceforge.net/sample.reference/subreport/README.html`

### `font-export`
- Always check and mention all three when PDF output is involved:
  - runtime font packaging via JasperReports font extension
  - Unicode-safe encoding such as `Identity-H`
  - embedded font output via `isPdfEmbedded="true"` or `<pdfEmbedded>true</pdfEmbedded>`
- If the repo already has one of these correct, say which pieces remain missing instead of repeating all three as broken.
- Include at least one exact official font URL and preferably the `JRFontNotFoundException` Javadoc when that exception appears.

### `performance`
- Distinguish compile cost from fill or export cost.
- Check for `REPORT_VIRTUALIZER` or virtualizer classes before suggesting heap tuning.
- Prefer a specific official virtualizer or configuration URL.

### `migration`
- Say which runtime version was observed in the build.
- Call out stale `.jasper` binaries and recompilation risk explicitly.
- Include the official releases URL and one runtime or Studio compatibility source when possible.

## Response Contract

Use this exact structure unless the user explicitly asks for another format:

## Context
- Summarize the repo artifacts inspected.
- State the JasperReports version if it can be determined.
- Name the primary lane.

## Likely Root Cause
- Explain the most probable cause grounded in observed files or expressions.
- Separate direct evidence from inference.

## Proposed Fix
- Give the minimum code or JRXML change needed.
- Mention any version or compatibility constraints.

## Validation Steps
- List 2 to 5 checks, commands, or render scenarios to verify the fix.
- Prefer local verification over theoretical advice.

## Sources
- Link at least one official JasperReports or Jaspersoft source.
- Use a fully qualified URL from `references/official-map.md`, not just a product or document name.
- Add community sources only when they clarify a real edge case.
- Prefer this exact format:
  - `Official: https://...`
  - `Official: https://...`
  - `Community: https://...` when needed

### Source Examples

Copy the relevant example line directly when it matches the lane:

- `Official: https://jasperreports.sourceforge.net/sample.reference/subreport/README.html`
- `Official: https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/data/JRBeanCollectionDataSource.html`
- `Official: https://jasperreports.sourceforge.net/sample.reference/fonts/README.html`
- `Official: https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html`
- `Official: https://jasperreports.sourceforge.net/sample.reference/virtualizer/README.html`
- `Official: https://jasperreports.sourceforge.net/config.reference.html`
- `Official: https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/`
- `Official: https://github.com/Jaspersoft/jasperreports/releases`

Do not omit the `## Sources` section. If the answer currently has no `## Sources` section, rewrite it before sending.
Do not rename this section to `Reference`, `References`, or any other heading.

## Quality Gates

1. Mention the actual local files inspected whenever they exist.
2. Keep JasperReports Library or Studio advice separate from JasperReports Server.
3. Cite at least one official source in research-backed answers.
4. Put the official source URL in the `Sources` section, not only in the reasoning text.
5. Call out version mismatch risk whenever `.jasper` binaries and runtime library versions differ.
6. For performance issues, check compile strategy and virtualization before suggesting heap-only fixes.
7. For PDF font issues, mention embedding explicitly unless the repo already proves the font is embedded.
8. Before sending, scan the final answer: if no literal `https://jasperreports.sourceforge.net/`, `https://community.jaspersoft.com/`, or `https://github.com/Jaspersoft/jasperreports/releases` appears in `Sources`, revise the answer.

## Resources

1. `references/official-map.md`: official-first source routing by issue type.
2. `references/runtime-playbook.md`: compile, fill, datasource, exporter, and performance playbooks.
3. `references/studio-migration.md`: Studio preview/runtime differences plus 6.x to 7.x migration guidance.
4. `references/troubleshooting-matrix.md`: symptom-to-root-cause lookup with official references first.
5. `scripts/jrxml_inventory.ts`: read-only JRXML structure summarizer.
6. `scripts/run_opencode_evals.ts`: OpenCode + MiniMax eval runner for this skill.
7. `scripts/grade_opencode_evals.ts`: deterministic grader and benchmark aggregator for the eval workspace.
