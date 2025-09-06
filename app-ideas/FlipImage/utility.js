// Utility 工具类
class Utility {
  /**
   * 获取CSS transition时间（毫秒）
   * @param {HTMLElement} element - 要获取transition时间的元素
   * @returns {number} 返回transition时间（毫秒）
   */
  static getTransitionDuration(element) {
    const computedStyle = window.getComputedStyle(element);
    const transitionDuration = computedStyle.transitionDuration;
    // 将秒转换为毫秒，例如 "0.8s" -> 800
    return parseFloat(transitionDuration) * 1000;
  }

  /**
   * 加载图片并处理超时（新手友好版本）
   * @param {string} url - 图片URL
   * @param {number} timeoutMs - 超时时间（毫秒），默认10秒
   * @returns {Promise<HTMLImageElement>} 返回加载成功的图片对象
   */
  static loadImageWithTimeout(url, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      // 1. 创建图片对象
      const img = new Image();
      
      // 2. 设置超时定时器
      const timer = setTimeout(() => {
        reject(new Error(`图片加载超时 (${timeoutMs}ms): ${url}`));
      }, timeoutMs);
      
      // 3. 图片加载成功
      img.onload = () => {
        clearTimeout(timer);  // 清除超时定时器
        resolve(img);         // 返回图片对象
      };
      
      // 4. 图片加载失败
      img.onerror = () => {
        clearTimeout(timer);  // 清除超时定时器
        reject(new Error(`图片加载失败: ${url}`));
      };
      
      // 5. 开始加载图片
      img.src = url;
    });
  }
}

// 导出工具类
export { Utility };
