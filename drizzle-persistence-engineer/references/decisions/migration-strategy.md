# Migration Strategy

## Decision

Choose how schema changes move between TypeScript and the database.

## Options

- Database-first: manage SQL externally and use `drizzle-kit pull`.
- Codebase-first direct sync: use `drizzle-kit push`.
- Codebase-first reviewed migrations: use `drizzle-kit generate` and `drizzle-kit migrate`.
- External migration tool: use `drizzle-kit generate` or `export`, then apply outside Drizzle.

## Recommendation rule

For production/team work, default to generated SQL migrations reviewed in version control. Use `push` only for local prototypes or when the user explicitly chooses direct sync.

## Tradeoffs

- `push` is fast but easy to misuse in shared environments.
- `generate` plus `migrate` is more ceremony but reviewable.
- `pull` respects database-first ownership.

## Verification

- Run `drizzle-kit check` after migration history changes when available.
- State whether SQL was only generated, applied by Drizzle, or applied externally.
