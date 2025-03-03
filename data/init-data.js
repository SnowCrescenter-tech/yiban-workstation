/**
 * 系统初始化数据
 * 包含默认用户、部门和示例任务
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 数据目录
const DATA_DIR = path.join(__dirname);

// 数据文件路径
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DEPARTMENTS_FILE = path.join(DATA_DIR, 'departments.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// 密码哈希函数
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 初始用户数据
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    password: hashPassword('admin123'),
    name: '系统管理员',
    role: '超级管理员',
    department: 1, // 信息中心的ID
    email: 'admin@example.com',
    phone: '13800000000',
    skills: ['全栈开发', '系统管理', '数据分析'],
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    username: 'manager1',
    password: hashPassword('123456'),
    name: '张主任',
    role: '部门负责人',
    department: 2, // 视频制作部的ID
    email: 'manager1@example.com',
    phone: '13800000001',
    skills: ['视频剪辑', '导演', '摄影'],
    lastLogin: new Date().toISOString()
  },
  {
    id: 3,
    username: 'user1',
    password: hashPassword('123456'),
    name: '李明',
    role: '普通成员',
    department: 2, // 视频制作部的ID
    email: 'user1@example.com',
    phone: '13800000002',
    skills: ['视频剪辑', '摄影'],
    lastLogin: new Date().toISOString()
  }
];

// 初始部门数据
const initialDepartments = [
  { id: 1, name: '信息中心', description: '负责系统开发与维护' },
  { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
  { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
  { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
  { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
];

// 初始任务数据
const initialTasks = [
  {
    id: 1,
    title: '校运会宣传视频制作',
    description: '制作时长3分钟的校运会宣传片，突出体育精神与青春活力',
    status: '进行中',
    isUrgent: true,
    deadline: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天后
    creator: 2, // manager1
    creatorName: '张主任',
    department: 2, // 视频制作部
    departmentName: '视频制作部',
    members: [3], // user1
    attachments: [],
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString()
  }
];

// 初始通知数据
const initialNotifications = [
  {
    id: 1,
    content: '欢迎使用易班工作站管理系统',
    time: new Date().toISOString(),
    type: 'info',
    userId: null // 发给所有用户
  },
  {
    id: 2,
    content: '您有一个新任务: 校运会宣传视频制作',
    time: new Date().toISOString(),
    type: 'warning',
    userId: 3 // 发给user1
  }
];

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 写入初始数据
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`数据已成功写入: ${filePath}`);
  } catch (error) {
    console.error(`写入文件失败: ${filePath}`, error);
  }
}

// 初始化函数
function initData() {
  // 检查文件是否存在，不存在则创建初始数据
  if (!fs.existsSync(USERS_FILE)) {
    writeData(USERS_FILE, initialUsers);
  }
  
  if (!fs.existsSync(DEPARTMENTS_FILE)) {
    writeData(DEPARTMENTS_FILE, initialDepartments);
  }
  
  if (!fs.existsSync(TASKS_FILE)) {
    writeData(TASKS_FILE, initialTasks);
  }
  
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    writeData(NOTIFICATIONS_FILE, initialNotifications);
  }
}

// 导出初始化函数
module.exports = { initData };
