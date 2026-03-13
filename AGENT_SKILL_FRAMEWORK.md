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

## Execution Modes

- `inline`: run inside the current turn
- `manual`: load only when the host or user explicitly asks
- `forked`: reserved for isolated contexts such as long research or high-side-effect workflows

## File Conventions

- `SKILL.md`: thin router for a core skill
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
- `*-workspace/iteration-N/`: pinned OpenCode benchmark artifacts; commit summaries only

## Host Rules

- Keep host `SKILL.md` files under 500 lines.
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
- `bun scripts/validate-skills.ts` enforces schema, file existence, extension ownership, and router-size limits.
- Portfolio trigger sweeps run through OpenCode with `minimax-coding-plan/MiniMax-M2.5`.
- Outcome evals compare `with_skill` and `without_skill` runs while committing only compact benchmark outputs.
