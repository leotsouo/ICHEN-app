# 🚀 Vercel 完整部署攻略

本指南將帶你完成從 GitHub 推送到 Vercel 部署的完整流程。

## 📋 目錄

1. [前置準備](#前置準備)
2. [推送到 GitHub](#推送到-github)
3. [Vercel 部署](#vercel-部署)
4. [環境變數設定](#環境變數設定)
5. [Supabase 配置](#supabase-配置)
6. [部署後驗證](#部署後驗證)
7. [疑難排解](#疑難排解)

---

## 📦 前置準備

### 1. 確認專案狀態

在開始之前，確認以下項目：

- [ ] 專案可以在本地正常運行（`pnpm dev`）
- [ ] 所有功能測試通過
- [ ] 環境變數已準備好（Supabase URL 和 Key）
- [ ] 已安裝 Git（如果尚未安裝）

### 2. 準備 Supabase 資訊

你需要以下資訊：

- **Supabase Project URL**：例如 `https://abcdefghijklmnop.supabase.co`
- **Supabase Anon Key**：一個很長的 JWT token（以 `eyJ` 開頭）

> 📖 **如何取得**：前往 [Supabase Dashboard](https://app.supabase.com/) → Settings → API

---

## 📤 推送到 GitHub

### 情況 A: 倉庫已存在（你的情況）

如果你的 GitHub 倉庫已經存在（例如：`https://github.com/leotsouo/ICHEN-app.git`），請按照以下步驟：

#### 步驟 1: 確認遠端倉庫連接

```bash
# 檢查遠端倉庫設定
git remote -v
```

如果已經連接，你會看到類似：
```
origin  https://github.com/leotsouo/ICHEN-app.git (fetch)
origin  https://github.com/leotsouo/ICHEN-app.git (push)
```

如果沒有連接，執行：
```bash
git remote add origin https://github.com/leotsouo/ICHEN-app.git
```

#### 步驟 2: 檢查當前狀態

```bash
# 查看有哪些變更
git status
```

#### 步驟 3: 拉取遠端最新變更（如果有）

```bash
# 先拉取遠端變更，避免衝突
git pull origin main --rebase
```

如果遇到衝突，需要先解決衝突。

#### 步驟 4: 添加變更

```bash
# 添加所有變更
git add .

# 確認要提交的檔案
git status
```

#### 步驟 5: 提交變更

```bash
# 提交變更
git commit -m "Update: 添加部署文檔和修復回首頁功能"
```

#### 步驟 6: 推送到 GitHub

```bash
# 推送到 GitHub
git push origin main
```

### 情況 B: 創建新倉庫

如果你的 GitHub 倉庫還不存在，請按照以下步驟：

### 步驟 1: 初始化 Git 倉庫（如果尚未初始化）

```bash
# 在專案根目錄執行
git init
```

### 步驟 2: 檢查 .gitignore 檔案

確認 `.gitignore` 檔案包含以下內容（應該已經存在）：

```
# 環境變數檔案（重要！不要提交）
.env
.env.local
.env*.local

# 依賴
node_modules/
.pnp
.pnp.js

# 建置輸出
.next/
out/
dist/
build/

# 日誌
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 系統檔案
.DS_Store
*.pem

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Vercel
.vercel
```

### 步驟 3: 檢查是否有未提交的變更

```bash
# 查看檔案狀態
git status
```

### 步驟 4: 添加檔案到 Git

```bash
# 添加所有檔案（.gitignore 會自動排除不該提交的檔案）
git add .

# 確認要提交的檔案
git status
```

### 步驟 5: 提交變更

```bash
# 提交變更
git commit -m "Initial commit: ICHEN-app monorepo with restaurant ratings system"
```

### 步驟 6: 在 GitHub 創建新倉庫

1. 前往 [GitHub](https://github.com)
2. 點擊右上角的 **+** → **New repository**
3. 填寫倉庫資訊：
   - **Repository name**: `ICHEN-app`（或你喜歡的名稱）
   - **Description**: `Monorepo with restaurant ratings system`
   - **Visibility**: 選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"（因為我們已經有專案了）
4. 點擊 **Create repository**

### 步驟 7: 連接本地倉庫到 GitHub

GitHub 會顯示連接指令，執行以下命令：

```bash
# 添加遠端倉庫（替換 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用 SSH（如果你有設定 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 確認遠端倉庫已添加
git remote -v
```

### 步驟 8: 推送到 GitHub

```bash
# 推送到 GitHub（第一次推送）
git branch -M main
git push -u origin main
```

> 💡 **提示**：如果遇到認證問題，GitHub 現在使用 Personal Access Token（PAT）而不是密碼。前往 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) 創建新的 token。

### 步驟 9: 驗證推送成功

前往你的 GitHub 倉庫頁面，確認所有檔案都已成功推送。

---

## 🚀 Vercel 部署

### 步驟 1: 註冊/登入 Vercel

1. 前往 [Vercel](https://vercel.com)
2. 點擊 **Sign Up** 或 **Log In**
3. 選擇 **Continue with GitHub**（推薦，這樣可以自動連接 GitHub 倉庫）

### 步驟 2: 導入專案

1. 登入後，點擊 **Add New Project**
2. 在 **Import Git Repository** 區塊，選擇你的 GitHub 倉庫
3. 如果沒有看到你的倉庫，點擊 **Adjust GitHub App Permissions** 來授權 Vercel 訪問你的倉庫
4. 選擇倉庫後，點擊 **Import**

### 步驟 3: 配置專案設定

#### 基本設定

在 **Configure Project** 頁面：

- **Project Name**: 可以保持預設或修改（例如：`ichen-app-restaurant-ratings`）
- **Framework Preset**: 選擇 **Next.js**（應該會自動偵測）
- **Root Directory**: 選擇 **`apps/restaurant-ratings`**（因為我們要部署餐廳評分系統）
- **Build Command**: 保持預設或設定為 `cd ../.. && pnpm build --filter=restaurant-ratings`
- **Output Directory**: 留空（Next.js 會自動處理）
- **Install Command**: 設定為 `pnpm install`
- **Development Command**: 可以設定為 `cd ../.. && pnpm dev --filter=restaurant-ratings`

> ⚠️ **重要**：由於這是 monorepo 專案，Root Directory 必須設定為 `apps/restaurant-ratings`

#### 環境變數設定

在 **Environment Variables** 區塊，點擊 **Add** 添加以下環境變數：

| 變數名稱 | 值 | 環境 | 說明 |
|---------|-----|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_HOME_URL` | `https://your-home-app.vercel.app` | Production, Preview, Development | 首頁應用 URL（可選） |

**設定步驟**：

1. 點擊 **Add** 按鈕
2. 輸入變數名稱（例如：`NEXT_PUBLIC_SUPABASE_URL`）
3. 輸入變數值
4. 選擇要套用的環境（建議全部選擇：Production, Preview, Development）
5. 點擊 **Save**
6. 重複以上步驟添加其他環境變數

> 💡 **提示**：環境變數可以在部署後再添加或修改，但需要重新部署才會生效。

### 步驟 4: 部署

1. 確認所有設定都正確
2. 點擊 **Deploy** 按鈕
3. 等待建置完成（通常需要 2-5 分鐘）

### 步驟 5: 查看部署結果

建置完成後：

1. 你會看到 **Congratulations!** 頁面
2. 記下你的部署 URL（例如：`https://ichen-app-restaurant-ratings.vercel.app`）
3. 點擊 **Visit** 按鈕查看部署的應用

---

## 🔐 環境變數設定

### 在 Vercel Dashboard 中設定

1. 前往你的專案頁面
2. 點擊 **Settings** 標籤
3. 點擊左側選單的 **Environment Variables**
4. 添加或編輯環境變數

### 環境變數說明

#### 必要環境變數

- **`NEXT_PUBLIC_SUPABASE_URL`**
  - 說明：Supabase 專案的 URL
  - 格式：`https://your-project-id.supabase.co`
  - 取得方式：Supabase Dashboard → Settings → API → Project URL

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
  - 說明：Supabase 的匿名（公開）金鑰
  - 格式：很長的 JWT token（以 `eyJ` 開頭）
  - 取得方式：Supabase Dashboard → Settings → API → anon/public key

#### 可選環境變數

- **`NEXT_PUBLIC_HOME_URL`**
  - 說明：首頁應用的 URL（用於「回首頁」功能）
  - 格式：`https://your-home-app.vercel.app`
  - 如果未設定，本地開發會使用 `http://localhost:3000`

- **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`**
  - 說明：Google Maps API Key（用於餐廳地址自動完成）
  - 格式：`AIzaSy...`
  - 如果未設定，新增餐廳功能仍可使用，但沒有自動完成功能

### 更新環境變數

如果部署後需要更新環境變數：

1. 在 Vercel Dashboard → Settings → Environment Variables 中修改
2. 修改後，前往 **Deployments** 標籤
3. 點擊最新部署右側的 **⋯** → **Redeploy**
4. 或推送新的 commit 到 GitHub（會自動觸發重新部署）

---

## 🗄️ Supabase 配置

### 步驟 1: 設定重定向 URL

部署完成後，需要在 Supabase 中設定重定向 URL：

1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 點擊左側選單的 **Authentication**
4. 點擊 **URL Configuration**
5. 在 **Redirect URLs** 區塊，點擊 **Add URL**
6. 添加你的 Vercel 部署 URL：
   ```
   https://your-app.vercel.app/auth/callback
   ```
7. 點擊 **Save**

### 步驟 2: 設定 Site URL（可選）

在 **Site URL** 欄位，可以設定為你的 Vercel 部署 URL：
```
https://your-app.vercel.app
```

### 步驟 3: 確認資料庫設定

確認以下資料表已建立：

- `restaurants`
- `reviews`
- `review_aspect`
- `profiles`
- `v_restaurant_rating` (view)

> 📖 **詳細資料庫設定**：參考 `docs/database/` 目錄下的 SQL 檔案

---

## ✅ 部署後驗證

### 功能測試清單

部署完成後，請測試以下功能：

#### 1. 基本功能

- [ ] 訪問部署 URL，確認頁面正常載入
- [ ] 檢查頁面樣式是否正確
- [ ] 確認沒有 JavaScript 錯誤（打開瀏覽器開發者工具）

#### 2. 認證功能

- [ ] 輸入 Email 地址
- [ ] 點擊「寄送登入連結」
- [ ] 檢查 Email 是否收到 Magic Link
- [ ] 點擊 Magic Link
- [ ] 確認成功登入並顯示使用者 Email
- [ ] 測試登出功能

#### 3. 餐廳評分功能

- [ ] 查看餐廳清單（如果有資料）
- [ ] 新增餐廳（如果已登入）
- [ ] 為餐廳新增評論：
  - [ ] 設定整體評分
  - [ ] 設定分項評分（服務、氣氛、價格CP值、口味、衛生）
  - [ ] 填寫文字評論
- [ ] 查看自己的評論
- [ ] 刪除自己的評論

#### 4. 其他功能

- [ ] 測試「回首頁」連結（如果設定了 `NEXT_PUBLIC_HOME_URL`）
- [ ] 測試 QR Code 掃描功能（如果使用）
- [ ] 測試在不同瀏覽器中是否正常運作
- [ ] 測試在手機瀏覽器中是否正常運作

### 檢查項目

- [ ] 檢查 Vercel 部署日誌，確認無錯誤
- [ ] 檢查瀏覽器 Console，確認無 JavaScript 錯誤
- [ ] 檢查 Network 標籤，確認 Supabase API 請求成功
- [ ] 確認 Cookie 正確設定
- [ ] 檢查 Supabase Dashboard 的日誌，確認請求正常

---

## 🔍 疑難排解

### 問題 1: 建置失敗

**症狀**：Vercel 建置時出現錯誤

**解決方案**：

1. **檢查建置日誌**
   - 前往 Vercel Dashboard → Deployments
   - 點擊失敗的部署查看詳細日誌

2. **常見原因**：
   - 環境變數未設定或設定錯誤
   - `Root Directory` 設定錯誤（應該是 `apps/restaurant-ratings`）
   - `Build Command` 或 `Install Command` 設定錯誤
   - 依賴安裝失敗

3. **本地測試建置**：
   ```bash
   cd apps/restaurant-ratings
   pnpm install
   pnpm build
   ```
   如果本地建置失敗，先修復本地問題

### 問題 2: 環境變數未生效

**症狀**：部署後 Supabase 連線失敗

**解決方案**：

1. 確認環境變數名稱正確（大小寫敏感）
2. 確認環境變數已套用到所有環境（Production, Preview, Development）
3. 確認變數值正確（沒有多餘的空格或引號）
4. 重新部署專案（修改環境變數後需要重新部署）

### 問題 3: Magic Link 無法登入

**症狀**：點擊 Magic Link 後無法登入或出現錯誤

**解決方案**：

1. **確認 Supabase 重定向 URL 設定**
   - 前往 Supabase Dashboard → Authentication → URL Configuration
   - 確認 `https://your-app.vercel.app/auth/callback` 已添加到 Redirect URLs

2. **確認 URL 一致**
   - Vercel 部署 URL 必須與 Supabase 設定的 URL 完全一致
   - 檢查是否有拼寫錯誤或缺少 `https://`

3. **檢查 Vercel 日誌**
   - 前往 Vercel Dashboard → Deployments → 選擇部署 → Functions
   - 查看 `/auth/callback` 的日誌

### 問題 4: 頁面顯示空白或錯誤

**症狀**：部署後頁面無法正常顯示

**解決方案**：

1. **檢查瀏覽器 Console**
   - 打開瀏覽器開發者工具（F12）
   - 查看 Console 標籤是否有錯誤訊息

2. **檢查 Network 請求**
   - 查看 Network 標籤
   - 確認 Supabase API 請求是否成功

3. **檢查環境變數**
   - 確認 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已正確設定

### 問題 5: 資料庫連線問題

**症狀**：無法讀取或寫入資料

**解決方案**：

1. **確認 Supabase 專案狀態**
   - 前往 Supabase Dashboard
   - 確認專案沒有暫停或過期

2. **檢查資料表權限**
   - 確認 RLS (Row Level Security) 政策正確設定
   - 確認使用者有權限讀寫資料

3. **檢查 Supabase 日誌**
   - 前往 Supabase Dashboard → Logs
   - 查看是否有錯誤訊息

### 問題 6: Monorepo 建置問題

**症狀**：建置時找不到依賴或路徑錯誤

**解決方案**：

1. **確認 Root Directory 設定**
   - 應該是 `apps/restaurant-ratings`（不是根目錄）

2. **確認 Build Command**
   - 如果 Root Directory 是 `apps/restaurant-ratings`，Build Command 應該是：
     ```
     cd ../.. && pnpm build --filter=restaurant-ratings
     ```
   - 或者直接使用：
     ```
     pnpm build
     ```
   （如果從 `apps/restaurant-ratings` 目錄執行）

3. **確認 Install Command**
   - 應該是 `pnpm install`（從根目錄執行）

---

## 🔄 更新部署

### 自動部署

當你推送新的 commit 到 GitHub 時，Vercel 會自動觸發新的部署：

```bash
# 修改程式碼後
git add .
git commit -m "Update: 描述你的變更"
git push origin main
```

Vercel 會自動：
1. 偵測到新的 commit
2. 開始建置
3. 部署新版本

### 手動重新部署

如果需要手動重新部署：

1. 前往 Vercel Dashboard → Deployments
2. 找到要重新部署的版本
3. 點擊右側的 **⋯** → **Redeploy**

### 回滾到舊版本

如果需要回滾到之前的版本：

1. 前往 Vercel Dashboard → Deployments
2. 找到要回滾的版本
3. 點擊右側的 **⋯** → **Promote to Production**

---

## 📝 部署檢查清單

在部署前，確認以下項目：

### 部署前

- [ ] 專案可以在本地正常運行
- [ ] 所有功能測試通過
- [ ] 已準備好 Supabase URL 和 Key
- [ ] 已推送到 GitHub
- [ ] `.gitignore` 已正確設定（不會提交 `.env.local`）

### 部署時

- [ ] Root Directory 設定為 `apps/restaurant-ratings`
- [ ] Build Command 正確設定
- [ ] Install Command 設定為 `pnpm install`
- [ ] 環境變數已正確設定
- [ ] 環境變數已套用到所有環境

### 部署後

- [ ] 頁面正常載入
- [ ] Supabase 重定向 URL 已設定
- [ ] 登入功能正常
- [ ] 餐廳評分功能正常
- [ ] 在不同瀏覽器中測試
- [ ] 在手機瀏覽器中測試

---

## 🎉 完成！

恭喜！你已經成功將專案部署到 Vercel。

### 下一步

- 📱 測試手機瀏覽器訪問
- 🔗 分享你的應用 URL
- 🎨 繼續開發新功能
- 📊 監控應用效能（Vercel Analytics）

### 有用的連結

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com/)
- [GitHub 倉庫](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

---

**需要幫助？** 查看：
- [專案 README](../README.md)
- [環境變數設定指南](../guides/ENV_SETUP.md)
- [部署檢查清單](./DEPLOYMENT.md)

