---
name: react-component-designer
description: |
  Design reusable React and TypeScript component APIs: composition, slots, compound components,
  controlled state, headless hooks, and polymorphism. Use when the public component contract is the
  main problem. Do not use for page implementation or browser tests; route those to
  frontend-dev-guidelines or stagehand-aria-e2e.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# React Component Designer

Choose the smallest public API that satisfies real customization and state needs. Follow repository conventions before adding a pattern.

## Routes

- [Component API design](references/tasks/component-api-design.md)
- [Slots and composition](references/tasks/slot-patterns.md)
- [Pattern selection](references/pattern-selection.md)
- [Output template](references/output-template.md)
- [Quality checklist](references/checklists.md)

Start with props and composition. Add slots for replaceable fixed regions, render props for state-aware rendering, compound components for reorderable shared state, and controlled state only for real external synchronization. Reserve headless hooks, prop getters, reducers, and polymorphism for requirements simpler APIs cannot meet.

Return the chosen pattern, public TypeScript contract, state rules, minimal and advanced examples, accessibility behavior, and pitfalls.
