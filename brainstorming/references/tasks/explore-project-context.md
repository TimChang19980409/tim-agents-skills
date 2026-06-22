# Explore Project Context

## When to use

Use this playbook when starting a brainstorming session for a from-scratch feature, new module, or new subsystem and you need to understand the project's current state before proposing designs.

## Inputs

- The feature or component being brainstormed
- The target codebase directory
- Existing documentation, architecture docs, or README files
- Recent commit history or PR descriptions

## Steps

1. Read the project's README, architecture docs, and any design documents to understand the overall structure and patterns.
2. Inspect the relevant code directory to identify existing files, modules, and their relationships.
3. Check recent git commits or PR descriptions for context on recent changes or related work.
4. Identify the technical stack, conventions, and patterns already in use (routing, state, testing, etc.).
5. Assess the scope of the requested feature—determine if it's self-contained or touches multiple subsystems.
6. If the scope is too large, decompose it into smaller, manageable chunks before brainstorming each piece.

## Safety gates

- Do not brainstorm solutions before understanding the existing patterns and constraints.
- Do not ignore the existing tech stack or conventions just because they're unfamiliar.
- Do not skip scope assessment—large, undefined brainstorms often produce unimplementable ideas.

## Outputs

- A concise summary of the project context (tech stack, patterns, conventions)
- Scope assessment (single file, module, or cross-subsystem)
- Decomposed chunks if the original request was too large

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Jumping straight to solution design without reading the existing code or docs
- [ ] Mistake 2: Ignoring the project's established patterns and proposing a different framework or library
- [ ] Mistake 3: Treating a large, multi-subsystem feature as a single brainstormable unit without decomposition

### Negative Examples
**Don't propose a complete redesign of the authentication system** — start by understanding the existing auth implementation, its constraints, and why it was chosen before suggesting changes.

## Verification

- Confirm you've read at least one README or architecture doc before proposing designs
- Use phrases like "based on the existing patterns" or "following the project's conventions" in your output
- If the feature is large, explicitly state the decomposition before brainstorming