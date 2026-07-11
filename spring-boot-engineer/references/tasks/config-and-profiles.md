# Config And Profiles

## When to use

Use when editing application.yml, profiles, or @ConfigurationProperties.

## Inputs

- Target environments or profiles
- Configuration keys
- Need for typed config objects

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/cloud.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for config and profiles.
4. If the repo files are missing, still provide a concrete profile split plan using `application.yml` plus `application-local.yml`, `application-test.yml`, and `application-prod.yml`, together with a sample `@ConfigurationProperties` binding shape.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not hardcode environment-specific values into code.
- Do not blur project config and external platform config.

## Outputs

- A focused recommendation or implementation plan for config and profiles
- A typed configuration plan that explicitly names `application.yml`, profiles, and `@ConfigurationProperties` when the prompt is abstract

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Hardcoding environment-specific values directly in code instead of externalizing to application.yml
- [ ] Mistake 2: Using the same profile for local development and production when their requirements diverge
- [ ] Mistake 3: Mixing application-level config with platform-level (kubernetes, cloud) config in the same file

### Negative Examples
**Don't override configuration with environment variables without documenting the precedence explicitly** — Spring's relaxed binding makes it easy to lose track of which source wins; document the hierarchy clearly to avoid surprises during incidents.

## Verification

- Name the binding or smoke tests that confirm the config change.
