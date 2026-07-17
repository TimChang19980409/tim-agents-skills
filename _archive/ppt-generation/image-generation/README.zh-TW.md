# Image Generation Helper

[English](README.md) | 繁體中文

此目錄存放 `ppt-generation` 使用的投影片圖片 helper。
它已不再是有效的頂層 skill surface。

## 用途

- 根據 prompt JSON 檔案產生單張投影片圖片。
- 將上一張投影片作為 reference image 串接，以維持視覺一致性。
- 支援 `16:9` 與 `4:3` 簡報長寬比。

## CLI

直接使用 helper script：

```bash
python ~/.agents/skills/image-generation/scripts/generate.py \
  --prompt-file <path-to-prompt-json> \
  --output-file <path-to-output-image> \
  --reference-images <optional-path-to-reference-image> \
  --aspect-ratio <16:9|4:3>
```

## Prompt 格式

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

## Workflow 備註

- Slide 1 建立視覺語言。
- 後續每張投影片都應引用前一張投影片圖片。
- 維持依序生成，確保 style chain 一致。
