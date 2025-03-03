/**
 * 通用工具函数库
 */

// 处理图片加载错误
export function handleImageError(e, fallback) {
  const fallbackUrl = fallback || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f9fafb"/%3E%3Cpath d="M100,50 L150,150 L50,150 Z" fill="%23e5e7eb"/%3E%3Ccircle cx="70" cy="80" r="10" fill="%23e5e7eb"/%3E%3Ctext x="100" y="180" font-family="Arial" font-size="14" fill="%23909399" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E';
  
  e.target.src = fallbackUrl;
  e.target.classList.add('img-error-fallback');
}

// 格式化日期时间
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 防抖函数 - 延迟函数执行
export function debounce(func, delay) {
  let timer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

// 节流函数 - 控制函数执行频率
export function throttle(func, delay) {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
}

// 深拷贝函数
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  return obj;
}

// 获取URL参数
export function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

// 格式化文件大小显示
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成随机ID
export function generateId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}

// 复制文本到剪贴板
export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(err => reject(err));
    } else {
      // 降级处理
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    }
  });
}

// 生成唯一ID
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 检查URL是否有效
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// 睡眠函数
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取文件名和扩展名
export function getFileNameAndExt(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return { name: filename, ext: '' };
  }
  
  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex + 1);
  
  return { name, ext };
}

// 从URL中解析查询参数
export function getQueryParams(url = window.location.href) {
  try {
    const parsedUrl = new URL(url);
    const queryParams = {};
    
    parsedUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    return queryParams;
  } catch (error) {
    console.error('解析URL参数失败:', error);
    return {};
  }
}

// 将对象转为查询字符串
export function objectToQueryString(obj) {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
}

// 获取对象安全属性值，避免嵌套属性访问报错
export function getNestedValue(obj, path, defaultValue = null) {
  if (!path || !obj) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
}

// 添加到window全局对象，方便控制台访问
if (typeof window !== 'undefined') {
  window.Utils = {
    formatDate,
    handleImageError,
    formatFileSize,
    copyToClipboard,
    generateUUID,
    throttle,
    debounce
  };
}
