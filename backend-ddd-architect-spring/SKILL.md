---
name: backend-ddd-architect-spring
description: |
  Design DDD bounded contexts, aggregates, context maps, and event integration for Spring backends.
  Use when domain boundaries are the main decision. Do not use for application or persistence implementation;
  route those to spring-boot-engineer or spring-persistence-engineer.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Backend DDD Architect Spring

Work from business language and invariants. Load one route, produce decision-ready boundaries, then hand implementation off.

## Routes

- [Bounded-context discovery](references/tasks/bounded-context-discovery.md)
- [Aggregate design](references/tasks/aggregate-design.md)
- [Context map](references/tasks/context-map.md)
- [Event integration](references/tasks/event-integration.md)
- [When to split a service](references/decisions/when-to-split-service.md)
- [Implementation handoff](references/decisions/when-to-delegate-to-boot-or-persistence.md)

## Constraints

- Align contexts to business capabilities, not technical layers.
- Keep aggregates invariant-focused; use identifiers across aggregate boundaries.
- Separate domain events from integration contracts and state consistency/compensation choices.
- Keep anti-corruption logic at integration edges.

Return bounded contexts, aggregate ownership, context relationships, event contracts, unresolved risks, and the correct Spring implementation handoff.
