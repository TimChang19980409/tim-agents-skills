---
name: backend-ddd-architect-spring
description: |
  Design Domain-Driven backend architecture for Java and Spring Boot systems.
  Use when requests involve bounded context design, context mapping, aggregate and invariant modeling,
  event-driven integration, anti-corruption layers for legacy systems, microservice decomposition,
  or converting business language into implementable backend architecture outputs.
---

# Backend DDD Architect Spring

## Overview

Transform business language into a decision-ready DDD backend architecture for Java and Spring Boot.
Work from one shared contract file and produce architecture artifacts that front-end and back-end teams can align on.

## Required Input

1. Load `architecture/ddd-contract.v1.yaml`.
2. If missing, copy `assets/ddd-contract.v1.yaml` as the initial template.
3. Confirm this minimum data exists before design work:
- `domain_vision`
- `subdomains`
- `bounded_contexts`
- `aggregates`
- `domain_events`

## Workflow

1. Run event discovery.
- Extract domain events, commands, actors, policies, and pain points.
- Normalize terms into `ubiquitous_language`.

2. Classify subdomains.
- Classify each subdomain as `core`, `supporting`, or `generic`.
- Mark ownership and strategic importance.

3. Define bounded contexts and context map.
- Align contexts to business capability boundaries.
- Choose explicit relationship patterns: `customer_supplier`, `conformist`, `acl`, `open_host_service`, `shared_kernel`, or `partnership`.
- Record relationship rationale in `context_map_relationships`.

4. Model tactical DDD.
- Keep aggregates small and invariant-centric.
- Use ID references across aggregates.
- Define repository boundaries per aggregate root.

5. Design events and consistency.
- Separate `domain_events` from `integration_events`.
- Define eventual consistency points and compensation or saga strategy for cross-aggregate flows.

6. Map to Spring implementation boundaries.
- Map each bounded context to a module or service.
- Keep layering explicit: `controller`, `application`, `domain`, `infrastructure`.
- Keep anti-corruption adapter at inbound or outbound integration edges.

7. Emit architecture outputs.
- `architecture/backend-ddd-blueprint.md`
- `architecture/context-map.mmd`
- `architecture/event-catalog.yaml`
- Append key architectural choices to `decision_log`.

## Validation Commands

Use Bun to run all scripts.

Run these checks before finalizing architecture outputs:

```bash
bun run scripts/validate_aggregate_rules.ts --input architecture/ddd-contract.v1.yaml --strict
bun run scripts/check_ubiquitous_language_consistency.ts --input architecture/ddd-contract.v1.yaml --min-coverage 0.7
bun run scripts/generate_context_map_mermaid.ts --input architecture/ddd-contract.v1.yaml --output architecture/context-map.mmd
```

## Output Quality Gates

1. Define at least one invariant for every aggregate.
2. Avoid direct legacy model sharing; use ACL when integrating legacy systems.
3. Explain any cross-aggregate transaction as event choreography or saga.
4. Keep terminology consistent with `ubiquitous_language`.
5. Produce architecture outputs that are directly actionable for Spring teams.

## Resources

1. `references/ddd-principles.md`: strategic and tactical DDD baseline.
2. `references/context-map-patterns.md`: context relationship patterns and selection rules.
3. `references/spring-mapping.md`: mapping DDD decisions to Spring Boot code structure.
4. `references/eventing-patterns.md`: event modeling, consistency, and failure handling.
5. `scripts/validate_aggregate_rules.ts`: aggregate and invariant checks.
6. `scripts/check_ubiquitous_language_consistency.ts`: term coverage checks.
7. `scripts/generate_context_map_mermaid.ts`: Mermaid context map generation.
8. `assets/ddd-contract.v1.yaml`: shared architecture contract template.
