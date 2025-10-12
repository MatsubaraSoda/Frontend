/**
 * pinyin.js 测试脚本
 * 测试汉字转拼音功能
 */

const { default: pinyin } = require('pinyin');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║              pinyin.js 测试脚本                            ║');
console.log('╚════════════════════════════════════════════════════════════╝');

/**
 * 测试基本转换
 */
function testBasicConversion() {
    console.log('\n📝 测试一：基本转换');
    console.log('━'.repeat(60));
    
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆'];
    
    cities.forEach(city => {
        // 默认格式 (带声调)
        const result1 = pinyin(city);
        console.log(`${city} (默认):`);
        console.log('  ', result1);
        
        // NORMAL 格式 (不带声调)
        const result2 = pinyin(city, { style: pinyin.STYLE_NORMAL });
        console.log(`${city} (NORMAL):`);
        console.log('  ', result2);
        
        console.log('');
    });
}

/**
 * 测试拼接成字符串
 */
function testConcatenation() {
    console.log('\n🔗 测试二：拼接成字符串');
    console.log('━'.repeat(60));
    
    const cities = ['北京', '上海', '广州', '深圳', '杭州'];
    
    cities.forEach(city => {
        // 方法1：使用 join 拼接
        const py1 = pinyin(city, { style: pinyin.STYLE_NORMAL })
            .map(arr => arr[0])
            .join('');
        
        console.log(`${city} -> ${py1}`);
    });
}

/**
 * 测试首字母大写
 */
function testCapitalization() {
    console.log('\n🔤 测试三：首字母大写（标准格式）');
    console.log('━'.repeat(60));
    
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '西安', '南京'];
    
    cities.forEach(city => {
        // 方法：每个音节首字母大写，拼接成一个单词
        const py = pinyin(city, { style: pinyin.STYLE_NORMAL })
            .map(arr => {
                const syllable = arr[0];
                return syllable.charAt(0).toUpperCase() + syllable.slice(1);
            })
            .join('');
        
        console.log(`${city} -> ${py}`);
    });
}

/**
 * 测试多音字
 */
function testPolyphonic() {
    console.log('\n🎵 测试四：多音字处理');
    console.log('━'.repeat(60));
    
    const words = ['重庆', '长沙', '银行', '行走'];
    
    words.forEach(word => {
        const py = pinyin(word, { 
            style: pinyin.STYLE_NORMAL,
            heteronym: true  // 启用多音字
        });
        
        console.log(`${word}:`);
        console.log('  ', py);
    });
}

/**
 * 创建城市名转换函数
 */
function getCityPinyin(cityName) {
    // 去除空格
    const city = cityName.trim();
    
    // 如果是英文，直接返回
    if (!/[\u4e00-\u9fa5]/.test(city)) {
        return city;
    }
    
    // 转换为拼音，首字母大写
    const py = pinyin(city, { style: pinyin.STYLE_NORMAL })
        .map(arr => {
            const syllable = arr[0];
            return syllable.charAt(0).toUpperCase() + syllable.slice(1);
        })
        .join('');
    
    return py;
}

/**
 * 测试最终函数
 */
function testFinalFunction() {
    console.log('\n✅ 测试五：最终函数测试');
    console.log('━'.repeat(60));
    
    const testCases = [
        '北京',
        'Beijing',
        '上海',
        'Shanghai',
        '广州',
        '深圳',
        '杭州',
        '成都',
        '重庆',
        '西安',
        '南京',
        '武汉',
        '天津',
        '长沙',
        '郑州',
        '乌鲁木齐'
    ];
    
    console.log('输入 -> 输出:');
    testCases.forEach(input => {
        const output = getCityPinyin(input);
        console.log(`  ${input.padEnd(10)} -> ${output}`);
    });
}

/**
 * 测试边界情况
 */
function testEdgeCases() {
    console.log('\n⚠️  测试六：边界情况');
    console.log('━'.repeat(60));
    
    const testCases = [
        '',           // 空字符串
        '  北京  ',   // 带空格
        'New York',   // 英文带空格
        '123',        // 数字
        '北京123',    // 混合
    ];
    
    testCases.forEach(input => {
        try {
            const output = getCityPinyin(input);
            console.log(`输入: "${input}" -> 输出: "${output}"`);
        } catch (error) {
            console.log(`输入: "${input}" -> 错误: ${error.message}`);
        }
    });
}

/**
 * 性能测试
 */
function testPerformance() {
    console.log('\n⚡ 测试七：性能测试');
    console.log('━'.repeat(60));
    
    const city = '北京';
    const iterations = 10000;
    
    console.log(`转换 "${city}" ${iterations} 次...`);
    
    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        getCityPinyin(city);
    }
    const end = Date.now();
    
    const totalTime = end - start;
    const avgTime = totalTime / iterations;
    
    console.log(`总耗时: ${totalTime}ms`);
    console.log(`平均耗时: ${avgTime.toFixed(4)}ms`);
    console.log(`每秒可转换: ${Math.round(iterations / (totalTime / 1000))} 次`);
}

/**
 * 主函数
 */
function main() {
    // 运行所有测试
    testBasicConversion();
    testConcatenation();
    testCapitalization();
    testPolyphonic();
    testFinalFunction();
    testEdgeCases();
    testPerformance();
    
    console.log('\n' + '━'.repeat(60));
    console.log('✅ 所有测试完成');
    console.log('\n💡 推荐使用的转换函数:');
    console.log(`
function getCityPinyin(cityName) {
    const city = cityName.trim();
    
    // 如果是英文，直接返回
    if (!/[\\u4e00-\\u9fa5]/.test(city)) {
        return city;
    }
    
    // 转换为拼音，首字母大写
    const py = pinyin(city, { style: pinyin.STYLE_NORMAL })
        .map(arr => {
            const syllable = arr[0];
            return syllable.charAt(0).toUpperCase() + syllable.slice(1);
        })
        .join('');
    
    return py;
}
    `);
}

// 运行测试
main();

