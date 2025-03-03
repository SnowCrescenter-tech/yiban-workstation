import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { components } from './components.js';
import { store } from './store.js';
import { api } from './api.js';

const app = createApp({
  data() {
    return {
      currentView: 'LandingPage',
      user: null,
      loginAttempts: 0,
      isLocked: false,
      lockTime: null
    };
  },
  computed: {
    isLoggedIn() {
      return this.user !== null;
    },
    isAdmin() {
      return this.user && ['超级管理员', '管理员'].includes(this.user.role);
    },
    isDepartmentHead() {
      return this.user && (this.user.role === '部门负责人' || this.isAdmin);
    }
  },
  methods: {
    // 导航控制
    navigate(view) {
      this.currentView = view;
    },
    
    // 用户认证
    async login(credentials) {
      if (this.isLocked) {
        const now = new Date();
        const minutesLeft = Math.ceil((this.lockTime.getTime() + 30 * 60 * 1000 - now.getTime()) / (60 * 1000));
        if (minutesLeft > 0) {
          this.$message.error(`账号已锁定，请${minutesLeft}分钟后再试`);
          return;
        }
        this.isLocked = false;
        this.loginAttempts = 0;
      }
      
      try {
        const response = await api.login(credentials);
        this.user = response.data;
        localStorage.setItem('token', response.token);
        this.navigate('Dashboard');
        this.$message.success('登录成功');
      } catch (error) {
        this.loginAttempts++;
        if (this.loginAttempts >= 3) {
          this.isLocked = true;
          this.lockTime = new Date();
          this.$message.error('登录失败超过3次，账号已锁定30分钟');
        } else {
          this.$message.error(`登录失败: ${error.message || '账号或密码错误'}`);
        }
      }
    },
    
    logout() {
      this.user = null;
      localStorage.removeItem('token');
      this.navigate('LandingPage');
      this.$message.success('已退出登录');
    },
    
    // 任务管理
    async createTask(taskData) {
      try {
        await api.createTask(taskData);
        this.$message.success('任务创建成功');
        return true;
      } catch (error) {
        this.$message.error(`创建失败: ${error.message}`);
        return false;
      }
    },
    
    async updateTaskStatus(taskId, newStatus) {
      try {
        await api.updateTaskStatus(taskId, newStatus);
        this.$message.success('任务状态已更新');
        return true;
      } catch (error) {
        this.$message.error(`更新失败: ${error.message}`);
        return false;
      }
    },
    
    // 初始化方法 - 检查登录状态
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await api.getCurrentUser();
          this.user = user;
          this.navigate('Dashboard');
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    }
  },
  mounted() {
    this.checkAuth();
  },
  render() {
    return this.$h(components[this.currentView] || 'div', {
      user: this.user,
      onLogin: this.login,
      onLogout: this.logout,
      onNavigate: this.navigate,
      onCreateTask: this.createTask,
      onUpdateTaskStatus: this.updateTaskStatus
    });
  }
});

// 全局注册Element Plus组件
app.use(ElementPlus);
app.mount('#app');
