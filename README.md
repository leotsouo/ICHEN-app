# ICHEN-app 使用說明

這是一個使用 Turborepo 管理的 monorepo 專案，包含多個 Next.js 應用程式。

> 🚀 **快速啟動？** 查看 [快速啟動指南](START.md) 或執行啟動腳本：
> - Windows: `.\scripts\start.ps1`
> - Mac/Linux: `./scripts/start.sh`

## 📋 專案結構

```
ICHEN-app/
├── apps/
│   ├── home/              # 入口首頁應用（端口 3000）
│   └── restaurant-ratings/ # 餐廳評分系統（端口 3001）
├── packages/
│   ├── shared-supabase/   # Supabase 客戶端共享包
│   └── shared-ratings/   # 餐廳評分系統共享包
├── docs/                  # 專案文檔目錄
│   ├── guides/           # 指南文檔
│   ├── deployment/       # 部署文檔
│   ├── database/         # 資料庫文檔
│   └── testing/          # 測試文檔
├── package.json           # 根目錄配置
├── pnpm-workspace.yaml    # pnpm workspace 配置
└── turbo.json            # Turborepo 配置
```

## 🚀 快速開始

### 環境需求

- **Node.js**: 18.x 或更高版本
- **pnpm**: 9.15.9 或更高版本（專案使用指定的 pnpm 版本）

### 安裝步驟

1. **安裝 pnpm**（如果尚未安裝）：
   ```bash
   npm install -g pnpm@9.15.9
   ```

2. **克隆專案並安裝依賴**：
   ```bash
   git clone <your-repo-url>
   cd ICHEN-app
   pnpm install
   ```

### 環境變數設定

在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**如何取得 Supabase 環境變數：**
1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 進入 Settings → API
4. 複製以下資訊：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> 📖 **詳細環境變數設定請參考 [環境變數設定指南](docs/guides/ENV_SETUP.md)**

## 💻 本地開發

### 啟動所有應用（推薦）

在專案根目錄執行：

```bash
pnpm dev
```

這會同時啟動：
- `home` 應用：http://localhost:3000
- `restaurant-ratings` 應用：http://localhost:3001

### 單獨啟動應用

#### 啟動 home 應用
```bash
cd apps/home
pnpm dev
# 訪問 http://localhost:3000
```

#### 啟動 restaurant-ratings 應用
```bash
cd apps/restaurant-ratings
pnpm dev
# 訪問 http://localhost:3001
```

### 其他開發指令

```bash
# 建置所有應用
pnpm build

# 執行 lint 檢查
pnpm lint

# 執行類型檢查
pnpm typecheck

# 執行測試
pnpm test
```

## 🧪 開發者測試指南

> 📖 **詳細測試指南請參考 [測試文檔](docs/testing/)**

### 1. 功能測試

#### 測試餐廳評分系統

1. **訪問應用**：
   - 本地開發：http://localhost:3001
   - 生產環境：https://ichen-app-restaurant-ratings.vercel.app

2. **測試登入流程**：
   - 輸入有效的 Email 地址
   - 點擊「寄送登入連結」
   - 檢查信箱是否收到 Magic Link
   - 點擊連結完成登入
   - 確認頁面顯示「登入成功！」

3. **測試餐廳評分功能**：
   - 登入後，查看餐廳清單
   - 為餐廳新增評論：
     - 選擇整體評分（0.5-5.0 星）
     - （可選）填寫分項評分（服務、氣氛、價格CP值、口味、衛生）
     - （可選）填寫文字評論（最多 500 字）
   - 確認評論成功顯示
   - 測試刪除自己的評論

4. **測試登出功能**：
   - 點擊「登出」按鈕
   - 確認已登出並無法新增評論

### 2. 錯誤處理測試

- **無效 Email**：輸入格式錯誤的 Email，應顯示錯誤訊息
- **過期連結**：使用過期的 Magic Link，應顯示適當錯誤訊息
- **未登入操作**：未登入時嘗試新增評論，應提示需要登入

### 3. 瀏覽器測試

建議在以下瀏覽器測試：
- Chrome/Edge（最新版）
- Firefox（最新版）
- Safari（最新版）
- 行動裝置瀏覽器（使用 QR Code 掃描功能）

### 4. 開發工具

#### 查看日誌

開發模式下，認證相關的日誌會輸出到終端機：
- `[AUTH_LOGIN#...]` - 登入請求
- `[AUTH_CALLBACK#...]` - 回調處理
- `[AUTH_LOGOUT#...]` - 登出處理

#### 檢查 Supabase 連線

確認環境變數正確設定後，檢查：
1. 瀏覽器開發者工具的 Network 標籤
2. 確認 Supabase API 請求成功
3. 檢查 Cookie 是否正確設定

## 🌐 Vercel 部署指南

> 📖 **完整部署攻略請參考 [Vercel 完整部署攻略](docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md)**  
> ⚡ **快速部署參考請參考 [快速部署指南](docs/deployment/QUICK_DEPLOY.md)**  
> 📋 **部署檢查清單請參考 [部署檢查清單](docs/deployment/DEPLOYMENT.md)**

### 前置準備

