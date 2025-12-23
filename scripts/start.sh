#!/bin/bash
# ICHEN-app 啟動腳本 (Unix/Linux/Mac)
# 用於快速啟動專案並檢查環境配置

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   ICHEN-app 專案啟動器${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# 檢查 Node.js
echo -e "${YELLOW}🔍 檢查 Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ 未找到 Node.js，請先安裝 Node.js 18.x 或更高版本${NC}"
    echo -e "${YELLOW}   下載地址: https://nodejs.org/${NC}"
    exit 1
fi

# 檢查 pnpm
echo -e "${YELLOW}🔍 檢查 pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✅ pnpm 版本: $PNPM_VERSION${NC}"
    
    # 檢查是否為正確版本
    if [[ ! "$PNPM_VERSION" =~ ^9\.15\. ]]; then
        echo -e "${YELLOW}⚠️  建議使用 pnpm 9.15.9，當前版本: $PNPM_VERSION${NC}"
        echo -e "${YELLOW}   執行: corepack enable && corepack prepare pnpm@9.15.9 --activate${NC}"
    fi
else
    echo -e "${YELLOW}❌ 未找到 pnpm，正在安裝...${NC}"
    npm install -g pnpm@9.15.9
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ pnpm 安裝失敗${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ pnpm 安裝成功${NC}"
fi

# 檢查依賴
echo -e "${YELLOW}🔍 檢查依賴...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 安裝依賴中...${NC}"
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依賴安裝失敗${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 依賴安裝完成${NC}"
else
    echo -e "${GREEN}✅ 依賴已安裝${NC}"
fi

# 檢查環境變數
echo -e "${YELLOW}🔍 檢查環境變數...${NC}"
ENV_FILE="apps/restaurant-ratings/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  未找到環境變數檔案: $ENV_FILE${NC}"
    echo -e "${YELLOW}   正在創建範本檔案...${NC}"
    
    cat > "$ENV_FILE" << EOF
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    
    echo -e "${GREEN}✅ 已創建範本檔案: $ENV_FILE${NC}"
    echo -e "${YELLOW}⚠️  請編輯此檔案並填入您的 Supabase 配置${NC}"
    echo -e "${CYAN}   詳細說明請參考: docs/guides/ENV_SETUP.md${NC}"
    echo ""
    read -p "按 Enter 鍵繼續啟動（環境變數未設定時可能無法正常運作）..."
else
    echo -e "${GREEN}✅ 環境變數檔案存在: $ENV_FILE${NC}"
    
    # 檢查環境變數是否已設定
    if grep -q "your_supabase_project_url\|your_supabase_anon_key" "$ENV_FILE"; then
        echo -e "${YELLOW}⚠️  環境變數檔案中仍有預設值，請確認已填入正確的 Supabase 配置${NC}"
    fi
fi

# 檢查端口
echo -e "${YELLOW}🔍 檢查端口...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  端口 3000 已被占用${NC}"
fi
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  端口 3001 已被占用${NC}"
fi
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 && ! lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 端口 3000 和 3001 可用${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   準備啟動開發伺服器...${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${GREEN}📱 應用將在以下地址啟動:${NC}"
echo -e "   - 首頁: ${CYAN}http://localhost:3000${NC}"
echo -e "   - 餐廳評分系統: ${CYAN}http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止伺服器${NC}"
echo ""

# 啟動開發伺服器
pnpm dev

