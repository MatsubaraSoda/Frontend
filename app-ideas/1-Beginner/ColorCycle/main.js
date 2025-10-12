// 获取DOM元素
const rgbRadio = document.querySelector('input[value="rgb"]');
const hslRadio = document.querySelector('input[value="hsl"]');
const rgbInputGroup = document.querySelector('#inputGroupRgb');
const hslInputGroup = document.querySelector('#inputGroupHsl');

// 获取控制元素
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const colorRectangle = document.getElementById('colorRectangle');
const colorInterval = document.getElementById('colorInterval');

// 获取RGB输入框
const redComponent = document.getElementById('redComponent');
const greenComponent = document.getElementById('greenComponent');
const blueComponent = document.getElementById('blueComponent');

// 获取HSL输入框
const hueComponent = document.getElementById('hueComponent');
const saturationComponent = document.getElementById('saturationComponent');
const lightnessComponent = document.getElementById('lightnessComponent');

// 获取增量输入框
const firstIncrement = document.getElementById('firstIncrement');
const secondIncrement = document.getElementById('secondIncrement');
const thirdIncrement = document.getElementById('thirdIncrement');

// 全局变量
let colorTimer = null;
let currentRed = 255;
let currentGreen = 255;
let currentBlue = 255;
let currentHue = 0;
let currentSaturation = 100;
let currentLightness = 50;

// 初始化显示状态
function initializeDisplay() {
    // 默认显示RGB输入框组，隐藏HSL输入框组
    rgbInputGroup.style.display = 'block';
    hslInputGroup.style.display = 'none';
}

// 切换显示函数
function toggleInputGroups() {
    if (rgbRadio.checked) {
        // 选择RGB时，显示RGB输入框组，隐藏HSL输入框组
        rgbInputGroup.style.display = 'block';
        hslInputGroup.style.display = 'none';
    } else if (hslRadio.checked) {
        // 选择HSL时，显示HSL输入框组，隐藏RGB输入框组
        rgbInputGroup.style.display = 'none';
        hslInputGroup.style.display = 'block';
    }
}

// 验证十六进制输入
function isValidHex(value) {
    return /^[0-9a-fA-F]+$/.test(value);
}

// 验证RGB组件值
function validateRGBComponent(value) {
    if (!value) return true; // 空值使用默认值
    
    // 检查是否为负数
    if (value.startsWith('-')) return false;
    
    // 检查是否为有效的十六进制
    if (!isValidHex(value)) return false;
    
    // 自动补零处理
    const paddedValue = value.length === 1 ? value + value : value;
    
    // 检查范围（00-ff）
    const decimalValue = parseInt(paddedValue, 16);
    return decimalValue >= 0 && decimalValue <= 255;
}

// 验证HSL组件值
function validateHSLComponent(value, maxValue) {
    if (!value) return true; // 空值使用默认值
    
    // 检查是否为负数
    if (value.startsWith('-')) return false;
    
    // 检查是否为有效数字
    const num = parseInt(value);
    if (isNaN(num)) return false;
    
    // 检查范围
    return num >= 0 && num <= maxValue;
}

// 验证增量值
function validateIncrement(value) {
    if (!value) return true; // 空值使用默认值
    
    // 检查是否为负数
    if (value.startsWith('-')) return false;
    
    // 检查是否为有效数字
    const num = parseInt(value);
    if (isNaN(num)) return false;
    
    // 检查范围（0-999）
    return num >= 0 && num <= 999;
}

// 输入验证主函数
function validateInputs() {
    // 验证RGB组件
    if (!validateRGBComponent(redComponent.value) ||
        !validateRGBComponent(greenComponent.value) ||
        !validateRGBComponent(blueComponent.value)) {
        alert("RGB值无效");
        return false;
    }
    
    // 验证HSL组件
    if (!validateHSLComponent(hueComponent.value, 360) ||
        !validateHSLComponent(saturationComponent.value, 100) ||
        !validateHSLComponent(lightnessComponent.value, 100)) {
        alert("HSL值无效");
        return false;
    }
    
    // 验证增量值
    if (!validateIncrement(firstIncrement.value) ||
        !validateIncrement(secondIncrement.value) ||
        !validateIncrement(thirdIncrement.value)) {
        alert("增量值无效");
        return false;
    }
    
    return true;
}

