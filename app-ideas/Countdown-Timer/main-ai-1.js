// 倒计时器 JavaScript 文件
// 这是一个适合新手学习的项目，包含详细的中文注释

// ==================== 全局变量定义 ====================
let countdownInterval = null; // 存储倒计时定时器的ID
let currentTab = 1; // 当前选中的标签页（1-5）
let countdowns = []; // 存储5个倒计时的数据

// 获取DOM元素
const countdownForm = document.getElementById('countdownForm');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const eventTimeInput = document.getElementById('eventTime');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const currentEventTitle = document.getElementById('currentEventTitle');

// 倒计时显示元素
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// 标签页元素
const tabButtons = document.querySelectorAll('.tab');

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 设置默认日期为明天
    setDefaultDate();
    
    // 从本地存储加载倒计时数据
    loadCountdownsFromStorage();
    
    // 绑定事件监听器
    bindEventListeners();
    
    console.log('初始化完成！');
});

// ==================== 工具函数 ====================

/**
 * 设置默认日期为今天
 * 如果无法获取当前日期，则设置为2000年1月1日
 */
function setDefaultDate() {
    try {
        const today = new Date();
        // 不需要修改日期，直接使用今天
        
        // 格式化为 YYYY-MM-DD 格式
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const defaultDate = `${year}-${month}-${day}`;
        
        eventDateInput.value = defaultDate;
        console.log('设置默认日期为今天:', defaultDate);
    } catch (error) {
        // 如果出错，设置为2000年1月1日
        eventDateInput.value = '2000-01-01';
        console.log('设置默认日期为2000年1月1日');
    }
}

/**
 * 格式化数字，为时、分、秒添加前导零
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串（2位数字）
 */
function formatTimeNumber(num) {
    return String(num).padStart(2, '0');
}

/**
 * 格式化天数，不添加前导零，但预留5个字符宽度
 * @param {number} days - 天数
 * @returns {string} 格式化后的字符串
 */
function formatDays(days) {
    return String(days).padStart(5, ' ');
}

/**
 * 验证事件名称
 * @param {string} name - 事件名称
 * @returns {boolean} 是否有效
 */
function validateEventName(name) {
    if (!name || name.trim() === '') {
        alert('请输入事件名称！');
        return false;
    }
    
    // 检查长度（半角1字符，全角2字符）
    let charCount = 0;
    for (let i = 0; i < name.length; i++) {
        // 判断是否为全角字符（包括中文）
        if (name.charCodeAt(i) > 127) {
            charCount += 2;
        } else {
            charCount += 1;
        }
    }
    
    if (charCount > 16) {
        alert('事件名称长度不能超过16个字符！');
        return false;
    }
    
    return true;
}

/**
 * 验证日期
 * @param {string} dateStr - 日期字符串
 * @returns {boolean} 是否有效
 */
function validateDate(dateStr) {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    
    // 重置时间为00:00:00进行比较
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // 检查是否为过去日期
    if (selectedDate < today) {
        alert('不能选择过去的日期！');
        return false;
    }
    
    // 检查日期范围
    const minDate = new Date('2000-01-01');
    const maxDate = new Date('2099-12-31');
    
    if (selectedDate < minDate || selectedDate > maxDate) {
        alert('日期必须在2000年1月1日到2099年12月31日之间！');
        return false;
    }
    
    return true;
}

/**
 * 计算倒计时时间差
 * @param {Date} targetDate - 目标日期
 * @returns {object} 包含天、时、分、秒的对象
 */
function calculateTimeDifference(targetDate) {
    const now = new Date();
    const difference = targetDate - now;
    
    if (difference <= 0) {
        // 时间已到
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    // 计算天、时、分、秒
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
}

/**
 * 更新倒计时显示
 * @param {object} timeObj - 时间对象
 */
function updateCountdownDisplay(timeObj) {
    daysElement.textContent = formatDays(timeObj.days);
    hoursElement.textContent = formatTimeNumber(timeObj.hours);
    minutesElement.textContent = formatTimeNumber(timeObj.minutes);
    secondsElement.textContent = formatTimeNumber(timeObj.seconds);
}

/**
 * 重置倒计时显示为0
 */
function resetCountdownDisplay() {
    daysElement.textContent = formatDays(0);
    hoursElement.textContent = formatTimeNumber(0);
    minutesElement.textContent = formatTimeNumber(0);
    secondsElement.textContent = formatTimeNumber(0);
}

/**
 * 重置表单到默认状态
 */
function resetForm() {
    eventNameInput.value = '';
    setDefaultDate();
    eventTimeInput.value = '';
    currentEventTitle.textContent = '事件倒计时';
}

// ==================== 倒计时控制函数 ====================

/**
 * 开始倒计时
 * @param {string} eventName - 事件名称
 * @param {Date} targetDate - 目标日期
 */
function startCountdown(eventName, targetDate) {
    // 清除之前的定时器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 更新事件标题
    currentEventTitle.textContent = `距离 ${eventName} 还剩：`;
    
    // 创建定时器，每秒更新一次
    countdownInterval = setInterval(function() {
        const timeObj = calculateTimeDifference(targetDate);
        updateCountdownDisplay(timeObj);
        
        // 检查是否倒计时结束
        if (timeObj.days === 0 && timeObj.hours === 0 && 
            timeObj.minutes === 0 && timeObj.seconds === 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            alert(`${eventName} 时间到了！`);
        }
    }, 1000);
    
    console.log('倒计时已开始:', eventName);
}

/**
 * 停止倒计时
 */
function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        console.log('倒计时已停止');
    }
    
    resetCountdownDisplay();
    resetForm();
}

