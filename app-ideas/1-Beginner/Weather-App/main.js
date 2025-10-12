/**
 * 天气查询应用 - 主逻辑
 * 使用 wttr.in API 和 cityMap 映射表
 */

// ============================================
// 1. 状态管理
// ============================================
let currentWeatherData = null;
let isLoading = false;

// ============================================
// 2. 天气图标映射表
// ============================================
const weatherIcons = {
    '113': '☀️',      // 晴朗
    '116': '⛅',      // 局部多云
    '119': '☁️',      // 多云
    '122': '☁️',      // 阴天
    '143': '🌫️',     // 薄雾
    '176': '🌦️',     // 局部有雨
    '179': '🌨️',     // 局部有雪
    '182': '🌧️',     // 局部雨夹雪
    '185': '🌧️',     // 局部冻雨
    '200': '⛈️',     // 雷阵雨
    '227': '🌨️',     // 暴风雪
    '230': '❄️',      // 大暴雪
    '248': '🌫️',     // 雾
    '260': '🌫️',     // 冻雾
    '263': '🌦️',     // 小雨
    '266': '🌧️',     // 小雨
    '281': '🌧️',     // 冻雨
    '284': '🌧️',     // 强冻雨
    '293': '🌦️',     // 小雨
    '296': '🌧️',     // 小雨
    '299': '🌧️',     // 中雨
    '302': '🌧️',     // 中雨
    '305': '🌧️',     // 大雨
    '308': '🌧️',     // 暴雨
    '311': '🌧️',     // 冻雨
    '314': '🌧️',     // 强冻雨
    '317': '🌧️',     // 雨夹雪
    '320': '🌨️',     // 雨夹雪
    '323': '🌨️',     // 小雪
    '326': '🌨️',     // 小雪
    '329': '❄️',      // 中雪
    '332': '❄️',      // 中雪
    '335': '❄️',      // 大雪
    '338': '❄️',      // 暴雪
    '350': '🌧️',     // 冰雹
    '353': '🌦️',     // 小阵雨
    '356': '🌧️',     // 中阵雨
    '359': '🌧️',     // 大阵雨
    '362': '🌨️',     // 雨夹雪
    '365': '🌨️',     // 雨夹雪
    '368': '🌨️',     // 小阵雪
    '371': '❄️',      // 中阵雪
    '374': '🌧️',     // 冰雹
    '377': '🌧️',     // 冰雹
    '386': '⛈️',     // 雷阵雨
    '389': '⛈️',     // 雷暴
    '392': '⛈️',     // 雷阵雪
    '395': '⛈️'      // 强雷阵雪
};

// ============================================
// 3. API 相关
// ============================================

/**
 * 获取天气数据
 * @param {string} cityName - 英文城市名
 * @returns {Promise<Object>} 天气数据
 */
async function fetchWeather(cityName) {
    const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取天气数据失败:', error);
        throw error;
    }
}

/**
 * 解析天气数据
 * @param {Object} apiResponse - API 返回的原始数据
 * @param {string} chineseCityName - 中文城市名
 * @returns {Object} 解析后的天气数据
 */
function parseWeatherData(apiResponse, chineseCityName) {
    const current = apiResponse.current_condition[0];
    const location = apiResponse.nearest_area[0];
    const today = apiResponse.weather[0];
    const astro = today.astronomy[0];
    
    // 判断白天/夜晚
    const currentTime = current.observation_time;
    const isDayTime = checkIsDayTime(currentTime, astro.sunrise, astro.sunset);
    
    return {
        location: {
            city: chineseCityName,
            country: location.country[0].value,
            latitude: location.latitude,
            longitude: location.longitude
        },
        current: {
            temp: parseInt(current.temp_C),
            feelsLike: parseInt(current.FeelsLikeC),
            weatherDesc: current.weatherDesc[0].value,
            weatherCode: current.weatherCode,
            weatherIcon: getWeatherIcon(current.weatherCode),
            isDayTime: isDayTime,
            observationTime: currentTime,
            humidity: current.humidity,
            windSpeed: current.windspeedKmph,
            windDirection: current.winddir16Point,
            visibility: current.visibility,
            uvIndex: current.uvIndex,
            pressure: current.pressure
        },
        today: {
            date: today.date,
            maxTemp: parseInt(today.maxtempC),
            minTemp: parseInt(today.mintempC),
            sunrise: astro.sunrise,
            sunset: astro.sunset,
            moonPhase: astro.moon_phase,
            moonIllumination: astro.moon_illumination
        },
        rawData: apiResponse
    };
}

// ============================================
// 4. 城市处理
// ============================================

/**
 * 验证城市输入
 * @param {string} input - 用户输入
 * @returns {Object} { valid: boolean, cityName: string|null, error: string|null }
 */
function validateCityInput(input) {
    // 去除空格
    const city = input.trim();
    
    // 检查是否为空
    if (!city) {
        return {
            valid: false,
            cityName: null,
            error: '请输入城市名称'
        };
    }
    
    // 使用 cityMap 转换
    const englishName = CityMap.getCityName(city);
    
    if (!englishName) {
        return {
            valid: false,
            cityName: null,
            error: '暂不支持该城市，请选择其他城市'
        };
    }
    
    return {
        valid: true,
        cityName: englishName,
        chineseName: city,
        error: null
    };
}

