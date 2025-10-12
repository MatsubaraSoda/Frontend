/**
 * 词频统计应用 - 主逻辑
 */

// 导入测试数据（开发阶段）
import { testData, devHelpers } from './data-dev.js';

// DOM 元素引用
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const summary = document.getElementById('summary');
const totalWords = document.getElementById('totalWords');
const uniqueWords = document.getElementById('uniqueWords');
const avgFrequency = document.getElementById('avgFrequency');
const tableBody = document.getElementById('tableBody');

/**
 * 自动调整 textarea 高度
 */
function autoResizeTextarea() {
    // 重置高度以获取正确的 scrollHeight
    textInput.style.height = 'auto';
    
    // 设置新高度（内容高度）
    const newHeight = textInput.scrollHeight;
    
    // 确保不低于最小高度 (150px)
    textInput.style.height = Math.max(newHeight, 150) + 'px';
}

/**
 * 更新字符计数
 */
function updateCharCount() {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    // 接近上限时改变颜色（CSS 中可以添加相应类）
    if (count > 1800) {
        charCount.style.color = '#f44336'; // 红色警告
    } else if (count > 1500) {
        charCount.style.color = '#ff9800'; // 橙色提示
    } else {
        charCount.style.color = '#333'; // 正常颜色
    }
}

/**
 * 显示消息
 */
function showMessage(message, type = 'error') {
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
    
    // 可以根据类型添加不同样式
    // 这里暂时只用一种样式
}

/**
 * 隐藏消息
 */
function hideMessage() {
    messageBox.classList.add('hidden');
}

/**
 * 清空输入
 */
function clearInput() {
    textInput.value = '';
    updateCharCount();
    autoResizeTextarea();
    hideMessage();
    clearResults();
}

/**
 * 清空结果显示
 */
function clearResults() {
    // 隐藏统计摘要
    summary.classList.add('hidden');
    
    // 恢复空状态显示
    tableBody.innerHTML = `
        <tr class="empty-state">
            <td colspan="4">
                <div class="empty-message">
                    <p>暂无数据</p>
                    <p class="empty-hint">请在上方输入文本并点击"统计词频"按钮</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * 文本预处理 - 清理和标准化文本
 */
function preprocessText(text) {
    // 转换为小写
    let processed = text.toLowerCase();
    
    // 移除标点符号，保留字母、数字和空格
    // 注意：撇号（apostrophe）在英文中很常见，如 don't, it's
    // 这里我们先移除所有标点，简化处理
    processed = processed.replace(/[^\w\s]|_/g, ' ');
    
    // 按空格分词
    const words = processed.split(/\s+/);
    
    // 过滤空字符串
    return words.filter(word => word.length > 0);
}

/**
 * 统计词频
 */
function calculateWordFrequency(words) {
    const frequencyMap = new Map();
    
    // 统计每个单词出现的次数
    words.forEach(word => {
        const count = frequencyMap.get(word) || 0;
        frequencyMap.set(word, count + 1);
    });
    
    // 转换为数组并按频率降序排序
    const frequencyArray = Array.from(frequencyMap.entries())
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);
    
    return frequencyArray;
}

/**
 * 生成频率可视化条形图
 */
function generateFrequencyBar(count, maxCount) {
    // 计算百分比
    const percentage = (count / maxCount) * 100;
    
    // 生成条形图 HTML
    const barWidth = Math.max(percentage, 5); // 最小宽度 5%
    
    return `
        <div class="frequency-bar-container">
            <div class="frequency-bar" style="width: ${barWidth}%"></div>
            <span class="frequency-count">(${count})</span>
        </div>
    `;
}

/**
 * 渲染词频表格
 */
function renderFrequencyTable(frequencyData) {
    // 清空表格内容
    tableBody.innerHTML = '';
    
    if (frequencyData.length === 0) {
        clearResults();
        return;
    }
    
    // 获取最大频率（用于归一化条形图）
    const maxCount = frequencyData[0].count;
    
    // 生成表格行
    frequencyData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-rank">${index + 1}</td>
            <td class="col-word">${item.word}</td>
            <td class="col-count">${item.count}</td>
            <td class="col-visual">${generateFrequencyBar(item.count, maxCount)}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * 更新统计摘要
 */
function updateSummary(words, frequencyData) {
    const totalCount = words.length;
    const uniqueCount = frequencyData.length;
    const avgFreq = uniqueCount > 0 ? (totalCount / uniqueCount).toFixed(2) : 0;
    
    totalWords.textContent = totalCount;
    uniqueWords.textContent = uniqueCount;
    avgFrequency.textContent = avgFreq;
    
    // 显示统计摘要
    summary.classList.remove('hidden');
}

/**
 * 执行词频分析
 */
function analyzeWordFrequency() {
    // 获取输入文本
    const text = textInput.value.trim();
    
    // 验证输入
    if (text === '') {
        showMessage('❌ 请输入要分析的文本！');
        clearResults();
        return;
    }
    
    // 隐藏错误消息
    hideMessage();
    
    // 预处理文本
    const words = preprocessText(text);
    
    // 检查是否有有效单词
    if (words.length === 0) {
        showMessage('❌ 未检测到有效的单词，请输入包含字母的文本！');
        clearResults();
        return;
    }
    
    // 计算词频
    const frequencyData = calculateWordFrequency(words);
    
    // 渲染结果
    renderFrequencyTable(frequencyData);
    updateSummary(words, frequencyData);
    
    // 输出到控制台（便于调试）
    console.log('词频分析完成：');
    console.log('总单词数:', words.length);
    console.log('唯一单词数:', frequencyData.length);
    console.log('前10个高频词:', frequencyData.slice(0, 10));
}

// 事件监听器
textInput.addEventListener('input', () => {
    updateCharCount();
    autoResizeTextarea();
    hideMessage(); // 输入时隐藏错误消息
});

clearBtn.addEventListener('click', clearInput);

analyzeBtn.addEventListener('click', analyzeWordFrequency);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateCharCount();
    autoResizeTextarea();
    console.log('词频统计应用已初始化');
});

// ========== 开发辅助函数 ==========
/**
 * 快速加载测试数据（仅用于开发调试）
 * 使用方法：在控制台输入 loadTestData('simple') 或 loadTest('medium')
 */
window.loadTestData = function(key) {
    const data = testData[key];
    if (data !== undefined) {
        textInput.value = data;
        updateCharCount();
        autoResizeTextarea();
        console.log(`✅ 已加载测试数据: ${key}`);
        console.log(`📝 字符数: ${data.length}`);
    } else {
        console.error(`❌ 测试数据不存在: ${key}`);
        console.log('可用的测试数据:', devHelpers.getTestKeys().join(', '));
    }
};

// 简化版本
window.loadTest = window.loadTestData;

console.log('💡 开发提示：使用 loadTest("simple") 快速加载测试数据');
console.log('💡 可用数据:', devHelpers.getTestKeys().join(', '));

