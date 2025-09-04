/**
 * YourFirstDBAPP - 主入口文件
 * 负责应用初始化、模块协调和全局状态管理
 */

// 导入模块
import { utils } from './modules/utils.js';
import { Customer } from './classes/Customer.js';
import { UIManager } from './modules/uiManager.js';
import { DatabaseManager } from './modules/dbManager.js';
import { EventHandler } from './modules/eventHandler.js';

class App {
  constructor() {
    // 模块实例
    this.uiManager = null;
    this.dbManager = null;
    this.eventHandler = null;
    
    // 应用状态
    this.isInitialized = false;
    this.appName = 'YourFirstDBAPP';
    this.version = '1.0.0';
  }

  async initialize() {
    try {
      console.log(`${this.appName} v${this.version} 初始化开始...`);
      
      // 1. 初始化 UI 管理器
      this.uiManager = new UIManager();
      console.log('UI 管理器初始化完成');
      
      // 2. 初始化数据库管理器
      this.dbManager = new DatabaseManager();
      this.dbManager.uiManager = this.uiManager; // 设置 UI 反馈
      await this.dbManager.connect(); // 建立数据库连接
      console.log('数据库管理器初始化完成');
      
      // 3. 初始化事件处理器
      this.eventHandler = new EventHandler(this.uiManager, this.dbManager);
      console.log('事件处理器初始化完成');
      
      // 4. 设置事件监听器
      this.setupEventListeners();
      
      // 5. 设置全局错误处理
      this.setupGlobalErrorHandling();
      
      // 6. 设置初始按钮状态
      this.uiManager.updateButtonStates('initial');
      
      // 7. 初始化完成
      this.isInitialized = true;
      this.uiManager.updateNotification('应用初始化完成，准备就绪！', 'success');
      this.uiManager.addLogEntry(`${this.appName} v${this.version} 启动完成`, 'success');
      
      console.log('应用初始化完成');
      
    } catch (error) {
      this.handleGlobalError(error, '应用初始化');
      throw error; // 重新抛出错误，让调用者知道初始化失败
    }
  }

  setupEventListeners() {
    try {
      console.log('设置事件监听器...');
      
      // 委托给事件处理器设置所有事件监听器
      if (this.eventHandler) {
        this.eventHandler.setupEventListeners();
        console.log('事件监听器设置完成');
      } else {
        throw new Error('事件处理器未初始化');
      }
      
    } catch (error) {
      this.handleGlobalError(error, '设置事件监听器');
    }
  }

  /**
   * 设置全局错误处理
   * 捕获未处理的错误和 Promise 拒绝
   */
  setupGlobalErrorHandling() {
    // 捕获未处理的 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, '全局错误');
    });

    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason, '未处理的 Promise 拒绝');
    });
  }

  /**
   * 全局错误处理方法
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   */
  handleGlobalError(error, context = '') {
    console.error(`全局错误 [${context}]:`, error);
    
    // 如果 UI 管理器已初始化，显示错误信息
    if (this.uiManager) {
      this.uiManager.updateNotification(`发生错误: ${error.message}`, 'error');
      this.uiManager.addLogEntry(`错误 [${context}]: ${error.message}`, 'error');
    }
  }
}

// 应用启动逻辑
// async/await 语法说明：
// - async: 声明函数为异步函数，返回 Promise
// - await: 等待异步操作完成，只能在 async 函数内使用
// - 相比 Promise.then()，async/await 让异步代码看起来像同步代码
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOM 加载完成，开始启动应用...');
    
    // 创建应用实例
    const app = new App();
    
    // await 语法说明：
    // 1. await 用于等待异步操作完成
    // 2. 只能在 async 函数内部使用
    // 3. 会暂停函数执行，直到 Promise 解决
    // 4. 这里等待 app.initialize() 完成后再继续执行
    await app.initialize();
    
    // 将应用实例挂载到全局，便于调试
    window.app = app;
    console.log('应用启动完成，可通过 window.app 访问应用实例');
    
  } catch (error) {
    console.error('应用启动失败:', error);
    
    // 如果应用启动失败，显示错误信息
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.8); color: white; display: flex; 
                  align-items: center; justify-content: center; z-index: 9999;">
        <div style="text-align: center; padding: 20px;">
          <h2>应用启动失败</h2>
          <p>错误信息: ${error.message}</p>
          <p>请刷新页面重试</p>
        </div>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
});
