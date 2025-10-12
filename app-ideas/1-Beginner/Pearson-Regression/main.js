// ===== 导入模块 =====
import { ScatterPlotRenderer } from './canvas.js';

// ===== 全局变量和配置 =====
const CONFIG = {
    DECIMAL_PLACES: 4, // 显示小数位数
    MIN_DATA_POINTS: 2, // 计算相关系数所需的最少数据点
    MAX_FILE_SIZE: 5 * 1024 * 1024 // 最大文件大小 5MB
};

let dataPoints = []; // 存储数据点的数组
let isTestDataLoaded = false; // 标记是否已加载测试数据
let scatterPlotRenderer = null; // Canvas渲染器实例

// 硬编码测试数据 - 100个数据点
const testData = [
    { x: 1.2, y: 2.4 }, { x: 2.1, y: 4.1 }, { x: 3.5, y: 6.8 }, { x: 4.2, y: 8.3 }, { x: 5.7, y: 11.2 },
    { x: 6.3, y: 12.6 }, { x: 7.8, y: 15.4 }, { x: 8.9, y: 17.8 }, { x: 9.4, y: 18.7 }, { x: 10.1, y: 20.2 },
    { x: 11.5, y: 22.9 }, { x: 12.7, y: 25.3 }, { x: 13.2, y: 26.4 }, { x: 14.6, y: 29.1 }, { x: 15.8, y: 31.5 },
    { x: 16.3, y: 32.6 }, { x: 17.9, y: 35.7 }, { x: 18.4, y: 36.8 }, { x: 19.7, y: 39.3 }, { x: 20.2, y: 40.4 },
    { x: 21.6, y: 43.1 }, { x: 22.8, y: 45.5 }, { x: 23.3, y: 46.6 }, { x: 24.7, y: 49.3 }, { x: 25.9, y: 51.7 },
    { x: 26.4, y: 52.8 }, { x: 27.8, y: 55.5 }, { x: 28.3, y: 56.6 }, { x: 29.7, y: 59.3 }, { x: 30.2, y: 60.4 },
    { x: 31.6, y: 63.1 }, { x: 32.8, y: 65.5 }, { x: 33.3, y: 66.6 }, { x: 34.7, y: 69.3 }, { x: 35.9, y: 71.7 },
    { x: 36.4, y: 72.8 }, { x: 37.8, y: 75.5 }, { x: 38.3, y: 76.6 }, { x: 39.7, y: 79.3 }, { x: 40.2, y: 80.4 },
    { x: 41.6, y: 83.1 }, { x: 42.8, y: 85.5 }, { x: 43.3, y: 86.6 }, { x: 44.7, y: 89.3 }, { x: 45.9, y: 91.7 },
    { x: 46.4, y: 92.8 }, { x: 47.8, y: 95.5 }, { x: 48.3, y: 96.6 }, { x: 49.7, y: 99.3 }, { x: 50.2, y: 100.4 },
    { x: 51.6, y: 103.1 }, { x: 52.8, y: 105.5 }, { x: 53.3, y: 106.6 }, { x: 54.7, y: 109.3 }, { x: 55.9, y: 111.7 },
    { x: 56.4, y: 112.8 }, { x: 57.8, y: 115.5 }, { x: 58.3, y: 116.6 }, { x: 59.7, y: 119.3 }, { x: 60.2, y: 120.4 },
    { x: 61.6, y: 123.1 }, { x: 62.8, y: 125.5 }, { x: 63.3, y: 126.6 }, { x: 64.7, y: 129.3 }, { x: 65.9, y: 131.7 },
    { x: 66.4, y: 132.8 }, { x: 67.8, y: 135.5 }, { x: 68.3, y: 136.6 }, { x: 69.7, y: 139.3 }, { x: 70.2, y: 140.4 },
    { x: 71.6, y: 143.1 }, { x: 72.8, y: 145.5 }, { x: 73.3, y: 146.6 }, { x: 74.7, y: 149.3 }, { x: 75.9, y: 151.7 },
    { x: 76.4, y: 152.8 }, { x: 77.8, y: 155.5 }, { x: 78.3, y: 156.6 }, { x: 79.7, y: 159.3 }, { x: 80.2, y: 160.4 },
    { x: 81.6, y: 163.1 }, { x: 82.8, y: 165.5 }, { x: 83.3, y: 166.6 }, { x: 84.7, y: 169.3 }, { x: 85.9, y: 171.7 },
    { x: 86.4, y: 172.8 }, { x: 87.8, y: 175.5 }, { x: 88.3, y: 176.6 }, { x: 89.7, y: 179.3 }, { x: 90.2, y: 180.4 },
    { x: 91.6, y: 183.1 }, { x: 92.8, y: 185.5 }, { x: 93.3, y: 186.6 }, { x: 94.7, y: 189.3 }, { x: 95.9, y: 191.7 },
    { x: 96.4, y: 192.8 }, { x: 97.8, y: 195.5 }, { x: 98.3, y: 196.6 }, { x: 99.7, y: 199.3 }, { x: 100.2, y: 200.4 }
];

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    initializeApp();
});

