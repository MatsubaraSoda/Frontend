# JavaScript 模块设计文档

## 项目概述

基于 IndexedDB 的客户数据库管理应用，采用模块化设计，确保代码的可维护性和可扩展性。

## 模块架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    main.js (主入口文件)                      │
├─────────────────────────────────────────────────────────────┤
│  UI管理模块  │  数据库模块  │  事件处理模块  │  工具模块     │
│  uiManager   │  dbManager   │  eventHandler  │  utils       │
├─────────────────────────────────────────────────────────────┤
│                    Customer 类 (核心业务逻辑)                │
└─────────────────────────────────────────────────────────────┘
```

## 模块详细设计

### 1. main.js (主入口文件)
**职责**: 应用初始化、模块协调、全局状态管理

**主要功能**:
- 应用启动和初始化
- 模块间通信协调
- 全局状态管理
- 错误处理和日志记录

**依赖关系**:
- 导入所有其他模块
- 初始化 UI 管理器
- 初始化数据库管理器
- 绑定事件处理器

**核心方法**:
```javascript
class App {
  constructor()                         // 构造函数
  async initialize()                    // 异步初始化
  setupEventListeners()                // 设置事件监听器
  handleGlobalError(error)             // 全局错误处理
}
```

### 2. uiManager.js (UI 管理模块)
**职责**: 用户界面状态管理、DOM 操作、用户反馈

**主要功能**:
- 通知面板状态管理
- 日志面板内容管理
- 查询结果展示
- 按钮状态控制（启用/禁用）
- DOM 元素操作和更新

**核心方法**:
```javascript
class UIManager {
  constructor()                         // 构造函数
  updateNotification(message, type)     // 更新通知面板
  addLogEntry(message, timestamp)      // 添加日志条目
  displayQueryResults(data)            // 显示查询结果
  updateButtonStates(state)            // 更新按钮状态
  toggleLogPanel()                     // 切换日志面板显示
  clearNotification()                   // 清除通知
  clearLogs()                          // 清除日志
}
```

**依赖关系**:
- 被 main.js 调用
- 被 eventHandler 模块调用（用于状态反馈）
- 无外部依赖

### 3. dbManager.js (数据库管理模块)
**职责**: IndexedDB 操作、数据持久化、数据库状态管理

**主要功能**:
- 数据库连接管理
- 数据增删改查操作
- 数据库版本控制
- 错误处理和重试机制

**核心方法**:
```javascript
class DatabaseManager {
  constructor()                         // 构造函数
  async connect()                       // 连接数据库
  async loadInitialData(customerData)   // 加载初始数据
  async queryAllCustomers()             // 查询所有客户
  async clearAllData()                  // 清除所有数据
  async closeConnection()               // 关闭数据库连接
  async isConnected()                   // 检查连接状态
  async getDatabaseInfo()               // 获取数据库信息
}
```

**依赖关系**:
- 被 main.js 调用
- 被 eventHandler 模块调用
- 与 Customer 类交互
- 与 uiManager 模块交互（状态反馈）

### 4. eventHandler.js (事件处理模块)
**职责**: 用户交互事件处理、业务逻辑协调

**主要功能**:
- 按钮点击事件处理
- 业务逻辑流程控制
- 错误处理和用户反馈
- 异步操作协调

**核心方法**:
```javascript
class EventHandler {
  constructor(uiManager, dbManager)     // 构造函数，依赖注入
  async handleLoadDatabase()            // 处理加载数据库事件
  async handleQueryDatabase()           // 处理查询数据库事件
  async handleClearDatabase()           // 处理清除数据库事件
  handleToggleLogPanel()                // 处理日志面板切换事件
  handleError(error, context)           // 统一错误处理
}
```

**依赖关系**:
- 被 main.js 调用
- 依赖 uiManager 模块（通过构造函数注入）
- 依赖 dbManager 模块（通过构造函数注入）
- 调用 Customer 类方法

### 5. Customer.js (客户业务逻辑类)
**职责**: 客户数据模型、业务规则、数据验证

**主要功能**:
- 客户数据结构定义
- 数据验证和清理
- 业务规则实现
- 与 IndexedDB 的交互

**核心方法**:
```javascript
class Customer {
  constructor(dbName)                   // 构造函数
  removeAllRows()                       // 删除所有行
  initialLoad(customerData)             // 初始数据加载
  async queryAllRows()                  // 查询所有行（需要实现）
  validateCustomerData(data)            // 验证客户数据
  async addCustomer(customerData)       // 添加客户
  async updateCustomer(id, data)        // 更新客户
  async deleteCustomer(id)              // 删除客户
}
```

**依赖关系**:
- 被 dbManager 模块使用
- 与 IndexedDB API 交互
- 无外部依赖

### 6. utils.js (工具模块)
**职责**: 通用工具函数、常量定义、辅助方法

**主要功能**:
- 日期格式化
- 数据验证工具
- 错误处理工具
- 常量定义

**核心方法**:
```javascript
const utils = {
  formatDate(date)                      // 日期格式化
  validateEmail(email)                  // 邮箱验证
  generateUniqueId()                    // 生成唯一ID
  debounce(func, delay)                // 防抖函数
  showError(message)                    // 错误显示
  formatCurrency(amount)                // 货币格式化
  validateCustomerData(data)            // 客户数据验证
  createTimestamp()                     // 创建时间戳
}
```

**依赖关系**:
- 被其他所有模块使用
- 无外部依赖

## 模块间通信流程

### 1. 数据加载流程
```
用户点击"加载数据库" 
→ eventHandler.handleLoadDatabase()
→ dbManager.loadInitialData()
→ Customer.initialLoad()
→ uiManager.updateNotification()
→ uiManager.addLogEntry()
```

### 2. 数据查询流程
```
用户点击"查询数据库"
→ eventHandler.handleQueryDatabase()
→ dbManager.queryAllCustomers()
→ Customer.queryAllRows()
→ uiManager.displayQueryResults()
→ uiManager.updateNotification()
```

### 3. 数据清除流程
```
用户点击"清除数据库"
→ eventHandler.handleClearDatabase()
→ dbManager.clearAllData()
→ Customer.removeAllRows()
→ uiManager.updateNotification()
→ uiManager.updateButtonStates()
```

## 错误处理策略

### 1. 错误类型分类
- **数据库连接错误**: 网络问题、权限问题
- **数据操作错误**: 数据格式错误、验证失败
- **UI 操作错误**: DOM 操作失败、状态不一致
- **系统错误**: 内存不足、浏览器兼容性

### 2. 错误处理机制
- **重试机制**: 数据库操作失败时自动重试（最多3次）
- **降级处理**: 功能不可用时提供替代方案
- **用户反馈**: 友好的错误提示和解决建议
- **日志记录**: 详细记录错误信息用于调试

### 3. 错误恢复策略
- **自动恢复**: 网络恢复后自动重连
- **手动恢复**: 提供重试按钮
- **状态同步**: 确保 UI 状态与数据状态一致

## 模块初始化顺序

### 1. 初始化流程
```
1. utils.js 加载（工具函数准备）
2. Customer.js 加载（业务逻辑类准备）
3. uiManager.js 加载（UI 管理准备）
4. dbManager.js 加载（数据库管理准备）
5. eventHandler.js 加载（事件处理准备）
6. main.js 执行（应用启动）
```

### 2. 依赖注入方式
```javascript
// 在 main.js 中
const uiManager = new UIManager();
const dbManager = new DatabaseManager();
const eventHandler = new EventHandler(uiManager, dbManager);

