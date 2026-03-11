#!/usr/bin/env bun
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const DATA_DIR = join(import.meta.dir, "..", "data");
export const MAX_RESULTS = 3;

export const CSV_CONFIG: Record<
  string,
  { file: string; search_cols: string[]; output_cols: string[] }
> = {
  style: {
    file: "styles.csv",
    search_cols: ["Style Category", "Keywords", "Best For", "Type", "AI Prompt Keywords"],
    output_cols: [
      "Style Category",
      "Type",
      "Keywords",
      "Primary Colors",
      "Effects & Animation",
      "Best For",
      "Performance",
      "Accessibility",
      "Framework Compatibility",
      "Complexity",
      "AI Prompt Keywords",
      "CSS/Technical Keywords",
      "Implementation Checklist",
      "Design System Variables",
    ],
  },
  color: {
    file: "colors.csv",
    search_cols: ["Product Type", "Notes"],
    output_cols: ["Product Type", "Primary (Hex)", "Secondary (Hex)", "CTA (Hex)", "Background (Hex)", "Text (Hex)", "Notes"],
  },
  chart: {
    file: "charts.csv",
    search_cols: ["Data Type", "Keywords", "Best Chart Type", "Accessibility Notes"],
    output_cols: [
      "Data Type",
      "Keywords",
      "Best Chart Type",
      "Secondary Options",
      "Color Guidance",
      "Accessibility Notes",
      "Library Recommendation",
      "Interactive Level",
    ],
  },
  landing: {
    file: "landing.csv",
    search_cols: ["Pattern Name", "Keywords", "Conversion Optimization", "Section Order"],
    output_cols: ["Pattern Name", "Keywords", "Section Order", "Primary CTA Placement", "Color Strategy", "Conversion Optimization"],
  },
  product: {
    file: "products.csv",
    search_cols: ["Product Type", "Keywords", "Primary Style Recommendation", "Key Considerations"],
    output_cols: [
      "Product Type",
      "Keywords",
      "Primary Style Recommendation",
      "Secondary Styles",
      "Landing Page Pattern",
      "Dashboard Style (if applicable)",
      "Color Palette Focus",
    ],
  },
  ux: {
    file: "ux-guidelines.csv",
    search_cols: ["Category", "Issue", "Description", "Platform"],
    output_cols: ["Category", "Issue", "Platform", "Description", "Do", "Don't", "Code Example Good", "Code Example Bad", "Severity"],
  },
  typography: {
    file: "typography.csv",
    search_cols: ["Font Pairing Name", "Category", "Mood/Style Keywords", "Best For", "Heading Font", "Body Font"],
    output_cols: [
      "Font Pairing Name",
      "Category",
      "Heading Font",
      "Body Font",
      "Mood/Style Keywords",
      "Best For",
      "Google Fonts URL",
      "CSS Import",
      "Tailwind Config",
      "Notes",
    ],
  },
  icons: {
    file: "icons.csv",
    search_cols: ["Category", "Icon Name", "Keywords", "Best For"],
    output_cols: ["Category", "Icon Name", "Keywords", "Library", "Import Code", "Usage", "Best For", "Style"],
  },
  react: {
    file: "react-performance.csv",
    search_cols: ["Category", "Issue", "Keywords", "Description"],
    output_cols: ["Category", "Issue", "Platform", "Description", "Do", "Don't", "Code Example Good", "Code Example Bad", "Severity"],
  },
  web: {
    file: "web-interface.csv",
    search_cols: ["Category", "Issue", "Keywords", "Description"],
    output_cols: ["Category", "Issue", "Platform", "Description", "Do", "Don't", "Code Example Good", "Code Example Bad", "Severity"],
  },
};

export const STACK_CONFIG: Record<string, { file: string }> = {
  "html-tailwind": { file: "stacks/html-tailwind.csv" },
  react: { file: "stacks/react.csv" },
  nextjs: { file: "stacks/nextjs.csv" },
  astro: { file: "stacks/astro.csv" },
  vue: { file: "stacks/vue.csv" },
  nuxtjs: { file: "stacks/nuxtjs.csv" },
  "nuxt-ui": { file: "stacks/nuxt-ui.csv" },
  svelte: { file: "stacks/svelte.csv" },
  swiftui: { file: "stacks/swiftui.csv" },
  "react-native": { file: "stacks/react-native.csv" },
  flutter: { file: "stacks/flutter.csv" },
  shadcn: { file: "stacks/shadcn.csv" },
  "jetpack-compose": { file: "stacks/jetpack-compose.csv" },
};

const STACK_COLS = {
  search_cols: ["Category", "Guideline", "Description", "Do", "Don't"],
  output_cols: ["Category", "Guideline", "Description", "Do", "Don't", "Code Good", "Code Bad", "Severity", "Docs URL"],
};

export const AVAILABLE_STACKS = Object.keys(STACK_CONFIG);

type CsvRow = Record<string, string>;

