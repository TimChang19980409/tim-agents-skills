# Global Agent Entry

This is the shared global instruction entrypoint for Codex, OpenCode, and other AGENTS-based surfaces.

Read these shared docs before substantial code or refactor work:

- `~/.agents/skills/_shared/global/docs/coding-principles.md`
- `~/.agents/skills/_shared/global/docs/task-execution.md`
- `~/.agents/skills/_shared/global/docs/testing-and-verification.md`
- `~/.agents/skills/_shared/global/docs/repo-discovery.md`
- `~/.agents/skills/_shared/global/docs/skill-routing.md`

For tiny read-only tasks or one-command tasks, load only what is needed.

Do not put repo-specific guidance in this global file; repo-specific rules belong in each repository's local `AGENTS.md`.

<!-- codebase-memory-mcp:start -->
# Codebase Knowledge Graph (codebase-memory-mcp)

This project uses codebase-memory-mcp to maintain a knowledge graph of the codebase.
ALWAYS prefer MCP graph tools over grep/glob/file-search for code discovery.

## Priority Order
1. `search_graph` — find functions, classes, routes, variables by pattern
2. `trace_path` — trace who calls a function or what it calls
3. `get_code_snippet` — read specific function/class source code
4. `query_graph` — run Cypher queries for complex patterns
5. `get_architecture` — high-level project summary

## When to fall back to grep/glob
- Searching for string literals, error messages, config values
- Searching non-code files (Dockerfiles, shell scripts, configs)
- When MCP tools return insufficient results

## Examples
- Find a handler: `search_graph(name_pattern=".*OrderHandler.*")`
- Who calls it: `trace_path(function_name="OrderHandler", direction="inbound")`
- Read source: `get_code_snippet(qualified_name="pkg/orders.OrderHandler")`
<!-- codebase-memory-mcp:end -->
