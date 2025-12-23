# 🔧 修復 Ignored Build Step 設定問題

## 🎯 問題

`vercel.json` 中的 `ignoreCommand` 設定為：
```json
"ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
```

這個命令檢查的是**根目錄** (`./`)，但專案的 Root Directory 設定為 `apps/home`。這可能導致：
- 即使 `apps/home` 有變更，如果根目錄沒有變更，Vercel 會跳過建置
- 修改 Framework 設定後，沒有推送新 commit，Vercel 不會重新建置

## ✅ 解決方案

### 方案 1: 修改 ignoreCommand 檢查正確的目錄（推薦）

更新 `vercel.json`：

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "ignoreCommand": "git diff --quiet HEAD^ HEAD apps/home"
}
```

這樣 Vercel 會檢查 `apps/home` 目錄是否有變更。

### 方案 2: 移除 ignoreCommand（簡單但可能增加建置次數）

如果不需要這個優化，可以直接移除：

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null
}
```

這樣 Vercel 會為每個 commit 都建置（除非 SHA 相同）。

### 方案 3: 檢查多個目錄（如果有多個應用）

如果專案中有多個應用，可以檢查所有相關目錄：

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "ignoreCommand": "git diff --quiet HEAD^ HEAD apps/home packages"
}
```

## 📋 修復步驟

### 步驟 1: 更新 vercel.json

修改 `vercel.json` 文件：

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "ignoreCommand": "git diff --quiet HEAD^ HEAD apps/home"
}
```

### 步驟 2: 提交並推送變更

```bash
git add vercel.json
git commit -m "fix: 更新 ignoreCommand 檢查 apps/home 目錄"
git push origin main
```

### 步驟 3: 手動觸發重新部署

即使修改了設定，當前的部署可能還是使用舊設定。需要手動觸發：

1. 前往 Vercel Dashboard → Deployments
2. 點擊最新部署的 **⋯** → **Redeploy**
3. 取消勾選 "Use existing Build Cache"
4. 點擊 **Redeploy**

## 🚨 重要提示

### 關於 ignoreCommand 的工作原理

`ignoreCommand` 的工作原理：
- **退出碼 0**：跳過建置（沒有變更）
- **退出碼 1**：執行建置（有變更）

`git diff --quiet HEAD^ HEAD ./` 的含義：
- 比較當前 commit (`HEAD`) 和上一個 commit (`HEAD^`)
- 檢查根目錄 (`./`) 是否有變更
- 如果沒有變更，返回 0（跳過建置）
- 如果有變更，返回 1（執行建置）

### 為什麼會導致問題？

當 Root Directory 設定為 `apps/home` 時：
- Vercel 只關心 `apps/home` 目錄的變更
- 但 `ignoreCommand` 檢查的是根目錄
- 如果只修改了 `apps/home` 但根目錄沒有變更，Vercel 會跳過建置
- 這會導致設定變更（如 Framework）不會觸發重新建置

## ✅ 驗證

修復後：

1. **推送變更後應該自動建置**
   - 如果 `apps/home` 有變更，應該觸發建置
   - 如果只有根目錄變更（如 README），可能跳過建置

2. **手動觸發應該總是建置**
   - 即使沒有變更，手動 Redeploy 應該執行建置

3. **Framework 設定變更後應該重新建置**
   - 修改 Framework 設定後，手動 Redeploy 應該執行建置

## 🔗 相關文檔

- [修復 Framework 設定](./FIX_FRAMEWORK_SETTING.md)
- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)

