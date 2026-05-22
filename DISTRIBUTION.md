# 📦 应用分发指南

## 如何将应用分享给其他人

### 第一步：打包应用

#### 在 macOS 上打包

##### 1. 只打包 macOS 版本
```bash
npm run build:mac
```

这会生成：
- `dist/智能防久坐-1.0.0-x64.dmg` (Intel 芯片)
- `dist/智能防久坐-1.0.0-arm64.dmg` (Apple Silicon M1/M2/M3)
- `dist/智能防久坐-1.0.0-x64.zip`
- `dist/智能防久坐-1.0.0-arm64.zip`

##### 2. 打包 Windows 版本（需要在 macOS 上）
```bash
npm run build:win
```

这会生成：
- `dist/智能防久坐-1.0.0-x64.exe` (安装版)
- `dist/智能防久坐-1.0.0-x64.exe` (便携版)

##### 3. 同时打包两个平台
```bash
npm run build:all
```

#### 在 Windows 上打包

##### 1. 只打包 Windows 版本
```bash
npm run build:win
```

##### 2. 打包 macOS 版本（不推荐，可能会失败）
```bash
npm run build:mac
```

**注意**：在 Windows 上打包 macOS 应用可能会失败，建议使用 macOS 或 Linux 环境打包。

---

## 打包时间和文件大小

### 预期打包时间
- macOS DMG: 约 3-5 分钟
- Windows 安装包: 约 2-4 分钟
- 首次打包会更慢（需要下载依赖）

### 预期文件大小
- macOS DMG: 约 150-200 MB
- macOS ZIP: 约 150-200 MB
- Windows 安装版: 约 150-200 MB
- Windows 便携版: 约 150-200 MB

---

## 分发给用户

### 方案1：直接分享文件（小规模）

#### 需要分享的文件

**给 macOS 用户**：
- `智能防久坐-1.0.0-arm64.dmg` (M1/M2/M3 用户，推荐)
- `智能防久坐-1.0.0-x64.dmg` (Intel 用户)
- 或 ZIP 版本（两者都可以）
- `USER_GUIDE.md` (用户使用指南)

**给 Windows 用户**：
- `智能防久坐-1.0.0-x64.exe` (安装版，推荐)
- 或便携版
- `USER_GUIDE.md` (用户使用指南)

#### 分享方式
1. **网盘**：百度云、阿里云盘、OneDrive、Google Drive
2. **聊天工具**：微信、QQ（文件可能较大）
3. **U盘**：直接拷贝
4. **邮件**：可能因文件太大被拒

### 方案2：使用 GitHub Releases（推荐）

