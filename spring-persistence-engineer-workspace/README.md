# Spring Persistence Engineer Eval Summary

This workspace keeps compact benchmark artifacts for the new persistence skill while intentionally deleting bulky
per-run transcripts, copied projects, and intermediate outputs after benchmarking.

## Iteration 1

- Scope: full 12-eval suite with with-skill vs baseline
- Result: with-skill average pass rate `0.6597` vs baseline `0.6319`
- Wins: `4 / 12`
- Main gaps found:
  - answers often named official documents without pasting literal URLs
  - repo grounding often said "I read the files" without naming local artifacts

## Iteration 2

- Scope: targeted rerun for the weakest areas after tightening the response contract
- Result: with-skill average pass rate `0.7292` vs baseline `0.8542` across the comparable targeted set
- Main changes tested:
  - exact `## Context` / `## Sources` structure
  - literal official URLs
  - stricter guidance against vague or GitHub-only citations

## Iteration 3

- Scope: targeted rerun with staged local skills exposed through `AGENTS.md`
- Result: with-skill average pass rate `1.0000` vs baseline `0.9000` across the comparable targeted set
- Wins: `2 / 5`
- Main changes validated:
  - with-skill answers consistently grounded Boot 3.5 and Boot 4.0 lane questions in local files plus official URLs
  - archive-ledger portability answers stayed repo-grounded while comparing all requested vendors

## Post-Iteration Optimizations

- Tightened the response contract again so the final answer must start at literal `## Context` with no narration before it
- Added a no-guess rule for missing build metadata: say the lane is unknown instead of inventing a Boot line
- Reduced eval workspace bloat by staging only `SKILL.md`, `references/`, and `scripts/` into `.opencode/skills`, excluding `evals/` and other bulky folders
- Verified the slimmer staging path with a `--prepare-only` smoke check before cleanup

## Retained Artifacts

- `iteration-1/opencode.json`
- `iteration-1/benchmark.md`
- `iteration-1/benchmark.json`
- `iteration-2/opencode.json`
- `iteration-2/benchmark.md`
- `iteration-2/benchmark.json`
- `iteration-3/opencode.json`
- `iteration-3/benchmark.md`
- `iteration-3/benchmark.json`
