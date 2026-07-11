# Parser Or Codegen Script

## When to use

Use when the task is generating code, parsing structured input, or building a deterministic converter script.

## Inputs

- Input format
- Output format
- Need for machine-readable logs or JSON

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Recommend a concrete Bun + TypeScript parser or codegen plan with deterministic input/output flags.
4. Mention the exact structured formats, for example `CSV` input to `JSON` output for a codegen pipeline.
5. End with concrete verification steps tied to the task.

## Safety gates

- Do not mix human-only prose with machine-readable output modes when JSON is needed.
- Do not make destructive overwrites the default behavior.

## Outputs

- A focused recommendation or implementation plan for parser or codegen script
- Explicit reference to Bun, TypeScript, deterministic behavior, and the parser or codegen contract

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Making output file overwrites the default behavior instead of requiring an explicit flag
- [ ] Mistake 2: Mixing human-readable prose with machine-readable output (JSON) in the same stream
- [ ] Mistake 3: Skipping input validation — script fails with cryptic errors on malformed input instead of clear messages

### Negative Examples
**Don't emit partial output when parsing fails midway through** — consumers cannot tell if the output is complete or corrupted; fail explicitly and let callers handle retries rather than producing truncated artifacts.

## Verification

- State the sample input/output test that confirms the script works.
