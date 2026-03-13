# Search

## When to use

Use this playbook when the user needs web, news, image, or category search rather than a single-page scrape.

## Inputs

- The query
- Needed source type (`web`, `news`, `images`, `research`, `github`, `pdf`)
- Optional recency or location constraints

## Steps

1. Confirm the user actually needs external search.
2. Use `firecrawl search ... --json -o .firecrawl/...` as the default.
3. Add source, category, recency, or location filters only when they improve relevance.
4. Read result files selectively with `jq`, `rg`, `head`, or `sed`.

## Safety gates

- Do not flood the prompt with raw search output.
- Avoid browsing stale or low-signal sources when the user needs official docs.

## Outputs

- A concise answer with the best links, dates, and key findings

## Verification

- Check at least one result title/date pair before summarizing
