# Plugin Lifecycle Context

## When to use

Use for Elysia plugins, lifecycle hooks, macros, guards, `state`, `decorate`, `derive`, `resolve`, context extension, auth wrappers, and global middleware.

## Inputs

- Plugin dependency type: types, behavior, or side effects
- Scope intent: global vs route-specific
- Reuse needs: shared plugin instances vs multiple configurations

## Steps

1. Identify whether the dependency adds types, business behavior, or only global side effects.
2. Use explicit `.use(plugin)` for typed dependencies such as auth, db, state, models, and feature modules.
3. Use global scope only for behavior that truly applies everywhere, such as logging, tracing, CORS, or OpenAPI.
4. Register lifecycle hooks before routes that need them.
5. Add `name` and `seed` to reusable plugins when duplicate execution would be harmful.
6. Prefer `resolve` over `derive` when the derived value depends on validated request data.
7. Use `.guard()` for group-level schema and hooks; configure `@elysiajs/cors` and `@elysiajs/rate-limit` per route with key generation.

## Safety gates

- Do not rely on lifecycle hooks leaking across Elysia instances; encapsulation is the default.
- Do not add a plugin factory unless the repo needs multiple configured instances now.
- Do not hide required dependencies in globals when explicit `.use()` would preserve type safety.

## Outputs

- Named and seeded plugin instance
- Focused lifecycle test proving context property availability

## Anti-patterns

- Relying on lifecycle hooks leaking across Elysia instances
- Plugin factory without multiple configured instances
- Hiding typed dependencies in globals instead of explicit `.use()`

**Don't rely on global state for plugin configuration when route-specific behavior is required** — use `@elysiajs/rate-limit` with per-route configuration and key generation instead of a singleton rate limiter.

## Verification

- Add one focused test for auth/lifecycle behavior.
- Include a route that proves the decorated/resolved context property is available where expected.
- Load references/request-handling-patterns.md for CORS, rate limiting, and guard pattern details.
