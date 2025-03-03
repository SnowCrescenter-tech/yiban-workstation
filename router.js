// 页面组件定义
const Home = {
  template: window.templates.views.home,
  data() {
    return {
      carouselItems: [
        { id: 1, image: 'https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg', title: '新媒体工作站荣获校级优秀团队' },
        { id: 2, image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg', title: '2023年度技术开发成果展' },
        { id: 3, image: 'https://cdn.pixabay.com/photo/2018/01/17/07/06/laptop-3087585_1280.jpg', title: '校园新媒体建设研讨会' }
      ],
      newsList: [
        { id: 1, title: '新媒体中心招新活动圆满结束', date: '2023-11-10', image: 'https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_640.jpg', summary: '本次招新共吸引了300余名同学参与...' },
        { id: 2, title: '校园APP设计大赛开始报名', date: '2023-11-05', image: 'https://cdn.pixabay.com/photo/2016/11/29/08/41/apple-1868496_640.jpg', summary: '由新媒体中心主办的第三届校园APP设计大赛正式启动...' },
        { id: 3, title: '我校媒体融合发展研讨会顺利召开', date: '2023-10-28', image: 'https://cdn.pixabay.com/photo/2016/11/19/14/16/coffee-1839233_640.jpg', summary: '来自各院系的师生代表共同探讨校园媒体融合发展新路径...' },
        { id: 4, title: '新媒体中心获评"优秀学生组织"', date: '2023-10-20', image: 'https://cdn.pixabay.com/photo/2016/03/26/13/09/cup-1280537_640.jpg', summary: '在2023年度学生组织评选中，新媒体中心脱颖而出...' },
        { id: 5, title: '数据可视化技术培训顺利开展', date: '2023-10-15', image: 'https://cdn.pixabay.com/photo/2015/09/05/20/02/coding-924920_640.jpg', summary: '为提升团队技术能力，新媒体中心特邀行业专家开展培训...' },
        { id: 6, title: '校园文化推广计划启动', date: '2023-10-08', image: 'https://cdn.pixabay.com/photo/2016/10/30/05/43/school-1782427_640.jpg', summary: '新媒体中心将利用数字化手段助力校园文化建设与推广...' }
      ]
    };
  }
};

const Login = {
  template: window.templates.views.login,
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      captchaUrl: '',
      loading: false,
      loginAttempts: 0
    };
  },
  methods: {
    refreshCaptcha() {
      // 使用本地生成的验证码图片
      this.captchaUrl = this.$utils.generateCaptcha();
    },
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate();
        if (valid) {
          // 检查验证码是否正确
          if (this.loginForm.captcha.toUpperCase() !== window._captchaText) {
            this.$message.error('验证码错误');
            this.refreshCaptcha();
            return;
          }
          
          this.loading = true;
          // 模拟登录请求
          setTimeout(async () => {
            try {
              const response = await this.$api.auth.login(this.loginForm);
              this.$store.commit('user/setLoggedIn', true);
              this.$store.commit('user/setCurrentUser', response.data);
              this.$store.commit('user/setToken', response.data.token);
              this.$router.push('/dashboard');
            } catch (error) {
              this.loginAttempts++;
              this.$message.error(error.message || '登录失败，请检查用户名和密码');
              this.refreshCaptcha();
              
              if (this.loginAttempts >= 3) {
                this.$message.error('登录失败次数过多，账号已被锁定30分钟');
                this.$refs[formName].resetFields();
              }
            } finally {
              this.loading = false;
            }
          }, 1000);
        }
      } catch (error) {
        console.error('表单验证失败', error);
        return false;
      }
    },
    forgotPassword() {
      this.$message.info('请联系管理员重置密码');
    }
  },
  mounted() {
    this.refreshCaptcha();
  }
};

const Dashboard = {
  template: window.templates.views.dashboard,
  data() {
    return {
      tasks: [],
      notifications: [],
      calendarView: 'week',
      loading: true
    };
  },
  async created() {
    try {
      const [tasksRes, notificationsRes] = await Promise.all([
        this.$api.tasks.getList(),
        this.$api.notifications.getList()
      ]);
      this.tasks = tasksRes.data;
      this.notifications = notificationsRes.data;
    } catch (error) {
      this.$message.error('数据加载失败');
    } finally {
      this.loading = false;
    }
  },
  computed: {
    urgentTasks() {
      return this.tasks.filter(task => task.priority === 'urgent');
    },
    pendingTasks() {
      return this.tasks.filter(task => task.status === 'pending');
    },
    inProgressTasks() {
      return this.tasks.filter(task => task.status === 'in-progress');
    },
    overdueTasks() {
      return this.tasks.filter(task => 
        task.status !== 'completed' && 
        new Date(task.deadline) < new Date()
      );
    }
  }
};

