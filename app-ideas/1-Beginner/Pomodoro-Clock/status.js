/**
 * 番茄时钟 - 状态管理模块
 * 负责应用状态的管理和切换
 */

// ==================== 应用状态枚举 ====================

/**
 * 应用主要状态枚举
 */
export const AppState = {
    SETTING: 'setting',
    RUNNING: 'running', 
    PAUSED: 'paused'
};

/**
 * 会话类型枚举
 */
export const SessionType = {
    WORK: 'work',
    BREAK: 'break'
};

// ==================== 状态管理类 ====================

/**
 * 番茄时钟状态管理类
 */
export class Status {
    constructor() {
        // 主要状态标志
        this.currentState = AppState.SETTING;
        this.currentSessionType = SessionType.WORK;
        
        // 运行状态标志
        this.isRunning = false;
        this.isPaused = false;
        this.isSettingMode = true;
        
        // 注意：会话状态通过currentSessionType管理，不需要额外的布尔标志
        
        // 音频状态标志
        this.isMuted = false;
        
        // 计时器相关
        this.timerInterval = null;
        this.currentMinutes = 25;
        this.currentSeconds = 0;
        
        // 设置相关
        this.workDuration = 25;
        this.breakDuration = 5;
        this.volume = 50;
    }

    // ==================== 状态检查方法 ====================

    /**
     * 检查是否处于设置阶段
     */
    isInSettingState() {
        return this.currentState === AppState.SETTING;
    }

    /**
     * 检查是否处于运行阶段
     */
    isInRunningState() {
        return this.currentState === AppState.RUNNING;
    }

    /**
     * 检查是否处于暂停阶段
     */
    isInPausedState() {
        return this.currentState === AppState.PAUSED;
    }

    /**
     * 检查是否为工作时段
     */
    isWorkSessionActive() {
        return this.currentSessionType === SessionType.WORK;
    }

    /**
     * 检查是否为休息时段
     */
    isBreakSessionActive() {
        return this.currentSessionType === SessionType.BREAK;
    }

    /**
     * 检查计时器是否可以运行
     */
    canTimerRun() {
        return this.isRunning && !this.isPaused;
    }

    /**
     * 检查是否可以修改设置
     */
    canModifySettings() {
        return this.isSettingMode || this.isPaused;
    }

    // ==================== 状态切换方法 ====================

    /**
     * 切换到设置状态
     */
    switchToSettingState() {
        this.currentState = AppState.SETTING;
        this.isRunning = false;
        this.isPaused = false;
        this.isSettingMode = true;
        
        console.log('状态切换: 设置阶段');
    }

    /**
     * 切换到运行状态
     */
    switchToRunningState() {
        this.currentState = AppState.RUNNING;
        this.isRunning = true;
        this.isPaused = false;
        this.isSettingMode = false;
        
        console.log('状态切换: 运行阶段');
    }

    /**
     * 切换到暂停状态
     */
    switchToPausedState() {
        this.currentState = AppState.PAUSED;
        this.isRunning = false;
        this.isPaused = true;
        this.isSettingMode = false;
        
        console.log('状态切换: 暂停阶段');
    }

    /**
     * 切换会话类型（工作 <-> 休息）
     */
    switchSessionType() {
        if (this.currentSessionType === SessionType.WORK) {
            this.currentSessionType = SessionType.BREAK;
            // 切换到休息时段时，重置时间为休息时长
            if (this.isInSettingState()) {
                this.currentMinutes = this.breakDuration;
                this.currentSeconds = 0;
            }
            console.log('会话切换: 休息时段');
        } else {
            this.currentSessionType = SessionType.WORK;
            // 切换到工作时段时，重置时间为工作时长
            if (this.isInSettingState()) {
                this.currentMinutes = this.workDuration;
                this.currentSeconds = 0;
            }
            console.log('会话切换: 工作时段');
        }
    }

    // ==================== 输入验证方法 ====================

