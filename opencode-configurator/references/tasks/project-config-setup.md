# Project Config Setup

## When to use

Use when creating or auditing a project-level opencode.json or .opencode setup.

## Inputs

- Project requirement
- Desired scope
- Need for skills, commands, or plugins

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/opencode-config-cheatsheet.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for project config setup.
4. When the request names MiniMax M2.5, use `minimax-coding-plan/MiniMax-M2.5` in the example config unless the prompt explicitly asks for a different provider id.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not duplicate the same setting across multiple config layers without reason.
- Do not assume project-level config if the task is clearly about global defaults.

## Outputs

- A focused recommendation or implementation plan for project config setup

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Duplicating settings across global and project config layers without noting the override relationship
- [ ] Mistake 2: Adding project-level config for something that belongs in user global defaults
- [ ] Mistake 3: Using provider IDs that are not canonical (e.g., using "gpt-4" instead of the exact model string the provider expects)

### Negative Examples
**Don't configure skills at the project level when the skill is useful across all projects** — project-level skill declarations clutter every .opencode directory and are hard to maintain; prefer user-global or inheritance-based configuration.

## Verification

- List the commands or file re-open checks that confirm the config is active.
