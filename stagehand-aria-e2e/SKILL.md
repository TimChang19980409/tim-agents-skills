---
name: stagehand-aria-e2e
description: Build and validate browser E2E flows with Stagehand v3, Playwright ARIA snapshots, and CSS Layout Tree Snapshot assertions. Use when requests mention Stagehand, ARIA snapshot, DOMSnapshot, layout tree, semantic DOM verification, agent-driven browser actions, or replacing screenshot-based UI checks.
---

# Stagehand ARIA + Layout E2E

Use this skill to choose the right assertion layer for Stagehand v3 browser flows. Favor semantic and structural assertions over screenshot or OCR loops.

## Stagehand v3 Baseline

Treat these as defaults unless the user explicitly wants another stack.

- Use Bun + TypeScript for helper scripts, templates, and CLI examples.
- Do not add `.mjs`, `.js`, or `.cjs` script entrypoints to this skill. New and retained script surfaces must be Bun-executed `*.ts`.
- Assume Stagehand v3 semantics: CDP-backed runtime, `stagehand.context.pages()`, `stagehand.connectURL()`, and optional Playwright interop over CDP.
- Treat Stagehand `page.snapshot()` as a semantic/accessibility probe, not proof of CSS layout fidelity.

## Decision Workflow

Apply this decision order before writing tests.

1. Check verification target.
- Use Stagehand + ARIA snapshots when the goal is semantic behavior verification, interaction intent, or fast agent-readable validation.
- Use Stagehand + Playwright CDP layout snapshots when the goal is layout structure, spacing, stacking, flex/grid distribution, or style regressions that screenshots overfit.
- Use plain Playwright when selectors are stable and deterministic and natural-language planning adds no value.
- Use visual screenshot assertions only when pixel-perfect rendering is the actual requirement.

2. Check UI volatility.
- Prefer Stagehand when DOM structure and class names change often but user intent remains stable.
- Prefer plain Playwright when the app exposes reliable role/testid selectors and flows are straightforward.

3. Check test objective.
- Prefer ARIA snapshots for accessibility-tree consistency and interaction outcome validation.
- Prefer CSS Layout Tree Snapshots for structure-sensitive visual checks that can be expressed as bounds, paint order, and whitelisted computed styles.
- Avoid screenshot + image reasoning for checks that can be expressed as roles, names, states, hierarchy, or layout tree data.

4. Check scope.
- Snapshot the smallest container that proves the behavior.
- Prefer component or region assertions over full-page assertions.
- For layout snapshots, tag a root element and filter `DOMSnapshot.captureSnapshot` output to that subtree.

## When To Use Stagehand

Use Stagehand for these cases.

- Multi-step user-intent flows where hand-coded selector logic is brittle.
- Agent-executed E2E where faster semantic understanding is needed.
- Migration away from screenshot/OCR-based verification.
- Dynamic component trees where role/name semantics stay consistent.
- Flows that benefit from `act`, `observe`, or `extract` before assertion.
- Layout-sensitive journeys where Stagehand drives the intent and Playwright/CDP performs scoped structural verification.

## When Not To Use Stagehand

Skip Stagehand for these cases.

- Pure pixel-diff requirements where screenshots are the product contract.
- Simple deterministic flows with high-quality test IDs and stable selectors.
- Performance profiling scenarios where Playwright alone is sufficient.

## Implementation Standard

Follow this order for any new or migrated test.

1. Initialize Stagehand with explicit runtime mode (`LOCAL` or `BROWSERBASE`).
2. When you need Playwright assertions or raw CDP access, connect Playwright via `chromium.connectOverCDP({ wsEndpoint: stagehand.connectURL() })`.
3. Execute user-intent actions with Stagehand (`act`, `observe`, `extract`) where appropriate.
4. Assert semantic behavior using Playwright `toMatchAriaSnapshot` on scoped locators.
5. Assert layout behavior using `browserContext.newCDPSession(page)` and `DOMSnapshot.captureSnapshot`.
6. Keep every snapshot scope tight (component region > full page) to reduce churn.
7. Use screenshots only when layout tree data still cannot express the contract.

## Assertion Rules

Apply these rules on every test.

### ARIA
- Prefer `getByRole` locators over CSS selectors for assertion scope.
- Snapshot only the meaningful container.
- Store snapshots with stable names and update only after intent review.
- Fail test on semantic structure regressions unless the product behavior intentionally changed.

### Layout Tree
- Use Chromium-only CDP sessions for layout snapshots.
- Call `DOMSnapshot.captureSnapshot` with an explicit computed-style allow-list.
- Normalize numeric bounds before snapshotting to reduce noise.
- Filter the snapshot to a tagged root subtree instead of asserting the whole document.
- Store layout artifacts as JSON snapshots and review allow-list changes before updating fixtures.
- Do not treat Stagehand `page.snapshot()`, raw DOM HTML, or text extraction as substitutes for layout proof.

### Screenshots
- Keep screenshot assertions only when pixel rendering, imagery, canvas output, or browser paint quirks are the requirement.
- If a screenshot remains necessary, pair it with ARIA or layout assertions so failures diagnose faster.

## Migration Rules From Screenshot Tests

When replacing screenshot checks, do this.

1. Keep existing navigation and setup.
2. If the old test validated behavior or accessible structure, replace the screenshot assertion with an ARIA snapshot on the smallest valid container.
3. If the old test validated spacing, flex/grid layout, stacking, or scoped style structure, replace or supplement it with a CSS Layout Tree Snapshot.
4. If the old test validated pixel rendering only, keep the screenshot assertion and note that Stagehand is not the primary validator.
5. If the old test validated behavior, remove image-analysis steps entirely.

## Resource Files

Load only what is needed.

- `references/decision-matrix.md`: quick mapping from test intent to tool choice.
- `references/layout-tree-snapshot.md`: how to scope and normalize CSS Layout Tree Snapshots.
- `scripts/check-stagehand-install.ts`: verify Bun runtime plus Stagehand/Playwright installation and major versions.
- `scripts/new-stagehand-aria-spec.ts`: print a Bun + TypeScript starter spec template for Stagehand, ARIA snapshots, and layout tree snapshots.