/**
 * 初始化应用程序
 */
function initializeApp() {
    // 获取DOM元素
    const elements = getDOMElements();
    
    // 初始化Canvas渲染器
    initializeCanvasRenderer();
    
    // 绑定事件监听器
    bindEventListeners(elements);
    
    console.log('应用程序初始化完成');
}

/**
 * 初始化Canvas渲染器
 */
function initializeCanvasRenderer() {
    try {
        scatterPlotRenderer = new ScatterPlotRenderer('scatterCanvas');
        console.log('Canvas渲染器初始化成功');
    } catch (error) {
        console.error('Canvas渲染器初始化失败:', error);
    }
}

/**
 * 获取DOM元素
 * @returns {object} DOM元素对象
 */
function getDOMElements() {
    return {
        xInput: document.getElementById('xInput'),
        yInput: document.getElementById('yInput'),
        addBtn: document.getElementById('addBtn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        loadTestBtn: document.getElementById('loadTestBtn'),
        uploadBtn: document.getElementById('uploadBtn'),
        fileInput: document.getElementById('fileInput'),
        calculateBtn: document.getElementById('calculateBtn')
    };
}

/**
 * 绑定事件监听器
 * @param {object} elements - DOM元素对象
 */
function bindEventListeners(elements) {
    // 按钮事件
    elements.addBtn.addEventListener('click', addDataPoint);
    elements.clearAllBtn.addEventListener('click', clearAllData);
    elements.loadTestBtn.addEventListener('click', loadTestData);
    elements.uploadBtn.addEventListener('click', handleFileUpload);
    elements.calculateBtn.addEventListener('click', calculateStatistics);
    
    // 文件输入事件
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 键盘事件
    elements.xInput.addEventListener('keypress', handleKeyPress);
    elements.yInput.addEventListener('keypress', handleKeyPress);
}

/**
 * 处理键盘按键事件
 * @param {KeyboardEvent} e - 键盘事件
 */
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        addDataPoint();
    }
}

/**
 * 添加数据点到表格
 */
function addDataPoint() {
    const xInput = document.getElementById('xInput');
    const yInput = document.getElementById('yInput');
    
    // 获取输入值
    const xValue = xInput.value.trim();
    const yValue = yInput.value.trim();
    
    // 验证输入
    if (!validateInput(xValue, yValue)) {
        return;
    }
    
    // 转换为数字
    const x = parseFloat(xValue);
    const y = parseFloat(yValue);
    
    // 添加到数据数组（序号会在updateTable中重新分配）
    dataPoints.push({ x, y });
    
    // 更新表格显示（会重新分配序号）
    updateTable();
    
    // 清空输入框
    xInput.value = '';
    yInput.value = '';
    
    // 聚焦到X输入框
    xInput.focus();
    
    console.log('数据点已添加:', { x, y });
}

/**
 * 验证输入值
 * @param {string} xValue - X值
 * @param {string} yValue - Y值
 * @returns {boolean} 验证是否通过
 */
function validateInput(xValue, yValue) {
    // 检查是否为空
    if (!xValue || !yValue || xValue.trim() === '' || yValue.trim() === '') {
        showAlert('请输入X值和Y值');
        return false;
    }
    
    // 检查是否为有效数字
    const x = parseFloat(xValue);
    const y = parseFloat(yValue);
    
    if (isNaN(x) || isNaN(y)) {
        showAlert('请输入有效的数字');
        return false;
    }
    
    // 检查是否为有限数字
    if (!isFinite(x) || !isFinite(y)) {
        showAlert('请输入有限的数字');
        return false;
    }
    
    return true;
}

/**
 * 显示警告信息
 * @param {string} message - 警告信息
 */
function showAlert(message) {
    alert(message);
    console.warn('用户输入警告:', message);
}

/**
 * 显示成功信息
 * @param {string} message - 成功信息
 */
