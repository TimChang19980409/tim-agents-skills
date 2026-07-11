# Obsidian Handoff

## When to use

Use when an Obsidian-related task is really about PDF extraction, OCR, or per-page JSON.

## Inputs

- Original Obsidian request
- PDF extraction requirement
- Whether vault mutation is still needed afterward

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Load `references/decisions/obsidian-handoff.md` for deeper details only when needed.
4. For surface-routing prompts coming from Obsidian, prefer `obsidian-handoff` over extraction playbooks such as `json-chunking`.
5. Recommend the smallest safe change or plan for obsidian handoff.
6. End with concrete verification steps tied to the task.

## Safety gates

- Do not route PDF extraction back through vault commands when extraction is the real problem.
- Do not lose the distinction between extraction and vault-linking follow-up work.

## Outputs

- A focused recommendation or implementation plan for obsidian handoff

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Routing PDF extraction through vault commands when the real problem is extraction quality
- [ ] Mistake 2: Losing the distinction between extraction work and vault-linking follow-up — leads to incomplete handoffs
- [ ] Mistake 3: Not specifying the output path for extracted content — makes downstream processing ambiguous

### Negative Examples
**Don't hand off extraction results without verifying the output format matches what Obsidian expects** — Markdown links, embedded note references, and file naming conventions differ; misaligned handoffs require rework in the Obsidian context.

## Verification

- State how to confirm the extraction output before returning to Obsidian.
