# 登入系統測試檢查清單

## 🚀 測試前準備

### 1. 確認伺服器已啟動

開發伺服器應該運行在：
- **home 應用**: http://localhost:3000
- **restaurant-ratings 應用**: http://localhost:3001

### 2. 確認環境變數

檢查 `apps/restaurant-ratings/.env.local` 是否包含：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. 確認 Supabase 設定

在 Supabase Dashboard 中確認：
- **Authentication → URL Configuration**
  - Redirect URLs 包含：`http://localhost:3001/auth/callback`

---

## ✅ 測試項目

### 測試 1: 基本頁面載入

**步驟**：
1. 訪問 http://localhost:3001
2. 確認頁面正常載入
3. 確認顯示餐廳清單（如果有資料）

**預期結果**：
- ✅ 頁面正常顯示
- ✅ 未登入時顯示登入表單
- ✅ 顯示 QR Code（如果有的話）

---

### 測試 2: Email 格式驗證

**步驟**：
1. 在登入表單中輸入無效的 Email（例如：`invalid-email`）
2. 點擊「寄送登入連結」

**預期結果**：
- ✅ 顯示錯誤訊息：「Email 格式不正確。」
- ✅ URL 參數包含 `m=bad_email`
- ✅ 終端機顯示日誌：`[AUTH_LOGIN#...] invalid email format`

---

### 測試 3: 發送 Magic Link

**步驟**：
1. 輸入有效的 Email 地址（例如：`test@example.com`）
2. 點擊「寄送登入連結」
3. 檢查終端機日誌

**預期結果**：
- ✅ 顯示成功訊息：「已寄出登入連結，請到信箱點擊 Magic Link。」
- ✅ URL 參數包含 `m=sent`
- ✅ 終端機顯示：
  ```
  [AUTH_LOGIN#...] sending magic link { emailMasked: 'te***@example.com' }
  [AUTH_LOGIN#...] magic link sent; code_verifier cookie SET
  ```
- ✅ 收到 Supabase 發送的 Magic Link Email

---

### 測試 4: Magic Link 登入

**步驟**：
1. 打開收到的 Magic Link Email
2. 點擊連結
3. 觀察瀏覽器行為

**預期結果**：
- ✅ 自動重定向到 `http://localhost:3001/auth/callback?code=...`
- ✅ 然後重定向到首頁並顯示「登入成功！」
- ✅ URL 參數包含 `m=logged_in`
- ✅ 頁面顯示使用者 Email 和「登出」按鈕
- ✅ 終端機顯示：
  ```
  [AUTH_CALLBACK#...] login successful
  ```

---

### 測試 5: 登入狀態檢查

**步驟**：
1. 登入後，重新整理頁面
2. 確認登入狀態保持

**預期結果**：
- ✅ 仍然顯示使用者 Email
- ✅ 仍然顯示「登出」按鈕
- ✅ 可以新增評論（顯示評論表單）

---

### 測試 6: 登出功能

**步驟**：
1. 點擊「登出」按鈕
2. 觀察頁面變化

**預期結果**：
- ✅ 顯示「已登出。」訊息
- ✅ URL 參數包含 `m=logged_out`
- ✅ 登入表單重新顯示
- ✅ 無法新增評論（顯示「登入後可新增評論」）
- ✅ 終端機顯示：
  ```
  [AUTH_LOGOUT#...] logout successful
  ```

---

### 測試 7: 過期或無效的 Magic Link

**步驟**：
1. 使用已過期的 Magic Link（或修改 URL 中的 code 參數）
2. 嘗試訪問回調 URL

**預期結果**：
- ✅ 顯示錯誤訊息：「登入連結無效或已過期，請重新寄送一封新的。」
- ✅ URL 參數包含 `m=access_denied`
- ✅ 終端機顯示錯誤日誌：
  ```
  [AUTH_CALLBACK#...] exchangeCodeForSession error
  ```

---

### 測試 8: Cookie 和 Session 管理

