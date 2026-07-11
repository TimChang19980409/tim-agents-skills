# Page Extraction

## When to use

Use when extracting a specific page range or section from a PDF.

## Inputs

- PDF path
- Target page range or section
- Desired output format

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Prefer the bundled command shape `bun scripts/read-pdf.ts <file.pdf> --pages <range>`.
4. If the file path is unknown, still show the exact command template with `--pages`.
5. End with concrete verification steps tied to the task.

## Safety gates

- Do not read the whole PDF if the task only needs a narrow page range.
- Do not skip path and page-range validation for focused reads.

## Outputs

- A focused recommendation or implementation plan for page extraction
- A concrete `bun scripts/read-pdf.ts ... --pages ...` example

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Reading the entire PDF when only a narrow page range is needed — wastes tokens and time
- [ ] Mistake 2: Forgetting to validate the page range against the actual PDF page count
- [ ] Mistake 3: Using the wrong output format for downstream processing (e.g., markdown for JSON consumers)

### Negative Examples
**Don't skip path and page-range validation when the user provides a file path** — a missing file or out-of-range page request produces a cryptic error; validate early and report exactly which page is missing.

## Verification

- State how to confirm the selected pages and output format are correct.
