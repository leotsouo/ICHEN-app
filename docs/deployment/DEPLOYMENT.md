# 📘 完整部署指南

本指南將帶你完成從準備到部署的完整流程。

## 📋 目錄

1. [前置準備](#前置準備)
2. [推送到 GitHub](#推送到-github)
3. [在 Vercel 創建項目](#在-vercel-創建項目)
4. [配置項目設定](#配置項目設定)
5. [設定環境變數](#設定環境變數)
6. [部署](#部署)
7. [配置 Supabase](#配置-supabase)
8. [驗證部署](#驗證部署)
9. [更新部署](#更新部署)

---

## 📦 前置準備

### 1. 確認專案狀態

在開始之前，確認以下項目：

- [ ] 專案可以在本地正常運行（`pnpm dev:home` 或 `cd apps/home; pnpm dev`）
- [ ] 本地建置成功（`cd apps/home; pnpm build` 或 `pnpm build --filter=home`）

> 💡 **提示**：
> - PowerShell：使用 `;` 分隔命令（例如：`cd apps/home; pnpm build`）
> - Bash/Zsh：使用 `&&` 分隔命令（例如：`cd apps/home && pnpm build`）
> - 推薦使用 `pnpm build --filter=home`（從根目錄執行，跨平台兼容）
- [ ] 所有功能測試通過
- [ ] 已準備好 Supabase 環境變數

> 💡 **提示**：由於採用單一應用架構，只需要運行 `home` 應用即可。訪問 `http://localhost:3000/` 查看首頁，訪問 `http://localhost:3000/ratings` 查看評分系統。

### 2. 準備 Supabase 資訊

你需要以下資訊：

- **Supabase Project URL**：例如 `https://abcdefghijklmnop.supabase.co`
- **Supabase Anon Key**：一個很長的 JWT token（以 `eyJ` 開頭）

> 📖 **如何取得**：前往 [Supabase Dashboard](https://app.supabase.com/) → Settings → API

---

## 📤 推送到 GitHub

### 情況 A: 倉庫已存在

如果你的 GitHub 倉庫已經存在：

```bash
# 1. 檢查遠端倉庫設定
git remote -v

# 2. 如果沒有連接，添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 3. 檢查當前狀態和分支
git status
git branch

# 4. 如果不在 main 分支，可以選擇：
#    選項 A: 切換到 main 分支（推薦用於生產部署）
git checkout main
git pull origin main

#    選項 B: 繼續使用當前分支（用於測試分支）

# 5. 添加變更
git add .

# 6. 提交變更
git commit -m "準備部署：更新部署文檔"

# 7. 推送到 GitHub
#    如果在 main 分支：
git push origin main

#    如果在其他分支（例如 newtest）：
git push origin <branch-name>
```

> 💡 **提示**：
> - 生產環境部署通常使用 `main` 分支
> - 測試分支可以先推送到對應分支，確認無誤後再合併到 `main`

### 情況 B: 創建新倉庫

如果你的 GitHub 倉庫還不存在：

```bash
# 1. 初始化 Git 倉庫（如果尚未初始化）
git init

# 2. 檢查 .gitignore 檔案
# 確認 .env, .env.local, node_modules 等已被忽略

# 3. 添加檔案
git add .

# 4. 提交
git commit -m "Initial commit"

# 5. 在 GitHub 創建新倉庫後，連接並推送
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🚀 在 Vercel 創建項目

### 步驟 1: 註冊/登入 Vercel

1. 前往 [Vercel](https://vercel.com)
2. 點擊 **Sign Up** 或 **Log In**
3. 選擇 **Continue with GitHub**（推薦，可以自動連接 GitHub 倉庫）

### 步驟 2: 導入專案

1. 登入後，點擊 **Add New Project**
2. 在 **Import Git Repository** 區塊，選擇你的 GitHub 倉庫
3. 如果沒有看到你的倉庫，點擊 **Adjust GitHub App Permissions** 來授權 Vercel 訪問你的倉庫
4. 選擇倉庫後，點擊 **Import**

> 💡 **選擇分支**：
> - Vercel 預設會使用 `main` 分支
> - 如果你想要部署其他分支（例如 `newtest`），可以在導入後於項目設定中配置
> - 或者直接在 Configure Project 頁面選擇要部署的分支（如果有選項）
> - 後續也可以在 Settings → Git → Production Branch 中修改生產分支

---

## ⚙️ 配置項目設定

在 **Configure Project** 頁面，配置以下設定：

### 基本設定

- **Project Name**: 可以保持預設或修改（例如：`ichen-app`）

- **Framework Preset**: 選擇 **Next.js**（應該會自動偵測）

- **Root Directory**: **重要！** 點擊 **Edit** 並選擇 `apps/home`

- **Git Branch**: （可選）如果需要部署特定分支（例如 `newtest`），可以在這裡選擇。預設會使用 `main` 分支作為生產分支。

> 💡 **分支部署說明**：
> - Vercel 預設使用 `main` 分支作為 **Production 分支**
> - 你可以部署任何分支，方式有兩種：
>   1. **將分支設為 Production 分支**：在項目創建後，前往 Settings → Git → Production Branch，選擇你要的分支（例如 `newtest`）
>   2. **作為 Preview 分支**：直接推送分支到 GitHub，Vercel 會自動為該分支創建預覽部署
> - 預覽部署會生成唯一的 URL，適合測試
> - Production 部署會使用項目的主要 URL

- **Build Command**: 
  ```
  cd ../.. && pnpm build --filter=home
  ```
  或者如果你在 `vercel.json` 中已配置，可以留空讓 Vercel 使用 `vercel.json` 的配置

- **Output Directory**: `.next`（或留空，Next.js 會自動處理）

- **Install Command**: 
  ```
  cd ../.. && pnpm install
  ```
  > ⚠️ **重要**：必須從根目錄執行，這樣才能安裝 monorepo 的所有依賴

- **Development Command**: 
  ```
  cd ../.. && pnpm dev --filter=home
  ```

> 💡 **提示**：`vercel.json` 已經配置了這些設定，Vercel 會自動使用。你只需要確認 Root Directory 設定為 `apps/home` 即可。

---

## 🔐 設定環境變數

在 **Environment Variables** 區塊，點擊 **Add** 添加以下環境變數：

### 必要環境變數

| 變數名稱 | 值 | 環境 | 說明 |
|---------|-----|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development | Supabase 匿名金鑰 |

### 可選環境變數

| 變數名稱 | 值 | 環境 | 說明 |
|---------|-----|------|------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSy...` | Production, Preview, Development | Google Maps API Key（用於地址自動完成） |

**設定步驟**：

1. 點擊 **Add** 按鈕
2. 輸入變數名稱（例如：`NEXT_PUBLIC_SUPABASE_URL`）
3. 輸入變數值
4. 選擇要套用的環境（建議全部選擇：Production, Preview, Development）
5. 點擊 **Save**
6. 重複以上步驟添加其他環境變數

> 💡 **提示**：環境變數可以在部署後再添加或修改，但需要重新部署才會生效。

> 📖 **詳細說明**：參考 [環境變數配置指南](./ENVIRONMENT_VARIABLES.md)

---

## 🚀 部署

### 步驟 1: 確認設定

確認所有設定都正確後，點擊 **Deploy** 按鈕。

### 步驟 2: 等待建置

建置過程通常需要 2-5 分鐘。你可以在 Vercel Dashboard 查看實時建置日誌。

### 步驟 3: 查看部署結果

建置完成後：

1. 你會看到 **Congratulations!** 頁面
2. 記下你的部署 URL：
   - **Production 部署**：`https://your-app.vercel.app`（簡潔的 URL）
   - **Preview 部署**：`https://your-app-git-branch-username.vercel.app`（包含分支名稱的 URL）
3. 點擊 **Visit** 按鈕查看部署的應用

> 💡 **URL 說明**：
> - Production 部署使用簡潔的項目名稱 URL
> - Preview 部署（從非生產分支）會生成包含分支名稱的唯一 URL
> - 例如：`ichen-app-home-test-20n9i9ig6-leos-projects-0a2aae41.vercel.app` 是預覽部署 URL

---

## 🗄️ 配置 Supabase

### 步驟 1: 設定重定向 URL

部署完成後，需要在 Supabase 中設定重定向 URL：

1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 點擊左側選單的 **Authentication**
4. 點擊 **URL Configuration**
5. 在 **Redirect URLs** 區塊，點擊 **Add URL**
6. 添加你的 Vercel 部署 URL：
   
   **Production 部署**：
   ```
   https://your-app.vercel.app/auth/callback
   ```
   
   **Preview 部署**（如果使用預覽分支）：
   ```
   https://your-preview-url.vercel.app/auth/callback
   ```
   
   例如：
   ```
   https://ichen-app-home-test-20n9i9ig6-leos-projects-0a2aae41.vercel.app/auth/callback
   ```
   
   同時保留本地開發 URL：
   ```
   http://localhost:3000/auth/callback
   ```
7. 點擊 **Save**

> 💡 **提示**：
> - 如果同時有 Production 和 Preview 部署，需要分別添加兩個 Redirect URL
> - 或者使用通配符（如果 Supabase 支援）：`https://*.vercel.app/auth/callback`
> - 每次創建新的預覽部署時，如果 URL 不同，需要添加新的 Redirect URL

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

## ✅ 驗證部署

### 功能測試清單

部署完成後，請測試以下功能：

#### 1. 基本功能

- [ ] 訪問部署 URL，確認頁面正常載入
- [ ] 檢查頁面樣式是否正確
- [ ] 確認沒有 JavaScript 錯誤（打開瀏覽器開發者工具）

#### 2. 導航功能

- [ ] 訪問首頁 `/`，看到 "ICHEN-apps！" 首頁
- [ ] 點擊 "餐廳評分系統" 卡片，進入 `/ratings` 頁面
- [ ] 在 `/ratings` 頁面點擊 "← 回首頁"，返回首頁

#### 3. 認證功能

- [ ] 在 `/ratings` 頁面輸入 Email 地址
- [ ] 點擊「寄送登入連結」
- [ ] 檢查 Email 是否收到 Magic Link
- [ ] 點擊 Magic Link
- [ ] 確認成功登入並顯示使用者 Email
- [ ] 測試登出功能

#### 4. 餐廳評分功能

- [ ] 查看餐廳清單（如果有資料）
- [ ] 新增餐廳（如果已登入）
- [ ] 為餐廳新增評論：
  - [ ] 設定整體評分
  - [ ] 設定分項評分（服務、氣氛、價格CP值、口味、衛生）
  - [ ] 填寫文字評論
- [ ] 查看自己的評論
- [ ] 刪除自己的評論

#### 5. 其他功能

- [ ] 測試 QR Code 掃描功能（如果使用）
- [ ] 測試在不同瀏覽器中是否正常運作
- [ ] 測試在手機瀏覽器中是否正常運作

### 檢查項目

- [ ] 檢查 Vercel 部署日誌，確認無錯誤
- [ ] 檢查瀏覽器 Console，確認無 JavaScript 錯誤
- [ ] 檢查 Network 標籤，確認 Supabase API 請求成功
- [ ] 確認 Cookie 正確設定
- [ ] 檢查 Supabase Dashboard 的日誌，確認請求正常

> 📋 **詳細檢查清單**：參考 [部署檢查清單](./CHECKLIST.md)

---

## 🔄 更新部署

### 自動部署

當你推送新的 commit 到 GitHub 時，Vercel 會自動觸發新的部署：

**生產分支（Production）**：
```bash
# 推送到生產分支（預設為 main）
git add .
git commit -m "Update: 描述你的變更"
git push origin main
```

**其他分支（Preview）**：
```bash
# 推送到其他分支（例如 newtest）會自動創建預覽部署
git add .
git commit -m "Update: 描述你的變更"
git push origin newtest
```

Vercel 會自動：
1. 偵測到新的 commit
2. 開始建置
3. 部署新版本
   - 生產分支推送到 **Production** 環境
   - 其他分支推送到 **Preview** 環境（會生成唯一的預覽 URL）

> 💡 **分支部署說明**：
> - **Production 分支**：通常是 `main` 分支，部署到生產環境（主要 URL）
> - **Preview 分支**：其他所有分支，每次推送會創建預覽部署（臨時 URL）
> - 你可以在 Settings → Git → Production Branch 中修改生產分支
> - 預覽部署非常適合測試新功能，確認無誤後再合併到生產分支

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

## 📝 相關文檔

- [快速開始指南](./QUICK_START.md) - 快速部署流程
- [環境變數配置](./ENVIRONMENT_VARIABLES.md) - 環境變數詳細說明
- [部署檢查清單](./CHECKLIST.md) - 部署前後檢查項目
- [疑難排解](./TROUBLESHOOTING.md) - 常見問題解決方案

---

## 🎉 完成！

恭喜！你已經成功將專案部署到 Vercel。

### 下一步

- 📱 測試手機瀏覽器訪問
- 🔗 分享你的應用 URL
- 🎨 繼續開發新功能
- 📊 監控應用效能（Vercel Analytics）

