Looking at the code, I can immediately spot the root cause. Let me verify with the jasperreports-engineer skill and provide a definitive answer.

## Context
- Inspected: `pom.xml` (JasperReports 6.21.3), `InvoiceReportService.java`, `invoice_main.jrxml`, `line_items_subreport.jrxml`
- Primary lane: **runtime-error** (subreport blank when using JRBeanCollectionDataSource)

## Likely Root Cause

**Direct evidence from `invoice_main.jrxml` line 16:**

```xml
<connectionExpression><![CDATA[$P{REPORT_CONNECTION}]]></connectionExpression>
```

The main report uses `JRBeanCollectionDataSource` (a bean-based data source), but the subreport configuration uses `$P{REPORT_CONNECTION}` — this expression is only valid for JDBC database connections. When you pass a bean collection to the main report, `REPORT_CONNECTION` is `null`, so the subreport receives no data and renders blank.

For bean datasources, JasperReports requires a **data source expression** that creates a new `JRBeanCollectionDataSource` from a collection field.

## Proposed Fix

In `invoice_main.jrxml`, replace the `<connectionExpression>` with a `<dataSourceExpression>`. Also ensure the main report has a field that holds the line items collection:

**1. Add a field to hold line items in `invoice_main.jrxml`:**
```xml
<field name="lineItems" class="java.util.List"/>
```

**2. Replace connectionExpression with dataSourceExpression in the subreport:**
```xml
<subreport>
  <reportElement x="0" y="30" width="500" height="80"/>
  <dataSourceExpression><![CDATA[new JRBeanCollectionDataSource($F{lineItems})]]></dataSourceExpression>
  <subreportExpression><![CDATA[$P{SUBREPORT_DIR} + "line_items_subreport.jasper"]]></subreportExpression>
</subreport>
```

**3. Ensure `OrderView` has a `lineItems` accessor** (e.g., `order.lineItems()` returning `List<LineItem>`), and that `LineItem` has `sku`, `quantity`, and `subtotal` fields matching the subreport's field definitions.

## Validation Steps

1. **Compile the updated JRXML:** `mvn clean compile` or use Jaspersoft Studio's compile button
2. **Verify field names match:** Confirm `OrderView.lineItems()` returns a `List` with objects having `getSku()`, `getQuantity()`, `getSubtotal()` getters
3. **Run the report programmatically** and inspect the PDF — the subreport should now render line items
4. **Check for null safety:** If `lineItems` could be null, wrap: `new JRBeanCollectionDataSource($F{lineItems} != null ? $F{lineItems} : Collections.emptyList())`

## Sources
- Official: https://jasperreports.sourceforge.net/sample.reference/subreport/README.html
- Official: https://jasperreports.sourceforge.net/api/net/sf/jasperreports/engine/data/JRBeanCollectionDataSource.html
