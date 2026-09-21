<template>
  <div v-if="!item.hidden" class="leftmenu">
    <!-- 有子菜单 -->
    <template v-if="hasChildren(item)">
      <el-submenu :index="getFullPath()" :key="item.path">
        <template slot="title">
          <i :class="item.meta && item.meta.icon"></i>
          <span>{{ item.meta && item.meta.title }}</span>
        </template>
        <sidebar-item-component
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :parent-path="getFullPath()"
        />
      </el-submenu>
    </template>

    <!-- 没有子菜单 -->
    <template v-else>
      <el-menu-item :index="getFullPath()" :key="item.path">
        <i :class="item.meta && item.meta.icon"></i>
        <span slot="title">{{ item.meta && item.meta.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>

export default {
  name: 'SidebarItemComponent',
  props: {
    item: {
      type: Object,
      required: true
    },
    parentPath: {
      type: String,
      default: ''
    }
  },
  methods: {
    hasChildren(item) {
      return item.children && item.children.length > 0 && !item.children.every(child => child.hidden)
    },
    getFullPath() {
      // 调试用
      
      
      if (this.parentPath) {
        // 如果parentPath以/开头
        if (this.parentPath.startsWith('/')) {
          return this.parentPath + '/' + this.item.path
        } else {
          return '/' + this.parentPath + '/' + this.item.path
        }
      }
      return '/' + this.item.path
    }
  }
}
</script>
<style>
.leftmenu .leftmenu .el-menu-item{
  padding-left: 49px !important;

}
</style>