# 部署檢查清單

## 📋 部署前準備

### 1. 環境變數檢查

在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase 設定

#### 在 Supabase Dashboard 中設定：

1. **Authentication → URL Configuration**
   - **Site URL**: `https://your-vercel-app.vercel.app`
   - **Redirect URLs**: 
     ```
     https://your-vercel-app.vercel.app/auth/callback
     http://localhost:3001/auth/callback
     ```

2. **Database → Schema**
   - 確認 `rest` schema 已建立
   - 確認必要的資料表已建立：
     - `restaurants`
     - `reviews`
     - `review_aspect`
     - `v_restaurant_rating` (view)

### 3. 本地測試

部署前請先在本地測試：

```bash
# 1. 安裝依賴
pnpm install

# 2. 設定環境變數
# 在 apps/restaurant-ratings/.env.local 中設定 Supabase 變數

# 3. 啟動開發伺服器
pnpm dev

# 4. 測試功能
# - 訪問 http://localhost:3001
# - 測試登入流程
# - 測試新增評論
# - 測試刪除評論
```

## 🚀 Vercel 部署步驟

### 步驟 1: 連接 GitHub

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊「Add New Project」
3. 選擇你的 GitHub 專案
4. 點擊「Import」

### 步驟 2: 配置專案

#### 基本設定

- **Framework Preset**: Next.js
- **Root Directory**: `./` (根目錄)
- **Build Command**: `pnpm build`
- **Output Directory**: 留空（Next.js 自動處理）
- **Install Command**: `pnpm install`

#### 如果要部署單一應用（restaurant-ratings）

- **Root Directory**: `apps/restaurant-ratings`
- **Build Command**: `cd ../.. && pnpm build --filter=restaurant-ratings`

### 步驟 3: 設定環境變數

在「Environment Variables」區塊新增：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_HOME_URL` | `https://your-home-app.vercel.app` | 首頁應用 URL（可選，如果未設定，本地開發會使用 `http://localhost:3000`） |

**重要**：
- 選擇所有環境（Production, Preview, Development）
- 確保變數名稱完全正確（大小寫敏感）

### 步驟 4: 部署

1. 點擊「Deploy」
2. 等待建置完成（約 2-5 分鐘）
3. 查看部署日誌確認無錯誤

### 步驟 5: 更新 Supabase 重定向 URL

部署完成後，取得 Vercel 提供的 URL（例如：`https://your-app.vercel.app`）

1. 前往 Supabase Dashboard
2. Authentication → URL Configuration
3. 在「Redirect URLs」中新增：
   ```
   https://your-app.vercel.app/auth/callback
   ```

## ✅ 部署後驗證

### 功能測試清單

- [ ] 訪問首頁，確認頁面正常載入
- [ ] 測試登入流程：
  - [ ] 輸入 Email 後能收到 Magic Link
  - [ ] 點擊連結後能成功登入
  - [ ] 登入後顯示使用者 Email
- [ ] 測試餐廳評分功能：
  - [ ] 能查看餐廳清單
  - [ ] 能新增評論（整體評分、分項評分、文字評論）
  - [ ] 能查看自己的歷史評論
  - [ ] 能刪除自己的評論
- [ ] 測試登出功能
- [ ] 測試 QR Code 掃描（如果使用）

### 檢查項目

- [ ] 檢查 Vercel 部署日誌，確認無錯誤
- [ ] 檢查瀏覽器 Console，確認無 JavaScript 錯誤
- [ ] 檢查 Network 標籤，確認 Supabase API 請求成功
- [ ] 確認 Cookie 正確設定
- [ ] 測試在不同瀏覽器中是否正常運作

## 🔍 疑難排解

### 建置失敗

**問題**: 建置時出現錯誤

**解決方案**:
1. 檢查 Vercel 建置日誌
2. 確認環境變數已正確設定
3. 確認 `package.json` 中的腳本正確
4. 嘗試在本地執行 `pnpm build` 檢查錯誤

### 環境變數未生效

**問題**: 部署後 Supabase 連線失敗

**解決方案**:
1. 確認環境變數名稱正確（`NEXT_PUBLIC_` 前綴）
2. 確認環境變數已套用到所有環境
3. 重新部署專案
4. 檢查 Vercel 環境變數設定頁面

### Magic Link 無法登入

**問題**: 點擊 Magic Link 後無法登入

**解決方案**:
1. 確認 Supabase 的 Redirect URL 已正確設定
2. 確認 Vercel 的 URL 與 Supabase 設定一致
3. 檢查 Vercel 日誌中的錯誤訊息
4. 確認 Supabase 專案狀態正常

### 資料庫連線問題

**問題**: 無法讀取或寫入資料

**解決方案**:
1. 確認 Supabase 專案已啟用
2. 檢查資料表權限設定
3. 確認 RLS (Row Level Security) 政策正確
4. 檢查 Supabase 日誌

## 📞 取得幫助

如果遇到問題：

1. 查看 Vercel 部署日誌
2. 查看 Supabase Dashboard 的日誌
3. 檢查瀏覽器開發者工具
4. 查看專案 GitHub Issues

## 🔄 更新部署

當程式碼更新後：

1. 推送到 GitHub
2. Vercel 會自動觸發新的部署
3. 或手動在 Vercel Dashboard 中觸發部署

**注意**: 如果更新了環境變數，需要：
1. 在 Vercel Dashboard 中更新環境變數
2. 重新部署專案

