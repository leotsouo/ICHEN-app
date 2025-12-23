# 删除用户指南

## 问题：无法删除用户

当你在 Supabase Dashboard 中尝试删除用户时，可能会遇到：
```
Failed to delete user: Database error deleting user
```

## 原因

这通常是因为数据库中有其他表引用了这个用户（`auth.users`），但外键约束没有设置 `ON DELETE CASCADE`。

可能引用的表：
- `reviews` 表（`user_id` 字段）
- `review_aspect` 表（可能通过 `reviews` 间接引用）
- `profiles` 表（虽然设置了 CASCADE，但可能还有其他问题）

## 解决方案

### 方法 1：使用 SQL 手动删除（推荐）

在 Supabase Dashboard → SQL Editor 中执行以下 SQL：

```sql
-- 1. 先找到要删除的用户 ID
-- 替换 'your-email@example.com' 为实际的邮箱
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'your-email@example.com';
  
  IF target_user_id IS NULL THEN
    RAISE NOTICE '用户不存在';
    RETURN;
  END IF;
  
  RAISE NOTICE '找到用户 ID: %', target_user_id;
  
  -- 2. 删除该用户的所有评论（软删除的评论可以保留，这里删除硬数据）
  DELETE FROM public.review_aspect
  WHERE review_id IN (
    SELECT id FROM public.reviews WHERE user_id = target_user_id
  );
  
  -- 3. 删除该用户的所有评论
  DELETE FROM public.reviews
  WHERE user_id = target_user_id;
  
  -- 4. 删除该用户的 profile
  DELETE FROM public.profiles
  WHERE id = target_user_id;
  
  -- 5. 最后删除用户（这会自动级联删除相关数据）
  DELETE FROM auth.users
  WHERE id = target_user_id;
  
  RAISE NOTICE '用户已成功删除';
END $$;
```

### 方法 2：分步删除（更安全）

如果你想更谨慎，可以分步执行：

```sql
-- 步骤 1: 查看用户 ID
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';

-- 步骤 2: 查看该用户的数据
-- 替换 'USER_ID_HERE' 为实际的用户 ID
SELECT COUNT(*) as review_count
FROM public.reviews
WHERE user_id = 'USER_ID_HERE';

SELECT COUNT(*) as profile_exists
FROM public.profiles
WHERE id = 'USER_ID_HERE';

-- 步骤 3: 删除评论相关的分项评分
DELETE FROM public.review_aspect
WHERE review_id IN (
  SELECT id FROM public.reviews WHERE user_id = 'USER_ID_HERE'
);

-- 步骤 4: 删除评论
DELETE FROM public.reviews
WHERE user_id = 'USER_ID_HERE';

-- 步骤 5: 删除 profile
DELETE FROM public.profiles
WHERE id = 'USER_ID_HERE';

-- 步骤 6: 删除用户
DELETE FROM auth.users
WHERE id = 'USER_ID_HERE';
```

### 方法 3：修复外键约束（长期解决方案）

如果你想以后删除用户时自动删除相关数据，可以修改 `reviews` 表的外键约束：

```sql
-- 检查当前的外键约束
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'users'
  AND ccu.table_schema = 'auth';

-- 如果 reviews.user_id 没有 CASCADE，需要先删除旧约束再创建新的
-- 注意：这需要先检查约束名称，然后执行：

-- 1. 删除旧的外键约束（需要先找到约束名称）
-- ALTER TABLE public.reviews
-- DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- 2. 创建新的带 CASCADE 的外键约束
-- ALTER TABLE public.reviews
-- ADD CONSTRAINT reviews_user_id_fkey
-- FOREIGN KEY (user_id)
-- REFERENCES auth.users(id)
-- ON DELETE CASCADE;
```

## 快速删除脚本（一键执行）

如果你确定要删除某个用户，可以直接执行这个脚本：

```sql
-- 快速删除用户脚本
-- 使用方法：替换 'your-email@example.com' 为要删除的邮箱

WITH user_to_delete AS (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
DELETE FROM public.review_aspect
WHERE review_id IN (
  SELECT id FROM public.reviews
  WHERE user_id IN (SELECT id FROM user_to_delete)
);

WITH user_to_delete AS (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
DELETE FROM public.reviews
WHERE user_id IN (SELECT id FROM user_to_delete);

WITH user_to_delete AS (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
DELETE FROM public.profiles
WHERE id IN (SELECT id FROM user_to_delete);

DELETE FROM auth.users
WHERE email = 'your-email@example.com';
```

## 验证删除

删除后，可以验证：

```sql
-- 检查用户是否已删除
SELECT * FROM auth.users WHERE email = 'your-email@example.com';
-- 应该返回空结果

-- 检查相关数据是否已删除
SELECT COUNT(*) FROM public.reviews WHERE user_id = 'USER_ID_HERE';
-- 应该返回 0
```

## 注意事项

⚠️ **警告**：
- 删除用户是**不可逆**的操作
- 删除前请确保你真的要删除这个用户
- 建议先备份数据（如果需要）
- 在生产环境中要特别小心

## 预防措施

为了避免以后遇到同样的问题，建议：

1. **设置正确的外键约束**：
   ```sql
   -- 确保所有引用 auth.users 的表都有 ON DELETE CASCADE
   ALTER TABLE public.reviews
   ADD CONSTRAINT reviews_user_id_fkey
   FOREIGN KEY (user_id)
   REFERENCES auth.users(id)
   ON DELETE CASCADE;
   ```

2. **使用软删除**：
   - 对于评论，我们已经使用了软删除（`deleted_at` 字段）
   - 但硬删除用户时，仍然需要手动处理这些数据

3. **定期清理**：
   - 定期清理已删除用户的数据
   - 或者使用数据库触发器自动处理

