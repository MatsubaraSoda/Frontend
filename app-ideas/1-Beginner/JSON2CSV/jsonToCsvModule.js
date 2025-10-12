// JSON 转 CSV 功能模块
// 实现 initializeJsonToCsvModule 函数

/**
 * 初始化 JSON 转 CSV 功能模块
 * 功能：将 JSON 数据转换为 CSV 格式
 */
function initializeJsonToCsvModule() {
    console.log('开始初始化 JSON 转 CSV 模块');
    
    // 获取页面元素
    const jsonToCsvBtn = document.getElementById('jsonToCsvBtn');
    
    // 检查元素是否存在
    if (!jsonToCsvBtn) {
        console.error('未找到 JSON 转 CSV 按钮');
        return;
    }
    
    console.log('找到 JSON 转 CSV 按钮');
    
    // 为转换按钮添加点击事件
    jsonToCsvBtn.addEventListener('click', function() {
        console.log('点击了 JSON 转 CSV 按钮');
        
        // 执行转换流程
        convertJsonToCsv();
    });
    
    console.log('JSON 转 CSV 模块初始化完成');
}

/**
 * 执行 JSON 转 CSV 转换流程
 */
function convertJsonToCsv() {
    // 1. 读取 JSON 文本框的内容
    const jsonInput = document.getElementById('jsonInput');
    const csvOutput = document.getElementById('csvOutput');
    
    if (!jsonInput || !csvOutput) {
        console.error('未找到 JSON 输入框或 CSV 输出框');
        return;
    }
    
    const jsonText = jsonInput.value.trim();
    
    // 2. 验证内容是否为空
    if (!jsonText) {
        showErrorMessage('JSON 数据不能为空');
        return;
    }
    
    // 3. 验证 JSON 格式
    // JSON.parse() 将 JSON 字符串转换为 JavaScript 对象
    // JSON.parse() 自带 JSON 格式检测功能：
    // - 语法错误检测：检查 JSON 字符串的语法是否正确
    // - 格式错误检测：检查括号匹配、逗号使用等
    // - 数据类型检测：验证字符串、数字、布尔值、null、数组、对象的格式
    // - 错误处理：当格式不正确时抛出 SyntaxError 异常
    // 
    // 输入示例：
    // ```
    // const json = '[{"name":"张三","age":25,"city":"北京"},{"name":"李四","age":30,"city":"上海"}]';
    // const obj = JSON.parse(json);
    // 
    // console.log(obj);
    // console.log(obj[0].city);
    // console.log(obj[1].age);
    // ```
    // 
    // 输出示例：
    // ```
    // Array [Object { name: "张三", age: 25, city: "北京" }, Object { name: "李四", age: 30, city: "上海" }]
    // "北京"
    // 30
    // ```
    let jsonData;
    try {
        jsonData = JSON.parse(jsonText);
    } catch (error) {
        showErrorMessage('JSON 格式错误：' + error.message);
        return;
    }
    
    // 4. 验证是否为数组格式（不允许嵌套 JSON）
    if (!Array.isArray(jsonData)) {
        showErrorMessage('JSON 数据必须是数组格式');
        return;
    }
    
    if (jsonData.length === 0) {
        showErrorMessage('JSON 数组不能为空');
        return;
    }
    
    // 5. 验证数组元素是否为简单对象（不允许嵌套）
    for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        // 白名单验证：只允许简单对象类型
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            // 验证通过，继续处理
        } else {
            showErrorMessage(`第 ${i + 1} 个元素必须是简单对象`);
            return;
        }
        
        // 白名单验证：对象属性值只能是数字、字符串、布尔值或 null
        for (const key in item) {
            const value = item[key];
            // 检查是否为允许的数据类型：数字（包括NaN）、字符串、布尔值、null
            if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean' && value !== null) {
                showErrorMessage(`第 ${i + 1} 个元素的属性 "${key}" 只能是数字、字符串、布尔值或空值`);
                return;
            }
        }
    }
    
    // 6. 转换为 CSV
    const csvText = convertToCsv(jsonData);
    
    // 7. 输出到 CSV 文本框
    csvOutput.value = csvText;
    
    console.log('JSON 转 CSV 转换完成');
    showSuccessMessage('转换成功！');
}

/**
 * 将 JSON 数组转换为 CSV 格式
 * @param {Array} jsonArray - JSON 数组
 * @returns {string} - CSV 字符串
 */
function convertToCsv(jsonArray) {
    if (jsonArray.length === 0) {
        return '';
    }
    
    // 获取所有可能的列名
    const allKeys = new Set();
    jsonArray.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    const headers = Array.from(allKeys);
    
    // 生成 CSV 头部
    const csvHeader = headers.map(header => escapeCsvField(header)).join(',');
    
    // 生成 CSV 数据行
    const csvRows = jsonArray.map(item => {
        return headers.map(header => {
            const value = item[header] !== undefined ? item[header] : '';
            return escapeCsvField(value);
        }).join(',');
    });
    
    // 组合完整的 CSV
    // 使用扩展运算符（...）将 csvRows 数组展开
    // 示例：
    // csvHeader = "name,age,city"
    // csvRows = ["张三,25,北京", "李四,30,上海", "王五,28,广州"]
    // [csvHeader, ...csvRows] = ["name,age,city", "张三,25,北京", "李四,30,上海", "王五,28,广州"]
    // 最终结果：["name,age,city", "张三,25,北京", "李四,30,上海", "王五,28,广州"].join('\n')
    // = "name,age,city\n张三,25,北京\n李四,30,上海\n王五,28,广州"
    return [csvHeader, ...csvRows].join('\n');
}

/**
 * 转义 CSV 字段值
 * @param {any} value - 字段值
 * @returns {string} - 转义后的字段值
 */
function escapeCsvField(value) {
    // 将值转换为字符串
    const stringValue = String(value);
    
    // 如果包含逗号、双引号或换行符，需要用双引号包围
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // 将内部的双引号替换为两个双引号
        const escapedValue = stringValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
    }
    
    return stringValue;
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    console.error('转换错误：', message);
    // 这里可以调用消息处理模块显示错误信息
    console.log('错误：' + message);
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccessMessage(message) {
    console.log('转换成功：', message);
    // 这里可以调用消息处理模块显示成功信息
    console.log(message);
}
