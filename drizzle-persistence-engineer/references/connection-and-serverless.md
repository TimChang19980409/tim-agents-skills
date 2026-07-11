# Connection And Serverless

Load this file for connection pooling, read replicas, and serverless/edge performance decisions.

## Connection Pooling

- PgBouncer transaction mode breaks prepared statements; use `prepare: false` or direct connection.
- Supabase pooler and Neon pooler optimize for serverless but can limit transaction semantics compared to direct connections.
- Direct connections give full prepared statement support at the cost of higher connection overhead in serverless environments.

## Read Replicas

- `withReplicas()` configures replica routing; use `$primary` for writes and automatic SELECT routing to replicas.
- Automatic SELECT routing reduces read load on primary without query changes.
- Replica configuration requires connection strings for each replica and optional health checks.

## Serverless And Edge

- Prepared statements defined outside handler scope give 30-60% perf gain in serverless/edge runtimes.
- Neon HTTP driver trades latency for serverless compatibility; use `db.batch()` to reduce round-trips.
- AWS Data API eliminates connection pools but limits complex transactions and has higher per-query latency.
- Connection reuse is critical in edge runtimes; pooler limits and cold starts constrain aggressive concurrency.

## Official URLs

- Read replicas: `https://orm.drizzle.team/docs/read-replicas`
- Batch API: `https://orm.drizzle.team/docs/batch-api`