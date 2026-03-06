# DDD Principles for Backend Architecture

## Strategic DDD

1. Model the domain using a shared language with domain experts.
2. Define bounded contexts before designing services or modules.
3. Build a context map that documents upstream and downstream relationships.
4. Use subdomain classification to focus investment on core business differentiation.

## Tactical DDD

1. Keep aggregates small and centered on invariants.
2. Enforce invariants inside aggregate boundaries.
3. Prefer ID references between aggregates.
4. Treat repositories as aggregate persistence boundaries.
5. Raise domain events to model meaningful business state transitions.

## Common Failure Patterns to Avoid

1. Splitting services by technical layers instead of business capabilities.
2. Sharing one model across multiple bounded contexts.
3. Defining oversized aggregates with broad transaction scope.
4. Coupling integration directly to legacy schemas.
5. Ignoring ubiquitous language drift between teams.

## Decision Heuristics

1. If language diverges, split bounded contexts.
2. If invariants are independent, separate aggregates.
3. If integration contracts are unstable, isolate with ACL.
4. If cross-context latency is acceptable, prefer asynchronous integration events.

## Quick Architecture Checklist

1. Every bounded context has clear ownership.
2. Every aggregate has explicit invariants.
3. Every integration edge has a documented pattern.
4. Every event has producer, consumer, and contract.
