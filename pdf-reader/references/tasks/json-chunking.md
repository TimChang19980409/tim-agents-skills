# JSON Chunking

## When to use

Use when the user needs per-page JSON or token-budget-aware chunking for a large PDF.

## Inputs

- Page count or size
- Target chunk size
- Need for JSON and truncation

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Start with plain text `Selected: json-chunking` when the prompt asks for it.
3. Prefer the bundled command shape `bun scripts/read-pdf.ts <file.pdf> --pages <range> --json --max-chars <n>`.
4. If the file path is unknown, still answer with the exact command template rather than blocking on a missing file.
5. End with concrete verification steps tied to the task.

## Safety gates

- Do not emit oversized page payloads when chunking is the goal.
- Do not reprocess the whole file if only a small range failed.

## Outputs

- A focused recommendation or implementation plan for json chunking
- A concrete JSON extraction command that mentions `--json`, `--pages`, and `--max-chars`

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Reprocessing the entire PDF when only a small range of pages failed
- [ ] Mistake 2: Emitting page payloads larger than the target token budget without truncation
- [ ] Mistake 3: Using JSON output format without `--json` flag — falls back to markdown or plain text

### Negative Examples
**Don't set `--max-chars` so low that meaningful content is truncated mid-sentence** — chunks that cut across paragraphs lose context; set the budget to accommodate complete logical units where possible.

## Verification

- State how to confirm chunk sizes and per-page payloads are manageable.
