# Property And Task Management

## When to use

Use this playbook for note properties, task lists, daily notes, backlinks, tags, and vault metadata operations.

## Inputs

- Target note or query
- Desired property or task mutation
- Whether the task spans one note or a broader vault query

## Steps

1. Use property and task commands directly when possible.
2. Keep note targeting explicit.
3. Escalate to `obsidian-bases` if the real task is designing a `.base` view.
4. Escalate to `obsidian-markdown` if syntax correctness is the main challenge.

## Safety gates

- Do not hand-edit YAML mentally when `property:set` or related commands solve it.
- Avoid mixing operational commands with schema design when one surface should lead.

## Outputs

- Exact commands or a minimal operation plan

## Verification

- Say how the property or task change should be confirmed
