# Font Extension Packaging

## When to use

Use when PDF export fails for Unicode text and runtime font packaging is missing.

## Inputs

- Observed export or font exception
- Target language set
- Current report font metadata

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. If the prompt asks for `Selected:`, start with `Selected: font-extension-packaging` before any heading or recommendation.
2. Load `references/troubleshooting-matrix.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for font extension packaging.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not rely on local developer fonts for production portability.
- Do not omit Unicode-safe encoding when the task is multilingual PDF output.

## Outputs

- A focused recommendation or implementation plan for font extension packaging
- An explicit runtime font-extension fix that names Unicode-safe encoding such as `Identity-H`, `UniGB-UCS2-H`, or `UniCNS-UCS2-H`

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Relying on local developer fonts that are absent in production environments
- [ ] Mistake 2: Using PDFont而不是extension for Unicode multilingual exports — embedding fails silently
- [ ] Mistake 3: Forgetting to specify the encoding family (Identity-H, UniGB-UCS2-H) for non-Latin languages

### Negative Examples
**Don't assume the JasperReports font extension jar that works locally will work in all containers** — application servers sometimes override classloading; always test the PDF output in the target deployment environment.

## Verification

- State the PDF export or sample text check that confirms the font fix.
