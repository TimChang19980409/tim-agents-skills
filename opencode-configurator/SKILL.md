---
name: opencode-configurator
description: Configure, audit, migrate, and troubleshoot OpenCode and oh-my-opencode settings, including opencode.json, .opencode directories, and oh-my-opencode.json/jsonc. Use when requests mention opencode or oh-my-opencode setup/configuration (including Chinese terms like 配置/設定), model/provider selection, modes, agents, permissions, MCP servers, categories, skill loading, browser automation, or tmux integration.
---

# OpenCode Configurator

## Overview

Apply safe, minimal, and verifiable configuration changes for OpenCode and oh-my-opencode, while respecting config precedence and avoiding conflicting overrides.

Read:
- `references/opencode-config-cheatsheet.md`
- `references/oh-my-opencode-cheatsheet.md`

If behavior may have changed, re-check official docs with Firecrawl before editing.

## Workflow

1. Determine target scope.
- OpenCode core only: `opencode.json`, `.opencode/{agents,modes,commands,plugins,skills}`.
- oh-my-opencode harness: `oh-my-opencode.json/jsonc` plus OpenCode base config.
- If unclear, inspect current workspace and home config files first.

2. Locate active config files in precedence order.
- OpenCode precedence: remote defaults -> `~/.config/opencode/opencode.json` -> `OPENCODE_CONFIG` -> project `opencode.json` -> `.opencode/` directories -> `OPENCODE_CONFIG_CONTENT`.
- oh-my-opencode precedence: project `.opencode/oh-my-opencode.json` first, then user config.
- For oh-my-opencode, if both `.jsonc` and `.json` exist at same level, `.jsonc` wins.

3. Inspect current state before changing.
- Read existing config and identify overrides already in place.
- Keep edits minimal; do not rewrite unrelated sections.

4. Apply focused changes based on requested outcome.
- Model/provider: use `provider/model` IDs.
- Permissions: prefer explicit `ask`/`deny` on risky actions.
- MCP: configure `mcp` entries and enable/disable tool exposure deliberately.
- Modes/agents: add only required fields (`description`, `mode`, `model`, `tools`, `permission`, `prompt` as needed).
- oh-my-opencode categories/agents: override only what user needs; avoid broad resets.

5. Validate and sanity-check.
- Use `opencode models` to verify model IDs.
- For OAuth MCP, use `opencode mcp auth <name>` when needed.
- If oh-my-opencode is installed, run `bunx oh-my-opencode doctor --verbose`.
- Re-open changed files and confirm final precedence behavior is what the user asked for.

6. Report exact results.
- List changed files and keys.
- Call out any expected runtime action (auth/login/restart/reattach).

## Guardrails

- Keep OpenCode core settings in `opencode.json`; keep harness-specific orchestration in `oh-my-opencode.json/jsonc`.
- Avoid duplicating the same setting across multiple layers unless override is intentional.
- For oh-my-opencode with Ollama, set `stream: false` on affected agents to avoid NDJSON parsing issues.
- Prefer project-level config for repo-specific behavior and global config for user defaults.

## Common Requests Mapping

- "Set safer permissions": edit `permission` with granular rules and `external_directory` handling.
- "Tune coding roles": configure `agent` and/or `mode` definitions.
- "Add docs/search tools": configure `mcp` servers and tool exposure.
- "Use oh-my-opencode defaults but tweak cost/perf": adjust `agents` and `categories` overrides.
- "Enable browser automation": configure `browser_automation_engine` in oh-my-opencode.
- "Multi-agent tmux workflow": configure `tmux` and confirm server-mode requirement.