function showSuccess(message) {
    alert(message);
    console.log('操作成功:', message);
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 * @param {Error} error - 错误对象（可选）
 */
function showError(message, error = null) {
    alert(message);
    console.error('操作错误:', message, error);
}

/**
 * 格式化数字显示
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    return num.toFixed(CONFIG.DECIMAL_PLACES);
}

/**
 * 更新表格显示
 */
function updateTable() {
    const dataTableBody = document.getElementById('dataTableBody');
    
    // 使用文档片段提高性能
    const fragment = document.createDocumentFragment();
    
    // 重新分配序号并添加数据行
    dataPoints.forEach((point, arrayIndex) => {
        const row = createTableRow(point, arrayIndex);
        fragment.appendChild(row);
    });
    
    // 一次性更新DOM
    dataTableBody.innerHTML = '';
    dataTableBody.appendChild(fragment);
    
    console.log(`表格已更新，共${dataPoints.length}个数据点`);
}

/**
 * 创建表格行
 * @param {object} point - 数据点对象
 * @param {number} arrayIndex - 数组索引
 * @returns {HTMLElement} 表格行元素
 */
function createTableRow(point, arrayIndex) {
    const row = document.createElement('tr');
    
    // 序号列
    const indexCell = document.createElement('td');
    indexCell.textContent = arrayIndex + 1; // 直接使用数组索引+1作为序号
    row.appendChild(indexCell);
    
    // X值列
    const xCell = document.createElement('td');
    xCell.className = 'number-cell';
    xCell.textContent = point.x;
    row.appendChild(xCell);
    
    // Y值列
    const yCell = document.createElement('td');
    yCell.className = 'number-cell';
    yCell.textContent = point.y;
    row.appendChild(yCell);
    
    // 删除列
    const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.innerHTML = '✕'; // 黑色叉叉
    deleteBtn.title = '删除此行';
    deleteBtn.onclick = () => deleteDataPoint(arrayIndex);
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);
    
    return row;
}

/**
 * 删除数据点
 * @param {number} arrayIndex - 要删除的数据点在数组中的索引
 */
function deleteDataPoint(arrayIndex) {
    // 从数组中删除
    dataPoints.splice(arrayIndex, 1);
    
    // 重新更新表格
    updateTable();
    
    console.log('数据点已删除，索引:', arrayIndex);
}

/**
 * 清空全部数据
 */
function clearAllData() {
    // 确认对话框
    if (confirm('确定要删除全部数据吗？此操作不可撤销。')) {
        // 清空数据数组
        dataPoints = [];
        isTestDataLoaded = false; // 重置测试数据标记
        
        // 更新表格显示
        updateTable();
        
        console.log('全部数据已清空');
    }
}

/**
 * 加载测试数据
 */
function loadTestData() {
    if (isTestDataLoaded) {
        showAlert('测试数据已经加载过了！');
        return;
    }
    
    // 将测试数据添加到数据数组
    dataPoints = [...testData]; // 使用展开运算符替代slice()
    isTestDataLoaded = true;
    
    // 更新表格显示
    updateTable();
    
    console.log(`测试数据已加载，共${testData.length}个数据点`);
}


/**
 * 计算统计数据
 */
function calculateStatistics() {
    // 检查是否有数据
    if (dataPoints.length === 0) {
        showAlert('请先添加数据点！');
        return;
    }
    
    // 检查数据点数量
    if (dataPoints.length < CONFIG.MIN_DATA_POINTS) {
        showAlert(`至少需要${CONFIG.MIN_DATA_POINTS}个数据点才能计算相关系数！`);
        return;
    }
    
    try {
        // 提取x和y数组
        const xValues = dataPoints.map(point => point.x);
        const yValues = dataPoints.map(point => point.y);
        
        // 计算统计值
        const xMean = calculateMean(xValues);
        const yMean = calculateMean(yValues);
        const xStdDev = calculateStandardDeviation(xValues, xMean);
        const yStdDev = calculateStandardDeviation(yValues, yMean);
        const correlation = calculatePearsonCorrelation(xValues, yValues);
        
        // 更新显示
        updateStatisticsDisplay(xMean, yMean, xStdDev, yStdDev, correlation);
        
        // 渲染散点图
        renderScatterPlot();
        
        console.log('统计计算完成:', {
            xMean, yMean, xStdDev, yStdDev, correlation
        });
        
    } catch (error) {
        showError('计算过程中出现错误，请检查数据！', error);
    }
}

/**
 * 计算均值
 * @param {number[]} values - 数值数组
 * @returns {number} 均值
 */
function calculateMean(values) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

/**
 * 计算标准差
 * @param {number[]} values - 数值数组
 * @param {number} mean - 均值
 * @returns {number} 标准差
 */
function calculateStandardDeviation(values, mean) {
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
}

/**
 * 计算皮尔逊相关系数
 * @param {number[]} x - x轴数据数组
 * @param {number[]} y - y轴数据数组
 * @returns {number} 皮尔逊相关系数
 */
