# Cross-Border Settlement Ledger

- Must support PostgreSQL, MySQL, SQL Server, and Oracle
- Need immutable ledger entries, reversals, and idempotent ingest
- Queries are by account, book date, and external event id
- Team wants one relational model first, then vendor-specific optimizations only if necessary
