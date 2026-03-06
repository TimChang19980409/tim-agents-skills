# Tim Agent Skills

這個 repo 就是我自己在用的 skills 集合。

大部分 skill 本質上是：

- 一份 `SKILL.md`
- 一些 `references/` 參考資料
- 少量 `scripts/` / `assets/` / `agents/`

所以先講結論：

- **大多數 skill 不需要安裝任何套件就能看懂或直接拿來用**
- **只有少數 skill 真的需要本地 runtime / CLI / API key**
- **如果你懶得一個一個分，最省事的 baseline 就是先裝 `Bun + Node + Python3`**

## 我建議的最小環境

如果你只是要 clone 下來研究 skill：

- 不用先裝任何東西

如果你想真的把多數 skill 跑起來，我建議至少有：

- `bun`
- `node` / `npm`
- `python3`

Mac 的話大概可以先這樣：

```bash
brew install bun node python3
```

## 這個 repo 目前真的會用到的額外安裝

### 1. Repo 內有 `package.json` 的 skill

這兩個需要進子目錄裝依賴：

```bash
cd pdf-reader
bun install

cd ../stagehand-aria-e2e
bun install
```

### 2. 需要額外 CLI 的 skill

#### Firecrawl

```bash
npm install -g firecrawl-cli
firecrawl login --browser
```

用途：所有上網查資料、抓頁面、search/scrape/crawl。

#### Defuddle

```bash
npm install -g defuddle
```

用途：把網頁轉乾淨 markdown，省 token。

#### Obsidian CLI

- 需要已安裝 Obsidian
- 需要 `obsidian` CLI
- 而且 **Obsidian 要開著**

用途：操作 vault、做插件除錯、抓 DOM / screenshot。

### 3. 需要額外系統工具的 skill

#### PDF Reader OCR

如果 PDF 是掃描檔，會需要 OCR 工具：

```bash
brew install poppler tesseract tesseract-lang
```

### 4. 需要 API key / 登入的 skill

#### Context7 Auto Research

- 可用 public rate limit
- 但有自己的 `CONTEXT7_API_KEY` 會比較穩

#### Stagehand ARIA E2E

通常至少要有：

- 一個模型 API key
- 如果用 Browserbase 模式，還要 `BROWSERBASE_API_KEY` / `BROWSERBASE_PROJECT_ID`

#### Firecrawl

- 需要登入或 API key

## 建議的使用方式

如果你是第一次看這個 repo，我建議這樣：

1. 先從 `SKILL.md` 看這顆 skill 在幹嘛
2. 再看它有沒有 `references/`
3. 如果它有 `scripts/`，再決定要不要裝依賴
4. 真的要跑 runtime skill，再看這顆 skill 自己的 Quick Start

## Skill 索引

下面是比較口語版的整理：我把每顆 skill 的**設計理念**和**我覺得適合補上的內容**一起寫上去。

### Backend / Architecture

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `backend-ddd-architect-spring` | 把業務語言直接轉成 DDD 架構輸出，重點是 bounded context、aggregate、context map。 | 補更多真實案例、aggregate anti-pattern、產生 package 結構的樣板。 |
| `java-pro` | 當 Java 21+ 現代語法與平台知識的高階參考。 | 補更多實戰型 checklist，例如 virtual threads / structured concurrency / profiling。 |
| `spring-boot-engineer` | 偏 implementation 導向的 Spring Boot 專家 skill。 | 補和 `java-pro` 的邊界說明，避免兩顆 skill 重疊太多。 |
| `pebble-official-best-practices` | 專門處理 Java Pebble template engine，不跟其他 Pebble 專案搞混。 | 補 Spring Boot 整合範例、escaping / caching 的 before-after 範例。 |
| `monorepo-management` | 把 Turborepo / Nx / pnpm workspace 的做法系統化。 | 補 decision tree：什麼時候用 Turbo、什麼時候用 Nx。 |

### Frontend / UI / DX

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `frontend-dev-guidelines` | 給 React + TS 專案一套偏嚴格的實作規範。 | 補一份「新 feature 從 0 到 1」完整樣板。 |
| `react-best-practices` | 偏 React 效能最佳化規則庫。 | 補和 `vercel-react-best-practices` 的分工說明。 |
| `react-component-designer` | 專門解 component API 設計，不直接跳進實作細節。 | **目前它是 symlink**，建議直接 vendor 成 repo 內實體資料夾。 |
| `react-storybook-vite-workflow` | 處理 Storybook + Vite 整合與 story 規範。 | 補 migration checklist：舊 Storybook 升級到 Vite 版的常見坑。 |
| `ladle-component-workflow` | 用 Ladle 取代或補充 Storybook 的 component workflow。 | 補和 Storybook 的選型比較表。 |
| `tailwind-best-practices` | 針對 Playground UI 的 Tailwind 使用規範。 | 補 token drift 的壞例子與修正例子。 |
| `vercel-react-best-practices` | 收斂 Vercel 系的 React / Next.js performance 指南。 | 補「適合在 App Router 用」與「只適合一般 React」的區分。 |
| `web-design-guidelines` | 做 UI / UX / accessibility 稽核用。 | 補輸出格式範例，像是 no findings / findings 的標準樣板。 |
| `ui-ux-pro-max` | 像一個大型 UI/UX 資料庫，偏靈感與組合式設計參考。 | 補更明確的查詢入口，現在資料很多但入口略散。 |
| `solidjs-patterns` | 專門處理 SolidJS signal / state coupling 問題。 | 補更多「從 React 心智轉到 SolidJS」的對照說明。 |

