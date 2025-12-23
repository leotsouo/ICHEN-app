# 🚀 ICHEN-app 快速啟動指南

歡迎使用 ICHEN-app！這是一個使用 Turborepo 管理的 monorepo 專案，包含多個 Next.js 應用程式。

## ⚡ 快速啟動（推薦）

### Windows 用戶

```powershell
# 在專案根目錄執行
.\scripts\start.ps1
```

### Mac/Linux 用戶

```bash
# 在專案根目錄執行
chmod +x scripts/start.sh
./scripts/start.sh
```

啟動腳本會自動：
- ✅ 檢查 Node.js 和 pnpm 是否已安裝
- ✅ 檢查並安裝依賴
- ✅ 檢查環境變數配置
- ✅ 檢查端口是否可用
- ✅ 啟動開發伺服器

## 📋 手動啟動步驟

如果您想手動啟動，請按照以下步驟：

### 1. 環境需求

- **Node.js**: 18.x 或更高版本
- **pnpm**: 9.15.9（專案會自動使用正確版本）

### 2. 安裝依賴

```bash
pnpm install
```

### 3. 設定環境變數

在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**如何取得 Supabase 環境變數：**
1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 進入 Settings → API
4. 複製 Project URL 和 anon/public key

> 📖 詳細說明請參考 [環境變數設定指南](docs/guides/ENV_SETUP.md)

### 4. 啟動開發伺服器

```bash
# 啟動所有應用（推薦）
pnpm dev

# 或只啟動首頁應用
pnpm dev:home
```

### 5. 訪問應用

啟動成功後，訪問：
- **首頁**: http://localhost:3000
- **餐廳評分系統**: http://localhost:3001

## 🛠️ 常用指令

```bash
# 開發
pnpm dev              # 啟動所有應用
pnpm dev:home         # 只啟動首頁應用

# 建置
pnpm build            # 建置所有應用

# 檢查
pnpm lint             # 執行 ESLint 檢查
pnpm typecheck        # 執行 TypeScript 類型檢查
pnpm test             # 執行測試
```

## 📁 專案結構

```
ICHEN-app/
├── apps/
│   ├── home/              # 入口首頁應用（端口 3000）
│   └── restaurant-ratings/ # 餐廳評分系統（端口 3001）
├── packages/
│   ├── shared-supabase/   # Supabase 客戶端共享包
│   └── shared-ratings/   # 餐廳評分系統共享包
├── docs/                  # 專案文檔
├── scripts/               # 工具腳本
│   ├── start.ps1         # Windows 啟動腳本
│   └── start.sh          # Unix/Linux/Mac 啟動腳本
└── README.md             # 完整使用說明
```

## ⚠️ 常見問題

### 問題 1: pnpm 版本不符

```bash
# 啟用 corepack（Node.js 內建）
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

### 問題 2: 端口已被占用

如果端口 3000 或 3001 已被占用：
- 停止占用端口的應用
- 或修改應用配置使用其他端口

### 問題 3: 環境變數未生效

- 確認 `.env.local` 檔案在 `apps/restaurant-ratings/` 目錄下
- 重新啟動開發伺服器
- 檢查變數名稱是否正確（大小寫敏感）

### 問題 4: Supabase 連線失敗

- 確認 Supabase 專案 URL 和 Key 正確
- 檢查 Supabase 專案是否啟用
- 確認網路連線正常

## 📚 更多文檔

- 📖 [完整使用說明](README.md) - 詳細的專案說明和部署指南
- 🚀 [快速啟動指南](docs/guides/QUICK_START.md) - 更詳細的啟動步驟
- ⚙️ [環境變數設定](docs/guides/ENV_SETUP.md) - 環境變數配置說明
- 🧪 [測試指南](docs/testing/) - 功能測試說明
- 🚀 [部署指南](docs/deployment/DEPLOYMENT.md) - Vercel 部署說明

## 🎯 下一步

1. ✅ 啟動開發伺服器
2. ✅ 訪問 http://localhost:3001 測試餐廳評分系統
3. ✅ 測試登入功能（使用 Magic Link）
4. ✅ 新增餐廳和評論

## 💡 提示

- 開發模式下，認證相關的日誌會輸出到終端機
- 使用瀏覽器開發者工具查看 Network 請求
- 檢查 Supabase Dashboard 確認資料庫操作

---

**需要幫助？** 查看 [完整使用說明](README.md) 或 [疑難排解指南](README.md#-疑難排解)

