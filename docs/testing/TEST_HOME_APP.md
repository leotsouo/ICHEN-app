# ✅ Home 應用測試清單

## 🎯 測試目標

確認整合後的 `home` 應用所有功能正常，可以安全部署到 Vercel。

---

## 📋 測試前準備

### 1. 確認環境變數

確認 `apps/home/.env.local` 存在並包含：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 安裝依賴

```bash
pnpm install
```

### 3. 啟動應用

```bash
pnpm dev:home
```

或

```bash
cd apps/home
pnpm dev
```

應用應該在 **http://localhost:3000** 啟動。

---

## ✅ 測試項目

### 1. 首頁測試 (`http://localhost:3000`)

- [ ] 頁面正常載入，沒有錯誤
- [ ] 顯示 "ICHEN-apps！" 標題
- [ ] 顯示 "餐廳評分系統" 卡片
- [ ] 點擊卡片可以跳轉到 `/ratings`
- [ ] URL 正確顯示為 `http://localhost:3000/ratings`

### 2. 評分系統頁面測試 (`http://localhost:3000/ratings`)

- [ ] 頁面正常載入，沒有錯誤
- [ ] 顯示 "餐廳評分系統" 標題
- [ ] 顯示 "← 回首頁" 連結
- [ ] 點擊 "← 回首頁" 可以返回首頁
- [ ] URL 正確顯示為 `http://localhost:3000/ratings`
- [ ] 如果未登入，顯示登入表單
- [ ] 如果已登入，顯示用戶 Email 和登出按鈕

### 3. Magic Link 認證測試

#### 3.1 發送 Magic Link

- [ ] 在 `/ratings` 頁面輸入 Email
- [ ] 點擊 "寄送登入連結"
- [ ] 顯示成功訊息（"已寄送登入連結..."）
- [ ] 收到 Magic Link Email

#### 3.2 點擊 Magic Link（重要！）

**測試步驟**：

1. 點擊 Email 中的 Magic Link
2. **檢查 URL**：
   - ✅ 應該重定向到 `http://localhost:3000/auth/callback?code=...`
   - ✅ 然後自動重定向到 `http://localhost:3000/ratings?m=logged_in&t=...`
   - ❌ **不應該**停留在 `http://localhost:3000/?code=...`

3. **檢查頁面狀態**：
   - ✅ 顯示 "登入成功！" 訊息
   - ✅ 顯示用戶 Email
   - ✅ 顯示 "登出" 按鈕
   - ✅ 不顯示登入表單
   - ✅ 顯示 "新增餐廳" 功能

#### 3.3 如果 Magic Link 重定向到根路徑

如果點擊 Magic Link 後 URL 變成 `http://localhost:3000/?code=...`：

- [ ] 頁面應該自動重定向到 `/auth/callback`
- [ ] 然後重定向到 `/ratings` 並顯示登入成功

### 4. 登入後功能測試

- [ ] 顯示用戶 Email（在 Header 中）
- [ ] 可以點擊 "登出" 按鈕
- [ ] 顯示 "新增餐廳" 功能
- [ ] 可以新增餐廳
- [ ] 可以為餐廳新增評論
- [ ] 可以查看自己的評論
- [ ] 可以刪除自己的評論

### 5. 登出功能測試

- [ ] 點擊 "登出" 按鈕
- [ ] 顯示 "已登出" 訊息
- [ ] 登入表單重新顯示
- [ ] 無法新增評論（顯示 "登入後可新增評論"）

### 6. 導航測試

- [ ] 從首頁 (`/`) → 點擊 "餐廳評分系統" → 進入 `/ratings`
- [ ] 從評分系統 (`/ratings`) → 點擊 "← 回首頁" → 返回 `/`
- [ ] 瀏覽器返回/前進按鈕正常工作
- [ ] URL 正確顯示路徑

### 7. API 路由測試

- [ ] `/api/reviews` 正常運作（查看餐廳評論）
- [ ] `/api/profile` 正常運作（查看用戶資料）
- [ ] `/auth/callback` 正常處理認證
- [ ] `/auth/login` 正常發送 Magic Link
- [ ] `/auth/logout` 正常登出

### 8. 建置測試（重要！）

在推送到 GitHub 前，**必須**測試建置：

```bash
cd apps/home
pnpm build
```

**檢查項目**：

- [ ] 建置成功，沒有錯誤
- [ ] 沒有 TypeScript 類型錯誤
- [ ] 沒有模組找不到的錯誤
- [ ] 建置時間合理（通常 1-3 分鐘）

如果建置失敗，**不要**推送到 GitHub，先修復問題。

---

## 🔍 常見問題檢查

### 問題 1: 模組找不到

**症狀**：`Module not found: Can't resolve '@ichen-app/shared-ratings'`

**解決方案**：
1. 確認 `apps/home/next.config.ts` 有 `transpilePackages` 配置
2. 執行 `pnpm install`
3. 重啟開發伺服器

### 問題 2: Magic Link 重定向錯誤

**症狀**：點擊 Magic Link 後停留在根路徑

**檢查**：
1. 確認 `apps/home/src/app/page.tsx` 有處理 `code` 參數的邏輯
2. 確認 Supabase Redirect URL 設定正確
3. 檢查瀏覽器 Console 是否有錯誤

### 問題 3: 樣式錯誤

**症狀**：頁面樣式缺失或錯誤

**解決方案**：
1. 確認 `apps/home/src/app/ratings/page.module.css` 存在
2. 確認所有組件的樣式導入路徑正確
3. 清除 `.next` 快取並重啟

### 問題 4: 環境變數未生效

**症狀**：Supabase 連線失敗

**解決方案**：
1. 確認 `apps/home/.env.local` 存在
2. 確認環境變數名稱正確
3. 重啟開發伺服器

---

## 📝 測試記錄表

記錄測試結果：

| 測試項目 | 狀態 | 備註 |
|---------|------|------|
| 首頁載入 | ⬜ | |
| 評分系統頁面 | ⬜ | |
| Magic Link 發送 | ⬜ | |
| Magic Link 點擊 | ⬜ | |
| 登入後功能 | ⬜ | |
| 登出功能 | ⬜ | |
| 導航 | ⬜ | |
| API 路由 | ⬜ | |
| 建置測試 | ⬜ | |

---

## ✅ 測試通過標準

所有以下項目都通過後，才能推送到 GitHub：

- [ ] ✅ 首頁正常顯示
- [ ] ✅ 評分系統頁面正常顯示
- [ ] ✅ Magic Link 認證流程完整（發送 → 點擊 → 登入成功）
- [ ] ✅ 登入後功能正常（新增餐廳、評論等）
- [ ] ✅ 登出功能正常
- [ ] ✅ 導航正常
- [ ] ✅ **建置測試通過**（最重要！）

---

## 🚀 測試通過後

如果所有測試都通過：

1. **提交變更**：
   ```bash
   git add .
   git commit -m "整合 restaurant-ratings 到 home 應用"
   git push origin update/deployment-docs
   ```

2. **創建 Pull Request** 並合併到 main

3. **部署到 Vercel**：
   - Root Directory: `apps/home`
   - Install Command: `cd ../.. && pnpm install`
   - Build Command: `pnpm build`

4. **更新 Supabase Redirect URL**：
   - 添加新的 Vercel URL: `https://your-app.vercel.app/auth/callback`

---

## 🔗 相關文檔

- [快速測試指南](./QUICK_TEST.md)
- [整合部署指南](../deployment/INTEGRATED_DEPLOY.md)
- [環境變數設定](../guides/ENV_SETUP.md)

