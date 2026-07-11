# Handoff To PDF Reader

## Decision

Choose whether a document task should stay in Obsidian or move to `pdf-reader`.

## Signals/constraints

- The user needs OCR, page extraction, or per-page JSON
- The source artifact is a PDF rather than a normal note
- The task is analysis or extraction rather than vault navigation

## Options

- Stay in `obsidian-cli` for vault attachment management or note linking
- Delegate to `pdf-reader` for extraction, OCR, and PDF-focused summarization

## Recommendation rule

If the difficult part is getting text or structure out of a PDF, use `pdf-reader`. If the difficult part is linking or managing the attachment inside the vault, stay in `obsidian-cli`.

## Tradeoffs

- Obsidian commands know the vault surface
- `pdf-reader` knows extraction and OCR details

## Verification

- For routing-only prompts, state whether the chosen tool is solving extraction or vault operations and do not attempt extraction
