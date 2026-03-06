# OpenCode Config Cheatsheet

Verified against official docs on 2026-02-13:
- https://opencode.ai/docs/config/
- https://opencode.ai/docs/permissions/
- https://opencode.ai/docs/agents/
- https://opencode.ai/docs/modes/
- https://opencode.ai/docs/mcp-servers/
- https://opencode.ai/docs/models/

## Core Paths And Precedence

OpenCode config precedence (later overrides earlier):
1. Remote config (`.well-known/opencode`)
2. `~/.config/opencode/opencode.json`
3. `OPENCODE_CONFIG` file
4. Project `opencode.json`
5. `.opencode/` directories
6. `OPENCODE_CONFIG_CONTENT`

Common directories:
- Global: `~/.config/opencode/`
- Project: `.opencode/`
- Directory names are plural: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, `themes/`.

## Minimal Base Config

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5"
}
```

Model ID format: `provider/model`.

## Permission Patterns

Actions:
- `"allow"`: run directly
- `"ask"`: require approval
- `"deny"`: block

Granular example:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "rm *": "deny"
    },
    "edit": {
      "*": "deny",
      "docs/*.md": "allow"
    }
  }
}
```

Notes:
- Last matching rule wins.
- `external_directory` and `doom_loop` default to `"ask"`.
- Reads are generally allowed, but `.env` patterns are denied by default.

## Agent And Mode Patterns

JSON agent override:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "Review code without modifying files",
      "mode": "subagent",
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    }
  }
}
```

Markdown agent location:
- `~/.config/opencode/agents/*.md`
- `.opencode/agents/*.md`

Mode example:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mode": {
    "plan": {
      "model": "anthropic/claude-haiku-4-5",
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    }
  }
}
```

## MCP Server Patterns

Local MCP:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp": {
      "type": "local",
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true
    }
  }
}
```

Remote MCP:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

Auth and diagnostics:
- `opencode mcp auth <server-name>`
- `opencode mcp debug <server-name>`

Tool gating:
- Disable globally with `tools` key.
- Re-enable per agent in `agent.<name>.tools`.

## Variables

Environment variable interpolation:

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

File interpolation:

```json
{
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

## Quick Validation

1. `opencode models`
2. Re-open changed config file and verify expected override layer.
3. If MCP changed, run `opencode mcp debug <server-name>`.
