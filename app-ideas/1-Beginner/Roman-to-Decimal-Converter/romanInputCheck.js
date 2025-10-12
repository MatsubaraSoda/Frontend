// 罗马数字输入检查模块

// 监听罗马数字输入框的内容变化
function initRomanInputCheck(romanInputElement) {
    if (!romanInputElement) {
        console.error('Roman input element not found');
        return;
    }
    
    // 绑定输入事件监听器
    romanInputElement.addEventListener('input', handleRomanInput);
    
    console.log('Roman input check initialized');
}

// 处理罗马数字输入
function handleRomanInput(event) {
    const input = event.target;
    const cursorPosition = input.selectionStart;
    let value = input.value;
    
    console.log('Roman input changed:', value);
    
    // 1. 只接受 I V X L C D M 等罗马数字符号（大小写不敏感）和 -
    // 包括带横线的字符：V̅, X̅, L̅, C̅, D̅, M̅, V̅̅, X̅̅, L̅̅, C̅̅, D̅̅, M̅̅
    const allowedChars = /^[IVXLCDMivxlcdm\u0305-]*$/;
    
    // 检查是否包含不允许的字符
    if (!allowedChars.test(value)) {
        // 恢复到上次的有效值
        const lastValidValue = input.dataset.lastValidValue || '';
        input.value = lastValidValue;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        console.log('Invalid character detected, restored to:', lastValidValue);
        return;
    }
    
    // 保存当前有效值
    input.dataset.lastValidValue = value;
    
    // 2. 支持小写转大写（只处理纯字母字符）
    let upperValue = value.replace(/[a-z]/g, (match) => match.toUpperCase());
    if (upperValue !== value) {
        input.value = upperValue;
        input.dataset.lastValidValue = upperValue;
        // 恢复光标位置
        setTimeout(() => {
            input.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
        console.log('Converted to uppercase:', upperValue);
        // 更新 value 变量以便后续处理
        value = upperValue;
    }
    
    // 3. 处理 - 符号添加横线功能
    if (value[cursorPosition - 1] === '-') {
        handleDashInput(input, value, cursorPosition);
    }
}

// 处理横线符号输入
function handleDashInput(input, value, cursorPosition) {
    console.log('检测到横线符号，开始处理');
    
    // 不能以横线开头
    if (cursorPosition === 1) {
        removeDashAtStart(input);
        return;
    }
    
    // 检查前一个字符的横线数量
    const lastRomanChar = getLastRomanCharacter(value.substring(0, cursorPosition - 1));
    const overlineCount = (lastRomanChar.match(/\u0305/g) || []).length;
    
    console.log('检查的字符:', JSON.stringify(lastRomanChar), '横线数量:', overlineCount);
    
    // 如果已有两个横线，移除横线符号但不添加新的
    if (overlineCount >= 2) {
        removeDashOnly(input, value, cursorPosition);
        return;
    }
    
    // 将横线符号转换为 Unicode 773
    convertDashToOverline(input, value, cursorPosition);
}

// 移除开头的横线符号
function removeDashAtStart(input) {
    console.log('不能以横线开头，移除');
    const newValue = input.value.substring(1);
    input.value = newValue;
    input.dataset.lastValidValue = newValue;
    input.setSelectionRange(0, 0);
}

// 只移除横线符号，不添加新的横线
function removeDashOnly(input, value, cursorPosition) {
    console.log('字符已有两个横线，不能再添加第三个');
    const newValue = value.substring(0, cursorPosition - 1) + value.substring(cursorPosition);
    input.value = newValue;
    input.dataset.lastValidValue = newValue;
    setTimeout(() => {
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
    }, 0);
}

// 将横线符号转换为 Unicode 773
function convertDashToOverline(input, value, cursorPosition) {
    const unicode773 = '\u0305'; // Unicode 773 横线符号
    const newValue = value.substring(0, cursorPosition - 1) + unicode773 + value.substring(cursorPosition);
    
    input.value = newValue;
    input.dataset.lastValidValue = newValue;
    
    setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
    
    console.log('转换完成:', value, '->', newValue);
}

// 获取最后一个罗马数字字符及其横线
function getLastRomanCharacter(text) {
    let lastRomanChar = '';
    let pos = text.length - 1;
    
    // 先收集所有横线字符
    while (pos >= 0 && text[pos].charCodeAt(0) === 773) { // \u0305
        lastRomanChar = text[pos] + lastRomanChar;
        pos--;
    }
    
    // 然后获取基础罗马数字字符
    if (pos >= 0 && /[IVXLCDM]/.test(text[pos])) {
        lastRomanChar = text[pos] + lastRomanChar;
    }
    
    return lastRomanChar;
}

// 横线映射表定义
const toSingleOverline = {
    'V': 'V̅',
    'X': 'X̅',
    'L': 'L̅',
    'C': 'C̅',
    'D': 'D̅',
    'M': 'M̅'
};

const toDoubleOverline = {
    'V̅': 'V̅̅',
    'X̅': 'X̅̅',
    'L̅': 'L̅̅',
    'C̅': 'C̅̅',
    'D̅': 'D̅̅',
    'M̅': 'M̅̅'
};

// 导出函数
export { initRomanInputCheck, handleRomanInput };