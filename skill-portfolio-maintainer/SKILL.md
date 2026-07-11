---
name: skill-portfolio-maintainer
description: |
  Govern a multi-skill agent portfolio: edit trigger descriptions and boundaries, skills.json
  schema or freshness, natural-prompt evals and native skill-event parsing, thin-router migrations,
  compact benchmark artifacts, and cross-host projections. Use when a change affects skill
  governance or multiple skills. Do not use for ordinary app code or OpenCode-only configuration;
  route the latter to opencode-configurator.
metadata:
  framework_role: utility
  execution_mode: manual
---

# Skill Portfolio Maintainer

Use this skill as the skill-design utility. Route to one creation or benchmarking playbook before loading broader references.


```text
```

## Intent Router

- `draft-skill`: [references/tasks/draft-skill.md](references/tasks/draft-skill.md)
- `framework-migration`: [references/tasks/framework-migration.md](references/tasks/framework-migration.md)
- `benchmark-skill`: [references/tasks/benchmark-skill.md](references/tasks/benchmark-skill.md)
- `improve-triggering`: [references/tasks/improve-triggering.md](references/tasks/improve-triggering.md)
- `eval-strategy`: [references/decisions/eval-strategy.md](references/decisions/eval-strategy.md)
- `artifact-retention`: [references/decisions/artifact-retention.md](references/decisions/artifact-retention.md)

## Extension Packs

- `developer-growth-analysis` only when the task explicitly becomes career-analysis oriented
- Route pedagogy, teaching-script, lesson-outline, or teaching-document work to `teaching-content-designer`

## Core Workflow

2. Choose one skill-creation playbook or one benchmark decision first.
3. Prefer concrete task evals over abstract prompts when the user asked for task-focused coverage.
4. Keep the framework migration thin and portable-first.
5. End with the benchmark contract and retained artifacts.

## Response Guardrails

- Keep skill descriptions bounded and specific.
- Do not leave bulky benchmark outputs in the repo by default.
- When the task is about retention, explicitly name compact artifacts such as `benchmark.json`, `benchmark.md`, `opencode.json`, and workspace `README.md`.
