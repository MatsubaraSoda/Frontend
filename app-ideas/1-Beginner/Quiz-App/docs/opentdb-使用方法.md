# Open Trivia Database API 使用方法

## 简介

Open Trivia Database 提供完全免费的 JSON API，用于编程项目中获取问答题目。使用此 API 不需要 API Key，只需生成 URL 并在您的应用程序中使用即可检索问答题目。

所有 API 提供的数据均在 Creative Commons Attribution-ShareAlike 4.0 International License 许可下提供。

## 快速开始

### 基础 API 调用

最简单的 API 调用格式：
```
https://opentdb.com/api.php?amount=10
```

这将返回 10 道随机问答题目。

## API 参数详解

### 必需参数
- `amount`: 问题数量（最多 50 题）

### 可选参数
- `category`: 类别 ID（见下方问题类别列表）
- `difficulty`: 难度级别（easy, medium, hard）
- `type`: 问题类型（multiple 多选题, boolean 判断题）
- `encode`: 编码格式（见下方编码类型章节）
- `token`: Session Token（避免重复题目）

### 示例 URL
```
https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
```

## Session Token (会话令牌)

Session Token 是唯一的密钥，用于跟踪 API 已检索的问题，确保不会获得重复的问题。

### 获取 Session Token
```
https://opentdb.com/api_token.php?command=request
```

### 使用 Session Token
```
https://opentdb.com/api.php?amount=10&token=YOUR_TOKEN_HERE
```

### 重置 Session Token
```
https://opentdb.com/api_token.php?command=reset&token=YOUR_TOKEN_HERE
```

**注意：** Session Token 在 6 小时不活动后会被删除。

## 响应代码说明

API 在每次调用中都会附加响应代码，帮助开发者了解 API 状态：

- **Code 0: 成功** - 成功返回结果
- **Code 1: 无结果** - 无法返回结果，API 没有足够的问题满足查询
- **Code 2: 无效参数** - 包含无效参数
- **Code 3: Token 未找到** - Session Token 不存在
- **Code 4: Token 为空** - Session Token 已返回指定查询的所有可能问题，需要重置 Token
- **Code 5: 速率限制** - 请求过多，每个 IP 每 5 秒只能访问 API 一次

## 编码类型

API 可能包含 Unicode 或特殊字符的问题，因此以编码格式返回结果。

### 为什么需要编码？

在网络传输中，某些字符可能会被误解或导致错误：
- 特殊符号（如 `&`、`"`、`<`、`>`）
- 非英文字符（如中文、数学符号 π）
- 空格和换行符

编码确保这些字符能够安全地在网络中传输和正确显示。

### 编码类型选项

#### 1. **默认编码 (HTML Codes)** - 推荐新手使用
```
&encode=default 或不指定编码参数
```
**特点：**
- 最常用的编码方式
- 将特殊字符转换为 HTML 实体
- 在网页中直接使用时最安全
- 大多数编程语言都有内置解码函数

**适用场景：** 在网页中显示问题时

#### 2. **Legacy URL 编码**
```
&encode=urlLegacy
```
**特点：**
- 旧版本的 URL 编码标准
- 主要为了兼容老系统
- 不推荐新项目使用

**适用场景：** 需要兼容旧系统时

#### 3. **URL 编码 (RFC 3986)** 
```
&encode=url3986
```
**特点：**
- 现代标准的 URL 编码
- 将特殊字符转换为 %XX 格式
- 适合在 URL 参数中传递数据

**适用场景：** 需要将问题作为 URL 参数传递时

#### 4. **Base64 编码**
```
&encode=base64
```
**特点：**
- 将文本转换为 Base64 格式
- 所有字符都是安全的 ASCII 字符
- 数据量会增加约 33%

**适用场景：** 需要在各种系统间安全传输数据时

### 编码示例对比

假设原始问题是：`"Don't forget that π = 3.14 & doesn't equal 3."`

#### HTML 编码（默认）
```
&quot;Don&#039;t forget that &pi; = 3.14 &amp; doesn&#039;t equal 3.&quot;
```
- `"` → `&quot;`
- `'` → `&#039;`
- `π` → `&pi;`
- `&` → `&amp;`

