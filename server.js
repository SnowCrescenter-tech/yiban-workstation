const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 初始化应用
const app = express();
const PORT = process.env.PORT || 25000;  // 修改默认端口为25000
const JWT_SECRET = 'your_jwt_secret_key';  // 实际应用中应使用环境变量存储

// 数据存储路径
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

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

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB 最大文件大小
});

// 数据操作函数
function readData(filePath, defaultData = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultData;
  } catch (error) {
    console.error(`读取文件 ${filePath} 时出错:`, error);
    return defaultData;
  }
}

function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`写入文件 ${filePath} 时出错:`, error);
    return false;
  }
}

// 初始化数据
function initData() {
  // 初始化用户数据
  if (!fs.existsSync(USERS_FILE)) {
    const initialUsers = [
      {
        id: 1,
        username: 'admin',
        password: hashPassword('admin123'), // 实际中应该使用更强的密码
        name: '系统管理员',
        role: '超级管理员',
        department: '信息中心',
        email: 'admin@example.com',
        phone: '13800000000',
        skills: ['全栈开发', '系统管理', '数据分析'],
        lastLogin: new Date().toISOString()
      }
    ];
    writeData(USERS_FILE, initialUsers);
  }

  // 初始化部门数据
  if (!fs.existsSync(DEPARTMENTS_FILE)) {
    const initialDepartments = [
      { id: 1, name: '信息中心', description: '负责系统开发与维护' },
      { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
      { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
      { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
      { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
    ];
    writeData(DEPARTMENTS_FILE, initialDepartments);
  }

  // 初始化任务和通知
  if (!fs.existsSync(TASKS_FILE)) {
    writeData(TASKS_FILE, []);
  }

  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    writeData(NOTIFICATIONS_FILE, []);
  }
}

// 密码哈希函数
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 验证JWT中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: '未提供认证令牌' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '认证令牌无效或已过期' });
    req.user = user;
    next();
  });
}

// 角色验证中间件
function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    next();
  };
}

// API路由
// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE);
  
  const user = users.find(u => u.username === username);
  
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }
  
  // 更新登录时间
  user.lastLogin = new Date().toISOString();
  writeData(USERS_FILE, users);
  
  // 生成token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '1d' }
  );
  
  // 返回用户信息，不包括密码
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    token,
    user: userWithoutPassword
  });
});

// 获取当前用户
app.get('/api/user', authenticateToken, (req, res) => {
  const users = readData(USERS_FILE);
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// 修改密码
app.post('/api/user/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: '当前密码和新密码都是必需的' });
  }
  
  const users = readData(USERS_FILE);
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  if (users[userIndex].password !== hashPassword(currentPassword)) {
    return res.status(400).json({ message: '当前密码不正确' });
  }
  
  users[userIndex].password = hashPassword(newPassword);
  writeData(USERS_FILE, users);
  
  res.json({ message: '密码已更改' });
});

