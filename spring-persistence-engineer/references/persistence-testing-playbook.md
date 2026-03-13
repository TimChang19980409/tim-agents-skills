# Persistence Testing Playbook

Load this file when the answer should recommend validation steps or add tests around mappings, queries, transactions, or migrations.

## Test Layers

- Use `@DataJpaTest` for repository behavior, query shape, mapping validation, and persistence-context semantics.
- Use a full Boot integration test only when transaction boundaries, listeners, auditing, or surrounding configuration materially affect the persistence behavior.
- Prefer Testcontainers when SQL dialect behavior or generated DDL must match the target RDBMS.

## What To Verify

- Mapping correctness: persisted graph, cascades, orphan removal, and lock version changes
- Query correctness: selected rows, sort order, projection shape, and query count when fetch tuning is the point
- Transaction behavior: retry semantics, rollback boundaries, and lock acquisition failure modes
- Migration behavior: schema before and after change, backfill safety, and compatibility with existing rows

## Test Design Rules

- Seed only the rows needed to prove the behavior under test.
- Keep repository tests deterministic; avoid relying on implicit ordering.
- When portability is part of the requirement, name which dialect the test actually proves and what still needs vendor-specific verification.
- If a fix depends on batching or generated SQL, assert behavior with logs, metrics, or query-count tooling instead of hand-waving.

## Official URLs

- Spring Boot testing reference: `https://docs.spring.io/spring-boot/reference/testing/index.html`
- Spring Boot test slices appendix: `https://docs.spring.io/spring-boot/appendix/test-auto-configuration/slices.html`
- Spring Data JPA reference: `https://docs.spring.io/spring-data/jpa/reference/`
