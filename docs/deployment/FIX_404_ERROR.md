# 🔧 修復 404 Not Found 錯誤

## 🎯 問題診斷

如果部署後出現 404 Not Found，請按照以下步驟檢查：

---

## ✅ 檢查清單

### 1. 確認 Vercel 專案設定（最重要！）

前往 [Vercel Dashboard](https://vercel.com/dashboard) → 選擇你的專案 → **Settings** → **General**

#### 如果部署的是 `home` 應用：

| 設定項目 | 正確值 | 說明 |
|---------|--------|------|
| **Root Directory** | `apps/home` | ⚠️ 必須設定，不能留空 |
| **Framework Preset** | `Next.js` | 自動偵測 |
| **Build Command** | `cd ../.. && pnpm build --filter=home` | 或 `pnpm build`（如果 Root Directory 已設定） |
| **Output Directory** | `.next` | 或留空（Next.js 會自動處理） |
| **Install Command** | `cd ../.. && pnpm install` | ⚠️ 必須從根目錄執行 |
| **Development Command** | `cd ../.. && pnpm dev --filter=home` | 可選 |

#### 如果部署的是 `restaurant-ratings` 應用：

| 設定項目 | 正確值 | 說明 |
|---------|--------|------|
| **Root Directory** | `apps/restaurant-ratings` | ⚠️ 必須設定，不能留空 |
| **Framework Preset** | `Next.js` | 自動偵測 |
| **Build Command** | `cd ../.. && pnpm build --filter=restaurant-ratings` | 或 `pnpm build`（如果 Root Directory 已設定） |
| **Output Directory** | `.next` | 或留空（Next.js 會自動處理） |
| **Install Command** | `cd ../.. && pnpm install` | ⚠️ 必須從根目錄執行 |
| **Development Command** | `cd ../.. && pnpm dev --filter=restaurant-ratings` | 可選 |

---

### 2. 檢查建置日誌

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 查看 **Build Logs**

**確認事項**：
- ✅ 建置是否成功完成？
- ✅ 是否有錯誤訊息？
- ✅ 路由是否正確生成？（應該看到類似 `Route (app)` 的輸出）

**從你的建置日誌來看**：
```
Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/profile
├ ƒ /api/reviews
├ ƒ /auth/callback
├ ƒ /auth/login
├ ƒ /auth/logout
├ ƒ /auth/register
└ ƒ /ratings
```

這表示路由已正確生成，問題可能在 Vercel 設定。

---

### 3. 檢查訪問的 URL

**確認你訪問的是正確的 URL**：

- 如果是 `home` 應用：應該是 `https://your-project.vercel.app/`
- 如果是 `restaurant-ratings` 應用：應該是 `https://your-project.vercel.app/`

**常見錯誤**：
- ❌ 訪問了錯誤的專案 URL
- ❌ 訪問了 Preview URL 而不是 Production URL
- ❌ URL 後面有多餘的路徑（例如 `/home` 或 `/app`）

---

### 4. 檢查環境變數

前往 **Settings** → **Environment Variables**

確認以下環境變數已設定（至少 Production 環境）：

| 變數名稱 | 必要 | 說明 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名金鑰 |

**注意**：修改環境變數後需要重新部署才會生效。

---

### 5. 檢查部署狀態

前往 **Deployments** 標籤，確認：

- ✅ 最新部署的狀態是 **Ready**（綠色）
- ✅ 不是 **Building** 或 **Error**
- ✅ 部署時間是最新的

---

## 🛠️ 快速修復步驟

### 步驟 1: 確認 Root Directory

**這是最常見的問題！**

1. 前往 Vercel Dashboard → 你的專案 → **Settings** → **General**
2. 找到 **Root Directory**
3. 確認設定為：
   - `apps/home`（如果部署 home 應用）
   - `apps/restaurant-ratings`（如果部署 restaurant-ratings 應用）
4. 如果設定錯誤，點擊 **Edit** 修改
5. 點擊 **Save**

### 步驟 2: 確認 Build Command

1. 在 **Settings** → **General** 中找到 **Build Command**
2. 確認設定為：
   - `cd ../.. && pnpm build --filter=home`（home 應用）
   - `cd ../.. && pnpm build --filter=restaurant-ratings`（restaurant-ratings 應用）
   - 或簡化為 `pnpm build`（如果 Root Directory 已正確設定）

### 步驟 3: 確認 Install Command

1. 在 **Settings** → **General** 中找到 **Install Command**
2. 確認設定為：`cd ../.. && pnpm install`
3. ⚠️ **重要**：必須從根目錄執行，才能安裝 monorepo 的所有依賴

### 步驟 4: 重新部署

修改設定後，需要重新部署：

1. 前往 **Deployments** 標籤
2. 點擊最新部署右側的 **⋯** → **Redeploy**
3. 選擇 **Use existing Build Cache**（可選）
4. 點擊 **Redeploy**
5. 等待建置完成

---

## 🔍 進階診斷

### 檢查實際部署的應用

從建置日誌可以判斷部署的是哪個應用：

**如果看到**：
```
> home@0.1.0 build /vercel/path0/apps/home
```

這表示部署的是 `home` 應用，Root Directory 應該設定為 `apps/home`。

**如果看到**：
```
> restaurant-ratings@0.1.0 build /vercel/path0/apps/restaurant-ratings
```

這表示部署的是 `restaurant-ratings` 應用，Root Directory 應該設定為 `apps/restaurant-ratings`。

---

## 📋 常見問題

### Q: 建置成功但訪問時 404？

**A**: 最可能是 Root Directory 設定錯誤。確認：
1. Root Directory 是否正確設定為 `apps/home` 或 `apps/restaurant-ratings`
2. Build Command 是否正確
3. 訪問的 URL 是否正確

### Q: 路由顯示正確但頁面 404？

**A**: 可能是：
1. Output Directory 設定錯誤（應該留空或設為 `.next`）
2. Next.js 配置問題
3. 需要清除 Vercel 快取並重新部署

### Q: 本地正常但部署後 404？

**A**: 檢查：
1. Vercel 專案設定是否正確
2. 環境變數是否已設定
3. 是否有路徑大小寫問題（Linux 系統區分大小寫）

---

## 🚀 推薦設定（Home 應用）

```
Root Directory: apps/home
Framework Preset: Next.js
Build Command: cd ../.. && pnpm build --filter=home
Output Directory: .next
Install Command: cd ../.. && pnpm install
Development Command: cd ../.. && pnpm dev --filter=home
```

---

## 🚀 推薦設定（Restaurant Ratings 應用）

```
Root Directory: apps/restaurant-ratings
Framework Preset: Next.js
Build Command: cd ../.. && pnpm build --filter=restaurant-ratings
Output Directory: .next
Install Command: cd ../.. && pnpm install
Development Command: cd ../.. && pnpm dev --filter=restaurant-ratings
```

---

## 📞 需要更多幫助？

如果以上步驟都無法解決問題，請提供：
1. Vercel 專案名稱
2. 訪問的 URL
3. 建置日誌截圖
4. Vercel Settings → General 的截圖

