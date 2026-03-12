# Build and Runtime Guidance

Use this reference when the user is making packaging, build, container, or runtime-environment decisions for Java services, jobs, or CLIs.

## Build strategy

- Keep multi-module builds explicit about dependency direction and public API surfaces.
- Fail fast in CI with tests, static analysis, dependency hygiene, and reproducible build settings.
- Prefer the smallest build graph that supports the change; avoid global rebuilds by default when project tooling allows scoping.

## JVM runtime guidance

- Set container-aware memory and CPU expectations deliberately; do not rely on accidental defaults.
- Tune runtime flags only after verifying workload shape and baseline behavior.
- Keep startup flags, GC selection, CDS usage, and memory caps versioned with the deployable artifact or deployment config.

## Native image guidance

- Choose native image for startup time, cold-start memory profile, or CLI ergonomics, not by default.
- Verify reflection, proxying, resource loading, and dynamic classpath behavior before committing to native builds.
- Compare end-to-end cost: build time, image size, debugging complexity, and operations support.

## Delivery and operability

- Package logs, metrics, and health checks as first-class runtime requirements.
- Keep environment-specific configuration externalized and typed where possible.
- Define rollback strategy before introducing runtime-level experiments such as new GC modes or native image rollout.

## Things this reference does not cover

Delegate to `spring-boot-engineer` when the main task is Spring Boot Actuator configuration, `application.yml` authoring, Spring Cloud Config wiring, or environment-specific Spring property binding.
