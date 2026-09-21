<template>
  <div class="list-container">
    <template v-if="addelectronicbrand">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="选择关键词" class="w120">
              <el-option label="全部" value="status"></el-option>
              <el-option label="咖啡" value="1"></el-option>
              <el-option label="蛋糕" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="选择关键词" class="w120">

              <el-option label="名称" value="title"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="排序" value="px"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="添加时间" value="add_time"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加品牌</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" v-if="multipleSelection.length > 1"
            @click="batchDelete">
            批量删除
          </el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" min-width="39"></el-table-column>
          <el-table-column label="编号" min-width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="排序" min-width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.px" size="mini" :min="0" :max="999" controls-position="right"
                @change="(val) => updateSort(scope.row.id, val)" style="width: 100px;">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="图片" min-width="180" align="center">
            <template slot-scope="scope">
              <el-image :src="scope.row.img" style="width: 80px; height: 80px; object-fit: cover;"
                :preview-src-list="[scope.row.img]" fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" min-width="300" align="left">
            <template slot-scope="scope">
          <span class="blueCl" v-if="scope.row.type === 2">[蛋糕]</span>  <span v-if="scope.row.type === 1"  class="blueCl">[咖啡]</span>  {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="添加时间" align="center"  min-width="220">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="120" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1" 
                @change="(val) => updateStatus(scope.row, val)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-container" style="margin-top: 20px; text-align: right;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { brandListcoupons, delBrandcoupons, pxBrandcoupons, fbBrandcoupons } from '@/api/modules/login'

export default {
  name: 'ElectronicBrand',
  data() {
    return {
      loading: false,
      searchForm: {
        type: 'status', // 2-蛋糕品牌
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [], statusChanging: false,  // 新增：防止重复提交
    }
  },
  computed: {
    addelectronicbrand() {
      return this.$route.name === 'ElectronicBrand' || this.$route.path === '/electronic/brand'
    }
  },
  mounted() {
    this.getBrandList()
  },
  methods: {
    // 获取品牌列表
    async getBrandList() {
      this.loading = true
      try {
        const params = {
          type: this.searchForm.type,
          page: this.pagination.currentPage,
          limit: this.pagination.pageSize
        }

        // 添加搜索条件
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }

        // 添加排序条件
        if (this.searchForm.px_key && this.searchForm.px_val) {
          params.px_key = this.searchForm.px_key
          params.px_val = this.searchForm.px_val
        }

        // 添加发布状态筛选
        if (this.searchForm.sh !== '') {
          params.sh = this.searchForm.sh
        }

        const res = await brandListcoupons(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total || 0
          this.pagination.currentPage = res.data.current_page || 1
          this.pagination.lastPage = res.data.last_page || 1
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1
      this.getBrandList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        type: '2',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      }
      this.pagination.currentPage = 1
      this.getBrandList()
    },

    // 分页-每页条数变化
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.getBrandList()
    },

    // 分页-当前页变化
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getBrandList()
    },

    // 更新排序
    async updateSort(id, px) {
      try {
        const res = await pxBrandcoupons({ id, px })
        if (res.code === 200) {
          this.$message.success(res.msg || '排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.getBrandList() // 刷新列表恢复原值
        }
      } catch (error) {
        console.error('修改排序失败:', error)
        this.$message.error('修改排序失败')
        this.getBrandList() // 刷新列表恢复原值
      }
    },

    // 更新发布状态
     // 更新发布状态（带确认框）
async updateStatus(row, newVal) {
  // newVal 是布尔值：true=开启(发布), false=关闭(下架)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将品牌"${row.title}"${actionText}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    // 用户取消，不做任何操作
    return
  }
  
  if (this.statusChanging) return
  this.statusChanging = true

  try {
    const res = await fbBrandcoupons({ id: row.id })
    if (res.code === 200) {
      this.$message.success(`${actionText}成功`)
      // 更新当前行的状态
      row.sh = targetStatus
    } else {
      this.$message.error(res.msg || `${actionText}失败`)
      // 恢复开关状态（通过视图更新）
      this.$forceUpdate()
    }
  } catch (error) {
    console.error('修改状态失败:', error)
    this.$message.error('网络错误，请稍后重试')
    this.$forceUpdate()
  } finally {
    this.statusChanging = false
  }
},

    // 删除品牌
    handleDelete(row) {
      this.$confirm(`确认删除品牌"${row.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delBrandcoupons({ ids: row.id })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            // 如果当前页只有一条数据且不是第一页，则跳转到上一页
            if (this.tableData.length === 1 && this.pagination.currentPage > 1) {
              this.pagination.currentPage--
            }
            this.getBrandList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 修改品牌
    handleEdit(row) {
      // 跳转到编辑页面，传递品牌ID
      this.$router.push({
        name: 'AddElectronicBrand',
        query: { id: row.id }
      }).catch(err => { })
    },

    // 添加品牌
    addPro() {
      this.$router.push({ name: 'AddElectronicBrand' }).catch(err => { })
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }

      const ids = this.multipleSelection.map(item => item.id).join(',')
      const titles = this.multipleSelection.map(item => item.title).join('、')

      this.$confirm(`确认删除以下品牌吗？\n${titles}`, '批量删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delBrandcoupons({ ids: ids })
          if (res.code === 200) {
            this.$message.success(res.msg || `成功删除 ${this.multipleSelection.length} 条数据`)
            // 如果当前页只有一条数据且不是第一页，则跳转到上一页
            if (this.tableData.length === this.multipleSelection.length && this.pagination.currentPage > 1) {
              this.pagination.currentPage--
            }
            this.getBrandList()
            // 清空选中状态
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
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

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: #f5f7fa;
    color: #909399;
    font-size: 20px;
  }
}
</style>