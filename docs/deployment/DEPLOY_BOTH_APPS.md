# 🚀 部署兩個應用（Home + Restaurant Ratings）

## 🎯 目標架構

```
用戶訪問 → Home 應用（主入口）→ 點擊連結 → Restaurant Ratings 應用（評分系統）
```

## 📋 部署策略

你需要部署兩個獨立的 Vercel 專案：

1. **Home 應用**：作為主入口頁面
2. **Restaurant Ratings 應用**：評分系統

---

## 🏠 步驟 1: 部署 Home 應用

### 在 Vercel 創建第一個專案

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **Add New Project**
3. 選擇你的 GitHub 倉庫 `leotsouo/ICHEN-app`
4. 點擊 **Import**

### 配置 Home 應用設定

在 **Configure Project** 頁面：

- **Project Name**: `ichen-app-home`（或你喜歡的名稱）
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/home`
- **Build Command**: `pnpm build`（或 `cd ../.. && pnpm build --filter=home`）
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && pnpm install`
- **Development Command**: `cd ../.. && pnpm dev --filter=home`

### 設定環境變數（Home 應用）

在 **Environment Variables** 區塊添加：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` | `https://ichen-app-restaurant-ratings.vercel.app` | Restaurant Ratings 應用的 URL（稍後設定） |

> ⚠️ **注意**：先部署 Restaurant Ratings 應用，取得 URL 後再回來設定這個環境變數。

### 部署 Home 應用

1. 點擊 **Deploy**
2. 等待建置完成
3. 記下部署 URL（例如：`https://ichen-app-home.vercel.app`）

---

## 🍽️ 步驟 2: 部署 Restaurant Ratings 應用

### 在 Vercel 創建第二個專案

1. 在 Vercel Dashboard 中，再次點擊 **Add New Project**
2. 選擇同一個 GitHub 倉庫 `leotsouo/ICHEN-app`
3. 點擊 **Import**

### 配置 Restaurant Ratings 應用設定

在 **Configure Project** 頁面：

- **Project Name**: `ichen-app-restaurant-ratings`（或你喜歡的名稱）
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/restaurant-ratings`
- **Build Command**: `cd ../.. && pnpm build --filter=restaurant-ratings`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && pnpm install`
- **Development Command**: `cd ../.. && pnpm dev --filter=restaurant-ratings`

### 設定環境變數（Restaurant Ratings 應用）

在 **Environment Variables** 區塊添加：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_HOME_URL` | `https://ichen-app-home.vercel.app` | Home 應用的 URL（從步驟 1 取得） |

### 部署 Restaurant Ratings 應用

1. 點擊 **Deploy**
2. 等待建置完成
3. 記下部署 URL（例如：`https://ichen-app-restaurant-ratings.vercel.app`）

---

## 🔗 步驟 3: 連接兩個應用

### 更新 Home 應用的環境變數

1. 前往 Home 應用的 Vercel Dashboard
2. Settings → Environment Variables
3. 更新 `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` 為 Restaurant Ratings 的實際 URL
4. 重新部署 Home 應用（Deployments → 最新部署 → ⋯ → Redeploy）

### 更新 Restaurant Ratings 應用的環境變數

1. 前往 Restaurant Ratings 應用的 Vercel Dashboard
2. Settings → Environment Variables
3. 確認 `NEXT_PUBLIC_HOME_URL` 已設定為 Home 應用的 URL
4. 如果還沒設定，添加並重新部署

---

## ✅ 驗證部署

### 測試流程

1. **訪問 Home 應用**
   - 前往 `https://ichen-app-home.vercel.app`
   - 應該看到 "ICHEN-apps！" 首頁
   - 應該看到 "餐廳評分系統" 卡片

2. **點擊進入評分系統**
   - 點擊 "餐廳評分系統" 卡片
   - 應該跳轉到 `https://ichen-app-restaurant-ratings.vercel.app`
   - 應該看到餐廳評分系統頁面

3. **測試回首頁**
   - 在評分系統頁面點擊 "← 回首頁"
   - 應該跳轉回 Home 應用

---

## 📝 部署檢查清單

### Home 應用

- [ ] Root Directory 設定為 `apps/home`
- [ ] Install Command 從根目錄執行
- [ ] 環境變數 `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` 已設定
- [ ] 部署成功並可以訪問

### Restaurant Ratings 應用

- [ ] Root Directory 設定為 `apps/restaurant-ratings`
- [ ] Install Command 從根目錄執行
- [ ] 環境變數 `NEXT_PUBLIC_SUPABASE_URL` 已設定
- [ ] 環境變數 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定
- [ ] 環境變數 `NEXT_PUBLIC_HOME_URL` 已設定
- [ ] Supabase Redirect URL 已設定
- [ ] 部署成功並可以訪問

### 連接測試

- [ ] 從 Home 可以點擊進入 Restaurant Ratings
- [ ] 從 Restaurant Ratings 可以返回 Home
- [ ] 連結 URL 正確無誤

---

## 🔄 更新部署

當程式碼更新後：

### 更新 Home 應用

```bash
git add .
git commit -m "Update: 更新 home 應用"
git push origin main
```

Vercel 會自動部署 Home 應用。

### 更新 Restaurant Ratings 應用

```bash
git add .
git commit -m "Update: 更新 restaurant-ratings 應用"
git push origin main
```

Vercel 會自動部署 Restaurant Ratings 應用。

> 💡 **提示**：兩個應用會同時觸發部署，因為它們使用同一個 GitHub 倉庫。

---

## 🎯 推薦的 URL 結構

### 生產環境

- **Home**: `https://ichen-app-home.vercel.app`
- **Restaurant Ratings**: `https://ichen-app-restaurant-ratings.vercel.app`

### 自訂網域（可選）

如果你有自訂網域，可以設定：

- **Home**: `https://apps.yourdomain.com`
- **Restaurant Ratings**: `https://ratings.yourdomain.com`

或使用子路徑（需要額外配置）：

- **Home**: `https://yourdomain.com`
- **Restaurant Ratings**: `https://yourdomain.com/ratings`

---

## 🔗 相關文檔

- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)
- [完整部署攻略](./VERCEL_DEPLOYMENT_GUIDE.md)
- [修復 Vercel 錯誤](./FIX_VERCEL_ERROR.md)

---

## 💡 提示

1. **環境變數順序**：建議先部署 Restaurant Ratings，取得 URL 後再設定 Home 的環境變數
2. **自動部署**：兩個應用都會自動偵測 GitHub 的變更並部署
3. **獨立管理**：兩個應用在 Vercel 中是獨立的專案，可以分別管理
4. **成本**：Vercel 免費方案支援多個專案，兩個應用都在免費額度內

