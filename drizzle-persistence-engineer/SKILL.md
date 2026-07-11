---
name: drizzle-persistence-engineer
description: |
  Drizzle ORM specialist for TypeScript SQL persistence. Use for Drizzle schema,
  relations, dialect/driver setup, queries, transactions, Drizzle Kit migrations,
  and Elysia TypeBox validation bridges.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Drizzle Persistence Engineer

Use this skill as the Drizzle ORM persistence specialist. Pick one task playbook or one decision guide before loading deeper references.

## Intent Router

- `schema-relations`: [references/tasks/schema-relations.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/tasks/schema-relations.md)
- `query-builder-rqb`: [references/tasks/query-builder-rqb.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/tasks/query-builder-rqb.md)
- `migration-flow`: [references/tasks/migration-flow.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/tasks/migration-flow.md)
- `elysia-typebox-bridge`: [references/tasks/elysia-typebox-bridge.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/tasks/elysia-typebox-bridge.md)
- `dialect-driver`: [references/decisions/dialect-driver.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/decisions/dialect-driver.md)
- `migration-strategy`: [references/decisions/migration-strategy.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/decisions/migration-strategy.md)
- `connection-serverless`: [references/decisions/connection-serverless.md](/Users/ss105213025/.agents/skills/drizzle-persistence-engineer/references/decisions/connection-serverless.md)

## Delegation

- Delegate Elysia route, lifecycle, OpenAPI, and Eden client work to `elysia-backend-engineer`.
- Delegate generic Bun CLI/script work to `bun-ts-scripting-policy`.
- Keep Spring Data JPA and Hibernate work in `spring-persistence-engineer`.

## Core Workflow

1. Inspect `drizzle.config.ts`, schema files, package dependencies, dialect, driver, and migration folder before recommending changes.
2. Choose one router id and keep the solution SQL-shaped rather than hiding SQL behind broad abstractions.
3. Preserve schema exports so Drizzle Kit can diff migrations.
4. Treat `relations` as application-level query metadata; add foreign keys separately when the database should enforce integrity.
5. Use transactions for multi-step writes and callback table aliases in relational queries.
6. Verify with the smallest safe Drizzle Kit command or repo test; do not run production migrations without an explicit request.

## Response Guardrails

- Do not default to `drizzle-kit push` for production rollout.
- Do not add Prisma or another ORM for a Drizzle task.
- If the user asks to start with `Selected:`, the first line must be `Selected: <exact router id>` with no prose before it.
- If no dialect is discoverable, state the assumption and default examples to PostgreSQL.