    /**
     * 验证和转换用户输入的时间值
     * @param {any} inputValue - 用户输入的值
     * @param {number} maxValue - 最大允许值
     * @returns {number|null} - 处理后的有效值，如果无效返回null
     */
    validateAndConvertTimeInput(inputValue, maxValue) {
        // 检查是否为空
        if (inputValue === '' || inputValue == null || inputValue === undefined) {
            return null; // 空值无效
        }

        // 尝试转换为数字
        const numValue = Number(inputValue);
        
        // 检查是否为有效数字
        if (isNaN(numValue)) {
            return null; // 不是数字，无效
        }

        // 截断取整（向下取整，只保留整数部分）
        const intValue = Math.floor(Math.abs(numValue)); // 同时取绝对值，避免负数

        // 如果为0，无效
        if (intValue === 0) {
            return null;
        }

        // 应用模运算进行循环
        let validValue;
        if (intValue > maxValue) {
            validValue = ((intValue - 1) % maxValue) + 1;
        } else {
            validValue = intValue;
        }

        return validValue;
    }

    // ==================== 设置更新方法 ====================

    /**
     * 更新工作时长设置（1-60分钟循环）
     */
    updateWorkDuration(minutes) {
        if (!this.canModifySettings()) {
            return false;
        }

        // 实现1-60分钟的循环逻辑（模运算）
        let validMinutes;
        if (minutes > 60) {
            // 超过60时从1开始：61->1, 62->2, 120->60
            validMinutes = ((minutes - 1) % 60) + 1;
        } else if (minutes < 1) {
            // 小于1时从60开始：0->60, -1->59
            validMinutes = ((minutes - 1) % 60 + 60) % 60 + 1;
        } else {
            validMinutes = minutes;
        }

        this.workDuration = validMinutes;
        
        // 如果当前是工作时段且处于设置模式，同时更新显示时间
        if (this.isWorkSessionActive() && this.isInSettingState()) {
            this.currentMinutes = validMinutes;
            this.currentSeconds = 0;
        }
        
        console.log(`工作时长更新: ${validMinutes}分钟`);
        return true;
    }

    /**
     * 更新休息时长设置（1-15分钟循环）
     */
    updateBreakDuration(minutes) {
        if (!this.canModifySettings()) {
            return false;
        }

        // 实现1-15分钟的循环逻辑（模运算）
        let validMinutes;
        if (minutes > 15) {
            // 超过15时从1开始：16->1, 17->2, 30->15
            validMinutes = ((minutes - 1) % 15) + 1;
        } else if (minutes < 1) {
            // 小于1时从15开始：0->15, -1->14
            validMinutes = ((minutes - 1) % 15 + 15) % 15 + 1;
        } else {
            validMinutes = minutes;
        }

        this.breakDuration = validMinutes;
        
        // 如果当前是休息时段且处于设置模式，同时更新显示时间
        if (this.isBreakSessionActive() && this.isInSettingState()) {
            this.currentMinutes = validMinutes;
            this.currentSeconds = 0;
        }
        
        console.log(`休息时长更新: ${validMinutes}分钟`);
        return true;
    }

    /**
     * 处理工作时长输入框的值变化
     * @param {any} inputValue - 输入框的值
     * @returns {boolean} - 是否成功更新
     */
    updateWorkDurationFromInput(inputValue) {
        if (!this.canModifySettings()) {
            return false;
        }

        const validValue = this.validateAndConvertTimeInput(inputValue, 60);
        
        if (validValue === null) {
            // 输入无效，不更新，保持原值
            console.log('工作时长输入无效，保持原值:', this.workDuration);
            return false;
        }

        this.workDuration = validValue;
        
        // 如果当前是工作时段且处于设置模式，同时更新显示时间
        if (this.isWorkSessionActive() && this.isInSettingState()) {
            this.currentMinutes = validValue;
            this.currentSeconds = 0;
        }
        
        console.log(`工作时长从输入更新: ${validValue}分钟`);
        return true;
    }

    /**
     * 处理休息时长输入框的值变化
     * @param {any} inputValue - 输入框的值
     * @returns {boolean} - 是否成功更新
     */
    updateBreakDurationFromInput(inputValue) {
        if (!this.canModifySettings()) {
            return false;
        }

        const validValue = this.validateAndConvertTimeInput(inputValue, 15);
        
        if (validValue === null) {
            // 输入无效，不更新，保持原值
            console.log('休息时长输入无效，保持原值:', this.breakDuration);
            return false;
        }

        this.breakDuration = validValue;
        
        // 如果当前是休息时段且处于设置模式，同时更新显示时间
        if (this.isBreakSessionActive() && this.isInSettingState()) {
            this.currentMinutes = validValue;
            this.currentSeconds = 0;
        }
        
        console.log(`休息时长从输入更新: ${validValue}分钟`);
        return true;
    }

