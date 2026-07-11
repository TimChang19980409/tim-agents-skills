# Rest Feature Delivery

## When to use

Use when implementing or refactoring a Spring REST endpoint, DTO contract, validation flow, or error behavior.

## Inputs

- Feature requirement
- Validation and error-handling needs
- Existing controller or service boundaries

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/web.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for rest feature delivery.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not wave away API errors or validation rules.
- Do not pull persistence strategy into the answer unless needed.

## Outputs

- A focused recommendation or implementation plan for rest feature delivery

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Returning validation errors as HTTP 200 with an error body instead of 400 — masks client bugs
- [ ] Mistake 2: Pulling persistence strategy (caching, eager loading) into the REST answer when it belongs in the service layer
- [ ] Mistake 3: Forgetting to document error response shapes — API consumers guess at error formats

### Negative Examples
**Don't wave away validation rules with a generic 500 response** — a 400 with explicit field-level error messages lets clients fix requests without a support ticket; generic 500s hide the problem and force debugging.

## Verification

- List the controller or HTTP assertions that confirm the feature.
