# Request Handling Patterns

Load this file for advanced Elysia request-handling patterns, streaming, error handling, and cross-cutting concerns beyond basic route shape.

## File Uploads

- Use `t.File()` for single files, `t.Files()` for multiple; specify MIME types, minSize, and maxSize
- Access via `body.files.<field>` or `body.file.<field>`; nested dot notation works for forms
- Validate MIME types with magic-number checks; never trust client Content-Type
- Handle missing files as optional fields or validate required presence upfront

## Error Handling

- Use `onError` lifecycle hook for global error formatting and logging
- Create custom error classes with `.error()` for typed, structured responses
- Use `ValidationError.all` to extract all validation errors for detailed responses
- Suppress validation details in production; return generic messages or error codes

## Streaming and SSE

- Use `sse()` function for Server-Sent Events; pass generator functions yielding objects
- Support `ReadableStream` directly for arbitrary streaming responses
- Close streams explicitly in handlers or use `AbortController` for cleanup
- Keep SSE stateless; use WebSocket for bidirectional real-time needs

## WebSocket Lifecycle

- Define `.ws()` endpoints with open, message, close, ping, pong, and drain hooks
- Use `ws.subscribe()` for channel subscriptions; validate topics and permissions
- Broadcast with `app.server.publish()` or `ws.publish()`; target channels, not connections
- Handle connection lifecycle errors; close cleanly on exceptions

## CORS Configuration

- Use `@elysiajs/cors` plugin for origin, methods, allowedHeaders, credentials, and preflight
- Restrict origins to exact arrays; avoid wildcard in production with credentials enabled
- Preflight caching with `maxAge` reduces OPTIONS overhead
- Expose only needed headers; avoid exposing all headers

## Rate Limiting

- Use `@elysiajs/rate-limit` for per-route or global rate limiting
- Configure per-route limits on sensitive endpoints; apply global defaults as safety net
- Choose Redis for distributed systems; in-memory for single-instance deployments
- Generate keys from IP, user ID, or API key; include route name for granular control