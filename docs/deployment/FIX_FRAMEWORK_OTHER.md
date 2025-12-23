# 🔧 修復 Framework 一直顯示 "Other" 的問題

## 🎯 問題

在 Vercel Dashboard → Framework Settings 中，**Framework** 一直顯示 **"Other"**，無法更改為 "Next.js"。

## ✅ 解決步驟

### 方法 1: 先設定 Root Directory（推薦）

Vercel 需要先知道專案結構才能正確偵測 Framework。

#### 步驟 1: 設定 Root Directory

1. 前往 **Settings** → **General**
2. 找到 **Root Directory** 設定
3. 點擊 **Edit**
4. 設定為：`apps/home`
5. 點擊 **Save**

#### 步驟 2: 等待自動偵測

設定 Root Directory 後，Vercel 會自動偵測 Framework：
- 等待幾秒鐘
- 重新整理頁面
- Framework 應該自動變更為 "Next.js"

#### 步驟 3: 如果還是 "Other"

如果設定 Root Directory 後還是顯示 "Other"：

1. 前往 **Framework Settings**
2. 展開 **Project Settings**（不是 Production Overrides）
3. 在 **Project Settings** 中找到 **Framework**
4. 點擊 **Edit**
5. 選擇 **Next.js**
6. 點擊 **Save**

---

### 方法 2: 手動設定 Build Command

有時候設定 Build Command 可以幫助 Vercel 偵測 Framework。

#### 步驟 1: 設定 Build Command

前往 **Settings** → **General**：

1. 找到 **Build Command** 設定
2. 點擊 **Edit**
3. 設定為：`pnpm build`
4. 點擊 **Save**

#### 步驟 2: 設定其他必要設定

同時確認以下設定：

| 設定項目 | 正確值 |
|---------|--------|
| **Root Directory** | `apps/home` |
| **Build Command** | `pnpm build` |
| **Output Directory** | `.next` 或留空 |
| **Install Command** | `cd ../.. && pnpm install` |

#### 步驟 3: 重新整理並檢查

1. 重新整理 Vercel Dashboard 頁面
2. 前往 **Framework Settings**
3. 檢查 Framework 是否已變更為 "Next.js"

---

### 方法 3: 清除 Production Overrides

如果 Production Overrides 中的設定導致問題：

#### 步驟 1: 清除 Production Overrides

1. 前往 **Framework Settings**
2. 找到 **Production Overrides** 區域
3. 點擊每個設定的 **Edit**
4. **清除所有自訂值**（讓它使用 Project Settings）
5. 點擊 **Save**

#### 步驟 2: 在 Project Settings 中設定

1. 展開 **Project Settings** 區域
2. 設定 **Framework** 為 `Next.js`
3. 設定其他必要設定：
   - **Build Command**: `pnpm build`
   - **Install Command**: `cd ../.. && pnpm install`
   - **Output Directory**: `.next` 或留空
4. 點擊 **Save**

---

### 方法 4: 重新連接 GitHub 倉庫

如果以上方法都不行，可能需要重新連接倉庫：

#### 步驟 1: 記下當前設定

記下以下設定（避免遺失）：
- Root Directory
- 環境變數
- 其他自訂設定

#### 步驟 2: 刪除並重新導入專案

1. 前往專案 **Settings** → **General**
2. 滾動到底部
3. 找到 **Delete Project** 或 **Remove Project**
4. 確認刪除（**注意**：這會刪除所有部署歷史）
5. 重新從 GitHub 導入專案
6. 在導入時設定：
   - **Root Directory**: `apps/home`
   - **Framework**: Next.js（應該會自動偵測）

---

## 🎯 推薦的設定順序

按照以下順序設定，可以避免 Framework 顯示 "Other"：

1. **先設定 Root Directory**（最重要）
   - Settings → General → Root Directory → `apps/home`

2. **等待自動偵測**
   - 重新整理頁面
   - Vercel 應該自動偵測為 Next.js

3. **確認 Framework Settings**
   - Framework Settings → Project Settings → Framework → `Next.js`

4. **設定 Build Command**
   - Settings → General → Build Command → `pnpm build`

5. **設定 Install Command**
   - Settings → General → Install Command → `cd ../.. && pnpm install`

---

## 📋 完整設定檢查清單

完成設定後，確認以下項目：

### General Settings
- [ ] **Root Directory**: `apps/home`
- [ ] **Framework Preset**: `Next.js`（自動偵測）
- [ ] **Build Command**: `pnpm build`
- [ ] **Output Directory**: `.next` 或留空
- [ ] **Install Command**: `cd ../.. && pnpm install`

### Framework Settings
- [ ] **Project Settings → Framework**: `Next.js`
- [ ] **Production Overrides → Framework**: `Next.js` 或繼承 Project Settings

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已設定
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定

---

## 🚨 常見問題

### Q: 為什麼 Framework 一直顯示 "Other"？

**A**: 可能原因：
1. Root Directory 未設定或設定錯誤
2. Vercel 無法偵測到 `package.json` 或 `next.config.ts`
3. Production Overrides 覆蓋了 Project Settings

**解決方案**：
- 先設定 Root Directory 為 `apps/home`
- 確認 `apps/home/package.json` 存在
- 清除 Production Overrides，讓它使用 Project Settings

### Q: 設定 Root Directory 後還是 "Other"？

**A**: 檢查：
1. Root Directory 是否正確設定為 `apps/home`
2. `apps/home/package.json` 是否存在且包含 `next` 依賴
3. 重新整理頁面並等待幾秒鐘

### Q: Production Overrides 和 Project Settings 不一致？

**A**: 建議：
- 優先使用 **Project Settings**
- 清除 **Production Overrides** 的自訂值
- 讓 Production Overrides 繼承 Project Settings

---

## ✅ 驗證

設定完成後：

1. **重新部署**
   - Deployments → 最新部署 → ⋯ → Redeploy
   - 取消勾選 "Use existing Build Cache"

2. **檢查建置日誌**
   - 應該看到 Next.js 相關的訊息
   - 不應該看到 "No framework detected" 錯誤

3. **測試訪問**
   - `https://ichen-app-restaurant-ratings.vercel.app/`
   - 應該正常顯示頁面

---

## 🔗 相關文檔

- [修復 Framework 設定](./FIX_FRAMEWORK_SETTING.md)
- [修復 restaurant-ratings 專案](./FIX_RESTAURANT_RATINGS_PROJECT.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)

