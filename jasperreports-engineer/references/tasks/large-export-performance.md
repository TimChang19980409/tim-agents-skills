# Large Export Performance

## When to use

Use when large Jasper exports are slow or memory-heavy.

## Inputs

- Datasource type
- Observed memory/runtime symptom
- Export size or page count

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. If the prompt asks for `Selected:`, start with `Selected: large-export-performance` before any heading or ranked list.
2. Load `references/runtime-playbook.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for large export performance.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not blur compile strategy and fill/export behavior.
- Do not recommend generic JVM tuning before Jasper-specific levers like virtualizers.

## Outputs

- A focused recommendation or implementation plan for large export performance
- A ranked fix list that explicitly mentions the JSON datasource path together with virtualizer, fill/export split, or paging

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Recommending generic JVM heap tuning before checking Jasper virtualizer settings
- [ ] Mistake 2: Confusing compile-time template optimization with fill-time performance
- [ ] Mistake 3: Enabling writeBatchSize without verifying the JDBC driver supports it

### Negative Examples
**Don't throw more heap at a Jasper export that is using the default SimpleDataFileRegistry** — virtualizers are purpose-built for large exports and are far more effective than heap increases; always check the virtualizer configuration first.

## Verification

- State the fill/export metrics or memory checks that confirm the improvement.
