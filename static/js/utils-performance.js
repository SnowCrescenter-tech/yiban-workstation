/**
 * 性能优化工具库
 * 提供防抖、节流等实用函数
 */

// 防抖：函数在最后一次调用后延迟执行
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流：函数在一定时间内只执行一次
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 延迟执行
export function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 批量加载JavaScript文件
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`加载脚本失败: ${src}`));
    document.head.appendChild(script);
  });
}

// 批量加载CSS文件
export function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`加载样式表失败: ${href}`));
    document.head.appendChild(link);
  });
}

// 资源预加载
export function preload(url, as = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
  return link;
}

// 懒加载图片
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 降级处理：直接加载所有图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.getAttribute('data-src');
    });
  }
}

/**
 * 性能监控工具
 * 提供页面性能分析功能
 */

/**
 * 检查页面性能指标
 * 返回页面加载的各项性能指标
 * @returns {Object} 性能数据对象
 */
export function checkPerformance() {
  // 如果浏览器不支持性能API，返回默认值
  if (!window.performance || !window.performance.timing) {
    return {
      pageLoadTime: 0,
      domReadyTime: 0,
      networkLatency: 0,
      processingTime: 0,
      suggestions: ['您的浏览器不支持Performance API，无法获取性能指标']
    };
  }
  
  const timing = window.performance.timing;
  
  // 计算关键性能指标
  const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
  const domReadyTime = timing.domComplete - timing.domLoading;
  const networkLatency = timing.responseEnd - timing.fetchStart;
  const processingTime = timing.domComplete - timing.responseEnd;
  
  // 性能建议
  const suggestions = [];
  
  // 页面加载时间超过3秒，建议优化
  if (pageLoadTime > 3000) {
    suggestions.push('页面加载时间过长，建议优化资源加载和代码执行效率');
  }
  
  // 网络延迟超过1秒，建议优化网络请求
  if (networkLatency > 1000) {
    suggestions.push('网络延迟较高，建议减少HTTP请求或使用CDN');
  }
  
  // DOM处理时间超过1秒，建议优化DOM操作
  if (processingTime > 1000) {
    suggestions.push('DOM处理时间较长，建议优化JavaScript执行效率');
  }
  
  // 分析资源加载情况
  if (window.performance.getEntriesByType) {
    const resources = window.performance.getEntriesByType('resource');
    const slowResources = resources.filter(res => res.duration > 500);
    
    if (slowResources.length > 0) {
      suggestions.push(`检测到${slowResources.length}个加载较慢的资源，建议优化`);
    }
    
    // 检查是否有过多的资源
    if (resources.length > 50) {
      suggestions.push(`页面加载了${resources.length}个资源，数量过多可能影响性能`);
    }
  }
  
  return {
    pageLoadTime,
    domReadyTime,
    networkLatency,
    processingTime,
    suggestions
  };
}

/**
 * 监控组件性能
 * 为Vue组件添加性能监控功能
 * @param {Object} app Vue应用实例
 */
export function monitorComponentPerformance(app) {
  if (!app) return;
  
  // 在生产环境中不执行
  if (process.env.NODE_ENV === 'production') return;
  
  // 保存原始的组件挂载方法
  const originalMount = app.mount;
  
  // 重写mount方法，添加性能监控
  app.mount = function(...args) {
    const vm = originalMount.apply(this, args);
    
    // 监听组件性能
    this.config.performance = true;
    
    return vm;
  };
}

/**
 * 性能测试
 * 测试页面响应性能
 * @returns {Object} 测试结果
 */
