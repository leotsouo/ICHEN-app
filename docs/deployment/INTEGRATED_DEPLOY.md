# 🎯 整合部署指南（單一 Vercel 項目）

## ✅ 已完成整合

`restaurant-ratings` 應用已經整合到 `home` 應用中，現在可以通過單一 Vercel 項目部署。

## 📋 項目結構

```
apps/home/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首頁 (/)
│   │   ├── ratings/
│   │   │   └── page.tsx          # 評分系統 (/ratings)
│   │   ├── auth/                 # 認證路由
│   │   │   ├── callback/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── register/
│   │   └── api/                  # API 路由
│   │       ├── profile/
│   │       └── reviews/
│   ├── components/
│   │   └── ratings/              # 評分系統組件
│   └── lib/
│       ├── auth/                 # 認證工具
│       └── supabase/             # Supabase 工具
```

## 🚀 Vercel 部署設定

### 基本設定

在 Vercel Dashboard → Settings → General：

- **Root Directory**: `apps/home`
- **Framework Preset**: `Next.js`
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && pnpm install`
- **Development Command**: `cd ../.. && pnpm dev --filter=home`

### 環境變數

在 Vercel Dashboard → Settings → Environment Variables：

| 變數名稱 | 必要 | 說明 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌ | Google Maps API Key（可選） |

## 🌐 URL 結構

部署後，URL 結構如下：

- **首頁**: `https://your-app.vercel.app/`
- **評分系統**: `https://your-app.vercel.app/ratings`
- **認證回調**: `https://your-app.vercel.app/auth/callback`
- **登入**: `https://your-app.vercel.app/auth/login`
- **登出**: `https://your-app.vercel.app/auth/logout`

## ✅ 部署檢查清單

### 部署前

- [ ] 本地測試通過：`cd apps/home && pnpm build`
- [ ] 環境變數已準備好
- [ ] Supabase 專案已設定

### 部署時

- [ ] Root Directory 設定為 `apps/home`
- [ ] Install Command 從根目錄執行
- [ ] 環境變數已正確設定

### 部署後

- [ ] 訪問首頁 `/` 正常顯示
- [ ] 點擊「餐廳評分系統」可以進入 `/ratings`
- [ ] 從 `/ratings` 可以返回首頁
- [ ] 登入功能正常
- [ ] Supabase Redirect URL 已設定為 `/auth/callback`

## 🔧 Supabase 設定

### Redirect URL

在 Supabase Dashboard → Authentication → URL Configuration：

添加以下 Redirect URL：
```
https://your-app.vercel.app/auth/callback
```

### Site URL

設定 Site URL 為：
```
https://your-app.vercel.app
```

## 📝 未來添加新系統

當你需要添加新系統時：

1. **創建新的路由**：
   ```
   apps/home/src/app/new-system/page.tsx
   ```

2. **在首頁添加連結**：
   ```tsx
   // apps/home/src/app/page.tsx
   const apps = [
     { name: "餐廳評分系統", desc: "撰寫／瀏覽評論", url: "/ratings" },
     { name: "新系統", desc: "新系統描述", url: "/new-system" },
   ];
   ```

3. **部署**：
   - 推送到 GitHub
   - Vercel 會自動部署

## 🔗 相關文檔

- [Vercel 設定檢查清單](./VERCEL_SETTINGS_CHECKLIST.md)
- [完整部署攻略](./VERCEL_DEPLOYMENT_GUIDE.md)

