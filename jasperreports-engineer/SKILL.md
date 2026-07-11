---
name: jasperreports-engineer
description: |
  Solve JasperReports Library and Studio subreport, migration, font, and large-export problems.
  Use for concrete report artifacts. Do not use for JasperReports Server administration or generic Java work;
  route generic runtime issues to java-pro.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# JasperReports Engineer

Inspect JRXML, compiled artifacts, data-source contracts, dependencies, fonts, and export format before changing a report.

## Routes

- [Subreport debugging](references/tasks/subreport-debug.md)
- [6.x to 7.x migration and recompilation](references/tasks/migration-recompile.md)
- [Font extension packaging](references/tasks/font-extension-packaging.md)
- [Large-export performance](references/tasks/large-export-performance.md)
- [Bean data source versus JDBC connection](references/decisions/bean-datasource-vs-connection.md)
- [Library versus Server scope](references/decisions/library-vs-server-scope.md)

Use JasperReports 7.0.6 as the current library lane. Treat compiled templates as version-bound, validate 6→7 JRXML conversion, package fonts explicitly, and verify with a representative PDF/XLSX export.
