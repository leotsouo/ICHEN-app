# 環境變數設定指南

## 📍 檔案位置

在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案：

```
apps/restaurant-ratings/.env.local
```

## 📝 檔案內容格式

`.env.local` 檔案應該包含以下內容：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_HOME_URL=http://localhost:3000
```

> **注意**：
> - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 是可選的。如果未設定，新增餐廳功能仍可使用，但不會有 Google Places 自動完成功能。
> - `NEXT_PUBLIC_HOME_URL` 是可選的。如果未設定，在本地開發時會預設使用 `http://localhost:3000`。在生產環境（Vercel）部署時，建議設定為首頁應用的實際 URL。

> **注意**：`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 是可選的。如果未設定，新增餐廳功能仍可使用，但不會有 Google Places 自動完成功能。

### 重要注意事項

1. **不要有引號**：值不需要用引號包起來
2. **不要有空格**：等號前後不要有空格
3. **不要有註解**：每行只能有一個環境變數
4. **大小寫敏感**：變數名稱必須完全一致

## 🔑 如何取得 Supabase 環境變數

### 步驟 1: 登入 Supabase Dashboard

1. 前往 [https://app.supabase.com/](https://app.supabase.com/)
2. 登入你的帳號
3. 選擇你的專案（如果還沒有專案，先創建一個）

### 步驟 2: 取得 Project URL

1. 在左側選單點擊 **Settings**（設定）
2. 點擊 **API**
3. 在 **Project URL** 區塊，你會看到類似這樣的 URL：
   ```
   https://abcdefghijklmnop.supabase.co
   ```
4. **複製這個完整的 URL**（包含 `https://`）

### 步驟 3: 取得 Anon Key

1. 在同一個頁面（Settings → API）
2. 在 **Project API keys** 區塊
3. 找到 **anon/public** 這個 key
4. 點擊旁邊的 **眼睛圖示** 或 **複製按鈕** 來顯示完整的 key
5. **複製整個 key**（這是一個很長的 JWT token，通常以 `eyJ` 開頭）

### 步驟 4: 建立 .env.local 檔案

1. 在 `apps/restaurant-ratings/` 目錄下創建 `.env.local` 檔案
2. 貼上以下內容，並替換成你的實際值：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的專案ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的完整anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=你的Google_Maps_API_Key（可選）
NEXT_PUBLIC_HOME_URL=http://localhost:3000（可選，本地開發預設值）
```

## 📋 完整範例

假設你的 Supabase 專案資訊如下：
- Project URL: `https://abcdefghijklmnop.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDEyMzQ1NiwiZXhwIjoxOTU1Njk5NDU2fQ.example-signature`

那麼 `.env.local` 檔案應該是：

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDEyMzQ1NiwiZXhwIjoxOTU1Njk5NDU2fQ.example-signature
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyExample1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_HOME_URL=http://localhost:3000
```

## ✅ 驗證設定

設定完成後，重新啟動開發伺服器：

```bash
# 停止目前的伺服器（Ctrl+C）
# 然後重新啟動
pnpm dev
```

檢查終端機是否有錯誤訊息。如果看到 Supabase 連線錯誤，請檢查：
1. 環境變數名稱是否正確
2. URL 和 Key 是否完整複製
3. 檔案是否在正確的位置（`apps/restaurant-ratings/.env.local`）

## 🔒 安全性提醒

⚠️ **重要**：
- `.env.local` 檔案已經在 `.gitignore` 中，不會被提交到 Git
- **不要**將 `.env.local` 檔案分享給他人
- **不要**將環境變數提交到 Git 倉庫
- 在 Vercel 部署時，需要在 Vercel Dashboard 中設定環境變數

## 🖼️ 視覺化指南

### Supabase Dashboard 中的位置

```
Supabase Dashboard
├── Settings (左側選單)
    └── API
        ├── Project URL ← 複製這個
        └── Project API keys
            └── anon/public ← 複製這個（點擊眼睛圖示顯示）
