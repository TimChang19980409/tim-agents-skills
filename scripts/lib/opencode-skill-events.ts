export type SkillToolEvent = {
  type?: string;
  part?: {
    tool?: string;
    state?: { input?: { name?: unknown } };
  };
};

export function parseSkillCalls(jsonl: string): string[] {
  const calls: string[] = [];
  for (const line of jsonl.split(/\r?\n/)) {
    if (!line.trim().startsWith("{")) continue;
    try {
      const event = JSON.parse(line) as SkillToolEvent;
      const name = event.part?.state?.input?.name;
      if (event.type === "tool_use" && event.part?.tool === "skill" && typeof name === "string") calls.push(name);
    } catch {
      // OpenCode stderr and truncated lines are not JSON events.
    }
  }
  return calls;
}

export function firstSkillCall(jsonl: string): string | null {
  return parseSkillCalls(jsonl)[0] ?? null;
}
