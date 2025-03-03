// 由于直接使用CDN加载的axios，这里不需要再导入
// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';
import { store } from './store.js';

// 创建axios实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器 - 添加认证信息
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器 - 统一处理错误
http.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除用户信息并跳转到登录页
          localStorage.removeItem('token');
          store.clearUser();
          window.location.href = '/';
          break;
        case 403:
          // 权限不足
          console.error('权限不足');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('发送请求时出错', error.message);
    }
    return Promise.reject(error);
  }
);

// 由于此为前端演示版本，使用本地模拟数据
// 在实际项目中，这些函数会发送实际的HTTP请求

const mockDatabase = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '123456', // 实际中应该使用加密密码
      name: '系统管理员',
      role: '超级管理员',
      department: '信息中心',
      email: 'admin@example.com',
      phone: '13800000000',
      skills: ['全栈开发', '系统管理', '数据分析'],
      lastLogin: '2023-10-15 08:30:22'
    },
    {
      id: 2,
      username: 'manager1',
      password: '123456',
      name: '张主任',
      role: '部门负责人',
      department: '视频制作部',
      email: 'manager1@example.com',
      phone: '13800000001',
      skills: ['视频剪辑', '导演', '摄影'],
      lastLogin: '2023-10-14 17:45:10'
    },
    {
      id: 3,
      username: 'user1',
      password: '123456',
      name: '李明',
      role: '普通成员',
      department: '视频制作部',
      email: 'user1@example.com',
      phone: '13800000002',
      skills: ['视频剪辑', '摄影'],
      lastLogin: '2023-10-15 09:20:33'
    }
  ],
  departments: [
    { id: 1, name: '信息中心', description: '负责系统开发与维护' },
    { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
    { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
    { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
    { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
  ],
  tasks: [
    {
      id: 1,
      title: '校运会宣传视频制作',
      description: '制作时长3分钟的校运会宣传片，突出体育精神与青春活力',
      status: '进行中',
      isUrgent: true,
      deadline: '2023-10-25 18:00:00',
      creator: '张主任',
      department: '视频制作部',
      members: [
        { id: 3, name: '李明' },
        { id: 4, name: '王红' }
      ],
      attachments: [
        { name: '校运会策划.docx', url: '#', size: 1024 * 1024 * 2.5 },
        { name: '往届视频参考.mp4', url: '#', size: 1024 * 1024 * 25 }
      ],
      createdAt: '2023-10-10 14:30:00',
      start: 10, // 甘特图用，开始日期（本月第几天）
      duration: 15 // 甘特图用，持续天数
    },
    {
      id: 2,
      title: '十月社团活动报道',
      description: '对本月社团活动进行拍摄报道，制作图文与短视频',
      status: '未开始',
      isUrgent: false,
      deadline: '2023-10-30 18:00:00',
      creator: '王编辑',
      department: '新闻采编部',
      members: [
        { id: 5, name: '赵强' },
        { id: 6, name: '钱晓' }
      ],
      attachments: [
        { name: '社团活动安排表.xlsx', url: '#', size: 1024 * 512 }
      ],
      createdAt: '2023-10-15 10:20:00',
      start: 15,
      duration: 15
    },
    {
      id: 3,
      title: '学校官网改版设计',
      description: '设计学校官网新版首页与内页，提供设计稿与切图',
      status: '待验收',
      isUrgent: false,
      deadline: '2023-10-20 18:00:00',
      creator: '李设计',
      department: '设计创意部',
      members: [
        { id: 7, name: '孙艺' }
      ],
      attachments: [],
      createdAt: '2023-10-05 09:00:00',
      submittedAt: '2023-10-18 17:30:00',
      start: 5,
      duration: 15
    },
    {
      id: 4,
      title: '校庆活动策划',
      description: '策划校庆系列活动方案，包括线上互动与线下展示',
      status: '已完成',
      isUrgent: true,
      deadline: '2023-10-10 18:00:00',
      creator: '赵主任',
      department: '宣传运营部',
      members: [
        { id: 8, name: '周策' },
        { id: 9, name: '吴宣' }
      ],
      attachments: [
        { name: '校庆活动策划案.pdf', url: '#', size: 1024 * 1024 * 5 },
        { name: '预算表.xlsx', url: '#', size: 1024 * 300 }
      ],
      createdAt: '2023-09-25 11:00:00',
      completedAt: '2023-10-08 16:45:00',
      start: 1,
      duration: 10
    }
  ],
  notifications: [
    {
      id: 1,
      content: '您有一个新任务：校运会宣传视频制作',
      time: '2023-10-10 14:30:00',
      type: 'warning',
      userId: 3
    },
    {
      id: 2,
      content: '任务"校庆活动策划"已被标记为已完成',
      time: '2023-10-08 16:45:00',
      type: 'success',
      userId: 2
    },
    {
      id: 3,
      content: '系统维护通知：本周六凌晨2点-4点系统升级维护',
      time: '2023-10-15 09:00:00',
      type: 'info',
      userId: null // null表示发给所有用户
    }
  ]
};

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API请求封装
 */

// API基础地址
const BASE_URL = '';

// API接口路径
const API = {
  LOGIN: '/api/login',
  USER: '/api/user',
  TASKS: '/api/tasks',
  NOTIFICATIONS: '/api/notifications',
  DEPARTMENTS: '/api/departments',
  UPLOAD: '/api/upload'
};

// 通用请求函数
const request = async (url, options = {}) => {
  // 添加token
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(BASE_URL + url, config);
    
    // 判断请求是否成功
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // 处理401未授权错误，清除登录状态
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      
      throw {
        status: response.status,
        message: errorData.error || response.statusText,
        data: errorData
      };
    }
    
    // 返回JSON数据
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// API方法封装
export const api = {
  // 用户登录
  login: async (credentials) => {
    const { data } = await request(API.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return data;
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    const { data } = await request(API.USER);
    return data;
  },
  
  // 更新用户信息
  updateUser: async (userData) => {
    const { data } = await request(`${API.USER}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return data;
  },
  
  // 修改密码
  changePassword: async (passwordData) => {
    const { data } = await request(`${API.USER}/password`, {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
    return data;
  },
  
  // 获取通知
  getNotifications: async () => {
    const { data } = await request(API.NOTIFICATIONS);
    return { data };
  },
  
  // 获取用户任务
  getUserTasks: async () => {
    const { data } = await request(API.TASKS);
    return { data };
  },
  
  // 获取所有任务
  getAllTasks: async (params = {}) => {
    // 将参数转换为查询字符串
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API.TASKS}?${queryString}` : API.TASKS;
    
    const { data } = await request(url);
    return { data };
  },
  
  // 获取任务详情
  getTaskDetail: async (taskId) => {
    const { data } = await request(`${API.TASKS}/${taskId}`);
    return data;
  },
  
  // 更新任务状态
  updateTaskStatus: async (taskId, status) => {
    const { data } = await request(`${API.TASKS}/${taskId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
    return data;
  },
  
  // 获取部门列表
  getDepartments: async () => {
    
    // 为相关成员创建通知
    newTask.members.forEach(member => {
      mockDatabase.notifications.push({
        id: mockDatabase.notifications.length + 1,
        content: `您有一个新任务：${newTask.title}`,
        time: new Date().toLocaleString(),
        type: newTask.isUrgent ? 'warning' : 'info',
        userId: member.id
      });
    });
    
    return newTask;
  },
  
  async updateTaskStatus(taskId, newStatus) {
    await delay();
    // 验证用户
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    // 查找任务
    const taskIndex = mockDatabase.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('任务不存在');
    
    // 更新状态
    const task = mockDatabase.tasks[taskIndex];
    task.status = newStatus;
    
    // 如果是提交验收或完成状态，添加对应时间戳
    if (newStatus === '待验收') {
      task.submittedAt = new Date().toLocaleString();
    } else if (newStatus === '已完成') {
      task.completedAt = new Date().toLocaleString();
    }
    
    // 创建通知
    mockDatabase.notifications.push({
      id: mockDatabase.notifications.length + 1,
      content: `任务"${task.title}"状态已更新为：${newStatus}`,
      time: new Date().toLocaleString(),
      type: newStatus === '已完成' ? 'success' : 'info',
      userId: currentUser.id
    });
    
    return task;
  },
  
  async getTodoTasks() {
    await delay();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    // 查找与当前用户相关的待办任务（未开始状态）
    const todoTasks = mockDatabase.tasks.filter(task => 
      task.status === '未开始' && 
      task.members.some(member => member.id === currentUser.id)
    );
    
    return { data: todoTasks };
  },
  
  async getAllTasks() {
    await delay();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    let tasks = [];
    
    if (['超级管理员', '管理员'].includes(currentUser.role)) {
      // 管理员可以查看所有任务
      tasks = mockDatabase.tasks;
    } else if (currentUser.role === '部门负责人') {
      // 部门负责人可以查看所在部门的任务
      tasks = mockDatabase.tasks.filter(task => 
        task.department === currentUser.department ||
        task.members.some(member => member.id === currentUser.id)
      );
    } else {
      // 普通成员只能查看与自己相关的任务
      tasks = mockDatabase.tasks.filter(task => 
        task.members.some(member => member.id === currentUser.id)
      );
    }
    
    return { data: tasks };
  },
  
  async getUserTasks() {
    await delay();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    // 查找与当前用户相关的所有任务
    const userTasks = mockDatabase.tasks.filter(task => 
      task.members.some(member => member.id === currentUser.id) ||
      task.creator === currentUser.name
    );
    
    return { data: userTasks };
  },
  
  // 通知相关
  async getNotifications() {
    await delay();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    // 获取针对当前用户和所有用户的通知，按时间降序排列
    const userNotifications = mockDatabase.notifications.filter(notice => 
      notice.userId === null || notice.userId === currentUser.id
    ).sort((a, b) => new Date(b.time) - new Date(a.time));
    
    return { data: userNotifications };
  },
  
  // 部门相关
  async getDepartments() {
    await delay();
    return { data: mockDatabase.departments };
  },
  
  // 成员相关
  async searchMembers(query, departmentId) {
    await delay();
    let members = mockDatabase.users;
    
    // 如果指定了部门，筛选该部门成员
    if (departmentId) {
      const deptId = parseInt(departmentId);
      members = members.filter(user => {
        const userDept = mockDatabase.departments.find(d => d.name === user.department);
        return userDept && userDept.id === deptId;
      });
    }
    
    // 根据查询条件筛选
    if (query) {
      const lowerQuery = query.toLowerCase();
      members = members.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) || 
        user.username.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 只返回需要的字段
    return {
      data: members.map(user => ({
        id: user.id,
        name: user.name,
        department: user.department,
        role: user.role,
        skills: user.skills
      }))
    };
  },
  
  // 数据统计
  async getTaskStatistics() {
    await delay();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('未登录');
    
    // 检查权限
    if (!['超级管理员', '管理员', '部门负责人'].includes(currentUser.role)) {
      throw new Error('没有权限访问统计数据');
    }
    
    let relevantTasks = [];
    
    if (['超级管理员', '管理员'].includes(currentUser.role)) {
      relevantTasks = mockDatabase.tasks;
    } else {
      // 部门负责人只能看自己部门的统计
      relevantTasks = mockDatabase.tasks.filter(task => task.department === currentUser.department);
    }
    
    // 计算统计数据
    const totalTasks = relevantTasks.length;
    const completedTasks = relevantTasks.filter(task => task.status === '已完成').length;
    const completionRate = totalTasks ? (completedTasks / totalTasks * 100).toFixed(1) : 0;
    
    // 计算逾期率
    const now = new Date();
    const overdueTasks = relevantTasks.filter(task => {
      const deadline = new Date(task.deadline);
      return deadline < now && task.status !== '已完成';
    }).length;
    const overdueRate = totalTasks ? (overdueTasks / totalTasks * 100).toFixed(1) : 0;
    
    // 按部门分组的任务统计
    const departmentStats = {};
    mockDatabase.departments.forEach(dept => {
      const deptTasks = relevantTasks.filter(task => task.department === dept.name);
      const deptCompleted = deptTasks.filter(task => task.status === '已完成').length;
      
      departmentStats[dept.name] = {
        total: deptTasks.length,
        completed: deptCompleted,
        completionRate: deptTasks.length ? (deptCompleted / deptTasks.length * 100).toFixed(1) : 0
      };
    });
    
    // 按状态统计任务数量
    const statusStats = {
      '未开始': relevantTasks.filter(task => task.status === '未开始').length,
      '进行中': relevantTasks.filter(task => task.status === '进行中').length,
      '待验收': relevantTasks.filter(task => task.status === '待验收').length,
      '已完成': completedTasks
    };
    
    return {
      data: {
        totalTasks,
        completedTasks,
        completionRate,
        overdueRate,
        departmentStats,
        statusStats
      }
    };
  }
};
