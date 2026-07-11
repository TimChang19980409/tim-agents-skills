# Schema Relations

## When to use

Use for Drizzle table schemas, column types, indexes, constraints, enums, views, relations, and schema organization.

## Inputs

- Current dialect and core package (pg-core, mysql-core, or sqlite-core)
- Existing schema layout and organization
- Integrity and constraint requirements

## Steps

1. Inspect the dialect import path already used, such as `pg-core`, `mysql-core`, or `sqlite-core`.
2. Define schema in TypeScript and export every table, enum, view, and relation needed by Drizzle Kit.
3. Use database constraints for integrity and Drizzle `relations` for relational query shape.
4. Model many-to-many with an explicit join table.
5. Keep schema files organized the way the repo already does unless the current layout blocks Drizzle Kit.

## Safety gates

- Do not assume Drizzle `relations` create foreign keys; they do not.
- Do not mix dialect core packages in one schema.
- Do not hide generated/default columns from insert/select typing without checking downstream API schemas.

## Outputs

- A focused schema change and migration plan

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Mixing dialect core packages in one schema
- [ ] Mistake 2: Assuming Drizzle relations create foreign keys
- [ ] Mistake 3: Hiding generated columns from typing without checking downstream schemas

### Negative Examples
Don't use .generatedAlwaysAs* for simple arithmetic that the app can compute — save generated columns for computed values needed in queries. Don't embed complex jsonb logic in app code — use pgvector or jsonb operators when performance matters.

## Verification

- Run the repo's type check.
- For schema changes, use `drizzle-kit generate` or `drizzle-kit check` according to the repo's migration flow.
- Load references/query-performance.md for pgvector/jsonb details.
- Load references/connection-and-serverless.md for serverless schema considerations.