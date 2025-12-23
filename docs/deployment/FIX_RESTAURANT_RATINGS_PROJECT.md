# 🔧 修復 ichen-app-restaurant-ratings 專案 404 錯誤

## 🎯 問題

訪問 `https://ichen-app-restaurant-ratings.vercel.app/` 時出現：
```
404: NOT_FOUND
Code: NOT_FOUND
No framework detected
```

## 🔍 原因

Vercel 專案 `ichen-app-restaurant-ratings` 的設定不正確，導致無法偵測到 Next.js 框架。

---

## ✅ 解決步驟

### 步驟 1: 訪問 Vercel Dashboard

1. 前往：https://vercel.com/dashboard
2. 找到並選擇專案：**`ichen-app-restaurant-ratings`**

---

### 步驟 2: 更新專案設定

點擊專案 → **Settings** → **General**

#### 2.1 更新 Root Directory（最重要！）

1. 找到 **Root Directory** 設定
2. 點擊 **Edit**
3. **設定為**：`apps/home`
   > ⚠️ **重要**：必須是 `apps/home`，不是 `apps/restaurant-ratings`
4. 點擊 **Save**

#### 2.2 確認 Framework Preset

1. 找到 **Framework Preset** 設定
2. 確認設定為：**`Next.js`**
3. 如果不是，點擊 **Edit** → 選擇 **Next.js** → **Save**

#### 2.3 更新 Build Command

1. 找到 **Build Command** 設定
2. 點擊 **Edit**
3. **設定為**：
   ```
   pnpm build
   ```
   > 因為 Root Directory 已設定為 `apps/home`，所以可以直接使用 `pnpm build`
4. 點擊 **Save**

#### 2.4 確認 Install Command

1. 找到 **Install Command** 設定
2. 確認設定為：
   ```
   cd ../.. && pnpm install
   ```
   > ⚠️ **重要**：必須從根目錄執行，才能安裝 monorepo 的所有依賴
3. 如果不是，點擊 **Edit** → 修改 → **Save**

#### 2.5 確認 Output Directory

1. 找到 **Output Directory** 設定
2. 確認設定為：`.next` 或留空
3. 如果設定錯誤，點擊 **Edit** → 修改為 `.next` → **Save**

---

### 步驟 3: 檢查環境變數

Settings → **Environment Variables**

確認以下環境變數已設定：

| 變數名稱 | 必要 | 環境 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Production, Preview, Development |

> 💡 **提示**：如果環境變數未設定，建置可能會成功，但運行時會出現錯誤。

---

### 步驟 4: 重新部署

#### 方式 1: 手動觸發（推薦）

1. 前往 **Deployments** 標籤
2. 點擊最新部署右側的 **⋯** → **Redeploy**
3. **取消勾選** "Use existing Build Cache"（清除緩存）
4. 點擊 **Redeploy**
5. 等待建置完成（約 2-3 分鐘）

#### 方式 2: 推送代碼觸發

```bash
# 在專案根目錄執行
git commit --allow-empty -m "觸發 Vercel 重新部署"
git push origin main
```

---

### 步驟 5: 驗證部署

等待建置完成後，訪問：
- **首頁**：`https://ichen-app-restaurant-ratings.vercel.app/`
- **評分系統**：`https://ichen-app-restaurant-ratings.vercel.app/ratings`

應該看到：
- ✅ 首頁顯示 "ICHEN-apps！"
- ✅ 可以點擊 "餐廳評分系統" 進入 `/ratings`

---

## 📋 完整設定檢查清單

部署前確認：

- [ ] **Root Directory**: `apps/home`
- [ ] **Framework Preset**: `Next.js`
- [ ] **Build Command**: `pnpm build`
- [ ] **Output Directory**: `.next` 或留空
- [ ] **Install Command**: `cd ../.. && pnpm install`
- [ ] **環境變數**: `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定

---

## 🚨 常見問題

### 問題 1: 還是顯示 "No framework detected"

**解決方案**：
1. 確認 Root Directory 已設定為 `apps/home`
2. 確認 Framework Preset 已設定為 `Next.js`
3. 清除 Build Cache 並重新部署

### 問題 2: 建置失敗

**解決方案**：
1. 確認 Build Command 為 `pnpm build`
2. 確認 Install Command 為 `cd ../.. && pnpm install`
3. 查看建置日誌找出具體錯誤

### 問題 3: 部署成功但訪問時 404

**解決方案**：
1. 確認訪問的是 Production URL，不是 Preview URL
2. 清除瀏覽器緩存
3. 使用無痕模式訪問

---

## 🎉 成功後

部署成功後，URL 結構如下：

- **首頁**：`https://ichen-app-restaurant-ratings.vercel.app/`
- **評分系統**：`https://ichen-app-restaurant-ratings.vercel.app/ratings`
- **認證回調**：`https://ichen-app-restaurant-ratings.vercel.app/auth/callback`

---

## 🔗 相關文檔

- [更新現有 Vercel 部署](./UPDATE_EXISTING_VERCEL.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)
- [修復 404 錯誤](./FIX_404_ERROR.md)

