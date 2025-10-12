/**
 * uiManager.js - UI 管理模块
 * 负责用户界面状态管理、DOM 操作、用户反馈
 * 被 main.js 和 eventHandler 调用，无外部依赖
 */

import { utils } from './utils.js';

class UIManager {
  constructor() {
    // DOM 元素引用
    this.notificationPanel = document.getElementById('notificationPanel');
    this.queryResults = document.getElementById('queryResults');
    this.logPanel = document.getElementById('logPanel');
    this.toggleLogBtn = document.getElementById('toggleLogBtn');
    
    // 按钮元素引用
    this.loadDbBtn = document.getElementById('loadDbBtn');
    this.queryDbBtn = document.getElementById('queryDbBtn');
    this.clearDbBtn = document.getElementById('clearDbBtn');
    
    // 状态管理
    this.isLogPanelCollapsed = false;
  }

  /**
   * 更新通知面板
   * @param {string} message - 通知消息
   * @param {string} type - 消息类型（success, error, info）
   */
  updateNotification(message, type = 'info') {
    if (!this.notificationPanel) return;
    
    // 清除现有内容
    this.notificationPanel.innerHTML = '';
    
    // 创建消息元素
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = `text-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'gray'}-700`;
    
    this.notificationPanel.appendChild(messageElement);
  }

  /**
   * 添加日志条目
   * @param {string} message - 日志消息
   * @param {string} type - 日志类型（info, success, error, warning）
   */
  addLogEntry(message, type = 'info') {
    if (!this.logPanel) return;
    
    // 创建日志条目元素
    const logEntry = document.createElement('div');
    logEntry.className = `text-sm mb-2 flex items-start gap-2`;
    
    // 添加时间戳
    const timestamp = utils.formatDate(new Date());
    const timeElement = document.createElement('span');
    timeElement.textContent = `[${timestamp}]`;
    timeElement.className = 'text-gray-500 text-xs flex-shrink-0';
    
    // 添加消息内容
    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    
    // 根据类型设置颜色
    const colorClass = {
      'success': 'text-green-700',
      'error': 'text-red-700', 
      'warning': 'text-yellow-700',
      'info': 'text-gray-700'
    }[type] || 'text-gray-700';
    
    messageElement.className = colorClass;
    
    // 组装日志条目
    logEntry.appendChild(timeElement);
    logEntry.appendChild(messageElement);
    
    // 添加到日志面板顶部
    this.logPanel.insertBefore(logEntry, this.logPanel.firstChild);
    
    // 限制日志条目数量（最多保留50条）
    const logEntries = this.logPanel.children;
    if (logEntries.length > 50) {
      this.logPanel.removeChild(logEntries[logEntries.length - 1]);
    }
  }

  /**
   * 显示查询结果
   * @param {Array} customers - 客户数据数组
   * @param {string} message - 结果描述消息
   */
  displayQueryResults(customers, message = '') {
    if (!this.queryResults) return;
    
    // 清除现有内容
    this.queryResults.innerHTML = '';
    
    if (!customers || customers.length === 0) {
      // 无数据时的显示
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = message || '暂无数据，请先加载数据库或执行查询操作';
      emptyMessage.className = 'text-gray-500 text-center py-8';
      this.queryResults.appendChild(emptyMessage);
      return;
    }
    
    // 创建结果标题
    const titleElement = document.createElement('h3');
    titleElement.textContent = message || `查询结果 (${customers.length} 条记录)`;
    titleElement.className = 'text-lg font-semibold text-gray-800 mb-4';
    this.queryResults.appendChild(titleElement);
    
    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.className = 'overflow-x-auto';
    
    // 创建表格
    const table = document.createElement('table');
    table.className = 'min-w-full bg-white border border-gray-200 rounded-lg';
    
    // 动态生成表头（从第一个客户对象获取字段）
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-50';
    
    const headerRow = document.createElement('tr');
    
    // 从第一个客户对象获取所有字段名
    const firstCustomer = customers[0];
    const fieldNames = Object.keys(firstCustomer);
    
    // 字段名映射（英文 -> 中文显示名）
    const fieldDisplayNames = {
      'userid': '用户ID',
      'name': '姓名', 
      'email': '邮箱',
      'lastOrderDate': '最后订单日期',
      'yearlySales': '年度总销售额'
    };
    
    // 动态生成表头
    fieldNames.forEach(fieldName => {
      const th = document.createElement('th');
      th.textContent = fieldDisplayNames[fieldName] || fieldName;
      th.className = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表体
    const tbody = document.createElement('tbody');
    tbody.className = 'divide-y divide-gray-200';
    
    // 添加数据行
    customers.forEach(customer => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      
      // 动态获取字段值（与表头字段顺序一致）
      fieldNames.forEach(fieldName => {
        const td = document.createElement('td');
        const fieldValue = customer[fieldName] || 'N/A';
        td.textContent = fieldValue;
        td.className = 'px-4 py-3 text-sm text-gray-900 border-b border-gray-200';
        row.appendChild(td);
      });
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    this.queryResults.appendChild(tableContainer);
  }

  /**
   * 更新按钮状态
   * @param {string} state - 按钮状态（initial, loading, querying, clearing）
   */
  updateButtonStates(state = 'initial') {
    // 根据文档中的按钮状态管理表格实现
    const states = {
      // 初始应用显示：加载数据库=启用, 查询数据库=启用, 清除数据库=禁用
      'initial': {
        loadDb: true,
        queryDb: true, 
        clearDb: false
      },
      // 点击加载数据库：加载数据库=禁用, 查询数据库=启用, 清除数据库=启用
      'loading': {
        loadDb: false,
        queryDb: true,
        clearDb: true
      },
      // 点击查询数据库：加载数据库=禁用, 查询数据库=启用, 清除数据库=启用
      'querying': {
        loadDb: false,
        queryDb: true,
        clearDb: true
      },
      // 点击清除数据库：加载数据库=启用, 查询数据库=启用, 清除数据库=禁用
      'clearing': {
        loadDb: true,
        queryDb: true,
        clearDb: false
      }
    };

    const currentState = states[state] || states['initial'];
    
    // 更新加载数据库按钮状态
    if (this.loadDbBtn) {
      this.loadDbBtn.disabled = !currentState.loadDb;
      this.loadDbBtn.className = currentState.loadDb 
        ? 'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none'
        : 'w-full bg-gray-400 text-white font-medium py-3 px-4 rounded-lg cursor-not-allowed opacity-50';
    }
    
    // 更新查询数据库按钮状态
    if (this.queryDbBtn) {
      this.queryDbBtn.disabled = !currentState.queryDb;
      this.queryDbBtn.className = currentState.queryDb
        ? 'w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:outline-none'
        : 'w-full bg-gray-400 text-white font-medium py-3 px-4 rounded-lg cursor-not-allowed opacity-50';
    }
    
    // 更新清除数据库按钮状态
    if (this.clearDbBtn) {
      this.clearDbBtn.disabled = !currentState.clearDb;
      this.clearDbBtn.className = currentState.clearDb
        ? 'w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:outline-none'
        : 'w-full bg-gray-400 text-white font-medium py-3 px-4 rounded-lg cursor-not-allowed opacity-50';
    }
  }
}

export { UIManager };
