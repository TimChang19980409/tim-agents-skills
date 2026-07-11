# Presentation Generation

## When to use

Use this playbook when a user requests to create, generate, or make a presentation, slides, PPT, PPTX, or deck. This playbook covers the end-to-end workflow for producing a professional PowerPoint presentation by generating unique AI images for each slide and composing them into a final PPTX file.

Trigger phrases include: "create a presentation", "make slides", "generate a PPT", "I need a deck about", "build a PowerPoint", "design a slide deck".

## Inputs

- **Topic/subject**: What the presentation is about
- **Number of slides**: Typically 5-10 slides (default: 5)
- **Style**: One of the 8 supported presentation styles (see below)
- **Aspect ratio**: Standard (16:9) or classic (4:3), default is 16:9
- **Content outline**: Key points or sections for each slide
- **Optional**: Brand colors, specific imagery references, or corporate identity guidelines

### Supported Presentation Styles

| Style | Description | Best For |
|-------|-------------|----------|
| **glassmorphism** | Frosted glass panels with blur effects, floating translucent cards, vibrant gradient backgrounds, depth through layering | Tech products, AI/SaaS demos, futuristic pitches |
| **dark-premium** | Rich black backgrounds (#0a0a0a), luminous accent colors, subtle glow effects, luxury brand aesthetic | Premium products, executive presentations, high-end brands |
| **gradient-modern** | Bold mesh gradients, fluid color transitions, contemporary typography, vibrant yet sophisticated | Startups, creative agencies, brand launches |
| **neo-brutalist** | Raw bold typography, high contrast, intentional "ugly" aesthetic, anti-design as design, Memphis-inspired | Edgy brands, Gen-Z targeting, disruptive startups |
| **3d-isometric** | Clean isometric illustrations, floating 3D elements, soft shadows, tech-forward aesthetic | Tech explainers, product features, SaaS presentations |
| **editorial** | Magazine-quality layouts, sophisticated typography hierarchy, dramatic photography, Vogue/Bloomberg aesthetic | Annual reports, luxury brands, thought leadership |
| **minimal-swiss** | Grid-based precision, Helvetica-inspired typography, bold use of negative space, timeless modernism | Architecture, design firms, premium consulting |
| **keynote** | Apple-inspired aesthetic with bold typography, dramatic imagery, high contrast, cinematic feel | Keynotes, product reveals, inspirational talks |

## Steps

### Step 1: Understand Requirements

Clarify the presentation requirements if any details are missing:

1. Identify the topic and main message
2. Confirm the desired number of slides
3. Select an appropriate style based on the use case and audience
4. Gather or infer the content structure for each slide

If the user did not specify a style, recommend one based on the context:

- Tech product launch: glassmorphism or gradient-modern
- Luxury or premium brand: dark-premium or editorial
- Startup pitch: gradient-modern or minimal-swiss
- Executive presentation: dark-premium or keynote
- Creative agency: neo-brutalist or gradient-modern
- Data or analytics: minimal-swiss or 3d-isometric

### Step 2: Create Presentation Plan

Create a JSON plan file in `~/Desktop/` with the complete presentation structure.

The plan must include:

```json
{
  "title": "Presentation Title",
  "style": "selected-style-name",
  "style_guidelines": {
    "color_palette": "Hex codes and color descriptions",
    "typography": "Font weights, sizes, and style",
    "imagery": "Visual elements and imagery direction",
    "layout": "Composition principles and spacing",
    "effects": "Visual effects and treatments"
  },
  "aspect_ratio": "16:9",
  "slides": [
    {
      "slide_number": 1,
      "type": "title",
      "title": "Main Title",
      "subtitle": "Subtitle or tagline",
      "visual_description": "Detailed description for image generation"
    },
    {
      "slide_number": 2,
      "type": "content",
      "title": "Slide Title",
      "key_points": ["Point 1", "Point 2", "Point 3"],
      "visual_description": "Detailed description for image generation"
    }
  ]
}
```

The `visual_description` field is critical. It must be extremely specific, including exact hex color codes, typography details, layout composition, and visual effects. Generic descriptions produce generic slides.

### Step 3: Read Image Generation Helper

Read `~/.agents/skills/image-generation/README.md` to understand how to properly invoke the image generation helper. This provides the interface for calling the Python generation script with prompt files and reference images.

### Step 4: Generate Slide Images Sequentially

Generate each slide image one at a time, in order. This is the most critical rule: **never generate slides in parallel or out of order**.

**For Slide 1 (the first slide):**

Create a JSON prompt file that establishes the visual style for the entire presentation:

```json
{
  "prompt": "Professional presentation slide. [style guidelines from plan]. Title: 'Your Title'. [visual_description]. This slide establishes the visual language for the entire presentation.",
  "style": "[Based on chosen style - e.g., Apple Keynote aesthetic, glassmorphism, etc.]",
  "composition": "Clean layout with clear text hierarchy, [style-specific composition]",
  "color_palette": "[From style_guidelines]",
  "typography": "[From style_guidelines]"
}
```

Generate with:

```bash
python ~/.agents/skills/image-generation/scripts/generate.py \
  --prompt-file ~/Desktop/slide-01-prompt.json \
  --output-file /tmp/slide-01.jpg \
  --aspect-ratio 16:9
```

**For Slide 2 and all subsequent slides:**

Use the previous slide as a reference image to maintain visual consistency. Create a JSON prompt that explicitly references the previous slide:

```json
{
  "prompt": "Professional presentation slide continuing the visual style from the reference image. Maintain the same color palette, typography style, and overall aesthetic. Title: 'Slide Title'. [visual_description]. Keep visual consistency with the reference.",
  "style": "Match the style of the reference image exactly",
  "composition": "Similar layout principles as reference, adapted for this content",
  "color_palette": "Same as reference image",
  "consistency_note": "This slide must look like it belongs in the same presentation as the reference image"
}
```

Generate with the reference flag:

```bash
python ~/.agents/skills/image-generation/scripts/generate.py \
  --prompt-file ~/Desktop/slide-02-prompt.json \
  --reference-images /tmp/slide-01.jpg \
  --output-file /tmp/slide-02.jpg \
  --aspect-ratio 16:9
```

**Continue this pattern for all remaining slides**, each time referencing the immediately previous slide image. The reference chaining is what ensures visual consistency across the entire presentation.

Key consistency requirements for every slide after the first:

- Include phrase: "continuing EXACT visual style from reference image"
- Specify: "SAME gradient background", "SAME glass treatment", "SAME typography"
- Add a `consistency_note` field emphasizing style matching
- Reference the immediately previous slide image

### Step 5: Compose Final PPT

After all slide images are generated, compose them into the final PPTX:

```bash
python ~/.agents/skills/ppt-generation/scripts/generate.py \
  --plan-file ~/Desktop/presentation-plan.json \
  --slide-images /tmp/slide-01.jpg /tmp/slide-02.jpg /tmp/slide-03.jpg \
  --output-file /tmp/presentation.pptx
```

Parameters:
- `--plan-file`: Absolute path to the presentation plan JSON file (required)
- `--slide-images`: Absolute paths to slide images in order, space-separated (required)
- `--output-file`: Absolute path to output PPTX file (required)

### Step 6: Deliver Output

Share the generated presentation with the user:

1. Present the PPTX file (located in `/tmp/`)
2. Optionally share individual slide images if requested
3. Provide a brief description of the presentation style and structure
4. Offer to iterate or regenerate specific slides if the results do not meet expectations

## Safety Gates

### Sequential Generation is Mandatory

Generating slides in parallel or out of order is strictly forbidden. Each slide depends on the previous slide as a reference image to maintain visual consistency. Parallel generation breaks the reference chain and produces inconsistent results.

If a background task system is available, do not use it to parallelize slide generation. Slides must be generated sequentially in a single agent thread.

### Reference Chain Integrity

The reference chain must be unbroken: Slide 2 references Slide 1, Slide 3 references Slide 2, Slide 4 references Slide 3, and so on. Skipping or reordering breaks consistency.

### Prompt Specificity Requirements

Vague prompts produce generic, unprofessional slides. Every prompt must include:

- Exact hex color codes (e.g., #667eea not "purple")
- Specific typography details: font weight, size hierarchy, letter-spacing
- Precise effect descriptions: "backdrop blur 20px", "drop shadow 8px blur 30% opacity"
- Reference to real design systems or styles when applicable

### Do Not Read Generation Scripts

The Python scripts for image generation and PPT composition are implementation details. Call them with the documented parameters but do not read the script files. This keeps the playbook focused on the workflow rather than implementation archaeology.

## Outputs

- **PPTX file**: The final composed PowerPoint presentation saved to the specified output path (default: `/tmp/`)
- **Slide images**: Individual JPEG images for each slide (available in `/tmp/` as intermediate files)
- **Presentation plan**: The JSON plan file created on `~/Desktop/`

The PPTX file is the primary deliverable. Slide images are intermediate artifacts that may be shared with the user upon request.

## Verification

After generating a presentation:

1. **Visual consistency check**: Confirm all slides share the same color palette, typography style, and visual treatment. If Slide 2 or later slides look noticeably different from Slide 1, regenerate with stronger reference emphasis.

2. **Content accuracy check**: Confirm the presentation covers the requested topic and key points. Verify each slide's content matches the user's requirements.

3. **Technical completeness check**: Confirm the PPTX file was created at the expected output path and contains the correct number of slides.

4. **Style appropriateness check**: Confirm the chosen style matches the use case and audience. A neo-brutalist style would be inappropriate for an executive boardroom presentation.

5. **User acceptance**: Present the results to the user and confirm satisfaction before marking the task complete.

## Anti-patterns

### Common Mistakes

- **Generating slides in parallel**: This breaks the reference chain and produces visually inconsistent presentations. Always generate sequentially.

- **Skipping the reference image for Slide 2+**: Without the reference, the image model has no anchor for style consistency. Every slide after the first must reference the previous slide.

- **Using generic prompts**: Phrases like "professional slide" or "clean design" are too vague. Be specific: "frosted glass panel with backdrop blur 20px, rounded corners 32px, soft purple-tinted shadow, title in SF Pro Display 72pt bold white".

- **Including too many elements per slide**: One focal point per slide. Cluttered slides are unprofessional. Maximum 3-4 key points per content slide.

- **Changing styles mid-presentation**: The plan sets one style. Do not switch to a different style for individual slides.

- **Using different aspect ratios**: Mixing 16:9 and 4:3 within a presentation causes layout problems. Choose one at the start and stay consistent.

### Negative Examples

**Do not generate slides without a reference chain:**

```bash
# WRONG - slide 2 has no reference to slide 1
python ~/.agents/skills/image-generation/scripts/generate.py \
  --prompt-file ~/Desktop/slide-02-prompt.json \
  --output-file /tmp/slide-02.jpg \
  --aspect-ratio 16:9
```

**Do not generate multiple slides simultaneously:**

```bash
# WRONG - parallel generation breaks consistency
python ~/.agents/skills/image-generation/scripts/generate.py ... &
python ~/.agents/skills/image-generation/scripts/generate.py ... &
python ~/.agents/skills/image-generation/scripts/generate.py ... &
```

**Do not use vague visual descriptions:**

```json
// WRONG - too generic
{
  "prompt": "Professional looking slide with nice design"
}

// CORRECT - specific and detailed
{
  "prompt": "Frosted glass panel with backdrop blur 20px, purple-to-cyan gradient background #667eea to #00d4ff, bold white title in SF Pro Display 72pt weight 700, subtle white border 1px rgba(255,255,255,0.25), soft purple-tinted drop shadow"
}
```
