# Pattern Selection Matrix (React Component API)

Use this matrix when deciding which patterns to combine. Prefer the **smallest set** that meets requirements.

## Quick mapping

### Props-driven configuration
- **Use when**: structure is fixed; caller tweaks behavior/appearance via props.
- **Great for**: primitives, small composites.
- **Risk**: prop explosion.

### Composition / children / JSX as props
- **Use when**: caller supplies content; you keep layout.
- **Great for**: Card, Panel, EmptyState.
- **Risk**: too many “holes” becomes hard to document.

### Named slots
- **Use when**: fixed layout with a few replaceable regions (toolbar/header/footer/empty).
- **Great for**: Table shells, Tree wrappers, PageHeader.
- **Rule of thumb**: 3–6 slots max; beyond that consider compound components.

### Compound components (+ Context)
- **Use when**: multiple parts share state and caller needs flexible ordering/composition.
- **Great for**: Tabs, Menu, Dialog, FormField groups.
- **Risk**: context re-render; mitigate with stable values and/or split contexts.

### Render props
- **Use when**: caller must render a piece using internal state/handlers (ctx).
- **Great for**: `renderRow`, `renderNode`, `renderTrigger`.
- **Risk**: callback nesting; keep ctx small and stable.

### Controlled / uncontrolled (control props)
- **Use when**: state must sync with store/URL; still allow `defaultX` for convenience.
- **Rule**: if `value` provided → controlled; ignore internal updates except via `onChange`.
- **Risk**: “two sources of truth”; document precedence and warnings.

### State reducer
- **Use when**: caller needs to override state transitions but not fully control state.
- **Good for**: selection/keyboard interaction components.
- **Risk**: commits you to an action/state contract.

### Headless hook + prop getters
- **Use when**: want multiple visual skins; need robust keyboard/a11y; UI must be caller-defined.
- **Great for**: Combobox, Tree, Menu, Drag&Drop.
- **Risk**: API complexity; provide ready-made UI wrapper as “happy path”.

### Polymorphic / asChild
- **Use when**: underlying element must vary (Button as Link, Trigger as custom element).
- **Risk**: ref typing complexity; document supported props and limitations.

## Common “recipes”

- **Simple UI component**: props-driven + `className`
- **Card with header/footer**: props-driven + JSX-as-props or named slots
- **Table shell**: named slots (toolbar/empty/footer) + renderRow
- **Tabs**: compound + context + controlled/uncontrolled (`value/defaultValue`)
- **Tree**: headless hook + renderNode + slots (toolbar/search/stats)

