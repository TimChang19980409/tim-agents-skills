# Crawl

## Use

Use when Firecrawl v2 should discover and process many pages under a site with repeatable scope and job status.

## Apply

1. Define start URL, include/exclude paths, depth/page limit, and required formats.
2. Prefer the smallest scope that covers the requested corpus.
3. Start the v2 crawl and persist the job ID under `.firecrawl/<task>/`.
4. Poll status without duplicating jobs; handle partial failures explicitly.
5. Read or transform only the result fields needed downstream.

## Safety

- Respect access rules, rate limits, and the user's authorized scope.
- Do not use crawl for a normal web search or a single current-fact answer.
- Do not paste the entire crawl payload into model context.

## Verify

Record final status, completed/failed URL counts, scope, and output location.
