# Slot Patterns

## When to use

Use when a component has fixed structure but needs one or more replaceable regions. Triggers include:

- "這個區塊要能替換"
- "header/footer/toolbar 要能自定義"
- "空狀態要客製化"
- "children 當函式"
- "renderRow 怎麼設計"
- "什麼時候用 slot 什麼時候用 render prop"

## Inputs

- Component name and fixed layout regions
- Which regions need customization: static replacement or dynamic rendering with internal state
- Caller needs: replace whole region or render with context/handlers
- Number of replaceable regions: 1-3 suggests slots, 4+ suggests compound components

## Steps

### 1. Identify the slot boundary

Ask: does the caller want to replace the entire region, or render content using internal state?

- **Replace entire region**: use **named slots** or **JSX as props**
- **Render with internal state/handlers**: use **children as function** or **render props**

### 2. Choose the right slot pattern

**Named slots** (JSX as props):
- Use when: layout is fixed, specific regions must be replaceable (header/footer/toolbar/empty)
- Good for: Card, PageHeader, Table shell, Modal, EmptyState
- Example props: `header`, `footer`, `toolbar`, `empty`
- Rule of thumb: 3-6 slots max; beyond that consider compound components

**Children as function** (function-as-children):
- Use when: caller renders content that needs internal state or handlers
- Signature: `children: (ctx: SlotContext) => ReactNode`
- Good for: renderRow, renderNode, renderTrigger
- Keep ctx small and stable

**Render props**:
- Use when: same as children as function, but prop name makes intent clearer
- Signature: `renderItem: (item: T, ctx: ItemContext) => ReactNode`
- Good for: ListItem, TreeNode, DropdownRow

### 3. Define slot contracts

For each slot, specify:

1. **What is provided to the slot**: context, handlers, state values
2. **What the slot must return**: ReactNode
3. **Default behavior** if slot is not provided (optional)

Example:
```typescript
// Named slot with default
interface CardProps {
  header?: ReactNode;        // defaults to null
  footer?: ReactNode;        // defaults to null
  children: ReactNode;       // required, main content
}

// Children as function
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, ctx: { index: number; isSelected: boolean }) => ReactNode;
}
```

### 4. Apply composition rules

- Named slots + render props can coexist if they serve different regions
- Slots = replace whole region (no internal state access)
- Render props = customize per-item render with ctx
- Do not add both for the same region

## Safety gates

- Do not use named slots when children-as-function is more appropriate: slots replace, render props augment
- Do not expose raw internal state in slot context; provide typed, stable APIs
- Avoid cloneElement; prefer context, render props, or slot-props
- Keep slot context small: include only what callers need, not implementation details
- For 4+ replaceable regions, evaluate compound components instead

## Outputs

1. **Slot pattern chosen** and reasoning (named slots vs children-as-function vs render props)
2. **Slot prop signatures**: name, type, what context/state is provided
3. **Default behaviors** for each slot (or explicitly null/required)
4. **Usage examples**: basic replacement + advanced with context

## Anti-patterns

### Common Mistakes

- [ ] Mistake 1: Using named slots for dynamic content that needs internal state -- caller cannot access state,只好用 render prop
- [ ] Mistake 2: Exposing internal state shape in slot context -- couples callers to implementation details
- [ ] Mistake 3: Adding both slots and render props for the same region -- creates confusion about which wins
- [ ] Mistake 4: Creating 7+ named slots -- signals need for compound components or better composition

### Negative Examples

**Do not use named slots when the caller needs internal state** -- a `Table` with `empty` slot that cannot access loading state signals the need for `children as function` or `renderEmpty`.

**Do not expose raw context values like `{ row, setRow, selection }`** -- provide stable typed getters like `renderRow: (row: Row, ctx: { isSelected: boolean; onSelect: () => void })`.

**Do not use cloneElement to augment children** -- this breaks memoization and makes debugging harder.

## Verification

Validate slot design against these criteria:

- Does each slot have a clear, typed contract?
- Is it obvious what context/state is available to slot content?
- Are defaults provided for optional slots?
- Is the pattern choice appropriate for the customization need?
- For large lists/tables: virtualization path exists, slot render is stable?
- Documentation covers: slot names, types, what is provided, examples for both empty and populated cases

(End of file -- total 123 lines)
