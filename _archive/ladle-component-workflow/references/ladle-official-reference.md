# Ladle Official Reference (Verified 2026-02-11)

## 1) Core Docs and Repo
- Official docs: https://ladle.dev/
- GitHub repository: https://github.com/tajo/ladle
- Latest release observed: `v5.1.1` (2025-11-04) on GitHub releases.

## 2) Setup Commands
From official setup docs:
- Initialize new project: `npm create ladle@latest`
- Install in existing project: `npm install --save-dev @ladle/react`
- Start dev server: `npm run ladle` (mapped to `ladle serve`)
- Build static output: `npm run ladle:build` (mapped to `ladle build`)

## 3) Story Conventions
From docs and examples:
- Story file naming: `*.stories.tsx` / `*.stories.jsx` / `*.stories.js`
- Default export typically sets `title`.
- Use `Story<YourProps>` + `args` for interactive prop-driven stories.

## 4) Controls / Props Modeling
From controls docs:
- Built-in control types include: `boolean`, `number`, `text`, `range`, `select`, `radio`, `inline-radio`, `check`.
- Define `argTypes` to constrain controls and encode API intent.
- Keep props serializable when possible for URL/state sharing and deterministic testing.

## 5) Decorators / Global Provider / Global State
From decorators docs:
- Configure `.ladle/components.tsx`.
- `Provider` wraps all stories for app-level dependencies.
- `StoryDefault` applies default layout/styling.
- `globalState` and `setGlobalState` support shared cross-story values.

## 6) Configuration
From configuration docs (`.ladle/config.mjs`):
- Configure `stories` glob.
- Configure `viteConfig` / `viteFinal` when aliasing or extending Vite behavior.
- Configure `addons` including actions/a11y/theme/viewport width.
- Use `appendToHead` for custom scripts or metadata.

## 7) Addons for Quality Gates
From addon docs:
- `@ladle/addon-a11y`: accessibility checks.
- `@ladle/addon-actions`: track event handlers for behavior verification.
- `@ladle/addon-theme`: switch light/dark (or custom theme) states.
- Width/viewport addon support exists through Ladle addon ecosystem.

## 8) CLI Reference
From CLI docs:
- `ladle serve`: run development server.
- `ladle build`: build static distributable.
- Flags include options such as custom config path and CI-oriented behavior.

## 9) Migration Signal
From Ladle docs navigation:
- Migration documentation exists for teams moving from Storybook.
- Prefer phased migration by component domain to reduce risk.

## Source Links
- https://ladle.dev/
- https://ladle.dev/docs/setup
- https://ladle.dev/docs/stories
- https://ladle.dev/docs/controls
- https://ladle.dev/docs/decorators
- https://ladle.dev/docs/config
- https://ladle.dev/docs/cli
- https://ladle.dev/docs/action
- https://ladle.dev/docs/a11y
- https://ladle.dev/docs/theme
- https://ladle.dev/docs/migrate-from-storybook
- https://github.com/tajo/ladle/releases/tag/v5.1.1