### Testing / Browser Automation

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `e2e-tests-studio` | UI 改動時要測「產品行為」，不是只測 render。 | 補一份最小 Playwright E2E 模板。 |
| `stagehand-aria-e2e` | 用 Stagehand v3 做流程操作，再用 ARIA snapshot / layout tree snapshot 做驗證。 | 補更多真實 fixture、layout snapshot 的 diff 範例。 |

### Research / Teaching / Meta Skills

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `bun-ts-scripting-policy` | 把所有 script 類工作統一到 Bun + TypeScript。 | 補 repo 級 lint / validator，檢查是不是偷混進 `.js` / `.mjs`。 |
| `coding-teacher` | 教學模式 skill，強制 read-only，不直接改學生 repo。 | 補更多課程模板，例如 frontend track / backend track / data track。 |
| `context7-auto-research` | 有 library / framework 問題時，自動抓最新官方文件。 | 目前 helper script 還是 Node，未來可以考慮改成 Bun/TS。 |
| `defuddle` | 網頁讀取先去雜訊，降低 token 消耗。 | 補和 Firecrawl 的分工表，什麼情況用誰。 |
| `developer-growth-analysis` | 分析近期開發行為，找成長方向。 | 補本地輸出模式，不一定每次都丟 Slack。 |
| `find-skills` | 當使用者在問「有沒有 skill 可做某事」時，當技能導覽。 | 補和 skill-installer 類工具的整合方式。 |
| `firecrawl` | 所有 web/search/scrape 類工作統一走 Firecrawl CLI。 | 補 credits / rate limit 的實務指引。 |
| `skill-creator` | 建 skill、跑 eval、做 benchmark、改 description 的 meta-skill。 | 目前有不少 Python tooling，建議補一份最小 happy path。 |

### Knowledge / Docs / Personal Knowledge Management

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `book-translation` | 把 book content 和 UI strings 一起翻，不只翻正文。 | 補 glossary / style guide，避免不同章語氣漂移。 |
| `json-canvas` | 專門處理 `.canvas`，不是一般圖表描述。 | 補更多 node / edge pattern 範例。 |
| `obsidian-bases` | 做 `.base` 視圖、filter、formula。 | 補更多查詢模式範例，像 project tracker / reading list。 |
| `obsidian-cli` | 直接用 CLI 操作 Obsidian vault 或做 plugin/theme debug。 | 補常用命令 cheatsheet。 |
| `obsidian-markdown` | 專注 Obsidian flavored markdown，不重新教一般 markdown。 | 補更多 embed / properties 的 edge case。 |
| `pdf-reader` | 用 Bun 讀 PDF，必要時加 OCR fallback。 | 補更多 scanned PDF、表格 PDF 的測試樣本。 |

### Tooling / Config / Workflow

| Skill | 設計理念 | 我覺得適合補上 |
| --- | --- | --- |
| `opencode-configurator` | 處理 opencode / oh-my-opencode 設定、遷移、除錯。 | 補不同 config precedence 的圖解。 |

## 目前我覺得最值得補的 repo 級內容

如果是我接下來會優先補的，我會做這幾件事：

1. **做一份 machine-readable manifest**
   - 例如 `skills.json`
   - 讓每顆 skill 的名稱、用途、依賴、runtime 一眼可查

2. **加一個 repo 驗證腳本**
   - 檢查每顆 skill 有沒有 `SKILL.md`
   - 檢查 broken symlink
   - 檢查引用的 `references/` / `scripts/` 是否存在
   - 檢查不該 commit 的東西有沒有混進來

3. **把 runtime skill 標準化**
   - 現在有 Bun、Node、Python 混用
   - 我自己偏好逐步往 `Bun + TypeScript` 收斂

4. **把 `react-component-designer` 從 symlink 改成實體內容**
   - 現在 repo 內看到的是 symlink
   - 對別人 clone repo 不夠穩

5. **整理 repo 內不應該長期保留的資料夾**
   - `pdf-reader.__preinit_backup/` 看起來像備份，不像正式 skill
   - `dist/` 要不要保留要看是不是發佈產物

6. **幫每顆 skill 補 2-3 個 sample prompts**
   - 比 README 更實用
   - 熟人拿到 repo 後會更快上手

## 額外提醒

- 這個 repo 比較像「活的工作集」，不是對外發佈版套件。
- 有些 skill 很成熟，有些還是偏 evolving。
- 如果你只是要用 skill，本質上先看 `SKILL.md` 就好。
- 如果你打算分享給更多人，優先整理的是：
  - symlink
  - backup 目錄
  - runtime 依賴說明
  - sample prompts

## 我自己會怎麼推薦新來的人開始看

如果你是第一次拿到這份 repo，我會建議先看這幾顆：

- `bun-ts-scripting-policy`
- `context7-auto-research`
- `firecrawl`
- `frontend-dev-guidelines`
- `stagehand-aria-e2e`
- `obsidian-cli`
- `skill-creator`

這幾顆最能看出整份 repo 的風格：不是只給知識，而是要把工作流直接變成可重複執行的 skill。
