# Layout Tree Assertion

## When to use

Use when validating spacing, stacking, flex/grid layout, or structural layout regressions.

## Inputs

- Target region or component
- Layout behavior under test
- Need for CDP or style allow-lists

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/layout-tree-snapshot.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for layout tree assertion.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not use page.snapshot() as proof of CSS layout behavior.
- Do not snapshot the entire document when a region-level subtree is enough.

## Outputs

- A focused recommendation or implementation plan for layout tree assertion

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Using page.snapshot() to assert CSS layout behavior — snapshot captures semantic content, not computed styles
- [ ] Mistake 2: Snapshotting the entire document when a region-level subtree is sufficient — produces brittle, large diffs
- [ ] Mistake 3: Not using CDP directly when precise bounds or computed style values are needed

### Negative Examples
**Don't assert on layout behavior without using the layout-tree snapshot** — relying on DOM text content or ARIA roles to infer spacing ignores the actual CSS layout; use layout-tree snapshots with explicit bounds checks for flex/grid validation.

## Verification

- State the subtree and style/bounds checks that confirm the layout behavior.
