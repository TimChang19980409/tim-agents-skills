# Compatibility Lanes

Inspect the project's dependency management; do not infer an ORM version from a Boot major alone.

| Lane | Use | Persistence baseline |
| --- | --- | --- |
| Boot 3.5 maintenance | Existing Boot 3 applications | Java 17+, Jakarta Persistence 3.1-era APIs, commonly Hibernate 6.6 |
| Boot 4.1 current | New/current Boot 4 applications | Java 17–26; inspect resolved Spring Data and Hibernate versions |
| Hibernate 6.6 maintenance | Long-lived compatibility | Maintain and migrate deliberately |
| Hibernate 7.4 stable | Direct Hibernate 7 adoption | Preferred stable Hibernate 7 line when the platform permits |
| Hibernate 7.2 limited | Existing pinned systems only | Upgrade planning; do not select for new independent work |

## Rules

1. Read the effective Maven/Gradle dependency graph and Boot BOM before using version-specific APIs.
2. Do not override Boot-managed Hibernate merely to reach 7.4 without testing Spring Data, enhancement, dialect, and Jakarta compatibility.
3. Keep portable JPA mappings separate from Hibernate-only JSON, fetch, cache, and type features.
4. Re-run schema validation, repository tests, generated-SQL assertions, and representative migrations after a lane change.

Official sources: [Spring Boot requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Hibernate releases](https://hibernate.org/orm/releases/).
