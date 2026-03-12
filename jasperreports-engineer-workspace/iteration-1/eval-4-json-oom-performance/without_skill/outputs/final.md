## Analysis: JasperReports OOM on Large JSON Exports

**Interpretation**: `explicit-problem` (known failure point) → `jasperreports-engineer` domain

### Root Causes Identified (from provided code)

| Issue | Location | Impact |
|-------|----------|--------|
| **JRXML recompilation every request** | `SalesExportService.java:17` | Memory leak + CPU waste |
| **No virtualizer** | Missing entirely | All 500K rows held in heap |
| **Full workbook in memory** | `JRXlsxExporter` | XLSX requires significant memory |

### Official Documentation Priority

Let me fetch official JasperReports sources for virtualizer configuration:

## Diagnosis Summary

### Context
- **Files inspected**: `pom.xml`, `SalesExportService.java`, `sales_json.jrxml`, `production-error.log`
- **Version**: JasperReports 6.21.3
- **Lane**: `performance` (OOM on large exports)

### Root Causes (Priority Order)

1. **JRXML recompilation every request** — Line 17 in `SalesExportService.java`:
   ```java
   var report = JasperCompileManager.compileReport(template);
   ```
   This compiles the report template on every API call, wasting CPU and heap memory. For 500K+ row exports, this adds unnecessary pressure.

2. **No virtualizer configured** — The error log explicitly states this. Without `REPORT_VIRTUALIZER`, JasperReports holds all 500,000 rows in heap during fill, then the entire `JasperPrint` object during XLSX export.

3. **XLSX exporter memory profile** — `JRXlsxExporter` builds the workbook in memory before writing. With 500K rows, this easily exceeds heap limits.

### Proposed Fix (Smallest High-Impact)

**Fix 1: Precompile and cache the report**
```java
// Compile once at startup, cache in a Map<String, JasperReport>
private static final Map<String, JasperReport> REPORT_CACHE = new ConcurrentHashMap<>();

public byte[] exportLargeWorkbook(InputStream jsonStream) throws JRException {
    JasperReport report = REPORT_CACHE.computeIfAbsent("sales_json", key -> {
        InputStream template = getClass().getResourceAsStream("/reports/sales_json.jrxml");
        return JasperCompileManager.compileReport(template);
    });
    // ... rest unchanged
}
```

**Fix 2: Add JRSwapFileVirtualizer**
```java
JRSwapFileVirtualizer virtualizer = new JRSwapFileVirtualizer(1000); // pages in memory
Map<String, Object> params = new HashMap<>();
params.put(JRParameter.REPORT_VIRTUALIZER, virtualizer);
// ...
try {
    JasperPrint print = JasperFillManager.fillReport(report, params, dataSource);
    // export
} finally {
    virtualizer.cleanup();
}
```

**Fix 3: Enable XLSX exporter streaming** (if available in 6.21.3)
```java
SimpleXlsxReportConfiguration config = new SimpleXlsxReportConfiguration();
config.setOnePagePerSheet(false);
config.setDetectCellType(true);
exporter.setConfiguration(config);
```

### Validation Steps
1. Run with `-Xmx512m` and verify export completes for 500K rows
2. Monitor heap usage — should stay flat after virtualizer kicks in
3. Verify output XLSX is valid and complete

### Sources
- **Virtualizer Sample**: https://jasperreports.sourceforge.net/sample.reference/virtualizer/README.html
- **Configuration Reference**: https://jasperreports.sourceforge.net/config.reference.html
- **Runtime Playbook**: `references/runtime-playbook.md` (local skill)
