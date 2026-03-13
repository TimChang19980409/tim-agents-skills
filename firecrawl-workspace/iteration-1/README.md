# Firecrawl Workspace

This workspace stores compact OpenCode benchmark artifacts for `firecrawl`.

Run:

```bash
bun /Users/ss105213025/.agents/skills/skill-creator/scripts/run_opencode_skill_evals.ts \
  --skill-root /Users/ss105213025/.agents/skills/firecrawl \
  --workspace /Users/ss105213025/.agents/skills/firecrawl-workspace/iteration-1 \
  --model minimax-coding-plan/MiniMax-M2.5
```

Then grade:

```bash
bun /Users/ss105213025/.agents/skills/skill-creator/scripts/grade_opencode_skill_evals.ts \
  --skill-root /Users/ss105213025/.agents/skills/firecrawl \
  --workspace /Users/ss105213025/.agents/skills/firecrawl-workspace/iteration-1
```

Committed artifacts:

- `opencode.json`
- `benchmark.json`
- `benchmark.md`
- this README
