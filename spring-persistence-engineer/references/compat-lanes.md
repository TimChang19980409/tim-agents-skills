# Compatibility Lanes

Use this file whenever version-sensitive persistence behavior is in play.

## Lane Matrix

| Lane | Spring Boot | Spring Framework | Spring Data JPA | Hibernate ORM | Jakarta Persistence |
| --- | --- | --- | --- | --- | --- |
| `lane-boot-3` | `3.5.x` | `6.2.x` | `3.5.x` | `6.6.x` | `3.1.x` |
| `lane-boot-4` | `4.0.x` | `7.0.x` | `4.0.x` | `7.2.x` | `3.2.x` |

## Verified Reference Points

- Spring Boot `3.5.9` manages `org.hibernate.orm:hibernate-core:6.6.41.Final`.
- Spring Boot `4.0.3` manages `org.hibernate.orm:hibernate-core:7.2.4.Final`.
- Spring Data JPA `4.0.3` documents a Spring Framework `7.0.3+` baseline.
- Hibernate ORM `7.2` has a dedicated migration guide; do not assume `6.6` mappings or deprecated APIs remain unchanged.

## Decision Rules

1. If the repo is on Boot `3.5.x`, default to Hibernate `6.6` guidance and Jakarta Persistence `3.1` assumptions.
2. If the repo is on Boot `4.0.x`, allow Hibernate `7.2` guidance and Jakarta Persistence `3.2` assumptions.
3. Do not mix lanes casually:
- Hibernate `7.x` APIs inside Boot `3.5.x` need explicit dependency-management override work and compatibility validation.
- Boot `4.0.x` migrations should review removed or tightened Hibernate behaviors before copy-pasting `6.x` recipes.
4. When the user says "Hibernate 6 | 7 compatible", prefer guidance that works in both lanes or explicitly separate the answer into `lane-boot-3` and `lane-boot-4`.

## Migration Friction Points

- JSON mapping and SQL type handling: confirm whether the code relies on Hibernate-specific annotations or pure JPA converters.
- Identifier generation: re-check `IDENTITY` and `SEQUENCE` assumptions after a lane upgrade.
- Query and fetch tuning: keep Spring Data repository abstractions stable when possible and isolate Hibernate-specific tuning.
- Deprecated APIs: search for removed `org.hibernate` APIs before a Boot `3.5 -> 4.0` migration.

## Official URLs

- Spring Boot 3.5 dependency coordinates: `https://docs.spring.io/spring-boot/3.5/appendix/dependency-versions/coordinates.html`
- Spring Boot 4.0 dependency coordinates: `https://docs.spring.io/spring-boot/4.0/appendix/dependency-versions/coordinates.html`
- Spring Data JPA dependencies: `https://docs.spring.io/spring-data/jpa/reference/data-commons/dependencies.html`
- Hibernate ORM 6.6 user guide: `https://docs.hibernate.org/orm/6.6/userguide/html_single/Hibernate_User_Guide.html`
- Hibernate ORM 7.2 user guide: `https://docs.hibernate.org/orm/7.2/userguide/html_single/Hibernate_User_Guide.html`
- Hibernate ORM 7.2 migration guide: `https://docs.hibernate.org/orm/7.2/migration-guide/`
