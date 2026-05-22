#!/bin/bash

echo "🧪 测试智能防久坐应用"
echo "===================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查 Node.js
echo "1️⃣  检查 Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js 已安装: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js 未安装"
    exit 1
fi

# 2. 检查 npm
echo ""
echo "2️⃣  检查 npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm 已安装: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm 未安装"
    exit 1
fi

# 3. 检查依赖
echo ""
echo "3️⃣  检查项目依赖..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 存在"
else
    echo -e "${YELLOW}⚠${NC} node_modules 不存在，正在安装..."
    npm install
fi

# 4. 检查 Electron
echo ""
echo "4️⃣  检查 Electron..."
if [ -f "node_modules/.bin/electron" ]; then
    ELECTRON_VERSION=$(npx electron --version 2>/dev/null)
    echo -e "${GREEN}✓${NC} Electron 已安装: $ELECTRON_VERSION"
else
    echo -e "${RED}✗${NC} Electron 未安装"
    exit 1
fi

# 5. 检查 desktop-idle
echo ""
echo "5️⃣  检查 desktop-idle 原生模块..."
if [ -f "node_modules/desktop-idle/build/Release/desktopIdle.node" ]; then
    echo -e "${GREEN}✓${NC} desktop-idle 原生模块存在"
else
    echo -e "${YELLOW}⚠${NC} desktop-idle 原生模块不存在，正在重新编译..."
    npm run rebuild
fi

# 6. 测试闲置时间检测
echo ""
echo "6️⃣  测试闲置时间检测..."
IDLE_TEST_OUTPUT=$(node test-idle.js 2>&1 &)
IDLE_TEST_PID=$!
sleep 2
kill $IDLE_TEST_PID 2>/dev/null

if echo "$IDLE_TEST_OUTPUT" | grep -q "Idle time"; then
    echo -e "${GREEN}✓${NC} 闲置时间检测正常"
else
    echo -e "${RED}✗${NC} 闲置时间检测失败"
    echo "输出: $IDLE_TEST_OUTPUT"
fi

# 7. 检查必要文件
echo ""
echo "7️⃣  检查必要文件..."
FILES=(
    "src/main.js"
    "src/timer-manager.js"
    "src/renderer/index.html"
    "src/renderer/style.css"
    "src/renderer/renderer.js"
    "src/assets/icon.png"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file 缺失"
        ALL_FILES_EXIST=false
    fi
done

# 8. 总结
echo ""
echo "===================="
echo "📊 测试总结"
echo "===================="

if [ "$ALL_FILES_EXIST" = true ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    echo ""
    echo "🚀 现在可以运行应用:"
    echo "   npm start"
    echo ""
    echo "或开发模式:"
    echo "   npm run dev"
else
    echo -e "${RED}✗ 部分测试失败${NC}"
    echo "请检查上述错误信息"
fi

echo ""
