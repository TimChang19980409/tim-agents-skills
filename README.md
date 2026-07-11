# Tim Agent Skills

This repository now uses a `Core + Archive` portfolio model with a shared cross-tool layer on top.

- `core`: top-level skills with active `SKILL.md` entrypoints
- `merge`: preserved skills whose trigger surface has been folded into a core host
- `archive`: preserved specialist skills kept out of automatic discovery
- `retire`: removed from active use, kept only for history or migration context

The machine-readable source of truth is [skills.json](skills.json). Run [scripts/validate-skills.ts](scripts/validate-skills.ts) and [scripts/validate-agent-context.ts](scripts/validate-agent-context.ts) after structural changes.

The framework layer adds these concepts:

- `role`: `host`, `specialist`, `policy`, `utility`, or `extension`
- `execution_mode`: `inline`, `manual`, or `forked`
- `task playbooks`: `references/tasks/*.md`
- `decision guides`: `references/decisions/*.md`
- `archive extensions`: archived packs owned by a host and loaded explicitly

See [AGENT_SKILL_FRAMEWORK.md](AGENT_SKILL_FRAMEWORK.md) for the framework contract.

## Portfolio layout

- Top-level `*/SKILL.md`: the active core roster only
- `AGENTS.md` / `CLAUDE.md`: thin repo-local entrypoints for this skills repository
- `_shared/global/`: cross-repo global entrypoints and reusable docs
- `_shared/repo/`: repo-specific guidance for the skills repository itself
- `_shared/opencode/`: OpenCode-specific config and subagents
- `_shared/projections/`: checked-in projection snapshot for external symlink targets
- `_benchmarks/`: benchmark groups, retained workspaces, portfolio trigger outputs, and wave summaries
- `_archive/<skill>/ARCHIVE.md`: preserved non-core skills, including merged sources
- `_retired/<skill>/RETIRED.md`: retired skills and backup artifacts
- `skills.json`: status, family, host, and storage metadata
- `references/tasks/*.md`: task-oriented playbooks owned by a host
- `references/decisions/*.md`: decision-oriented guides owned by a host
- `GLOBAL_SKILL_AUDIT_2026-03-11.md`: historical audit memo
- `GLOBAL_SKILL_AUDIT_MATRIX_2026-03-11.tsv`: historical scoring matrix
- `JAVA_SPRING_PERSISTENCE_AUDIT_DELTA_2026-03-13.md`: delta note for the new persistence host split

## Active core skills

| Skill | Family | Purpose |
| --- | --- | --- |
| `firecrawl` | Research / Web | Primary host for live web content, online docs, and current facts |
| `frontend-dev-guidelines` | Frontend / React / UI | Primary host for frontend implementation, performance review, and UI/accessibility review |
| `elysia-backend-engineer` | TypeScript / Bun / Backend | ElysiaJS routes, validation, plugins, Eden clients, tests, and runtime decisions |
| `drizzle-persistence-engineer` | TypeScript / Bun / Backend | Drizzle ORM schema, query, migration, and Elysia TypeBox bridge specialist |
| `react-component-designer` | Frontend / React / UI | Reusable component API design specialist |
| `java-pro` | Java / Spring / Backend | Java platform, concurrency, JVM, and profiling specialist |
| `jasperreports-engineer` | Java / Spring / Backend | JasperReports Library and Jaspersoft Studio implementation specialist |
| `spring-persistence-engineer` | Java / Spring / Backend | Spring Data JPA, Hibernate 6/7, and RDBMS portability persistence host |
| `spring-boot-engineer` | Java / Spring / Backend | Spring Boot application implementation specialist |
| `backend-ddd-architect-spring` | Java / Spring / Backend | DDD and bounded-context architecture specialist |
| `stagehand-aria-e2e` | Testing / Browser Automation | Behavior-first browser testing host |
| `obsidian-cli` | Obsidian / Knowledge | Obsidian vault and plugin/debug operations host |
| `pdf-reader` | Obsidian / Knowledge | PDF/OCR ingestion and extraction |
| `skill-portfolio-maintainer` | Workflow / Meta / General | Portfolio governance, migration, eval, freshness, and projection maintenance |
| `opencode-configurator` | Workflow / Meta / General | OpenCode and oh-my-opencode configuration specialist |
| `teaching-content-designer` | Education / Teaching / Content | Teaching content design host for lesson outlines, scripts, documents, interaction, and concept progression |

