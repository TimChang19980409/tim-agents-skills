# Slot Patterns

## Use

Use when callers must replace known regions of a reusable component without owning its state machine.

## Choose

- JSX prop: one optional region with no shared context.
- Named slot: a fixed set of replaceable regions such as header, toolbar, empty, or footer.
- Compound component: callers reorder subparts that share state.
- Render prop: rendering depends on internal state or handlers.
- Headless hook: callers own nearly all markup and styling.

## Contract

1. Name slots by semantic role, not DOM position.
2. Specify fallback content and whether `null` suppresses it.
3. Document props, state, refs, and accessibility attributes supplied to a slot.
4. Keep event composition and ref forwarding deterministic.

## Avoid and verify

Do not offer two mechanisms for one region or leak the internal context shape. Show default and customized usage, then verify keyboard/focus behavior remains owned by the component unless the contract explicitly transfers it.
