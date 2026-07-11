# Migration Recompile

## When to use

Use when upgrading JasperReports versions breaks compiled templates or runtime loading.

## Inputs

- Source and target Jasper version
- Symptom such as template load failure
- Availability of JRXML vs compiled jasper files

## Steps

1. Inventory JRXML, `.jasper`, serialization, extension jars, and Studio/runtime versions.
2. Target JasperReports Library 7.0.6 and use the official Maven plugin for build-time compilation where appropriate.
3. Convert 6.x JRXML with the supported Studio/library migration path; do not assume old JRXML parses unchanged.
4. Rebuild compiled templates with the target runtime and smoke-test every export family in use.

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
**Do not carry 6.x compiled templates into 7.x.** Recompile from migrated JRXML and align Studio, Maven plugin, runtime library, and font extensions.

## Verification

- State the template recompile or smoke test that confirms the migration works.
