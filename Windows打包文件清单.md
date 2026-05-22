# 📦 给 Windows 用户的文件清单

## ✅ 必需文件（只需要这些）

### 核心文件
```
focus-for-windows/
├── src/                          ← 源代码目录（必需）
│   ├── main.js
│   ├── timer-manager.js
│   ├── config-manager.js
│   ├── assets/
│   │   ├── icon.png
│   │   └── create-icon.js
│   ├── renderer/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── renderer.js
│   │   ├── settings.html
│   │   ├── settings-style.css
│   │   └── settings-renderer.js
│   └── test-idle-electron.js
├── package.json                  ← 项目配置（必需）
└── package-lock.json             ← 依赖锁定（必需）
```

**总大小**：约 1-2 MB（不包含 node_modules）

---

## ❌ 不需要的文件（不要发送）

```
❌ dist/                         (macOS 打包文件，100+ MB)
❌ node_modules/                 (依赖包，70+ MB，会重新安装)
❌ .git/                         (git 历史记录)
❌ .github/                      (GitHub Actions 配置)
❌ .claude/                      (Claude 配置)
❌ .DS_Store                     (macOS 系统文件)

❌ 所有文档文件（除非需要）:
   - README.md
   - QUICKSTART.md
   - CONFIG_GUIDE.md
   - DEVELOPER_GUIDE.md
   - TROUBLESHOOTING.md
   - USER_GUIDE.md
   - DISTRIBUTION.md
   - 等等所有 .md 文件

❌ 测试文件:
   - test-idle.js
   - test-logic.js
   - test-10min-reset.js
   - test-app.sh
   - 等等

❌ 其他配置文件:
   - .gitignore
   - focus.md（原始需求文档）
```

---

## 🎯 推荐：只发这 3 个文件

实际上，只需要发送这 3 个文件/文件夹：

```
打包必需的：
1. src/                    ← 完整的 src 目录
2. package.json           ← 项目配置
3. package-lock.json      ← 依赖锁定（可选但推荐）
```

---

## 📁 创建压缩包

### 方式1：手动创建

1. 创建新文件夹 `focus-for-windows`
2. 复制以下内容进去：
   - `src/` 文件夹（完整）
   - `package.json`
   - `package-lock.json`
3. 压缩成 `focus-for-windows.zip`
4. 发送给 Windows 用户

### 方式2：使用命令（推荐）

我已经为你创建了自动化脚本（见下方）

---

## 📋 Windows 用户收到后的操作

```bash
# 1. 解压文件
解压 focus-for-windows.zip

# 2. 打开命令提示符或 PowerShell
cd focus-for-windows

# 3. 安装依赖
npm install

# 4. 打包
npm run build:win

# 5. 获取安装包
在 dist 文件夹中找到：
- 智能防久坐 Setup 1.0.0.exe
```

---

## 📊 文件大小对比

| 内容 | 大小 | 是否需要 |
|-----|------|---------|
| src/ | 约 1 MB | ✅ 必需 |
| package.json | 2 KB | ✅ 必需 |
| package-lock.json | 30 KB | ✅ 推荐 |
| **以上合计** | **约 1-2 MB** | - |
| | | |
| node_modules/ | 70 MB | ❌ 不要 |
| dist/ | 200+ MB | ❌ 不要 |
| 文档 .md 文件 | 1 MB | ❌ 不要 |
| 测试文件 | 100 KB | ❌ 不要 |

**结论**：只需要发送约 **1-2 MB** 的文件！

---

## ✉️ 给 Windows 用户的说明

随压缩包附上这个说明：

```txt
智能防久坐应用 - Windows 打包说明

【环境要求】
- Windows 10/11
- Node.js 16+ (从 https://nodejs.org 下载)

【打包步骤】
1. 解压此文件到任意位置
2. 打开命令提示符（Win+R，输入 cmd）
3. cd 到解压目录
4. 运行：npm install
5. 运行：npm run build:win
6. 等待 3-5 分钟
7. 在 dist 文件夹找到 EXE 安装包

【遇到问题】
- 确保已安装 Node.js
- 确保网络连接正常（需要下载依赖）
- 如果失败，删除 node_modules 文件夹后重试

【联系方式】
有问题联系：[你的联系方式]
```

---

## 🚀 快速开始

使用我创建的自动化脚本（见下一个文件）：

```bash
chmod +x create-windows-package.sh
./create-windows-package.sh
```

会自动生成 `focus-for-windows.zip`，直接发送即可！
