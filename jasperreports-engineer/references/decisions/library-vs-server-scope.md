# Library Vs Server Scope

## Decision

Choose whether the request belongs to JasperReports Library/Studio work or JasperReports Server operations.

## Signals/constraints

- Mentions JRXML or runtime code
- Mentions server repository or scheduler
- Need for embedded reporting vs server ops

## Options

- Stay in Library/Studio
- Escalate away for Server administration

## Recommendation rule

Keep the skill in library/studio scope unless the user explicitly asks for JasperReports Server.

## Tradeoffs

- Library answers stay focused on embedded reporting.
- Server operations are a different product surface.

## Verification

- State the chosen scope and what made it library/studio vs server.
