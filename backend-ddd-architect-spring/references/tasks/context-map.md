# Context Map

## When to use

Use when the team needs a context map, upstream/downstream relationships, or anti-corruption strategy.

## Inputs

- Known bounded contexts
- Integration touchpoints
- Legacy or external system dependencies

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/context-map-patterns.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for context map.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not use events as a vague default when the consistency model is synchronous.
- Do not skip anti-corruption layers when language conflicts with the target domain.

## Outputs

- A focused recommendation or implementation plan for context map

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Defaulting to events for all context integrations without analyzing consistency needs
- [ ] Mistake 2: Skipping anti-corruption layers when integrating with legacy systems that use different terminology
- [ ] Mistake 3: Marking a downstream context as "conforming" without verifying the published interface is stable

### Negative Examples
**Don't use a shared kernel without explicit ownership rules and contract tests** — shared kernels reduce translation cost but create tight coupling; without governance, changes in one context silently break the other.

## Verification

- State the contract or ownership checks that confirm the map.
