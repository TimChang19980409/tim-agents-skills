# Query Performance

Load this file for batch operations, prepared statements, pagination patterns, EXPLAIN inspection, jsonb queries, pgvector similarity, or generated columns.

## Batch Operations

- Use `db.batch()` for multiple writes to round-trip over Neon HTTP driver.
- Batch reduces network latency by consolidating statements into fewer calls.
- For bulk imports, combine `db.batch()` with transaction boundaries.

## Prepared Statements

- Call `.prepare()` outside hot paths, then `.execute()` repeatedly for 30-60% perf gains.
- Prepared statements reduce parsing overhead on repeated queries.
- With PgBouncer transaction mode, use `prepare: false` or direct connections.

## Cursor-Based Pagination

- Prefer keyset pagination over `OFFSET` for large tables.
- `OFFSET` scans and discards all preceding rows; keyset uses indexed WHERE.
- Pattern: `WHERE id > lastSeenId ORDER BY id LIMIT n`.

## Query Inspection

- Use `EXPLAIN ANALYZE` via `sql` tagged fragments to diagnose slow queries.
- Check for full table scans, missing indexes, or incorrect join order.
- Log generated SQL when project patterns allow.

## Jsonb Queries

- Use `sql` tagged fragments for jsonb operators: `sql`<code>data->>'key'</code>.
- Prefer GIN indexes on jsonb columns for containment queries.
- Keep jsonb shapes stable to avoid query plan churn.

## Pgvector Similarity

- Use `cosine_distance()` or `l2_distance()` operators for vector similarity.
- Create HNSW indexes for fast approximate nearest neighbor search.
- See `/docs/guides/vector-similarity-search` for patterns.

## Generated Columns

- Use generated columns for computed data that should stay in sync.
- Combine with check constraints for data integrity without app-layer enforcement.
- Generated columns can be indexed like regular columns.

## Official URLs

- Drizzle query patterns: `https://orm.drizzle.team/docs/query-overview`
- Drizzle batch API: `https://orm.drizzle.team/docs/batch-api`
- pgvector integration: `https://orm.drizzle.team/docs/guides/vector-similarity-search`