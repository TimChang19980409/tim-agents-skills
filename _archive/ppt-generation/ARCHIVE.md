# PPT Generation (Archived Extension)

- Host owner: `teaching-content-designer`
- Load when: a teaching deliverable explicitly requires the legacy sequential slide-image pipeline instead of the host's native presentation capability.

Native presentation tooling is the default. The bundled `image-generation` helper exists only for this legacy workflow.

## Router

2. Read `references/tasks/presentation-generation.md` for the workflow.
3. Read `references/decisions/choose-style.md` to choose the visual style.
4. Use `image-generation/README.md` and `image-generation/scripts/generate.py` for slide imagery.
5. Compose the PPTX with `scripts/generate.py` after slide images are generated.

## Guardrails

- Keep slide generation sequential so the reference chain stays intact.
- Do not parallelize slide image generation.
- Keep responses bounded and avoid over-explaining implementation details unless asked.
