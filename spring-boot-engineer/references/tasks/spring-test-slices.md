# Spring Test Slices

## When to use

Use when adding or choosing @SpringBootTest, WebMvcTest, MockMvc, or DataJpaTest.

## Inputs

- Behavior under test
- Needed collaborators
- Speed vs coverage tradeoff

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/testing.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for spring test slices.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not default to full application tests for narrow behavior.
- Do not choose a slice that hides the real contract.

## Outputs

- A focused recommendation or implementation plan for spring test slices

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Defaulting to @SpringBootTest when @WebMvcTest or @DataJpaTest would run faster and focus tighter
- [ ] Mistake 2: Choosing a slice that hides the real contract — for example, @WebMvcTest ignoring @Valid on the controller input
- [ ] Mistake 3: Over-mocking collaborators until the test passes without verifying the interaction is realistic

### Negative Examples
**Don't use @SpringBootTest for narrow unit-level behavior** — full application startup is slow and pulls in every bean; a focused slice test that exercises just the class under test runs in seconds and gives more precise feedback.

## Verification

- State the exact annotations or runtime checks that prove the chosen test scope.
