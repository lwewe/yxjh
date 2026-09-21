/**
 * 获取菜单路径（优先级：url > url_api > id）
 * @param {Object} menu 菜单项
 * @returns {string} 路由路径
 */
function getMenuPath(menu) {
  // 1. 优先使用 url 字段
  // 注意：空字符串也要排除
  if (menu.url && menu.url !== null && menu.url !== '' && menu.url.trim() !== '') {
    let path = menu.url
    // 去掉开头的 /
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    if (path !== '') {
      return path
    }
  }

  // 2. 其次使用 url_api
  if (menu.url_api && menu.url_api !== null && menu.url_api !== '') {
    return convertApiToPath(menu.url_api)
  }

  // 3. 最后使用 title 转换（而不是用 id）
  return convertTitleToPath(menu.title)
}
function convertTitleToPath(title) {
  const pathMap = {
    '基本配置': 'basic',
    '公司管理': 'compony',
    '后台用户管理': 'user',
    '首页': 'carous',
    '产品管理': 'product',
    '蛋糕管理': 'cake',
    '电子券管理': 'electronic',
    '直充管理': 'direct',
    '卡券管理': 'card',
    '电影管理': 'movie',
    '图书管理': 'book',
    '福利卡': 'welfare',
    '权益券': 'voucher',
    '卡册': 'card-book',
    '用户管理': 'system-user',
    '商城订单': 'mall-order',
    '蛋糕订单': 'cake-order',

    '电影/卡券': 'ticket-order',
    '点餐订单管理': 'meal-order',
    '意见反馈管理': 'feedback',
    '辅助栏目': 'auxiliary',
    '密码管理': 'password',


  }
  // return pathMap[title] || title.replace(/[\u4e00-\u9fa5]/g, '').toLowerCase() || `menu-${menu.id}`
  return pathMap[title] || title.replace(/[\u4e00-\u9fa5]/g, '').toLowerCase()
}
/**
 * 将 API 路径转换为前端路由路径
 * @param {string} apiPath 如 "v1.company.Webconfig/index"
 * @returns {string} 如 "company/webconfig/index"
 */
function convertApiToPath(apiPath) {
  if (!apiPath) return ''
  // 去掉 v1. 前缀，将点号和斜杠统一处理
  let path = apiPath.replace(/^v1\./, '').replace(/\./g, '/')
  // 处理反斜杠
  path = path.replace(/\\/g, '/')
  return path.toLowerCase()
}

/**
 * 将后端菜单数据转换为前端路由格式
 */
export function transformMenusToRoutes(menus) {
  console.log('transformMenusToSidebar 收到的数据:', menus)
  console.log('数据类型:', Array.isArray(menus))
  const routes = []

  menus.forEach(menu => {
    console.log('处理菜单项:', menu)
    console.log('status:', menu.status, 'level:', menu.level, 'lmxs:', menu.lmxs)

    // 只处理 level=2 的模块，且 status=1 可用，lmxs=1 显示
    // if (menu.status !== 1)  return
    // if (menu.level !== 2) return
    // if (menu.lmxs !== 1) return

    if (menu.status !== 1) {
      console.log('跳过：status !== 1')
      return
    }
    if (menu.level !== 2) {
      console.log('跳过：level !== 2')
      return
    }
    if (menu.lmxs !== 1) {
      console.log('跳过：lmxs !== 1')
      return
    }


    const menuPath = getMenuPath(menu)

    const route = {
      path: menuPath,
      name: menu.title,
      component: { render: h => h('router-view') },
      meta: {
        title: menu.title,
        icon: getMenuIcon(menu.title),
        requiresAuth: true
      },
      children: []
    }

    // 处理子菜单 (level=3)
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(child => {
        if (child.status !== 1) return
        // 只有 lmxs=1 的子菜单才生成页面路由
        if (child.lmxs !== 1) return

        const childPath = getMenuPath(child)
        const componentPath = getComponentPath(child.title)

        route.children.push({
          path: childPath,
          name: child.title,
          component: componentPath
            ? () => import(`@/views${componentPath}`)
            : () => import('@/views/dashboard/index.vue'),
          meta: {
            title: child.title,
            requiresAuth: true
          }
        })
      })
    }

    // 有子菜单才添加路由
    if (route.children.length > 0) {
      routes.push(route)
    }
  })

  return routes
}

