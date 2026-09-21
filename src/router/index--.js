// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(VueRouter)

// 基础路由（不需要接口的）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'el-icon-s-home',
          requiresAuth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

// 是否已添加动态路由
let hasAddedRoutes = false

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 后台管理系统` : '后台管理系统'

  const token = localStorage.getItem('token')

  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      Message.error('请先登录')
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    if (!hasAddedRoutes) {
      try {
        const allMenus = await store.dispatch('menu/generateMenu')

        // 递归添加路由
        function addRouteRecursive(menuList) {
          menuList.forEach(menu => {
            const route = {
              path: menu.path,
              name: menu.name,
              component: menu.component || { render: h => h('router-view') },
              meta: { ...menu.meta, requiresAuth: true },
              children: []
            }

            if (menu.children && menu.children.length > 0) {
              route.children = menu.children.map(child => ({
                path: child.path,
                name: child.name,
                component: child.component || { render: h => h('router-view') },
                meta: { ...child.meta, requiresAuth: true }
              }))
            }

            router.addRoute(route)
          })
        }

        addRouteRecursive(allMenus)

        hasAddedRoutes = true
        next({ ...to, replace: true })
      } catch (error) {
        console.error('动态路由添加失败:', error)
        Message.error('获取菜单失败')
        next('/login')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router