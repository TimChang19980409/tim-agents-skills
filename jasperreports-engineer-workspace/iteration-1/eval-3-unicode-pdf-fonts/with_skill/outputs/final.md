I'll diagnose this JasperReports Chinese font issue. The problem is clear from the files: the font isn't available in production and the encoding is wrong. Let me gather official guidance and synthesize the fix.

## Analysis Summary

**Context:**
- JasperReports 6.21.3 (pom.xml)
- CjkInvoiceReportService.java fills and exports PDF
- invoice_zh.jrxml uses `Noto Sans CJK TC` with `pdfEncoding="Cp1252"`
- Error: `JRFontNotFoundException` in production (no font extension JAR)

**Likely Root Cause:**

Two distinct issues:

1. **Font not available at runtime**: The error explicitly states the font isn't available to the JVM. Jaspersoft Studio bundles fonts in its IDE runtime, so the report previews correctly there. Production has no font extension JAR in the classpath—this is the primary cause.

2. **Wrong PDF encoding**: `pdfEncoding="Cp1252"` is Western European encoding and **cannot encode Chinese characters**. For CJK text, you need `pdfEncoding="Identity-H"` (Unicode) combined with `isPdfEmbedded="true"`.

---

## Proposed Fix

### Step 1: Create a JasperReports Font Extension JAR

Create a minimal font extension with the Noto Sans CJK TC font:

**File structure:**
```
src/main/resources/
├── net/sf/jasperreports/fonts/
│   └── noto-cjk-tc.xml          # Font family definition
└── jasperreports_extension.properties
```

**jasperreports_extension.properties:**
```properties
net.sf.jasperreports.extension.registry.factory.simple.font.families=net.sf.jasperreports.engine.fonts.SimpleFontExtensionsRegistryFactory
net.sf.jasperreports.extension.simple.font.families.noto-cjk-tc=net/sf/jasperreports/fonts/noto-cjk-tc.xml
```

**noto-cjk-tc.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<fontFamilies>
  <fontFamily name="Noto Sans CJK TC">
    <normal>fonts/NotoSansCJKtc-Regular.otf</normal>
    <bold>fonts/NotoSansCJKtc-Bold.otf</bold>
    <italic>fonts/NotoSansCJKtc-Regular.otf</italic>
    <boldItalic>fonts/NotoSansCJKtc-Bold.otf</italic>
    <pdfEncoding>Identity-H</pdfEncoding>
    <pdfEmbedded>true</pdfEmbedded>
    <locales>
      <locale>zh_TW</locale>
      <locale>zh_HK</locale>
    </locales>
  </fontFamily>
</fontFamilies>
```

*Download Noto Sans CJK TC OTF fonts from https://github.com/notofonts/noto-cjk*

### Step 2: Update pom.xml

Add the font extension as a dependency or include in your build:

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>noto-cjk-tc-font-extension</artifactId>
  <version>1.0.0</version>
</dependency>
```

### Step 3: Fix JRXML Encoding (if not using font extension defaults)

Update invoice_zh.jrxml:

```xml
<textElement>
  <font fontName="Noto Sans CJK TC" pdfEncoding="Identity-H" isPdfEmbedded="true"/>
</textElement>
```

Or simply remove the encoding attributes entirely—once the font extension is properly configured with `<pdfEncoding>Identity-H</pdfEncoding>` and `<pdfEmbedded>true</pdfEmbedded>`, JasperReports uses those defaults automatically.

---

## Validation Steps

1. **Build the font extension JAR** and verify it contains:
   - `jasperreports_extension.properties` (root)
   - `net/sf/jasperreports/fonts/noto-cjk-tc.xml`
   - `fonts/NotoSansCJKtc-Regular.otf`

2. **Add to classpath** and re-run the export—`CjkInvoiceReportService.exportPdf()` should complete without `JRFontNotFoundException`

3. **Open the generated PDF** and verify:
   - Chinese characters render correctly (not boxes or garbled text)
   - Font is embedded (check PDF properties → fonts → subset)

4. **Test fallback**: If font embedding works, test with a Chinese character outside BMP (e.g., `𠀀`) to confirm Unicode surrogate support via Identity-H

---

## Sources

- Official: https://jasperreports.sourceforge.net/sample.reference/fonts/README.html
- Official: https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/util/JRFontNotFoundException.html
- Official Font Extension Sample: https://github.com/jaspersoft/jasperreports/blob/master/demo/samples/fonts/README.md
