import { describe, expect, test } from "bun:test";

import { firstSkillCall, parseSkillCalls } from "./opencode-skill-events.ts";

describe("OpenCode skill event parser", () => {
  test("reads native skill tool events in order", () => {
    const log = [
      JSON.stringify({ type: "text", part: { text: "java-pro" } }),
      JSON.stringify({ type: "tool_use", part: { tool: "skill", state: { input: { name: "java-pro" } } } }),
      JSON.stringify({ type: "tool_use", part: { tool: "skill", state: { input: { name: "spring-boot-engineer" } } } }),
    ].join("\n");
    expect(parseSkillCalls(log)).toEqual(["java-pro", "spring-boot-engineer"]);
    expect(firstSkillCall(log)).toBe("java-pro");
  });

  test("ignores text mentions, malformed JSON, and other tools", () => {
    const log = [
      "not json",
      JSON.stringify({ type: "text", part: { text: "use pdf-reader" } }),
      JSON.stringify({ type: "tool_use", part: { tool: "read", state: { input: { name: "pdf-reader" } } } }),
    ].join("\n");
    expect(firstSkillCall(log)).toBeNull();
  });
});
