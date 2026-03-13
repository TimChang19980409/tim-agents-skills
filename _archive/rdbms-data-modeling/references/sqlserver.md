# SQL Server

## Defaults

- `uniqueidentifier` is the native UUID-like type; use it deliberately and understand clustering implications.
- `IDENTITY` is the conventional surrogate-key default, but it changes batching and migration behavior compared with sequence-backed databases.
- JSON support is strong, but text-vs-native semantics still deserve an explicit portability note.

## Watchouts

- Locking and isolation behavior can change the practical cost of write-heavy transaction patterns.
- GUID clustering decisions affect fragmentation and index locality.
- Sequence-based thinking from PostgreSQL or Oracle does not translate one-to-one to identity-heavy SQL Server deployments.

## Official URLs

- `https://learn.microsoft.com/en-us/sql/t-sql/data-types/uniqueidentifier-transact-sql?view=sql-server-ver17`
- `https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql-identity-property?view=sql-server-ver17`
- `https://learn.microsoft.com/en-us/sql/t-sql/data-types/json-data-type?view=azuresqldb-current`
