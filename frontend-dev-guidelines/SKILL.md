---
name: frontend-dev-guidelines
description: |
  Primary implementation and review skill for modern React + TypeScript frontends.
  Use when building or refactoring components, pages, routes, data-fetching flows,
  or frontend architecture; reviewing React UI code for performance; or auditing UI
  and accessibility behavior. This skill is the frontend family host. For reusable
  component API design and pattern selection, delegate to react-component-designer.
---

# Frontend Development Guidelines

Use this skill as the default host for React + TypeScript implementation and review work. It absorbs the active surface that used to be split across standalone React performance and UI guideline skills.

## Scope

Use this skill when the request is mainly about:

- building or refactoring React components, pages, routes, forms, and feature modules
- reviewing frontend code quality, maintainability, or architecture
- investigating React performance problems
- auditing UI, accessibility, and interaction quality

Hand off to:

- `react-component-designer` for reusable component API design, slots, compound components, controlled/uncontrolled tradeoffs, and headless patterns
- `stagehand-aria-e2e` when browser behavior must be validated through real user flows

## Core workflow

1. Classify the task as `implementation`, `performance review`, or `UI/accessibility review`.
2. Read local repo conventions before imposing generic patterns.
3. Prefer the smallest change that improves correctness, clarity, and runtime behavior.
4. Keep architecture, styling, and data-fetching choices consistent with the existing app.
5. Verify the change with the narrowest useful tests or checks.

## Implementation

### Default engineering posture

- Preserve existing repo patterns unless they are clearly harmful.
- Prefer function components with explicit props types.
- Keep state local until multiple consumers genuinely need shared ownership.
- Derive values during render instead of mirroring them in state.
- Use effects only to synchronize with external systems, not to run interaction logic that can stay in events or render.
- Keep async boundaries explicit and start independent work in parallel.
- Add code-splitting where routes or heavy UI islands benefit from it.
- Favor direct imports in hot paths over barrel imports when bundle size matters.

### Data and state

- Follow the repo's existing data layer first: router loaders, Suspense hooks, React Query, SWR, or framework-native fetch patterns.
- Avoid introducing client waterfalls when requests can be parallelized.
- Prefer stable, typed API boundaries between UI and data layers.
- Use `startTransition`, `useDeferredValue`, and `useEffectEvent` when they materially improve UX or correctness and the project already supports them.

### Component and feature structure

- Keep feature code grouped by domain rather than by technical layer when the repo is feature-oriented.
- Split a component when it mixes unrelated state machines, data concerns, or layout responsibilities.
- Keep styling in the established system: MUI, Tailwind, CSS modules, or other repo-standard tooling.
- Avoid broad rewrites of class names, tokens, or component boundaries unless the task is explicitly architectural.

### Implementation deliverables

When you implement frontend changes, provide:

1. the smallest complete code change
2. any required typing, routing, styling, or data-layer updates
3. focused tests or verification notes
4. short assumptions and known tradeoffs

## Performance Review

Review in this order so the highest-impact issues surface first:

1. **Network waterfalls**
   - parallelize independent async work
   - move fetches earlier in the lifecycle when safe
   - avoid duplicated client requests when a query library or loader can dedupe
2. **Bundle size**
   - replace barrel imports in hot paths with direct imports
   - defer large third-party libraries or heavy UI islands
   - keep server-only and client-only code separated where the framework supports it
3. **Render churn**
   - remove derived state stored in effects
   - keep transient values in refs when they should not trigger renders
   - use transitions for non-urgent updates instead of blocking urgent interactions
4. **Rendering and layout**
   - reduce needless DOM weight
   - use virtualization or `content-visibility: auto` for long, mostly offscreen lists when appropriate
   - avoid animation patterns that cause excessive layout or paint work
5. **JavaScript hot paths**
   - use `Set`/`Map` for repeated membership lookups
   - avoid repeated sort/filter passes when a single pass is clearer and cheaper
   - keep expensive computations outside frequently re-rendered code paths

When the user asks for a review, return findings first, ordered by impact, with concrete fixes rather than generic advice.

## UI/Accessibility Review

Check these areas before calling a UI change complete:

- semantics: headings, landmarks, button vs link usage, form labeling
- keyboard support: tab order, visible focus, shortcuts, escape paths
- accessible names and state: labels, descriptions, selected/expanded/disabled states
- feedback states: loading, empty, success, error, and retry behavior
- visual clarity: spacing, hierarchy, contrast, touch targets, responsive layout
- motion and perception: reduced-motion handling, no hidden critical state in animation alone

For review tasks, prefer behavior-oriented findings such as "focus is lost after dialog close" or "error state has no announced message" over vague style comments.

## Review output

Use these response modes:

- `implementation`: summarize the change, highlight the main tradeoff, and note verification
- `performance review`: list concrete findings with file references and expected impact
- `UI/accessibility review`: list concrete findings with severity and user-facing consequence

If there are no material findings, say so explicitly and mention residual risks or untested interaction paths.
