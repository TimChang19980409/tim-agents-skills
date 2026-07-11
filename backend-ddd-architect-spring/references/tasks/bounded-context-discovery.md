# Bounded Context Discovery

## When to use

Use when the team needs to carve bounded contexts from business language, teams, or capability maps.

## Inputs

- Business capability list
- Known team or service boundaries
- Pain points or overlap areas

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/context-map-patterns.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for bounded context discovery.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not force microservice splits when the evidence only supports module boundaries.
- Do not collapse distinct ubiquitous language into one context for convenience.

## Outputs

- A focused recommendation or implementation plan for bounded context discovery

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Splitting contexts along technical layers (API, DB, queue) instead of business capability
- [ ] Mistake 2: Creating a new context for every bounded concept without considering team size and communication overhead
- [ ] Mistake 3: Forcing context splits where module boundaries within a single service are sufficient

### Negative Examples
**Don't collapse distinct ubiquitous languages into one context just because two teams are already working together** — shared jargon masks subtle differences that will cause integration bugs and miscommunication over time.

## Verification

- State how the proposed split would be validated with domain or delivery teams.
