-- 添加刪除餐廳的 RLS 策略
-- 執行此腳本以允許建立者刪除自己的餐廳

-- 只有建立者可以刪除餐廳
DROP POLICY IF EXISTS "建立者可以刪除餐廳" ON public.restaurants;
CREATE POLICY "建立者可以刪除餐廳"
  ON public.restaurants
  FOR DELETE
  USING (auth.uid() = created_by);

-- 驗證策略是否創建成功
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'restaurants'
ORDER BY policyname;

