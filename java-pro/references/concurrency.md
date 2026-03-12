# Concurrency Guidance

Use this reference when the task is about how Java work is scheduled, isolated, canceled, or coordinated.

## Start with the workload shape

- Prefer virtual threads for request/response or job orchestration dominated by blocking I/O.
- Prefer `CompletableFuture` when the code already models an explicit async graph and the cost of keeping it is lower than rewriting.
- Prefer structured concurrency when the task is "fan out, gather, cancel siblings on failure, return one result."
- Prefer message queues or event-driven boundaries when the concern is cross-process load leveling, not in-process parallelism.

## Virtual thread checklist

- Confirm the bottleneck is blocking I/O rather than CPU saturation.
- Audit thread-local usage before migration; inherited per-thread context can become a correctness or memory issue.
- Keep concurrency limits explicit around databases, HTTP clients, and downstreams even if threads are cheap.
- Watch for libraries that pin carrier threads under synchronized or native-blocking sections.

## Structured concurrency guidance

- Group sibling tasks under one parent scope when they share lifecycle and cancellation rules.
- Fail fast when one child failure invalidates the whole result.
- Collect partial successes only when the caller can meaningfully use them.
- Keep deadlines at the parent boundary so timeouts are coordinated.

## Executor and backpressure guidance

- Size CPU-bound pools close to available cores after accounting for other colocated work.
- Treat downstream capacity, not thread count, as the real limit for I/O-heavy systems.
- Use bounded queues or explicit semaphores when an external dependency must not be overwhelmed.
- Measure queue growth, rejection count, and tail latency before changing pool sizes.

## Things this reference does not cover

Delegate to `spring-boot-engineer` when the main question is Spring MVC/WebFlux controller wiring, `@Async`, Spring scheduling configuration, or other framework-specific assembly.
