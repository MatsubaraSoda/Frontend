# HTTP请求 - 获取GitHub状态API信息

## 概述

本文档介绍如何使用JavaScript（原生、jQuery、Vue）获取GitHub状态API的信息。API地址：[https://www.githubstatus.com/api/v2/summary.json](https://www.githubstatus.com/api/v2/summary.json)

## API响应数据结构

根据[GitHub Status API](https://www.githubstatus.com/api/v2/summary.json)的响应，数据结构如下：

```json
{
  "page": {
    "id": "kctbh9vrtdwd",
    "name": "GitHub",
    "url": "https://www.githubstatus.com",
    "time_zone": "Etc/UTC",
    "updated_at": "2025-09-09T10:00:59.457Z"
  },
  "components": [
    {
      "id": "8l4ygp009s5s",
      "name": "Git Operations",
      "status": "operational",
      "description": "Performance of git clones, pulls, pushes, and associated operations"
    }
    // ... 更多组件
  ],
  "incidents": [],
  "scheduled_maintenances": [],
  "status": {
    "indicator": "none",
    "description": "All Systems Operational"
  }
}
```

## 1. 原生JavaScript实现

### 1.1 使用fetch API（推荐）

```javascript
// 基础实现
async function fetchGitHubStatus() {
    try {
        const response = await fetch('https://www.githubstatus.com/api/v2/summary.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('GitHub状态:', data);
        return data;
    } catch (error) {
        console.error('获取GitHub状态失败:', error);
        throw error;
    }
}

// 使用示例
fetchGitHubStatus()
    .then(data => {
        console.log('整体状态:', data.status.description);
        console.log('组件数量:', data.components.length);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
```

### 1.2 带超时控制的实现

```javascript
async function fetchGitHubStatusWithTimeout(timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch('https://www.githubstatus.com/api/v2/summary.json', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('请求超时');
        }
        throw error;
    }
}
```

### 1.3 使用XMLHttpRequest（兼容性更好）

```javascript
function fetchGitHubStatusXHR() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'https://www.githubstatus.com/api/v2/summary.json', true);
        xhr.timeout = 5000; // 5秒超时
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(new Error('JSON解析失败'));
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            }
        };
        
        xhr.ontimeout = function() {
            reject(new Error('请求超时'));
        };
        
        xhr.onerror = function() {
            reject(new Error('网络错误'));
        };
        
        xhr.send();
    });
}

// 使用示例
fetchGitHubStatusXHR()
    .then(data => {
        console.log('GitHub状态:', data);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
```

## 2. jQuery实现

### 2.1 基础实现

```javascript
// 使用$.get()方法
function fetchGitHubStatusJQuery() {
    return $.get('https://www.githubstatus.com/api/v2/summary.json')
        .done(function(data) {
            console.log('GitHub状态:', data);
            return data;
        })
        .fail(function(xhr, status, error) {
            console.error('请求失败:', error);
            throw new Error(`请求失败: ${error}`);
        });
}

// 使用$.ajax()方法（更灵活）
function fetchGitHubStatusAjax() {
    return $.ajax({
        url: 'https://www.githubstatus.com/api/v2/summary.json',
        method: 'GET',
        timeout: 5000,
        dataType: 'json'
    })
    .done(function(data) {
        console.log('GitHub状态:', data);
        return data;
    })
    .fail(function(xhr, status, error) {
        console.error('请求失败:', error);
        throw new Error(`请求失败: ${error}`);
    });
}
```

### 2.2 带错误处理的实现

```javascript
function fetchGitHubStatusWithErrorHandling() {
    return $.ajax({
        url: 'https://www.githubstatus.com/api/v2/summary.json',
        method: 'GET',
        timeout: 5000,
        dataType: 'json',
        beforeSend: function() {
            console.log('开始请求GitHub状态...');
        }
    })
    .done(function(data) {
        console.log('请求成功');
        console.log('整体状态:', data.status.description);
        console.log('组件数量:', data.components.length);
        
        // 显示组件状态
        data.components.forEach(component => {
            console.log(`${component.name}: ${component.status}`);
        });
        
        return data;
    })
    .fail(function(xhr, status, error) {
        if (status === 'timeout') {
            console.error('请求超时');
        } else if (xhr.status === 0) {
            console.error('网络连接失败');
        } else {
            console.error(`请求失败: ${error}`);
        }
        throw new Error(`请求失败: ${error}`);
    });
}
```

## 3. Vue.js实现

### 3.1 Vue 2实现

```javascript
// Vue 2 - 使用axios
import axios from 'axios';

export default {
    data() {
        return {
            githubStatus: null,
            loading: false,
            error: null
        };
    },
    methods: {
        async fetchGitHubStatus() {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await axios.get('https://www.githubstatus.com/api/v2/summary.json', {
                    timeout: 5000
                });
                
                this.githubStatus = response.data;
                console.log('GitHub状态:', this.githubStatus);
            } catch (error) {
                this.error = error.message;
                console.error('获取GitHub状态失败:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchGitHubStatus();
    }
};
```

### 3.2 Vue 3 Composition API实现

```javascript
// Vue 3 - 使用Composition API
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const githubStatus = ref(null);
        const loading = ref(false);
        const error = ref(null);
        
        const fetchGitHubStatus = async () => {
            loading.value = true;
            error.value = null;
            
            try {
                const response = await axios.get('https://www.githubstatus.com/api/v2/summary.json', {
                    timeout: 5000
                });
                
                githubStatus.value = response.data;
                console.log('GitHub状态:', githubStatus.value);
            } catch (err) {
                error.value = err.message;
                console.error('获取GitHub状态失败:', err);
            } finally {
                loading.value = false;
            }
        };
        
        onMounted(() => {
            fetchGitHubStatus();
        });
        
        return {
            githubStatus,
            loading,
            error,
            fetchGitHubStatus
        };
    }
};
```

### 3.3 Vue 3 使用原生fetch

```javascript
// Vue 3 - 使用原生fetch
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const githubStatus = ref(null);
        const loading = ref(false);
        const error = ref(null);
        
        const fetchGitHubStatus = async () => {
            loading.value = true;
            error.value = null;
            
            try {
                const response = await fetch('https://www.githubstatus.com/api/v2/summary.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                githubStatus.value = data;
                console.log('GitHub状态:', githubStatus.value);
            } catch (err) {
                error.value = err.message;
                console.error('获取GitHub状态失败:', err);
            } finally {
                loading.value = false;
            }
        };
        
        onMounted(() => {
            fetchGitHubStatus();
        });
        
        return {
            githubStatus,
            loading,
            error,
            fetchGitHubStatus
        };
    }
};
```

## 4. 数据处理示例

### 4.1 解析和显示状态信息

```javascript
function processGitHubStatus(data) {
    // 整体状态
    const overallStatus = data.status.description;
    console.log('整体状态:', overallStatus);
    
    // 组件状态统计
    const statusCounts = {};
    data.components.forEach(component => {
        const status = component.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('状态统计:', statusCounts);
    
    // 查找有问题的组件
    const problematicComponents = data.components.filter(
        component => component.status !== 'operational'
    );
    
    if (problematicComponents.length > 0) {
        console.log('有问题的组件:', problematicComponents);
    } else {
        console.log('所有组件运行正常');
    }
    
    // 返回处理后的数据
    return {
        overallStatus,
        statusCounts,
        problematicComponents,
        totalComponents: data.components.length
    };
}
```

### 4.2 创建状态显示组件

```javascript
function createStatusDisplay(data) {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>GitHub服务状态</h2>
        <p>整体状态: <span class="status">${data.status.description}</span></p>
        <h3>组件状态</h3>
        <ul>
            ${data.components.map(component => `
                <li>
                    <strong>${component.name}</strong>: 
                    <span class="status-${component.status}">${component.status}</span>
                </li>
            `).join('')}
        </ul>
    `;
    
    return container;
}
```

## 5. 错误处理最佳实践

### 5.1 完整的错误处理

```javascript
async function fetchGitHubStatusRobust() {
    try {
        const response = await fetch('https://www.githubstatus.com/api/v2/summary.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // 验证数据结构
        if (!data.status || !data.components) {
            throw new Error('API响应格式不正确');
        }
        
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请检查网络连接');
        } else if (error.name === 'TypeError') {
            throw new Error('网络连接失败，请检查网络设置');
        } else {
            throw new Error(`获取GitHub状态失败: ${error.message}`);
        }
    }
}
```

## 6. 实际应用示例

### 6.1 在HTML页面中使用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub状态监控</title>
    <style>
        .status-operational { color: green; }
        .status-degraded { color: orange; }
        .status-partial { color: red; }
        .status-major { color: red; }
    </style>
</head>
<body>
    <div id="app">
        <h1>GitHub服务状态</h1>
        <div id="status-container">
            <p>加载中...</p>
        </div>
        <button onclick="refreshStatus()">刷新状态</button>
    </div>

    <script>
        async function loadGitHubStatus() {
            const container = document.getElementById('status-container');
            
            try {
                const data = await fetchGitHubStatusRobust();
                
                container.innerHTML = `
                    <h2>整体状态: <span class="status-${data.status.indicator}">${data.status.description}</span></h2>
                    <h3>组件状态 (${data.components.length}个)</h3>
                    <ul>
                        ${data.components.map(component => `
                            <li>
                                <strong>${component.name}</strong>: 
                                <span class="status-${component.status}">${component.status}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <p><small>最后更新: ${new Date(data.page.updated_at).toLocaleString()}</small></p>
                `;
            } catch (error) {
                container.innerHTML = `<p style="color: red;">错误: ${error.message}</p>`;
            }
        }
        
        function refreshStatus() {
            loadGitHubStatus();
        }
        
        // 页面加载时获取状态
        document.addEventListener('DOMContentLoaded', loadGitHubStatus);
        
        // 每5分钟自动刷新
        setInterval(loadGitHubStatus, 5 * 60 * 1000);
    </script>
</body>
</html>
```

## 7. 总结

本文档介绍了三种主要的JavaScript HTTP请求方式：

1. **原生JavaScript**: 使用fetch API或XMLHttpRequest
2. **jQuery**: 使用$.get()或$.ajax()方法
3. **Vue.js**: 在Vue组件中集成HTTP请求

每种方式都有其适用场景：
- **原生JavaScript**: 无需额外依赖，现代浏览器支持良好
- **jQuery**: 兼容性好，适合传统项目
- **Vue.js**: 适合现代前端框架项目

选择哪种方式取决于您的项目需求和技术栈。建议优先使用原生fetch API，因为它简单、现代且功能强大。
