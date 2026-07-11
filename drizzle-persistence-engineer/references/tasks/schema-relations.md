# Schema and Relations

## Use

Use for Drizzle tables, keys, indexes, database constraints, and relation metadata.

## Apply

1. Choose the dialect/driver before using dialect-specific column features.
2. Model primary, unique, foreign-key, check, and index constraints in the database schema.
3. Use v1 `defineRelations()` for relational query metadata; keep it distinct from foreign keys.
4. Name constraints and indexes when migrations or production diagnostics benefit.
5. Generate and review the migration before applying it outside local development.

## Failure modes

- Treating ORM relations as database integrity constraints.
- Adding a non-null column to populated data without a backfill plan.
- Indexes whose order does not match real filters/orderings.

## Verify

Run type checking, migration generation, schema diff, and representative constraint tests.
