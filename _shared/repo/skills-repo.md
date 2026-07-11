# Skills Repository Rules

This repository is the canonical source for shared agent skills and cross-tool instruction projections.

## Layout

- Top-level `*/SKILL.md` directories are the active core skills and must remain real directories, not symlinks.
- `_shared/` stores cross-tool entrypoints, reusable docs, OpenCode-specific config, and projection snapshots.
- `_benchmarks/` stores benchmark groups, per-skill workspaces, portfolio trigger outputs, and wave summaries.
- `_archive/` and `_retired/` keep non-active skills and historical artifacts out of the active trigger surface.

## Working Rules

- Keep root `AGENTS.md` and `CLAUDE.md` thin; put durable detail in `_shared/repo/skills-repo.md` or `_shared/global/docs/*.md`.
- Do not treat benchmark-generated `AGENTS.md` files as runtime-global rules.
- If you change `skills.json`, repository layout, or projection files, update the validators and checked-in snapshots in the same change.
- The projection layer may use symlinks, but canonical core skills must stay as real directories.

## Validation

After structural changes, run:

- `bun scripts/validate-skills.ts`
- `bun scripts/validate-agent-context.ts`

Do not rely on live Claude/Codex/OpenCode runs for this repository's structural checks.