/**
 * 将后端菜单数据转换为侧边栏菜单格式
 */
export function transformMenusToSidebar(menus) {
  const sidebarMenus = []

  menus.forEach(menu => {
    if (menu.status !== 1) return
    if (menu.level !== 2) return
    if (menu.lmxs !== 1) return

    const menuPath = getMenuPath(menu)

    const sidebarItem = {
      path: menuPath,
      name: menu.title,
      meta: {
        title: menu.title,
        icon: getMenuIcon(menu.title)
      },
      children: []
    }

    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(child => {
        if (child.status !== 1) return
        // 只有 lmxs=1 的子菜单才显示在侧边栏
        if (child.lmxs !== 1) return

        const childPath = getMenuPath(child)

        sidebarItem.children.push({
          path: childPath,
          name: child.title,
          meta: {
            title: child.title
          }
        })
      })
    }

    if (sidebarItem.children.length > 0) {
      sidebarMenus.push(sidebarItem)
    }
  })

  return sidebarMenus
}

/**
 * 根据菜单标题映射组件路径
 */
function getComponentPath(title) {
  const componentMap = {
    // 基本配置
    '查看配置': '/basic/view.vue',
    '保存配置': '/basic/save.vue',
    // 公司管理
    '基本设置': '/company/setting.vue',
    '保存基本设置': '/company/save.vue',
    // 后台用户管理
    '角色列表': '/user/RoleList.vue',
    '节点列表': '/user/NodeList.vue',
    '用户列表': '/user/UserList.vue',
    // 首页
    '轮播图列表': '/home/CarouselList.vue',
    '首页分类列表': '/home/CategoryList.vue',
    // 产品管理
    '产品列表': '/product/ProductList.vue',
    '分类列表': '/product/CategoryList.vue',
    '品牌列表': '/product/BrandList.vue',
    '地址列表': '/product/AddressList.vue',
    // 蛋糕管理
    '轮播图列表': '/cake/CarouselList.vue',
    '蛋糕分类列表': '/cake/CategoryList.vue',


    // ========== 电子券管理 ==========
    '品牌列表': '/electronic/ElectronicBrand.vue',
    '电子券列表': '/electronic/ElectronicList.vue',

    // ========== 直充管理 ==========
    '直充品牌': '/direct/DirectBrand.vue',
    '直冲列表': '/direct/DirectList.vue',

    // ========== 卡券管理 ==========
    '轮播图': '/card/CardCarousel.vue',
    '卡券分类': '/card/CardCategory.vue',
    '卡券列表': '/card/CardList.vue',
    '规格列表': '/card/CardSpec.vue',

    // ========== 电影管理 ==========
    '轮播图': '/movie/MovieCarousel.vue',
    '城市列表': '/movie/MovieCity.vue',
    '影院列表': '/movie/MovieCinema.vue',

    // ========== 图书管理 ==========
    '轮播图': '/book/BookCarousel.vue',
    '首页分类列表': '/book/BookHomeCategory.vue',
    '分类列表': '/book/BookCategoryList.vue',
    '图书列表': '/book/BookList.vue',
    '图书分类': '/book/BookCategory.vue',

    '卡列表(未分配)': '/welfare/UnassignedCard.vue',
    '福利卡列表': '/welfare/WelfareCardList.vue',
    '合卡分类图': '/welfare/WelfareCategory.vue',
    '福利卡查询': '/welfare/CardNumsearch.vue',
    '福利卡号': '/welfare/CardNum.vue',
    '福利卡轮播图': '/welfare/cardLbt.vue',
    '福利卡分类': '/welfare/ClassFiy.vue',
    '福利卡权限': '/welfare/PerView.vue',
    '新增合卡分类': '/welfare/AddWelfareCategory.vue',

    // ========== 权益券 ==========
    '券号(未分配)': '/voucher/Unassignedvoucher.vue',
    '权益券列表': '/voucher/VoucherCardList.vue',
    '权益券查询': '/voucher/CardNumsearch.vue',
    '权益券号': '/voucher/CardNum.vue',
    '权益券轮播图': '/voucher/cardLbt.vue',
    '权益券分类': '/voucher/ClassFiy.vue',

    // ========== 卡册 ==========
    '卡册(未分配)': '/card-book/UnassignedCard.vue',
    '卡册列表': '/card-book/CardBookList.vue',
    '卡册分类图': '/card-book/CardBookCategory.vue',
    '卡号查询': '/card-book/CardbookNumsearch.vue',
    '卡号': '/card-book/CardbookNum.vue',
    '卡册轮播图': '/card-book/cardLbt.vue',
    '卡册分类': '/card-book/ClassFiy.vue',
    '卡册新分类': '/card-book/ClassFiynew.vue',
    '卡册权限': '/card-book/PerView.vue',
    '新增卡册分类': '/card-book/AddWelfareCategory.vue',

    // ========== 用户管理 ==========
    '用户列表': '/system-user/SystemUserList.vue',
    '收货地址': '/system-user/AddDress.vue',
    '购物车': '/system-user/ShopCart.vue',
    '福利卡信息': '/system-user/FuliCard.vue',

    // ========== 商城订单 ==========
    '订单(总)列表': '/mall-order/MallOrderTotal.vue',
    '快递列表': '/mall-order/MallExpress.vue',
    '订单列表': '/mall-order/MallOrderList.vue',
    '兑换订单列表': '/mall-order/MallExchange.vue',

    // ========== 蛋糕订单 ==========
    '订单(总)列表': '/cake-order/CakeOrderTotal.vue',
    '渠道订单列表': '/cake-order/CakeChannel.vue',
    '预付款列表': '/cake-order/CakePrepay.vue',
    '订单列表': '/cake-order/CakeOrderList.vue',



    // ========== 电影/卡券（新增） ==========
    '电影订单列表': '/ticket-order/MovieOrder.vue',
    '卡券订单列表': '/ticket-order/CardOrder.vue',
    '直充订单列表': '/ticket-order/DirectOrder.vue',
    '演出订单列表': '/ticket-order/ShowOrder.vue',
    '图书订单列表': '/ticket-order/BookOrder.vue',
    '景区订单列表': '/ticket-order/ScenicOrder.vue',

    // ========== 点餐订单管理（新增） ==========
    '点餐订单列表': '/meal-order/MealOrderList.vue',
    '订单列表(蚂蚁)': '/meal-order/AntOrder.vue',
    '订单列表(奇票)': '/meal-order/QipiaoOrder.vue',

    // ========== 意见反馈管理（新增） ==========
    '意见反馈列表': '/feedback/FeedbackList.vue',
    '意见反馈分类': '/feedback/FeedbackCategory.vue',

    // ========== 辅助栏目（新增） ==========
    '单页面': '/auxiliary/SinglePage.vue',
    '广告位': '/auxiliary/AdPosition.vue',

    // ========== 密码管理（新增） ==========
    '修改密码': '/password/ChangePassword.vue',



  }

  return componentMap[title] || null
}

/**
 * 根据菜单标题获取图标
 */
function getMenuIcon(title) {
  const iconMap = {
    '基本配置': 'el-icon-setting',
    '公司管理': 'el-icon-office-building',
    '后台用户管理': 'el-icon-user',
    '首页': 'el-icon-s-home',
    '产品管理': 'el-icon-goods',
    '蛋糕管理': 'el-icon-dessert',
    '电子券管理': 'el-icon-tickets',
    '直充管理': 'el-icon-mobile-phone',
    '卡券管理': 'el-icon-postcard',
    '电影管理': 'el-icon-film',
    '图书管理': 'el-icon-reading',
    '福利卡': 'el-icon-present',
    '权益券': 'el-icon-medal',
    '卡册': 'el-icon-collection',
    '用户管理': 'el-icon-user-solid',
    '商城订单': 'el-icon-s-order',
    '蛋糕订单': 'el-icon-s-order',


    '电影/卡券': 'el-icon-film',
    '点餐订单管理': 'el-icon-food',
    '意见反馈管理': 'el-icon-edit-outline',
    '辅助栏目': 'el-icon-document',
    '密码管理': 'el-icon-lock',




  }
  return iconMap[title] || 'el-icon-menu'
}