const Profile = {
  template: window.templates.views.profile,
  data() {
    return {
      user: null,
      form: {
        name: '',
        email: '',
        phone: '',
        department: '',
        skills: []
      },
      loading: true
    };
  },
  async created() {
    try {
      const response = await this.$api.user.getProfile();
      this.user = response.data;
      this.form = { ...this.user };
    } catch (error) {
      this.$message.error('加载用户信息失败');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async updateProfile() {
      try {
        this.loading = true;
        await this.$api.user.updateProfile(this.form);
        this.$message.success('个人信息更新成功');
        this.user = { ...this.form };
      } catch (error) {
        this.$message.error('更新失败，请稍后再试');
      } finally {
        this.loading = false;
      }
    }
  }
};

const TaskCreation = {
  template: window.templates.views.taskCreation,
  data() {
    return {
      form: {
        title: '',
        type: 'normal',
        deadline: '',
        assignees: [],
        department: '',
        description: '',
        attachments: []
      },
      departments: [],
      users: [],
      rules: {
        title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        department: [{ required: true, message: '请选择部门', trigger: 'change' }]
      },
      loading: false,
      uploadUrl: '/api/upload',
      fileList: []
    };
  },
  async created() {
    try {
      const [deptRes, usersRes] = await Promise.all([
        this.$api.departments.getList(),
        this.$api.users.getList()
      ]);
      this.departments = deptRes.data;
      this.users = usersRes.data;
    } catch (error) {
      this.$message.error('数据加载失败');
    }
  },
  methods: {
    handleDepartmentChange() {
      // 根据所选部门筛选用户
      if (this.form.department) {
        this.filteredUsers = this.users.filter(user => 
          user.department === this.form.department
        );
      } else {
        this.filteredUsers = this.users;
      }
    },
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate();
        if (valid) {
          this.loading = true;
          await this.$api.tasks.create(this.form);
          this.$message.success('任务创建成功');
          this.$router.push('/dashboard');
        }
      } catch (error) {
        this.$message.error('任务创建失败');
      } finally {
        this.loading = false;
      }
    },
    handleFileUpload(response, file, fileList) {
      this.form.attachments.push({
        name: file.name,
        url: response.url,
        size: file.size
      });
    },
    handleFileRemove(file) {
      const index = this.form.attachments.findIndex(item => item.name === file.name);
      if (index !== -1) {
        this.form.attachments.splice(index, 1);
      }
    }
  }
};

