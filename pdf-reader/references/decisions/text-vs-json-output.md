# Text Vs Json Output

## Decision

Choose whether a PDF task should return plain text or structured JSON.

## Signals/constraints

- Need for downstream parsing or chunking
- Human readability vs automation
- Token-budget planning requirements

## Options

- Use text mode
- Use JSON
- Pair JSON with --max-chars

## Recommendation rule

Default to JSON when the task includes chunking, per-page logic, or downstream automation.

## Tradeoffs

- Text is simpler to read but harder to automate.
- JSON is better for downstream tooling but more verbose.

## Verification

- State the chosen output format and why it fits the task.
