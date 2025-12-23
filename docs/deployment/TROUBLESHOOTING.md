# 🔧 疑難排解指南

本指南涵蓋部署過程中常見的問題和解決方案。

## 📋 目錄

1. [建置失敗](#建置失敗)
2. [環境變數問題](#環境變數問題)
3. [認證問題](#認證問題)
4. [頁面顯示問題](#頁面顯示問題)
5. [資料庫連線問題](#資料庫連線問題)
6. [Monorepo 相關問題](#monorepo-相關問題)

---

## 🔨 建置失敗

### 症狀

Vercel 建置時出現錯誤，部署失敗。

### 解決方案

#### 1. 檢查建置日誌

1. 前往 Vercel Dashboard → Deployments
2. 點擊失敗的部署查看詳細日誌
3. 查看錯誤訊息

#### 2. 常見原因和解決方案

**原因 A: Root Directory 設定錯誤**

- **錯誤訊息**：`Module not found` 或 `Cannot find module`
- **解決方案**：
  - 確認 Root Directory 設定為 `apps/home`
  - 前往 Settings → General → Root Directory

**原因 B: Install Command 錯誤**

- **錯誤訊息**：`Cannot find package` 或 `Workspace not found`
- **解決方案**：
  - 確認 Install Command 為 `cd ../.. && pnpm install`
  - 必須從根目錄執行才能安裝 monorepo 的所有依賴

**原因 C: Build Command 錯誤**

- **錯誤訊息**：建置過程中找不到模組或路徑錯誤
- **解決方案**：
  - 確認 Build Command 為 `cd ../.. && pnpm build --filter=home`
  - 或使用 `vercel.json` 中的配置（留空讓 Vercel 自動使用）

**原因 D: 依賴安裝失敗**

- **錯誤訊息**：`pnpm install` 失敗
- **解決方案**：
  1. 檢查 `package.json` 中的依賴是否正確
  2. 確認 `pnpm-lock.yaml` 已提交到 Git
  3. 本地測試：`cd apps/home && pnpm build`

#### 3. 本地測試建置

在推送前，先在本地測試建置：

**方法 1：從根目錄執行（推薦，跨平台）**
```bash
# 1. 確保在專案根目錄
cd /path/to/ICHEN-app

# 2. 安裝依賴
pnpm install

# 3. 測試建置
pnpm build --filter=home
```

**方法 2：進入應用目錄**
```bash
# PowerShell
cd apps/home; pnpm build

# Bash/Zsh
cd apps/home && pnpm build
```

如果本地建置失敗，先修復本地問題再推送。

---

## 🔐 環境變數問題

### 症狀

部署後應用無法正常運行，Supabase 連線失敗。

### 解決方案

#### 1. 檢查環境變數設定

1. 前往 Vercel Dashboard → Settings → Environment Variables
2. 確認所有必要環境變數都已設定
3. 確認變數名稱正確（大小寫敏感，必須包含 `NEXT_PUBLIC_` 前綴）
4. 確認變數值正確（沒有多餘的空格或引號）

#### 2. 確認環境變數已套用

- 確認環境變數已套用到所有環境（Production, Preview, Development）
- 修改環境變數後需要重新部署才能生效

#### 3. 重新部署

更新環境變數後：

1. 前往 Deployments 標籤
2. 點擊最新部署右側的 **⋯** → **Redeploy**
3. 或推送新的 commit 到 GitHub

> 📖 **詳細說明**：參考 [環境變數配置指南](./ENVIRONMENT_VARIABLES.md)

---

## 🔑 認證問題

### 問題 1: Magic Link 無法登入

#### 症狀

點擊 Magic Link 後無法登入或出現錯誤。

#### 解決方案

**步驟 1: 確認 Supabase 重定向 URL 設定**

1. 前往 Supabase Dashboard → Authentication → URL Configuration
2. 確認 `https://your-app.vercel.app/auth/callback` 已添加到 Redirect URLs
3. 確認 URL 完全一致（包括 `https://` 前綴，無結尾斜線）

**步驟 2: 確認 Site URL 設定**

在 Supabase Dashboard → Authentication → URL Configuration：

- 設定 **Site URL** 為 `https://your-app.vercel.app`

**步驟 3: 檢查 Vercel 日誌**

1. 前往 Vercel Dashboard → Deployments → 選擇部署 → Functions
2. 查看 `/auth/callback` 的日誌
3. 確認是否有錯誤訊息

**步驟 4: 清除瀏覽器快取和 Cookie**

- 清除瀏覽器的快取和 Cookie
- 使用無痕模式測試

### 問題 2: 登入後立即登出

#### 症狀

點擊 Magic Link 後成功登入，但刷新頁面後又變成未登入狀態。

#### 解決方案

1. 檢查瀏覽器 Cookie 設定（確認沒有阻擋 Cookie）
2. 檢查 Supabase 的 Session 設定
3. 查看瀏覽器 Console 是否有錯誤

---

## 🖥️ 頁面顯示問題

### 問題 1: 頁面顯示空白

#### 症狀

部署後頁面無法正常顯示，顯示空白頁面。

#### 解決方案

**步驟 1: 檢查瀏覽器 Console**

1. 打開瀏覽器開發者工具（F12）
2. 查看 Console 標籤是否有錯誤訊息
3. 查看 Network 標籤，確認資源是否正常載入

**步驟 2: 檢查環境變數**

1. 確認 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已正確設定
2. 確認環境變數值正確

**步驟 3: 檢查建置日誌**

1. 前往 Vercel Dashboard → Deployments
2. 查看建置日誌，確認無錯誤

### 問題 2: 樣式顯示錯誤

#### 症狀

頁面可以訪問，但樣式顯示不正確。

#### 解決方案

1. 檢查 `globals.css` 是否正確載入
2. 確認 CSS 模組導入路徑正確
3. 清除瀏覽器快取

---

## 🗄️ 資料庫連線問題

### 症狀

無法讀取或寫入資料，API 請求失敗。

### 解決方案

#### 1. 確認 Supabase 專案狀態

1. 前往 Supabase Dashboard
2. 確認專案沒有暫停或過期
3. 確認專案運行正常

#### 2. 檢查資料表權限

1. 確認 RLS (Row Level Security) 政策正確設定
2. 確認使用者有權限讀寫資料
3. 檢查資料表的權限設定

#### 3. 檢查 Supabase 日誌

1. 前往 Supabase Dashboard → Logs
2. 查看是否有錯誤訊息
3. 確認 API 請求是否正常

#### 4. 驗證環境變數

確認 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正確設定。

---

## 📦 Monorepo 相關問題

### 問題 1: 找不到共享包

#### 症狀

建置時出現 `Cannot find module '@ichen-app/shared-ratings'` 錯誤。

#### 解決方案

1. **確認 Install Command 正確**：
   - 必須為 `cd ../.. && pnpm install`
   - 必須從根目錄執行才能安裝所有 workspace 依賴

2. **確認 Build Command 正確**：
   - 必須為 `cd ../.. && pnpm build --filter=home`
   - 或在 `vercel.json` 中配置

3. **確認 `next.config.ts` 配置**：
   ```typescript
   transpilePackages: [
     "@ichen-app/shared-ratings",
     "@ichen-app/shared-supabase",
   ]
   ```

### 問題 2: 路徑解析錯誤

#### 症狀

建置時出現路徑相關錯誤。

#### 解決方案

1. 確認 `tsconfig.json` 中的路徑配置正確
2. 確認 `next.config.ts` 中的 `transpilePackages` 包含所有共享包
3. 確認共享包的 `package.json` 配置正確

---

## 🔍 調試技巧

### 1. 查看 Vercel 建置日誌

1. 前往 Vercel Dashboard → Deployments
2. 點擊部署查看詳細日誌
3. 查看錯誤訊息和堆疊追蹤

### 2. 查看瀏覽器 Console

1. 打開瀏覽器開發者工具（F12）
2. 查看 Console 標籤的錯誤訊息
3. 查看 Network 標籤，確認 API 請求是否成功

### 3. 本地測試

在推送前，確保本地可以正常運行和建置：

```bash
# 本地運行
pnpm dev

# 本地建置
cd apps/home
pnpm build
```

### 4. 檢查 Supabase 日誌

1. 前往 Supabase Dashboard → Logs
2. 查看 API 請求日誌
3. 確認是否有錯誤或異常請求

---

## 📚 相關文檔

- [完整部署指南](./DEPLOYMENT.md)
- [環境變數配置](./ENVIRONMENT_VARIABLES.md)
- [部署檢查清單](./CHECKLIST.md)

## 🆘 仍然無法解決？

如果以上解決方案都無法解決問題，請：

1. 收集錯誤訊息和日誌
2. 確認問題重現步驟
3. 檢查相關文檔和資源
4. 聯繫專案維護者或尋求社群幫助

