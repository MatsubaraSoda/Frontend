// 秒表应用主要逻辑
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        
        // 圈数记录相关属性
        this.laps = [];
        this.lastLapTime = 0;
        
        // 获取DOM元素
        this.display = document.querySelector('.time');
        this.startBtn = document.querySelector('.btn.start');
        this.stopBtn = document.querySelector('.btn.stop');
        this.resetBtn = document.querySelector('.btn.reset');
        this.lapBtn = document.querySelector('.btn.lap');
        this.lapsGridBody = document.querySelector('#lapsGridBody');
        
        // 绑定事件监听器
        this.bindEvents();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.addLap());
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
        }
    }
    
    stop() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
        }
    }
    
    reset() {
        this.stop();
        this.clearLaps();
        this.elapsedTime = 0;
        this.display.textContent = '00:00:00';
    }
    
    // 清理方法：确保销毁所有定时器
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isRunning = false;
    }
    
    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        const timeString = this.formatTime(this.elapsedTime);
        this.display.textContent = timeString;
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
    }
    
    // 添加圈数记录
    addLap() {
        if (!this.isRunning) return;  // 只有运行时才能记圈
        
        const currentTime = this.elapsedTime;
        const lapNumber = this.laps.length + 1;
        const lapTime = currentTime - this.lastLapTime;
        
        const lap = {
            lapNumber,
            lapTime,
            totalTime: currentTime
        };
        
        this.laps.push(lap);
        this.lastLapTime = currentTime;
        this.renderLap(lap);
    }
    
    // 清空圈数记录
    clearLaps() {
        this.laps = [];
        this.lastLapTime = 0;
        if (this.lapsGridBody) {
            this.lapsGridBody.innerHTML = '';
        }
    }
    
    // 渲染单个圈数记录
    renderLap(lap) {
        if (!this.lapsGridBody) return;
        
        const lapElement = document.createElement('div');
        lapElement.className = 'grid-row';
        lapElement.innerHTML = `
            <div class="grid-cell">${lap.lapNumber}</div>
            <div class="grid-cell">${this.formatTime(lap.lapTime)}</div>
            <div class="grid-cell">${this.formatTime(lap.totalTime)}</div>
        `;
        this.lapsGridBody.appendChild(lapElement);
    }
    
}

// CatRun 类：负责小猫动画控制
class CatRun {
    constructor() {
        this.element = document.querySelector('.cat-run');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 监听自定义事件
        document.addEventListener('stopwatch:start', () => this.start());
        document.addEventListener('stopwatch:stop', () => this.pause());
        document.addEventListener('stopwatch:reset', () => this.stop());
    }
    
    start() {
        this.element.classList.add('running');
        this.element.classList.remove('paused');
    }
    
    pause() {
        this.element.classList.add('paused');
    }
    
    stop() {
        this.element.classList.remove('running', 'paused');
    }
}

// 全局按钮事件监听器
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn')) return;
    
    const btn = e.target;
    
    // 延迟触发事件，确保 Stopwatch 方法已执行
    setTimeout(() => {
        if (btn.classList.contains('start')) {
            document.dispatchEvent(new CustomEvent('stopwatch:start'));
        }
        if (btn.classList.contains('stop')) {
            document.dispatchEvent(new CustomEvent('stopwatch:stop'));
        }
        if (btn.classList.contains('reset')) {
            document.dispatchEvent(new CustomEvent('stopwatch:reset'));
        }
    }, 0);
});

// 页面加载完成后初始化秒表
let stopwatchInstance;

document.addEventListener('DOMContentLoaded', () => {
    stopwatchInstance = new Stopwatch();
    new CatRun();  // 初始化小猫动画控制器
});

// 页面卸载时清理定时器
window.addEventListener('beforeunload', () => {
    if (stopwatchInstance) {
        stopwatchInstance.destroy();
    }
});
