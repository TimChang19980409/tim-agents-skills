# Validation OpenAPI

## When to use

Use for `Elysia.t`, TypeBox, Standard Schema, request validation, response schemas, reference models, guards, or OpenAPI docs.

## Inputs

- Schema source: Zod/Valibot/ArkType alongside TypeBox (Standard Schema 1.4+)
- OpenAPI needs: docs route, version annotation, status-code schemas
- tsconfig/root for `fromTypes()` resolution

## Steps

1. Inspect the existing schema source: `t`, Standard Schema (Zod/Valibot/ArkType, 1.4+), or TypeBox.
2. Prefer one schema source per boundary and reuse reference models where they already exist.
3. Define route schemas close to the route unless the repo has a model module pattern.
4. Add response schemas per status code when clients or OpenAPI need typed outcomes.
5. Register `@elysia/openapi` once at the app boundary and use `detail` for route metadata.
6. Use `fromTypes()` only when the root app type is exported and the project can resolve the correct tsconfig/root.

## Safety gates

- Remember HTTP `params`, `query`, and `headers` are strings before Elysia coercion.
- Do not assume `withHeader` validates headers; set headers in the handler or lifecycle.
- Keep custom validation errors stable enough for clients to consume.
- Use `exact-mirror` normalization (1.3+, 500x faster) and `sanitize` XSS option.
- Load `references/version-matrix.md` for Standard Schema and exact-mirror version gating.

## Outputs

- Reusable reference models and generated docs route

## Anti-patterns

- Assuming `withHeader` validates headers; it does not validate, it sets headers.
- Mixing multiple schema sources without a symbol check or resolver.
- Stale custom validation errors that break client integration.

**Don't assume validation covers headers** — validate explicitly in the handler or lifecycle.

## Verification

- Run the repo's type check or `bun test`.
- When OpenAPI is changed, verify the generated docs route or snapshot if the repo has one.
