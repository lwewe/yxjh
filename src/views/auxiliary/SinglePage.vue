<template>
  <div class="list-container-pages">
    <template v-if="SinglePage">
      <el-card class="formsTop">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w130">
              <el-option label="页面位置" value="name"></el-option>
              <el-option label="标题" value="title"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="添加时间" value="add_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w100">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card mt20">
        <!-- <div class="txtleft mb10">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPros()">添加单页面</el-button>
        </div> -->

        <el-table :data="tableData" border v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column label="编号"  min-width="80" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="页面位置"  min-width="250" align="center">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="标题" min-width="200" align="center">
            <template slot-scope="scope">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column label="添加时间" align="center"  min-width="170">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>
          <el-table-column label="点击率" align="center"  min-width="100">
            <template slot-scope="scope">{{ scope.row.djs }}</template>
          </el-table-column>
          <el-table-column label="操作"  min-width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 1 }} 页</div>
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import { singleList } from '@/api/modules/myorder'

export default {
  name: 'SinglePage',
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchForm: { search_key: 'name', search_val: '', px_key: 'id', px_val: 'desc' },
      tableData: []
    }
  },
  mounted() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await singleList({
          page: this.currentPage, limit: this.pageSize,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val || '',
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val
        })
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        }
      } catch (error) { console.error('获取列表失败:', error) }
      finally { this.loading = false }
    },
    handleSearch() { this.currentPage = 1; this.loadData() },
    handleReset() {
      this.searchForm = { search_key: 'name', search_val: '', px_key: 'id', px_val: 'desc' }
      this.currentPage = 1; this.loadData()
    },
    handlePageChange(page) { this.currentPage = page; this.loadData() },
    addPros() { this.$router.push({ name: 'AddSingle', params: { id: 0 } }) },
    handleEdit(row) { this.$router.push({ name: 'AddSingle', params: { id: row.id } }) },
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }
  },
  computed: {
    SinglePage() { return this.$route.name === 'SinglePage' || this.$route.path === '/auxiliary/page' }
  }
}
</script>
<style>
.list-container-pages .formsTop .el-card__body {
  padding: 20px 20px 0 20px;
}
</style>
<style scoped>
.list-container-pages {
  font-size: 14px;
   
}



.mt20 {
  margin-top: 20px;
}

.mb10 {
  margin-bottom: 10px;
}

.txtleft {
  text-align: left;
}

.w100 {
  width: 100px;
}

.w120 {
  width: 120px;
}

.w130 {
  width: 130px;
}

.w150 {
  width: 150px;
}

.pagination {
  background: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-info {
  font-size: 13px;
  color: #606266;
}

.search-card {
  margin-bottom: 20px;
}
</style>