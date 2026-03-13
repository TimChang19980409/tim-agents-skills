# Portability Quick Matrix

Use this file for fast cross-database recommendations. If the user needs deeper schema-first guidance, load
`_archive/rdbms-data-modeling/ARCHIVE.md` and the vendor reference files.

## Recommended Defaults

| Concern | Portable Default | Call Out |
| --- | --- | --- |
| Primary keys | Surrogate PK plus business unique constraints | Natural keys still matter for external identity and search |
| IDs | `SEQUENCE` where supported, UUID only when cross-system generation matters | `IDENTITY` changes batching behavior |
| JSON | Normalize first, use JSON only for bounded flexible payloads | JSON operator support differs sharply by vendor |
| Time | Store UTC instant plus business-local date fields separately when needed | Timestamp semantics differ by vendor |
| Soft delete | Explicit status or `deleted_at` plus indexed active filters | Hidden soft delete rules can break uniqueness and reporting |
| Migrations | Flyway or Liquibase with reviewed SQL | `ddl-auto` is not a production migration plan |

## Vendor Hotspots

- PostgreSQL: native `uuid`, `jsonb`, strong sequence support, and timezone-capable timestamps make it the most comfortable target for rich Hibernate mappings.
- MySQL: native `JSON`, no real `UUID` type, and `IDENTITY`-style auto-increment defaults make UUID storage and batching decisions more visible.
- MariaDB: `JSON` is an alias rather than a distinct binary JSON type; do not assume MySQL JSON behavior is identical.
- SQL Server: `uniqueidentifier` is native, JSON support is strong but historically text-based, and `IDENTITY` plus locking behavior deserves explicit mention.
- Oracle: sequences remain first-class, binary JSON (OSON) exists, and datatype choices often interact with older enterprise conventions.

## Official URLs

- PostgreSQL UUID: `https://www.postgresql.org/docs/current/datatype-uuid.html`
- PostgreSQL JSON: `https://www.postgresql.org/docs/current/datatype-json.html`
- PostgreSQL identity columns: `https://www.postgresql.org/docs/current/ddl-identity-columns.html`
- MySQL JSON: `https://dev.mysql.com/doc/refman/8.4/en/json.html`
- MySQL UUID functions: `https://dev.mysql.com/doc/refman/8.4/en/miscellaneous-functions.html#function_uuid-to-bin`
- MariaDB JSON data type: `https://mariadb.com/kb/en/library/json-data-type/`
- SQL Server `uniqueidentifier`: `https://learn.microsoft.com/en-us/sql/t-sql/data-types/uniqueidentifier-transact-sql?view=sql-server-ver17`
- SQL Server identity property: `https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql-identity-property?view=sql-server-ver17`
- SQL Server JSON data type: `https://learn.microsoft.com/en-us/sql/t-sql/data-types/json-data-type?view=azuresqldb-current`
- Oracle JSON data type: `https://docs.oracle.com/en/database/oracle/oracle-database/26/adjsn/json-data-type.html`
- Oracle `SYS_GUID`: `https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/SYS_GUID.html`
