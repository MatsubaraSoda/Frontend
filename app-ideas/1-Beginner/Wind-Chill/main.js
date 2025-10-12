/**
 * 风寒指数计算器
 * 支持公制 (°C, km/h) 和英制 (°F, mph)
 */

// ============================================
// 数据状态管理
// ============================================
let lastCalculation = {
    temperature: null,
    windSpeed: null,
    unit: 'metric'
};

let currentUnit = 'metric'; // 'metric' 或 'imperial'

// ============================================
// 单位转换函数
// ============================================

/**
 * 华氏度转摄氏度
 * @param {number} fahrenheit - 华氏度
 * @returns {number} 摄氏度
 */
function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

/**
 * 摄氏度转华氏度
 * @param {number} celsius - 摄氏度
 * @returns {number} 华氏度
 */
function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32;
}

/**
 * 英里/小时转公里/小时
 * @param {number} mph - 英里/小时
 * @returns {number} 公里/小时
 */
function mphToKmh(mph) {
    return mph * 1.60934;
}

// ============================================
// 核心计算函数
// ============================================

/**
 * 计算风寒指数（公制）
 * 公式: WC = 13.12 + 0.6215T - 11.37V^0.16 + 0.3965TV^0.16
 * @param {number} temp - 温度 (°C)
 * @param {number} windSpeed - 风速 (km/h)
 * @returns {number} 风寒温度 (°C)
 */
function calculateWindChill(temp, windSpeed) {
    const wc = 13.12 + 
               0.6215 * temp - 
               11.37 * Math.pow(windSpeed, 0.16) + 
               0.3965 * temp * Math.pow(windSpeed, 0.16);
    return wc;
}

// ============================================
// 验证函数
// ============================================

/**
 * 验证输入数据
 * @param {number} temp - 温度
 * @param {number} windSpeed - 风速（已转换为公制）
 * @param {string} unit - 单位系统
 * @returns {Array<string>} 错误消息数组
 */
function validateInputs(temp, windSpeed, unit) {
    const errors = [];
    
    // 检查是否为空
    if (temp === '' || temp === null || isNaN(temp)) {
        errors.push('请输入有效的温度值');
        return errors;
    }
    
    if (windSpeed === '' || windSpeed === null || isNaN(windSpeed)) {
        errors.push('请输入有效的风速值');
        return errors;
    }
    
    // 检查风速范围
    if (windSpeed < 0) {
        errors.push('风速不能为负数');
        return errors;
    }
    
    // 风寒公式的有效范围（风速必须 > 4.8 km/h 或 3 mph）
    // windSpeed 这里已经是 km/h
    if (windSpeed < 4.8) {
        const minSpeed = unit === 'metric' ? '4.8 km/h' : '3 mph';
        errors.push(`风速必须大于 ${minSpeed} 才能计算风寒指数`);
        return errors;
    }
    
    return errors;
}

/**
 * 验证计算结果（Bonus 功能）
 * 风寒温度应该总是小于实际温度
 * @param {number} temp - 实际温度
 * @param {number} windChill - 风寒温度
 * @returns {string|null} 错误消息或 null
 */
function validateResult(temp, windChill) {
    if (windChill >= temp) {
        return '计算错误：风寒温度不应高于或等于实际温度';
    }
    return null;
}

/**
 * 检查数据是否发生变化（Bonus 功能）
 * @param {number} temp - 当前温度
 * @param {number} windSpeed - 当前风速
 * @param {string} unit - 单位系统
 * @returns {boolean} 是否发生变化
 */
function isDataChanged(temp, windSpeed, unit) {
    return temp !== lastCalculation.temperature || 
           windSpeed !== lastCalculation.windSpeed ||
           unit !== lastCalculation.unit;
}

/**
 * 检查温度适用范围（给出警告）
 * @param {number} tempCelsius - 温度（摄氏度）
 * @param {string} unit - 单位系统
 * @returns {string|null} 警告消息或 null
 */
function checkTemperatureRange(tempCelsius, unit) {
    if (tempCelsius >= 10) {
        const tempDisplay = unit === 'metric' ? '10°C' : '50°F';
        return `提示：风寒指数通常在温度低于 ${tempDisplay} 时才有意义`;
    }
    return null;
}

// ============================================
// UI 更新函数
// ============================================

/**
 * 更新结果显示
 * @param {number} windChill - 风寒温度
 */
function updateResult(windChill) {
    const resultElement = document.getElementById('wind-chill-value');
    resultElement.textContent = windChill.toFixed(1);
}

/**
 * 清空结果显示
 */
