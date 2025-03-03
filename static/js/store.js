/**
 * 状态管理模块
 * 提供全局状态管理功能
 */

// 创建简单的状态存储
export const store = {
  state: {
    user: null,
    isLoggedIn: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
    notifications: [],
    unreadCount: 0,
    systemSettings: {}
  },
  
  // 设置用户信息
  setUser(user) {
    this.state.user = user;
    this.state.isLoggedIn = !!user;
    
    if (this.listeners.user.length) {
      this.listeners.user.forEach(listener => listener(user));
    }
  },
  
  // 清除用户信息
  clearUser() {
    this.state.user = null;
    this.state.isLoggedIn = false;
    
    if (this.listeners.user.length) {
      this.listeners.user.forEach(listener => listener(null));
    }
  },
  
  // 设置通知数据
  setNotifications(notifications) {
    this.state.notifications = notifications;
    this.state.unreadCount = notifications.length;
    
    if (this.listeners.notifications.length) {
      this.listeners.notifications.forEach(listener => listener(notifications));
    }
  },
  
  // 设置深色模式
  setDarkMode(isDark) {
    this.state.darkMode = isDark;
    localStorage.setItem('darkMode', isDark);
    document.documentElement.classList.toggle('dark', isDark);
    
    if (this.listeners.darkMode.length) {
      this.listeners.darkMode.forEach(listener => listener(isDark));
    }
  },
  
  // 设置系统设置
  setSystemSettings(settings) {
    this.state.systemSettings = settings;
    
    if (this.listeners.systemSettings.length) {
      this.listeners.systemSettings.forEach(listener => listener(settings));
    }
  },
  
  // 事件监听器
  listeners: {
    user: [],
    notifications: [],
    darkMode: [],
    systemSettings: []
  },
  
  // 添加监听器
  subscribe(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    
    this.listeners[type].push(callback);
    return () => {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    };
  }
};

// 初始化深色模式
if (store.state.darkMode) {
  document.documentElement.classList.add('dark');
}