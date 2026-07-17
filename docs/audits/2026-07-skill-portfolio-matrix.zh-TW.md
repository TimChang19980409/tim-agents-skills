# 2026-07 Portfolio 決策 Matrix

[English](2026-07-skill-portfolio-matrix.md) | 繁體中文

| 目前 Skill | 目標 | 保留價值 | 原生能力重疊／邊界 | Freshness |
| --- | --- | --- | --- | --- |
| `java-pro` | core | JVM runtime、concurrency、diagnostics、packaging | 一般 Java feature 工作導向 Spring/application host | release-driven |
| `spring-boot-engineer` | core | Spring Boot application 與 test decisions | Persistence internals 導向 persistence；domain modeling 導向 DDD | release-driven |
| `spring-persistence-engineer` | core | JPA/Hibernate fetch、locking、batching、portability | REST/security/application wiring 導向 Boot | release-driven |
| `backend-ddd-architect-spring` | core | Bounded contexts、aggregates、integration boundaries | Implementation 導向 Boot/persistence | stable |
| `jasperreports-engineer` | core | JRXML、fonts、migration、large export behavior | 一般 Java 工作導向 Java/Boot | release-driven |
| `elysia-backend-engineer` | core | Elysia lifecycle、validation、OpenAPI、streaming | SQL persistence 導向 Drizzle | fast |
| `drizzle-persistence-engineer` | core | Drizzle schemas、RQB、migrations、transactions | HTTP/application behavior 導向 Elysia | fast |
| `frontend-dev-guidelines` | core | Repo-aware React implementation、audit、performance | 可重用 component API 導向 component designer；browser assertions 導向 Stagehand | release-driven |
| `react-component-designer` | core | 可重用 React/TS component API decisions | Page implementation 與 audits 保留給 frontend host | stable |
| `stagehand-aria-e2e` | core | Stagehand v3 semantic/structural browser testing | 一般 browser operation 使用 host browser capability | fast |
| `firecrawl` | core | v2 bulk crawl/map/scrape/structured extraction | 一般 current-fact browsing 使用 host Web | fast |
| `obsidian-cli` | core | Running-vault operations、plugin debugging、DOM/property tasks | 一般 Markdown editing 不需要 portfolio skill | release-driven |
| `pdf-reader` | core | Page extraction、OCR、JSON/chunking handoff | 原生 PDF reading/creation 維持由 host 負責 | release-driven |
| `skill-creator` | 改名為 `skill-portfolio-maintainer` | Portfolio migration、routing evals、freshness 與 projection governance | Codex system skill creation 維持由 system 負責 | fast |
| `opencode-configurator` | core | OpenCode precedence、models、MCP、agents、permissions | Portfolio governance 導向 maintainer | fast |
| `teaching-content-designer` | core | Learning progression、teaching script 與 interaction design | Domain correctness 導向 domain skill；原生 presentation tools 產生簡報 | stable |
| `brainstorming` | archive extension | 明確要求時使用的 legacy greenfield design gate | 原生 Plan Mode 處理一般 design/planning | stable |
| `bun-ts-scripting-policy` | archive extension | 特殊 migration reference | 共用 coding principles 保留必要的 Bun/TS defaults | release-driven |
| `ppt-generation` | archive extension | Legacy presentation pipeline | 優先使用原生 presentations capability | release-driven |

## 各 Family 的 Core 數量

| Family | 數量 | Skills |
| --- | ---: | --- |
| Java / Spring | 5 | `java-pro`、`spring-boot-engineer`、`spring-persistence-engineer`、`backend-ddd-architect-spring`、`jasperreports-engineer` |
| Bun / TypeScript | 2 | `elysia-backend-engineer`、`drizzle-persistence-engineer` |
| Frontend | 3 | `frontend-dev-guidelines`、`react-component-designer`、`stagehand-aria-e2e` |
| Research / Knowledge | 3 | `firecrawl`、`obsidian-cli`、`pdf-reader` |
| Workflow / Content | 3 | `skill-portfolio-maintainer`、`opencode-configurator`、`teaching-content-designer` |
| 總計 | 16 |  |

## 已知的異動前品質訊號

- 四個 active skills 缺少完整的 trigger-eval suite。
- Production guidance 包含 279 個 `Selected:` benchmark-format instructions。
- Repository 內容包含 116 個 user-specific absolute path references。
- 多個 routers 與 playbooks 超出預定的 thin-router budget。
- 先前的 portfolio run 使用 synthetic selection prompts，不接受為 natural-trigger baseline。

這些數字是 audit evidence，不是永久的 validator constants。Portfolio refactor 後，v5 manifest 與 validators 將成為 source of truth。
