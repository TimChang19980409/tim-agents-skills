# Config Precedence

## Decision

Choose which config layer wins when OpenCode or oh-my-opencode settings overlap.

## Signals/constraints

- Multiple config files present
- Project overrides vs user defaults
- Harness-specific vs core settings

## Options

- Respect documented precedence and change the narrowest winning layer
- Move repo-specific behavior down to project-level config
- Avoid duplicate keys across layers when possible

## Recommendation rule

Modify the narrowest layer that should own the behavior after precedence is taken into account.

## Tradeoffs

- Higher-level overrides are convenient but can hide project behavior.
- Lower-level overrides are explicit but increase repo-local config surface.

## Verification

- State which layer wins and how to confirm the effective config.
