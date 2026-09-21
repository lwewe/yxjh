<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="item.path">
      <span v-if="index === breadcrumbs.length - 1">{{ item.meta.title }}</span>
      <router-link v-else :to="getRoutePath(item)">{{ item.meta.title }}</router-link>

    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadcrumbComponent',  // 修改组件名
  data() {
    return {
      breadcrumbs: []
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getRoutePath(item) {
      const defaultRoutes = {
        'BasicConfig':'/basic/view',
        'ComponyConfig':'/compony/view',
        'UserConfig':'/user/UserList',
        'CarouselManage':'/carous/list',//
        'ProductManage':'/product/list',
         'ElectronicManage':'/electronic/brand',
        'WelfareManage': '/welfare/unassigned',
        // 'ProductManage': '/product/ProductList',
        'CakeManage': '/cake/list',

        

        // 继续添加...
      }

      return defaultRoutes[item.name] || item.path
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // this.breadcrumbs = matched
      // 处理特殊路由路径（如果需要自定义显示）
      this.breadcrumbs = matched.map(item => {
        // 如果是详情页，可以动态修改标题
        if (item.name === 'CardNum' && this.$route.params.id) {
          return {
            ...item,
            meta: {
              ...item.meta,
              title: `${item.meta.title}`
              // title: `${item.meta.title} - ${this.$route.params.id}`
            }
          }
        }
        return item
      })

    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  line-height: 60px;
}
</style>