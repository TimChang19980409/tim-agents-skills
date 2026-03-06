# React + Storybook + Vite Official Reference (Verified 2026-02-12)

## 1) Storybook React + Vite framework
- Official framework docs: https://storybook.js.org/docs/get-started/frameworks/react-vite
- Framework package: `@storybook/react-vite`
- Listed requirements in docs:
  - React >= 16.8
  - Vite >= 5

## 2) Storybook install and lifecycle commands
For existing React projects:
- `npm create storybook@latest`

Builder CLI option (from Storybook builders docs):
- `npx storybook@latest init --builder vite`

Run/build commands:
- `npm run storybook`
- `npm run build-storybook`

Output dir default:
- `storybook-static`

## 3) Migration to React + Vite framework
Migration command:
- `npx storybook@latest upgrade`

Manual migration:
- `npm install --save-dev @storybook/react-vite`
- Update `.storybook/main.ts` `framework` to `@storybook/react-vite`.

## 4) Core Storybook config shape
From Storybook config docs:
- Main config file: `.storybook/main.ts`
- Required config points in typical setup:
  - `framework`
  - `stories`
  - `addons`

## 5) Vite builder customization in Storybook
Storybook Vite builder docs indicate using `viteFinal` to merge/extend Vite config.
Typical usage pattern:
- import `mergeConfig` from `vite`
- return `mergeConfig(config, { ... })`

Use cases:
- Inject `resolve.alias`
- Add shared plugins (e.g. React plugin only when needed)
- Define env shims and build flags

## 6) React docgen behavior with Vite builder
From Storybook Vite builder docs:
- React + Vite builder defaults to `react-docgen`
- Fallback option available:
  - `typescript.reactDocgen: 'react-docgen-typescript'`

## 7) Story authoring primitives to enforce
From Storybook writing docs:
- Use CSF stories (`Meta`, `StoryObj`)
- Use `args` for prop-driven variants and controls
- Use `argTypes` for control constraints and docs metadata
- Use tags (e.g. `autodocs`, `test`) to control docs/test inclusion
- Co-locate stories near components

## 8) Vite-side implementation facts (official docs)
Vite docs provide:
- Scaffolding commands including:
  - `npm create vite@latest`
  - `bun create vite`
- React templates include `react-ts` and `react-swc-ts`
- Official plugin list includes:
  - `@vitejs/plugin-react`
  - `@vitejs/plugin-react-swc`
- `resolve.alias` should use absolute file system paths

## Source Links
- https://storybook.js.org/docs/get-started/frameworks/react-vite
- https://storybook.js.org/docs/9.0/get-started/frameworks/react-vite
- https://storybook.js.org/docs/9.0/builders
- https://storybook.js.org/docs/builders/vite
- https://storybook.js.org/docs/api/main-config/main-config-framework
- https://storybook.js.org/docs/configure/integration/typescript
- https://storybook.js.org/docs/writing-stories
- https://storybook.js.org/docs/writing-stories/args
- https://storybook.js.org/docs/api/arg-types
- https://storybook.js.org/docs/writing-stories/tags
- https://vite.dev/guide/
- https://vite.dev/plugins/
- https://main.vite.dev/config/shared-options.html