## Merged and archived skills

### Merged into `frontend-dev-guidelines`

- `react-best-practices`
- `vercel-react-best-practices`
- `web-design-guidelines`

### Archived specialists

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
- `ppt-generation` (including its legacy `image-generation` helper)

### Retired

- `defuddle`
- `pdf-reader.__preinit_backup`

## Runtime requirements

Reading skill docs requires no installation. Running the full portfolio is easiest with:

- `bun`
- `node` / `npm`
- `python3`

Active skill-specific requirements:

- `firecrawl`: `npm install -g firecrawl-cli`, plus Firecrawl auth
- `pdf-reader`: `bun install` in [pdf-reader](pdf-reader); optional OCR tools such as `poppler` and `tesseract`
- `stagehand-aria-e2e`: `bun install` in [stagehand-aria-e2e](stagehand-aria-e2e), plus model/browser credentials as required
- `obsidian-cli`: installed Obsidian app and `obsidian` CLI, with Obsidian running when needed
- `jasperreports-engineer` and `spring-persistence-engineer`: `bun` for helper scripts and `opencode` for eval runs
- [scripts/validate-skills.ts](scripts/validate-skills.ts): Bun runtime

## Validation

Run:

```bash
bun scripts/validate-skills.ts
```

The validator checks:

- exactly 16 top-level active `SKILL.md` files, read from `framework.expected_core_skills`
- `skills.json` consistency
- `skills.json` schema v5, projections, roles, execution modes, trigger suites, freshness, and official sources
- no active skill stored as a symlink
- core `SKILL.md` files stay within the router-size limit
- core host skills declare task playbooks, decision guides, and eval coverage
- archive extensions declare host ownership in both `skills.json` and `ARCHIVE.md`
- no `SKILL.md` inside `_archive/` or `_retired/`
- valid `merge -> core host` relationships
- benchmark-group roster coverage, wave summaries, and broken projection symlinks

Run the agent-context validator with:

```bash
bun scripts/validate-agent-context.ts
```

It checks:

- thin root/global `AGENTS.md` and `CLAUDE.md` entrypoints
- shared global docs and OpenCode instruction paths
- the checked-in projection snapshot under `_shared/projections/`
- that global entrypoints stay cross-repo and do not leak repo-specific guidance

## Maintenance rules

1. Do not add a new top-level `SKILL.md` unless the skill is explicitly approved for the core roster.
2. Add every portfolio entry to [skills.json](skills.json).
3. Archived skills must use `ARCHIVE.md`; retired skills must use `RETIRED.md`.
4. Prefer vendored content over symlinked skills.
5. If a change alters trigger boundaries, update both the relevant skill file and the audit metadata.
6. Only `role=host` skills should own a broad trigger surface; put deep or narrow guidance in playbooks, decision guides, or archive extensions.
7. Commit compact benchmark summaries, not raw OpenCode transcripts or staged project copies.
8. Keep root and global entrypoint files thin; route durable detail into `_shared/global/docs/` or `_shared/repo/`.
9. Run `bun scripts/sync-agent-projections.ts --check` after portfolio changes. Use `--apply` only for the backup-first, repo-owned home reconciliation; OpenCode config is merged rather than linked.

## Benchmark targets

Natural trigger acceptance uses `opencode/nemotron-3-ultra-free` for all 100 cases and `opencode/north-mini-code-free` for boundary/null smoke. The runner observes OpenCode's native `skill` tool events under `--pure` isolation. Historical wave summaries remain reference material, not the current acceptance baseline.

```bash
bun skill-portfolio-maintainer/scripts/run_portfolio_opencode_trigger_eval.ts --suite full
bun skill-portfolio-maintainer/scripts/run_portfolio_opencode_trigger_eval.ts --suite boundary
bun test scripts/lib/opencode-skill-events.test.ts
```

The runner uses raw user questions, a temporary HOME/config/project, the existing `XDG_DATA_HOME` for authentication, and no retained transcripts or staged skill trees.
