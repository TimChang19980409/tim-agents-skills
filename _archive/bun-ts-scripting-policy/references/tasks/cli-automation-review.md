# Cli Automation Review

## When to use

Use when reviewing a script or CLI helper for argument handling, output shape, or automation safety.

## Inputs

- Current CLI contract
- Automation environment
- Known pain points

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
3. Recommend the smallest safe change or plan for CLI automation review, including stdout/stderr separation and exit-code cleanup.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not recommend ambiguous positional-only interfaces when flags are clearer.
- Do not hide errors in stdout when stderr is the safer channel.

## Outputs

- A focused recommendation or implementation plan for cli automation review
- Explicit stdout, stderr, and exit-code rules

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Mixing error output into stdout instead of stderr — breaks log parsing and CI tooling
- [ ] Mistake 2: Using positional arguments where named flags would be clearer for future extensibility
- [ ] Mistake 3: Returning exit code 0 for failure states — breaks automation that relies on exit codes

### Negative Examples
**Don't output JSON from a CLI subcommand without a --json flag to opt in** — automation scripts that parse stdout are broken when human-readable text appears unexpectedly; make structured output explicit and off by default.

## Verification

- List the commands or CI checks that validate the CLI contract.
