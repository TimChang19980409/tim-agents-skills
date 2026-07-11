# Component API Design

## When to use

Use when a user asks you to design, define, or review the public API of a reusable React component. Triggers include:

- "幫我設計一個 [Component]"
- "這個元件的 props 怎麼設計"
- "如何讓這個元件支援受控/非受控"
- "要用 compound components 嗎"
- "什麼時候用 headless hook"
- "這個元件要怎麼暴露 slots"

## Inputs

- Component name and purpose (explicit or inferred from conversation)
- Customization needs: which parts of the UI callers need to replace or control
- State requirements: does the component own state, or must it sync with an external store/URL
- Composition needs: must callers be able to reorder, add, or remove subparts
- Accessibility requirements: keyboard nav, ARIA roles, focus management
- Scale: expected item count, performance constraints (virtualization needs)

## Steps

### 1. Classify the component

Pick the closest bucket:

- **Primitive**: renders a single element (Button, Badge, Input)
- **Composite**: renders a fixed layout with regions (Card, PageHeader, Table shell)
- **Interactive**: complex user interactions (Combobox, Tree, Drag&Drop)
- **Controller/Headless**: logic-only hook + external UI (design systems, multiple skins)

### 2. Ask minimal clarifying questions (max 5)

Ask only what changes the API shape. Defaults: React + TypeScript, minimal deps, accessible-by-default, allow className/style.

1. **Customization depth**: style-only, replace specific regions, or fully custom render?
2. **State ownership**: should parent control it (URL/store sync) or internal is fine?
3. **Composition needs**: does caller need to reorder/insert subparts?
4. **Accessibility**: keyboard nav, ARIA roles, focus management required?
5. **Scale**: expected item count / performance constraints (virtualization?)

### 3. Select patterns using the decision rules

Start with Props-driven + composition. Add patterns only when needed, in this order:

1. **Props-driven configuration** -- fixed structure; caller tweaks behavior/appearance via props
2. **Composition / children / JSX as props** -- caller supplies content; you keep layout
3. **Named slots** -- fixed layout with a few replaceable regions (toolbar/header/footer/empty)
4. **Render props** -- caller must render a piece using internal state/handlers (ctx)
5. **Compound components + Context** -- multiple parts share state and caller needs flexible ordering/composition
6. **Controlled / uncontrolled (control props)** -- state must sync with store/URL; still allow defaultX for convenience
7. **State reducer** -- caller needs to override state transitions but not fully control state
8. **Headless hook + prop getters** -- want multiple visual skins; need robust keyboard/a11y; UI must be caller-defined
9. **Polymorphic / asChild** -- underlying element must vary (Button as Link, Trigger as custom element)

**Common recipes**:
- Simple UI component: props-driven + className
- Card with header/footer: props-driven + JSX-as-props or named slots
- Table shell: named slots (toolbar/empty/footer) + renderRow
- Tabs: compound + context + controlled/uncontrolled (value/defaultValue)
- Combobox / Menu / Tree: headless hook + renderNode + slots (toolbar/search/stats)
- Tree: headless hook + renderNode + slots

### 4. Apply controlled/uncontrolled rules

State synchronization order:

1. If `value` (or equivalent) is provided by caller -- component is **controlled**; ignore internal state; only call `onChange` to sync back
2. If no `value` provided -- component is **uncontrolled**; own internal state; use `defaultXxx` to set initial value
3. For convenience, support both: controlled wins if provided, falls back to internal state

Document the precedence explicitly. Warn about "two sources of truth" when both are provided.

### 5. Apply pattern-specific safety rules

**Compound components**:
- Split contexts if values change at different frequencies (avoid re-render cascade)
- Keep context value stable across renders (memoize objects, use refs for handlers)

**Headless hook**:
- Provide a ready-made UI wrapper as the "happy path" for callers who do not need a custom skin
- Prop getters must be stable (same output for same state) to avoid breaking memoization

**Render props**:
- Keep the render context small and stable
- Avoid nesting render props; prefer composition at the caller level

**Polymorphic / asChild**:
- Type the ref correctly; document which underlying element types are supported
- Be explicit about which props are forwarded and which are not

## Safety gates

- Do not add both "slots" and "render props" for the same region unless there is a clear split: slots = replace whole region, render prop = customize per-item render with ctx
- Do not expose internal state shape unless committing to it long-term; prefer stable public APIs over implementation details
- Avoid cloneElement unless there is a strong reason; prefer context, render props, or slot-props
- For a11y-heavy interactive components (Combobox, Tree, Drag&Drop), default to headless + prop getters
- Do not create deep prop hierarchies; prefer flat prop surfaces with namespacing (e.g., `triggerProps`, `contentProps`)

## Outputs

1. **Chosen pattern combination** (1-3 patterns is ideal) and why
2. **Public API proposal**: props/types + events; specify controlled/uncontrolled rules
3. **Usage examples**: minimal happy-path + one advanced customization example
4. **Implementation outline**: state placement, context boundaries, a11y notes, performance notes
5. **What not to do**: 2-4 pitfalls specific to the chosen patterns

## Anti-patterns

### Common Mistakes

- [ ] Mistake 1: Adding compound components when props-driven is sufficient -- increases API surface and cognitive load
- [ ] Mistake 2: Exposing a raw context value instead of a typed hook or stable getter -- callers become coupled to implementation details
- [ ] Mistake 3: Supporting both controlled and uncontrolled without documenting precedence clearly -- causes "two sources of truth" bugs
- [ ] Mistake 4: Using render props for content that is static (not driven by internal state) -- adds unnecessary indirection

### Negative Examples

**Do not design a Combobox with hardcoded UI when different product lines need different visuals** -- this signals the need for headless hook + prop getters instead.

**Do not expose internal component state as a context object** -- this couples callers to implementation and breaks encapsulation when internals change.

**Do not skip accessibility when building interactive components** -- keyboard nav and ARIA are part of the API contract.

## Verification

Validate the output against these quality criteria:

- Props are cleanly layered: data / behavior / style / slots / events?
- Are there sensible defaults? (happy path requires minimal props)
- Does the API provide a necessary escape hatch? (slots / render props / headless)
- Are controlled/uncontrolled rules explicit with clear precedence?
- Event naming is consistent: onXxx, parameter order fixed (id/state first, then payload)?
- For interactive components: keyboard operations specified (arrow keys / Home / End / Escape / Enter / Space)?
- Focus management predictable? (roving tabindex or aria-activedescendant)
- ARIA roles/states complete and correct?
- Disabled/readOnly behavior consistent?
- For large lists/trees/tables: virtualization path exists, context value is stable, keys are stable?

(End of file - total 159 lines)