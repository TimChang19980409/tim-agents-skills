# Runtime Playbook

Use this playbook when the user wants a concrete implementation fix, not just a conceptual explanation.

## Compile And Fill Pipeline

Inspect:
- Where `JasperCompileManager` runs and whether compile happens on every request
- Whether the app loads `.jrxml` or precompiled `.jasper`
- Version declarations in `pom.xml` or Gradle

Common root causes:
- Runtime loads a `.jasper` compiled by a different JasperReports version
- Reports are recompiled repeatedly instead of cached
- Export flow uses a generic helper when a specific exporter is needed

Fix direction:
- Compile with the same library major and minor version used at runtime
- Cache compiled `JasperReport` objects or ship version-matched `.jasper`
- Use exporter-specific APIs for XLSX, CSV, HTML, or JSON scenarios

Official references:
- [JasperReports README](https://raw.githubusercontent.com/Jaspersoft/jasperreports/master/README.md)
- [JasperFillManager Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JasperFillManager.html)
- [JasperExportManager Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JasperExportManager.html)

## Datasources

Inspect:
- `JRBeanCollectionDataSource`, `JREmptyDataSource`, JDBC `Connection`, `JsonDataSource`
- Parameter names and classes in JRXML versus Java code
- Query language and whether fields align with datasource shape

Common root causes:
- Passing a raw collection instead of `JRDataSource`
- Using `REPORT_CONNECTION` when the main report is not JDBC-backed
- Studio data adapters masking runtime datasource gaps
- JSON datasource path or source property misconfigured

Fix direction:
- Pass `JRBeanCollectionDataSource` or `JsonDataSource` explicitly
- Use `dataSourceExpression` for bean or JSON-backed subreports
- Keep JRXML field names synchronized with datasource property names

Official references:
- [JRBeanCollectionDataSource Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/data/JRBeanCollectionDataSource.html)
- [JSON datasource sample](https://jasperreports.sourceforge.net/sample.reference/jsondatasource/README.html)

## Subreports And Dataset Runs

Inspect:
- `subreportExpression`, `connectionExpression`, `dataSourceExpression`
- `<subreportParameter>` mappings
- `componentElement` and `datasetRun` blocks for table and list components

Common root causes:
- Subreport parameter names do not match the child template
- Main report passes `REPORT_CONNECTION` but the data actually comes from beans or JSON
- Table or list components use a subDataset without a corresponding `datasetRun`
- Relative path resolution for subreport templates is wrong

Fix direction:
- Prefer explicit `dataSourceExpression` when the child report needs its own collection or JSON view
- Keep parameter names and classes identical between parent and child
- Resolve subreport paths from a stable directory parameter or classpath convention

Official references:
- [Subreport sample](https://jasperreports.sourceforge.net/sample.reference/subreport/README.html)
- [Table component sample](https://jasperreports.sourceforge.net/sample.reference/table/README.html)

## Fonts And Exporters

Inspect:
- `fontName`, `pdfEncoding`, `isPdfEmbedded`
- Presence of a font extension JAR or `fonts.xml` equivalent packaging
- Exporter selection and any format-specific exporter configuration

Common root causes:
- Font exists in Studio but not on the runtime JVM
- PDF export uses default encoding instead of Unicode-safe encoding
- The app relies on OS-installed fonts instead of bundled font extensions

Fix direction:
- Package a JasperReports font extension with the application
- Use Unicode-safe PDF encoding such as `Identity-H` where appropriate
- Embed the PDF font when distribution portability matters

Official references:
- [Fonts sample](https://jasperreports.sourceforge.net/sample.reference/fonts/README.html)
- [JRFontNotFoundException Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html)

## Performance And Memory

Inspect:
- Whether compile happens per request
- Size of the datasource and resulting `JasperPrint`
- Use of `REPORT_VIRTUALIZER`, `JRSwapFileVirtualizer`, or `JRFileVirtualizer`
- Export format, pagination settings, and repeated image or subreport usage

Common root causes:
- Huge fill operations kept entirely in heap
- Recompiling JRXML for every request
- Exporting giant reports to XLSX or PDF without virtualization
- Overly wide detail bands or nested subreports exploding page count

Fix direction:
- Compile once and reuse `JasperReport`
- Introduce a virtualizer for large fills
- Measure fill and export separately before tuning heap size
- Stream or partition large exports when business flow allows it

Official references:
- [Virtualizer sample](https://jasperreports.sourceforge.net/sample.reference/virtualizer/README.html)
- [Configuration reference](https://jasperreports.sourceforge.net/config.reference.html)
