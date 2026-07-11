# Migration Recompile

## When to use

Use when upgrading JasperReports versions breaks compiled templates or runtime loading.

## Inputs

- Source and target Jasper version
- Symptom such as template load failure
- Availability of JRXML vs compiled jasper files

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/studio-migration.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for migration recompile.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not assume compiled templates remain portable across major version jumps.
- Do not introduce JasperReports Server into a library migration answer.

## Outputs

- A focused recommendation or implementation plan for migration recompile

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Assuming compiled .jasper files are portable across major JasperReports version jumps
- [ ] Mistake 2: Introducing JasperReports Server into a Library-only migration discussion
- [ ] Mistake 3: Skipping version compatibility checks when upgrading both Jasper and the Java runtime together

### Negative Examples
**Don't skip the recompile step when upgrading from JasperReports 6.x to 7.x** — compiled templates from 6.x are not guaranteed to load in 7.x; always recompile JRXML and re-run the full report smoke test suite after upgrading.

## Verification

- State the template recompile or smoke test that confirms the migration works.
