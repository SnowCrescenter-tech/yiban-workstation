/**
 * 用户功能组件
 * 提供普通用户使用的功能组件
 */

import { api } from './api.js';
import { formatDate, formatFileSize } from './utils.js';

export const UserComponents = {
  // 用户仪表盘
  Dashboard: {
    template: `
      <div class="user-dashboard">
        <h2 class="panel-title">工作中心</h2>
        
        <div class="dashboard">
          <div class="side-panel">
            <h3>个人信息</h3>
            <div class="user-profile">
              <div class="avatar">
                <img :src="userAvatar" alt="用户头像" @error="handleImageError">
              </div>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p class="role">{{ user.role }}</p>
                <p class="department">{{ user.department }}</p>
              </div>
            </div>
            
            <h3>通知消息 <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notify-badge" /></h3>
            <div class="notification-scroller">
              <div v-if="notifications.length === 0" class="empty-data">
                暂无通知
              </div>
              <el-timeline v-else>
                <el-timeline-item 
                  v-for="note in notifications" 
                  :key="note.id"
                  :type="getNotificationType(note.type)"
                  :timestamp="formatDate(note.time)"
                >
                  {{ note.content }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
          
          <div class="main-content">
            <h3>今日任务</h3>
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="3" animated />
            </div>
            <div v-else-if="todayTasks.length === 0" class="empty-data">
              <el-empty description="今日暂无待办任务"></el-empty>
            </div>
            <div v-else class="task-list">
              <el-card 
                v-for="task in todayTasks"
                :key="task.id"
                shadow="hover"
                class="task-card"
                :class="{ urgent: task.isUrgent }"
                @click="viewTask(task)"
              >
                <div class="task-card-content">
                  <div class="task-title">
                    {{ task.title }}
                    <el-tag v-if="task.isUrgent" size="small" type="danger">紧急</el-tag>
                  </div>
                  <div class="task-meta">
                    <span class="department">{{ task.department }}</span>
                    <span class="deadline">截止: {{ formatDate(task.deadline, 'MM-DD HH:mm') }}</span>
                  </div>
                  <div class="task-status">
                    <el-tag :type="getStatusType(task.status)">{{ task.status }}</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
            
            <h3>进行中的任务</h3>
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="3" animated />
            </div>
            <div v-else-if="inProgressTasks.length === 0" class="empty-data">
              <el-empty description="暂无进行中的任务"></el-empty>
            </div>
            <div v-else>
              <el-table :data="inProgressTasks" style="width: 100%">
                <el-table-column prop="title" label="任务名称">
                  <template #default="scope">
                    <div class="task-title-cell">
                      <span>{{ scope.row.title }}</span>
                      <el-tag v-if="scope.row.isUrgent" size="small" type="danger">紧急</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="deadline" label="截止日期" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button size="small" @click="viewTask(scope.row)">查看</el-button>
                    <el-button size="small" type="primary" @click="updateTaskStatus(scope.row)">更新状态</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <h3>任务完成情况</h3>
            <div class="task-chart" ref="taskChart"></div>
            
            <el-divider />
            
            <div class="action-btns">
              <el-button type="primary" @click="$emit('navigate', 'AllTasks')">查看所有任务</el-button>
              <el-button type="success" @click="$emit('navigate', 'MyProfile')">个人资料</el-button>
            </div>
          </div>
        </div>
        
        <!-- 任务详情对话框 -->
        <el-dialog v-model="taskDetailVisible" :title="currentTask?.title || '任务详情'" width="60%">
          <div v-if="currentTask" class="task-detail">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="任务状态">
                <el-tag :type="getStatusType(currentTask.status)">{{ currentTask.status }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="紧急程度">
                <el-tag v-if="currentTask.isUrgent" type="danger">紧急</el-tag>
                <span v-else>普通</span>
              </el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentTask.department }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ currentTask.creator }}</el-descriptions-item>
              <el-descriptions-item label="截止日期">{{ formatDate(currentTask.deadline) }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(currentTask.createdAt) }}</el-descriptions-item>
            </el-descriptions>
            
            <h4>任务描述</h4>
            <div class="task-description">{{ currentTask.description }}</div>
            
            <h4>参与成员</h4>
            <div class="task-members">
              <el-tag v-for="member in currentTask.members" :key="member.id" style="margin-right: 10px;">
                {{ member.name }}
              </el-tag>
              <span v-if="!currentTask.members || currentTask.members.length === 0">暂无成员</span>
            </div>
            
            <h4>附件</h4>
            <div v-if="!currentTask.attachments || currentTask.attachments.length === 0" class="no-data">
              暂无附件
            </div>
            <el-table v-else :data="currentTask.attachments" style="width: 100%">
              <el-table-column prop="name" label="文件名"></el-table-column>
              <el-table-column prop="size" label="大小" width="120">
                <template #default="scope">{{ formatFileSize(scope.row.size) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="primary" size="small" link @click="downloadFile(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="taskDetailVisible = false">关闭</el-button>
              <el-button type="primary" v-if="canUpdateStatus" @click="updateTaskStatus(currentTask)">更新状态</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 更新任务状态对话框 -->
        <el-dialog v-model="statusDialogVisible" title="更新任务状态" width="30%">
          <el-form :model="statusForm">
            <el-form-item label="新状态">
              <el-select v-model="statusForm.status" style="width: 100%;">
                <el-option v-for="status in availableStatuses" :key="status" :label="status" :value="status"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" v-if="statusForm.status === '待验收' || statusForm.status === '已完成'">
              <el-input type="textarea" v-model="statusForm.comment" :rows="3" placeholder="请输入任务完成备注"></el-input>
            </el-form-item>
            <el-form-item label="附件" v-if="statusForm.status === '待验收'">
              <el-upload
                action="/api/upload"
                multiple
                :file-list="statusForm.files"
                :on-remove="handleFileRemove"
              >
                <el-button type="primary">添加附件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="statusDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitStatusUpdate" :loading="submitting">确认</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    `,
    props: ['user', 'notifications', 'unreadCount'],
    data() {
      return {
        loading: false,
        tasks: [],
        userAvatar: '', // 将从API获取或使用默认头像
        taskDetailVisible: false,
        currentTask: null,
        statusDialogVisible: false,
        statusForm: {
          status: '',
          comment: '',
          files: []
        },
        submitting: false,
        taskChart: null
      };
    },
    computed: {
      todayTasks() {
        return this.tasks.filter(task => {
          // 未完成，且今天需要处理的任务
          if (task.status === '已完成') return false;
          
          const taskDeadline = new Date(task.deadline);
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          // 今天截止或已过期的任务
          return (taskDeadline < tomorrow && task.isUrgent) || 
                 (taskDeadline < today);
        });
      },
      inProgressTasks() {
        return this.tasks.filter(task => task.status === '进行中');
      },
      availableStatuses() {
        if (!this.currentTask) return [];
        
        // 根据当前状态确定可选的下一状态
        switch (this.currentTask.status) {
          case '未开始':
            return ['进行中'];
          case '进行中':
            return ['待验收'];
          case '待验收':
            return ['已完成', '进行中']; // 验收不通过可返回进行中
          default:
            return [];
        }
      },
      canUpdateStatus() {
        return this.currentTask && this.currentTask.status !== '已完成';
      }
    },
    methods: {
      loadTasks() {
        this.loading = true;
        
        // 调用API获取用户任务
        api.getUserTasks()
          .then(response => {
            this.tasks = response.data;
            this.loading = false;
            
            // 在数据加载完成后初始化图表
            this.$nextTick(() => {
              this.initTaskChart();
            });
          })
          .catch(error => {
            console.error('加载任务失败:', error);
            this.loading = false;
          });
      },
      
      handleImageError(event) {
        // 设置默认头像
        event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%23909399"/%3E%3Cpath d="M20,85 C20,65 80,65 80,85" fill="%23909399"/%3E%3C/svg%3E';
      },
      
      formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return formatDate(date, format);
      },
      
      formatFileSize(size) {
        return formatFileSize(size);
      },
      
      getNotificationType(type) {
        const types = {
          'success': 'success',
          'warning': 'warning',
          'info': 'info',
          'error': 'danger'
        };
        return types[type] || 'info';
      },
      
      getStatusType(status) {
        const statusTypes = {
          '未开始': 'info',
          '进行中': 'warning',
          '待验收': 'primary',
          '已完成': 'success'
        };
        return statusTypes[status] || '';
      },
      
      viewTask(task) {
        this.currentTask = task;
        this.taskDetailVisible = true;
      },
      
      updateTaskStatus(task) {
        this.currentTask = task;
        this.statusForm.status = this.availableStatuses[0] || '';
        this.statusForm.comment = '';
        this.statusForm.files = [];
        this.statusDialogVisible = true;
      },
      
      handleFileRemove(file, fileList) {
        this.statusForm.files = fileList;
      },
      
      submitStatusUpdate() {
        if (!this.statusForm.status) {
          this.$message.warning('请选择要更新的状态');
          return;
        }
        
        this.submitting = true;
        
        // 在实际应用中，这里应该调用API更新任务状态
        api.updateTaskStatus(this.currentTask.id, this.statusForm.status)
          .then(response => {
            this.submitting = false;
            this.statusDialogVisible = false;
            this.taskDetailVisible = false;
            this.$message.success('任务状态已更新');
            
            // 重新加载任务列表
            this.loadTasks();
          })
          .catch(error => {
            console.error('更新任务状态失败:', error);
            this.submitting = false;
            this.$message.error('更新任务状态失败');
          });
      },
      
      downloadFile(file) {
        // 在实际应用中，这里应该调用API下载文件
        this.$message.info(`下载文件: ${file.name}`);
      },
      
      initTaskChart() {
        if (typeof echarts !== 'undefined' && this.$refs.taskChart) {
          // 任务状态统计
          const statusCount = {
            '未开始': 0,
            '进行中': 0,
            '待验收': 0,
            '已完成': 0
          };
          
          this.tasks.forEach(task => {
            if (statusCount[task.status] !== undefined) {
              statusCount[task.status]++;
            }
          });
          
          const chartDom = this.$refs.taskChart;
          this.taskChart = echarts.init(chartDom);
          
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'horizontal',
              bottom: 0,
              data: Object.keys(statusCount)
            },
            series: [
              {
                name: '任务状态',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: statusCount['未开始'], name: '未开始', itemStyle: { color: '#909399' } },
                  { value: statusCount['进行中'], name: '进行中', itemStyle: { color: '#f59e0b' } },
                  { value: statusCount['待验收'], name: '待验收', itemStyle: { color: '#3b82f6' } },
                  { value: statusCount['已完成'], name: '已完成', itemStyle: { color: '#10b981' } }
                ]
              }
            ]
          };
          
          this.taskChart.setOption(option);
        } else {
          console.warn('ECharts 库未加载或图表容器不存在');
        }
      }
    },
    mounted() {
      this.loadTasks();
      
      // 处理窗口大小变化，重新调整图表大小
      window.addEventListener('resize', () => {
        if (this.taskChart) {
          this.taskChart.resize();
        }
      });
    },
    beforeUnmount() {
      // 销毁图表实例
      if (this.taskChart) {
        this.taskChart.dispose();
      }
      
      // 移除事件监听
      window.removeEventListener('resize', this.handleResize);
    }
  },
  
  // 任务列表页面
  AllTasks: {
    template: `
      <div class="all-tasks">
        <h2 class="panel-title">我的任务</h2>
        
        <!-- 任务过滤区域 -->
        <div class="filter-section">
          <el-form :inline="true" :model="filterForm">
            <el-form-item label="关键词">
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
            <el-form-item label="紧急程度">
              <el-select v-model="filterForm.urgency" placeholder="选择紧急程度" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="紧急" value="true"></el-option>
                <el-option label="普通" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadTasks">搜索</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 视图切换 -->
        <div class="view-switch">
          <span>视图：</span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table">表格</el-radio-button>
            <el-radio-button label="kanban">看板</el-radio-button>
            <el-radio-button label="calendar">日历</el-radio-button>
          </el-radio-group>
        </div>
        
        <!-- 任务表格视图 -->
        <div v-if="viewMode === 'table'" class="table-view">
          <el-table 
            :data="tasks" 
            border 
            style="width: 100%" 
            v-loading="loading"
            :default-sort="{ prop: 'deadline', order: 'ascending' }"
            row-key="id"
            empty-text="暂无任务数据"
          >
            <el-table-column prop="title" label="任务名称">
              <template #default="scope">
                <div class="task-title">
                  <a href="#" @click.prevent="viewTask(scope.row)">{{ scope.row.title }}</a>
                  <el-tag v-if="scope.row.isUrgent" size="small" type="danger">紧急</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部门" width="120"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="180" sortable>
              <template #default="scope">
                {{ formatDate(scope.row.deadline) }}
                <div v-if="isOverdue(scope.row)" class="overdue-warning">已逾期</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="viewTask(scope.row)">详情</el-button>
                <el-button 
                  type="success" 
                  size="small" 
                  @click="updateTaskStatus(scope.row)"
                  :disabled="scope.row.status === '已完成'"
                >更新状态</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 看板视图 -->
        <div v-if="viewMode === 'kanban'" class="kanban-view">
          <div class="kanban-board">
            <div v-for="status in ['未开始', '进行中', '待验收', '已完成']" :key="status" class="kanban-column">
              <h3>
                {{ status }}
                <span class="count-badge">{{ getTasksByStatus(status).length }}</span>
              </h3>
              <div class="kanban-items">
                <div v-if="getTasksByStatus(status).length === 0" class="kanban-empty">
                  无任务
                </div>
                <div 
                  v-for="task in getTasksByStatus(status)" 
                  :key="task.id" 
                  class="kanban-item"
                  :class="{ urgent: task.isUrgent, overdue: isOverdue(task) }"
                  @click="viewTask(task)"
                >
                  <div class="kanban-item-title">
                    {{ task.title }}
                    <el-tag v-if="task.isUrgent" size="small" type="danger">紧急</el-tag>
                  </div>
                  <div class="kanban-item-meta">
                    <span class="department">{{ task.department }}</span>
                    <span class="deadline">{{ formatDate(task.deadline, 'MM-DD') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 日历视图 -->
        <div v-if="viewMode === 'calendar'" class="calendar-view" ref="calendarView">
          <p style="text-align: center; padding: 20px;">日历视图正在开发中...</p>
        </div>
        
        <!-- 分页控制 -->
        <div class="pagination-wrapper" v-if="viewMode === 'table'">
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
        
        <!-- 任务详情对话框 -->
        <el-dialog v-model="taskDetailVisible" :title="currentTask?.title || '任务详情'" width="60%">
          <div v-if="currentTask" class="task-detail">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="任务状态">
                <el-tag :type="getStatusType(currentTask.status)">{{ currentTask.status }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="紧急程度">
                <el-tag v-if="currentTask.isUrgent" type="danger">紧急</el-tag>
                <span v-else>普通</span>
              </el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentTask.department }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ currentTask.creator }}</el-descriptions-item>
              <el-descriptions-item label="截止日期">{{ formatDate(currentTask.deadline) }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(currentTask.createdAt) }}</el-descriptions-item>
            </el-descriptions>
            
            <h4>任务描述</h4>
            <div class="task-description">{{ currentTask.description }}</div>
            
            <h4>参与成员</h4>
            <div class="task-members">
              <el-tag v-for="member in currentTask.members" :key="member.id" style="margin-right: 10px;">
                {{ member.name }}
              </el-tag>
              <span v-if="!currentTask.members || currentTask.members.length === 0">暂无成员</span>
            </div>
            
            <h4>附件</h4>
            <div v-if="!currentTask.attachments || currentTask.attachments.length === 0" class="no-data">
              暂无附件
            </div>
            <el-table v-else :data="currentTask.attachments" style="width: 100%">
              <el-table-column prop="name" label="文件名"></el-table-column>
              <el-table-column prop="size" label="大小" width="120">
                <template #default="scope">{{ formatFileSize(scope.row.size) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="primary" size="small" link @click="downloadFile(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="taskDetailVisible = false">关闭</el-button>
              <el-button type="primary" v-if="canUpdateStatus" @click="updateTaskStatus(currentTask)">更新状态</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 更新任务状态对话框 -->
        <el-dialog v-model="statusDialogVisible" title="更新任务状态" width="30%">
          <el-form :model="statusForm">
            <el-form-item label="新状态">
              <el-select v-model="statusForm.status" style="width: 100%;">
                <el-option v-for="status in availableStatuses" :key="status" :label="status" :value="status"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" v-if="statusForm.status === '待验收' || statusForm.status === '已完成'">
              <el-input type="textarea" v-model="statusForm.comment" :rows="3" placeholder="请输入任务完成备注"></el-input>
            </el-form-item>
            <el-form-item label="附件" v-if="statusForm.status === '待验收'">
              <el-upload
                action="/api/upload"
                multiple
                :file-list="statusForm.files"
                :on-remove="handleFileRemove"
              >
                <el-button type="primary">添加附件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="statusDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitStatusUpdate" :loading="submitting">确认</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    `,
    props: ['user'],
    data() {
      return {
        tasks: [],
        loading: false,
        filterForm: {
          keyword: '',
          status: '',
          urgency: ''
        },
        viewMode: 'table',
        taskDetailVisible: false,
        currentTask: null,
        statusDialogVisible: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        statusForm: {
          status: '',
          comment: '',
          files: []
        },
        submitting: false
      };
    },
    computed: {
      availableStatuses() {
        if (!this.currentTask) return [];
        
        // 根据当前状态确定可选的下一状态
        switch (this.currentTask.status) {
          case '未开始':
            return ['进行中'];
          case '进行中':
            return ['待验收'];
          case '待验收':
            return ['已完成', '进行中']; // 验收不通过可返回进行中
          default:
            return [];
        }
      },
      canUpdateStatus() {
        return this.currentTask && this.currentTask.status !== '已完成';
      }
    },
    methods: {
      formatDate(date, format) {
        return formatDate(date, format);
      },
      
      formatFileSize(size) {
        return formatFileSize(size);
      },
      
      loadTasks() {
        this.loading = true;
        
        // 调用API获取任务数据
        api.getAllTasks()
          .then(response => {
            this.tasks = response.data;
            this.total = this.tasks.length;
            this.loading = false;
          })
          .catch(error => {
            console.error('加载任务失败:', error);
            this.$message.error('加载任务列表失败');
            this.loading = false;
          });
      },
      
      resetFilter() {
        this.filterForm = {
          keyword: '',
          status: '',
          urgency: ''
        };
        this.loadTasks();
      },
      
      handleSizeChange(size) {
        this.pageSize = size;
        this.loadTasks();
      },
      
      handleCurrentChange(page) {
        this.currentPage = page;
        this.loadTasks();
      },
      
      getStatusType(status) {
        const statusTypes = {
          '未开始': 'info',
          '进行中': 'warning',
          '待验收': 'primary',
          '已完成': 'success'
        };
        return statusTypes[status] || '';
      },
      
      viewTask(task) {
        this.currentTask = task;
        this.taskDetailVisible = true;
      },
      
      updateTaskStatus(task) {
        this.currentTask = task;
        this.statusForm.status = this.availableStatuses[0] || '';
        this.statusForm.comment = '';
        this.statusForm.files = [];
        this.statusDialogVisible = true;
      },
      
      handleFileRemove(file, fileList) {
        this.statusForm.files = fileList;
      },
      
      submitStatusUpdate() {
        if (!this.statusForm.status) {
          this.$message.warning('请选择要更新的状态');
          return;
        }
        
        this.submitting = true;
        
        // 在实际应用中，这里应该调用API更新任务状态
        api.updateTaskStatus(this.currentTask.id, this.statusForm.status)
          .then(response => {
            this.submitting = false;
            this.statusDialogVisible = false;
            this.taskDetailVisible = false;
            this.$message.success('任务状态已更新');
            
            // 重新加载任务列表
            this.loadTasks();
          })
          .catch(error => {
            console.error('更新任务状态失败:', error);
            this.submitting = false;
            this.$message.error('更新任务状态失败');
          });
      },
      
      downloadFile(file) {
        // 在实际应用中，这里应该调用API下载文件
        this.$message.info(`下载文件: ${file.name}`);
      },
      
      isOverdue(task) {
        // 判断任务是否已逾期（截止日期早于当前日期且状态不是已完成）
        if (task.status === '已完成') return false;
        const deadline = new Date(task.deadline);
        const now = new Date();
        return deadline < now;
      },
      
      getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
      }
    },
    mounted() {
      this.loadTasks();
    }
  },
  
  // 个人资料组件
  MyProfile: {
    template: `
      <div class="my-profile">
        <h2 class="panel-title">个人资料</h2>
        
        <el-card>
          <div class="profile-container">
            <div class="profile-header">
              <div class="avatar-container">
                <el-avatar :size="100" :src="userAvatar" @error="handleAvatarError">
                  {{ user.name.substring(0, 1) }}
                </el-avatar>
                <el-button class="change-avatar" type="primary" size="small" @click="showUploadAvatar">
                  更换头像
                </el-button>
              </div>
              
              <div class="info-container">
                <h3>{{ user.name }}</h3>
                <div class="user-meta">
                  <p><el-tag>{{ user.role }}</el-tag></p>
                  <p><i class="el-icon-office-building"></i> {{ user.department }}</p>
                </div>
              </div>
            </div>
            
            <el-divider></el-divider>
            
            <div class="profile-content">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="basic">
                  <el-form 
                    ref="basicForm" 
                    :model="basicForm" 
                    label-width="100px" 
                    :disabled="!isEditing"
                  >
                    <el-form-item label="用户名">
                      <el-input v-model="basicForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="basicForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                      <el-input v-model="basicForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                      <el-input v-model="basicForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="技能标签" prop="skills">
                      <el-select 
                        v-model="basicForm.skills" 
                        multiple 
                        filterable 
                        allow-create 
                        style="width: 100%;"
                      >
                        <el-option 
                          v-for="skill in availableSkills" 
                          :key="skill" 
                          :label="skill" 
                          :value="skill"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button v-if="!isEditing" type="primary" @click="startEdit">编辑信息</el-button>
                      <template v-else>
                        <el-button type="primary" @click="saveBasicInfo" :loading="saving">保存</el-button>
                        <el-button @click="cancelEdit">取消</el-button>
                      </template>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="修改密码" name="password">
                  <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="150px">
                    <el-form-item label="当前密码" prop="currentPassword">
                      <el-input type="password" v-model="passwordForm.currentPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input type="password" v-model="passwordForm.newPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPassword">
                      <el-input type="password" v-model="passwordForm.confirmPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="changePassword" :loading="changingPassword">更新密码</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="我的任务统计" name="statistics">
                  <div class="task-statistics">
                    <div class="stats-cards">
                      <div class="stat-card">
                        <div class="stat-title">总任务数</div>
                        <div class="stat-value">{{ statistics.totalTasks }}</div>
                      </div>
                      <div class="stat-card">
                        <div class="stat-title">已完成任务</div>
                        <div class="stat-value">{{ statistics.completedTasks }}</div>
                      </div>
                      <div class="stat-card">
                        <div class="stat-title">进行中任务</div>
                        <div class="stat-value">{{ statistics.inProgressTasks }}</div>
                      </div>
                      <div class="stat-card">
                        <div class="stat-title">按时完成率</div>
                        <div class="stat-value">{{ statistics.onTimeRate }}%</div>
                      </div>
                    </div>
                    
                    <div class="chart-container" ref="chartContainer"></div>
                  </div>
                </el-tab-pane>
                
                <el-tab-pane label="系统通知设置" name="notifications">
                  <div class="notification-settings">
                    <el-form label-width="200px">
                      <el-form-item label="接收系统公告">
                        <el-switch v-model="notificationSettings.systemAnnouncements"></el-switch>
                      </el-form-item>
                      <el-form-item label="任务分配通知">
                        <el-switch v-model="notificationSettings.taskAssignment"></el-switch>
                      </el-form-item>
                      <el-form-item label="任务截止提醒">
                        <el-switch v-model="notificationSettings.taskDeadline"></el-switch>
                      </el-form-item>
                      <el-form-item label="任务状态变更通知">
                        <el-switch v-model="notificationSettings.taskStatusChange"></el-switch>
                      </el-form-item>
                      <el-form-item label="评论和回复通知">
                        <el-switch v-model="notificationSettings.commentReply"></el-switch>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="saveNotificationSettings" :loading="savingNotifications">保存设置</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-card>
        
        <!-- 上传头像对话框 -->
        <el-dialog v-model="avatarDialogVisible" title="更换头像" width="400px">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview">
            <div v-else class="avatar-upload-placeholder">
              <el-icon><plus /></el-icon>
              <div class="el-upload__text">点击上传头像</div>
            </div>
          </el-upload>
          <div class="avatar-tips">
            支持JPG、PNG、GIF，建议尺寸200x200像素，不超过2MB
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="avatarDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveAvatar" :loading="savingAvatar">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    `,
    props: ['user'],
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'));
        } else {
          callback();
        }
      };
      
      const validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      };
      
      return {
        activeTab: 'basic',
        userAvatar: this.user.avatar || '',
        isEditing: false,
        saving: false,
        basicForm: {
          username: this.user.username,
          name: this.user.name,
          email: this.user.email || '',
          phone: this.user.phone || '',
          skills: this.user.skills || []
        },
        availableSkills: [
          '视频剪辑', '摄影', '平面设计', '文案写作', '新闻采编',
          '活动策划', '网页设计', '程序开发', '社交媒体运营', '直播'
        ],
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
            { validator: validatePassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        },
        changingPassword: false,
        statistics: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          onTimeRate: 0
        },
        notificationSettings: {
          systemAnnouncements: true,
          taskAssignment: true,
          taskDeadline: true,
          taskStatusChange: true,
          commentReply: true
        },
        savingNotifications: false,
        avatarDialogVisible: false,
        avatarUrl: '',
        savingAvatar: false,
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
    },
    methods: {
      startEdit() {
        this.isEditing = true;
      },
      
      cancelEdit() {
        this.isEditing = false;
        this.basicForm = {
          username: this.user.username,
          name: this.user.name,
          email: this.user.email || '',
          phone: this.user.phone || '',
          skills: this.user.skills || []
        };
      },
      
      saveBasicInfo() {
        this.saving = true;
        
        // 调用API更新用户信息
        api.updateUser(this.basicForm)
          .then(response => {
            this.$message.success('个人信息更新成功');
            this.isEditing = false;
            this.saving = false;
          })
          .catch(error => {
            this.$message.error('更新失败: ' + error.message);
            this.saving = false;
          });
      },
      
      changePassword() {
        this.$refs.passwordForm.validate(valid => {
          if (valid) {
            this.changingPassword = true;
            
            // 调用API修改密码
            api.changePassword(this.passwordForm)
              .then(response => {
                this.$message.success('密码修改成功');
                this.passwordForm = {
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                };
                this.changingPassword = false;
              })
              .catch(error => {
                this.$message.error('密码修改失败: ' + error.message);
                this.changingPassword = false;
              });
          }
        });
      },
      
      saveNotificationSettings() {
        this.savingNotifications = true;
        
        // 调用API保存通知设置
        api.updateNotificationSettings(this.notificationSettings)
          .then(response => {
            this.$message.success('通知设置已保存');
            this.savingNotifications = false;
          })
          .catch(error => {
            this.$message.error('保存失败: ' + error.message);
            this.savingNotifications = false;
          });
      },
      
      showUploadAvatar() {
        this.avatarUrl = this.userAvatar;
        this.avatarDialogVisible = true;
      },
      
      beforeAvatarUpload(file) {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        
        if (!isImage) {
          this.$message.error('头像只能是图片格式!');
          return false;
        }
        
        if (!isLt2M) {
          this.$message.error('头像大小不能超过2MB!');
          return false;
        }
        
        return true;
      },
      
      handleAvatarSuccess(response) {
        this.avatarUrl = response.url;
      },
      
      saveAvatar() {
        this.savingAvatar = true;
        
        // 调用API保存头像
        api.saveAvatar({ url: this.avatarUrl })
          .then(response => {
            this.userAvatar = this.avatarUrl;
            this.$message.success('头像更新成功');
            this.avatarDialogVisible = false;
            this.savingAvatar = false;
          })
          .catch(error => {
            this.$message.error('头像更新失败: ' + error.message);
            this.savingAvatar = false;
          });
      },
      
      handleAvatarError() {
        // 设置默认头像
        this.userAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%23909399"/%3E%3Cpath d="M20,85 C20,65 80,65 80,85" fill="%23909399"/%3E%3C/svg%3E';
      },
      
      loadTaskStatistics() {
        api.getUserTaskStatistics()
          .then(response => {
            this.statistics = response.data;
            this.renderStatisticsChart();
          })
          .catch(error => {
            console.error('加载任务统计失败:', error);
          });
      },
      
      renderStatisticsChart() {
        if (!this.$refs.chartContainer || typeof echarts === 'undefined') return;
        
        const chart = echarts.init(this.$refs.chartContainer);
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '任务状态',
              type: 'pie',
              radius: '70%',
              data: [
                { value: this.statistics.completedTasks, name: '已完成', itemStyle: { color: '#10b981' } },
                { value: this.statistics.inProgressTasks, name: '进行中', itemStyle: { color: '#f59e0b' } },
                { value: this.statistics.totalTasks - this.statistics.completedTasks - this.statistics.inProgressTasks, name: '未开始', itemStyle: { color: '#909399' } }
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
        
        chart.setOption(option);
      }
    },
    mounted() {
      // 加载用户任务统计
      this.loadTaskStatistics();
      
      // 设置用户头像
      if (!this.userAvatar) {
        this.handleAvatarError();
      }
      
      // 监听tab切换，当切换到任务统计时重新渲染图表
      this.$watch('activeTab', (newVal) => {
        if (newVal === 'statistics') {
          this.$nextTick(() => {
            this.renderStatisticsChart();
          });
        }
      });
    }
  }
};