# 🔧 修復 Vercel 部署錯誤

## 🎯 常見部署錯誤和解決方案

### 錯誤 1: Build Command 失敗

**症狀**：建置時出現錯誤，無法完成部署

**可能原因**：
- Root Directory 設定錯誤
- Build Command 不正確
- 缺少依賴或環境變數

**解決方案**：

#### 檢查 Vercel 專案設定

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案 `ichen-app-restaurant-ratings`
3. 點擊 **Settings** → **General**
4. 檢查以下設定：

**正確設定（Monorepo 單一應用部署）**：

- **Root Directory**: `apps/restaurant-ratings`
- **Framework Preset**: `Next.js`
- **Build Command**: `cd ../.. && pnpm build --filter=restaurant-ratings`
- **Output Directory**: `.next`（留空也可以，Next.js 會自動處理）
- **Install Command**: `pnpm install`（從根目錄執行）
- **Development Command**: `cd ../.. && pnpm dev --filter=restaurant-ratings`

**或者使用簡化版本**：

如果 Root Directory 是 `apps/restaurant-ratings`，可以簡化 Build Command：

- **Build Command**: `pnpm build`（從 `apps/restaurant-ratings` 目錄執行）
- **Install Command**: `cd ../.. && pnpm install`（從根目錄安裝所有依賴）

---

### 錯誤 2: 環境變數未設定

**症狀**：建置成功但運行時出現 Supabase 連線錯誤

**解決方案**：

1. 前往 Vercel Dashboard → Settings → Environment Variables
2. 確認以下環境變數已設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_HOME_URL`（可選）

3. 確認環境變數已套用到所有環境：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. 修改環境變數後，需要重新部署：
   - 前往 Deployments
   - 點擊最新部署的 **⋯** → **Redeploy**

---

### 錯誤 3: Monorepo 依賴問題

**症狀**：建置時找不到 `@ichen-app/shared-ratings` 或 `@ichen-app/shared-supabase`

**解決方案**：

#### 方法 1: 確認 Install Command 從根目錄執行

在 Vercel 設定中：
- **Root Directory**: `apps/restaurant-ratings`
- **Install Command**: `cd ../.. && pnpm install`

這會確保從 monorepo 根目錄安裝所有依賴。

#### 方法 2: 檢查 package.json

確認 `apps/restaurant-ratings/package.json` 中有正確的 workspace 依賴：

```json
{
  "dependencies": {
    "@ichen-app/shared-ratings": "workspace:*",
    "@ichen-app/shared-supabase": "workspace:*"
  }
}
```

#### 方法 3: 檢查 pnpm-workspace.yaml

確認根目錄的 `pnpm-workspace.yaml` 包含：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

### 錯誤 4: Turbo 建置問題

**症狀**：`turbo run build` 失敗

**解決方案**：

1. **確認 turbo.json 配置正確**

   檢查 `turbo.json` 是否有正確的 build 設定。

2. **使用直接建置命令**

   如果 Turbo 有問題，可以繞過 Turbo 直接建置：

   - **Build Command**: `cd apps/restaurant-ratings && pnpm build`

3. **檢查本地建置**

   先在本地測試建置：
   ```bash
   cd apps/restaurant-ratings
   pnpm build
   ```

   如果本地建置失敗，先修復本地問題。

---

### 錯誤 5: Node.js 版本問題

**症狀**：建置時出現 Node.js 版本不相容錯誤

**解決方案**：

1. 在專案根目錄創建 `.nvmrc` 或 `.node-version` 檔案：
   ```
   18
   ```
   或
   ```
   20
   ```

2. 在 Vercel Dashboard → Settings → General → Node.js Version
   選擇對應的版本（例如：18.x 或 20.x）

---

## 🔍 診斷步驟

### 步驟 1: 查看建置日誌

1. 前往 Vercel Dashboard → Deployments
2. 點擊失敗的部署
3. 查看 **Build Logs** 和 **Function Logs**
4. 找到錯誤訊息

### 步驟 2: 本地測試建置

```bash
# 1. 確保在專案根目錄
cd /path/to/ICHEN-app

# 2. 安裝依賴
pnpm install

# 3. 測試建置
cd apps/restaurant-ratings
pnpm build
```

如果本地建置失敗，先修復本地問題。

### 步驟 3: 檢查 Vercel 設定

對照以下檢查清單：

- [ ] Root Directory 設定為 `apps/restaurant-ratings`
- [ ] Build Command 正確
- [ ] Install Command 從根目錄執行
- [ ] 環境變數已設定
- [ ] Node.js 版本正確

---

## 🛠️ 快速修復指南

### 如果建置完全失敗

1. **重置 Vercel 設定**：
   - 前往 Settings → General
   - 使用以下設定：
     - Root Directory: `apps/restaurant-ratings`
     - Build Command: `cd ../.. && pnpm install && pnpm build --filter=restaurant-ratings`
     - Install Command: `pnpm install`

2. **檢查環境變數**：
   - 確認所有必要的環境變數都已設定
   - 確認變數值正確（沒有多餘空格）

3. **重新部署**：
   - 前往 Deployments
   - 點擊 **Redeploy**

### 如果建置成功但運行時錯誤

1. **檢查環境變數**：
   - 確認 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已設定

2. **檢查 Supabase 設定**：
   - 確認 Supabase Redirect URL 已設定為 Vercel URL

3. **查看運行時日誌**：
   - 前往 Vercel Dashboard → Deployments → 選擇部署 → Functions
   - 查看運行時錯誤

---

## 📋 推薦的 Vercel 設定

### 設定 1: 使用 Root Directory（推薦）

```
Root Directory: apps/restaurant-ratings
Framework Preset: Next.js
Build Command: cd ../.. && pnpm build --filter=restaurant-ratings
Output Directory: .next
Install Command: cd ../.. && pnpm install
Development Command: cd ../.. && pnpm dev --filter=restaurant-ratings
```

### 設定 2: 簡化版本

```
Root Directory: apps/restaurant-ratings
Framework Preset: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: cd ../.. && pnpm install
```

---

## 🔗 相關資源

- [Vercel Monorepo 文檔](https://vercel.com/docs/monorepos)
- [Next.js 部署文檔](https://nextjs.org/docs/deployment)
- [完整部署攻略](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 💡 需要幫助？

如果以上方法都無法解決問題：

1. 複製完整的錯誤日誌
2. 檢查本地建置是否成功
3. 對照檢查清單確認所有設定正確
4. 查看 Vercel 官方文檔或聯繫 Vercel 支援

