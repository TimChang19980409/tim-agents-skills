# Compatibility Lane

## Decision

Choose the active Spring Boot / Hibernate compatibility lane before giving persistence guidance.

## Signals/constraints

- Build metadata or dependency versions
- Boot 3.5 maintenance vs 4.1 current APIs
- Hibernate 6.6 maintenance, 7.4 stable, and 7.2 limited-support assumptions

## Options

- Use lane-boot-3
- Use lane-boot-4
- Stay conservative if unknown

## Recommendation rule

Lock the lane first; if the lane is ambiguous, recommend the smallest cross-lane-safe change and flag the risk.

## Tradeoffs

- Lane-aware guidance is safer but slower.
- Cross-lane-safe advice is conservative and may miss newer capabilities.

## Verification

- State the chosen lane and why it is active.
