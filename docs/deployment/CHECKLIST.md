# ✅ 部署檢查清單

使用本清單確保部署過程順利完成。

## 📋 部署前檢查

### 專案準備

- [ ] 專案可以在本地正常運行（`pnpm dev:home` 或 `cd apps/home; pnpm dev`）
- [ ] 本地建置成功（`cd apps/home; pnpm build` 或 `pnpm build --filter=home`）

> 💡 **提示**：
> - 由於採用單一應用架構，只需要運行 `home` 應用即可
> - PowerShell：使用 `;` 分隔命令；Bash：使用 `&&` 分隔命令
> - 推薦使用 `pnpm build --filter=home`（從根目錄執行，跨平台兼容）
- [ ] 所有功能測試通過
- [ ] 程式碼已提交到 Git
- [ ] `.gitignore` 已正確設定（不會提交 `.env.local`）

### 環境變數準備

- [ ] 已取得 Supabase Project URL
- [ ] 已取得 Supabase Anon Key
- [ ] （可選）已取得 Google Maps API Key

### GitHub 準備

- [ ] GitHub 倉庫已創建或已存在
- [ ] 程式碼已推送到 GitHub
- [ ] 確認推送的程式碼是最新版本

---

## 🚀 部署時檢查

### Vercel 項目設定

- [ ] Root Directory 設定為 `apps/home`
- [ ] Framework Preset 選擇 `Next.js`
- [ ] Build Command 正確設定（或使用 `vercel.json` 配置）
- [ ] Install Command 設定為 `cd ../.. && pnpm install`
- [ ] Output Directory 設定為 `.next`（或留空）

### 環境變數設定

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已設定
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定
- [ ] （可選）`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 已設定
- [ ] 環境變數已套用到所有環境（Production, Preview, Development）
- [ ] 環境變數值正確（沒有多餘的空格或引號）

### 部署過程

- [ ] 點擊 Deploy 按鈕
- [ ] 監控建置過程
- [ ] 確認建置成功（無錯誤）
- [ ] 記下部署 URL

---

## 🔧 部署後檢查

### Supabase 配置

- [ ] 在 Supabase Dashboard → Authentication → URL Configuration 添加 Redirect URL
  - [ ] `https://your-app.vercel.app/auth/callback`
  - [ ] `http://localhost:3000/auth/callback`（本地開發）
- [ ] （可選）設定 Site URL 為 `https://your-app.vercel.app`

### 基本功能測試

- [ ] 訪問首頁 `/` 正常顯示
- [ ] 頁面樣式正確
- [ ] 沒有 JavaScript 錯誤（檢查瀏覽器 Console）
- [ ] 沒有網路請求錯誤（檢查瀏覽器 Network 標籤）

### 導航功能測試

- [ ] 從首頁點擊 "餐廳評分系統" 可以進入 `/ratings` 頁面
- [ ] 從 `/ratings` 頁面點擊 "← 回首頁" 可以返回首頁
- [ ] 頁面切換流暢，無異常

### 認證功能測試

- [ ] 在 `/ratings` 頁面輸入 Email 地址
- [ ] 點擊「寄送登入連結」
- [ ] 檢查 Email 是否收到 Magic Link
- [ ] 點擊 Magic Link
- [ ] 確認成功登入並顯示使用者 Email
- [ ] 測試登出功能
- [ ] 登出後確認無法執行需要登入的操作

### 餐廳評分功能測試

- [ ] （如果已有資料）查看餐廳清單正常顯示
- [ ] 登入後可以新增餐廳
- [ ] 可以為餐廳新增評論：
  - [ ] 設定整體評分（0.5-5.0 星）
  - [ ] （可選）設定分項評分
  - [ ] （可選）填寫文字評論
- [ ] 評論成功顯示
- [ ] 可以查看自己的評論
- [ ] 可以刪除自己的評論

### 跨瀏覽器測試

- [ ] Chrome/Edge 瀏覽器正常運作
- [ ] Firefox 瀏覽器正常運作
- [ ] Safari 瀏覽器正常運作（如果可用）
- [ ] 手機瀏覽器正常運作

### 效能和穩定性

- [ ] 頁面載入速度正常
- [ ] API 請求響應正常
- [ ] 沒有明顯的效能問題

---

## 🔍 技術檢查

### Vercel 日誌

- [ ] 檢查建置日誌無錯誤
- [ ] 檢查函數日誌無錯誤
- [ ] 確認部署狀態為 Ready

### 瀏覽器開發者工具

- [ ] Console 無錯誤
- [ ] Network 請求成功（Supabase API 請求返回 200）
- [ ] Cookie 正確設定

### Supabase Dashboard

- [ ] 檢查 Logs，確認請求正常
- [ ] 確認資料庫連線正常
- [ ] 確認認證功能正常

---

## 📝 記錄資訊

部署完成後，記錄以下資訊以便後續維護：

- [ ] 部署 URL：`https://your-app.vercel.app`
- [ ] Vercel 項目名稱：`your-project-name`
- [ ] Supabase 專案 URL：`https://your-project.supabase.co`
- [ ] 部署日期和時間
- [ ] 使用的環境變數（已記錄在哪裡）

---

## 🔄 持續維護檢查

### 更新部署後

- [ ] 確認新功能正常運作
- [ ] 確認舊功能未受影響
- [ ] 檢查是否有新的錯誤日誌

### 定期檢查

- [ ] 檢查 Vercel 使用量（確保在免費額度內）
- [ ] 檢查 Supabase 使用量
- [ ] 檢查應用效能
- [ ] 檢查錯誤日誌

---

## 📚 相關文檔

- [完整部署指南](./DEPLOYMENT.md)
- [快速開始指南](./QUICK_START.md)
- [環境變數配置](./ENVIRONMENT_VARIABLES.md)
- [疑難排解](./TROUBLESHOOTING.md)

---

## 💡 提示

- 使用本清單逐步檢查，避免遺漏重要步驟
- 建議將本清單保存為檢查清單，勾選已完成項目
- 如果遇到問題，參考 [疑難排解指南](./TROUBLESHOOTING.md)

