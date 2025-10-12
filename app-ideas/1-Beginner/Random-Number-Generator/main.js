import { generateSimulationData } from './random.js';
import { createAllCharts, destroyAllCharts } from './plot.js';

// DOM元素引用
const minValueInput = document.getElementById('minValue');
const maxValueInput = document.getElementById('maxValue');
const startButton = document.getElementById('startButton');
const errorMessage = document.getElementById('errorMessage');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const summaryContent = document.getElementById('summaryContent');

// 存储图表实例
let charts = {};

/**
 * 验证用户输入
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {Object} 验证结果
 */
function validateInput(min, max) {
    // 检查是否为整数
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        return {
            valid: false,
            error: '最小值和最大值必须是整数'
        };
    }
    
    // 检查范围
    if (min < 0 || max > 100 || min > 100 || max < 0) {
        return {
            valid: false,
            error: '数值必须在 0 到 100 之间'
        };
    }
    
    // 检查大小关系
    if (min >= max) {
        return {
            valid: false,
            error: '最小值必须小于最大值'
        };
    }
    
    return { valid: true };
}

/**
 * 显示错误信息
 * @param {string} message 错误信息
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * 隐藏错误信息
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * 显示加载状态
 */
function showLoading() {
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    startButton.disabled = true;
    startButton.textContent = 'Simulating...';
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    loadingSection.style.display = 'none';
    startButton.disabled = false;
    startButton.textContent = 'Start Simulation';
}

/**
 * 显示结果
 */
function showResults() {
    resultsSection.style.display = 'block';
}

/**
 * 更新摘要信息
 * @param {Object} summary 摘要数据
 * @param {number} theoreticalAverage 理论期望值
 */
function updateSummary(summary, theoreticalAverage) {
    const summaryHTML = `
        <p><strong>平均值的数学期望为：</strong>${theoreticalAverage.toFixed(4)}</p>
        <p><strong>投掷 1000 次骰子的平均值为：</strong>${summary.simulation1000.finalAverage.toFixed(4)}；与数学期望偏差了：${summary.simulation1000.deviation.toFixed(2)}%</p>
        <p><strong>投掷 5000 次骰子的平均值为：</strong>${summary.simulation5000.finalAverage.toFixed(4)}；与数学期望偏差了：${summary.simulation5000.deviation.toFixed(2)}%</p>
        <p><strong>投掷 10000 次骰子的平均值为：</strong>${summary.simulation10000.finalAverage.toFixed(4)}；与数学期望偏差了：${summary.simulation10000.deviation.toFixed(2)}%</p>
    `;
    
    summaryContent.innerHTML = summaryHTML;
}

/**
 * 开始模拟
 */
async function startSimulation() {
    console.log('开始模拟...');
    
    // 获取输入值
    const minValue = parseInt(minValueInput.value);
    const maxValue = parseInt(maxValueInput.value);
    
    console.log(`输入值: min=${minValue}, max=${maxValue}`);
    
    // 验证输入
    const validation = validateInput(minValue, maxValue);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }
    
    // 隐藏错误信息
    hideError();
    
    // 显示加载状态
    showLoading();
    
    try {
        // 销毁之前的图表
        if (Object.keys(charts).length > 0) {
            destroyAllCharts(charts);
            charts = {};
        }
        
        // 生成模拟数据
        const result = await generateSimulationData(minValue, maxValue);
        
        if (!result.success) {
            showError(result.error);
            return;
        }
        
        console.log('模拟数据生成成功:', result);
        
        // 创建图表
        charts = createAllCharts(result.data, result.theoreticalAverage, minValue, maxValue);
        
        // 更新摘要
        updateSummary(result.summary, result.theoreticalAverage);
        
        // 显示结果
        showResults();
        
        console.log('模拟完成');
        
    } catch (error) {
        console.error('模拟过程中发生错误:', error);
        showError('模拟过程中发生错误，请重试');
    } finally {
        hideLoading();
    }
}

/**
 * 初始化应用
 */
function initializeApp() {
    console.log('初始化应用...');
    
    // 绑定事件监听器
    startButton.addEventListener('click', startSimulation);
    
    // 输入框实时验证
    [minValueInput, maxValueInput].forEach(input => {
        input.addEventListener('input', () => {
            hideError();
        });
    });
    
    // 回车键触发模拟
    [minValueInput, maxValueInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startSimulation();
            }
        });
    });
    
    console.log('应用初始化完成');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeApp);
