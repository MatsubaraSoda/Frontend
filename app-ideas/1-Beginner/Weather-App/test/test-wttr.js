/**
 * wttr.in 天气 API 测试脚本
 * 
 * 特点：
 * - 完全免费，无需注册
 * - 无需 API Key
 * - 支持中英文城市名
 * - 数据详细丰富
 */

const https = require('https');

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
                    reject(new Error('JSON 解析失败: ' + e.message));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * 获取城市天气
 * @param {string} cityName - 城市名称（支持中英文）
 */
async function getWeather(cityName) {
    console.log(`\n🌤️  查询城市天气: ${cityName}`);
    console.log('━'.repeat(60));
    
    // wttr.in API - 返回 JSON 格式
    const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1`;
    
    console.log(`📡 API: ${url}`);
    
    try {
        const data = await httpsGet(url);
        
        // 检查是否有错误
        if (data.error) {
            console.log('❌ 查询失败:', data.error);
            return null;
        }
        
        // 当前天气
        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        
        console.log('\n📍 位置信息:');
        console.log('━'.repeat(60));
        console.log(`   城市名称: ${location.areaName[0].value}`);
        console.log(`   国家/地区: ${location.country[0].value}`);
        console.log(`   纬度: ${location.latitude}, 经度: ${location.longitude}`);
        
        console.log('\n🌡️  当前天气:');
        console.log('━'.repeat(60));
        console.log(`   天气状况: ${current.weatherDesc[0].value}`);
        console.log(`   中文描述: ${current.lang_zh ? current.lang_zh[0].value : '无'}`);
        console.log(`   温度: ${current.temp_C}°C (${current.temp_F}°F)`);
        console.log(`   体感温度: ${current.FeelsLikeC}°C (${current.FeelsLikeF}°F)`);
        console.log(`   湿度: ${current.humidity}%`);
        console.log(`   风速: ${current.windspeedKmph} km/h (${current.windspeedMiles} mph)`);
        console.log(`   风向: ${current.winddir16Point} (${current.winddirDegree}°)`);
        console.log(`   气压: ${current.pressure} mb`);
        console.log(`   能见度: ${current.visibility} km`);
        console.log(`   云量: ${current.cloudcover}%`);
        console.log(`   紫外线指数: ${current.uvIndex}`);
        console.log(`   观测时间: ${current.observation_time}`);
        
        // 天气图标代码
        console.log(`\n   天气代码: ${current.weatherCode}`);
        console.log(`   图标: ${getWeatherIcon(current.weatherCode)}`);
        
        // 今日天气概况
        console.log('\n📅 今日天气:');
        console.log('━'.repeat(60));
        const today = data.weather[0];
        console.log(`   日期: ${today.date}`);
        console.log(`   最高温: ${today.maxtempC}°C (${today.maxtempF}°F)`);
        console.log(`   最低温: ${today.mintempC}°C (${today.mintempF}°F)`);
        console.log(`   平均温度: ${today.avgtempC}°C (${today.avgtempF}°F)`);
        console.log(`   总降水量: ${today.totalprecipMM} mm`);
        console.log(`   日照时长: ${today.sunHour} 小时`);
        console.log(`   紫外线指数: ${today.uvIndex}`);
        
        // 天文信息
        const astro = today.astronomy[0];
        console.log('\n🌅 天文信息:');
        console.log('━'.repeat(60));
        console.log(`   日出: ${astro.sunrise}`);
        console.log(`   日落: ${astro.sunset}`);
        console.log(`   月出: ${astro.moonrise}`);
        console.log(`   月落: ${astro.moonset}`);
        console.log(`   月相: ${astro.moon_phase}`);
        console.log(`   月亮照度: ${astro.moon_illumination}%`);
        
        // 未来预报
        if (data.weather.length > 1) {
            console.log('\n📆 未来预报:');
            console.log('━'.repeat(60));
            data.weather.slice(1, 4).forEach((day) => {
                console.log(`\n   ${day.date}:`);
                console.log(`   温度: ${day.mintempC}°C ~ ${day.maxtempC}°C`);
                console.log(`   天气: ${day.hourly[0].weatherDesc[0].value}`);
                console.log(`   降水: ${day.totalprecipMM} mm`);
            });
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
        return null;
    }
}

/**
 * 根据天气代码返回对应的 emoji 图标
 * @param {string} code - 天气代码
 * @returns {string} emoji
 */
function getWeatherIcon(code) {
    const weatherIcons = {
        '113': '☀️ 晴朗',
        '116': '⛅ 局部多云',
        '119': '☁️ 多云',
        '122': '☁️ 阴天',
        '143': '🌫️ 薄雾',
        '176': '🌦️ 局部有雨',
        '179': '🌨️ 局部有雪',
        '182': '🌧️ 局部雨夹雪',
        '185': '🌧️ 局部冻雨',
        '200': '⛈️ 雷阵雨',
        '227': '🌨️ 暴风雪',
        '230': '❄️ 大暴雪',
        '248': '🌫️ 雾',
        '260': '🌫️ 冻雾',
        '263': '🌦️ 小雨',
        '266': '🌧️ 小雨',
        '281': '🌧️ 冻雨',
        '284': '🌧️ 强冻雨',
        '293': '🌦️ 小雨',
        '296': '🌧️ 小雨',
        '299': '🌧️ 中雨',
        '302': '🌧️ 中雨',
        '305': '🌧️ 大雨',
        '308': '🌧️ 暴雨',
        '311': '🌧️ 冻雨',
        '314': '🌧️ 强冻雨',
        '317': '🌧️ 雨夹雪',
        '320': '🌨️ 雨夹雪',
        '323': '🌨️ 小雪',
        '326': '🌨️ 小雪',
        '329': '❄️ 中雪',
        '332': '❄️ 中雪',
        '335': '❄️ 大雪',
        '338': '❄️ 暴雪',
        '350': '🌧️ 冰雹',
        '353': '🌦️ 小阵雨',
        '356': '🌧️ 中阵雨',
        '359': '🌧️ 大阵雨',
        '362': '🌨️ 雨夹雪',
        '365': '🌨️ 雨夹雪',
        '368': '🌨️ 小阵雪',
        '371': '❄️ 中阵雪',
        '374': '🌧️ 冰雹',
        '377': '🌧️ 冰雹',
        '386': '⛈️ 雷阵雨',
        '389': '⛈️ 雷暴',
        '392': '⛈️ 雷阵雪',
        '395': '⛈️ 强雷阵雪'
    };
    
    return weatherIcons[code] || '🌤️ 未知';
}

/**
 * 测试多个城市
 */
async function testMultipleCities() {
    const cities = [
        'Beijing',
        '上海',
        'Guangzhou',
        'Tokyo',
        'London'
    ];
    
    console.log('\n🌍 测试多个城市:');
    console.log('━'.repeat(60));
    
    for (const city of cities) {
        await getWeather(city);
        console.log('\n' + '═'.repeat(60) + '\n');
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              wttr.in 天气 API 测试脚本                    ║');
    console.log('║           完全免费 | 无需注册 | 支持中英文                ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    
    // 从命令行参数获取城市名称
    const cityName = process.argv[2];
    
    if (!cityName) {
        console.log('\n💡 使用方法:');
        console.log('   node test-wttr.js Beijing          # 查询北京');
        console.log('   node test-wttr.js 上海              # 查询上海');
        console.log('   node test-wttr.js "New York"       # 查询纽约');
        console.log('   node test-wttr.js --test-multiple  # 测试多个城市');
        
        console.log('\n📝 示例查询:');
        await getWeather('Beijing');
    } else if (cityName === '--test-multiple') {
        await testMultipleCities();
    } else {
        await getWeather(cityName);
    }
    
    console.log('\n' + '━'.repeat(60));
    console.log('✅ 测试完成');
    console.log('\n🌐 API 来源: https://wttr.in/');
    console.log('📚 文档: https://github.com/chubin/wttr.in');
}

// 运行主函数
main().catch(error => {
    console.error('\n❌ 程序错误:', error.message);
    process.exit(1);
});

