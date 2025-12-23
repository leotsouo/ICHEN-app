# 快速啟動指南

## 🚀 啟動步驟

### 1. 確認環境變數已設定

在 `apps/restaurant-ratings/.env.local` 檔案中設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. 啟動開發伺服器

在專案根目錄執行：

```bash
pnpm dev
```

### 3. 訪問應用

- **首頁**: http://localhost:3000
- **餐廳評分系統**: http://localhost:3001

## ⚠️ 如果遇到問題

### 問題：環境變數未設定

**錯誤訊息**：可能會看到 Supabase 連線錯誤

**解決方案**：
1. 在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案
2. 填入 Supabase URL 和 Key（參考 `ENV_SETUP.md`）
3. 重新啟動開發伺服器

### 問題：端口已被占用

**錯誤訊息**：`Port 3000 is already in use` 或 `Port 3001 is already in use`

**解決方案**：
1. 停止其他使用這些端口的應用
2. 或修改 `package.json` 中的端口設定

### 問題：依賴未安裝

**錯誤訊息**：`Cannot find module`

**解決方案**：
```bash
pnpm install
```

## 📝 檢查清單

啟動前確認：
- [ ] 已執行 `pnpm install`
- [ ] 已創建 `apps/restaurant-ratings/.env.local`
- [ ] 已填入 Supabase URL 和 Key
- [ ] 端口 3000 和 3001 未被占用

啟動後確認：
- [ ] 終端機顯示 "Ready" 或類似訊息
- [ ] 可以訪問 http://localhost:3000
- [ ] 可以訪問 http://localhost:3001
- [ ] 沒有錯誤訊息

