---
name: teaching-content-designer
description: |
  Teaching content design host for lesson outlines, teaching scripts, teaching documents, interaction plans,
  and concept progression for education, programming, and software architecture teaching. Use when the user
  is preparing to teach or share material and wants learning-science-aware structure, tone, interaction, or
  anti-cramming design. Delegate technical correctness to domain skills and PPT/PPTX production to ppt-generation.
metadata:
  framework_role: host
  execution_mode: inline
---

# Teaching Content Designer

Use this skill as the teaching content design host. Classify the request into one teaching artifact or one decision guide before loading deeper references.

## Intent Router

- `lesson-outline`: [references/tasks/lesson-outline.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/tasks/lesson-outline.md)
- `teaching-script`: [references/tasks/teaching-script.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/tasks/teaching-script.md)
- `teaching-document`: [references/tasks/teaching-document.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/tasks/teaching-document.md)
- `interaction-plan`: [references/tasks/interaction-plan.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/tasks/interaction-plan.md)
- `concept-progression`: [references/tasks/concept-progression.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/tasks/concept-progression.md)
- `audience-calibration`: [references/decisions/audience-calibration.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/decisions/audience-calibration.md)
- `domain-delegation`: [references/decisions/domain-delegation.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/decisions/domain-delegation.md)

## Pedagogy Reference

- Load [references/pedagogy.md](/Users/ss105213025/.agents/skills/teaching-content-designer/references/pedagogy.md) when shaping learning goals, concept order, interaction, practice, retrieval, spacing, misconceptions, or tone.

## Delegation

- Delegate technical correctness to `java-pro`, `frontend-dev-guidelines`, `backend-ddd-architect-spring`, `spring-boot-engineer`, or other domain skills when the teaching artifact depends on exact platform, framework, API, architecture, or code behavior.
- Delegate current documentation or source verification to `firecrawl` when library, API, product, or standards details may have changed.
- Delegate editable PPT/PPTX production to `ppt-generation` after the teaching structure, audience, and learning flow are stable.

## Extension Packs

- Load `coding-teacher` only when the request is learner-facing step-by-step tutoring, course progression, homework submission, auto-scan, or code-review feedback for a learner.

## Host Workflow

1. Classify the request into one artifact playbook or one decision guide.
2. Calibrate audience, prior knowledge, goal, time budget, and delivery format before drafting.
3. Use learning-science structure: motivation, concept ladder, worked example, interaction, retrieval, practice, and review.
4. Keep technical claims conservative; delegate or verify instead of inventing framework details.
5. End with the artifact requested and a short verification or rehearsal checklist.

## Output Contract

Teaching outlines, scripts, and documents must include:

- Target audience and prerequisite assumptions.
- Observable learning goals.
- Concept progression from familiar context to new concept to transfer.
- Cognitive load controls, especially small concept batches and worked examples.
- Interaction points such as prompts, pauses, retrieval questions, discussion, or exercises.
- Likely misconceptions and repair language.
- Closing recap, learner check, next practice, or spaced review.

## Response Guardrails

- Default to Traditional Chinese when the user writes in Chinese; match another requested language when specified.
- Write in a speaker-usable, respectful tone. Avoid dense bullet dumps, lecture-only delivery, and condescending phrasing.
- Prefer active learning and learner reasoning over one-way explanation.
- Do not turn a content-design request into a full slide deck unless the user asks for PPT/PPTX.
- If the user explicitly asks you to start with `Selected:`, the first line must be plain text `Selected: <exact router id>` with no heading, no bold, and no downstream skill name.
