---
name: spring-boot-engineer
description: |
  Implement Spring Boot REST, Security, configuration, profiles, and Spring-native tests.
  Use when implementing Spring controllers, Security, configuration, profiles, or application tests. Do not use for JPA/Hibernate internals or
  domain decomposition; route those to spring-persistence-engineer or backend-ddd-architect-spring.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Spring Boot Engineer

Read the build, Boot lane, configuration, security chain, and existing test style before implementing.

## Routes

- [REST feature delivery](references/tasks/rest-feature-delivery.md)
- [Security wiring](references/tasks/security-wiring.md)
- [Configuration and profiles](references/tasks/config-and-profiles.md)
- [Spring test slices](references/tasks/spring-test-slices.md)
- [Test scope](references/decisions/choose-test-scope.md)
- [Reactive boundary](references/decisions/reactive-boundary.md)

Keep Boot 3.5 maintenance and Boot 4.1 current lanes explicit. Boot 4.1 supports Java 17–26. Prefer the narrowest Spring-native test that proves behavior and avoid mixing servlet and reactive stacks without an explicit boundary.
