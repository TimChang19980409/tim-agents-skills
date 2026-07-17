# Global Skill Audit

[English](GLOBAL_SKILL_AUDIT_2026-03-11.md) | 繁體中文

評分矩陣：[English TSV](GLOBAL_SKILL_AUDIT_MATRIX_2026-03-11.tsv) | [繁體中文 TSV](GLOBAL_SKILL_AUDIT_MATRIX_2026-03-11.zh-TW.tsv)

日期：2026-03-11

範圍：僅 `.agents/skills`

方法：`Core + Archive`

## 執行摘要

- 可見 inventory：`.agents/skills` 下有 `34` 個 `SKILL.md` 項目
- 正式 skills：`33`
- Noise／backup 項目：`1`
- 建議 core set：`12`
- 建議 dispositions：
  - `core`：12
  - `merge`：3
  - `archive`：17
  - `retire`：2

這個 portfolio 負擔過重，但不是因為每個 skill 都不好。主要問題是有效觸發範圍過廣。多個 skills 仍然最新且有價值，但其中太多會競爭相同的使用者意圖，尤其是 `Research / Web` 與 `Frontend / React / UI`。

建議不是強制收斂成少數 mega-prompts，而是有控制地縮減有效層：

- 保留 `12` 個高訊號 core skills
- 將專門但仍有用的 skills 移至 `archive`
- 將明顯重複的項目合併至 host families
- 退役 noise 或已被吸收的 workflows

核心原則是：

> 縮小有效範圍，不要摧毀有用知識

## 評分標準

分數使用 `1-5`。

- `U` = Domain uniqueness。越高越好。
- `C` = Trigger clarity。越高越好。
- `R` = Overlap risk。越高越差。
- `F` = Freshness / currency。越高越好。
- `O` = Operational cost。越高越差。
- `V` = Proof of value。越高越好。

Disposition 規則：

- `core`：domain 清楚、價值高、重疊低或可管理，而且內容仍是最新狀態
- `merge`：內容有價值，但觸發範圍與 host skill 過度重疊
- `archive`：有效的 niche 或專門 extension，但不應位於預設有效層
- `retire`：noise、過時備份，或已被更強的現行能力取代

## 現況摘要

### Family 分布

- `Research / Web`：4
- `Frontend / React / UI`：10
- `Java / Spring / Backend`：4
- `Testing / Browser Automation`：2
- `Obsidian / Knowledge`：6
- `Workflow / Meta / General`：7
- `Noise / Backup`：1

### 結構觀察

- 只有 `pdf-reader` 與 `stagehand-aria-e2e` 在 skill folder 內附帶本地 runtime manifests（`package.json` / `bun.lock`）。
- `react-component-designer` 是指向 `/Users/ss105213025/.codex/skills/react-component-designer` 的 symlink。
- `pdf-reader.__preinit_backup` 以 skill 形式顯示，但只包含 placeholder metadata，不應留在可見 portfolio 中。
- Repository 已處於 dirty git state；此 audit 不會修改既有 skill 內容。

## Freshness 發現

### Research / Web

- Anthropic 現行文件指出，Claude 會使用每個 subagent description 決定 delegation；現行 prompting guidance 也明確警告，舊式「MUST use this tool」文字在較新模型上容易造成 overtrigger。
- `firecrawl/SKILL.md` 仍硬編碼積極文字：
  - 「Always use firecrawl for any internet task. No exceptions.」
  - 範例 status 輸出仍顯示 CLI `v1.0.2` 與 `500,000` credits。
- Firecrawl 官方 CLI 文件現在將目前 docs set 標示為 `v2`，文件內的 CLI status 範例顯示 `v1.1.1`。
- `defuddle` 的主要價值主張是擷取乾淨 Markdown，但現在大多已被 Firecrawl 的 `--only-main-content` 與 Markdown output modes 吸收。

結論：

- `firecrawl` 作為 family host 在策略上仍然正確。
- 此 family 拆分過細，prompting 也過度積極。

### Frontend / React / UI

