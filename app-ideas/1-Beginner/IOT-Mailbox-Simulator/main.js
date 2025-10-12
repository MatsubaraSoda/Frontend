// main.js 使用原生 JavaScript 处理其他事务

// 全局变量
let mailbox = null;
let isMonitoring = false;

// DOM 元素
const startBtn = document.getElementById("startMonitoring");
const stopBtn = document.getElementById("stopMonitoring");
const resetBtn = document.getElementById("resetLog");
const intervalInput = document.getElementById("monitoringInterval");

// 初始化
document.addEventListener("DOMContentLoaded", function () {
  // console.log("IOT 邮箱模拟器已加载");

  // 绑定事件监听器
  startBtn.addEventListener("click", () => {
    mailbox = new IOTMailbox(intervalInput.value, signalCheck);
    mailbox.startMonitoring();
    isMonitoring = true;

    // 调用Vue方法添加日志和更新通知
    vueApp.addLog("开始监控邮箱。");
    vueApp.updateNotification("监控已启动");
  });

  // 绑定停止按钮事件
  stopBtn.addEventListener("click", () => {
    mailbox.stopMonitoring();
    isMonitoring = false;

    // 调用Vue方法添加日志和更新通知
    vueApp.addLog("停止监控邮箱。");
    vueApp.updateNotification("监控已停止");
  });
  resetBtn.addEventListener("click", () => {
    // 调用Vue方法重置日志和更新通知
    vueApp.resetLog();
    vueApp.updateNotification("日志已重置");
  });
});

// 信号检查
function signalCheck(lightLevel) {
  // console.log(`光照水平：${lightLevel}`);

  // 调用Vue方法添加日志
  vueApp.addLog(`光照水平：${lightLevel} - ${lightLevel > 0 ? '门已打开' : '门已关闭'}`);
  
  // 更新通知面板显示门的开启/关闭状态
  if (lightLevel > 0) {
    vueApp.updateNotification("📬 蜗牛邮箱门已开启 ☀️");
  } else {
    vueApp.updateNotification("📪 蜗牛邮箱门已关闭 🌙");
  }
}
