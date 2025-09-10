# 你的第一个数据库应用

**难度等级:** 1-初学者

理解数据库概念以及如何在应用程序中使用它们，是所有开发者都需要掌握的知识。你的第一个数据库应用的目标是提供数据库概念的温和介绍，并学习在前端应用中使用数据库的一个用例。

那么，你知道现代浏览器内置了数据库管理系统吗？IndexedDB 内置在大多数现代浏览器中，为开发者提供基本的数据库功能、事务支持和客户端跨会话持久化。

## 需求和约束

- 基于浏览器的数据库的主要用例是维护需要在会话间持久化的状态或状态信息，或者作为临时数据的工作区域。例如，从服务器检索的数据在呈现给用户之前必须重新格式化或清理。

- 重要的是要记住，由于客户端浏览器环境无法保证安全性，你不应该在基于浏览器的数据库中维护任何机密或个人身份信息（PII）。

- 以下 JavaScript 类提供了允许你的应用最初填充和清除浏览器数据库的功能，这样你就可以测试将要添加的查询逻辑。你需要将网页上的按钮连接到 `clearDB` 和 `loadDB` 函数，并编写自己的 `queryDB` 处理器来连接到"查询数据库"按钮。你还需要向 Customer 类添加一个 `queryAllRows` 函数。

```js
class Customer {
  constructor(dbName) {
    this.dbName = dbName;
    if (!window.indexedDB) {
      window.alert("你的浏览器不支持稳定版本的 IndexedDB。\
        某些功能将不可用。");
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
      console.log('正在填充客户数据...');
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
      db.close();
    };
  }
}

// 网页事件处理器
const DBNAME = 'customer_db';

/**
 * 从数据库中清除所有客户数据
 */
const clearDB = () => {
  console.log('从客户数据库中删除所有行');
  let customer = new Customer(DBNAME);
  customer.removeAllRows();
}

/**
 * 向数据库添加客户数据
 */
const loadDB = () => {
  console.log('加载客户数据库');

        // 用于初始填充数据库的客户数据
  const customerData = [
    { userid: '444', name: 'Bill', email: 'bill@company.com' },
    { userid: '555', name: 'Donna', email: 'donna@home.org' }
  ];
  let customer = new Customer(DBNAME);
  customer.initialLoad(customerData);
}
```

## 用户故事

-   [ ] 用户可以看到包含三个按钮控制面板的网页 - '加载数据库'、'查询数据库'和'清除数据库'。
-   [ ] 用户可以看到一个通知面板，状态消息将在此发布。
-   [ ] 用户可以看到一个可滚动的日志面板，描述应用程序操作和与客户实例接口的执行详细信息将在此发布。
-   [ ] 用户可以在日志面板中看到通知面板消息的运行历史。
-   [ ] 用户可以看到一个可滚动的查询结果区域，检索到的客户数据将在此显示。
-   [ ] 用户可以点击'加载数据库'按钮来用数据填充数据库。你 UI 中的'加载数据库'按钮应该连接到提供的 `loadDB` 事件处理器。
-   [ ] 当数据加载操作开始和结束时，用户可以在通知面板中看到显示的消息。
-   [ ] 用户可以点击'查询数据库'按钮在查询结果区域中列出所有客户。你 UI 中的'查询数据库'按钮应该连接到你将添加到程序中的 `queryDB` 事件处理器。
-   [ ] 当查询开始和结束时，用户可以在通知面板中看到消息。
-   [ ] 如果没有行要显示，用户可以在查询结果区域中看到消息。
-   [ ] 用户可以点击'清除数据库'按钮从数据库中删除所有行。你 UI 中的'清除数据库'按钮应该连接到提供的 `clearDB` 事件处理器。
-   [ ] 当清除操作开始和结束时，用户可以在通知面板中看到消息。

## 奖励功能

-   [ ] 用户可以根据下表看到按钮的启用和禁用状态。

    | 状态               | 加载数据库 | 查询数据库 | 清除数据库 |
    |---------------------|----------|----------|----------|
    | 初始应用显示       | 启用     | 启用     | 禁用     |
    | 点击加载数据库     | 禁用     | 启用     | 启用     |
    | 点击查询数据库     | 禁用     | 启用     | 启用     |
    | 点击清除数据库     | 启用     | 启用     | 禁用     |
    
-   [ ] 用户可以看到添加到代码中包含的客户数据字段的附加字段。开发者应该添加最后订单日期和年度总销售额。
-   [ ] 开发者应该对这个项目进行回顾：
    - 你能看到在你的前端应用中使用 IndexedDB 的哪些用例？
    - 与使用文件或本地存储相比，你能看到哪些优点和缺点？
    - 一般来说，你可能会使用什么标准来确定 IndexedDB 是否适合你的应用。（提示：100% 是或否不是有效答案）。

## 有用的链接和资源

- [IndexedDB 概念 (MDN)](http://tinyw.in/7TIr)
- [使用 IndexedDB (MDN)](http://tinyw.in/w6k0)
- [IndexedDB API (MDN)](http://tinyw.in/GqnF)
- [IndexedDB 浏览器支持](https://caniuse.com/#feat=indexeddb)

## 示例项目

- 无