// ============================================
// 5. UI 更新
// ============================================

/**
 * 更新天气 UI
 * @param {Object} weatherData - 解析后的天气数据
 */
function updateWeatherUI(weatherData) {
    // 位置信息
    document.getElementById('city-name').textContent = weatherData.location.city;
    document.getElementById('country-name').textContent = weatherData.location.country;
    
    // 日期信息（使用本地日期）
    const now = new Date();
    const dateInfo = formatDate(now);
    document.getElementById('current-date').textContent = dateInfo.formatted;
    document.getElementById('weekday').textContent = `(${dateInfo.weekday})`;
    
    // 白天/夜晚（使用本地时间判断）
    const dayNightIcon = document.getElementById('day-night-icon');
    const dayNightText = document.getElementById('day-night-text');
    const localHour = now.getHours();
    const isDayTimeNow = localHour >= 6 && localHour < 18; // 简化判断：6:00-18:00 为白天
    
    if (isDayTimeNow) {
        dayNightIcon.textContent = '🌅';
        dayNightText.textContent = '白天';
    } else {
        dayNightIcon.textContent = '🌙';
        dayNightText.textContent = '夜晚';
    }
    
    // 天气状况
    document.getElementById('weather-icon').textContent = weatherData.current.weatherIcon;
    document.getElementById('weather-desc').textContent = weatherData.current.weatherDesc;
    
    // 当前温度
    document.getElementById('current-temp').textContent = weatherData.current.temp;
    
    // 显示"当前"（因为 API 返回的观测时间可能是 UTC 或其他时区，不准确）
    const localTime = formatLocalTime(now);
    document.getElementById('observation-time').textContent = localTime;
    
    // 今日温度范围
    document.getElementById('min-temp').textContent = weatherData.today.minTemp;
    document.getElementById('max-temp').textContent = weatherData.today.maxTemp;
    
    // 估算最高最低温时间（简化版）
    document.getElementById('min-temp-time').textContent = '05:00';
    document.getElementById('max-temp-time').textContent = '15:00';
    
    // 更新时间（显示"刚刚"，因为 API 观测时间时区不准确）
    document.getElementById('update-time-relative').textContent = '刚刚';
    
    // 显示天气区域，隐藏初始提示
    document.getElementById('initial-prompt').style.display = 'none';
    document.getElementById('weather-section').style.display = 'block';
}

/**
 * 显示加载状态
 */
function showLoading() {
    isLoading = true;
    document.getElementById('loading-section').style.display = 'block';
    document.getElementById('initial-prompt').style.display = 'none';
    document.getElementById('weather-section').style.display = 'none';
    
    // 禁用输入
    document.getElementById('city-input').disabled = true;
    document.getElementById('search-btn').disabled = true;
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    isLoading = false;
    document.getElementById('loading-section').style.display = 'none';
    
    // 启用输入
    document.getElementById('city-input').disabled = false;
    document.getElementById('search-btn').disabled = false;
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: error, warning, success, info
 */
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    const messageIcon = document.getElementById('message-icon');
    const messageText = document.getElementById('message-text');
    const messageSection = document.getElementById('message-section');
    
    // 设置图标
    const icons = {
        error: '❌',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
    };
    
    messageIcon.textContent = icons[type] || 'ℹ️';
    messageText.textContent = message;
    
    // 设置样式类
    messageBox.className = `message-box ${type}`;
    
    // 显示消息
    messageSection.style.display = 'block';
    
    // 自动隐藏（5秒后）
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

/**
 * 隐藏消息
 */
function hideMessage() {
    document.getElementById('message-section').style.display = 'none';
}

// ============================================
// 6. 时间处理
// ============================================

/**
 * 判断是否白天
 * @param {string} currentTime - 当前时间 (HH:MM AM/PM)
 * @param {string} sunrise - 日出时间
 * @param {string} sunset - 日落时间
 * @returns {boolean} 是否白天
 */
function checkIsDayTime(currentTime, sunrise, sunset) {
    // 转换时间为分钟数
    const parseTime = (timeStr) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!match) return 0;
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3];
        
        if (period) {
            if (period.toUpperCase() === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period.toUpperCase() === 'AM' && hours === 12) {
                hours = 0;
            }
        }
        
        return hours * 60 + minutes;
    };
    
    const current = parseTime(currentTime);
    const sunriseMin = parseTime(sunrise);
    const sunsetMin = parseTime(sunset);
    
    return current >= sunriseMin && current < sunsetMin;
}

/**
 * 计算相对时间
 * @param {string} observationTime - 观测时间字符串 (HH:MM AM/PM)
 * @returns {string} 相对时间描述
 */
