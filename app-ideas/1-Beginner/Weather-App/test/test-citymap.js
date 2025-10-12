/**
 * 城市名称映射表测试
 * 测试中文城市名到英文拼音的映射
 */

// 中国主要城市映射表
const cityMap = {
  // 直辖市
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '天津': 'Tianjin',
  '重庆': 'Chongqing',
  
  // 省会城市（按省份拼音排序）
  '合肥': 'Hefei',           // 安徽
  '福州': 'Fuzhou',           // 福建
  '兰州': 'Lanzhou',          // 甘肃
  '广州': 'Guangzhou',        // 广东
  '南宁': 'Nanning',          // 广西
  '贵阳': 'Guiyang',          // 贵州
  '海口': 'Haikou',           // 海南
  '石家庄': 'Shijiazhuang',   // 河北
  '郑州': 'Zhengzhou',        // 河南
  '哈尔滨': 'Harbin',         // 黑龙江
  '武汉': 'Wuhan',            // 湖北
  '长沙': 'Changsha',         // 湖南
  '长春': 'Changchun',        // 吉林
  '南京': 'Nanjing',          // 江苏
  '南昌': 'Nanchang',         // 江西
  '沈阳': 'Shenyang',         // 辽宁
  '呼和浩特': 'Hohhot',       // 内蒙古
  '银川': 'Yinchuan',         // 宁夏
  '西宁': 'Xining',           // 青海
  '济南': 'Jinan',            // 山东
  '太原': 'Taiyuan',          // 山西
  '西安': 'Xian',             // 陕西
  '成都': 'Chengdu',          // 四川
  '拉萨': 'Lhasa',            // 西藏
  '乌鲁木齐': 'Urumqi',       // 新疆
  '昆明': 'Kunming',          // 云南
  '杭州': 'Hangzhou',         // 浙江
  
  // 重要地级市/经济特区
  '深圳': 'Shenzhen',         // 广东
  '珠海': 'Zhuhai',           // 广东
  '汕头': 'Shantou',          // 广东
  '佛山': 'Foshan',           // 广东
  '东莞': 'Dongguan',         // 广东
  '中山': 'Zhongshan',        // 广东
  '厦门': 'Xiamen',           // 福建
  '泉州': 'Quanzhou',         // 福建
  '宁波': 'Ningbo',           // 浙江
  '温州': 'Wenzhou',          // 浙江
  '绍兴': 'Shaoxing',         // 浙江
  '苏州': 'Suzhou',           // 江苏
  '无锡': 'Wuxi',             // 江苏
  '常州': 'Changzhou',        // 江苏
  '南通': 'Nantong',          // 江苏
  '青岛': 'Qingdao',          // 山东
  '烟台': 'Yantai',           // 山东
  '威海': 'Weihai',           // 山东
  '大连': 'Dalian',           // 辽宁
  '唐山': 'Tangshan',         // 河北
  '秦皇岛': 'Qinhuangdao',    // 河北
  '包头': 'Baotou',           // 内蒙古
  '三亚': 'Sanya',            // 海南
  
  // 其他重要城市
  '拉萨': 'Lhasa',            // 西藏
  '香港': 'Hong Kong',        // 特别行政区
  '澳门': 'Macao',            // 特别行政区
  '台北': 'Taipei',           // 台湾
};

/**
 * 获取城市英文名称
 */
function getCityName(input) {
  // 去除空格
  const city = input.trim();
  
  // 如果为空，返回空
  if (!city) {
    return '';
  }
  
  // 如果是英文，直接返回（首字母大写）
  if (!/[\u4e00-\u9fa5]/.test(city)) {
    // 首字母大写
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }
  
  // 如果在映射表中，直接返回
  if (cityMap[city]) {
    return cityMap[city];
  }
  
  // 如果不在映射表中，返回 null 表示不支持
  return null;
}

/**
 * 测试函数
 */
