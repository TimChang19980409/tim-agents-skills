# Script Output Contract

## Decision

Choose whether the script should emit human-readable text, structured JSON, or both.

## Signals/constraints

- Automation vs interactive use
- Need for downstream parsing
- Importance of stderr/stdout separation

## Options

- Use JSON
- Use concise text
- Offer both only when modes are explicit

## Recommendation rule

Default to structured JSON for automation-facing scripts; keep human-readable text concise when needed.

## Tradeoffs

- JSON is machine-safe but less friendly for ad hoc terminal use.
- Human text is easier to read but brittle for automation.

## Verification

- State the chosen output contract and how errors are surfaced.
