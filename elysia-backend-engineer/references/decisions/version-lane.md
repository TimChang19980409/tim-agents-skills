# Version Lane

## Decision

Choose the active Elysia version lane before giving guidance.

## Signals/constraints

- package.json or lockfile version constraint
- OpenAPI requirements and Eden Treaty usage
- Macro v1 or Standard Schema adoption needs
- Error handling patterns (error() vs status())

## Options

- lane-pre-1.3: use error(), Eden .index, macro v1
- lane-1.3: compatibility only; use `status()`, exact-mirror, and `Elysia.Ref`
- lane-1.4: current; Standard Schema, lifecycle type soundness, macro schemas, and OpenAPI type generation

## Recommendation rule

Detect the installed lane first. For new work, use 1.4 and preserve method chaining and lifecycle registration order so inferred context stays sound.

## Tradeoffs

- Lane-aware guidance is safer but slower.
- Cross-lane-safe advice is conservative and may miss newer capabilities.

## Verification

- State the chosen lane and why it is active.
