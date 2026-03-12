# Checklists

## API quality checklist

- Props 是否有清楚分層：`data/behavior/style/slots/events`？
- 是否有合理預設值？（happy path 少寫 props）
- 是否提供必要 escape hatch？（slots/render props/headless）
- Controlled/uncontrolled 是否有明確規則與優先權？
- Event 命名是否一致：`onXxx`，參數順序固定（先 id/state 再 payload）？

## Accessibility checklist (interactive components)

- 有明確的鍵盤操作規格（↑↓/Home/End/Escape/Enter/Space）嗎？
- Focus 管理是否可預測？（roving tabindex / aria-activedescendant）
- ARIA roles/states 是否完整且正確？
- Disabled/readOnly 的行為是否一致？

## Performance checklist (lists/trees/tables)

- 大量資料是否需要 virtualization？
- Context value 是否穩定（避免每次 render new object）？
- render props ctx 是否過大（導致子樹頻繁更新）？
- key 是否穩定，避免重新 mount？

