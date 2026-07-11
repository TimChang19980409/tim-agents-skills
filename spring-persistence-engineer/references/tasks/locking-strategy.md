# Locking Strategy

## When to use

Use when preventing lost updates or choosing optimistic vs pessimistic locking.

## Inputs

- Concurrency symptom
- Read/write pattern
- Throughput and contention profile

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/spring-data-jpa-playbook.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for locking strategy.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend pessimistic locking without stating the throughput cost.
- Do not omit transaction-boundary implications for write races.

## Outputs

- A focused recommendation or implementation plan for locking strategy

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Reaching for pessimistic locking without quantifying the contention and throughput cost
- [ ] Mistake 2: Using optimistic locking without versioning the entity properly — causes silent lost updates
- [ ] Mistake 3: Wrapping read-only operations in explicit transactions just to use locking hints

### Negative Examples
**Don't skip transaction boundary review when introducing locking** — a lock acquired outside the transaction boundary is ineffective, and one held too long kills throughput without improving correctness.

## Verification

- State the concurrency test or replay needed to prove the fix.
