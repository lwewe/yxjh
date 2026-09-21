import Vue from 'vue'
import Vuex from 'vuex'
import { getMenuList } from '@/api/modules/login'
import { transformMenusToSidebar } from '@/utils/menuUtils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: localStorage.getItem('username') || '',
      avatar: require('../assets/tx.png'),
      userId: localStorage.getItem('user_id') || '',
      roleId: localStorage.getItem('role_id') || '',
      roleName: localStorage.getItem('role_name') || '',
      userInfo: null
    },
    sidebar: {
      opened: true
    },
    menuList: [], // 存储动态菜单
    routes: [] // 存储动态路由
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = { ...state.user, ...user }
    },
    SET_SIDEBAR_OPENED: (state, opened) => {
      state.sidebar.opened = opened
    },
    SET_MENU_LIST: (state, menus) => {
      state.menuList = menus
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    toggleSidebar({ commit, state }) {
      commit('SET_SIDEBAR_OPENED', !state.sidebar.opened)
    },
    // 获取菜单
    async getMenuList({ commit }) {
      try {
        const res = await getMenuList()
        if (res.code === 200 && res.data && res.data.menus) {
          const sidebarMenus = transformMenusToSidebar(res.data.menus)
          commit('SET_MENU_LIST', sidebarMenus)
          return sidebarMenus
        }
        return []
      } catch (error) {
        console.error('获取菜单失败:', error)
        return []
      }
    }
  },
  getters: {
    username: state => state.user.name,
    avatar: state => state.user.avatar,
    userId: state => state.user.userId,
    roleId: state => state.user.roleId,
    roleName: state => state.user.roleName,
    userInfo: state => state.user.userInfo,
    sidebarOpened: state => state.sidebar.opened,
    menuList: state => state.menuList
  }
})