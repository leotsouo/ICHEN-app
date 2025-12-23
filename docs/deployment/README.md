# 🚀 部署文檔

本目錄包含 ICHEN-app 專案的完整部署指南。

## 📚 文檔索引

### 🎯 開始部署

- **[快速開始](./QUICK_START.md)** - 5 分鐘快速部署指南
- **[完整部署指南](./DEPLOYMENT.md)** - 詳細的部署步驟和說明

### ⚙️ 配置

- **[環境變數配置](./ENVIRONMENT_VARIABLES.md)** - 環境變數詳細說明
- **[部署檢查清單](./CHECKLIST.md)** - 部署前後的檢查項目

### 🔧 問題解決

- **[疑難排解](./TROUBLESHOOTING.md)** - 常見問題和解決方案

## 📋 專案架構

本專案採用 **單一應用部署架構**：

```
apps/home/
├── src/app/
│   ├── page.tsx          # 首頁 (/)
│   ├── ratings/          # 餐廳評分系統 (/ratings)
│   ├── auth/             # 認證路由
│   └── api/              # API 路由
```

**部署方式**：單一 Vercel 項目部署 `apps/home` 應用

**URL 結構**：
- 首頁：`https://your-app.vercel.app/`
- 評分系統：`https://your-app.vercel.app/ratings`
- 認證回調：`https://your-app.vercel.app/auth/callback`

## 🎯 部署流程概覽

1. **準備環境變數** → 獲取 Supabase 憑證
2. **推送到 GitHub** → 確保程式碼已推送到倉庫
3. **在 Vercel 創建項目** → 連接 GitHub 倉庫
4. **配置項目設定** → 設定 Root Directory 和構建命令
5. **設定環境變數** → 在 Vercel Dashboard 中配置
6. **部署** → 等待建置完成
7. **配置 Supabase** → 設定 Redirect URL
8. **驗證部署** → 測試各項功能

## ⚡ 快速連結

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com/)
- [GitHub](https://github.com/)

## 📝 相關文檔

- [專案 README](../../README.md)
- [環境變數設定指南](../guides/ENV_SETUP.md)
- [測試指南](../testing/)

