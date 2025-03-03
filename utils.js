// 工具函数集合
window.utils = {
  // 日期格式化
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : 
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  
  // 时间格式化
  formatTime(time) {
    if (!time) return '';
    const d = new Date(time);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diff = now - d;
    
    // 1分钟内
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    // 1小时内
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`;
    }
    // 1天内
    if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
    }
    // 30天内
    if (diff < 30 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
    }
    
    return this.formatDate(time);
  },
  
  // 日期时间格式化
  formatDateTime(datetime) {
    if (!datetime) return '';
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return '';
    
    return `${this.formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },
  
  // 获取星期几
  getDayOfWeek(dateStr) {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  },
  
  // 文件大小格式化
  formatFileSize(size) {
    if (!size) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    
    return `${size.toFixed(2)} ${units[index]}`;
  },
  
  // 生成随机ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },
  
  // 深拷贝对象
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj);
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }
    
    return Object.fromEntries(
      Object.entries(obj).map(
        ([key, value]) => [key, this.deepClone(value)]
      )
    );
  },
  
  // 防抖函数
  debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  },
  
  // 节流函数
  throttle(func, limit = 300) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },
  
  // 权限检查
  hasPermission(user, permission) {
    if (!user) return false;
    
    if (permission === 'admin') {
      return user.role === 'admin' || user.role === 'super_admin';
    }
    
    if (permission === 'task_create') {
      return user.role === 'admin' || user.role === 'super_admin' || user.role === 'department_head';
    }
    
    return false;
  },
  
  // 获取对象中的值（支持嵌套路径）
  getValueByPath(object, path) {
    if (!object || !path) return undefined;
    
    const keys = path.split('.');
    let result = object;
    
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) break;
    }
    
    return result;
  },
  
  // 数组分组
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const keyValue = typeof key === 'function' ? key(item) : item[key];
      (result[keyValue] = result[keyValue] || []).push(item);
      return result;
    }, {});
  },
  
  // 生成本地验证码图片
  generateCaptcha() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 48;
    
    // 背景
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 120, 48);
    
    // 随机验证码字符
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captchaText = '';
    for (let i = 0; i < 4; i++) {
      captchaText += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // 存储验证码文本，实际应用中应存储在服务器端
    window._captchaText = captchaText;
    
    // 绘制文本
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#2A5CAA';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 为每个字符添加随机旋转
    for (let i = 0; i < captchaText.length; i++) {
      const x = 20 + i * 25;
      const y = 24 + Math.random() * 8 - 4;
      const angle = Math.random() * 0.4 - 0.2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(captchaText[i], 0, 0);
      ctx.restore();
    }
    
    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgb(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 48);
      ctx.bezierCurveTo(
        Math.random() * 120, Math.random() * 48,
        Math.random() * 120, Math.random() * 48,
        Math.random() * 120, Math.random() * 48
      );
      ctx.stroke();
    }
    
    // 添加干扰点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 120, Math.random() * 48, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return canvas.toDataURL('image/png');
  }
};
