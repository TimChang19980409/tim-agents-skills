# Cursor User Rules

- Treat `~/.agents/skills` as the canonical skill root.
- When a user names a skill or the request matches a skill description, open that skill's `SKILL.md` first.
- Prefer active `core` skills and use progressive disclosure instead of loading everything at once.
- Do not treat `_archive`, `_retired`, or benchmark-generated `AGENTS.md` files as global instructions.
- For repositories that have a local `AGENTS.md`, read it as project guidance in addition to these global rules.
- Use these shared docs as the baseline:
  - `~/.agents/skills/_shared/global/docs/coding-principles.md`
  - `~/.agents/skills/_shared/global/docs/task-execution.md`
  - `~/.agents/skills/_shared/global/docs/testing-and-verification.md`
  - `~/.agents/skills/_shared/global/docs/repo-discovery.md`
  - `~/.agents/skills/_shared/global/docs/skill-routing.md`
- Keep global routing thin; leave skill-specific detail in each skill's `SKILL.md`.
- Use the repository's shared docs for code, task execution, testing, and repo discovery before making broad changes.

When pasting into Cursor User Rules, keep this text as the global baseline and let repo-local `AGENTS.md` files refine it.
