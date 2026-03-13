---
name: frontend-dev-guidelines
description: |
  Frontend family host for modern React + TypeScript work. Use when the user is building,
  refactoring, reviewing, auditing accessibility, or profiling performance in a frontend codebase.
  Route reusable component API design to react-component-designer and browser-behavior validation
  to stagehand-aria-e2e.
metadata:
  framework_role: host
  execution_mode: inline
---

# Frontend Development Guidelines

Use this skill as the frontend family host. Keep the active trigger surface here, then load exactly one task playbook or decision guide before going deeper.

## Intent Router

- `build`: [references/tasks/build.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/tasks/build.md)
- `refactor`: [references/tasks/refactor.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/tasks/refactor.md)
- `review`: [references/tasks/review.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/tasks/review.md)
- `accessibility audit`: [references/tasks/accessibility-audit.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/tasks/accessibility-audit.md)
- `performance review`: [references/tasks/performance-review.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/tasks/performance-review.md)
- `component boundaries`: [references/decisions/component-boundaries.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/decisions/component-boundaries.md)
- `delivery surface`: [references/decisions/delivery-surface.md](/Users/ss105213025/.agents/skills/frontend-dev-guidelines/references/decisions/delivery-surface.md)

## Delegation

- Delegate to `react-component-designer` when the core problem is component API shape, slots, compound components, controlled/uncontrolled behavior, or headless abstractions.
- Delegate to `stagehand-aria-e2e` when the user needs real browser behavior validation rather than static code review.

## Extension Packs

Load these only when the request is narrower than the host:

- `react-best-practices` and `vercel-react-best-practices` for deeper performance heuristics
- `web-design-guidelines` for archived checklist-style UI reviews
- `react-storybook-vite-workflow` or `ladle-component-workflow` for component-workbench setup
- `tailwind-best-practices` for archived Tailwind token discipline
- `solidjs-patterns` and `ui-ux-pro-max` only on explicit need

## Host Workflow

1. Classify the request into one task playbook or one decision guide before reading deeper references.
2. Read repo-local code and conventions before importing generic frontend advice.
3. Load at most one extension pack unless the task clearly spans multiple archived specialties.
4. Keep the recommendation or code change aligned with the repo's existing framework, styling, and data layer.
5. Verify with the narrowest useful tests or checks.

## Response Guardrails

- For implementation tasks, prefer the smallest complete change over broad rewrites.
- For review tasks, return findings first, ordered by impact, with concrete fixes.
- For accessibility or performance tasks, describe user-facing consequences, not only code smells.
- If the user explicitly asks you to start with `Selected:`, output `Selected: <exact router id>` using one of `build`, `refactor`, `review`, `accessibility-audit`, `performance-review`, `component-boundaries`, or `delivery-surface` before any other text.
- Do not invent new frameworks, component systems, or styling tools unless the user asks for them.