// 更新用户资料
app.put('/api/user/profile', authenticateToken, (req, res) => {
  const { name, email, phone, skills } = req.body;
  
  const users = readData(USERS_FILE);
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  // 只允许更新特定字段
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (phone) users[userIndex].phone = phone;
  if (skills) users[userIndex].skills = skills;
  
  writeData(USERS_FILE, users);
  
  const { password, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

// 获取部门列表
app.get('/api/departments', (req, res) => {
  const departments = readData(DEPARTMENTS_FILE);
  res.json(departments);
});

// 任务相关端点
// 获取所有任务
app.get('/api/tasks', authenticateToken, (req, res) => {
  const tasks = readData(TASKS_FILE);
  const users = readData(USERS_FILE);
  const currentUser = users.find(u => u.id === req.user.id);
  
  if (!currentUser) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  let userTasks;
  
  // 根据角色过滤任务
  if (['超级管理员', '管理员'].includes(currentUser.role)) {
    userTasks = tasks; // 管理员可以查看所有任务
  } else if (currentUser.role === '部门负责人') {
    userTasks = tasks.filter(task => 
      task.department === currentUser.department || 
      task.members.some(m => m.id === currentUser.id)
    );
  } else {
    userTasks = tasks.filter(task => 
      task.members.some(m => m.id === currentUser.id)
    );
  }
  
  res.json(userTasks);
});

// 创建新任务
app.post('/api/tasks', authenticateToken, (req, res) => {
  const users = readData(USERS_FILE);
  const currentUser = users.find(u => u.id === req.user.id);
  
  if (!currentUser) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  // 检查权限
  if (!['超级管理员', '管理员', '部门负责人'].includes(currentUser.role)) {
    return res.status(403).json({ message: '没有权限创建任务' });
  }
  
  const { title, description, isUrgent, deadline, department, members, attachments } = req.body;
  
  if (!title || !description || !deadline || !department) {
    return res.status(400).json({ message: '缺少必要的任务信息' });
  }
  
  const tasks = readData(TASKS_FILE);
  const departments = readData(DEPARTMENTS_FILE);
  
  // 验证部门是否存在
  const targetDepartment = departments.find(d => d.id === parseInt(department));
  if (!targetDepartment) {
    return res.status(400).json({ message: '指定的部门不存在' });
  }
  
  // 创建新任务
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    status: '未开始',
    isUrgent: Boolean(isUrgent),
    deadline: new Date(deadline).toISOString(),
    createdAt: new Date().toISOString(),
    creator: currentUser.id,
    creatorName: currentUser.name,
    department: targetDepartment.id,
    departmentName: targetDepartment.name,
    members: Array.isArray(members) ? members : [],
    attachments: Array.isArray(attachments) ? attachments : []
  };
  
  tasks.push(newTask);
  writeData(TASKS_FILE, tasks);
  
  // 为相关成员创建通知
  if (newTask.members.length) {
    const notifications = readData(NOTIFICATIONS_FILE);
    
    newTask.members.forEach(memberId => {
      notifications.push({
        id: notifications.length ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
        content: `您有一个新任务：${newTask.title}`,
        time: new Date().toISOString(),
        type: newTask.isUrgent ? 'warning' : 'info',
        userId: memberId
      });
    });
    
    writeData(NOTIFICATIONS_FILE, notifications);
  }
  
  res.status(201).json(newTask);
});

// 更新任务状态
app.patch('/api/tasks/:id/status', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!status || !['未开始', '进行中', '待验收', '已完成'].includes(status)) {
    return res.status(400).json({ message: '无效的状态值' });
  }
  
  const tasks = readData(TASKS_FILE);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: '任务不存在' });
  }
  
  // 更新状态
  tasks[taskIndex].status = status;
  
  // 添加相关时间戳
  if (status === '进行中' && !tasks[taskIndex].startedAt) {
    tasks[taskIndex].startedAt = new Date().toISOString();
  } else if (status === '待验收' && !tasks[taskIndex].submittedAt) {
    tasks[taskIndex].submittedAt = new Date().toISOString();
  } else if (status === '已完成' && !tasks[taskIndex].completedAt) {
    tasks[taskIndex].completedAt = new Date().toISOString();
  }
  
  writeData(TASKS_FILE, tasks);
  
  // 创建通知
  const notifications = readData(NOTIFICATIONS_FILE);
  const newNotification = {
    id: notifications.length ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
    content: `任务"${tasks[taskIndex].title}"状态已更新为：${status}`,
    time: new Date().toISOString(),
    type: status === '已完成' ? 'success' : 'info',
    userId: tasks[taskIndex].creator
  };
  
  notifications.push(newNotification);
  writeData(NOTIFICATIONS_FILE, notifications);
  
  res.json(tasks[taskIndex]);
});

// 获取用户通知
app.get('/api/notifications', authenticateToken, (req, res) => {
  const notifications = readData(NOTIFICATIONS_FILE);
  
  // 获取针对当前用户和所有用户的通知
  const userNotifications = notifications.filter(n => 
    n.userId === req.user.id || n.userId === null
  ).sort((a, b) => new Date(b.time) - new Date(a.time));
  
  res.json(userNotifications);
});

