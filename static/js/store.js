// 简单状态管理模块，用于共享全局数据
export const store = {
  state: {
    user: null,
    tasks: [],
    notifications: [],
    departments: [],
    members: []
  },
  
  // 用户相关方法
  setUser(user) {
    this.state.user = user;
  },
  
  clearUser() {
    this.state.user = null;
  },
  
  // 任务相关方法
  setTasks(tasks) {
    this.state.tasks = tasks;
  },
  
  addTask(task) {
    this.state.tasks.push(task);
  },
  
  updateTask(taskId, updates) {
    const index = this.state.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.state.tasks[index] = { ...this.state.tasks[index], ...updates };
    }
  },
  
  removeTask(taskId) {
    this.state.tasks = this.state.tasks.filter(task => task.id !== taskId);
  },
  
  // 通知相关方法
  setNotifications(notifications) {
    this.state.notifications = notifications;
  },
  
  addNotification(notification) {
    this.state.notifications.push(notification);
  },
  
  clearNotifications() {
    this.state.notifications = [];
  },
  
  // 部门相关方法
  setDepartments(departments) {
    this.state.departments = departments;
  },
  
  // 成员相关方法
  setMembers(members) {
    this.state.members = members;
  },

  // 管理员专属方法
  addUser(user) {
    // 仅适用于管理员，添加新用户
    if (this.state.user && ['超级管理员', '管理员'].includes(this.state.user.role)) {
      // 这里只是前端模拟，实际应该调用API
      console.log('添加新用户:', user);
      return true;
    }
    return false;
  },
  
  getDashboardStats() {
    // 获取统计数据
    if (!this.state.user) return null;
    
    // 计算统计数据
    const tasksByStatus = {
      '未开始': this.state.tasks.filter(t => t.status === '未开始').length,
      '进行中': this.state.tasks.filter(t => t.status === '进行中').length,
      '待验收': this.state.tasks.filter(t => t.status === '待验收').length,
      '已完成': this.state.tasks.filter(t => t.status === '已完成').length,
    };
    
    const urgentTasksCount = this.state.tasks.filter(t => t.isUrgent).length;
    const overdueTasksCount = this.state.tasks.filter(t => {
      const deadline = new Date(t.deadline);
      const now = new Date();
      return deadline < now && t.status !== '已完成';
    }).length;
    
    return {
      tasksByStatus,
      urgentTasksCount,
      overdueTasksCount,
      totalTasks: this.state.tasks.length
    };
  }
};