<!-- src/views/404.vue -->
<template>
  <div class="page-404">
    <div class="content">
      <h1 class="code">404</h1>
      <p class="desc">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.page-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: calc(100vh - 120px);
  background-color: #f0f2f5;
}

.content {
  text-align: center;
}

.code {
  font-size: 120px;
  color: #409eff;
  margin: 0;
  font-weight: bold;
}

.desc {
  font-size: 20px;
  color: #666;
  margin: 20px 0;
}
</style>