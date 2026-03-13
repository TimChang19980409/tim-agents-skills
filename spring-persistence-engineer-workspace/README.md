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

## Retained Artifacts

- `iteration-1/opencode.json`
- `iteration-1/benchmark.md`
- `iteration-1/benchmark.json`
- `iteration-2/opencode.json`
- `iteration-2/benchmark.md`
- `iteration-2/benchmark.json`
