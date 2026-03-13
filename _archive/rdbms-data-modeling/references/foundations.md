# Foundations

## Modeling Rules

- Model invariants before access convenience.
- Use surrogate primary keys freely, but preserve natural-key uniqueness where the business depends on it.
- Replace many-to-many with a join entity when the relationship has lifecycle, audit, ordering, or status.
- Make nullability intentional; `NULL` should mean something the business can explain.
- Index to support actual read paths and uniqueness guarantees, not to decorate every column.

## Normalization vs Denormalization

- Normalize by default for transactional correctness and update safety.
- Denormalize when read cost dominates and the duplication is explicitly maintained.
- JSON is not a substitute for relational structure when you need joins, constraints, or stable query predicates.

## Temporal And Lifecycle Columns

- Separate business-effective dates from technical audit timestamps.
- Soft delete is a lifecycle decision, not just a boolean column.
- If deleted rows must preserve uniqueness semantics, define how the active-row uniqueness is enforced.

## Migration-First Rule

- Treat every schema change as a migration with rollback and backfill implications.
- Avoid depending on ORM auto-DDL for shared, production, or long-lived databases.
