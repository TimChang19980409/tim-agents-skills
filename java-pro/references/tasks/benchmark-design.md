# Benchmark Design

## When to use

Use when the task needs a JMH benchmark or performance measurement plan.

## Inputs

- Code path under test
- Question to measure
- Known benchmarking pitfalls

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/performance.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for benchmark design.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not omit warmup or fork guidance.
- Do not benchmark multiple concerns in one case without saying so.

## Outputs

- A focused recommendation or implementation plan for benchmark design

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Skipping warmup iterations — cold JVM metrics are dominated by JIT compilation effects
- [ ] Mistake 2: Benchmarking multiple orthogonal concerns in a single measurement without declaring it
- [ ] Mistake 3: Running too few iterations to get statistically meaningful results — high variance makes comparisons unreliable

### Negative Examples
**Don't use System.nanoTime() for wall-clock profiling while ignoring GC pauses** — GC pauses are included in wall-clock time but do not reflect method-level performance; use JMH profilers that account for GC effects.

## Verification

- State the checks that make the benchmark trustworthy.
