# Choose Presentation Style

## Decision

Select the most effective presentation style for a given topic, audience, and context from the eight available styles.

## Signals/constraints

Consider these signals when choosing a style:

**Audience profile**
- Technical vs non-technical
- Executive/leadership vs creative/marketing vs engineering
- Gen-Z or millennial vs older generations
- Premium/luxury expectations vs budget-conscious

**Brand and topic**
- Established brand vs startup/disruptive
- B2B vs B2C
- Serious subject matter vs playful/creative
- Data-heavy vs narrative-driven

**Delivery context**
- Keynote stage (large screen, theatrical)
- Meeting room (collaborative, discussion-oriented)
- Conference talk (attention-grabbing)
- Boardroom or investor setting (formal, high-stakes)

**Visual assets available**
- Access to high-quality photography
- Need for illustrations/diagrams
- Brand guidelines constraining colors/fonts
- Time pressure (some styles are faster to prompt consistently)

## Options

### 1. glassmorphism

Frosted glass panels with blur effects, floating translucent cards, vibrant gradient backgrounds, depth through layering.

**Best for:** Tech products, AI/SaaS demos, futuristic pitches, product launches

**Visual language:** Apple Vision Pro / visionOS aesthetic, premium depth through transparency, 2024 design trends

**Color palette:** Vibrant gradients (purple #667eea to cyan #00d4ff), frosted white panels with 20% opacity

**Avoid when:** Audience is conservative or traditional; topic is serious/crisis-oriented; brand is heritage/luxury

---

### 2. dark-premium

Rich black backgrounds (#0a0a0a), luminous accent colors, subtle glow effects, luxury brand aesthetic.

**Best for:** Premium products, executive presentations, high-end brands, luxury tech

**Visual language:** Bang & Olufsen, Porsche Design aesthetic, sophistication through restraint

**Color palette:** Deep black base (#0a0a0a to #121212), luminous accent (electric blue #00d4ff or neon purple #bf5af2)

**Avoid when:** Presentation is long-form (dark backgrounds cause fatigue); audience prefers warmth; accessibility is critical

---

### 3. gradient-modern

Bold mesh gradients, fluid color transitions, contemporary typography, vibrant yet sophisticated.

**Best for:** Startups, creative agencies, brand launches, SaaS products, growth-stage companies

**Visual language:** Stripe, Linear, Vercel aesthetic, contemporary SaaS vibes

**Color palette:** Bold mesh gradients (purple-pink-orange #7c3aed to #f97316), cool tones (cyan-blue-purple #06b6d4 to #8b5cf6)

**Avoid when:** Brand is conservative; subject is financial/legal/medical; audience skews older or traditional

---

### 4. neo-brutalist

Raw bold typography, high contrast, intentional "ugly" aesthetic, anti-design as design, Memphis-inspired.

**Best for:** Edgy brands, Gen-Z targeting, disruptive startups, creative agency portfolios, youth-focused products

**Visual language:** Anti-corporate rebellion, DIY zine meets digital, raw authenticity

**Color palette:** High contrast primaries (stark black, pure white, hot pink #ff0080 or electric yellow #ffff00)

**Avoid when:** Executive audience; serious subject matter; established enterprise brand; healthcare, finance, legal contexts

---

### 5. 3d-isometric

Clean isometric illustrations, floating 3D elements, soft shadows, tech-forward aesthetic.

**Best for:** Tech explainers, product features, SaaS presentations, software demonstrations, onboarding flows

**Visual language:** Slack, Notion, Asana illustration style, friendly tech, approachable complexity

**Color palette:** Soft contemporary (muted purples #8b5cf6, teals #14b8a6, warm corals #fb7185), cream backgrounds #fafafa

**Avoid when:** Presenting to non-technical audience needing gravitas; luxury/premium context; very short time window (isometric takes more prompt iteration)

---

### 6. editorial

Magazine-quality layouts, sophisticated typography hierarchy, dramatic photography, Vogue/Bloomberg aesthetic.

**Best for:** Annual reports, luxury brands, thought leadership, high-end publishing, prestige topics

**Visual language:** Vogue, Bloomberg Businessweek aesthetic, intellectual sophistication, content elevated through restraint

**Color palette:** Sophisticated neutrals (off-white #f5f5f0, charcoal #2d2d2d), single accent (burgundy #7c2d12 or navy #1e3a5f)

**Avoid when:** Fast-paced presentation; non-premium subject; limited access to high-quality photography; tech-heavy product demo

---

### 7. minimal-swiss

Grid-based precision, Helvetica-inspired typography, bold use of negative space, timeless modernism.

**Best for:** Architecture, design firms, premium consulting, data-heavy presentations, academic contexts

**Visual language:** International Typographic Style, form follows function, Dieter Rams-inspired restraint, timeless modernism

**Color palette:** Pure white (#ffffff) or off-white (#fafaf9) backgrounds, true black (#000000) text, single bold accent (Swiss red #ff0000 or Klein blue #002fa7)

**Avoid when:** Brand is playful or colorful; creative pitch context; audience needs emotional engagement; startup/high-energy context

---

### 8. keynote

Apple-inspired aesthetic with bold typography, dramatic imagery, high contrast, cinematic feel.

**Best for:** Keynotes, product reveals, inspirational talks, Apple-scale presentations, high-impact moments

**Visual language:** Apple WWDC keynote aesthetic, confidence through simplicity, theatrical presentation, San Francisco Pro Display typography

**Color palette:** Deep blacks (#000000 to #1d1d1f), pure white text, signature blue (#0071e3) or gradient accents

**Avoid when:** Collaborative meeting setting; informal context; audience is skeptical of "big reveal" format; ongoing working session

---

## Recommendation rule

Match style to the intersection of **audience** and **context**:

1. **Tech product launch / AI / SaaS demo** -> glassmorphism or gradient-modern
2. **Luxury / premium / executive** -> dark-premium or editorial
3. **Startup pitch / creative agency** -> gradient-modern or neo-brutalist
4. **Enterprise / consulting / architecture** -> minimal-swiss
5. **Keynote stage / product reveal** -> keynote
6. **Tech explainer / product features** -> 3d-isometric
7. **Annual report / thought leadership** -> editorial

When audience and context conflict, **audience wins** — a conservative boardroom audience will reject neo-brutalist even if the topic is a disruptive startup.

Default to **gradient-modern** for unknown audiences — it is safe, contemporary, and widely accepted across industries.

---

## Tradeoffs

| Style | Strength | Weakness |
|-------|----------|----------|
| glassmorphism | Cutting-edge, memorable, premium tech feel | Can feel overused in tech; risks looking generic if not executed precisely |
| dark-premium | Sophisticated, high-impact, luxury appeal | Fatiguing in long presentations; risky if photography is low-quality |
| gradient-modern | Versatile, energetic, startup-friendly | Can look like many other pitches; less distinctive |
| neo-brutalist | Memorable, attention-grabbing, youth appeal | Alienates conservative audiences; not serious enough for enterprise |
| 3d-isometric | Approachable, clarifies complex topics | Less dramatic than photo-based styles; requires more prompt iteration |
| editorial | Timeless, high prestige, sophisticated | Demands high-quality photography; formal and distant |
| minimal-swiss | Clean, professional, data-friendly | Can feel cold or corporate; lacks emotional impact |
| keynote | Theatrical, high-impact, Apple-quality | Ridicule if execution is imperfect; over-the-top for small rooms |

---

## Verification

After selecting a style, verify the choice by checking:

- Does the style match the **audience's expectations** for the context?
- Is the **topic suitable** for the visual language (no forcing a playful style onto serious content)?
- Do you have access to **visual assets** that match the style's requirements (photography for editorial, illustrations for 3d-isometric)?
- Is there **time** for sequential slide generation with proper reference chaining, or should a simpler style be chosen?
- Does the style **work in the physical space** (dark-premium and keynote need dimmed rooms; minimal-swiss works in bright meeting rooms)?
