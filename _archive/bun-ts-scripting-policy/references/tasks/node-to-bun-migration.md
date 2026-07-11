# Node To Bun Migration

## When to use

Use when migrating an existing Node/JS script to Bun + TypeScript.

## Inputs

- Current script entrypoint
- Behavior that must be preserved
- Compatibility concerns

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `SKILL.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for node to bun migration.
4. If the source file is missing, still provide a concrete `.mjs` to `.ts` migration plan that preserves command behavior, entrypoint shape, and docs updates.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not change script behavior silently during migration.
- Do not keep mixed .js/.mjs entrypoints without an explicit reason.

## Outputs

- A focused recommendation or implementation plan for node to bun migration

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Migrating entrypoints to Bun without updating the shebang line or package.json bin field
- [ ] Mistake 2: Keeping .mjs and .ts versions side-by-side without a clear deprecation path
- [ ] Mistake 3: Preserving Node-specific globals (process, Buffer) without noting Bun compatibility differences

### Negative Examples
**Don't silently drop Node.js polyfills when migrating to Bun** — some Node built-ins behave differently or are not available; test the migration with the same inputs the Node version handled before declaring parity.

## Verification

- State the side-by-side command checks that confirm parity.
