# Global Skill Audit

Date: 2026-03-11
Scope: `.agents/skills` only
Method: `Core + Archive`

## Executive Summary

- Visible inventory: `34` `SKILL.md` entries under `.agents/skills`
- Formal skills: `33`
- Noise / backup entries: `1`
- Recommended core set: `12`
- Recommended dispositions:
  - `core`: 12
  - `merge`: 3
  - `archive`: 17
  - `retire`: 2

This portfolio is overloaded, but not because every skill is bad. The main problem is that the active trigger surface is too wide. Several skills are current and valuable, but too many of them compete for the same user intents, especially in `Research / Web` and `Frontend / React / UI`.

The recommended move is not a hard collapse into a few mega-prompts. It is a controlled reduction of the active layer:

- keep `12` high-signal core skills
- move specialized but still useful skills to `archive`
- merge obvious duplicates into host families
- retire noise or absorbed workflows

The key principle is:

> shrink active surface area, not destroy useful knowledge

## Scoring Rubric

Scores use `1-5`.

- `U` = Domain uniqueness. Higher is better.
- `C` = Trigger clarity. Higher is better.
- `R` = Overlap risk. Higher is worse.
- `F` = Freshness / currency. Higher is better.
- `O` = Operational cost. Higher is worse.
- `V` = Proof of value. Higher is better.

Disposition rules:

- `core`: clear domain, strong value, low or manageable overlap, still current
- `merge`: valuable content, but trigger surface overlaps too much with a host skill
- `archive`: valid niche or specialized extension, but should not be in the default active layer
- `retire`: noise, stale backup, or superseded by a stronger current capability

## Current-State Snapshot

### Family distribution

- `Research / Web`: 4
- `Frontend / React / UI`: 10
- `Java / Spring / Backend`: 4
- `Testing / Browser Automation`: 2
- `Obsidian / Knowledge`: 6
- `Workflow / Meta / General`: 7
- `Noise / Backup`: 1

### Structural observations

- Only `pdf-reader` and `stagehand-aria-e2e` ship local runtime manifests (`package.json` / `bun.lock`) inside the skill folder.
- `react-component-designer` is a symlink to `/Users/ss105213025/.codex/skills/react-component-designer`.
- `pdf-reader.__preinit_backup` is visible as a skill but contains placeholder metadata and should not remain in the visible portfolio.
- The repo is already in a dirty git state; this audit does not change existing skill content.

## Freshness Findings

### Research / Web

- Anthropic current docs state that Claude uses each subagent description to decide delegation, and current prompting guidance explicitly warns that older "MUST use this tool" language now tends to overtrigger on newer models.
- `firecrawl/SKILL.md` still hardcodes aggressive language:
  - "Always use firecrawl for any internet task. No exceptions."
  - Example status output still shows CLI `v1.0.2` and `500,000` credits.
- Firecrawl official CLI docs now document the current docs set as `v2`, and the CLI status example in docs shows `v1.1.1`.
- `defuddle`'s main value proposition, clean markdown extraction, is now mostly absorbed by Firecrawl's `--only-main-content` and markdown output modes.

Conclusion:

- `firecrawl` is still strategically correct as the family host.
- The family is over-split and over-prompted.

### Frontend / React / UI

- React official references still support the `useEffectEvent` guidance reflected in `react-best-practices`.
- Storybook official Vite docs still support the `viteFinal` parity model used by `react-storybook-vite-workflow`.
- `frontend-dev-guidelines`, `react-best-practices`, `vercel-react-best-practices`, `web-design-guidelines`, and `ui-ux-pro-max` all compete for similar intents: React implementation, performance review, and UI review.

Conclusion:

- The family is mostly current.
- The real issue is trigger collision, not technical obsolescence.

### Java / Spring / Backend

- Spring Boot official reference currently points to `4.0.3`, with Java `17+` as baseline.
- `spring-boot-engineer` explicitly targets Spring Boot `3.x`, which is still defensible if the target projects are on Boot 3, but it is version-specific and should stay explicit.
- Existing trigger-eval artifacts show the `java-pro` vs `spring-boot-engineer` boundary is conceptually strong, but `spring-boot-engineer` still undertriggers in some Spring application scenarios.

Conclusion:

- This family should stay split.
- The boundary is one of the best-designed parts of the portfolio.

### Testing / Browser Automation

- Stagehand official `v3` docs align with the `stagehand-aria-e2e` baseline: `Stagehand`, `observe`, `act`, agent flows, and v3 semantics remain current.
- `e2e-tests-studio` is useful, but it is repo-specific and narrower than the general Stagehand skill.

