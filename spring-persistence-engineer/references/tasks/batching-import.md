# Batching Import

## When to use

Use when imports or bulk writes are slow, memory-heavy, or sensitive to ID generation strategy.

## Inputs

- Import workload size
- ID generation strategy
- Current memory or throughput symptom

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/hibernate-mapping-and-performance.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for batching import.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend batching without addressing persistence-context growth.
- Do not ignore identity-generation limits when proposing batching.

## Outputs

- A focused recommendation or implementation plan for batching import

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Enabling batch inserts without clearing the persistence context — entity snapshots accumulate and cause OOM
- [ ] Mistake 2: Using IDENTITY generation strategy with batch insert — IDs are not pre-allocated, breaking batching
- [ ] Mistake 3: Batching without setting `hibernate.jdbc.batch_size` and `hibernate.order_inserts` together

### Negative Examples
**Don't increase batch size without monitoring entity dirty-check cost** — every persisted entity is snapshotted for dirty checking; very large batches can make the persistence context slower than the inserts save.

## Verification

- State the import metrics or SQL batching checks that confirm the improvement.
