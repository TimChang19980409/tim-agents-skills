---
name: pdf-reader
description: |
  Extract PDF text and tables per page, OCR scans, emit structured JSON, and chunk within token budgets.
  Use when document extraction is the real task. Do not use for Obsidian vault operation or PDF layout authoring;
  route those to obsidian-cli or the host's native PDF capability.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# PDF Reader

Choose extraction before OCR; preserve page boundaries and record which pages required OCR.

## Routes

- [Page extraction](references/tasks/page-extraction.md)
- [OCR pass](references/tasks/ocr-pass.md)
- [JSON and token-budget chunking](references/tasks/json-chunking.md)
- [Obsidian handoff](references/tasks/obsidian-handoff.md)
- [OCR strategy](references/decisions/ocr-strategy.md)
- [Text versus JSON](references/decisions/text-vs-json-output.md)

Prefer the bundled `scripts/read-pdf.ts` for repeatable batches. Verify requested page ranges, report extraction/OCR failures per page, and never silently replace unreadable content with guesses.
