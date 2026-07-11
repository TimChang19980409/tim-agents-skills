# New Bun Script

## When to use

Use when creating a new CLI or helper script and Bun + TypeScript should be the default runtime.

## Inputs

- Script purpose
- Required inputs and outputs
- Expected exit codes

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Start with plain text `Selected: new-bun-script` when the prompt asks for it.
3. Recommend a concrete Bun + TypeScript CLI shape with flags, stdout/stderr behavior, and explicit exit codes.
4. End with concrete verification steps tied to the task and say how to run the help or type-check command.

## Safety gates

- Do not introduce JS or Python entrypoints unless the user explicitly overrides the policy.
- Do not leave destructive operations on by default.

## Outputs

- A focused recommendation or implementation plan for a new Bun + TypeScript script
- Mention the Bun entrypoint, TypeScript file path, and at least one explicit flag

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Using console.log for errors instead of process.stderr — mixes error output with normal stdout
- [ ] Mistake 2: Omitting explicit exit codes or returning 0 on failure — breaks automation that depends on exit codes
- [ ] Mistake 3: Creating a script with no --help flag or usage text — makes automation and debugging harder

### Negative Examples
**Don't default to process.exit(1) on validation errors without a flag to suppress it** — CI environments and test harnesses often need to suppress exit calls; make validation failures callable without side effects.

## Verification

- List the help command and minimal valid invocation to run.
