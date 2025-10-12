/**
 * 番茄时钟 - 主要JavaScript文件
 * 业务逻辑和UI控制
 */

// ==================== 模块导入 ====================

import { AppState, SessionType, status } from './status.js';
import { createInteractionHandler } from './interact.js';
import { audioManager } from './audio.js';

// ==================== DOM 元素获取 ====================

// 时钟显示元素
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const currentSessionDisplay = document.getElementById('currentSession');

// 控制按钮
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// 时间设置元素
const workDurationInput = document.getElementById('workDuration');
const workDurationUpBtn = document.getElementById('workDurationUp');
const workDurationDownBtn = document.getElementById('workDurationDown');
const breakDurationInput = document.getElementById('breakDuration');
const breakDurationUpBtn = document.getElementById('breakDurationUp');
const breakDurationDownBtn = document.getElementById('breakDurationDown');

// 音量控制元素
const volumeToggleBtn = document.getElementById('volumeToggle');
const volumeSlider = document.getElementById('volumeSlider');

// ==================== UI 更新函数 ====================

/**
 * 更新时钟显示
 */
function updateTimerDisplay() {
    const formattedTime = status.getFormattedTime();
    const [minutes, seconds] = formattedTime.split(':');
    
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;
    
    // 更新页面标题
    document.title = `${formattedTime} - 番茄时钟`;
}

/**
 * 更新会话状态显示
 */
function updateSessionDisplay() {
    const sessionText = status.getSessionTypeName();
    currentSessionDisplay.textContent = sessionText;
    
    // 更新样式类
    const container = document.querySelector('.display-container');
    container.classList.remove('working', 'resting');
    container.classList.add(status.isWorkSessionActive() ? 'working' : 'resting');
}

/**
 * 更新设置输入框显示
 */
function updateSettingsDisplay() {
    workDurationInput.value = status.workDuration;
    breakDurationInput.value = status.breakDuration;
}

/**
 * 更新音量控制显示
 */
function updateVolumeDisplay() {
    volumeSlider.value = status.volume;
    
    // 更新静音图标
    const volumeOnIcon = volumeToggleBtn.querySelector('.volume-on');
    const volumeOffIcon = volumeToggleBtn.querySelector('.volume-off');
    
    if (status.isMuted) {
        volumeOnIcon.classList.add('hidden');
        volumeOffIcon.classList.remove('hidden');
        volumeToggleBtn.setAttribute('data-muted', 'true');
    } else {
        volumeOnIcon.classList.remove('hidden');
        volumeOffIcon.classList.add('hidden');
        volumeToggleBtn.setAttribute('data-muted', 'false');
    }
}

/**
 * 更新按钮状态和文本
 */
function updateButtonStates() {
    // 获取设置区域元素
    const settingsSection = document.querySelector('.settings-section');
    
    // 根据应用状态启用/禁用按钮和更新文本
    if (status.isInSettingState()) {
        // SETTING 状态
        startBtn.disabled = false;
        startBtn.textContent = '开始';
        
        pauseBtn.disabled = true;
        pauseBtn.textContent = '暂停';
        
        resetBtn.disabled = false;
        resetBtn.textContent = '重置';
        
        // 启用设置按钮和输入框
        workDurationUpBtn.disabled = false;
        workDurationDownBtn.disabled = false;
        breakDurationUpBtn.disabled = false;
        breakDurationDownBtn.disabled = false;
        workDurationInput.disabled = false;
        breakDurationInput.disabled = false;
        
        // 启用设置区域
        settingsSection.classList.remove('disabled');
        
    } else if (status.isInRunningState()) {
        // RUNNING 状态
        startBtn.disabled = true;
        startBtn.textContent = '开始';
        
        pauseBtn.disabled = false;
        pauseBtn.textContent = '暂停';
        
        resetBtn.disabled = true;
        resetBtn.textContent = '重置';
        
        // 禁用设置按钮和输入框
        workDurationUpBtn.disabled = true;
        workDurationDownBtn.disabled = true;
        breakDurationUpBtn.disabled = true;
        breakDurationDownBtn.disabled = true;
        workDurationInput.disabled = true;
        breakDurationInput.disabled = true;
        
        // 禁用设置区域
        settingsSection.classList.add('disabled');
        
    } else if (status.isInPausedState()) {
        // PAUSED 状态
        startBtn.disabled = false;
        startBtn.textContent = '继续';
        
        pauseBtn.disabled = true;
        pauseBtn.textContent = '暂停';
        
        resetBtn.disabled = false;
        resetBtn.textContent = '停止';
        
        // 暂停时可以修改设置
        workDurationUpBtn.disabled = false;
        workDurationDownBtn.disabled = false;
        breakDurationUpBtn.disabled = false;
        breakDurationDownBtn.disabled = false;
        workDurationInput.disabled = false;
        breakDurationInput.disabled = false;
        
        // 启用设置区域
        settingsSection.classList.remove('disabled');
    }
}

/**
 * 更新所有UI元素
 */
function updateUI() {
    updateTimerDisplay();
    updateSessionDisplay();
    updateSettingsDisplay();
    updateVolumeDisplay();
    updateButtonStates();
}

// ==================== 交互处理器 ====================

let interactionHandler = null;

// ==================== 应用初始化 ====================

/**
 * 初始化应用
 */
function initializeApp() {
    console.log('初始化番茄时钟应用...');
    
    // 初始化状态
    status.initialize();
    
    // 初始化音频系统
    audioManager.initialize();
    
    // 同步音频系统设置
    audioManager.setVolume(status.volume / 100);
    audioManager.setMuted(status.isMuted);
    
    // 创建交互处理器
    interactionHandler = createInteractionHandler(updateUI);
    
    // 初始化UI
    updateUI();
    
    // 绑定事件监听器
    bindEventListeners();
    
    console.log('应用初始化完成！');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    if (interactionHandler) {
        const success = interactionHandler.bindEventListeners();
        if (success) {
            console.log('所有交互事件绑定成功');
        } else {
            console.error('交互事件绑定失败');
        }
    }
}

// ==================== 应用启动 ====================

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);

// ==================== 开发调试 ====================

// 在控制台提供调试功能
window.debugPomodoro = {
    state: () => status.debugState(),
    getState: () => status.getStateSnapshot(),
    status: () => status,
    audio: () => audioManager.getAudioState(),
    interaction: () => interactionHandler ? interactionHandler.getInteractionState() : null,
    switchToSetting: () => { status.switchToSettingState(); updateUI(); },
    switchToRunning: () => { status.switchToRunningState(); updateUI(); },
    switchToPaused: () => { status.switchToPausedState(); updateUI(); },
    startTimer: () => interactionHandler ? interactionHandler.startTimer() : null,
    stopTimer: () => interactionHandler ? interactionHandler.stopTimer() : null,
    playMusic: () => audioManager.startBackgroundMusic(),
    stopMusic: () => audioManager.stopBackgroundMusic(),
    playSound: () => audioManager.playNotificationSound()
};