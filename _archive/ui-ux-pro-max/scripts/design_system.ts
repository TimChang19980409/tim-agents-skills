#!/usr/bin/env bun
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { search, DATA_DIR } from "./core.ts";

type SearchRecord = Record<string, string>;

type ReasoningResult = {
  pattern: string;
  style_priority: string[];
  color_mood: string;
  typography_mood: string;
  key_effects: string;
  anti_patterns: string;
  decision_rules: Record<string, unknown>;
  severity: string;
};

type DesignSystem = {
  project_name: string;
  category: string;
  pattern: {
    name: string;
    sections: string;
    cta_placement: string;
    color_strategy: string;
    conversion: string;
  };
  style: {
    name: string;
    type: string;
    effects: string;
    keywords: string;
    best_for: string;
    performance: string;
    accessibility: string;
  };
  colors: {
    primary: string;
    secondary: string;
    cta: string;
    background: string;
    text: string;
    notes: string;
  };
  typography: {
    heading: string;
    body: string;
    mood: string;
    best_for: string;
    google_fonts_url: string;
    css_import: string;
  };
  key_effects: string;
  anti_patterns: string;
  decision_rules: Record<string, unknown>;
  severity: string;
};

const REASONING_FILE = "ui-reasoning.csv";

const SEARCH_CONFIG: Record<string, { max_results: number }> = {
  product: { max_results: 1 },
  style: { max_results: 3 },
  color: { max_results: 2 },
  landing: { max_results: 2 },
  typography: { max_results: 2 },
};

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

function loadCsvRows(filepath: string): SearchRecord[] {
  if (!existsSync(filepath)) return [];
  const rows = parseCsv(readFileSync(filepath, "utf8"));
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj: SearchRecord = {};
    for (let i = 0; i < headers.length; i += 1) {
      obj[headers[i]] = r[i] ?? "";
    }
    return obj;
  });
}

class DesignSystemGenerator {
  private reasoningData: SearchRecord[];

  constructor() {
    this.reasoningData = this.loadReasoning();
  }

  private loadReasoning(): SearchRecord[] {
    const filepath = join(DATA_DIR, REASONING_FILE);
    return loadCsvRows(filepath);
  }

  private multiDomainSearch(query: string, stylePriority?: string[]): Record<string, ReturnType<typeof search>> {
    const results: Record<string, ReturnType<typeof search>> = {};

    for (const [domain, config] of Object.entries(SEARCH_CONFIG)) {
      if (domain === "style" && stylePriority && stylePriority.length > 0) {
        const priorityQuery = stylePriority.slice(0, 2).join(" ");
        results[domain] = search(`${query} ${priorityQuery}`, domain, config.max_results);
      } else {
        results[domain] = search(query, domain, config.max_results);
      }
    }

    return results;
  }

  private findReasoningRule(category: string): SearchRecord {
    const categoryLower = category.toLowerCase();

    for (const rule of this.reasoningData) {
      if ((rule.UI_Category ?? "").toLowerCase() === categoryLower) {
        return rule;
      }
    }

    for (const rule of this.reasoningData) {
      const uiCat = (rule.UI_Category ?? "").toLowerCase();
      if (uiCat.includes(categoryLower) || categoryLower.includes(uiCat)) {
        return rule;
      }
    }

    for (const rule of this.reasoningData) {
      const uiCat = (rule.UI_Category ?? "").toLowerCase();
      const keywords = uiCat.replaceAll("/", " ").replaceAll("-", " ").split(/\s+/);
      if (keywords.some((kw) => kw && categoryLower.includes(kw))) {
        return rule;
      }
    }

    return {};
  }

  private applyReasoning(category: string): ReasoningResult {
    const rule = this.findReasoningRule(category);
    if (Object.keys(rule).length === 0) {
      return {
        pattern: "Hero + Features + CTA",
        style_priority: ["Minimalism", "Flat Design"],
        color_mood: "Professional",
        typography_mood: "Clean",
        key_effects: "Subtle hover transitions",
        anti_patterns: "",
        decision_rules: {},
        severity: "MEDIUM",
      };
    }

    let decisionRules: Record<string, unknown> = {};
    try {
      decisionRules = JSON.parse(rule.Decision_Rules ?? "{}");
    } catch {
      decisionRules = {};
    }

    return {
      pattern: rule.Recommended_Pattern ?? "",
      style_priority: (rule.Style_Priority ?? "")
        .split("+")
        .map((s) => s.trim())
        .filter(Boolean),
      color_mood: rule.Color_Mood ?? "",
      typography_mood: rule.Typography_Mood ?? "",
      key_effects: rule.Key_Effects ?? "",
      anti_patterns: rule.Anti_Patterns ?? "",
      decision_rules: decisionRules,
      severity: rule.Severity ?? "MEDIUM",
    };
  }

