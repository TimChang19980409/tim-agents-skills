# Dialect Driver

## Decision

Choose the Drizzle dialect and database driver path.

## Options

- PostgreSQL: common default for Bun/Elysia services when no repo config exists.
- MySQL, SQLite, SingleStore, MSSQL, CockroachDB: use when the repo or deployment target already requires it.
- Provider-specific drivers such as Neon, Supabase, PGLite, Bun SQL, or AWS Data API: use when existing dependencies or runtime constraints point there.

## Recommendation rule

Follow `drizzle.config.ts` and existing imports first. If none exist, default examples to PostgreSQL and state that assumption.

## Tradeoffs

- Provider drivers may fit serverless/edge better but can constrain transactions, pooling, or local tests.
- Plain SQL drivers are easier to reason about for long-lived services.

## Verification

- Name the dialect, driver import path, and config file used.
- Run a type check or connection smoke test when credentials are available.
