// DollarsToCents 自动化测试套件
// 包含单元测试、集成测试和性能测试

class DollarsToCentsTester {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.testStartTime = 0;
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🧪 开始运行 DollarsToCents 测试套件...\n');
        
        this.testStartTime = performance.now();
        
        // 单元测试
        await this.runUnitTests();
        
        // 集成测试
        await this.runIntegrationTests();
        
        // 性能测试
        await this.runPerformanceTests();
        
        // 边界测试
        await this.runBoundaryTests();
        
        // 错误处理测试
        await this.runErrorHandlingTests();
        
        // 显示测试结果
        this.displayTestResults();
    }

    // 单元测试
    async runUnitTests() {
        console.log('📋 运行单元测试...');
        
        // 测试美元转美分转换
        this.test('convertDollarsToCents - 整数美元', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(23);
            return result === 2300;
        });
        
        this.test('convertDollarsToCents - 小数美元', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(6.56);
            return result === 656;
        });
        
        this.test('convertDollarsToCents - 边界值', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(0.01);
            return result === 1;
        });
        
        // 测试硬币分配算法
        this.test('calculateOptimalCoins - 简单情况 ($1.00 = 100¢)', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.calculateOptimalCoins(100);
            // 100¢ = 4 × 25¢ = 4枚quarter
            return result.quarter === 4 && result.dime === 0 && result.nickel === 0 && result.penny === 0;
        });
        
        this.test('calculateOptimalCoins - 复杂情况 ($0.41 = 41¢)', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.calculateOptimalCoins(41);
            // 41¢ = 1 × 25¢ + 1 × 10¢ + 1 × 5¢ + 1 × 1¢ = 4枚硬币
            return result.quarter === 1 && result.dime === 1 && result.nickel === 1 && result.penny === 1;
        });
        
        this.test('calculateOptimalCoins - 零值', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.calculateOptimalCoins(0);
            return result.quarter === 0 && result.dime === 0 && result.nickel === 0 && result.penny === 0;
        });
    }

    // 集成测试
    async runIntegrationTests() {
        console.log('🔗 运行集成测试...');
        
        // 测试完整转换流程
        this.test('完整转换流程 - $1.00', () => {
            const converter = new DollarsToCentsConverter();
            const cents = converter.convertDollarsToCents(1.00);
            const coins = converter.calculateOptimalCoins(cents);
            const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
            // $1.00 = 100美分 = 4枚quarter = 4枚硬币
            return cents === 100 && totalCoins === 4;
        });
        
        this.test('完整转换流程 - $2.99', () => {
            const converter = new DollarsToCentsConverter();
            const cents = converter.convertDollarsToCents(2.99);
            const coins = converter.calculateOptimalCoins(cents);
            const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
            // $2.99 = 299美分 = 11枚quarter + 2枚dime + 4枚penny = 17枚硬币
            return cents === 299 && totalCoins === 17;
        });
        
        this.test('完整转换流程 - $0.99', () => {
            const converter = new DollarsToCentsConverter();
            const cents = converter.convertDollarsToCents(0.99);
            const coins = converter.calculateOptimalCoins(cents);
            const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
            // $0.99 = 99美分 = 3枚quarter + 2枚dime + 4枚penny = 9枚硬币
            return cents === 99 && totalCoins === 9;
        });
    }

    // 性能测试
    async runPerformanceTests() {
        console.log('⚡ 运行性能测试...');
        
        // 测试大量数据的处理性能
        this.test('性能测试 - 大数值处理', () => {
            const converter = new DollarsToCentsConverter();
            const startTime = performance.now();
            
            // 测试1000次转换
            for (let i = 0; i < 1000; i++) {
                const randomAmount = Math.random() * 1000;
                const cents = converter.convertDollarsToCents(randomAmount);
                const coins = converter.calculateOptimalCoins(cents);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // 1000次转换应该在100ms内完成
            return duration < 100;
        });
        
        // 测试内存使用
        this.test('性能测试 - 内存使用', () => {
            const converter = new DollarsToCentsConverter();
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // 创建大量对象
            const objects = [];
            for (let i = 0; i < 10000; i++) {
                objects.push(converter.calculateOptimalCoins(i));
            }
            
            const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const memoryIncrease = finalMemory - initialMemory;
            
            // 内存增长应该在合理范围内（小于10MB）
            return memoryIncrease < 10 * 1024 * 1024;
        });
    }

    // 边界测试
    async runBoundaryTests() {
        console.log('🎯 运行边界测试...');
        
        // 测试边界值
        this.test('边界测试 - 最小值', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(0.01);
            return result === 1;
        });
        
        this.test('边界测试 - 最大值', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(999999.99);
            return result === 99999999;
        });
        
        this.test('边界测试 - 精确小数', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(0.25);
            return result === 25;
        });
        
        this.test('边界测试 - 浮点数精度', () => {
            const converter = new DollarsToCentsConverter();
            const result = converter.convertDollarsToCents(0.1 + 0.2);
            return result === 30; // 0.1 + 0.2 = 0.30000000000000004
        });
    }

    // 错误处理测试
    async runErrorHandlingTests() {
        console.log('⚠️ 运行错误处理测试...');
        
        // 测试输入验证
        this.test('错误处理 - 负数输入', () => {
            const converter = new DollarsToCentsConverter();
            try {
                const result = converter.convertDollarsToCents(-1);
                return false; // 应该抛出错误
            } catch (error) {
                return true; // 正确捕获错误
            }
        });
        
        this.test('错误处理 - 无效输入', () => {
            const converter = new DollarsToCentsConverter();
            try {
                const result = converter.convertDollarsToCents('invalid');
                return false; // 应该抛出错误
            } catch (error) {
                return true; // 正确捕获错误
            }
        });
        
        this.test('错误处理 - 过大数值', () => {
            const converter = new DollarsToCentsConverter();
            try {
                const result = converter.convertDollarsToCents(1000000);
                return false; // 应该抛出错误
            } catch (error) {
                return true; // 正确捕获错误
            }
        });
    }

    // 执行单个测试
    test(testName, testFunction) {
        this.totalTests++;
        
        try {
            const result = testFunction();
            
            if (result === true) {
                this.passedTests++;
                console.log(`✅ ${testName} - 通过`);
                this.testResults.push({ name: testName, status: 'PASS', error: null });
            } else {
                this.failedTests++;
                console.log(`❌ ${testName} - 失败`);
                this.testResults.push({ name: testName, status: 'FAIL', error: '测试返回false' });
            }
        } catch (error) {
            this.failedTests++;
            console.log(`💥 ${testName} - 错误: ${error.message}`);
            this.testResults.push({ name: testName, status: 'ERROR', error: error.message });
        }
    }

    // 显示测试结果
    displayTestResults() {
        const totalTime = performance.now() - this.testStartTime;
        
        console.log('\n📊 测试结果汇总');
        console.log('='.repeat(50));
        console.log(`总测试数: ${this.totalTests}`);
        console.log(`通过: ${this.passedTests} ✅`);
        console.log(`失败: ${this.failedTests} ❌`);
        console.log(`成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
        console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
        
        if (this.failedTests > 0) {
            console.log('\n❌ 失败的测试:');
            this.testResults
                .filter(result => result.status !== 'PASS')
                .forEach(result => {
                    console.log(`  - ${result.name}: ${result.status} - ${result.error}`);
                });
        }
        
        console.log('\n🎉 测试完成！');
        
        // 在页面上显示测试结果
        this.displayResultsInPage();
    }

    // 在页面上显示测试结果
    displayResultsInPage() {
        const testResultsDiv = document.createElement('div');
        testResultsDiv.id = 'test-results';
        testResultsDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.failedTests > 0 ? '#ef4444' : '#10b981'};
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: monospace;
            max-width: 300px;
        `;
        
        testResultsDiv.innerHTML = `
            <h3>🧪 测试结果</h3>
            <p>✅ 通过: ${this.passedTests}</p>
            <p>❌ 失败: ${this.failedTests}</p>
            <p>📊 成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 10px;
            ">关闭</button>
        `;
        
        document.body.appendChild(testResultsDiv);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (testResultsDiv.parentNode) {
                testResultsDiv.parentNode.removeChild(testResultsDiv);
            }
        }, 5000);
    }
}

// 创建测试实例并运行测试
let tester = null;

// 页面加载完成后运行测试
document.addEventListener('DOMContentLoaded', () => {
    // 等待应用初始化完成
    setTimeout(() => {
        if (window.dollarsToCentsConverter) {
            tester = new DollarsToCentsTester();
            tester.runAllTests();
        } else {
            console.error('应用未初始化，无法运行测试');
        }
    }, 1000);
});

// 全局函数，可以在控制台手动运行测试
window.runTests = function() {
    if (!tester) {
        tester = new DollarsToCentsTester();
    }
    tester.runAllTests();
};

// 导出测试类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DollarsToCentsTester;
}
