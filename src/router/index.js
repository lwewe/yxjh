import Vue from 'vue'
import VueRouter from 'vue-router'
import { menuList } from './menu'
import { Message } from 'element-ui'  // 引入 Message 组件

Vue.use(VueRouter)

// 基础路由
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: {
      title: '登录',
      noAuth: true  // 标记不需要登录
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true  // 标记需要登录
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
      },
      // 手动配置 basic 路由
      {
        path: 'basic',
        name: 'BasicConfig',
        component: { render: h => h('router-view') },
        meta: {
          title: '基本配置',
          icon: 'el-icon-setting',
          requiresAuth: true
        },
        children: [
          {
            path: 'view',
            name: 'ViewConfig',
            component: () => import('@/views/basic/view.vue'),
            meta: {
              title: '查看配置',
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: 'compony',
        name: 'ComponyConfig',
        component: { render: h => h('router-view') },
        meta: {
          title: '公司设置',
          icon: 'el-icon-setting',
          requiresAuth: true
        },
        children: [
          {
            path: 'view',
            name: 'ViewConfig',
            component: () => import('@/views/compony/view.vue'),
            meta: {
              title: '基本设置',
              requiresAuth: true
            }
          }
        ]
      },

      {
        path: 'finance',
        name: 'FinanceManage',
        component: { render: h => h('router-view') },
        meta: {
          title: '财务管理',
          icon: 'el-icon-coin',
          requiresAuth: true
        },
        children: [
          {
            path: 'statement',
            name: 'BillStatement',
            component: () => import('@/views/finance/BillStatement.vue'),
            meta: {
              title: '对账单',
              requiresAuth: true
            },
            children: [
              {
                path: 'lookorders',
                name: 'LookOrders',
                component: () => import('@/views/finance/LookOrders.vue'),
                meta: {
                  title: '查看订单',
                  requiresAuth: true
                }
              }],
          }, {
            path: 'penalty',
            name: 'PenaltyList',
            component: () => import('@/views/finance/PenaltyList.vue'),
            meta: {
              title: '罚款列表',
              requiresAuth: true
            }
          }
        ]
      },


      {
        path: 'user',
        name: 'UserConfig',
        component: { render: h => h('router-view') },
        meta: {
          title: '后台用户管理',
          icon: 'el-icon-user',
          requiresAuth: true
        },
        children: [
          {
            path: 'userlist',
            name: 'UserList',
            component: () => import('@/views/user/UserList.vue'),
            meta: {
              title: '用户列表',
              requiresAuth: true
            }
          },
          // {
          //   path: 'useradd',
          //   component: () => import('@/views/user/UserAdd.vue'),
          //   meta: { 
          //     title: '添加用户',
          //     requiresAuth: true 
          //   }
          // },
          {
            path: 'rolelist',
            component: () => import('@/views/user/RoleList.vue'),
            meta: {
              title: '角色列表',
              requiresAuth: true
            }
          },
          // {
          //   path: 'roleadd',
          //   component: () => import('@/views/user/RoleAdd.vue'),
          //   meta: { 
          //     title: '添加角色',
          //     requiresAuth: true 
          //   }
          // },
          {
            path: 'nodelist',
            component: () => import('@/views/user/NodeList.vue'),
            meta: {
              title: '节点列表',
              requiresAuth: true
            }
          },
          // {
          //   path: 'nodeadd',
          //   component: () => import('@/views/user/NodeAdd.vue'),
          //   meta: { 
          //     title: '添加节点',
          //     requiresAuth: true 
          //   }
          // }
        ]
      },
      {
        path: 'carous',
        name: 'CarouselManage',
        component: { render: h => h('router-view') },
        meta: {
          title: '首页设置',
          icon: 'el-icon-setting',
          requiresAuth: true
        },
        children: [
          {
            path: 'list/:id?',
            name: 'CarouselList',
            component: () => import('@/views/carous/CarouselList.vue'),
            meta: {
              title: '轮播图',
              requiresAuth: true
            }, children: [
              {
                path: 'addclass',
                name: 'AddclassiFication',
                component: () => import('@/views/carous/AddclassiFication.vue'),
                meta: {
                  title: '关联分类',
                  requiresAuth: true
                }
              },
            ]
          },

          {
            path: 'syclass',
            name: 'SyclassList',
            component: () => import('@/views/carous/SyclassList.vue'),
            meta: {
              title: '分类列表',
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: 'product',
        name: 'ProductManage',
        component: { render: h => h('router-view') },
        meta: {
          title: '产品管理',
          icon: 'el-icon-setting',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('@/views/product/ProductList.vue'),
            meta: {
              title: '产品列表',
              requiresAuth: true,
            }, children: [
              {
                path: 'addproduct/:id?',
                name: 'AddPro',
                component: () => import('@/views/product/AddPro.vue'),
                meta: {
                  title: '增加产品',
                  requiresAuth: true
                }
              }
            ]
          },

          {
            path: 'addbrand',
            name: 'AddBrand',
            component: () => import('@/views/product/AddBrand.vue'),
            meta: {
              title: '增加品牌',
              requiresAuth: true
            }
          },

          {
            path: 'category',
            name: 'ProductCategory',
            component: () => import('@/views/product/ProductCategory.vue'),
            meta: {
              title: '产品分类',
              requiresAuth: true
            }, children: [
              {
                path: 'categorybrand/:id?',
                name: 'ProductCategoryBrand',
                component: () => import('@/views/product/ProductCategoryBrand.vue'),
                meta: {
                  title: '品牌关联',
                  requiresAuth: true
                }
              }, {
                path: 'addcategory',
                name: 'AddCategory',
                component: () => import('@/views/product/AddCategory.vue'),
                meta: {
                  title: '增加分类',
                  requiresAuth: true
                }
              },
            ]

          }, {
            path: 'brand',
            name: 'BrandList',
            component: () => import('@/views/product/BrandList.vue'),
            meta: {
              title: '品牌列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addbrand',
                name: 'AddBrandpro',
                component: () => import('@/views/product/AddBrand.vue'),
                meta: {
                  title: '添加品牌',
                  requiresAuth: true
                }
              }
            ]




          }, {
            path: 'address',
            name: 'AddressList',
            component: () => import('@/views/product/AddressList.vue'),
            meta: {
              title: '地址列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addresslistdetails/:id?',
                name: 'AddressListdetails',
                component: () => import('@/views/product/AddressListdetails.vue'),
                meta: {
                  title: '地址详情',
                  requiresAuth: true
                }
              }
            ]
          }
        ]
      },
      {
        path: 'combopack',
        name: 'ComboPack',
        component: { render: h => h('router-view') },
        meta: {
          title: '礼包管理',
          icon: 'el-icon-present',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'GiftpackList',
            component: () => import('@/views/comboPack/GiftpackList.vue'),
            meta: {
              title: '礼包列表',
              requiresAuth: true,
            }, children: [
              {
                path: 'addpack/:id?',
                name: 'AddPack',
                component: () => import('@/views/comboPack/AddPack.vue'),
                meta: {
                  title: '增加礼包',
                  requiresAuth: true
                }
              }
            ]
          },
        ]
      },
      {
        path: 'cake',
        name: 'CakeManage',
        component: { render: h => h('router-view') },


        meta: {
          title: '蛋糕管理',
          icon: 'el-icon-setting',
          requiresAuth: true
        },
        children: [
          {
            path: 'carousel',
            name: 'CakeCarousel',
            component: () => import('@/views/cake/CakeCarousel.vue'),
            meta: {
              title: '轮播图',
              requiresAuth: true
            }
          },
          {
            path: 'category',
            name: 'CakeCategory',
            component: () => import('@/views/cake/CakeCategory.vue'),
            meta: {
              title: '分类列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addcakeclass',
                name: 'CakeCategoryFl',
                component: () => import('@/views/cake/CakeCategoryFl.vue'),
                meta: {
                  title: '关联分类',
                  requiresAuth: true
                }
              },
            ]
          },
          {
            path: 'list',
            name: 'CakeList',
            component: () => import('@/views/cake/CakeList.vue'),
            meta: {
              title: '产品列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addprocake/:id?',
                name: 'AddProcake',
                component: () => import('@/views/cake/AddPro.vue'),
                meta: {
                  title: '增加蛋糕',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'brand',
            name: 'CakeBrand',
            component: () => import('@/views/cake/CakeBrand.vue'),
            meta: {
              title: '品牌列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addcakebrand/:id?',
                name: 'AddCakeBrand',
                component: () => import('@/views/cake/AddCakeBrand.vue'),
                meta: {
                  title: '增加品牌',
                  requiresAuth: true
                }
              },
              {
                path: 'CakeBranddelivery/:id?',
                name: 'CakeBranddelivery',
                component: () => import('@/views/cake/CakeBranddelivery.vue'),
                meta: {
                  title: '配送范围',
                  requiresAuth: true
                }
              }


            ]
          },
          {
            path: 'address',
            name: 'CakeAddress',
            component: () => import('@/views/cake/CakeAddress.vue'),
            meta: {
              title: '地址列表',
              requiresAuth: true
            }
          }
        ]
      }, {
        path: 'electronic',
        name: 'ElectronicManage',
        component: { render: h => h('router-view') },
        meta: {
          title: '电子券管理',
          icon: 'el-icon-tickets',
          requiresAuth: true
        },
        children: [
          {
            path: 'brand',
            name: 'ElectronicBrand',
            component: () => import('@/views/electronic/ElectronicBrand.vue'),
            meta: {
              title: '品牌列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addbrand',
                name: 'AddElectronicBrand',
                component: () => import('@/views/electronic/AddElectronicBrand.vue'),
                meta: {
                  title: '增加品牌',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'list',
            name: 'ElectronicList',
            component: () => import('@/views/electronic/ElectronicList.vue'),
            meta: {
              title: '电子券列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addlist',
                name: 'AddElectronicList',
                component: () => import('@/views/electronic/AddElectronicList.vue'),
                meta: {
                  title: '增加电子券',
                  requiresAuth: true
                }
              }, {
                path: 'addlistnum',
                name: 'ElectronicListnum',
                component: () => import('@/views/electronic/ElectronicListnum.vue'),
                meta: {
                  title: '电子券',
                  requiresAuth: true
                }
              }
            ]
          }
        ]
      },

      {
        path: 'direct',
        name: 'DirectManage',
        component: { render: h => h('router-view') },
        redirect: '/direct/list',

        meta: {
          title: '直充管理',
          icon: 'el-icon-mobile-phone',
          requiresAuth: true
        },
        children: [
          {
            path: 'brand',
            name: 'DirectBrand',
            component: () => import('@/views/direct/DirectBrand.vue'),
            meta: {
              title: '直充品牌',
              requiresAuth: true
            }, children: [
              {
                path: 'addbrand',
                name: 'AddDirectBrand',
                component: () => import('@/views/direct/AddDirectBrand.vue'),
                meta: {
                  title: '直充品牌',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'list',
            name: 'ElectronicList',
            component: () => import('@/views/direct/DirectList.vue'),
            meta: {
              title: '直冲列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addlist',
                name: 'AddDirectList',
                component: () => import('@/views/direct/AddDirectList.vue'),
                meta: {
                  title: '直充品牌',
                  requiresAuth: true
                }
              }
            ]
          }
        ]
      },
      {
        path: 'card',
        name: 'CardManage',
        component: { render: h => h('router-view') },
        redirect: '/card/carousel',

        meta: {
          title: '卡券管理',
          icon: 'el-icon-postcard',
          requiresAuth: true
        },
        children: [
          {
            path: 'carousel',
            name: 'CardCarousel',
            component: () => import('@/views/card/CardCarousel.vue'),
            meta: {
              title: '轮播图',
              requiresAuth: true
            }
          },
          {
            path: 'category',
            name: 'CardCategory',
            component: () => import('@/views/card/CardCategory.vue'),
            meta: {
              title: '卡券分类',
              requiresAuth: true
            }
          }, {
            path: 'list',
            name: 'CardList',
            component: () => import('@/views/card/CardList.vue'),
            meta: {
              title: '卡券列表',
              requiresAuth: true
            }
          }, {
            path: 'spec',
            name: 'CardSpec',
            component: () => import('@/views/card/CardSpec.vue'),
            meta: {
              title: '规格列表',
              requiresAuth: true
            }, children: [
              {
                path: 'addspec',
                name: 'AddCardSpec',
                component: () => import('@/views/card/AddCardSpec.vue'),
                meta: {
                  title: '添加规格',
                  requiresAuth: true
                }
              },
              {
                path: 'specnum',
                name: 'CardSpecnum',
                component: () => import('@/views/card/CardSpecnum.vue'),
                meta: {
                  title: '超市卡列表',
                  requiresAuth: true
                }
              }
            ]
          }
        ]

      },


      {
        path: 'movie',
        name: 'MovieManage',
        component: { render: h => h('router-view') },
        redirect: '/movie/carousel',

        meta: {
          title: '电影管理',
          icon: 'el-icon-film',
          requiresAuth: true
        },
        children: [
          {
            path: 'carousel',
            name: 'MovieCarousel',
            component: () => import('@/views/movie/MovieCarousel.vue'),
            meta: {
              title: '轮播图',
              requiresAuth: true
            }
          },
          {
            path: 'city',
            name: 'MovieCity',
            component: () => import('@/views/movie/MovieCity.vue'),
            meta: {
              title: '城市列表',
              requiresAuth: true
            }, children: [
              {
                path: 'citynum',
                name: 'MovieCitynum',
                component: () => import('@/views/movie/MovieCitynum.vue'),
                meta: {
                  title: '地区',
                  requiresAuth: true
                }
              }
            ]
          }, {
            path: 'cinema',
            name: 'MovieCinema',
            component: () => import('@/views/movie/MovieCinema.vue'),
            meta: {
              title: '影院列表',
              requiresAuth: true
            }
          }
        ]

      },

      {
        path: 'book',
        name: 'BookManage',
        component: { render: h => h('router-view') },
        redirect: '/book/list',
        meta: {
          title: '图书管理',
          icon: 'el-icon-reading',
          requiresAuth: true
        },
        children: [
          {
            path: 'carousel',
            name: 'BookCarousel',
            component: () => import('@/views/book/BookCarousel.vue'),
            meta: {
              title: '轮播图',
              requiresAuth: true
            }
          },
          {
            path: 'home-category',
            name: 'BookHomeCategory',
            component: () => import('@/views/book/BookHomeCategory.vue'),
            meta: {
              title: '首页分类列表',
              requiresAuth: true
            }
          }, {
            path: 'categorylist',
            name: 'BookCategoryList',
            component: () => import('@/views/book/BookCategoryList.vue'),
            meta: {
              title: '分类列表',
              requiresAuth: true
            }
          }, {
            path: 'list',
            name: 'BookList',
            component: () => import('@/views/book/BookList.vue'),
            meta: {
              title: '图书列表',
              requiresAuth: true
            }
          }, {
            path: 'category',
            name: 'BookCategory',
            component: () => import('@/views/book/BookCategory.vue'),
            meta: {
              title: '图书分类',
              requiresAuth: true
            }
          }
        ]

      },



      {
        path: 'welfare',
        name: 'WelfareManage',
        component: { render: h => h('router-view') },
        meta: {
          title: '福利卡',
          icon: 'el-icon-present',
          requiresAuth: true
        },
        children: [
          {
            path: 'unassigned',
            name: 'UnassignedCard',
            component: () => import('@/views/welfare/UnassignedCard.vue'),
            meta: {
              title: '卡列表(未分配)',
              requiresAuth: true
            }
          },
          {
            path: 'list',
            name: 'WelfareCardList',
            component: () => import('@/views/welfare/WelfareCardList.vue'),
            meta: {
              title: '福利卡列表',
              requiresAuth: true
            }, children: [

              {
                path: 'cardnumsearch/:id?',
                name: 'CardNumsearch',
                component: () => import('@/views/welfare/CardNumsearch.vue'),
                meta: {
                  title: '福利卡查询',
                  requiresAuth: true
                }
              }, {
                path: 'cardnum/:id?',
                name: 'CardNum',
                component: () => import('@/views/welfare/CardNum.vue'),
                meta: {
                  title: '福利卡',
                  requiresAuth: true
                }
              }, {
                path: 'cardlbt/:id?',
                name: 'cardLbt',
                component: () => import('@/views/welfare/cardLbt.vue'),
                meta: {
                  title: '轮播图',
                  requiresAuth: true
                }
              }, {
                path: 'classfiy/:id?',
                name: 'ClassFiy',
                component: () => import('@/views/welfare/ClassFiy.vue'),
                meta: {
                  title: '分类',
                  requiresAuth: true
                }
              }, {
                path: 'perview/:id?',
                name: 'PerView',
                component: () => import('@/views/welfare/PerView.vue'),
                meta: {
                  title: '权限',
                  requiresAuth: true
                }
              }

            ]
          }, {
            path: 'category',
            name: 'WelfareCategory',
            component: () => import('@/views/welfare/WelfareCategory.vue'),
            meta: {
              title: '合卡分类图',
              requiresAuth: true
            }, children: [
              //AddWelfareCategory
              {
                path: 'addcategory',
                name: 'AddWelfareCategory',
                component: () => import('@/views/welfare/AddWelfareCategory.vue'),
                meta: {
                  title: '新增合卡分类',
                  requiresAuth: true
                }
              }
            ]
          }




        ]
      },
      {
        path: 'voucher',
        name: 'voucherManage',
        component: { render: h => h('router-view') },
        redirect: '/voucher/list',
        meta: {
          title: '权益券',
          icon: 'el-icon-present',
          requiresAuth: true
        },
        children: [
          {
            path: 'unvoucher',
            name: 'Unassignedvoucher',
            component: () => import('@/views/voucher/Unassignedvoucher.vue'),
            meta: {
              title: '券号(未分配)',
              requiresAuth: true
            }
          },
          {
            path: 'list',
            name: 'VoucherCardList',
            component: () => import('@/views/voucher/VoucherCardList.vue'),
            meta: {
              title: '权益券',
              requiresAuth: true
            }, children: [

              {
                path: 'vounumsearch/:id?',
                name: 'VouNumsearch',
                component: () => import('@/views/voucher/CardNumsearch.vue'),
                meta: {
                  title: '福利卡查询',
                  requiresAuth: true
                }
              }, {
                path: 'voudnum/:id?',
                name: 'VoudNum',
                component: () => import('@/views/voucher/CardNum.vue'),
                meta: {
                  title: '福利卡',
                  requiresAuth: true
                }
              }, {
                path: 'cardlbt/:id?',
                name: 'cardLbt',
                component: () => import('@/views/voucher/cardLbt.vue'),
                meta: {
                  title: '轮播图',
                  requiresAuth: true
                }
              }, {
                path: 'classfiy/:id?',
                name: 'ClassFiy',
                component: () => import('@/views/voucher/ClassFiy.vue'),
                meta: {
                  title: '分类',
                  requiresAuth: true
                }
              }

            ]
          }




        ]
      },
      {
        path: 'card-book',
        name: 'CardBookManage',
        component: { render: h => h('router-view') },
        redirect: '/card-book/list',

        meta: {
          title: '卡册',
          icon: 'el-icon-collection',
          requiresAuth: true
        },
        children: [
          {
            path: 'unassigned',
            name: 'UnassignedCard',
            component: () => import('@/views/card-book/UnassignedCard.vue'),
            meta: {
              title: '卡列表(未分配)',
              requiresAuth: true
            }
          },
          {
            path: 'list',
            name: 'CardBookList',
            component: () => import('@/views/card-book/CardBookList.vue'),
            meta: {
              title: '卡册列表',
              requiresAuth: true
            }, children: [

              {
                path: 'cardbooknumsearch/:id?',
                name: 'CardbookNumsearch',
                component: () => import('@/views/card-book/CardbookNumsearch.vue'),
                meta: {
                  title: '卡号查询',
                  requiresAuth: true
                }
              }, {
                path: 'cardbooknum/:id?',
                name: 'CardbookNum',
                component: () => import('@/views/card-book/CardbookNum.vue'),
                meta: {
                  title: '卡号',
                  requiresAuth: true
                }
              }, {
                path: 'cardlbt/:id?',
                name: 'cardLbt',
                component: () => import('@/views/card-book/cardLbt.vue'),
                meta: {
                  title: '轮播图',
                  requiresAuth: true
                }
              }, {
                path: 'classfiy/:id?',
                name: 'ClassFiy',
                component: () => import('@/views/card-book/ClassFiy.vue'),
                meta: {
                  title: '分类',
                  requiresAuth: true
                }
              },
              {
                path: 'classfiynew/:id?',
                name: 'ClassFiynew',
                component: () => import('@/views/card-book/ClassFiynew.vue'),
                meta: {
                  title: '分类',
                  requiresAuth: true
                }
              },
              {
                path: 'perview/:id?',
                name: 'PerView',
                component: () => import('@/views/card-book/PerView.vue'),
                meta: {
                  title: '权限',
                  requiresAuth: true
                }
              }

            ]
          }, {
            path: 'category',
            name: 'CardBookCategory',
            component: () => import('@/views/card-book/CardBookCategory.vue'),
            meta: {
              title: '卡册分类图',
              requiresAuth: true
            }, children: [
              //AddWelfareCategory
              {
                path: 'addcategory',
                name: 'AddcardbookCategory',
                component: () => import('@/views/card-book/AddWelfareCategory.vue'),
                meta: {
                  title: '新增合卡分类',
                  requiresAuth: true
                }
              }
            ]
          }




        ]
      },



      {
        path: 'system-user',
        name: 'SystemUser',
        component: { render: h => h('router-view') },
        redirect: '/system-user/list',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user-solid',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'SystemUserList',
            component: () => import('@/views/system-user/SystemUserList.vue'),
            meta: {
              title: '用户列表',
              requiresAuth: true
            },
            children: [
              {
                path: 'adddress',
                name: 'AddDress',
                component: () => import('@/views/system-user/AddDress.vue'),
                meta: {
                  title: '收货地址',
                  requiresAuth: true
                }
              },
              {
                path: 'shopcart',
                name: 'ShopCart',
                component: () => import('@/views/system-user/ShopCart.vue'),
                meta: {
                  title: '购物车',
                  requiresAuth: true
                }
              }, {
                path: 'fulicard',
                name: 'FuliCard',
                component: () => import('@/views/system-user/FuliCard.vue'),
                meta: {
                  title: '福利卡',
                  requiresAuth: true
                }
              }

            ]
          }

        ]
      },



      {
        path: 'mall-order',
        name: 'MallOrder',
        component: { render: h => h('router-view') },
        redirect: '/mall-order/list',

        meta: {
          title: '商城-订单管理',
          icon: 'el-icon-s-order',
          requiresAuth: true
        },
        children: [
          {
            path: 'total',
            name: 'MallOrderTotal',
            component: () => import('@/views/mall-order/MallOrderTotal.vue'),
            meta: {
              title: '订单(总)列表',
              requiresAuth: true
            }, children: [
              {
                path: 'mallorderdetails',
                name: 'MallOrderTotaldetails',
                component: () => import('@/views/mall-order/MallOrderTotaldetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]

          },
          {
            path: 'express',
            name: 'MallExpress',
            component: () => import('@/views/mall-order/MallExpress.vue'),
            meta: {
              title: '快递列表',
              requiresAuth: true
            }
          },
          {
            path: 'list',
            name: 'MallOrderList',
            component: () => import('@/views/mall-order/MallOrderList.vue'),
            meta: {
              title: '订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'mallorderlistdetails',
                name: 'MallOrderListdetails',
                component: () => import('@/views/mall-order/MallOrderListdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          }, {
            path: 'exchange',
            name: 'MallExchange',
            component: () => import('@/views/mall-order/MallExchange.vue'),
            meta: {
              title: '兑换订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'mallexchangedetails',
                name: 'MallExchangedetails',
                component: () => import('@/views/mall-order/MallExchangedetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]



          }

        ]
      },


      {
        path: 'cake-order',
        name: 'CakeOrder',
        component: { render: h => h('router-view') },
        redirect: '/cake-order/list',

        meta: {
          title: '蛋糕-订单管理',
          icon: 'el-icon-s-order',
          requiresAuth: true
        },
        children: [
          {
            path: 'total',
            name: 'CakeOrderTotal',
            component: () => import('@/views/cake-order/CakeOrderTotal.vue'),
            meta: {
              title: '订单(总)列表',
              requiresAuth: true
            }, children: [
              {
                path: 'cakeordertotaldetails',
                name: 'CakeOrderTotaldetails',
                component: () => import('@/views/cake-order/CakeOrderTotaldetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'channel',
            name: 'CakeChannel',
            component: () => import('@/views/cake-order/CakeChannel.vue'),
            meta: {
              title: '渠道订单列表',
              requiresAuth: true
            }
          },
          {
            path: 'prepay',
            name: 'CakePrepay',
            component: () => import('@/views/cake-order/CakePrepay.vue'),
            meta: {
              title: '预付款列表',
              requiresAuth: true
            }
          }, {
            path: 'list',
            name: 'CakeOrderList',
            component: () => import('@/views/cake-order/CakeOrderList.vue'),
            meta: {
              title: '订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'cakeorderlistdetails',
                name: 'CakeOrderListdetails',
                component: () => import('@/views/cake-order/CakeOrderListdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          }

        ]
      },



      {
        path: 'ticket-order',
        name: 'TicketOrder',
        component: { render: h => h('router-view') },
        redirect: '/ticket-order/movie',

        meta: {
          title: '电影/卡券',
          icon: 'el-icon-film',
          requiresAuth: true
        },
        children: [
          {
            path: 'movie',
            name: 'MovieOrder',
            component: () => import('@/views/ticket-order/MovieOrder.vue'),
            meta: {
              title: '电影订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'movieorderdetails/:id',
                name: 'MovieOrderdetails',
                component: () => import('@/views/ticket-order/MovieOrderdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'card',
            name: 'CardOrder',
            component: () => import('@/views/ticket-order/CardOrder.vue'),
            meta: {
              title: '卡券订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'cardorderdetails/:id',
                name: 'CardOrderdetails',
                component: () => import('@/views/ticket-order/CardOrderdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          },

          {
            path: 'direct',
            name: 'DirectOrder',
            component: () => import('@/views/ticket-order/DirectOrder.vue'),
            meta: {
              title: '直充订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'directorderdetails/:id',
                name: 'DirectOrderdetails',
                component: () => import('@/views/ticket-order/DirectOrderdetails.vue'),
                meta: {
                  title: '直充订单详情',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'show',
            name: 'ShowOrder',
            component: () => import('@/views/ticket-order/ShowOrder.vue'),
            meta: {
              title: '演出订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'showorderdetails/:id',
                name: 'ShowOrderdetails',
                component: () => import('@/views/ticket-order/ShowOrderdetails.vue'),
                meta: {
                  title: '演出订单详情',
                  requiresAuth: true
                }
              }
            ]
          }, {
            path: 'book',
            name: 'BookOrder',
            component: () => import('@/views/ticket-order/BookOrder.vue'),
            meta: {
              title: '图书订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'bookorderdetails/:id',
                name: 'BookOrderdetails',
                component: () => import('@/views/ticket-order/BookOrderdetails.vue'),
                meta: {
                  title: '图书订单详情',
                  requiresAuth: true
                }
              }
            ]
          }, {
            path: 'scenic',
            name: 'ScenicOrder',
            component: () => import('@/views/ticket-order/ScenicOrder.vue'),
            meta: {
              title: '景区订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'scenicorderdetails/:id',
                name: 'ScenicOrderdetails',
                component: () => import('@/views/ticket-order/ScenicOrderdetails.vue'),
                meta: {
                  title: '景区订单详情',
                  requiresAuth: true
                }
              }
            ]
          }





        ]
      },


      {
        path: 'meal-order',
        name: 'MealOrder',
        component: { render: h => h('router-view') },
        redirect: '/meal-order/list',

        meta: {
          title: '点餐订单管理',
          icon: 'el-icon-food',
          requiresAuth: true
        },
        children: [
          {

            path: 'list',
            name: 'MealOrderList',
            component: () => import('@/views/meal-order/MealOrderList.vue'),
            meta: {
              title: '点餐订单列表',
              requiresAuth: true
            }, children: [
              {
                path: 'mealorderlistdetails/:id',
                name: 'MealOrderListdetails',
                component: () => import('@/views/meal-order/MealOrderListdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          },
          {

            path: 'ant',
            name: 'AntOrder',
            component: () => import('@/views/meal-order/AntOrder.vue'),
            meta: {
              title: '订单列表(蚂蚁)',
              requiresAuth: true
            }, children: [
              {
                path: 'antorderdetails/:id',
                name: 'AntOrderdetails',
                component: () => import('@/views/meal-order/AntOrderdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          }
          , {

            path: 'qipiao',
            name: 'QipiaoOrder',
            component: () => import('@/views/meal-order/QipiaoOrder.vue'),
            meta: {
              title: '订单列表(奇票)',
              requiresAuth: true
            }, children: [
              {
                path: 'qipiaoorderdetails/:id',
                name: 'QipiaoOrderdetails',
                component: () => import('@/views/meal-order/QipiaoOrderdetails.vue'),
                meta: {
                  title: '订单详情',
                  requiresAuth: true
                }
              }
            ]
          }


        ]
      },

      {
        path: 'feedback',
        name: 'Feedback',
        component: { render: h => h('router-view') },
        redirect: '/feedback/list',

        meta: {
          title: '意见反馈管理',
          icon: 'el-icon-chat-dot-round',
          requiresAuth: true
        },
        children: [
          {

            path: 'list',
            name: 'FeedbackList',
            component: () => import('@/views/feedback/FeedbackList.vue'),
            meta: {
              title: '意见反馈列表',
              requiresAuth: true
            }
          }, {

            path: 'category',
            name: 'FeedbackCategory',
            component: () => import('@/views/feedback/FeedbackCategory.vue'),
            meta: {
              title: '意见反馈分类',
              requiresAuth: true
            }
          }


        ]
      },
      {
        path: 'auxiliary',
        name: 'Auxiliary',
        component: { render: h => h('router-view') },
        redirect: '/auxiliary/page',

        meta: {
          title: '辅助栏目',
          icon: 'el-icon-menu',
          requiresAuth: true
        },
        children: [
          {

            path: 'page',
            name: 'SinglePage',
            component: () => import('@/views/auxiliary/SinglePage.vue'),
            meta: {
              title: '单页面',
              requiresAuth: true
            }, children: [
              {
                // AddSingle
                path: 'addsingle',
                name: 'AddSingle',
                component: () => import('@/views/auxiliary/AddSingle.vue'),
                meta: {
                  title: '新增',
                  requiresAuth: true
                },
              }
            ]
          }, {

            path: 'ad',
            name: 'AdPosition',
            component: () => import('@/views/auxiliary/AdPosition.vue'),
            meta: {
              title: '广告位',
              requiresAuth: true
            }
          }


        ]
      },

      {
        path: 'coupon',
        name: 'Coupon',
        component: { render: h => h('router-view') },
        redirect: '/coupon/unassigned',

        meta: {
          title: '通兑券-旧',
          icon: 'el-icon-tickets',
          requiresAuth: true
        },
        children: [
          {

            path: 'unassigned',
            name: 'CouponUnassigned',
            component: () => import('@/views/coupon/CouponUnassigned.vue'),
            meta: {
              title: '通兑券(未分配)',
              requiresAuth: true
            }
          }, {

            path: 'list',
            name: 'CouponList',
            component: () => import('@/views/coupon/CouponList.vue'),
            meta: {
              title: '通兑券',
              requiresAuth: true
            }
          }


        ]
      },
      {
        path: 'password',
        name: 'Password',
        component: { render: h => h('router-view') },
        redirect: '/password/change',

        meta: {
          title: '密码管理',
          icon: 'el-icon-lock',
          requiresAuth: true
        },
        children: [
          {

            path: 'change',
            name: 'ChangePassword',
            component: () => import('@/views/password/ChangePassword.vue'),
            meta: {
              title: '修改密码',
              requiresAuth: true
            }
          }


        ]
      },





      // 其他路由
      ...generateOtherRoutes(menuList.filter(m => m.path !== 'dashboard' && m.path !== 'basic' && m.path !== 'user'))
    ]
  }
]

// 生成其他路由
function generateOtherRoutes(menus) {
  let routes = []
  menus.forEach(menu => {
    if (menu.hidden) return

    if (menu.children && menu.children.length > 0) {
      const route = {
        path: menu.path,
        name: menu.name,
        component: { render: h => h('router-view') },
        meta: {
          title: menu.meta?.title || menu.name,
          icon: menu.meta?.icon,
          requiresAuth: true  // 所有菜单路由都需要登录
        },
        children: []
      }

      menu.children.forEach(child => {
        route.children.push({
          path: child.path,
          name: child.name,
          component: child.component
            ? () => import(`@/views${child.component}`)
            : () => import('@/views/template/List.vue'),
          meta: {
            title: child.meta?.title || child.name,
            requiresAuth: true
          }
        })
      })

      routes.push(route)
    } else {
      routes.push({
        path: menu.path,
        name: menu.name,
        component: menu.component
          ? () => import(`@/views${menu.component}`)
          : () => import('@/views/template/List.vue'),
        meta: {
          title: menu.meta?.title || menu.name,
          icon: menu.meta?.icon,
          requiresAuth: true
        }
      })
    }
  })
  return routes
}

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// 白名单路由（不需要登录就能访问）
const whiteList = ['/login']

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + ' - 后台管理系统'
  }

  // 获取 token
  const token = localStorage.getItem('token')

  // 如果访问的是登录页
  if (to.path === '/login') {
    if (token) {
      // 如果有 token，直接跳转到首页
      next('/')
    } else {
      // 没有 token，允许访问登录页
      next()
    }
    return
  }

  // 检查是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录权限
    if (!token) {
      // 没有 token，跳转到登录页
      Message.error('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 记录要访问的页面，登录后跳转回来
      })
    } else {
      // 有 token，允许访问
      next()
    }
  } else {
    // 不需要登录权限，直接访问
    next()
  }
})

// 路由后置钩子（可选）
router.afterEach((to, from) => {
  // 可以在这里做页面访问统计等
})

export default router