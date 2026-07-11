# Improve Triggering

## When to use

Use when tightening a skill description, intent tags, or delegation boundary to improve trigger quality.

## Inputs

- Current description or tags
- Observed false positives/negatives
- Neighbor skills with overlapping boundaries

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Do not start with phrases like "Based on the improve-triggering task", "Here's my analysis", or any other preface before the route line.
4. Load `references/schemas.md` for deeper details only when needed.
5. If the prompt is a benchmark-style request with no attached files or current description text, answer directly from the prompt instead of exploring the workspace or running tools to hunt for more context.
6. Recommend the smallest safe change or plan for improve triggering.
7. End with concrete verification steps tied to the task.

## Safety gates

- Do not broaden the description just to win more prompts.
- Do not change trigger language without a neighboring-boundary check.
- Do not inspect local files or run tools just to invent extra context when the task is already answerable from the prompt.

## Outputs

- A focused recommendation or implementation plan for improve triggering
- Boundary edits that explicitly mention description, intent tags, neighbor skills, and regression prompts

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Broadening the description to capture more prompts without checking if it still distinguishes from neighbors
- [ ] Mistake 2: Changing trigger language without running boundary evals against neighboring skills
- [ ] Mistake 3: Inspecting local files when the task is already fully answerable from the prompt — adds latency without value

### Negative Examples
**Don't remove trigger words just because they feel too narrow** — removing specificity causes false positives from unrelated prompts; prefer incremental relaxation backed by eval evidence.

## Verification

- List the regression queries that should prove the new trigger boundary.
