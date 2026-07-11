# Model And Permission Tuning

## When to use

Use when choosing a model/provider or tightening OpenCode permission rules for a concrete repo.

## Inputs

- Target model or provider
- Desired permission scope
- Safety constraints

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/opencode-config-cheatsheet.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for model and permission tuning.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not loosen permissions broadly when the task can be satisfied with a narrow rule.
- Do not scatter model configuration across global and project layers accidentally.

## Outputs

- A focused recommendation or implementation plan for model and permission tuning

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Loosening permissions broadly when the task can be satisfied with a narrow rule
- [ ] Mistake 2: Scattering model configuration across global and project layers without clear precedence
- [ ] Mistake 3: Using a model ID that is not registered in the current provider configuration

### Negative Examples
**Don't grant file system permissions broadly when the task only needs to read specific paths** — scoped permissions are auditable and reversible; broad grants make it impossible to distinguish legitimate from unintended access.

## Verification

- State the model lookup or runtime behavior check that confirms the change.
