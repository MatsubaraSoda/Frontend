// 创建Vue实例
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      // 数据属性将在这里定义
      ip: "",
      username: "",
      hello: "",
      message: "",
    };
  },
  mounted() {
    // 挂载后执行的逻辑
    console.log("页面加载完成！");
    this.getUserIP();
  },
  methods: {
    // 处理登录按钮点击
    async handleLogin() {
      console.log("登录按钮被点击");
      this.username = document.getElementById("userName").value;

      // 等待获取IP和问候语完成
      await this.getUserIP();
      await this.getHello();

      // 设置登录成功消息
      this.message = `${this.hello} ${this.username} 您已成功登录！`;
    },

    // 获取用户IP地址
    async getUserIP() {
      try {
        console.log("正在获取用户IP...");
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        this.ip = data.query;
        console.log("用户IP:", this.ip);
      } catch (error) {
        console.error("获取IP失败:", error);
      }
    },

    // 获取问候语
    async getHello() {
      try {
        console.log("正在获取问候语...");
        const response = await fetch(
          `https://hellosalut.stefanbohacek.com/?ip=${this.ip}`
        );
        const data = await response.json();
        // 解码HTML实体
        this.hello = data.hello.replace(/&#(\d+);/g, (match, dec) =>
          String.fromCharCode(dec)
        );
        console.log("问候语:", this.hello);
      } catch (error) {
        console.error("获取问候语失败:", error);
      }
    },

    // 处理退出按钮点击
    handleLogout() {
      this.message = `祝您有美好的一天 ${this.username}！`;
      this.username = "";
      this.hello = "";
      this.ip = "";

      // 清空输入框内容
      document.getElementById("userName").value = "";
      document.getElementById("userPassword").value = "";

      // 5秒后清空消息
      setTimeout(() => {
        this.message = "";
      }, 5000);
    },
  },
});

// 挂载到指定的div元素
app.mount(".login-panel");
