# When To Delegate Drizzle

## Decision

Decide whether an Elysia request stays in this host or moves to `drizzle-persistence-engineer`.

## Use Elysia host for

- Route shape, validation, response typing, OpenAPI metadata, plugins, lifecycle, and Eden clients.
- Passing an existing `db` dependency through Elysia context.
- Request/response schemas derived from already-defined data models.

## Delegate to Drizzle for

- Table schema, relations, indexes, constraints, dialects, drivers, migrations, transactions, and query performance.
- Drizzle Kit commands and migration strategy.
- Drizzle-to-TypeBox schema bridge details.

## Recommendation rule

If the risky decision is SQL, schema, migration, driver, or transaction behavior, delegate to Drizzle. If the risky decision is HTTP contract or Elysia type inference, stay here.

## Verification

- State the boundary and the delegated skill when delegation is chosen.
