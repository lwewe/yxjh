import { transformMenusToRoutes } from '@/utils/menuUtils'

// 基础静态路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: {
      title: '登录',
      noAuth: true
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
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

// 动态添加路由的方法
export function addDynamicRoutes(router, store, menus) {
  const dynamicRoutes = transformMenusToRoutes(menus)
  
  // 将动态路由添加到router中
  dynamicRoutes.forEach(route => {
    // 检查路由是否已存在
    const existingRoute = router.options.routes.find(r => 
      r.path === '/' && r.children && r.children.find(c => c.path === route.path)
    )
    
    if (!existingRoute) {
      router.addRoute('/', route)
    }
  })
  
  // 存储到store
  store.commit('SET_ROUTES', dynamicRoutes)
  
  return dynamicRoutes
}