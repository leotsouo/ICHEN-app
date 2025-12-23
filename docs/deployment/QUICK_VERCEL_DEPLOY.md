# ⚡ 快速 Vercel 部署指南

## 🎯 部署目標

部署整合後的 `home` 應用到 Vercel，實現單一域名訪問所有功能。

---

## 📋 步驟 1: 準備 GitHub 倉庫

✅ **已完成** - PR 已合併到 `main` 分支

---

## 📋 步驟 2: 在 Vercel 創建新項目

### 2.1 訪問 Vercel Dashboard

1. 訪問：https://vercel.com/dashboard
2. 點擊 "Add New..." → "Project"

### 2.2 導入 GitHub 倉庫

1. 選擇倉庫：`leotsouo/ICHEN-app`
2. 點擊 "Import"

---

## 📋 步驟 3: 配置項目設定

### 3.1 Framework Preset

- **Framework Preset**: `Next.js`（自動偵測）

### 3.2 Root Directory

**重要！** 必須設定 Root Directory：

1. 點擊 "Root Directory" 旁邊的 "Edit"
2. 選擇：`apps/home`
3. 點擊 "Continue"

### 3.3 Build and Output Settings

**Build Command**:
```
cd ../.. && pnpm build --filter=home
```

**Output Directory**:
```
.next
```

**Install Command**:
```
cd ../.. && pnpm install
```

**Development Command**:
```
cd ../.. && pnpm dev --filter=home
```

---

## 📋 步驟 4: 設定環境變數

在 "Environment Variables" 區塊，添加以下變數：

### 必要變數

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `你的 Supabase URL` | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `你的 Supabase Anon Key` | Supabase 匿名金鑰 |

### 可選變數

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `你的 Google Maps API Key` | Google Maps API（用於地址自動完成） |

**設定環境**：
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 📋 步驟 5: 部署

1. 點擊 "Deploy"
2. 等待建置完成（約 2-3 分鐘）

---

## 📋 步驟 6: 更新 Supabase Redirect URL

部署完成後，記下你的 Vercel URL（例如：`https://ichen-app-home.vercel.app`）

### 6.1 訪問 Supabase Dashboard

1. 訪問：https://supabase.com/dashboard
2. 選擇你的專案
3. 進入 **Authentication** → **URL Configuration**

### 6.2 更新 Redirect URLs

在 **Redirect URLs** 欄位中，添加：

```
https://你的-vercel-域名.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**範例**：
```
https://ichen-app-home.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 6.3 更新 Site URL

設定 **Site URL** 為：

```
https://你的-vercel-域名.vercel.app
```

**範例**：
```
https://ichen-app-home.vercel.app
```

---

## ✅ 部署後測試

### 測試清單

1. **首頁測試**
   - [ ] 訪問 `https://你的-vercel-域名.vercel.app/`
   - [ ] 看到 "ICHEN-apps！" 首頁
   - [ ] 看到 "餐廳評分系統" 卡片

2. **導航測試**
   - [ ] 點擊 "餐廳評分系統" → 進入 `/ratings`
   - [ ] 點擊 "← 回首頁" → 返回首頁

3. **Magic Link 認證測試**（最重要！）
   - [ ] 在 `/ratings` 頁面輸入 Email
   - [ ] 點擊 "寄送登入連結"
   - [ ] 收到 Magic Link Email
   - [ ] 點擊 Magic Link
   - [ ] **檢查 URL**：應該跳轉到 `/auth/callback?code=...` 然後到 `/ratings?m=logged_in`
   - [ ] 顯示 "登入成功！" 訊息
   - [ ] 顯示用戶 Email 和登出按鈕

4. **功能測試**
   - [ ] 可以新增餐廳
   - [ ] 可以新增評論
   - [ ] 可以登出

---

## 🚨 常見問題

### 問題 1: 建置失敗 - "Module not found"

**解決方案**：
- 確認 Root Directory 設定為 `apps/home`
- 確認 Build Command 為：`cd ../.. && pnpm build --filter=home`
- 確認 Install Command 為：`cd ../.. && pnpm install`

### 問題 2: Magic Link 重定向失敗

**解決方案**：
- 確認 Supabase Redirect URL 已設定為 `/auth/callback`
- 確認 Site URL 已設定為你的 Vercel 域名
- 清除瀏覽器快取和 Cookie

### 問題 3: 環境變數未生效

**解決方案**：
- 確認環境變數名稱正確（包含 `NEXT_PUBLIC_` 前綴）
- 確認已設定 Production、Preview、Development 環境
- 重新部署項目

---

## 📝 部署完成後

部署成功後，你的應用將在以下 URL 可用：

- **首頁**: `https://你的-vercel-域名.vercel.app/`
- **評分系統**: `https://你的-vercel-域名.vercel.app/ratings`

---

## 🔗 相關文檔

- [完整部署指南](./INTEGRATED_DEPLOY.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)
- [Magic Link 修復指南](./FIX_MAGIC_LINK_REDIRECT.md)

