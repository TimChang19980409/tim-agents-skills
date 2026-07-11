# Eden Testing Client

## When to use

Use for Eden Treaty, Eden Fetch, typed API clients, Elysia unit tests, app-level request tests, or client/server type sharing.

**NOTE:** Eden Treaty `.index` removed in 1.3 (breaking change). Load `references/version-matrix.md` for Eden Treaty 1.3 breaking changes.

## Inputs

- Exported root Elysia app type
- Client context: in-process tests vs external client
- Path-param and query-param needs

## Steps

1. Export the root Elysia app type with `export type App = typeof app`.
2. Use `treaty<App>(baseUrl)` for external clients or `treaty(app)` for in-process tests.
3. Represent dynamic path params with function calls, for example `api.user({ id }).get()`.
4. Keep response handling typed with `{ data, error }` and narrow on `error`.
5. Use `app.handle(new Request("http://localhost/path"))` for the smallest route behavior test.
6. Use `edenFetch` only when fetch-like syntax matters and WebSocket support is not needed.

## Safety gates

- Do not add codegen for Eden; it uses the exported app type.
- Do not import server runtime code into browser bundles unless the repo already has a safe type-only export path.
- Do not test partial URLs with `app.handle`.

## Outputs

- Typed Eden client
- One contract-sensitive test for contract-sensitive routes

## Anti-patterns

### Common Mistakes
- [ ] Adding codegen for Eden (it uses the exported app type)
- [ ] Importing server runtime code into browser bundles without type-only export path
- [ ] Testing partial URLs with `app.handle` (requires full URLs)

### Negative Examples
**Don't use `treaty(app).api.user.get('/123')`** — use `api.user({ id: '123' }).get()` instead for proper path-param typing.

## Verification

- Run `bun test`.
- For contract-sensitive routes, add one Eden Treaty test that would fail if the path, method, params, or response type changes.
