# 資料庫遷移說明

## 創建餐廳評分系統資料表

這是建立餐廳評分系統所需的所有資料表的完整遷移腳本。

### 步驟 1: 執行完整資料庫遷移

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 進入 **SQL Editor**
4. 打開並執行 `docs/database/create_restaurants_tables.sql` 檔案中的所有 SQL 語句

或者，你也可以直接複製以下 SQL 並執行：

<details>
<summary>點擊展開完整 SQL 遷移腳本</summary>

請參考 `docs/database/create_restaurants_tables.sql` 檔案。

</details>

### 步驟 2: 驗證設定

執行以下查詢來確認表已正確創建：

```sql
-- 檢查表是否存在
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('restaurants', 'reviews', 'review_aspect')
ORDER BY table_name;

-- 檢查視圖是否存在
SELECT 
  table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name = 'v_restaurant_rating';
```

應該會看到三個表和一個視圖。

### 資料表結構說明

#### restaurants 表
- `id`: UUID 主鍵
- `name`: 餐廳名稱（必填）
- `address`: 地址（可選）
- `created_by`: 建立者 ID（參考 auth.users）
- `latitude`: 緯度（可選，來自 Google Places）
- `longitude`: 經度（可選，來自 Google Places）
- `place_id`: Google Places ID（可選）
- `created_at`: 建立時間
- `updated_at`: 更新時間

#### reviews 表
- `id`: UUID 主鍵
- `restaurant_id`: 餐廳 ID（參考 restaurants）
- `user_id`: 用戶 ID（參考 auth.users）
- `rating_half`: 評分（半星制，1-10）
- `comment`: 評論內容（最多 500 字）
- `created_at`: 建立時間
- `updated_at`: 更新時間
- `deleted_at`: 軟刪除時間（NULL 表示未刪除）
- 唯一約束：每個用戶對每個餐廳只能有一筆評論

#### review_aspect 表
- `id`: UUID 主鍵
- `review_id`: 評論 ID（參考 reviews）
- `aspect_id`: 分項 ID（1-5：服務、氣氛、價格CP值、口味、衛生）
- `score_half`: 分項評分（半星制，1-10）
- `created_at`: 建立時間
- 唯一約束：每個評論的每個分項只能有一筆記錄

#### v_restaurant_rating 視圖
自動計算每個餐廳的平均評分和評論數（只計算未刪除的評論）。

---

## 添加 display_name 欄位到 profiles 表

為了支援用戶自訂顯示名稱功能，需要在 Supabase 的 `profiles` 表中添加 `display_name` 欄位。

### 步驟 1: 在 Supabase Dashboard 中執行 SQL

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 進入 **SQL Editor**
4. 執行以下 SQL 語句：

```sql
-- 檢查 profiles 表是否存在，如果不存在則創建
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 如果表已存在，添加 display_name 欄位（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
END $$;

-- 如果表已存在，添加 updated_at 欄位（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 創建更新 updated_at 的觸發器函數（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 創建觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策：用戶可以讀取所有 profiles
CREATE POLICY "任何人都可以讀取 profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- 創建 RLS 政策：用戶只能更新自己的 profile
CREATE POLICY "用戶可以更新自己的 profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 創建 RLS 政策：用戶可以插入自己的 profile
CREATE POLICY "用戶可以插入自己的 profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 步驟 2: 驗證設定

執行以下查詢來確認欄位已正確添加：

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;
```

應該會看到 `display_name` 欄位。

### 步驟 3: 測試功能

1. 登入應用程式
2. 在用戶頭像旁邊點擊「設定顯示名稱」
3. 輸入自訂名稱（最多 20 個字元）
4. 點擊「儲存」
5. 查看評論列表，確認顯示名稱已更新

## 注意事項

- `display_name` 欄位是可選的，如果用戶沒有設定，系統會使用預設的「用戶 {user_id前8位}」格式
- 顯示名稱最多 20 個字元
- 用戶只能更新自己的顯示名稱
- 所有用戶都可以看到其他人的顯示名稱（用於評論顯示）

