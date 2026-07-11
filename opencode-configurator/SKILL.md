---
name: opencode-configurator
description: |
  Configure OpenCode projects, models, MCP servers, agents, permissions, and precedence-aware settings.
  Use for a concrete OpenCode configuration task. Do not use for cross-host skill portfolio governance;
  route that to skill-portfolio-maintainer.
metadata:
  framework_role: utility
  execution_mode: inline
---

# OpenCode Configurator

Inspect all applicable config layers before editing and preserve unrelated providers, credentials, plugins, and personal model choices.

## Routes

- [Project config setup](references/tasks/project-config-setup.md)
- [Model and permission tuning](references/tasks/model-and-permission-tuning.md)
- [MCP wiring](references/tasks/mcp-wiring.md)
- [Agent mode setup](references/tasks/agent-mode-setup.md)
- [Project versus global scope](references/decisions/project-vs-global-scope.md)
- [Config precedence](references/decisions/config-precedence.md)

OpenCode 1.17 discovers native skills progressively. Use `--pure` for isolated benchmarks. Merge regular config files instead of replacing them with repository symlinks, then inspect resolved config to verify precedence.
