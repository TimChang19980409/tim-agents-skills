# Coding 原則

[English](coding-principles.md) | 繁體中文

- 優先採用小而明確的變更，不做大範圍重寫。
- 保留使用者既有修改與 tree 中不相關的工作。
- 除非檔案原本就依賴 Unicode，否則預設使用 ASCII。
- 長期指引應放在共用文件或 repository 文件，不要塞入龐大的進入點檔案。
- 優先採用可讀、可執行驗證的規則，不依賴特定工具的傳聞式慣例。
- 除非使用者明確要求，避免 destructive git operations。
- Repository scripts 應遵循既有 runtime。此 portfolio 新增獨立 script 時，優先採用 Bun + TypeScript、deterministic stdout/stderr、明確 exit codes；標準函式庫足夠時不要增加 dependency。
