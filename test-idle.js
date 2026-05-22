const desktopIdle = require('desktop-idle');

console.log('Testing desktop-idle library...');
console.log('Current idle time:', desktopIdle.getIdleTime(), 'seconds');

setInterval(() => {
  const idleTime = desktopIdle.getIdleTime();
  console.log(`Idle time: ${idleTime} seconds`);
}, 2000);

console.log('Move your mouse or press a key to see the idle time reset to 0');
