# Portability Choice

## Decision

Choose whether the persistence recommendation should optimize for one vendor or stay portable.

## Signals/constraints

- Number of vendors in scope
- Vendor-specific types like jsonb or identity columns
- Importance of future migrations

## Options

- Optimize for one vendor
- Prefer portable relational design
- Use vendor-specific features only with explicit payoff

## Recommendation rule

Default to portability when more than one RDBMS matters; use vendor-specific features only with a stated benefit.

## Tradeoffs

- Vendor-specific features can simplify one deployment but increase migration cost.
- Portable design is safer but may be less concise.

## Verification

- Name the chosen vendor stance and the rejected tradeoff.
