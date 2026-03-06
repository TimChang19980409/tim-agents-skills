---
name: pdf-reader
description: Read and summarize PDF text and image content with Bun. Use this skill when users need page extraction, OCR fallback for scanned PDFs, section-focused reading, or per-page JSON output for token planning.
---

# PDF Reader

## Quick Start

1. Run quick text extraction:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf
```

2. Limit scope to selected pages with `--pages`:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --pages 1-5
```

3. Switch to JSON output with `--json`:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --json
```

4. Cap output size with `--max-chars` per page:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --pages 1-10 --max-chars 2000
```

5. Force OCR for scanned/image-heavy PDFs:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --ocr-all --ocr-lang eng+chi_tra
```

6. Show CLI usage with `--help`:

```bash
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts --help
```

## Usage

- Use this skill for text-first PDFs (reports, contracts, manuals, exported invoices) and scanned PDFs.
- Prefer focused reads with `--pages` before full reads to reduce token cost and improve relevance.
- Ask for target sections (for example, "only budget table pages") and convert them into `--pages` ranges.
- Use `--json` when you need deterministic post-processing or batching.
- Use `--max-chars` to prevent oversized page payloads in prompts.
- OCR behavior defaults to auto mode:
  - low-text pages (`chars < 24`) trigger OCR automatically.
  - use `--ocr-all` when you need full-page OCR coverage.
  - use `--no-ocr` if you only want embedded PDF text.
- Use `--help` when validating syntax or troubleshooting command usage.

Common commands:

```bash
# Full text mode (default)
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf

# JSON mode with selected pages
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --pages 10-30 --json

# JSON mode with truncation guard for token budget
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./document.pdf --pages 1,3,5-7 --json --max-chars 1500 > output.json

# Full OCR mode for image/scanned PDFs
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts ./scan.pdf --ocr-all --ocr-lang eng+chi_tra

# Help output
bun ~/.agents/skills/pdf-reader/scripts/read-pdf.ts --help
```

## OCR Prerequisites

OCR depends on external commands:

- `pdftoppm` (from `poppler`) for page image rendering.
- `tesseract` for text recognition.

Install on macOS (Homebrew):

```bash
brew install poppler tesseract tesseract-lang
```

If commands are missing, the script still works for embedded PDF text and emits a warning when OCR is needed.

## Output Formats

- `text` (default): human-readable plain text output; call without `--json`.
- `json`: structured output; enable with `--json` for token planning and selective re-processing.

Related flags for output control:

- `--max-chars <n>` truncates each page text to avoid oversize chunks.
- `--pages <range>` narrows extraction before rendering output.
- `--ocr`, `--ocr-all`, `--no-ocr` control OCR strategy.
- `--ocr-lang <lang>` selects tesseract language packs (default `eng+chi_tra`).
- `--ocr-min-chars <n>` controls auto OCR trigger threshold.
- `--help` prints exact CLI syntax when needed.

Recommended JSON usage:

- Read per-page content lengths to estimate prompt budget before summarization.
- Split large PDFs into chunks by page count or character count.
- Re-run only failed or high-priority page ranges.

## Strategy for Large PDFs

1. Detect total pages first (or run an initial short page range).
2. Process in batches (for example, 20-50 pages each).
3. Use `--json` and track page-level sizes.
4. Summarize each batch, then combine batch summaries.
5. Re-read only ambiguous pages instead of reprocessing the whole file.

## Token Budget Guide

- Small (<20 pages): one pass in `text` mode is usually fine.
- Medium (20-120 pages): use `--json` and summarize by chunks.
- Large (>120 pages): enforce strict batching and hierarchical summarization.
- Dense legal/financial PDFs: assume higher token density, reduce chunk size.
- If near context limits, prioritize requested sections and defer appendices.

## Limitations

- Multi-column ordering may be inaccurate.
- OCR quality depends on scan clarity, language pack, and layout complexity.
- Password-protected PDFs fail during parse.
- Complex tables and mixed vertical text may still require manual verification.

## Error Handling

- Exit code `0`: success, output generated.
- Exit code `1`: runtime/parse failure (corrupted file, unsupported structure, password-protected PDF).
- Exit code `2`: invalid CLI usage (missing path, invalid flags, or bad page range).

When errors occur, apply this sequence:

1. Verify path and page arguments.
2. Retry with a smaller `--pages` range.
3. Switch to `--json` for easier troubleshooting.
4. If pages are empty, retry with `--ocr-all` and verify `pdftoppm`/`tesseract` installation.
