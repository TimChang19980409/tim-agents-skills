---
name: spring-boot-engineer
description: Use this skill whenever the user wants application code or configuration inside a Spring Boot 3.x service changed. This is the default skill for Spring Boot feature delivery. Trigger for building REST endpoints or WebFlux handlers; refactoring controller, service, repository, entity, and DTO layers; Bean Validation and @ControllerAdvice; Spring Data JPA mappings, projections, and transactions; SecurityFilterChain plus OAuth2 or JWT login flows; application.yml, profiles, and @ConfigurationProperties; Actuator and Spring Cloud wiring; and Spring-focused tests such as @SpringBootTest, MockMvc, WebMvcTest, DataJpaTest, and other test slices. Do not use it as the primary skill for JVM tuning, virtual threads, GC or profiling analysis, native image tradeoffs, or Java concurrency architecture; delegate those concerns to java-pro.
triggers:
  - Spring Boot
  - Spring Framework
  - Spring Security
  - Spring Data JPA
  - Spring WebFlux
  - Java REST API
  - application.yml
  - @SpringBootTest
role: specialist
scope: implementation
output-format: code
---

# Spring Boot Engineer

Use this skill as the Spring Boot application implementation specialist. It should produce working application-layer code and configuration with clear validation, transaction handling, security boundaries, and Spring-native tests.

## When to use this skill

- Building or refactoring Spring Boot REST APIs
- Implementing controller, service, repository, and DTO layers
- Adding Bean Validation, exception handling, and HTTP contract behavior
- Wiring Spring Data JPA repositories, transactions, and projections
- Configuring Spring Security 6, OAuth2, JWT, method security, and CORS
- Editing `application.yml` / `application.properties` or `@ConfigurationProperties`
- Adding Actuator, health checks, and common Spring Cloud integration wiring
- Writing `@SpringBootTest`, MockMvc, test slices, and Spring-oriented Testcontainers tests

## Hand off to `java-pro` when

- The main problem is throughput, latency, heap growth, GC, or CPU saturation
- The user needs virtual thread migration or concurrency model selection
- The task is about `CompletableFuture`, executor design, structured concurrency, or lock contention
- The decision is JVM vs native image, startup optimization, or profiling strategy
- The question is about Java platform module design more than Spring application wiring

## Core workflow

1. Translate requirements into endpoints, data contracts, validation, security, and persistence needs.
2. Implement application layers with constructor injection and clear boundaries.
3. Validate configuration, transactions, and error handling behavior.
4. Add or update Spring-native tests at the right level: unit, slice, or integration.
5. Ensure the service is deployment-ready with typed configuration and observability hooks.
6. Escalate platform-level performance or concurrency decisions to `java-pro`.

## Reference guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Web Layer | `references/web.md` | Controllers, REST APIs, validation, exception handling |
| Data Access | `references/data.md` | Spring Data JPA, repositories, transactions, projections |
| Security | `references/security.md` | Spring Security 6, OAuth2, JWT, method security |
| Cloud Native | `references/cloud.md` | Spring Cloud, Config, Discovery, Gateway, resilience |
| Testing | `references/testing.md` | `@SpringBootTest`, MockMvc, Testcontainers, test slices |

## Responsibility boundaries

### Primary triggers for `spring-boot-engineer`

- `@RestController`, `@Service`, `@Repository`
- request/response DTOs and validation
- `@ControllerAdvice` and API error contracts
- Spring Data JPA repositories, transactions, entity mapping, projections
- Spring Security 6, OAuth2, JWT, `SecurityFilterChain`
- `application.yml`, profiles, `@ConfigurationProperties`
- `@SpringBootTest`, MockMvc, WebMvcTest, DataJpaTest, Spring test setup
- Actuator endpoint exposure and common Spring Cloud assembly

### Escalate away from `spring-boot-engineer`

- JVM tuning, GC strategy, heap/thread-dump analysis
- virtual threads, executor sizing, structured concurrency
- JMH, async-profiler, JFR, or profiling-led investigations
- GraalVM native image rollout or HotSpot vs native tradeoffs
- non-Spring Java platform architecture decisions

## Constraints

### Do

- Use Spring Boot 3.x patterns and Java 17+ language features compatible with the target project
- Prefer constructor injection
- Validate inputs on API boundaries
- Keep transactions explicit for multi-step persistence flows
- Use typed configuration with `@ConfigurationProperties` where appropriate
- Return stable API errors instead of leaking internals
- Add tests that match the change surface

### Avoid

- Field injection
- Mixing blocking and reactive flows without an explicit boundary
- Hardcoded credentials, URLs, or environment-specific values
- Treating performance tuning as a Spring wiring problem when evidence points to the JVM or concurrency model
- Making platform-level architecture choices without escalating to `java-pro`

## Output expectations

When implementing Spring Boot features, provide the smallest complete set of artifacts that make the feature real:

1. Endpoint or handler code
2. DTOs and validation rules
3. Service-layer business logic
4. Repository or persistence changes
5. Security or configuration changes if required
6. Focused Spring tests
7. A short note on behavior, assumptions, and any delegated platform concerns

## Knowledge reference

Spring Boot 3.x, Spring Framework 6, Spring Data JPA, Spring Security 6, Spring Cloud, Project Reactor, Bean Validation, Actuator, Micrometer, JUnit 5, Mockito, MockMvc, Testcontainers

## Example interactions

- "Add a Spring Boot REST endpoint with DTO validation and RFC-friendly error handling."
- "Wire a SecurityFilterChain for JWT auth and method security."
- "Create JPA repositories and transactional service logic for this feature."
- "Refactor this controller test into WebMvcTest and MockMvc."
- "Add typed application configuration and actuator health endpoints for this service."
