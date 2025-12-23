# Schema 一致性檢查指南

## 問題描述

專案中發現 schema 不一致的問題：
- **瀏覽器客戶端**：使用 `rest` schema
- **服務端客戶端**：使用 `public` schema（默認）

這會導致：
1. 瀏覽器和服務端訪問不同的 schema
2. RLS 策略可能在不同 schema 中
3. 數據不一致
4. 難以調試的問題

## 解決方案

### 1. 統一使用 `public` schema

所有 Supabase 客戶端都應該使用 `public` schema：

**瀏覽器客戶端** (`packages/shared-supabase/src/client.ts`):
```typescript
db: { schema: "public" }  // ✅ 正確
```

**服務端客戶端** (`packages/shared-supabase/src/server.ts`):
```typescript
db: { schema: "public" }  // ✅ 明確指定
```

### 2. 檢查所有客戶端配置

確保以下檔案都使用 `public` schema：
- ✅ `packages/shared-supabase/src/client.ts` - 瀏覽器客戶端
- ✅ `packages/shared-supabase/src/server.ts` - 服務端客戶端（RSC）
- ✅ `packages/shared-supabase/src/server.ts` - 服務端客戶端（Route Handlers）

### 3. 清理 rest schema

如果 `rest` schema 中有策略或表，應該：
1. 刪除所有策略
2. 刪除所有表（如果不需要）
3. 或者刪除整個 `rest` schema

## 檢查步驟

### 步驟 1: 執行 SQL 檢查

執行 `docs/database/check_all_schemas.sql` 檢查：
- 所有 schema 中的策略
- 所有 schema 中的表
- `rest` schema 中是否有內容

### 步驟 2: 檢查代碼配置

使用以下命令檢查所有 Supabase 客戶端配置：

```bash
# 檢查所有 schema 配置
grep -r "schema.*rest\|schema.*public\|db.*schema" --include="*.ts" --include="*.tsx"
```

### 步驟 3: 驗證修復

1. 重新啟動開發服務器
2. 測試所有功能（特別是刪除評分）
3. 檢查瀏覽器控制台是否有錯誤

## 為什麼會有 rest schema？

`rest` schema 可能是：
1. Supabase 自動生成的（舊版本）
2. 測試時創建的
3. 誤配置導致的

無論如何，應該統一使用 `public` schema。

## 預防措施

### 1. 代碼審查檢查清單

在代碼審查時，檢查：
- [ ] 所有 Supabase 客戶端都使用 `public` schema
- [ ] 沒有硬編碼的 schema 名稱
- [ ] 所有資料庫操作都明確指定 schema（如果需要）

### 2. 自動化檢查

可以在 CI/CD 中添加檢查：

```bash
# 檢查是否有 rest schema 配置
if grep -r "schema.*rest" --include="*.ts" --include="*.tsx"; then
  echo "❌ 發現 rest schema 配置，請改為 public"
  exit 1
fi
```

### 3. 文檔化

確保所有開發者都知道：
- 統一使用 `public` schema
- 不要創建新的 schema（除非有特殊需求）
- 如果發現 schema 不一致，立即修復

## 相關檔案

- `packages/shared-supabase/src/client.ts` - 瀏覽器客戶端
- `packages/shared-supabase/src/server.ts` - 服務端客戶端
- `docs/database/check_all_schemas.sql` - Schema 檢查腳本

## 修復後的驗證

執行以下 SQL 驗證：

```sql
-- 應該只看到 public schema 中的策略
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'reviews'
ORDER BY schemaname;

-- 應該只看到 public schema 中的表
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname IN ('public', 'rest')
ORDER BY schemaname, tablename;
```

**預期結果**：
- 所有策略都在 `public` schema
- `rest` schema 應該沒有策略或表

