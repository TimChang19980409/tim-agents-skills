# Security Wiring

## When to use

Use when configuring SecurityFilterChain, JWT or OAuth2 login, method security, or CORS.

## Inputs

- Auth style
- Frontend or client constraints
- Authorization boundaries

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/security.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for security wiring.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not mix security wiring advice with unrelated runtime tuning.
- Do not leave CORS or auth rules implicit.

## Outputs

- A focused recommendation or implementation plan for security wiring

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Leaving CORS rules implicit or overly permissive (allow-all origins) in development
- [ ] Mistake 2: Mixing security configuration with unrelated runtime tuning concerns
- [ ] Mistake 3: Implementing custom authentication when Spring Security's built-in providers cover the use case

### Negative Examples
**Don't skip authorization checks on actuator endpoints in production** — /health, /info, and /metrics endpoints often leak environment details; always audit what is exposed and require authentication or network-level restrictions.

## Verification

- State the MockMvc or integration tests that prove the security behavior.