function clearResult() {
    document.getElementById('wind-chill-value').textContent = '--';
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'error', 'warning', 'success'
 */
function showMessage(message, type) {
    const messageBox = document.getElementById('message-box');
    const messageIcon = document.getElementById('message-icon');
    const messageText = document.getElementById('message-text');
    
    // 设置图标
    const icons = {
        error: '❌',
        warning: '⚠️',
        success: '✅'
    };
    
    messageIcon.textContent = icons[type] || 'ℹ️';
    messageText.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'flex';
}

/**
 * 隐藏消息
 */
function hideMessage() {
    const messageBox = document.getElementById('message-box');
    messageBox.style.display = 'none';
}

// ============================================
// 主要业务逻辑
// ============================================

/**
 * 处理计算按钮点击事件
 */
function handleCalculate() {
    // 获取输入值
    const tempInput = document.getElementById('temperature-input');
    const windInput = document.getElementById('wind-speed-input');
    
    let temp = parseFloat(tempInput.value);
    let windSpeed = parseFloat(windInput.value);
    
    // 隐藏之前的消息
    hideMessage();
    
    // 保存原始输入值（用于重复计算检测）
    const originalTemp = temp;
    const originalWindSpeed = windSpeed;
    
    // 如果是英制，转换为公制进行计算
    let tempCelsius, windSpeedKmh;
    if (currentUnit === 'imperial') {
        tempCelsius = fahrenheitToCelsius(temp);
        windSpeedKmh = mphToKmh(windSpeed);
    } else {
        tempCelsius = temp;
        windSpeedKmh = windSpeed;
    }
    
    // 1. 验证输入（使用转换后的公制值）
    const errors = validateInputs(tempCelsius, windSpeedKmh, currentUnit);
    if (errors.length > 0) {
        showMessage(errors[0], 'error');
        clearResult();
        return;
    }
    
    // 2. 检查是否重复计算（Bonus 功能）
    if (!isDataChanged(originalTemp, originalWindSpeed, currentUnit)) {
        showMessage('请先修改温度或风速后再计算', 'warning');
        return;
    }
    
    // 3. 检查温度适用范围（警告但不阻止计算）
    const tempWarning = checkTemperatureRange(tempCelsius, currentUnit);
    
    // 4. 计算风寒指数（使用公制）
    const windChillCelsius = calculateWindChill(tempCelsius, windSpeedKmh);
    
    // 5. 验证结果（Bonus 功能）
    const resultError = validateResult(tempCelsius, windChillCelsius);
    if (resultError) {
        showMessage(resultError, 'error');
        // 使用断言（Bonus 功能要求）
        console.assert(windChillCelsius < tempCelsius, '风寒温度应小于实际温度', {
            实际温度: tempCelsius,
            风寒温度: windChillCelsius,
            风速: windSpeedKmh,
            单位: currentUnit
        });
        clearResult();
        return;
    }
    
    // 6. 转换结果并更新显示
    let windChillDisplay;
    if (currentUnit === 'imperial') {
        // 转换回华氏度
        windChillDisplay = celsiusToFahrenheit(windChillCelsius);
    } else {
        windChillDisplay = windChillCelsius;
    }
    updateResult(windChillDisplay);
    
    // 7. 保存计算状态（保存原始输入值）
    lastCalculation = { 
        temperature: originalTemp, 
        windSpeed: originalWindSpeed,
        unit: currentUnit
    };
    
    // 8. 显示结果消息
    const differenceCelsius = tempCelsius - windChillCelsius;
    const differenceDisplay = currentUnit === 'imperial' 
        ? celsiusToFahrenheit(differenceCelsius) - celsiusToFahrenheit(0)  // 温差转换
        : differenceCelsius;
    
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    let successMessage = `计算完成！体感温度降低了 ${differenceDisplay.toFixed(1)}${unitSymbol}`;
    
    // 如果有温度范围警告，优先显示警告
    if (tempWarning) {
        showMessage(tempWarning, 'warning');
    } else {
        showMessage(successMessage, 'success');
    }
}

/**
 * 处理单位系统切换
 */
function handleUnitChange() {
    const metricRadio = document.getElementById('metric-system');
    const imperialRadio = document.getElementById('imperial-system');
    
    const tempUnit = document.getElementById('temperature-unit');
    const windUnit = document.getElementById('wind-speed-unit');
    const resultUnit = document.getElementById('wind-chill-unit');
    
    // 清空输入框和结果
    document.getElementById('temperature-input').value = '';
    document.getElementById('wind-speed-input').value = '';
    clearResult();
    hideMessage();
    
    // 重置上次计算记录
    lastCalculation = {
        temperature: null,
        windSpeed: null,
        unit: null
    };
    
    if (metricRadio.checked) {
        // 公制单位
        currentUnit = 'metric';
        tempUnit.textContent = '°C';
        windUnit.textContent = 'km/h';
        resultUnit.textContent = '°C';
    } else if (imperialRadio.checked) {
        // 英制单位
        currentUnit = 'imperial';
        tempUnit.textContent = '°F';
        windUnit.textContent = 'mph';
        resultUnit.textContent = '°F';
    }
}

// ============================================
// 事件监听初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('风寒指数计算器已加载');
    
    // 计算按钮
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.addEventListener('click', handleCalculate);
    
    // 关闭消息按钮
    const closeBtn = document.getElementById('message-close');
    closeBtn.addEventListener('click', hideMessage);
    
    // 单位系统切换
    const metricRadio = document.getElementById('metric-system');
    const imperialRadio = document.getElementById('imperial-system');
    metricRadio.addEventListener('change', handleUnitChange);
    imperialRadio.addEventListener('change', handleUnitChange);
    
    // 回车键计算
    const tempInput = document.getElementById('temperature-input');
    const windInput = document.getElementById('wind-speed-input');
    
    tempInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    });
    
    windInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    });
    
    // Bonus 功能：实时计算（可选，目前注释掉）
    // tempInput.addEventListener('input', function() {
    //     if (tempInput.value && windInput.value) {
    //         handleCalculate();
    //     }
    // });
    // windInput.addEventListener('input', function() {
    //     if (tempInput.value && windInput.value) {
    //         handleCalculate();
    //     }
    // });
});

