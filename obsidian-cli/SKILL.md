---
name: obsidian-cli
description: |
  Operate a running Obsidian vault: CLI actions, plugin debugging, DOM inspection, properties, and tasks.
  Use when Obsidian-specific runtime behavior matters. Do not use for plain Markdown editing or PDF extraction;
  route PDF/OCR work to pdf-reader.
metadata:
  framework_role: host
  execution_mode: inline
---

# Obsidian CLI

Use this skill as the Obsidian operational host. Pick one task playbook or decision guide first, then load an extension or delegate only when needed.

## Intent Router

- `vault ops`: [references/tasks/vault-ops.md](references/tasks/vault-ops.md)
- `plugin debug`: [references/tasks/plugin-debug.md](references/tasks/plugin-debug.md)
- `dom inspect`: [references/tasks/dom-inspect.md](references/tasks/dom-inspect.md)
- `property and task management`: [references/tasks/property-task-management.md](references/tasks/property-task-management.md)
- `choose surface`: [references/decisions/choose-obsidian-surface.md](references/decisions/choose-obsidian-surface.md)
- `handoff to pdf-reader`: [references/decisions/handoff-to-pdf-reader.md](references/decisions/handoff-to-pdf-reader.md)

## Extension Packs

- `obsidian-markdown` for wikilinks, embeds, callouts, and properties syntax
- `obsidian-bases` for `.base` files, formulas, filters, and views
- `json-canvas` for `.canvas` nodes and edges
- `book-translation` for archived prompt-book translation work

## Delegation

- Delegate to `pdf-reader` when the task is primarily PDF extraction, OCR, or per-page JSON output.

## Host Workflow

1. Decide whether the work is operational CLI usage, plugin debugging, DOM inspection, or note/property manipulation.
2. Load an extension only when the task is mostly about an archived Obsidian surface.
3. Use `obsidian help` or app-specific commands when exact syntax matters.
4. Keep commands explicit with `vault=`, `file=`, or `path=` when ambiguity would cause mistakes.

## Response Guardrails

- Assume Obsidian must be open for live CLI interaction unless the task is only planning.
- Prefer exact commands over vague procedural advice.
- Do not route PDF extraction through Obsidian commands when `pdf-reader` is the real tool.
