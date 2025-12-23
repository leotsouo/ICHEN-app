-- 檢查所有 schema 中的策略和表
-- 確保專案只使用 public schema

-- ============================================
-- 1. 檢查所有 schema 中的 reviews 表策略
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  policyname as "策略名稱",
  cmd as "操作類型",
  qual as "USING 條件",
  with_check as "WITH CHECK 條件",
  CASE 
    WHEN cmd = 'UPDATE' AND with_check IS NULL THEN '❌ 缺少 WITH CHECK'
    WHEN cmd = 'UPDATE' AND with_check IS NOT NULL THEN '✅ 正確'
    ELSE '✅ 正確'
  END as "狀態"
FROM pg_policies
WHERE tablename = 'reviews'
ORDER BY schemaname, cmd, policyname;

-- ============================================
-- 2. 檢查所有 schema 中的表
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  tableowner as "所有者"
FROM pg_tables
WHERE schemaname IN ('public', 'rest')
ORDER BY schemaname, tablename;

-- ============================================
-- 3. 檢查 rest schema 中是否有表或策略
-- ============================================
SELECT 
  'Tables' as "類型",
  COUNT(*) as "數量"
FROM pg_tables
WHERE schemaname = 'rest'

UNION ALL

SELECT 
  'Policies' as "類型",
  COUNT(*) as "數量"
FROM pg_policies
WHERE schemaname = 'rest';

-- ============================================
-- 4. 如果 rest schema 中有內容，建議清理
-- ============================================
-- 如果 rest schema 中有策略，可以刪除：
-- DROP POLICY IF EXISTS "reviews update by author" ON rest.reviews;
-- DROP POLICY IF EXISTS "reviews insert by author" ON rest.reviews;
-- DROP POLICY IF EXISTS "reviews select all" ON rest.reviews;
-- DROP POLICY IF EXISTS "reviews delete by author" ON rest.reviews;

-- ============================================
-- 5. 檢查 public schema 中的策略（應該只有這些）
-- ============================================
SELECT 
  schemaname as "Schema",
  tablename as "表名",
  policyname as "策略名稱",
  cmd as "操作類型"
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('reviews', 'restaurants', 'review_aspect')
ORDER BY tablename, cmd, policyname;

-- ============================================
-- 預期結果：
-- 所有策略都應該在 public schema 中
-- rest schema 應該沒有策略或表
-- ============================================

