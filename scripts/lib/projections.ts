import { readFileSync } from "node:fs";
import { join } from "node:path";

import { GLOBAL_DOC_FILES, projectionSnapshotPath } from "./layout.ts";

export type ProjectionLink = {
  source: string;
  target: string;
};

export type SkillRecord = {
  name: string;
  status: "core" | "merge" | "archive" | "retire";
  storage_path: string;
};

export type SkillsManifest = {
  framework: {
    canonical_root: string;
    portability: string;
  };
  projections: {
    codex: {
      global_agents: string;
    };
    claude: {
      global_memory: string;
      skill_dir: string;
    };
    gemini: {
      global_memory: string;
    };
    antigravity: {
      global_memory: string;
      skill_dir: string;
    };
    cursor: {
      user_rules: string;
    };
    opencode: {
      global_agents: string;
      global_agents_dir: string;
      global_config: string;
    };
  };
  skills: SkillRecord[];
};

export type ProjectionSpec = {
  canonical_root: string;
  shared: {
    global_agents: string;
    global_claude: string;
    global_gemini: string;
    global_docs: string[];
    cursor_user_rules: string;
    opencode_config: string;
    opencode_agents_dir: string;
  };
  projections: {
    codex: ProjectionLink[];
    claude: {
      memory: ProjectionLink[];
      skill_links: ProjectionLink[];
    };
    gemini: {
      memory: ProjectionLink[];
    };
    antigravity: {
      memory: ProjectionLink[];
      skill_links: ProjectionLink[];
    };
    cursor: {
      user_rules: ProjectionLink[];
    };
    opencode: {
      global_links: ProjectionLink[];
      agent_links: ProjectionLink[];
      instructions: string[];
      config_merge: {
        target: string;
        preserve: string[];
      };
    };
  };
};

const OPENCODE_AGENT_FILES = ["planner.md", "researcher.md", "reviewer.md"] as const;

function repoPath(canonicalRoot: string, relativePath: string): string {
  return `${canonicalRoot}/${relativePath}`.replaceAll("//", "/");
}

export function loadSkillsManifest(repoRoot: string): SkillsManifest {
  return JSON.parse(readFileSync(join(repoRoot, "skills.json"), "utf8")) as SkillsManifest;
}

export function buildProjectionSpec(manifest: SkillsManifest): ProjectionSpec {
  const canonicalRoot = manifest.framework.canonical_root;
  const globalDocs = GLOBAL_DOC_FILES.map((file) => repoPath(canonicalRoot, `_shared/global/docs/${file}`));
  const coreSkillLinks = manifest.skills
    .filter((skill) => skill.status === "core")
    .map((skill) => ({
      source: `${manifest.projections.claude.skill_dir}/${skill.name}`,
      target: repoPath(canonicalRoot, skill.storage_path),
    }))
    .sort((left, right) => left.source.localeCompare(right.source));

  return {
    canonical_root: canonicalRoot,
    shared: {
      global_agents: repoPath(canonicalRoot, "_shared/global/AGENTS.md"),
      global_claude: repoPath(canonicalRoot, "_shared/global/CLAUDE.md"),
      global_gemini: repoPath(canonicalRoot, "_shared/global/GEMINI.md"),
      global_docs: globalDocs,
      cursor_user_rules: repoPath(canonicalRoot, "_shared/cursor/user-rules.md"),
      opencode_config: repoPath(canonicalRoot, "_shared/opencode/opencode.json"),
      opencode_agents_dir: repoPath(canonicalRoot, "_shared/opencode/agents"),
    },
    projections: {
      codex: [
        {
          source: manifest.projections.codex.global_agents,
          target: repoPath(canonicalRoot, "_shared/global/AGENTS.md"),
        },
      ],
      claude: {
        memory: [
          {
            source: manifest.projections.claude.global_memory,
            target: repoPath(canonicalRoot, "_shared/global/CLAUDE.md"),
          },
        ],
        skill_links: coreSkillLinks,
      },
      gemini: {
        memory: [
          {
            source: manifest.projections.gemini.global_memory,
            target: repoPath(canonicalRoot, "_shared/global/GEMINI.md"),
          },
        ],
      },
      antigravity: {
        memory: [
          {
            source: manifest.projections.antigravity.global_memory,
            target: repoPath(canonicalRoot, "_shared/global/GEMINI.md"),
          },
        ],
        skill_links: coreSkillLinks.map((link) => ({
          source: `${manifest.projections.antigravity.skill_dir}/${link.source.split("/").pop() ?? ""}`,
          target: link.target,
        })),
      },
      cursor: {
        user_rules: [
          {
            source: manifest.projections.cursor.user_rules,
            target: repoPath(canonicalRoot, "_shared/cursor/user-rules.md"),
          },
        ],
      },
      opencode: {
        global_links: [
          {
            source: manifest.projections.opencode.global_agents,
            target: repoPath(canonicalRoot, "_shared/global/AGENTS.md"),
          },
        ],
        agent_links: OPENCODE_AGENT_FILES.map((file) => ({
          source: `${manifest.projections.opencode.global_agents_dir}/${file}`,
          target: repoPath(canonicalRoot, `_shared/opencode/agents/${file}`),
        })),
        instructions: globalDocs,
        config_merge: {
          target: manifest.projections.opencode.global_config,
          preserve: ["model", "provider", "plugin", "command", "mcp", "credential"],
        },
      },
    },
  };
}

export function readProjectionSnapshot(repoRoot: string): ProjectionSpec {
  return JSON.parse(readFileSync(projectionSnapshotPath(repoRoot), "utf8")) as ProjectionSpec;
}
