# Spring Data JPA Playbook

Load this file for repository design, query construction, locking, projections, Specifications, or auditing.

## Repository Defaults

- Start with aggregate-root repositories, not one repository per table.
- Prefer derived query methods for short, stable predicates.
- Use JPQL or Criteria only when the predicate logic is too dynamic or the fetch plan must be explicit.
- Treat repository interfaces as a domain boundary, not a dumping ground for every reporting query.

## Fetch Planning

- Fix N+1 with query shape, `@EntityGraph`, projections, or dedicated read models before considering eager mappings.
- Use `@EntityGraph` when you want one repository method to load a known relationship graph without changing the default mapping.
- Use projections when the caller only needs a read slice and entity reattachment is unnecessary.

## Projections And Specifications

- Interface projections fit stable read models and keep query payloads smaller.
- DTO projections are better when shape control or constructor validation matters.
- Specifications are appropriate when filter criteria are user-driven and composable.
- Do not force Specifications into simple single-purpose lookups that are clearer as derived queries.

## Locking And Transactions

- Use optimistic locking by default for business entities that tolerate retry on concurrent writes.
- Use pessimistic locking only when the business invariant requires database-enforced serialization and contention is acceptable.
- Keep transaction boundaries at the application-service layer, not in controllers.
- If a write flow spans multiple aggregates or external systems, call out where the DB transaction ends and compensation begins.

## Auditing

- Use Spring Data auditing for `createdBy`, `createdDate`, `lastModifiedBy`, and `lastModifiedDate` when the app already has a stable security or system principal source.
- Do not confuse auditing columns with business history; real event history often belongs in a separate table or event log.

## Official URLs

- Entity persistence: `https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html`
- Query methods: `https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html`
- Projections: `https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html`
- Specifications: `https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html`
- Locking: `https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html`
- Auditing: `https://docs.spring.io/spring-data/jpa/reference/auditing.html`
