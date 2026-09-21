<template>
  <el-container class="layout-container">
    <!-- 左侧导航 -->
    <el-aside :width="sidebarOpened ? '240px' : '64px'" class="aside">
      <div class="logo" :class="{ 'logo-collapse': !sidebarOpened }">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="!sidebarOpened"
        :unique-opened="true"
        :router="true"
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item 
          v-for="item in menuList" 
          :key="item.path" 
          :item="item" 
          :base-path="item.path" 
        />
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <div class="home-icon-wrapper" @click="goHome">
            <i class="el-icon-s-home home-icon"></i>
          </div>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="avatar" class="user-avatar"></el-avatar>
              <span class="username">{{ username }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Breadcrumb from './components/Breadcrumb.vue'
import SidebarItem from './components/SidebarItem.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LayoutIndex',
  components: {
    Breadcrumb,
    SidebarItem
  },
  data() {
    return {
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  computed: {
    ...mapGetters(['username', 'avatar', 'sidebarOpened', 'menuList']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  created() {
    this.loadMenus()
  },
  methods: {
    goHome() {
      if (this.$route.path === '/dashboard') {
        return
      } else {
        this.$router.push('/dashboard')
      }
    },
    ...mapActions(['toggleSidebar', 'getMenuList']),
    async loadMenus() {
      const menus = await this.getMenuList()
      // 这里可以添加动态路由
      // const { addDynamicRoutes } = await import('@/router/dynamicRouter')
      // addDynamicRoutes(this.$router, this.$store, menus)
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/profile')
          break
        case 'password':
          this.$router.push('/password/change')
          break
        case 'logout':
          this.logout()
          break
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.el-menu.el-menu--inline .el-menu-item.is-active {
  background-color: #409EFF !important;
  color: #ffffff !important;
}
</style>

<style lang="scss" scoped>
.home-icon-wrapper {
  opacity: 0.8;
  margin-right: 6px;
}
.home-icon-wrapper:hover {
  opacity: 1;
  cursor: pointer;
}
.layout-container {
  height: 100%;
  
  .aside {
    background-color: #304156;
    transition: width 0.3s;
    overflow-x: hidden;
    
     overflow-y: auto; // 允许垂直滚动，但隐藏滚动条

       // 隐藏滚动条 - Firefox
    scrollbar-width: none;
    // 隐藏滚动条 - IE/Edge
    -ms-overflow-style: none;
    
    // 隐藏滚动条 - Chrome/Safari
    &::-webkit-scrollbar {
      display: none;
    }
    .logo {
      height: 70px;
      line-height: 68px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      background-color: #1f2d3d;
      white-space: nowrap;
      overflow: hidden;
      
      img {
        height: 60px;
        vertical-align: middle;
      }
      
      &.logo-collapse {
        font-size: 14px;
      }
    }
    
    .el-menu-vertical {
      border-right: none;
      height: calc(100% - 60px);
      
        // 隐藏滚动条 - Firefox
      scrollbar-width: none;
      // 隐藏滚动条 - IE/Edge
      -ms-overflow-style: none;
      
      // 隐藏滚动条 - Chrome/Safari
      &::-webkit-scrollbar {
        display: none;
      }
      
      &:not(.el-menu--collapse) {
        width: 240px;
        text-align: left;
      }
    }
  }
  
  .header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .header-left {
      display: flex;
      align-items: center;
      
      .collapse-icon {
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
    
    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .user-avatar {
          margin-right: 8px;
        }
        
        .username {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
  
  .main {
    background-color: #f0f2f5;
    padding: 20px;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}
</style>