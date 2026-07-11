# Runtime Deployment Surface

## Decision

Choose the runtime or integration surface for an Elysia app.

## Options

- Bun server: default for new standalone Elysia services.
- Node.js, Deno, Cloudflare Worker, Vercel, or meta-framework route: use when the repo already targets that platform.
- Docker or single executable: use when deployment packaging is the actual request.

## Recommendation rule

Default to Bun for standalone services. Follow the existing repo runtime when editing an existing app.

## Tradeoffs

- Bun gives the most direct Elysia path.
- Edge/meta-framework integrations may constrain filesystem, sockets, environment variables, or server APIs.
- Node/Deno portability can matter more than Bun-specific APIs such as `server.requestIP`.

## Verification

- Name the selected runtime and any Bun-only APIs used.
- Run the existing start/build/test command for that runtime.