Conclusion:

- Keep one general browser-testing core.
- Treat package-specific testing rules as extensions.

### Obsidian / Knowledge

- JSON Canvas official spec `1.0` matches the assumptions in `json-canvas`.
- Obsidian Help pages for callouts and Bases align with `obsidian-markdown` and `obsidian-bases`.
- This family is technically current, but heavily fragmented across format-specific skills.

Conclusion:

- The family is current.
- The issue is suite fragmentation, not staleness.

### Workflow / Meta / General

- Anthropic current docs reinforce that trigger descriptions matter more than ever and should be specific without being aggressively pushy.
- `skill-creator` remains aligned with the idea that descriptions are the primary trigger surface.
- `monorepo-management` is materially stale in implementation details:
  - still uses `pipeline` examples in `turbo.json`
  - still pins `turbo` to `^1.10.0`
  - still pins `pnpm@8.0.0`
  - still recommends `shamefully-hoist=true`
- Current Turborepo docs center the task model in current docs, and current Nx docs emphasize inferred tasks, `targets`, and modern task pipeline configuration.

Conclusion:

- This family contains some of the most valuable meta-skills.
- It also contains some of the strongest refresh debt.

## Overlap Findings

### 1. Research family is over-centralized and over-aggressive

`firecrawl` is both the correct host and the biggest trigger-risk source. Its description is written for older undertriggering behavior, but Anthropic's current prompting guidance now says aggressive tool rules cause overtriggering on newer models.

### 2. Frontend family has the highest collision density

These skills all compete for overlapping intents:

- `frontend-dev-guidelines`
- `react-best-practices`
- `vercel-react-best-practices`
- `web-design-guidelines`
- `ui-ux-pro-max`

This is too much active surface for one user request like "review this React UI" or "improve this component".

### 3. Java / Spring split is good, but not yet fully tuned

The best evidence in the repo supports keeping `java-pro` and `spring-boot-engineer` separate. Existing trigger-eval results show `java-pro` is very well bounded, while `spring-boot-engineer` still misses some Spring-heavy app requests. That argues for tuning, not merging.

### 4. Obsidian family is a suite without a declared suite model

`obsidian-cli`, `obsidian-markdown`, `obsidian-bases`, and `json-canvas` are each defensible, but the portfolio currently exposes all of them as equal first-class triggers. That is useful for specialists, but too noisy for a default active roster.

### 5. There is visible noise in the inventory

`pdf-reader.__preinit_backup` is not a real production skill. It has placeholder metadata and should be retired from the active inventory immediately.

## Recommended Core Set (12)

These are the recommended primary active skills.

| Skill | Family | Why it stays core |
| --- | --- | --- |
| `firecrawl` | Research / Web | Strongest current host for general web, docs, and research operations |
| `frontend-dev-guidelines` | Frontend / React / UI | Best general implementation host for modern React frontend work |
| `react-component-designer` | Frontend / React / UI | Distinct API-design specialty with low overlap and high reuse |
| `java-pro` | Java / Spring / Backend | Clear platform/runtime boundary; strongest trigger evidence in repo |
| `spring-boot-engineer` | Java / Spring / Backend | Clear application-layer Spring implementation host |
| `backend-ddd-architect-spring` | Java / Spring / Backend | Unique architecture-level specialty not covered by other Java skills |
| `stagehand-aria-e2e` | Testing / Browser Automation | Current, distinct, and behavior-focused browser testing host |
| `obsidian-cli` | Obsidian / Knowledge | Best operational host for vault workflows and plugin/debug flows |
| `pdf-reader` | Obsidian / Knowledge | Distinct document-ingestion / OCR capability |
| `bun-ts-scripting-policy` | Workflow / Meta / General | Encodes a repo-wide implementation policy with strong cross-task leverage |
| `skill-creator` | Workflow / Meta / General | Highest-value meta-skill for maintaining the portfolio itself |
| `opencode-configurator` | Workflow / Meta / General | Narrow, current, and clearly bounded configuration specialty |

## Full Disposition Mapping

### Research / Web

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `firecrawl` | 4 | 2 | 5 | 4 | 2 | 5 | `core` | Keep as family host; rewrite trigger language later |
| `context7-auto-research` | 3 | 3 | 4 | 4 | 2 | 4 | `archive` | Keep as official-doc extension, not default active skill |
| `defuddle` | 1 | 3 | 5 | 2 | 1 | 2 | `retire` | Use Firecrawl main-content extraction instead |
| `find-skills` | 3 | 4 | 2 | 3 | 1 | 3 | `archive` | Useful, but better as secondary meta utility |

