---
name: firecrawl
description: |
  Run Firecrawl v2 bulk scrape, crawl, map, and structured extraction workflows.
  Use when a site-scale Firecrawl operation is required. Do not use for local-only work or ordinary
  current-fact browsing; use the host's native Web capability for those.
metadata:
  framework_role: host
  execution_mode: inline
---

# Firecrawl

Use this skill as the web-research host. Choose exactly one task playbook or decision guide before pulling in extra docs or archive extensions.

## Intent Router

- `search`: [references/tasks/search.md](references/tasks/search.md)
- `scrape`: [references/tasks/scrape.md](references/tasks/scrape.md)
- `map`: [references/tasks/map.md](references/tasks/map.md)
- `verify current facts`: [references/tasks/verify-current-facts.md](references/tasks/verify-current-facts.md)
- `when to browse`: [references/decisions/when-to-browse.md](references/decisions/when-to-browse.md)
- `source priority`: [references/decisions/source-priority.md](references/decisions/source-priority.md)

## Extension Packs

- `context7-auto-research` when library or framework documentation needs stronger official-doc bias
- `find-skills` when the user is discovering installable skills rather than browsing the open web

## Host Workflow

1. Decide whether the user actually needs browsing before opening the network path.
2. Pick one playbook or decision guide based on the user's intent.
3. Prefer structured output written to `.firecrawl/` over dumping large responses into context.
4. Quote URLs, keep commands reproducible, and read scraped files incrementally.
5. Include dates and source links when answering time-sensitive questions.

## Response Guardrails

- Do not browse for local-only work.
- Prefer primary or official sources for technical questions and high-stakes guidance.
- For current-fact verification, compare multiple sources and state the concrete date.
- Use archive extensions only when the task is more specific than general web research.
