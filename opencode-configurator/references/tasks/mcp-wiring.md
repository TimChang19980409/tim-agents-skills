# Mcp Wiring

## When to use

Use when adding, auditing, or troubleshooting MCP server configuration.

## Inputs

- MCP server name or type
- Auth needs
- Project vs global scope

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/oh-my-opencode-cheatsheet.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for mcp wiring.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not expose more MCP tools than the task needs.
- Do not duplicate MCP config across user and project levels unintentionally.

## Outputs

- A focused recommendation or implementation plan for mcp wiring

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Exposing more MCP tools than the task requires — increases attack surface and confusion
- [ ] Mistake 2: Duplicating MCP server configuration across user-level and project-level configs unintentionally
- [ ] Mistake 3: Assuming the MCP server is reachable without checking the auth handshake

### Negative Examples
**Don't leave MCP tool exposure wide open when only one or two tools are needed** — narrow scope reduces the blast radius of a compromised tool and makes permission reviews tractable; prefer explicit allowlists over broad access.

## Verification

- List the auth or connectivity checks that confirm the MCP server is usable.
