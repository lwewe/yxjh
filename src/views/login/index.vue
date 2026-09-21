<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
          @keyup.enter.native="handleLogin" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;" @click="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/modules/login'
import { getMenuList } from '@/api/modules/login'
import { transformMenusToSidebar } from '@/utils/menuUtils'
import { addDynamicRoutes } from '@/router/dynamicRouter'

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true

          try {
            const response = await login(this.loginForm.username, this.loginForm.password)
            console.log('登录响应:', response)

            if (response.code === 200) {
              // 保存 token
              if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token)
              }

              // 保存用户信息
              if (response.data && response.data.user_info) {
                const userInfo = response.data.user_info
                
                // 基本信息
                localStorage.setItem('username', userInfo.username || '')
                localStorage.setItem('user_id', userInfo.id || '')
                localStorage.setItem('role_id', userInfo.role_id || '')
                localStorage.setItem('role_name', userInfo.role_name || '')
                
                // 重要：user_info.id 就是 uid
                localStorage.setItem('uid', userInfo.id)
                
                // 保存是否为超级管理员
                const isSuperAdmin = userInfo.is_super_admin === 1
                localStorage.setItem('is_super_admin', isSuperAdmin ? '1' : '0')
                
                console.log('=== 登录用户信息 ===')
                console.log('uid:', userInfo.id)
                console.log('username:', userInfo.username)
                console.log('role_id:', userInfo.role_id)
                console.log('role_name:', userInfo.role_name)
                console.log('is_super_admin:', userInfo.is_super_admin)
                console.log('====================')
              } else {
                localStorage.setItem('username', this.loginForm.username)
              }

              // 更新 Vuex 状态
              this.$store.dispatch('setUser', {
                name: response.data?.user_info?.username || this.loginForm.username,
                avatar: require('../../assets/tx.png'),
                userInfo: response.data?.user_info || {}
              })

              // 获取菜单并动态添加路由
              await this.loadMenusAndRoutes()

              this.$message.success(response.msg || '登录成功')

              // 跳转到首页
              const redirect = this.$route.query.redirect || '/'
              this.$router.push(redirect)
            } else {
              this.$message.error(response.msg || '登录失败')
            }
          } catch (error) {
            console.error('登录失败:', error)
            this.$message.error('网络错误，请稍后重试')
          } finally {
            this.loading = false
          }
        }
      })
    },

    // 获取菜单并动态添加路由
    async loadMenusAndRoutes() {
      try {
        const res = await getMenuList()
        console.log('菜单数据:', res)
        
        if (res.code === 200 && res.data && res.data.menus) {
          // 转换菜单为侧边栏格式
          const sidebarMenus = transformMenusToSidebar(res.data.menus)
          // 存储到 Vuex
          this.$store.commit('SET_MENU_LIST', sidebarMenus)
          
          // 添加动态路由
          addDynamicRoutes(this.$router, this.$store, res.data.menus)
          
          console.log('动态路由添加完成')
        }
      } catch (error) {
        console.error('获取菜单失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;

  .login-form {
    width: 400px;
    padding: 35px;
    background-color: #fff;
    border-radius: 4px;

    .title-container {
      text-align: center;
      margin-bottom: 30px;

      .title {
        color: #333;
        font-size: 26px;
      }
    }

    .tips {
      margin-top: 20px;
      font-size: 14px;
      color: #999;
      text-align: center;

      span {
        margin: 0 10px;
      }
    }
  }
}
</style>