# 🌐 單一域名部署方案

## 🎯 目標

將 `home` 和 `restaurant-ratings` 兩個應用部署在同一個 Vercel 項目中，使用同一個域名。

## 📋 方案說明

### 架構設計

```
用戶訪問 → https://your-app.vercel.app/
          ↓
        Home 應用（主頁）
          ↓
    點擊「餐廳評分系統」
          ↓
    https://your-app.vercel.app/ratings
          ↓
    Restaurant Ratings 應用（通過 rewrites）
```

## 🚀 部署步驟

### 方案 A: 使用 Vercel Rewrites（推薦）

這個方案需要部署兩個應用，但使用 rewrites 將它們整合到同一個域名。

#### 步驟 1: 部署 Home 應用（主應用）

1. 在 Vercel 創建新專案或使用現有專案
2. 設定：
   - **Root Directory**: `apps/home`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `pnpm build`
   - **Install Command**: `cd ../.. && pnpm install`
   - **Output Directory**: `.next`

3. 設定環境變數：
   ```
   NEXT_PUBLIC_RESTAURANT_RATINGS_URL=https://your-restaurant-ratings-app.vercel.app
   ```

#### 步驟 2: 部署 Restaurant Ratings 應用

1. 在 Vercel 創建另一個專案
2. 設定：
   - **Root Directory**: `apps/restaurant-ratings`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `cd ../.. && pnpm build --filter=restaurant-ratings`
   - **Install Command**: `cd ../.. && pnpm install`
   - **Output Directory**: `.next`

3. 設定環境變數：
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_HOME_URL=https://your-home-app.vercel.app
   ```

#### 步驟 3: 配置 Rewrites

Home 應用已經配置了 `next.config.ts` 中的 rewrites，會自動將 `/ratings/*` 路徑重寫到 Restaurant Ratings 應用。

### 方案 B: 整合到單一應用（更簡單）

如果不想管理兩個部署，可以將 Restaurant Ratings 的內容整合到 Home 應用中。

#### 步驟 1: 將 Restaurant Ratings 作為 Home 的子路由

1. 將 `apps/restaurant-ratings` 的內容複製到 `apps/home/src/app/ratings/`
2. 更新所有導入路徑
3. 確保共享包可以正常使用

#### 步驟 2: 部署單一應用

1. 在 Vercel 設定：
   - **Root Directory**: `apps/home`
   - **Build Command**: `pnpm build`
   - **Install Command**: `cd ../.. && pnpm install`

2. 設定環境變數：
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## ✅ 當前實現（方案 A）

目前已經實現了方案 A：

1. ✅ Home 應用使用 `/ratings` 作為相對路徑
2. ✅ `next.config.ts` 中配置了 rewrites
3. ✅ 需要設定 `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` 環境變數

### 使用方式

1. **部署 Home 應用**：
   - Root Directory: `apps/home`
   - 設定環境變數 `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` 為 Restaurant Ratings 的 URL

2. **部署 Restaurant Ratings 應用**：
   - Root Directory: `apps/restaurant-ratings`
   - 設定環境變數 `NEXT_PUBLIC_HOME_URL` 為 Home 的 URL

3. **用戶體驗**：
   - 訪問 `https://your-home-app.vercel.app/` → 看到 Home 頁面
   - 點擊「餐廳評分系統」→ 自動跳轉到 `https://your-home-app.vercel.app/ratings`
   - `/ratings` 路徑會通過 rewrites 重寫到 Restaurant Ratings 應用

## 🔧 注意事項

### Rewrites 的限制

Next.js 的 rewrites 只能重寫到外部 URL，這意味著：
- 兩個應用仍然需要分別部署
- 但用戶看到的是同一個域名
- 實際請求會被重寫到另一個應用的 URL

### 更好的方案（未來）

如果想要真正的單一應用部署，建議：
1. 將 Restaurant Ratings 的內容整合到 Home 應用中
2. 使用 Next.js 的路由系統，而不是 rewrites
3. 這樣可以真正實現單一部署

## 📝 檢查清單

- [ ] Home 應用已部署
- [ ] Restaurant Ratings 應用已部署
- [ ] `NEXT_PUBLIC_RESTAURANT_RATINGS_URL` 環境變數已設定
- [ ] `NEXT_PUBLIC_HOME_URL` 環境變數已設定
- [ ] 測試從 Home 點擊進入評分系統
- [ ] 測試從評分系統返回 Home

## 🔗 相關文檔

- [部署兩個應用](./DEPLOY_BOTH_APPS.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)

