/**
 * 登录系统调试与测试辅助工具
 * 这个文件提供了一些帮助函数，用于解决登录问题
 */

// 检测浏览器存储和缓存状态
export function checkBrowserState() {
  const report = {
    localStorage: {
      available: false,
      token: null,
      size: 0
    },
    sessionStorage: {
      available: false,
      size: 0
    },
    cookies: {
      available: false,
      count: 0
    }
  };
  
  // 检测localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    report.localStorage.available = true;
    report.localStorage.token = localStorage.getItem('token');
    report.localStorage.size = JSON.stringify(localStorage).length;
  } catch (e) {
    console.error('localStorage不可用:', e);
  }
  
  // 检测sessionStorage
  try {
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    report.sessionStorage.available = true;
    report.sessionStorage.size = JSON.stringify(sessionStorage).length;
  } catch (e) {
    console.error('sessionStorage不可用:', e);
  }
  
  // 检测cookies
  try {
    report.cookies.available = navigator.cookieEnabled;
    report.cookies.count = document.cookie ? document.cookie.split(';').length : 0;
  } catch (e) {
    console.error('Cookie检测失败:', e);
  }
  
  return report;
}

// 清除所有存储的登录数据
export function clearLoginState() {
  try {
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // 清除所有cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    
    return true;
  } catch (e) {
    console.error('清除登录状态失败:', e);
    return false;
  }
}

// 提供测试账号直接登录功能（仅开发环境使用）
export function debugLogin(api) {
  // 仅开发环境可用
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    console.warn('调试登录仅限开发环境使用');
    return null;
  }
  
  return {
    loginAsAdmin: async () => {
      try {
        const response = await api.login({
          username: 'admin',
          password: 'admin123'
        });
        return response;
      } catch (error) {
        console.error('调试登录失败:', error);
        return null;
      }
    },
    loginAsManager: async () => {
      try {
        const response = await api.login({
          username: 'manager1',
          password: '123456'
        });
        return response;
      } catch (error) {
        console.error('调试登录失败:', error);
        return null;
      }
    }
  };
}

// 打印当前登录信息到控制台（不显示敏感数据）
export function logLoginInfo() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('未找到登录令牌');
    return;
  }
  
  try {
    // 解析JWT令牌（仅基本信息，不验证签名）
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      const parsed = JSON.parse(atob(token));
      console.log('存储的令牌内容:', {
        userId: parsed.userId,
        timestamp: new Date(parsed.timestamp).toLocaleString(),
        expired: Date.now() > parsed.timestamp + 24 * 60 * 60 * 1000
      });
      return;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    console.log('JWT令牌内容:', {
      userId: payload.id,
      username: payload.username,
      role: payload.role,
      expires: new Date(payload.exp * 1000).toLocaleString(),
      expired: Date.now() > payload.exp * 1000
    });
  } catch (e) {
    console.error('解析令牌失败:', e);
  }
}

// 打印登录信息到控制台
export function printLoginInfo() {
  console.group('系统账号说明');
  console.info('超级管理员: admin/admin123');
  console.info('部门负责人: manager1/123456');
  console.info('普通成员: user1/123456');
  console.groupEnd();
}

// 快速登录函数，开发环境使用
export function quickLogin(username, password) {
  try {
    // 获取登录表单元素
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('button[type="submit"]');
    
    // 如果找到了登录表单元素
    if (usernameInput && passwordInput && loginButton) {
      // 设置用户名和密码
      usernameInput.value = username;
      passwordInput.value = password;
      
      // 触发登录按钮点击事件
      loginButton.click();
    } else {
      console.warn('未找到登录表单元素，无法进行快速登录');
    }
  } catch (error) {
    console.error('快速登录失败:', error);
  }
}

// 导出登录开发工具
export const loginDevTools = {
  fillAdminCredentials: () => {
    // 这个函数可以在浏览器控制台使用
    document.querySelector('input[type="text"]').value = 'admin';
    document.querySelector('input[type="password"]').value = 'admin123';
    console.log('已填充超级管理员账号');
  }
};

// 在开发环境向窗口暴露快速登录方法
if (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.loginAs = {
    admin: () => quickLogin('admin', 'admin123'),
    manager: () => quickLogin('manager1', '123456'),
    user: () => quickLogin('user1', '123456')
  };
  
  console.info('可使用以下命令快速登录:');
  console.info('window.loginAs.admin() - 以管理员身份登录');
  console.info('window.loginAs.manager() - 以部门负责人身份登录');
  console.info('window.loginAs.user() - 以普通用户身份登录');
}

// 注册到全局，方便在控制台使用
if (typeof window !== 'undefined') {
  window.LoginHelper = {
    checkBrowserState,
    clearLoginState,
    debugLogin,
    printLoginInfo,
    quickLogin
  };
  console.log('登录辅助工具已加载，可通过 window.LoginHelper 访问');
}
