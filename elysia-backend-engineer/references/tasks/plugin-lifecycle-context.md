# Plugin, Lifecycle, and Context

## Use

Use when an Elysia plugin derives context, decorates the app, installs lifecycle hooks, or risks duplicate execution.

## Apply

1. Identify whether the value is singleton decoration, per-request derivation, or resolved context.
2. Give reusable plugins a stable name and seed when deduplication matters.
3. Register hooks before routes that depend on them and preserve lifecycle scope.
4. Keep derived values type-sound; avoid mutation that is invisible to later handlers.
5. Test two routes or registrations when deduplication/order is the risk.

## Failure modes

- Anonymous plugins executing twice.
- Derivation after the consuming route is registered.
- Runtime context existing while TypeScript cannot see it.

## Verify

Type-check the composed app and assert hook count/order in a focused test.
