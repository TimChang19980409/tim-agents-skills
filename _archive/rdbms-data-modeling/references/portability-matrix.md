# Portability Matrix

| Concern | PostgreSQL | MySQL | MariaDB | SQL Server | Oracle |
| --- | --- | --- | --- | --- | --- |
| UUID type | Native `uuid` | No native UUID type | No native UUID type | Native `uniqueidentifier` | Commonly `RAW` plus `SYS_GUID()` pattern |
| JSON type | `json` and `jsonb` | Native `JSON` | `JSON` alias | JSON support with SQL Server-specific semantics | Native binary JSON available |
| Surrogate key default | Sequence or identity | Auto-increment | Auto-increment or sequence | `IDENTITY` | Sequence or identity |
| Timezone-capable timestamp | Strong | Limited semantics | Limited semantics | Supported with SQL Server types | Supported |
| Hibernate comfort | Highest | Good with caveats | Good with caveats | Good with locking/identity caveats | Good with enterprise-specific conventions |

## Use This Matrix To

- choose the least surprising default for a cross-vendor app
- explain why one schema design is portable and another is not
- identify where a Hibernate mapping should become vendor-specific

## Official URLs

- PostgreSQL UUID: `https://www.postgresql.org/docs/current/datatype-uuid.html`
- PostgreSQL JSON: `https://www.postgresql.org/docs/current/datatype-json.html`
- MySQL JSON: `https://dev.mysql.com/doc/refman/8.4/en/json.html`
- MariaDB JSON: `https://mariadb.com/kb/en/library/json-data-type/`
- SQL Server `uniqueidentifier`: `https://learn.microsoft.com/en-us/sql/t-sql/data-types/uniqueidentifier-transact-sql?view=sql-server-ver17`
- SQL Server JSON data type: `https://learn.microsoft.com/en-us/sql/t-sql/data-types/json-data-type?view=azuresqldb-current`
- Oracle JSON data type: `https://docs.oracle.com/en/database/oracle/oracle-database/26/adjsn/json-data-type.html`
