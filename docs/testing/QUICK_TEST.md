# ⚡ 快速測試指南

## 🎯 測試整合後的應用

### 步驟 1: 設定環境變數

如果 `apps/home/.env.local` 不存在，創建它：

```bash
# Windows PowerShell
Copy-Item "apps\restaurant-ratings\.env.local" "apps\home\.env.local"

# Mac/Linux
cp apps/restaurant-ratings/.env.local apps/home/.env.local
```

或手動創建 `apps/home/.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 步驟 2: 安裝依賴（如果需要）

```bash
pnpm install
```

### 步驟 3: 啟動應用

```bash
# 只啟動整合後的應用
pnpm dev:home
```

或

```bash
cd apps/home
pnpm dev
```

### 步驟 4: 測試

1. **訪問首頁**: http://localhost:3000
   - 應該看到 "ICHEN-apps！" 首頁
   - 應該看到 "餐廳評分系統" 卡片

2. **點擊進入評分系統**: http://localhost:3000/ratings
   - 應該看到餐廳評分系統頁面
   - 應該看到 "← 回首頁" 連結

3. **測試導航**:
   - 從首頁點擊 "餐廳評分系統" → 應該進入 `/ratings`
   - 從評分系統點擊 "← 回首頁" → 應該返回 `/`

4. **測試功能**:
   - 登入功能
   - 查看餐廳列表
   - 新增評論（如果已登入）

### 步驟 5: 建置測試

確認可以正常建置：

```bash
cd apps/home
pnpm build
```

如果建置成功，就可以推送到 GitHub 了！

## ⚠️ 重要提醒

- ✅ **不會影響**現有的 `restaurant-ratings` 應用（它仍然獨立運行）
- ✅ 環境變數檔案 `.env.local` **不會**被提交到 GitHub（已在 `.gitignore` 中）
- ✅ 可以同時運行兩個應用進行對比測試

