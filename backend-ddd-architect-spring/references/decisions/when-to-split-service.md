# When To Split Service

## Decision

Choose whether a domain slice should stay within one service/module or become a separate bounded context or deployment unit.

## Signals/constraints

- Different language or ownership
- Change cadence and team autonomy
- Failure isolation and coupling

## Options

- Keep one service or module
- Split bounded contexts inside one repo
- Create separate deployment units

## Recommendation rule

Split only when language, ownership, and operational pressure all point to a real seam.

## Tradeoffs

- Early service splits increase complexity.
- Keeping everything together preserves simplicity but can hide ownership conflicts.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: when-to-split-service`
- State the chosen split level and what evidence supports it.
