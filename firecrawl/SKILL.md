---
name: firecrawl
description: |
  Run Firecrawl v2 bulk scrape, crawl, map, and structured extraction workflows.
  Use when Firecrawl is required for a multi-page crawl, URL map, bulk scrape, or schema extraction. Do not use for local-only work or ordinary
  current-fact browsing; use the host's native Web capability for those.
metadata:
  framework_role: host
  execution_mode: inline
---

# Firecrawl

Use this skill as the web-research host. Choose exactly one task playbook or decision guide before pulling in extra docs or archive extensions.

## Intent Router

- `scrape`: [references/tasks/scrape.md](references/tasks/scrape.md)
- `crawl`: [references/tasks/crawl.md](references/tasks/crawl.md)
- `map`: [references/tasks/map.md](references/tasks/map.md)
- `structured extraction`: [references/tasks/structured-extraction.md](references/tasks/structured-extraction.md)
- `when to browse`: [references/decisions/when-to-browse.md](references/decisions/when-to-browse.md)
- `source priority`: [references/decisions/source-priority.md](references/decisions/source-priority.md)

## Extension Packs

- `context7-auto-research` when library or framework documentation needs stronger official-doc bias
- `find-skills` when the user is discovering installable skills rather than browsing the open web

## Host Workflow

1. Use Firecrawl only for a site-scale scrape, crawl, map, or schema-driven extraction.
2. Confirm v2 request fields and limits before starting a bulk operation.
3. Write outputs to `.firecrawl/<task>/` and inspect only relevant result sections.
4. Prefer native host browsing for ordinary search, current facts, and citation work.

## Response Guardrails

- Do not use Firecrawl for local-only work or an ordinary one-page lookup.
- Keep crawl scope, job IDs, partial failures, and provenance explicit.
- Use archive extensions only when the task is more specific than general web research.
