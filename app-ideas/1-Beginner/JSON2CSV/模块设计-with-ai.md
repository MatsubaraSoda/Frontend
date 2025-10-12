## 模块设计

### 设计理念
采用模块化开发方式，将功能拆分为独立的 JS 文件，便于维护和扩展。使用传统 script 标签方式加载，适合前端新手学习。

### 文件结构
```
JSON2CSV/
├── index.html          # 主页面
├── main.js             # 主模块 - 模块化入口文件
├── uploadJsonModule.js # 上传 JSON 功能模块
├── jsonToCsvModule.js  # JSON 转 CSV 功能模块
├── clearModule.js      # 清空功能模块
├── saveCsvModule.js    # 保存 CSV 功能模块
├── temp-1.css          # 样式文件
└── JSON2CSV.md         # 需求文档
```

### 模块说明

#### main.js - 主模块
**作用：** 模块化入口文件，预留各种函数接口，不包含具体功能实现

**主要功能：**
- 等待 DOM 加载完成
- 调用各功能模块的初始化函数
- 预留所有模块的初始化接口

**代码结构：**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('JSON2CSV 主模块已加载');
    
    // 初始化所有功能模块
    initializeUploadJsonModule();
    initializeJsonToCsvModule();
    initializeClearModule();
    initializeSaveCsvModule();
});

// 预留各模块的初始化接口
function initializeUploadJsonModule() {
    // 具体实现在 uploadJsonModule.js 中
    console.log('上传 JSON 模块接口已预留');
}

function initializeJsonToCsvModule() {
    // 具体实现在 jsonToCsvModule.js 中
    console.log('JSON 转 CSV 模块接口已预留');
}

function initializeClearModule() {
    // 具体实现在 clearModule.js 中
    console.log('清空模块接口已预留');
}

function initializeSaveCsvModule() {
    // 具体实现在 saveCsvModule.js 中
    console.log('保存 CSV 模块接口已预留');
}
```

#### uploadJsonModule.js - 上传 JSON 功能模块
**作用：** 实现 JSON 文件上传功能

**主要功能：**
- 实现 `initializeUploadJsonModule()` 函数
- 处理"上传 JSON"按钮点击事件
- 弹出文件选择对话框
- 以 UTF-8 编码读取 JSON 文件
- 将文件内容显示在 JSON 文本框中

**核心实现：**
```javascript
function initializeUploadJsonModule() {
    // 获取页面元素
    const uploadJsonBtn = document.getElementById('uploadJsonBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');
    
    // 添加事件监听器
    uploadJsonBtn.addEventListener('click', function() {
        jsonFileInput.click(); // 触发文件选择
    });
    
    jsonFileInput.addEventListener('change', function(event) {
        // 读取文件内容并填写到文本框
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            const jsonInput = document.getElementById('jsonInput');
            jsonInput.value = fileContent;
        };
        reader.readAsText(selectedFile, 'UTF-8');
    });
}
```

### 模块联动机制

#### 加载顺序
```html
<script src="main.js"></script>        <!-- 先加载，定义接口 -->
<script src="uploadJsonModule.js"></script> <!-- 后加载，实现接口 -->
<script src="jsonToCsvModule.js"></script>  <!-- 后加载，实现接口 -->
<script src="clearModule.js"></script>      <!-- 后加载，实现接口 -->
<script src="saveCsvModule.js"></script>    <!-- 后加载，实现接口 -->
```

#### 工作原理
1. `main.js` 先加载，定义各模块的预留接口
2. 各功能模块后加载，重新定义对应的函数
3. 后面的实现覆盖前面的预留接口，实现功能
4. 当 DOM 加载完成后，main.js 调用各个模块的初始化函数

#### 优势
- 简单易懂，适合前端新手
- 不需要复杂的模块系统
- 便于逐步添加新功能模块
- 代码结构清晰，易于维护

#### jsonToCsvModule.js - JSON 转 CSV 功能模块
**作用：** 实现 JSON 数据转换为 CSV 格式的核心功能

**主要功能：**
- 实现 `initializeJsonToCsvModule()` 函数
- 处理"JSON 转 CSV"按钮点击事件
- 读取 JSON 文本框内容并验证格式
- 验证数据格式（不允许嵌套 JSON）
- 将 JSON 数组转换为 CSV 格式
- 将转换结果输出到 CSV 文本框

**核心实现：**
```javascript
function initializeJsonToCsvModule() {
    // 获取页面元素
    const jsonToCsvBtn = document.getElementById('jsonToCsvBtn');
    
    // 添加事件监听器
    jsonToCsvBtn.addEventListener('click', function() {
        convertJsonToCsv(); // 执行转换流程
    });
}

