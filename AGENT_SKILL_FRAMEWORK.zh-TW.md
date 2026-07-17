# Agent-Skill Framework

[English](AGENT_SKILL_FRAMEWORK.md) | 繁體中文

此 repository 以 `Core + Archive` 作為儲存與治理層，再加上一層 framework，讓有效 skills 更聚焦於任務與決策。

## 分層

- `core`：具有 `SKILL.md` 的頂層有效進入點
- `archive` / `merge`：由 host 擁有、使用 `ARCHIVE.md` 的 extension packs
- `retire`：使用 `RETIRED.md` 的歷史項目
- `host`：精簡的 router skill，負責分類使用者意圖、載入 playbooks 與 decision guides，並進行窄範圍 delegation
- `specialist`：具有明確觸發範圍的專門 skill
- `utility`：使用者明確要求時才使用的操作型或 meta skills

## 執行模式

- `inline`：在目前 turn 中執行
- `manual`：只有 host 或使用者明確要求時才載入
- `forked`：保留給需要隔離 context 的工作，例如長時間研究或高副作用 workflow

## 檔案慣例

- `SKILL.md`：core skill 的 thin router
- `AGENTS.md` / `CLAUDE.md`：導向共用或 repo-specific 文件的精簡進入點
- `_shared/global/docs/*.md`：不放入精簡進入點、可跨 repository 重用的指引
- `references/tasks/*.md`：10–30 行的 task playbooks，只保留非顯而易見的限制、failure modes、輸出與驗證方式
- `references/decisions/*.md`：針對模型容易混淆的邊界所設計的精簡 decision guides
- `evals/evals.json`：供 deterministic OpenCode evaluation 使用的精簡 benchmark manifest
- `_benchmarks/<skill>-workspace/iteration-N/`：固定版本的 OpenCode benchmark artifacts；只提交 summaries
- `_shared/projections/projection-spec.json`：納入版本控制、供 Claude、Codex 與 OpenCode 使用的 projection snapshot

## Host 規則

- Router 預設維持約 20–60 行；只有具備文件記錄的 domain 需求才能超出此範圍。
- 詳細 workflow 應放入 playbooks 或 decision guides，不要放在 host router。
- 只有 host 需要更深入的 niche guidance 時才載入 archive extensions。
- 任務明確符合另一個 core skill 時，優先 delegate 給有效的 specialist。

## Extension 規則

- 每個 archive 或 merged skill 都必須宣告：
  - `Host owner`
  - `Load when`
- Extensions 不參與預設 discovery，只能由其 host 或使用者明確要求載入。

## 驗證與 Benchmarks

- `skills.json` 是機器可讀的唯一真實來源。
- `bun scripts/validate-skills.ts` 會強制檢查 schema、檔案存在性、extension ownership、router 大小限制與 projection path 安全性。
- `bun scripts/validate-agent-context.ts` 會檢查精簡進入點、共用文件、OpenCode instructions 與 projection snapshot。
- `bun scripts/sync-agent-projections.ts --check` 會偵測 repository 管理的 shadows、內容分歧副本、損壞的 compatibility links 與缺少的 OpenCode instructions；`--apply` 會先建立含 timestamp 的備份，再進行調整。
- Portfolio trigger sweeps 會在隔離的 OpenCode 環境中執行自然提示詞，並檢查第一個原生 `skill` tool event。
- Outcome evals 會比較 `with_skill` 與 `without_skill` runs，但只提交精簡 benchmark 輸出。

## Wave Benchmarks

- `_benchmarks/benchmark-groups/wave-1.json`、`wave-2.json` 與 `wave-3.json` 定義 migration-wave rosters。
- Task-focused evals 驗證 decisions、version lanes、artifacts、commands 與 safety boundaries，不驗證答案格式 token。
- `skill-portfolio-maintainer/scripts/run_wave_opencode_skill_evals.ts` 保留歷史 outcome-eval 支援。
- `_benchmarks/wave-benchmarks/wave-{n}.json` 與 `_benchmarks/wave-benchmarks/wave-{n}.md` 是保留的 wave summaries。
- 每個 skill workspace 只保留 `README.md`、`opencode.json`、`benchmark.json` 與 `benchmark.md`；原始 transcripts、staged projects 與 stderr logs 都是暫存資料。
