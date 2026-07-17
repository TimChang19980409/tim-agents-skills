# OpenCode 共用設定

[English](README.md) | 繁體中文

此檔案說明由 repository 管理、供 OpenCode projections 使用的共用設定。

它會刻意鏡像使用者目前 home config 中的 `model`、`plugin`、`command` 與 `provider` 等欄位，再加入指向 canonical repository 文件的共用 `instructions`。

部署至 `~/.config/opencode/opencode.json` 時，必須保留既有使用者設定，並以 merge 方式加入新的 `instructions`，不可取代整個檔案。
