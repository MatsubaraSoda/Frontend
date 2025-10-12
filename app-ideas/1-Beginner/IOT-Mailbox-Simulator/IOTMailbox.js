// IOTMailbox 类
class IOTMailbox {
  constructor(signalInterval = 500, signalCallback) {
    this.signalInterval = signalInterval;
    this.signalCallback = signalCallback;
    this.intervalID = null;
    this.lastLightLevel = 0;
  }

  startMonitoring = () => {
    // console.log("开始监控邮箱。");
    this.intervalID = window.setInterval(
      this.signalStateChange,
      this.signalInterval
    );
  };

  stopMonitoring = () => {
    if (this.intervalID === null) {
      return;
    }
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    // console.log("已停止监控邮箱。");
  };

  signalStateChange = () => {
    const lightLevel = this.lastLightLevel >= 0 
    ? Math.random().toFixed(2) * -1 
    : Math.random().toFixed(2);
    // console.log(`蜗牛邮箱状态已更改 - 光照水平：${lightLevel}`);
    this.lastLightLevel = lightLevel;
    this.signalCallback(lightLevel);
  };

}
