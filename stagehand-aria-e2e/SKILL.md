---
name: stagehand-aria-e2e
description: |
  Build Stagehand v3 browser tests using ARIA snapshots, layout-tree assertions, and targeted screenshots.
  Use when a repeatable browser test must verify keyboard, focus, ARIA, or layout behavior. Do not use for static frontend review or general browser use;
  route those to frontend-dev-guidelines or the host browser capability.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Stagehand ARIA E2E

Use Stagehand v3 only when the task requires a repeatable browser-testing workflow, not one-off browser operation.

## Routes

- [ARIA snapshot flow](references/tasks/aria-snapshot-flow.md)
- [Layout-tree assertion](references/tasks/layout-tree-assertion.md)
- [Screenshot migration](references/tasks/screenshot-migration.md)
- [Install check](references/tasks/install-check.md)
- [Assertion layer](references/decisions/assertion-layer.md)
- [Stagehand versus Playwright](references/decisions/stagehand-vs-playwright.md)

Prefer semantic assertions for roles, names, state, and focus; use structural layout checks for geometry; reserve screenshots for visual evidence. Verify installed v3 APIs before writing code and keep selectors accessibility-first.
