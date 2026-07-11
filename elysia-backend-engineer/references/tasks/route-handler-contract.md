# Route Handler Contract

## When to use

Use for Elysia routes, handlers, HTTP status behavior, context use, cookies, files, streams, SSE, WebSocket endpoint shape, or request/response contracts.

## Inputs

- Route grouping and prefixes
- Request/response schemas (params, query, body, headers, cookie)
- Handler style (inline vs external)
- File upload needs (t.File/t.Files)
- Error handling requirements (onError hook, custom error classes)

## Steps

1. Inspect existing route grouping, prefixes, schemas, and handler style.
2. Keep Elysia method chaining intact so returned instance types carry forward.
3. Put HTTP boundary logic in the route; move non-HTTP business logic into existing services only when the repo already does that.
4. Add `params`, `query`, `body`, `headers`, `cookie`, and `response` schemas where the boundary accepts or returns structured data.
5. Use inline handler wrappers when calling external controller/service functions.
6. Prefer `status(code, payload)` for typed non-200 responses.
7. Add `t.File()` or `t.Files()` for file uploads.
8. Configure `onError` hook or `.error()` custom classes for error handling.
9. Use `event.stream()` or `event.sse()` for streaming responses.
10. Set up WebSocket endpoints with `.ws()` when needed.

## Safety gates

- Do not assign `const app = new Elysia()` and then call methods later if the change depends on inferred store, model, or plugin types.
- Do not mutate response headers after the first streaming yield.
- Do not use partial URLs in `app.handle` tests; create a full URL.

## Outputs

- Typed route with proper schema contracts
- Smallest Bun test using `app.handle(new Request("http://localhost/path"))` or Eden Treaty assertion

## Anti-patterns

### Common Mistakes
- [ ] Breaking method chaining by assigning intermediate instances
- [ ] Mutating response headers after first streaming yield
- [ ] Using partial URLs in app.handle tests

### Negative Examples
**Don't call `.error()` without version check** — it was deprecated in 1.3; use `.status()` instead.

## Verification

- Add or update the smallest Bun test using `app.handle(new Request("http://localhost/path"))` when route behavior changes.
- For typed clients, add an Eden Treaty assertion instead of duplicating fetch boilerplate.

**Note**: Load references/request-handling-patterns.md for file uploads, onError, streaming, and WebSocket details. Load references/version-matrix.md for error()→status() migration (deprecated in 1.3).
