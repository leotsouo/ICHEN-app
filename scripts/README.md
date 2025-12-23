# 腳本說明

本目錄包含專案的各種工具腳本。

## 啟動腳本

### Windows 用戶

```powershell
.\scripts\start.ps1
```

### Mac/Linux 用戶

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

啟動腳本會自動執行以下檢查：
- ✅ 檢查 Node.js 是否已安裝
- ✅ 檢查並安裝 pnpm（如果未安裝）
- ✅ 檢查並安裝專案依賴
- ✅ 檢查環境變數檔案是否存在
- ✅ 檢查端口是否可用
- ✅ 啟動開發伺服器

## 其他腳本

### Schema 一致性檢查

- `check-schema-consistency.ps1` - Windows PowerShell 版本
- `check-schema-consistency.sh` - Unix/Linux/Mac 版本

用於檢查 Supabase 資料庫 schema 的一致性。

## 使用建議

1. **首次使用**：執行啟動腳本，它會自動處理所有設定
2. **日常開發**：直接使用 `pnpm dev` 啟動開發伺服器
3. **問題排查**：使用啟動腳本檢查環境配置