  private selectBestMatch(results: SearchRecord[], priorityKeywords: string[]): SearchRecord {
    if (results.length === 0) return {};
    if (priorityKeywords.length === 0) return results[0];

    for (const priority of priorityKeywords) {
      const priorityLower = priority.toLowerCase().trim();
      for (const result of results) {
        const styleName = (result["Style Category"] ?? "").toLowerCase();
        if (styleName.includes(priorityLower) || priorityLower.includes(styleName)) {
          return result;
        }
      }
    }

    const scored = results
      .map((result) => {
        const resultStr = JSON.stringify(result).toLowerCase();
        let score = 0;
        for (const kw of priorityKeywords) {
          const kwLower = kw.toLowerCase().trim();
          if ((result["Style Category"] ?? "").toLowerCase().includes(kwLower)) {
            score += 10;
          } else if ((result.Keywords ?? "").toLowerCase().includes(kwLower)) {
            score += 3;
          } else if (resultStr.includes(kwLower)) {
            score += 1;
          }
        }
        return { score, result };
      })
      .sort((a, b) => b.score - a.score);

    return scored.length > 0 && scored[0].score > 0 ? scored[0].result : results[0];
  }

  generate(query: string, projectName?: string): DesignSystem {
    const productResult = search(query, "product", 1);
    const productResults = productResult.results ?? [];
    const category = productResults.length > 0 ? productResults[0]["Product Type"] ?? "General" : "General";

    const reasoning = this.applyReasoning(category);
    const searchResults = this.multiDomainSearch(query, reasoning.style_priority);
    searchResults.product = productResult;

    const styleResults = searchResults.style?.results ?? [];
    const colorResults = searchResults.color?.results ?? [];
    const typographyResults = searchResults.typography?.results ?? [];
    const landingResults = searchResults.landing?.results ?? [];

    const bestStyle = this.selectBestMatch(styleResults, reasoning.style_priority);
    const bestColor = colorResults[0] ?? {};
    const bestTypography = typographyResults[0] ?? {};
    const bestLanding = landingResults[0] ?? {};

    const styleEffects = bestStyle["Effects & Animation"] ?? "";
    const combinedEffects = styleEffects || reasoning.key_effects;

    return {
      project_name: projectName ?? query.toUpperCase(),
      category,
      pattern: {
        name: bestLanding["Pattern Name"] ?? reasoning.pattern,
        sections: bestLanding["Section Order"] ?? "Hero > Features > CTA",
        cta_placement: bestLanding["Primary CTA Placement"] ?? "Above fold",
        color_strategy: bestLanding["Color Strategy"] ?? "",
        conversion: bestLanding["Conversion Optimization"] ?? "",
      },
      style: {
        name: bestStyle["Style Category"] ?? "Minimalism",
        type: bestStyle.Type ?? "General",
        effects: styleEffects,
        keywords: bestStyle.Keywords ?? "",
        best_for: bestStyle["Best For"] ?? "",
        performance: bestStyle.Performance ?? "",
        accessibility: bestStyle.Accessibility ?? "",
      },
      colors: {
        primary: bestColor["Primary (Hex)"] ?? "#2563EB",
        secondary: bestColor["Secondary (Hex)"] ?? "#3B82F6",
        cta: bestColor["CTA (Hex)"] ?? "#F97316",
        background: bestColor["Background (Hex)"] ?? "#F8FAFC",
        text: bestColor["Text (Hex)"] ?? "#1E293B",
        notes: bestColor.Notes ?? "",
      },
      typography: {
        heading: bestTypography["Heading Font"] ?? "Inter",
        body: bestTypography["Body Font"] ?? "Inter",
        mood: bestTypography["Mood/Style Keywords"] ?? reasoning.typography_mood,
        best_for: bestTypography["Best For"] ?? "",
        google_fonts_url: bestTypography["Google Fonts URL"] ?? "",
        css_import: bestTypography["CSS Import"] ?? "",
      },
      key_effects: combinedEffects,
      anti_patterns: reasoning.anti_patterns,
      decision_rules: reasoning.decision_rules,
      severity: reasoning.severity,
    };
  }
}

