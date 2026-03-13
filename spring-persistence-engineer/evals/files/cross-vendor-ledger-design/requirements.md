# Ledger Requirements

- Must support PostgreSQL, SQL Server, and Oracle
- Need immutable ledger entries plus idempotency on external event id
- Writes are append-only, reads are by account and effective timestamp
- Audit and retention are mandatory
