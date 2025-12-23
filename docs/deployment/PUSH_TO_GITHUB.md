# 📤 推送到 GitHub 快速指南

## 🎯 你的情況

你的 GitHub 倉庫已經存在：`https://github.com/leotsouo/ICHEN-app.git`

本地倉庫已經連接到遠端倉庫，現在需要推送最新的變更。

---

## ⚡ 快速推送步驟

### 1. 檢查當前狀態

```bash
git status
```

你會看到：
- **Modified files**：已修改的檔案
- **Untracked files**：新增的檔案（例如：`docs/`、`packages/` 等）

### 2. 拉取遠端最新變更（避免衝突）

```bash
git pull origin main --rebase
```

> ⚠️ **注意**：如果遠端有新的變更，會自動合併。如果有衝突，需要先解決衝突。

### 3. 添加所有變更

```bash
# 添加所有變更
git add .

# 再次檢查狀態，確認要提交的檔案
git status
```

### 4. 提交變更

```bash
git commit -m "Update: 添加部署文檔、修復回首頁功能和移動端優化"
```

或者使用更詳細的提交訊息：

```bash
git commit -m "Update: 添加 Vercel 完整部署攻略

- 新增 Vercel 完整部署指南 (VERCEL_DEPLOYMENT_GUIDE.md)
- 新增快速部署參考 (QUICK_DEPLOY.md)
- 修復回首頁功能（使用環境變數）
- 添加移動端 viewport 設定
- 更新環境變數文檔"
```

### 5. 推送到 GitHub

```bash
git push origin main
```

### 6. 驗證推送成功

前往 [https://github.com/leotsouo/ICHEN-app](https://github.com/leotsouo/ICHEN-app) 確認所有檔案都已成功推送。

---

## 🔍 如果遇到問題

### 問題 1: 推送被拒絕（Push rejected）

**原因**：遠端有新的變更，本地沒有拉取

**解決方案**：
```bash
# 先拉取遠端變更
git pull origin main --rebase

# 如果有衝突，解決衝突後
git add .
git commit -m "Merge: 解決衝突"

# 再次推送
git push origin main
```

### 問題 2: 認證失敗

**原因**：GitHub 需要使用 Personal Access Token（PAT）

**解決方案**：

1. 前往 [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. 點擊 **Generate new token (classic)**
3. 設定：
   - **Note**: `ICHEN-app deployment`
   - **Expiration**: 選擇期限（或 No expiration）
   - **Scopes**: 勾選 `repo`（完整倉庫權限）
4. 點擊 **Generate token**
5. **複製 token**（只會顯示一次！）
6. 推送時使用 token 作為密碼：
   ```bash
   git push origin main
   # Username: 你的 GitHub 用戶名
   # Password: 貼上剛才複製的 token
   ```

### 問題 3: 檔案太大

**原因**：某些檔案超過 GitHub 的 100MB 限制

**解決方案**：
1. 檢查是否有大檔案：
   ```bash
   git ls-files | xargs ls -la | sort -k5 -rn | head -10
   ```
2. 如果 `node_modules` 或 `.next` 被提交，確認 `.gitignore` 已正確設定
3. 如果確實需要大檔案，考慮使用 [Git LFS](https://git-lfs.github.com/)

---

## 📋 推送前檢查清單

推送前確認：

- [ ] `.env.local` 檔案**不會**被提交（已在 `.gitignore` 中）
- [ ] `node_modules/` **不會**被提交
- [ ] `.next/` **不會**被提交
- [ ] 沒有敏感資訊（API keys、密碼等）在程式碼中
- [ ] 所有變更都已測試過

---

## 🚀 推送後下一步

推送成功後：

1. ✅ 前往 GitHub 確認檔案已更新
2. ✅ 如果 Vercel 已連接，會自動觸發新的部署
3. ✅ 檢查 Vercel Dashboard 確認部署狀態

---

## 📖 相關文檔

- [完整部署攻略](./VERCEL_DEPLOYMENT_GUIDE.md)
- [快速部署參考](./QUICK_DEPLOY.md)
- [部署檢查清單](./DEPLOYMENT.md)

