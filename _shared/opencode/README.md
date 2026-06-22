# OpenCode Shared Config

This file is the repo-owned shared config for OpenCode projections.

It intentionally mirrors the user's current home config fields such as `model`, `plugin`, `command`, and `provider`, then adds shared `instructions` that point at canonical repo docs.

When deploying to `~/.config/opencode/opencode.json`, preserve any existing user settings and merge new `instructions` rather than replacing the whole file.
