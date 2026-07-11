# Screenshot Migration

## When to use

Use when replacing brittle screenshot/OCR checks with Stagehand + ARIA or layout-tree assertions.

## Inputs

- Existing screenshot test goal
- Whether the contract is semantic or layout-sensitive
- Known DOM volatility

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/decision-matrix.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for screenshot migration.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not replace true pixel contracts with semantic assertions.
- Do not keep OCR loops when ARIA or layout data can express the contract.

## Outputs

- A focused recommendation or implementation plan for screenshot migration

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Replacing pixel-perfect screenshot contracts with semantic assertions when visual regression is still a risk
- [ ] Mistake 2: Keeping OCR-based screenshot checks instead of migrating to ARIA or layout-tree assertions
- [ ] Mistake 3: Not documenting which assertions are semantic vs structural — causes confusion during code review

### Negative Examples
**Don't replace screenshot tests with semantic assertions if the feature is genuinely layout-sensitive** — CSS changes that preserve semantics can break visual regressions; keep layout-tree or pixel-diff checks for UI that has visual contracts.

## Verification

- State the new assertion layer and what it proves better than the old screenshot check.
