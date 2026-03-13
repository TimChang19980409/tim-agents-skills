# Scrape

## When to use

Use this playbook when the user already has a specific URL or the task is extracting one page's content.

## Inputs

- URL
- Desired format (`markdown`, `links`, `html`, or multi-format JSON)
- Any main-content or render-delay constraints

## Steps

1. Quote the URL.
2. Default to `firecrawl scrape "<url>" -o .firecrawl/...`.
3. Add `--only-main-content` or `--wait-for` only when needed.
4. Read the output incrementally instead of loading the whole file.

## Safety gates

- Do not overuse full HTML when markdown or links are enough.
- Avoid scraping more pages than the task needs.

## Outputs

- Extracted content or a focused summary grounded in the scraped page

## Verification

- Confirm the output file exists and contains the target section or links
