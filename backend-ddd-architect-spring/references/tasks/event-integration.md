# Event Integration

## When to use

Use when defining domain events, integration events, or event-driven collaboration between contexts.

## Inputs

- Source workflow
- Publishing and consuming contexts
- Consistency and ordering needs

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/eventing-patterns.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for event integration.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not call everything an event when a command is clearer.
- Do not ignore replay or idempotency when crossing context boundaries.

## Outputs

- A focused recommendation or implementation plan for event integration

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Using events for internal state changes that do not need cross-context notification
- [ ] Mistake 2: Designing events without schema versioning from the start
- [ ] Mistake 3: Ignoring idempotency in consumers when the publishing side retries

### Negative Examples
**Don't call it an event when a direct call or command is clearer** — adding async event infrastructure to what is fundamentally a synchronous workflow adds latency, complexity, and failure modes without benefit.

## Verification

- State the contract or replay checks that prove the event design.
