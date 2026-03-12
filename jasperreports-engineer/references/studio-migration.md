# Studio And Migration Notes

Use this reference when Studio preview behavior differs from application runtime, or when a JasperReports upgrade breaks existing templates.

## Studio Preview Versus Runtime

Treat Studio preview as a design-time convenience, not proof that runtime wiring is correct.

Inspect:
- Whether Studio uses a data adapter that does not exist in the application
- Whether the runtime app fills with JDBC, beans, JSON, or empty datasource
- Whether the preview relies on local fonts or local files not packaged with the app

Fix direction:
- Reproduce runtime inputs outside Studio when validating a fix
- Align field names, parameters, and datasource types between Studio and Java code
- Package fonts and report assets instead of relying on the developer machine

Official reference:
- [Jaspersoft Studio User Guide](https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/)

## Compatibility With Earlier Library Versions

When a template was created in an older Studio or library version, do not assume the compiled output remains valid after a library upgrade.

Inspect:
- Current runtime library version in the build file
- Whether the repo ships precompiled `.jasper`
- Whether the template was last edited or compiled in an older Studio version

Fix direction:
- Re-open and recompile templates with a Studio or library version aligned to runtime
- Use Studio compatibility settings when you must preserve older behavior while migrating deliberately
- Replace stale `.jasper` binaries after the migration

Official references:
- [Jaspersoft Studio User Guide](https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/)
- [JasperReports releases](https://github.com/Jaspersoft/jasperreports/releases)

## 6.x To 7.x Migration Checklist

1. Confirm the exact library version declared in the build.
2. Remove or regenerate old compiled `.jasper` artifacts.
3. Recompile JRXML with the same major and minor JasperReports version used at runtime.
4. Re-test custom fonts, subreports, and exporter paths after recompilation.
5. If loading errors persist, compare the failing stacktrace against current release notes and known migration issues before broad refactors.

Secondary reference:
- [GitHub issue #455](https://github.com/Jaspersoft/jasperreports/issues/455)

## How To Answer Upgrade Questions

- Start with the observed version mismatch or load error.
- Explain whether the failure is caused by compile-time artifacts, Studio compatibility, or runtime API changes.
- Recommend the smallest reproducible migration step first: recompile, align versions, then re-test.
