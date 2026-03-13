# Map

## When to use

Use this playbook when the user wants site structure, coverage discovery, or a filtered URL inventory.

## Inputs

- Site root URL
- Limit, search filter, or subdomain requirement

## Steps

1. Use `firecrawl map "<url>" -o .firecrawl/...`.
2. Prefer JSON output when the result will be filtered or counted.
3. Use `--search` or `--limit` to keep the URL set relevant.

## Safety gates

- Do not map a full site when the user only needs one page.
- Keep crawl scope narrow if the site is large.

## Outputs

- URL inventory, filtered list, or site-structure summary

## Verification

- Count or inspect the mapped URLs before drawing conclusions
