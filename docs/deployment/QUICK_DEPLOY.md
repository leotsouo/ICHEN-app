# ⚡ 快速部署參考

## 🚀 5 分鐘快速部署

### 1. 推送到 GitHub

```bash
# 初始化 Git（如果尚未初始化）
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 創建新倉庫，然後執行：
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 部署

1. 前往 [vercel.com](https://vercel.com) → **Add New Project**
2. 選擇你的 GitHub 倉庫
3. **配置設定**：
   - Root Directory: `apps/restaurant-ratings`
   - Install Command: `pnpm install`
   - Build Command: `cd ../.. && pnpm build --filter=restaurant-ratings`
4. **添加環境變數**：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. 點擊 **Deploy**

### 3. 設定 Supabase

1. 前往 Supabase Dashboard → Authentication → URL Configuration
2. 添加 Redirect URL: `https://your-app.vercel.app/auth/callback`

### 4. 完成！

訪問你的 Vercel URL 測試應用。

---

## 📋 環境變數清單

| 變數名稱 | 必要 | 說明 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_HOME_URL` | ❌ | 首頁應用 URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌ | Google Maps API Key |

---

## 🔗 詳細指南

完整部署指南請參考：[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