#### 步骤1：创建 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/smart-anti-sedentary.git
git push -u origin main
```

#### 步骤2：创建 Release
1. 在 GitHub 仓库页面，点击 "Releases"
2. 点击 "Create a new release"
3. 填写版本号：`v1.0.0`
4. 填写标题：`智能防久坐 v1.0.0`
5. 上传打包好的文件：
   - 所有 DMG 和 ZIP 文件
   - 所有 EXE 文件
   - USER_GUIDE.md
6. 发布 Release

#### 步骤3：分享下载链接
```
https://github.com/你的用户名/smart-anti-sedentary/releases/latest
```

### 方案3：使用其他平台

1. **Gitee（国内）**：类似 GitHub，速度更快
2. **蓝奏云**：免费，无限速
3. **123云盘**：免费，无限速
4. **自己的服务器**：上传到自己的网站

---

## 用户安装步骤

### macOS 用户

#### 使用 DMG（推荐）
1. 下载对应的 DMG 文件
   - M1/M2/M3 芯片 → `智能防久坐-1.0.0-arm64.dmg`
   - Intel 芯片 → `智能防久坐-1.0.0-x64.dmg`
2. 双击打开 DMG
3. 拖动应用到 Applications 文件夹
4. 在 Launchpad 中找到并打开

**首次打开**：
- 如果提示"无法打开"
- 右键点击应用 → 选择"打开" → 确认

#### 使用 ZIP
1. 下载对应的 ZIP 文件
2. 解压
3. 移动到 Applications 文件夹
4. 打开使用

### Windows 用户

#### 使用安装版（推荐）
1. 下载 `智能防久坐-1.0.0-x64.exe`（安装版）
2. 双击运行
3. 选择安装位置
4. 完成安装
5. 从开始菜单或桌面启动

**如果出现警告**：
- 点击"更多信息"
- 点击"仍要运行"

#### 使用便携版
1. 下载 `智能防久坐-1.0.0-x64.exe`（便携版）
2. 放到任意文件夹
3. 双击运行（无需安装）

---

## 文件清单

### 必须分发的文件

#### macOS
```
智能防久坐-1.0.0-arm64.dmg  (Apple Silicon)
智能防久坐-1.0.0-x64.dmg    (Intel)
USER_GUIDE.md               (使用指南)
```

#### Windows
```
智能防久坐-1.0.0-x64.exe    (安装版)
智能防久坐-1.0.0-x64.exe    (便携版，可选)
USER_GUIDE.md               (使用指南)
```

### 可选的文件
```
README.md                   (项目说明)
CONFIG_GUIDE.md             (配置指南)
TROUBLESHOOTING.md          (故障排除)
```

---

## 打包前的检查清单

### ✅ 代码检查
- [ ] 所有功能正常工作
- [ ] 没有明显的bug
- [ ] 配置文件正确加载和保存
- [ ] 通知功能正常
- [ ] 托盘菜单正常

### ✅ 资源检查
- [ ] 图标文件存在（src/assets/icon.png）
- [ ] 所有HTML/CSS/JS文件完整
- [ ] package.json 配置正确

### ✅ 文档检查
- [ ] USER_GUIDE.md 准备好
- [ ] 版本号已更新
- [ ] 更新日志已记录

### ✅ 测试
- [ ] 在 macOS 上测试过（如果打包 macOS 版）
- [ ] 在 Windows 上测试过（如果打包 Windows 版）
- [ ] 测试首次启动体验
- [ ] 测试设置功能
- [ ] 测试通知功能

---

## 版本更新

### 更新版本号

编辑 `package.json`：
```json
{
  "version": "1.0.1",  // 从 1.0.0 改为 1.0.1
  ...
}
```

### 版本号规则
- `1.0.0` → `1.0.1`：小bug修复
- `1.0.0` → `1.1.0`：新增功能
- `1.0.0` → `2.0.0`：重大更新

### 重新打包
```bash
npm run build:all
```

---

## 常见打包问题

### Q1: 打包失败，提示缺少依赖
**A**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Q2: 打包的应用无法启动
**A**: 
1. 检查 package.json 的 files 配置
2. 确保 src 目录下所有文件都包含
3. 检查原生模块是否正确重新编译

### Q3: Windows 打包在 macOS 上失败
**A**: 
- 安装 Wine（可选）
- 或使用 GitHub Actions 自动构建
- 或在 Windows 机器上打包

### Q4: 文件太大
**A**: 
- 这是 Electron 应用的正常大小
- 包含了整个 Chromium 引擎
- 可以使用 7z 压缩后分享

### Q5: macOS 提示应用已损坏
**A**: 
用户需要运行：
```bash
sudo xattr -cr /Applications/智能防久坐.app
```

---

## 自动化构建（进阶）

### 使用 GitHub Actions

创建 `.github/workflows/build.yml`：
```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm install
      - run: npm run build
      
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/*
```

推送 tag 后自动构建：
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 分发最佳实践

### 1. 提供清晰的下载指引
```
## 下载

### macOS 用户
- M1/M2/M3 芯片：[下载 ARM 版本](链接)
- Intel 芯片：[下载 Intel 版本](链接)

### Windows 用户
- [下载 Windows 安装版](链接)
```

### 2. 提供使用指南
- 附带 USER_GUIDE.md
- 或创建在线文档
- 或录制使用视频

### 3. 收集反馈
- 提供反馈渠道（邮箱/Issue）
- 记录常见问题
- 定期更新应用

### 4. 版本说明
```
## 版本历史

### v1.0.0 (2026-05-22)
- 首次发布
- 智能三态识别
- 可配置化参数
- macOS & Windows 支持
```

---

## 快速命令参考

```bash
# 安装依赖
npm install

# 开发测试
npm start

# 打包 macOS
npm run build:mac

# 打包 Windows
npm run build:win

# 打包所有平台
npm run build:all

# 查看打包结果
ls -lh dist/
```

---

**祝你分发顺利！** 🚀
