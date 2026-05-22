#!/bin/bash

# 智能防久坐应用 - Windows 打包文件创建脚本

echo "🎯 开始创建 Windows 打包文件..."
echo ""

# 创建临时目录
TEMP_DIR="focus-for-windows"
OUTPUT_FILE="focus-for-windows.zip"

# 清理旧文件
if [ -d "$TEMP_DIR" ]; then
    echo "🗑️  清理旧文件..."
    rm -rf "$TEMP_DIR"
fi

if [ -f "$OUTPUT_FILE" ]; then
    rm -f "$OUTPUT_FILE"
fi

# 创建新目录
echo "📁 创建目录结构..."
mkdir -p "$TEMP_DIR"

# 复制必需文件
echo "📋 复制必需文件..."

# 1. 复制 src 目录
echo "   - 复制 src/ 目录"
cp -r src "$TEMP_DIR/"

# 2. 复制 package.json
echo "   - 复制 package.json"
cp package.json "$TEMP_DIR/"

# 3. 复制 package-lock.json
echo "   - 复制 package-lock.json"
cp package-lock.json "$TEMP_DIR/"

# 4. 创建 README 说明文件
echo "   - 创建打包说明"
cat > "$TEMP_DIR/README.txt" << 'EOF'
智能防久坐应用 - Windows 打包说明
=====================================

【环境要求】
- Windows 10 或 Windows 11
- Node.js 16.x 或更高版本
  下载地址: https://nodejs.org (选择 LTS 版本)

【打包步骤】
1. 确保已安装 Node.js
   在命令提示符中输入: node --version
   应该显示版本号，如: v18.0.0

2. 打开命令提示符（Win+R，输入 cmd，回车）

3. 进入此目录
   cd C:\path\to\focus-for-windows

4. 安装依赖（首次需要，约2-3分钟）
   npm install

5. 打包应用（约3-5分钟）
   npm run build:win

6. 获取安装包
   打包完成后，在 dist 文件夹中找到：
   - 智能防久坐 Setup 1.0.0.exe (安装版，推荐)
   - 智能防久坐 1.0.0.exe (便携版)

【常见问题】

Q: npm install 失败？
A: 1. 检查网络连接
   2. 尝试使用国内镜像：
      npm config set registry https://registry.npmmirror.com
      npm install

Q: 打包失败？
A: 1. 删除 node_modules 文件夹
   2. 删除 package-lock.json
   3. 重新运行 npm install

Q: 需要管理员权限吗？
A: 不需要，普通用户权限即可

【打包后】
将 dist 文件夹中的 EXE 文件分享给其他用户即可
文件大小约 150-200 MB（这是正常的 Electron 应用大小）

【联系方式】
如有问题，请联系项目作者

版本: 1.0.0
日期: 2026-05-22
=====================================
EOF

# 统计文件大小
echo ""
echo "📊 文件大小统计:"
du -sh "$TEMP_DIR"

# 压缩
echo ""
echo "🗜️  压缩文件..."
zip -r "$OUTPUT_FILE" "$TEMP_DIR" > /dev/null

# 清理临时目录
echo "🧹 清理临时文件..."
rm -rf "$TEMP_DIR"

# 完成
echo ""
echo "✅ 完成！"
echo ""
echo "📦 生成的文件: $OUTPUT_FILE"
ls -lh "$OUTPUT_FILE"
echo ""
echo "📤 现在可以将 $OUTPUT_FILE 发送给 Windows 用户了！"
echo ""
echo "📋 Windows 用户操作步骤:"
echo "   1. 解压 $OUTPUT_FILE"
echo "   2. 打开命令提示符"
echo "   3. cd 到解压目录"
echo "   4. npm install"
echo "   5. npm run build:win"
echo "   6. 在 dist 文件夹获取安装包"
echo ""
