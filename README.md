# Tim Agent Skills

This repository now uses a `Core + Archive` portfolio model with a framework layer on top.

- `core`: top-level skills with active `SKILL.md` entrypoints
- `merge`: preserved skills whose trigger surface has been folded into a core host
- `archive`: preserved specialist skills kept out of automatic discovery
- `retire`: removed from active use, kept only for history or migration context

The machine-readable source of truth is [skills.json](/Users/ss105213025/.agents/skills/skills.json). Run [scripts/validate-skills.ts](/Users/ss105213025/.agents/skills/scripts/validate-skills.ts) after any structural change.

The framework layer adds these concepts:

- `role`: `host`, `specialist`, `policy`, `utility`, or `extension`
- `execution_mode`: `inline`, `manual`, or `forked`
- `task playbooks`: `references/tasks/*.md`
- `decision guides`: `references/decisions/*.md`
- `archive extensions`: archived packs owned by a host and loaded explicitly

See [AGENT_SKILL_FRAMEWORK.md](/Users/ss105213025/.agents/skills/AGENT_SKILL_FRAMEWORK.md) for the full framework contract.

## Portfolio layout

- Top-level `*/SKILL.md`: the active core roster only
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
| `react-component-designer` | Frontend / React / UI | Reusable component API design specialist |
| `java-pro` | Java / Spring / Backend | Java platform, concurrency, JVM, and profiling specialist |
| `jasperreports-engineer` | Java / Spring / Backend | JasperReports Library and Jaspersoft Studio implementation specialist |
| `spring-persistence-engineer` | Java / Spring / Backend | Spring Data JPA, Hibernate 6/7, and RDBMS portability persistence host |
| `spring-boot-engineer` | Java / Spring / Backend | Spring Boot application implementation specialist |
| `backend-ddd-architect-spring` | Java / Spring / Backend | DDD and bounded-context architecture specialist |
| `stagehand-aria-e2e` | Testing / Browser Automation | Behavior-first browser testing host |
| `obsidian-cli` | Obsidian / Knowledge | Obsidian vault and plugin/debug operations host |
| `pdf-reader` | Obsidian / Knowledge | PDF/OCR ingestion and extraction |
| `bun-ts-scripting-policy` | Workflow / Meta / General | Default script and CLI policy |
| `skill-creator` | Workflow / Meta / General | Skill creation, evaluation, and portfolio tuning |
| `opencode-configurator` | Workflow / Meta / General | OpenCode and oh-my-opencode configuration specialist |

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
- `pdf-reader`: `bun install` in [pdf-reader](/Users/ss105213025/.agents/skills/pdf-reader); optional OCR tools such as `poppler` and `tesseract`
- `stagehand-aria-e2e`: `bun install` in [stagehand-aria-e2e](/Users/ss105213025/.agents/skills/stagehand-aria-e2e), plus model/browser credentials as required
- `obsidian-cli`: installed Obsidian app and `obsidian` CLI, with Obsidian running when needed
- `jasperreports-engineer`: `bun` for helper scripts and `opencode` for MiniMax-based eval runs
- `spring-persistence-engineer`: `bun` for helper scripts and `opencode` for MiniMax-based eval runs
- [scripts/validate-skills.ts](/Users/ss105213025/.agents/skills/scripts/validate-skills.ts): Bun runtime

## Validation

Run:

```bash
bun /Users/ss105213025/.agents/skills/scripts/validate-skills.ts
```

The validator checks:

- exactly 14 top-level active `SKILL.md` files
- `skills.json` consistency
- `skills.json` framework schema (`schema_version: 2`, roles, execution modes, playbook paths)
- no active skill stored as a symlink
- core `SKILL.md` files stay within the router-size limit
- core host skills declare task playbooks, decision guides, and eval coverage
- archive extensions declare host ownership in both `skills.json` and `ARCHIVE.md`
- no `SKILL.md` inside `_archive/` or `_retired/`
- valid `merge -> core host` relationships

## Maintenance rules

1. Do not add a new top-level `SKILL.md` unless the skill is explicitly approved for the core roster.
2. Add every portfolio entry to [skills.json](/Users/ss105213025/.agents/skills/skills.json).
3. Archived skills must use `ARCHIVE.md`; retired skills must use `RETIRED.md`.
4. Prefer vendored content over symlinked skills.
5. If a change alters trigger boundaries, update both the relevant skill file and the audit metadata.
6. Only `role=host` skills should own a broad trigger surface; put deep or narrow guidance in playbooks, decision guides, or archive extensions.
7. Commit compact benchmark summaries, not raw OpenCode transcripts or staged project copies.
