# ⚡ 快速開始指南

5 分鐘快速部署指南 - 適合已經熟悉流程的開發者。

## 🎯 前提條件

- ✅ GitHub 倉庫已準備好
- ✅ Supabase 專案已建立
- ✅ 本地專案可以正常運行

## 📋 快速步驟

### 1. 在 Vercel 創建項目

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **Add New Project**
3. 選擇你的 GitHub 倉庫
4. 點擊 **Import**

### 2. 配置項目設定

在 **Configure Project** 頁面：

- **Root Directory**: `apps/home`
- **Build Command**: `cd ../.. && pnpm build --filter=home`（或使用 `vercel.json` 配置）
- **Install Command**: `cd ../.. && pnpm install`
- **Output Directory**: `.next`

### 3. 設定環境變數

添加以下環境變數（套用到 Production, Preview, Development）：

```
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_Anon_Key
```

### 4. 部署

1. 點擊 **Deploy**
2. 等待建置完成（約 2-3 分鐘）
3. 記下部署 URL

### 5. 配置 Supabase

在 Supabase Dashboard → Authentication → URL Configuration：

添加 Redirect URL：
```
https://你的-vercel-URL.vercel.app/auth/callback
```

### 6. 驗證部署

- [ ] 訪問首頁 `/` 正常顯示
- [ ] 點擊進入 `/ratings` 頁面
- [ ] 測試登入功能（Magic Link）
- [ ] 測試基本功能（新增餐廳、評論等）

## ✅ 完成！

部署完成後，你的應用將在以下 URL 可用：

- **首頁**: `https://your-app.vercel.app/`
- **評分系統**: `https://your-app.vercel.app/ratings`

## 📚 需要更多資訊？

- [完整部署指南](./DEPLOYMENT.md) - 詳細步驟和說明
- [環境變數配置](./ENVIRONMENT_VARIABLES.md) - 環境變數詳細說明
- [疑難排解](./TROUBLESHOOTING.md) - 遇到問題時查看

