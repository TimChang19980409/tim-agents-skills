# Framework Migration

## When to use

Use when migrating an older skill to the host/playbook/decision framework shape.

## Inputs

- Current skill shape
- Target role
- Known reference files or extensions

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/schemas.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for framework migration using the exact vocabulary `thin router`, `playbooks`, and `decision guides`.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not rewrite the whole knowledge base if task wrappers are enough.
- Do not change portfolio role unless the boundary genuinely changed.

## Outputs

- A focused recommendation or implementation plan for framework migration

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Rewriting the entire knowledge base when task playbooks and decision guides are sufficient
- [ ] Mistake 2: Changing portfolio role without evidence that the boundary genuinely shifted
- [ ] Mistake 3: Migrating to a host skill without updating the trigger surface in skills.json

### Negative Examples
**Don't fold every archived skill into a host without validating the host can handle the combined load** — hosts have limited routing bandwidth; overloading a host with too many triggers degrades all skill performance.

## Verification

- List the evals needed to prove the migrated skill still triggers and routes correctly.
