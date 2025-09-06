import { UIManager } from "./uiManager.js";
import { EventManager } from "./eventManager.js";

// App 类
class App {
  constructor() {
    this.uiManager = new UIManager();
    this.eventManager = new EventManager(this.uiManager);
  }

  init() {
    console.log("App 初始化");
    console.log("UIManager 和 EventManager 已创建并连接");
  }
}

// 页面加载完成
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
