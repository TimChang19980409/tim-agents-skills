# PostgreSQL

## Defaults

- Prefer `SEQUENCE`-backed identity or explicit sequences for write-heavy tables.
- Use native `uuid` when application-generated identifiers are helpful.
- Use `jsonb` only when the payload is genuinely semi-structured and query operators matter.
- Use timezone-aware timestamps for cross-region audit and scheduling data.

## Watchouts

- `jsonb` is powerful but can encourage unbounded schema drift if used as a shortcut for poor modeling.
- Large UUID-heavy indexes still need fill-factor and locality thinking.
- Partitioning, generated columns, and expression indexes are strong tools, but they reduce portability.

## Official URLs

- `https://www.postgresql.org/docs/current/datatype-uuid.html`
- `https://www.postgresql.org/docs/current/datatype-json.html`
- `https://www.postgresql.org/docs/current/ddl-identity-columns.html`
