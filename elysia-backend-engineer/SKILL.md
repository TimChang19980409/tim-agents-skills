---
name: elysia-backend-engineer
description: |
  ElysiaJS backend host for Bun-first TypeScript APIs. Use for Elysia routes,
  handlers, validation, OpenAPI, plugins, lifecycle, context extension, Eden clients,
  tests, WebSocket/SSE, and deployment-surface decisions.
metadata:
  framework_role: host
  execution_mode: inline
---

# Elysia Backend Engineer

Use this skill as the Elysia application host. Pick one task playbook or one decision guide before loading deeper references.

## Intent Router

- `route-handler-contract`: [references/tasks/route-handler-contract.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/tasks/route-handler-contract.md)
- `validation-openapi`: [references/tasks/validation-openapi.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/tasks/validation-openapi.md)
- `plugin-lifecycle-context`: [references/tasks/plugin-lifecycle-context.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/tasks/plugin-lifecycle-context.md)
- `eden-testing-client`: [references/tasks/eden-testing-client.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/tasks/eden-testing-client.md)
- `runtime-deployment-surface`: [references/decisions/runtime-deployment-surface.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/decisions/runtime-deployment-surface.md)
- `when-to-delegate-drizzle`: [references/decisions/when-to-delegate-drizzle.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/decisions/when-to-delegate-drizzle.md)
- `version-lane`: [references/decisions/version-lane.md](/Users/ss105213025/.agents/skills/elysia-backend-engineer/references/decisions/version-lane.md)

## Delegation

- Delegate Drizzle schema, query, migration, and database connection work to `drizzle-persistence-engineer`.
- Keep generic Bun CLI/script work in `bun-ts-scripting-policy`.
- Keep frontend component/UI work in `frontend-dev-guidelines`.

## Core Workflow

1. Inspect the existing Elysia entrypoint, package manager, runtime target, and test style before changing code.
2. Choose one router id, then keep the change inside the existing module shape.
3. Preserve Elysia type inference: use method chaining, inline handler wrappers, and explicit `.use()` dependencies.
4. Register lifecycle hooks before affected routes and choose scope deliberately.
5. Verify with `bun test`, `app.handle(new Request("http://localhost/..."))`, Eden Treaty tests, or the repo's existing checks.

## Response Guardrails

- Use `status()` over `set.status` when return type narrowing matters.
- Do not split Eden, OpenAPI, or deployment into new skills unless the user asks for that broader portfolio change.
- If the user asks to start with `Selected:`, the first line must be `Selected: <exact router id>` with no prose before it.
- Do not invent a project scaffold when the task is an edit to an existing Elysia app.
