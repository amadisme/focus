# 故障排除指南

## 常见问题和解决方案

### ❌ 问题1: 原生模块版本不匹配

**错误信息**:
```
Error: The module '/Users/.../desktop-idle/build/Release/desktopIdle.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 141. This version of Node.js requires
NODE_MODULE_VERSION 119.
```

**原因**: 
`desktop-idle` 是一个原生模块（包含C++代码），需要针对 Electron 的 Node.js 版本重新编译。

**解决方案**:
```bash
# 方案1: 自动重新编译（推荐）
npm install

# 方案2: 手动重新编译
npm run rebuild

# 方案3: 完全重新安装
rm -rf node_modules package-lock.json
npm install
```

**说明**: 
- 项目已配置了 `postinstall` 脚本，会在 `npm install` 后自动运行 `electron-rebuild`
- 如果还有问题，确保你安装了构建工具（见下方）

---

### ❌ 问题2: 缺少构建工具

**错误信息**:
```
gyp ERR! find Python
gyp ERR! stack Error: Could not find any Python installation to use
```

**原因**: 
原生模块需要 Python 和 C++ 编译器来构建。

**解决方案**:

#### macOS:
```bash
# 安装 Xcode Command Line Tools
xcode-select --install
```

#### Windows:
```bash
# 安装 Windows Build Tools
npm install --global windows-build-tools
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install build-essential python3
```

---

### ❌ 问题3: Electron 下载失败

**错误信息**:
```
RequestError: connect ETIMEDOUT
Error: Electron failed to install correctly
```

**解决方案**:

```bash
# 方案1: 使用国内镜像
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install

# 方案2: 手动下载
# 1. 从 GitHub 下载对应版本的 Electron
# 2. 放到缓存目录
# macOS: ~/Library/Caches/electron/
# Windows: %LOCALAPPDATA%/electron/Cache/
# Linux: ~/.cache/electron/

# 方案3: 跳过二进制安装，稍后手动安装
npm install --ignore-scripts
npx electron --version  # 这会触发下载
```

---

### ❌ 问题4: 应用启动后没有窗口显示

**可能原因**:
1. 窗口在屏幕外
2. macOS 权限问题
3. 图标路径错误导致托盘创建失败

**解决方案**:

```bash
# 1. 检查进程是否运行
ps aux | grep electron

# 2. 查看控制台输出
npm start  # 查看是否有错误信息

# 3. 强制显示窗口（修改 main.js）
# 在 createWindow() 中添加:
mainWindow.center();  # 居中显示
mainWindow.show();    # 强制显示
```

---

### ❌ 问题5: 闲置时间检测不工作

**症状**: 
- 闲置时间始终为 0
- 或闲置时间不准确

**解决方案**:

#### macOS:
```bash
# 需要授予"辅助功能"权限
# 1. 打开 "系统偏好设置"
# 2. 进入 "安全性与隐私"
# 3. 选择 "隐私" > "辅助功能"
# 4. 添加 Terminal（如果从终端运行）或 Electron 应用
```

#### Windows:
```bash
# 以管理员身份运行
# 右键点击 -> 以管理员身份运行
```

#### 测试闲置检测:
```bash
# ✅ 正确方式：在 Electron 环境中测试
npm test

# ❌ 错误方式：直接用 node 命令
# node test-idle.js  # 会失败！因为原生模块是为 Electron 编译的

# 观察输出，移动鼠标看闲置时间是否重置为接近0
```

---

### ❌ 问题6: 系统通知不显示

**可能原因**:
1. 系统通知权限未授予
2. "勿扰模式" 已开启
3. 通知中心设置

**解决方案**:

#### macOS:
```
1. 打开 "系统偏好设置" > "通知"
2. 找到你的应用或 Electron
3. 允许通知
4. 关闭"勿扰模式"
```

#### Windows:
```
1. 打开 "设置" > "系统" > "通知和操作"
2. 确保通知已开启
3. 找到应用并允许通知
```

#### 测试通知:
```javascript
// 在 renderer.js 中添加测试按钮
const { Notification } = require('electron');
new Notification({
  title: '测试通知',
  body: '如果你看到这个，通知功能正常！'
}).show();
```

---

### ❌ 问题7: 托盘图标不显示

**可能原因**:
1. 图标文件不存在
2. 图标路径错误
3. 图标格式/尺寸不对

**解决方案**:

```bash
# 1. 检查图标文件
ls -la src/assets/icon.png

# 2. 重新生成图标
cd src/assets && node create-icon.js

# 3. 使用绝对路径（修改 main.js）
const iconPath = path.join(__dirname, 'assets', 'icon.png');
console.log('Icon path:', iconPath);  # 调试用

# 4. 调整图标尺寸
# macOS 推荐: 16x16 或 32x32
# Windows 推荐: 16x16, 32x32, 或 48x48
```

---

### ❌ 问题8: 应用无法退出

**症状**: 
- 点击关闭按钮后，进程仍在运行
- Dock/任务栏图标不消失

**解决方案**:

```bash
# 1. 强制退出
# macOS:
pkill -f electron

# Windows:
taskkill /F /IM electron.exe

# Linux:
killall electron

# 2. 代码修复（main.js）
# 确保正确处理退出事件:
app.on('before-quit', () => {
  if (timerManager) {
    timerManager.stop();
  }
});

# 如果希望关闭所有窗口时退出（默认行为）:
app.on('window-all-closed', () => {
  app.quit();  // 移除 e.preventDefault()
});
```

---

### ❌ 问题9: 开发模式下热重载不工作

**解决方案**:

```bash
# 安装 electron-reload
npm install --save-dev electron-reload

# 在 main.js 开头添加（仅开发模式）
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: require('path').join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

# 启动开发模式
NODE_ENV=development npm start
```

---

### ❌ 问题10: 内存占用过高

**可能原因**:
1. 未清理的定时器
2. 内存泄漏
3. DevTools 未关闭

**解决方案**:

```bash
# 1. 生产模式运行（不开启 DevTools）
npm start

# 2. 检查定时器清理
# 在 timer-manager.js 的 stop() 方法中确保:
stop() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

# 3. 使用 Chrome DevTools 分析内存
# 开启 DevTools -> Memory -> Take Heap Snapshot
```

---

## 调试技巧

### 1. 查看详细日志

```javascript
// 在 main.js 中添加
app.on('ready', () => {
  console.log('App version:', app.getVersion());
  console.log('Electron version:', process.versions.electron);
  console.log('Chrome version:', process.versions.chrome);
  console.log('Node version:', process.version);
});
```

### 2. 启用详细输出

```bash
# macOS/Linux
DEBUG=* npm start

# Windows
set DEBUG=* && npm start
```

### 3. 检查进程状态

```bash
# macOS/Linux
ps aux | grep electron

# Windows
tasklist | findstr electron
```

### 4. 清理缓存

```bash
# macOS
rm -rf ~/Library/Application\ Support/smart-anti-sedentary

# Windows
del /s /q %APPDATA%\smart-anti-sedentary

# Linux
rm -rf ~/.config/smart-anti-sedentary
```

---

## 性能优化建议

### 1. 减少轮询频率

如果 CPU 占用高，可以降低轮询频率：

```javascript
// timer-manager.js
setInterval(() => {
  this.tick();
}, 2000);  // 从 1000ms 改为 2000ms
```

### 2. 禁用动画

如果 GPU 占用高，可以禁用 CSS 动画：

```css
/* style.css */
* {
  animation: none !important;
  transition: none !important;
}
```

### 3. 使用 asar 打包

打包时可以减小体积：

```json
// package.json
{
  "build": {
    "asar": true
  }
}
```

---

## 获取帮助

如果以上方案都无法解决问题：

1. **查看日志**: 检查控制台输出的错误信息
2. **搜索相似问题**: 在 GitHub Issues 搜索类似错误
3. **提供详细信息**:
   - 操作系统版本
   - Node.js 版本 (`node --version`)
   - Electron 版本 (`npx electron --version`)
   - 完整错误信息
   - 重现步骤

---

## 环境信息检查

运行以下命令检查环境：

```bash
echo "=== 环境信息 ==="
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "Electron: $(npx electron --version 2>/dev/null || echo 'Not installed')"
echo "Platform: $(uname -s)"
echo "Arch: $(uname -m)"
echo ""
echo "=== Python (用于构建原生模块) ==="
python3 --version 2>/dev/null || python --version 2>/dev/null || echo "Python not found"
echo ""
echo "=== 构建工具 ==="
which gcc g++ make 2>/dev/null || echo "Build tools may not be installed"
```

保存为 `check-env.sh` 并运行：
```bash
chmod +x check-env.sh
./check-env.sh
```
