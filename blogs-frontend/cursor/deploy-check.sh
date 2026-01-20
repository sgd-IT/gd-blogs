#!/bin/bash

# 前端部署检查脚本
# 用于确保代码正确更新到服务器

echo "=========================================="
echo "前端部署检查脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误：请在 blogs-frontend 目录下运行此脚本${NC}"
    exit 1
fi

echo "✓ 当前目录：$(pwd)"
echo ""

# 2. 检查关键文件是否存在
echo "检查关键文件..."
if [ -f "src/components/desktop/OrbitingIntroduction.tsx" ]; then
    if grep -q "你好，我是" "src/components/desktop/OrbitingIntroduction.tsx"; then
        echo -e "${GREEN}✓ 找到中文版本组件${NC}"
    else
        echo -e "${RED}✗ 组件内容不是中文版本${NC}"
    fi
else
    echo -e "${RED}✗ 找不到 OrbitingIntroduction.tsx${NC}"
fi
echo ""

# 3. 检查 .next 目录
echo "检查构建目录..."
if [ -d ".next" ]; then
    BUILD_TIME=$(stat -c %y .next 2>/dev/null || stat -f "%Sm" .next 2>/dev/null)
    echo "构建目录时间: $BUILD_TIME"
    
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo "构建ID: $BUILD_ID"
    fi
else
    echo -e "${YELLOW}⚠ .next 目录不存在，需要先运行 npm run build${NC}"
fi
echo ""

# 4. 检查 PM2 进程
echo "检查 PM2 进程..."
if command -v pm2 &> /dev/null; then
    PM2_STATUS=$(pm2 list | grep gdblogs-frontend || echo "")
    if [ -n "$PM2_STATUS" ]; then
        echo -e "${GREEN}✓ PM2 进程存在${NC}"
        echo "$PM2_STATUS"
        echo ""
        echo "查看最近日志："
        pm2 logs gdblogs-frontend --lines 10 --nostream
    else
        echo -e "${YELLOW}⚠ PM2 进程不存在${NC}"
    fi
else
    echo -e "${YELLOW}⚠ PM2 未安装${NC}"
fi
echo ""

# 5. 检查端口占用
echo "检查端口占用..."
if command -v netstat &> /dev/null; then
    PORT_3000=$(netstat -tuln | grep :3000 || echo "")
    if [ -n "$PORT_3000" ]; then
        echo -e "${GREEN}✓ 端口 3000 正在使用${NC}"
        echo "$PORT_3000"
    else
        echo -e "${YELLOW}⚠ 端口 3000 未被占用${NC}"
    fi
elif command -v ss &> /dev/null; then
    PORT_3000=$(ss -tuln | grep :3000 || echo "")
    if [ -n "$PORT_3000" ]; then
        echo -e "${GREEN}✓ 端口 3000 正在使用${NC}"
        echo "$PORT_3000"
    else
        echo -e "${YELLOW}⚠ 端口 3000 未被占用${NC}"
    fi
fi
echo ""

# 6. 提供部署建议
echo "=========================================="
echo "部署建议："
echo "=========================================="
echo ""
echo "如果服务器显示旧版本，请按以下步骤操作："
echo ""
echo "1. 停止服务："
echo "   pm2 stop gdblogs-frontend"
echo ""
echo "2. 确保代码是最新的："
echo "   git pull  # 如果使用 git"
echo "   或重新上传最新代码"
echo ""
echo "3. 安装依赖（如果有新依赖）："
echo "   npm install"
echo ""
echo "4. 重新构建（必须！）："
echo "   npm run build"
echo ""
echo "5. 重启服务："
echo "   pm2 restart gdblogs-frontend"
echo "   或"
echo "   pm2 start npm --name gdblogs-frontend -- start"
echo ""
echo "6. 检查服务状态："
echo "   pm2 logs gdblogs-frontend --lines 50"
echo ""
echo "7. 清除浏览器缓存后访问网站"
echo ""
