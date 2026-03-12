---
name: react-component-designer
description: Design React component APIs and choose the right combination of component patterns (props-driven configuration, composition/children, named slots, compound components with context, render props, controlled vs uncontrolled, headless hooks, state reducer, prop getters, polymorphic/asChild). Use when the user asks to “design a component”, “元件設計”, “component API”, “可重用元件”, “design system component”, “slot/compound/render props/headless”, or when creating reusable React/TypeScript UI components that must balance defaults with customization.
---

# React Component Designer

Design a React component API by selecting a *minimal* set of patterns that fits the customization and state needs. Prefer the simplest API that still leaves a safe escape hatch.

## Workflow (always follow)

### 1) Classify the component (30 seconds)

Pick the closest bucket (multiple can apply):

- **Primitive**: renders a single element (Button, Badge, Input)
- **Composite**: renders a fixed layout with regions (Card, PageHeader, Table shell)
- **Interactive**: complex user interactions (Combobox, Tree, Drag&Drop)
- **Controller/Headless**: logic-only hook + external UI (design systems, multiple skins)

### 2) Ask minimal clarifying questions (max 5)

Ask only what changes the API shape. Use these defaults if user doesn’t specify:

- Default stack: **React + TypeScript**, minimal dependencies, accessible-by-default.
- Default customization: allow className/style; avoid exposing deep internals.

Questions (pick what applies):

1. **Customization depth**: style-only, replace specific regions, or fully custom render?
2. **State ownership**: should parent control it (URL/store sync) or internal is fine?
3. **Composition needs**: does caller need to reorder/insert subparts?
4. **Accessibility**: keyboard nav, ARIA roles, focus management required?
5. **Scale**: expected item count / performance constraints (virtualization?).

### 3) Choose patterns using the decision rules

Start with **Props-driven + composition**. Add patterns only when needed.

Use this selection order (stop as soon as requirements are met):

1. **Props-driven configuration**
   - Use when: fixed structure; customization is toggles/text/variants/classes.
2. **Composition / children / JSX as props**
   - Use when: caller supplies content; you still own the layout.
3. **Named slots**
   - Use when: fixed layout, but specific regions must be replaceable (header/toolbar/empty/footer).
4. **Render props**
   - Use when: caller must render part of UI *with internal state* (row/node rendering with ctx).
5. **Compound components + Context**
   - Use when: multiple subcomponents share state and caller needs flexible layout/reordering.
6. **Controlled / uncontrolled (control props)**
   - Use when: state must be externally synchronized; also offer default* for convenience.
7. **State reducer**
   - Use when: caller must alter state transitions without fully controlling state.
8. **Headless hook + prop getters**
   - Use when: multiple visual skins, high a11y needs, or deep UI control is required.
9. **Polymorphic / asChild**
   - Use when: underlying element must be caller-chosen (e.g., Button rendered as Link).

If unsure, consult `references/pattern-selection.md`.

### 4) Produce deliverables (required output)

Always output, in this order:

1. **Chosen pattern combination** (1–3 patterns is ideal) and why.
2. **Public API proposal**: props/types + events; specify controlled/uncontrolled rules.
3. **Usage examples**: minimal + one advanced customization example.
4. **Implementation outline**: state placement, context boundaries, a11y notes, performance notes.
5. **What not to do**: 2–4 pitfalls specific to the chosen patterns.

Use the templates in `references/output-template.md`.
Use the quality checks in `references/checklists.md` for interactive or reusable components.

## Guardrails (avoid fragile designs)

- Avoid `cloneElement` unless there is a strong reason; prefer context, render props, or slots-props.
- Don’t expose internal state shape unless committing to it long-term.
- Don’t add both “slots” *and* “render props” for the same region unless there is a clear split:
  - slots = replace whole region
  - render prop = customize per-item render with ctx
- For **a11y-heavy interactive components**, default to headless + prop getters.

## Optional: project conventions

If the repository has local conventions (import rules, styling, component standards), follow them. If unclear, ask once and proceed with sensible defaults.

## Calibration examples

If you feel “multiple patterns could work”, open `references/examples.md` and match the closest example first, then adapt.
