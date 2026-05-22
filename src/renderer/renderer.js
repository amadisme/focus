const { ipcRenderer } = require('electron');

const timeEl = document.getElementById('time');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const targetEl = document.getElementById('target');
const resetBtn = document.getElementById('resetBtn');
const settingsBtn = document.getElementById('settingsBtn');

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getStatusText(state) {
  switch (state) {
    case 'working':
      return '专注中...';
    case 'idle':
      return '休息中';
    case 'phase1':
      return '⏰ 该休息啦！';
    case 'phase2':
      return '🚨 强烈建议休息！';
    default:
      return '专注中...';
  }
}

function updateUI(data) {
  timeEl.textContent = formatTime(data.workTime);

  statusEl.textContent = getStatusText(data.state);
  statusEl.className = 'status';

  if (data.state === 'phase1') {
    statusEl.classList.add('warning');
  } else if (data.state === 'phase2') {
    statusEl.classList.add('danger');
  }

  const progress = Math.min((data.workTime / data.targetWorkTime) * 100, 100);
  progressEl.style.width = `${progress}%`;

  if (progress >= 100) {
    progressEl.style.background = 'linear-gradient(90deg, #FF6B6B, #EE5A6F)';
  } else {
    progressEl.style.background = 'linear-gradient(90deg, #56CCF2, #2F80ED)';
  }

  targetEl.textContent = `${Math.floor(data.targetWorkTime / 60)}分钟`;
}

ipcRenderer.on('timer-update', (event, data) => {
  updateUI(data);
});

resetBtn.addEventListener('click', () => {
  ipcRenderer.send('reset-timer');
});

settingsBtn.addEventListener('click', () => {
  ipcRenderer.send('open-settings');
});

// 接收打开设置窗口的请求
ipcRenderer.on('open-settings', () => {
  // 主进程会处理创建设置窗口
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Renderer process loaded');
});
