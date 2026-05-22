#!/usr/bin/env node

/**
 * 测试新的10分钟重置逻辑
 */

console.log('🧪 测试10分钟重置逻辑');
console.log('='.repeat(60));
console.log('');

class TimerSimulator {
  constructor() {
    this.targetWorkTime = 2700; // 45分钟
    this.resetThreshold = 600; // 10分钟
    this.activeThreshold = 5; // 5秒
    this.accumulatedWorkTime = 0;
    this.state = 'working';
  }

  tick(idleTime) {
    let action = '';

    if (idleTime >= this.resetThreshold) {
      if (this.accumulatedWorkTime > 0) {
        action = `🔄 离座超过10分钟，计时器重置`;
        this.accumulatedWorkTime = 0;
        this.state = 'idle';
      }
    } else if (idleTime < this.activeThreshold) {
      if (this.state === 'idle') {
        action = '✅ 用户重新开始工作';
        this.state = 'working';
      }
      this.accumulatedWorkTime += 1;
      action = action || '⏱️  活跃工作中（+1秒）';
    } else {
      action = `⏸️  暂停（闲置 ${idleTime.toFixed(0)}秒）`;
    }

    return action;
  }

  getStatus() {
    const mins = Math.floor(this.accumulatedWorkTime / 60);
    const secs = this.accumulatedWorkTime % 60;
    return `${mins}分${secs}秒`;
  }
}

const timer = new TimerSimulator();

// 模拟一个完整的工作周期
console.log('📖 场景：完整的工作流程');
console.log('-'.repeat(60));
console.log('');

// 1. 工作30分钟
console.log('🟢 第1阶段：专注工作30分钟');
for (let i = 0; i < 1800; i++) {
  timer.tick(Math.random() * 3); // 闲置0-3秒
}
console.log(`   累计工作时间: ${timer.getStatus()}`);
console.log('   ✅ 预期：持续累加到30分钟\n');

// 2. 喝水5分钟（300秒）
console.log('🟡 第2阶段：离开工位喝水5分钟');
const beforeDrink = timer.getStatus();
for (let i = 0; i < 5; i++) {
  timer.tick(300); // 保持300秒闲置
}
console.log(`   离开前: ${beforeDrink}`);
console.log(`   回来后: ${timer.getStatus()}`);
console.log('   ✅ 预期：时间暂停，保持30分钟（未重置）\n');

// 3. 继续工作10分钟
console.log('🟢 第3阶段：继续工作10分钟');
for (let i = 0; i < 600; i++) {
  timer.tick(Math.random() * 3);
}
console.log(`   累计工作时间: ${timer.getStatus()}`);
console.log('   ✅ 预期：从30分钟继续累加到40分钟\n');

// 4. 开会15分钟（900秒，超过10分钟阈值）
console.log('🔴 第4阶段：离开工位开会15分钟（超过10分钟）');
const beforeMeeting = timer.getStatus();
timer.tick(900); // 闲置900秒
console.log(`   离开前: ${beforeMeeting}`);
console.log(`   回来后: ${timer.getStatus()}`);
console.log('   ✅ 预期：时间重置为0（已达到休息目的）\n');

// 5. 重新开始工作
console.log('🟢 第5阶段：开会回来，重新工作5分钟');
for (let i = 0; i < 300; i++) {
  timer.tick(Math.random() * 3);
}
console.log(`   累计工作时间: ${timer.getStatus()}`);
console.log('   ✅ 预期：从0重新开始计时到5分钟\n');

console.log('='.repeat(60));
console.log('📊 新逻辑的优势：');
console.log('');
console.log('   🎯 短暂休息（< 10分钟）');
console.log('      → 喝水、上厕所、接电话');
console.log('      → 计时暂停，回来继续');
console.log('      → 不会丢失工作成果');
console.log('');
console.log('   🎯 真正休息（≥ 10分钟）');
console.log('      → 开会、午休、外出');
console.log('      → 计时重置，已达到休息目的');
console.log('      → 回来重新开始计时');
console.log('');
console.log('   ✅ 既保留工作成果，又能识别真正的休息！');
console.log('');

// 详细对比
console.log('='.repeat(60));
console.log('📈 不同阈值的对比：');
console.log('');

const scenarios = [
  { time: 3, desc: '喝水、倒咖啡' },
  { time: 5, desc: '上厕所' },
  { time: 8, desc: '接电话、短暂讨论' },
  { time: 15, desc: '开会、午休' },
  { time: 30, desc: '长时间会议' }
];

console.log('离开时间  |  5分钟阈值  |  10分钟阈值（新）');
console.log('-'.repeat(60));

scenarios.forEach(({ time, desc }) => {
  const result5 = time >= 5 ? '重置❌' : '暂停⏸️';
  const result10 = time >= 10 ? '重置✅' : '暂停✅';
  const padding = ' '.repeat(Math.max(0, 8 - time.toString().length));
  console.log(`${time}分钟${padding} | ${result5.padEnd(10)} | ${result10.padEnd(10)} (${desc})`);
});

console.log('');
console.log('💡 结论：10分钟阈值更合理，既保留短暂休息的工作成果，');
console.log('          又能识别真正的长时间离开。');
console.log('');
