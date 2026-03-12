---
name: react-storybook-vite-workflow
description: Implement and optimize React component development workflow with Storybook + Vite, including greenfield setup, existing-project integration, Storybook framework config (`@storybook/react-vite`), Vite config parity via `viteFinal`, story conventions (args/argTypes/tags), build/CI integration, and migration from non-Vite Storybook setups. Use when requests mention Storybook, React + Vite component playground, `.storybook/main.ts`, or Vite-specific Storybook issues.
---

# React Storybook Vite Workflow

## Overview

Set up and standardize Storybook on top of Vite for React projects. Keep Storybook config aligned with app Vite config and enforce story quality as component contracts.

Read `references/storybook-vite-official-reference.md` for exact commands and official links before implementation.

## Workflow

1. Identify project mode.
- Greenfield React + Vite project.
- Existing React project with/without Storybook.

2. Bootstrap Storybook with Vite-compatible framework.
- Default framework: `@storybook/react-vite`.
- Preferred bootstrap for existing apps: `npm create storybook@latest`.

3. Normalize Storybook config.
- `.storybook/main.ts` must explicitly set framework to `@storybook/react-vite`.
- Define strict stories globs.
- Add baseline addons needed by the team.

4. Align Vite parity in Storybook.
- Use `viteFinal` to merge required aliases/plugins/defines from app Vite config.
- Keep alias paths absolute.
- Avoid drift between app and Storybook resolution behavior.

5. Enforce story authoring standards.
- Use typed CSF (`Meta`, `StoryObj`).
- Use `args` for prop matrix and default states.
- Use `argTypes` to constrain controls and document API contracts.
- Use tags intentionally (e.g. `autodocs`, `test`) for docs/test scopes.

6. Add CI and release gates.
- Ensure `storybook` and `build-storybook` scripts exist.
- CI minimum: run `npm run build-storybook` and fail on build regressions.
- Publish `storybook-static` as artifact/preview target.

## Required Config Baseline

For `.storybook/main.ts`:
1. Set `framework: '@storybook/react-vite'`.
2. Define component story globs explicitly.
3. Keep addon list explicit and minimal.
4. If app uses custom aliases/plugins, merge them in `viteFinal`.

For `.storybook/preview.ts`:
1. Register global decorators/providers (theme, i18n, router mocks) only when truly global.
2. Keep global setup thin; prefer per-story harness for complex states.

## Definition of Done

1. Storybook starts and builds without config hacks.
2. Storybook and app resolve aliases consistently.
3. At least one representative component has:
- prop-driven story via `args`
- constrained controls via `argTypes`
- explicit state stories (loading/error/empty/interactive)
4. CI executes `build-storybook` successfully.

## Troubleshooting Priorities

1. Builder mismatch
- Confirm framework package is `@storybook/react-vite`.

2. Module resolution errors
- Add/adjust `viteFinal` alias merge.
- Ensure absolute alias paths.

3. Missing prop tables/docs
- Check docgen mode and TypeScript settings.
- If needed, set `typescript.reactDocgen` fallback.

4. Runtime mismatch between app and Storybook
- Compare app `vite.config.*` and Storybook `viteFinal` overrides.

## Output Format

When asked to implement Storybook + Vite, always return:
1. Concrete diff list (`package.json`, `.storybook/main.ts`, `.storybook/preview.ts`, sample `*.stories.tsx`).
2. Commands to run locally.
3. CI command list and expected outputs.
4. Migration notes if replacing an older Storybook setup.
