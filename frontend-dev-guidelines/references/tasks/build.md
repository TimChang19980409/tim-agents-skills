# Build

## When to use

Use this playbook when the user is adding a new React/TypeScript page, route, component, form, or feature slice and wants concrete implementation work.

## Inputs

- The target files or feature area
- Existing repo patterns for routing, state, styling, and data fetching
- User constraints on UX, performance, or accessibility

## Steps

1. Inspect the existing feature boundary, data layer, and styling system before changing code.
2. Keep the change inside the repo's established framework and file organization.
3. Reuse existing components, hooks, and helpers before introducing new abstractions.
4. If reusable component API design dominates, hand off to `react-component-designer`.
5. If story tooling or Tailwind policy becomes the main issue, load the matching extension pack.

## Safety gates

- Do not redesign unrelated screens.
- Do not add new dependencies unless the user explicitly asks.
- Do not replace existing state or data libraries just to match generic best practice.

## Outputs

- A complete implementation diff or a repo-grounded build plan
- Any required typing, route wiring, styling, and tests

## Verification

- Run the narrowest relevant tests, type checks, or build command available
- Note assumptions and any user-visible tradeoffs
