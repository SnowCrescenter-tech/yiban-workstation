/**
 * 易班工作站服务器
 * 提供API接口和静态文件服务
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { initData } = require('./data/init-data');

// 初始化应用
const app = express();
const PORT = process.env.PORT || 3000;

// 初始化数据
initData();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '/')));

// 简单的身份验证中间件
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权访问' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // 在实际应用中应该使用JWT验证
    // 这里只是简单解码token来获取用户ID
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      throw new Error('无效的令牌');
    }
    
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
    const user = usersData.find(u => u.id === payload.userId);
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 将用户信息添加到请求对象中
    req.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: '无效的令牌' });
  }
};

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  try {
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
    
    // 超级管理员特殊处理
    if (username === 'admin' && password === 'admin123') {
      const admin = usersData.find(u => u.username === 'admin');
      if (admin) {
        const token = Buffer.from(JSON.stringify({ userId: admin.id, timestamp: Date.now() })).toString('base64');
        
        // 更新最后登录时间
        admin.lastLogin = new Date().toISOString();
        fs.writeFileSync(path.join(__dirname, 'data/users.json'), JSON.stringify(usersData, null, 2));
        
        return res.json({
          token,
          data: {
            id: admin.id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            department: admin.department
          }
        });
      }
    }
    
    // 常规用户验证
    const user = usersData.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const token = Buffer.from(JSON.stringify({ userId: user.id, timestamp: Date.now() })).toString('base64');
    
    // 更新最后登录时间
    user.lastLogin = new Date().toISOString();
    fs.writeFileSync(path.join(__dirname, 'data/users.json'), JSON.stringify(usersData, null, 2));
    
    return res.json({
      token,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取当前用户信息
app.get('/api/user', authenticate, (req, res) => {
  res.json(req.user);
});

// 获取任务列表
app.get('/api/tasks', authenticate, (req, res) => {
  try {
    const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tasks.json'), 'utf8'));
    const { status, department, urgent } = req.query;
    
    let filteredTasks = [...tasksData];
    
    // 根据状态筛选
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    // 根据部门筛选
    if (department) {
      filteredTasks = filteredTasks.filter(task => task.department == department);
    }
    
    // 根据紧急程度筛选
    if (urgent !== undefined) {
      const isUrgent = urgent === 'true';
      filteredTasks = filteredTasks.filter(task => task.isUrgent === isUrgent);
    }
    
    // 非管理员只能查看自己所在部门或自己参与的任务
    if (!['超级管理员', '管理员'].includes(req.user.role)) {
      filteredTasks = filteredTasks.filter(task => 
        task.department === req.user.department ||
        (task.members && task.members.some(member => member === req.user.id))
      );
    }
    
    res.json(filteredTasks);
  } catch (error) {
    console.error('获取任务列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 创建任务
app.post('/api/tasks', authenticate, (req, res) => {
  // 只有管理员和部门负责人可以创建任务
  if (!['超级管理员', '管理员', '部门负责人'].includes(req.user.role)) {
    return res.status(403).json({ error: '权限不足' });
  }
  
  const { title, description, deadline, department, members, isUrgent = false } = req.body;
  
  if (!title || !description || !deadline || !department) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  try {
    const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tasks.json'), 'utf8'));
    const departmentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/departments.json'), 'utf8'));
    
    const foundDept = departmentsData.find(dept => dept.id == department);
    if (!foundDept) {
      return res.status(400).json({ error: '部门不存在' });
    }
    
    // 创建新任务
    const newTask = {
      id: tasksData.length > 0 ? Math.max(...tasksData.map(t => t.id)) + 1 : 1,
      title,
      description,
      status: '未开始',
      isUrgent,
      deadline,
      creator: req.user.id,
      creatorName: req.user.name,
      department,
      departmentName: foundDept.name,
      members: members || [],
      attachments: [],
      createdAt: new Date().toISOString()
    };
    
    tasksData.push(newTask);
    fs.writeFileSync(path.join(__dirname, 'data/tasks.json'), JSON.stringify(tasksData, null, 2));
    
    // 创建通知
    if (members && members.length > 0) {
      const notificationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/notifications.json'), 'utf8'));
      
      for (const memberId of members) {
        const notification = {
          id: notificationsData.length > 0 ? Math.max(...notificationsData.map(n => n.id)) + 1 : 1,
          content: `您有一个新任务: ${title}`,
          time: new Date().toISOString(),
          type: 'warning',
          userId: memberId
        };
        
        notificationsData.push(notification);
      }
      
      fs.writeFileSync(path.join(__dirname, 'data/notifications.json'), JSON.stringify(notificationsData, null, 2));
    }
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('创建任务错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取通知
app.get('/api/notifications', authenticate, (req, res) => {
  try {
    const notificationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/notifications.json'), 'utf8'));
    
    // 获取发给用户的通知和系统公告（userId为null的通知）
    const userNotifications = notificationsData.filter(
      notice => notice.userId === null || notice.userId === req.user.id
    );
    
    res.json(userNotifications);
  } catch (error) {
    console.error('获取通知错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取部门列表
app.get('/api/departments', (req, res) => {
  try {
    const departmentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/departments.json'), 'utf8'));
    res.json(departmentsData);
  } catch (error) {
    console.error('获取部门列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 确保所有其他请求都返回index.html，以支持前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});