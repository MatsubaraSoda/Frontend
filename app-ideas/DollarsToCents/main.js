// DollarsToCents 主逻辑文件
// 实现美元转美分的转换和最优硬币分配

class DollarsToCentsConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupValidation();
    }

    // 初始化DOM元素引用
    initializeElements() {
        this.dollarInput = document.getElementById('dollarInput');
        this.convertBtn = document.getElementById('convertBtn');
        this.resultSection = document.getElementById('resultSection');
        this.totalCents = document.getElementById('totalCents');
        this.quarterCount = document.getElementById('quarterCount');
        this.dimeCount = document.getElementById('dimeCount');
        this.nickelCount = document.getElementById('nickelCount');
        this.pennyCount = document.getElementById('pennyCount');
        this.totalCoins = document.getElementById('totalCoins');
    }

    // 绑定事件监听器
    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.handleConvert());
        this.dollarInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleConvert();
            }
        });
        
        // 实时输入验证
        this.dollarInput.addEventListener('input', () => this.validateInput());
        this.dollarInput.addEventListener('blur', () => this.formatInput());
    }

    // 设置输入验证
    setupValidation() {
        this.dollarInput.addEventListener('invalid', (e) => {
            e.preventDefault();
            this.showError('请输入有效的美元金额');
        });
    }

    // 验证输入
    validateInput() {
        const value = this.dollarInput.value;
        const inputWrapper = this.dollarInput.closest('.input-wrapper');
        
        // 清除之前的错误状态
        this.clearError();
        
        if (value === '') {
            return true;
        }
        
        const dollarAmount = parseFloat(value);
        
        if (isNaN(dollarAmount) || dollarAmount < 0) {
            this.showError('请输入有效的正数金额');
            return false;
        }
        
        if (dollarAmount > 999999.99) {
            this.showError('金额不能超过 $999,999.99');
            return false;
        }
        
        // 检查小数位数
        const decimalPlaces = (value.split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            this.showError('最多支持两位小数');
            return false;
        }
        
        // 验证通过，添加成功状态
        inputWrapper.classList.add('success');
        return true;
    }

    // 格式化输入
    formatInput() {
        const value = this.dollarInput.value;
        if (value && !isNaN(parseFloat(value))) {
            const formatted = parseFloat(value).toFixed(2);
            this.dollarInput.value = formatted;
        }
    }

    // 显示错误信息
    showError(message) {
        const inputWrapper = this.dollarInput.closest('.input-wrapper');
        inputWrapper.classList.add('error');
        
        // 移除之前的错误信息
        const existingError = inputWrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 创建新的错误信息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `⚠️ ${message}`;
        inputWrapper.appendChild(errorDiv);
        
        // 移除成功状态
        inputWrapper.classList.remove('success');
    }

    // 清除错误状态
    clearError() {
        const inputWrapper = this.dollarInput.closest('.input-wrapper');
        inputWrapper.classList.remove('error');
        
        const errorMessage = inputWrapper.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // 处理转换按钮点击
    handleConvert() {
        if (!this.validateInput()) {
            return;
        }
        
        const dollarAmount = parseFloat(this.dollarInput.value);
        if (isNaN(dollarAmount) || dollarAmount === 0) {
            this.showError('请输入有效的美元金额');
            return;
        }
        
        this.performConversion(dollarAmount);
    }

    // 执行转换计算
    performConversion(dollarAmount) {
        // 显示加载状态
        this.setLoadingState(true);
        
        // 模拟计算延迟，提供更好的用户体验
        setTimeout(() => {
            try {
                // 转换为美分（避免浮点数误差）
                const cents = this.convertDollarsToCents(dollarAmount);
                
                // 计算最优硬币分配
                const coinDistribution = this.calculateOptimalCoins(cents);
                
                // 显示结果
                this.displayResults(cents, coinDistribution);
                
                // 隐藏加载状态
                this.setLoadingState(false);
                
            } catch (error) {
                console.error('转换过程中发生错误:', error);
                this.showError('转换过程中发生错误，请重试');
                this.setLoadingState(false);
            }
        }, 300);
    }

    // 美元转美分（避免浮点数误差）
    convertDollarsToCents(dollars) {
        // 输入验证
        if (typeof dollars !== 'number' || isNaN(dollars)) {
            throw new Error('输入必须是有效的数字');
        }
        if (dollars < 0) {
            throw new Error('金额不能为负数');
        }
        if (dollars > 999999.99) {
            throw new Error('金额不能超过 $999,999.99');
        }
        
        // 使用 Math.round 确保精确转换
        // 例如：$6.56 → 656 美分
        return Math.round(dollars * 100);
    }

    // 计算最优硬币分配（贪心算法）
    calculateOptimalCoins(cents) {
        // 硬币面值（从大到小）
        const COIN_VALUES = {
            quarter: 25,  // 25美分
            dime: 10,     // 10美分
            nickel: 5,    // 5美分
            penny: 1      // 1美分
        };
        
        let remaining = cents;
        const distribution = {};
        
        // 从大到小分配硬币
        for (const [coinType, value] of Object.entries(COIN_VALUES)) {
            distribution[coinType] = Math.floor(remaining / value);
            remaining = remaining % value;
        }
        
        return distribution;
    }

    // 显示转换结果
    displayResults(totalCents, coinDistribution) {
        // 更新总美分数
        this.totalCents.textContent = totalCents.toLocaleString();
        
        // 更新各种硬币数量
        this.quarterCount.textContent = coinDistribution.quarter;
        this.dimeCount.textContent = coinDistribution.dime;
        this.nickelCount.textContent = coinDistribution.nickel;
        this.pennyCount.textContent = coinDistribution.penny;
        
        // 计算总硬币数量
        const totalCoins = Object.values(coinDistribution).reduce((sum, count) => sum + count, 0);
        this.totalCoins.textContent = totalCoins;
        
        // 显示结果区域
        this.resultSection.style.display = 'block';
        
        // 添加显示动画
        this.resultSection.style.animation = 'none';
        this.resultSection.offsetHeight; // 触发重排
        this.resultSection.style.animation = 'fadeIn 0.5s ease-out';
        
        // 滚动到结果区域
        this.resultSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // 添加成功状态到输入框
        const inputWrapper = this.dollarInput.closest('.input-wrapper');
        inputWrapper.classList.add('success');
    }

    // 设置加载状态
    setLoadingState(isLoading) {
        if (isLoading) {
            this.convertBtn.classList.add('loading');
            this.convertBtn.disabled = true;
            this.convertBtn.textContent = '转换中...';
        } else {
            this.convertBtn.classList.remove('loading');
            this.convertBtn.disabled = false;
            this.convertBtn.textContent = '转换';
        }
    }

    // 重置应用状态
    reset() {
        this.dollarInput.value = '';
        this.resultSection.style.display = 'none';
        this.clearError();
        
        // 重置所有计数
        this.totalCents.textContent = '0';
        this.quarterCount.textContent = '0';
        this.dimeCount.textContent = '0';
        this.nickelCount.textContent = '0';
        this.pennyCount.textContent = '0';
        this.totalCoins.textContent = '0';
        
        // 移除成功状态
        const inputWrapper = this.dollarInput.closest('.input-wrapper');
        inputWrapper.classList.remove('success');
        
        // 聚焦到输入框
        this.dollarInput.focus();
    }

    // 获取硬币分配详情（用于调试）
    getCoinDistributionDetails(cents) {
        const distribution = this.calculateOptimalCoins(cents);
        const details = [];
        
        for (const [coinType, count] of Object.entries(distribution)) {
            if (count > 0) {
                const coinNames = {
                    quarter: 'Quarter (25¢)',
                    dime: 'Dime (10¢)',
                    nickel: 'Nickel (5¢)',
                    penny: 'Penny (1¢)'
                };
                details.push(`${coinNames[coinType]}: ${count} 枚`);
            }
        }
        
        return details;
    }
}

// 工具函数
const Utils = {
    // 格式化美元显示
    formatDollars(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    // 格式化美分显示
    formatCents(cents) {
        return `${cents.toLocaleString()}¢`;
    },
    
    // 验证美元输入格式
    isValidDollarFormat(input) {
        const dollarRegex = /^\d+(\.\d{0,2})?$/;
        return dollarRegex.test(input);
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 创建转换器实例
        const converter = new DollarsToCentsConverter();
        
        // 将实例挂载到全局作用域（用于调试）
        window.dollarsToCentsConverter = converter;
        
        console.log('DollarsToCents 应用初始化成功！');
        
        // 添加一些示例数据用于测试
        console.log('测试用例:');
        console.log('$1.00 →', converter.getCoinDistributionDetails(100));
        console.log('$0.41 →', converter.getCoinDistributionDetails(41));
        console.log('$2.99 →', converter.getCoinDistributionDetails(299));
        
    } catch (error) {
        console.error('应用初始化失败:', error);
        
        // 显示用户友好的错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;
        errorDiv.textContent = '应用加载失败，请刷新页面重试';
        document.body.appendChild(errorDiv);
        
        // 5秒后自动移除错误提示
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
});

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DollarsToCentsConverter;
}