// 十六进制转十进制
function hexToDec(hex) {
    return parseInt(hex, 16);
}

// 十进制转十六进制
function decToHex(dec) {
    return dec.toString(16).padStart(2, '0');
}

// 更新颜色显示
function updateColor() {
    if (rgbRadio.checked) {
        // RGB模式
        const color = `#${decToHex(currentRed)}${decToHex(currentGreen)}${decToHex(currentBlue)}`;
        colorRectangle.style.backgroundColor = color;
    } else if (hslRadio.checked) {
        // HSL模式
        const color = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
        colorRectangle.style.backgroundColor = color;
    }
}

// 颜色增量变化
function cycleColor() {
    if (rgbRadio.checked) {
        // RGB模式
        // 获取增量值
        const redInc = hexToDec(firstIncrement.value || '1');
        const greenInc = hexToDec(secondIncrement.value || '1');
        const blueInc = hexToDec(thirdIncrement.value || '1');
        
        // 更新颜色值（循环处理）
        currentRed = (currentRed + redInc) % 256;
        currentGreen = (currentGreen + greenInc) % 256;
        currentBlue = (currentBlue + blueInc) % 256;
    } else if (hslRadio.checked) {
        // HSL模式
        // 获取增量值
        const hueInc = parseInt(firstIncrement.value || '1');
        const saturationInc = parseInt(secondIncrement.value || '1');
        const lightnessInc = parseInt(thirdIncrement.value || '1');
        
        // 更新颜色值（循环处理）
        currentHue = (currentHue + hueInc) % 360;
        currentSaturation = (currentSaturation + saturationInc) % 101;
        currentLightness = (currentLightness + lightnessInc) % 101;
    }
    
    // 更新显示
    updateColor();
}

// 开始颜色循环
function startColorCycle() {
    // 验证输入
    if (!validateInputs()) {
        return; // 验证失败，不启动
    }
    
    if (rgbRadio.checked) {
        // RGB模式
        // 获取初始颜色值
        currentRed = hexToDec(redComponent.value || 'ff');
        currentGreen = hexToDec(greenComponent.value || 'ff');
        currentBlue = hexToDec(blueComponent.value || 'ff');
    } else if (hslRadio.checked) {
        // HSL模式
        // 获取初始颜色值
        currentHue = parseInt(hueComponent.value || '0');
        currentSaturation = parseInt(saturationComponent.value || '100');
        currentLightness = parseInt(lightnessComponent.value || '50');
    }
    
    // 获取时间间隔（秒转毫秒）
    const interval = parseFloat(colorInterval.value || '0.25') * 1000;
    
    // 开始定时器
    colorTimer = setInterval(cycleColor, interval);
    
    // 禁用开始按钮
    startButton.disabled = true;
}

// 停止颜色循环
function stopColorCycle() {
    if (colorTimer) {
        clearInterval(colorTimer);
        colorTimer = null;
    }
    
    // 恢复默认白色
    colorRectangle.style.backgroundColor = 'white';
    
    // 启用开始按钮
    startButton.disabled = false;
}

// 添加事件监听器
function addEventListeners() {
    // 监听RGB单选按钮变化
    rgbRadio.addEventListener('change', toggleInputGroups);
    
    // 监听HSL单选按钮变化
    hslRadio.addEventListener('change', toggleInputGroups);
    
    // 监听开始按钮
    startButton.addEventListener('click', startColorCycle);
    
    // 监听停止按钮
    stopButton.addEventListener('click', stopColorCycle);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeDisplay();
    addEventListeners();
});
