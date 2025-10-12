/**
 * 番茄时钟 - 音频管理模块
 * 负责音乐播放和音效管理
 */

// ==================== 音频管理类 ====================

/**
 * 音频管理类
 */
export class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.isPlaying = false;
        this.volume = 0.5; // 默认音量50%
        this.isMuted = false;
    }

    // ==================== 初始化方法 ====================

    /**
     * 初始化音频系统
     */
    initialize() {
        try {
            // 创建背景音乐Audio对象
            this.backgroundMusic = new Audio('assets/Canon in D Major - dylanf (youtube).mp3');
            this.backgroundMusic.loop = true; // 循环播放
            this.backgroundMusic.volume = this.volume;
            
            // 添加事件监听器
            this.backgroundMusic.addEventListener('canplay', () => {
                console.log('背景音乐已加载完成');
            });
            
            this.backgroundMusic.addEventListener('error', (e) => {
                console.error('背景音乐加载失败:', e);
            });
            
            console.log('音频系统初始化完成');
            return true;
        } catch (error) {
            console.error('音频系统初始化失败:', error);
            return false;
        }
    }

    // ==================== 背景音乐控制 ====================

    /**
     * 开始播放背景音乐
     */
    startBackgroundMusic() {
        if (!this.backgroundMusic || this.isMuted) {
            console.log('背景音乐不可用或已静音');
            return false;
        }

        try {
            this.backgroundMusic.currentTime = 0; // 从头开始播放
            this.backgroundMusic.play();
            this.isPlaying = true;
            console.log('开始播放背景音乐');
            return true;
        } catch (error) {
            console.error('播放背景音乐失败:', error);
            return false;
        }
    }

    /**
     * 停止背景音乐
     */
    stopBackgroundMusic() {
        if (!this.backgroundMusic) {
            return false;
        }

        try {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isPlaying = false;
            console.log('停止背景音乐');
            return true;
        } catch (error) {
            console.error('停止背景音乐失败:', error);
            return false;
        }
    }

    /**
     * 暂停背景音乐
     */
    pauseBackgroundMusic() {
        if (!this.backgroundMusic) {
            return false;
        }

        try {
            this.backgroundMusic.pause();
            this.isPlaying = false;
            console.log('暂停背景音乐');
            return true;
        } catch (error) {
            console.error('暂停背景音乐失败:', error);
            return false;
        }
    }

    /**
     * 恢复背景音乐播放
     */
    resumeBackgroundMusic() {
        if (!this.backgroundMusic || this.isMuted) {
            return false;
        }

        try {
            this.backgroundMusic.play();
            this.isPlaying = true;
            console.log('恢复背景音乐播放');
            return true;
        } catch (error) {
            console.error('恢复背景音乐播放失败:', error);
            return false;
        }
    }

    // ==================== 音量控制 ====================

    /**
     * 设置音量
     */
    setVolume(volume) {
        if (volume < 0 || volume > 1) {
            console.error('音量值必须在0-1之间');
            return false;
        }

        this.volume = volume;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.isMuted ? 0 : volume;
        }
        
        console.log(`音量设置为: ${Math.round(volume * 100)}%`);
        return true;
    }

    /**
     * 设置静音状态
     */
    setMuted(muted) {
        this.isMuted = muted;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = muted ? 0 : this.volume;
        }
        
        // 如果设置为静音且正在播放，暂停音乐
        if (muted && this.isPlaying) {
            this.pauseBackgroundMusic();
        }
        
        console.log(`静音状态: ${muted ? '开启' : '关闭'}`);
        return true;
    }

    // ==================== 提示音效 ====================

    /**
     * 播放提示音效
     */
    playNotificationSound() {
        if (this.isMuted) {
            console.log('静音模式，跳过提示音');
            return false;
        }

        try {
            // 使用Web Audio API生成提示音
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // 800Hz
            oscillator.type = 'sine';
            
            // 设置音量
            const volume = this.volume * 0.3; // 提示音比背景音乐小一些
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            console.log('播放提示音效');
            return true;
        } catch (error) {
            console.error('播放提示音效失败:', error);
            return false;
        }
    }

    // ==================== 状态查询 ====================

    /**
     * 检查背景音乐是否正在播放
     */
    isBackgroundMusicPlaying() {
        return this.isPlaying && this.backgroundMusic && !this.backgroundMusic.paused;
    }

    /**
     * 获取当前音量
     */
    getVolume() {
        return this.volume;
    }

    /**
     * 检查是否静音
     */
    getMuted() {
        return this.isMuted;
    }

    // ==================== 调试方法 ====================

    /**
     * 获取音频系统状态
     */
    getAudioState() {
        return {
            backgroundMusicLoaded: !!this.backgroundMusic,
            isPlaying: this.isPlaying,
            volume: Math.round(this.volume * 100),
            isMuted: this.isMuted,
            currentTime: this.backgroundMusic ? Math.round(this.backgroundMusic.currentTime) : 0,
            duration: this.backgroundMusic ? Math.round(this.backgroundMusic.duration) : 0
        };
    }

    // ==================== 清理方法 ====================

    /**
     * 清理音频资源
     */
    cleanup() {
        this.stopBackgroundMusic();
        
        if (this.backgroundMusic) {
            this.backgroundMusic.removeEventListener('canplay', null);
            this.backgroundMusic.removeEventListener('error', null);
            this.backgroundMusic = null;
        }
        
        this.isPlaying = false;
        console.log('音频系统已清理');
    }
}

// ==================== 导出默认实例 ====================

/**
 * 导出音频管理器实例
 */
export const audioManager = new AudioManager();
