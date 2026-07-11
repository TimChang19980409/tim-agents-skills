# Domain Delegation

## Decision

Choose when teaching-content design should stay in this host and when technical, research, or slide-production work should delegate to another skill.

## Signals/constraints

- The user needs exact framework, API, runtime, language, or architecture behavior.
- The material depends on recent documentation, product changes, library versions, or standards.
- The user asks for editable PPT/PPTX instead of only content structure.
- The request is direct tutoring, homework submission, or code-review learning feedback.

## Options

- Stay in `teaching-content-designer` for pedagogy, outline, script, document, interaction, tone, and concept progression.
- Delegate to `java-pro`, `frontend-dev-guidelines`, `backend-ddd-architect-spring`, or `spring-boot-engineer` for exact technical correctness.
- Delegate to `firecrawl` for current facts, source verification, or official documentation.
- Delegate to `ppt-generation` for editable presentation creation after the teaching flow is stable.
- Load `coding-teacher` for learner-facing course steps, submissions, auto-scan, homework, or code-review feedback.

## Recommendation rule


Keep the teaching structure here, then delegate only the exact technical or production layer that needs specialist handling.

## Tradeoffs

- Staying in this host keeps the teaching narrative coherent.
- Delegation improves technical correctness but can fragment the flow if done before learning goals are clear.
- PPT generation should follow content design so the deck does not lock in a weak teaching sequence.

## Verification

- Name the retained teaching responsibility and the delegated responsibility.
- Confirm that any delegated work has a stable teaching goal and audience assumption.