**步驟**：
1. 登入後，打開瀏覽器開發者工具
2. 檢查 Application/Storage → Cookies
3. 確認 Supabase 相關 Cookie 已設定

**預期結果**：
- ✅ 存在 Supabase 相關的 Cookie（例如：`sb-xxx-auth-token`）
- ✅ Cookie 的 `SameSite` 設定為 `Lax`
- ✅ Cookie 的 `Secure` 在本地開發時為 `false`，生產環境為 `true`

---

### 測試 9: 多標籤頁測試

**步驟**：
1. 在一個標籤頁登入
2. 打開新標籤頁訪問相同 URL
3. 確認登入狀態同步

**預期結果**：
- ✅ 新標籤頁也顯示已登入狀態
- ✅ 登出一個標籤頁後，其他標籤頁也會登出（取決於 Cookie 設定）

---

### 測試 10: 錯誤處理和日誌

**檢查項目**：
1. 打開終端機查看日誌輸出
2. 確認所有認證操作都有對應的日誌

**預期結果**：
- ✅ 所有認證操作都有 `[AUTH_*#...]` 格式的日誌
- ✅ 錯誤情況都有 `err` 日誌
- ✅ Email 在日誌中被遮罩（例如：`te***@example.com`）

---

## 🔍 除錯技巧

### 查看終端機日誌

開發模式下，所有認證相關的日誌會輸出到終端機：
- `[AUTH_LOGIN#...]` - 登入請求
- `[AUTH_CALLBACK#...]` - 回調處理
- `[AUTH_LOGOUT#...]` - 登出處理

### 檢查瀏覽器 Console

打開開發者工具（F12）→ Console 標籤，檢查：
- JavaScript 錯誤
- Supabase 相關的警告或錯誤

### 檢查 Network 標籤

在開發者工具 → Network 標籤中：
- 確認 `/auth/login` POST 請求成功（狀態碼 307）
- 確認 `/auth/callback` GET 請求成功（狀態碼 307）
- 確認 Supabase API 請求成功

### 檢查 Supabase Dashboard

在 Supabase Dashboard 中：
- **Authentication → Users**: 確認使用者已建立
- **Logs**: 查看認證相關的日誌
- **Settings → API**: 確認 URL 和 Key 正確

---

## ❌ 常見問題

### 問題 1: Magic Link 未收到

**可能原因**：
- Supabase Email 服務未啟用
- Email 被歸類為垃圾郵件
- Supabase 專案設定問題

**解決方案**：
- 檢查 Supabase Dashboard → Settings → Auth → Email Templates
- 檢查垃圾郵件資料夾
- 確認 Supabase 專案狀態正常

### 問題 2: 登入後立即登出

**可能原因**：
- Cookie 設定問題
- Supabase Redirect URL 設定錯誤
- 環境變數錯誤

**解決方案**：
- 檢查 Cookie 是否正確設定
- 確認 Supabase Redirect URL 包含 `http://localhost:3001/auth/callback`
- 確認環境變數正確

### 問題 3: 終端機沒有日誌輸出

**可能原因**：
- 開發模式未正確啟動
- 日誌被過濾

**解決方案**：
- 確認使用 `pnpm dev` 啟動
- 檢查終端機輸出設定

---

## 📝 測試記錄表

| 測試項目 | 狀態 | 備註 |
|---------|------|------|
| 基本頁面載入 | ⬜ | |
| Email 格式驗證 | ⬜ | |
| 發送 Magic Link | ⬜ | |
| Magic Link 登入 | ⬜ | |
| 登入狀態檢查 | ⬜ | |
| 登出功能 | ⬜ | |
| 過期連結處理 | ⬜ | |
| Cookie 管理 | ⬜ | |
| 多標籤頁測試 | ⬜ | |
| 錯誤處理 | ⬜ | |

---

## 🎯 測試完成標準

所有測試項目都應該：
- ✅ 功能正常運作
- ✅ 錯誤訊息正確顯示
- ✅ 日誌正確輸出
- ✅ 使用者體驗流暢

如果所有測試通過，登入系統可以視為正常運作！

