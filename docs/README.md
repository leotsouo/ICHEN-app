# 文檔目錄

本目錄包含 ICHEN-app 專案的所有文檔，按類別組織。

## 📘 指南文檔 (`guides/`)

- **[快速啟動指南](guides/QUICK_START.md)** - 快速開始使用專案
- **[環境變數設定](guides/ENV_SETUP.md)** - 環境變數配置說明
- **[刪除用戶指南](guides/DELETE_USER_GUIDE.md)** - 如何刪除用戶的詳細說明

## 🚀 部署文檔 (`deployment/`)

- **[部署檢查清單](deployment/DEPLOYMENT.md)** - 部署前的完整檢查清單

## 🗄️ 資料庫文檔 (`database/`)

- **[資料庫遷移說明](database/DATABASE_MIGRATION.md)** - 資料庫結構變更指南
- **[導出資料庫資訊指南](database/EXPORT_DATABASE_GUIDE.md)** - 如何導出資料庫資訊用於診斷
- **SQL 腳本**：
  - `create_restaurants_tables.sql` - 創建餐廳評分系統資料表的完整遷移腳本
  - `check_all_schemas.sql` - 檢查所有 schema 中的策略和表（用於 schema 一致性檢查）
  - `export_database_info.sql` - 導出資料庫資訊的診斷腳本
  - `create_delete_review_function.sql` - 創建 RPC 函數來執行軟刪除評論

## 🧪 測試文檔 (`testing/`)

- **[測試檢查清單](testing/TEST_CHECKLIST.md)** - 功能測試檢查清單
- **[登入系統測試](testing/TEST_LOGIN.md)** - 登入功能測試指南

