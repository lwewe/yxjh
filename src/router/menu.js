// 菜单配置 
export const menuList = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    meta: { title: '首页', icon: 'el-icon-s-home' }
  },
  {
    path: 'basic',
    name: 'BasicConfig',
    meta: { title: '基本配置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'view',
        name: 'ViewConfig',
        meta: { title: '查看配置' }
      }
    ]
  },
  {
    path: 'compony',
    name: 'ComponyConfig',
    meta: { title: '公司设置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'view',
        name: 'ViewConfig',
        meta: { title: '基本设置' }
      }
    ]
  },
  // 新增的财务管理模块
  {
    path: 'finance',        // 路径前缀，建议使用英文或拼音
    name: 'FinanceManage',
    meta: { title: '财务管理', icon: 'el-icon-coin' }, // 推荐使用 el-icon-coin 或其他货币图标
    children: [
      {
        path: 'statement',   // 子路径，实际路由将为 /finance/statement
        name: 'BillStatement',
        meta: { title: '对账单' }
      },
      {
        path: 'penalty',     // 子路径，实际路由将为 /finance/penalty
        name: 'PenaltyList',
        meta: { title: '罚款列表' }
      }
    ]
  },
  {
    path: 'user',
    name: 'UserManage',
    meta: { title: '后台用户管理', icon: 'el-icon-user' },
    children: [

      // 角色列表（直接放在一级）
      {
        path: 'rolelist',
        name: 'RoleList',
        meta: { title: '角色列表' }
      },
      // 添加角色
      // {
      //   path: 'roleadd',
      //   name: 'AddRole',
      //   meta: { title: '添加角色' }
      // },
      // 节点列表（直接放在一级）
      {
        path: 'nodelist',
        name: 'NodeList',
        meta: { title: '节点列表' }
      },
      // 添加节点
      // {
      //   path: 'nodeadd',
      //   name: 'AddNode',
      //   meta: { title: '添加节点' }
      // },  // 用户列表
      {
        path: 'userlist',
        name: 'UserList',
        meta: { title: '用户列表' }
      },
      // 添加用户
      // {
      //   path: 'useradd',
      //   name: 'AddUser',
      //   meta: { title: '添加用户' }
      // }
    ]
  },
  {
    path: 'carous',
    name: 'CarouselManage',
    meta: { title: '首页设置', icon: 'el-icon-picture' },
    children: [
      {
        path: 'list',
        name: 'CarouselList',
        meta: { title: '轮播图' }
      },
      {
        path: 'syclass',
        name: 'SyclassList',
        meta: { title: '分类列表' }
      }
    ]
  },
  {
    path: 'product',
    name: 'ProductManage',
    meta: { title: '产品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        meta: { title: '产品列表' }
      },
      {
        path: 'category',
        name: 'ProductCategory',
        meta: { title: '产品分类' }
      },
      {
        path: 'brand',
        name: 'BrandList',
        meta: { title: '品牌列表' }
      },
      {
        path: 'address',
        name: 'AddressList',
        meta: { title: '地址列表' }
      }
    ]
  },
  {
    path: 'combopack',
    name: 'ComboPack',
    meta: { title: '礼包管理', icon: 'el-icon-present' },
    children: [
      {
        path: 'list',
        name: 'GiftpackList',
        meta: { title: '礼包列表' }
      }

    ]
  },




  {
    path: 'cake',
    name: 'CakeManage',
    meta: { title: '蛋糕管理', icon: 'el-icon-dessert' },
    children: [
      {
        path: 'carousel',
        name: 'CakeCarousel',
        meta: { title: '轮播图' }
      },
      {
        path: 'category',
        name: 'CakeCategory',
        meta: { title: '分类列表' }
      },
      {
        path: 'list',
        name: 'CakeList',
        meta: { title: '产品列表' }
      },
      {
        path: 'brand',
        name: 'CakeBrand',
        meta: { title: '品牌列表' }
      },
      {
        path: 'address',
        name: 'CakeAddress',
        meta: { title: '地址列表' }
      }
    ]
  },
  {
    path: 'electronic',
    name: 'ElectronicManage',
    meta: { title: '电子券管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'brand',
        name: 'ElectronicBrand',
        meta: { title: '品牌列表' }
      },
      {
        path: 'list',
        name: 'ElectronicList',
        meta: { title: '电子券列表' }
      }
    ]
  },
  {
    path: 'direct',
    name: 'DirectManage',
    meta: { title: '直充管理', icon: 'el-icon-mobile-phone' },
    children: [
      {
        path: 'list',
        name: 'DirectList',
        meta: { title: '直充列表' }
      },
      {
        path: 'brand',
        name: 'DirectBrand',
        meta: { title: '直充品牌' }
      }
    ]
  },
  {
    path: 'card',
    name: 'CardManage',
    meta: { title: '卡券管理', icon: 'el-icon-postcard' },
    children: [
      {
        path: 'carousel',
        name: 'CardCarousel',
        meta: { title: '轮播图' }
      },
      {
        path: 'category',
        name: 'CardCategory',
        meta: { title: '卡券分类' }
      },
      {
        path: 'list',
        name: 'CardList',
        meta: { title: '卡券列表' }
      },
      {
        path: 'spec',
        name: 'CardSpec',
        meta: { title: '规格列表' }
      }
    ]
  },
  {
    path: 'movie',
    name: 'MovieManage',
    meta: { title: '电影管理', icon: 'el-icon-film' },
    children: [
      {
        path: 'carousel',
        name: 'MovieCarousel',
        meta: { title: '轮播图' }
      },
      {
        path: 'city',
        name: 'MovieCity',
        meta: { title: '城市列表' }
      },
      {
        path: 'cinema',
        name: 'MovieCinema',
        meta: { title: '影院列表' }
      }
    ]
  },
  {
    path: 'book',
    name: 'BookManage',
    meta: { title: '图书管理', icon: 'el-icon-reading' },
    children: [
      {
        path: 'carousel',
        name: 'BookCarousel',
        meta: { title: '轮播图' }
      },
      {
        path: 'home-category',
        name: 'BookHomeCategory',
        meta: { title: '首页分类列表' }
      },
      {
        path: 'categorylist',
        name: 'BookCategoryList',
        meta: { title: '分类列表' }
      },
      {
        path: 'list',
        name: 'BookList',
        meta: { title: '图书列表' }
      }, {
        path: 'category',
        name: 'BookCategory',
        meta: { title: '图书分类' }
      },
    ]
  },
  {
    path: 'welfare',
    name: 'WelfareManage',
    meta: { title: '福利卡', icon: 'el-icon-present' },
    children: [
      {
        path: 'unassigned',
        name: 'UnassignedCard',
        meta: { title: '卡列表(未分配)' }
      },
      {
        path: 'list',
        name: 'WelfareCardList',
        meta: { title: '福利卡列表' }
      },
      {
        path: 'category',
        name: 'WelfareCategory',
        meta: { title: '合卡分类图' }
      }


    ]
  }, {
    path: 'voucher',
    name: 'voucherManage',
    meta: { title: '权益券', icon: 'el-icon-present' },
    children: [
      {
        path: 'unvoucher',
        name: 'Unassignedvoucher',
        meta: { title: '券号(未分配)' }
      },
      {
        path: 'list',
        name: 'VoucherCardList',
        meta: { title: '权益券' }
      }



    ]
  },

  {
    path: 'card-book',
    name: 'CardBookManage',
    meta: { title: '卡册', icon: 'el-icon-collection' },
    children: [
      {
        path: 'unassigned',
        name: 'CardBookUnassigned',
        meta: { title: '卡列表(未分配)' }
      },
      {
        path: 'list',
        name: 'CardBookList',
        meta: { title: '卡册列表' }
      },
      {
        path: 'category',
        name: 'CardBookCategory',
        meta: { title: '卡册分类图' }
      }
    ]
  },

  {
    path: 'system-user',
    name: 'SystemUser',
    meta: { title: '用户管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'list',
        name: 'SystemUserList',
        meta: { title: '用户列表' }
      }
    ]
  },
  {
    path: 'mall-order',
    name: 'MallOrder',
    meta: { title: '商城-订单管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'total',
        name: 'MallOrderTotal',
        meta: { title: '订单(总)列表' }
      },
      {
        path: 'express',
        name: 'MallExpress',
        meta: { title: '快递列表' }
      },
      {
        path: 'list',
        name: 'MallOrderList',
        meta: { title: '订单列表' }
      },
      {
        path: 'exchange',
        name: 'MallExchange',
        meta: { title: '兑换订单列表' }
      }
    ]
  },
  {
    path: 'cake-order',
    name: 'CakeOrder',
    meta: { title: '蛋糕-订单管理', icon: 'el-icon-dessert' },
    children: [
      {
        path: 'total',
        name: 'CakeOrderTotal',
        meta: { title: '订单(总)列表' }
      },
      {
        path: 'channel',
        name: 'CakeChannel',
        meta: { title: '渠道订单列表' }
      },
      {
        path: 'prepay',
        name: 'CakePrepay',
        meta: { title: '预付款列表' }
      },
      {
        path: 'list',
        name: 'CakeOrderList',
        meta: { title: '订单列表' }
      }
    ]
  },
  {
    path: 'ticket-order',
    name: 'TicketOrder',
    meta: { title: '电影/卡券', icon: 'el-icon-film' },
    children: [
      {
        path: 'movie',
        name: 'MovieOrder',
        meta: { title: '电影订单列表' }
      },
      {
        path: 'card',
        name: 'CardOrder',
        meta: { title: '卡券订单列表' }
      },
      {
        path: 'direct',
        name: 'DirectOrder',
        meta: { title: '直充订单列表' }
      },
      {
        path: 'show',
        name: 'ShowOrder',
        meta: { title: '演出订单列表' }
      },
      {
        path: 'book',
        name: 'BookOrder',
        meta: { title: '图书订单列表' }
      },
      {
        path: 'scenic',
        name: 'ScenicOrder',
        meta: { title: '景区订单列表' }
      }
    ]
  },
  {
    path: 'meal-order',
    name: 'MealOrder',
    meta: { title: '点餐订单管理', icon: 'el-icon-food' },
    children: [
      {
        path: 'list',
        name: 'MealOrderList',
        meta: { title: '点餐订单列表' }
      },
      {
        path: 'ant',
        name: 'AntOrder',
        meta: { title: '订单列表(蚂蚁)' }
      },
      {
        path: 'qipiao',
        name: 'QipiaoOrder',
        meta: { title: '订单列表(奇票)' }
      }
    ]
  },
  {
    path: 'feedback',
    name: 'Feedback',
    meta: { title: '意见反馈管理', icon: 'el-icon-chat-dot-round' },
    children: [
      {
        path: 'list',
        name: 'FeedbackList',
        meta: { title: '意见反馈列表' }
      },
      {
        path: 'category',
        name: 'FeedbackCategory',
        meta: { title: '意见反馈分类' }
      }
    ]
  },
  {
    path: 'auxiliary',
    name: 'Auxiliary',
    meta: { title: '辅助栏目', icon: 'el-icon-menu' },
    children: [
      {
        path: 'page',
        name: 'SinglePage',
        meta: { title: '单页面' }
      },
      {
        path: 'ad',
        name: 'AdPosition',
        meta: { title: '广告位' }
      }
    ]
  },
  {
    path: 'coupon',
    name: 'Coupon',
    meta: { title: '通兑券-旧', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'unassigned',
        name: 'CouponUnassigned',
        meta: { title: '通兑券(未分配)' }
      },
      {
        path: 'list',
        name: 'CouponList',
        meta: { title: '通兑券' }
      }
    ]
  },
  {
    path: 'password',
    name: 'Password',
    meta: { title: '密码管理', icon: 'el-icon-lock' },
    children: [
      {
        path: 'change',
        name: 'ChangePassword',
        meta: { title: '修改密码' }
      }
    ]
  }
]