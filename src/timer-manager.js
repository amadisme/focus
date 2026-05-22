class TimerManager {
  constructor(options) {
    this.targetWorkTime = options.targetWorkTime || 2700; // 45分钟
    this.resetThreshold = options.resetThreshold || 600; // 10分钟
    this.remindPhase2Time = options.remindPhase2Time || 3000; // 50分钟
    this.activeThreshold = options.activeThreshold || 5; // 5秒：判定为活跃的阈值
    this.getIdleTime = options.getIdleTime;
    this.onUpdate = options.onUpdate;

    this.accumulatedWorkTime = 0;
    this.state = 'working'; // working, idle, phase1, phase2
    this.intervalId = null;
    this.lastNotifyPhase = null;
  }

  start() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    console.log('Timer Manager started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Timer Manager stopped');
  }

  reset() {
    this.accumulatedWorkTime = 0;
    this.state = 'working';
    this.lastNotifyPhase = null;
    console.log('Timer reset to 0');
    this.notifyUpdate();
  }

  tick() {
    const idleTime = this.getIdleTime();

    // 情况1: 闲置时间 >= 10分钟 → 完全重置（真正离开工位）
    if (idleTime >= this.resetThreshold) {
      if (this.accumulatedWorkTime > 0) {
        console.log(`检测到用户离座/开会超过${this.resetThreshold}秒，专注计时器清零重置。`);
        this.reset();
        this.state = 'idle';
      }
    }
    // 情况2: 闲置时间 < 5秒 → 用户活跃，累加工作时间
    else if (idleTime < this.activeThreshold) {
      if (this.state === 'idle') {
        console.log('用户重新开始工作');
        this.state = 'working';
      }
      this.accumulatedWorkTime += 1;
    }
    // 情况3: 5秒 <= 闲置时间 < 10分钟 → 暂停累加（阅读、思考、短暂休息等）
    else {
      // 不累加，但也不重置
      // 保持当前状态
      console.log(`用户暂时停止操作（闲置 ${idleTime.toFixed(1)} 秒），计时暂停`);
    }

    this.updateState();
    this.notifyUpdate();
  }

  updateState() {
    let shouldNotify = false;
    let phase = null;

    if (this.accumulatedWorkTime >= this.remindPhase2Time) {
      if (this.state !== 'phase2') {
        this.state = 'phase2';
        phase = 2;
        if (this.lastNotifyPhase !== 2) {
          shouldNotify = true;
          this.lastNotifyPhase = 2;
        }
      }
    } else if (this.accumulatedWorkTime >= this.targetWorkTime) {
      if (this.state !== 'phase1') {
        this.state = 'phase1';
        phase = 1;
        if (this.lastNotifyPhase !== 1) {
          shouldNotify = true;
          this.lastNotifyPhase = 1;
        }
      }
    }

    return { shouldNotify, phase };
  }

  notifyUpdate() {
    const { shouldNotify, phase } = this.updateState();

    if (this.onUpdate) {
      this.onUpdate({
        workTime: this.accumulatedWorkTime,
        state: this.state,
        shouldNotify,
        phase,
        targetWorkTime: this.targetWorkTime,
        resetThreshold: this.resetThreshold
      });
    }
  }

  getStatus() {
    return {
      workTime: this.accumulatedWorkTime,
      state: this.state,
      targetWorkTime: this.targetWorkTime,
      resetThreshold: this.resetThreshold
    };
  }
}

module.exports = TimerManager;
