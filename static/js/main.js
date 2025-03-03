/**
 * 应用程序入口文件
 */

import { api } from './api.js';
import { handleImageError, formatDate } from './utils.js';
import { images } from './localImages.js';
import { printLoginInfo } from './login-helper.js';

// 导入组件库
import { AdminComponents } from './admin-components.js';
import { UserComponents } from './user-components.js';
import { LoginComponents } from './components-login.js';
import { LandingComponents } from './components.js';
import { DebugComponents } from './components-debug.js';

// 初始化应用
const { createApp, ref, reactive, computed, onMounted, watch } = Vue;
const app = createApp({
  setup() {
    // 应用状态
    const isLoading = ref(false);
    const isLoggedIn = ref(false);
    const loginMessage = ref('');
    const user = ref(null);
    const view = ref('LandingPage'); // 初始页面
    const darkMode = ref(localStorage.getItem('darkMode') === 'true');
    const notifications = ref([]);
    const unreadCount = ref(0);
    
    // 检查是否已登录
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        // 获取当前用户信息
        const currentUser = await api.getCurrentUser();
        user.value = currentUser;
        isLoggedIn.value = true;
        
        // 根据用户角色设置初始页面
        if (user.value.role === '超级管理员' || user.value.role === '管理员') {
          view.value = 'AdminDashboard';
        } else {
          view.value = 'Dashboard';
        }
        
        // 加载通知
        loadNotifications();
      } catch (error) {
        console.error('登录验证失败:', error);
        isLoggedIn.value = false;
        localStorage.removeItem('token');
        view.value = 'Login';
      }
    };
    
    // 处理登录
    const handleLogin = async (credentials) => {
      isLoading.value = true;
      loginMessage.value = '';
      
      try {
        const response = await api.login(credentials);
        localStorage.setItem('token', response.token);
        user.value = response.data;
        isLoggedIn.value = true;
        isLoading.value = false;
        
        // 根据用户角色设置登录后的页面
        if (user.value.role === '超级管理员' || user.value.role === '管理员') {
          view.value = 'AdminDashboard';
        } else {
          view.value = 'Dashboard';
        }
        
        loadNotifications();
      } catch (error) {
        isLoading.value = false;
        loginMessage.value = error.message || '登录失败，请检查用户名和密码';
      }
    };
    
    // 处理退出登录
    const handleLogout = () => {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      user.value = null;
      view.value = 'LandingPage';
    };
    
    // 切换深色模式
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem('darkMode', darkMode.value);
      document.documentElement.classList.toggle('dark', darkMode.value);
    };
    
    // 加载通知
    const loadNotifications = async () => {
      if (!isLoggedIn.value) return;
      
      try {
        const result = await api.getNotifications();
        notifications.value = result.data;
        unreadCount.value = notifications.value.length;
      } catch (error) {
        console.error('加载通知失败:', error);
      }
    };
    
    // 消息已读处理
    const markAsRead = (id) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    };
    
    // 导航到指定视图
    const navigateTo = (targetView) => {
      view.value = targetView;
    };
    
    // 注册全局错误处理
    const registerErrorHandler = () => {
      window.addEventListener('error', (event) => {
        console.error('捕获到全局错误:', event.error);
        
        // 记录错误到本地存储，方便调试
        const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errorLogs.push({
          message: event.error?.message || '未知错误',
          details: event.error?.stack || event.message,
          timestamp: Date.now()
        });
        localStorage.setItem('errorLogs', JSON.stringify(errorLogs.slice(-20))); // 只保留最近20条
      });
    };
    
    // 生命周期钩子
    onMounted(() => {
      // 设置深色模式
      document.documentElement.classList.toggle('dark', darkMode.value);
      
      // 检查登录状态
      checkLoginStatus();
      
      // 注册错误处理
      registerErrorHandler();
      
      // 在开发环境打印登录信息
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        printLoginInfo();
      }
    });
    
    // 监听用户状态变化
    watch(user, (newValue, oldValue) => {
      if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
        console.log('用户状态已更新:', newValue.name);
        // 可以在这里添加用户状态变化后的逻辑
      }
    });
    
    // 返回到模板使用的内容
    return {
      isLoading,
      isLoggedIn,
      loginMessage,
      user,
      view,
      darkMode,
      notifications,
      unreadCount,
      handleLogin,
      handleLogout,
      toggleDarkMode,
      markAsRead,
      navigateTo
    };
  },
  components: {
    // 注册所有组件
    ...LoginComponents,
    ...LandingComponents,
    ...AdminComponents,
    ...UserComponents,
    ...DebugComponents,
  },
  template: `
    <div id="app" :class="{ 'dark': darkMode }">
      <!-- 登陆前页面 -->
      <template v-if="!isLoggedIn">
        <component 
          :is="view" 
          @navigate="navigateTo" 
          @login="handleLogin"
          :login-message="loginMessage"
          :is-loading="isLoading"
        ></component>
      </template>
      
      <!-- 登录后页面 -->
      <template v-else>
        <div class="app-container">
          <AppHeader 
            :user="user" 
            :notifications="notifications"
            :unread-count="unreadCount"
            @navigate="navigateTo"
            @logout="handleLogout"
            @toggle-theme="toggleDarkMode"
            @mark-read="markAsRead"
          />
          
          <div class="main-container">
            <AppSidebar 
              :user="user" 
              :active-menu="view"
              @navigate="navigateTo"
              @logout="handleLogout"
            />
            
            <div class="content-area">
              <component 
                :is="view" 
                :user="user"
                :notifications="notifications"
                :unread-count="unreadCount"
                @navigate="navigateTo"
                @mark-read="markAsRead"
              ></component>
            </div>
          </div>
        </div>
      </template>
      
      <!-- 调试信息 -->
      <DebugInfo 
        v-if="darkMode && isLoggedIn && user.role === '超级管理员'"
        :user="user"
        :current-view="view"
      />
    </div>
  `
});

// 挂载应用
app.mount('#app');

// 用于开发环境调试
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.app = app;
  console.log('应用已挂载，可通过 window.app 访问');
}
