import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: localStorage.getItem('username') || '',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      userId: localStorage.getItem('user_id') || '',
      roleId: localStorage.getItem('role_id') || '',
      roleName: localStorage.getItem('role_name') || '',
      userInfo: null
    },
    sidebar: {
      opened: true
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = { ...state.user, ...user }
    },
    SET_SIDEBAR_OPENED: (state, opened) => {
      state.sidebar.opened = opened
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    toggleSidebar({ commit, state }) {
      commit('SET_SIDEBAR_OPENED', !state.sidebar.opened)
    }
  },
  getters: {
    username: state => state.user.name,
    avatar: state => state.user.avatar,
    userId: state => state.user.userId,
    roleId: state => state.user.roleId,
    roleName: state => state.user.roleName,
    userInfo: state => state.user.userInfo,
    sidebarOpened: state => state.sidebar.opened
  }
})