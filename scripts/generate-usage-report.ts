import { readFileSync } from "node:fs";

interface WaveBenchmark {
  wave: string;
  skills: SkillEntry[];
}

interface SkillEntry {
  skill: string;
  selected_pass_rate: number;
  selected_pass_count: number;
  selected_total: number;
}

const BENCHMARK_DIR = "_benchmarks/wave-benchmarks";
const WAVES = ["wave-1", "wave-2", "wave-3"];

function readWave(waveName: string): WaveBenchmark {
  const filePath = `${BENCHMARK_DIR}/${waveName}.json`;
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as WaveBenchmark;
}

function main() {
  const rows: Array<{ skill: string; wave: string; invocations: number; passRate: string }> = [];

  for (const waveName of WAVES) {
    const wave = readWave(waveName);
    for (const skill of wave.skills) {
      const passRatePct = Math.round(skill.selected_pass_rate * 100);
      rows.push({
        skill: skill.skill,
        wave: waveName,
        invocations: skill.selected_total,
        passRate: `${passRatePct}%`,
      });
    }
  }

  console.log("| Skill | Wave | Invocations | Pass Rate |");
  console.log("|-------|------|-------------|-----------|");
  for (const row of rows) {
    console.log(`| ${row.skill} | ${row.wave} | ${row.invocations} | ${row.passRate} |`);
  }
}

main();