// ==================== 本地存储相关函数 ====================

/**
 * 保存倒计时数据到本地存储
 */
function saveCountdownsToStorage() {
    try {
        localStorage.setItem('countdowns', JSON.stringify(countdowns));
        console.log('倒计时数据已保存到本地存储');
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

/**
 * 从本地存储加载倒计时数据
 */
function loadCountdownsFromStorage() {
    try {
        const savedData = localStorage.getItem('countdowns');
        if (savedData) {
            countdowns = JSON.parse(savedData);
            console.log('从本地存储加载倒计时数据:', countdowns);
        } else {
            // 初始化5个空的倒计时
            countdowns = Array(5).fill(null);
            console.log('初始化5个空的倒计时');
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        countdowns = Array(5).fill(null);
    }
}

// ==================== 标签页相关函数 ====================

/**
 * 切换标签页
 * @param {number} tabIndex - 标签页索引（1-5）
 */
function switchTab(tabIndex) {
    // 更新当前标签页
    currentTab = tabIndex;
    
    // 更新标签页样式
    tabButtons.forEach((tab, index) => {
        if (index + 1 === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // 加载对应标签页的数据
    loadTabData(tabIndex);
    
    console.log('切换到标签页:', tabIndex);
}

/**
 * 加载标签页数据
 * @param {number} tabIndex - 标签页索引
 */
function loadTabData(tabIndex) {
    const countdownData = countdowns[tabIndex - 1];
    
    if (countdownData) {
        // 如果有保存的数据，填充表单
        eventNameInput.value = countdownData.eventName || '';
        eventDateInput.value = countdownData.eventDate || '';
        eventTimeInput.value = countdownData.eventTime || '';
        currentEventTitle.textContent = countdownData.eventName || '事件倒计时';
        
        // 更新标签页标题
        const tabButton = document.querySelector(`[data-tab="${tabIndex}"]`);
        if (tabButton) {
            tabButton.textContent = countdownData.eventName || `倒计时${tabIndex}`;
        }
    } else {
        // 如果没有数据，重置表单
        resetForm();
        
        // 更新标签页标题
        const tabButton = document.querySelector(`[data-tab="${tabIndex}"]`);
        if (tabButton) {
            tabButton.textContent = `倒计时${tabIndex}`;
        }
    }
}

// ==================== 事件监听器绑定 ====================

/**
 * 绑定所有事件监听器
 */
function bindEventListeners() {
    // 表单提交事件（开始倒计时）
    countdownForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        
        const eventName = eventNameInput.value.trim();
        const eventDate = eventDateInput.value;
        const eventTime = eventTimeInput.value;
        
        // 验证输入
        if (!validateEventName(eventName)) return;
        if (!validateDate(eventDate)) return;
        
        // 构建目标日期
        let targetDate = new Date(eventDate);
        if (eventTime) {
            // 如果有时间，添加到日期中
            const [hours, minutes] = eventTime.split(':');
            targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            // 如果没有时间，设置为00:00
            targetDate.setHours(0, 0, 0, 0);
        }
        
        // 保存倒计时数据
        const countdownData = {
            eventName: eventName,
            eventDate: eventDate,
            eventTime: eventTime,
            targetDate: targetDate.toISOString()
        };
        
        countdowns[currentTab - 1] = countdownData;
        saveCountdownsToStorage();
        
        // 更新标签页标题
        const tabButton = document.querySelector(`[data-tab="${currentTab}"]`);
        if (tabButton) {
            tabButton.textContent = eventName;
        }
        
        // 开始倒计时
        startCountdown(eventName, targetDate);
    });
    
    // 停止按钮事件
    stopBtn.addEventListener('click', function() {
        stopCountdown();
        
        // 清除当前标签页的数据
        countdowns[currentTab - 1] = null;
        saveCountdownsToStorage();
        
        // 重置标签页标题
        const tabButton = document.querySelector(`[data-tab="${currentTab}"]`);
        if (tabButton) {
            tabButton.textContent = `倒计时${currentTab}`;
        }
    });
    
    // 标签页点击事件
    tabButtons.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // 停止当前倒计时
            stopCountdown();
            
            // 切换到新标签页
            switchTab(index + 1);
        });
    });
    
    console.log('所有事件监听器已绑定');
}

// ==================== 页面卸载时的清理 ====================
window.addEventListener('beforeunload', function() {
    // 页面关闭前保存数据
    saveCountdownsToStorage();
    
    // 清除定时器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

console.log('JavaScript文件加载完成！');

