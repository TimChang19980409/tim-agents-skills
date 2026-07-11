# Aggregate Design

## When to use

Use when defining aggregate boundaries, invariants, and transactional consistency for a concrete domain slice.

## Inputs

- Candidate entity or workflow set
- Business invariants
- Write-side consistency requirements

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/ddd-principles.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for aggregate design.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not create aggregates larger than the invariant requires.
- Do not bury invariants inside application-service choreography.

## Outputs

- A focused recommendation or implementation plan for aggregate design

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Modeling every entity as its own aggregate because "everything needs its own transaction"
- [ ] Mistake 2: Burying business invariants in application service orchestration instead of aggregate root methods
- [ ] Mistake 3: Allowing references to non-root entities from outside the aggregate boundary

### Negative Examples
**Don't use a single aggregate for the entire domain because it simplifies transactions** — this collapses the bounded context and removes the protective boundary that prevents invariants from leaking across unrelated workflows.

## Verification

- State the transactional or domain-event checks that confirm the boundary.
