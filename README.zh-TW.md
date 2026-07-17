# Tim Agent Skills

[English](README.md) | 繁體中文

本 repository 採用 `Core + Archive` portfolio 模型，並在其上提供共用的跨工具層。

- `core`：具有有效 `SKILL.md` 進入點的頂層技能
- `merge`：觸發範圍已合併至 core host，但仍保留內容的技能
- `archive`：保留但不參與自動探索的專門技能
- `retire`：已停止使用，只保留作為歷史或遷移參考

機器可讀的唯一真實來源是 [skills.json](skills.json)。結構異動後，請執行完整的[驗證程序](#驗證)。

Framework 層加入以下概念：

- `role`：`host`、`specialist`、`policy`、`utility` 或 `extension`
- `execution_mode`：`inline`、`manual` 或 `forked`
- task playbooks：`references/tasks/*.md`
- decision guides：`references/decisions/*.md`
- archive extensions：由 host 擁有、必須明確載入的封存套件

Framework 契約請參閱 [AGENT_SKILL_FRAMEWORK.md](AGENT_SKILL_FRAMEWORK.md)。

## Portfolio 目錄結構

- 頂層 `*/SKILL.md`：僅包含有效的 core roster
- `AGENTS.md` / `CLAUDE.md`：此 skills repository 的精簡 repo-local 進入點
- `_shared/global/`：跨 repository 的全域進入點與共用文件
- `_shared/repo/`：此 skills repository 專用的規範
- `_shared/opencode/`：OpenCode 專用設定與 subagents
- `_shared/projections/`：供外部 symlink 目標使用、納入版本控制的 projection snapshot
- `_benchmarks/`：benchmark groups、保留的 workspaces、portfolio trigger 輸出與 wave summaries
- `_archive/<skill>/ARCHIVE.md`：保留的非 core skills，包含 merged sources
- `_retired/<skill>/RETIRED.md`：已退役的 skills 與備份 artifacts
- `skills.json`：schema v5 portfolio 狀態、角色、儲存位置、trigger suites、freshness 與官方來源 metadata
- `references/tasks/*.md`：由 host 擁有、以任務為導向的 playbooks
- `references/decisions/*.md`：由 host 擁有、以決策為導向的 guides
- `GLOBAL_SKILL_AUDIT_2026-03-11.md`：歷史 audit memo
- `GLOBAL_SKILL_AUDIT_MATRIX_2026-03-11.tsv`：歷史評分 matrix
- `JAVA_SPRING_PERSISTENCE_AUDIT_DELTA_2026-03-13.md`：新增 persistence host 分工的差異說明

## 有效的 Core Skills

| Skill | 領域 | 用途 |
| --- | --- | --- |
| `firecrawl` | Research / Web | Firecrawl v2 的 bulk scrape、crawl、map 與 schema-driven extraction host；一般即時資訊查詢應使用 host 原生 Web 能力 |
| `frontend-dev-guidelines` | Frontend / React / UI | 前端實作、效能檢視與 UI／無障礙檢查的主要 host |
| `elysia-backend-engineer` | TypeScript / Bun / Backend | ElysiaJS routes、validation、plugins、Eden clients、tests 與 runtime 決策 |
| `drizzle-persistence-engineer` | TypeScript / Bun / Backend | Drizzle ORM schema、query、migration 與 Elysia TypeBox bridge specialist |
| `react-component-designer` | Frontend / React / UI | 可重用 component API 設計 specialist |
| `java-pro` | Java / Spring / Backend | Java platform、concurrency、JVM 與 profiling specialist |
| `jasperreports-engineer` | Java / Spring / Backend | JasperReports Library 與 Jaspersoft Studio 實作 specialist |
| `spring-persistence-engineer` | Java / Spring / Backend | Spring Data JPA、Hibernate 6/7 與 RDBMS portability specialist |
| `spring-boot-engineer` | Java / Spring / Backend | Spring Boot application 實作 specialist |
| `backend-ddd-architect-spring` | Java / Spring / Backend | DDD 與 bounded-context architecture specialist |
| `stagehand-aria-e2e` | Testing / Browser Automation | Stagehand v3 ARIA、keyboard、focus 與 layout browser-testing specialist |
| `obsidian-cli` | Obsidian / Knowledge | Obsidian vault 操作與 plugin debugging host |
| `pdf-reader` | Obsidian / Knowledge | PDF／OCR ingestion 與 extraction |
| `skill-portfolio-maintainer` | Workflow / Meta / General | Portfolio governance、migration、eval、freshness 與 projection 維護 |
| `opencode-configurator` | Workflow / Meta / General | OpenCode 與 oh-my-opencode 設定 specialist |
| `teaching-content-designer` | Education / Teaching / Content | 課程大綱、講稿、文件、互動與概念進程的教學內容設計 host |

## 已合併與封存的 Skills

### 已合併至 `frontend-dev-guidelines`

- `react-best-practices`
- `vercel-react-best-practices`
- `web-design-guidelines`

### 已封存的 Specialists

- `context7-auto-research`
- `find-skills`
- `ui-ux-pro-max`
- `react-storybook-vite-workflow`
- `ladle-component-workflow`
- `tailwind-best-practices`
- `solidjs-patterns`
- `pebble-official-best-practices`
- `e2e-tests-studio`
- `obsidian-markdown`
- `obsidian-bases`
- `json-canvas`
- `book-translation`
- `coding-teacher`
- `monorepo-management`
- `rdbms-data-modeling`
- `typescript-advanced-types`
- `developer-growth-analysis`
- `brainstorming`
- `bun-ts-scripting-policy`
- `ppt-generation`（包含其舊版 `image-generation` helper）

### 已退役

- `defuddle`
- `pdf-reader.__preinit_backup`

## 執行環境需求

閱讀 skill 文件不需要安裝任何軟體。若要執行完整 portfolio，建議準備：

- `bun`
- `node` / `npm`
- `python3`

有效 skills 的個別需求：

- `firecrawl`：`npm install -g firecrawl-cli`，以及 Firecrawl 驗證資訊
- `pdf-reader`：在 [pdf-reader](pdf-reader) 執行 `bun install`；OCR 可選擇安裝 `poppler`、`tesseract` 等工具
- `stagehand-aria-e2e`：在 [stagehand-aria-e2e](stagehand-aria-e2e) 執行 `bun install`，並依需求提供模型／瀏覽器 credentials
- `obsidian-cli`：已安裝 Obsidian app 與 `obsidian` CLI，且需要操作時 Obsidian 必須保持執行
- `jasperreports-engineer` 與 `spring-persistence-engineer`：helper scripts 使用 `bun`，eval runs 使用 `opencode`
- [scripts/validate-skills.ts](scripts/validate-skills.ts)：Bun runtime

## 驗證

執行完整的 repository 驗證程序：

```bash
bun scripts/validate-skills.ts
bun scripts/validate-agent-context.ts
bun scripts/validate-trigger-suite.ts
bun scripts/render-agent-projections.ts --check
bun scripts/sync-agent-projections.ts --check
```

Portfolio validator 會檢查：

- 頂層有效 `SKILL.md` 必須恰好為 16 個；數量取自 `framework.expected_core_skills`
- `skills.json` 一致性
- `skills.json` schema v5、projections、roles、execution modes、trigger suites、freshness 與官方來源
- 有效 skill 不得以 symlink 儲存
- core `SKILL.md` 不得超過 router 大小限制
- core host skills 必須宣告 task playbooks、decision guides 與 eval coverage
- archive extensions 必須同時在 `skills.json` 與 `ARCHIVE.md` 宣告 host ownership
- `_archive/` 或 `_retired/` 內不得出現 `SKILL.md`
- `merge -> core host` 關係必須有效
- benchmark-group roster coverage、wave summaries 與 projection symlinks 不得損壞

Agent-context validator 會檢查：

- 根目錄與全域 `AGENTS.md`、`CLAUDE.md` 必須維持精簡
- 共用的全域文件與 OpenCode instruction paths
- `_shared/projections/` 內納入版本控制的 projection snapshot
- 全域進入點必須維持跨 repository 通用，不得混入此 repository 專用規範

Trigger-suite validator 會檢查 64 個 positive、24 個 boundary 與 12 個 null cases，以及每個 core skill 的具體 outcome evals。Projection checks 會確認納入版本控制的 snapshot 是最新狀態，runtime projections 也沒有 broken links、archive shadows 或未受管理的重複項目。

## 維護規則

1. 除非 skill 已明確核准加入 core roster，否則不要新增頂層 `SKILL.md`。
2. 每個 portfolio 項目都必須加入 [skills.json](skills.json)。
3. 封存的 skills 必須使用 `ARCHIVE.md`；退役的 skills 必須使用 `RETIRED.md`。
4. 優先保留 repository 內的實體內容，不要將 skills 儲存成 symlink。
5. 如果異動會改變觸發邊界，必須同時更新相關 skill 檔案與 audit metadata。
6. 只有 `role=host` 的 skills 可以擁有廣泛的觸發範圍；深入或狹窄的指引應放在 playbooks、decision guides 或 archive extensions。
7. 僅提交精簡的 benchmark summaries，不要提交原始 OpenCode transcripts 或 staged project copies。
8. 根目錄與全域進入點檔案應保持精簡；長期指引應放入 `_shared/global/docs/` 或 `_shared/repo/`。
9. Portfolio 異動後執行 `bun scripts/sync-agent-projections.ts --check`。只有在需要 backup-first、由 repository 管理的 home reconciliation 時才使用 `--apply`；OpenCode config 採 merge，不建立 link。

## Benchmark 目標

目前的實測基準使用 `opencode/deepseek-v4-flash-free` 測試全部 100 個自然提示詞。2026-07 最終測試的 macro first-skill accuracy 為 90.6%，boundary accuracy 為 85.4%；但 `frontend-dev-guidelines` 仍低於每個 skill 的 recall 門檻，並且有兩次 infrastructure failures，因此 portfolio 尚未完全通過驗收。詳細資訊請參閱[目前的 benchmark 摘要](_benchmarks/skill-portfolio-workspace/opencode-deepseek-v4-flash-free/benchmark.md)與 [2026-07 audit](docs/audits/2026-07-skill-portfolio-audit.md)。

Nemotron 3 Ultra 與 North Mini 保留作為歷史免費模型比較結果，不是目前的 acceptance baseline。Runner 會在 `--pure` 隔離環境中觀察 OpenCode 原生的 `skill` tool events。

```bash
bun skill-portfolio-maintainer/scripts/run_portfolio_opencode_trigger_eval.ts --suite full --model opencode/deepseek-v4-flash-free
bun skill-portfolio-maintainer/scripts/run_portfolio_opencode_trigger_eval.ts --suite boundary --model opencode/north-mini-code-free
bun test scripts/lib/opencode-skill-events.test.ts
```

Runner 使用未修改的使用者問題、暫存的 HOME／config／project、既有的 `XDG_DATA_HOME` 進行驗證，且不保留 transcripts 或 staged skill trees。
