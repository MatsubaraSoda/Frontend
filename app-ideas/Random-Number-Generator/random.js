// seedrandom 通过 UMD 脚本加载，使用全局 Math.seedrandom 函数

/**
 * 从 RANDOM.ORG 获取随机种子
 * @returns {Promise<{success: boolean, seed?: string, error?: string}>}
 */
async function getRandomSeed() {
    try {
        const response = await fetch('https://www.random.org/cgi-bin/randbyte?nbytes=16&format=h');
        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }
        const hexString = await response.text();
        return { 
            success: true, 
            seed: hexString.trim() 
        };
    } catch (error) {
        return { 
            success: false, 
            error: '生成随机数失败，请重试。',
            details: error.message 
        };
    }
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @param {Function} rng 随机数生成器
 * @returns {number} 随机整数
 */
function randomInt(min, max, rng) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * 执行蒙特卡洛模拟
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @param {number} iterations 投掷次数
 * @param {Function} rng 随机数生成器
 * @returns {Array} 模拟结果数组
 */
function runSimulation(min, max, iterations, rng) {
    const results = [];
    let sum = 0;
    
    for (let i = 0; i < iterations; i++) {
        const randomNum = randomInt(min, max, rng);
        sum += randomNum;
        const currentAverage = sum / (i + 1);
        results.push({
            iteration: i + 1,
            value: randomNum,
            average: currentAverage
        });
    }
    
    return results;
}

/**
 * 计算理论期望值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 理论期望值
 */
function calculateTheoreticalAverage(min, max) {
    return (min + max) / 2;
}

/**
 * 计算偏差百分比
 * @param {number} actual 实际值
 * @param {number} theoretical 理论值
 * @returns {number} 偏差百分比
 */
function calculateDeviation(actual, theoretical) {
    return Math.abs((actual - theoretical) / theoretical * 100);
}

/**
 * 主要的随机数生成和模拟函数
 * @param {number} minValue 最小值
 * @param {number} maxValue 最大值
 * @returns {Promise<Object>} 模拟结果
 */
export async function generateSimulationData(minValue, maxValue) {
    console.log('开始生成模拟数据...');
    console.log(`参数: min=${minValue}, max=${maxValue}`);
    
    // 获取随机种子
    const seedResult = await getRandomSeed();
    if (!seedResult.success) {
        console.error('获取随机种子失败:', seedResult.error);
        return {
            success: false,
            error: seedResult.error,
            details: seedResult.details
        };
    }
    
    console.log('成功获取随机种子:', seedResult.seed);
    
    // 初始化随机数生成器
    Math.seedrandom(seedResult.seed);
    const rng = Math.random;
    
    // 计算理论期望值
    const theoreticalAverage = calculateTheoreticalAverage(minValue, maxValue);
    console.log('理论期望值:', theoreticalAverage);
    
    // 执行三组模拟
    const iterations = [1000, 5000, 10000];
    const data = {};
    
    for (const iteration of iterations) {
        console.log(`开始执行 ${iteration} 次投掷模拟...`);
        const simulationResults = runSimulation(minValue, maxValue, iteration, rng);
        const finalAverage = simulationResults[simulationResults.length - 1].average;
        const deviation = calculateDeviation(finalAverage, theoreticalAverage);
        
        data[`simulation${iteration}`] = simulationResults;
        
        console.log(`${iteration} 次投掷结果:`);
        console.log(`- 最终平均值: ${finalAverage.toFixed(4)}`);
        console.log(`- 理论期望值: ${theoreticalAverage.toFixed(4)}`);
        console.log(`- 偏差: ${deviation.toFixed(2)}%`);
    }
    
    const result = {
        success: true,
        data: data,
        theoreticalAverage: theoreticalAverage,
        seed: seedResult.seed,
        summary: {
            simulation1000: {
                finalAverage: data.simulation1000[data.simulation1000.length - 1].average,
                deviation: calculateDeviation(data.simulation1000[data.simulation1000.length - 1].average, theoreticalAverage)
            },
            simulation5000: {
                finalAverage: data.simulation5000[data.simulation5000.length - 1].average,
                deviation: calculateDeviation(data.simulation5000[data.simulation5000.length - 1].average, theoreticalAverage)
            },
            simulation10000: {
                finalAverage: data.simulation10000[data.simulation10000.length - 1].average,
                deviation: calculateDeviation(data.simulation10000[data.simulation10000.length - 1].average, theoreticalAverage)
            }
        }
    };
    
    console.log('模拟数据生成完成:', result);
    return result;
}
