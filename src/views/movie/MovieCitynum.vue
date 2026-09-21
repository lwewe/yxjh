<template>
  <div class="list-container">
    <!-- 城市信息卡片 -->
  

    <!-- 地区列表表格 -->
    <el-card class="search-card">
      <el-table 
        ref="multipleTable" 
        :data="filteredTableData" 
        border 
        tooltip-effect="dark" 
        style="width: 100%"
        v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
      >
        <el-table-column label="编号" width="100" prop="id" align="center"></el-table-column>
        
        <el-table-column label="城市编号" width="120" prop="pid" align="center"></el-table-column>

        <el-table-column label="名称" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="轩夸地区ID" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.quid1 }}
          </template>
        </el-table-column>

        <el-table-column label="奇票地区ID" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.quid2 }}
          </template>
        </el-table-column>

         
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pagination.current_page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { 
  diquList, 
  updateXuankuaDiqu, 
  updateQipiaoDiqu 
} from '@/api/modules/video'

export default {
  name: 'DiquList',
  data() {
    return {
      loading: false,
      cityInfo: null,
      searchForm: {
        name: ''
      },
      tableData: [],
      originalTableData: [],
      pagination: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      }
    }
  },
  computed: {
    // 过滤表格数据
    filteredTableData() {
      if (!this.searchForm.name) {
        return this.tableData
      }
      return this.tableData.filter(item => 
        item.name && item.name.includes(this.searchForm.name)
      )
    }
  },
  created() {
    this.getDiquList()
  },
  methods: {
    // 获取地区列表
    async getDiquList() {
      const cityId = this.$route.query.cityId || this.$route.query.pid
      
      if (!cityId) {
        this.$message.error('缺少城市ID参数')
        return
      }

      this.loading = true
      try {
        const res = await diquList({ pid: cityId })
        if (res.code === 200) {
          // 保存城市信息
          this.cityInfo = res.data.city
          // 保存地区列表
          this.originalTableData = res.data.list || []
          this.tableData = [...this.originalTableData]
          this.pagination.total = this.tableData.length
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取地区列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.filterTable()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm.name = ''
      this.filterTable()
    },

    // 过滤表格
    filterTable() {
      if (!this.searchForm.name) {
        this.tableData = [...this.originalTableData]
      } else {
        this.tableData = this.originalTableData.filter(item => 
          item.name && item.name.includes(this.searchForm.name)
        )
      }
      this.pagination.total = this.tableData.length
      this.pagination.current_page = 1
    },

    // 刷新列表
    refreshList() {
      this.getDiquList()
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination.current_page = page
    },

    handleSizeChange(size) {
      this.pagination.per_page = size
      this.pagination.current_page = 1
    },

    // 修改轩夸地区ID
    async updateXuankuaDiqu(row) {
      if (row.quid1 === undefined || row.quid1 === null) return
      const originalValue = row.quid1
      try {
        const res = await updateXuankuaDiqu({
          id: row.id,
          quid1: row.quid1
        })
        if (res.code === 200) {
          this.$message.success('轩夸地区ID修改成功')
          // 同步更新原始数据
          const originalItem = this.originalTableData.find(item => item.id === row.id)
          if (originalItem) {
            originalItem.quid1 = row.quid1
          }
        } else {
          row.quid1 = originalValue
          this.$message.error(res.msg || '修改失败')
        }
      } catch (error) {
        row.quid1 = originalValue
        console.error('修改轩夸地区ID失败:', error)
        this.$message.error('修改失败')
      }
    },

    // 修改奇票地区ID
    async updateQipiaoDiqu(row) {
      if (row.quid2 === undefined || row.quid2 === null) return
      const originalValue = row.quid2
      try {
        const res = await updateQipiaoDiqu({
          id: row.id,
          quid2: row.quid2
        })
        if (res.code === 200) {
          this.$message.success('奇票地区ID修改成功')
          // 同步更新原始数据
          const originalItem = this.originalTableData.find(item => item.id === row.id)
          if (originalItem) {
            originalItem.quid2 = row.quid2
          }
        } else {
          row.quid2 = originalValue
          this.$message.error(res.msg || '修改失败')
        }
      } catch (error) {
        row.quid2 = originalValue
        console.error('修改奇票地区ID失败:', error)
        this.$message.error('修改失败')
      }
    },

    // 查看影院列表
    handleCinemaList(row) {
      this.$router.push({
        path: '/video/cinemaList',
        query: {
          diquId: row.id,
          diquName: row.name,
          cityId: this.cityInfo?.id,
          cityName: this.cityInfo?.name
        }
      })
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
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

.w120 {
  width: 120px;
}

.w150 {
  width: 150px;
}
</style>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .city-card {
    margin-bottom: 20px;
    
    .city-info {
      text-align: left;
      
      h3 {
        margin: 0 0 10px 0;
        color: #303133;
      }
      
      .info-detail {
        span {
          margin-right: 20px;
          color: #606266;
        }
      }
    }
  }

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>