function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              城市名称映射表测试                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // 测试一：直辖市
  console.log('\n📍 测试一：直辖市');
  console.log('━'.repeat(60));
  const municipalities = ['北京', '上海', '天津', '重庆'];
  municipalities.forEach(city => {
    const result = getCityName(city);
    console.log(`  ${city} -> ${result}`);
  });
  
  // 测试二：省会城市（抽样）
  console.log('\n🏛️  测试二：省会城市（抽样）');
  console.log('━'.repeat(60));
  const capitals = ['广州', '成都', '杭州', '西安', '武汉', '南京', '长沙'];
  capitals.forEach(city => {
    const result = getCityName(city);
    console.log(`  ${city} -> ${result}`);
  });
  
  // 测试三：重要地级市
  console.log('\n🌆 测试三：重要地级市');
  console.log('━'.repeat(60));
  const cities = ['深圳', '苏州', '青岛', '大连', '厦门', '宁波'];
  cities.forEach(city => {
    const result = getCityName(city);
    console.log(`  ${city} -> ${result}`);
  });
  
  // 测试四：英文输入
  console.log('\n🔤 测试四：英文输入');
  console.log('━'.repeat(60));
  const englishCities = ['Beijing', 'beijing', 'SHANGHAI', 'shenzhen'];
  englishCities.forEach(city => {
    const result = getCityName(city);
    console.log(`  ${city} -> ${result}`);
  });
  
  // 测试五：边界情况
  console.log('\n⚠️  测试五：边界情况');
  console.log('━'.repeat(60));
  const edgeCases = [
    { input: '', desc: '空字符串' },
    { input: '  北京  ', desc: '带空格' },
    { input: '成都', desc: '正常城市' },
    { input: '小县城', desc: '不在映射表' },
    { input: 'New York', desc: '英文带空格' },
  ];
  edgeCases.forEach(({ input, desc }) => {
    const result = getCityName(input);
    console.log(`  ${desc.padEnd(12)} "${input}" -> ${result === null ? '❌ 不支持' : result}`);
  });
  
  // 测试六：多音字城市
  console.log('\n🎵 测试六：多音字城市（映射表优势）');
  console.log('━'.repeat(60));
  const polyphonicCities = [
    { city: '重庆', expected: 'Chongqing', note: '（重chóng）' },
    { city: '长沙', expected: 'Changsha', note: '（长cháng）' },
    { city: '长春', expected: 'Changchun', note: '（长cháng）' },
  ];
  polyphonicCities.forEach(({ city, expected, note }) => {
    const result = getCityName(city);
    const status = result === expected ? '✅' : '❌';
    console.log(`  ${status} ${city} -> ${result} ${note}`);
  });
  
  // 统计信息
  console.log('\n📊 统计信息');
  console.log('━'.repeat(60));
  console.log(`  映射表城市总数: ${Object.keys(cityMap).length} 个`);
  console.log(`  直辖市: 4 个`);
  console.log(`  省会城市: 27 个`);
  console.log(`  重要地级市: ${Object.keys(cityMap).length - 31} 个`);
  
  // 列出所有支持的城市
  console.log('\n📋 支持的所有城市列表');
  console.log('━'.repeat(60));
  const sortedCities = Object.keys(cityMap).sort();
  let line = '';
  sortedCities.forEach((city, index) => {
    line += city.padEnd(6);
    if ((index + 1) % 8 === 0) {
      console.log(`  ${line}`);
      line = '';
    }
  });
  if (line) {
    console.log(`  ${line}`);
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log('✅ 测试完成');
  console.log('\n💡 使用建议:');
  console.log('  1. 用户输入中文城市名，直接映射');
  console.log('  2. 用户输入英文城市名，首字母大写后返回');
  console.log('  3. 不在映射表的城市，提示用户输入英文名');
}

// 导出供 main.js 使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cityMap,
    getCityName
  };
}

// 运行测试
if (require.main === module) {
  runTests();
}

