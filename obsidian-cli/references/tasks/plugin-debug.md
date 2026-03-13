# Plugin Debug

## When to use

Use this playbook for plugin reloads, error inspection, console checks, screenshots, or theme/plugin development loops.

## Inputs

- Plugin ID or theme target
- Symptoms such as reload failures, runtime errors, or visual regressions
- Whether screenshots or DOM inspection are needed

## Steps

1. Reload the plugin first with `obsidian plugin:reload id=<plugin-id>`.
2. Check runtime errors with `obsidian dev:errors`.
3. Capture evidence with `obsidian dev:screenshot path=<path>` or `obsidian dev:dom selector="<selector>" text`.
4. Keep the debug loop small and repeatable.

## Safety gates

- Do not skip error inspection after reload.
- Do not claim a fix without checking the relevant Obsidian developer command.

## Outputs

- A short debug loop with exact commands such as `plugin:reload`, `dev:errors`, `dev:screenshot`, or `dev:dom`

## Verification

- Note which command confirms the bug is resolved or still present
