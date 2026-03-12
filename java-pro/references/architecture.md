# Architecture Guidance

Use this reference when the task is about Java module boundaries, runtime architecture, or cross-cutting technical decisions.

## Boundary-setting principles

- Keep domain logic independent from infrastructure details where the project structure allows it.
- Push framework dependencies to adapters and delivery layers rather than core business code.
- Prefer stable interfaces between modules and explicit ownership of shared abstractions.
- Separate synchronous orchestration concerns from asynchronous integration concerns.

## Decision patterns

- Use layered architecture when the application is straightforward and team cognition matters more than theoretical purity.
- Use hexagonal boundaries when the system has multiple delivery or integration adapters and domain rules need isolation.
- Use event-driven flows when cross-module consistency can be eventual and operational visibility is in place.
- Use a modular monolith before microservices when deployment independence is not yet the main constraint.

## Observability as architecture

- Decide where correlation IDs begin and how they cross async boundaries.
- Define what must be logged, metered, and traced before incidents happen.
- Treat operational dashboards and alert signals as part of the design, not an afterthought.

## Reliability and safety

- Make failure boundaries explicit around retries, idempotency, timeouts, and circuit breaking.
- Avoid hidden cross-module transactions and implicit shared mutable state.
- Document assumptions that affect scaling, consistency, or supportability.

## Things this reference does not cover

Delegate to `spring-boot-engineer` when the user needs concrete Spring Boot project assembly such as controllers, repositories, security config, or configuration properties. Delegate to a DDD-specific skill when the question is primarily about bounded contexts, aggregates, or context mapping.
