import { checkBrowserState, clearLoginState, printLoginInfo } from './login-helper.js';
import { checkPerformance } from './utils-performance.js';
import { api } from './api.js';

/**
 * 调试组件
 * 仅用于开发环境调试
 */

export const DebugComponents = {
  // 错误页面
  ErrorPage: {
    template: `
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 72px; color: #f56c6c; margin-bottom: 20px;">{{ code || 404 }}</div>
        <h2>{{ title || '页面未找到' }}</h2>
        <p style="color: #606266; margin: 20px 0;">{{ message || '您访问的页面不存在或已被移除' }}</p>
        <el-button type="primary" @click="$emit('navigate', 'Dashboard')">返回仪表盘</el-button>
      </div>
    `,
    props: {
      code: Number,
      title: String,
      message: String
    }
  },
  
  // 开发中组件
  UnderDevelopment: {
    template: `
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 100px; margin-bottom: 30px;">🚧</div>
        <h2>功能开发中</h2>
        <p style="color: #606266; margin: 20px 0; max-width: 500px; margin: 20px auto;">
          该功能正在积极开发中，即将推出，请耐心等待。
        </p>
        <el-button type="primary" @click="$emit('navigate', returnPath)">{{ returnText }}</el-button>
      </div>
    `,
    props: {
      returnPath: {
        type: String,
        default: 'Dashboard'
      },
      returnText: {
        type: String,
        default: '返回仪表盘'
      }
    }
  },
  
  // 调试信息组件
  DebugInfo: {
    template: `
      <div class="debug-info" v-if="enabled">
        <div class="debug-panel">
          <div class="debug-header">
            <h3>调试信息</h3>
            <button @click="toggleCollapsed" class="toggle-button">{{ collapsed ? '展开' : '折叠' }}</button>
          </div>
          <div class="debug-content" v-if="!collapsed">
            <div><strong>当前组件:</strong> {{ currentView }}</div>
            <div><strong>用户角色:</strong> {{ user?.role || '未登录' }}</div>
            <div><strong>开发模式:</strong> {{ isDev ? '是' : '否' }}</div>
            <div><strong>浏览器:</strong> {{ browserInfo }}</div>
            <button @click="enabled = false" class="close-button">关闭</button>
          </div>
        </div>
      </div>
    `,
    props: ['user', 'currentView'],
    data() {
      return {
        enabled: true,
        collapsed: false,
        isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        browserInfo: navigator.userAgent
      };
    },
    methods: {
      toggleCollapsed() {
        this.collapsed = !this.collapsed;
      }
    }
  },
  Debug: {
    template: `
      <div class="debug-page">
        <h1>系统调试页面</h1>
        <p class="warning">此页面仅用于开发环境调试，生产环境请禁用</p>

        <el-tabs type="border-card">
          <!-- 登录调试 -->
          <el-tab-pane label="登录调试">
            <h2>登录状态</h2>
            <el-button @click="printLoginInfo" type="primary">查看当前登录信息</el-button>
            <el-button @click="clearLoginState" type="danger">清除登录状态</el-button>
            
            <h3>快速登录</h3>
            <el-button-group>
              <el-button @click="loginAs('admin')" type="success">管理员登录</el-button>
              <el-button @click="loginAs('manager1')" type="info">部门负责人登录</el-button>
              <el-button @click="loginAs('user1')" type="warning">普通用户登录</el-button>
            </el-button-group>
            
            <h3>浏览器存储状态</h3>
            <pre v-if="browserState">{{ JSON.stringify(browserState, null, 2) }}</pre>
          </el-tab-pane>
          
          <!-- 性能监控 -->
          <el-tab-pane label="性能监控">
            <h2>页面性能指标</h2>
            <el-button @click="checkPagePerformance" type="primary">执行性能检查</el-button>
            
            <el-table v-if="performanceData" :data="performanceMetrics" style="width: 100%; margin-top: 20px;">
              <el-table-column prop="name" label="指标" width="180"></el-table-column>
              <el-table-column prop="value" label="值"></el-table-column>
            </el-table>
            
            <h3 v-if="performanceData && performanceData.suggestions.length">优化建议</h3>
            <ul v-if="performanceData && performanceData.suggestions.length">
              <li v-for="(suggestion, index) in performanceData.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </el-tab-pane>
          
          <!-- 系统信息 -->
          <el-tab-pane label="系统信息">
            <h2>浏览器与系统信息</h2>
            <el-descriptions border>
              <el-descriptions-item label="浏览器">{{ browserInfo.name }} {{ browserInfo.version }}</el-descriptions-item>
              <el-descriptions-item label="操作系统">{{ browserInfo.os }}</el-descriptions-item>
              <el-descriptions-item label="设备类型">{{ browserInfo.device }}</el-descriptions-item>
              <el-descriptions-item label="窗口大小">{{ windowSize.width }} x {{ windowSize.height }}</el-descriptions-item>
              <el-descriptions-item label="UserAgent">{{ navigator.userAgent }}</el-descriptions-item>
            </el-descriptions>
            
            <h3>网络状态</h3>
            <el-descriptions border v-if="networkInfo">
              <el-descriptions-item label="在线状态">{{ networkInfo.online ? '在线' : '离线' }}</el-descriptions-item>
              <el-descriptions-item label="连接类型" v-if="networkInfo.connection">{{ networkInfo.connection.effectiveType }}</el-descriptions-item>
              <el-descriptions-item label="下载速度" v-if="networkInfo.connection">{{ networkInfo.connection.downlink }} Mbps</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <!-- API测试 -->
          <el-tab-pane label="API测试">
            <h2>API测试</h2>
            <el-form :inline="true">
              <el-form-item label="API路径">
                <el-select v-model="apiTest.endpoint">
                  <el-option v-for="(url, name) in apiEndpoints" :key="name" :label="name" :value="url"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="方法">
                <el-select v-model="apiTest.method">
                  <el-option label="GET" value="get"></el-option>
                  <el-option label="POST" value="post"></el-option>
                  <el-option label="PUT" value="put"></el-option>
                  <el-option label="DELETE" value="delete"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            
            <div v-if="apiTest.method !== 'get'">
              <h3>请求体</h3>
              <el-input
                type="textarea"
                v-model="apiTest.requestBody"
                :rows="5"
                placeholder="输入JSON请求体"
              ></el-input>
            </div>
            
            <div style="margin-top: 20px;">
              <el-button @click="testApi" type="primary" :loading="apiTest.loading">发送请求</el-button>
            </div>
            
            <div v-if="apiTest.response">
              <h3>响应</h3>
              <pre>{{ JSON.stringify(apiTest.response, null, 2) }}</pre>
            </div>
            
            <div v-if="apiTest.error">
              <h3>错误</h3>
              <pre style="color: red;">{{ apiTest.error }}</pre>
            </div>
          </el-tab-pane>
          
          <!-- 错误日志 -->
          <el-tab-pane label="错误日志">
            <h2>错误日志</h2>
            <el-button @click="clearErrorLogs" type="danger">清除日志</el-button>
            
            <el-empty v-if="errorLogs.length === 0" description="暂无错误日志"></el-empty>
            
            <div v-for="(log, index) in errorLogs" :key="index" class="error-log-item">
              <h3>{{ log.message }}</h3>
              <p>{{ new Date(log.timestamp).toLocaleString() }}</p>
              <pre>{{ log.details }}</pre>
            </div>
          </el-tab-pane>
          
          <!-- 模拟数据 -->
          <el-tab-pane label="模拟数据">
            <h2>模拟数据生成</h2>
            
            <div class="mock-data-section">
              <h3>用户</h3>
              <el-form :inline="true">
                <el-form-item label="数量">
                  <el-input-number v-model="mockData.users.count" :min="1" :max="50"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-button @click="generateMockData('users')" type="primary">生成</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="mock-data-section">
              <h3>任务</h3>
              <el-form :inline="true">
                <el-form-item label="数量">
                  <el-input-number v-model="mockData.tasks.count" :min="1" :max="50"></el-input-number>
                </el-item>
                <el-form-item>
                  <el-button @click="generateMockData('tasks')" type="primary">生成</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div v-if="mockData.generated">
              <h3>生成的数据</h3>
              <pre>{{ JSON.stringify(mockData.generated, null, 2) }}</pre>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    `,
    data() {
      return {
        browserState: null,
        performanceData: null,
        browserInfo: {
          name: this.getBrowserName(),
          version: this.getBrowserVersion(),
          os: this.getOS(),
          device: this.getDeviceType()
        },
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        networkInfo: {
          online: navigator.onLine,
          connection: navigator.connection || null
        },
        apiTest: {
          endpoint: '',
          method: 'get',
          requestBody: '',
          response: null,
          error: null,
          loading: false
        },
        apiEndpoints: {
          '当前用户': '/api/user',
          '任务列表': '/api/tasks',
          '通知': '/api/notifications',
          '部门列表': '/api/departments'
        },
        errorLogs: this.getErrorLogs(),
        mockData: {
          users: { count: 5 },
          tasks: { count: 10 },
          generated: null
        }
      };
    },
    computed: {
      performanceMetrics() {
        if (!this.performanceData) return [];
        
        return [
          { name: '总加载时间', value: this.performanceData.pageLoadTime + ' ms' },
          { name: 'DOM准备时间', value: this.performanceData.domReadyTime + ' ms' },
          { name: '网络延迟', value: this.performanceData.networkLatency + ' ms' },
          { name: '处理时间', value: this.performanceData.processingTime + ' ms' }
        ];
      }
    },
    methods: {
      // 登录相关
      printLoginInfo() {
        printLoginInfo();
        this.browserState = checkBrowserState();
      },
      
      clearLoginState() {
        const cleared = clearLoginState();
        if (cleared) {
          this.$message.success('已清除登录状态');
          this.browserState = checkBrowserState();
        } else {
          this.$message.error('清除登录状态失败');
        }
      },
      
      loginAs(username) {
        let password = '';
        if (username === 'admin') {
          password = 'admin123';
        } else {
          password = '123456';
        }
        
        api.login({ username, password })
          .then(response => {
            localStorage.setItem('token', response.token);
            this.$message.success(`已以 ${username} 身份登录`);
            this.browserState = checkBrowserState();
          })
          .catch(error => {
            this.$message.error(`登录失败: ${error.message}`);
          });
      },
      
      // 性能相关
      checkPagePerformance() {
        this.performanceData = checkPerformance();
      },
      
      // 浏览器信息
      getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
        return '未知';
      },
      
      getBrowserVersion() {
        const ua = navigator.userAgent;
        let match;
        if (ua.includes('Edge') || ua.includes('Edg')) {
          match = ua.match(/(Edge|Edg)\/(\d+\.\d+)/);
        } else if (ua.includes('Chrome')) {
          match = ua.match(/Chrome\/(\d+\.\d+)/);
        } else if (ua.includes('Safari')) {
          match = ua.match(/Safari\/(\d+\.\d+)/);
        } else if (ua.includes('Firefox')) {
          match = ua.match(/Firefox\/(\d+\.\d+)/);
        } else if (ua.includes('MSIE')) {
          match = ua.match(/MSIE (\d+\.\d+)/);
        } else if (ua.includes('Trident/')) {
          match = ua.match(/rv:(\d+\.\d+)/);
        }
        
        return match ? match[1] : '未知';
      },
      
      getOS() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
        return '未知';
      },
      
      getDeviceType() {
        const ua = navigator.userAgent;
        if (ua.includes('Mobile')) return '移动设备';
        if (ua.includes('Tablet')) return '平板设备';
        return '桌面设备';
      },
      
      // API测试
      async testApi() {
        this.apiTest.loading = true;
        this.apiTest.response = null;
        this.apiTest.error = null;
        
        try {
          let requestBody = null;
          if (this.apiTest.method !== 'get' && this.apiTest.requestBody) {
            try {
              requestBody = JSON.parse(this.apiTest.requestBody);
            } catch (e) {
              this.apiTest.error = '请求体JSON格式错误';
              this.apiTest.loading = false;
              return;
            }
          }
          
          const response = await axios({
            method: this.apiTest.method,
            url: this.apiTest.endpoint,
            data: requestBody,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          this.apiTest.response = response.data;
        } catch (error) {
          this.apiTest.error = error.response ? 
            `${error.response.status} ${error.response.statusText}: ${JSON.stringify(error.response.data)}` : 
            error.message;
        } finally {
          this.apiTest.loading = false;
        }
      },
      
      // 错误日志
      getErrorLogs() {
        const logs = localStorage.getItem('errorLogs');
        return logs ? JSON.parse(logs) : [];
      },
      
      clearErrorLogs() {
        localStorage.removeItem('errorLogs');
        this.errorLogs = [];
        this.$message.success('已清除错误日志');
      },
      
      // 模拟数据生成
      generateMockData(type) {
        switch (type) {
          case 'users':
            this.mockData.generated = this.generateMockUsers(this.mockData.users.count);
            break;
          case 'tasks':
            this.mockData.generated = this.generateMockTasks(this.mockData.tasks.count);
            break;
        }
      },
      
      generateMockUsers(count) {
        const roles = ['普通成员', '部门负责人', '管理员'];
        const departments = ['信息中心', '视频制作部', '新闻采编部', '设计创意部', '宣传运营部'];
        const skills = [
          '文案策划', '视频剪辑', '图片处理', '直播运营', 'UI设计', 
          '数据分析', '活动策划', '社群运营', '新闻采编', '摄影'
        ];
        
        const users = [];
        
        for (let i = 0; i < count; i++) {
          const id = 1000 + i;
          const role = roles[Math.floor(Math.random() * roles.length)];
          const department = departments[Math.floor(Math.random() * departments.length)];
          
          // 随机选择2-4个技能
          const userSkills = [];
          const skillCount = Math.floor(Math.random() * 3) + 2;
          for (let j = 0; j < skillCount; j++) {
            const skill = skills[Math.floor(Math.random() * skills.length)];
            if (!userSkills.includes(skill)) userSkills.push(skill);
          }
          
          users.push({
            id,
            username: `user${id}`,
            name: `用户${id}`,
            role,
            department,
            email: `user${id}@example.com`,
            phone: `1380000${String(id).padStart(4, '0')}`,
            skills: userSkills
          });
        }
        
        return users;
      },
      
      generateMockTasks(count) {
        const statuses = ['未开始', '进行中', '待验收', '已完成'];
        const departments = ['信息中心', '视频制作部', '新闻采编部', '设计创意部', '宣传运营部'];
        
        const tasks = [];
        
        for (let i = 0; i < count; i++) {
          const id = 1000 + i;
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const department = departments[Math.floor(Math.random() * departments.length)];
          const isUrgent = Math.random() > 0.7;
          
          const now = new Date();
          const deadlineDays = Math.floor(Math.random() * 30) + 1;
          const deadline = new Date(now);
          deadline.setDate(deadline.getDate() + deadlineDays);
          
          tasks.push({
            id,
            title: `测试任务${id}`,
            description: `这是一个自动生成的测试任务，用于演示功能。任务ID: ${id}`,
            status,
            isUrgent,
            deadline: deadline.toLocaleString(),
            creator: '系统',
            department,
            members: [
              { id: 1, name: '系统管理员' },
              { id: Math.floor(Math.random() * 10) + 2, name: `成员${Math.floor(Math.random() * 10) + 2}` }
            ],
            attachments: []
          });
        }
        
        return tasks;
      }
    },
    mounted() {
      // 初始化时获取浏览器状态
      this.browserState = checkBrowserState();
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        this.windowSize = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      });
      
      // 监听网络状态变化
      window.addEventListener('online', () => {
        this.networkInfo.online = true;
        this.$message.success('网络恢复连接');
      });
      
      window.addEventListener('offline', () => {
        this.networkInfo.online = false;
        this.$message.error('网络连接已断开');
      });
    },
    
    // 组件销毁时取消事件监听
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }
};