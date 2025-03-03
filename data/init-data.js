const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 数据存储路径
const DATA_DIR = path.join(__dirname);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// 确保数据目录存在
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 数据文件路径
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DEPARTMENTS_FILE = path.join(DATA_DIR, 'departments.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// 密码哈希函数
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 写入数据函数
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`成功写入数据到: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`写入文件 ${filePath} 时出错:`, error);
    return false;
  }
}

// 初始化用户数据
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    password: hashPassword('admin123'),
    name: '系统管理员',
    role: '超级管理员',
    department: 1, // 信息中心
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
    department: 2, // 视频制作部
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
    department: 2, // 视频制作部
    email: 'user1@example.com',
    phone: '13800000002',
    skills: ['视频剪辑', '摄影'],
    lastLogin: new Date().toISOString()
  },
  {
    id: 4,
    username: 'user2',
    password: hashPassword('123456'),
    name: '王红',
    role: '普通成员',
    department: 2, // 视频制作部
    email: 'user2@example.com',
    phone: '13800000003',
    skills: ['视频特效', '后期制作'],
    lastLogin: null
  },
  {
    id: 5,
    username: 'news1',
    password: hashPassword('123456'),
    name: '赵强',
    role: '普通成员',
    department: 3, // 新闻采编部
    email: 'news1@example.com',
    phone: '13800000004',
    skills: ['新闻写作', '摄影'],
    lastLogin: null
  }
];

// 初始化部门数据
const initialDepartments = [
  { id: 1, name: '信息中心', description: '负责系统开发与维护' },
  { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
  { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
  { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
  { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
];

// 初始化任务数据
const initialTasks = [
  {
    id: 1,
    title: '校运会宣传视频制作',
    description: '制作时长3分钟的校运会宣传片，突出体育精神与青春活力',
    status: '进行中',
    isUrgent: true,
    deadline: new Date('2023-10-25T18:00:00').toISOString(),
    createdAt: new Date('2023-10-10T14:30:00').toISOString(),
    startedAt: new Date('2023-10-11T09:00:00').toISOString(),
    creator: 2, // 张主任
    creatorName: '张主任',
    department: 2, // 视频制作部
    departmentName: '视频制作部',
    members: [3, 4], // 李明, 王红
    attachments: [
      { 
        name: '校运会策划.docx', 
        path: '/uploads/sample1.docx', 
        size: 2621440 
      },
      { 
        name: '往届视频参考.mp4', 
        path: '/uploads/sample2.mp4', 
        size: 26214400 
      }
    ]
  },
  {
    id: 2,
    title: '十月社团活动报道',
    description: '对本月社团活动进行拍摄报道，制作图文与短视频',
    status: '未开始',
    isUrgent: false,
    deadline: new Date('2023-10-30T18:00:00').toISOString(),
    createdAt: new Date('2023-10-15T10:20:00').toISOString(),
    creator: 1, // 系统管理员
    creatorName: '系统管理员',
    department: 3, // 新闻采编部
    departmentName: '新闻采编部',
    members: [5], // 赵强
    attachments: [
      { 
        name: '社团活动安排表.xlsx', 
        path: '/uploads/sample3.xlsx', 
        size: 524288 
      }
    ]
  }
];

// 初始化通知数据
const initialNotifications = [
  {
    id: 1,
    content: '您有一个新任务：校运会宣传视频制作',
    time: new Date('2023-10-10T14:30:00').toISOString(),
    type: 'warning',
    userId: 3 // 发给李明的
  },
  {
    id: 2,
    content: '您有一个新任务：校运会宣传视频制作',
    time: new Date('2023-10-10T14:30:00').toISOString(),
    type: 'warning',
    userId: 4 // 发给王红的
  },
  {
    id: 3,
    content: '您有一个新任务：十月社团活动报道',
    time: new Date('2023-10-15T10:20:00').toISOString(),
    type: 'info',
    userId: 5 // 发给赵强的
  },
  {
    id: 4,
    content: '系统维护通知：本周六凌晨2点-4点系统升级维护',
    time: new Date('2023-10-18T09:00:00').toISOString(),
    type: 'info',
    userId: null // 发给所有人
  }
];

// 初始化数据
console.log('开始初始化数据...');

writeData(USERS_FILE, initialUsers);
writeData(DEPARTMENTS_FILE, initialDepartments);
writeData(TASKS_FILE, initialTasks);
writeData(NOTIFICATIONS_FILE, initialNotifications);

console.log('数据初始化完成!');
