// 导入转换模块
import { arabicToRoman, romanToArabic } from './convert.js';
import { initRomanInputCheck } from './romanInputCheck.js';

// DOM 元素引用
const elements = {
    // 阿拉伯数字转罗马数字
    arabicInput: null,
    convertToRomanBtn: null,
    romanOutput: null,
    copyRomanBtn: null,
    
    // 罗马数字转阿拉伯数字
    romanInput: null,
    convertToArabicBtn: null,
    arabicOutput: null,
    copyArabicBtn: null,
    
    // 消息提示
    errorMessage: null,
    errorText: null,
    closeErrorBtn: null,
    successMessage: null,
    successText: null
};

// 初始化函数
function init() {
    // 获取 DOM 元素
    elements.arabicInput = document.getElementById('arabicInput');
    elements.convertToRomanBtn = document.getElementById('convertToRoman');
    elements.romanOutput = document.getElementById('romanOutput');
    elements.copyRomanBtn = document.getElementById('copyRomanResult');
    
    elements.romanInput = document.getElementById('romanInput');
    elements.convertToArabicBtn = document.getElementById('convertToArabic');
    elements.arabicOutput = document.getElementById('arabicOutput');
    elements.copyArabicBtn = document.getElementById('copyArabicResult');
    
    elements.errorMessage = document.getElementById('errorMessage');
    elements.errorText = document.getElementById('errorText');
    elements.closeErrorBtn = document.getElementById('closeError');
    elements.successMessage = document.getElementById('successMessage');
    elements.successText = document.getElementById('successText');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化用户体验优化
    initUserExperience();
    
    // 添加数字输入格式化
    formatNumberInput(elements.arabicInput);
    
    console.log('罗马数字转换器已初始化');
}

// 绑定事件监听器
function bindEventListeners() {
    // 阿拉伯数字转罗马数字 - 转换按钮点击
    if (elements.convertToRomanBtn) {
        elements.convertToRomanBtn.addEventListener('click', handleArabicToRoman);
    }
    
    // 阿拉伯数字输入框 - Enter 键
    if (elements.arabicInput) {
        elements.arabicInput.addEventListener('keypress', handleArabicKeyPress);
    }
    
    // 罗马数字转阿拉伯数字 - 转换按钮点击
    if (elements.convertToArabicBtn) {
        elements.convertToArabicBtn.addEventListener('click', handleRomanToArabic);
    }
    
    // 罗马数字输入框 - Enter 键
    if (elements.romanInput) {
        elements.romanInput.addEventListener('keypress', handleRomanKeyPress);
    }
    
    // 初始化罗马数字输入检查
    if (elements.romanInput) {
        initRomanInputCheck(elements.romanInput);
    }
    
    // 复制按钮 - 罗马数字结果
    if (elements.copyRomanBtn) {
        elements.copyRomanBtn.addEventListener('click', handleCopyRomanResult);
    }
    
    // 复制按钮 - 阿拉伯数字结果
    if (elements.copyArabicBtn) {
        elements.copyArabicBtn.addEventListener('click', handleCopyArabicResult);
    }
    
    // 错误提示关闭按钮
    if (elements.closeErrorBtn) {
        elements.closeErrorBtn.addEventListener('click', hideError);
    }
}

// 事件处理函数实现

// 阿拉伯数字转罗马数字处理函数
function handleArabicToRoman() {
    try {
        const inputValue = elements.arabicInput.value.trim();
        
        if (!inputValue) {
            showError('请输入阿拉伯数字');
            return;
        }
        
        const arabicNumber = parseInt(inputValue, 10);
        
        if (isNaN(arabicNumber)) {
            showError('请输入有效的阿拉伯数字');
            return;
        }
        
        const romanResult = arabicToRoman(arabicNumber);
        
        if (!romanResult) {
            showError(`数字 ${arabicNumber} 超出转换范围（1-999,999,999）`);
            return;
        }
        
        elements.romanOutput.value = romanResult;
        showSuccess(`成功转换：${arabicNumber} → ${romanResult}`);
        
    } catch (error) {
        console.error('阿拉伯数字转罗马数字错误:', error);
        showError('转换过程中发生错误，请重试');
    }
}

// 阿拉伯数字输入框按键处理
function handleArabicKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleArabicToRoman();
    }
}

// 罗马数字转阿拉伯数字处理函数
function handleRomanToArabic() {
    try {
        const inputValue = elements.romanInput.value.trim();
        
        if (!inputValue) {
            showError('请输入罗马数字');
            return;
        }
        
        const arabicResult = romanToArabic(inputValue);
        
        if (arabicResult === 0) {
            showError(`"${inputValue}" 不是有效的罗马数字或超出转换范围（1-999,999,999）`);
            return;
        }
        
        elements.arabicOutput.value = arabicResult;
        showSuccess(`成功转换：${inputValue} → ${arabicResult}`);
        
    } catch (error) {
        console.error('罗马数字转阿拉伯数字错误:', error);
        showError('转换过程中发生错误，请重试');
    }
}

// 罗马数字输入框按键处理
function handleRomanKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleRomanToArabic();
    }
}

