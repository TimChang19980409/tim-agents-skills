# Install Check

## When to use

Use when validating that Stagehand, Playwright, and related dependencies are installed correctly before test authoring.

## Inputs

- Runtime mode
- Need for CLI or script validation
- Installed dependencies or version concerns

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `scripts/check-stagehand-install.ts` for deeper details only when needed.
3. Recommend the smallest safe change or plan for install check.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not start designing tests before the runtime surface is validated.
- Do not assume Browserbase or CDP connectivity if it has not been checked.

## Outputs

- A focused recommendation or implementation plan for install check

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Designing tests before verifying the runtime surface is correctly installed
- [ ] Mistake 2: Assuming Browserbase or CDP connectivity works without running a connectivity check
- [ ] Mistake 3: Skipping the install check in CI when local development was done with a different environment

### Negative Examples
**Don't skip the install check when setting up CI for the first time** — local installs may work due to user-level overrides or cached credentials that are absent in the CI environment; always verify from a clean state.

## Verification

- State the smoke check that proves Stagehand is usable.
