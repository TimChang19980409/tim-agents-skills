# When To Browse

## Decision

Choose whether the task needs live browsing at all.

## Signals/constraints

- The fact may have changed recently
- The user explicitly asked to search or verify
- The answer needs citations, links, or current docs

## Options

- Browse now with Firecrawl
- Stay local and answer from repo/context only
- Escalate to an official-doc extension such as `context7-auto-research`

## Recommendation rule

Browse whenever the information is time-sensitive, externally sourced, or citation-heavy. Stay local only when the answer is stable and already grounded in local context.

## Tradeoffs

- Browsing improves freshness and traceability but costs time
- Staying local is faster but risks stale answers

## Verification

- Explicitly state why browsing was or was not used
