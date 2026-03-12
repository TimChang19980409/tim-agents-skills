I read this as **explicit-JasperReports** — the files and error log are provided, the issue is clear. Let me load the JasperReports skill for official best practices, then diagnose.

## Context
- **Files inspected**: `pom.xml` (JasperReports 6.21.3), `CjkInvoiceReportService.java`, `invoice_zh.jrxml`, `font-error.log`
- **Primary lane**: `font-export` — Studio preview/runtime mismatch for Chinese text

## Likely Root Cause

**Two distinct issues:**

1. **Encoding mismatch (fundamental bug)**: The JRXML uses `pdfEncoding="Cp1252"`, which is Western Latin-1 encoding. This cannot represent Chinese characters. Cp1252 is fundamentally incompatible with CJK text — the PDF will either fail or produce garbled output even if the font were available.

2. **Font availability gap**: "Noto Sans CJK TC" is installed in Jaspersoft Studio (bundled with the IDE) but not available to the JVM in production. The JVM only sees fonts registered via Java's font API or JasperReports font extensions.

**Why it works in Studio**: Jaspersoft Studio bundles Noto CJK fonts and configures them in its embedded JasperReports runtime. Production has neither.

## Proposed Fix

**Option A — Minimum fix (recommended):**

1. **JRXML change** — Use PDF built-in Unicode font with Identity-H encoding:
```xml
<textField>
  <reportElement x="0" y="0" width="300" height="20"/>
  <textElement>
    <font fontName="Helvetica" pdfEncoding="Identity-H"/>
  </textElement>
  <textFieldExpression><![CDATA[$P{CUSTOMER_NAME}]]></textFieldExpression>
</textField>
```

2. **No packaging change needed** — `Helvetica` (or `DejaVu Sans`) is bundled in PDF, no font extension required.

**Option B — If custom CJK font is required:**

Create a JasperReports font extension JAR:
```xml
<!-- fonts.xml in src/main/resources/net/sf/jasperreports/fonts/ -->
<?xml version="1.0" encoding="UTF-8"?>
<fontFamilies>
  <fontFamily name="Noto Sans CJK TC">
    <normal>fonts/NotoSansCJK-Regular.ttc</normal>
    <pdfEncoding>Identity-H</pdfEncoding>
    <pdfEmbedded>true</pdfEmbedded>
    <locales>zh_TW,zh_HK</locales>
  </fontFamily>
</fontFamilies>
```
Then add the font files to the JAR and include it as a dependency in `pom.xml`.

## Validation Steps

1. **Compile the JRXML** after editing: `JasperCompileManager.compileReport("invoice_zh.jrxml")`
2. **Run the export** in production-like environment (not Studio)
3. **Open the PDF** and verify Chinese characters render correctly
4. **Check PDF metadata** — ensure font is embedded (PDF reader → Properties → Fonts)
5. **Test with multiple Chinese strings** — ensure all CJK codepoints display

## Sources

- [JasperReports Fonts Sample](https://jasperreports.sourceforge.net/sample.reference/fonts/README.html) — official font extension documentation
- [JRFontNotFoundException Javadoc](https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html) — official exception reference
