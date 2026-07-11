# Terminal Handoff Target

## Decision

Which skill to invoke after the brainstorming spec is approved and user has reviewed it.

## Signals/constraints

- Spec type: new skill design, frontend feature, backend feature, or cross-cutting plan
- Consumer project tech stack: React/TypeScript, Spring Boot, mixed, or unknown
- Scope: single-skill domain or multi-skill integration

## Options

1. **New skill design** → `skill-portfolio-maintainer` (draft-skill playbook for creating a new SKILL.md)
2. **Frontend feature** → `frontend-dev-guidelines` (build/refactor playbook for React/TypeScript work)
3. **Backend feature** → `spring-boot-engineer` (rest-feature-delivery playbook for Spring Boot work)
4. **Cross-cutting plan** → Prometheus (agent-level planner; operates above the skill layer)

**Note:** Superpowers skills like `writing-plans`, `frontend-design`, `mcp-builder`, and `elements-of-style` are not available in this portfolio.

## Recommendation rule

Match the spec's primary domain to the corresponding skill. If the spec spans multiple domains, recommend the broadest applicable host first, then delegate narrowly.

## Tradeoffs

- **skill-portfolio-maintainer**: Narrow/meta scope. Best for defining new capabilities, not implementing features.
- **frontend-dev-guidelines**: Broad domain-specific host. Covers React, performance, accessibility, and UI review.
- **spring-boot-engineer**: Narrow domain-specific scope. Deep Spring Boot implementation expertise.
- **Cross-cutting plans**: No perfect skill-level match. Prometheus operates at the agent layer.

## Verification

- Chosen skill exists in skills.json
- Skill's trigger surface matches the spec's domain
- Spec document path is communicated to the downstream skill