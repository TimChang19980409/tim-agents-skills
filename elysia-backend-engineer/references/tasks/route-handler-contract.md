# Route Handler Contract

## Use

Use for an Elysia route whose params, body, response status, or handler types need a concrete contract.

## Apply

1. Inspect the installed Elysia version and existing schema convention.
2. Define params/query/body and every meaningful response status at the route boundary.
3. Return typed status responses with `status()` on the current 1.4 lane.
4. Keep business logic outside the route and preserve inferred types for Eden clients.
5. Add the narrowest app-level request test that proves success and one failure.

## Failure modes

- A runtime response not represented in the response schema.
- A lifecycle mutation that widens or loses handler context types.
- Throwing validation-like errors after validation instead of modeling the boundary.

## Verify

Run type checking and the route test; inspect generated OpenAPI when the route is public.
