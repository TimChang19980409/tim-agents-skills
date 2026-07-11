# Elysia TypeBox Bridge

## When to use

Use when Drizzle schemas feed Elysia validation models, OpenAPI docs, or Eden client contracts.

## Inputs

- Installed bridge package (`drizzle-typebox` or equivalent)
- Elysia version (1.4+ supports Standard Schema: Zod/Valibot/ArkType)
- TypeBox version (pin to match Elysia if duplicates appear)
- Drizzle schema shape with target table(s)

## Steps

1. Inspect installed packages and prefer the bridge already used by the repo.
2. For Elysia docs-compatible setup, use `drizzle-typebox` and Elysia `t` refinements when present.
3. Pin or align `@sinclair/typebox` with Elysia if duplicate TypeBox symbols appear.
4. Assign generated schemas to a variable before applying `t.Pick`, `t.Omit`, or refinements.
5. Exclude generated, private, or server-managed columns from insert request bodies.
6. Keep database schema and API schema related but not identical when security requires it.

## Safety gates

- Do not inline `createInsertSchema(...)` inside `t.Omit` if it triggers infinite type instantiation.
- Do not expose password hashes, salts, internal IDs, or timestamps in request schemas by default.
- Do not mix multiple TypeBox packages without checking symbol compatibility.

## Outputs

- Derived validation schema with Elysia TypeBox refinements applied
- One route validation test proving schema accepts/rejects expected payloads

## Anti-patterns

### Common Mistakes
- [ ] Inlining `createInsertSchema(...)` inside `t.Omit` when infinite type instantiation occurs
- [ ] Exposing password hashes or internal IDs in request schemas by default
- [ ] Mixing TypeBox packages without symbol compatibility checks

### Negative Examples
**Don't trust generated schemas blindly** — manually review and refine for security before using in public APIs.

## Verification

- Run TypeScript checks.
- Add one route validation test that proves the derived schema accepts and rejects the expected payloads.

**Cross-skill reference:** Load ../../elysia-backend-engineer/references/version-matrix.md for Elysia version-specific TypeBox/Standard Schema changes.
