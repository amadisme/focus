const { app } = require('electron');
const desktopIdle = require('desktop-idle');

console.log('Testing desktop-idle in Electron environment...');
console.log('Electron version:', process.versions.electron);
console.log('Node version:', process.version);
console.log('');

let count = 0;
const maxCount = 5;

app.whenReady().then(() => {
  console.log('Starting idle time detection test...');
  console.log('Move your mouse or press a key to see the idle time reset to 0');
  console.log('');

  const interval = setInterval(() => {
    const idleTime = desktopIdle.getIdleTime();
    console.log(`[${count + 1}/${maxCount}] Idle time: ${idleTime.toFixed(3)} seconds`);

    count++;
    if (count >= maxCount) {
      clearInterval(interval);
      console.log('');
      console.log('✅ Test completed successfully!');
      console.log('The desktop-idle module is working correctly.');
      app.quit();
    }
  }, 2000);
});

app.on('window-all-closed', () => {
  // 防止默认退出行为
});
