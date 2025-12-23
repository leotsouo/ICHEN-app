# 🔧 修復 Magic Link 重定向問題

## 🚨 問題描述

點擊 Magic Link 後，URL 變成：
```
https://ichen-app-restaurant-ratings.vercel.app/?code=...
```

**應該要變成**：
```
https://ichen-app-restaurant-ratings.vercel.app/auth/callback?code=...
```

---

## 🔍 問題原因

這是因為 **Supabase 的 Redirect URL 配置** 限制了允許的重定向路徑。

即使代碼中設置了 `emailRedirectTo: /auth/callback`，如果 Supabase 的 Redirect URL 配置中**沒有包含** `/auth/callback`，Supabase 會**忽略**這個參數，使用配置中允許的第一個 URL（通常是根路徑 `/`）。

---

## ✅ 解決方案

### 方案 1: 更新 Supabase Redirect URL 配置（推薦）

1. **登入 Supabase Dashboard**
   - 訪問：https://supabase.com/dashboard
   - 選擇你的專案

2. **進入 Authentication 設定**
   - 左側選單 → **Authentication**
   - 點擊 **URL Configuration**

3. **更新 Redirect URLs**
   
   在 **Redirect URLs** 欄位中，確保包含以下 URL：
   
   ```
   https://ichen-app-restaurant-ratings.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
   
   **注意**：
   - 每個 URL 一行
   - 必須包含完整的路徑 `/auth/callback`
   - 必須包含 `http://localhost:3000/auth/callback` 用於本地開發

4. **儲存設定**
   - 點擊 **Save**

5. **重新測試**
   - 發送新的 Magic Link
   - 點擊後應該正確跳轉到 `/auth/callback?code=...`

---

### 方案 2: 臨時修復（已實作）

我已經在 `apps/restaurant-ratings/src/app/page.tsx` 中添加了臨時修復：

```typescript
// 如果 URL 中有 code 參數（Magic Link 認證），重定向到 callback
if (params.code) {
  redirect(`/auth/callback?code=${params.code}`);
}
```

**這個修復會**：
- 檢測根路徑的 `code` 參數
- 自動重定向到 `/auth/callback?code=...`
- 讓認證流程正常運作

**但這只是臨時方案**，建議還是更新 Supabase 配置。

---

### 方案 3: 部署整合後的應用（最佳方案）

整合後的 `home` 應用已經包含了這個修復，並且：

1. **單一域名部署**
   - 所有應用都在同一個域名下
   - 更容易管理 Supabase Redirect URL

2. **統一的認證流程**
   - 所有應用共享相同的認證邏輯
   - 減少配置錯誤

3. **更好的用戶體驗**
   - 統一的導航
   - 無縫的應用切換

**部署步驟**：
1. 測試本地 `home` 應用（參考 `docs/testing/TEST_HOME_APP.md`）
2. 推送到 GitHub
3. 部署到 Vercel（參考 `docs/deployment/INTEGRATED_DEPLOY.md`）
4. 更新 Supabase Redirect URL 為新的 Vercel URL

---

## 📋 Supabase Redirect URL 完整清單

部署整合後的應用後，Supabase Redirect URLs 應該包含：

```
# 生產環境
https://your-vercel-domain.vercel.app/auth/callback

# 預覽環境（可選）
https://your-vercel-project-*.vercel.app/auth/callback

# 本地開發
http://localhost:3000/auth/callback
```

---

## ✅ 驗證修復

### 測試步驟

1. **發送 Magic Link**
   - 在應用中輸入 Email
   - 點擊 "寄送登入連結"

2. **點擊 Magic Link**
   - 檢查 URL 變化：
     - ✅ **正確**：`/auth/callback?code=...`
     - ❌ **錯誤**：`/?code=...`

3. **檢查認證結果**
   - ✅ 自動跳轉到 `/ratings?m=logged_in&t=...`
   - ✅ 顯示 "登入成功！" 訊息
   - ✅ 顯示用戶 Email 和登出按鈕

---

## 🔄 如果問題仍然存在

### 檢查清單

- [ ] Supabase Redirect URL 配置已更新
- [ ] 包含完整的 `/auth/callback` 路徑
- [ ] 包含本地開發 URL `http://localhost:3000/auth/callback`
- [ ] 已重新發送 Magic Link（使用新的配置）
- [ ] 清除瀏覽器快取和 Cookie
- [ ] 檢查瀏覽器控制台是否有錯誤

### 常見錯誤

1. **Redirect URL 不匹配**
   - 錯誤：只配置了 `https://your-domain.vercel.app`
   - 正確：必須配置 `https://your-domain.vercel.app/auth/callback`

2. **缺少本地開發 URL**
   - 錯誤：只配置了生產環境 URL
   - 正確：必須包含 `http://localhost:3000/auth/callback`

3. **URL 格式錯誤**
   - 錯誤：`your-domain.vercel.app/auth/callback`（缺少協議）
   - 正確：`https://your-domain.vercel.app/auth/callback`

---

## 📝 相關文件

- `docs/deployment/INTEGRATED_DEPLOY.md` - 整合應用部署指南
- `docs/testing/TEST_HOME_APP.md` - 本地測試指南
- `docs/deployment/DEPLOYMENT.md` - 完整部署文檔

