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
- lane-1.3: use status(), exact-mirror, Elysia.Ref
- lane-1.4+: use Standard Schema, fromTypes(), no macro v1

## Recommendation rule

Detect lane from package.json/lockfile first; if ambiguous, recommend smallest cross-lane-safe change and flag the risk.

## Tradeoffs

- Lane-aware guidance is safer but slower.
- Cross-lane-safe advice is conservative and may miss newer capabilities.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: version-lane`
- State the chosen lane and why it is active.