---
name: pebble-official-best-practices
description: Use when users ask about the Java Pebble Template Engine (pebbletemplates/pebble). Applies official docs best practices for engine configuration, escaping/security, template architecture, performance, and Spring Boot integration.
---

# Pebble Official Best Practices (Java Template Engine)

## Scope

This skill targets **Pebble Java Template Engine**:
- https://github.com/pebbletemplates/pebble

Pebble has other unrelated projects (CockroachDB Pebble KV store, Canonical Pebble service manager, Let's Encrypt Pebble ACME test server). If intent is ambiguous, disambiguate first.

## Use This Skill When

- Configuring `PebbleEngine.Builder` and loaders
- Designing template inheritance/includes for maintainability
- Hardening escaping/security behavior
- Optimizing rendering performance and caching
- Integrating Pebble with Spring Boot

## Core Workflow

1. Confirm target runtime (plain Java or Spring Boot).
2. Configure engine defaults explicitly (`loader`, `cacheActive`, `strictVariables`, `maxRenderedSize`).
3. Keep autoescaping enabled; only bypass with `raw` in tightly scoped, trusted output.
4. Structure templates with `{% extends %}` + `{% block %}` hierarchy; keep child templates focused.
5. Apply performance features where needed (`template/tag cache`, `cache` tag, optional `parallel` tag + `ExecutorService`).
6. Add extensions/customizers only for required capabilities and security posture.
7. In Spring Boot, align `pebble.*` properties with resolver/loader behavior and validate rendered output.

## Best-Practice Rules

- Keep autoescaping on (default). If using `raw`, keep it as the last operation in the expression.
- Prefer `strictVariables=true` in validation-heavy environments to fail fast on bad template access.
- For optional nested values, prefer `default(...)` and explicit null/empty checks in templates.
- Reuse compiled `PebbleTemplate` instances; they are thread-safe once compiled.
- Keep template cache enabled in production; avoid `StringLoader` in production.
- Set `maxRenderedSize` to a sane upper bound to reduce output explosion/DoS risk.
- For untrusted template authors, reduce available built-ins via `ExtensionCustomizer` / `DisallowExtensionCustomizerBuilder`.
- Use the default method access validator unless you fully trust template sources.
- Use `{% extends %}` as the first tag in child templates and keep one parent per template.
- Use `parallel` only when you provide a bounded `ExecutorService` and have truly expensive blocks.

## Response Contract

When assisting users, provide:

1. A minimal `PebbleEngine.Builder` setup snippet for the user stack.
2. A secure rendering variant (escaping + strict variable strategy).
3. A performance variant (cache and optional parallel strategy).
4. A concise risk note (XSS, template trust boundary, memory growth, reflection access).

For full source-backed guidance and templates, read:
- `references/best-practices.md`
