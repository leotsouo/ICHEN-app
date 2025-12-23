-- 創建 RPC 函數來執行軟刪除
-- 這樣可以繞過 RLS 策略的問題

-- ============================================
-- 創建 RPC 函數
-- ============================================
CREATE OR REPLACE FUNCTION delete_review(review_id_param UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER  -- 使用函數所有者的權限
AS $$
DECLARE
  current_user_id UUID;
  review_user_id UUID;
BEGIN
  -- 獲取當前用戶 ID
  current_user_id := auth.uid();
  
  -- 檢查評論是否存在且屬於當前用戶
  SELECT user_id INTO review_user_id
  FROM reviews
  WHERE id = review_id_param
  AND deleted_at IS NULL;
  
  -- 如果評論不存在
  IF review_user_id IS NULL THEN
    RAISE EXCEPTION '評論不存在或已被刪除';
  END IF;
  
  -- 如果評論不屬於當前用戶
  IF current_user_id IS NOT NULL AND review_user_id != current_user_id THEN
    RAISE EXCEPTION '只能刪除自己的評論';
  END IF;
  
  -- 執行軟刪除
  UPDATE reviews
  SET deleted_at = NOW()
  WHERE id = review_id_param;
  
  RETURN review_id_param;
END;
$$;

-- ============================================
-- 授予權限
-- ============================================
-- 允許所有認證用戶調用此函數
GRANT EXECUTE ON FUNCTION delete_review(UUID) TO authenticated;

-- ============================================
-- 測試函數
-- ============================================
-- SELECT delete_review('YOUR_REVIEW_ID');

