// 倒计时器 JavaScript 文件

// ==================== 全局变量定义 ====================
let countdownInterval = Array(5).fill(null);
let currentTab = 1;
let countdownsData = Array(5).fill({});

// 获取DOM元素
const countdownForm = document.getElementById('countdownForm');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const eventTimeInput = document.getElementById('eventTime');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// 倒计时显示元素
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// 当前选中的标签页
const countdownTabs = document.getElementById('countdownTabs');

// 日期范围约束
const minDate = new Date('2000-01-01' + 'T00:00:00+08:00');
const maxDate = new Date('2099-12-31' + 'T23:59:59+08:00');

// 主题切换按钮
const themeToggle = document.getElementById('themeToggle');

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
    // 设置输入字段的默认值
    resetForm();

    // 绑定事件监听器
    bindEventListeners();
});

// ==================== 工具函数 ====================

/**
 * 设置默认日期为今天
 * 如果无法获取当前日期，则设置为2000年1月1日
 */
function setDefaultDate() {
    try {
        const today = new Date();

        // 格式化为 YYYY-MM-DD 格式
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const defaultDate = `${year}-${month}-${day}`;

        eventDateInput.value = defaultDate;
    } catch (error) {
        // 如果出错，设置为2000年1月1日
        eventDateInput.value = '2000-01-01';
    }
}

/**
 * 保存表单数据到内存
 */
function saveFormData() {
    countdownsData[currentTab - 1] = {
        eventName: eventNameInput.value.trim(),
        eventDate: eventDateInput.value,
        eventTime: eventTimeInput.value
    };
}

/**
 * 重置表单到默认状态
 */
function resetForm() {
    eventNameInput.value = '';
    setDefaultDate();
    eventTimeInput.value = '';
}

/**
 * 从内存加载数据到表单
 */
function loadFormData() {
    const data = countdownsData[currentTab - 1];
    if (data) {
        eventNameInput.value = data.eventName;
        eventDateInput.value = data.eventDate;
        eventTimeInput.value = data.eventTime;
    }
}

/**
 * 显示倒计时到页面
 */
function displayCountdown(days, hours, minutes, seconds) {
    daysElement.textContent = days;
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;
}

/**
 * 开始倒计时
 */
function startCountdown(tabIndex) {
    // 获取指定标签页的数据
    const data = countdownsData[tabIndex - 1];

    // 根据保存的数据生成目标日期
    const [hours, minutes] = data.eventTime.split(':');
    const targetDate = new Date(data.eventDate);
    targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // 停止指定标签页的倒计时（如果存在）
    if (countdownInterval[tabIndex - 1]) {
        clearInterval(countdownInterval[tabIndex - 1]);
    }

    // 修改标签页标题为事件名称
    const tabLabel = countdownTabs.querySelector(`label[for="tab${tabIndex}"]`);
    if (tabLabel) {
        tabLabel.textContent = `事件 ${data.eventName}`;
    }

    // 创建新的倒计时定时器
    countdownInterval[tabIndex - 1] = setInterval(function () {
        const now = new Date();
        const timeDifference = targetDate - now;

        // 如果倒计时结束
        if (timeDifference <= 0) {
            clearInterval(countdownInterval[tabIndex - 1]);
            countdownInterval[tabIndex - 1] = null;
            alert(`事件 ${data.eventName} 的倒计时结束！`);
            return;
        }

        // 计算剩余时间
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // 显示倒计时
        if (tabIndex === currentTab) {
            displayCountdown(days, hours, minutes, seconds);
        }
    }, 1000);
}

// ==================== 事件监听器绑定 ====================
function bindEventListeners() {
    // 1. 开始按钮事件
    countdownForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 获取表单的三个字段信息
        const eventName = eventNameInput.value.trim();
        const eventDate = eventDateInput.value;
        let eventTime = eventTimeInput.value;

        // 验证事件名称
        if (!eventName) {
            alert('事件名称不能为空！');
            return;
        }

        // 验证事件名称长度（按字符计算，中文和英文都算1个字符）
        if (eventName.length > 16) {
            alert('事件名称长度不能超过16个字符！');
            return;
        }

        // 处理时间默认值
        if (!eventTime) {
            eventTime = '00:00';
            eventTimeInput.value = eventTime; // 更新表单显示
        }

        // 验证日期和时间范围
        const [hours, minutes] = eventTime.split(':');
        const targetDate = new Date(eventDate);
        const today = new Date();
        targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (targetDate < minDate || targetDate > maxDate) {
            alert('日期必须在2000年1月1日到2099年12月31日之间！');
            return;
        }
        if (targetDate < today) {
            alert('日期不能小于当前时间！');
            return;
        }

        // 保存表单数据
        saveFormData();

        // 开始倒计时
        startCountdown(currentTab);
    });

    // 2. 停止按钮事件  
    stopBtn.addEventListener('click', function () {
        // 停止当前标签页的倒计时
        if (countdownInterval[currentTab - 1]) {
            clearInterval(countdownInterval[currentTab - 1]);
            countdownInterval[currentTab - 1] = null;
        }

        // 重置当前标签页的数据为空对象
        countdownsData[currentTab - 1] = {};

        // 重置标签页标题为默认值
        const tabLabel = countdownTabs.querySelector(`label[for="tab${currentTab}"]`);
        if (tabLabel) {
            tabLabel.textContent = `倒计时${currentTab}`;
        }

        // 重置倒计时显示为0
        displayCountdown(0, 0, 0, 0);

        // 重置表单为默认状态
        resetForm();
    });

    // 3. 标签页切换事件（需要添加）
    // 监听radio的change事件
    countdownTabs.querySelectorAll('input[name="tabs"]').forEach(radio => {
        radio.addEventListener('change', function () {
            // 更新全局变量currentTab
            currentTab = parseInt(this.value);

            // 检查当前标签页是否有数据
            if (countdownsData[currentTab - 1] && Object.keys(countdownsData[currentTab - 1]).length > 0) {
                // 如果该标签页已有数据，开始倒计时
                startCountdown(currentTab);
                loadFormData();
            } else {
                // 如果该标签页数据为空，重置为默认值
                resetForm();
                displayCountdown(0, 0, 0, 0);
            }
        });
    });

    // 4. 主题切换按钮事件
    themeToggle.addEventListener('click', function () {
        // 切换当前使用的CSS文件
        const currentStyle = document.getElementById('currentStyle');
        if (currentStyle.href.includes('style-1.css')) {
            currentStyle.href = 'style-2.css';
        } else {
            currentStyle.href = 'style-1.css';
        }
    });
}