# ✅ 快速測試檢查清單

## 🎯 測試目標

確認整合後的 `home` 應用功能正常，可以安全部署。

---

## ⚡ 快速測試步驟

### 1. 啟動應用

```bash
pnpm dev:home
```

訪問：**http://localhost:3000**

### 2. 測試首頁

- [ ] 訪問 `http://localhost:3000`
- [ ] 看到 "ICHEN-apps！" 首頁
- [ ] 點擊 "餐廳評分系統" 卡片
- [ ] 成功跳轉到 `/ratings`

### 3. 測試評分系統

- [ ] 訪問 `http://localhost:3000/ratings`
- [ ] 看到 "餐廳評分系統" 頁面
- [ ] 看到 "← 回首頁" 連結
- [ ] 點擊可以返回首頁

### 4. 測試 Magic Link 認證（重要！）

#### 步驟 A: 發送 Magic Link

- [ ] 在 `/ratings` 頁面輸入 Email
- [ ] 點擊 "寄送登入連結"
- [ ] 顯示成功訊息
- [ ] 收到 Magic Link Email

#### 步驟 B: 點擊 Magic Link

**這是關鍵測試！**

1. 點擊 Email 中的 Magic Link
2. **檢查 URL 變化**：
   - ✅ 應該先到：`http://localhost:3000/auth/callback?code=...`
   - ✅ 然後自動到：`http://localhost:3000/ratings?m=logged_in&t=...`
   - ❌ **不應該**停留在：`http://localhost:3000/?code=...`

3. **檢查頁面狀態**：
   - ✅ 顯示 "登入成功！" 訊息
   - ✅ 顯示用戶 Email
   - ✅ 顯示 "登出" 按鈕
   - ✅ 不顯示登入表單
   - ✅ 顯示 "新增餐廳" 功能

### 5. 測試登入後功能

- [ ] 可以新增餐廳
- [ ] 可以新增評論
- [ ] 可以查看自己的評論
- [ ] 可以刪除自己的評論

### 6. 測試登出

- [ ] 點擊 "登出" 按鈕
- [ ] 顯示 "已登出" 訊息
- [ ] 登入表單重新顯示

---

## ✅ 建置測試（必須通過！）

在推送到 GitHub 前，**必須**測試建置：

```bash
pnpm build --filter=home
```

**檢查**：
- [ ] 建置成功（沒有錯誤）
- [ ] 看到 "Tasks: 1 successful"
- [ ] 看到所有路由都正確生成

---

## 🚨 如果建置失敗

**不要推送到 GitHub！**

先修復問題：
1. 查看錯誤訊息
2. 修復 TypeScript 類型錯誤
3. 修復模組導入問題
4. 重新測試建置

---

## ✅ 測試通過標準

所有以下項目都通過後，才能推送到 GitHub：

- [ ] ✅ 首頁正常顯示
- [ ] ✅ 評分系統頁面正常顯示
- [ ] ✅ Magic Link 認證流程完整（發送 → 點擊 → 登入成功）
- [ ] ✅ 登入後功能正常
- [ ] ✅ 登出功能正常
- [ ] ✅ **建置測試通過**（最重要！）

---

## 🎉 測試通過後

如果所有測試都通過：

1. **提交變更**：
   ```bash
   git add .
   git commit -m "整合 restaurant-ratings 到 home 應用，修復建置錯誤"
   git push origin update/deployment-docs
   ```

2. **創建 Pull Request** 並合併到 main

3. **部署到 Vercel**（參考 `docs/deployment/INTEGRATED_DEPLOY.md`）

---

## 📝 測試記錄

記錄你的測試結果：

- 測試日期：___________
- 建置測試：✅ / ❌
- Magic Link 測試：✅ / ❌
- 所有功能測試：✅ / ❌
- 準備部署：✅ / ❌