    /**
     * 更新音量设置
     */
    updateVolume(volume) {
        if (volume >= 0 && volume <= 100) {
            this.volume = volume;
            console.log(`音量更新: ${volume}`);
            return true;
        }
        return false;
    }

    /**
     * 切换静音状态
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        console.log(`静音状态: ${this.isMuted ? '开启' : '关闭'}`);
        return this.isMuted;
    }

    // ==================== 计时器状态管理 ====================

    /**
     * 更新当前时间
     */
    updateCurrentTime(minutes, seconds) {
        this.currentMinutes = minutes;
        this.currentSeconds = seconds;
    }

    /**
     * 获取当前会话的总时长
     */
    getCurrentSessionDuration() {
        return this.isWorkSessionActive() ? this.workDuration : this.breakDuration;
    }

    /**
     * 重置当前会话时间
     */
    resetCurrentSessionTime() {
        const duration = this.getCurrentSessionDuration();
        this.currentMinutes = duration;
        this.currentSeconds = 0;
        console.log(`重置时间: ${duration}:00`);
    }

    /**
     * 重置到默认设置（25分钟工作，5分钟休息）
     */
    resetToDefaults() {
        this.workDuration = 25;
        this.breakDuration = 5;
        
        // 如果当前在设置模式，同时更新显示时间
        if (this.isInSettingState()) {
            if (this.isWorkSessionActive()) {
                this.currentMinutes = this.workDuration;
            } else {
                this.currentMinutes = this.breakDuration;
            }
            this.currentSeconds = 0;
        }
        
        console.log('重置到默认设置: 工作25分钟, 休息5分钟');
    }

    /**
     * 完全初始化所有数据（停止功能使用）
     */
    fullReset() {
        // 清除计时器
        this.clearTimerInterval();
        
        // 重置到初始状态
        this.switchToSettingState();
        this.currentSessionType = SessionType.WORK;
        
        // 重置时间显示
        this.currentMinutes = this.workDuration;
        this.currentSeconds = 0;
        
        console.log('完全重置应用状态');
    }

    /**
     * 设置计时器间隔ID
     */
    setTimerInterval(intervalId) {
        this.timerInterval = intervalId;
    }

    /**
     * 清除计时器间隔
     */
    clearTimerInterval() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ==================== 时间格式化 ====================

    /**
     * 获取格式化的当前时间字符串
     */
    getFormattedTime() {
        const minutes = this.currentMinutes.toString().padStart(2, '0');
        const seconds = this.currentSeconds.toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    /**
     * 获取当前会话类型的中文名称
     */
    getSessionTypeName() {
        return this.isWorkSessionActive() ? '工作时段' : '休息时段';
    }

    // ==================== 调试和监控 ====================

    /**
     * 打印当前应用状态（调试用）
     */
    debugState() {
        console.log('=== 当前应用状态 ===');
        console.log('主状态:', this.currentState);
        console.log('会话类型:', this.currentSessionType);
        console.log('运行标志:', {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            isSettingMode: this.isSettingMode
        });
        console.log('时间设置:', {
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            currentTime: this.getFormattedTime()
        });
        console.log('音频设置:', {
            volume: this.volume,
            isMuted: this.isMuted
        });
        console.log('==================');
    }

    // ==================== 初始化 ====================

    /**
     * 初始化应用状态
     */
    initialize() {
        // 确保初始状态正确
        this.switchToSettingState();
        this.currentSessionType = SessionType.WORK;
        
        // 初始化时间显示
        this.currentMinutes = this.workDuration;
        this.currentSeconds = 0;
        
        console.log('应用状态初始化完成');
        this.debugState();
    }

    // ==================== 状态快照 ====================

    /**
     * 获取当前状态快照（用于调试或保存）
     */
    getStateSnapshot() {
        return {
            currentState: this.currentState,
            currentSessionType: this.currentSessionType,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            isSettingMode: this.isSettingMode,
            currentTime: this.getFormattedTime(),
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            volume: this.volume,
            isMuted: this.isMuted
        };
    }
}

// ==================== 导出默认实例 ====================

/**
 * 导出状态管理实例
 */
export const status = new Status();