# 🔒 PR 描述：更新 Next.js 安全漏洞

## 标题

```
更新 Next.js 到 16.1.1 修復安全漏洞 CVE-2025-66478
```

## 描述

```markdown
## 🔒 安全更新

修復 Next.js 安全漏洞 CVE-2025-66478

### 變更
- 更新 Next.js 從 16.0.1 到 16.1.1
- 更新所有相關包的 Next.js 版本：
  - `apps/home/package.json`
  - `apps/restaurant-ratings/package.json`
  - `packages/shared-supabase/package.json`
  - `packages/shared-ratings/package.json`
- 更新 `eslint-config-next` 到匹配版本
- 更新 `pnpm-lock.yaml` 以匹配新的依賴版本

### 測試
- ✅ 建置測試通過 (`pnpm turbo run build --filter=home`)
- ✅ 無安全警告
- ✅ 所有路由正確生成
- ✅ TypeScript 類型檢查通過

### 相關文件
- `apps/home/package.json`
- `apps/restaurant-ratings/package.json`
- `packages/shared-supabase/package.json`
- `packages/shared-ratings/package.json`
- `pnpm-lock.yaml`

### 部署後續
合併此 PR 後，Vercel 會自動重新部署，安全漏洞將被修復。
```

