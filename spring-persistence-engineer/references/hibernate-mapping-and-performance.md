# Hibernate Mapping And Performance

Load this file for entity associations, identifier strategy, batching, fetch tuning, JSON columns, or time-zone handling.

## Association Modeling

- Prefer explicit join entities over naked many-to-many mappings when the relationship has status, audit, ordering, or business identity.
- Keep bidirectional associations only when both directions are read frequently and consistently maintained.
- Default to lazy relationships; change query shape rather than changing the mapping to eager.

## Identifier Strategy

- `SEQUENCE` is the best default where the database supports it well and batching matters.
- `IDENTITY` is convenient but can limit batching and write-behind behavior.
- UUIDs improve decoupling but make storage layout and index locality vendor-sensitive; call out `BINARY(16)` vs textual storage choices explicitly.
- Application-assigned identifiers can be useful for offline workflows or cross-system correlation, but they shift uniqueness guarantees into the app contract.

## Fetch And Write Performance

- Separate read-model tuning from aggregate write-model tuning.
- Diagnose N+1 with repository methods, query count, and relationship access path before changing mappings.
- For bulk imports, enable batching, order inserts or updates when supported, and flush or clear the persistence context deliberately.
- Use `EntityManager.flush()` / `EntityManager.clear()` or an equivalent documented persistence-context boundary; `JpaRepository` does not expose a generic `clear()` method.
- Use bulk HQL or SQL carefully; call out stale persistence-context risk after bulk writes.

## JSON Columns

- Treat JSON mapping as a vendor-aware feature, not a portability default.
- For Hibernate-specific JSON mappings, confirm both the ORM lane and the target dialect capabilities.
- If portability matters more than vendor JSON operators, consider normalized tables or explicit converters instead of leaning on dialect-specific JSON querying.

## Time Zone Handling

- Store instants in a timezone-safe type and make the application boundary explicit about user-local presentation.
- Do not mix `LocalDateTime` semantics with cross-timezone audit or scheduling requirements.
- When portability matters, explain whether the database has a real timezone-aware timestamp type or only offset-less storage.

## Official URLs

- Hibernate ORM 6.6 user guide: `https://docs.hibernate.org/orm/6.6/userguide/html_single/Hibernate_User_Guide.html`
- Hibernate ORM 7.4 user guide: `https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html`
- Hibernate ORM releases and support status: `https://hibernate.org/orm/releases/`
