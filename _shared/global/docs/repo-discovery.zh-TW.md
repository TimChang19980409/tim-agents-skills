# Repository 探索

[English](repo-discovery.md) | 繁體中文

- 先檢查 manifests、根目錄文件與進入點檔案，再判斷 repository 組織方式。
- 使用 `rg` 等快速的檔案與文字搜尋工具尋找 authoritative references。
- 清楚說明 path assumptions，尤其是 configs 會投影到其他工具目錄時。
- Configuration precedence 是實作的一部分，不是事後補充事項。
- 區分 canonical source files 與 generated／projected views。
