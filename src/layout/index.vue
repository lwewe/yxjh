<template>
  <el-container class="layout-container">
    <!-- 左侧导航 -->
    <el-aside :width="sidebarOpened ? '240px' : '64px'" class="aside">
      <div class="logo" :class="{ 'logo-collapse': !sidebarOpened }">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="!sidebarOpened" :unique-opened="true"
        :router="true" background-color="#1f2d3d" text-color="#bfcbd9" active-text-color="#409EFF">
        <sidebar-item v-for="item in menuList" :key="item.path" :item="item" :base-path="item.path" />
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
          <span class="balance-btn" v-if="isAdmin" @click="showBalance">
            <i class="el-icon-coin"></i> 余额查询
          </span>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="avatar" class="user-avatar"></el-avatar>
              <span class="username">{{ username }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="clearCache">清除缓存</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <router-view />
      </el-main>

      <el-footer class="footer">
        <div class="footer-content">
          <span>咨询热线：400-966-5938 </span>

          <span>Copyright 2009-2026 All right reserved </span>

          <span> © 2026 悦享聚汇 版权所有</span>
        </div>
      </el-footer>

    </el-container>


    <!-- 余额弹窗 -->
    <el-dialog title="余额查询" :visible.sync="balanceDialogVisible" width="500px" :before-close="handleBalanceClose">
      <div v-loading="balanceLoading">
        <el-table :data="balanceTableData" border stripe style="width: 100%">
          <el-table-column prop="name" label="业务名称" align="center" width="180"></el-table-column>
          <el-table-column prop="amount" label="金额（元）" align="center">
            <template slot-scope="scope">
              <span style="color: #d98911;  ">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import Breadcrumb from './components/Breadcrumb.vue'
import SidebarItem from './components/SidebarItem.vue'
import { mapGetters, mapActions } from 'vuex'
import { clearPermissionCache, viewPermissionCache, getBalance } from '@/api/modules/login'

export default {
  name: 'LayoutIndex',
  components: {
    Breadcrumb,
    SidebarItem
  },
  data() {
    return {
      balanceDialogVisible: false,
      balanceTableData: [],
      balanceLoading: false,
      userAvatar: require('../assets/tx.png')
    }
  },
  computed: {
    ...mapGetters(['username', 'avatar', 'sidebarOpened', 'menuList']),
    isAdmin() {
      const roleId = parseInt(localStorage.getItem('role_id') || '0')
      return roleId === 1 || localStorage.getItem('is_super_admin') === '1'
    },

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
    // 显示余额弹窗
    async showBalance() {
      this.balanceDialogVisible = true
      this.balanceLoading = true
      try {
        const res = await getBalance()
        if (res.code === 200) {
          const data = res.data
          const tableData = []

          // 蛋糕叔叔
          if (data.dangao?.remain_money) {
            tableData.push({ name: '蛋糕叔叔', amount: Number(data.dangao.remain_money).toFixed(2) })
          }
          // 轩夸 - 演出
          const yanchu = data.xuankua?.find(item => item.businessModule === 'D')
          if (yanchu) {
            tableData.push({ name: '轩夸（演出）', amount: Number(yanchu.balance).toFixed(2) })
          }
          // 轩夸 - 电影
          const dianying = data.xuankua?.find(item => item.businessModule === 'M')
          if (dianying) {
            tableData.push({ name: '轩夸（电影）', amount: Number(dianying.balance).toFixed(2) })
          }
          // 奇票
          if (data.qipiao?.balance !== undefined) {
            tableData.push({ name: '奇票', amount: Number(data.qipiao.balance).toFixed(2) })
          }
          // 亿奇达
          if (data.yiqida?.balance !== undefined) {
            tableData.push({ name: '亿奇达（会员）', amount: Number(data.yiqida.balance).toFixed(2) })
          }
          // 岚廷
          if (data.laning?.balance !== undefined) {
            tableData.push({ name: '岚廷（直充）', amount: Number(data.laning.balance).toFixed(2) })
          }
          // 来一票
          if (data.laiyipiao !== undefined) {
            tableData.push({ name: '来一票（景区）', amount: Number(data.laiyipiao).toFixed(2) })
          }
          // 蚂蚁星球（分转元）
          if (data.mayixingqiu?.provision_amount !== undefined) {
            tableData.push({ name: '蚂蚁星球（点餐）', amount: (Number(data.mayixingqiu.provision_amount) / 100).toFixed(2) })
          }

          this.balanceTableData = tableData
        } else {
          this.$message.error(res.msg || '获取余额失败')
        }
      } catch (error) {
        console.error('获取余额失败:', error)
        this.$message.error('获取余额失败')
      } finally {
        this.balanceLoading = false
      }
    },

    // 关闭余额弹窗
    handleBalanceClose() {
      this.balanceDialogVisible = false
      this.balanceTableData = []
    },
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
    },

    async handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/profile')
          break
        case 'password':
          this.$router.push('/password/change')
          break
        case 'clearCache':
          await this.handleClearCache()
          break
        case 'logout':
          this.logout()
          break
      }
    },

    // 查看并清除权限缓存
    async handleClearCache() {
      try {
        const roleId = localStorage.getItem('role_id')

        if (!roleId || roleId === '0') {
          this.$message.warning('当前用户未分配角色，无法操作缓存')
          return
        }

        // 先查看缓存
        const viewRes = await viewPermissionCache({ roleId: roleId })

        if (viewRes.code !== 200) {
          this.$message.error(viewRes.msg || '获取缓存信息失败')
          return
        }

        const { cache_data, exists } = viewRes.data
        const roleName = localStorage.getItem('role_name') || '未知'

        // 构建展示内容
        let htmlContent = ``

        if (!exists || !cache_data || cache_data.length === 0) {
          htmlContent += '<p style="color: #909399;">当前无权限缓存数据</p>'
        } else {
          // htmlContent += `<p><strong>缓存权限ID（${cache_data.length}个）：</strong></p>`
          // htmlContent += `<p style="word-break: break-all; color: #409EFF;">[${cache_data.join(', ')}]</p>`
        }

        htmlContent += '<p style="color: #E6A23C;">是否清除当前角色的权限缓存？</p>'

        await this.$confirm(htmlContent, '缓存详情', {
          confirmButtonText: '清除缓存',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })

        // 清除缓存
        const clearRes = await clearPermissionCache({ roleId: roleId })

        if (clearRes.code === 200) {
          this.$message.success('权限缓存清除成功')
          await this.loadMenus()
        } else {
          this.$message.error(clearRes.msg || '清除缓存失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('操作失败:', error)
          this.$message.error('操作失败')
        }
      }
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role_id')
      localStorage.removeItem('role_name')
      localStorage.removeItem('is_super_admin')
      localStorage.removeItem('uid')
      localStorage.removeItem('user_id')
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
      display: flex;
      align-items: center;

      .balance-btn {
        font-size: 14px;
        color: #333333;
        cursor: pointer;
        padding-right: 20px;

        &:hover {
          color: #000000;
        }

        i {
          margin-right: 4px;
        }
      }

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


  .footer {
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  height: 40px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;

  .footer-content {
    font-size: 12px;
    color: #666666;

    .footer-divider {
      margin: 0 10px;
      color: #ddd;
    }

    span {
      &:hover {
        // color: #409EFF;
      }
    }
  }
}
}



</style>