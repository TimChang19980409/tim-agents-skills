# Project Vs Global Scope

## Decision

Choose whether an OpenCode configuration change belongs in project-level config or user/global defaults.

## Signals/constraints

- Repo-specific behavior vs personal default
- Need for portability with the repo
- Whether multiple repos should inherit the setting

## Options

- Use project config
- Use global/user config
- Use both only with an intentional override

## Recommendation rule

Default to project config when the behavior is repo-specific; use user config only for cross-repo personal defaults.

## Tradeoffs

- Project config is portable but can be noisy if overused.
- Global config is convenient but harder to share.

## Verification

- State the chosen scope and why the other layer was not the primary owner.
