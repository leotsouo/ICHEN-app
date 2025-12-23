# 🔧 修復 Framework 設定錯誤

## 🎯 問題

在 Vercel Dashboard → Framework Settings 中，**Framework** 被設定為 **"Other"**，導致 "No framework detected" 錯誤。

## ✅ 解決步驟

### 步驟 1: 更新 Production Overrides

在 **Framework Settings** 頁面：

1. 找到 **Production Overrides** 區域
2. 點擊 **Framework** 欄位
3. 從下拉選單中選擇：**`Next.js`**
4. 點擊 **Save** 或確認更改

### 步驟 2: 檢查並更新 Project Settings

1. 展開 **Project Settings** 區域（點擊向下箭頭）
2. 確認以下設定：

| 設定項目 | 正確值 |
|---------|--------|
| **Framework** | `Next.js` |
| **Build Command** | `pnpm build` |
| **Output Directory** | `.next` 或留空 |
| **Install Command** | `cd ../.. && pnpm install` |
| **Development Command** | `cd ../.. && pnpm dev --filter=home` |

3. 如果設定不正確，點擊 **Edit** 修改

### 步驟 3: 確認 Root Directory

前往 **Settings** → **General**：

1. 找到 **Root Directory** 設定
2. 確認設定為：`apps/home`
3. 如果不是，點擊 **Edit** → 修改為 `apps/home` → **Save**

### 步驟 4: 重新部署

更新 Framework 設定後：

1. 前往 **Deployments** 標籤
2. 點擊最新部署右側的 **⋯** → **Redeploy**
3. **取消勾選** "Use existing Build Cache"
4. 點擊 **Redeploy**
5. 等待建置完成

---

## 📋 完整設定檢查清單

更新 Framework 後，確認以下設定：

### Framework Settings
- [ ] **Framework**: `Next.js`（在 Production Overrides 和 Project Settings 中）
- [ ] **Build Command**: `pnpm build`
- [ ] **Install Command**: `cd ../.. && pnpm install`
- [ ] **Development Command**: `cd ../.. && pnpm dev --filter=home`

### General Settings
- [ ] **Root Directory**: `apps/home`
- [ ] **Output Directory**: `.next` 或留空

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已設定
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定

---

## 🚨 重要提示

**警告訊息說明**：
> "Configuration Settings in the current Production deployment differ from your current Project Settings."

這表示 Production Overrides 和 Project Settings 不一致。建議：

1. **統一設定**：讓 Production Overrides 和 Project Settings 使用相同的值
2. **優先使用 Project Settings**：除非有特殊需求，否則建議在 Project Settings 中設定，讓 Production Overrides 繼承

---

## ✅ 驗證

更新 Framework 為 `Next.js` 並重新部署後：

1. 訪問：`https://ichen-app-restaurant-ratings.vercel.app/`
2. 應該看到首頁，而不是 404 錯誤
3. 建置日誌應該顯示 Next.js 相關的訊息

---

## 🔗 相關文檔

- [修復 restaurant-ratings 專案](./FIX_RESTAURANT_RATINGS_PROJECT.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)

