# The MealDB API 使用指南

## 简介

[The MealDB](https://www.themealdb.com/api.php) 是一个免费的食谱API服务，为开发者提供丰富的食谱数据。该API永久免费，非常适合用于学习、开发和教育用途。

## API 特性

### 🆓 **永久免费**
- API和网站将始终在访问点保持免费
- 支持开发和教育用途

### 🔑 **测试API密钥**
- 开发期间可以使用测试API密钥 `"1"`
- 教育用途完全免费
- 如需在应用商店公开发布，需要成为支持者

### ⬆️ **高级功能升级**
- 支持者可访问API的测试版本
- 支持多成分过滤器
- 可添加自定义餐食和图片
- 可列出完整数据库（而非限制100项）

## V1 API 方法

所有示例使用开发者测试密钥 `'1'`

### 🔍 **搜索功能**

#### 按名称搜索餐食
```
GET https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
```

#### 按首字母列出所有餐食
```
GET https://www.themealdb.com/api/json/v1/1/search.php?f=a
```

#### 通过ID查找完整餐食详情
```
GET https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
```

### 🎲 **随机餐食**

#### 查找单个随机餐食
```
GET https://www.themealdb.com/api/json/v1/1/random.php
```

#### 查找10个随机餐食选择
```
GET https://www.themealdb.com/api/json/v1/1/randomselection.php
```
*仅限高级API*

### 📋 **分类和列表**

#### 列出所有餐食分类
```
GET https://www.themealdb.com/api/json/v1/1/categories.php
```

#### 最新餐食
```
GET https://www.themealdb.com/api/json/v1/1/latest.php
```
*仅限高级API*

#### 列出所有分类、地区、成分
```
GET https://www.themealdb.com/api/json/v1/1/list.php?c=list  # 分类
GET https://www.themealdb.com/api/json/v1/1/list.php?a=list  # 地区
GET https://www.themealdb.com/api/json/v1/1/list.php?i=list  # 成分
```

### 🔽 **过滤功能**

#### 按主要成分过滤
```
GET https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
```

#### 按多成分过滤
```
GET https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast,garlic,salt
```
*仅限高级API*

#### 按分类过滤
```
GET https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood
```

#### 按地区过滤
```
GET https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian
```

## 🖼️ **图片资源**

### 餐食缩略图
在餐食图片URL末尾添加 `/preview` 可获取不同尺寸：

```
/images/media/meals/llcbn01574260722.jpg/small   # 小尺寸
/images/media/meals/llcbn01574260722.jpg/medium  # 中等尺寸
/images/media/meals/llcbn01574260722.jpg/large   # 大尺寸
```

### 成分缩略图
URL格式匹配成分名称，空格用下划线替换：

```
https://www.themealdb.com/images/ingredients/lime.png        # 标准尺寸
https://www.themealdb.com/images/ingredients/lime-small.png  # 小尺寸
https://www.themealdb.com/images/ingredients/lime-medium.png # 中等尺寸
https://www.themealdb.com/images/ingredients/lime-large.png  # 大尺寸
```

## 💻 **实际使用示例**

### JavaScript Fetch 示例

```javascript
// 搜索意大利面食谱
async function searchPasta() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=pasta');
        const data = await response.json();
        
        if (data.meals) {
            data.meals.forEach(meal => {
                console.log(`餐食名称: ${meal.strMeal}`);
                console.log(`分类: ${meal.strCategory}`);
                console.log(`地区: ${meal.strArea}`);
                console.log(`制作说明: ${meal.strInstructions}`);
            });
        } else {
            console.log('未找到相关餐食');
        }
    } catch (error) {
        console.error('API调用失败:', error);
    }
}

// 获取随机餐食
async function getRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            console.log(`今日推荐: ${meal.strMeal}`);
            console.log(`图片: ${meal.strMealThumb}`);
        }
    } catch (error) {
        console.error('获取随机餐食失败:', error);
    }
}
```

### 响应数据结构示例

```json
{
    "meals": [
        {
            "idMeal": "52772",
            "strMeal": "Teriyaki Chicken Casserole",
            "strDrinkAlternate": null,
            "strCategory": "Chicken",
            "strArea": "Japanese",
            "strInstructions": "Preheat oven to 180C/160C fan/gas 4...",
            "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
            "strTags": "Meat,Casserole",
            "strYoutube": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
            "strIngredient1": "soy sauce",
            "strIngredient2": "water",
            "strMeasure1": "3/4 cup",
            "strMeasure2": "1/2 cup"
        }
    ]
}
```

## 📝 **开发建议**

1. **错误处理**: 始终包含适当的错误处理机制
2. **数据验证**: 检查API响应中的 `meals` 字段是否存在
3. **图片加载**: 使用缩略图提高页面加载速度
4. **缓存策略**: 考虑缓存常用数据以减少API调用
5. **用户体验**: 提供加载状态和错误提示

## 📞 **联系方式**

- **邮箱**: thedatadb@gmail.com
- **网站**: [https://www.themealdb.com/api.php](https://www.themealdb.com/api.php)

## 🏷️ **相关项目**

The MealDB 是数据库系列项目的一部分：
- TheCocktailDB (鸡尾酒数据库)
- TheAudioDB (音频数据库)  
- TheSportsDB (体育数据库)

---

*© 2025 TheMealDB - 英国制造 🇬🇧*