const BOX_WIDTH = 90;

function wrapText(text: string, prefix: string, width: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = prefix;

  for (const word of words) {
    const candidate = current === prefix ? `${current}${word}` : `${current} ${word}`;
    if (candidate.length <= width - 2) {
      current = candidate;
    } else {
      if (current !== prefix) lines.push(current);
      current = `${prefix}${word}`;
    }
  }
  if (current !== prefix) lines.push(current);
  return lines;
}

export function formatAsciiBox(designSystem: DesignSystem): string {
  const pattern = designSystem.pattern;
  const style = designSystem.style;
  const colors = designSystem.colors;
  const typography = designSystem.typography;

  const lines: string[] = [];
  const w = BOX_WIDTH - 1;

  lines.push(`+${"-".repeat(w)}+`);
  lines.push(`|  TARGET: ${designSystem.project_name} - RECOMMENDED DESIGN SYSTEM`.padEnd(BOX_WIDTH) + "|");
  lines.push(`+${"-".repeat(w)}+`);
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  lines.push(`|  PATTERN: ${pattern.name}`.padEnd(BOX_WIDTH) + "|");
  if (pattern.conversion) lines.push(`|     Conversion: ${pattern.conversion}`.padEnd(BOX_WIDTH) + "|");
  if (pattern.cta_placement) lines.push(`|     CTA: ${pattern.cta_placement}`.padEnd(BOX_WIDTH) + "|");
  lines.push("|     Sections:".padEnd(BOX_WIDTH) + "|");
  for (const [idx, section] of pattern.sections.split(">").map((x) => x.trim()).filter(Boolean).entries()) {
    lines.push(`|       ${idx + 1}. ${section}`.padEnd(BOX_WIDTH) + "|");
  }
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  lines.push(`|  STYLE: ${style.name}`.padEnd(BOX_WIDTH) + "|");
  for (const line of wrapText(`Keywords: ${style.keywords}`, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
  for (const line of wrapText(`Best For: ${style.best_for}`, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
  if (style.performance || style.accessibility) {
    lines.push(`|     Performance: ${style.performance} | Accessibility: ${style.accessibility}`.padEnd(BOX_WIDTH) + "|");
  }
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  lines.push("|  COLORS:".padEnd(BOX_WIDTH) + "|");
  lines.push(`|     Primary:    ${colors.primary}`.padEnd(BOX_WIDTH) + "|");
  lines.push(`|     Secondary:  ${colors.secondary}`.padEnd(BOX_WIDTH) + "|");
  lines.push(`|     CTA:        ${colors.cta}`.padEnd(BOX_WIDTH) + "|");
  lines.push(`|     Background: ${colors.background}`.padEnd(BOX_WIDTH) + "|");
  lines.push(`|     Text:       ${colors.text}`.padEnd(BOX_WIDTH) + "|");
  for (const line of wrapText(`Notes: ${colors.notes}`, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  lines.push(`|  TYPOGRAPHY: ${typography.heading} / ${typography.body}`.padEnd(BOX_WIDTH) + "|");
  for (const line of wrapText(`Mood: ${typography.mood}`, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
  for (const line of wrapText(`Best For: ${typography.best_for}`, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
  if (typography.google_fonts_url) lines.push(`|     Google Fonts: ${typography.google_fonts_url}`.padEnd(BOX_WIDTH) + "|");
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  if (designSystem.key_effects) {
    lines.push("|  KEY EFFECTS:".padEnd(BOX_WIDTH) + "|");
    for (const line of wrapText(designSystem.key_effects, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
    lines.push(`|${" ".repeat(BOX_WIDTH)}|`);
  }

  if (designSystem.anti_patterns) {
    lines.push("|  AVOID (Anti-patterns):".padEnd(BOX_WIDTH) + "|");
    for (const line of wrapText(designSystem.anti_patterns, "|     ", BOX_WIDTH)) lines.push(line.padEnd(BOX_WIDTH) + "|");
    lines.push(`|${" ".repeat(BOX_WIDTH)}|`);
  }

  lines.push("|  PRE-DELIVERY CHECKLIST:".padEnd(BOX_WIDTH) + "|");
  const checklistItems = [
    "[ ] No emojis as icons (use SVG: Heroicons/Lucide)",
    "[ ] cursor-pointer on all clickable elements",
    "[ ] Hover states with smooth transitions (150-300ms)",
    "[ ] Light mode: text contrast 4.5:1 minimum",
    "[ ] Focus states visible for keyboard nav",
    "[ ] prefers-reduced-motion respected",
    "[ ] Responsive: 375px, 768px, 1024px, 1440px",
  ];
  for (const item of checklistItems) {
    lines.push(`|     ${item}`.padEnd(BOX_WIDTH) + "|");
  }
  lines.push(`|${" ".repeat(BOX_WIDTH)}|`);

  lines.push(`+${"-".repeat(w)}+`);
  return lines.join("\n");
}

export function formatMarkdown(designSystem: DesignSystem): string {
  const pattern = designSystem.pattern;
  const style = designSystem.style;
  const colors = designSystem.colors;
  const typography = designSystem.typography;

  const lines: string[] = [];
  lines.push(`## Design System: ${designSystem.project_name}`);
  lines.push("");
  lines.push("### Pattern");
  lines.push(`- **Name:** ${pattern.name}`);
  if (pattern.conversion) lines.push(`- **Conversion Focus:** ${pattern.conversion}`);
  if (pattern.cta_placement) lines.push(`- **CTA Placement:** ${pattern.cta_placement}`);
  if (pattern.color_strategy) lines.push(`- **Color Strategy:** ${pattern.color_strategy}`);
  lines.push(`- **Sections:** ${pattern.sections}`);
  lines.push("");

  lines.push("### Style");
  lines.push(`- **Name:** ${style.name}`);
  if (style.keywords) lines.push(`- **Keywords:** ${style.keywords}`);
  if (style.best_for) lines.push(`- **Best For:** ${style.best_for}`);
  if (style.performance || style.accessibility) {
    lines.push(`- **Performance:** ${style.performance} | **Accessibility:** ${style.accessibility}`);
  }
  lines.push("");

  lines.push("### Colors");
  lines.push("| Role | Hex |");
  lines.push("|------|-----|");
  lines.push(`| Primary | ${colors.primary} |`);
  lines.push(`| Secondary | ${colors.secondary} |`);
  lines.push(`| CTA | ${colors.cta} |`);
  lines.push(`| Background | ${colors.background} |`);
  lines.push(`| Text | ${colors.text} |`);
  if (colors.notes) lines.push(`\n*Notes: ${colors.notes}*`);
  lines.push("");

  lines.push("### Typography");
  lines.push(`- **Heading:** ${typography.heading}`);
  lines.push(`- **Body:** ${typography.body}`);
  if (typography.mood) lines.push(`- **Mood:** ${typography.mood}`);
  if (typography.best_for) lines.push(`- **Best For:** ${typography.best_for}`);
  if (typography.google_fonts_url) lines.push(`- **Google Fonts:** ${typography.google_fonts_url}`);
  if (typography.css_import) {
    lines.push("- **CSS Import:**");
    lines.push("```css");
    lines.push(typography.css_import);
    lines.push("```");
  }
  lines.push("");

  if (designSystem.key_effects) {
    lines.push("### Key Effects");
    lines.push(designSystem.key_effects);
    lines.push("");
  }

  if (designSystem.anti_patterns) {
    lines.push("### Avoid (Anti-patterns)");
    lines.push(`- ${designSystem.anti_patterns.replaceAll(" + ", "\n- ")}`);
    lines.push("");
  }

  lines.push("### Pre-Delivery Checklist");
  lines.push("- [ ] No emojis as icons (use SVG: Heroicons/Lucide)");
  lines.push("- [ ] cursor-pointer on all clickable elements");
  lines.push("- [ ] Hover states with smooth transitions (150-300ms)");
  lines.push("- [ ] Light mode: text contrast 4.5:1 minimum");
  lines.push("- [ ] Focus states visible for keyboard nav");
  lines.push("- [ ] prefers-reduced-motion respected");
  lines.push("- [ ] Responsive: 375px, 768px, 1024px, 1440px");
  lines.push("");

  return lines.join("\n");
}

function nowTs(): string {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function formatMasterMd(designSystem: DesignSystem): string {
  const pattern = designSystem.pattern;
  const style = designSystem.style;
  const colors = designSystem.colors;
  const typography = designSystem.typography;

  const lines: string[] = [];
  lines.push("# Design System Master File");
  lines.push("");
  lines.push("> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.");
  lines.push("> If that file exists, its rules **override** this Master file.");
  lines.push("> If not, strictly follow the rules below.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`**Project:** ${designSystem.project_name}`);
  lines.push(`**Generated:** ${nowTs()}`);
  lines.push(`**Category:** ${designSystem.category}`);
  lines.push("");
  lines.push("## Global Rules");
  lines.push("");
  lines.push("### Color Palette");
  lines.push("");
  lines.push("| Role | Hex | CSS Variable |");
  lines.push("|------|-----|--------------|");
  lines.push(`| Primary | \`${colors.primary}\` | \`--color-primary\` |`);
  lines.push(`| Secondary | \`${colors.secondary}\` | \`--color-secondary\` |`);
  lines.push(`| CTA/Accent | \`${colors.cta}\` | \`--color-cta\` |`);
  lines.push(`| Background | \`${colors.background}\` | \`--color-background\` |`);
  lines.push(`| Text | \`${colors.text}\` | \`--color-text\` |`);
  lines.push("");
  lines.push("### Typography");
  lines.push("");
  lines.push(`- **Heading Font:** ${typography.heading}`);
  lines.push(`- **Body Font:** ${typography.body}`);
  if (typography.mood) lines.push(`- **Mood:** ${typography.mood}`);
  if (typography.google_fonts_url) lines.push(`- **Google Fonts:** ${typography.google_fonts_url}`);
  lines.push("");
  lines.push("## Component Specs");
  lines.push("");
  lines.push("### Buttons");
  lines.push("```css");
  lines.push(`.btn-primary { background: ${colors.cta}; color: white; padding: 12px 24px; border-radius: 8px; transition: all 200ms ease; cursor: pointer; }`);
  lines.push(`.btn-secondary { background: transparent; color: ${colors.primary}; border: 2px solid ${colors.primary}; padding: 12px 24px; border-radius: 8px; transition: all 200ms ease; cursor: pointer; }`);
  lines.push("```");
  lines.push("");
  lines.push("### Cards");
  lines.push("```css");
  lines.push(`.card { background: ${colors.background}; border-radius: 12px; padding: 24px; box-shadow: var(--shadow-md); transition: all 200ms ease; cursor: pointer; }`);
  lines.push("```");
  lines.push("");
  lines.push("## Style Guidelines");
  lines.push("");
  lines.push(`**Style:** ${style.name}`);
  if (style.keywords) lines.push(`\n**Keywords:** ${style.keywords}`);
  if (style.best_for) lines.push(`\n**Best For:** ${style.best_for}`);
  if (designSystem.key_effects) lines.push(`\n**Key Effects:** ${designSystem.key_effects}`);
  lines.push("");
  lines.push("### Page Pattern");
  lines.push(`- **Pattern Name:** ${pattern.name}`);
  lines.push(`- **Section Order:** ${pattern.sections}`);
  if (pattern.cta_placement) lines.push(`- **CTA Placement:** ${pattern.cta_placement}`);
  if (pattern.conversion) lines.push(`- **Conversion Strategy:** ${pattern.conversion}`);
  lines.push("");
  lines.push("## Anti-Patterns (Do NOT Use)");
  lines.push("");
  if (designSystem.anti_patterns) {
    for (const item of designSystem.anti_patterns.split("+").map((x) => x.trim()).filter(Boolean)) {
      lines.push(`- ❌ ${item}`);
    }
  }
  lines.push("- ❌ Emojis as icons — Use SVG icons");
  lines.push("- ❌ Missing cursor:pointer on clickable elements");
  lines.push("- ❌ Invisible focus states");
  lines.push("");
  lines.push("## Pre-Delivery Checklist");
  lines.push("");
  lines.push("- [ ] No emojis used as icons (use SVG instead)");
  lines.push("- [ ] cursor-pointer on all clickable elements");
  lines.push("- [ ] Hover states with smooth transitions (150-300ms)");
  lines.push("- [ ] Light mode: text contrast 4.5:1 minimum");
  lines.push("- [ ] Focus states visible for keyboard navigation");
  lines.push("- [ ] prefers-reduced-motion respected");
  lines.push("- [ ] Responsive: 375px, 768px, 1024px, 1440px");

  return lines.join("\n");
}

function detectPageType(context: string, styleResults: SearchRecord[]): string {
  const contextLower = context.toLowerCase();

  const pagePatterns: Array<[string[], string]> = [
    [["dashboard", "admin", "analytics", "data", "metrics", "stats", "monitor", "overview"], "Dashboard / Data View"],
    [["checkout", "payment", "cart", "purchase", "order", "billing"], "Checkout / Payment"],
    [["settings", "profile", "account", "preferences", "config"], "Settings / Profile"],
    [["landing", "marketing", "homepage", "hero", "home", "promo"], "Landing / Marketing"],
    [["login", "signin", "signup", "register", "auth", "password"], "Authentication"],
    [["pricing", "plans", "subscription", "tiers", "packages"], "Pricing / Plans"],
    [["blog", "article", "post", "news", "content", "story"], "Blog / Article"],
    [["product", "item", "detail", "pdp", "shop", "store"], "Product Detail"],
    [["search", "results", "browse", "filter", "catalog", "list"], "Search Results"],
    [["empty", "404", "error", "not found", "zero"], "Empty State"],
  ];

  for (const [keywords, pageType] of pagePatterns) {
    if (keywords.some((kw) => contextLower.includes(kw))) return pageType;
  }

  if (styleResults.length > 0) {
    const bestFor = (styleResults[0]["Best For"] ?? "").toLowerCase();
    if (bestFor.includes("dashboard") || bestFor.includes("data")) return "Dashboard / Data View";
    if (bestFor.includes("landing") || bestFor.includes("marketing")) return "Landing / Marketing";
  }

  return "General";
}

function generateIntelligentOverrides(pageName: string, pageQuery: string | undefined, designSystem: DesignSystem): Record<string, unknown> {
  const context = `${pageName.toLowerCase()} ${(pageQuery ?? "").toLowerCase()}`.trim();
  const styleSearch = search(context, "style", 1);
  const uxSearch = search(context, "ux", 3);
  const landingSearch = search(context, "landing", 1);

  const styleResults = styleSearch.results ?? [];
  const uxResults = uxSearch.results ?? [];
  const landingResults = landingSearch.results ?? [];

  const layout: Record<string, string> = {};
  const spacing: Record<string, string> = {};
  const typography: Record<string, string> = {};
  const colors: Record<string, string> = {};
  const components: string[] = [];
  const uniqueComponents: string[] = [];
  const recommendations: string[] = [];

  if (styleResults.length > 0) {
    const style = styleResults[0];
    const keywords = (style.Keywords ?? "").toLowerCase();

    if (["data", "dense", "dashboard", "grid"].some((kw) => keywords.includes(kw))) {
      layout["Max Width"] = "1400px or full-width";
      layout.Grid = "12-column grid for data flexibility";
      spacing["Content Density"] = "High - optimize for information display";
    } else if (["minimal", "simple", "clean", "single"].some((kw) => keywords.includes(kw))) {
      layout["Max Width"] = "800px (narrow, focused)";
      layout.Layout = "Single column, centered";
      spacing["Content Density"] = "Low - focus on clarity";
    } else {
      layout["Max Width"] = "1200px (standard)";
      layout.Layout = "Full-width sections, centered content";
    }

    if (style["Effects & Animation"]) {
      recommendations.push(`Effects: ${style["Effects & Animation"]}`);
    }
  }

  for (const ux of uxResults) {
    if (ux.Do) recommendations.push(`${ux.Category}: ${ux.Do}`);
    if (ux["Don't"]) components.push(`Avoid: ${ux["Don't"]}`);
  }

  if (landingResults.length > 0) {
    const landing = landingResults[0];
    if (landing["Section Order"]) layout.Sections = landing["Section Order"];
    if (landing["Primary CTA Placement"]) recommendations.push(`CTA Placement: ${landing["Primary CTA Placement"]}`);
    if (landing["Color Strategy"]) colors.Strategy = landing["Color Strategy"];
  }

  if (Object.keys(layout).length === 0) {
    layout["Max Width"] = "1200px";
    layout.Layout = "Responsive grid";
  }

  if (recommendations.length === 0) {
    recommendations.push("Refer to MASTER.md for all design rules", "Add specific overrides as needed for this page");
  }

  return {
    page_type: detectPageType(context, styleResults),
    layout,
    spacing,
    typography,
    colors,
    components,
    unique_components: uniqueComponents,
    recommendations,
    project: designSystem.project_name,
  };
}

export function formatPageOverrideMd(designSystem: DesignSystem, pageName: string, pageQuery?: string): string {
  const pageTitle = pageName.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const overrides = generateIntelligentOverrides(pageName, pageQuery, designSystem);

  const lines: string[] = [];
  lines.push(`# ${pageTitle} Page Overrides`);
  lines.push("");
  lines.push(`> **PROJECT:** ${designSystem.project_name}`);
  lines.push(`> **Generated:** ${nowTs()}`);
  lines.push(`> **Page Type:** ${String(overrides.page_type ?? "General")}`);
  lines.push("");
  lines.push("> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).");
  lines.push("");
  lines.push("## Page-Specific Rules");
  lines.push("");

  const sections: Array<[string, Record<string, string>]> = [
    ["Layout Overrides", overrides.layout as Record<string, string>],
    ["Spacing Overrides", overrides.spacing as Record<string, string>],
    ["Typography Overrides", overrides.typography as Record<string, string>],
    ["Color Overrides", overrides.colors as Record<string, string>],
  ];

  for (const [title, data] of sections) {
    lines.push(`### ${title}`);
    if (Object.keys(data).length === 0) {
      lines.push("- No overrides - use Master defaults");
    } else {
      for (const [k, v] of Object.entries(data)) {
        lines.push(`- **${k}:** ${v}`);
      }
    }
    lines.push("");
  }

  lines.push("### Component Overrides");
  const components = overrides.components as string[];
  if (!components || components.length === 0) {
    lines.push("- No overrides - use Master component specs");
  } else {
    for (const comp of components) lines.push(`- ${comp}`);
  }
  lines.push("");

  lines.push("## Recommendations");
  const recommendations = overrides.recommendations as string[];
  for (const rec of recommendations) lines.push(`- ${rec}`);
  lines.push("");

  return lines.join("\n");
}

export function persistDesignSystem(
  designSystem: DesignSystem,
  page?: string,
  outputDir?: string,
  pageQuery?: string,
): { status: string; design_system_dir: string; created_files: string[] } {
  const baseDir = outputDir ? resolve(outputDir) : process.cwd();
  const projectSlug = (designSystem.project_name || "default").toLowerCase().replace(/\s+/g, "-");

  const designSystemDir = join(baseDir, "design-system", projectSlug);
  const pagesDir = join(designSystemDir, "pages");
  mkdirSync(pagesDir, { recursive: true });

  const created: string[] = [];

  const masterFile = join(designSystemDir, "MASTER.md");
  writeFileSync(masterFile, formatMasterMd(designSystem), "utf8");
  created.push(masterFile);

  if (page) {
    const pageFile = join(pagesDir, `${page.toLowerCase().replace(/\s+/g, "-")}.md`);
    writeFileSync(pageFile, formatPageOverrideMd(designSystem, page, pageQuery), "utf8");
    created.push(pageFile);
  }

  return {
    status: "success",
    design_system_dir: designSystemDir,
    created_files: created,
  };
}

export function generateDesignSystem(
  query: string,
  projectName?: string,
  outputFormat: "ascii" | "markdown" = "ascii",
  persist = false,
  page?: string,
  outputDir?: string,
): string {
  const generator = new DesignSystemGenerator();
  const designSystem = generator.generate(query, projectName);

  if (persist) {
    persistDesignSystem(designSystem, page, outputDir, query);
  }

  if (outputFormat === "markdown") {
    return formatMarkdown(designSystem);
  }
  return formatAsciiBox(designSystem);
}

if (import.meta.main) {
  const query = process.argv[2];
  const projectName = process.argv[3];
  const format = (process.argv[4] as "ascii" | "markdown" | undefined) ?? "ascii";

  if (!query) {
    console.error("Usage: bun scripts/design_system.ts <query> [projectName] [ascii|markdown]");
    process.exit(1);
  }

  console.log(generateDesignSystem(query, projectName, format));
}