function convertJsonToCsv() {
    // 1. 读取 JSON 文本框内容
    // 2. 验证 JSON 格式
    // 3. 验证数组格式和嵌套限制
    // 4. 转换为 CSV
    // 5. 输出到 CSV 文本框
}
```

**验证规则：**
- JSON 数据不能为空
- 必须是有效的 JSON 格式（使用 JSON.parse() 验证）
- 必须是数组格式（使用 Array.isArray() 验证）
- 数组不能为空
- 数组元素必须是简单对象（白名单验证）
- 对象属性值只能是简单类型：数字、字符串、布尔值、null（白名单验证）

**CSV 转换逻辑：**
- 自动收集所有可能的列名（使用 Set 去重）
- 生成 CSV 头部行（使用 map 和 join）
- 为每个数组元素生成数据行（使用 map 嵌套）
- 处理 CSV 字段转义（逗号、双引号、换行符）
- 使用扩展运算符（...）组合最终结果

#### clearModule.js - 清空功能模块
**作用：** 清空所有输入和输出文本框的内容

**主要功能：**
- 实现 `initializeClearModule()` 函数
- 处理"清空"按钮点击事件
- 清空 JSON 文本框内容
- 清空 CSV 文本框内容
- 重置文件选择状态
- 显示清空成功消息

**核心实现：**
```javascript
function initializeClearModule() {
    // 获取页面元素
    const clearBtn = document.getElementById('clearBtn');
    
    // 添加事件监听器
    clearBtn.addEventListener('click', function() {
        clearAllFields(); // 执行清空流程
    });
}

function clearAllFields() {
    // 1. 清空 JSON 文本框
    // 2. 清空 CSV 文本框
    // 3. 重置文件选择
    // 4. 显示成功消息
}
```

**清空范围：**
- JSON 输入文本框
- CSV 输出文本框
- 文件选择状态（重置为未选择状态）

#### saveCsvModule.js - 保存 CSV 功能模块
**作用：** 将 CSV 数据保存为本地文件

**主要功能：**
- 实现 `initializeSaveCsvModule()` 函数
- 处理"保存 CSV"按钮点击事件
- 检查 CSV 文本框是否有内容
- 创建 Blob 对象并生成下载链接
- 触发文件下载（弹出保存对话框）
- 自动生成带时间戳的文件名

**核心实现：**
```javascript
function initializeSaveCsvModule() {
    // 获取页面元素
    const saveCsvBtn = document.getElementById('saveCsvBtn');
    
    // 添加事件监听器
    saveCsvBtn.addEventListener('click', function() {
        saveCsvToFile(); // 执行保存流程
    });
}

function saveCsvToFile() {
    // 1. 获取 CSV 内容
    // 2. 检查内容是否为空
    // 3. 创建 Blob 对象
    // 4. 生成下载链接
    // 5. 触发下载
}
```

**技术要点：**
- 使用 `Blob` 对象处理二进制数据（指定 CSV MIME 类型）
- 使用 `URL.createObjectURL()` 创建下载链接
- 使用 `download` 属性设置文件名
- 自动生成时间戳文件名（如：`data_2024-01-15T10-30-45.csv`）
- 使用 `document.createElement('a')` 创建隐藏下载链接
- 下载完成后清理资源（移除元素和释放 URL）

## 模块设计总结

### 设计成果
本项目成功实现了基于传统 JavaScript 的模块化架构，包含以下核心模块：

#### 核心模块（5个）
1. **main.js** - 主模块，统一入口和接口预留
2. **uploadJsonModule.js** - JSON 文件上传功能
3. **jsonToCsvModule.js** - JSON 转 CSV 核心转换功能
4. **clearModule.js** - 界面清空功能
5. **saveCsvModule.js** - CSV 文件下载功能

#### 技术架构特点
- **模块化设计**：功能分离，每个模块职责单一
- **接口预留机制**：main.js 预留接口，后续模块实现覆盖
- **传统加载方式**：使用 script 标签顺序加载，适合新手学习
- **详细注释**：每个关键步骤都有中文说明

#### 核心 API 应用
- **File API**：文件读取（FileReader.readAsText）和下载（Blob、download 属性）
- **DOM API**：元素操作（getElementById、value）和事件监听（addEventListener、click）
- **JSON API**：数据解析（JSON.parse）和格式验证（Array.isArray、typeof）
- **URL API**：对象 URL 创建（createObjectURL）和释放（revokeObjectURL）
- **ES6 特性**：扩展运算符（...）、模板字符串、箭头函数

#### 代码质量
- **结构清晰**：模块间依赖关系明确
- **错误处理**：完善的元素存在性检查和异常处理
- **用户体验**：友好的操作流程和控制台反馈
- **可维护性**：模块独立，便于后续扩展和修改

### 设计优势
✅ **简单易懂** - 适合前端新手学习模块化概念  
✅ **无需构建工具** - 纯原生 JavaScript，开箱即用  
✅ **易于扩展** - 按相同模式可快速添加新功能  
✅ **代码复用** - 模块间接口统一，便于维护  

**模块设计状态：✅ 已完成**
