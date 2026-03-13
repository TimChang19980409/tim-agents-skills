# Component Boundaries

## Decision

Choose whether the task should stay inside the frontend host, split a component boundary, or hand off to `react-component-designer`.

## Signals/constraints

- The user is defining or changing a reusable component API
- Slots, children contracts, controlled/uncontrolled state, or headless composition dominate the problem
- The existing component mixes unrelated state machines or layout responsibilities

## Options

- Keep the task in the frontend host when the work is mostly implementation inside an existing API
- Hand off to `react-component-designer` when the API surface is the main design problem
- Split the component or feature boundary before coding when responsibilities are mixed

## Recommendation rule

Use `react-component-designer` if API shape or customization model is the central decision. Stay in the host if the API is already set and the work is mainly implementation or review.

## Tradeoffs

- Staying in the host is faster but can hide API drift
- Handing off improves reuse decisions but adds an extra decision boundary

## Verification

- Confirm the selected boundary makes the next implementation step smaller and clearer
