# CSS Layout Tree Snapshot Guide

Use this guide when ARIA snapshots are not enough because the regression is about layout structure.

## What This Layer Proves

- Element bounds within a scoped subtree
- Layout ordering and stacking via paint order
- Whitelisted computed styles that affect structure
- Cross-iframe and shadow-inclusive layout data exposed by Chromium CDP

## What This Layer Does Not Prove

- Pixel-perfect antialiasing
- Bitmap rendering differences
- Canvas/WebGL output
- Browser-specific paint artifacts that only appear in screenshots

## Required Stack

- Stagehand v3 for intent execution
- Playwright for assertions and CDP session creation
- Chromium browser target
- `DOMSnapshot.captureSnapshot` for structural data

## Recommended Pipeline

1. Use Stagehand to navigate and execute the user intent.
2. Pick the smallest locator that represents the layout contract.
3. Add a temporary attribute to that root element.
4. Open a CDP session with `page.context().newCDPSession(page)`.
5. Call `DOMSnapshot.captureSnapshot` with:
   - `computedStyles`: explicit allow-list only
   - `includePaintOrder: true`
   - `includeDOMRects: true`
6. Find the tagged node in the returned DOM snapshot.
7. Filter layout rows to that node and its descendants.
8. Normalize numeric bounds before asserting.
9. Store the scoped result as a JSON snapshot.

## Stable Style Allow-List

Start small and expand only when the regression demands it.

- `display`
- `position`
- `width`
- `height`
- `margin-*`
- `padding-*`
- `gap`
- `row-gap`
- `column-gap`
- `flex-direction`
- `justify-content`
- `align-items`
- `grid-template-columns`
- `grid-template-rows`
- `font-size`
- `font-weight`
- `line-height`
- `text-align`
- `color`
- `background-color`
- `opacity`
- `z-index`

## Normalization Rules

- Round bounds to a stable precision before snapshotting.
- Keep only attributes that help identify nodes (`id`, `class`, `data-testid`, scoped snapshot marker).
- Prefer subtree-relative evidence over whole-page coordinates whenever possible.
- Review every newly added style key for churn risk before updating fixtures.

## Anti-Patterns

- Asserting the full document when one region proves the bug.
- Capturing all computed styles.
- Replacing every screenshot with layout tree data even when pixels are the contract.
- Using Stagehand `page.snapshot()` as a stand-in for CSS layout evidence.
