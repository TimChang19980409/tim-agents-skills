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
