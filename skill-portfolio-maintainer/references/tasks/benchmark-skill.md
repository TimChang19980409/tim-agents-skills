# Benchmark Skill

## When to use

Use when designing or running evals for a skill and comparing with-skill vs baseline performance.

## Inputs

- Skill under test
- Task categories
- Desired benchmark contract

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/schemas.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for benchmark skill.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not rely only on vibes for benchmark success.
- Do not keep bulky per-run artifacts when compact summaries are enough.

## Outputs

- A focused recommendation or implementation plan for benchmark skill

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Keeping bulky per-run artifacts (full transcripts, screenshots) when compact summaries capture the signal
- [ ] Mistake 2: Setting pass thresholds so tight that infra noise causes flaky failures
- [ ] Mistake 3: Benchmarking multiple concerns in a single eval case without declaring it — conflates pass/fail signals

### Negative Examples
**Don't run benchmarks without warmup iterations** — cold-start effects from JIT compilation, classloading, and caching make the first few iterations unrepresentative; always include a warmup phase in the benchmark design.

## Verification

- State the pass thresholds and retained artifacts.
