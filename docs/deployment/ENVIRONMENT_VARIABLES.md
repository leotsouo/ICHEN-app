# 🔐 環境變數配置指南

本指南詳細說明 ICHEN-app 專案所需的環境變數。

## 📋 環境變數列表

### 必要環境變數

以下環境變數是應用正常運行所必需的。

#### `NEXT_PUBLIC_SUPABASE_URL`

- **說明**：Supabase 專案的 URL
- **格式**：`https://your-project-id.supabase.co`
- **範例**：`https://abcdefghijklmnop.supabase.co`
- **取得方式**：
  1. 前往 [Supabase Dashboard](https://app.supabase.com/)
  2. 選擇你的專案
  3. 進入 Settings → API
  4. 複製 **Project URL**
- **使用環境**：Production, Preview, Development
- **注意事項**：必須包含 `https://` 前綴，結尾不要有斜線

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **說明**：Supabase 的匿名（公開）金鑰
- **格式**：JWT token（通常以 `eyJ` 開頭）
- **範例**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **取得方式**：
  1. 前往 [Supabase Dashboard](https://app.supabase.com/)
  2. 選擇你的專案
  3. 進入 Settings → API
  4. 複製 **anon/public key**
- **使用環境**：Production, Preview, Development
- **注意事項**：這是公開金鑰，可以安全地暴露在前端代碼中

### 可選環境變數

以下環境變數是可選的，未設定時相關功能可能無法使用或使用替代方案。

#### `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

- **說明**：Google Maps API Key（用於餐廳地址自動完成功能）
- **格式**：`AIzaSy...`
- **取得方式**：
  1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
  2. 創建或選擇專案
  3. 啟用 Maps JavaScript API 和 Places API
  4. 創建 API Key
  5. 設定 API Key 限制（推薦）
- **使用環境**：Production, Preview, Development（可選）
- **注意事項**：
  - 如果未設定，新增餐廳功能仍可使用，但沒有地址自動完成功能
  - 建議設定 API Key 限制以提高安全性

## 🔧 設定環境變數

### 本地開發環境

在 `apps/home/` 目錄下創建 `.env.local` 檔案：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Maps API（可選）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

> 💡 **提示**：`.env.local` 檔案已被 `.gitignore` 忽略，不會被提交到 Git 倉庫。

### Vercel 生產環境

在 Vercel Dashboard 中設定：

1. 前往你的專案 → Settings → Environment Variables
2. 點擊 **Add** 按鈕
3. 輸入變數名稱和值
4. 選擇要套用的環境（Production, Preview, Development）
5. 點擊 **Save**

**建議設定**：
- 所有必要環境變數都應該套用到所有環境（Production, Preview, Development）
- 可選環境變數可以只設定在 Production 環境

### 更新環境變數

#### 在 Vercel 中更新

1. 前往 Vercel Dashboard → Settings → Environment Variables
2. 找到要更新的變數，點擊編輯
3. 修改值
4. 點擊 **Save**

**重要**：更新環境變數後，需要重新部署才能生效：

1. 前往 Deployments 標籤
2. 點擊最新部署右側的 **⋯** → **Redeploy**
3. 或推送新的 commit 到 GitHub（會自動觸發重新部署）

## 🔍 驗證環境變數

### 本地驗證

確保環境變數已正確載入：

```bash
# 在 apps/home 目錄下
pnpm dev
```

檢查瀏覽器 Console 或 Network 標籤，確認 Supabase 請求使用的 URL 和 Key 是否正確。

### 生產環境驗證

1. 訪問部署的應用
2. 打開瀏覽器開發者工具（F12）
3. 查看 Console 是否有錯誤
4. 查看 Network 標籤，確認 Supabase API 請求是否成功

## ⚠️ 常見問題

### 問題 1: 環境變數未生效

**可能原因**：
- 變數名稱拼寫錯誤（注意大小寫）
- 變數值包含多餘的空格或引號
- 未重新部署（Vercel 需要重新部署才能生效）

**解決方案**：
1. 檢查變數名稱是否完全正確（`NEXT_PUBLIC_` 前綴很重要）
2. 確認變數值沒有多餘的空格
3. 重新部署應用

### 問題 2: Supabase 連線失敗

**可能原因**：
- `NEXT_PUBLIC_SUPABASE_URL` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 錯誤
- Supabase 專案已暫停或刪除

**解決方案**：
1. 確認環境變數值正確
2. 檢查 Supabase Dashboard 確認專案狀態
3. 確認 URL 格式正確（包含 `https://`，無結尾斜線）

### 問題 3: Google Maps API 未生效

**可能原因**：
- API Key 未設定
- API Key 設定錯誤
- API Key 限制設定過於嚴格

**解決方案**：
1. 確認環境變數已正確設定
2. 檢查 Google Cloud Console 中 API Key 的狀態
3. 確認已啟用必要的 API（Maps JavaScript API 和 Places API）
4. 檢查 API Key 限制設定

## 📝 環境變數命名規範

- 所有前端可訪問的環境變數必須以 `NEXT_PUBLIC_` 開頭
- 使用大寫字母和下劃線
- 使用描述性的名稱

## 🔗 相關文檔

- [完整部署指南](./DEPLOYMENT.md)
- [快速開始指南](./QUICK_START.md)
- [Supabase 官方文檔](https://supabase.com/docs)

