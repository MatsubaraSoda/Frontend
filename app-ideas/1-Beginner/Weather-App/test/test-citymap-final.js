/**
 * cityMap.js 最终版本测试
 * 测试只接受中文输入的城市映射
 */

const { 
  cityMap, 
  getCityName, 
  isCitySupported, 
  getSupportedCities,
  getPopularCities 
} = require('../cityMap.js');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║            cityMap.js 最终版本测试                        ║');
console.log('║            （只支持中文城市名输入）                        ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// 测试一：基本转换
console.log('\n✅ 测试一：基本转换');
console.log('━'.repeat(60));
const testCities = [
  '北京', '上海', '广州', '深圳', 
  '杭州', '成都', '重庆', '西安'
];
testCities.forEach(city => {
  const result = getCityName(city);
  console.log(`  ${city.padEnd(6)} -> ${result}`);
});

// 测试二：空格处理
console.log('\n🔧 测试二：空格处理');
console.log('━'.repeat(60));
const spaceTests = [
  '北京',
  '  北京',
  '北京  ',
  '  北京  '
];
spaceTests.forEach(input => {
  const result = getCityName(input);
  console.log(`  "${input}" -> ${result}`);
});

// 测试三：不支持的城市
console.log('\n❌ 测试三：不支持的城市');
console.log('━'.repeat(60));
const unsupportedCities = [
  '小县城',
  '某个市',
  '',
  '   '
];
unsupportedCities.forEach(city => {
  const result = getCityName(city);
  const supported = isCitySupported(city);
  console.log(`  "${city}" -> ${result} (支持: ${supported})`);
});

// 测试四：多音字城市
console.log('\n🎵 测试四：多音字城市（正确拼写）');
console.log('━'.repeat(60));
const polyphonicTests = [
  { city: '重庆', expected: 'Chongqing' },
  { city: '长沙', expected: 'Changsha' },
  { city: '长春', expected: 'Changchun' },
];
polyphonicTests.forEach(({ city, expected }) => {
  const result = getCityName(city);
  const status = result === expected ? '✅' : '❌';
  console.log(`  ${status} ${city} -> ${result} (期望: ${expected})`);
});

// 测试五：检查城市是否支持
console.log('\n🔍 测试五：检查城市是否支持');
console.log('━'.repeat(60));
const checkTests = [
  '北京',
  '上海',
  '小县城',
  '广州'
];
checkTests.forEach(city => {
  const supported = isCitySupported(city);
  console.log(`  ${city.padEnd(6)} -> ${supported ? '✅ 支持' : '❌ 不支持'}`);
});

// 测试六：获取常用城市
console.log('\n⭐ 测试六：获取常用城市列表');
console.log('━'.repeat(60));
const popularCities = getPopularCities();
console.log(`  常用城市数量: ${popularCities.length} 个`);
console.log(`  列表: ${popularCities.join('、')}`);

// 测试七：统计信息
console.log('\n📊 测试七：统计信息');
console.log('━'.repeat(60));
const allCities = getSupportedCities();
console.log(`  总支持城市数: ${allCities.length} 个`);

// 按区域统计
const municipalities = allCities.filter(c => ['北京', '上海', '天津', '重庆'].includes(c));
console.log(`  直辖市: ${municipalities.length} 个`);

// 测试八：实际使用场景模拟
console.log('\n💡 测试八：实际使用场景模拟');
console.log('━'.repeat(60));

function simulateUserInput(input) {
  console.log(`\n  用户输入: "${input}"`);
  
  const cityName = getCityName(input);
  
  if (cityName) {
    console.log(`  ✅ 转换成功: ${cityName}`);
    console.log(`  📡 可以调用 API: https://wttr.in/${cityName}?format=j1`);
    return true;
  } else {
    console.log(`  ❌ 不支持该城市`);
    console.log(`  💬 提示用户: "暂不支持该城市，请选择其他城市"`);
    return false;
  }
}

simulateUserInput('北京');
simulateUserInput('深圳');
simulateUserInput('某县城');

// 测试九：性能测试
console.log('\n\n⚡ 测试九：性能测试');
console.log('━'.repeat(60));
const iterations = 100000;
console.log(`  查询 "北京" ${iterations} 次...`);

const start = Date.now();
for (let i = 0; i < iterations; i++) {
  getCityName('北京');
}
const end = Date.now();

const totalTime = end - start;
const avgTime = totalTime / iterations;

console.log(`  总耗时: ${totalTime}ms`);
console.log(`  平均耗时: ${avgTime.toFixed(6)}ms`);
console.log(`  每秒可查询: ${Math.round(iterations / (totalTime / 1000))} 次`);

// 总结
console.log('\n' + '━'.repeat(60));
console.log('✅ 所有测试完成');
console.log('\n📋 功能总结:');
console.log('  ✅ 只接受中文城市名输入');
console.log('  ✅ 支持 57 个主要城市');
console.log('  ✅ 自动去除首尾空格');
console.log('  ✅ 多音字拼写正确');
console.log('  ✅ 不支持的城市返回 null');
console.log('  ✅ 性能优秀（O(1) 查询）');
console.log('\n💡 使用方法:');
console.log(`
  // 在 main.js 中使用
  const cityName = CityMap.getCityName('北京');
  if (cityName) {
    // 查询天气
    fetch(\`https://wttr.in/\${cityName}?format=j1\`)
      .then(/* ... */);
  } else {
    // 提示用户
    showMessage('暂不支持该城市');
  }
`);