function calculateRelativeTime(observationTime) {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    
    // 解析观测时间（12小时制）
    const match = observationTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '刚刚';
    
    let obsHours = parseInt(match[1]);
    const obsMinutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // 转换为 24 小时制
    if (period === 'PM' && obsHours !== 12) {
        obsHours += 12;
    } else if (period === 'AM' && obsHours === 12) {
        obsHours = 0;
    }
    
    const obsTotalMinutes = obsHours * 60 + obsMinutes;
    
    // 计算时间差（分钟）
    let diffMinutes = currentTotalMinutes - obsTotalMinutes;
    
    // 处理跨天情况（如果差值为负，说明观测时间可能是前一天的）
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // 加上一天的分钟数
    }
    
    // 如果差值太大（超过12小时），可能是时区问题，显示"刚刚"
    if (diffMinutes > 12 * 60) {
        return '刚刚';
    }
    
    // 返回相对时间描述
    if (diffMinutes < 5) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffMinutes < 120) return '1小时前';
    
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}小时前`;
}

/**
 * 将 12 小时制时间转换为 24 小时制
 * @param {string} time12h - 12小时制时间 (例如: "02:00 PM", "11:30 AM")
 * @returns {string} 24小时制时间 (例如: "14:00", "11:30")
 */
function convert12to24Hour(time12h) {
    const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) {
        // 如果格式不匹配，直接返回原值
        return time12h;
    }
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    
    // 转换规则
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * 格式化本地时间
 * @param {Date} date - Date 对象
 * @returns {string} 格式化的时间 (HH:MM)
 */
function formatLocalTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * 格式化日期
 * @param {string|Date} dateInput - 日期字符串 (YYYY-MM-DD) 或 Date 对象
 * @returns {Object} { formatted: string, weekday: string }
 */
function formatDate(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    return {
        formatted: `${month}月${day}日`,
        weekday: weekday
    };
}

// ============================================
// 7. 工具函数
// ============================================

/**
 * 获取天气图标
 * @param {string} weatherCode - 天气代码
 * @returns {string} emoji 图标
 */
function getWeatherIcon(weatherCode) {
    return weatherIcons[weatherCode] || '🌤️';
}

// ============================================
// 8. localStorage 相关（Bonus 功能）
// ============================================

/**
 * 保存最后查询的城市
 * @param {string} cityName - 中文城市名
 */
function saveLastCity(cityName) {
    try {
        localStorage.setItem('lastCity', cityName);
        localStorage.setItem('lastQueryTime', new Date().toISOString());
    } catch (error) {
        console.warn('localStorage 保存失败:', error);
    }
}

/**
 * 获取最后查询的城市
 * @returns {string|null} 中文城市名
 */
function getLastCity() {
    try {
        return localStorage.getItem('lastCity');
    } catch (error) {
        console.warn('localStorage 读取失败:', error);
        return null;
    }
}

/**
 * 加载上次查询的城市
 */
function loadLastCity() {
    const lastCity = getLastCity();
    if (lastCity) {
        console.log('加载上次查询的城市:', lastCity);
        // 自动填充输入框
        document.getElementById('city-input').value = lastCity;
        // 自动查询（可选）
        // handleSearch();
    }
}

// ============================================
// 9. 事件处理
// ============================================

/**
 * 处理搜索
 */
async function handleSearch() {
    // 防止重复提交
    if (isLoading) {
        return;
    }
    
    // 获取输入
    const input = document.getElementById('city-input').value;
    
    // 验证输入
    const validation = validateCityInput(input);
    
    if (!validation.valid) {
        showMessage(validation.error, 'error');
        return;
    }
    
    // 显示加载状态
    showLoading();
    hideMessage();
    
    try {
        // 获取天气数据
        const apiData = await fetchWeather(validation.cityName);
        
        // 解析数据
        const weatherData = parseWeatherData(apiData, validation.chineseName);
        
        // 保存数据
        currentWeatherData = weatherData;
        
        // 更新 UI
        updateWeatherUI(weatherData);
        
        // 保存到 localStorage
        saveLastCity(validation.chineseName);
        
        // 显示成功消息
        showMessage('查询成功！', 'success');
        
    } catch (error) {
        console.error('查询失败:', error);
        
        // 显示错误
        if (error.message.includes('HTTP')) {
            showMessage('网络连接失败，请稍后重试', 'error');
        } else {
            showMessage('查询失败，请稍后重试', 'error');
        }
        
        // 显示初始提示（如果还没有数据）
        if (!currentWeatherData) {
            document.getElementById('initial-prompt').style.display = 'block';
        }
    } finally {
        // 隐藏加载状态
        hideLoading();
    }
}

/**
 * 处理回车键
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

/**
 * 处理关闭消息
 */
function handleCloseMessage() {
    hideMessage();
}

// ============================================
// 10. 初始化
// ============================================

/**
 * 初始化应用
 */
function init() {
    console.log('天气查询应用初始化...');
    
    // 绑定事件
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('city-input').addEventListener('keypress', handleEnterKey);
    document.getElementById('message-close').addEventListener('click', handleCloseMessage);
    
    // 加载上次查询的城市（Bonus 功能）
    loadLastCity();
    
    console.log('初始化完成！支持的城市数量:', CityMap.getSupportedCities().length);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

