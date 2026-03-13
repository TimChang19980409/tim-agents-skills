---
name: firecrawl
description: |
  Web-research family host for live web content. Use when the task needs search, scraping,
  site mapping, or current-fact verification with links and dates. Keep local-only tasks out
  of this skill and load archive extensions only for doc-heavy or skill-discovery flows.
metadata:
  framework_role: host
  execution_mode: inline
---

# Firecrawl

Use this skill as the web-research host. Choose exactly one task playbook or decision guide before pulling in extra docs or archive extensions.

## Intent Router

- `search`: [references/tasks/search.md](/Users/ss105213025/.agents/skills/firecrawl/references/tasks/search.md)
- `scrape`: [references/tasks/scrape.md](/Users/ss105213025/.agents/skills/firecrawl/references/tasks/scrape.md)
- `map`: [references/tasks/map.md](/Users/ss105213025/.agents/skills/firecrawl/references/tasks/map.md)
- `verify current facts`: [references/tasks/verify-current-facts.md](/Users/ss105213025/.agents/skills/firecrawl/references/tasks/verify-current-facts.md)
- `when to browse`: [references/decisions/when-to-browse.md](/Users/ss105213025/.agents/skills/firecrawl/references/decisions/when-to-browse.md)
- `source priority`: [references/decisions/source-priority.md](/Users/ss105213025/.agents/skills/firecrawl/references/decisions/source-priority.md)

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
- If the user explicitly asks you to start with `Selected:`, output `Selected: <exact router id>` using one of `search`, `scrape`, `map`, `verify-current-facts`, `when-to-browse`, or `source-priority` before any other text.
- Use archive extensions only when the task is more specific than general web research.
