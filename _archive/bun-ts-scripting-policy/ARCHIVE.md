# Bun + TypeScript Scripting Policy (Archived Extension)

- Host owner: `skill-portfolio-maintainer`
- Load when: an explicit legacy Node-to-Bun migration or portfolio scripting-policy audit needs the old detailed checklist.

Shared coding principles now carry the normal Bun/TypeScript defaults. This extension is not part of automatic skill discovery.

Use this skill as the scripting policy router. Pick one concrete script playbook or one decision guide before applying policy rules.

## Intent Router

- `new-bun-script`: [references/tasks/new-bun-script.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/tasks/new-bun-script.md)
- `node-to-bun-migration`: [references/tasks/node-to-bun-migration.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/tasks/node-to-bun-migration.md)
- `cli-automation-review`: [references/tasks/cli-automation-review.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/tasks/cli-automation-review.md)
- `parser-or-codegen-script`: [references/tasks/parser-or-codegen-script.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/tasks/parser-or-codegen-script.md)
- `when-not-to-use-bun`: [references/decisions/when-not-to-use-bun.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/decisions/when-not-to-use-bun.md)
- `script-output-contract`: [references/decisions/script-output-contract.md](/Users/ss105213025/.agents/skills/bun-ts-scripting-policy/references/decisions/script-output-contract.md)

## Core Workflow

1. Route the request to one concrete script playbook or one decision guide.
2. Apply Bun + TypeScript policy consistently across entrypoints and commands.
3. Prefer deterministic CLI contracts over ad hoc shell behavior.
4. End with validation commands and compatibility caveats.

## Response Guardrails

- Do not introduce new Python or JS script entrypoints by default.
- Keep output contracts and exit codes explicit.
- If the user explicitly asks you to start with `Selected:`, the first line must be plain text `Selected: <exact router id>` with no bold or markdown formatting.
- Do not wrap the `Selected:` line in backticks, and do not put explanatory prose before it.
- For prompt-only design or policy asks, answer with a concrete Bun + TypeScript plan even if no repo files are present; do not stop to ask for a missing source file unless the prompt explicitly depends on one.
