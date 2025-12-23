# 🔄 更新現有 Vercel 部署（保持 URL 不變）

## 🎯 目標

更新現有的 `ichen-app-restaurant-ratings` Vercel 項目，讓它部署整合後的 `home` 應用。

**優勢**：
- ✅ **URL 保持不變**：`https://ichen-app-restaurant-ratings.vercel.app`
- ✅ **QR Code 不需要更新**：掃描後會進入新的首頁
- ✅ **不需要重新分享連結**：所有現有連結都有效

---

## 📋 步驟 1: 訪問 Vercel Dashboard

1. 訪問：https://vercel.com/dashboard
2. 找到並選擇項目：**`ichen-app-restaurant-ratings`**

---

## 📋 步驟 2: 更新項目設定

### 2.1 進入 Settings

點擊項目 → **Settings** → **General**

### 2.2 更新 Root Directory（重要！）

1. 找到 **Root Directory** 設定
2. 點擊 **Edit**
3. **將值從** `apps/restaurant-ratings` **改為**：**`apps/home`**
4. 點擊 **Save**

### 2.3 更新 Build Command

1. 找到 **Build Command** 設定
2. 點擊 **Edit**
3. **將值改為**：
   ```
   cd ../.. && pnpm build --filter=home
   ```
4. 點擊 **Save**

### 2.4 確認其他設定

確認以下設定：

- **Framework Preset**: `Next.js`（應該自動偵測）
- **Output Directory**: `.next`（或留空）
- **Install Command**: `cd ../.. && pnpm install`（應該已經正確）
- **Development Command**: `cd ../.. && pnpm dev --filter=home`（可選更新）

---

## 📋 步驟 3: 檢查環境變數

### 3.1 進入 Environment Variables

Settings → **Environment Variables**

### 3.2 確認必要變數

確認以下環境變數已設定：

| 變數名稱 | 必要 | 環境 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Production, Preview, Development |

**不需要** `NEXT_PUBLIC_HOME_URL` 或 `NEXT_PUBLIC_RESTAURANT_RATINGS_URL`（已經整合）

---

## 📋 步驟 4: 重新部署

### 4.1 觸發重新部署

有兩種方式：

**方式 1: 手動觸發（推薦）**
1. 前往 **Deployments** 標籤
2. 點擊最新的部署右側的 **⋯** → **Redeploy**
3. 選擇 **Use existing Build Cache**（可選）
4. 點擊 **Redeploy**

**方式 2: 推送代碼觸發**
```bash
# 在 main 分支做一個小改動
git commit --allow-empty -m "觸發 Vercel 重新部署"
git push origin main
```

### 4.2 等待建置完成

- 建置時間：約 2-3 分鐘
- 查看建置日誌確認沒有錯誤

---

## 📋 步驟 5: 更新 Supabase Redirect URL（如果需要）

### 5.1 檢查當前 Redirect URL

如果當前的 Redirect URL 是：
```
https://ichen-app-restaurant-ratings.vercel.app/auth/callback
```

**不需要更改**，因為 URL 保持不變！

### 5.2 如果 Redirect URL 是根路徑

如果之前設定的是：
```
https://ichen-app-restaurant-ratings.vercel.app
```

需要更新為：
```
https://ichen-app-restaurant-ratings.vercel.app/auth/callback
```

**步驟**：
1. 訪問 Supabase Dashboard → Authentication → URL Configuration
2. 更新 Redirect URLs
3. 更新 Site URL 為：`https://ichen-app-restaurant-ratings.vercel.app`

---

## ✅ 部署後測試

### 測試清單

1. **首頁測試**（新功能）
   - [ ] 訪問 `https://ichen-app-restaurant-ratings.vercel.app/`
   - [ ] 看到 "ICHEN-apps！" 首頁
   - [ ] 看到 "餐廳評分系統" 卡片

2. **QR Code 測試**（重要！）
   - [ ] 掃描 QR Code → 進入首頁（**新功能**）
   - [ ] 從首頁可以點擊進入評分系統

3. **導航測試**
   - [ ] 點擊 "餐廳評分系統" → 進入 `/ratings`
   - [ ] 點擊 "← 回首頁" → 返回首頁

4. **Magic Link 認證測試**
   - [ ] 在 `/ratings` 頁面輸入 Email
   - [ ] 點擊 "寄送登入連結"
   - [ ] 收到 Magic Link Email
   - [ ] 點擊 Magic Link → 正確跳轉到 `/auth/callback` 然後到 `/ratings`
   - [ ] 顯示 "登入成功！" 訊息

5. **功能測試**
   - [ ] 可以新增餐廳
   - [ ] 可以新增評論
   - [ ] 可以登出

---

## 🎉 URL 結構變化

### 之前（舊部署）
- 評分系統：`https://ichen-app-restaurant-ratings.vercel.app/`
- 沒有首頁

### 現在（更新後）
- **首頁**：`https://ichen-app-restaurant-ratings.vercel.app/`（**新功能**）
- **評分系統**：`https://ichen-app-restaurant-ratings.vercel.app/ratings`
- **認證回調**：`https://ichen-app-restaurant-ratings.vercel.app/auth/callback`

**QR Code 指向的 URL 保持不變**，但現在會顯示新的首頁！

---

## 🚨 常見問題

### 問題 1: 建置失敗 - "Module not found"

**解決方案**：
- 確認 Root Directory 已更新為 `apps/home`
- 確認 Build Command 為：`cd ../.. && pnpm build --filter=home`
- 確認 Install Command 為：`cd ../.. && pnpm install`

### 問題 2: 部署後還是舊頁面

**解決方案**：
- 清除瀏覽器快取（Ctrl+Shift+R 或 Cmd+Shift+R）
- 確認部署的是最新的 main 分支
- 檢查建置日誌確認沒有錯誤

### 問題 3: QR Code 掃描後還是舊頁面

**解決方案**：
- QR Code 指向的 URL 是 `https://ichen-app-restaurant-ratings.vercel.app/`
- 更新後這個 URL 會顯示新的首頁
- 如果還是舊頁面，清除瀏覽器快取

---

## 📝 快速檢查清單

部署前：
- [ ] Root Directory 已更新為 `apps/home`
- [ ] Build Command 已更新為 `cd ../.. && pnpm build --filter=home`
- [ ] 環境變數已確認（`NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）

部署後：
- [ ] 首頁正常顯示（`/`）
- [ ] 評分系統正常顯示（`/ratings`）
- [ ] Magic Link 認證正常
- [ ] QR Code 掃描正常（進入首頁）

---

## 🔗 相關文檔

- [快速部署指南](./QUICK_VERCEL_DEPLOY.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)
- [整合部署指南](./INTEGRATED_DEPLOY.md)

