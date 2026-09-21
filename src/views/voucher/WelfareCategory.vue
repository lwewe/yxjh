<template>
  <div class="list-container">
    <template v-if="isWelfareCategory">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.mb_id" placeholder="模板" class="w120" clearable>
            <el-option label="模板一" value="1"></el-option>
            <el-option label="模板二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
            <el-option label="升序" value="asc"></el-option>
            <el-option label="降序" value="desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete()">批量删除</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加合卡分类图</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"> 
        <el-table-column type="selection" width="39">
        </el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="模板" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.mb_id == 1 ? '模板一' : '模板二' }}
          </template>
        </el-table-column>
        <el-table-column label="标题" width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Banner" width="150" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.banner" :src="scope.row.banner" style="width: 120px; height: 50px;" fit="contain" :preview-src-list="[scope.row.banner]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="米面粮油" width="130" align="center" >
          <template slot-scope="scope">
            <el-image v-if="scope.row.img" :src="scope.row.img" style="width: 100px;  " fit="contain" :preview-src-list="[scope.row.img]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="休闲零食" width="130" align="center"  >
          <template slot-scope="scope">
            <el-image v-if="scope.row.img1" :src="scope.row.img1" style="width: 100px; " fit="contain" :preview-src-list="[scope.row.img1]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="清洁洗护" width="130" align="center"  >
          <template slot-scope="scope">
            <el-image v-if="scope.row.img2" :src="scope.row.img2" style="width:100px; height: 60px;" fit="contain" :preview-src-list="[scope.row.img2]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="悦享生活" width="130" align="center"  >
          <template slot-scope="scope">
            <el-image v-if="scope.row.img3" :src="scope.row.img3" style="width: 100px; height: 60px;" fit="contain" :preview-src-list="[scope.row.img3]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="严选好物" width="130" align="center"  >
          <template slot-scope="scope">
            <el-image v-if="scope.row.img4" :src="scope.row.img4" style="width: 100px; height: 60px;" fit="contain" :preview-src-list="[scope.row.img4]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right; margin-top: 20px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
</template>
<router-view></router-view>
  </div>
</template>

<script>
import { tujiList, delTuji } from '@/api/modules/card'

export default {
  name: 'WelfareCategory',
  props: {
  },
  data() {
    return {
      loading: false,
      searchForm: {
        mb_id: '',
        search_key: 'title',
        search_val: '',
        px_key: 'id',
        px_val: 'desc'
      },
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          mb_id: this.searchForm.mb_id,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await tujiList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.current_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    // 查询
    handleSearch() {
      this.currentPage = 1
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    // 表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm('确认删除该分类图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delTuji({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('请求失败')
        }
      }).catch(() => {})
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的数据')
        return
      }
      this.$confirm('确定删除选中的分类图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        try {
          const res = await delTuji({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('请求失败')
        }
      }).catch(() => {})
    },

     

    addPro() {
      this.$router.push({
        name: 'AddWelfareCategory',
        
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    handleEdit(row) {
      this.$router.push({
        name: 'AddWelfareCategory',
        params: { id: row.id }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },
  },
  computed: {
    isWelfareCategory() {
      return this.$route.name === 'isWelfareCategory' || this.$route.path === '/welfare/category'
    }
  },
  watch: {
    '$route.query.refresh'(val) {
    if (val) {
      this.getList()
    }
  }
  },
}
</script>

<style>
.serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.serchForm .el-card__body {
  text-align: left;
}

.serchForm .el-input__icon {
  line-height: 36px;
}

.serchForm .el-form-item__content {
  line-height: 36px;
}

.serchForm .el-form-item__label {
  line-height: 36px;
}
</style>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>