// 验证硬币分配计算的脚本
// 用于确保测试用例的期望值是正确的

function calculateOptimalCoins(cents) {
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

function convertDollarsToCents(dollars) {
    return Math.round(dollars * 100);
}

function testConversion(dollarAmount) {
    const cents = convertDollarsToCents(dollarAmount);
    const coins = calculateOptimalCoins(cents);
    
    console.log(`\n$${dollarAmount.toFixed(2)} 的转换结果:`);
    console.log(`美元 → 美分: $${dollarAmount} → ${cents}¢`);
    console.log(`硬币分配:`);
    console.log(`  Quarters (25¢): ${coins.quarter} 枚`);
    console.log(`  Dimes (10¢): ${coins.dime} 枚`);
    console.log(`  Nickels (5¢): ${coins.nickel} 枚`);
    console.log(`  Pennies (1¢): ${coins.penny} 枚`);
    
    const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
    console.log(`总硬币数: ${totalCoins} 枚`);
    
    // 验证计算
    const verification = coins.quarter * 25 + coins.dime * 10 + coins.nickel * 5 + coins.penny * 1;
    console.log(`验证: ${verification}¢ = $${(verification / 100).toFixed(2)}`);
    
    return { cents, coins, totalCoins, verification };
}

// 测试用例
console.log('🧪 硬币分配计算验证');
console.log('='.repeat(50));

const testCases = [1.00, 0.41, 0.99, 2.99, 0.01, 0.25, 0.50, 0.75];

testCases.forEach(amount => {
    testConversion(amount);
});

console.log('\n📊 验证完成！');
console.log('所有计算都应该返回正确的硬币分配。');
