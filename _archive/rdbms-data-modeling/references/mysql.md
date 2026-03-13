# MySQL

## Defaults

- Use auto-increment carefully; it is convenient but interacts with batching differently than sequence-backed generators.
- If you need UUIDs, make the storage choice explicit: textual UUIDs are simple, binary storage is denser.
- Use native `JSON` for bounded flexible payloads, not as a replacement for core relational structure.

## Watchouts

- MySQL has no native `UUID` column type.
- JSON querying and indexing patterns are vendor-specific; do not assume they port cleanly to MariaDB or SQL Server.
- Timestamp and timezone semantics need explicit application rules.

## Official URLs

- `https://dev.mysql.com/doc/refman/8.4/en/json.html`
- `https://dev.mysql.com/doc/refman/8.4/en/miscellaneous-functions.html#function_uuid-to-bin`
