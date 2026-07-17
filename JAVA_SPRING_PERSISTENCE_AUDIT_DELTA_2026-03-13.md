# Java / Spring Persistence Audit Delta (2026-03-13)

English | [繁體中文](JAVA_SPRING_PERSISTENCE_AUDIT_DELTA_2026-03-13.zh-TW.md)

This note records the portfolio change that adds `spring-persistence-engineer` as a new core host and preserves
`rdbms-data-modeling` as an archive specialist.

## Why A New Core Host

- The existing split between `java-pro`, `spring-boot-engineer`, and `backend-ddd-architect-spring` was strong, but
  persistence-heavy requests still fell into a gap between application assembly and domain architecture.
- Spring Data JPA, Hibernate `6.x` / `7.x`, and multi-RDBMS tradeoffs are now large enough to justify their own host.
- Keeping this material inside `spring-boot-engineer` would have made that skill too broad and increased trigger
  collisions with `java-pro` and `backend-ddd-architect-spring`.

## New Boundaries

- `spring-persistence-engineer`: entities, repositories, fetch plans, locking, batching, Hibernate lane selection,
  and RDBMS portability.
- `spring-boot-engineer`: controllers, DTOs, validation, security, config, actuator, and Spring application assembly.
- `java-pro`: JVM, concurrency, profiling, runtime, and platform architecture.
- `backend-ddd-architect-spring`: domain boundaries, context maps, aggregates, and invariants.
- `_archive/rdbms-data-modeling`: schema-first and vendor-comparison deep dives, loaded explicitly.

## Portfolio Impact

- Core roster expands from 13 to 14 active skills.
- Java / Spring / Backend family now has a dedicated persistence host instead of routing all persistence work through
  the application assembly skill.
- Cross-vendor data-modeling depth is preserved without over-expanding the default active trigger surface.
