# Pebble Java Template Engine Best Practices (From Official Docs)

## Official Sources

- Installation and engine settings:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/installation.md
- Basic usage and strict variable behavior:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/basic-usage.md
- Escaping and autoescape strategy:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/escaping.md
- High performance:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/high-performance.md
- Customize default capabilities:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/customize-defaults.md
- Extending Pebble:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/extending-pebble.md
- Spring Boot integration:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/guide/spring-boot-integration.md
- Cache tag:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/tag/cache.md
- Parallel tag:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/tag/parallel.md
- Extends tag:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/tag/extends.md
- Default filter:
  https://github.com/pebbletemplates/pebble/blob/master/docs/src/orchid/resources/wiki/filter/default.md

## Baseline Engine Configuration

Recommended defaults for production-oriented environments:

```java
PebbleEngine engine = new PebbleEngine.Builder()
    // Keep autoescaping on by default.
    .autoEscaping(true)
    // Prefer fail-fast for template mistakes in strict environments.
    .strictVariables(true)
    // Reduce memory risk from pathological output.
    .maxRenderedSize(10 * 1024 * 1024)
    // Keep caches enabled in production.
    .cacheActive(true)
    .build();
```

Notes from official docs:

- `cacheActive` defaults to `true`.
- `strictVariables` defaults to `false`.
- `maxRenderedSize` defaults to disabled (`-1`).
- Default loader is `ClasspathLoader` if none is provided.

## Loader Selection Rules

Choose loader by deployment shape:

- `ClasspathLoader`: common default for app-packaged templates.
- `FileLoader`: filesystem templates; requires an absolute base path.
- `ServletLoader` / `Servlet5Loader`: servlet environments.
- `MemoryLoader`: templates managed outside filesystem/classpath.
- `StringLoader`: testing/debugging only; avoid production usage.

## Escaping and XSS Safety

- Autoescaping is enabled by default; keep it that way unless you fully control all output contexts.
- `raw` disables escaping for the expression; place `raw` as the final operation.
- Use proper escaping strategy per context (`html`, `js`, `css`, `url_param`).
- Use `autoescape` blocks only for narrow, justified sections.

Example:

```twig
{{ userInput }}                 {# escaped by default #}
{{ trustedHtml | raw }}         {# only for trusted content #}
{{ username | escape(strategy="js") }}
```

## Strict Variables and Null Handling

- With `strictVariables=false`, missing attributes usually render as empty string.
- With `strictVariables=true`, invalid attribute access throws exceptions.
- For optional nested data, prefer:

```twig
{{ user.profile.phone | default("No phone number") }}
```

The `default` filter is explicitly documented to suppress `AttributeNotFoundException` in strict mode.

## Template Architecture

- Use inheritance with `{% extends %}` + `{% block %}` to keep layouts maintainable.
- `extends` must be the first tag in the child template.
- Child templates can extend only one direct parent.
- Keep page-specific logic in child blocks; keep shared frame in parent templates.

## Performance Patterns

- Reuse compiled `PebbleTemplate` objects; they are thread-safe once compiled.
- Use the `cache` tag for expensive and stable fragments.
- Provide an `ExecutorService` only if you need `parallel` tag behavior.
- Use `flush` for streaming when latency matters.
- Do not expect `flush` benefits inside content rendered via `block` function internals.

## Security Hardening for Untrusted Templates

- Restrict default functionality via `ExtensionCustomizer` or `DisallowExtensionCustomizerBuilder`.
- Keep method access validation restrictive unless templates are fully trusted.
- Explicitly disallow risky token parsers/functions/filters/tests/operators when exposing template authoring to users.

## Spring Boot Integration Practices

Starter defaults (documented):

- Templates from classpath `/templates/` with `.peb` suffix.
- UTF-8 `text/html` view resolver defaults.

Common properties to set intentionally:

- `pebble.prefix`
- `pebble.suffix`
- `pebble.charset`
- `pebble.defaultLocale`
- `pebble.strictVariables`
- `pebble.greedyMatchMethod`
- `pebble.servlet.cache`

Important caveat from docs:

- If using extension beans auto-pickup, keep them in a single `@Configuration` class.

## Common Review Findings

- Autoescaping disabled globally without documented trust boundary.
- `raw` used on user-controlled content.
- `strictVariables=false` in environments that require fail-fast template validation.
- `StringLoader` used in production code.
- Missing render-size limits in untrusted/high-volume rendering paths.
- Unbounded executor for `parallel` usage.
