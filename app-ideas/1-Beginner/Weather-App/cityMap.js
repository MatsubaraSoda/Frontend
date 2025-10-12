/**
 * 城市名称映射表
 * 中文城市名 -> 英文拼音（用于 API 查询）
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
  
  // 特别行政区
  '香港': 'Hong Kong',        // 特别行政区
  '澳门': 'Macao',            // 特别行政区
  
  // 台湾主要城市
  '台北': 'Taipei',           // 台湾
};

/**
 * 获取城市英文名称
 * @param {string} chineseName - 中文城市名
 * @returns {string|null} 英文城市名，如果不在映射表中返回 null
 */
function getCityName(chineseName) {
  // 去除首尾空格
  const city = chineseName.trim();
  
  // 如果为空，返回 null
  if (!city) {
    return null;
  }
  
  // 查询映射表
  return cityMap[city] || null;
}

/**
 * 检查城市是否支持
 * @param {string} chineseName - 中文城市名
 * @returns {boolean} 是否支持该城市
 */
function isCitySupported(chineseName) {
  const city = chineseName.trim();
  return city in cityMap;
}

/**
 * 获取所有支持的城市列表
 * @returns {string[]} 中文城市名数组
 */
function getSupportedCities() {
  return Object.keys(cityMap);
}

/**
 * 获取常用城市列表（用于快捷选择）
 * @returns {string[]} 常用城市数组
 */
function getPopularCities() {
  return [
    '北京', '上海', '广州', '深圳', 
    '杭州', '成都', '武汉', '西安',
    '南京', '天津', '重庆', '苏州'
  ];
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = {
    cityMap,
    getCityName,
    isCitySupported,
    getSupportedCities,
    getPopularCities
  };
}

// 浏览器环境（全局变量）
if (typeof window !== 'undefined') {
  window.CityMap = {
    getCityName,
    isCitySupported,
    getSupportedCities,
    getPopularCities
  };
}

