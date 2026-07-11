# Choose Obsidian Surface

## Decision

Choose whether the task belongs in the CLI host, an archived extension, or another core utility.

## Signals/constraints

- Live vault operation versus file-format authoring
- `.base`, `.canvas`, or markdown syntax specificity
- PDF extraction or OCR

## Options

- Stay in `obsidian-cli` for operational commands and plugin-debug flows
- Load `obsidian-markdown`, `obsidian-bases`, `json-canvas`, or `book-translation` for those exact surfaces
- Delegate to `pdf-reader` for PDF extraction and OCR

## Recommendation rule

Use the CLI host for actions against a running vault. Use extensions when the task is file-format-specific. If the request is specifically about authoring or editing a `.base` file, formulas, filters, or card views, choose `obsidian-bases`. Hand off to `pdf-reader` when the problem is really PDF ingestion.

## Tradeoffs

- Staying in the host keeps routing simple
- Extensions preserve niche syntax depth
- `pdf-reader` is better for extraction but not for vault mutation

## Verification

- For routing-only prompts, name the chosen surface and the reason the others were narrower or broader without creating files or executing the downstream work
