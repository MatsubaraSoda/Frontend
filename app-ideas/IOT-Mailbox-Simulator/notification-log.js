// notification-log.js 使用 vue 来处理 notification 和 log 的事务。

const notificationLog = Vue.createApp({
  data() {
    return {
      notification: {
        timestamp: "[系统]",
        message: "等待开始监控...",
      },
      logs: [
        {
          id: 1,
          timestamp: "[系统]",
          message: "IOT 邮箱模拟器已就绪",
        },
      ],
    };
  },
  methods: {
    // 更新通知
    updateNotification(message) {
      this.notification = {
        timestamp: `[${new Date().toLocaleTimeString()}]`,
        message: message,
      };
    },

    // 添加日志
    addLog(message) {
      const log = {
        id: Date.now(),
        timestamp: `[${new Date().toLocaleTimeString()}]`,
        message: message,
      };
      // 使用JavaScript数组的push方法添加新日志到数组末尾
      // push() 不是Vue语法，是JavaScript数组的原生方法
      // 作用：在数组末尾添加一个或多个元素，并返回新的数组长度
      this.logs.push(log);
      
      // 限制日志条数，超过100条时删除最开始的
      if (this.logs.length > 100) {
        // 使用JavaScript数组的shift方法删除数组第一个元素
        // shift() 不是Vue语法，是JavaScript数组的原生方法
        // 作用：删除并返回数组的第一个元素，数组长度减1
        // 这里用于保持日志数组最多100条记录，删除最旧的日志
        this.logs.shift();
      }
      
      // 自动滚动到最新消息
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    // 重置日志
    resetLog() {
      this.logs = [
        {
          id: 1,
          timestamp: "[系统]",
          message: "IOT 邮箱模拟器已就绪",
        },
      ];
    },
    
    // 滚动到日志面板底部
    // 功能：当添加新日志时，自动滚动到最新消息，确保用户能看到最新的日志内容
    scrollToBottom() {
      // 获取日志面板的DOM元素
      const logPanel = document.getElementById('logPanel');
      
      // 检查元素是否存在，避免错误
      if (logPanel) {
        // 设置滚动位置到最底部
        // scrollTop: 当前滚动位置
        // scrollHeight: 元素的总高度（包括被滚动隐藏的部分）
        // 将scrollTop设置为scrollHeight，就能滚动到最底部
        logPanel.scrollTop = logPanel.scrollHeight;
      }
    },
  },
});

const vueApp = notificationLog.mount("#notification-log");
