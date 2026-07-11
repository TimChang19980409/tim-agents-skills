# Query Builder and RQB

## Use

Use for relational reads, nested loading, filters, prepared queries, or transactions in Drizzle.

## Apply

1. Inspect the installed Drizzle lane; v1 uses RQB v2 relation definitions.
2. Use the relational query API for graph-shaped reads and the SQL-like builder for explicit joins/projections.
3. Select only required columns and constrain nested collections.
4. Keep dependent writes in one transaction supported by the chosen driver.
5. Inspect generated SQL and database query plans for hot paths.

## Failure modes

- Mixing v0 relation APIs with v1 `defineRelations()`.
- Unbounded nested reads or accidental per-row queries.
- Assuming every serverless driver supports interactive transactions.

## Verify

Run type checking, query tests, and `EXPLAIN`/query-count checks for representative data.
