# JavaScript 模块架构图说明

## 模块架构图 (ASCII 版本)

```
┌─────────────────────────────────────────────────────────────┐
│                    main.js (主入口文件)                      │
│                应用初始化、模块协调、全局状态管理              │
├─────────────────────────────────────────────────────────────┤
│  UI管理模块  │  数据库模块  │  事件处理模块  │  工具模块     │
│  uiManager   │  dbManager   │  eventHandler  │  utils       │
│  界面状态管理 │  IndexedDB   │  用户交互处理  │  通用工具函数 │
│  DOM操作     │  数据持久化   │  业务逻辑协调  │  数据验证     │
│  用户反馈     │  连接管理     │  异步操作      │  错误处理     │
├─────────────────────────────────────────────────────────────┤
│                    Customer 类 (核心业务逻辑)                │
│                数据模型定义、业务规则实现、IndexedDB交互      │
└─────────────────────────────────────────────────────────────┘
```

## 模块依赖关系图

```
                    main.js
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    uiManager      dbManager      eventHandler
        │              │              │
        │              │              │
        └──────────────┼──────────────┘
                       │
                    utils.js
                       │
                       ▼
                   Customer.js
```

## 数据流程图

### 1. 加载数据流程
```
用户点击"加载数据库" 
    │
    ▼
eventHandler.handleLoadDatabase()
    │
    ▼
dbManager.loadInitialData()
    │
    ▼
Customer.initialLoad()
    │
    ▼
uiManager.updateNotification()
    │
    ▼
uiManager.addLogEntry()
```

### 2. 查询数据流程
```
用户点击"查询数据库"
    │
    ▼
eventHandler.handleQueryDatabase()
    │
    ▼
dbManager.queryAllCustomers()
    │
    ▼
Customer.queryAllRows()
    │
    ▼
uiManager.displayQueryResults()
    │
    ▼
uiManager.updateNotification()
```

### 3. 清除数据流程
```
用户点击"清除数据库"
    │
    ▼
eventHandler.handleClearDatabase()
    │
    ▼
dbManager.clearAllData()
    │
    ▼
Customer.removeAllRows()
    │
    ▼
uiManager.updateNotification()
    │
    ▼
uiManager.updateButtonStates()
```

## 模块职责详细说明

### main.js (主入口文件)
- **位置**: 应用顶层
- **职责**: 应用初始化、模块协调、全局状态管理
- **依赖**: 导入所有其他模块
- **调用**: 初始化所有模块，绑定事件处理器

### uiManager.js (UI 管理模块)
- **位置**: 功能模块层
- **职责**: 用户界面状态管理、DOM 操作、用户反馈
- **依赖**: 无外部依赖
- **被调用**: 被 main.js 和 eventHandler 调用

### dbManager.js (数据库管理模块)
- **位置**: 功能模块层
- **职责**: IndexedDB 操作、数据持久化、数据库状态管理
- **依赖**: 与 Customer 类交互
- **被调用**: 被 main.js 和 eventHandler 调用

### eventHandler.js (事件处理模块)
- **位置**: 功能模块层
- **职责**: 用户交互事件处理、业务逻辑协调
- **依赖**: 依赖 uiManager 和 dbManager（通过构造函数注入）
- **被调用**: 被 main.js 调用

### utils.js (工具模块)
- **位置**: 功能模块层
- **职责**: 通用工具函数、数据验证、错误处理
- **依赖**: 无外部依赖
- **被调用**: 被其他所有模块使用

### Customer.js (客户业务逻辑类)
- **位置**: 业务逻辑层
- **职责**: 客户数据模型、业务规则、数据验证
- **依赖**: 与 IndexedDB API 交互
- **被调用**: 被 dbManager 模块使用

## 初始化顺序

```
1. utils.js 加载（工具函数准备）
2. Customer.js 加载（业务逻辑类准备）
3. uiManager.js 加载（UI 管理准备）
4. dbManager.js 加载（数据库管理准备）
5. eventHandler.js 加载（事件处理准备）
6. main.js 执行（应用启动）
```

## 依赖注入方式

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
    ├── JavaScript模块设计.md
    └── JavaScript模块架构图说明.md
```

## 技术特点

### 模块化设计
- 每个模块职责单一，便于维护和测试
- 模块间通过明确的接口进行通信
- 支持模块的独立开发和测试

### 依赖注入
- 通过构造函数注入依赖，降低耦合度
- 便于单元测试和模块替换
- 清晰的依赖关系管理

### 异步处理
- 所有数据库操作使用 async/await
- 统一的错误处理机制
- 用户友好的操作反馈

### 状态管理
- 集中的状态管理，避免状态不一致
- 清晰的状态更新流程
- 支持状态的撤销和重做

---

*此文档提供了 JavaScript 模块架构的可视化说明，配合 JavaScript模块设计.md 使用。*
