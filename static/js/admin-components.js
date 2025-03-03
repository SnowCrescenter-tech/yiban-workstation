/**
 * 管理员专用组件
 * 提供管理员特有功能，包括用户管理、数据统计等
 */

export const AdminComponents = {
  // 管理员仪表盘
  AdminDashboard: {
    template: `
      <div class="admin-dashboard-container">
        <h2 class="panel-title">管理员控制台</h2>
        
        <!-- 数据概览卡片 -->
        <div class="stat-cards">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-content">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-desc">{{ stat.description }}</div>
            </div>
          </div>
        </div>
        
        <!-- 图表面板 -->
        <div class="chart-panels">
          <div class="chart-panel">
            <div class="chart-header">
              <h3>任务完成情况</h3>
              <el-select v-model="taskChartPeriod" size="small" placeholder="选择时间范围">
                <el-option label="今日" value="today"></el-option>
                <el-option label="本周" value="week"></el-option>
                <el-option label="本月" value="month"></el-option>
                <el-option label="全年" value="year"></el-option>
              </el-select>
            </div>
            <div class="chart-body" id="task-chart" style="height: 300px;"></div>
          </div>
          
          <div class="chart-panel">
            <div class="chart-header">
              <h3>部门活跃度</h3>
              <el-select v-model="deptChartType" size="small" placeholder="选择图表类型">
                <el-option label="饼图" value="pie"></el-option>
                <el-option label="柱状图" value="bar"></el-option>
              </el-select>
            </div>
            <div class="chart-body" id="dept-chart" style="height: 300px;"></div>
          </div>
        </div>
        
        <!-- 最新系统日志 -->
        <div class="log-panel">
          <div class="panel-header">
            <h3>系统日志</h3>
            <el-button size="small" type="primary" @click="refreshLogs">刷新</el-button>
          </div>
          <el-table :data="systemLogs" stripe style="width: 100%" size="small">
            <el-table-column prop="time" label="时间" width="180"></el-table-column>
            <el-table-column prop="user" label="用户" width="120"></el-table-column>
            <el-table-column prop="action" label="操作"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                  {{ scope.row.status === 'success' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination 
              background 
              layout="prev, pager, next" 
              :total="logTotal" 
              :page-size="10"
              @current-change="handleLogPageChange"
            ></el-pagination>
          </div>
        </div>
        
        <!-- 快捷操作 -->
        <div class="quick-actions">
          <h3>快捷操作</h3>
          <div class="action-buttons">
            <el-button type="primary" @click="$emit('navigate', 'UserManagement')">用户管理</el-button>
            <el-button type="success" @click="$emit('navigate', 'TaskManagement')">任务管理</el-button>
            <el-button type="warning" @click="$emit('navigate', 'SystemSettings')">系统设置</el-button>
            <el-button type="info" @click="$emit('navigate', 'DataBackup')">数据备份</el-button>
          </div>
        </div>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        stats: [
          { 
            title: '总用户数', 
            value: '128', 
            description: '较上月增长 12%', 
            icon: 'el-icon-user-solid',
            color: 'rgba(64, 158, 255, 0.2)'
          },
          { 
            title: '活跃任务', 
            value: '25', 
            description: '本周新增 5 个',
            icon: 'el-icon-s-order',
            color: 'rgba(103, 194, 58, 0.2)'
          },
          { 
            title: '完成率', 
            value: '86%', 
            description: '较上月提高 6%',
            icon: 'el-icon-s-data',
            color: 'rgba(230, 162, 60, 0.2)'
          },
          { 
            title: '系统消息', 
            value: '12', 
            description: '有 3 条未读消息',
            icon: 'el-icon-message',
            color: 'rgba(245, 108, 108, 0.2)'
          }
        ],
        taskChartPeriod: 'week',
        deptChartType: 'pie',
        systemLogs: [
          { time: '2023-10-20 09:33:21', user: 'admin', action: '登录系统', status: 'success', ip: '192.168.1.100' },
          { time: '2023-10-20 10:12:45', user: 'manager1', action: '创建新任务', status: 'success', ip: '192.168.1.101' },
          { time: '2023-10-20 11:05:18', user: 'user2', action: '上传文件', status: 'success', ip: '192.168.1.102' },
          { time: '2023-10-20 13:22:36', user: 'user5', action: '更新任务状态', status: 'success', ip: '192.168.1.105' },
          { time: '2023-10-20 14:48:12', user: 'manager2', action: '导出数据报表', status: 'success', ip: '192.168.1.110' },
          { time: '2023-10-20 15:30:05', user: 'unknown', action: '尝试登录', status: 'failed', ip: '192.168.1.120' },
          { time: '2023-10-20 16:15:27', user: 'admin', action: '创建新用户', status: 'success', ip: '192.168.1.100' },
          { time: '2023-10-20 17:02:33', user: 'user3', action: '提交任务', status: 'success', ip: '192.168.1.103' },
          { time: '2023-10-20 17:45:19', user: 'user7', action: '密码修改', status: 'success', ip: '192.168.1.107' },
          { time: '2023-10-20 18:01:52', user: 'manager1', action: '系统设置修改', status: 'success', ip: '192.168.1.101' },
        ],
        logTotal: 100
      };
    },
    methods: {
      refreshLogs() {
        this.$message.success('日志已刷新');
        // 在真实环境中，这里会调用API获取最新日志
      },
      handleLogPageChange(page) {
        console.log(`加载第 ${page} 页的日志`);
        // 在真实环境中，这里会调用API获取对应页的日志
      },
      initCharts() {
        // 模拟初始化图表，实际应用中应使用图表库如ECharts
        this.renderTaskChart();
        this.renderDepartmentChart();
      },
      renderTaskChart() {
        if (typeof echarts !== 'undefined') {
          const chartDom = document.getElementById('task-chart');
          if (!chartDom) return;
          
          const myChart = echarts.init(chartDom);
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['未开始', '进行中', '待验收', '已完成']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '未开始',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [2, 1, 3, 0, 2, 0, 1]
              },
              {
                name: '进行中',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [3, 4, 2, 5, 1, 2, 1]
              },
              {
                name: '待验收',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [1, 2, 1, 3, 2, 1, 0]
              },
              {
                name: '已完成',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                  focus: 'series'
                },
                data: [5, 3, 4, 2, 3, 5, 2]
              }
            ]
          };
          
          myChart.setOption(option);
        } else {
          console.warn('ECharts 库未加载');
          // 降级处理 - 显示简单表格或文本描述
          const chartDom = document.getElementById('task-chart');
          if (chartDom) {
            chartDom.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%;">图表库未加载，请检查网络连接</div>';
          }
        }
      },
      renderDepartmentChart() {
        if (typeof echarts !== 'undefined') {
          const chartDom = document.getElementById('dept-chart');
          if (!chartDom) return;
          
          const myChart = echarts.init(chartDom);
          
          if (this.deptChartType === 'pie') {
            const option = {
              tooltip: {
                trigger: 'item'
              },
              legend: {
                orient: 'horizontal',
                bottom: 'bottom'
              },
              series: [
                {
                  name: '部门活跃度',
                  type: 'pie',
                  radius: '70%',
                  data: [
                    { value: 35, name: '信息中心' },
                    { value: 28, name: '视频制作部' },
                    { value: 22, name: '新闻采编部' },
                    { value: 18, name: '设计创意部' },
                    { value: 15, name: '宣传运营部' }
                  ],
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            myChart.setOption(option);
          } else {
            // 柱状图
            const option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: ['信息中心', '视频制作部', '新闻采编部', '设计创意部', '宣传运营部']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '任务数量',
                  type: 'bar',
                  data: [35, 28, 22, 18, 15],
                  itemStyle: {
                    color: function(params) {
                      // 为不同部门设置不同颜色
                      const colorList = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                }
              ]
            };
            myChart.setOption(option);
          }
        } else {
          console.warn('ECharts 库未加载');
          // 降级处理
          const chartDom = document.getElementById('dept-chart');
          if (chartDom) {
            chartDom.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%;">图表库未加载，请检查网络连接</div>';
          }
        }
      }
    },
    watch: {
      // 当切换图表类型时，重新渲染部门图表
      deptChartType() {
        this.$nextTick(() => {
          this.renderDepartmentChart();
        });
      },
      // 当切换时间范围时，重新渲染任务图表
      taskChartPeriod() {
        this.$nextTick(() => {
          this.renderTaskChart();
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initCharts();
      });
    }
  },
  
  // 用户管理组件
  UserManagement: {
    template: `
      <div class="user-management">
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="content-wrapper">
          <div class="header-actions">
            <h2>用户管理</h2>
            <div class="action-buttons">
              <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
              <el-button type="success" @click="showImportDialog">批量导入</el-button>
              <el-button type="warning" @click="exportUsers">导出用户</el-button>
            </div>
          </div>
          
          <!-- 搜索过滤区域 -->
          <div class="filter-section">
            <el-form :inline="true" :model="filterForm">
              <el-form-item label="关键词">
                <el-input v-model="filterForm.keyword" placeholder="姓名/用户名/邮箱" clearable></el-input>
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="filterForm.role" placeholder="选择角色" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="部门负责人" value="部门负责人"></el-option>
                  <el-option label="普通成员" value="普通成员"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门">
                <el-select v-model="filterForm.department" placeholder="选择部门" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option 
                    v-for="dept in departments" 
                    :key="dept.id" 
                    :label="dept.name" 
                    :value="dept.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchUsers">搜索</el-button>
                <el-button @click="resetFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 用户数据表格 -->
          <div class="table-section">
            <el-table 
              :data="users" 
              border 
              style="width: 100%" 
              v-loading="loading"
              :default-sort="{ prop: 'id', order: 'ascending' }"
            >
              <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
              <el-table-column prop="username" label="用户名" width="120"></el-table-column>
              <el-table-column prop="name" label="姓名" width="100"></el-table-column>
              <el-table-column prop="role" label="角色" width="120">
                <template #default="scope">
                  <el-tag 
                    :type="getRoleTagType(scope.row.role)"
                    effect="plain"
                  >{{ scope.row.role }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="department" label="部门" width="120"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="phone" label="电话" width="150"></el-table-column>
              <el-table-column prop="lastLogin" label="最后登录" width="180" sortable></el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="editUser(scope.row)"
                    :disabled="scope.row.username === 'admin' && currentUser.username !== 'admin'"
                  >编辑</el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="confirmDelete(scope.row)"
                    :disabled="scope.row.username === 'admin'"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-wrapper">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
        
        <!-- 添加/编辑用户对话框 -->
        <el-dialog 
          v-model="userFormVisible" 
          :title="isEditMode ? '编辑用户' : '添加用户'" 
          width="500px"
        >
          <el-form 
            :model="userForm" 
            :rules="userFormRules" 
            ref="userFormRef" 
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" :disabled="isEditMode"></el-input>
            </el-form-item>
            <el-form-item :label="isEditMode ? '新密码' : '密码'" prop="password">
              <el-input v-model="userForm.password" type="password" show-password></el-input>
              <div v-if="isEditMode" style="font-size: 12px; color: #909399; margin-top: 5px;">
                留空表示不修改密码
              </div>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="userForm.role" style="width: 100%">
                <el-option
                  v-for="role in availableRoles"
                  :key="role"
                  :label="role"
                  :value="role"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-select v-model="userForm.department" style="width: 100%">
                <el-option
                  v-for="dept in departments"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="userForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="技能标签" prop="skills">
              <el-select
                v-model="userForm.skills"
                multiple
                filterable
                allow-create
                style="width: 100%"
              >
                <el-option
                  v-for="skill in availableSkills"
                  :key="skill"
                  :label="skill"
                  :value="skill"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="userFormVisible = false">取消</el-button>
              <el-button type="primary" @click="submitUserForm" :loading="submitting">
                {{ isEditMode ? '更新' : '创建' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 批量导入对话框 -->
        <el-dialog v-model="importDialogVisible" title="批量导入用户" width="600px">
          <div class="import-container">
            <div class="import-steps">
              <p>1. 下载用户导入模板</p>
              <p>2. 填写用户信息</p>
              <p>3. 上传Excel文件</p>
            </div>
            
            <div class="template-download">
              <el-button type="primary" @click="downloadTemplate">
                <el-icon><Download /></el-icon> 下载模板
              </el-button>
            </div>
            
            <el-upload
              class="upload-excel"
              drag
              action="/api/users/import"
              :headers="uploadHeaders"
              :on-success="handleImportSuccess"
              :on-error="handleImportError"
              :before-upload="beforeImport"
              accept=".xlsx, .xls"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传 Excel 文件，且不超过5MB
                </div>
              </template>
            </el-upload>
            
            <div v-if="importResult" class="import-result">
              <h4>导入结果</h4>
              <p>成功: {{ importResult.success }} 条数据</p>
              <p>失败: {{ importResult.failed }} 条数据</p>
              <div v-if="importResult.failed > 0">
                <el-collapse>
                  <el-collapse-item title="查看失败详情" name="1">
                    <ul class="error-list">
                      <li v-for="(error, index) in importResult.errors" :key="index">
                        {{ error }}
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        currentUser: this.user,
        users: [],
        departments: [],
        loading: false,
        submitting: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        filterForm: {
          keyword: '',
          role: '',
          department: ''
        },
        userFormVisible: false,
        isEditMode: false,
        userForm: {
          username: '',
          password: '',
          name: '',
          role: '普通成员',
          department: '',
          email: '',
          phone: '',
          skills: []
        },
        userFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            { required: function(form) { return !this.isEditMode }, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不少于 6 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          department: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          email: [
            { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
          ]
        },
        availableRoles: ['普通成员', '部门负责人', '管理员'],
        availableSkills: [
          '文案策划', '视频剪辑', '图片处理', '直播运营', 'UI设计', '数据分析', 
          '活动策划', '社群运营', '新闻采编', '摄影', '编程开发', '内容审核'
        ],
        importDialogVisible: false,
        importResult: null,
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
    },
    computed: {
      // 超级管理员可以添加管理员和超级管理员角色
      isSuperAdmin() {
        return this.currentUser && this.currentUser.role === '超级管理员';
      }
    },
    watch: {
      isSuperAdmin: {
        immediate: true,
        handler(val) {
          if (val) {
            this.availableRoles = ['普通成员', '部门负责人', '管理员', '超级管理员'];
          } else {
            this.availableRoles = ['普通成员', '部门负责人', '管理员'];
          }
        }
      }
    },
    methods: {
      // 加载用户列表
      loadUsers() {
        this.loading = true;
        
        // 模拟API调用
        setTimeout(() => {
          // 这里应该是实际的API调用
          // api.getUsers({
          //   page: this.currentPage,
          //   pageSize: this.pageSize,
          //   ...this.filterForm
          // })
          
          // 模拟数据
          this.users = [
            {
              id: 1,
              username: 'admin',
              name: '系统管理员',
              role: '超级管理员',
              department: '信息中心',
              email: 'admin@example.com',
              phone: '13800000000',
              skills: ['全栈开发', '系统管理', '数据分析'],
              lastLogin: '2023-10-20 09:33:21'
            },
            {
              id: 2,
              username: 'manager1',
              name: '张主任',
              role: '部门负责人',
              department: '视频制作部',
              email: 'manager1@example.com',
              phone: '13800000001',
              skills: ['视频剪辑', '导演', '摄影'],
              lastLogin: '2023-10-19 15:45:33'
            },
            {
              id: 3,
              username: 'user1',
              name: '李明',
              role: '普通成员',
              department: '视频制作部',
              email: 'user1@example.com',
              phone: '13800000002',
              skills: ['视频剪辑', '摄影'],
              lastLogin: '2023-10-20 10:12:05'
            },
            {
              id: 4,
              username: 'user2',
              name: '王红',
              role: '普通成员',
              department: '视频制作部',
              email: 'user2@example.com',
              phone: '13800000003',
              skills: ['视频特效', '后期制作'],
              lastLogin: null
            },
            {
              id: 5,
              username: 'news1',
              name: '赵强',
              role: '普通成员',
              department: '新闻采编部',
              email: 'news1@example.com',
              phone: '13800000004',
              skills: ['新闻写作', '摄影'],
              lastLogin: '2023-10-18 09:52:41'
            }
          ];
          this.total = 5;
          this.loading = false;
        }, 500);
      },
      
      // 加载部门列表
      loadDepartments() {
        // 应该是实际的API调用
        // api.getDepartments()
        
        // 模拟数据
        this.departments = [
          { id: 1, name: '信息中心', description: '负责系统开发与维护' },
          { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
          { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
          { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
          { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
        ];
      },
      
      // 搜索用户
      searchUsers() {
        this.currentPage = 1;
        this.loadUsers();
      },
      
      // 重置过滤条件
      resetFilter() {
        this.filterForm = {
          keyword: '',
          role: '',
          department: ''
        };
        this.searchUsers();
      },
      
      // 处理页面大小变化
      handleSizeChange(size) {
        this.pageSize = size;
        this.loadUsers();
      },
      
      // 处理页码变化
      handleCurrentChange(page) {
        this.currentPage = page;
        this.loadUsers();
      },
      
      // 显示添加用户对话框
      showAddUserDialog() {
        this.isEditMode = false;
        this.userForm = {
          username: '',
          password: '',
          name: '',
          role: '普通成员',
          department: '',
          email: '',
          phone: '',
          skills: []
        };
        this.userFormVisible = true;
      },
      
      // 编辑用户
      editUser(user) {
        this.isEditMode = true;
        this.userForm = { ...user, password: '' };
        this.userFormVisible = true;
      },
      
      // 提交用户表单
      submitUserForm() {
        this.$refs.userFormRef.validate(valid => {
          if (valid) {
            this.submitting = true;
            
            // 这里应该是实际的API调用
            // const apiCall = this.isEditMode 
            //   ? api.updateUser(this.userForm.id, this.userForm)
            //   : api.createUser(this.userForm);
            
            // 模拟API调用
            setTimeout(() => {
              this.submitting = false;
              this.userFormVisible = false;
              this.$message.success(this.isEditMode ? '用户更新成功' : '用户创建成功');
              this.loadUsers();
            }, 500);
          }
        });
      },
      
      // 确认删除用户
      confirmDelete(user) {
        this.$confirm(`确定要删除用户 ${user.name} 吗？此操作不可恢复`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 这里应该是实际的API调用
          // api.deleteUser(user.id)
          
          // 模拟API调用
          setTimeout(() => {
            this.$message.success('用户删除成功');
            this.loadUsers();
          }, 500);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      
      // 获取角色标签样式
      getRoleTagType(role) {
        const roleTypes = {
          '超级管理员': 'danger',
          '管理员': 'warning',
          '部门负责人': 'success',
          '普通成员': 'info'
        };
        return roleTypes[role] || '';
      },
      
      // 显示导入对话框
      showImportDialog() {
        this.importDialogVisible = true;
        this.importResult = null;
      },
      
      // 下载导入模板
      downloadTemplate() {
        // 实际应用中应提供Excel模板下载
        this.$message.info('模板下载功能在实际部署环境中可用');
      },
      
      // 导入前验证
      beforeImport(file) {
        // 检查文件类型
        const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase());
        if (!isExcel) {
          this.$message.error('只能上传Excel文件!');
          return false;
        }
        
        // 检查文件大小
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('文件大小不能超过5MB!');
          return false;
        }
        
        return true;
      },
      
      // 处理导入成功
      handleImportSuccess(response) {
        this.$message.success(`成功导入用户数据`);
        this.importResult = {
          success: response.addedCount || 0,
          failed: response.failedCount || 0,
          errors: response.failed?.map(item => `用户 ${item.username || '未知'} 导入失败: ${item.reason}`) || []
        };
        this.loadUsers();
      },
      
      // 处理导入失败
      handleImportError(error) {
        this.$message.error(`导入失败: ${error.message || '未知错误'}`);
      },
      
      // 导出用户数据
      exportUsers() {
        // 实际应用中应调用API导出数据
        this.$message.info('用户数据导出功能在实际部署环境中可用');
      }
    },
    mounted() {
      this.loadDepartments();
      this.loadUsers();
    }
  },
  
  // 系统设置组件
  SystemSettings: {
    template: `
      <div class="system-settings">
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="settings-container">
          <h2>系统设置</h2>
          
          <el-tabs type="border-card">
            <!-- 基础设置 -->
            <el-tab-pane label="基础设置">
              <el-form :model="baseSettings" label-width="120px">
                <el-form-item label="系统名称">
                  <el-input v-model="baseSettings.systemName"></el-input>
                </el-form-item>
                
                <el-form-item label="系统Logo">
                  <el-upload
                    class="logo-uploader"
                    action="/api/settings/logo"
                    :show-file-list="false"
                    :headers="uploadHeaders"
                    :before-upload="beforeLogoUpload"
                    :on-success="handleLogoSuccess"
                  >
                    <img v-if="baseSettings.logo" :src="baseSettings.logo" class="logo-preview">
                    <div v-else class="logo-upload-placeholder">
                      <el-icon><Plus /></el-icon>
                      <span>点击上传Logo</span>
                    </div>
                  </el-upload>
                  <div class="upload-tip">建议尺寸: 200x50px，PNG格式</div>
                </el-form-item>
                
                <el-form-item label="系统主题色">
                  <el-color-picker v-model="baseSettings.primaryColor"></el-color-picker>
                </el-form-item>
                
                <el-form-item label="默认语言">
                  <el-select v-model="baseSettings.language" style="width: 100%;">
                    <el-option label="简体中文" value="zh-CN"></el-option>
                    <el-option label="English" value="en-US"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveBaseSettings">保存设置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 安全设置 -->
            <el-tab-pane label="安全设置">
              <el-form :model="securitySettings" label-width="180px">
                <el-form-item label="登录尝试限制次数">
                  <el-input-number v-model="securitySettings.maxLoginAttempts" :min="3" :max="10"></el-input-number>
                  <div class="form-tip">超过限制次数后账号将被锁定</div>
                </el-form-item>
                
                <el-form-item label="锁定时间（分钟）">
                  <el-input-number v-model="securitySettings.lockDuration" :min="5" :max="120"></el-input-number>
                </el-form-item>
                
                <el-form-item label="密码复杂度要求">
                  <el-checkbox-group v-model="securitySettings.passwordRequirements">
                    <el-checkbox label="minLength">最小长度8位</el-checkbox>
                    <el-checkbox label="uppercase">包含大写字母</el-checkbox>
                    <el-checkbox label="lowercase">包含小写字母</el-checkbox>
                    <el-checkbox label="numbers">包含数字</el-checkbox>
                    <el-checkbox label="special">包含特殊字符</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                
                <el-form-item label="登录验证码">
                  <el-switch v-model="securitySettings.captchaEnabled"></el-switch>
                </el-form-item>
                
                <el-form-item label="密码过期时间（天）">
                  <el-input-number v-model="securitySettings.passwordExpireDays" :min="30" :max="365"></el-input-number>
                  <div class="form-tip">0表示永不过期</div>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 通知设置 -->
            <el-tab-pane label="通知设置">
              <el-form :model="notificationSettings" label-width="150px">
                <el-form-item label="系统通知">
                  <el-switch v-model="notificationSettings.systemNotifications"></el-switch>
                </el-form-item>
                
                <el-form-item label="新任务通知">
                  <el-switch v-model="notificationSettings.newTaskNotifications"></el-switch>
                </el-form-item>
                
                <el-form-item label="任务状态更新通知">
                  <el-switch v-model="notificationSettings.taskUpdateNotifications"></el-switch>
                </el-form-item>
                
                <el-form-item label="评论通知">
                  <el-switch v-model="notificationSettings.commentNotifications"></el-switch>
                </el-form-item>
                
                <el-form-item label="邮件提醒">
                  <el-switch v-model="notificationSettings.emailNotifications"></el-switch>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 高级设置 -->
            <el-tab-pane label="高级设置">
              <el-alert
                title="警告：这些设置可能会影响系统稳定性，请谨慎操作"
                type="warning"
                :closable="false"
                style="margin-bottom: 20px;"
              ></el-alert>
              
              <el-form :model="advancedSettings" label-width="180px">
                <el-form-item label="系统缓存">
                  <el-button type="warning" @click="clearSystemCache">清除系统缓存</el-button>
                </el-form-item>
                
                <el-form-item label="系统日志等级">
                  <el-select v-model="advancedSettings.logLevel" style="width: 100%;">
                    <el-option label="调试 (Debug)" value="debug"></el-option>
                    <el-option label="信息 (Info)" value="info"></el-option>
                    <el-option label="警告 (Warning)" value="warning"></el-option>
                    <el-option label="错误 (Error)" value="error"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="API访问限制 (次/分钟)">
                  <el-input-number v-model="advancedSettings.apiRateLimit" :min="10" :max="1000"></el-input-number>
                </el-form-item>
                
                <el-form-item label="系统维护模式">
                  <el-switch v-model="advancedSettings.maintenanceMode"></el-switch>
                </el-form-item>
                
                <el-form-item label="维护模式消息" v-if="advancedSettings.maintenanceMode">
                  <el-input v-model="advancedSettings.maintenanceMessage" type="textarea" :rows="3"></el-input>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveAdvancedSettings">保存设置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        baseSettings: {
          systemName: '易班工作站管理系统',
          logo: '',
          primaryColor: '#3b82f6',
          language: 'zh-CN'
        },
        securitySettings: {
          maxLoginAttempts: 5,
          lockDuration: 30,
          passwordRequirements: ['minLength', 'numbers'],
          captchaEnabled: true,
          passwordExpireDays: 90
        },
        notificationSettings: {
          systemNotifications: true,
          newTaskNotifications: true,
          taskUpdateNotifications: true,
          commentNotifications: true,
          emailNotifications: false
        },
        advancedSettings: {
          logLevel: 'info',
          apiRateLimit: 100,
          maintenanceMode: false,
          maintenanceMessage: '系统正在维护升级，预计1小时后恢复，请稍后再试。'
        }
      };
    },
    methods: {
      beforeLogoUpload(file) {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        
        if (!isImage) {
          this.$message.error('上传Logo只能是图片格式!');
          return false;
        }
        
        if (!isLt2M) {
          this.$message.error('上传Logo不能超过2MB!');
          return false;
        }
        
        return true;
      },
      
      handleLogoSuccess(response) {
        this.baseSettings.logo = response.url;
        this.$message.success('Logo上传成功');
      },
      
      saveBaseSettings() {
        // 在实际应用中，这里应该调用API保存设置
        this.$message.success('基础设置已保存');
      },
      
      saveSecuritySettings() {
        this.$message.success('安全设置已保存');
      },
      
      saveNotificationSettings() {
        this.$message.success('通知设置已保存');
      },
      
      saveAdvancedSettings() {
        if (this.advancedSettings.maintenanceMode) {
          this.$confirm('开启维护模式将阻止用户访问系统，是否确认？', '警告', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message.success('高级设置已保存，系统已进入维护模式');
          }).catch(() => {
            this.advancedSettings.maintenanceMode = false;
          });
        } else {
          this.$message.success('高级设置已保存');
        }
      },
      
      clearSystemCache() {
        this.$confirm('确认清除系统缓存？这可能会导致系统短暂变慢', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 模拟清除缓存的过程
          const loading = this.$loading({
            lock: true,
            text: '正在清除缓存...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          
          setTimeout(() => {
            loading.close();
            this.$message.success('系统缓存已清除');
          }, 1500);
        });
      }
    },
    mounted() {
      // 在实际应用中，这里应该从API获取系统设置
    }
  },
  
  // 任务管理组件
  TaskManagement: {
    template: `
      <div class="task-management">
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="content-wrapper">
          <h2>任务管理</h2>
          
          <!-- 任务过滤区域 -->
          <div class="filter-section">
            <el-form :inline="true" :model="filterForm">
              <el-form-item label="关键词搜索">
                <el-input v-model="filterForm.keyword" placeholder="任务名称/描述" clearable></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未开始" value="未开始"></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="待验收" value="待验收"></el-option>
                  <el-option label="已完成" value="已完成"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门">
                <el-select v-model="filterForm.department" placeholder="选择部门" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option 
                    v-for="dept in departments" 
                    :key="dept.id" 
                    :label="dept.name" 
                    :value="dept.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="紧急程度">
                <el-select v-model="filterForm.urgency" placeholder="选择紧急程度" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option label="紧急" value="true"></el-option>
                  <el-option label="普通" value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchTasks">搜索</el-button>
                <el-button @click="resetFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 操作按钮区域 -->
          <div class="actions-section">
            <el-button type="success" @click="createTask">创建任务</el-button>
            <el-button type="warning" @click="batchOperation">批量操作</el-button>
            <el-button @click="exportTasks">导出任务数据</el-button>
          </div>
          
          <!-- 任务表格 -->
          <div class="table-section">
            <el-table
              :data="tasks"
              border
              style="width: 100%"
              v-loading="loading"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="70" sortable></el-table-column>
              <el-table-column prop="title" label="任务名称" min-width="200">
                <template #default="scope">
                  <div class="task-title-cell">
                    <span>{{ scope.row.title }}</span>
                    <el-tag size="small" type="danger" v-if="scope.row.isUrgent">紧急</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusTagType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="department" label="部门" width="120"></el-table-column>
              <el-table-column prop="creator" label="创建者" width="100"></el-table-column>
              <el-table-column prop="deadline" label="截止日期" width="180" sortable></el-table-column>
              <el-table-column prop="createdAt" label="创建时间" width="180" sortable></el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewTask(scope.row)">详情</el-button>
                  <el-button type="warning" size="small" @click="editTask(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteTask(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页控制 -->
            <div class="pagination-wrapper">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
        
        <!-- 任务详情对话框 -->
        <el-dialog v-model="taskDetailVisible" title="任务详情" width="60%" class="task-detail-dialog">
          <div v-if="currentTask">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="任务名称" :span="2">{{ currentTask.title }}</el-descriptions-item>
              <el-descriptions-item label="任务状态">
                <el-tag :type="getStatusTagType(currentTask.status)">{{ currentTask.status }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="紧急程度">
                <el-tag type="danger" v-if="currentTask.isUrgent">紧急</el-tag>
                <span v-else>普通</span>
              </el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentTask.department }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ currentTask.creator }}</el-descriptions-item>
              <el-descriptions-item label="截止日期">{{ currentTask.deadline }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentTask.createdAt }}</el-descriptions-item>
            </el-descriptions>
            
            <div class="task-description">
              <h4>任务描述</h4>
              <div class="description-content">{{ currentTask.description }}</div>
            </div>
            
            <div class="task-members">
              <h4>参与成员</h4>
              <div class="members-list">
                <el-tag v-for="member in currentTask.members" :key="member.id" style="margin-right: 10px;">
                  {{ member.name }}
                </el-tag>
                <span v-if="!currentTask.members || currentTask.members.length === 0">暂无成员</span>
              </div>
            </div>
            
            <div class="task-attachments">
              <h4>附件</h4>
              <div v-if="!currentTask.attachments || currentTask.attachments.length === 0">暂无附件</div>
              <el-table v-else :data="currentTask.attachments" style="width: 100%">
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="size" label="大小" width="120">
                  <template #default="scope">{{ formatFileSize(scope.row.size) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button type="primary" size="small" link @click="downloadFile(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="taskDetailVisible = false">关闭</el-button>
              <el-button type="primary" @click="editTask(currentTask)">编辑任务</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 创建/编辑任务对话框 -->
        <el-dialog
          v-model="taskFormVisible"
          :title="isEditMode ? '编辑任务' : '创建任务'"
          width="60%"
          class="task-form-dialog"
        >
          <el-form :model="taskForm" :rules="taskFormRules" ref="taskFormRef" label-width="100px">
            <el-form-item label="任务名称" prop="title">
              <el-input v-model="taskForm.title" placeholder="请输入任务名称"></el-input>
            </el-form-item>
            
            <el-form-item label="紧急程度" prop="isUrgent">
              <el-radio-group v-model="taskForm.isUrgent">
                <el-radio :label="false">普通</el-radio>
                <el-radio :label="true">紧急</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="taskForm.status" style="width: 100%;">
                <el-option label="未开始" value="未开始"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="待验收" value="待验收"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="taskForm.department" style="width: 100%;" @change="handleDepartmentChange">
                <el-option
                  v-for="dept in departments"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker 
                v-model="taskForm.deadline" 
                type="datetime" 
                placeholder="选择日期时间" 
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            
            <el-form-item label="参与成员" prop="members">
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
              <el-input
                v-model="taskForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入任务描述内容"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="附件">
              <el-upload
                action="/api/upload"
                :on-preview="handleFilePreview"
                :on-remove="handleFileRemove"
                :file-list="taskForm.attachments"
                :headers="uploadHeaders"
                multiple
              >
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持多个文件上传，单个文件不超过50MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="taskFormVisible = false">取消</el-button>
              <el-button type="primary" @click="submitTaskForm" :loading="submitting">
                {{ isEditMode ? '更新' : '创建' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 批量操作对话框 -->
        <el-dialog v-model="batchDialogVisible" title="批量操作" width="400px">
          <el-form label-width="100px">
            <el-form-item label="选择操作">
              <el-select v-model="batchOperation.type" style="width: 100%;">
                <el-option label="更新状态" value="status"></el-option>
                <el-option label="分配部门" value="department"></el-option>
                <el-option label="删除任务" value="delete"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="状态" v-if="batchOperation.type === 'status'">
              <el-select v-model="batchOperation.status" style="width: 100%;">
                <el-option label="未开始" value="未开始"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="待验收" value="待验收"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="部门" v-if="batchOperation.type === 'department'">
              <el-select v-model="batchOperation.department" style="width: 100%;">
                <el-option
                  v-for="dept in departments"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item v-if="batchOperation.type === 'delete'" label="">
              <el-alert
                title="警告：此操作将永久删除选中的任务，不可恢复"
                type="error"
                :closable="false"
              ></el-alert>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="batchDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmBatchOperation" :loading="batchSubmitting">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        // 表格数据与分页
        tasks: [],
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        
        // 筛选条件
        filterForm: {
          keyword: '',
          status: '',
          department: '',
          urgency: ''
        },
        
        // 部门与成员
        departments: [],
        availableMembers: [],
        
        // 表格选择
        selectedTasks: [],
        
        // 任务详情
        taskDetailVisible: false,
        currentTask: null,
        
        // 任务表单
        taskFormVisible: false,
        isEditMode: false,
        taskForm: {
          id: null,
          title: '',
          isUrgent: false,
          status: '未开始',
          department: '',
          deadline: '',
          members: [],
          description: '',
          attachments: []
        },
        taskFormRules: {
          title: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
          status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
          department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
          deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
          description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }]
        },
        
        // 批量操作
        batchDialogVisible: false,
        batchSubmitting: false,
        batchOperation: {
          type: 'status',
          status: '未开始',
          department: '',
          message: ''
        },
        
        // 上传认证头
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        
        // 提交状态
        submitting: false
      };
    },
    methods: {
      // 加载任务列表
      loadTasks() {
        this.loading = true;
        
        // 模拟API调用
        setTimeout(() => {
          // 这里应该是实际的API调用
          // api.getTasks({
          //   page: this.currentPage,
          //   pageSize: this.pageSize,
          //   ...this.filterForm
          // })
          
          // 模拟数据
          this.tasks = [
            {
              id: 1,
              title: '设计新Logo',
              status: '进行中',
              department: '设计创意部',
              creator: 'admin',
              deadline: '2023-10-25 18:00:00',
              createdAt: '2023-10-20 09:33:21',
              isUrgent: true,
              description: '设计一个新的公司Logo，要求简洁大方，符合公司形象。',
              members: [
                { id: 1, name: '张三' },
                { id: 2, name: '李四' }
              ],
              attachments: [
                { name: '需求文档.pdf', size: 102400 },
                { name: '参考图片.zip', size: 204800 }
              ]
            },
            {
              id: 2,
              title: '撰写年度报告',
              status: '未开始',
              department: '新闻采编部',
              creator: 'manager1',
              deadline: '2023-11-01 12:00:00',
              createdAt: '2023-10-19 15:45:33',
              isUrgent: false,
              description: '撰写公司年度报告，内容包括年度业绩、市场分析、未来展望等。',
              members: [
                { id: 3, name: '王五' },
                { id: 4, name: '赵六' }
              ],
              attachments: []
            }
          ];
          this.total = 2;
          this.loading = false;
        }, 500);
      },
      
      // 加载部门列表
      loadDepartments() {
        // 应该是实际的API调用
        // api.getDepartments()
        
        // 模拟数据
        this.departments = [
          { id: 1, name: '信息中心', description: '负责系统开发与维护' },
          { id: 2, name: '视频制作部', description: '负责视频拍摄与制作' },
          { id: 3, name: '新闻采编部', description: '负责新闻采集与编辑' },
          { id: 4, name: '设计创意部', description: '负责平面设计与创意策划' },
          { id: 5, name: '宣传运营部', description: '负责线上线下宣传与运营' }
        ];
      },
      
      // 搜索任务
      searchTasks() {
        this.currentPage = 1;
        this.loadTasks();
      },
      
      // 重置过滤条件
      resetFilter() {
        this.filterForm = {
          keyword: '',
          status: '',
          department: '',
          urgency: ''
        };
        this.searchTasks();
      },
      
      // 处理页面大小变化
      handleSizeChange(size) {
        this.pageSize = size;
        this.loadTasks();
      },
      
      // 处理页码变化
      handleCurrentChange(page) {
        this.currentPage = page;
        this.loadTasks();
      },
      
      // 创建任务
      createTask() {
        this.isEditMode = false;
        this.taskForm = {
          id: null,
          title: '',
          isUrgent: false,
          status: '未开始',
          department: '',
          deadline: '',
          members: [],
          description: '',
          attachments: []
        };
        this.taskFormVisible = true;
      },
      
      // 编辑任务
      editTask(task) {
        this.isEditMode = true;
        this.taskForm = { ...task };
        this.taskFormVisible = true;
      },
      
      // 提交任务表单
      submitTaskForm() {
        this.$refs.taskFormRef.validate(valid => {
          if (valid) {
            this.submitting = true;
            
            // 这里应该是实际的API调用
            // const apiCall = this.isEditMode 
            //   ? api.updateTask(this.taskForm.id, this.taskForm)
            //   : api.createTask(this.taskForm);
            
            // 模拟API调用
            setTimeout(() => {
              this.submitting = false;
              this.taskFormVisible = false;
              this.$message.success(this.isEditMode ? '任务更新成功' : '任务创建成功');
              this.loadTasks();
            }, 500);
          }
        });
      },
      
      // 查看任务详情
      viewTask(task) {
        this.currentTask = task;
        this.taskDetailVisible = true;
      },
      
      // 删除任务
      deleteTask(task) {
        this.$confirm(`确定要删除任务 ${task.title} 吗？此操作不可恢复`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 这里应该是实际的API调用
          // api.deleteTask(task.id)
          
          // 模拟API调用
          setTimeout(() => {
            this.$message.success('任务删除成功');
            this.loadTasks();
          }, 500);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      
      // 获取状态标签样式
      getStatusTagType(status) {
        const statusTypes = {
          '未开始': 'info',
          '进行中': 'warning',
          '待验收': 'primary',
          '已完成': 'success'
        };
        return statusTypes[status] || '';
      },
      
      // 处理表格选择变化
      handleSelectionChange(selection) {
        this.selectedTasks = selection;
      },
      
      // 批量操作
      batchOperation() {
        if (this.selectedTasks.length === 0) {
          this.$message.warning('请先选择任务');
          return;
        }
        this.batchDialogVisible = true;
      },
      
      // 确认批量操作
      confirmBatchOperation() {
        this.batchSubmitting = true;
        
        // 这里应该是实际的API调用
        // const apiCall = api.batchUpdateTasks(this.selectedTasks.map(task => task.id), this.batchOperation);
        
        // 模拟API调用
        setTimeout(() => {
          this.batchSubmitting = false;
          this.batchDialogVisible = false;
          this.$message.success('批量操作成功');
          this.loadTasks();
        }, 500);
      },
      
      // 导出任务数据
      exportTasks() {
        // 实际应用中应调用API导出数据
        this.$message.info('任务数据导出功能在实际部署环境中可用');
      },
      
      // 搜索成员
      searchMembers(query) {
        if (query !== '') {
          // 模拟API调用
          setTimeout(() => {
            this.availableMembers = [
              { id: 1, name: '张三' },
              { id: 2, name: '李四' },
              { id: 3, name: '王五' },
              { id: 4, name: '赵六' }
            ].filter(member => member.name.includes(query));
          }, 300);
        } else {
          this.availableMembers = [];
        }
      },
      
      // 处理部门变化
      handleDepartmentChange(departmentId) {
        // 这里可以根据部门ID加载对应的成员列表
      },
      
      // 格式化文件大小
      formatFileSize(size) {
        if (size < 1024) {
          return `${size} B`;
        } else if (size < 1024 * 1024) {
          return `${(size / 1024).toFixed(2)} KB`;
        } else {
          return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }
      },
      
      // 下载文件
      downloadFile(file) {
        // 实际应用中应调用API下载文件
        this.$message.info(`下载文件: ${file.name}`);
      },
      
      // 处理文件预览
      handleFilePreview(file) {
        // 实际应用中应提供文件预览功能
        this.$message.info(`预览文件: ${file.name}`);
      },
      
      // 处理文件移除
      handleFileRemove(file, fileList) {
        this.taskForm.attachments = fileList;
      }
    },
    mounted() {
      this.loadDepartments();
      this.loadTasks();
    }
  },
  
  // 数据备份组件
  DataBackup: {
    template: `
      <div class="data-backup">
        <el-page-header @back="$emit('navigate', 'Dashboard')" title="返回仪表盘" />
        
        <div class="content-wrapper">
          <h2>数据备份与恢复</h2>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <span>数据备份</span>
                  </div>
                </template>
                
                <div class="backup-options">
                  <div class="option-item">
                    <el-checkbox v-model="backupOptions.users">用户数据</el-checkbox>
                    <div class="option-desc">包含用户账号、角色、部门等信息</div>
                  </div>
                  <div class="option-item">
                    <el-checkbox v-model="backupOptions.tasks">任务数据</el-checkbox>
                    <div class="option-desc">包含任务内容、状态、成员分配等信息</div>
                  </div>
                  <div class="option-item">
                    <el-checkbox v-model="backupOptions.departments">部门数据</el-checkbox>
                    <div class="option-desc">包含部门名称、描述等信息</div>
                  </div>
                  <div class="option-item">
                    <el-checkbox v-model="backupOptions.files">附件文件</el-checkbox>
                    <div class="option-desc">包含任务附带的所有上传文件</div>
                  </div>
                  <div class="option-item">
                    <el-checkbox v-model="backupOptions.settings">系统设置</el-checkbox>
                    <div class="option-desc">包含系统全局配置参数</div>
                  </div>
                </div>
                
                <div class="backup-actions">
                  <el-button type="primary" :loading="backupLoading" @click="startBackup">开始备份</el-button>
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="12">
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <span>数据恢复</span>
                  </div>
                </template>
                
                <div class="restore-options">
                  <el-upload
                    class="upload-demo"
                    drag
                    action="/api/restore"
                    :headers="uploadHeaders"
                    :on-success="handleRestoreSuccess"
                    :on-error="handleRestoreError"
                    :before-upload="beforeRestore"
                    accept=".zip"
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">拖拽备份文件到此处或 <em>点击上传</em></div>
                    <template #tip>
                      <div class="el-upload__tip">
                        只能上传zip格式备份文件，且不超过100MB
                      </div>
                    </template>
                  </el-upload>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <el-card class="box-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>备份历史</span>
                <el-button type="text" @click="refreshBackupHistory">刷新</el-button>
              </div>
            </template>
            
            <el-table :data="backupHistory" stripe style="width: 100%" v-loading="historyLoading">
              <el-table-column prop="time" label="备份时间" width="180"></el-table-column>
              <el-table-column prop="size" label="大小" width="120"></el-table-column>
              <el-table-column prop="creator" label="创建者" width="120"></el-table-column>
              <el-table-column prop="type" label="类型" width="120">
                <template #default="scope">
                  <el-tag size="small" :type="scope.row.type === 'auto' ? 'info' : 'success'">
                    {{ scope.row.type === 'auto' ? '自动' : '手动' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="包含内容">
                <template #default="scope">
                  <el-tag 
                    v-for="item in scope.row.content.split(',')" 
                    :key="item" 
                    size="small" 
                    style="margin-right: 5px; margin-bottom: 5px;"
                  >
                    {{ item }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="downloadBackup(scope.row)">下载</el-button>
                  <el-button type="success" size="small" @click="restoreBackup(scope.row)">恢复</el-button>
                  <el-button type="danger" size="small" @click="deleteBackup(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          
          <!-- 自动备份设置 -->
          <el-card class="box-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>自动备份设置</span>
              </div>
            </template>
            
            <el-form :model="autoBackupForm" label-width="120px">
              <el-form-item label="启用自动备份">
                <el-switch v-model="autoBackupForm.enabled"></el-switch>
              </el-form-item>
              
              <el-form-item label="备份频率" v-if="autoBackupForm.enabled">
                <el-select v-model="autoBackupForm.frequency" style="width: 100%;">
                  <el-option label="每天" value="daily"></el-option>
                  <el-option label="每周" value="weekly"></el-option>
                  <el-option label="每月" value="monthly"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="备份时间" v-if="autoBackupForm.enabled">
                <el-time-picker v-model="autoBackupForm.time" format="HH:mm" placeholder="选择时间" style="width: 100%;"></el-time-picker>
              </el-form-item>
              
              <el-form-item label="保留时长" v-if="autoBackupForm.enabled">
                <el-select v-model="autoBackupForm.retention" style="width: 100%;">
                  <el-option label="7天" value="7"></el-option>
                  <el-option label="15天" value="15"></el-option>
                  <el-option label="30天" value="30"></el-option>
                  <el-option label="90天" value="90"></el-option>
                  <el-option label="永久" value="-1"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveAutoBackupSettings" :loading="settingsSaving">保存设置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        backupOptions: {
          users: true,
          tasks: true,
          departments: true,
          files: true,
          settings: true
        },
        backupLoading: false,
        historyLoading: false,
        backupHistory: [],
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        autoBackupForm: {
          enabled: false,
          frequency: 'daily',
          time: new Date(new Date().setHours(3, 0, 0, 0)), // 默认凌晨3点
          retention: '30'
        },
        settingsSaving: false
      };
    },
    methods: {
      startBackup() {
        if (!Object.values(this.backupOptions).some(v => v)) {
          this.$message.warning('请至少选择一项需要备份的数据');
          return;
        }
        
        this.backupLoading = true;
        
        // 真实环境中这里应调用API进行备份
        setTimeout(() => {
          this.backupLoading = false;
          this.$message.success('备份任务已启动，系统正在处理中');
          
          // 模拟备份完成
          setTimeout(() => {
            this.$message.success('备份完成！');
            this.refreshBackupHistory();
          }, 2000);
        }, 1000);
      },
      
      refreshBackupHistory() {
        this.historyLoading = true;
        
        // 真实环境中这里应调用API获取备份历史
        setTimeout(() => {
          // 模拟数据
          this.backupHistory = [
            {
              id: 1,
              time: '2023-10-20 03:00:00',
              size: '15.2 MB',
              creator: 'System',
              type: 'auto',
              content: '用户数据,任务数据,部门数据,系统设置'
            },
            {
              id: 2,
              time: '2023-10-19 14:25:36',
              size: '22.8 MB',
              creator: 'admin',
              type: 'manual',
              content: '用户数据,任务数据,部门数据,附件文件,系统设置'
            },
            {
              id: 3,
              time: '2023-10-18 03:00:00',
              size: '14.9 MB',
              creator: 'System',
              type: 'auto',
              content: '用户数据,任务数据,部门数据,系统设置'
            }
          ];
          
          this.historyLoading = false;
        }, 500);
      },
      
      downloadBackup(backup) {
        this.$message.info(`正在下载备份文件: backup_${backup.time.replace(/[: ]/g, '_')}.zip`);
        // 真实环境中这里应调用API下载备份文件
      },
      
      restoreBackup(backup) {
        this.$confirm(`确定要从 ${backup.time} 的备份恢复系统吗？这将覆盖当前所有数据，且操作不可逆。`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '系统正在恢复中，请勿刷新页面',
            duration: 5000
          });
          
          // 真实环境中这里应调用API恢复备份
          setTimeout(() => {
            this.$message({
              type: 'success',
              message: '系统已成功恢复！即将重新加载页面',
              duration: 5000
            });
            
            // 延迟后刷新页面
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }, 2000);
        });
      },
      
      deleteBackup(backup) {
        this.$confirm(`确定要删除 ${backup.time} 的备份吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 真实环境中这里应调用API删除备份
          
          // 模拟删除成功后从列表中移除
          this.backupHistory = this.backupHistory.filter(item => item.id !== backup.id);
          this.$message.success('备份已删除');
        });
      },
      
      beforeRestore(file) {
        // 检查文件类型
        const isZip = file.type === 'application/zip' || file.name.endsWith('.zip');
        if (!isZip) {
          this.$message.error('只能上传zip格式的备份文件!');
          return false;
        }
        
        // 检查文件大小
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
          this.$message.error('备份文件大小不能超过100MB!');
          return false;
        }
        
        // 确认是否恢复
        return this.$confirm('恢复备份将会覆盖当前系统数据，是否继续？', '警告', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => true).catch(() => false);
      },
      
      handleRestoreSuccess() {
        this.$message({
          type: 'success',
          message: '备份文件上传成功，系统正在恢复数据',
          duration: 5000
        });
        
        // 模拟恢复过程
        setTimeout(() => {
          this.$message({
            type: 'success',
            message: '系统数据已恢复完成！即将重新加载页面',
            duration: 5000
          });
          
          // 延迟后刷新页面
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 2000);
      },
      
      handleRestoreError() {
        this.$message.error('备份文件上传失败，请重试');
      },
      
      saveAutoBackupSettings() {
        this.settingsSaving = true;
        
        // 真实环境中这里应调用API保存设置
        setTimeout(() => {
          this.settingsSaving = false;
          this.$message.success('自动备份设置已保存');
        }, 500);
      }
    },
    mounted() {
      this.refreshBackupHistory();
      
      // 真实环境中这里应调用API获取当前自动备份设置
    }
  }
};