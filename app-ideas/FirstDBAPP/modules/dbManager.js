/**
 * dbManager.js - 数据库管理模块
 * 负责 IndexedDB 操作、数据持久化、数据库状态管理
 * 被 main.js 和 eventHandler 调用，与 Customer 类交互
 */

import { Customer } from '../classes/Customer.js';
import { utils } from './utils.js';

class DatabaseManager {
  constructor() {
    this.customer = null;
    this.isConnected = false;
    this.dbName = 'customer_db';
    this.uiManager = null;
  }

  /**
   * 连接数据库
   * @returns {Promise<boolean>} 连接结果
   */
  async connect() {
    try {
      this.customer = new Customer(this.dbName);
      this.isConnected = true;
      console.log('数据库连接成功');
      return true;
    } catch (error) {
      console.error('数据库连接失败:', error);
      return false;
    }
  }

  /**
   * 加载初始数据
   * @param {Array} customerData - 客户数据数组
   * @returns {Promise<boolean>} 加载结果
   */
  async loadInitialData(customerData) {
    if (!this.isConnected || !this.customer) {
      console.error('数据库未连接');
      return false;
    }
    try {
      // 使用 Customer 类的 initialLoad 方法
      // 注意：initialLoad 是同步方法，但数据库操作是异步的
      this.customer.initialLoad(customerData);
      
      // 等待一小段时间让数据库操作完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('初始数据加载成功');
      return true;
    } catch (error) {
      console.error('初始数据加载失败:', error);
      return false;
    }
  }

  /**
   * 查询所有客户
   * @returns {Promise<Array>} 客户数据数组
   */
  async queryAllCustomers() {
    if (!this.isConnected || !this.customer) {
      console.error('数据库未连接');
      return [];
    }
    try {
      // 使用 Customer 类的 queryAllRows 方法
      const customers = await this.customer.queryAllRows();
      console.log('客户数据查询成功');
      return customers;
    } catch (error) {
      console.error('客户数据查询失败:', error);
      return [];
    }
  }

  /**
   * 清除所有数据
   * @returns {Promise<boolean>} 清除结果
   */
  async clearAllData() {
    if (!this.isConnected || !this.customer) {
      console.error('数据库未连接');
      return false;
    }
    try {
      // 使用 Customer 类的 removeAllRows 方法
      this.customer.removeAllRows();
      console.log('数据清除成功');
      return true;
    } catch (error) {
      console.error('数据清除失败:', error);
      return false;
    }
  }
}

// 导出 DatabaseManager 类
export { DatabaseManager };
