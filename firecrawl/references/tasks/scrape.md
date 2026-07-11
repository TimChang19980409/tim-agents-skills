# Scrape

## When to use

Use for repeatable Firecrawl v2 extraction of known URLs, especially when rendering or normalized formats are needed.

## Inputs

- URL
- Desired format (`markdown`, `links`, `html`, or multi-format JSON)
- Any main-content or render-delay constraints

## Steps

1. Quote the URL.
2. Confirm the v2 scrape request or CLI shape before running it.
3. Add `--only-main-content` or `--wait-for` only when needed.
4. Read the output incrementally instead of loading the whole file.

## Safety gates

- Do not overuse full HTML when markdown or links are enough.
- Use native Web for an ordinary one-page read that needs no Firecrawl-specific output.

## Outputs

- Extracted content or a focused summary grounded in the scraped page

## Verification

- Confirm the output file exists and contains the target section or links
