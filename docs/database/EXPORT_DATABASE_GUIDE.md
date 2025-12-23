# 導出資料庫資訊指南

## 目的

導出資料庫資訊可以幫助診斷為什麼策略無法刪除。請執行以下步驟：

## 步驟

1. **前往 Supabase Dashboard**
   - 登入 [Supabase Dashboard](https://app.supabase.com/)
   - 選擇你的專案

2. **打開 SQL Editor**
   - 點擊左側選單的 **SQL Editor**

3. **執行診斷腳本**
   - 複製 `docs/database/export_database_info.sql` 的內容
   - 貼上到 SQL Editor
   - 點擊 **Run** 執行

4. **複製結果**
   - 將所有查詢結果複製給我
   - 特別是以下幾個查詢的結果：
     - 查詢 1：所有 reviews 表的 RLS 策略
     - 查詢 2：策略名稱的原始格式
     - 查詢 3：從系統表查看策略資訊
     - 查詢 9：策略的 OID（如果有的話）

## 或者，使用 Supabase CLI（如果有的話）

如果你有 Supabase CLI，也可以使用：

```bash
# 導出資料庫結構
supabase db dump --schema public > database_schema.sql

# 導出 RLS 策略
supabase db dump --schema public --data-only > database_data.sql
```

## 需要的資訊

最重要的是以下資訊：

1. **所有 RLS 策略的完整列表**（特別是 UPDATE 策略）
2. **策略名稱的確切格式**（可能有隱藏的特殊字符）
3. **策略的 OID**（可以用來直接操作系統表）
4. **當前用戶的權限**（可能是權限問題）

執行完腳本後，請將結果提供給我，我會根據實際情況提供針對性的解決方案。

