# Connection Serverless

## Decision

Choose the connection and runtime topology: pooled long-lived service, serverless/edge HTTP driver, or read-replica setup.

## Signals/constraints

- Deployment target (long-lived service vs serverless/edge runtime)
- Connection limits on the database provider
- Transaction needs (complex, multi-statement transactions)
- Existing repo config or infrastructure constraints

## Options

- Pooled server: node-postgres Pool, Bun SQL pool, or direct TCP connection
- Serverless HTTP driver: Neon HTTP, AWS Data API, or similar
- Read-replica topology: Drizzle withReplicas() for automatic replica routing
- Connection pooler: PgBouncer or Supabase pooler in transaction mode

## Recommendation rule

Default to pooled server for long-lived services. Use HTTP drivers only for serverless/edge or when provider requires it. Follow existing repo config.

## Tradeoffs

- HTTP drivers constrain transactions and pooling but work at scale
- Pooled connections give direct SQL control but require long-lived processes
- Read replicas add complexity and eventual consistency

## Verification

- Name the chosen topology in the decision record
- Run the start, build, or test command for that runtime