# Draft Skill

## When to use

Use when creating a new skill from scratch around a concrete workflow or capability.

## Inputs

- Desired capability
- Trigger conditions
- Expected output or workflow

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/schemas.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for draft skill.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not overtrigger the description with vague absolutes.
- Do not create deep reference hierarchies unless the skill really needs them.

## Outputs

- A focused recommendation or implementation plan for draft skill

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Writing trigger descriptions so broad they match unrelated prompts — causes misrouting
- [ ] Mistake 2: Creating deep reference hierarchies that are hard to maintain and rarely consulted
- [ ] Mistake 3: Overloading a new skill with edge cases instead of defining the happy path clearly first

### Negative Examples
**Don't create a skill without a clear scope boundary from existing skills** — without explicit separation, the router will be inconsistent and evals will show cross-contamination between skill outputs.

## Verification

- State the initial eval prompts that should validate the draft.
