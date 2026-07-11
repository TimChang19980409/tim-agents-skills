# When To Browse

## Decision

Choose whether the task needs Firecrawl rather than the host's native Web capability.

## Signals/constraints

- The task needs a multi-page crawl, URL inventory, bulk scrape, or structured extraction
- A large site must be processed repeatably or asynchronously
- Firecrawl v2 job status and stored outputs add value

## Options

- Use Firecrawl v2 for site-scale processing
- Use native Web for ordinary search, current facts, and citations
- Stay local when repository context is sufficient

## Recommendation rule

Use Firecrawl only when its crawl/map/bulk extraction surface adds value. Freshness alone is a native Web trigger, not a Firecrawl trigger.

## Tradeoffs

- Browsing improves freshness and traceability but costs time
- Staying local is faster but risks stale answers

## Verification

- Explicitly state why browsing was or was not used