#### URL 编码
```
%22Don%27t%20forget%20that%20%CF%80%20%3D%203.14%20%26%20doesn%27t%20equal%203.%22
```
- `"` → `%22`
- `'` → `%27`
- 空格 → `%20`
- `π` → `%CF%80`
- `=` → `%3D`
- `&` → `%26`

#### Base64 编码
```
IkRvbid0IGZvcmdldCB0aGF0IM+AID0gMy4xNCAmIGRvZXNuJ3QgZXF1YWwgMy4i
```

### 如何选择编码类型？

| 使用场景 | 推荐编码 | 原因 |
|---------|---------|------|
| 网页显示 | HTML 编码（默认） | 浏览器原生支持，安全可靠 |
| URL 参数传递 | URL 编码 | 符合 URL 标准，不会破坏链接 |
| 数据存储/传输 | Base64 | 通用性强，各平台支持好 |
| 新手学习 | HTML 编码（默认） | 最简单，出错概率低 |

### JavaScript 解码示例

```javascript
// HTML 解码
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// URL 解码
function decodeURL(url) {
    return decodeURIComponent(url);
}

// Base64 解码
function decodeBase64(base64) {
    return atob(base64);
}

// 使用示例
const htmlEncoded = "&quot;Don&#039;t forget that &pi; = 3.14 &amp; doesn&#039;t equal 3.&quot;";
const decoded = decodeHTML(htmlEncoded);
console.log(decoded); // "Don't forget that π = 3.14 & doesn't equal 3."
```

### 新手建议

1. **从默认编码开始**：如果不确定用哪种，就用默认编码
2. **测试解码功能**：获取数据后先测试解码是否正确
3. **处理错误**：编码/解码可能失败，要有错误处理机制
4. **查看实际数据**：用 `console.log()` 查看 API 返回的原始数据格式

## 辅助 API 工具

### 获取所有类别
```
https://opentdb.com/api_category.php
```

### 查询特定类别的问题数量
```
https://opentdb.com/api_count.php?category=CATEGORY_ID_HERE
```

### 查询全局问题数量
```
https://opentdb.com/api_count_global.php
```

## 问题类别列表

常见类别包括：
- 9: General Knowledge (常识)
- 10: Entertainment: Books (娱乐：书籍)
- 11: Entertainment: Film (娱乐：电影)
- 12: Entertainment: Music (娱乐：音乐)
- 17: Science & Nature (科学与自然)
- 18: Science: Computers (科学：计算机)
- 19: Science: Mathematics (科学：数学)
- 21: Sports (体育)
- 22: Geography (地理)
- 23: History (历史)

## API 限制

- 每次 API 调用只能请求一个类别
- 每次调用最多可检索 50 个问题
- 每个 IP 每 5 秒只能访问 API 一次

## JavaScript 使用示例

```javascript
// 基础获取问题
async function fetchQuizQuestions(amount = 10, category = '', difficulty = '') {
    let url = `https://opentdb.com/api.php?amount=${amount}`;
    
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.response_code === 0) {
            return data.results;
        } else {
            console.error('API Error:', data.response_code);
            return null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// 获取 Session Token
async function getSessionToken() {
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    return data.token;
}

// 使用示例
fetchQuizQuestions(5, 9, 'easy').then(questions => {
    console.log(questions);
});
```

## 响应数据格式示例

```json
{
    "response_code": 0,
    "results": [
        {
            "category": "General Knowledge",
            "type": "multiple",
            "difficulty": "easy",
            "question": "What is the capital of Australia?",
            "correct_answer": "Canberra",
            "incorrect_answers": [
                "Sydney",
                "Melbourne",
                "Perth"
            ]
        }
    ]
}
```

## 最佳实践

1. **使用 Session Token** 避免重复问题
2. **处理错误代码** 根据响应代码采取适当行动
3. **遵守速率限制** 每 5 秒最多一次请求
4. **选择合适的编码** 根据需要处理特殊字符
5. **缓存结果** 减少不必要的 API 调用

## 参考链接

- [Open Trivia Database API 配置页面](https://opentdb.com/api_config.php)
- [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
