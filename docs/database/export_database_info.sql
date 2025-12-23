-- 導出資料庫資訊用於診斷
-- 執行此腳本並將結果提供給我，這樣我可以更好地診斷問題
--
-- 執行方法：
-- 1. 前往 Supabase Dashboard → SQL Editor
-- 2. 複製並執行此腳本
-- 3. 複製所有輸出結果給我

-- ============================================
-- 1. 所有 reviews 表的 RLS 策略（詳細資訊）
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  policyname as "策略名稱",
  permissive as "許可類型",
  roles as "角色",
  cmd as "操作類型",
  qual as "USING 條件",
  with_check as "WITH CHECK 條件",
  CASE 
    WHEN cmd = 'UPDATE' AND with_check IS NULL THEN '❌ 缺少 WITH CHECK'
    WHEN cmd = 'UPDATE' AND with_check IS NOT NULL THEN '✅ 正確'
    ELSE 'N/A'
  END as "狀態"
FROM pg_policies
WHERE tablename = 'reviews'
ORDER BY cmd, policyname;

-- ============================================
-- 2. 策略名稱的原始格式（檢查特殊字符）
-- ============================================
SELECT 
  policyname as "策略名稱（原始）",
  quote_ident(policyname) as "策略名稱（SQL 格式）",
  quote_literal(policyname) as "策略名稱（字串格式）",
  length(policyname) as "名稱長度",
  cmd as "操作類型",
  with_check IS NULL as "缺少 WITH CHECK"
FROM pg_policies
WHERE tablename = 'reviews'
AND cmd = 'UPDATE'
ORDER BY policyname;

-- ============================================
-- 3. 從系統表查看策略資訊（更底層）
-- ============================================
SELECT 
  p.polname as "策略名稱",
  p.polcmd as "操作類型",
  p.polpermissive as "許可類型",
  p.polroles::regrole[] as "角色",
  pg_get_expr(p.polqual, p.polrelid) as "USING 條件",
  pg_get_expr(p.polwithcheck, p.polrelid) as "WITH CHECK 條件",
  c.relname as "表名"
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'reviews'
AND c.relnamespace = 'public'::regnamespace
ORDER BY p.polname;

-- ============================================
-- 4. reviews 表的結構資訊
-- ============================================
SELECT 
  column_name as "欄位名稱",
  data_type as "資料類型",
  is_nullable as "可為空",
  column_default as "預設值"
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'reviews'
ORDER BY ordinal_position;

-- ============================================
-- 5. reviews 表的索引和約束
-- ============================================
SELECT 
  indexname as "索引名稱",
  indexdef as "索引定義"
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'reviews';

-- ============================================
-- 6. RLS 是否啟用
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  rowsecurity as "RLS 已啟用"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'reviews';

-- ============================================
-- 7. 當前用戶和權限資訊
-- ============================================
SELECT 
  current_user as "當前用戶",
  current_database() as "當前資料庫",
  session_user as "會話用戶";

-- ============================================
-- 8. 檢查是否有策略依賴關係
-- ============================================
SELECT 
  p.polname as "策略名稱",
  p.polcmd as "操作類型",
  obj_description(p.oid, 'pg_policy') as "策略描述",
  c.relname as "表名",
  c.relowner::regrole as "表所有者"
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'reviews'
AND c.relnamespace = 'public'::regnamespace
ORDER BY p.polname;

-- ============================================
-- 9. 嘗試刪除策略的錯誤資訊（如果有的話）
-- ============================================
-- 這個查詢會顯示策略的 OID，可以用來直接操作系統表
SELECT 
  p.oid as "策略 OID",
  p.polname as "策略名稱",
  p.polcmd as "操作類型",
  c.relname as "表名"
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'reviews'
AND c.relnamespace = 'public'::regnamespace
AND p.polname = 'reviews update by author';

-- ============================================
-- 10. 所有相關表的 RLS 策略（完整列表）
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  policyname as "策略名稱",
  cmd as "操作類型",
  qual as "USING 條件",
  with_check as "WITH CHECK 條件"
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('reviews', 'restaurants', 'review_aspect')
ORDER BY tablename, cmd, policyname;

