/**
 * eventHandler.js - 事件处理模块
 * 负责处理用户交互事件、按钮点击、UI 状态管理
 * 依赖：uiManager, dbManager
 * 被 main.js 调用
 */

import { UIManager } from './uiManager.js';
import { DatabaseManager } from './dbManager.js';

class EventHandler {
  constructor(uiManager, dbManager) {
    this.uiManager = uiManager;
    this.dbManager = dbManager;
    this.isProcessing = false; // 防止重复操作
  }

  /**
   * 设置所有事件监听器
   * 绑定按钮点击事件和UI交互事件
   */
  setupEventListeners() {
    // 加载数据库按钮事件
    if (this.uiManager.loadDbBtn) {
      this.uiManager.loadDbBtn.addEventListener('click', () => {
        this.handleLoadDatabase();
      });
    }

    // 查询数据库按钮事件
    if (this.uiManager.queryDbBtn) {
      this.uiManager.queryDbBtn.addEventListener('click', () => {
        this.handleQueryDatabase();
      });
    }

    // 清除数据库按钮事件
    if (this.uiManager.clearDbBtn) {
      this.uiManager.clearDbBtn.addEventListener('click', () => {
        this.handleClearDatabase();
      });
    }

    // 日志面板切换按钮事件
    if (this.uiManager.toggleLogBtn) {
      this.uiManager.toggleLogBtn.addEventListener('click', () => {
        this.handleToggleLogPanel();
      });
    }
  }

  /**
   * 处理加载数据库操作
   * 加载初始客户数据到 IndexedDB
   */
  async handleLoadDatabase() {
    // 防止重复操作
    if (this.isProcessing) {
      this.uiManager.updateNotification('操作进行中，请稍候...', 'warning');
      return;
    }

    try {
      this.isProcessing = true;
      
      // 更新按钮状态为加载中
      this.uiManager.updateButtonStates('loading');
      
      // 更新UI状态
      this.uiManager.updateNotification('正在加载数据库...', 'info');
      this.uiManager.addLogEntry('开始加载数据库操作', 'info');
      
      // 准备初始客户数据
      const customerData = [
        { userid: '444', name: 'Bill', email: 'bill@company.com', lastOrderDate: '2024-01-15', yearlySales: 15000 },
        { userid: '555', name: 'Donna', email: 'donna@home.org', lastOrderDate: '2024-05-20', yearlySales: 1000 }
      ];

      // 调用数据库管理器加载数据
      await this.dbManager.loadInitialData(customerData);
      
      // 操作成功
      this.uiManager.updateNotification('数据库加载成功！', 'success');
      this.uiManager.addLogEntry(`成功加载 ${customerData.length} 条客户记录`, 'success');
      
      // 更新按钮状态为查询状态（加载完成后可以查询和清除）
      this.uiManager.updateButtonStates('querying');
      
    } catch (error) {
      // 错误处理
      this.uiManager.updateNotification('数据库加载失败', 'error');
      this.uiManager.addLogEntry(`加载失败: ${error.message}`, 'error');
      console.error('加载数据库错误:', error);
    } finally {
      // 重置处理状态
      this.isProcessing = false;
    }
  }

  /**
   * 处理查询数据库操作
   * 查询所有客户数据并显示在结果区域
   */
  async handleQueryDatabase() {
    // 防止重复操作
    if (this.isProcessing) {
      this.uiManager.updateNotification('操作进行中，请稍候...', 'warning');
      return;
    }

    try {
      this.isProcessing = true;
      
      // 更新按钮状态为查询中
      this.uiManager.updateButtonStates('querying');
      
      // 更新UI状态
      this.uiManager.updateNotification('正在查询数据库...', 'info');
      this.uiManager.addLogEntry('开始查询数据库操作', 'info');
      
      // 调用数据库管理器查询数据
      const customers = await this.dbManager.queryAllCustomers();
      
      // 显示查询结果
      if (customers && customers.length > 0) {
        this.uiManager.displayQueryResults(customers, '数据库查询完成');
        this.uiManager.updateNotification(`查询成功，找到 ${customers.length} 条记录`, 'success');
        this.uiManager.addLogEntry(`查询完成，返回 ${customers.length} 条客户记录`, 'success');
      } else {
        this.uiManager.displayQueryResults([], '数据库为空，请先加载数据');
        this.uiManager.updateNotification('数据库为空', 'info');
        this.uiManager.addLogEntry('查询完成，数据库为空', 'info');
      }
      
    } catch (error) {
      // 错误处理
      this.uiManager.updateNotification('数据库查询失败', 'error');
      this.uiManager.addLogEntry(`查询失败: ${error.message}`, 'error');
      console.error('查询数据库错误:', error);
    } finally {
      // 重置处理状态
      this.isProcessing = false;
    }
  }

  /**
   * 处理清除数据库操作
   * 删除所有客户数据
   */
  async handleClearDatabase() {
    // 防止重复操作
    if (this.isProcessing) {
      this.uiManager.updateNotification('操作进行中，请稍候...', 'warning');
      return;
    }

    try {
      this.isProcessing = true;
      
      // 更新按钮状态为清除中
      this.uiManager.updateButtonStates('clearing');
      
      // 更新UI状态
      this.uiManager.updateNotification('正在清除数据库...', 'info');
      this.uiManager.addLogEntry('开始清除数据库操作', 'info');
      
      // 调用数据库管理器清除数据
      await this.dbManager.clearAllData();
      
      // 清除查询结果区域
      this.uiManager.displayQueryResults([], '数据库已清空');
      
      // 操作成功
      this.uiManager.updateNotification('数据库清除成功！', 'success');
      this.uiManager.addLogEntry('数据库清除完成', 'success');
      
      // 更新按钮状态为初始状态（清除完成后可以重新加载）
      this.uiManager.updateButtonStates('initial');
      
    } catch (error) {
      // 错误处理
      this.uiManager.updateNotification('数据库清除失败', 'error');
      this.uiManager.addLogEntry(`清除失败: ${error.message}`, 'error');
      console.error('清除数据库错误:', error);
    } finally {
      // 重置处理状态
      this.isProcessing = false;
    }
  }

  /**
   * 处理日志面板切换操作
   * 展开或收起日志面板
   */
  handleToggleLogPanel() {
    if (!this.uiManager.logPanel || !this.uiManager.toggleLogBtn) {
      return;
    }

    // 切换面板状态
    this.uiManager.isLogPanelCollapsed = !this.uiManager.isLogPanelCollapsed;
    
    if (this.uiManager.isLogPanelCollapsed) {
      // 收起面板
      this.uiManager.logPanel.style.display = 'none';
      this.uiManager.toggleLogBtn.textContent = '展开';
      this.uiManager.addLogEntry('日志面板已收起', 'info');
    } else {
      // 展开面板
      this.uiManager.logPanel.style.display = 'block';
      this.uiManager.toggleLogBtn.textContent = '收起';
      this.uiManager.addLogEntry('日志面板已展开', 'info');
    }
  }
}

export { EventHandler };
