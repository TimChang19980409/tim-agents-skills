# Assertion Layer

## Decision

Choose whether a browser test should use ARIA snapshots, layout-tree assertions, plain Playwright, or screenshots.

## Signals/constraints

- Semantic vs layout vs pixel contract
- DOM volatility
- Need for agent-driven planning

## Options

- Use ARIA snapshots
- Use layout-tree assertions
- Use plain Playwright
- Keep screenshots only when pixel-perfect rendering is the contract

## Recommendation rule

Default to semantic or structural assertions before screenshot-based proof.

## Tradeoffs

- ARIA snapshots are robust for semantics but do not prove layout.
- Layout-tree assertions prove structure without screenshot noise.

## Verification

- State the chosen assertion layer and what alternative was rejected.
