# Eventing Patterns for DDD Systems

## Event Types

1. Domain events
- Represent meaningful state changes inside a bounded context.
- Usually consumed by same context or near neighbors.

2. Integration events
- Represent stable contracts between bounded contexts.
- Must be versioned and backward compatible when possible.

## Consistency Patterns

1. Single aggregate transaction
- Enforce invariants synchronously inside one aggregate.

2. Cross-aggregate eventual consistency
- Trigger follow-up actions via domain or integration events.
- Use compensation logic for failure recovery.

3. Saga or process manager
- Use when long-running business transactions span contexts.
- Model state machine and timeout handling explicitly.

## Failure Handling

1. Use idempotency keys on consumers.
2. Use retry with dead-letter strategy.
3. Track event schema version and migration policy.
4. Record observability fields: event id, correlation id, causation id, timestamp.

## Event Catalog Template

- `name`:
- `type`: `domain` or `integration`
- `producer_context`:
- `consumer_contexts`:
- `payload_schema`:
- `consistency_note`:
- `version`:
