// Chart.js 通过 UMD 脚本加载，使用全局 Chart 对象

/**
 * 创建折线图
 * @param {string} canvasId Canvas元素ID
 * @param {Array} simulationData 模拟数据
 * @param {number} theoreticalAverage 理论期望值
 * @param {number} minValue 最小值
 * @param {number} maxValue 最大值
 * @returns {Object} Chart实例
 */
function createLineChart(canvasId, simulationData, theoreticalAverage, minValue, maxValue) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas元素 ${canvasId} 未找到`);
        return null;
    }

    // 准备数据点
    const dataPoints = simulationData.map(point => ({
        x: point.iteration,
        y: point.average
    }));

    console.log(`图表 ${canvasId} 数据点:`, {
        dataLength: dataPoints.length,
        firstPoint: dataPoints[0],
        lastPoint: dataPoints[dataPoints.length - 1],
        theoreticalAverage: theoreticalAverage,
        minValue: minValue,
        maxValue: maxValue
    });

    // 创建理论期望值参考线数据
    const theoreticalLine = [
        { x: 1, y: theoreticalAverage },
        { x: simulationData.length, y: theoreticalAverage }
    ];

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: '实际平均值',
                    data: dataPoints,
                    borderColor: '#000000',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0,
                    fill: false
                },
                {
                    label: '理论期望值',
                    data: theoreticalLine,
                    borderColor: '#000000',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    min: 1,
                    max: simulationData.length,
                    ticks: {
                        color: '#000000',
                        font: {
                            size: 12
                        },
                        maxTicksLimit: 2,
                        callback: function(value, index, ticks) {
                            // 只显示第一个和最后一个刻度
                            if (value === 1 || value === simulationData.length) {
                                return value;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    min: minValue,
                    max: maxValue,
                    ticks: {
                        color: '#000000',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            // 只显示 min, max 和理论期望值
                            if (value === minValue || value === maxValue || value === theoreticalAverage) {
                                return value;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });

    return chart;
}

/**
 * 创建所有图表
 * @param {Object} simulationData 模拟数据对象
 * @param {number} theoreticalAverage 理论期望值
 * @param {number} minValue 最小值
 * @param {number} maxValue 最大值
 */
function createAllCharts(simulationData, theoreticalAverage, minValue, maxValue) {
    const charts = {};
    const chartConfigs = [
        { id: 'chart1000', data: simulationData.simulation1000 },
        { id: 'chart5000', data: simulationData.simulation5000 },
        { id: 'chart10000', data: simulationData.simulation10000 }
    ];

    chartConfigs.forEach(config => {
        if (config.data && config.data.length > 0) {
            charts[config.id] = createLineChart(config.id, config.data, theoreticalAverage, minValue, maxValue);
        }
    });

    return charts;
}

/**
 * 销毁所有图表
 * @param {Object} charts 图表对象
 */
function destroyAllCharts(charts) {
    if (!charts) return;
    
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
}

// 导出函数供其他模块使用
export { createLineChart, createAllCharts, destroyAllCharts };