type SearchResult = {
  domain: string;
  query: string;
  file: string;
  count: number;
  results: CsvRow[];
  stack?: string;
  error?: string;
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

function loadCsv(filepath: string): CsvRow[] {
  const content = readFileSync(filepath, "utf8");
  const rows = parseCsv(content);
  if (rows.length === 0) return [];

  const headers = rows[0];
  const out: CsvRow[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const values = rows[i];
    const obj: CsvRow = {};
    for (let j = 0; j < headers.length; j += 1) {
      obj[headers[j]] = values[j] ?? "";
    }
    out.push(obj);
  }

  return out;
}

class BM25 {
  private readonly k1: number;

  private readonly b: number;

  private corpus: string[][] = [];

  private docLengths: number[] = [];

  private avgdl = 0;

  private idf = new Map<string, number>();

  private docFreqs = new Map<string, number>();

  private N = 0;

  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
  }

  tokenize(text: string): string[] {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  fit(documents: string[]): void {
    this.corpus = documents.map((d) => this.tokenize(d));
    this.N = this.corpus.length;
    if (this.N === 0) return;

    this.docLengths = this.corpus.map((doc) => doc.length);
    this.avgdl = this.docLengths.reduce((a, b) => a + b, 0) / this.N;

    for (const doc of this.corpus) {
      const seen = new Set<string>();
      for (const word of doc) {
        if (seen.has(word)) continue;
        this.docFreqs.set(word, (this.docFreqs.get(word) ?? 0) + 1);
        seen.add(word);
      }
    }

    for (const [word, freq] of this.docFreqs.entries()) {
      this.idf.set(word, Math.log((this.N - freq + 0.5) / (freq + 0.5) + 1));
    }
  }

  score(query: string): Array<[number, number]> {
    const queryTokens = this.tokenize(query);
    const scores: Array<[number, number]> = [];

    for (let idx = 0; idx < this.corpus.length; idx += 1) {
      const doc = this.corpus[idx];
      const docLen = this.docLengths[idx];
      const termFreqs = new Map<string, number>();

      for (const word of doc) {
        termFreqs.set(word, (termFreqs.get(word) ?? 0) + 1);
      }

      let score = 0;
      for (const token of queryTokens) {
        const idf = this.idf.get(token);
        if (idf === undefined) continue;
        const tf = termFreqs.get(token) ?? 0;
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + (this.b * docLen) / this.avgdl);
        score += idf * (denominator === 0 ? 0 : numerator / denominator);
      }

      scores.push([idx, score]);
    }

    return scores.sort((a, b) => b[1] - a[1]);
  }
}

function searchCsv(filepath: string, searchCols: string[], outputCols: string[], query: string, maxResults: number): CsvRow[] {
  if (!existsSync(filepath)) return [];
  const data = loadCsv(filepath);

  const documents = data.map((row) => searchCols.map((col) => row[col] ?? "").join(" "));

  const bm25 = new BM25();
  bm25.fit(documents);
  const ranked = bm25.score(query);

  const results: CsvRow[] = [];
  for (const [idx, score] of ranked.slice(0, maxResults)) {
    if (score <= 0) continue;
    const row = data[idx];
    const out: CsvRow = {};
    for (const col of outputCols) {
      if (col in row) out[col] = row[col];
    }
    results.push(out);
  }

  return results;
}

export function detectDomain(query: string): string {
  const queryLower = query.toLowerCase();

  const domainKeywords: Record<string, string[]> = {
    color: ["color", "palette", "hex", "#", "rgb"],
    chart: ["chart", "graph", "visualization", "trend", "bar", "pie", "scatter", "heatmap", "funnel"],
    landing: ["landing", "page", "cta", "conversion", "hero", "testimonial", "pricing", "section"],
    product: ["saas", "ecommerce", "e-commerce", "fintech", "healthcare", "gaming", "portfolio", "crypto", "dashboard"],
    style: ["style", "design", "ui", "minimalism", "glassmorphism", "neumorphism", "brutalism", "dark mode", "flat", "aurora", "prompt", "css", "implementation", "variable", "checklist", "tailwind"],
    ux: ["ux", "usability", "accessibility", "wcag", "touch", "scroll", "animation", "keyboard", "navigation", "mobile"],
    typography: ["font", "typography", "heading", "serif", "sans"],
    icons: ["icon", "icons", "lucide", "heroicons", "symbol", "glyph", "pictogram", "svg icon"],
    react: ["react", "next.js", "nextjs", "suspense", "memo", "usecallback", "useeffect", "rerender", "bundle", "waterfall", "barrel", "dynamic import", "rsc", "server component"],
    web: ["aria", "focus", "outline", "semantic", "virtualize", "autocomplete", "form", "input type", "preconnect"],
  };

  let bestDomain = "style";
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const score = keywords.reduce((acc, kw) => acc + (queryLower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestScore > 0 ? bestDomain : "style";
}

export function search(query: string, domain?: string, maxResults = MAX_RESULTS): SearchResult {
  const resolvedDomain = domain ?? detectDomain(query);
  const config = CSV_CONFIG[resolvedDomain] ?? CSV_CONFIG.style;
  const filepath = join(DATA_DIR, config.file);

  if (!existsSync(filepath)) {
    return { domain: resolvedDomain, query, file: config.file, count: 0, results: [], error: `File not found: ${filepath}` };
  }

  const results = searchCsv(filepath, config.search_cols, config.output_cols, query, maxResults);

  return {
    domain: resolvedDomain,
    query,
    file: config.file,
    count: results.length,
    results,
  };
}

export function searchStack(query: string, stack: string, maxResults = MAX_RESULTS): SearchResult {
  if (!STACK_CONFIG[stack]) {
    return {
      domain: "stack",
      stack,
      query,
      file: "",
      count: 0,
      results: [],
      error: `Unknown stack: ${stack}. Available: ${AVAILABLE_STACKS.join(", ")}`,
    };
  }

  const filepath = join(DATA_DIR, STACK_CONFIG[stack].file);

  if (!existsSync(filepath)) {
    return {
      domain: "stack",
      stack,
      query,
      file: STACK_CONFIG[stack].file,
      count: 0,
      results: [],
      error: `Stack file not found: ${filepath}`,
    };
  }

  const results = searchCsv(filepath, STACK_COLS.search_cols, STACK_COLS.output_cols, query, maxResults);

  return {
    domain: "stack",
    stack,
    query,
    file: STACK_CONFIG[stack].file,
    count: results.length,
    results,
  };
}