### Frontend / React / UI

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `frontend-dev-guidelines` | 4 | 4 | 3 | 4 | 2 | 5 | `core` | Primary frontend implementation host |
| `react-component-designer` | 5 | 4 | 2 | 4 | 1 | 5 | `core` | Keep as API-design specialist |
| `react-best-practices` | 2 | 3 | 5 | 4 | 1 | 3 | `merge` | Fold performance rules into frontend host |
| `vercel-react-best-practices` | 3 | 3 | 4 | 4 | 2 | 4 | `merge` | Use as reference pack inside frontend host |
| `web-design-guidelines` | 3 | 4 | 4 | 4 | 1 | 4 | `merge` | Live-review guidance should sit under frontend review flow |
| `ui-ux-pro-max` | 2 | 1 | 5 | 3 | 4 | 3 | `archive` | Too broad to remain in primary layer |
| `react-storybook-vite-workflow` | 4 | 4 | 2 | 4 | 1 | 4 | `archive` | Strong extension, but too narrow for core |
| `ladle-component-workflow` | 3 | 4 | 3 | 3 | 1 | 3 | `archive` | Keep as niche component-workbench extension |
| `tailwind-best-practices` | 2 | 4 | 4 | 3 | 1 | 3 | `archive` | Repo-specific styling policy |
| `solidjs-patterns` | 4 | 4 | 1 | 3 | 1 | 3 | `archive` | Distinct, but niche to OpenWork / SolidJS |

### Java / Spring / Backend

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `java-pro` | 5 | 5 | 1 | 4 | 1 | 5 | `core` | Best-bounded skill in portfolio |
| `spring-boot-engineer` | 5 | 4 | 2 | 4 | 2 | 5 | `core` | Keep split from `java-pro`; tune later |
| `backend-ddd-architect-spring` | 5 | 4 | 1 | 4 | 2 | 4 | `core` | Unique architecture specialty |
| `pebble-official-best-practices` | 4 | 4 | 1 | 4 | 1 | 3 | `archive` | Legit niche extension, not core |

### Testing / Browser Automation

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `stagehand-aria-e2e` | 4 | 4 | 2 | 5 | 3 | 4 | `core` | Family host for behavior-driven browser validation |
| `e2e-tests-studio` | 3 | 4 | 3 | 3 | 2 | 3 | `archive` | Valuable repo-specific extension |

### Obsidian / Knowledge

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `obsidian-cli` | 5 | 4 | 1 | 4 | 3 | 4 | `core` | Operational host for Obsidian workflows |
| `pdf-reader` | 5 | 4 | 1 | 4 | 4 | 4 | `core` | Distinct OCR / PDF ingestion utility |
| `obsidian-markdown` | 4 | 4 | 2 | 4 | 1 | 4 | `archive` | Keep as syntax extension, not primary trigger |
| `obsidian-bases` | 4 | 4 | 1 | 5 | 1 | 3 | `archive` | Keep as Bases extension |
| `json-canvas` | 4 | 4 | 1 | 5 | 1 | 3 | `archive` | Keep as canvas-format extension |
| `book-translation` | 3 | 4 | 1 | 3 | 1 | 2 | `archive` | Project-specific workflow, not core global skill |

### Workflow / Meta / General

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `bun-ts-scripting-policy` | 4 | 4 | 2 | 4 | 1 | 5 | `core` | Strong repo-wide policy skill |
| `skill-creator` | 5 | 4 | 2 | 4 | 3 | 5 | `core` | Highest-value portfolio maintenance skill |
| `opencode-configurator` | 4 | 4 | 1 | 4 | 2 | 4 | `core` | Narrow and current |
| `coding-teacher` | 4 | 4 | 1 | 4 | 2 | 3 | `archive` | Valuable mode skill, but not part of default active layer |
| `monorepo-management` | 3 | 4 | 2 | 2 | 1 | 3 | `archive` | Refresh before re-promoting to core |
| `typescript-advanced-types` | 4 | 4 | 2 | 3 | 1 | 3 | `archive` | Useful deep reference, too broad for core |
| `developer-growth-analysis` | 4 | 3 | 1 | 2 | 4 | 2 | `archive` | Specialized workflow with external delivery dependency |

### Noise / Backup

