# Component API Design

## Use

Use when a reusable component's public contract, customization, state ownership, or composition is the central decision.

## Decide

1. Classify the component as primitive, composite, interactive, or headless.
2. Ask only what changes the API: replaceable regions, external state, reordering, accessibility, or scale.
3. Start with props and children; add one stronger pattern only when a requirement demands it.
4. Define controlled precedence (`value` + `onChange`) and uncontrolled initialization (`defaultValue`) explicitly.
5. Keep contexts small and stable; expose typed hooks instead of raw internal state.

## Avoid

- Compound components for a fixed shape that props already express.
- Both slots and render props for the same extension point.
- `cloneElement`, raw context values, or undocumented two-source-of-truth state.

## Output and verify

Return the chosen pattern, TypeScript contract, two usage examples, accessibility behavior, and specific pitfalls. Verify that the simplest usage is short and advanced customization does not depend on private state.
