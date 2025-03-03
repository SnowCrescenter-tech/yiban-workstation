/**
 * 登录相关组件
 * 提供登录、注册等功能
 */

import { handleImageError } from './utils.js';
import { images } from './localImages.js';

export const LoginComponents = {
  // 登录组件
  Login: {
    template: `
      <div class="login-page">
        <div class="login-container">
          <h2>易班工作站管理系统</h2>
          
          <el-form ref="loginForm" :model="form" :rules="rules" @submit.prevent="handleSubmit">
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            
            <div class="forgot-password">
              <a href="#" @click.prevent="forgotPassword">忘记密码？</a>
            </div>
            
            <el-form-item class="login-button-container">
              <el-button type="primary" class="login-button" native-type="submit" :loading="isLoading" :disabled="isLoading">
                {{ isLoading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
            
            <div class="login-message" v-if="loginMessage">
              <el-alert :title="loginMessage" type="error" show-icon :closable="false"></el-alert>
            </div>
            
            <div class="back-to-home">
              <a href="#" @click.prevent="$emit('navigate', 'LandingPage')">返回首页</a>
            </div>
          </el-form>
          
          <div class="test-accounts" v-if="showTestAccounts">
            <div class="test-accounts-title">测试账号：</div>
            <el-button size="small" @click="fillTestAccount('admin')">管理员账号</el-button>
            <el-button size="small" @click="fillTestAccount('manager')">部门负责人</el-button>
            <el-button size="small" @click="fillTestAccount('user')">普通成员</el-button>
          </div>
        </div>
      </div>
    `,
    props: {
      loginMessage: String,
      isLoading: Boolean
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        showTestAccounts: true // 开发环境中显示测试账号
      };
    },
    methods: {
      async handleSubmit() {
        try {
          // 表单验证
          await this.$refs.loginForm.validate();
          
          // 触发登录事件
          this.$emit('login', {
            username: this.form.username,
            password: this.form.password
          });
        } catch (error) {
          console.error('表单验证失败:', error);
        }
      },
      
      fillTestAccount(type) {
        switch (type) {
          case 'admin':
            this.form.username = 'admin';
            this.form.password = 'admin123';
            break;
          case 'manager':
            this.form.username = 'manager1';
            this.form.password = '123456';
            break;
          case 'user':
            this.form.username = 'user1';
            this.form.password = '123456';
            break;
        }
      },
      
      forgotPassword() {
        this.$message.info('请联系系统管理员重置密码');
      }
    }
  },
  
  // 忘记密码组件
  ForgotPassword: {
    template: `
      <div class="forgot-password-page">
        <div class="login-container">
          <h2>找回密码</h2>
          
          <el-form ref="forgotForm" :model="form" :rules="rules">
            <el-form-item prop="email">
              <el-input v-model="form.email" placeholder="请输入您的邮箱" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            
            <el-form-item class="captcha-container" prop="captcha">
              <el-input v-model="form.captcha" placeholder="验证码"></el-input>
              <div class="captcha-image" @click="refreshCaptcha">{{ captchaText }}</div>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" class="login-button" @click="handleSubmit" :loading="isLoading">
                {{ isLoading ? '提交中...' : '提交' }}
              </el-button>
            </el-form-item>
            
            <div class="back-to-login">
              <a href="#" @click.prevent="$emit('navigate', 'Login')">返回登录</a>
            </div>
          </el-form>
          
          <el-alert v-if="message.text" :title="message.text" :type="message.type" show-icon></el-alert>
        </div>
      </div>
    `,
    data() {
      return {
        form: {
          email: '',
          captcha: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        captchaText: '1234',
        isLoading: false,
        message: {
          text: '',
          type: 'info'
        }
      };
    },
    methods: {
      refreshCaptcha() {
        // 生成随机验证码
        this.captchaText = Math.floor(1000 + Math.random() * 9000).toString();
      },
      
      async handleSubmit() {
        try {
          await this.$refs.forgotForm.validate();
          this.isLoading = true;
          
          // 模拟API请求
          setTimeout(() => {
            this.isLoading = false;
            this.message = {
              text: '密码重置链接已发送到您的邮箱，请查收',
              type: 'success'
            };
            
            // 3秒后返回登录页
            setTimeout(() => {
              this.$emit('navigate', 'Login');
            }, 3000);
          }, 1500);
        } catch (error) {
          console.error('表单验证失败:', error);
        }
      }
    },
    mounted() {
      this.refreshCaptcha();
    }
  },
  
  // 重置密码组件
  ResetPassword: {
    template: `
      <div class="reset-password-page">
        <div class="login-container">
          <h2>重置密码</h2>
          
          <el-form ref="resetForm" :model="form" :rules="rules">
            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" placeholder="新密码" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" placeholder="确认新密码" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" class="login-button" @click="handleSubmit" :loading="isLoading">
                {{ isLoading ? '提交中...' : '重置密码' }}
              </el-button>
            </el-form-item>
            
            <div class="back-to-login">
              <a href="#" @click.prevent="$emit('navigate', 'Login')">返回登录</a>
            </div>
          </el-form>
          
          <el-alert v-if="message.text" :title="message.text" :type="message.type" show-icon></el-alert>
        </div>
      </div>
    `,
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      
      return {
        form: {
          password: '',
          confirmPassword: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        isLoading: false,
        message: {
          text: '',
          type: 'info'
        }
      };
    },
    methods: {
      async handleSubmit() {
        try {
          await this.$refs.resetForm.validate();
          this.isLoading = true;
          
          // 模拟API请求
          setTimeout(() => {
            this.isLoading = false;
            this.message = {
              text: '密码重置成功，请使用新密码登录',
              type: 'success'
            };
            
            // 3秒后返回登录页
            setTimeout(() => {
              this.$emit('navigate', 'Login');
            }, 3000);
          }, 1500);
        } catch (error) {
          console.error('表单验证失败:', error);
        }
      }
    }
  }
};
