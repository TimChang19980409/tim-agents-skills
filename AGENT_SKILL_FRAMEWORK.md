# Agent-Skill Framework

English | [繁體中文](AGENT_SKILL_FRAMEWORK.zh-TW.md)

This repository keeps `Core + Archive` as the storage and governance layer, then adds a framework layer that makes active skills more task-oriented and decision-oriented.

## Layers

- `core`: top-level active entrypoints with `SKILL.md`
- `archive` / `merge`: extension packs with `ARCHIVE.md`, owned by a host
- `retire`: historical entries with `RETIRED.md`
- `host`: a thin router skill that classifies user intent, loads playbooks and decision guides, and delegates narrowly
- `specialist`: a bounded skill with a distinct trigger surface
- `utility`: operational or meta skills used when a user explicitly asks for them

## Execution Modes

- `inline`: run inside the current turn
- `manual`: load only when the host or user explicitly asks
- `forked`: reserved for isolated contexts such as long research or high-side-effect workflows

## File Conventions

- `SKILL.md`: thin router for a core skill
- `AGENTS.md` / `CLAUDE.md`: thin entrypoints that route to shared or repo-specific docs
- `_shared/global/docs/*.md`: reusable cross-repo guidance kept out of the thin entrypoints
- `references/tasks/*.md`: 10–30 line task playbooks containing only non-obvious constraints, failure modes, outputs, and verification
- `references/decisions/*.md`: compact decision guides for boundaries that the model is likely to confuse
- `evals/evals.json`: compact benchmark manifest for deterministic OpenCode evaluation
- `_benchmarks/<skill>-workspace/iteration-N/`: pinned OpenCode benchmark artifacts; commit summaries only
- `_shared/projections/projection-spec.json`: checked-in projection snapshot for Claude, Codex, and OpenCode

## Host Rules

- Keep routers around 20–60 lines by default; exceed that only for a documented domain need.
- Put detailed workflows in playbooks or decision guides instead of the host router.
- Load archive extensions only when the host needs deeper niche guidance.
- Prefer delegation to an active specialist when the task clearly matches another core skill.

## Extension Rules

- Every archive or merged skill must declare:
  - `Host owner`
  - `Load when`
- Extensions stay out of default discovery and are only brought in by their host or by explicit user request.

## Validation And Benchmarks

- `skills.json` is the machine-readable source of truth.
- `bun scripts/validate-skills.ts` enforces schema, file existence, extension ownership, router-size limits, and projection path safety.
- `bun scripts/validate-agent-context.ts` checks thin entrypoints, shared docs, OpenCode instructions, and the projection snapshot.
- `bun scripts/sync-agent-projections.ts --check` detects repo-owned shadows, divergent copies, broken compatibility links, and missing OpenCode instructions; `--apply` creates a timestamped backup before reconciling them.
- Portfolio trigger sweeps run natural prompts through isolated OpenCode and inspect the first native `skill` tool event.
- Outcome evals compare `with_skill` and `without_skill` runs while committing only compact benchmark outputs.

## Wave Benchmarks

- `_benchmarks/benchmark-groups/wave-1.json`, `wave-2.json`, and `wave-3.json` define the migration-wave rosters.
- Task-focused evals assert decisions, version lanes, artifacts, commands, and safety boundaries rather than answer-format tokens.
- `skill-portfolio-maintainer/scripts/run_wave_opencode_skill_evals.ts` retains historical outcome-eval support.
- `_benchmarks/wave-benchmarks/wave-{n}.json` and `_benchmarks/wave-benchmarks/wave-{n}.md` are the retained wave summaries.
- Per-skill workspaces retain only `README.md`, `opencode.json`, `benchmark.json`, and `benchmark.md`; raw transcripts, staged projects, and stderr logs are temporary.