- React 官方 references 仍支持 `react-best-practices` 內的 `useEffectEvent` 指引。
- Storybook 官方 Vite 文件仍支持 `react-storybook-vite-workflow` 使用的 `viteFinal` parity model。
- `frontend-dev-guidelines`、`react-best-practices`、`vercel-react-best-practices`、`web-design-guidelines` 與 `ui-ux-pro-max` 都在競爭相近意圖：React implementation、performance review 與 UI review。

結論：

- 此 family 大多仍是最新內容。
- 真正問題是 trigger collision，不是技術過時。

### Java / Spring / Backend

- Spring Boot 官方 reference 當時指向 `4.0.3`，Java baseline 為 `17+`。
- `spring-boot-engineer` 明確針對 Spring Boot `3.x`；如果目標 projects 使用 Boot 3，這仍然合理，但它具有版本特定性，應維持明確標示。
- 既有 trigger-eval artifacts 顯示 `java-pro` 與 `spring-boot-engineer` 的概念邊界很強，但 `spring-boot-engineer` 在部分 Spring application 場景仍會 undertrigger。

結論：

- 此 family 應維持分離。
- 這個邊界是 portfolio 中設計最好的部分之一。

### Testing / Browser Automation

- Stagehand 官方 `v3` 文件符合 `stagehand-aria-e2e` baseline：`Stagehand`、`observe`、`act`、agent flows 與 v3 semantics 都仍是最新狀態。
- `e2e-tests-studio` 有用，但它是 repo-specific，且比一般 Stagehand skill 更窄。

結論：

- 保留一個通用 browser-testing core。
- 將 package-specific testing 規則視為 extensions。

### Obsidian / Knowledge

- JSON Canvas 官方 spec `1.0` 符合 `json-canvas` 的假設。
- Obsidian Help 的 callouts 與 Bases 頁面符合 `obsidian-markdown`、`obsidian-bases` 的內容。
- 此 family 技術上仍是最新狀態，但被切分為大量 format-specific skills。

結論：

- 此 family 內容仍然最新。
- 問題是 suite fragmentation，不是內容過時。

### Workflow / Meta / General

- Anthropic 現行文件再次確認 trigger descriptions 比以往更重要；description 應明確，但不應過度強迫觸發。
- `skill-creator` 仍符合 description 是主要 trigger surface 的概念。
- `monorepo-management` 的實作細節明顯過時：
  - `turbo.json` 仍使用 `pipeline` 範例
  - `turbo` 仍固定為 `^1.10.0`
  - `pnpm` 仍固定為 `pnpm@8.0.0`
  - 仍建議 `shamefully-hoist=true`
- 當時的 Turborepo 文件以現行 task model 為核心，Nx 文件則強調 inferred tasks、`targets` 與現代 task pipeline configuration。

結論：

- 此 family 包含部分最有價值的 meta-skills。
- 它也包含部分最嚴重的 refresh debt。

## 重疊發現

### 1. Research family 過度集中且過度積極

`firecrawl` 同時是正確的 host，也是最大的 trigger-risk 來源。其 description 是針對舊模型 undertriggering 行為所寫，但 Anthropic 現行 prompting guidance 指出，積極的工具規則會讓較新模型 overtrigger。

### 2. Frontend family 的衝突密度最高

以下 skills 都在競爭重疊意圖：

- `frontend-dev-guidelines`
- `react-best-practices`
- `vercel-react-best-practices`
- `web-design-guidelines`
- `ui-ux-pro-max`

對「review this React UI」或「improve this component」這類單一請求而言，這是過多的有效觸發範圍。

### 3. Java / Spring 分工良好，但仍未完全調整完成

Repository 中最有力的證據支持讓 `java-pro` 與 `spring-boot-engineer` 保持分離。既有 trigger-eval 結果顯示 `java-pro` 邊界非常清楚，而 `spring-boot-engineer` 仍會錯過部分 Spring-heavy app requests。這表示需要調整，而不是合併。

### 4. Obsidian family 是沒有宣告 suite model 的 suite

`obsidian-cli`、`obsidian-markdown`、`obsidian-bases` 與 `json-canvas` 各自都有合理性，但目前 portfolio 把它們全部暴露為同等的一級 triggers。這對 specialists 有用，卻會讓預設有效 roster 過於嘈雜。

