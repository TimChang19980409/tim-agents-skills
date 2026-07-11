# Artifact Retention

## Decision

Choose which benchmark artifacts should be committed and which should be deleted after grading.

## Signals/constraints

- Need for reproducibility
- Artifact size and noise
- Whether summaries are enough

## Options

- Keep only benchmark summaries and pinned config
- Temporarily keep bulky eval dirs during debugging only
- Delete staged trees, raw transcripts, and stderr by default

## Recommendation rule

Commit only compact benchmark artifacts unless a debugging need explicitly overrides it.

## Tradeoffs

- Keeping everything helps debugging but bloats the repo.
- Compact artifacts are cleaner but lose deep run traces.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: artifact-retention`
- State which files are kept and which are cleaned.
- Name the default kept set as `benchmark.json`, `benchmark.md`, `opencode.json`, and workspace `README.md`.
- Name the default cleaned set as raw transcripts, `stderr`, staged project trees, `results.json`, and `eval-*` directories.
