# Official Source Map

Use this map to choose the smallest official JasperReports source set that answers the user's question.
Prefer the first official source in each row before loading anything else.

| Topic | Signals In Repo Or Prompt | Load First | Then Load | Community Fallback |
| --- | --- | --- | --- | --- |
| Report lifecycle | `JasperCompileManager`, `JasperFillManager`, `JasperExportManager`, exporter classes | [JasperReports README](https://raw.githubusercontent.com/Jaspersoft/jasperreports/master/README.md) | [JasperFillManager Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JasperFillManager.html), [JasperExportManager Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JasperExportManager.html) | None by default |
| Bean datasources | `JRBeanCollectionDataSource`, `JREmptyDataSource`, bean fields | [JRBeanCollectionDataSource Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/data/JRBeanCollectionDataSource.html) | [JREmptyDataSource Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/JREmptyDataSource.html) | None by default |
| JSON datasources | `JsonDataSource`, `json.source`, `JSON_INPUT_STREAM` | [JSON datasource sample](https://jasperreports.sourceforge.net/sample.reference/jsondatasource/README.html) | [Configuration reference](https://jasperreports.sourceforge.net/config.reference.html) | None by default |
| Subreports | `subreport`, `subreportExpression`, `REPORT_CONNECTION`, `JRDataSource` | [Subreport sample](https://jasperreports.sourceforge.net/sample.reference/subreport/README.html) | [Configuration reference](https://jasperreports.sourceforge.net/config.reference.html) | [Stack Overflow: subreport datasource blank](https://stackoverflow.com/questions/43978774/subreport-wont-display-in-the-mainreport-jasperreports) |
| Table and list components | `componentElement`, `datasetRun`, `subDataset`, table or list components | [Table component sample](https://jasperreports.sourceforge.net/sample.reference/table/README.html) | [Function reference](https://jasperreports.sourceforge.net/function.reference.html) when expressions are the issue | None by default |
| Fonts and Unicode PDF | `fontName`, `pdfEncoding`, `isPdfEmbedded`, font errors | [Fonts sample](https://jasperreports.sourceforge.net/sample.reference/fonts/README.html) | [JRFontNotFoundException Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html) | [Stack Overflow: font extensions not working](https://stackoverflow.com/questions/14935914/jasperreports-font-extensions-does-not-work-cant-find-font-while-exporting) |
| Functions and expressions | expression syntax, date or text function issues | [Function reference](https://jasperreports.sourceforge.net/function.reference.html) | [Jaspersoft Studio User Guide](https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/) | None by default |
| Performance and memory | `REPORT_VIRTUALIZER`, OOM, huge `JasperPrint`, large exports | [Virtualizer sample](https://jasperreports.sourceforge.net/sample.reference/virtualizer/README.html) | [Configuration reference](https://jasperreports.sourceforge.net/config.reference.html) | [Stack Overflow: JRSwapFileVirtualizer usage](https://stackoverflow.com/questions/11764598/proper-usage-of-jrswapfilevirtualizer) |
| Studio preview/runtime mismatch | data adapter, preview works but app fails, compatibility settings | [Jaspersoft Studio User Guide](https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/) | [JasperReports README](https://raw.githubusercontent.com/Jaspersoft/jasperreports/master/README.md) | None by default |
| 6.x to 7.x migration | old `.jasper`, upgrade errors, version mismatch | [JasperReports releases](https://github.com/Jaspersoft/jasperreports/releases) | [Jaspersoft Studio User Guide](https://community.jaspersoft.com/documentation/jaspersoft-studio-user-guide/v900/) | [GitHub issue #455](https://github.com/Jaspersoft/jasperreports/issues/455) |

## Routing Notes

- If the repo contains compiled `.jasper` files, always compare their compile path and runtime library version before proposing code changes.
- If the failure is only visible in PDF export, prioritize font and exporter sources before datasource debugging.
- If the prompt mentions Studio preview, do not assume runtime datasource configuration exists in the application.
