const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ConfigManager {
  constructor() {
    this.configDir = path.join(app.getPath('userData'), 'config');
    this.configFile = path.join(this.configDir, 'settings.json');
    this.defaults = {
      targetWorkTime: 45,        // 分钟
      resetThreshold: 10,        // 分钟
      remindPhase2Time: 50,      // 分钟
      activeThreshold: 5         // 秒
    };
  }

  // 确保配置目录存在
  ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  // 加载配置
  load() {
    try {
      this.ensureConfigDir();

      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        const config = JSON.parse(data);

        // 合并默认配置，确保所有字段都存在
        return { ...this.defaults, ...config };
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }

    // 返回默认配置
    return { ...this.defaults };
  }

  // 保存配置
  save(config) {
    try {
      this.ensureConfigDir();

      // 验证配置
      const validatedConfig = this.validate(config);

      fs.writeFileSync(
        this.configFile,
        JSON.stringify(validatedConfig, null, 2),
        'utf8'
      );

      console.log('配置已保存:', validatedConfig);
      return true;
    } catch (error) {
      console.error('保存配置失败:', error);
      return false;
    }
  }

  // 验证配置
  validate(config) {
    const validated = {};

    // 目标工作时间：1-120 分钟
    validated.targetWorkTime = Math.min(
      Math.max(parseInt(config.targetWorkTime) || this.defaults.targetWorkTime, 1),
      120
    );

    // 重置阈值：1-60 分钟
    validated.resetThreshold = Math.min(
      Math.max(parseInt(config.resetThreshold) || this.defaults.resetThreshold, 1),
      60
    );

    // 强提醒时间：1-120 分钟
    validated.remindPhase2Time = Math.min(
      Math.max(parseInt(config.remindPhase2Time) || this.defaults.remindPhase2Time, 1),
      120
    );

    // 活跃阈值：1-30 秒
    validated.activeThreshold = Math.min(
      Math.max(parseInt(config.activeThreshold) || this.defaults.activeThreshold, 1),
      30
    );

    return validated;
  }

  // 重置为默认配置
  reset() {
    return this.save(this.defaults);
  }

  // 获取默认配置
  getDefaults() {
    return { ...this.defaults };
  }
}

module.exports = ConfigManager;
