# ✅ Vercel 設定檢查清單

## 🎯 針對 `ichen-app-restaurant-ratings` 專案的設定

### 📍 基本設定（Settings → General）

#### Root Directory
```
apps/restaurant-ratings
```
> ⚠️ **重要**：必須設定為 `apps/restaurant-ratings`，不是根目錄

#### Framework Preset
```
Next.js
```

#### Build Command
**選項 1（推薦）**：
```
cd ../.. && pnpm build --filter=restaurant-ratings
```

**選項 2（簡化）**：
```
pnpm build
```
> 如果使用選項 2，確保 Install Command 從根目錄執行

#### Output Directory
```
.next
```
> 或留空（Next.js 會自動處理）

#### Install Command
```
cd ../.. && pnpm install
```
> ⚠️ **重要**：必須從根目錄執行，這樣才能安裝 monorepo 的所有依賴

#### Development Command
```
cd ../.. && pnpm dev --filter=restaurant-ratings
```

---

### 🔐 環境變數（Settings → Environment Variables）

確認以下環境變數已設定：

| 變數名稱 | 必要 | 環境 | 說明 |
|---------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Production, Preview, Development | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Production, Preview, Development | Supabase 匿名金鑰 |
| `NEXT_PUBLIC_HOME_URL` | ❌ | Production, Preview, Development | 首頁應用 URL |

> 💡 **提示**：修改環境變數後需要重新部署才會生效

---

### 🔍 檢查步驟

1. **前往 Vercel Dashboard**
   - 登入 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 選擇專案 `ichen-app-restaurant-ratings`

2. **檢查基本設定**
   - Settings → General
   - 對照上面的設定檢查

3. **檢查環境變數**
   - Settings → Environment Variables
   - 確認所有必要的環境變數都已設定

4. **查看建置日誌**
   - Deployments → 選擇最新的部署
   - 查看 Build Logs 找出錯誤

---

### 🛠️ 快速修復

如果部署失敗，按照以下順序檢查：

1. ✅ **Root Directory** 是否為 `apps/restaurant-ratings`
2. ✅ **Install Command** 是否從根目錄執行
3. ✅ **Build Command** 是否正確
4. ✅ **環境變數** 是否已設定
5. ✅ **本地建置** 是否成功

---

### 📝 本地測試建置

在推送前，先在本地測試建置：

```bash
# 1. 確保在專案根目錄
cd /path/to/ICHEN-app

# 2. 安裝依賴
pnpm install

# 3. 測試建置
cd apps/restaurant-ratings
pnpm build
```

如果本地建置失敗，先修復本地問題再推送。

---

### 🔗 相關文檔

- [修復 Vercel 錯誤](./FIX_VERCEL_ERROR.md)
- [完整部署攻略](./VERCEL_DEPLOYMENT_GUIDE.md)
- [快速部署參考](./QUICK_DEPLOY.md)

