---
name: rdbms-data-modeling
description: |
  Deep schema and portability specialist for relational database modeling across PostgreSQL, MySQL, MariaDB,
  SQL Server, and Oracle. Use when the task is primarily schema-first design, normalization vs denormalization,
  key strategy, constraints, indexes, JSON-vs-relational tradeoffs, temporal modeling, soft delete, audit columns,
  or cross-vendor comparison before application code exists.
---

# RDBMS Data Modeling

This archive skill is a deep reference pack for schema-first design and vendor-specific tradeoffs. It is not part of
the default core roster, so load it explicitly when the problem is mostly about data modeling or portability rather
than Spring application delivery.

## Best Use Cases

- Designing a schema before entities or repositories exist
- Comparing PostgreSQL, MySQL, MariaDB, SQL Server, and Oracle for one domain model
- Deciding between normalized tables, JSON columns, or hybrid patterns
- Choosing keys, unique constraints, indexes, temporal columns, and soft-delete strategy
- Reviewing whether a relational model actually preserves the domain invariants

## Workflow

1. Start from business rules and access patterns.
- Identify invariant boundaries, lookup paths, retention needs, and write-hot tables.

2. Design the portable model first.
- Define tables, primary keys, foreign keys, uniqueness, nullability, and index intent.
- Only then add vendor-specific optimizations.

3. Compare vendors deliberately.
- Call out where JSON, UUID, identity, sequence, and timezone behavior diverge.
- State the operational cost of the vendor-specific choice, not just the syntax.

4. Keep migrations and lifecycle visible.
- Include rollout or backfill implications for every non-trivial schema decision.

5. Hand implementation back to `spring-persistence-engineer` when the conversation turns into entities, repositories,
   Hibernate annotations, or Spring tests.

## Recommended Output Shape

## Context
- Name the local notes or schema briefs inspected

## Schema Sketch
- Tables, keys, and relationship direction

## Portability Notes
- What works everywhere
- What becomes vendor-specific

## Risks
- Write hot spots, migration cost, or uniqueness edge cases

## Sources
- Official vendor URLs only when the answer depends on database behavior
- Use literal `https://...` URLs, not document titles or GitHub source file paths

Before sending, scan the final answer:

1. If there is no literal `## Context`, rewrite it.
2. If `## Context` does not name the inspected local notes or schema briefs, rewrite it.
3. If there is no literal `https://` URL in `## Sources`, rewrite it.
4. If the answer cites GitHub source paths or `Context7`, replace them with vendor docs URLs.

## Reference Guide

| Topic | Reference | Load When |
| --- | --- | --- |
| General modeling heuristics | `references/foundations.md` | normalization, denormalization, keys, constraints, indexing |
| PostgreSQL | `references/postgresql.md` | `uuid`, `jsonb`, sequences, timezone-aware types |
| MySQL | `references/mysql.md` | `JSON`, UUID storage, auto-increment, portability tradeoffs |
| MariaDB | `references/mariadb.md` | JSON alias behavior, sequence vs auto-increment choices |
| SQL Server | `references/sqlserver.md` | `uniqueidentifier`, identity, JSON, row-versioning concerns |
| Oracle | `references/oracle.md` | sequences, `SYS_GUID`, binary JSON, enterprise conventions |
| Cross-vendor matrix | `references/portability-matrix.md` | direct vendor comparison |