```

## 🗺️ Google Maps API Key 設定（可選）

為了使用 Google Places 自動完成功能來新增餐廳，你需要設定 Google Maps API Key。

### 步驟 1: 取得 Google Maps API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下 API：
   - **Places API**（必要）
   - **Maps JavaScript API**（可選，如果需要顯示地圖）
4. 前往 **Credentials**（憑證）頁面
5. 點擊 **Create Credentials** → **API Key**
6. 複製產生的 API Key

### 步驟 2: 限制 API Key（建議）

為了安全，建議限制 API Key 的使用：

1. 點擊剛建立的 API Key
2. 在 **API restrictions** 中，選擇 **Restrict key**
3. 只勾選：
   - **Places API**
   - **Maps JavaScript API**（如果使用）
4. 在 **Application restrictions** 中，選擇 **HTTP referrers (web sites)**
5. 在 **Website restrictions** 中，點擊 **Add an item**，添加以下授權域名：
   ```
   http://localhost:3001/*
   http://localhost:3000/*
   https://your-production-domain.com/*
   ```
   > **注意**：`*` 表示允許該域名下的所有路徑
6. 點擊 **Save** 儲存設定

#### 重要：授權域名設定

如果遇到 `RefererNotAllowedMapError` 錯誤，表示你的 API Key 沒有授權當前域名。請確保：

- **本地開發**：添加 `http://localhost:3001/*` 和 `http://localhost:3000/*`
- **生產環境**：添加你的實際域名，例如 `https://your-app.vercel.app/*`

授權設定可能需要幾分鐘才會生效。

### 步驟 3: 加入環境變數

在 `.env.local` 檔案中加入：

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=你的API_Key
```

### 免費額度說明

Google Maps Platform 提供每月 $200 的免費額度：
- **Places API Autocomplete**：每次請求約 $0.017（約 11,000 次免費）
- **Maps JavaScript API**：每次載入約 $0.007（約 28,000 次免費）

對於小型應用，免費額度通常足夠使用。

### 如果沒有設定 API Key

如果未設定 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`：
- 新增餐廳功能仍可使用
- 餐廳名稱輸入框會變成普通文字輸入框
- 不會有 Google Places 自動完成功能
- 需要手動輸入餐廳名稱和地址

## ❓ 常見問題

### Q: 我找不到 anon key 在哪裡？
A: 在 Settings → API 頁面，找到 "Project API keys" 區塊，anon/public key 可能預設是隱藏的，點擊眼睛圖示或複製按鈕來顯示。

### Q: URL 格式應該是怎樣的？
A: 應該是 `https://你的專案ID.supabase.co`，確保包含 `https://` 開頭。

### Q: Key 很長是正常的嗎？
A: 是的，anon key 是一個 JWT token，通常有 200+ 個字元，以 `eyJ` 開頭。

### Q: 設定後還是無法連線？
A: 
1. 確認檔案名稱是 `.env.local`（注意前面的點）
2. 確認檔案在 `apps/restaurant-ratings/` 目錄下
3. 重新啟動開發伺服器
4. 檢查變數名稱是否完全一致（大小寫敏感）

### Q: Google Maps API Key 是必要的嗎？
A: 不是必要的。如果未設定，新增餐廳功能仍可使用，只是沒有自動完成功能。

### Q: Google Maps API 會收費嗎？
A: Google 提供每月 $200 的免費額度，對於小型應用通常足夠。超過免費額度後才會收費。

### Q: 如何檢查 Google Maps API Key 是否正確？
A: 在新增餐廳頁面，如果輸入餐廳名稱時出現自動完成建議，表示 API Key 設定正確。

### Q: 出現 "RefererNotAllowedMapError" 錯誤怎麼辦？
A: 這表示你的 API Key 沒有授權當前域名。解決方法：
1. 前往 [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. 點擊你的 API Key
3. 在 **Application restrictions** 中選擇 **HTTP referrers (web sites)**
4. 添加以下授權域名：
   - `http://localhost:3001/*`（本地開發）
   - `http://localhost:3000/*`（如果需要）
   - `https://your-production-domain.com/*`（生產環境）
5. 點擊 **Save** 儲存
6. 等待幾分鐘讓設定生效，然後重新載入頁面

### Q: 授權設定後還是出現錯誤？
A: 
1. 確認授權域名格式正確（包含 `http://` 或 `https://` 和 `/*`）
2. 等待 2-5 分鐘讓 Google Cloud Console 的設定生效
3. 清除瀏覽器快取並重新載入頁面
4. 確認 API Key 已啟用 **Places API** 和 **Maps JavaScript API**

### Q: 「回首頁」功能無法使用？
A: 這通常是因為 `NEXT_PUBLIC_HOME_URL` 環境變數未設定。解決方法：
1. **本地開發**：如果未設定，會自動使用 `http://localhost:3000`（預設值）
2. **生產環境（Vercel）**：需要在 Vercel Dashboard 中設定 `NEXT_PUBLIC_HOME_URL` 環境變數，值為首頁應用的實際 URL（例如：`https://your-home-app.vercel.app`）
3. 設定完成後，重新部署應用

