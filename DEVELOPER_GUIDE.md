# 开发者指南

## 架构概览

### 技术架构
```
┌─────────────────────────────────────────┐
│           Electron App                  │
├─────────────────────────────────────────┤
│  Main Process (src/main.js)            │
│  ├─ Window Management                  │
│  ├─ Tray Management                    │
│  ├─ Notification System                │
│  └─ IPC Handler                        │
├─────────────────────────────────────────┤
│  Timer Manager (src/timer-manager.js)  │
│  ├─ State Machine                      │
│  ├─ Idle Detection                     │
│  └─ Work Time Calculation              │
├─────────────────────────────────────────┤
│  Renderer Process (src/renderer/)      │
│  ├─ UI Rendering (index.html)          │
│  ├─ Style (style.css)                  │
│  └─ Event Handling (renderer.js)       │
├─────────────────────────────────────────┤
│  System APIs                            │
│  └─ desktop-idle (Native Module)       │
│     ├─ Windows: GetLastInputInfo       │
│     ├─ macOS: CGEventSource...         │
│     └─ Linux: XScreenSaver              │
└─────────────────────────────────────────┘
```

## 核心模块详解

### 1. TimerManager (src/timer-manager.js)

**职责**：管理工作时间计时和状态

**核心方法**：
```javascript
start()              // 启动计时器（每秒tick）
stop()               // 停止计时器
reset()              // 重置计时器
tick()               // 每秒执行的逻辑
updateState()        // 更新状态机
notifyUpdate()       // 通知状态变化
getStatus()          // 获取当前状态
```

**状态机**：
```
States:
- working: 正常工作中
- idle: 用户离座/休息中
- phase1: 达到目标时间（45分钟）
- phase2: 强提醒阈值（50分钟）

Transitions:
working -> idle (idle_time >= RESET_THRESHOLD)
idle -> working (idle_time < RESET_THRESHOLD)
working -> phase1 (accumulated_time >= TARGET_WORK_TIME)
phase1 -> phase2 (accumulated_time >= REMIND_PHASE_2_TIME)
```

**关键逻辑**：
```javascript
// 每秒执行
tick() {
  const idleTime = this.getIdleTime();
  
  // 检查是否需要重置
  if (idleTime >= this.resetThreshold) {
    if (this.accumulatedWorkTime > 0) {
      this.reset();
      this.state = 'idle';
    }
  } else {
    // 累加工作时间
    if (this.state === 'idle') {
      this.state = 'working';
    }
    this.accumulatedWorkTime += 1;
  }
  
  this.updateState();
  this.notifyUpdate();
}
```

### 2. Main Process (src/main.js)

**职责**：应用主进程，管理窗口、托盘和系统集成

**关键函数**：
```javascript
createWindow()       // 创建主窗口
createTray()         // 创建系统托盘
updateTrayMenu()     // 更新托盘菜单
sendNotification()   // 发送系统通知
onTimerUpdate()      // 处理计时器更新
```

**IPC 通信**：
```javascript
// 主进程 -> 渲染进程
mainWindow.webContents.send('timer-update', data);

// 渲染进程 -> 主进程
ipcMain.on('reset-timer', () => {
  timerManager.reset();
});
```

### 3. Renderer Process (src/renderer/)

**职责**：UI渲染和用户交互

**核心功能**：
```javascript
formatTime(seconds)     // 格式化时间显示
getStatusText(state)    // 获取状态文本
updateUI(data)          // 更新UI
```

**事件监听**：
```javascript
// 监听主进程的更新
ipcRenderer.on('timer-update', (event, data) => {
  updateUI(data);
});

// 发送重置事件
resetBtn.addEventListener('click', () => {
  ipcRenderer.send('reset-timer');
});
```

## 数据流

```
System Idle API
      ↓
desktop-idle.getIdleTime()
      ↓
TimerManager.tick()
      ↓
TimerManager.updateState()
      ↓
onTimerUpdate(data)
      ↓
├─→ updateTrayMenu(data)
├─→ sendNotification(data)
└─→ mainWindow.send('timer-update', data)
        ↓
    Renderer: updateUI(data)
```

## 配置参数

### 时间配置（秒）
```javascript
TARGET_WORK_TIME = 45 * 60;       // 2700秒 = 45分钟
RESET_THRESHOLD = 5 * 60;         // 300秒 = 5分钟
REMIND_PHASE_2_TIME = 50 * 60;    // 3000秒 = 50分钟
```

