# When Not To Use Bun

## Decision

Choose whether Bun/TS is still the right runtime or whether an explicit override is justified.

## Signals/constraints

- Repo already has a hard runtime constraint
- Dependency or platform support gaps
- User explicitly requested another runtime

## Options

- Use Bun/TS
- Respect an explicit runtime override
- Stay compatible with the repo if Bun would break the workflow

## Recommendation rule

Default to Bun/TS unless the repo or user has a concrete incompatible constraint.

## Tradeoffs

- Staying on Bun keeps the portfolio consistent.
- Honoring a real runtime constraint avoids brittle migrations.

## Verification

- State whether Bun remains the default or why it was overridden.
