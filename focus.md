# 智能防久坐提示应用（Smart Anti-Sedentary App）—— 产品需求与架构设计文档 (PRD)

## 1. 项目概述
### 1.1 核心痛点
传统的防久坐产品多采用“固定时间定时器”（如每隔45分钟强制提醒）。这种机制没有感知用户的实际办公上下文，经常在用户刚开完会回到工位、或刚走动完时误报，严重打断工作流（破坏心流），导致用户反感并卸载。

### 1.2 核心解决方案
本应用通过调用操作系统开放的**系统闲置时间（System Idle Time）API**，在**不申请高危全局键鼠监听（Hook）权限**的前提下，精准识别用户的“实际高强度连续办公”状态与“离座/开会休息”状态。
* **判定逻辑**：只有当用户连续使用键鼠（期间无长时间闲置）满设定时间，才触发提示。
* **静默重置**：若中途检测到系统闲置时间超过设定阈值（如5分钟），说明用户已离座或处于非电脑办公状态，计时器自动静默清零。

### 1.3 技术栈要求
* **跨平台框架**：Electron (Node.js + Web技术) 
* **底层依赖**：使用开源社区成熟的跨平台闲置时间检测库（如 `node-desktop-idle` 或 `active-win` 中的 idle 检测部分），或通过原生模块分别调用：
  * **Windows**: Win32 API (`GetLastInputInfo`)
  * **macOS**: Core Graphics 框架 (`CGEventSourceSecondsSinceLastEventType`)
* **基本UI**：采用轻量级前端框架（如 HTML5/CSS3 或 React/Vue）构建现代、拟物或简约的悬浮窗/状态栏。

---

## 2. 核心业务逻辑与状态机

应用的核心状态由一个循环轮询（每1秒一次）的后台进程驱动。

### 2.1 配置参数
* `TARGET_WORK_TIME`（目标专注时长）：默认 45 分钟（2700 秒）。
* `RESET_THRESHOLD`（判定离座阈值）：默认 5 分钟（300 秒）。
* `REMIND_PHASE_2_TIME`（强提醒过渡时间）：默认 50 分钟（3000 秒）。

### 2.2 计时逻辑伪代码
```python
TARGET_WORK_TIME = 2700  # 45分钟
RESET_THRESHOLD = 300    # 5分钟
accumulated_work_time = 0

while True:
    idle_time = get_system_idle_time() # 获取当前系统闲置秒数
    
    if idle_time >= RESET_THRESHOLD:
        # 满足离座条件，计时器静默重置
        if accumulated_work_time > 0:
            accumulated_work_time = 0
            log("检测到用户离座/开会超过5分钟，专注计时器清零重置。")
    else:
        # 用户处于活跃办公状态，累计工作时间（扣除当前的微量闲置）
        # 注：为防止每秒累加1导致极微小误差，可以直接采用时间戳差值计算，此处用简易逻辑表达
        accumulated_work_time += 1
        
    # 触发提示状态机
    dispatch_reminder_state(accumulated_work_time)
    
    sleep(1)
