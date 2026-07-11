# Stagehand Vs Playwright

## Decision

Choose whether a browser task needs Stagehand orchestration or plain Playwright is enough.

## Signals/constraints

- Flow complexity and selector volatility
- Need for semantic planning vs deterministic selectors
- Stable testids or roles

## Options

- Use Stagehand
- Use plain Playwright
- Mix Stagehand actions with Playwright assertions

## Recommendation rule

Use Stagehand when semantic planning meaningfully reduces brittleness; otherwise prefer plain Playwright for deterministic flows.

## Tradeoffs

- Stagehand is flexible on volatile DOMs but adds abstraction.
- Playwright is direct and fast when selectors are stable.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: stagehand-vs-playwright`
- State the chosen tool boundary and why it fits the flow.
