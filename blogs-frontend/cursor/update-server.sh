#!/bin/bash

# 服务器快速更新脚本
# 在服务器上运行此脚本来更新前端

set -e  # 遇到错误立即退出

echo "=========================================="
echo "前端更新脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误：请在 blogs-frontend 目录下运行此脚本${NC}"
    echo "请先执行: cd /www/wwwroot/gdblogs/blogs-frontend"
    exit 1
fi

PROJECT_DIR=$(pwd)
echo -e "${BLUE}当前目录: ${PROJECT_DIR}${NC}"
echo ""

# 1. 验证代码是否为中文版本
echo -e "${YELLOW}[1/7] 验证代码版本...${NC}"
if grep -q "你好，我是" "src/components/desktop/OrbitingIntroduction.tsx" 2>/dev/null; then
    echo -e "${GREEN}✓ 代码是中文版本（新版本）${NC}"
else
    echo -e "${RED}✗ 代码不是中文版本，请先上传最新代码！${NC}"
    exit 1
fi
echo ""

# 2. 停止服务
echo -e "${YELLOW}[2/7] 停止当前服务...${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "gdblogs-frontend"; then
        pm2 stop gdblogs-frontend
        echo -e "${GREEN}✓ 服务已停止${NC}"
    else
        echo -e "${YELLOW}⚠ PM2 中没有找到 gdblogs-frontend 进程${NC}"
    fi
else
    echo -e "${YELLOW}⚠ PM2 未安装，请手动停止服务${NC}"
fi
echo ""

# 3. 备份旧构建（可选）
echo -e "${YELLOW}[3/7] 备份旧构建...${NC}"
if [ -d ".next" ]; then
    BACKUP_NAME=".next.backup.$(date +%Y%m%d_%H%M%S)"
    cp -r .next "$BACKUP_NAME"
    echo -e "${GREEN}✓ 已备份到: ${BACKUP_NAME}${NC}"
else
    echo -e "${YELLOW}⚠ .next 目录不存在，跳过备份${NC}"
fi
echo ""

# 4. 安装依赖
echo -e "${YELLOW}[4/7] 检查并安装依赖...${NC}"
if [ -f "package-lock.json" ] || [ -f "yarn.lock" ]; then
    npm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
else
    echo -e "${YELLOW}⚠ 未找到 lock 文件，跳过 npm install${NC}"
fi
echo ""

# 5. 删除旧构建
echo -e "${YELLOW}[5/7] 删除旧构建...${NC}"
rm -rf .next
echo -e "${GREEN}✓ 旧构建已删除${NC}"
echo ""

# 6. 重新构建
echo -e "${YELLOW}[6/7] 重新构建项目（这可能需要几分钟）...${NC}"
npm run build

if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo -e "${GREEN}✓ 构建完成！构建ID: ${BUILD_ID}${NC}"
    
    # 验证构建结果是否包含中文
    if grep -r "你好，我是" .next/static/ 2>/dev/null | head -1 > /dev/null; then
        echo -e "${GREEN}✓ 构建产物包含中文内容${NC}"
    else
        echo -e "${YELLOW}⚠ 警告：构建产物中未找到中文内容，请检查${NC}"
    fi
else
    echo -e "${RED}✗ 构建失败！${NC}"
    exit 1
fi
echo ""

# 7. 重启服务
echo -e "${YELLOW}[7/7] 重启服务...${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "gdblogs-frontend"; then
        pm2 restart gdblogs-frontend
        echo -e "${GREEN}✓ 服务已重启${NC}"
    else
        pm2 start npm --name gdblogs-frontend -- start
        echo -e "${GREEN}✓ 服务已启动${NC}"
    fi
    
    echo ""
    echo "查看服务状态："
    pm2 list | grep gdblogs-frontend
    
    echo ""
    echo "查看最近日志："
    pm2 logs gdblogs-frontend --lines 10 --nostream
else
    echo -e "${YELLOW}⚠ PM2 未安装，请手动启动服务:${NC}"
    echo "   npm run start"
fi
echo ""

# 完成
echo "=========================================="
echo -e "${GREEN}更新完成！${NC}"
echo "=========================================="
echo ""
echo "验证步骤："
echo "1. 等待几秒让服务完全启动"
echo "2. 访问: http://localhost:3000"
echo "3. 检查页面是否显示 '你好，我是 木东'"
echo ""
echo "如果还是显示旧版本："
echo "- 清除浏览器缓存（Ctrl + Shift + Delete）"
echo "- 使用无痕模式访问"
echo "- 检查 PM2 日志: pm2 logs gdblogs-frontend"
echo ""
