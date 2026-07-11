---
name: spring-persistence-engineer
description: |
  Implement Spring Data JPA and Hibernate mappings, fetch plans, locking, batching, and portability.
  Use when persistence behavior is central. Do not use for controllers, security, or domain boundaries;
  route those to spring-boot-engineer or backend-ddd-architect-spring.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Spring Persistence Engineer

Inspect mappings, generated SQL, transaction boundaries, dialect, and load profile before changing persistence behavior.

## Routes

- [Entity mapping](references/tasks/entity-mapping.md)
- [Fetch-plan fix](references/tasks/fetch-plan-fix.md)
- [Locking strategy](references/tasks/locking-strategy.md)
- [Batch import](references/tasks/batching-import.md)
- [Compatibility lane](references/decisions/compatibility-lane.md)
- [Portability choice](references/decisions/portability-choice.md)

Use Hibernate 7.4 as stable, 6.6 as maintenance, and 7.2 only as limited-support compatibility. Prove changes with SQL/query counts, concurrency tests, or representative batches; do not hide N+1 or locking problems behind broad eager loading.
