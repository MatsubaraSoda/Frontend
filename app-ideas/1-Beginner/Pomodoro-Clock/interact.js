/**
 * 番茄时钟 - 交互事件处理模块
 * 负责处理用户界面交互事件
 */

import { status } from './status.js';
import { audioManager } from './audio.js';

// ==================== 交互处理类 ====================

/**
 * 交互事件管理类
 */
export class InteractionHandler {
    constructor(updateUICallback) {
        this.updateUI = updateUICallback;
        this.elements = {};
        this.isInitialized = false;
    }

    // ==================== 初始化方法 ====================

    /**
     * 初始化所有DOM元素引用
     */
    initializeElements() {
        // 控制按钮
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.resetBtn = document.getElementById('resetBtn');

        // 工作时长控制
        this.elements.workDurationUp = document.getElementById('workDurationUp');
        this.elements.workDurationDown = document.getElementById('workDurationDown');

        // 休息时长控制
        this.elements.breakDurationUp = document.getElementById('breakDurationUp');
        this.elements.breakDurationDown = document.getElementById('breakDurationDown');

        // 音量控制
        this.elements.volumeToggle = document.getElementById('volumeToggle');
        this.elements.volumeSlider = document.getElementById('volumeSlider');

        // 验证所有元素都存在
        const missingElements = [];
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                missingElements.push(key);
            }
        }

        if (missingElements.length > 0) {
            console.error('缺少DOM元素:', missingElements);
            return false;
        }

        console.log('DOM元素初始化完成');
        return true;
    }

    /**
     * 绑定所有事件监听器
     */
    bindEventListeners() {
        if (!this.initializeElements()) {
            console.error('DOM元素初始化失败，无法绑定事件');
            return false;
        }

        // 绑定控制按钮事件
        this.bindControlButtonEvents();

        // 绑定时间设置事件
        this.bindTimeSettingEvents();

        // 绑定输入框事件
        this.bindInputEvents();

        // 绑定音量控制事件
        this.bindVolumeControlEvents();

        this.isInitialized = true;
        console.log('所有事件监听器绑定完成');
        return true;
    }

    // ==================== 控制按钮事件处理 ====================

    /**
     * 绑定控制按钮事件（开始/暂停/重置）
     */
    bindControlButtonEvents() {
        // 开始按钮
        this.elements.startBtn.addEventListener('click', () => {
            this.handleStartButton();
        });

        // 暂停按钮
        this.elements.pauseBtn.addEventListener('click', () => {
            this.handlePauseButton();
        });

        // 重置按钮
        this.elements.resetBtn.addEventListener('click', () => {
            this.handleResetButton();
        });

        console.log('控制按钮事件绑定完成');
    }

    /**
     * 处理开始按钮点击
     */
    handleStartButton() {
        console.log('开始按钮被点击');

        if (status.isInSettingState()) {
            // 从设置状态开始计时
            status.switchToRunningState();
            this.startTimer();
        } else if (status.isInPausedState()) {
            // 从暂停状态恢复计时
            status.switchToRunningState();
            this.startTimer();
        }

        this.updateUI();
    }

    /**
     * 处理暂停按钮点击
     */
    handlePauseButton() {
        console.log('暂停按钮被点击');

        if (status.isInRunningState()) {
            status.switchToPausedState();
            this.stopTimer();
        }

        this.updateUI();
    }

    /**
     * 处理重置按钮点击
     */
    handleResetButton() {
        console.log('重置按钮被点击');

        if (status.isInSettingState()) {
            // SETTING状态下的重置：恢复默认值
            status.resetToDefaults();
            console.log('恢复默认设置');
        } else if (status.isInPausedState()) {
            // PAUSED状态下的停止：完全初始化
            this.stopTimer();
            audioManager.stopBackgroundMusic(); // 停止音乐
            status.fullReset();
            console.log('完全停止并重置');
        } else {
            // 其他状态下的重置（理论上不应该到达这里，因为按钮应该被禁用）
            this.stopTimer();
            audioManager.stopBackgroundMusic();
            status.switchToSettingState();
            status.resetCurrentSessionTime();
        }

        this.updateUI();
    }

    // ==================== 时间设置事件处理 ====================

    /**
     * 绑定时间设置事件
     */
    bindTimeSettingEvents() {
        // 工作时长增加
        this.elements.workDurationUp.addEventListener('click', () => {
            this.handleWorkDurationUp();
        });

        // 工作时长减少
        this.elements.workDurationDown.addEventListener('click', () => {
            this.handleWorkDurationDown();
        });

        // 休息时长增加
        this.elements.breakDurationUp.addEventListener('click', () => {
            this.handleBreakDurationUp();
        });

        // 休息时长减少
        this.elements.breakDurationDown.addEventListener('click', () => {
            this.handleBreakDurationDown();
        });

        console.log('时间设置事件绑定完成');
    }

    // ==================== 输入框事件处理 ====================

    /**
     * 绑定输入框事件
     */
    bindInputEvents() {
        // 工作时长输入框
        this.elements.workDurationInput = document.getElementById('workDuration');
        this.elements.breakDurationInput = document.getElementById('breakDuration');

        if (this.elements.workDurationInput) {
            // 监听输入变化（实时验证）
            this.elements.workDurationInput.addEventListener('input', (event) => {
                this.handleWorkDurationInput(event);
            });

            // 监听失去焦点（最终验证和格式化）
            this.elements.workDurationInput.addEventListener('blur', (event) => {
                this.handleWorkDurationBlur(event);
            });
        }

        if (this.elements.breakDurationInput) {
            // 监听输入变化（实时验证）
            this.elements.breakDurationInput.addEventListener('input', (event) => {
                this.handleBreakDurationInput(event);
            });

            // 监听失去焦点（最终验证和格式化）
            this.elements.breakDurationInput.addEventListener('blur', (event) => {
                this.handleBreakDurationBlur(event);
            });
        }

        console.log('输入框事件绑定完成');
    }

    /**
     * 处理工作时长输入变化
     */
    handleWorkDurationInput(event) {
        const inputValue = event.target.value;
        console.log('工作时长输入变化:', inputValue);
        
        // 实时更新状态（但不强制格式化输入框）
        if (status.updateWorkDurationFromInput(inputValue)) {
            this.updateUI();
        }
    }

    /**
     * 处理工作时长输入框失去焦点
     */
    handleWorkDurationBlur(event) {
        const inputValue = event.target.value;
        console.log('工作时长输入失去焦点:', inputValue);
        
        // 尝试更新状态
        const success = status.updateWorkDurationFromInput(inputValue);
        
        // 无论是否成功，都将输入框值设置为当前有效值
        event.target.value = status.workDuration;
        
        if (success) {
            this.updateUI();
        }
    }

    /**
     * 处理休息时长输入变化
     */
    handleBreakDurationInput(event) {
        const inputValue = event.target.value;
        console.log('休息时长输入变化:', inputValue);
        
        // 实时更新状态（但不强制格式化输入框）
        if (status.updateBreakDurationFromInput(inputValue)) {
            this.updateUI();
        }
    }

    /**
     * 处理休息时长输入框失去焦点
     */
    handleBreakDurationBlur(event) {
        const inputValue = event.target.value;
        console.log('休息时长输入失去焦点:', inputValue);
        
        // 尝试更新状态
        const success = status.updateBreakDurationFromInput(inputValue);
        
        // 无论是否成功，都将输入框值设置为当前有效值
        event.target.value = status.breakDuration;
        
        if (success) {
            this.updateUI();
        }
    }

    /**
     * 处理工作时长增加
     */
    handleWorkDurationUp() {
        const newDuration = status.workDuration + 1;
        if (status.updateWorkDuration(newDuration)) {
            console.log(`工作时长增加到: ${newDuration}分钟`);
            this.updateUI();
        }
    }

    /**
     * 处理工作时长减少
     */
    handleWorkDurationDown() {
        const newDuration = status.workDuration - 1;
        if (status.updateWorkDuration(newDuration)) {
            console.log(`工作时长减少到: ${newDuration}分钟`);
            this.updateUI();
        }
    }

    /**
     * 处理休息时长增加
     */
    handleBreakDurationUp() {
        const newDuration = status.breakDuration + 1;
        if (status.updateBreakDuration(newDuration)) {
            console.log(`休息时长增加到: ${newDuration}分钟`);
            this.updateUI();
        }
    }

    /**
     * 处理休息时长减少
     */
    handleBreakDurationDown() {
        const newDuration = status.breakDuration - 1;
        if (status.updateBreakDuration(newDuration)) {
            console.log(`休息时长减少到: ${newDuration}分钟`);
            this.updateUI();
        }
    }

    // ==================== 音量控制事件处理 ====================

    /**
     * 绑定音量控制事件
     */
    bindVolumeControlEvents() {
        // 音量切换按钮
        this.elements.volumeToggle.addEventListener('click', () => {
            this.handleVolumeToggle();
        });

        // 音量滑块
        this.elements.volumeSlider.addEventListener('input', (event) => {
            this.handleVolumeSliderChange(event);
        });

        console.log('音量控制事件绑定完成');
    }

    /**
     * 处理音量切换按钮点击
     */
    handleVolumeToggle() {
        const newMuteState = status.toggleMute();
        
        // 同步音频管理器的静音状态
        audioManager.setMuted(newMuteState);
        
        console.log(`音量切换: ${newMuteState ? '静音' : '有声'}`);
        this.updateUI();
    }

    /**
     * 处理音量滑块变化
     */
    handleVolumeSliderChange(event) {
        const newVolume = parseInt(event.target.value);
        if (status.updateVolume(newVolume)) {
            // 同步音频管理器的音量（转换为0-1范围）
            audioManager.setVolume(newVolume / 100);
            
            console.log(`音量调整到: ${newVolume}`);
            this.updateUI();
        }
    }

    // ==================== 计时器管理 ====================

    /**
     * 启动计时器
     */
    startTimer() {
        // 清除可能存在的旧计时器
        this.stopTimer();

        const timerInterval = setInterval(() => {
            this.tick();
        }, 1000);

        status.setTimerInterval(timerInterval);
        console.log('计时器启动');
    }

    /**
     * 停止计时器
     */
    stopTimer() {
        status.clearTimerInterval();
        console.log('计时器停止');
    }

    /**
     * 计时器滴答处理
     */
    tick() {
        if (!status.canTimerRun()) {
            this.stopTimer();
            return;
        }

        // 减少时间
        if (status.currentSeconds > 0) {
            status.currentSeconds--;
        } else if (status.currentMinutes > 0) {
            status.currentMinutes--;
            status.currentSeconds = 59;
        } else {
            // 时间到了
            this.handleTimeUp();
            return;
        }

        // 更新显示
        this.updateUI();
    }

    /**
     * 处理时间到了的情况
     */
    handleTimeUp() {
        console.log(`${status.getSessionTypeName()}结束！`);

        // 播放提示音
        audioManager.playNotificationSound();

        // 检查当前会话类型并处理音乐
        if (status.isWorkSessionActive()) {
            // 工作时段结束，即将进入休息时段
            console.log('工作结束，开始休息时间');
            status.switchSessionType(); // 切换到BREAK
            status.resetCurrentSessionTime();
            
            // 开始播放背景音乐
            audioManager.startBackgroundMusic();
            
        } else {
            // 休息时段结束，即将进入工作时段
            console.log('休息结束，开始工作时间');
            
            // 停止背景音乐
            audioManager.stopBackgroundMusic();
            
            status.switchSessionType(); // 切换到WORK
            status.resetCurrentSessionTime();
        }

        // 保持运行状态，继续计时
        this.updateUI();
    }


    // ==================== 调试方法 ====================

    /**
     * 获取交互处理器状态
     */
    getInteractionState() {
        return {
            isInitialized: this.isInitialized,
            elementsCount: Object.keys(this.elements).length,
            timerRunning: status.timerInterval !== null
        };
    }
}

// ==================== 导出默认实例 ====================

/**
 * 导出交互处理器实例
 * 注意：需要在初始化时传入updateUI回调函数
 */
export function createInteractionHandler(updateUICallback) {
    return new InteractionHandler(updateUICallback);
}
