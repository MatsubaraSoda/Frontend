# Axios 使用指南

## 简介

[Axios](https://www.npmjs.com/package/axios) 是一个基于Promise的HTTP客户端库，可以在浏览器和Node.js中使用。它是原生`fetch`API的强大替代品，提供了更丰富的功能和更好的开发体验。

## 为什么选择Axios而非原生Fetch？

### ✅ **Axios的优势**
- **自动JSON处理** - 自动解析JSON响应
- **请求/响应拦截器** - 统一处理请求和响应
- **更好的错误处理** - 自动处理HTTP错误状态
- **请求超时设置** - 内置超时控制
- **广泛的浏览器支持** - 兼容旧版浏览器
- **请求取消** - 支持取消正在进行的请求
- **自动请求体序列化** - 自动处理不同类型的数据

### ❌ **Fetch的局限性**
- 需要手动检查响应状态
- 需要手动调用`.json()`解析
- 错误处理较为复杂
- 不支持请求超时（需额外处理）
- 不支持请求拦截器

## 安装

### NPM安装
```bash
npm install axios
```

### CDN引入
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

## 基础用法

### GET请求

#### Axios方式
```javascript
// 使用axios
async function fetchMeals() {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=pasta');
        const meals = response.data.meals; // 自动解析JSON
        console.log(meals);
    } catch (error) {
        console.error('请求失败:', error.message);
    }
}
```

#### 对比Fetch方式
```javascript
// 使用fetch（需要更多代码）
async function fetchMeals() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=pasta');
        
        // 需要手动检查状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); // 需要手动解析JSON
        const meals = data.meals;
        console.log(meals);
    } catch (error) {
        console.error('请求失败:', error.message);
    }
}
```

### POST请求

```javascript
// 发送JSON数据
async function saveMeal(mealData) {
    try {
        const response = await axios.post('/api/meals', mealData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('保存成功:', response.data);
    } catch (error) {
        console.error('保存失败:', error.response?.data || error.message);
    }
}

// 发送表单数据
async function uploadImage(formData) {
    try {
        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.imageUrl;
    } catch (error) {
        throw new Error('图片上传失败');
    }
}
```

## 高级功能

### 1. 创建实例

```javascript
// 创建专用于MealDB API的axios实例
const mealAPI = axios.create({
    baseURL: 'https://www.themealdb.com/api/json/v1/1',
    timeout: 5000, // 5秒超时
    headers: {
        'Content-Type': 'application/json'
    }
});

// 使用实例
async function searchMeals(query) {
    try {
        const response = await mealAPI.get(`/search.php?s=${query}`);
        return response.data.meals;
    } catch (error) {
        console.error('搜索失败:', error.message);
        return [];
    }
}
```

### 2. 请求拦截器

```javascript
// 请求拦截器 - 在发送请求前执行
mealAPI.interceptors.request.use(
    config => {
        console.log('发送请求:', config.url);
        // 可以在这里添加认证token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
```

### 3. 响应拦截器

```javascript
// 响应拦截器 - 在处理响应前执行
mealAPI.interceptors.response.use(
    response => {
        console.log('收到响应:', response.status);
        return response;
    },
    error => {
        // 统一错误处理
        if (error.response?.status === 404) {
            console.log('未找到相关数据');
        } else if (error.response?.status >= 500) {
            console.log('服务器错误');
        }
        return Promise.reject(error);
    }
);
```

### 4. 取消请求

```javascript
// 创建取消token
const source = axios.CancelToken.source();

// 发送可取消的请求
async function searchWithCancel(query) {
    try {
        const response = await axios.get(`/search.php?s=${query}`, {
            cancelToken: source.token
        });
        return response.data.meals;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('请求已取消');
        } else {
            console.error('请求失败:', error.message);
        }
        return [];
    }
}

// 取消请求
function cancelSearch() {
    source.cancel('用户取消了搜索');
}
```

## Recipe-App项目中的实际应用

### 完整的食谱搜索功能

```javascript
class RecipeAPI {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://www.themealdb.com/api/json/v1/1',
            timeout: 10000
        });
        
        this.setupInterceptors();
    }
    
    setupInterceptors() {
        // 响应拦截器处理错误
        this.api.interceptors.response.use(
            response => response,
            error => {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('请求超时，请检查网络连接');
                }
                throw error;
            }
        );
    }
    
    // 搜索食谱
    async searchMeals(query) {
        try {
            const response = await this.api.get(`/search.php?s=${encodeURIComponent(query)}`);
            return response.data.meals || [];
        } catch (error) {
            console.error('搜索食谱失败:', error.message);
            return [];
        }
    }
    
    // 获取随机食谱
    async getRandomMeal() {
        try {
            const response = await this.api.get('/random.php');
            return response.data.meals?.[0] || null;
        } catch (error) {
            console.error('获取随机食谱失败:', error.message);
            return null;
        }
    }
    
    // 根据分类获取食谱
    async getMealsByCategory(category) {
        try {
            const response = await this.api.get(`/filter.php?c=${encodeURIComponent(category)}`);
            return response.data.meals || [];
        } catch (error) {
            console.error('获取分类食谱失败:', error.message);
            return [];
        }
    }
    
    // 获取食谱详情
    async getMealDetails(id) {
        try {
            const response = await this.api.get(`/lookup.php?i=${id}`);
            return response.data.meals?.[0] || null;
        } catch (error) {
            console.error('获取食谱详情失败:', error.message);
            return null;
        }
    }
}

// 使用示例
const recipeAPI = new RecipeAPI();

// 搜索意大利面食谱
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    const meals = await recipeAPI.searchMeals(query);
    
    if (meals.length > 0) {
        displayMeals(meals);
    } else {
        showNoResultsMessage();
    }
}
```

### 错误处理最佳实践

```javascript
// 统一错误处理函数
function handleAPIError(error) {
    if (error.response) {
        // 服务器响应了错误状态码
        console.error('API错误:', error.response.status, error.response.data);
        return `服务器错误 (${error.response.status})`;
    } else if (error.request) {
        // 请求发出但没有收到响应
        console.error('网络错误:', error.request);
        return '网络连接失败，请检查网络设置';
    } else {
        // 其他错误
        console.error('请求配置错误:', error.message);
        return '请求失败，请稍后重试';
    }
}

// 在组件中使用
async function searchMeals(query) {
    try {
        const response = await axios.get(`/search.php?s=${query}`);
        return response.data.meals;
    } catch (error) {
        const errorMessage = handleAPIError(error);
        showErrorMessage(errorMessage);
        return [];
    }
}
```

## 总结

### 🎯 **何时使用Axios**
- 需要复杂的HTTP请求处理
- 要求统一的错误处理
- 需要请求/响应拦截器
- 项目中有多个API端点
- 需要更好的浏览器兼容性

### 🎯 **何时使用Fetch**
- 简单的GET请求
- 项目体积要求极小
- 只需要现代浏览器支持
- 不需要复杂的配置

对于Recipe-App项目，推荐使用Axios，因为它能提供更好的错误处理、更简洁的代码和更丰富的功能，特别适合处理The MealDB API的各种请求场景。
