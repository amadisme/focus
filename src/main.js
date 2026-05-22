const { app, BrowserWindow, Tray, Menu, nativeImage, Notification, ipcMain } = require('electron');
const path = require('path');
const desktopIdle = require('desktop-idle');
const TimerManager = require('./timer-manager');
const ConfigManager = require('./config-manager');

let mainWindow;
let settingsWindow;
let tray;
let timerManager;
let configManager;
let config;

// 配置将在启动时从文件加载
let TARGET_WORK_TIME;
let RESET_THRESHOLD;
let REMIND_PHASE_2_TIME;
let ACTIVE_THRESHOLD;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,  // 从200增加到280，确保所有内容可见
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/renderer/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 420,
    height: 550,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('src/renderer/settings.html');

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');

  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);

  updateTrayMenu();

  tray.setToolTip('Smart Anti-Sedentary App');

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    } else {
      createWindow();
    }
  });
}

function updateTrayMenu(workTime = 0, state = 'working') {
  const minutes = Math.floor(workTime / 60);
  const seconds = workTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `工作时间: ${timeStr}`,
      enabled: false
    },
    {
      label: `状态: ${state === 'working' ? '专注中' : state === 'idle' ? '休息中' : '提醒中'}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: '重置计时器',
      click: () => {
        if (timerManager) {
          timerManager.reset();
        }
      }
    },
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: '⚙️ 设置',
      click: () => {
        createSettingsWindow();
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function sendNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      silent: false
    });
    notification.show();
  }
}

function onTimerUpdate(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('timer-update', data);
  }

  updateTrayMenu(data.workTime, data.state);

  if (data.shouldNotify) {
    if (data.phase === 1) {
      sendNotification(
        '⏰ 该休息啦！',
        `您已连续专注工作 ${Math.floor(data.workTime / 60)} 分钟，建议稍作休息。`
      );
    } else if (data.phase === 2) {
      sendNotification(
        '🚨 强烈建议休息！',
        `您已连续工作 ${Math.floor(data.workTime / 60)} 分钟，长时间久坐对健康不利，请务必休息！`
      );
    }
  }
}

app.whenReady().then(() => {
  // 初始化配置管理器
  configManager = new ConfigManager();
  config = configManager.load();

  // 从配置加载参数
  TARGET_WORK_TIME = config.targetWorkTime * 60;       // 转换为秒
  RESET_THRESHOLD = config.resetThreshold * 60;        // 转换为秒
  REMIND_PHASE_2_TIME = config.remindPhase2Time * 60;  // 转换为秒
  ACTIVE_THRESHOLD = config.activeThreshold;           // 已经是秒

  console.log('配置已加载:', {
    targetWorkTime: `${config.targetWorkTime}分钟`,
    resetThreshold: `${config.resetThreshold}分钟`,
    remindPhase2Time: `${config.remindPhase2Time}分钟`,
    activeThreshold: `${config.activeThreshold}秒`
  });

  createWindow();
  createTray();

  timerManager = new TimerManager({
    targetWorkTime: TARGET_WORK_TIME,
    resetThreshold: RESET_THRESHOLD,
    remindPhase2Time: REMIND_PHASE_2_TIME,
    activeThreshold: ACTIVE_THRESHOLD,
    getIdleTime: () => desktopIdle.getIdleTime(),
    onUpdate: onTimerUpdate
  });

  timerManager.start();

  // IPC 事件处理
  ipcMain.on('reset-timer', () => {
    if (timerManager) {
      timerManager.reset();
    }
  });

  // 打开设置窗口
  ipcMain.on('open-settings', () => {
    createSettingsWindow();
  });

  // 加载设置
  ipcMain.on('load-settings', (event) => {
    event.reply('settings-loaded', config);
  });

  // 保存设置
  ipcMain.on('save-settings', (event, settings) => {
    const success = configManager.save(settings);
    event.reply('settings-saved', success);
    if (success) {
      // 更新内存中的配置
      config = configManager.load();
    }
  });

  // 重置设置
  ipcMain.on('reset-settings', (event) => {
    const defaults = configManager.getDefaults();
    event.reply('settings-reset', defaults);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  if (timerManager) {
    timerManager.stop();
  }
});
