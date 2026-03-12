---
name: ladle-component-workflow
description: Ladle-based component development workflow for React/TypeScript projects, including setup, story conventions, props/state modeling, global decorators, addon usage, CI integration, and Storybook migration. Use when introducing or improving a component-driven workflow, creating or reviewing `*.stories.*` files, or defining best practices for component Props and State with Ladle.
---

# Ladle Component Workflow

## Overview

Adopt Ladle as the component development environment and enforce consistent story quality. Design stories that cover Props and State behavior with deterministic, testable outputs.

Read `references/ladle-official-reference.md` first when exact command syntax or addon/config options are needed.

## Workflow

1. Assess the current component workflow and Storybook dependency.
2. Install and bootstrap Ladle.
3. Configure stories and global provider/decorators.
4. Implement Props matrix stories.
5. Implement State behavior stories.
6. Enable quality addons and CI build checks.
7. Migrate legacy Storybook stories incrementally.

## Step 1: Assess Baseline

Confirm:
- Target framework is supported by Ladle (`react`, `vue`, `svelte`, `solid`, `preact`, `inferno`).
- Existing project already uses Vite or can accept Vite-powered dev/build for stories.
- Team agrees to treat stories as component contracts (not only visual sandbox).

## Step 2: Bootstrap Ladle

Choose one:
- New workspace scaffolding with `npm create ladle@latest`.
- Existing project installation with `npm install --save-dev @ladle/react` (or package for your framework), then add scripts:
  - `ladle`: `ladle serve`
  - `ladle:build`: `ladle build`

Keep `ladle:build` separate from app build so CI can fail specifically on component docs/build regressions.

## Step 3: Configure Story Topology

Define:
- Story locations via `.ladle/config.mjs` (`stories` glob).
- Global wrappers in `.ladle/components.tsx`:
  - Use `Provider` for app-level context (theme, i18n, design tokens).
  - Use `StoryDefault` for page padding/layout.
  - Use `globalState` and `setGlobalState` only for cross-story global controls.

Prefer minimal global state and keep per-component behavior inside each story to avoid hidden coupling.

## Step 4: Model Props Coverage

For each component:
1. Create a base interactive story driven by args.
2. Enumerate meaningful Props dimensions:
   - visual variants (`size`, `intent`, `disabled`)
   - content variants (short/long text, empty/overflow)
   - behavioral callbacks (`onClick`, `onChange`)
3. Add `argTypes` so controls reflect intended value ranges and option sets.
4. Keep args serializable and deterministic.

Definition of done for Props:
- Every public prop category has at least one story.
- Invalid/uncommon combinations are either blocked or documented in story notes.
- Callback props are observable through action logging or explicit test hooks.

## Step 5: Model State Coverage

Separate state scenarios from prop scenarios:
- Stateless/pure rendering story.
- Controlled state story (external state via args/parent harness).
- Uncontrolled/interactive story (user-triggered transitions).
- Edge-state stories (loading, error, empty, disabled, optimistic, focus/keyboard).

Use wrappers/harness components in stories to expose transitions clearly:
- Initialize state from args where possible.
- Keep transition triggers explicit (buttons, inputs, events).
- Avoid hidden timers/randomness unless specifically testing them.

Definition of done for State:
- Core finite states are represented as named stories.
- Transition path between key states can be demonstrated manually in Ladle.
- State stories remain deterministic enough for CI screenshot/interaction checks.

## Step 6: Add Quality Gates

Enable and use:
- `@ladle/addon-a11y` to surface accessibility issues during component work.
- `@ladle/addon-actions` to observe event flows.
- `@ladle/addon-theme` and viewport width controls to validate theme/responsive behavior.

CI baseline:
1. Install dependencies.
2. Run `ladle build`.
3. Publish static output as artifact or preview environment.
4. Optionally run Playwright against built stories for behavior checks.

## Step 7: Migrate from Storybook

If legacy Storybook exists:
1. Start with leaf components (Button/Input/Card) and copy CSF stories first.
2. Replace Storybook-only APIs/addons with Ladle-native controls/decorators/addons.
3. Keep both systems temporarily; gate new components to Ladle only.
4. Remove Storybook after migration parity is reached.

## Output Format

When asked to introduce Ladle in a project, produce:
1. A concrete install/config diff (`package.json`, `.ladle/config.mjs`, `.ladle/components.tsx`).
2. One sample `*.stories.tsx` showing prop matrix + state scenarios.
3. CI steps (exact commands) and pass/fail criteria.
4. Migration plan with phased ownership and rollback notes.
