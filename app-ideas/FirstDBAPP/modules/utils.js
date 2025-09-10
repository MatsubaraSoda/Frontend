/**
 * utils.js - 工具模块
 * 提供通用工具函数、数据验证、错误处理等辅助功能
 * 被其他所有模块使用，无外部依赖
 */

const utils = {
  /**
   * 日期格式化函数
   * @param {Date} date - 要格式化的日期对象
   * @param {string} format - 格式化模式，默认为 'YYYY-MM-DD'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    // 日期格式化逻辑说明：
    // 1. date 是 Date 对象，包含完整的日期时间信息
    //    - 年、月、日、时、分、秒、毫秒
    //    - 时区信息（UTC 时间）
    // 2. toISOString() 将日期转换为 ISO 8601 格式字符串
    //    例如：'2024-01-15T14:30:25.123Z'
    //    - 格式：YYYY-MM-DDTHH:mm:ss.sssZ
    //    - T 分隔日期和时间，Z 表示 UTC 时区
    // 3. split('T') 按 'T' 分割字符串，得到数组
    //    例如：['2024-01-15', '14:30:25.123Z']
    // 4. [0] 取数组第一个元素，即日期部分
    //    例如：'2024-01-15'
    return date.toISOString().split('T')[0];
  },

  /**
   * 邮箱验证函数
   * @param {string} email - 要验证的邮箱地址
   * @returns {boolean} 验证结果，true 表示有效
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    // 邮箱验证正则表达式详解：
    // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // ^        - 字符串开始锚点
    // [^\s@]+  - 用户名部分：一个或多个非空白字符且非@符号
    // @        - 必须包含@符号分隔符
    // [^\s@]+  - 域名部分：一个或多个非空白字符且非@符号
    // \.       - 必须包含点号（转义，因为.在正则中有特殊含义）
    // [^\s@]+  - 顶级域名：一个或多个非空白字符且非@符号
    // $        - 字符串结束锚点
    // 示例：user@example.com ✓  user@domain.co.uk ✓
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 生成唯一ID函数
   * @param {string} prefix - ID前缀，默认为空
   * @returns {string} 唯一ID字符串
   * 
   * 使用场景：
   * - 临时文件命名：temp_abc123
   * - 会话ID生成：session_xyz789
   * - 缓存键名：cache_def456
   * - 日志追踪ID：log_ghi012
   * - 数据库记录ID（当没有自增ID时）
   * - 前端组件唯一标识
   * 
   * 在客户数据库项目中的应用：
   * - 生成客户ID：customer_abc123
   * - 操作日志ID：operation_xyz789
   * - 临时数据标识：temp_def456
   */
  generateUniqueId(prefix = '') {
    // 使用时间戳 + 随机数生成唯一ID
    const timestamp = Date.now().toString(36);
    // 生成随机字符串：
    // 1. Math.random() 生成 0-1 之间的随机数
    // 2. toString(36) 转换为36进制字符串（0-9, a-z）
    // 3. substring(2, 7) 从第2位开始取5个字符（跳过"0."）
    //    例如：0.abc123def → abc12
    const random = Math.random().toString(36).substring(2, 7);
    return prefix + timestamp + random;
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      // func.apply(this, args) 说明：
      // 1. func - 要执行的原始函数
      // 2. apply() - 调用函数的方法，与 call() 类似但参数是数组
      // 3. this - 保持原函数的 this 上下文（重要！）
      // 4. args - 传递所有参数给原函数（展开数组为单独参数）
      // 作用：确保防抖后的函数与原函数行为完全一致
      // 示例：如果原函数是 obj.method(a, b)，防抖后仍能正确调用
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * 错误处理函数
   * @param {string} message - 错误消息
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   */
  showError(message, error = null, context = '') {
    console.error(`错误 [${context}]:`, message, error);
    // 错误处理逻辑将在后续完善
  }
};

// 导出 utils 对象
export { utils };