function calculatePearsonCorrelation(x, y) {
    const n = x.length;
    const meanX = calculateMean(x);
    const meanY = calculateMean(y);
    
    let numerator = 0;
    let sumX2 = 0;
    let sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;
        
        numerator += diffX * diffY;
        sumX2 += diffX * diffX;
        sumY2 += diffY * diffY;
    }
    
    const denominator = Math.sqrt(sumX2 * sumY2);
    return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * 更新统计结果显示
 * @param {number} xMean - X均值
 * @param {number} yMean - Y均值
 * @param {number} xStdDev - X标准差
 * @param {number} yStdDev - Y标准差
 * @param {number} correlation - 相关系数
 */
function updateStatisticsDisplay(xMean, yMean, xStdDev, yStdDev, correlation) {
    // 获取DOM元素
    const xMeanElement = document.getElementById('xMean');
    const yMeanElement = document.getElementById('yMean');
    const xStdDevElement = document.getElementById('xStdDev');
    const yStdDevElement = document.getElementById('yStdDev');
    const correlationElement = document.getElementById('correlation');
    
    // 更新显示值（保留指定位数小数）
    xMeanElement.textContent = formatNumber(xMean);
    yMeanElement.textContent = formatNumber(yMean);
    xStdDevElement.textContent = formatNumber(xStdDev);
    yStdDevElement.textContent = formatNumber(yStdDev);
    correlationElement.textContent = formatNumber(correlation);
}

/**
 * 处理文件上传功能
 */
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

/**
 * 处理文件选择
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return; // 用户取消了文件选择
    }
    
    // 检查文件扩展名
    if (!file.name.toLowerCase().endsWith('.json')) {
        showAlert('请选择JSON格式的文件！');
        return;
    }
    
    // 检查文件大小
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showAlert(`文件大小不能超过 ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB！`);
        return;
    }
    
    // 读取文件内容
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // 检查文件是否为空
            if (!content || content.trim() === '') {
                showAlert('文件内容为空！');
                return;
            }
            
            // 解析JSON
            const jsonData = JSON.parse(content);
            
            // 验证数据格式
            if (!Array.isArray(jsonData)) {
                showAlert('JSON文件格式错误！数据应该是一个数组。');
                return;
            }
            
            // 验证每个数据点
            const validDataPoints = [];
            for (let i = 0; i < jsonData.length; i++) {
                const point = jsonData[i];
                
                // 检查数据点结构
                if (!point || typeof point !== 'object') {
                    showAlert(`第${i + 1}个数据点格式错误：应该是对象格式`);
                    return;
                }
                
                // 检查x和y字段
                if (!point.hasOwnProperty('x') || !point.hasOwnProperty('y')) {
                    showAlert(`第${i + 1}个数据点缺少x或y字段`);
                    return;
                }
                
                // 检查x和y是否为数字或可转换为数字的字符串
                const x = parseFloat(point.x);
                const y = parseFloat(point.y);
                
                if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
                    showAlert(`第${i + 1}个数据点的x或y值不是有效数字`);
                    return;
                }
                
                validDataPoints.push({ x: x, y: y });
            }
            
            // 检查是否有有效数据
            if (validDataPoints.length === 0) {
                showAlert('没有找到有效的数据点！');
                return;
            }
            
            // 清空现有数据并加载新数据
            dataPoints.length = 0; // 清空数组
            dataPoints.push(...validDataPoints); // 添加新数据
            
            // 更新表格显示
            updateTable();
            
            // 显示成功消息
            showSuccess(`成功加载${validDataPoints.length}个数据点！`);
            
            console.log('文件上传成功:', validDataPoints);
            
        } catch (error) {
            showError('文件解析失败！请检查JSON格式是否正确。', error);
        }
    };
    
    reader.onerror = function() {
        showError('文件读取失败！');
    };
    
    reader.readAsText(file);
}

/**
 * 渲染散点图
 */
function renderScatterPlot() {
    if (!scatterPlotRenderer) {
        console.warn('Canvas渲染器未初始化');
        return;
    }
    
    if (dataPoints.length === 0) {
        console.warn('没有数据点可以渲染');
        return;
    }
    
    try {
        // 计算回归线
        const regressionLine = scatterPlotRenderer.calculateRegressionLine(dataPoints);
        
        // 渲染散点图
        scatterPlotRenderer.render(dataPoints, regressionLine);
        
        console.log('散点图渲染完成');
        
    } catch (error) {
        showError('散点图渲染失败！', error);
    }
}

// ===== 代码优化总结 =====
/*
优化内容：
1. 添加了配置对象 CONFIG，集中管理常量
2. 重构了初始化代码，提高了可读性和可维护性
3. 添加了工具函数：showAlert, showSuccess, showError, formatNumber
4. 使用 DocumentFragment 提高表格更新性能
5. 统一了错误处理和用户提示
6. 使用现代 JavaScript 语法（展开运算符、模板字符串）
7. 改进了代码注释和文档
8. 添加了文件大小限制
9. 优化了数据验证逻辑
10. 提高了代码的模块化程度
*/