// 确保模块间正确引用
uiManager.setDatabaseManager(dbManager);
dbManager.setUIManager(uiManager);
```

## 文件结构

```
YourFirstDBAPP/
├── index.html
├── style.css
├── main.js                 # 主入口文件
├── modules/
│   ├── uiManager.js        # UI 管理模块
│   ├── dbManager.js        # 数据库管理模块
│   ├── eventHandler.js     # 事件处理模块
│   └── utils.js            # 工具模块
├── classes/
│   └── Customer.js         # Customer 类
└── docs/
    └── JavaScript模块设计.md
```

## 开发优先级

### 第一阶段（核心功能）
1. **utils.js** - 基础工具函数
2. **Customer.js** - 完善 Customer 类（添加 queryAllRows 方法）
3. **dbManager.js** - 数据库操作封装
4. **main.js** - 基础框架和模块协调

### 第二阶段（完整功能）
1. **uiManager.js** - UI 状态管理
2. **eventHandler.js** - 事件处理逻辑
3. **main.js** - 完整功能集成

### 第三阶段（优化增强）
1. 错误处理优化
2. 性能优化
3. 用户体验增强
4. 代码重构和测试

## 技术考虑

### 异步处理
- 所有数据库操作都使用 async/await
- 适当的错误处理和用户反馈
- 操作状态指示
- Promise 链式调用优化

### 错误处理
- 数据库连接失败处理
- 数据验证错误处理
- 用户友好的错误消息
- 错误边界和恢复机制

### 性能优化
- 防抖处理用户操作
- 合理的数据库连接管理
- 避免不必要的 DOM 操作
- 懒加载和代码分割

### 安全性考虑
- 输入数据验证和清理
- XSS 防护
- 敏感信息不存储在客户端
- 权限检查和访问控制

---

*本文档将随着开发进展持续更新和完善。*