// 文件上传
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有上传文件' });
  }
  
  res.json({
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size
  });
});

// 获取用户列表 (仅管理员)
app.get('/api/users', authenticateToken, authorizeRoles(['超级管理员', '管理员']), (req, res) => {
  const users = readData(USERS_FILE);
  
  // 不返回密码
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

// 创建用户 (仅管理员)
app.post('/api/users', authenticateToken, authorizeRoles(['超级管理员', '管理员']), (req, res) => {
  const { username, password, name, role, department, email, phone, skills } = req.body;
  
  if (!username || !password || !name || !role || !department) {
    return res.status(400).json({ message: '缺少必要的用户信息' });
  }
  
  const users = readData(USERS_FILE);
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: '用户名已存在' });
  }
  
  // 超级管理员才能创建管理员账号
  if (role === '超级管理员' && req.user.role !== '超级管理员') {
    return res.status(403).json({ message: '只有超级管理员能创建超级管理员账号' });
  }
  
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password: hashPassword(password),
    name,
    role,
    department,
    email: email || '',
    phone: phone || '',
    skills: skills || [],
    lastLogin: null
  };
  
  users.push(newUser);
  writeData(USERS_FILE, users);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// 批量创建用户 (仅超级管理员)
app.post('/api/users/batch', authenticateToken, authorizeRoles(['超级管理员']), (req, res) => {
  const { users: newUsers } = req.body;
  
  if (!Array.isArray(newUsers) || !newUsers.length) {
    return res.status(400).json({ message: '无效的用户数据' });
  }
  
  const users = readData(USERS_FILE);
  const existingUsernames = new Set(users.map(u => u.username));
  const addedUsers = [];
  const failedUsers = [];
  
  for (const user of newUsers) {
    if (!user.username || !user.password || !user.name || !user.role || !user.department) {
      failedUsers.push({ ...user, reason: '缺少必要信息' });
      continue;
    }
    
    if (existingUsernames.has(user.username)) {
      failedUsers.push({ ...user, reason: '用户名已存在' });
      continue;
    }
    
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: user.username,
      password: hashPassword(user.password),
      name: user.name,
      role: user.role,
      department: user.department,
      email: user.email || '',
      phone: user.phone || '',
      skills: user.skills || [],
      lastLogin: null
    };
    
    users.push(newUser);
    existingUsernames.add(user.username);
    addedUsers.push({ ...newUser, password: undefined });
  }
  
  if (addedUsers.length) {
    writeData(USERS_FILE, users);
  }
  
  res.json({
    addedCount: addedUsers.length,
    failedCount: failedUsers.length,
    failed: failedUsers
  });
});

// 统计数据 (管理员和部门负责人)
app.get('/api/statistics/tasks', authenticateToken, (req, res) => {
  const users = readData(USERS_FILE);
  const currentUser = users.find(u => u.id === req.user.id);
  
  if (!currentUser) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  // 检查权限
  if (!['超级管理员', '管理员', '部门负责人'].includes(currentUser.role)) {
    return res.status(403).json({ message: '没有权限访问统计数据' });
  }
  
  const tasks = readData(TASKS_FILE);
  let relevantTasks = [];
  
  if (['超级管理员', '管理员'].includes(currentUser.role)) {
    relevantTasks = tasks;
  } else {
    // 部门负责人只能看自己部门的统计
    relevantTasks = tasks.filter(task => task.department === currentUser.department);
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
  const departments = readData(DEPARTMENTS_FILE);
  
  departments.forEach(dept => {
    const deptTasks = relevantTasks.filter(task => task.department === dept.id);
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
  
  res.json({
    totalTasks,
    completedTasks,
    completionRate,
    overdueRate,
    departmentStats,
    statusStats
  });
});

// 初始化数据并启动服务器
initData();

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});