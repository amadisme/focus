# 智能防久坐提示应用 - 项目总结

## ✅ 已完成功能

### 1. 核心功能
- [x] 系统闲置时间检测（使用 desktop-idle 库）
- [x] 智能计时逻辑（累加工作时间、自动重置）
- [x] 两级提醒系统（45分钟温和提醒、50分钟强提醒）
- [x] 系统通知
- [x] 悬浮窗UI界面
- [x] 系统托盘集成

### 2. 用户界面
- [x] 现代化的渐变紫色主题
- [x] 实时显示工作时间（MM:SS格式）
- [x] 进度条显示
- [x] 状态指示（专注中/休息中/提醒）
- [x] 可拖动悬浮窗
- [x] 重置按钮

### 3. 系统托盘
- [x] 实时更新菜单显示工作时间
- [x] 显示当前状态
- [x] 重置计时器选项
- [x] 显示/隐藏主窗口
- [x] 退出应用

### 4. 技术实现
- [x] Electron 主进程和渲染进程
- [x] IPC 通信（主进程 ↔ 渲染进程）
- [x] 模块化代码结构
- [x] 状态机管理
- [x] 跨平台支持（Windows/macOS/Linux）

## 📁 项目结构

```
focus/
├── package.json                 # 项目配置和依赖
├── README.md                   # 项目说明
├── QUICKSTART.md               # 快速开始指南
├── .gitignore                  # Git忽略文件
├── test-idle.js                # 闲置时间测试脚本
└── src/
    ├── main.js                 # Electron 主进程
    ├── timer-manager.js        # 计时器管理模块
    ├── assets/
    │   ├── icon.png           # 应用图标
    │   └── create-icon.js     # 图标生成脚本
    └── renderer/
        ├── index.html         # 用户界面
        ├── style.css          # 样式文件
        └── renderer.js        # 渲染进程逻辑
```

## 🔧 配置参数

在 `src/main.js` 中可配置：

```javascript
const TARGET_WORK_TIME = 45 * 60;      // 45分钟
const RESET_THRESHOLD = 5 * 60;        // 5分钟
const REMIND_PHASE_2_TIME = 50 * 60;   // 50分钟
```

## 🚀 使用方法

### 安装依赖
```bash
npm install
```

### 测试闲置时间检测
```bash
node test-idle.js
```

### 启动应用
```bash
npm start
```

### 开发模式（带调试）
```bash
npm run dev
```

## 💡 核心算法

### 计时逻辑（伪代码）
```python
每秒执行一次：
  idle_time = 获取系统闲置时间()
  
  if idle_time >= 5分钟:
    if accumulated_work_time > 0:
      accumulated_work_time = 0  # 静默重置
      log("用户离座，计时器清零")
  else:
    accumulated_work_time += 1  # 累加工作时间
  
  # 更新状态和UI
  更新提醒状态()
  更新界面显示()
```

### 状态机
```
working (专注中) → idle (休息中) → working
                 ↓
              phase1 (45分钟，温和提醒)
                 ↓
              phase2 (50分钟，强提醒)
```

## 🎯 设计亮点

1. **不打断工作流**
   - 使用系统闲置时间API，不需要全局键鼠监听
   - 自动识别用户是否离座
   - 避免在刚回来时误报

2. **智能重置**
   - 离座超过5分钟自动清零
   - 无需手动操作
   - 符合真实工作场景

3. **友好的用户体验**
   - 简洁美观的界面
   - 实时反馈
   - 两级提醒（温和→强烈）
   - 系统托盘常驻

4. **跨平台**
   - 支持 Windows、macOS、Linux
   - 统一的用户体验

## 📊 技术栈

- **Electron 28**: 跨平台桌面应用框架
- **desktop-idle 1.3.0**: 系统闲置时间检测
- **Node.js**: 后端运行时
- **HTML5/CSS3**: 现代化UI
- **JavaScript ES6+**: 业务逻辑

## 🔐 隐私和安全

- ✅ 不记录键盘输入
- ✅ 不记录鼠标移动轨迹
- ✅ 仅读取系统闲置时间（系统公开API）
- ✅ 所有数据仅保存在内存中
- ✅ 无网络请求
- ✅ 无数据上传

## 🎨 UI 特性

- 渐变紫色主题（优雅现代）
- 透明背景和圆角边框
- 平滑的动画效果
- 响应式进度条
- 悬浮窗模式（alwaysOnTop）
- 可拖动（-webkit-app-region: drag）

## 🐛 已知限制

1. macOS 可能需要在"辅助功能"中授权
2. 某些远程桌面场景下闲置时间检测可能不准确
3. 虚拟机中运行可能需要特殊配置

## 🔮 未来可能的改进

- [ ] 设置界面（可视化配置参数）
- [ ] 统计报表（每日工作时长统计）
- [ ] 自定义提醒声音
- [ ] 多语言支持
- [ ] 伸展运动建议
- [ ] 护眼模式提醒
- [ ] 云同步（可选）

## 📝 开发笔记

### desktop-idle 库
- 跨平台支持良好
- API 简单：`desktopIdle.getIdleTime()` 返回秒数
- 精度约 0.001 秒
- Windows 使用 GetLastInputInfo
- macOS 使用 CGEventSourceSecondsSinceLastEventType

### Electron 架构
- 主进程（main.js）：系统集成、托盘、计时器
- 渲染进程（renderer.js）：UI更新、用户交互
- IPC 通信：timer-update 和 reset-timer 事件

### 状态管理
- TimerManager 类封装所有计时逻辑
- 单一责任原则：main.js 处理UI/系统，timer-manager.js 处理业务逻辑
- 回调模式：onUpdate 通知状态变化

## ✨ 总结

这是一个完整可用的智能防久坐提示应用，核心功能已全部实现。通过系统闲置时间API实现了真正的"智能"提醒，避免了传统定时器的误报问题。代码结构清晰，易于维护和扩展。

立即运行 `npm start` 开始使用！
