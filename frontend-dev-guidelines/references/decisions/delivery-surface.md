# Delivery Surface

## Decision

Choose whether the task should use direct frontend implementation, an archive extension, or browser validation tooling.

## Signals/constraints

- The task is about Storybook, Ladle, Tailwind policy, archived design checklists, or browser-behavior proof
- The user wants implementation versus validation versus archived niche guidance

## Options

- Stay in the host for standard React implementation, review, a11y, or performance work
- Load `react-storybook-vite-workflow`, `ladle-component-workflow`, or `tailwind-best-practices` for those exact surfaces
- Delegate to `stagehand-aria-e2e` when actual user-flow verification is required

## Recommendation rule

Keep the host as default. Load an extension only when the user's task is mostly about that extension's niche, and delegate to Stagehand only when static reasoning is insufficient.

## Tradeoffs

- Host-first keeps the trigger surface small
- Extensions preserve depth without bloating the active router
- Browser validation is higher confidence but slower

## Verification

- Name the chosen surface and explain why it is narrower than the alternatives
