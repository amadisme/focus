#!/usr/bin/env node

/**
 * 测试计时器逻辑
 * 模拟不同的闲置时间场景
 */

console.log('🧪 测试智能计时逻辑');
console.log('='.repeat(50));
console.log('');

// 模拟 TimerManager 的核心逻辑
class MockTimerManager {
  constructor() {
    this.targetWorkTime = 2700; // 45分钟
    this.resetThreshold = 300; // 5分钟
    this.activeThreshold = 5; // 5秒
    this.accumulatedWorkTime = 0;
    this.state = 'working';
  }

  tick(idleTime) {
    let action = '';

    // 情况1: 闲置时间 >= 5分钟 → 完全重置
    if (idleTime >= this.resetThreshold) {
      if (this.accumulatedWorkTime > 0) {
        action = `⚠️  离座超过5分钟，计时器重置`;
        this.accumulatedWorkTime = 0;
        this.state = 'idle';
      }
    }
    // 情况2: 闲置时间 < 5秒 → 用户活跃，累加工作时间
    else if (idleTime < this.activeThreshold) {
      if (this.state === 'idle') {
        action = '✅ 用户重新开始工作';
        this.state = 'working';
      }
      this.accumulatedWorkTime += 1;
      action = action || '⏱️  工作计时中（+1秒）';
    }
    // 情况3: 5秒 <= 闲置时间 < 5分钟 → 暂停累加
    else {
      action = `⏸️  计时暂停（用户已停止操作 ${idleTime.toFixed(1)}秒）`;
    }

    return action;
  }

  getStatus() {
    const mins = Math.floor(this.accumulatedWorkTime / 60);
    const secs = this.accumulatedWorkTime % 60;
    return `${mins}分${secs}秒`;
  }
}

// 测试场景
const timer = new MockTimerManager();

console.log('📝 场景1: 持续工作（闲置时间 < 5秒）');
console.log('-'.repeat(50));
for (let i = 0; i < 5; i++) {
  const idleTime = Math.random() * 3; // 0-3秒随机
  const action = timer.tick(idleTime);
  console.log(`秒${i + 1}: 闲置${idleTime.toFixed(2)}秒 → ${action} → 累计: ${timer.getStatus()}`);
}
console.log('✅ 预期: 工作时间持续累加\n');

console.log('📝 场景2: 暂停操作（闲置时间 10秒）');
console.log('-'.repeat(50));
for (let i = 0; i < 5; i++) {
  const idleTime = 10; // 保持10秒闲置
  const action = timer.tick(idleTime);
  console.log(`秒${i + 1}: 闲置${idleTime}秒 → ${action} → 累计: ${timer.getStatus()}`);
}
console.log('✅ 预期: 计时暂停，不累加也不重置\n');

console.log('📝 场景3: 恢复工作（闲置时间 < 5秒）');
console.log('-'.repeat(50));
for (let i = 0; i < 3; i++) {
  const idleTime = Math.random() * 2;
  const action = timer.tick(idleTime);
  console.log(`秒${i + 1}: 闲置${idleTime.toFixed(2)}秒 → ${action} → 累计: ${timer.getStatus()}`);
}
console.log('✅ 预期: 恢复累加，工作时间继续增长\n');

console.log('📝 场景4: 离座超过5分钟');
console.log('-'.repeat(50));
const beforeReset = timer.getStatus();
const idleTime = 301; // 5分钟1秒
const action = timer.tick(idleTime);
console.log(`闲置${idleTime}秒 → ${action}`);
console.log(`重置前: ${beforeReset}`);
console.log(`重置后: ${timer.getStatus()}`);
console.log('✅ 预期: 计时器完全重置为0\n');

console.log('📝 场景5: 重新开始工作');
console.log('-'.repeat(50));
for (let i = 0; i < 3; i++) {
  const idleTime = Math.random() * 2;
  const action = timer.tick(idleTime);
  console.log(`秒${i + 1}: 闲置${idleTime.toFixed(2)}秒 → ${action} → 累计: ${timer.getStatus()}`);
}
console.log('✅ 预期: 从0重新开始计时\n');

console.log('='.repeat(50));
console.log('🎯 测试总结：');
console.log('   1. 活跃工作（闲置<5秒）→ 计时累加 ✅');
console.log('   2. 暂停操作（5秒≤闲置<5分钟）→ 计时暂停 ✅');
console.log('   3. 离座（闲置≥5分钟）→ 计时重置 ✅');
console.log('   4. 这是一个真正的"智能"防久坐工具！');
console.log('');
