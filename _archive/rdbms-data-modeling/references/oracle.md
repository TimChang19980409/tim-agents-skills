# Oracle

## Defaults

- Prefer sequences or explicit identity design for high-value transactional tables.
- Use `SYS_GUID()` only when GUID semantics are truly needed and downstream systems accept the storage cost.
- Treat Oracle JSON as a powerful feature, but make the binary JSON dependency explicit.

## Watchouts

- Enterprise Oracle estates often have long-lived conventions around sequences, triggers, and audit columns.
- Porting PostgreSQL JSONB habits or SQL Server identity habits directly into Oracle usually creates surprise.
- Timezone, LOB, and JSON choices can carry significant operational implications in older estates.

## Official URLs

- `https://docs.oracle.com/en/database/oracle/oracle-database/26/adjsn/json-data-type.html`
- `https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/SYS_GUID.html`
