# Agent-Skill Framework

This repository keeps `Core + Archive` as the storage and governance layer, then adds a framework layer that makes active skills more task-oriented and decision-oriented.

## Layers

- `core`: top-level active entrypoints with `SKILL.md`
- `archive` / `merge`: extension packs with `ARCHIVE.md`, owned by a host
- `retire`: historical entries with `RETIRED.md`
- `host`: a thin router skill that classifies user intent, loads playbooks and decision guides, and delegates narrowly
- `specialist`: a bounded skill with a distinct trigger surface
- `policy`: a repo-wide rule pack that should stay small and predictable
- `utility`: operational or meta skills used when a user explicitly asks for them
- `gate`: a process-flow skill that must run before implementation for its scoped trigger surface; uses HARD-GATE semantics and terminal handoff via delegates_to

## Execution Modes

- `inline`: run inside the current turn
- `manual`: load only when the host or user explicitly asks
- `forked`: reserved for isolated contexts such as long research or high-side-effect workflows

## File Conventions

- `SKILL.md`: thin router for a core skill
- `AGENTS.md` / `CLAUDE.md`: thin entrypoints that route to shared or repo-specific docs
- `_shared/global/docs/*.md`: reusable cross-repo guidance kept out of the thin entrypoints
- `references/tasks/*.md`: task playbooks with this fixed shape:
  - `When to use`
  - `Inputs`
  - `Steps`
  - `Safety gates`
  - `Outputs`
  - `Verification`
- `references/decisions/*.md`: decision guides with this fixed shape:
  - `Decision`
  - `Signals/constraints`
  - `Options`
  - `Recommendation rule`
  - `Tradeoffs`
  - `Verification`
- `evals/evals.json`: compact benchmark manifest for deterministic OpenCode evaluation
- `_benchmarks/<skill>-workspace/iteration-N/`: pinned OpenCode benchmark artifacts; commit summaries only
- `_shared/projections/projection-spec.json`: checked-in projection snapshot for Claude, Codex, and OpenCode

## Host Rules

- Keep host `SKILL.md` files under 500 lines.
- Put detailed workflows in playbooks or decision guides instead of the host router.
- Load archive extensions only when the host needs deeper niche guidance.
- Prefer delegation to an active specialist when the task clearly matches another core skill.

## Gate Rules

- Gate skills must declare `task_playbooks` + `decision_guides` + `eval_suite` (same burden as host, enforced by validator).
- Gate trigger surface must be narrowed (not universal; e.g., "from-scratch feature" not "any creative work").
- Gate terminal handoff uses `delegates_to` (no new field; reuse existing mechanism).
- Gate precedence: gate evaluates first on from-scratch signals; if gate does not fire, normal host routing applies.

## Gate vs Policy

Gate skills are stateful multi-phase flows with approval checkpoints. Policy skills are stateless rule assertions. They serve different purposes and should not be confused.

## Extension Rules

- Every archive or merged skill must declare:
  - `Host owner`
  - `Load when`
- Extensions stay out of default discovery and are only brought in by their host or by explicit user request.

## Validation And Benchmarks

- `skills.json` is the machine-readable source of truth.
- `bun scripts/validate-skills.ts` enforces schema, file existence, extension ownership, router-size limits, and projection path safety.
- `bun scripts/validate-agent-context.ts` checks thin entrypoints, shared docs, OpenCode instructions, and the projection snapshot.
- Portfolio trigger sweeps run through OpenCode with `minimax-coding-plan/MiniMax-M2.5`.
- Outcome evals compare `with_skill` and `without_skill` runs while committing only compact benchmark outputs.

## Wave Benchmarks

- `_benchmarks/benchmark-groups/wave-1.json`, `wave-2.json`, and `wave-3.json` define the migration-wave rosters.
- Each task-focused eval should start with a `Selected:` expectation, then add at least two task-specific content markers.
- Routing and delegation evals should make the `Selected:` expectation exact and add `notContains:` checks when a neighboring skill is a likely false positive.
- `skill-creator/scripts/run_wave_opencode_skill_evals.ts` runs per-skill outcome evals, optional trigger regressions, aggregation, and compact-artifact cleanup for a wave.
- `_benchmarks/wave-benchmarks/wave-{n}.json` and `_benchmarks/wave-benchmarks/wave-{n}.md` are the retained wave summaries.
- Per-skill workspaces retain only `README.md`, `opencode.json`, `benchmark.json`, and `benchmark.md`; raw transcripts, staged projects, and stderr logs are temporary.
