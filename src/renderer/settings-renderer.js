const { ipcRenderer } = require('electron');

const inputs = {
  targetWorkTime: document.getElementById('targetWorkTime'),
  resetThreshold: document.getElementById('resetThreshold'),
  remindPhase2Time: document.getElementById('remindPhase2Time'),
  activeThreshold: document.getElementById('activeThreshold')
};

const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

// 加载当前配置
function loadSettings() {
  ipcRenderer.send('load-settings');
}

// 接收配置数据
ipcRenderer.on('settings-loaded', (event, settings) => {
  inputs.targetWorkTime.value = settings.targetWorkTime;
  inputs.resetThreshold.value = settings.resetThreshold;
  inputs.remindPhase2Time.value = settings.remindPhase2Time;
  inputs.activeThreshold.value = settings.activeThreshold;
});

// 保存设置
saveBtn.addEventListener('click', () => {
  const settings = {
    targetWorkTime: parseInt(inputs.targetWorkTime.value),
    resetThreshold: parseInt(inputs.resetThreshold.value),
    remindPhase2Time: parseInt(inputs.remindPhase2Time.value),
    activeThreshold: parseInt(inputs.activeThreshold.value)
  };

  // 验证
  if (settings.remindPhase2Time <= settings.targetWorkTime) {
    alert('强提醒时间必须大于目标工作时间！');
    return;
  }

  ipcRenderer.send('save-settings', settings);
});

// 接收保存结果
ipcRenderer.on('settings-saved', (event, success) => {
  if (success) {
    alert('设置已保存！\n\n请重启应用使设置生效。');
  } else {
    alert('保存失败，请重试。');
  }
});

// 恢复默认
resetBtn.addEventListener('click', () => {
  if (confirm('确定要恢复默认设置吗？')) {
    ipcRenderer.send('reset-settings');
  }
});

// 接收重置结果
ipcRenderer.on('settings-reset', (event, defaults) => {
  inputs.targetWorkTime.value = defaults.targetWorkTime;
  inputs.resetThreshold.value = defaults.resetThreshold;
  inputs.remindPhase2Time.value = defaults.remindPhase2Time;
  inputs.activeThreshold.value = defaults.activeThreshold;

  alert('已恢复默认设置！\n\n请点击"保存设置"并重启应用。');
});

// 页面加载时加载设置
window.addEventListener('DOMContentLoaded', loadSettings);
