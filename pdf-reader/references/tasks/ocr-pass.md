# OCR Pass

## When to use

Use when the PDF is scanned or image-heavy and needs OCR.

## Inputs

- OCR need or scan symptom
- Language requirements
- Whether auto OCR is enough

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Prefer the bundled command shape `bun scripts/read-pdf.ts <file.pdf> --ocr-all --ocr-lang <lang>`.
4. If the file path is unknown, still show the exact OCR command template with `--ocr-all` and `--ocr-lang`.
5. End with concrete verification steps tied to the task.

## Safety gates

- Do not assume embedded text exists on scanned PDFs.
- Do not omit OCR dependency checks when the task depends on them.

## Outputs

- A focused recommendation or implementation plan for ocr pass
- A concrete OCR command that mentions `--ocr-all` and `--ocr-lang`

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Running OCR on a PDF that already has embedded text — wastes time and degrades quality
- [ ] Mistake 2: Omitting `--ocr-lang` when the PDF contains non-Latin scripts — OCR will misrecognize characters
- [ ] Mistake 3: Not checking if tesseract and poppler dependencies are installed before running OCR

### Negative Examples
**Don't assume a scanned PDF needs OCR just because it looks image-heavy** — many scanned PDFs are already OCR-processed and stored as image layers with hidden text; check for embedded text first to avoid redundant processing.

## Verification

- State the sample-page OCR check that confirms the setup.
