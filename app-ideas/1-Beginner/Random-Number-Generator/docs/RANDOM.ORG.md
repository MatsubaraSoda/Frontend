# RANDOM.ORG API 使用指南

## 概述

[RANDOM.ORG](https://www.random.org/) 提供真正的随机数生成服务，基于大气噪声生成，比计算机程序中的伪随机数算法更适合需要真正随机性的应用。

## API 服务

### HTTP API
RANDOM.ORG 提供 HTTP API 来获取真正的随机数到您的代码中。

### 主要功能

#### 1. 整数生成器 (Integer Generator)
- **功能**：在可配置的区间内生成随机数
- **适用场景**：您的蒙特卡洛模拟项目
- **特点**：可以指定最小值和最大值

#### 2. 原始随机字节 (Raw Random Bytes)
- **功能**：生成原始随机字节
- **适用场景**：加密用途和需要大量随机数据的应用

#### 3. 小数生成器 (Decimal Fraction Generator)
- **功能**：在 [0,1] 范围内生成可配置小数位数的数字
- **适用场景**：需要小数值的模拟

## 使用限制

### 免费服务限制
- **每日配额**：免费用户有每日随机位数限制
- **使用统计**：网站提供实时统计和您的配额信息
- **访问频率**：建议合理控制请求频率

### 付费服务
- 对于大量使用（如您的项目需要生成数千次随机数），可能需要考虑付费服务
- 提供更高的配额和更快的响应

## 项目应用建议

### 针对您的蒙特卡洛模拟项目

根据您的项目描述，需要生成大量随机数（1000/5000/10000次），建议：

1. **使用整数生成器 API**
   - 设置最小值和最大值（用户输入的范围）
   - 批量请求随机数

2. **配额管理**
   - 监控每日使用量
   - 考虑实现缓存机制
   - 可能需要付费服务支持

3. **实现策略**
   ```javascript
   // 伪代码示例
   async function generateRandomNumbers(min, max, count) {
       // 调用 RANDOM.ORG API
       // 处理配额限制
       // 返回随机数数组
   }
   ```

## 替代方案

### 如果配额不足
1. **混合策略**：结合 RANDOM.ORG 和本地伪随机数生成
2. **本地生成**：使用 JavaScript 的 `Math.random()` 作为备选
3. **分批处理**：将大量请求分散到多天

## 技术实现

### API 调用示例
```javascript
// 基础 API 调用结构
const apiUrl = 'https://www.random.org/integers/';
const params = {
    num: 1000,        // 生成数量
    min: 1,           // 最小值
    max: 100,         // 最大值
    col: 1,           // 列数
    base: 10,         // 进制
    format: 'plain',  // 格式
    rnd: 'new'        // 随机种子
};
```

### 注意事项
- 需要处理网络请求的异步性
- 实现错误处理和重试机制
- 考虑 API 响应时间对用户体验的影响

## 总结

RANDOM.ORG 的 API 非常适合您的蒙特卡洛模拟项目，但需要注意：
- 免费服务有配额限制
- 大量使用可能需要付费
- 建议实现本地备选方案
- 需要合理的错误处理和用户体验优化

## 相关链接

- [RANDOM.ORG 主页](https://www.random.org/)
- [HTTP API 文档](https://www.random.org/clients/http/)
- [使用指南](https://www.random.org/guidelines/)
- [配额和统计](https://www.random.org/quota/)
