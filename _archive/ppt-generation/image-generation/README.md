# Image Generation Helper

English | [繁體中文](README.zh-TW.md)

This directory now holds the slide-image helper used by `ppt-generation`.
It is no longer an active top-level skill surface.

## Purpose

- Generate a single slide image from a prompt JSON file.
- Preserve visual consistency by chaining the previous slide as a reference image.
- Support the `16:9` and `4:3` presentation aspect ratios.

## CLI

Use the helper script directly:

```bash
python ~/.agents/skills/image-generation/scripts/generate.py \
  --prompt-file <path-to-prompt-json> \
  --output-file <path-to-output-image> \
  --reference-images <optional-path-to-reference-image> \
  --aspect-ratio <16:9|4:3>
```

## Prompt Shape

```json
{
  "prompt": "Detailed image generation prompt",
  "style": "Style description",
  "composition": "Composition guidelines",
  "color_palette": "Color palette specification",
  "typography": "Typography guidelines",
  "consistency_note": "Reference consistency notes for subsequent slides"
}
```

## Workflow Notes

- Slide 1 establishes the visual language.
- Each later slide should reference the immediately previous slide image.
- Keep generation sequential so the style chain stays intact.
