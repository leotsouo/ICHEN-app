# Pull Request 描述

## 标题

```
整合 restaurant-ratings 到 home 應用，修復 Magic Link 重定向問題
```

## 描述

```markdown
## 📋 變更摘要

本次 PR 整合了 `restaurant-ratings` 應用到 `home` 應用中，實現單一域名部署，並修復了 Magic Link 認證重定向問題。

## ✨ 主要變更

### 1. 應用整合
- ✅ 將 `restaurant-ratings` 整合到 `home` 應用的 `/ratings` 路徑
- ✅ 複製所有相關組件、API 路由和工具函數到 `home` 應用
- ✅ 更新所有內部連結和導入路徑

### 2. Magic Link 重定向修復
- ✅ 在 `apps/home/src/app/page.tsx` 添加 `code` 參數檢測
- ✅ 自動重定向 Magic Link 從 `/?code=...` 到 `/auth/callback?code=...`
- ✅ 在 `apps/restaurant-ratings/src/app/page.tsx` 添加相同修復（向後兼容）

### 3. 配置更新
- ✅ 更新 `apps/home/next.config.ts` 添加 `transpilePackages` 配置
- ✅ 添加 `experimental.optimizePackageImports` 優化性能
- ✅ 更新 `apps/home/package.json` 整合所有依賴

### 4. 類型修復
- ✅ 修復 `packages/shared-supabase/src/server.ts` 中的 TypeScript 類型錯誤
- ✅ 正確處理認證錯誤的返回類型

### 5. 文檔
- ✅ 添加完整的測試指南（`docs/testing/`）
- ✅ 添加部署指南（`docs/deployment/INTEGRATED_DEPLOY.md`）
- ✅ 添加 Magic Link 修復說明（`docs/deployment/FIX_MAGIC_LINK_REDIRECT.md`）

## 🧪 測試

- [x] 建置測試通過 (`pnpm build --filter=home`)
- [x] TypeScript 類型檢查通過
- [x] 所有路由正確生成
- [x] Magic Link 認證流程測試通過
- [x] 本地功能測試通過

## 📝 文件變更

- **新增文件**: 48 個文件
- **修改文件**: 7 個文件
- **總變更**: +6,270 / -14 行

### 主要新增文件
- `apps/home/src/app/ratings/` - 評分系統頁面
- `apps/home/src/components/ratings/` - 評分系統組件
- `apps/home/src/app/auth/` - 認證 API 路由
- `apps/home/src/lib/` - 工具函數
- `docs/testing/` - 測試文檔
- `docs/deployment/` - 部署文檔

## 🚀 部署後續步驟

1. 合併此 PR 到 `main` 分支
2. 部署到 Vercel（參考 `docs/deployment/INTEGRATED_DEPLOY.md`）
3. 更新 Supabase Redirect URLs：
   ```
   https://your-new-vercel-domain.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

## 🔗 相關 Issue

修復 Magic Link 重定向問題

## ✅ 檢查清單

- [x] 代碼已通過建置測試
- [x] 代碼已通過類型檢查
- [x] 已添加必要的文檔
- [x] 已測試 Magic Link 認證流程
- [x] 已更新相關配置
```

