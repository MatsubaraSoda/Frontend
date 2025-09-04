/**
 * Customer.js - 客户业务逻辑类
 * 负责客户数据模型、业务规则、数据验证和与 IndexedDB 的交互
 * 被 dbManager 模块使用，与 IndexedDB API 交互
 */

class Customer {
  constructor(dbName) {
    this.dbName = dbName;
    // 检查浏览器是否支持 IndexedDB
    if (!window.indexedDB) {
      window.alert("你的浏览器不支持稳定版本的 IndexedDB。某些功能将不可用。");
    }
  }

  /**
   * 从数据库中删除所有行
   * @memberof Customer
   */
  removeAllRows = () => {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.log('removeAllRows - 数据库错误: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('正在删除所有客户...');
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        console.log('removeAllRows - 事务错误: ', event.target.error.code,
          " - ", event.target.error.message);
      };
      txn.oncomplete = (event) => {
        console.log('所有行已删除！');
      };
      const objectStore = txn.objectStore('customers');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = (event) => {
        getAllKeysRequest.result.forEach(key => {
          objectStore.delete(key);
        });
      }
    }
  }

  /**
   * 用初始客户数据集填充客户数据库
   * @param {[object]} customerData 要添加的数据
   * @memberof Customer
   */
  initialLoad = (customerData) => {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.log('initialLoad - 数据库错误: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onupgradeneeded = (event) => {
      console.log('正在创建数据库结构...');
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      objectStore.onerror = (event) => {
        console.log('initialLoad - objectStore 错误: ', event.target.error.code,
          " - ", event.target.error.message);
      };

      // 创建索引以按姓名和电子邮件搜索客户
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });

      // 用初始数据集填充数据库
      customerData.forEach(function(customer) {
        objectStore.put(customer);
      });
    };

    // 添加 onsuccess 处理，确保数据库已存在时也能插入数据
    request.onsuccess = (event) => {
      console.log('数据库连接成功，检查是否需要插入数据...');
      const db = event.target.result;
      
      // 检查数据库中是否已有数据
      const txn = db.transaction('customers', 'readonly');
      const objectStore = txn.objectStore('customers');
      const countRequest = objectStore.count();
      
      countRequest.onsuccess = (event) => {
        const count = countRequest.result;
        console.log('当前数据库中有', count, '条记录');
        
        // 如果数据库为空，则插入初始数据
        if (count === 0) {
          console.log('数据库为空，插入初始数据...');
          const writeTxn = db.transaction('customers', 'readwrite');
          const writeObjectStore = writeTxn.objectStore('customers');
          
          customerData.forEach(function(customer) {
            writeObjectStore.put(customer);
          });
          
          writeTxn.oncomplete = () => {
            console.log('初始数据插入完成');
          };
        } else {
          console.log('数据库中已有数据，跳过插入');
        }
      };
    };
  }

  /**
   * 查询所有行（核心功能）
   * @returns {Promise<Array>} 返回所有客户数据的 Promise
   * @memberof Customer
   */
  async queryAllRows() {
    // Promise 基本用法说明：
    // 1. Promise 是 JavaScript 中处理异步操作的对象
    // 2. 构造函数接收一个函数，该函数有两个参数：resolve 和 reject
    // 3. resolve(value) - 成功时调用，将结果传递给 .then()
    // 4. reject(error) - 失败时调用，将错误传递给 .catch()
    // 5. async/await 是 Promise 的语法糖，让异步代码看起来像同步代码
    // 
    // Promise 的三种状态：
    // - pending（进行中）- 初始状态
    // - fulfilled（已成功）- resolve() 被调用
    // - rejected（已失败）- reject() 被调用
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = (event) => {
        console.log('queryAllRows - 数据库错误: ', event.target.error.code,
          " - ", event.target.error.message);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        console.log('正在查询所有客户...');
        const db = event.target.result;
        const txn = db.transaction('customers', 'readonly');
        txn.onerror = (event) => {
          console.log('queryAllRows - 事务错误: ', event.target.error.code,
            " - ", event.target.error.message);
          reject(event.target.error);
        };
        const objectStore = txn.objectStore('customers');
        const getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = (event) => {
          console.log('查询完成，找到', getAllRequest.result.length, '条记录');
          resolve(getAllRequest.result);
        };
        getAllRequest.onerror = (event) => {
          console.log('queryAllRows - 查询错误: ', event.target.error.code,
            " - ", event.target.error.message);
          reject(event.target.error);
        };
      };
    });
  }

  /**
   * 验证客户数据
   * @param {object} data - 要验证的客户数据
   * @returns {boolean} 验证结果
   * @memberof Customer
   */
  validateCustomerData(data) {
    // 检查数据是否为对象
    if (!data || typeof data !== 'object') {
      console.log('验证失败：数据不是有效对象');
      return false;
    }

    // 检查必需字段
    if (!data.userid || typeof data.userid !== 'string') {
      console.log('验证失败：userid 字段无效');
      return false;
    }

    if (!data.name || typeof data.name !== 'string') {
      console.log('验证失败：name 字段无效');
      return false;
    }

    if (!data.email || typeof data.email !== 'string') {
      console.log('验证失败：email 字段无效');
      return false;
    }

    // 验证邮箱格式（使用简单的正则表达式）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log('验证失败：邮箱格式无效');
      return false;
    }

    console.log('客户数据验证通过');
    return true;
  }
}

// 导出 Customer 类
export { Customer };
