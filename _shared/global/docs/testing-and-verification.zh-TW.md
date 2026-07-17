# 測試與驗證

[English](testing-and-verification.md) | 繁體中文

- 先執行足以證明變更的最小驗證，再依需要擴大範圍。
- 優先使用 repository-native validation commands 與 static checks，不依賴臨時 spot checks。
- 任務若改變 routing、configuration 或 generated artifacts，應新增或更新能讓 regression 可見的檢查。
- 說明已完成的驗證，以及哪些驗證無法執行。
- 保留精簡 benchmark artifacts；除非 debugging 需要，raw traces 與 staged trees 都是暫存資料。