1. **GitHub 帳號**：確保專案已推送到 GitHub
2. **Vercel 帳號**：前往 [vercel.com](https://vercel.com) 註冊
3. **Supabase 專案**：確保 Supabase 專案已建立並配置完成

### 部署步驟

#### 方法一：透過 Vercel Dashboard（推薦）

1. **連接 GitHub 專案**：
   - 登入 Vercel Dashboard
   - 點擊「Add New Project」
   - 選擇你的 GitHub 專案

2. **配置專案設定**：
   - **Framework Preset**: Next.js
   - **Root Directory**: 保持為 `./`（根目錄）
   - **Build Command**: `pnpm build`
   - **Output Directory**: 不需要設定（Next.js 自動處理）
   - **Install Command**: `pnpm install`

3. **設定環境變數**：
   在「Environment Variables」區塊新增：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   > ⚠️ 注意：這些環境變數會套用到所有應用，但只有 `restaurant-ratings` 會使用

4. **部署**：
   - 點擊「Deploy」
   - 等待建置完成

5. **配置多應用部署**（如果需要分別部署）：
   - 在 Vercel 中，你需要為每個應用創建獨立的專案
   - 或者使用 Vercel 的 Monorepo 支援

#### 方法二：使用 Vercel CLI

1. **安裝 Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**：
   ```bash
   vercel login
   ```

3. **部署**：
   ```bash
   vercel
   ```

4. **設定環境變數**：
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **生產環境部署**：
   ```bash
   vercel --prod
   ```

### 配置 Monorepo 部署

由於這是 monorepo 專案，Vercel 需要知道要部署哪個應用：

#### 選項 1：部署單一應用（restaurant-ratings）

在 Vercel 專案設定中：
- **Root Directory**: `apps/restaurant-ratings`
- **Build Command**: `cd ../.. && pnpm build --filter=restaurant-ratings`
- **Output Directory**: `.next`

#### 選項 2：使用 Vercel 的 Monorepo 支援

1. 在專案根目錄創建 `vercel.json`：
   ```json
   {
     "buildCommand": "pnpm build",
     "devCommand": "pnpm dev",
     "installCommand": "pnpm install"
   }
   ```

2. 在 Vercel Dashboard 中啟用 Monorepo 支援

### 部署後檢查清單

- [ ] 確認環境變數已正確設定
- [ ] 測試登入功能是否正常
- [ ] 測試 Magic Link 是否正確發送
- [ ] 確認 Supabase 連線正常
- [ ] 檢查生產環境的日誌
- [ ] 測試 QR Code 掃描功能（如果使用）

### 更新 Supabase 重定向 URL

部署到 Vercel 後，需要在 Supabase 設定中新增重定向 URL：

1. 前往 Supabase Dashboard → Authentication → URL Configuration
2. 在「Redirect URLs」中新增：
   ```
   https://your-vercel-app.vercel.app/auth/callback
   ```
3. 如果使用自訂網域，也要新增：
   ```
   https://your-custom-domain.com/auth/callback
   ```

## 🔧 疑難排解

### 常見問題

#### 1. pnpm 版本不符
```bash
# 使用專案指定的 pnpm 版本
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

#### 2. 環境變數未生效
- 確認 `.env.local` 檔案在正確的目錄
- 重新啟動開發伺服器
- 檢查變數名稱是否正確（大小寫敏感）

#### 3. Supabase 連線失敗
- 確認 Supabase 專案 URL 和 Key 正確
- 檢查 Supabase 專案是否啟用
- 確認網路連線正常

#### 4. Magic Link 無法登入
- 檢查 Supabase 的 Redirect URL 設定
- 確認 Email 服務是否正常運作
- 查看 Vercel 日誌中的錯誤訊息

#### 5. 建置失敗
- 確認所有依賴已正確安裝
- 檢查 TypeScript 類型錯誤：`pnpm typecheck`
- 查看建置日誌中的詳細錯誤

## 📚 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **套件管理**: pnpm
- **Monorepo**: Turborepo
- **認證**: Supabase Auth (Magic Link)
- **資料庫**: Supabase
- **部署**: Vercel

## 📖 文檔目錄

專案文檔已整理到 `docs/` 目錄下，按類別分類：

### 📘 指南文檔 (`docs/guides/`)
- [快速啟動指南](docs/guides/QUICK_START.md) - 快速開始使用專案
- [環境變數設定](docs/guides/ENV_SETUP.md) - 環境變數配置說明
- [刪除用戶指南](docs/guides/DELETE_USER_GUIDE.md) - 如何刪除用戶的詳細說明

### 🚀 部署文檔 (`docs/deployment/`)
- [部署檢查清單](docs/deployment/DEPLOYMENT.md) - 部署前的完整檢查清單

### 🗄️ 資料庫文檔 (`docs/database/`)
- [資料庫遷移說明](docs/database/DATABASE_MIGRATION.md) - 資料庫結構變更指南

### 🧪 測試文檔 (`docs/testing/`)
- [測試檢查清單](docs/testing/TEST_CHECKLIST.md) - 功能測試檢查清單
- [登入系統測試](docs/testing/TEST_LOGIN.md) - 登入功能測試指南

## 📝 專案說明

### home 應用
- 作為專案的入口首頁
- 提供子系統的導航連結
- 運行於端口 3000
- 簡化版本，不包含業務邏輯

### restaurant-ratings 應用
- 餐廳評分與評論系統
- 支援 Magic Link 無密碼登入
- 提供整體評分、分項評分、文字評論功能
- 運行於端口 3001
- 使用共享包 `@ichen-app/shared-ratings` 和 `@ichen-app/shared-supabase`

### 共享包 (packages/)
- **shared-supabase**: Supabase 客戶端配置（server/client）
- **shared-ratings**: 餐廳評分系統的核心邏輯（types, data, actions, utils）

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

本專案為私有專案。