export function testResponsePerformance() {
  const results = {
    domOperations: 0,
    cssSelectors: 0,
    jsCalculations: 0
  };
  
  // 测试DOM操作性能
  const domTestStart = performance.now();
  const testDiv = document.createElement('div');
  document.body.appendChild(testDiv);
  
  for (let i = 0; i < 1000; i++) {
    testDiv.innerHTML = `<div id="test-${i}">测试</div>`;
    document.body.appendChild(testDiv.cloneNode(true));
  }
  
  // 清理测试DOM
  const testElements = document.querySelectorAll('[id^="test-"]');
  testElements.forEach(el => el.parentNode && el.parentNode.removeChild(el));
  if (testDiv.parentNode) testDiv.parentNode.removeChild(testDiv);
  
  const domTestEnd = performance.now();
  results.domOperations = domTestEnd - domTestStart;
  
  // 测试CSS选择器性能
  const cssTestStart = performance.now();
  for (let i = 0; i < 1000; i++) {
    document.querySelectorAll('.el-button, .el-input, .el-form-item');
  }
  const cssTestEnd = performance.now();
  results.cssSelectors = cssTestEnd - cssTestStart;
  
  // 测试JS计算性能
  const jsTestStart = performance.now();
  let sum = 0;
  for (let i = 0; i < 100000; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  const jsTestEnd = performance.now();
  results.jsCalculations = jsTestEnd - jsTestStart;
  
  return results;
}

/**
 * 分析内存使用情况
 * @returns {Object|null} 内存使用情况
 */
export function analyzeMemoryUsage() {
  if (!window.performance || !window.performance.memory) {
    return null;
  }
  
  const memory = window.performance.memory;
  return {
    totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
    usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
    jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit),
    percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  };
}

/**
 * 格式化字节大小为可读文本
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的可读文本
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 监控API请求性能
 * 拦截XHR和Fetch请求，记录响应时间
 */
export function monitorApiPerformance() {
  // 如果已经存在监控对象，不重复创建
  if (window._apiPerformanceMonitor) return window._apiPerformanceMonitor;
  
  const apiStats = {
    requests: {},
    slowRequests: [],
    avgResponseTime: 0,
    totalRequests: 0
  };
  
  // 监控XHR请求
  const originalXhrOpen = window.XMLHttpRequest.prototype.open;
  const originalXhrSend = window.XMLHttpRequest.prototype.send;
  
  window.XMLHttpRequest.prototype.open = function(...args) {
    this._apiUrl = args[1] || '';
    return originalXhrOpen.apply(this, args);
  };
  
  window.XMLHttpRequest.prototype.send = function(...args) {
    const startTime = performance.now();
    this.addEventListener('loadend', () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      const url = this._apiUrl;
      
      recordApiCall(url, duration, this.status);
    });
    
    return originalXhrSend.apply(this, args);
  };
  
  // 监控Fetch请求
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const startTime = performance.now();
    const url = args[0] instanceof Request ? args[0].url : args[0];
    
    return originalFetch.apply(this, args).then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      recordApiCall(url, duration, response.status);
      return response;
    }).catch(err => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      recordApiCall(url, duration, 0, err);
      throw err;
    });
  };
  
  // 记录API调用
  function recordApiCall(url, duration, status, error) {
    const urlKey = url.split('?')[0]; // 移除查询参数
    
    if (!apiStats.requests[urlKey]) {
      apiStats.requests[urlKey] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        failCount: 0,
        lastStatus: null,
        lastError: null,
        lastTime: null
      };
    }
    
    const req = apiStats.requests[urlKey];
    req.count++;
    req.totalTime += duration;
    req.avgTime = req.totalTime / req.count;
    req.lastStatus = status;
    req.lastTime = new Date().toLocaleTimeString();
    
    if (error || status >= 400) {
      req.failCount++;
      req.lastError = error ? error.message : `HTTP ${status}`;
    }
    
    // 记录超过500ms的慢请求
    if (duration > 500) {
      apiStats.slowRequests.push({
        url,
        duration,
        time: new Date().toLocaleTimeString(),
        status
      });
      
      // 保留最近100条慢请求记录
      if (apiStats.slowRequests.length > 100) {
        apiStats.slowRequests.shift();
      }
    }
    
    // 更新总体统计信息
    apiStats.totalRequests++;
    const totalTime = Object.values(apiStats.requests).reduce((sum, r) => sum + r.totalTime, 0);
    apiStats.avgResponseTime = totalTime / apiStats.totalRequests;
  }
  
  // 保存监控对象到全局，便于调试
  window._apiPerformanceMonitor = apiStats;
  
  return apiStats;
}

// 添加到全局对象，方便控制台访问
if (typeof window !== 'undefined') {
  window.PerformanceUtils = {
    debounce,
    throttle,
    delay,
    loadScript,
    loadStylesheet,
    preload,
    lazyLoadImages,
    checkPerformance,
    monitorComponentPerformance,
    testResponsePerformance,
    analyzeMemoryUsage,
    monitorApiPerformance
  };
  console.log('性能优化工具已加载，可通过 window.PerformanceUtils 访问');
}
