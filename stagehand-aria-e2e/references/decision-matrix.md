# Stagehand Decision Matrix

## Goal-Oriented Tool Choice

Use this matrix to pick the right approach quickly.

| Scenario | Primary Tooling | Assertion Style | Notes |
| --- | --- | --- | --- |
| Intent-driven flow, volatile DOM | Stagehand + Playwright | ARIA snapshot | Prefer semantic scope by role |
| Layout, spacing, flex/grid, stacking regression | Stagehand + Playwright CDP | CSS Layout Tree Snapshot | Tag the smallest meaningful root and filter subtree |
| Stable selectors, deterministic UI | Playwright only | Locator assertions or ARIA snapshot | Stagehand optional |
| Accessibility structure regression | Playwright (with or without Stagehand) | ARIA snapshot | Snapshot the smallest meaningful container |
| Agent needs fast state understanding | Stagehand + Playwright | ARIA snapshot + targeted text assertions | Avoid image reasoning loops |
| Pixel-perfect rendering, imagery, canvas | Playwright | Screenshot diff | Keep Stagehand out of the critical assertion path |

## Verification Layers

Use these layers deliberately.

| Layer | Best For | Primary API | Not For |
| --- | --- | --- | --- |
| Stagehand `act` / `observe` / `extract` | Intent execution and discovery | `Stagehand` | Final layout proof |
| Stagehand `page.snapshot()` | Fast semantic inspection | `page.snapshot()` | CSS layout verification |
| ARIA snapshot | Roles, names, states, hierarchy | `expect(locator).toMatchAriaSnapshot()` | Spacing or geometry |
| Layout tree snapshot | Bounds, paint order, computed layout styles | `DOMSnapshot.captureSnapshot` | Pixel-perfect image rendering |
| Screenshot | Visual pixels, canvas, antialiasing | `expect(page).toHaveScreenshot()` | Semantic or structural-only checks |

## Trigger Phrases

Treat these phrases as strong signals for Stagehand.

- "use stagehand"
- "replace screenshot verification"
- "ARIA snapshot"
- "semantic validation"
- "agent browser understanding speed"
- "intent-based browser automation"
- "layout tree"
- "DOMSnapshot"
- "spacing regression"
- "grid/flex layout"
- "排版"
- "樣式結構"

## Anti-Patterns

Avoid these patterns.

- Full-page ARIA snapshots for tiny behavior checks.
- Full-document layout snapshots when a component subtree is enough.
- Screenshot analysis when role, state, or layout-tree checks are enough.
- Treating `page.snapshot()` as CSS layout evidence.
- Mixing brittle CSS selectors with intent-driven actions without reason.
- Capturing every computed style instead of maintaining a stable allow-list.
