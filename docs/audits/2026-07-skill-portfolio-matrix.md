# 2026-07 Portfolio Decision Matrix

| Current skill | Target | Value retained | Native overlap / boundary | Freshness |
| --- | --- | --- | --- | --- |
| `java-pro` | core | JVM runtime, concurrency, diagnostics, packaging | Generic Java feature work routes to Spring/application host | release-driven |
| `spring-boot-engineer` | core | Spring Boot application and test decisions | Persistence internals route to persistence; domain modeling to DDD | release-driven |
| `spring-persistence-engineer` | core | JPA/Hibernate fetch, locking, batching, portability | REST/security/application wiring routes to Boot | release-driven |
| `backend-ddd-architect-spring` | core | Bounded contexts, aggregates, integration boundaries | Implementation routes to Boot/persistence | stable |
| `jasperreports-engineer` | core | JRXML, fonts, migration, large export behavior | General Java work routes to Java/Boot | release-driven |
| `elysia-backend-engineer` | core | Elysia lifecycle, validation, OpenAPI, streaming | SQL persistence routes to Drizzle | fast |
| `drizzle-persistence-engineer` | core | Drizzle schemas, RQB, migrations, transactions | HTTP/application behavior routes to Elysia | fast |
| `frontend-dev-guidelines` | core | Repo-aware React implementation, audit, performance | Reusable component API routes to component designer; browser assertions to Stagehand | release-driven |
| `react-component-designer` | core | Reusable React/TS component API decisions | Page implementation and audits stay with frontend host | stable |
| `stagehand-aria-e2e` | core | Stagehand v3 semantic/structural browser testing | General browser operation uses host browser capability | fast |
| `firecrawl` | core | v2 bulk crawl/map/scrape/structured extraction | General current-fact browsing uses host Web | fast |
| `obsidian-cli` | core | Running-vault operations, plugin debugging, DOM/property tasks | Plain Markdown editing needs no portfolio skill | release-driven |
| `pdf-reader` | core | Page extraction, OCR, JSON/chunking handoff | Native PDF reading/creation remains host-owned | release-driven |
| `skill-creator` | rename to `skill-portfolio-maintainer` | Portfolio migration, routing evals, freshness and projection governance | Codex system skill creation remains system-owned | fast |
| `opencode-configurator` | core | OpenCode precedence, models, MCP, agents, permissions | Portfolio governance routes to maintainer | fast |
| `teaching-content-designer` | core | Learning progression, teaching script and interaction design | Domain correctness routes to domain skill; native presentation tools produce decks | stable |
| `brainstorming` | archive extension | Legacy greenfield design gate when explicitly requested | Native Plan Mode handles general design/planning | stable |
| `bun-ts-scripting-policy` | archive extension | Special migration reference | Shared coding principles carry necessary Bun/TS defaults | release-driven |
| `ppt-generation` | archive extension | Legacy presentation pipeline | Native presentations capability is preferred | release-driven |

## Core count by family

| Family | Count | Skills |
| --- | ---: | --- |
| Java / Spring | 5 | `java-pro`, `spring-boot-engineer`, `spring-persistence-engineer`, `backend-ddd-architect-spring`, `jasperreports-engineer` |
| Bun / TypeScript | 2 | `elysia-backend-engineer`, `drizzle-persistence-engineer` |
| Frontend | 3 | `frontend-dev-guidelines`, `react-component-designer`, `stagehand-aria-e2e` |
| Research / Knowledge | 3 | `firecrawl`, `obsidian-cli`, `pdf-reader` |
| Workflow / Content | 3 | `skill-portfolio-maintainer`, `opencode-configurator`, `teaching-content-designer` |
| Total | 16 |  |

## Known pre-change quality signals

- Four active skills lack a complete trigger-eval suite.
- Production guidance contains 279 `Selected:` benchmark-format instructions.
- Repo content contains 116 user-specific absolute path references.
- Several routers and playbooks exceed the intended thin-router budget.
- The previous portfolio run used synthetic selection prompts and is not accepted as a natural-trigger baseline.

These counts are audit evidence, not permanent validator constants. The v5 manifest and validators become the source of truth after the portfolio refactor.
