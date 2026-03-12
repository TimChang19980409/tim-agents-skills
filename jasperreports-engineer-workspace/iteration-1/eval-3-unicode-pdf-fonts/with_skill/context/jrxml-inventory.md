# JRXML Inventory

## .opencode/skills/jasperreports-engineer/evals/files/json-oom/src/main/resources/reports/sales_json.jrxml
- language: java
- queryLanguage: json
- queryText: orders.items
- parameters: (none)
- fields: sku, region, amount, description
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 0
- components: (none)
- fonts: (none)
- imports: (none)

## .opencode/skills/jasperreports-engineer/evals/files/migration-7/src/main/resources/reports/sales_legacy.jrxml
- language: java
- queryLanguage: n/a
- queryText: (empty)
- parameters: REPORT_TITLE
- fields: (none)
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 0
- components: (none)
- fonts: (none)
- imports: (none)

## .opencode/skills/jasperreports-engineer/evals/files/pdf-fonts/src/main/resources/reports/invoice_zh.jrxml
- language: java
- queryLanguage: n/a
- queryText: (empty)
- parameters: CUSTOMER_NAME
- fields: (none)
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 0
- components: (none)
- fonts: Noto Sans CJK TC
- imports: (none)

## .opencode/skills/jasperreports-engineer/evals/files/subreport-datasource/src/main/resources/reports/invoice_main.jrxml
- language: java
- queryLanguage: n/a
- queryText: (empty)
- parameters: SUBREPORT_DIR, INVOICE_NO
- fields: customerName
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 1
- components: (none)
- fonts: (none)
- imports: (none)

## .opencode/skills/jasperreports-engineer/evals/files/subreport-datasource/src/main/resources/reports/line_items_subreport.jrxml
- language: java
- queryLanguage: n/a
- queryText: (empty)
- parameters: (none)
- fields: sku, quantity, subtotal
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 0
- components: (none)
- fonts: (none)
- imports: (none)

## src/main/resources/reports/invoice_zh.jrxml
- language: java
- queryLanguage: n/a
- queryText: (empty)
- parameters: CUSTOMER_NAME
- fields: (none)
- variables: (none)
- groups: (none)
- datasets: (none)
- subreports: 0
- components: (none)
- fonts: Noto Sans CJK TC
- imports: (none)
