# 🧪 本地測試整合後的應用

## ✅ 重要說明

整合後的應用**不會影響**現有的 `restaurant-ratings` 應用：
- `restaurant-ratings` 應用仍然獨立運行在 `http://localhost:3001`
- `home` 應用現在包含整合後的評分系統，運行在 `http://localhost:3000`
- 兩個應用可以同時運行，互不影響

## 📋 測試前準備

### 1. 安裝依賴

```bash
# 在專案根目錄執行
pnpm install
```

### 2. 設定環境變數

整合後的 `home` 應用需要 Supabase 環境變數。

**創建或更新 `apps/home/.env.local`**：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key（可選）
```

> 💡 **提示**：如果 `apps/restaurant-ratings/.env.local` 已經存在，可以直接複製到 `apps/home/.env.local`

### 3. 確認端口可用

- 端口 3000：`home` 應用（整合後）
- 端口 3001：`restaurant-ratings` 應用（原有，可選）

## 🚀 啟動測試

### 方法 1: 只測試整合後的應用（推薦）

```bash
# 在專案根目錄執行
pnpm dev:home
```

或

```bash
cd apps/home
pnpm dev
```

訪問：**http://localhost:3000**

### 方法 2: 同時啟動兩個應用（對比測試）

```bash
# 在專案根目錄執行
pnpm dev
```

這會同時啟動：
- `home` 應用：http://localhost:3000（整合後）
- `restaurant-ratings` 應用：http://localhost:3001（原有）

## ✅ 測試檢查清單

### 1. 首頁測試 (`http://localhost:3000`)

- [ ] 頁面正常載入
- [ ] 顯示 "ICHEN-apps！" 標題
- [ ] 顯示 "餐廳評分系統" 卡片
- [ ] 點擊卡片可以跳轉到 `/ratings`

### 2. 評分系統測試 (`http://localhost:3000/ratings`)

- [ ] 頁面正常載入
- [ ] 顯示 "餐廳評分系統" 標題
- [ ] 顯示 "← 回首頁" 連結
- [ ] 點擊 "← 回首頁" 可以返回首頁
- [ ] 顯示登入表單（如果未登入）
- [ ] 顯示餐廳列表（如果有資料）

### 3. 認證功能測試

- [ ] 輸入 Email 地址
- [ ] 點擊 "寄送登入連結"
- [ ] 收到 Magic Link Email
- [ ] 點擊 Magic Link 後成功登入
- [ ] 登入後顯示使用者 Email
- [ ] 可以登出

### 4. 餐廳評分功能測試

- [ ] 可以查看餐廳清單
- [ ] 可以新增餐廳（如果已登入）
- [ ] 可以為餐廳新增評論：
  - [ ] 設定整體評分
  - [ ] 設定分項評分
  - [ ] 填寫文字評論
- [ ] 可以查看自己的評論
- [ ] 可以刪除自己的評論

### 5. 導航測試

- [ ] 從首頁 (`/`) 點擊 "餐廳評分系統" → 進入 `/ratings`
- [ ] 從評分系統 (`/ratings`) 點擊 "← 回首頁" → 返回 `/`
- [ ] URL 正確顯示路徑
- [ ] 瀏覽器返回/前進按鈕正常工作

### 6. API 路由測試

- [ ] `/api/reviews` 正常運作
- [ ] `/api/profile` 正常運作
- [ ] `/auth/callback` 正常運作
- [ ] `/auth/login` 正常運作
- [ ] `/auth/logout` 正常運作

## 🔍 常見問題排查

### 問題 1: 環境變數未生效

**症狀**：Supabase 連線失敗

**解決方案**：
1. 確認 `apps/home/.env.local` 檔案存在
2. 確認環境變數名稱正確（大小寫敏感）
3. 重新啟動開發伺服器

### 問題 2: 找不到模組

**症狀**：`Cannot find module '@ichen-app/shared-ratings'`

**解決方案**：
```bash
# 在專案根目錄執行
pnpm install
```

### 問題 3: 樣式未載入

**症狀**：頁面樣式錯誤或缺失

**解決方案**：
1. 確認 `apps/home/src/app/ratings/page.module.css` 存在
2. 確認所有組件的樣式導入路徑正確
3. 清除 `.next` 快取並重新啟動：
   ```bash
   cd apps/home
   rm -rf .next
   pnpm dev
   ```

### 問題 4: 路由 404

**症狀**：訪問 `/ratings` 顯示 404

**解決方案**：
1. 確認 `apps/home/src/app/ratings/page.tsx` 存在
2. 確認檔案名稱正確（`page.tsx`，不是 `Page.tsx`）
3. 重新啟動開發伺服器

## 🛠️ 建置測試

在推送到 GitHub 前，建議先測試建置：

```bash
# 在專案根目錄執行
cd apps/home
pnpm build
```

如果建置成功，表示可以安全推送到 GitHub。

## 📝 測試記錄

測試完成後，記錄以下資訊：

- [ ] 測試日期：___________
- [ ] 測試環境：Windows / Mac / Linux
- [ ] Node.js 版本：___________
- [ ] pnpm 版本：___________
- [ ] 所有測試項目通過
- [ ] 建置測試通過
- [ ] 準備推送到 GitHub

## 🔗 相關文檔

- [整合部署指南](../deployment/INTEGRATED_DEPLOY.md)
- [環境變數設定](../guides/ENV_SETUP.md)
- [測試檢查清單](./TEST_CHECKLIST.md)

