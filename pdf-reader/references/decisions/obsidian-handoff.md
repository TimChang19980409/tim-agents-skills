# Obsidian Handoff

## Decision

Choose whether a document task should stay with `obsidian-cli` or move to `pdf-reader`.

## Signals/constraints

- The artifact is a PDF
- The user needs OCR, page extraction, or structured per-page output
- The hard part is extracting text, not managing vault metadata

## Options

- Stay in `obsidian-cli` for vault attachment placement, linking, or note updates
- Use `pdf-reader` for extraction, OCR, and JSON/text output planning

## Recommendation rule

Move the task to `pdf-reader` as soon as the bottleneck is text extraction or OCR. Stay in `obsidian-cli` only when the PDF is incidental to a vault-management workflow.

## Tradeoffs

- `obsidian-cli` understands vault operations
- `pdf-reader` understands extraction fidelity, OCR, and page-level budgeting

## Verification

- State whether the selected tool is solving extraction or vault management
