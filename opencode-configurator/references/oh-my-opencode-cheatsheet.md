# oh-my-opencode Config Cheatsheet

Verified against official docs on 2026-02-13:
- https://github.com/code-yeongyu/oh-my-opencode/blob/dev/docs/configurations.md
- Raw source: https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/dev/docs/configurations.md

## Quick Start

Interactive setup:

```bash
bunx oh-my-opencode install
```

Recommended schema:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```

## File Locations

Priority:
1. `.opencode/oh-my-opencode.json` (project)
2. `~/.config/opencode/oh-my-opencode.json` (user)

JSONC behavior:
- `oh-my-opencode.jsonc` is supported.
- If both `.jsonc` and `.json` exist in same location, `.jsonc` takes precedence.

## Common Overrides

Agent and category tuning:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "oracle": { "model": "openai/gpt-5.2" },
    "explore": { "model": "opencode/gpt-5-nano" }
  },
  "categories": {
    "quick": { "model": "anthropic/claude-haiku-4-5" },
    "visual-engineering": { "model": "google/gemini-3-pro" }
  }
}
```

Permissions per agent:

```json
{
  "agents": {
    "explore": {
      "permission": {
        "edit": "deny",
        "bash": "ask",
        "webfetch": "allow"
      }
    }
  }
}
```

Disable built-in agents/skills:

```json
{
  "disabled_agents": ["oracle"],
  "disabled_skills": ["playwright"]
}
```

## Skills Configuration

Load extra skill sources and enable/disable specific skills:

```json
{
  "skills": {
    "sources": [
      { "path": "./custom-skills", "recursive": true },
      "https://raw.githubusercontent.com/user/repo/main/skills/*"
    ],
    "enable": ["my-skill"],
    "disable": ["legacy-skill"]
  }
}
```

## MCP And LSP In oh-my-opencode

Built-in MCPs can be disabled:

```json
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

Extra LSP servers:

```json
{
  "lsp": {
    "typescript-language-server": {
      "command": ["typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx"],
      "priority": 10
    }
  }
}
```

## Browser Automation

Provider switch:

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```

`agent-browser` setup:

```bash
bun add -g agent-browser
agent-browser install
```

## Tmux Integration

Enable:

```json
{
  "tmux": {
    "enabled": true,
    "layout": "main-vertical",
    "main_pane_size": 60
  }
}
```

Requirements:
- Must run inside tmux.
- OpenCode must run in server mode (for example `opencode --port 4096`).

## Critical Pitfall: Ollama Streaming

When using Ollama providers with oh-my-opencode agents, set `stream: false`:

```json
{
  "agents": {
    "explore": {
      "model": "ollama/qwen3-coder",
      "stream": false
    }
  }
}
```

Without this, NDJSON streaming can trigger parsing failures (for example `Unexpected EOF`).

## Model Resolution Reminder

oh-my-opencode resolves model by:
1. Explicit user override in `oh-my-opencode.json/jsonc`
2. Category/agent fallback chain
3. System default model from OpenCode config

Run diagnostic:

```bash
bunx oh-my-opencode doctor --verbose
```