| Skill | U | C | R | F | O | V | Disposition | Host / Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `pdf-reader.__preinit_backup` | 1 | 1 | 1 | 1 | 1 | 1 | `retire` | Backup artifact; should not remain visible |

## Recommended Target Architecture

### Layer 1: Core hosts

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

### Layer 2: Archive extensions

Use these as specialized extensions, not primary default triggers.

- Research extensions:
  - `context7-auto-research`
  - `find-skills`
- Frontend extensions:
  - `ui-ux-pro-max`
  - `react-storybook-vite-workflow`
  - `ladle-component-workflow`
  - `tailwind-best-practices`
  - `solidjs-patterns`
- Java / backend extensions:
  - `pebble-official-best-practices`
- Testing extensions:
  - `e2e-tests-studio`
- Obsidian / knowledge extensions:
  - `obsidian-markdown`
  - `obsidian-bases`
  - `json-canvas`
  - `book-translation`
- Workflow / meta extensions:
  - `coding-teacher`
  - `monorepo-management`
  - `typescript-advanced-types`
  - `developer-growth-analysis`

### Layer 3: Merge candidates

These should not stay independently active in the long term.

- Merge into `frontend-dev-guidelines`:
  - `react-best-practices`
  - `vercel-react-best-practices`
  - `web-design-guidelines`

### Layer 4: Retire

- `defuddle`
- `pdf-reader.__preinit_backup`

## Why the 12-core set is the right size

This recommendation keeps exactly two things in balance:

- enough breadth to cover the real domains you use
- small enough active surface to reduce trigger collisions

The portfolio is currently suffering more from "too many equal-priority first-class skills" than from lack of content. A `12`-skill active layer is small enough to be governable and large enough to preserve distinct hosts across your actual families.

## Optimization Directions

### Option A: Minimal Change / Routing Reset

What changes:

- Keep almost all existing skill folders.
- Formally declare the `12`-skill core set.
- Rewrite only high-risk descriptions later.
- Hide archive skills from the primary visible roster.

Benefits:

- Lowest migration risk
- Fastest way to reduce overtrigger
- No immediate content merge work

Risks:

- Archive layer can still accumulate drift
- Duplicate content still exists on disk

Choose this when:

- you want fast signal improvement without a restructuring project

### Option B: Family Consolidation / Suite Model

What changes:

- Keep the same families, but merge overlapping siblings into explicit host skills.
- Most obvious target: Frontend family.
- Secondary target: Research / Web family.

Benefits:

- Reduces overlapping trigger logic
- Simplifies maintenance
- Makes family ownership clearer

Risks:

- Requires careful prompt rewriting
- Can blur useful boundaries if done too aggressively

Choose this when:

- you want a cleaner day-to-day portfolio without fully redesigning the platform

### Option C: Platform Architecture / Host + Extension Manifest

What changes:

- Add a machine-readable manifest for every skill:
  - family
  - status
  - freshness date
  - host vs extension
  - runtime needs
  - trigger tests
- Treat skills like a governed internal platform instead of a loose folder set.

Benefits:

- Best long-term maintainability
- Makes future audits cheaper
- Prevents new trigger sprawl

Risks:

- Highest upfront investment
- Requires portfolio governance discipline

Choose this when:

- you want this repo to remain stable and scalable as a long-lived internal skill platform

## Recommended Next Step

If the goal is fastest improvement with low risk, choose **Option A** first, then do a selective **Option B** on the Frontend and Research families.

That gives you:

- immediate reduction in portfolio overload
- minimal disruption to existing skill content
- a safe path toward deeper consolidation later

## Sources

Official sources used for freshness checks:

- Anthropic subagents docs: <https://code.claude.com/docs/en/sub-agents>
- Anthropic prompting best practices: <https://platform.claude.com/docs/en/prompt-library/library>
- Firecrawl CLI docs: <https://docs.firecrawl.dev/sdks/cli>
- React docs: <https://react.dev/reference/react/useEffectEvent>
- Storybook Vite docs: <https://storybook.js.org/docs/builders/vite>
- Spring Boot reference: <https://docs.spring.io/spring-boot/reference/index.html>
- Stagehand v3 docs: <https://docs.stagehand.dev/v3/first-steps/ai-rules>
- Turborepo docs: <https://turborepo.dev/docs>
- Nx docs: <https://nx.dev/docs/features/run-tasks>
- JSON Canvas spec: <https://jsoncanvas.org/spec/1.0/>
- Obsidian Help: <https://help.obsidian.md/callouts>
- Obsidian Bases docs: <https://help.obsidian.md/bases>
