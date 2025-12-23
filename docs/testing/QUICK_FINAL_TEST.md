# ⚡ 快速最終測試

## ✅ 建置測試（已完成）

- [x] 建置成功
- [x] TypeScript 檢查通過
- [x] 所有路由正確生成

---

## 🧪 請手動測試以下功能

### 1. 啟動應用

```bash
pnpm dev:home
```

訪問：**http://localhost:3000**

### 2. 快速功能測試（5分鐘）

#### ✅ 測試 1: 首頁和導航
- [ ] 訪問 `http://localhost:3000` → 看到首頁
- [ ] 點擊 "餐廳評分系統" → 進入 `/ratings`
- [ ] 點擊 "← 回首頁" → 返回首頁

#### ✅ 測試 2: Magic Link 認證（最重要！）

1. 在 `/ratings` 頁面輸入 Email
2. 點擊 "寄送登入連結"
3. 收到 Magic Link Email
4. **點擊 Magic Link**
5. **檢查**：
   - ✅ URL 應該變成：`http://localhost:3000/auth/callback?code=...`
   - ✅ 然後自動跳轉到：`http://localhost:3000/ratings?m=logged_in&t=...`
   - ✅ 頁面顯示 "登入成功！"
   - ✅ 顯示用戶 Email 和登出按鈕

#### ✅ 測試 3: 登入後功能
- [ ] 可以新增餐廳
- [ ] 可以新增評論
- [ ] 可以登出

---

## ✅ 如果所有測試通過

所有測試通過後，執行：

```bash
git add .
git commit -m "整合 restaurant-ratings 到 home 應用，修復 Magic Link 重定向問題"
git push origin update/deployment-docs
```

然後創建 Pull Request 並合併到 `main`。

