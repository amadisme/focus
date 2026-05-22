# 🪟 如何获取 Windows 版本

## 当前情况

✅ **macOS 版本已打包**（在 `dist` 文件夹）
❌ **Windows 版本还未打包**（因为原生模块无法在 macOS 上跨平台编译）

---

## 解决方案

### 方案1：在 Windows 电脑上打包（推荐）⭐

#### 准备工作：

**1. 分享项目文件给 Windows 用户**

需要分享的文件：
```
整个 focus 文件夹（压缩后）
或
上传到 GitHub/Gitee
```

**2. Windows 电脑上的操作**

```bash
# Step 1: 安装 Node.js（如果还没有）
# 访问 https://nodejs.org
# 下载并安装 LTS 版本（推荐 18.x 或 20.x）

# Step 2: 打开命令提示符或 PowerShell
# 进入项目目录
cd C:\path\to\focus

# Step 3: 安装依赖
npm install

# Step 4: 打包 Windows 版本
npm run build:win
```

**3. 打包结果**

在 `dist` 文件夹会生成：
```
智能防久坐 Setup 1.0.0.exe  (~150MB)  ← 安装版（推荐）
智能防久坐 1.0.0.exe         (~150MB)  ← 便携版
```

---

### 方案2：使用 GitHub Actions 自动构建（最佳）⭐⭐⭐

这是最方便的方法，完全自动化！

#### 步骤：

**1. 上传到 GitHub**

```bash
# 在你的 Mac 上执行
cd /Users/tengyibo/focus

# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "智能防久坐应用 v1.0.0"

# 创建 GitHub 仓库
# 访问 https://github.com/new
# 创建一个新仓库，比如叫 smart-anti-sedentary

# 关联远程仓库
git remote add origin https://github.com/你的用户名/smart-anti-sedentary.git

# 推送
git push -u origin main
```

**2. 创建 Release 触发自动构建**

```bash
# 创建一个 tag
git tag v1.0.0

# 推送 tag
git push origin v1.0.0
```

**3. GitHub Actions 会自动**
- ✅ 在 macOS 虚拟机上打包 Mac 版本
- ✅ 在 Windows 虚拟机上打包 Windows 版本
- ✅ 自动上传到 Release 页面

**4. 等待构建完成（约5-10分钟）**
- 访问你的仓库
- 点击 "Actions" 标签查看进度
- 完成后在 "Releases" 页面下载

**5. 下载链接**
```
https://github.com/你的用户名/smart-anti-sedentary/releases/latest
```

---

### 方案3：找有 Windows 电脑的朋友帮忙

#### 你需要做的：
1. 压缩整个 `focus` 文件夹
2. 发给有 Windows 11 电脑的朋友
3. 让他按照方案1的步骤操作

#### 朋友需要做的：
```bash
1. 安装 Node.js
2. 解压文件夹
3. 打开命令提示符
4. cd 到项目目录
5. npm install
6. npm run build:win
7. 将 dist 文件夹中的 EXE 文件发回给你
```

---

## Windows 用户如何使用

### 文件说明

**安装版**（推荐）：
- 文件名：`智能防久坐 Setup 1.0.0.exe`
- 特点：有安装向导，创建快捷方式，卸载方便

**便携版**：
- 文件名：`智能防久坐 1.0.0.exe`
- 特点：无需安装，双击即用

### 安装步骤

#### 使用安装版：

1. **下载安装包**
   - 下载 `智能防久坐 Setup 1.0.0.exe`

2. **运行安装程序**
   - 双击 EXE 文件

3. **处理安全警告**
   - 看到 "Windows 已保护你的电脑"
   - 点击 "更多信息"
   - 点击 "仍要运行"

4. **完成安装**
   - 选择安装位置
   - 勾选创建快捷方式
   - 点击安装

5. **启动使用**
   - 从桌面快捷方式启动
   - 应用出现在系统托盘（右下角）

#### 使用便携版：

1. 下载 `智能防久坐 1.0.0.exe`
2. 放到任意文件夹
3. 双击运行（处理安全警告）
4. 开始使用

---

## 快速对比

| 方案 | 优点 | 缺点 | 推荐度 |
|-----|------|------|--------|
| 在 Windows 上打包 | 简单直接 | 需要 Windows 电脑 | ⭐⭐⭐⭐ |
| GitHub Actions | 自动化，支持所有平台 | 需要 GitHub 账号 | ⭐⭐⭐⭐⭐ |
| 找朋友帮忙 | 不需要自己的 Windows 电脑 | 依赖他人 | ⭐⭐⭐ |

---

## 推荐流程

### 如果你有 GitHub 账号：

```
1. 上传项目到 GitHub
2. 创建 tag (v1.0.0)
3. 等待自动构建（5-10分钟）
4. 下载所有平台的安装包
5. 分享给用户
```

### 如果你没有 GitHub 账号：

```
1. 找一个有 Windows 11 的朋友
2. 发送项目压缩包
3. 让他按照说明打包
4. 获取 EXE 文件
5. 分享给其他 Windows 用户
```

---

## 分享给 Windows 用户

### 需要分享的文件：
```
智能防久坐 Setup 1.0.0.exe    ← 安装版
WINDOWS安装指南.md            ← 使用说明
```

### 分享方式：
- 💾 网盘（百度网盘、阿里云盘）
- 💬 聊天工具（微信、QQ、钉钉）
- 🔗 GitHub Release
- 📧 邮件

### 给用户的说明：
```
智能防久坐应用 - Windows 版

下载: [链接]
文件: 智能防久坐 Setup 1.0.0.exe (约150MB)

安装:
1. 双击 EXE 文件
2. 看到安全警告，点"更多信息" → "仍要运行"
3. 完成安装
4. 打开应用，在系统托盘（右下角）找到

详细说明: 见 WINDOWS安装指南.md
```

---

## 常见问题

### Q: 为什么不能在 Mac 上打包 Windows 版本？
**A**: 因为 `desktop-idle` 是原生模块（C++ 代码），需要在目标平台上编译。

### Q: GitHub Actions 免费吗？
**A**: 
- 公开仓库：完全免费 ✅
- 私有仓库：每月 2000 分钟免费额度

### Q: 打包需要多长时间？
**A**: 
- 在 Windows 上打包：3-5 分钟
- GitHub Actions：5-10 分钟（包括下载依赖）

### Q: 可以打包成免安装版吗？
**A**: 可以！便携版就是免安装的：
```bash
npm run build:win
# 会生成两个版本：安装版 + 便携版
```

---

## 技术细节

### 为什么跨平台编译失败？

`desktop-idle` 是原生 Node.js 模块：
- 包含平台特定的 C++ 代码
- Windows: 使用 Win32 API
- macOS: 使用 Core Graphics
- 需要在目标平台上编译

### 如何避免这个问题？

未来可以考虑：
1. 使用纯 JavaScript 的替代方案
2. 预编译所有平台的二进制文件
3. 使用 Electron 的 native modules prebuilt

---

**选择你喜欢的方案，开始打包吧！** 🚀
