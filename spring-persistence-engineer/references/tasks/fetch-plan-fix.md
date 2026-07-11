# Fetch Plan Fix

## When to use

Use when resolving N+1 problems or choosing between EntityGraph, join fetch, or projection.

## Inputs

- Query shape
- Current repository behavior
- Need for portability or Hibernate-specific tuning

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/spring-data-jpa-playbook.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for fetch plan fix.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend FetchType.EAGER as a blanket fix.
- Do not propose a heavier query shape than the use case needs.

## Outputs

- A focused recommendation or implementation plan for fetch plan fix

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Defaulting to FetchType.EAGER to avoid lazy loading exceptions — causes memory bloat and N queries
- [ ] Mistake 2: Using join fetch on every query without considering if the关联 is always needed
- [ ] Mistake 3: Applying EntityGraph to the root entity only, missing nested关联 chains

### Negative Examples
**Don't use `@Fetch(FetchMode.SUBSELECT)` as a generic N+1 fix** — it works for one-off reporting but pollutes the persistence context and can cause stale data in OLTP scenarios where entity identity matters.

## Verification

- Name the repository or SQL-level checks that confirm the N+1 issue is fixed.
