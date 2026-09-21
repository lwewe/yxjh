<template>
  <div class="list-container">
    <template v-if="isBrand">
      <!-- 搜索区域 -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <!-- 搜索关键词类型 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w130" clearable>
              <el-option label="品牌名称" value="name"></el-option>
              <el-option label="英文名称" value="ywname"></el-option>
              <el-option label="品牌编码" value="brandcode"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 关键词输入框 -->
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150"></el-input>
          </el-form-item>
          <!-- 排序字段 -->
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w130" clearable>
              <el-option label="排序值" value="px"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 排序方式 -->
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
              <el-option label="升序" value="asc"></el-option>
              <el-option label="降序" value="desc"></el-option>
            </el-select>
          </el-form-item>
          <!-- 发布状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
              <el-option label="已发布" :value="1"></el-option>
              <el-option label="未发布" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- 推荐状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.tuij" placeholder="推荐状态" class="w120" clearable>
              <el-option label="已推荐" :value="1"></el-option>
              <el-option label="未推荐" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="danger" @click="handleUpdateProduct()" style=" margin-left:10px;display: none;">更新全部品牌</el-button>
            <!-- <el-button @click="handleReset">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1" @click="delOptions()">
            批量删除
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">
            添加品牌
          </el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" min-width="39" align="center"></el-table-column>
          <el-table-column label="编号" min-width="80" prop="id" align="center"></el-table-column>

          <el-table-column label="排序" min-width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.px" placeholder="排序值" size="mini" @blur="handlePxChange(scope.row)"
                @keyup.enter.native="handlePxChange(scope.row)"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="缩略图" min-width="90" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.img" :src="scope.row.img" :preview-src-list="[scope.row.img]"
                style="width: 60px; height: 60px" fit="contain"></el-image>
              <span v-else style="color: #c0c4cc">-</span>
            </template>
          </el-table-column>

          <el-table-column label="品牌名称" min-width="180" align="left" prop="name">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>

          <el-table-column label="品牌英文名称" align="center" prop="ywname" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.ywname || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="首字母" min-width="80" align="center" prop="initials"></el-table-column>

          <el-table-column label="发布状态" min-width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                @change="(val) => handleStatusChange(scope.row, 'sh', val)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="推荐甄选" min-width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.tuij" :active-value="1" :inactive-value="0"
                @change="(val) => handleStatusChange(scope.row, 'tuij', val)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.per_page"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
        </div>
      </el-card>
    </template>

    <router-view></router-view>
  </div>
</template>

<script>
import { BrandList, pxBrand, brandZt, updateBrand, delBrand } from '@/api/modules/login'

