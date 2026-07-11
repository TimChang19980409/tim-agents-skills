---
name: skill-portfolio-maintainer
description: |
  Govern this local skill portfolio: migrate skills into the host-playbook framework, maintain
  trigger and outcome evals, refresh metadata, and reconcile runtime projections. Use for portfolio-wide
  skill maintenance. Do not use for ordinary app code or OpenCode-only configuration; route the latter
  to opencode-configurator.
metadata:
  framework_role: utility
  execution_mode: manual
---

# Skill Portfolio Maintainer

Use this skill as the skill-design utility. Route to one creation or benchmarking playbook before loading broader references.

Hard rule: if the prompt specifies an exact first line or asks for `Selected:`, emit that exact line first and do not preface it with phrases like "Based on", "Here is", or "Analysis".
Required template when the route is `improve-triggering` and `Selected:` was requested:

```text
Selected: improve-triggering
```

## Intent Router

- `draft-skill`: [references/tasks/draft-skill.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/tasks/draft-skill.md)
- `framework-migration`: [references/tasks/framework-migration.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/tasks/framework-migration.md)
- `benchmark-skill`: [references/tasks/benchmark-skill.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/tasks/benchmark-skill.md)
- `improve-triggering`: [references/tasks/improve-triggering.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/tasks/improve-triggering.md)
- `eval-strategy`: [references/decisions/eval-strategy.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/decisions/eval-strategy.md)
- `artifact-retention`: [references/decisions/artifact-retention.md](/Users/ss105213025/.agents/skills/skill-portfolio-maintainer/references/decisions/artifact-retention.md)

## Extension Packs

- `developer-growth-analysis` only when the task explicitly becomes career-analysis oriented
- Route pedagogy, teaching-script, lesson-outline, or teaching-document work to `teaching-content-designer`

## Core Workflow

1. If the prompt asks for `Selected:`, the first non-empty line must be exactly `Selected: <exact router id>` before any analysis or explanation.
2. Choose one skill-creation playbook or one benchmark decision first.
3. Prefer concrete task evals over abstract prompts when the user asked for task-focused coverage.
4. Keep the framework migration thin and portable-first.
5. End with the benchmark contract and retained artifacts.

## Response Guardrails

- Keep skill descriptions bounded and specific.
- Do not leave bulky benchmark outputs in the repo by default.
- If the user explicitly asks you to start with `Selected:`, output `Selected: <exact router id>` using one of `draft-skill`, `framework-migration`, `benchmark-skill`, `improve-triggering`, `eval-strategy`, `artifact-retention` as the first non-empty line, with no lead-in sentence or heading before it.
- When the task is about retention, explicitly name compact artifacts such as `benchmark.json`, `benchmark.md`, `opencode.json`, and workspace `README.md`.
