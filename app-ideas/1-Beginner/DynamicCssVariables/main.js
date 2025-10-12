// 动态CSS变量登录表单 - JavaScript实现

// 常量定义
const VALID_CREDENTIALS = { 
    userId: 'testuser', 
    password: 'mypassword' 
};

// 状态管理
let formState = { 
    userId: { value: '', status: 'default' }, 
    password: { value: '', status: 'default' } 
};

// 防抖定时器
let debounceTimer = null;

// 核心函数

/**
 * 验证输入值（实时验证）
 * @param {string} value - 输入值
 * @param {string} type - 输入类型 ('userId' | 'password')
 * @returns {object} 验证结果 {status, message}
 */
function validateInput(value, type) {
    if (!value.trim()) {
        return { status: 'error', message: '不能为空' };
    }
    
    if (value.includes(' ')) {
        return { status: 'warning', message: '不能包含空格' };
    }
    
    // 实时验证只检查格式，不检查内容匹配
    return { status: 'default', message: '' };
}

/**
 * 验证登录凭据（提交时验证）
 * @param {string} userId - 用户ID
 * @param {string} password - 密码
 * @returns {object} 验证结果 {isValid, message}
 */
function validateCredentials(userId, password) {
    const isUserIdValid = userId === VALID_CREDENTIALS.userId;
    const isPasswordValid = password === VALID_CREDENTIALS.password;
    
    if (isUserIdValid && isPasswordValid) {
        return { isValid: true, message: '' };
    } else {
        return { isValid: false, message: '账号或密码错误，请重新输入。' };
    }
}

/**
 * 更新输入框状态
 * @param {HTMLElement} inputElement - 输入框元素
 * @param {string} status - 状态 ('default' | 'warning' | 'error')
 */
function updateInputStatus(inputElement, status) {
    inputElement.classList.remove('input-warning', 'input-error');
    if (status !== 'default') {
        inputElement.classList.add(`input-${status}`);
    }
}

/**
 * 显示或隐藏错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    const errorElement = document.getElementById('loginError');
    errorElement.textContent = message;
    errorElement.classList.toggle('show', !!message);
}

/**
 * 重置表单
 */
function resetForm() {
    ['userId', 'password'].forEach(id => {
        const input = document.getElementById(id);
        input.value = '';
        updateInputStatus(input, 'default');
        formState[id].value = '';
        formState[id].status = 'default';
    });
    showErrorMessage('');
}

/**
 * 处理输入事件（带防抖）
 * @param {Event} event - 输入事件
 */
function handleInput(event) {
    const input = event.target;
    const type = input.id;
    const value = input.value;
    
    // 清除之前的定时器
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    // 设置新的定时器（300ms防抖）
    debounceTimer = setTimeout(() => {
        const validation = validateInput(value, type);
        
        // 更新状态
        formState[type].value = value;
        formState[type].status = validation.status;
        
        // 更新视觉状态
        updateInputStatus(input, validation.status);
        
        // 如果是错误状态，显示错误消息
        if (validation.status === 'error') {
            showErrorMessage(validation.message);
        } else if (validation.status === 'warning') {
            showErrorMessage(validation.message);
        } else {
            // 如果两个输入框都验证通过，隐藏错误消息
            if (formState.userId.status === 'default' && formState.password.status === 'default') {
                showErrorMessage('');
            }
        }
    }, 300);
}

/**
 * 处理表单提交
 * @param {Event} event - 提交事件
 */
function handleSubmit(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    
    // 先进行格式验证
    const userIdValidation = validateInput(userId, 'userId');
    const passwordValidation = validateInput(password, 'password');
    
    // 更新状态和视觉反馈
    formState.userId.status = userIdValidation.status;
    formState.password.status = passwordValidation.status;
    
    updateInputStatus(document.getElementById('userId'), userIdValidation.status);
    updateInputStatus(document.getElementById('password'), passwordValidation.status);
    
    // 如果有格式错误，显示相应的错误消息
    if (userIdValidation.status !== 'default' || passwordValidation.status !== 'default') {
        const errorMessage = userIdValidation.status !== 'default' ? 
            userIdValidation.message : passwordValidation.message;
        showErrorMessage(errorMessage);
        return;
    }
    
    // 格式验证通过后，进行凭据验证
    const credentialsValidation = validateCredentials(userId, password);
    
    if (credentialsValidation.isValid) {
        // 登录成功
        showSuccessMessage('登录成功！');
        setTimeout(() => {
            resetForm();
        }, 2000);
    } else {
        // 显示凭据错误消息
        showErrorMessage(credentialsValidation.message);
    }
}

/**
 * 处理取消按钮
 */
function handleCancel() {
    resetForm();
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccessMessage(message) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = 'status-message show success';
}

/**
 * 初始化应用
 */
function init() {
    // 获取DOM元素
    const form = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // 绑定事件
    userIdInput.addEventListener('input', handleInput);
    passwordInput.addEventListener('input', handleInput);
    form.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    
    // 添加焦点事件，清除错误状态
    [userIdInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            // 聚焦时清除错误状态，但保留警告状态
            if (formState[input.id].status === 'error') {
                updateInputStatus(input, 'default');
                formState[input.id].status = 'default';
            }
        });
    });
    
    console.log('动态CSS变量登录表单已初始化');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
