# When to Brainstorm

## Decision

Should the brainstorming skill be triggered for this request, or should it be handled by a direct implementation specialist?

## Signals/constraints

**Positive signals (should brainstorm):**
- Request is for a from-scratch feature, new module, or new subsystem
- User phrases like "design", "plan", "brainstorm", "explore options"
- The request involves architectural choices or multiple subsystem integration
- No existing code that directly matches the request

**Negative signals (should NOT brainstorm):**
- Request is for a bug fix, typo, or small config change
- Request is for a refactor of existing code (not new design)
- Request matches a known host skill's trigger surface (e.g., "build a React component" → frontend-dev-guidelines)
- User provides a specific, concrete implementation approach

## Options

1. **Trigger brainstorming**: Use when the request is for new design work with significant architectural choices.
2. **Route to specialist**: Use when the request matches a specific skill's trigger surface (React, Spring, Obsidian, etc.).
3. **Handle directly**: Use for simple fixes, small changes, or when the solution is obvious.

## Recommendation rule

- **Trigger brainstorming** if: from-scratch feature/new module/new subsystem AND does NOT match a host skill's trigger
- **Route to specialist** if: request matches a host skill's trigger (e.g., "build a React component" → frontend-dev-guidelines)
- **Handle directly** if: bug fix, refactor, config tweak, typo, or single-file change

## Tradeoffs

- **Triggering brainstorming on small tasks**: Adds overhead without value. The brainstorming gate is meant for design-heavy work, not quick fixes.
- **Routing to host skill when brainstorming is needed**: The host skill might dive into implementation without proper design exploration, leading to rework.
- **Not triggering brainstorming on large tasks**: Skipping design exploration can result in poorly architected solutions that don't fit the project's patterns.

## Verification

- For from-scratch features: confirm the request is NOT a direct match for a host skill's trigger
- For bug fixes or refactors: confirm the brainstorming skill was NOT triggered
- For requests matching host skills: confirm the host skill was selected, not brainstorming