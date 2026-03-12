---
name: bun-ts-scripting-policy
description: Default scripting policy for script and CLI automation work. Use when the request involves creating, modifying, migrating, reviewing, or running scripts, codegen, parsers, or command helpers. Prefer Bun + TypeScript as the default stack and update related docs and commands to Bun/TS conventions unless the user or repo constraints explicitly require something else.
---

# Bun TS Scripting Policy

## Overview

Standardize all scripting work to Bun + TypeScript. Prevent mixed script stacks and ensure script entrypoints, invocation commands, and skill documentation stay consistent.

## Default Rules

1. Use Bun + TypeScript for script work by default.
2. Create scripts as `*.ts` only.
3. Use Bun-compatible execution:
- Direct: `bun path/to/script.ts ...`
- Within package scripts: `bun scripts/name.ts ...`
4. For executable files, use shebang `#!/usr/bin/env bun`.
5. Do not introduce Python, `.js`, or `.mjs` script entrypoints unless the user explicitly overrides this policy or the existing repo contract leaves no safe alternative.
6. Keep script behavior deterministic and machine-readable where possible.

## Trigger Coverage

Apply this skill when requests mention or imply:
- script / 腳本 / automation / 自動化
- CLI utility, command helper, batch tool
- migration script, codemod, generator, parser, converter
- scheduled job helper script
- converting existing scripts across languages/runtimes

## Workflow

1. Inventory script surfaces.
- Find existing script entrypoints and invocation sites (`scripts/`, `package.json`, docs, skill references, CI snippets).

2. Implement/convert scripts in TypeScript.
- Move logic to `*.ts`.
- Preserve core behavior and CLI contract unless intentionally changed.

3. Update invocation commands.
- Replace Python/Node `.mjs`/`.js` script commands with Bun + `.ts`.
- Update examples in docs and skill files.

4. Remove legacy script entrypoints.
- Delete superseded `.py`, `.mjs`, or `.js` files when replacement is complete.

5. Validate.
- Run `bun --version`.
- Run each new script with `--help` or minimal valid args.
- Run representative real invocation for critical scripts.

## Implementation Standards

1. CLI and exit codes
- Exit `0`: success
- Exit `1`: validation/expected business failure
- Exit `2`: usage/argument/runtime error

2. Argument handling
- Support explicit flags (`--input`, `--output`, `--format`).
- Fail fast with clear usage text when required args are missing.

3. I/O and logging
- Use UTF-8 text.
- Prefer JSON output for structured reports.
- Write actionable error messages to stderr.

4. File safety
- Avoid destructive behavior by default.
- Require explicit flags for destructive operations.

## Output Requirements

When delivering script-related changes, always include:
1. Changed script entrypoints (old -> new).
2. New Bun invocation commands.
3. Validation commands executed.
4. Any intentionally changed behavior.

## Exception Rule

Only bypass this policy if the user explicitly asks for another runtime/language. If overridden, state the override clearly before implementation.
