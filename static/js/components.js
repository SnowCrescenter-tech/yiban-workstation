export const components = {
  // 宣传主页
  LandingPage: {
    template: `
      <div class="landing-page">
        <!-- 顶部导航栏 -->
        <header class="navbar">
          <div class="container flex justify-between items-center">
            <h1>新媒体中心</h1>
            <nav class="navbar-menu">
              <el-menu mode="horizontal" :router="false">
                <el-menu-item index="1" @click="showAbout = true">工作站介绍</el-menu-item>
                <el-menu-item index="2" @click="showContact = true">联系我们</el-menu-item>
              </el-menu>
            </nav>
          </div>
        </header>
        
        <!-- 登录按钮 -->
        <div class="login-btn">
          <el-button type="primary" @click="$emit('navigate', 'Login')">登录</el-button>
        </div>
        
        <!-- 轮播展示位 -->
        <div class="container">
          <el-carousel :interval="5000" class="carousel">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <div :style="{
                'background-image': 'url(' + item.image + ')',
                'background-size': 'cover',
                'height': '100%',
                'display': 'flex',
                'align-items': 'flex-end'
              }">
                <div style="background-color: rgba(0,0,0,0.5); color: white; padding: 20px; width: 100%;">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
          
          <!-- 动态新闻栏 -->
          <div class="news-section">
            <h2>最新动态</h2>
            <el-divider></el-divider>
            <div class="news-list">
              <el-card v-for="(news, index) in newsItems" :key="index" class="news-card">
                <div class="flex justify-between">
                  <div>
                    <h3>{{ news.title }}</h3>
                    <p>{{ news.summary }}</p>
                  </div>
                  <span>{{ news.date }}</span>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        
        <!-- 工作站介绍对话框 -->
        <el-dialog v-model="showAbout" title="工作站介绍" width="70%">
          <div class="about-content">
            <h3>历史</h3>
            <p>新媒体中心成立于2015年，是校内核心宣传机构，致力于为学校提供全方位的新媒体宣传服务。</p>
            
            <h3>成果</h3>
            <el-row :gutter="20">
              <el-col :span="8" v-for="achievement in achievements" :key="achievement.id">
                <el-card>
                  <img :src="achievement.image" style="width: 100%">
                  <div style="padding: 14px;">
                    <h4>{{ achievement.title }}</h4>
                    <p>{{ achievement.description }}</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            
            <h3>荣誉</h3>
            <el-timeline>
              <el-timeline-item
                v-for="honor in honors"
                :key="honor.id"
                :timestamp="honor.year"
                placement="top"
              >
                {{ honor.title }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-dialog>
        
        <!-- 联系我们对话框 -->
        <el-dialog v-model="showContact" title="联系我们" width="70%">
          <div class="contact-content">
            <el-row :gutter="20">
              <el-col :span="12">
                <h3>联系方式</h3>
                <p><el-icon><Location /></el-icon> 地址：大学城新媒体中心大楼4楼</p>
                <p><el-icon><Phone /></el-icon> 电话：020-12345678</p>
                <p><el-icon><Message /></el-icon> 邮箱：newmedia@example.edu.cn</p>
                
                <h3>关注我们</h3>
                <div class="qrcode-container">
                  <div>
                    <img src="https://via.placeholder.com/150" alt="微信公众号">
                    <p>微信公众号</p>
                  </div>
                  <div>
                    <img src="https://via.placeholder.com/150" alt="抖音账号">
                    <p>抖音账号</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <h3>位置</h3>
                <div style="height: 400px; background-color: #eee;">
                  <!-- 地图组件将在这里加载 -->
                  <div style="text-align: center; line-height: 400px;">地图加载中...</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
      </div>
    `,
    data() {
      return {
        showAbout: false,
        showContact: false,
        carouselItems: [
          {
            image: 'https://via.placeholder.com/1200x500',
            title: '2023校园文化节',
            description: '展示校园文化魅力，弘扬青春正能量'
          },
          {
            image: 'https://via.placeholder.com/1200x500/333',
            title: '新媒体技术培训',
            description: '为校园媒体人提供专业技能培训'
          },
          {
            image: 'https://via.placeholder.com/1200x500/555',
            title: '校园形象宣传片',
            description: '全新视角展示校园风采'
          }
        ],
        newsItems: [
          {
            title: '短视频创作大赛开始报名',
            summary: '以"青春·梦想"为主题的校园短视频创作大赛正式启动',
            date: '2023-10-15'
          },
          {
            title: '媒体融合发展研讨会',
            summary: '探讨新形势下校园媒体发展方向和创新路径',
            date: '2023-10-10'
          },
          {
            title: '新媒体中心招新活动',
            summary: '寻找对新媒体创作感兴趣的同学加入我们的团队',
            date: '2023-09-25'
          }
        ],
        achievements: [
          {
            id: 1,
            image: 'https://via.placeholder.com/300x200',
            title: '校园宣传片《青春之声》',
            description: '荣获全国高校优秀宣传作品一等奖'
          },
          {
            id: 2,
            image: 'https://via.placeholder.com/300x200',
            title: '新媒体平台矩阵',
            description: '构建了覆盖微信、微博、抖音等全平台的宣传体系'
          },
          {
            id: 3,
            image: 'https://via.placeholder.com/300x200',
            title: '校园文化数字展示系统',
            description: '运用AR/VR技术展示校园历史文化'
          }
        ],
        honors: [
          { id: 1, year: '2023', title: '全国高校新媒体创新应用示范单位' },
          { id: 2, year: '2022', title: '省级融媒体优秀建设团队' },
          { id: 3, year: '2021', title: '校园文化建设先进集体' },
          { id: 4, year: '2020', title: '全国高校媒体内容创优工程特等奖' }
        ]
      };
    },
    mounted() {
      // 这里可以加载地图API
      console.log('Landing page mounted');
    }
  },
  
  // 登录页
  Login: {
    template: `
      <div class="login-container">
        <h2 style="text-align: center; margin-bottom: 20px;">用户登录</h2>
        <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          
          <el-form-item label="验证码" prop="captcha">
            <div style="display: flex; gap: 10px;">
              <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
              <div @click="refreshCaptcha" style="width: 100px; height: 40px; background-color: #eee; display: flex; align-items: center; justify-content: center;">
                {{ captchaText }}
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="text" @click="forgotPassword">忘记密码?</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 100%;">登录</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button @click="$emit('navigate', 'LandingPage')" style="width: 100%;">返回主页</el-button>
          </el-form-item>
        </el-form>
      </div>
    `,
    data() {
      return {
        form: {
          username: '',
          password: '',
          captcha: ''
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        },
        captchaText: 'ABCD'
      };
    },
    methods: {
      submitForm() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            if (this.form.captcha.toUpperCase() !== this.captchaText) {
              this.$message.error('验证码错误');
              this.refreshCaptcha();
              return;
            }
            
            this.$emit('login', {
              username: this.form.username,
              password: this.form.password
            });
          }
        });
      },
      refreshCaptcha() {
        // 生成随机4位验证码
        this.captchaText = Math.random().toString(36).substr(2, 4).toUpperCase();
      },
      forgotPassword() {
        this.$message.info('请联系管理员重置密码');
      }
    },
    mounted() {
      this.refreshCaptcha();
    }
  },
  
  // 用户主页/仪表盘
  Dashboard: {
    template: `
      <div>
        <!-- 顶部菜单栏 -->
        <el-menu mode="horizontal" :default-active="activeMenu" @select="handleSelect">
          <el-menu-item index="dashboard">主页</el-menu-item>
          <el-menu-item index="profile">个人信息</el-menu-item>
          <el-menu-item v-if="canPublishTasks" index="task-publish">任务发布</el-menu-item>
          <el-menu-item index="workbench">工作台</el-menu-item>
          <div style="flex-grow: 1;"></div>
          <el-menu-item index="logout">退出登录</el-menu-item>
        </el-menu>
        
        <!-- 主体内容 -->
        <div class="dashboard">
          <!-- 左侧面板 -->
          <div class="side-panel">
            <h3>实时通知</h3>
            <div class="notification-scroller">
              <el-empty v-if="notifications.length === 0" description="暂无通知"></el-empty>
              <el-timeline v-else>
                <el-timeline-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  :timestamp="notification.time"
                  :type="notification.type"
                >
                  {{ notification.content }}
                </el-timeline-item>
              </el-timeline>
            </div>
            
            <h3>待办任务</h3>
            <div class="task-list">
              <el-empty v-if="todoTasks.length === 0" description="暂无待办任务"></el-empty>
              <el-card
                v-for="task in todoTasks"
                :key="task.id"
                :class="['task-card', task.isUrgent ? 'urgent' : '']"
                shadow="hover"
              >
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h4>{{ task.title }}</h4>
                    <p>截止日期: {{ task.deadline }}</p>
                  </div>
                  <el-tag :type="task.isUrgent ? 'danger' : 'primary'">
                    {{ task.isUrgent ? '紧急' : '普通' }}
                  </el-tag>
                </div>
                <div style="margin-top: 10px;">
                  <el-button size="small" @click="viewTaskDetail(task.id)">查看详情</el-button>
                  <el-button size="small" type="primary" @click="updateTask(task.id, '进行中')">开始任务</el-button>
                </div>
              </el-card>
            </div>
          </div>
          
          <!-- 右侧主体 -->
          <div class="main-content">
            <!-- 日程表 -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h2>日程安排</h2>
                <div>
                  <el-radio-group v-model="calendarView" size="small">
                    <el-radio-button label="week">周视图</el-radio-button>
                    <el-radio-button label="month">月视图</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              
              <el-card>
                <div style="height: 300px;">
                  <!-- 日历组件将在这里渲染 -->
                  <div v-if="calendarView === 'week'">
                    <!-- 周视图 -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
                      <div v-for="day in 7" :key="day" style="text-align: center; padding: 10px; background-color: #f5f7fa;">
                        {{ weekdays[day-1] }}
                      </div>
                      <div v-for="day in 7" :key="'content-'+day" style="min-height: 100px; padding: 10px; border: 1px solid #dcdfe6;">
                        <!-- 这里显示当天的任务 -->
                        <el-tag v-for="task in getTasksForDay(day)" :key="task.id" style="margin: 2px;">
                          {{ task.title }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <!-- 月视图 -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
                      <div v-for="day in 7" :key="day" style="text-align: center; padding: 5px; background-color: #f5f7fa;">
                        {{ weekdays[day-1] }}
                      </div>
                      <div v-for="day in 31" :key="'month-'+day" style="height: 60px; padding: 5px; border: 1px solid #dcdfe6; font-size: 12px; overflow: hidden;">
                        <div>{{ day }}</div>
                        <div v-for="task in getTasksForMonthDay(day)" :key="task.id" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                          <el-tag size="small">{{ task.title }}</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
              
              <!-- 甘特图 -->
              <div class="gantt-chart">
                <h2>任务进度</h2>
                <div style="height: 300px; overflow-x: auto;">
                  <!-- 简单甘特图实现 -->
                  <div style="min-width: 800px;">
                    <div style="display: flex; margin-bottom: 10px;">
                      <div style="width: 200px; font-weight: bold;">任务名称</div>
                      <div style="flex-grow: 1; display: flex;">
                        <div v-for="day in 30" :key="day" style="width: 20px; text-align: center; font-size: 12px;">
                          {{ day }}
                        </div>
                      </div>
                    </div>
                    
                    <div v-for="task in allTasks" :key="task.id" style="display: flex; margin-bottom: 5px;">
                      <div style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ task.title }}
                      </div>
                      <div style="flex-grow: 1; position: relative; height: 20px;">
                        <div style="position: absolute; height: 100%; background-color: #409eff;" 
                            :style="{
                              left: (task.start - 1) * 20 + 'px',
                              width: (task.duration * 20) + 'px'
                            }">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 任务详情对话框 -->
        <el-dialog v-model="taskDetailVisible" title="任务详情" width="50%">
          <div v-if="currentTask">
            <h3>{{ currentTask.title }}</h3>
            <el-descriptions border>
              <el-descriptions-item label="类型">{{ currentTask.isUrgent ? '紧急' : '日常' }}</el-descriptions-item>
              <el-descriptions-item label="截止日期">{{ currentTask.deadline }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ currentTask.status }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ currentTask.creator }}</el-descriptions-item>
              <el-descriptions-item label="协作成员">{{ currentTask.members.join(', ') }}</el-descriptions-item>
            </el-descriptions>
            
            <h4 style="margin-top: 20px;">任务描述</h4>
            <div style="background-color: #f5f7fa; padding: 10px; border-radius: 4px;">
              {{ currentTask.description }}
            </div>
            
            <h4 style="margin-top: 20px;">附件</h4>
            <div v-if="currentTask.attachments.length === 0">无附件</div>
            <ul v-else>
              <li v-for="(file, index) in currentTask.attachments" :key="index">
                <a :href="file.url" target="_blank">{{ file.name }}</a>
                ({{ formatFileSize(file.size) }})
              </li>
            </ul>
            
            <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
              <el-button @click="taskDetailVisible = false">关闭</el-button>
              <el-button 
                v-if="currentTask.status === '未开始'"
                type="primary" 
                @click="updateTask(currentTask.id, '进行中')"
              >开始任务</el-button>
              <el-button 
                v-if="currentTask.status === '进行中'" 
                type="success" 
                @click="updateTask(currentTask.id, '待验收')"
              >提交验收</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        activeMenu: 'dashboard',
        calendarView: 'week',
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        notifications: [],
        todoTasks: [],
        allTasks: [],
        taskDetailVisible: false,
        currentTask: null
      };
    },
    computed: {
      canPublishTasks() {
        return this.user && (this.user.role === '超级管理员' || this.user.role === '管理员' || this.user.role === '部门负责人');
      }
    },
    methods: {
      handleSelect(key) {
        if (key === 'logout') {
          this.$emit('logout');
        } else if (key === 'task-publish') {
          this.$emit('navigate', 'TaskPublish');
        } else if (key === 'profile') {
          this.$emit('navigate', 'Profile');
        } else if (key === 'workbench') {
          this.$emit('navigate', 'Workbench');
        }
      },
      
      getTasksForDay(day) {
        return this.allTasks.filter(task => {
          const taskDay = new Date(task.deadline).getDay();
          return taskDay === (day % 7);
        });
      },
      
      getTasksForMonthDay(day) {
        return this.allTasks.filter(task => {
          const taskDate = new Date(task.deadline).getDate();
          return taskDate === day;
        });
      },
      
      viewTaskDetail(taskId) {
        // 查找并显示任务详情
        const task = this.allTasks.find(t => t.id === taskId);
        if (task) {
          this.currentTask = task;
          this.taskDetailVisible = true;
        }
      },
      
      updateTask(taskId, newStatus) {
        this.$emit('updateTaskStatus', taskId, newStatus);
      },
      
      formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
      },
      
      loadDashboardData() {
        // 获取通知
        api.getNotifications().then(res => {
          this.notifications = res.data;
        }).catch(err => {
          console.error('获取通知失败', err);
        });
        
        // 获取待办任务
        api.getTodoTasks().then(res => {
          this.todoTasks = res.data;
        }).catch(err => {
          console.error('获取待办任务失败', err);
        });
        
        // 获取所有任务
        api.getAllTasks().then(res => {
          this.allTasks = res.data;
        }).catch(err => {
          console.error('获取所有任务失败', err);
        });
      }
    },
    mounted() {
      this.loadDashboardData();
    }
  },
  
  // 任务发布组件
  TaskPublish: {
    template: `
      <div>
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="task-form">
          <h2 style="text-align: center; margin: 20px 0;">发布新任务</h2>
          
          <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="100px">
            <el-form-item label="任务标题" prop="title">
              <el-input v-model="taskForm.title" placeholder="请输入任务标题"></el-input>
            </el-form-item>
            
            <el-form-item label="任务类型" prop="type">
              <el-select v-model="taskForm.type" placeholder="请选择任务类型" style="width: 100%;">
                <el-option label="日常" value="daily"></el-option>
                <el-option label="紧急" value="urgent"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker v-model="taskForm.deadline" type="datetime" placeholder="选择日期和时间" style="width: 100%;"></el-date-picker>
            </el-form-item>
            
            <el-form-item label="目标部门" prop="department">
              <el-select v-model="taskForm.department" placeholder="请选择部门" style="width: 100%;">
                <el-option 
                  v-for="dept in departments" 
                  :key="dept.id" 
                  :label="dept.name" 
                  :value="dept.id"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="协作成员" prop="members">
              <el-select 
                v-model="taskForm.members" 
                multiple 
                filterable 
                remote 
                :remote-method="searchMembers" 
                placeholder="请选择成员" 
                style="width: 100%;"
              >
                <el-option 
                  v-for="member in availableMembers" 
                  :key="member.id" 
                  :label="member.name" 
                  :value="member.id"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="任务描述" prop="description">
              <el-input v-model="taskForm.description" type="textarea" rows="4" placeholder="请输入任务描述"></el-input>
            </el-form-item>
            
            <el-form-item label="附件">
              <el-upload
                action="/api/upload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-exceed="handleExceed"
                :file-list="taskForm.attachments"
                :limit="5"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div style="color: #666; font-size: 12px; margin-top: 5px;">
                    支持上传任意类型文件，单个文件不超过50MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitTask" style="width: 100%;">发布任务</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    `,
    data() {
      return {
        taskForm: {
          title: '',
          type: 'daily',
          deadline: '',
          department: '',
          members: [],
          description: '',
          attachments: []
        },
        rules: {
          title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
          type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
          deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
          department: [{ required: true, message: '请选择目标部门', trigger: 'change' }],
          description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }]
        },
        departments: [],
        availableMembers: []
      };
    },
    methods: {
      searchMembers(query) {
        if (query) {
          api.searchMembers(query, this.taskForm.department).then(res => {
            this.availableMembers = res.data;
          });
        }
      },
      
      handleUploadSuccess(response, file, fileList) {
        this.taskForm.attachments = fileList;
        this.$message.success('上传成功');
      },
      
      handleUploadError() {
        this.$message.error('上传失败');
      },
      
      handleExceed() {
        this.$message.warning('最多上传5个文件');
      },
      
      beforeUpload(file) {
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
          this.$message.error('文件大小不能超过50MB!');
          return false;
        }
        return true;
      },
      
      submitTask() {
        this.$refs.taskForm.validate(valid => {
          if (valid) {
            const taskData = {
              ...this.taskForm,
              isUrgent: this.taskForm.type === 'urgent'
            };
            
            // 提交到父组件处理
            this.$emit('createTask', taskData).then(success => {
              if (success) {
                this.$refs.taskForm.resetFields();
                this.taskForm.attachments = [];
                this.$emit('navigate', 'Dashboard');
              }
            });
          }
        });
      },
      
      loadDepartments() {
        api.getDepartments().then(res => {
          this.departments = res.data;
        });
      }
    },
    mounted() {
      this.loadDepartments();
    }
  },
  
  // 个人信息组件
  Profile: {
    template: `
      <div>
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="container" style="max-width: 800px; margin-top: 20px;">
          <el-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>个人信息</span>
                <el-button type="primary" size="small" @click="editMode = true" v-if="!editMode">编辑</el-button>
              </div>
            </template>
            
            <el-form label-width="100px" :model="profileForm" ref="profileForm" :disabled="!editMode">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled></el-input>
              </el-form-item>
              
              <el-form-item label="姓名">
                <el-input v-model="profileForm.name"></el-input>
              </el-form-item>
              
              <el-form-item label="角色">
                <el-input v-model="profileForm.role" disabled></el-input>
              </el-form-item>
              
              <el-form-item label="部门">
                <el-input v-model="profileForm.department" disabled></el-input>
              </el-form-item>
              
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email"></el-input>
              </el-form-item>
              
              <el-form-item label="手机号">
                <el-input v-model="profileForm.phone"></el-input>
              </el-form-item>
              
              <el-form-item label="技能标签">
                <el-select v-model="profileForm.skills" multiple filterable allow-create style="width: 100%;">
                  <el-option v-for="skill in skillOptions" :key="skill" :label="skill" :value="skill"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item v-if="editMode">
                <el-button type="primary" @click="saveProfile">保存</el-button>
                <el-button @click="cancelEdit">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          
          <el-card style="margin-top: 20px;">
            <template #header>
              <div>修改密码</div>
            </template>
            
            <el-form label-width="100px" :model="passwordForm" :rules="passwordRules" ref="passwordForm">
              <el-form-item label="当前密码" prop="currentPassword">
                <el-input v-model="passwordForm.currentPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="changePassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    `,
    props: ['user'],
    data() {
      const validateConfirmPassword = (rule, value, callback) => {
        if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      
      return {
        editMode: false,
        profileForm: {
          username: this.user?.username || '',
          name: this.user?.name || '',
          role: this.user?.role || '',
          department: this.user?.department || '',
          email: this.user?.email || '',
          phone: this.user?.phone || '',
          skills: this.user?.skills || []
        },
        originalProfile: {},
        passwordForm: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        passwordRules: {
          currentPassword: [
            { required: true, message: '请输入当前密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        },
        skillOptions: ['文案策划', '视频剪辑', '图片处理', '直播运营', 'UI设计', '数据分析', '活动策划', '社群运营']
      };
    },
    methods: {
      saveProfile() {
        api.updateProfile(this.profileForm).then(() => {
          this.$message.success('个人信息已更新');
          this.editMode = false;
        }).catch(() => {
          this.$message.error('更新失败');
        });
      },
      
      cancelEdit() {
        this.editMode = false;
        Object.assign(this.profileForm, this.originalProfile);
      },
      
      changePassword() {
        this.$refs.passwordForm.validate(valid => {
          if (valid) {
            api.changePassword(this.passwordForm).then(() => {
              this.$message.success('密码已修改, 请重新登录');
              this.$emit('logout');
            }).catch(error => {
              this.$message.error(`修改失败: ${error.message}`);
            });
          }
        });
      }
    },
    created() {
      // 保存原始数据，用于取消编辑
      this.originalProfile = JSON.parse(JSON.stringify(this.profileForm));
    }
  },
  
  // 工作台组件
  Workbench: {
    template: `
      <div>
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="container" style="margin-top: 20px;">
          <!-- 任务看板 -->
          <h2>我的任务看板</h2>
          <div class="kanban-board">
            <div class="kanban-column">
              <h3>待处理 ({{ pendingTasks.length }})</h3>
              <el-divider></el-divider>
              <el-empty v-if="pendingTasks.length === 0" description="暂无任务"></el-empty>
              <el-card 
                v-for="task in pendingTasks" 
                :key="task.id" 
                :class="['task-card', task.isUrgent ? 'urgent' : '']" 
                shadow="hover"
                @click="viewTaskDetail(task.id)"
              >
                <h4>{{ task.title }}</h4>
                <p>{{ task.description.substring(0, 50) }}{{ task.description.length > 50 ? '...' : '' }}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                  <el-tag size="small" :type="task.isUrgent ? 'danger' : ''">
                    {{ task.isUrgent ? '紧急' : '普通' }}
                  </el-tag>
                  <span style="font-size: 12px;">截止: {{ task.deadline }}</span>
                </div>
              </el-card>
            </div>
            
            <div class="kanban-column">
              <h3>进行中 ({{ inProgressTasks.length }})</h3>
              <el-divider></el-divider>
              <el-empty v-if="inProgressTasks.length === 0" description="暂无任务"></el-empty>
              <el-card 
                v-for="task in inProgressTasks" 
                :key="task.id" 
                :class="['task-card', task.isUrgent ? 'urgent' : '']" 
                shadow="hover"
                @click="viewTaskDetail(task.id)"
              >
                <h4>{{ task.title }}</h4>
                <p>{{ task.description.substring(0, 50) }}{{ task.description.length > 50 ? '...' : '' }}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                  <el-tag size="small" :type="task.isUrgent ? 'danger' : ''">
                    {{ task.isUrgent ? '紧急' : '普通' }}
                  </el-tag>
                  <span style="font-size: 12px;">截止: {{ task.deadline }}</span>
                </div>
                <div style="margin-top: 10px; text-align: right;">
                  <el-button size="small" type="primary" @click.stop="updateTaskStatus(task.id, '待验收')">
                    提交验收
                  </el-button>
                </div>
              </el-card>
            </div>
            
            <div class="kanban-column">
              <h3>待验收 ({{ pendingVerificationTasks.length }})</h3>
              <el-divider></el-divider>
              <el-empty v-if="pendingVerificationTasks.length === 0" description="暂无任务"></el-empty>
              <el-card 
                v-for="task in pendingVerificationTasks" 
                :key="task.id" 
                :class="['task-card', task.isUrgent ? 'urgent' : '']" 
                shadow="hover"
                @click="viewTaskDetail(task.id)"
              >
                <h4>{{ task.title }}</h4>
                <p>{{ task.description.substring(0, 50) }}{{ task.description.length > 50 ? '...' : '' }}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                  <span style="font-size: 12px;">提交于: {{ task.submittedAt }}</span>
                  <span style="font-size: 12px;">截止: {{ task.deadline }}</span>
                </div>
              </el-card>
            </div>
            
            <div class="kanban-column">
              <h3>已完成 ({{ completedTasks.length }})</h3>
              <el-divider></el-divider>
              <el-empty v-if="completedTasks.length === 0" description="暂无任务"></el-empty>
              <el-card 
                v-for="task in completedTasks" 
                :key="task.id" 
                :class="['task-card']" 
                shadow="hover"
                @click="viewTaskDetail(task.id)"
              >
                <h4>{{ task.title }}</h4>
                <p>{{ task.description.substring(0, 50) }}{{ task.description.length > 50 ? '...' : '' }}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                  <span style="font-size: 12px;">完成于: {{ task.completedAt }}</span>
                  <el-tag size="small" type="success">按时完成</el-tag>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        
        <!-- 任务详情对话框 -->
        <el-dialog v-model="taskDetailVisible" title="任务详情" width="50%">
          <div v-if="currentTask">
            <el-descriptions border>
              <el-descriptions-item label="标题">{{ currentTask.title }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ currentTask.isUrgent ? '紧急' : '日常' }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ currentTask.status }}</el-descriptions-item>
              <el-descriptions-item label="截止日期">{{ currentTask.deadline }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ currentTask.creator }}</el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentTask.department }}</el-descriptions-item>
            </el-descriptions>
            
            <h4 style="margin-top: 20px;">任务描述</h4>
            <div style="background-color: #f5f7fa; padding: 10px; border-radius: 4px;">
              {{ currentTask.description }}
            </div>
            
            <h4 style="margin-top: 20px;">协作成员</h4>
            <div>
              <el-tag 
                v-for="member in currentTask.members" 
                :key="member.id" 
                style="margin-right: 5px;"
              >
                {{ member.name }}
              </el-tag>
            </div>
            
            <h4 style="margin-top: 20px;">附件</h4>
            <div v-if="currentTask.attachments.length === 0">无附件</div>
            <el-table v-else :data="currentTask.attachments" style="width: 100%">
              <el-table-column prop="name" label="文件名"></el-table-column>
              <el-table-column prop="size" label="大小" width="120">
                <template #default="scope">{{ formatFileSize(scope.row.size) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" size="small" link @click="downloadFile(scope.row)">
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div style="margin-top: 20px; text-align: right;">
              <el-button @click="taskDetailVisible = false">关闭</el-button>
              <el-button 
                v-if="currentTask.status === '未开始'" 
                type="primary" 
                @click="updateTaskStatus(currentTask.id, '进行中')"
              >开始任务</el-button>
              <el-button 
                v-if="currentTask.status === '进行中'" 
                type="primary" 
                @click="updateTaskStatus(currentTask.id, '待验收')"
              >提交验收</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    `,
    data() {
      return {
        tasks: [],
        taskDetailVisible: false,
        currentTask: null
      };
    },
    computed: {
      pendingTasks() {
        return this.tasks.filter(task => task.status === '未开始');
      },
      inProgressTasks() {
        return this.tasks.filter(task => task.status === '进行中');
      },
      pendingVerificationTasks() {
        return this.tasks.filter(task => task.status === '待验收');
      },
      completedTasks() {
        return this.tasks.filter(task => task.status === '已完成');
      }
    },
    methods: {
      viewTaskDetail(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          this.currentTask = task;
          this.taskDetailVisible = true;
        }
      },
      
      updateTaskStatus(taskId, newStatus) {
        this.$emit('updateTaskStatus', taskId, newStatus);
        this.loadTasks();
        this.taskDetailVisible = false;
      },
      
      formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
      },
      
      downloadFile(file) {
        window.open(file.url, '_blank');
      },
      
      loadTasks() {
        api.getUserTasks().then(response => {
          this.tasks = response.data;
        });
      }
    },
    mounted() {
      this.loadTasks();
    }
  }
};