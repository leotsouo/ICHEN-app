# ICHEN-app Startup Script (PowerShell)
# Quick start script with environment checks

# Set console output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ICHEN-app Project Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[*] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 18.x or higher" -ForegroundColor Red
    Write-Host "        Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check pnpm
Write-Host "[*] Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] pnpm version: $pnpmVersion" -ForegroundColor Green
        
        # Check if version is correct
        if ($pnpmVersion -notmatch "^9\.15\.") {
            Write-Host "[WARN] Recommended pnpm version: 9.15.9, current: $pnpmVersion" -ForegroundColor Yellow
            Write-Host "       Run: corepack enable && corepack prepare pnpm@9.15.9 --activate" -ForegroundColor Yellow
        }
    } else {
        throw "pnpm not found"
    }
} catch {
    Write-Host "[*] pnpm not found, installing..." -ForegroundColor Yellow
    npm install -g pnpm@9.15.9
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install pnpm" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] pnpm installed successfully" -ForegroundColor Green
}

# Check dependencies
Write-Host "[*] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
}

# Check environment variables
Write-Host "[*] Checking environment variables..." -ForegroundColor Yellow
$envFile = "apps\restaurant-ratings\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "[WARN] Environment file not found: $envFile" -ForegroundColor Yellow
    Write-Host "[*] Creating template file..." -ForegroundColor Yellow
    
    # Create directory if it doesn't exist
    $envDir = Split-Path -Parent $envFile
    if (-not (Test-Path $envDir)) {
        New-Item -ItemType Directory -Path $envDir -Force | Out-Null
    }
    
    # Create template content
    $envTemplate = "# Supabase Configuration`nNEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url`nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`n"
    
    Set-Content -Path $envFile -Value $envTemplate -Encoding UTF8
    
    Write-Host "[OK] Template file created: $envFile" -ForegroundColor Green
    Write-Host "[WARN] Please edit this file and fill in your Supabase configuration" -ForegroundColor Yellow
    Write-Host "       See: docs\guides\ENV_SETUP.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue (app may not work without proper env vars)..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "[OK] Environment file exists: $envFile" -ForegroundColor Green
    
    # Check if environment variables are set
    $envContent = Get-Content $envFile -Raw -ErrorAction SilentlyContinue
    if ($envContent -and ($envContent -match "your_supabase_project_url" -or $envContent -match "your_supabase_anon_key")) {
        Write-Host "[WARN] Environment file still contains default values" -ForegroundColor Yellow
        Write-Host "       Please confirm Supabase configuration is correct" -ForegroundColor Yellow
    }
}

# Check ports
Write-Host "[*] Checking ports..." -ForegroundColor Yellow
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    $port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    
    if ($port3000) {
        Write-Host "[WARN] Port 3000 is already in use" -ForegroundColor Yellow
    }
    if ($port3001) {
        Write-Host "[WARN] Port 3001 is already in use" -ForegroundColor Yellow
    }
    if (-not $port3000 -and -not $port3001) {
        Write-Host "[OK] Ports 3000 and 3001 are available" -ForegroundColor Green
    }
} catch {
    Write-Host "[WARN] Could not check ports (may require admin privileges)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting development server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Applications will be available at:" -ForegroundColor Green
Write-Host "   - Home: http://localhost:3000" -ForegroundColor White
Write-Host "   - Restaurant Ratings: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start development server
pnpm dev