// 复制罗马数字结果
function handleCopyRomanResult() {
    try {
        const result = elements.romanOutput.value;
        
        if (!result) {
            showError('没有可复制的内容');
            return;
        }
        
        navigator.clipboard.writeText(result).then(() => {
            showSuccess(`已复制罗马数字：${result}`);
        }).catch((error) => {
            console.error('复制失败:', error);
            // 降级方案：使用传统的复制方法
            fallbackCopyToClipboard(result);
        });
        
    } catch (error) {
        console.error('复制罗马数字错误:', error);
        showError('复制失败，请手动选择复制');
    }
}

// 复制阿拉伯数字结果
function handleCopyArabicResult() {
    try {
        const result = elements.arabicOutput.value;
        
        if (!result) {
            showError('没有可复制的内容');
            return;
        }
        
        navigator.clipboard.writeText(result).then(() => {
            showSuccess(`已复制阿拉伯数字：${result}`);
        }).catch((error) => {
            console.error('复制失败:', error);
            // 降级方案：使用传统的复制方法
            fallbackCopyToClipboard(result);
        });
        
    } catch (error) {
        console.error('复制阿拉伯数字错误:', error);
        showError('复制失败，请手动选择复制');
    }
}

// 降级复制方案（兼容旧浏览器）
function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showSuccess(`已复制：${text}`);
        } else {
            showError('复制失败，请手动选择复制');
        }
    } catch (error) {
        console.error('降级复制方案失败:', error);
        showError('复制失败，请手动选择复制');
    }
}

// 显示错误消息
function showError(message) {
    if (!elements.errorMessage || !elements.errorText) {
        console.error('错误消息元素未找到');
        return;
    }
    
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'flex';
    
    // 隐藏成功消息（如果正在显示）
    hideSuccess();
    
    // 3秒后自动隐藏错误消息
    setTimeout(() => {
        hideError();
    }, 3000);
}

// 隐藏错误消息
function hideError() {
    if (elements.errorMessage) {
        elements.errorMessage.style.display = 'none';
    }
}

// 显示成功消息
function showSuccess(message) {
    if (!elements.successMessage || !elements.successText) {
        console.error('成功消息元素未找到');
        return;
    }
    
    elements.successText.textContent = message;
    elements.successMessage.style.display = 'flex';
    
    // 隐藏错误消息（如果正在显示）
    hideError();
    
    // 2秒后自动隐藏成功消息
    setTimeout(() => {
        hideSuccess();
    }, 2000);
}

// 隐藏成功消息
function hideSuccess() {
    if (elements.successMessage) {
        elements.successMessage.style.display = 'none';
    }
}

// 初始化用户体验优化
function initUserExperience() {
    // 设置输入框的初始状态
    if (elements.arabicInput) {
        elements.arabicInput.placeholder = '请输入数字（1-999,999,999）';
    }
    
    if (elements.romanInput) {
        elements.romanInput.placeholder = '请输入罗马数字（例如：IV, MV̅）';
    }
    
    // 添加输入框焦点效果
    addInputFocusEffects();
    
    // 添加按钮悬停效果
    addButtonHoverEffects();
    
    // 添加键盘快捷键提示
    addKeyboardShortcuts();
}

// 添加输入框焦点效果
function addInputFocusEffects() {
    const inputs = [elements.arabicInput, elements.romanInput];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#3498db';
                input.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '#ddd';
                input.style.boxShadow = 'none';
            });
        }
    });
}

// 添加按钮悬停效果
function addButtonHoverEffects() {
    const buttons = [
        elements.convertToRomanBtn,
        elements.convertToArabicBtn,
        elements.copyRomanBtn,
        elements.copyArabicBtn
    ];
    
    buttons.forEach(button => {
        if (button) {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        }
    });
}

// 添加键盘快捷键
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl+1: 聚焦到阿拉伯数字输入框
        if (event.ctrlKey && event.key === '1') {
            event.preventDefault();
            if (elements.arabicInput) {
                elements.arabicInput.focus();
            }
        }
        
        // Ctrl+2: 聚焦到罗马数字输入框
        if (event.ctrlKey && event.key === '2') {
            event.preventDefault();
            if (elements.romanInput) {
                elements.romanInput.focus();
            }
        }
        
        // Ctrl+Enter: 根据当前焦点执行转换
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            const activeElement = document.activeElement;
            
            if (activeElement === elements.arabicInput) {
                handleArabicToRoman();
            } else if (activeElement === elements.romanInput) {
                handleRomanToArabic();
            }
        }
    });
}

// 清空输入框
function clearInputs() {
    if (elements.arabicInput) {
        elements.arabicInput.value = '';
    }
    if (elements.romanInput) {
        elements.romanInput.value = '';
    }
    if (elements.romanOutput) {
        elements.romanOutput.value = '';
    }
    if (elements.arabicOutput) {
        elements.arabicOutput.value = '';
    }
    
    hideError();
    hideSuccess();
}

// 自动格式化数字输入
function formatNumberInput(input) {
    if (!input) return;
    
    input.addEventListener('input', (event) => {
        let value = event.target.value;
        
        // 移除非数字字符
        value = value.replace(/[^\d]/g, '');
        
        // 限制最大长度
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        
        event.target.value = value;
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);