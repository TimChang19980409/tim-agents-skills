---
name: brainstorming
description: |
  Process gate for from-scratch feature, module, or subsystem design work. Use when the user
  wants to build something new (greenfield feature, new module, new subsystem decomposition),
  or explicitly asks to brainstorm or design before implementation. Forces a presented and
  approved design before any implementation skill is invoked. Does NOT fire for bug fixes,
  refactors, config tweaks, single-file edits, typo fixes, or dependency bumps — those route
  directly to their normal host skill.
metadata:
  framework_role: gate
  execution_mode: inline
---

# Brainstorming Ideas Into Designs

Use this skill as the process gate for new-feature and new-module work. Explore project context, ask clarifying questions one at a time, propose 2-3 approaches, present a design, and only after user approval hand off to the appropriate downstream skill. Load exactly one task playbook or decision guide before going deeper.

<HARD-GATE>
Do NOT write code, scaffold a project, or invoke any implementation skill until you have presented a design and the user has approved it. This applies to EVERY sized project regardless of perceived simplicity. The terminal state of this skill is a written spec and an explicit handoff — never a code change.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval before any implementation action.

## Tripwire: When NOT To Brainstorm

This skill does NOT fire for maintenance-class work. If the request matches any of these, short-circuit to the normal host routing instead:

- Bug fix or incident response
- Refactor, rename, or restructure of existing code without new behavior
- Config tweak, env var change, feature flag flip
- Single-file edit, typo fix, formatting, lint cleanup
- Dependency bump or version upgrade
- Test additions to existing code
- "How do I…" questions that need an answer, not a design

If the request is genuinely new (a new feature, a new module, a new subsystem, a behavior the codebase does not yet have), continue with this skill.

## Intent Router

Task playbooks:

- `explore-project-context`: [references/tasks/explore-project-context.md](/Users/ss105213025/.agents/skills/brainstorming/references/tasks/explore-project-context.md)
- `ask-clarifying-questions`: [references/tasks/ask-clarifying-questions.md](/Users/ss105213025/.agents/skills/brainstorming/references/tasks/ask-clarifying-questions.md)
- `present-design`: [references/tasks/present-design.md](/Users/ss105213025/.agents/skills/brainstorming/references/tasks/present-design.md)
- `write-spec`: [references/tasks/write-spec.md](/Users/ss105213025/.agents/skills/brainstorming/references/tasks/write-spec.md)

Decision guides:

- `when-to-brainstorm`: [references/decisions/when-to-brainstorm.md](/Users/ss105213025/.agents/skills/brainstorming/references/decisions/when-to-brainstorm.md)
- `terminal-handoff-target`: [references/decisions/terminal-handoff-target.md](/Users/ss105213025/.agents/skills/brainstorming/references/decisions/terminal-handoff-target.md)

## Checklist

Complete in order. Treat each item as one phase, not one message:

1. **Explore project context** — check files, docs, recent commits. Read the `explore-project-context` playbook first.
2. **Ask clarifying questions one at a time** — one question per message, multiple choice preferred when possible.
3. **Propose 2-3 approaches** — with trade-offs and your recommendation. Lead with the recommended option.
4. **Present design** — in sections scaled to complexity, get user approval after each section. Cover architecture, components, data flow, error handling, testing.
5. **Write spec** — save to `docs/specs/YYYY-MM-DD-<topic>-design.md` (see Spec Output Contract).
6. **Spec self-review** — placeholder scan, internal consistency, scope check, ambiguity check. Fix inline.
7. **User reviews written spec** — wait for approval before handoff.
8. **Terminal handoff** — hand off to the downstream skill via `delegates_to`.

If the project is too large for a single spec, first help the user decompose it into independent sub-projects, then brainstorm the first sub-project through this checklist. Each sub-project gets its own spec → handoff cycle.

## Spec Output Contract

Specs write to the **consumer project's** `docs/specs/` directory — NOT to the skills repo, and NOT to any legacy `superpowers` specs directory. The path is relative to wherever brainstorming is invoked from:

```
docs/specs/YYYY-MM-DD-<topic>-design.md
```

User preferences for spec location override this default. Commit the spec document to the consumer project's git after writing.

## Terminal Handoff

After the spec is written and approved, hand off to the appropriate downstream skill via `delegates_to`. Pick the matching target:

- **New skill design** (a skill itself is the deliverable) → `skill-creator`
- **Frontend feature** (React/TypeScript/UI work) → `frontend-dev-guidelines`
- **Backend feature** (Spring/Java/service work) → `spring-boot-engineer`
- **Cross-cutting multi-phase plans** → Prometheus (the agent-level planner) is the local equivalent. Prometheus is an agent-level orchestrator, NOT a skill in `skills.json`, so it is invoked at the agent surface rather than through this router.

Skills NOT in this portfolio: `writing-plans`, `frontend-design`, `mcp-builder`, and `elements-of-style:writing-clearly-and-concisely` are obra/superpowers skills and are NOT present in this portfolio. Use the local equivalents above instead. Do not attempt to invoke them.

Read the `terminal-handoff-target` decision guide before invoking the downstream skill if the target is ambiguous.

## Key Principles

- **One question at a time** — never overwhelm with multiple questions in one message
- **Multiple choice preferred** — easier to answer than open-ended when possible
- **YAGNI ruthlessly** — remove unnecessary features from all designs
- **Explore alternatives** — always propose 2-3 approaches before settling
- **Incremental validation** — present each design section, get approval before moving on
- **Design for isolation** — break the system into smaller units with one clear purpose, well-defined interfaces, independently testable
- **Stay focused** — do not propose unrelated refactoring; include targeted improvements only where they serve the current goal
- **Be flexible** — go back and clarify when something does not make sense

## Response Guardrails

- For implementation tasks, the ONLY valid terminal state is a presented spec and an explicit handoff — never a code change made from inside this skill.
- The HARD-GATE applies to every project, including ones the user calls "trivial" or "quick".
- If the request matches the Tripwire list, do NOT brainstorm — route to the normal host skill directly.
- If the user explicitly asks you to start with `Selected:`, the first line must be plain text `Selected: <exact router id>` (one of the six Intent Router entries above), with no bold, no backticks, and no downstream skill name in place of the router id.
- Do not invent new frameworks, architectures, or tooling unless the user asks for them.
- Do not write specs into the skills repo; specs live in the consumer project.
