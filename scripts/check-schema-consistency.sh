#!/bin/bash
# Schema 一致性檢查腳本
# 確保所有 Supabase 客戶端都使用 public schema

echo "🔍 檢查 Supabase Schema 配置..."

# 檢查是否有 rest schema 配置
REST_SCHEMA_FOUND=$(grep -r "schema.*rest\|db.*schema.*rest" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l)

if [ "$REST_SCHEMA_FOUND" -gt 0 ]; then
  echo "❌ 發現 rest schema 配置："
  grep -r "schema.*rest\|db.*schema.*rest" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v ".next"
  echo ""
  echo "請將所有 rest schema 改為 public schema"
  exit 1
fi

# 檢查是否有明確的 public schema 配置
PUBLIC_SCHEMA_FOUND=$(grep -r "schema.*public\|db.*schema.*public" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l)

if [ "$PUBLIC_SCHEMA_FOUND" -eq 0 ]; then
  echo "⚠️  沒有找到明確的 public schema 配置"
  echo "建議在所有 Supabase 客戶端中明確指定 schema: 'public'"
fi

# 檢查所有 Supabase 客戶端創建位置
echo ""
echo "📋 Supabase 客戶端創建位置："
grep -r "createClient\|createServerClient" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v ".next" | head -20

echo ""
echo "✅ Schema 一致性檢查完成"