### 5. Inventory 中存在可見 noise

`pdf-reader.__preinit_backup` 不是真正的 production skill。它只有 placeholder metadata，應立即從有效 inventory 退役。

## 建議 Core Set（12）

以下是建議的主要有效 skills。

| Skill | Family | 保留為 Core 的原因 |
| --- | --- | --- |
| `firecrawl` | Research / Web | 當時處理一般 web、docs 與 research operations 最強的 host |
| `frontend-dev-guidelines` | Frontend / React / UI | 現代 React frontend 工作最好的通用 implementation host |
| `react-component-designer` | Frontend / React / UI | 低重疊、高重用的獨立 API-design specialty |
| `java-pro` | Java / Spring / Backend | Platform/runtime 邊界清楚；repository 中 trigger evidence 最強 |
| `spring-boot-engineer` | Java / Spring / Backend | Application-layer Spring implementation host 邊界清楚 |
| `backend-ddd-architect-spring` | Java / Spring / Backend | 其他 Java skills 沒有涵蓋的獨特 architecture-level specialty |
| `stagehand-aria-e2e` | Testing / Browser Automation | 最新、獨立且 behavior-focused 的 browser testing host |
| `obsidian-cli` | Obsidian / Knowledge | Vault workflows 與 plugin/debug flows 最好的 operational host |
| `pdf-reader` | Obsidian / Knowledge | 獨立的 document-ingestion／OCR capability |
| `bun-ts-scripting-policy` | Workflow / Meta / General | 編碼 repository-wide implementation policy，具高 cross-task leverage |
| `skill-creator` | Workflow / Meta / General | 維護 portfolio 本身時價值最高的 meta-skill |
| `opencode-configurator` | Workflow / Meta / General | 範圍窄、內容最新且邊界清楚的 configuration specialty |

## 完整 Disposition Mapping

### Research / Web

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `firecrawl` | 4 | 2 | 5 | 4 | 2 | 5 | `core` | 保留為 family host；稍後重寫 trigger language |
| `context7-auto-research` | 3 | 3 | 4 | 4 | 2 | 4 | `archive` | 保留為 official-doc extension，不作為預設有效 skill |
| `defuddle` | 1 | 3 | 5 | 2 | 1 | 2 | `retire` | 改用 Firecrawl main-content extraction |
| `find-skills` | 3 | 4 | 2 | 3 | 1 | 3 | `archive` | 有用，但更適合作為 secondary meta utility |

### Frontend / React / UI

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `frontend-dev-guidelines` | 4 | 4 | 3 | 4 | 2 | 5 | `core` | 主要 frontend implementation host |
| `react-component-designer` | 5 | 4 | 2 | 4 | 1 | 5 | `core` | 保留為 API-design specialist |
| `react-best-practices` | 2 | 3 | 5 | 4 | 1 | 3 | `merge` | 將 performance 規則合併至 frontend host |
| `vercel-react-best-practices` | 3 | 3 | 4 | 4 | 2 | 4 | `merge` | 作為 frontend host 內的 reference pack |
| `web-design-guidelines` | 3 | 4 | 4 | 4 | 1 | 4 | `merge` | Live-review 指引應放在 frontend review flow 下 |
| `ui-ux-pro-max` | 2 | 1 | 5 | 3 | 4 | 3 | `archive` | 範圍太廣，不適合留在主要有效層 |
| `react-storybook-vite-workflow` | 4 | 4 | 2 | 4 | 1 | 4 | `archive` | 強大的 extension，但作為 core 過於狹窄 |
| `ladle-component-workflow` | 3 | 4 | 3 | 3 | 1 | 3 | `archive` | 保留為 niche component-workbench extension |
| `tailwind-best-practices` | 2 | 4 | 4 | 3 | 1 | 3 | `archive` | Repo-specific styling policy |
| `solidjs-patterns` | 4 | 4 | 1 | 3 | 1 | 3 | `archive` | 獨立，但只適用於 OpenWork／SolidJS niche |

