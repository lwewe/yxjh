// src/store/menu.js
import { getMenuList } from '@/api/modules/login'

const state = {
  dynamicMenuList: [],
  allRoutes: [],
  isSuperAdmin: 0
}

const mutations = {
  SET_MENU_LIST(state, list) {
    state.dynamicMenuList = list
  },
  SET_ALL_ROUTES(state, routes) {
    state.allRoutes = routes
  },
  SET_IS_SUPER_ADMIN(state, val) {
    state.isSuperAdmin = val
  }
}

const actions = {
  async generateMenu({ commit }) {
    try {
      console.log('开始获取菜单...')
      const res = await getMenuList()
      console.log('菜单数据:', res)
      
      if (res.code === 200) {
        const { menus, is_super_admin } = res.data
        commit('SET_IS_SUPER_ADMIN', is_super_admin)
        
        const processMenus = (list, parentPath = '') => {
          if (!list) return []
          
          return list
            .filter(item => item.status === 1 && item.lmxs === 1)
            .sort((a, b) => a.sort - b.sort)
            .map(item => {
              // 获取路径
              let path = item.url
              if (path && path.startsWith('/')) {
                path = path.substring(1)
              }
              if (!path || path === '') {
                // 使用 title 生成路径
                path = item.title
                  .replace(/[\s\/]/g, '-')
                  .replace(/[()（）]/g, '')
                  .toLowerCase()
              }
              
              // 完整路径（用于路由匹配）
              const fullPath = parentPath ? `${parentPath}/${path}` : `/${path}`
              
              const menuItem = {
                path: path,           // 相对路径
                fullPath: fullPath,   // 完整路径
                name: `menu_${item.id}`,
                meta: {
                  title: item.title,
                  id: item.id,
                  level: item.level,
                  lmxs: item.lmxs,
                  url_api: item.url_api,
                  parentPath: parentPath
                }
              }
              
              // 有子菜单
              if (item.children && item.children.length > 0) {
                const children = processMenus(item.children, fullPath)
                if (children.length > 0) {
                  menuItem.children = children
                  menuItem.component = { render: h => h('router-view') }
                } else {
                  return null
                }
              } else if (item.level === 3 && item.lmxs === 1) {
                // 三级菜单，使用通用组件
                menuItem.component = () => import('@/views/template/List.vue')
              } else {
                return null
              }
              
              return menuItem
            })
            .filter(item => item !== null)
        }
        
        const allFormatted = processMenus(menus)
        console.log('格式化后的所有菜单:', JSON.parse(JSON.stringify(allFormatted)))
        
        const sidebarMenu = allFormatted.filter(item => item && item.meta && item.meta.level === 2)
        console.log('侧边栏菜单:', JSON.parse(JSON.stringify(sidebarMenu)))
        
        commit('SET_MENU_LIST', sidebarMenu)
        commit('SET_ALL_ROUTES', allFormatted)
        
        return allFormatted
      }
      return []
    } catch (error) {
      console.error('获取菜单失败:', error)
      return []
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}