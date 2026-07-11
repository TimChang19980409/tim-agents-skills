# JVM Diagnostics

## When to use

Use when diagnosing heap growth, GC issues, lock contention, or thread-dump symptoms.

## Inputs

- Observed runtime symptom
- Available artifacts such as GC logs or thread dumps
- Environment constraints

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/performance.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for jvm diagnostics.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not prescribe collector changes without an evidence path.
- Do not confuse app wiring issues with JVM bottlenecks.

## Outputs

- A focused recommendation or implementation plan for jvm diagnostics

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Recommending collector changes without GC log evidence or heap dump analysis
- [ ] Mistake 2: Confusing application-level locking issues with JVM-level thread contention
- [ ] Mistake 3: Assuming OOM is a heap problem when it could be metaspace, direct memory, or thread stack exhaustion

### Negative Examples
**Don't prescribe a new GC collector without running a representative workload under the existing collector first** — baseline metrics are required to know whether the proposed change actually improves things; blindly switching collectors can make performance worse.

## Verification

- State the next profiler, log, or dump that would confirm the diagnosis.
