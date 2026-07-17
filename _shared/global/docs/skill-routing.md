# Skill Routing

English | [繁體中文](skill-routing.zh-TW.md)

- Treat `~/.agents/skills` as the canonical skill root.
- Route to a skill when the user names it or the request clearly matches its description.
- Open that skill's `SKILL.md` first, then follow its playbooks and references with progressive disclosure.
- Prefer active `core` skills; do not treat `_archive`, `_retired`, or benchmark-generated `AGENTS.md` files as runtime-global rules.
- If a host has native skill support, use the host-native surface and keep the same skill identity and routing intent.
- When a core skill delegates to another skill, load the delegate only when the primary skill asks for it.
- For small or read-only tasks, load only the minimum routing and task docs needed to stay accurate.
- Keep routing thin: shared docs define the global behavior, while skill-specific instructions stay in each skill's `SKILL.md`.
