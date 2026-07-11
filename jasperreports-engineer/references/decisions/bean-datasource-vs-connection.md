# Bean Datasource Vs Connection

## Decision

Choose whether a Jasper report should use bean/collection data or a JDBC connection flow.

## Signals/constraints

- Source data already in memory
- Need for SQL inside the report
- Subreport and datasetRun wiring complexity

## Options

- Use bean datasources
- Use JDBC connection flows
- Mix them only with an explicit boundary

## Recommendation rule

Default to bean/collection datasources when application code already owns the data shape.

## Tradeoffs

- Bean flows are explicit and testable but require parameter wiring.
- Connection flows can simplify SQL-heavy reports but couple runtime to DB access.

## Verification

- State which datasource style was chosen and why.
