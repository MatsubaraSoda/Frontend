// UIManager 类
class UIManager {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.displayBtn = document.getElementById('displayBtn');
        this.flipButtons = document.querySelectorAll('.btn-flip');
        this.errorMessage = document.getElementById('errorMessage');
    }
    
    // 显示错误信息
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
    
    // 隐藏错误信息
    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// 导出类
export { UIManager };