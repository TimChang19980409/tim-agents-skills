import { join } from "node:path";

export const BENCHMARKS_DIR = "_benchmarks";
export const BENCHMARK_GROUPS_DIR = "benchmark-groups";
export const WAVE_BENCHMARKS_DIR = "wave-benchmarks";
export const SKILL_PORTFOLIO_WORKSPACE_DIR = "skill-portfolio-workspace";
export const SKILL_PORTFOLIO_PROFILE_DIR = "opencode-minimax-m2-5";
export const SHARED_DIR = "_shared";
export const SHARED_GLOBAL_DIR = join(SHARED_DIR, "global");
export const SHARED_GLOBAL_DOCS_DIR = join(SHARED_GLOBAL_DIR, "docs");
export const SHARED_CURSOR_DIR = join(SHARED_DIR, "cursor");
export const SHARED_OPENCODE_DIR = join(SHARED_DIR, "opencode");
export const SHARED_PROJECTIONS_DIR = join(SHARED_DIR, "projections");
export const GLOBAL_DOC_FILES = [
  "coding-principles.md",
  "task-execution.md",
  "testing-and-verification.md",
  "repo-discovery.md",
  "skill-routing.md",
] as const;

export function benchmarkRoot(repoRoot: string): string {
  return join(repoRoot, BENCHMARKS_DIR);
}

export function benchmarkGroupsDir(repoRoot: string): string {
  return join(benchmarkRoot(repoRoot), BENCHMARK_GROUPS_DIR);
}

export function waveBenchmarksDir(repoRoot: string): string {
  return join(benchmarkRoot(repoRoot), WAVE_BENCHMARKS_DIR);
}

export function skillWorkspaceDir(repoRoot: string, skillName: string, iteration = "iteration-1"): string {
  return join(benchmarkRoot(repoRoot), `${skillName}-workspace`, iteration);
}

export function skillPortfolioWorkspace(repoRoot: string, profile = SKILL_PORTFOLIO_PROFILE_DIR): string {
  return join(benchmarkRoot(repoRoot), SKILL_PORTFOLIO_WORKSPACE_DIR, profile);
}

export function waveGroupPath(repoRoot: string, wave: string): string {
  return join(benchmarkGroupsDir(repoRoot), `${wave}.json`);
}

export function waveBenchmarkSummaryPath(repoRoot: string, wave: string, extension: "json" | "md"): string {
  return join(waveBenchmarksDir(repoRoot), `${wave}.${extension}`);
}

export function triggerRegressionSummaryPath(repoRoot: string, wave: string): string {
  return join(waveBenchmarksDir(repoRoot), `${wave}-trigger-regressions.json`);
}

export function projectionSnapshotPath(repoRoot: string): string {
  return join(repoRoot, SHARED_PROJECTIONS_DIR, "projection-spec.json");
}

export function expandHomePath(path: string): string {
  if (path === "~") {
    return process.env.HOME ?? path;
  }
  if (path.startsWith("~/")) {
    return join(process.env.HOME ?? "~", path.slice(2));
  }
  return path;
}