export default {
  name: 'BrandList',
  data() {
    return {
      // 搜索表单 - 对应接口参数
      searchForm: {
        search_key: 'name',   // 搜索关键词key: name/ywname/brandcode/id
        search_val: '',        // 搜索关键词val
        px_key: 'px',          // 排序key: px/id
        px_val: 'desc',        // 排序val: desc降序/asc升序
        sh: '',                // 发布状态: 1已发布/0未发布
        tuij: ''               // 推荐状态: 1已推荐/0未推荐
      },
      // 分页
      pagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      },
      // 表格数据
      tableData: [],
      // 多选
      multipleSelection: [],
      // 加载状态
      loading: false
    }
  },
  mounted() {
    this.getBrandList()
  },
  computed: {
    isBrand() {
      return this.$route.name === 'BrandList' || this.$route.path === '/product/brand'
    }
  },
  watch: {
    $route(to, from) {
      if (from.name === 'AddBrandpro' && to.name === 'BrandList') {
        this.handleReset()

        this.getBrandList()

      }
    }
  },
  methods: {
    // 更新全部品牌（云中鹤）- 直接对接第三方全部更新
    async handleUpdateProduct() {
      this.$confirm(
        '确定要更新全部云中鹤品牌信息吗？此操作将从云中鹤同步最新品牌数据。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          // 直接调用接口，无需传递搜索条件
          const res = await updateBrand()

          if (res.code === 200) {
            this.$message.success(res.msg || '云中鹤品牌信息更新成功')
            // 刷新列表，回到第一页
            this.pagination.current_page = 1
            this.getBrandList()
          } else {
            this.$message.error(res.msg || '云中鹤品牌信息更新失败')
          }
        } catch (error) {
          console.error('更新云中鹤品牌失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    // 构建请求参数
    buildParams() {
      const params = {
        page: this.pagination.current_page,
        limit: this.pagination.per_page
      }

      // 搜索条件（非空才传）
      if (this.searchForm.search_key) {
        params.search_key = this.searchForm.search_key
      }
      if (this.searchForm.search_val) {
        params.search_val = this.searchForm.search_val
      }
      if (this.searchForm.px_key) {
        params.px_key = this.searchForm.px_key
      }
      if (this.searchForm.px_val) {
        params.px_val = this.searchForm.px_val
      }
      if (this.searchForm.sh !== '' && this.searchForm.sh !== null) {
        params.sh = this.searchForm.sh
      }
      if (this.searchForm.tuij !== '' && this.searchForm.tuij !== null) {
        params.tuij = this.searchForm.tuij
      }

      return params
    },

    // 获取品牌列表
    async getBrandList() {
      this.loading = true
      try {
        const params = this.buildParams()

        // 使用导入的 BrandList 接口
        const res = await BrandList(params)

        if (res.code === 200) {
          const data = res.data
          this.tableData = data.data || []
          this.pagination.total = data.total || 0
          this.pagination.per_page = data.per_page || 10
          this.pagination.current_page = data.current_page || 1
          this.pagination.last_page = data.last_page || 1
        } else {
          this.$message.error(res.msg || '获取品牌列表失败')
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('网络异常，获取品牌列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.getBrandList()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        search_key: 'name',
        search_val: '',
        px_key: 'px',
        px_val: 'desc',
        sh: '',
        tuij: ''
      }
      this.pagination.current_page = 1
      // this.getBrandList()
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pagination.per_page = val
      this.pagination.current_page = 1
      this.getBrandList()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.current_page = val
      this.getBrandList()
    },

    // 多选变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 排序修改
    async handlePxChange(row) {
      try {
        const res = await pxBrand({
          id: row.id,
          px: row.px
        })
        if (res.code === 200) {
          this.$message.success(res.data.msg || '排序修改成功')

          this.getBrandList()

        } else {
          this.$message.error(res.data.msg || '排序修改失败')
        }
      } catch (error) {
        console.error('排序修改失败:', error)
        this.$message.error('网络异常，排序修改失败')
        this.getBrandList()
      }
    },

    // 发布状态/推荐状态切换
    // 通用状态切换方法（用导入的 brandZt 接口，有确认弹窗）
    async handleStatusChange(row, type, val) {
      // 反推之前的值（用于失败回滚）
      const previousVal = val === 1 ? 0 : 1

      // 状态文本映射
      const typeTextMap = {
        sh: val === 1 ? '发布' : '取消发布',
        tuij: val === 1 ? '设为推荐' : '取消推荐'
      }

      try {
        await this.$confirm(`确定${typeTextMap[type]}该品牌吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await brandZt({
          id: String(row.id),
          type: type
        })

        if (res.code === 200) {
          // 使用后端返回的值更新
          const fieldMap = { sh: 'sh', tuij: 'tuij' }
          row[fieldMap[type]] = res.data[fieldMap[type]]
          this.$message.success(res.msg || '状态修改成功')

          this.getBrandList()

        } else {
          row[fieldMap[type]] = previousVal
          this.$message.error(res.msg || '状态修改失败')
        }

      } catch (error) {
        row[type] = previousVal
        if (error !== 'cancel') {
          this.$message.error('网络异常')
        }
      }
    },

    // 修改
    handleEdit(row) {
      this.$router.push({
        name: 'AddBrandpro',
        query: { id: row.id }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm(`确定要删除品牌"${row.name}"吗？删除后不可恢复。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delBrand({
            ids: String(row.id)
          })
          if (res.code === 200) {
            this.$message.success(res.data.msg || '删除成功')
            // 如果当前页只有一条数据且不是第一页，则回到上一页
            if (this.tableData.length === 1 && this.pagination.current_page > 1) {
              this.pagination.current_page--
            }
            this.handleReset()
            this.getBrandList()
          } else {
            this.$message.error(res.data.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('网络异常，删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    delOptions() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的品牌')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确定要删除选中的${this.multipleSelection.length}个品牌吗？删除后不可恢复。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delBrand({
            ids: ids
          })
          if (res.code === 200) {
            this.$message.success(res.data.msg || '删除成功')
            this.handleReset()

            this.getBrandList()
          } else {
            this.$message.error(res.data.msg || '删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('网络异常，删除失败')
        }
      }).catch(() => { })
    },

    // 添加品牌
    addPro() {
      this.$router.push({
        name: 'AddBrandpro'
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
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

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .w130 {
    width: 130px;
  }

  .w150 {
    width: 180px;
  }

  .w120 {
    width: 120px;
  }
}
</style>