### 轮询间隔
```javascript
setInterval(() => {
  this.tick();
}, 1000);  // 每1秒检查一次
```

## 开发环境设置

### 必需工具
- Node.js 16.x 或更高
- npm 或 yarn
- Git（可选）

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
这会启动应用并开启 Chrome DevTools 调试端口（5858）

### 调试技巧

#### 主进程调试
1. 启动 `npm run dev`
2. 打开 Chrome，访问 `chrome://inspect`
3. 点击 "Configure" 添加 `localhost:5858`
4. 选择目标进程进行调试

#### 渲染进程调试
1. 启动应用
2. 主窗口会自动打开 DevTools（开发模式）
3. 或在代码中添加 `mainWindow.webContents.openDevTools()`

#### 日志输出
```javascript
// 主进程日志
console.log('Main process:', data);

// 渲染进程日志
console.log('Renderer process:', data);
```

## 测试

### 测试闲置时间检测
```bash
node test-idle.js
```
移动鼠标观察闲置时间重置

### 手动测试场景

#### 场景1：正常工作流程
1. 启动应用
2. 开始工作（移动鼠标/打字）
3. 观察时间累加
4. 离开电脑5分钟以上
5. 验证计时器是否重置

#### 场景2：提醒功能
1. 修改 `TARGET_WORK_TIME = 10` (10秒测试)
2. 启动应用
3. 工作10秒
4. 验证是否收到通知

#### 场景3：UI更新
1. 启动应用
2. 观察进度条是否平滑更新
3. 点击重置按钮
4. 验证是否立即重置

## 常见问题

### Q1: desktop-idle 在某些平台不工作
**A**: 
- macOS: 需要在"系统偏好设置 > 安全性与隐私 > 辅助功能"中授权
- Windows: 可能需要管理员权限
- Linux: 确保安装了 X11 相关库

### Q2: 通知不显示
**A**: 
- 检查系统通知权限
- 确认 `Notification.isSupported()` 返回 true
- 某些系统需要用户手动授权通知

### Q3: 托盘图标不显示
**A**: 
- 检查图标文件路径是否正确
- 确认图标尺寸（推荐16x16或32x32）
- macOS 可能需要重启 Finder

### Q4: 进程没有正确退出
**A**: 
```javascript
// 确保正确清理
app.on('before-quit', () => {
  if (timerManager) {
    timerManager.stop();
  }
});
```

## 代码规范

### 命名约定
- 文件名：kebab-case (`timer-manager.js`)
- 类名：PascalCase (`TimerManager`)
- 函数名：camelCase (`updateState`)
- 常量：UPPER_SNAKE_CASE (`TARGET_WORK_TIME`)

### 代码风格
- 缩进：2个空格
- 引号：单引号
- 分号：使用分号
- 注释：简洁明了

### Git提交信息
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具链更新
```

## 性能优化

### 1. 减少IPC通信
```javascript
// Bad: 每秒发送大量数据
mainWindow.send('timer-update', {
  workTime: data.workTime,
  state: data.state,
  history: data.history, // 不必要的大数据
});

// Good: 只发送必要数据
mainWindow.send('timer-update', {
  workTime: data.workTime,
  state: data.state
});
```

### 2. 节流/防抖
```javascript
// 避免频繁更新UI
let lastUpdateTime = 0;
function updateUI(data) {
  const now = Date.now();
  if (now - lastUpdateTime < 100) return; // 限制100ms
  lastUpdateTime = now;
  // 更新逻辑...
}
```

### 3. 资源清理
```javascript
// 停止计时器时清理
stop() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
```

## 扩展开发

### 添加新的配置选项
1. 在 `src/main.js` 添加常量
2. 在 `TimerManager` 构造函数接收参数
3. 在 UI 添加设置界面
4. 使用 electron-store 持久化配置

### 添加统计功能
1. 在 `TimerManager` 记录历史数据
2. 使用 localStorage 或文件系统存储
3. 创建统计图表界面
4. 导出数据功能

### 添加多语言支持
1. 使用 i18n 库（如 i18next）
2. 创建语言文件（en.json, zh-CN.json）
3. 在代码中使用翻译函数
4. UI 添加语言切换选项

## 相关资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [desktop-idle GitHub](https://github.com/bithavoc/node-desktop-idle)
- [Electron IPC 通信](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Electron Builder](https://www.electron.build/)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件
