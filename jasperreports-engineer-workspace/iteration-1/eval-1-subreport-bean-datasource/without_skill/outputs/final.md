## Diagnosis

**Root Cause**: The subreport uses `<connectionExpression>` with `$P{REPORT_CONNECTION}`, but the main report uses `JRBeanCollectionDataSource` — a bean-based datasource, not a JDBC connection. JasperReports ignores the connection expression when using bean datasources, resulting in no data passed to the subreport.

## Smallest Safe Fix

Change `connectionExpression` to `dataSourceExpression` in the main report's subreport element:

```xml
<subreport>
  <reportElement x="0" y="30" width="500" height="80"/>
  <dataSourceExpression><![CDATA[new JRBeanCollectionDataSource($F{lineItems})]]></dataSourceExpression>
  <subreportExpression><![CDATA[$P{SUBREPORT_DIR} + "line_items_subreport.jasper"]]></subreportExpression>
</subreport>
```

This requires:
1. The `OrderView` class to have a `lineItems` field (collection of line item beans)
2. The field `$F{lineItems}` to exist in the main report (add it to `<field>` declarations)

## Validation Steps

1. **Compile the updated JRXML** with `JasperCompileManager.compileToFile()`
2. **Run the report** and verify the subreport band displays line items
3. **Check logs** — JasperReports logs subreport fill events; look for `Filling report: line_items_subreport`

## Documentation Reference

From [JasperReports Subreports Guide](https://community.jaspersoft.com/wiki/subreports-overview): When using `JRBeanCollectionDataSource`, subreports must use `dataSourceExpression` to receive the nested collection, not `connectionExpression`.
