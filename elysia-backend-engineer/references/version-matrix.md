# Elysia Version Matrix

Migration reference for Elysia 1.2–1.4 breaking changes. Load from playbooks when version-sensitive guidance is needed.

## 1.2 (Dec 2024)

| Area | Before | After (1.2) |
| --- | --- | --- |
| Type system | Separate `type()` and `parse()` | Merged into single `type()` call |
| Form body | Auto-detected form submissions | Explicit `form()` return required; no auto-detect |
| WebSocket | Method-chained WS API | Match Bun native WebSocket; no method chaining |
| Plugin scope | `as('plugin')` | `as('scoped')` replaces `as('plugin')` |

**Migration friction**: Audit every `.type()` + `.parse()` pair. Replace `.as('plugin')` globally. Rewrite WS handlers using Bun's native API.

## 1.3 (May 2025)

| Area | Before | After (1.3) |
| --- | --- | --- |
| Error returns | `error()` helper | Deprecated → use `status()` for return type narrowing |
| Eden Treaty | `.index` property available | `.index` removed (breaking) |
| Normalization | `exact: false` default | `exact-mirror` normalization default (500x faster for small objects) |
| Model reference | Manual type imports | `Elysia.Ref` for model reference with autocompletion |
| TypeBox extras | — | `t.Form`, `t.NoValidate` type utilities added |
| XSS protection | Manual escaping | `sanitize` option on routes for XSS prevention |

**Migration friction**: Replace all `error()` calls. Remove `.index` from Eden clients. Re-test validation with new normalization default.

## 1.4 (Sep 2025)

| Area | Before | After (1.4) |
| --- | --- | --- |
| Macros | macro v1 supported | macro v1 removed (non-type-soundness) |
| Schema libs | Elysia TypeBox only | Standard Schema: Zod/Valibot/ArkType/Effect/Yup/Joi |
| OpenAPI gen | Manual spec or `swagger()` | `fromTypes()` for TypeScript-to-OpenAPI generation |
| Array refs | `'user[]'` string syntax | `t.Array(t.Ref('user'))` replaces string arrays |
| Response hooks | `response` parameter | `responseValue` in `mapResponse`/`afterResponse` |

**Migration friction**: Replace `'user[]'` with `t.Array(t.Ref('user'))`. Migrate macro v1 plugins. Rename `response` → `responseValue` in hooks.

## Cross-Version Safe Patterns

These patterns work unchanged across 1.2–1.4:
- `status()` for discriminated error returns (safe since 1.2, preferred since 1.3)
- `derive` (pre-validation) and `resolve` (post-validation) lifecycle hooks
- `Elysia.Ref` for model references (introduced 1.3, stable in 1.4)
- Scoped plugins via `as('scoped')` (introduced 1.2)
- Eden Treaty via `type App = typeof app` (no codegen; `.index` removed in 1.3)
