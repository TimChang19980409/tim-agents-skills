# Skill Routing

[English](skill-routing.md) | 繁體中文

- 將 `~/.agents/skills` 視為 canonical skill root。
- 使用者點名某個 skill，或請求明確符合其 description 時，應 route 至該 skill。
- 先開啟該 skill 的 `SKILL.md`，再以 progressive disclosure 方式載入其 playbooks 與 references。
- 優先使用有效的 `core` skills；不要將 `_archive`、`_retired` 或 benchmark 生成的 `AGENTS.md` 視為 runtime-global 規則。
- Host 具備原生 skill 支援時，使用 host-native surface，並維持相同的 skill identity 與 routing intent。
- Core skill delegate 至另一個 skill 時，只有 primary skill 要求才載入 delegate。
- 小型或唯讀任務只載入維持正確性所需的最少 routing 與 task 文件。
- Routing 應保持精簡：共用文件定義全域行為，各 skill 的專屬指令保留在其 `SKILL.md`。
