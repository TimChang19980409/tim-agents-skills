# JasperReports Engineer Eval Workspace

This workspace is dedicated to OpenCode runs for `jasperreports-engineer`.
It intentionally pins `minimax-coding-plan/MiniMax-M2.5` in [opencode.json](/Users/ss105213025/.agents/skills/jasperreports-engineer-workspace/iteration-1/opencode.json) so evals do not inherit a `gpt-5.4` category or agent fallback from global `oh-my-opencode` settings.

## Run Eval Preparation Only

```bash
bun /Users/ss105213025/.agents/skills/jasperreports-engineer/scripts/run_opencode_evals.ts \
  --workspace /Users/ss105213025/.agents/skills/jasperreports-engineer-workspace/iteration-1 \
  --prepare-only
```

## Run All Evals With OpenCode + MiniMax

```bash
bun /Users/ss105213025/.agents/skills/jasperreports-engineer/scripts/run_opencode_evals.ts \
  --workspace /Users/ss105213025/.agents/skills/jasperreports-engineer-workspace/iteration-1
```

## Run A Single Eval Or Single Configuration

```bash
bun /Users/ss105213025/.agents/skills/jasperreports-engineer/scripts/run_opencode_evals.ts \
  --workspace /Users/ss105213025/.agents/skills/jasperreports-engineer-workspace/iteration-1 \
  --eval 1 \
  --run-set with_skill
```

## Grade Outputs

```bash
bun /Users/ss105213025/.agents/skills/jasperreports-engineer/scripts/grade_opencode_evals.ts \
  --workspace /Users/ss105213025/.agents/skills/jasperreports-engineer-workspace/iteration-1
```

## Output Layout

- `eval-*/with_skill/project/`: staged fixture repo plus local `.opencode/skills/jasperreports-engineer`
- `eval-*/without_skill/project/`: staged fixture repo without the skill
- `eval-*/<config>/context/`: input tree, file summary, JRXML inventory
- `eval-*/<config>/outputs/final.md`: extracted OpenCode answer
- `eval-*/<config>/run.json`: model, timing, token, and command metadata
- `benchmark.md` and `benchmark.json`: grader summary
