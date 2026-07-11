# Virtual Thread Migration

## When to use

Use when migrating blocking Java code to virtual threads or structured concurrency.

## Inputs

- Current concurrency model
- Blocking dependencies
- Risk areas like ThreadLocal or connection pools

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/concurrency.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for virtual thread migration.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend virtual threads blindly for CPU-bound loops.
- Do not skip ThreadLocal or pool-limit risks.

## Outputs

- A focused recommendation or implementation plan for virtual thread migration

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Applying virtual threads to CPU-bound loops — no benefit and added scheduling overhead
- [ ] Mistake 2: Ignoring ThreadLocal cleanup before migration — values leak across virtual thread tasks
- [ ] Mistake 3: Using connection pools configured for platform threads without adjusting maxPoolSize for virtual threads

### Negative Examples
**Don't migrate to virtual threads without auditing ThreadLocal usage first** — ThreadLocal values that are not cleared between tasks can leak data between unrelated requests in virtual thread environments where tasks share the same carrier thread.

## Verification

- Name the soak tests or measurements that confirm the migration is safe.
