# Aria Snapshot Flow

## When to use

Use when building or reviewing a Stagehand flow that should assert semantic DOM behavior with ARIA snapshots.

## Inputs

- Target interaction flow
- Scoped container or role target
- Expected semantic behavior

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/decision-matrix.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for aria snapshot flow.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not use full-page screenshots when a scoped ARIA snapshot proves the behavior.
- Do not rely on unstable CSS selectors when role/name selectors are available.

## Outputs

- A focused recommendation or implementation plan for aria snapshot flow

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Using full-page screenshots when scoped ARIA snapshots prove the same behavior more precisely
- [ ] Mistake 2: Relying on CSS selectors that are fragile to DOM structure changes instead of stable role/name selectors
- [ ] Mistake 3: Asserting on ARIA attributes without verifying the actual semantic behavior in a browser

### Negative Examples
**Don't assert on aria-label without also checking that the element is actually announced by screen readers** — aria-label can override visible text in ways that are confusing; test with a real screen reader to confirm the announcement is meaningful.

## Verification

- State the scoped locator and ARIA assertion that prove the flow.
