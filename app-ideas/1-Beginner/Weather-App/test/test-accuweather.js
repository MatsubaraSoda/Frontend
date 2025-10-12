/**
 * AccuWeather API 测试脚本
 * 
 * 使用前需要：
 * 1. 访问 https://developer.accuweather.com/ 注册账号
 * 2. 创建应用获取 API Key
 * 3. 在 config.json 中填入你的 API Key
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置文件路径
const configPath = path.join(__dirname, 'config.json');

// 读取配置
let config = { apiKey: '' };
if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configData);
}

// API 基础 URL
const BASE_URL = 'dataservice.accuweather.com';

/**
 * 发起 HTTPS GET 请求
 */
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(new Error('JSON 解析失败: ' + data));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * 1. 搜索城市，获取 Location Key
 * @param {string} cityName - 城市名称
 */
async function searchCity(cityName) {
    console.log(`\n📍 搜索城市: ${cityName}`);
    console.log('━'.repeat(50));
    
    const url = `https://${BASE_URL}/locations/v1/cities/search?apikey=${config.apiKey}&q=${encodeURIComponent(cityName)}&language=zh-cn`;
    
    try {
        const data = await httpsGet(url);
        
        if (data.length === 0) {
            console.log('❌ 未找到该城市');
            return null;
        }
        
        const city = data[0];
        console.log('✅ 找到城市:');
        console.log(`   城市名称: ${city.LocalizedName} (${city.EnglishName})`);
        console.log(`   国家/地区: ${city.Country.LocalizedName}`);
        console.log(`   Location Key: ${city.Key}`);
        console.log(`   地理位置: 纬度 ${city.GeoPosition.Latitude}, 经度 ${city.GeoPosition.Longitude}`);
        
        return city;
    } catch (error) {
        console.error('❌ 搜索失败:', error.message);
        return null;
    }
}

/**
 * 2. 获取当前天气状况
 * @param {string} locationKey - Location Key
 */
async function getCurrentWeather(locationKey) {
    console.log(`\n🌤️  获取当前天气 (Location Key: ${locationKey})`);
    console.log('━'.repeat(50));
    
    const url = `https://${BASE_URL}/currentconditions/v1/${locationKey}?apikey=${config.apiKey}&language=zh-cn&details=true`;
    
    try {
        const data = await httpsGet(url);
        
        if (data.length === 0) {
            console.log('❌ 未获取到天气数据');
            return null;
        }
        
        const weather = data[0];
        console.log('✅ 当前天气:');
        console.log(`   天气状况: ${weather.WeatherText}`);
        console.log(`   温度: ${weather.Temperature.Metric.Value}°${weather.Temperature.Metric.Unit}`);
        console.log(`   体感温度: ${weather.RealFeelTemperature.Metric.Value}°${weather.RealFeelTemperature.Metric.Unit}`);
        console.log(`   是否白天: ${weather.IsDayTime ? '☀️ 是' : '🌙 否'}`);
        
        if (weather.RelativeHumidity) {
            console.log(`   湿度: ${weather.RelativeHumidity}%`);
        }
        
        if (weather.Wind) {
            console.log(`   风速: ${weather.Wind.Speed.Metric.Value} ${weather.Wind.Speed.Metric.Unit}`);
            console.log(`   风向: ${weather.Wind.Direction.Localized}`);
        }
        
        if (weather.Visibility) {
            console.log(`   能见度: ${weather.Visibility.Metric.Value} ${weather.Visibility.Metric.Unit}`);
        }
        
        if (weather.UVIndex !== undefined) {
            console.log(`   紫外线指数: ${weather.UVIndex} - ${weather.UVIndexText}`);
        }
        
        console.log(`   观测时间: ${weather.LocalObservationDateTime}`);
        
        return weather;
    } catch (error) {
        console.error('❌ 获取天气失败:', error.message);
        return null;
    }
}

/**
 * 3. 获取5天预报（需要付费版 API）
 */
async function get5DayForecast(locationKey) {
    console.log(`\n📅 获取5天预报 (Location Key: ${locationKey})`);
    console.log('━'.repeat(50));
    console.log('⚠️  注意: 5天预报需要付费版 API，免费版可能无法使用');
    
    const url = `https://${BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${config.apiKey}&language=zh-cn&metric=true`;
    
    try {
        const data = await httpsGet(url);
        
        if (data.DailyForecasts) {
            console.log(`✅ 获取到 ${data.DailyForecasts.length} 天预报`);
            data.DailyForecasts.forEach((day, index) => {
                console.log(`\n   第 ${index + 1} 天 (${day.Date.split('T')[0]}):`);
                console.log(`   最高温: ${day.Temperature.Maximum.Value}°${day.Temperature.Maximum.Unit}`);
                console.log(`   最低温: ${day.Temperature.Minimum.Value}°${day.Temperature.Minimum.Unit}`);
                console.log(`   白天: ${day.Day.IconPhrase}`);
                console.log(`   夜晚: ${day.Night.IconPhrase}`);
            });
        }
        
        return data;
    } catch (error) {
        console.error('❌ 获取预报失败:', error.message);
        if (error.message.includes('401') || error.message.includes('403')) {
            console.log('💡 提示: 免费版 API 可能不支持此功能');
        }
        return null;
    }
}

/**
 * 主测试函数
 */
async function main() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║        AccuWeather API 测试脚本                ║');
    console.log('╚════════════════════════════════════════════════╝');
    
    // 检查 API Key
    if (!config.apiKey || config.apiKey === 'YOUR_API_KEY_HERE') {
        console.error('\n❌ 错误: 未配置 API Key');
        console.log('\n请按以下步骤操作:');
        console.log('1. 访问 https://developer.accuweather.com/');
        console.log('2. 注册账号并创建应用');
        console.log('3. 复制 API Key');
        console.log('4. 在 test/config.json 中填入你的 API Key');
        console.log('\nconfig.json 示例:');
        console.log('{\n  "apiKey": "your_actual_api_key_here"\n}');
        
        // 创建示例配置文件
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify({ apiKey: 'YOUR_API_KEY_HERE' }, null, 2));
            console.log(`\n✅ 已创建示例配置文件: ${configPath}`);
        }
        
        process.exit(1);
    }
    
    console.log(`\n🔑 使用 API Key: ${config.apiKey.substring(0, 8)}...`);
    
    // 从命令行参数获取城市名称，默认为北京
    const cityName = process.argv[2] || 'Beijing';
    
    // 测试流程
    const city = await searchCity(cityName);
    
    if (city) {
        await getCurrentWeather(city.Key);
        
        // 可选：测试5天预报（免费版可能不可用）
        // await get5DayForecast(city.Key);
    }
    
    console.log('\n' + '━'.repeat(50));
    console.log('✅ 测试完成');
    console.log('\n💡 使用方法:');
    console.log('   node test-accuweather.js          # 默认查询北京');
    console.log('   node test-accuweather.js Shanghai # 查询上海');
    console.log('   node test-accuweather.js 广州     # 查询广州');
}

// 运行主函数
main().catch(error => {
    console.error('\n❌ 程序错误:', error.message);
    process.exit(1);
});

