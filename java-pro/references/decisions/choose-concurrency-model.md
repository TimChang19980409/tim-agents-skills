# Choose Concurrency Model

## Decision

Choose the best Java concurrency approach for a concrete workload.

## Signals/constraints

- Blocking vs CPU-bound mix
- Need for cancellation or backpressure
- Debuggability concerns

## Options

- Virtual threads
- Structured concurrency
- CompletableFuture graphs
- Fixed executors

## Recommendation rule

Pick the simplest model that fits the workload and keeps cancellation and observability explicit.

## Tradeoffs

- Virtual threads help blocking I/O but expose ThreadLocal and pool risks.
- CompletableFuture can compose well but is harder to debug.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: choose-concurrency-model`
- State which model you chose and why the others fit worse.
