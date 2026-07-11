# Choose Test Scope

## Decision

Choose the narrowest Spring test scope that still proves the requested behavior.

## Signals/constraints

- Controller vs service vs full integration behavior
- Need for HTTP serialization, security filters, or DB wiring
- Speed vs realism tradeoff

## Options

- WebMvcTest / MockMvc
- DataJpaTest
- @SpringBootTest

## Recommendation rule

Prefer the narrowest Spring test slice that still exercises the contract the user cares about.

## Tradeoffs

- Narrow slices are faster but can miss cross-layer issues.
- Full application tests are realistic but slower and noisier.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: choose-test-scope`
- State the chosen annotation set and why narrower or broader scopes were rejected.
