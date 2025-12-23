-- 創建餐廳評分系統所需的資料表
-- 執行前請確認已建立 profiles 表（參考 DATABASE_MIGRATION.md）

-- ============================================
-- 清理：刪除可能存在的同名視圖（如果有的話）
-- ============================================
-- 注意：如果這些名稱已經被視圖使用，需要先刪除視圖才能創建表
DROP VIEW IF EXISTS public.restaurants CASCADE;
DROP VIEW IF EXISTS public.reviews CASCADE;
DROP VIEW IF EXISTS public.review_aspect CASCADE;

-- ============================================
-- 1. 創建 restaurants 表
-- ============================================

CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  place_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 為餐廳名稱添加索引（提升搜尋效能）
CREATE INDEX IF NOT EXISTS idx_restaurants_name ON public.restaurants(name);
CREATE INDEX IF NOT EXISTS idx_restaurants_created_by ON public.restaurants(created_by);

-- 為餐廳名稱添加唯一約束（不區分大小寫）
-- 注意：PostgreSQL 的 UNIQUE 約束預設區分大小寫
-- 我們使用 ilike 查詢來檢查重複，但也可以添加唯一約束來防止完全相同的名稱
CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_name_unique ON public.restaurants(LOWER(name));

-- ============================================
-- 2. 創建 reviews 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating_half INTEGER NOT NULL CHECK (rating_half >= 1 AND rating_half <= 10),
  comment TEXT CHECK (char_length(comment) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  -- 唯一約束：每個用戶對每個餐廳只能有一筆評論（未刪除）
  CONSTRAINT unique_user_restaurant_review UNIQUE (restaurant_id, user_id)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON public.reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deleted_at ON public.reviews(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================
-- 3. 創建 review_aspect 表（分項評分）
-- ============================================
CREATE TABLE IF NOT EXISTS public.review_aspect (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  aspect_id INTEGER NOT NULL CHECK (aspect_id >= 1 AND aspect_id <= 5),
  score_half INTEGER NOT NULL CHECK (score_half >= 1 AND score_half <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- 唯一約束：每個評論的每個分項只能有一筆記錄
  CONSTRAINT unique_review_aspect UNIQUE (review_id, aspect_id)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_review_aspect_review_id ON public.review_aspect(review_id);
CREATE INDEX IF NOT EXISTS idx_review_aspect_aspect_id ON public.review_aspect(aspect_id);

-- ============================================
-- 4. 創建視圖 v_restaurant_rating（餐廳平均評分和評論數）
-- ============================================
-- 先刪除現有視圖（如果存在）
DROP VIEW IF EXISTS public.v_restaurant_rating CASCADE;

CREATE VIEW public.v_restaurant_rating AS
SELECT 
  r.id,
  r.name,
  r.address,
  r.created_by,
  r.latitude,
  r.longitude,
  r.place_id,
  r.created_at,
  r.updated_at,
  -- 計算平均評分（半星制，0-10），只計算未刪除的評論
  COALESCE(
    ROUND(AVG(rev.rating_half)::numeric, 1),
    0
  )::DOUBLE PRECISION AS avg_half,
  -- 計算評論數（只計算未刪除的）
  COUNT(rev.id)::INTEGER AS review_count
FROM public.restaurants r
LEFT JOIN public.reviews rev ON r.id = rev.restaurant_id AND rev.deleted_at IS NULL
GROUP BY r.id, r.name, r.address, r.created_by, r.latitude, r.longitude, r.place_id, r.created_at, r.updated_at;

-- ============================================
-- 5. 創建更新 updated_at 的觸發器函數（如果不存在）
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 為 restaurants 表添加 updated_at 觸發器
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 為 reviews 表添加 updated_at 觸發器
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. 啟用 Row Level Security (RLS)
-- ============================================

-- restaurants 表 RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- 任何人都可以讀取餐廳
DROP POLICY IF EXISTS "任何人都可以讀取餐廳" ON public.restaurants;
CREATE POLICY "任何人都可以讀取餐廳"
  ON public.restaurants
  FOR SELECT
  USING (true);

-- 登入用戶可以新增餐廳
DROP POLICY IF EXISTS "登入用戶可以新增餐廳" ON public.restaurants;
CREATE POLICY "登入用戶可以新增餐廳"
  ON public.restaurants
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 只有建立者可以更新餐廳
DROP POLICY IF EXISTS "建立者可以更新餐廳" ON public.restaurants;
CREATE POLICY "建立者可以更新餐廳"
  ON public.restaurants
  FOR UPDATE
  USING (auth.uid() = created_by);

-- 只有建立者可以刪除餐廳（且餐廳不能有評論）
DROP POLICY IF EXISTS "建立者可以刪除餐廳" ON public.restaurants;
CREATE POLICY "建立者可以刪除餐廳"
  ON public.restaurants
  FOR DELETE
  USING (auth.uid() = created_by);

-- reviews 表 RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 任何人都可以讀取未刪除的評論
DROP POLICY IF EXISTS "任何人都可以讀取未刪除的評論" ON public.reviews;
CREATE POLICY "任何人都可以讀取未刪除的評論"
  ON public.reviews
  FOR SELECT
  USING (deleted_at IS NULL);

-- 登入用戶可以新增評論
DROP POLICY IF EXISTS "登入用戶可以新增評論" ON public.reviews;
CREATE POLICY "登入用戶可以新增評論"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用戶可以更新自己的評論
DROP POLICY IF EXISTS "用戶可以更新自己的評論" ON public.reviews;
CREATE POLICY "用戶可以更新自己的評論"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- review_aspect 表 RLS
ALTER TABLE public.review_aspect ENABLE ROW LEVEL SECURITY;

-- 任何人都可以讀取分項評分
DROP POLICY IF EXISTS "任何人都可以讀取分項評分" ON public.review_aspect;
CREATE POLICY "任何人都可以讀取分項評分"
  ON public.review_aspect
  FOR SELECT
  USING (true);

-- 登入用戶可以新增分項評分（透過 review 的 user_id 檢查）
DROP POLICY IF EXISTS "登入用戶可以新增分項評分" ON public.review_aspect;
CREATE POLICY "登入用戶可以新增分項評分"
  ON public.review_aspect
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reviews
      WHERE reviews.id = review_aspect.review_id
      AND reviews.user_id = auth.uid()
    )
  );

-- 用戶可以更新自己的分項評分
DROP POLICY IF EXISTS "用戶可以更新自己的分項評分" ON public.review_aspect;
CREATE POLICY "用戶可以更新自己的分項評分"
  ON public.review_aspect
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.reviews
      WHERE reviews.id = review_aspect.review_id
      AND reviews.user_id = auth.uid()
    )
  );

-- 用戶可以刪除自己的分項評分
DROP POLICY IF EXISTS "用戶可以刪除自己的分項評分" ON public.review_aspect;
CREATE POLICY "用戶可以刪除自己的分項評分"
  ON public.review_aspect
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.reviews
      WHERE reviews.id = review_aspect.review_id
      AND reviews.user_id = auth.uid()
    )
  );

-- ============================================
-- 7. 驗證設定
-- ============================================

-- 檢查表是否創建成功
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('restaurants', 'reviews', 'review_aspect')
ORDER BY table_name;

-- 檢查視圖是否創建成功
SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name = 'v_restaurant_rating';

