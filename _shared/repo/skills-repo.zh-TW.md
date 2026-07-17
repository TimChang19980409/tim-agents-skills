# Skills Repository 規則

[English](skills-repo.md) | 繁體中文

此 repository 是共用 agent skills 與跨工具 instruction projections 的 canonical source。

## 目錄結構

- 頂層 `*/SKILL.md` 目錄是有效的 core skills，必須是實體目錄，不得使用 symlink。
- `_shared/` 儲存跨工具進入點、可重用文件、OpenCode 專用設定與 projection snapshots。
- `_benchmarks/` 儲存 benchmark groups、各 skill workspaces、portfolio trigger 輸出與 wave summaries。
- `_archive/` 與 `_retired/` 將非有效 skills 與歷史 artifacts 排除在有效觸發範圍外。

## 工作規則

- 根目錄 `AGENTS.md` 與 `CLAUDE.md` 應保持精簡；長期內容應放入 `_shared/repo/skills-repo.md` 或 `_shared/global/docs/*.md`。
- 不要把 benchmark 生成的 `AGENTS.md` 當成 runtime-global 規則。
- 若變更 `skills.json`、repository 目錄結構或 projection files，必須在同一次變更中更新 validators 與納入版本控制的 snapshots。
- Projection layer 可以使用 symlinks，但 canonical core skills 必須維持實體目錄。

## 驗證

結構異動後執行：

- `bun scripts/validate-skills.ts`
- `bun scripts/validate-agent-context.ts`

此 repository 的結構檢查不應依賴即時 Claude／Codex／OpenCode runs。