### Java / Spring / Backend

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `java-pro` | 5 | 5 | 1 | 4 | 1 | 5 | `core` | Portfolio 中邊界最清楚的 skill |
| `spring-boot-engineer` | 5 | 4 | 2 | 4 | 2 | 5 | `core` | 與 `java-pro` 維持分離；稍後調整 |
| `backend-ddd-architect-spring` | 5 | 4 | 1 | 4 | 2 | 4 | `core` | 獨特的 architecture specialty |
| `pebble-official-best-practices` | 4 | 4 | 1 | 4 | 1 | 3 | `archive` | 合理的 niche extension，不作為 core |

### Testing / Browser Automation

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `stagehand-aria-e2e` | 4 | 4 | 2 | 5 | 3 | 4 | `core` | Behavior-driven browser validation 的 family host |
| `e2e-tests-studio` | 3 | 4 | 3 | 3 | 2 | 3 | `archive` | 有價值的 repo-specific extension |

### Obsidian / Knowledge

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `obsidian-cli` | 5 | 4 | 1 | 4 | 3 | 4 | `core` | Obsidian workflows 的 operational host |
| `pdf-reader` | 5 | 4 | 1 | 4 | 4 | 4 | `core` | 獨立 OCR／PDF ingestion utility |
| `obsidian-markdown` | 4 | 4 | 2 | 4 | 1 | 4 | `archive` | 保留為 syntax extension，不作為主要 trigger |
| `obsidian-bases` | 4 | 4 | 1 | 5 | 1 | 3 | `archive` | 保留為 Bases extension |
| `json-canvas` | 4 | 4 | 1 | 5 | 1 | 3 | `archive` | 保留為 canvas-format extension |
| `book-translation` | 3 | 4 | 1 | 3 | 1 | 2 | `archive` | Project-specific workflow，不作為 core global skill |

### Workflow / Meta / General

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `bun-ts-scripting-policy` | 4 | 4 | 2 | 4 | 1 | 5 | `core` | 強大的 repo-wide policy skill |
| `skill-creator` | 5 | 4 | 2 | 4 | 3 | 5 | `core` | 價值最高的 portfolio maintenance skill |
| `opencode-configurator` | 4 | 4 | 1 | 4 | 2 | 4 | `core` | 範圍窄且內容最新 |
| `coding-teacher` | 4 | 4 | 1 | 4 | 2 | 3 | `archive` | 有價值的 mode skill，但不屬於預設有效層 |
| `monorepo-management` | 3 | 4 | 2 | 2 | 1 | 3 | `archive` | 重新提升為 core 前必須更新 |
| `typescript-advanced-types` | 4 | 4 | 2 | 3 | 1 | 3 | `archive` | 有用的深入 reference，但作為 core 過廣 |
| `developer-growth-analysis` | 4 | 3 | 1 | 2 | 4 | 2 | `archive` | 具有外部交付 dependency 的專門 workflow |

### Noise / Backup

| Skill | U | C | R | F | O | V | Disposition | Host／備註 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `pdf-reader.__preinit_backup` | 1 | 1 | 1 | 1 | 1 | 1 | `retire` | Backup artifact；不應繼續顯示 |

## 建議目標架構

### Layer 1：Core hosts

- `firecrawl`
- `frontend-dev-guidelines`
- `react-component-designer`
- `java-pro`
- `spring-boot-engineer`
- `backend-ddd-architect-spring`
- `stagehand-aria-e2e`
- `obsidian-cli`
- `pdf-reader`
- `bun-ts-scripting-policy`
- `skill-creator`
- `opencode-configurator`

### Layer 2：Archive extensions

將以下項目作為專門 extensions，不作為主要預設 triggers。

- Research extensions：
  - `context7-auto-research`
  - `find-skills`
- Frontend extensions：
  - `ui-ux-pro-max`
  - `react-storybook-vite-workflow`
  - `ladle-component-workflow`
  - `tailwind-best-practices`
  - `solidjs-patterns`
- Java／backend extensions：
  - `pebble-official-best-practices`
- Testing extensions：
  - `e2e-tests-studio`
