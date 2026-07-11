# Migration Flow

## When to use

Use for Drizzle Kit migration files, `generate`, `migrate`, `push`, `pull`, `export`, `check`, Studio, or migration history issues.

## Inputs

- `drizzle.config.ts` for dialect, schema, out, dbCredentials, stage

## Steps

1. Inspect `drizzle.config.ts` for `dialect`, `schema`, `out`, `dbCredentials`, and stage-specific configs.
2. Identify whether the project is database-first or codebase-first.
3. For team/codebase-first work, prefer `drizzle-kit generate` plus reviewed SQL, then `migrate`.
4. Use `push` for local prototypes or explicitly accepted direct schema sync.
5. Use `pull` when the database is the source of truth.
6. On v1, expect migration-folder structure v3: no shared `journal.json`; SQL and snapshots live in separate migration folders.
7. Run `drizzle-kit up` for the v1 metadata upgrade and `check` for branch commutativity conflicts.

## Safety gates

- Do not run migration commands against production without explicit user approval.
- Do not edit generated snapshots by hand unless repairing a known migration-history problem.
- Do not ignore rename prompts; review generated SQL.
- Remember v1 `push` and `pull` cover all schemas by default; set `schemaFilter` deliberately when scope must be narrower.

## Outputs

- Safest migration command: usually `drizzle-kit check` or dry generation review
- Database stage/config used and whether migration metadata is v0 or v1

## Anti-patterns

### Common Mistakes
- [ ] Defaulting to `push` in production — use `generate` and `migrate` instead
- [ ] Editing generated snapshots by hand — breaks migration history
- [ ] Ignoring rename prompts — causes data loss or broken refs

### Negative Examples
**Don't run migrations without zero-downtime planning** — expand-contract pattern (add column, deploy code, remove old) prevents breaking changes. Use testcontainers or fixtures to validate migrations. Load references/connection-and-serverless.md for serverless migration and connection-limit considerations.

## Verification

- State which database stage/config was used.
