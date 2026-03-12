# Performance Guidance

Use this reference for JVM, memory, startup, latency, and throughput investigations.

## Investigation order

1. Reproduce the issue with a narrow scenario.
2. Decide whether the symptom is CPU, allocation, lock contention, GC, I/O, or startup.
3. Capture the minimum evidence needed: metrics, thread dump, heap histogram, profiler output, or benchmark.
4. Change one variable at a time.

## What to measure

- Request latency percentiles, not only averages
- Allocation rate and garbage collection pause behavior
- CPU saturation and runnable thread count
- Lock contention, blocked threads, and queue depth
- Connection pool utilization and downstream latency
- Startup milestones, class loading, and warmup behavior

## GC and memory heuristics

- Use GC tuning only after confirming the object allocation pattern is reasonable.
- High allocation rate often points to object churn or serialization overhead, not a collector choice problem.
- If pause times are acceptable but throughput is low, inspect CPU, synchronization, and I/O before changing collectors.
- If memory footprint matters, measure retained heap and caches before reducing heap blindly.

## Benchmarking guidance

- Use JMH for microbenchmarks and isolate the hot code path.
- Benchmark with realistic input sizes and warmup.
- Treat benchmarks as comparative evidence, not a proxy for full-system behavior.
- Record JVM flags and environment so runs are reproducible.

## Profiling guidance

- Use async-profiler or JFR when you need low-overhead production-like evidence.
- Prefer sampling profilers before invasive tracing.
- Correlate flame graphs with latency or throughput metrics to avoid optimizing cold paths.

## Things this reference does not cover

Delegate to `spring-boot-engineer` when the performance change is primarily about controller serialization, JPA query wiring, Spring Security filter order, or Spring configuration mistakes.
