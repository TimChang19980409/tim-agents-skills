# Eden Testing Client

## Use

Use when exporting an Elysia app type, consuming it through Eden Treaty, or testing the typed client/server contract.

## Apply

1. Export the final composed app type after plugins and routes are registered.
2. Keep shared contract packages type-only; avoid importing server startup side effects.
3. Instantiate Treaty against the in-memory app or an explicit test server.
4. Assert both transport status and the discriminated typed body.
5. Add one failure response so schema/status drift is visible.

## Failure modes

- Exporting a partial app type before plugin composition.
- Different Elysia versions in server and contract packages.
- Starting a real listener in unit tests without needing network behavior.

## Verify

Run type checking plus the smallest client contract test.
