# 🚀 GitHub Actions 自动打包指南

## ✅ 问题已修复

已将 GitHub Actions 更新到 v4 版本，现在可以正常使用了！

---

## 🎯 如何触发自动构建

### 方式1：创建 Release Tag（推荐）

```bash
# 1. 确保所有改动已提交
git add .
git commit -m "准备发布 v1.0.0"
git push

# 2. 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0

# 3. GitHub Actions 会自动开始构建
# 访问你的仓库 → Actions 标签查看进度
```

### 方式2：手动触发

1. 访问你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 在左侧选择 **Build & Release**
4. 点击右上角 **Run workflow** 按钮
5. 选择分支（通常是 main）
6. 点击绿色的 **Run workflow** 按钮

---

## 📊 构建进度

### 查看状态

1. 访问仓库的 **Actions** 标签
2. 会看到两个并行的任务：
   - 🍎 **macos-latest** - 构建 macOS 版本
   - 🪟 **windows-latest** - 构建 Windows 版本

### 预计时间

- macOS 构建：约 5-8 分钟
- Windows 构建：约 5-8 分钟
- **总时间**：约 **8-10 分钟**（并行执行）

### 构建步骤

每个平台会经过这些步骤：

1. ✅ Checkout code (检出代码)
2. ✅ Setup Node.js (设置 Node.js 环境)
3. ✅ Install dependencies (安装依赖，最耗时)
4. ✅ Build application (打包应用)
5. ✅ Upload artifacts (上传构建产物)
6. ✅ Create Release (创建发布，仅 tag 触发时)

---

## 📥 下载构建结果

### 方式1：从 Release 下载（Tag 触发时）

```
访问：https://github.com/你的用户名/focus/releases/latest

会看到：
- 智能防久坐-1.0.0-arm64.dmg
- 智能防久坐-1.0.0-x64.dmg
- 智能防久坐-1.0.0-arm64.zip
- 智能防久坐-1.0.0-x64.zip
- 智能防久坐 Setup 1.0.0.exe
- 智能防久坐 1.0.0.exe
```

### 方式2：从 Artifacts 下载（手动触发时）

1. 进入 Actions 标签
2. 点击完成的 workflow
3. 在页面底部 **Artifacts** 部分
4. 下载：
   - mac-build.zip
   - win-build.zip
5. 解压后获取安装包

---

## 🎉 第一次使用完整流程

### 步骤详解：

```bash
# === 在你的 Mac 上 ===

# 1. 确保代码已推送到 GitHub
git status
git add .
git commit -m "智能防久坐应用 v1.0.0"
git push origin main

# 2. 创建版本 tag
git tag v1.0.0
git push origin v1.0.0

# === 在 GitHub 上 ===

# 3. 访问 https://github.com/你的用户名/focus/actions
#    会看到 "Build & Release" 自动开始运行

# 4. 等待 8-10 分钟（可以去喝杯咖啡 ☕）

# 5. 构建完成后，访问 Release 页面
#    https://github.com/你的用户名/focus/releases

# 6. 下载所有平台的安装包
```

---

## 📱 分享给用户

### Release 页面会自动生成下载链接

```
智能防久坐应用下载

📥 macOS 用户：
M1/M2/M3 芯片：智能防久坐-1.0.0-arm64.dmg
Intel 芯片：智能防久坐-1.0.0-x64.dmg

📥 Windows 用户：
安装版（推荐）：智能防久坐 Setup 1.0.0.exe
便携版：智能防久坐 1.0.0.exe

下载地址：
https://github.com/你的用户名/focus/releases/latest
```

---

## 🔧 常见问题

### Q1: Actions 显示失败？

**查看日志**：
1. 点击失败的 workflow
2. 点击失败的 job（macos-latest 或 windows-latest）
3. 展开失败的步骤，查看错误信息

**常见原因**：
- 依赖安装失败 → 网络问题，重试即可
- 原生模块编译失败 → 检查 package.json 配置
- 上传失败 → GitHub 限额问题

### Q2: 构建很慢？

**正常情况**：
- 首次构建：8-10 分钟（需要下载 Electron 等）
- 后续构建：5-8 分钟（有缓存）

**加速方法**：
- 使用 cache action（已在某些模板中）
- 减小依赖包大小

### Q3: Release 里没有文件？

**原因**：
- 只有通过 tag 触发时才会创建 Release
- 手动触发（workflow_dispatch）只会生成 Artifacts

**解决**：
```bash
# 创建 tag 触发
git tag v1.0.0
git push origin v1.0.0
```

### Q4: 文件名不对？

**检查 package.json**：
```json
{
  "name": "smart-anti-sedentary",
  "version": "1.0.0",
  "build": {
    "productName": "智能防久坐"
  }
}
```

### Q5: Windows 构建失败？

**可能原因**：
- 原生模块在 Windows 上编译失败
- 缺少构建工具

**GitHub Actions 环境已包含**：
- Python
- Visual Studio Build Tools
- 所以通常不会失败

**如果还是失败**：
查看具体错误日志，可能需要调整配置

---

## 📋 更新版本流程

### 发布新版本：

```bash
# 1. 更新版本号
编辑 package.json:
  "version": "1.0.1"

# 2. 提交改动
git add package.json
git commit -m "chore: 发布 v1.0.1"
git push

# 3. 创建新 tag
git tag v1.0.1
git push origin v1.0.1

# 4. 自动构建和发布
# GitHub Actions 会自动创建新的 Release
```

---

## 🎯 已更新的内容

✅ **actions/checkout@v4** (从 v3 升级)
✅ **actions/setup-node@v4** (从 v3 升级)
✅ **actions/upload-artifact@v4** (从 v3 升级)
✅ **softprops/action-gh-release@v2** (从 v1 升级)

---

## 🔍 验证配置

查看当前配置：
```bash
cat .github/workflows/build.yml
```

应该看到：
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/upload-artifact@v4
- uses: softprops/action-gh-release@v2
```

---

## 💡 最佳实践

### 1. 使用语义化版本
```
v1.0.0 - 首次发布
v1.0.1 - Bug 修复
v1.1.0 - 新功能
v2.0.0 - 重大更新
```

### 2. 编写 Release Notes
创建 tag 时添加说明：
```bash
git tag -a v1.0.0 -m "
v1.0.0 首次发布

新功能：
- 智能三态识别
- 可配置参数
- 跨平台支持

Bug 修复：
- 无

已知问题：
- 无
"
git push origin v1.0.0
```

### 3. 测试后再发布
```bash
# 先手动触发测试
# 确认构建成功后
# 再创建 tag 正式发布
```

---

## 📊 GitHub Actions 配额

### 免费额度（Public 仓库）

- ✅ **无限制**使用
- ✅ 并发任务：20 个
- ✅ 存储：500 MB Artifacts

### 免费额度（Private 仓库）

- ⏱️ 每月 2000 分钟
- 💾 存储：500 MB

### 你的使用预估

- 每次构建：约 10 分钟
- 每月可构建：200 次（Private 仓库）
- 公开仓库：无限制 ✅

---

## 🎉 开始使用

现在你可以：

```bash
# 1. 创建第一个 release
git tag v1.0.0
git push origin v1.0.0

# 2. 访问 Actions 页面
https://github.com/你的用户名/focus/actions

# 3. 等待构建完成

# 4. 访问 Release 页面下载
https://github.com/你的用户名/focus/releases

# 5. 分享下载链接给用户
```

**祝你使用顺利！** 🚀
