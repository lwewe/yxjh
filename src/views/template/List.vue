<template>
  <el-card>
    <div slot="header">
      <span>{{ pageTitle }}</span>
    </div>
    <el-alert
      title="页面开发中"
      type="info"
      description="该页面正在开发中"
      show-icon
    />
    <div style="margin-top: 20px; padding: 20px; background: #f5f5f5;">
      <p><strong>页面信息：</strong></p>
      <p>路由路径: {{ $route.path }}</p>
      <p>页面标题: {{ pageTitle }}</p>
      <p>菜单ID: {{ $route.meta.id || '无' }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'TemplateList',
  computed: {
    pageTitle() {
      return this.$route.meta.title || '页面开发中'
    }
  }
}
</script>

<style scoped>
.el-card {
  margin: 20px;
}
</style>