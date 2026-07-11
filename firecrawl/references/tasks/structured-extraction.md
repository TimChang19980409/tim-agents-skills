# Structured Extraction

## Use

Use when Firecrawl v2 must return schema-shaped data across pages rather than free-form Markdown.

## Apply

1. Define the smallest JSON schema that downstream work consumes.
2. Provide clear field descriptions and required/optional distinctions.
3. Choose scrape or crawl scope before attaching extraction.
4. Persist raw results and validation errors under `.firecrawl/<task>/`.
5. Validate types, missing fields, duplicates, and source URLs before summarizing.

## Safety

- Do not infer missing values without marking them unknown.
- Keep provenance for every extracted record.
- Avoid broad schemas that increase cost and reduce consistency.

## Verify

Report schema validation rate, failed URLs/records, and retained output path.
