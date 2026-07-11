# Elysia TypeBox Bridge

## Use

Use when deriving Elysia request/response schemas from Drizzle tables.

## Apply

1. Match the bridge to the installed Drizzle lane; v1 provides `drizzle-orm/typebox`.
2. Derive select/insert/update schemas and override only transport-specific rules.
3. Exclude generated IDs, timestamps, and server-owned fields from request bodies.
4. Keep one TypeBox/Standard Schema type source across the route boundary.
5. Separate database nullability from optional request fields deliberately.

## Failure modes

- Keeping obsolete `drizzle-typebox` imports after the v1 migration.
- Exposing persistence-only or generated columns to clients.
- Duplicate TypeBox packages producing incompatible symbols.

## Verify

Type-check the Elysia route and test one accepted and one rejected payload.
