# Schema 一致性檢查腳本 (PowerShell)
# 確保所有 Supabase 客戶端都使用 public schema

Write-Host "🔍 檢查 Supabase Schema 配置..." -ForegroundColor Cyan

# 檢查是否有 rest schema 配置
$restSchemaFiles = Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules|\.next" 
} | Select-String -Pattern "schema.*rest|db.*schema.*rest"

if ($restSchemaFiles) {
    Write-Host "❌ 發現 rest schema 配置：" -ForegroundColor Red
    $restSchemaFiles | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "請將所有 rest schema 改為 public schema" -ForegroundColor Red
    exit 1
}

# 檢查是否有明確的 public schema 配置
$publicSchemaFiles = Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules|\.next" 
} | Select-String -Pattern "schema.*public|db.*schema.*public"

if (-not $publicSchemaFiles) {
    Write-Host "⚠️  沒有找到明確的 public schema 配置" -ForegroundColor Yellow
    Write-Host "建議在所有 Supabase 客戶端中明確指定 schema: 'public'" -ForegroundColor Yellow
} else {
    Write-Host "✅ 找到 $($publicSchemaFiles.Count) 個檔案使用 public schema" -ForegroundColor Green
}

# 檢查所有 Supabase 客戶端創建位置
Write-Host ""
Write-Host "📋 Supabase 客戶端創建位置：" -ForegroundColor Cyan
$clientFiles = Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules|\.next" 
} | Select-String -Pattern "createClient|createServerClient" | Select-Object -First 20

$clientFiles | ForEach-Object {
    Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Schema 一致性檢查完成" -ForegroundColor Green