- Obsidian／knowledge extensions：
  - `obsidian-markdown`
  - `obsidian-bases`
  - `json-canvas`
  - `book-translation`
- Workflow／meta extensions：
  - `coding-teacher`
  - `monorepo-management`
  - `typescript-advanced-types`
  - `developer-growth-analysis`

### Layer 3：Merge candidates

以下項目長期不應維持獨立有效狀態。

- 合併至 `frontend-dev-guidelines`：
  - `react-best-practices`
  - `vercel-react-best-practices`
  - `web-design-guidelines`

### Layer 4：Retire

- `defuddle`
- `pdf-reader.__preinit_backup`

## 為什麼 12 個 Core 是合適數量

此建議在兩件事之間取得平衡：

- 足以涵蓋實際使用 domains 的廣度
- 足夠小的有效範圍，以降低 trigger collisions

Portfolio 目前的主要問題是「太多同等優先的一級 skills」，不是內容不足。`12`-skill active layer 小到足以治理，同時仍能在實際 families 中保留獨立 hosts。

## 最佳化方向

### 選項 A：最小變更／Routing Reset

變更內容：

- 保留幾乎所有既有 skill folders。
- 正式宣告 `12`-skill core set。
- 稍後只重寫高風險 descriptions。
- 將 archive skills 從主要可見 roster 隱藏。

優點：

- Migration risk 最低
- 降低 overtrigger 最快的方法
- 不需立即執行 content merge

風險：

- Archive layer 仍可能累積 drift
- 重複內容仍存在於 disk

適用情境：

- 希望快速改善訊號，又不想進行 restructuring project

### 選項 B：Family Consolidation／Suite Model

變更內容：

- 保留相同 families，但將重疊 siblings 合併為明確 host skills。
- 最明顯的目標：Frontend family。
- 次要目標：Research / Web family。

優點：

- 降低重疊 trigger logic
- 簡化維護
- 讓 family ownership 更清楚

風險：

- 需要謹慎重寫 prompts
- 過度合併可能模糊有用邊界

適用情境：

- 希望日常使用的 portfolio 更乾淨，但不想完全重新設計 platform

### 選項 C：Platform Architecture／Host + Extension Manifest

變更內容：

- 為每個 skill 新增 machine-readable manifest：
  - family
  - status
  - freshness date
  - host 與 extension 分類
  - runtime needs
  - trigger tests
- 將 skills 視為受治理的 internal platform，而不是鬆散的 folder 集合。

優點：

- 長期 maintainability 最佳
- 降低未來 audit 成本
- 防止新的 trigger sprawl

風險：

- 前期投入最高
- 需要持續遵守 portfolio governance discipline

適用情境：

- 希望此 repository 作為長期 internal skill platform，維持穩定且可擴充

## 建議的下一步

若目標是以低風險快速改善，先選擇**選項 A**，再對 Frontend 與 Research families 選擇性執行**選項 B**。

這會帶來：

- 立即降低 portfolio overload
- 對既有 skill 內容的干擾最小
- 日後深入 consolidation 的安全路徑

## 來源

Freshness 檢查使用的官方來源：

- Anthropic subagents docs：<https://code.claude.com/docs/en/sub-agents>
- Anthropic prompting best practices：<https://platform.claude.com/docs/en/prompt-library/library>
- Firecrawl CLI docs：<https://docs.firecrawl.dev/sdks/cli>
- React docs：<https://react.dev/reference/react/useEffectEvent>
- Storybook Vite docs：<https://storybook.js.org/docs/builders/vite>
- Spring Boot reference：<https://docs.spring.io/spring-boot/reference/index.html>
- Stagehand v3 docs：<https://docs.stagehand.dev/v3/first-steps/ai-rules>
- Turborepo docs：<https://turborepo.dev/docs>
- Nx docs：<https://nx.dev/docs/features/run-tasks>
- JSON Canvas spec：<https://jsoncanvas.org/spec/1.0/>
- Obsidian Help：<https://help.obsidian.md/callouts>
- Obsidian Bases docs：<https://help.obsidian.md/bases>
