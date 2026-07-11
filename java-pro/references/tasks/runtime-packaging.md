# Runtime Packaging

## When to use

Use when comparing HotSpot, CDS/AppCDS, containers, or native image for a concrete workload.

## Inputs

- Runtime target
- Primary constraint such as startup or memory
- Reflection or packaging constraints

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/build-runtime.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for runtime packaging.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend native image without compatibility tradeoffs.
- Do not collapse startup and steady-state into one metric.

## Outputs

- A focused recommendation or implementation plan for runtime packaging

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Recommending GraalVM native image without flagging reflection and dynamic classloading compatibility issues
- [ ] Mistake 2: Using startup time as the sole metric when steady-state throughput is the real production concern
- [ ] Mistake 3: Enabling AppCDS or CDS without verifying the base archive is build-repeatable

### Negative Examples
**Don't recommend native image for short-lived CLI tools** — native image build time and complexity rarely pay off for tools that start infrequently; the JVM startup penalty is amortized over many invocations in long-running services, not CLI tools.

## Verification

- State the rollout or benchmark gate before adopting the packaging change.