const Admin = {
  template: window.templates.views.admin,
  data() {
    return {
      activeTab: 'accounts',
      users: [],
      departments: [],
      roles: [],
      statistics: {
        taskCompletion: [],
        loginRecords: [],
        storageUsage: {}
      },
      currentPage: 1,
      pageSize: 10,
      totalUsers: 0,
      searchQuery: '',
      loading: true,
      batchImportVisible: false,
      importTemplate: './templates/user_import_template.xlsx'
    };
  },
  async created() {
    if (!this.hasAdminPermission) {
      this.$router.push('/dashboard');
      return;
    }
    
    try {
      const [usersRes, deptsRes, rolesRes, statsRes] = await Promise.all([
        this.$api.admin.getUsers({ page: this.currentPage, pageSize: this.pageSize }),
        this.$api.departments.getList(),
        this.$api.admin.getRoles(),
        this.$api.admin.getStatistics()
      ]);
      
      this.users = usersRes.data.items;
      this.totalUsers = usersRes.data.total;
      this.departments = deptsRes.data;
      this.roles = rolesRes.data;
      this.statistics = statsRes.data;
    } catch (error) {
      this.$message.error('加载管理数据失败');
    } finally {
      this.loading = false;
    }
  },
  computed: {
    hasAdminPermission() {
      const user = this.$store.state.user.currentUser;
      return user && (user.role === 'admin' || user.role === 'super_admin');
    }
  },
  methods: {
    async handleSearch() {
      try {
        this.loading = true;
        const response = await this.$api.admin.getUsers({
          page: 1,
          pageSize: this.pageSize,
          query: this.searchQuery
        });
        this.users = response.data.items;
        this.totalUsers = response.data.total;
        this.currentPage = 1;
      } catch (error) {
        this.$message.error('搜索失败');
      } finally {
        this.loading = false;
      }
    },
    async handlePageChange(page) {
      try {
        this.loading = true;
        const response = await this.$api.admin.getUsers({
          page,
          pageSize: this.pageSize,
          query: this.searchQuery
        });
        this.users = response.data.items;
        this.currentPage = page;
      } catch (error) {
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(userId) {
      try {
        await this.$api.admin.resetPassword(userId);
        this.$message.success('密码已重置');
      } catch (error) {
        this.$message.error('密码重置失败');
      }
    },
    async changeUserRole(userId, role) {
      try {
        await this.$api.admin.updateUserRole(userId, role);
        this.$message.success('角色更新成功');
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].role = role;
        }
      } catch (error) {
        this.$message.error('角色更新失败');
      }
    },
    renderStatistics() {
      // 渲染任务统计图表
      const taskChartEl = this.$refs.taskCompletionChart;
      const taskChart = echarts.init(taskChartEl);
      taskChart.setOption({
        title: { text: '任务完成率统计' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['完成率', '逾期率'] },
        xAxis: { type: 'category', data: this.statistics.taskCompletion.map(i => i.department) },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [
          {
            name: '完成率',
            type: 'bar',
            data: this.statistics.taskCompletion.map(i => i.completionRate)
          },
          {
            name: '逾期率',
            type: 'bar',
            data: this.statistics.taskCompletion.map(i => i.overdueRate)
          }
        ]
      });
      
      // 渲染登录记录图表
      const loginChartEl = this.$refs.loginRecordsChart;
      const loginChart = echarts.init(loginChartEl);
      loginChart.setOption({
        title: { text: '近30日登录统计' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: this.statistics.loginRecords.map(i => i.date) },
        yAxis: { type: 'value' },
        series: [
          {
            name: '登录次数',
            type: 'line',
            data: this.statistics.loginRecords.map(i => i.count),
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          }
        ]
      });
      
      // 渲染存储使用图表
      const storageChartEl = this.$refs.storageUsageChart;
      const storageChart = echarts.init(storageChartEl);
      storageChart.setOption({
        title: { text: '存储空间使用情况' },
        tooltip: { trigger: 'item', formatter: '{b}: {c}MB ({d}%)' },
        series: [
          {
            name: '存储使用',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: { show: false },
            emphasis: {
              label: { show: true, fontSize: '16', fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: [
              { value: this.statistics.storageUsage.documents, name: '文档' },
              { value: this.statistics.storageUsage.images, name: '图片' },
              { value: this.statistics.storageUsage.videos, name: '视频' },
              { value: this.statistics.storageUsage.others, name: '其他' }
            ]
          }
        ]
      });
    }
  },
  mounted() {
    if (!this.loading) {
      this.$nextTick(() => {
        this.renderStatistics();
      });
    }
  },
  updated() {
    if (this.activeTab === 'statistics' && !this.loading) {
      this.$nextTick(() => {
        this.renderStatistics();
      });
    }
  }
};

// 添加缺少的路由组件
const About = {
  template: `
    <div class="about-container">
      <h1>工作站介绍</h1>
      <div class="about-content">
        <p>新媒体中心工作站是校内负责新媒体内容创作与技术开发的专业团队，致力于校园文化传播和信息化建设。</p>
        <p>我们的团队由设计、内容、技术、运营四个部门组成，成员来自全校各个院系，拥有多元化的知识背景和技能专长。</p>
        <h2>我们的使命</h2>
        <p>以创新的方式传播校园文化，提供高质量的数字化服务，促进校园信息流通和文化交流。</p>
        <h2>我们的业务</h2>
        <ul>
          <li>校园APP设计与开发</li>
          <li>学校官方新媒体账号运营</li>
          <li>校内活动宣传策划</li>
          <li>校园文化产品设计</li>
          <li>新媒体技术培训</li>
        </ul>
      </div>
    </div>
  `
};

const Contact = {
  template: `
    <div class="contact-container">
      <h1>联系我们</h1>
      <div class="contact-info">
        <div class="contact-item">
          <h3><i class="el-icon-location"></i> 地址</h3>
          <p>大学路123号 学生活动中心305室</p>
        </div>
        <div class="contact-item">
          <h3><i class="el-icon-phone"></i> 电话</h3>
          <p>0123-4567890</p>
        </div>
        <div class="contact-item">
          <h3><i class="el-icon-message"></i> 邮箱</h3>
          <p>newmedia@example.edu.cn</p>
        </div>
      </div>
      <div class="contact-form">
        <h2>留言反馈</h2>
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input placeholder="请输入您的姓名"></el-input>
          </el-item>
          <el-form-item label="邮箱">
            <el-input placeholder="请输入您的邮箱"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" :rows="4" placeholder="请输入留言内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  `
};

// 路由定义
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/task-creation', 
    component: TaskCreation,
    meta: { requiresAuth: true, requiresPermission: 'task_create' } 
  },
  { 
    path: '/admin', 
    component: Admin,
    meta: { requiresAuth: true, requiresPermission: 'admin' } 
  }
];

// 创建路由实例
const router = VueRouter.createRouter({
  // 使用createWebHashHistory而不是createWebHistory
  history: VueRouter.createWebHashHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = window.store.state.user.isLoggedIn;
  const user = window.store.state.user.currentUser;
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresPermission && user) {
    const requiredPermission = to.meta.requiresPermission;
    
    if (requiredPermission === 'admin' && 
        (user.role === 'admin' || user.role === 'super_admin')) {
      next();
    } else if (requiredPermission === 'task_create' && 
               (user.role === 'admin' || user.role === 'super_admin' || user.role === 'department_head')) {
      next();
    } else {
      next('/dashboard');
    }
  } else {
    next();
  }
});

window.router = router;