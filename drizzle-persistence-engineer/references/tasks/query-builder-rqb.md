# Query Builder RQB

## When to use

Use for Drizzle SQL-like queries, relational queries, filters, joins, inserts, updates, deletes, transactions, batching, and query performance fixes.

## Inputs

- Query intent (read shape, write set, or mixed)
- SQL-like builder vs relational query API choice
- Transaction needs (single-statement safe or multi-write consistency)

## Steps

1. Decide whether the SQL-like builder or relational query API is the smaller fit.
2. Use SQL-like queries when the requested operation maps directly to SQL.
3. Use relational queries for nested object graphs that would otherwise require manual join mapping.
4. In relational query callbacks, reference the callback table alias, not the imported table object.
5. Wrap multi-statement writes in `db.transaction`.
6. Return only the columns the caller needs.
7. For bulk writes, use `db.batch()` to reduce round-trips (especially over Neon HTTP).
8. For repeated parameterized queries, use `.prepare()` outside hot paths then `.execute()`.
9. For large-table pagination, prefer keyset (`WHERE id > $cursor ORDER BY id LIMIT n`) over `OFFSET`.
10. Load references/query-performance.md for batch API, cursor pagination, prepared statements, and EXPLAIN details.

## Safety gates

- Do not hand-roll string SQL when Drizzle operators or `sql` tagged fragments cover the case.
- Do not skip transactions for balance, inventory, or multi-table writes.
- Do not introduce a repository abstraction unless the repo already uses one.

## Outputs

- Smallest correct query or mutation matching the intent
- Accompanying test (service or query level)

## Anti-patterns

### Common Mistakes
- [ ] Hand-rolling string SQL when Drizzle operators or `sql` tagged fragments cover the case
- [ ] Skipping transactions for balance, inventory, or multi-table writes
- [ ] Importing the table object inside an RQB callback instead of using the callback alias

### Negative Examples
**Don't use `sql` raw strings for parameterized queries** — Drizzle's builder already handles escaping and parameter binding; raw strings reintroduce injection risk and lose type safety.

**Don't paginate large tables with `OFFSET`** — `OFFSET` scans and discards all preceding rows. Use keyset pagination with an indexed column for predictable latency.

## Verification

- Add the smallest service/query test available in the repo.
- For generated SQL-sensitive changes, log or inspect the SQL only when the project already has that pattern.
