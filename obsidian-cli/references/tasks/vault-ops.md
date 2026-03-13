# Vault Ops

## When to use

Use this playbook for reading, creating, appending, searching, linking, or navigating notes in a running vault.

## Inputs

- Vault name if multiple vaults are open
- Target note name or path
- Desired operation and content

## Steps

1. Use explicit `vault=`, `file=`, or `path=` targeting when ambiguity exists.
2. Prefer exact `obsidian` CLI commands over freeform prose.
3. Use `silent` when changes should not open the file.
4. Escalate to `obsidian-markdown` only if syntax design is the main problem.

## Safety gates

- Avoid path ambiguity across multiple similarly named notes.
- Do not recommend manual app clicks when a CLI command exists.

## Outputs

- Exact commands or a vault-grounded operation plan

## Verification

- Confirm the command targets the intended vault and note
