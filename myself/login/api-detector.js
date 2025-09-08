/**
 * API端点检测模块
 * 负责检测和切换本地/远程API服务器
 */

// API端点配置
const API_ENDPOINTS = {
    local: 'http://127.0.0.1:5000',
    remote: 'https://simple-api-exercises.up.railway.app'
};

// 当前使用的API端点
let currentApiEndpoint = null;

// 检测超时时间（毫秒）
const DETECTION_TIMEOUT = 3000;

/**
 * 初始化API端点检测
 * @returns {Promise<void>}
 */
async function initApiEndpoint() {
    console.log('正在检测可用的API端点...');
    
    // 优先尝试本地服务器
    const localAvailable = await testApiEndpoint(API_ENDPOINTS.local);
    
    if (localAvailable) {
        currentApiEndpoint = API_ENDPOINTS.local;
        console.log('✅ 本地服务器可用，使用:', currentApiEndpoint);
    } else {
        // 本地不可用，尝试远程服务器
        console.log('❌ 本地服务器不可用，尝试远程服务器...');
        const remoteAvailable = await testApiEndpoint(API_ENDPOINTS.remote);
        
        if (remoteAvailable) {
            currentApiEndpoint = API_ENDPOINTS.remote;
            console.log('✅ 远程服务器可用，使用:', currentApiEndpoint);
        } else {
            console.error('❌ 所有API服务器都不可用！');
            currentApiEndpoint = API_ENDPOINTS.local; // 默认使用本地
        }
    }
    
    // 在页面上显示当前使用的API端点
    showApiEndpointStatus();
}

/**
 * 测试API端点是否可用
 * @param {string} endpoint - API端点URL
 * @returns {Promise<boolean>} - 是否可用
 */
async function testApiEndpoint(endpoint) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DETECTION_TIMEOUT);
        
        const response = await fetch(`${endpoint}/`, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log(`测试端点 ${endpoint} 超时`);
        } else {
            console.log(`测试端点 ${endpoint} 失败:`, error.message);
        }
        return false;
    }
}

/**
 * 显示API端点状态
 */
function showApiEndpointStatus() {
    // 移除已存在的状态显示
    const existingStatus = document.getElementById('api-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'api-status';
    statusDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: ${currentApiEndpoint === API_ENDPOINTS.local ? '#4CAF50' : '#FF9800'};
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 9999;
        font-family: monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    const isLocal = currentApiEndpoint === API_ENDPOINTS.local;
    statusDiv.textContent = `API: ${isLocal ? '本地' : '远程'} ${currentApiEndpoint}`;
    
    // 添加点击切换功能
    statusDiv.title = '点击切换API端点';
    statusDiv.style.cursor = 'pointer';
    statusDiv.addEventListener('click', toggleApiEndpoint);
    
    document.body.appendChild(statusDiv);
}

/**
 * 手动切换API端点
 */
async function toggleApiEndpoint() {
    const newEndpoint = currentApiEndpoint === API_ENDPOINTS.local 
        ? API_ENDPOINTS.remote 
        : API_ENDPOINTS.local;
    
    console.log(`手动切换到: ${newEndpoint}`);
    
    const available = await testApiEndpoint(newEndpoint);
    if (available) {
        currentApiEndpoint = newEndpoint;
        showApiEndpointStatus();
        console.log(`✅ 已切换到: ${currentApiEndpoint}`);
    } else {
        console.log(`❌ 无法切换到: ${newEndpoint}，服务器不可用`);
    }
}

/**
 * 获取完整的API URL
 * @param {string} path - API路径
 * @returns {string} - 完整的API URL
 */
function getApiUrl(path) {
    if (!currentApiEndpoint) {
        console.warn('API端点未初始化，使用默认本地端点');
        return `${API_ENDPOINTS.local}${path}`;
    }
    return `${currentApiEndpoint}${path}`;
}

/**
 * 获取当前API端点
 * @returns {string|null} - 当前API端点
 */
function getCurrentApiEndpoint() {
    return currentApiEndpoint;
}

/**
 * 检查是否使用本地API
 * @returns {boolean} - 是否使用本地API
 */
function isUsingLocalApi() {
    return currentApiEndpoint === API_ENDPOINTS.local;
}

/**
 * 检查是否使用远程API
 * @returns {boolean} - 是否使用远程API
 */
function isUsingRemoteApi() {
    return currentApiEndpoint === API_ENDPOINTS.remote;
}

/**
 * 重新检测API端点
 * @returns {Promise<void>}
 */
async function recheckApiEndpoints() {
    console.log('重新检测API端点...');
    currentApiEndpoint = null;
    await initApiEndpoint();
}

// 导出函数（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApiEndpoint,
        getApiUrl,
        getCurrentApiEndpoint,
        isUsingLocalApi,
        isUsingRemoteApi,
        recheckApiEndpoints,
        toggleApiEndpoint
    };
}
