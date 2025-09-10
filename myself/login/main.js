const testContestToken = "07434f7a6ec9d4a1619ebf8b6cbab32b63a3b3c0877020abc11b2cea9d2c8d1c";
const testRegisterJson = {
    "username": "a",
    "password": "b",
    "requestType": "register"
  }

// API根路径配置
const API_BASE_URL = 'https://simple-api-exercises.up.railway.app';

// 获取完整的API URL
function getApiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

// 防止重复执行自动登录检查的标志位
let autoLoginChecked = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面决定执行什么逻辑
    if (window.location.pathname.includes('dashboard.html')) {
        // 在展示页面，初始化用户信息
        initDashboard();
    } else {
        // 在登录页面，检查自动登录
        checkAutoLogin();
    }
    
    // 获取表单和按钮元素
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // 阻止表单默认提交行为
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
    
    // 登录按钮点击事件
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // handleFormSubmit('login');
            handleLogin();
        });
    }
    
    // 注册按钮点击事件
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // handleFormSubmit('register');
            handleRegister();
        });
    }
    
    // 退出按钮点击事件
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
});

// 处理表单提交
function handleFormSubmit(requestType) {
    // 获取表单数据
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 整理成JSON格式
    const formData = {
        username: username,
        password: password,
        requestType: requestType
    };
    
    // 输出到控制台检查
    console.log('表单数据:', JSON.stringify(formData, null, 2));
}

// 处理登录请求
async function handleLogin() {
    try {
        // 获取表单数据
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 验证表单数据
        if (!username || !password) {
            console.error('请填写完整的账号和密码');
            return;
        }
        
        // 整理成JSON格式
        const loginData = {
            username: username,
            password: password,
        };
        
        console.log('发送登录请求...', loginData);
        
        // 发送POST请求到登录接口
        const response = await fetch(getApiUrl('/auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 解析响应数据
        const result = await response.json();
        console.log('登录响应:', result);
        
        // 保存token到Cookie
        if (result.token) {
            saveTokenToCookie(result.token);
            console.log('登录成功，Token已保存');
            
            // 可以在这里添加跳转到展示页面的逻辑
            window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        console.error('登录失败:', error);
    }
}

// 处理注册请求
async function handleRegister() {
    try {
        // 获取表单数据
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 验证表单数据
        if (!username || !password) {
            console.error('请填写完整的账号和密码');
            return;
        }
        
        // 整理成JSON格式
        const registerData = {
            username: username,
            password: password,
        };
        
        console.log('发送注册请求...', registerData);
        
        // 发送POST请求到注册接口
        const response = await fetch(getApiUrl('/auth/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 解析响应数据
        const result = await response.json();
        console.log('注册响应:', result);
        
        // 保存token到Cookie
        if (result.token) {
            saveTokenToCookie(result.token);
            console.log('注册成功，Token已保存');
            
            // 可以在这里添加跳转到展示页面的逻辑
            // window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        console.error('注册失败:', error);
    }
}

// 保存token到Cookie（确保唯一性）
function saveTokenToCookie(token) {
    // 先清除所有可能存在的token Cookie
    clearAllTokenCookies();
    
    // 保存新的token
    document.cookie = `authToken=${token}; path=/`;
    console.log('新Token已保存，旧Token已清除');
}

// 清除所有token相关的Cookie
function clearAllTokenCookies() {
    // 清除当前路径下的token
    document.cookie = `authToken=; path=/`;
    
    // 清除根路径下的token（如果存在）
    document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    
    // 清除可能存在的其他token变体
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    document.cookie = `userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    
    console.log('所有旧Token已清除');
}

// 读取当前token
function getCurrentToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') {
            return value;
        }
    }
    return null;
}

// 检查是否已有token
function hasExistingToken() {
    const token = getCurrentToken();
    return token !== null && token !== '';
}

// 页面加载时检查自动登录
async function checkAutoLogin() {
    // 防止重复执行
    if (autoLoginChecked) {
        console.log('自动登录检查已执行过，跳过');
        return;
    }
    
    autoLoginChecked = true;
    console.log('开始执行自动登录检查...');
    
    const token = getCurrentToken();
    
    if (token) {
        console.log('发现已保存的token，正在验证...');
        
        try {
            // 发送token到后端验证
            const response = await fetch(getApiUrl('/auth/verify'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('自动登录成功:', result);
                
                // 只在登录页面执行跳转
                if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                    console.log('在登录页面，准备跳转到展示页面');
                    window.location.href = 'dashboard.html';
                } else {
                    console.log('已在展示页面，无需跳转');
                }
            } else {
                console.log('Token已过期，清除Cookie');
                clearAllTokenCookies();
            }
        } catch (error) {
            console.error('自动登录验证失败:', error);
            clearAllTokenCookies();
        }
    } else {
        console.log('未发现保存的token，需要手动登录');
    }
}

// 初始化展示页面
function initDashboard() {
    console.log('初始化展示页面...');
    
    // 检查是否有token
    const token = getCurrentToken();
    if (!token) {
        console.log('没有token，跳转到登录页面');
        window.location.href = 'index.html';
        return;
    }
    
    // 可以在这里加载用户信息
    // 例如：从token中解析用户名，从后端获取用户分数等
    console.log('展示页面初始化完成');
}

// 所有API请求都使用远程服务器

// 退出登录功能
async function handleLogout() {
    try {
        const token = getCurrentToken();
        
        if (!token) {
            console.log('没有找到token，无需退出登录');
            return;
        }
        
        console.log('正在退出登录...');
        
        // 发送POST请求到退出登录接口
        const response = await fetch(getApiUrl('/auth/logout'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        // 无论后端响应如何，都清除本地token
        clearAllTokenCookies();
        console.log('本地token已清除');
        
        if (response.ok) {
            const result = await response.json();
            console.log('退出登录成功:', result);
        } else {
            console.log('后端退出登录失败，但本地token已清除');
        }
        
        // 跳转回登录页面
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('退出登录过程中出错:', error);
        
        // 即使出错也要清除本地token
        clearAllTokenCookies();
        console.log('已清除本地token');
        
        // 跳转回登录页面
        window.location.href = 'index.html';
    }
}