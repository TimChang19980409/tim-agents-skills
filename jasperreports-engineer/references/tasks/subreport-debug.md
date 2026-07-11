# Subreport Debug

## When to use

Use when a Jasper subreport is blank or its datasource/parameter wiring is suspect.

## Inputs

- Main report/subreport relationship
- Datasource style
- Observed symptom

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/runtime-playbook.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for subreport debug.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not prescribe JasperReports Server for a Library-only problem.
- Do not use REPORT_CONNECTION as a generic answer for bean-backed subreports.

## Outputs

- A focused recommendation or implementation plan for subreport debug

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Prescribing JasperReports Server configuration for a Library-only problem
- [ ] Mistake 2: Using REPORT_CONNECTION as a datasource for bean-backed subreports — causes connection leaks
- [ ] Mistake 3: Assuming the subreport is the problem without checking the main report's parameter passing first

### Negative Examples
**Don't skip the datasource test by filling the main report alone** — a subreport that works in isolation may fail when passed a parent-originated connection; test the full report hierarchy end-to-end.

## Verification

- State the report-preview or fill-time validation that confirms the fix.
