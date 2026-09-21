<template>
  <div class="list-container">
    <template v-if="isCakeBrand">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.city_id" placeholder="城市" filterable clearable class="w120"
              @change="handleSearch">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="品牌名称" value="name"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="描述" value="short_description"></el-option>
              <el-option label="供应商编号" value="uid"></el-option>
              <el-option label="商品品牌ID" value="brand_id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"
              @keyup.enter="handleSearch"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" @change="handleSearch">
              <el-option label="添加时间" value="createtime"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="点击数" value="djs"></el-option>


            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" @change="handleSearch">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.tuijzt" placeholder="推荐状态" clearable class="w120" @change="handleSearch">
              <el-option label="默认" value="status"></el-option>
              <el-option label="精选-已推荐" value="1"></el-option>
              <el-option label="精选-未推荐" value="2"></el-option>
              <el-option label="生日蛋糕-已推荐" value="5"></el-option>
              <el-option label="生日蛋糕-未推荐" value="6"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="显示状态" clearable class="w120" @change="handleSearch">
              <el-option label="全部" value="status"></el-option>
              <el-option label="已显示" value="1"></el-option>
              <el-option label="未显示" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="danger" @click="handleUpdateBrand" style="display: none;">更新</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加品牌</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
            v-if="multipleSelection.length > 1">
            批量删除
          </el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

          <el-table-column type="selection" min-width="39"></el-table-column>

          <el-table-column label="编号" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <el-table-column label="排序" min-width="100" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.px" @change="(val) => updateSort(scope.row, val)"></el-input>

            </template>
          </el-table-column>

          <el-table-column label="缩略图" min-width="90" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.image_path" :src="scope.row.image_path"
                style="width: 60px; max-height: 60px; object-fit: contain;" :preview-src-list="[scope.row.image_path]">
              </el-image>
              <div v-else class="no-image">暂无图片</div>
            </template>
          </el-table-column>

          <el-table-column label="品牌名称" min-width="200" align="left">
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
              <!-- <div class="brand-id">ID:{{ scope.row.brand_id || scope.row.id }}</div> -->
            </template>
          </el-table-column>

          <el-table-column label="来源" min-width="190" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.flag === 0 ? 'success' : 'info'" size="small">
                {{ scope.row.flag === 0 ? '接口读取' : '后台添加' }}
              </el-tag>
              <div v-if="scope.row.gongyingshang">
                <div>ID:{{ scope.row.gongyingshang.id }}</div>
                <div>{{ scope.row.gongyingshang.username }}</div>
              </div>

            </template>
          </el-table-column>

          <el-table-column label="简短描述" min-width="250" align="left">
            <template slot-scope="scope">
              <div class="short-desc">{{ scope.row.short_description || '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="显示状态" width="100" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
                @change="(val) => switchStatus(scope.row, val)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="精选推荐" min-width="100" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.tuij === 1" active-text=" " inactive-text=" "
                @change="(val) => switchRecommend(scope.row, val, 'tuij')">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="生日蛋糕" min-width="100" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.srtuij === 1" active-text=" " inactive-text=" "
                @change="(val) => switchRecommend(scope.row, val, 'srtuij')">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="250" fixed="right" align="left">
            <template slot-scope="scope">

              <el-button size="mini" v-if="scope.row.flag == 1" type="success"
                @click="CakeBranddelivery(scope.row)">配送范围</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 修改分页显示条件，去掉 v-if 或改为检查数据长度 -->
        <div class="pagination">
          <el-pagination v-if="total > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>


      </el-card>
    </template>

    <router-view></router-view>
  </div>
</template>

<script>
import { brandListcake, brandCityListcake, switchBrandcake, delBrandcake ,updateCakeBrand } from '@/api/modules/login'

export default {
  name: 'CakeBrand',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复提交
      loading: false,
      tableshow: true,
      multipleSelection: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      // 搜索表单
      searchForm: {
        search_key: 'name',
        search_val: '',
        city_id: '',
        tuijzt: 'status',
        sh: 'status',
        px_key: '',
        px_val: 'desc'
      },
      // 城市列表
      cityList: [],
      dialogImageUrl: '',
      form: {
        name: '',
        resource: '',
        desc: ''
      },
      menuList: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  watch: {

    // ✅ 监听路由变化
    '$route'(to, from) {
      console.log(to)
      console.log('to')
      // 当从编辑页返回列表时，刷新数据
      if (to.name === 'CakeBrand') {
        this.getBrandList()
      }
    },

  },
  computed: {
    isCakeBrand() {
      return this.$route.name === 'CakeBrand' || this.$route.path === '/cake/brand'
    }
  },
  mounted() {
    this.getBrandList()
    this.getCityList()  // 调用获取城市列表
  },
  methods: {
    // 更新蛋糕品牌 - 对接第三方全部更新
async handleUpdateBrand() {
  this.$confirm(
    '确定要更新蛋糕品牌吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    this.loading = true
    try {
      const res = await updateCakeBrand()
      if (res.code === 200) {
        this.$message.success(res.msg || '蛋糕品牌更新成功')
        // 刷新列表
        this.currentPage = 1
        this.getBrandList()
      } else {
        this.$message.error(res.msg || '蛋糕品牌更新失败')
      }
    } catch (error) {
      console.error('更新蛋糕品牌失败:', error)
      const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
      this.$message.error('更新失败：' + errorMsg)
    } finally {
      this.loading = false
    }
  }).catch(() => {
    // 用户取消操作
  })
},
    // 获取品牌列表
    async getBrandList() {
      this.loading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          city_id: this.searchForm.city_id,
          tuijzt: this.searchForm.tuijzt,
          sh: this.searchForm.sh,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: String(this.currentPage),
          limit: String(this.pageSize)
        }

        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await brandListcake(params)
        console.log('品牌列表数据:', res)

        if (res.code === 200) {
          this.tableData = res.data.data || res.data.list || []
          this.total = res.data.total || res.data.count || 0

          // 如果total还是0，可以测试显示分页
          // this.total = 100 // 测试用
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('网络异常，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 获取城市列表
    async getCityList() {
      try {
        const res = await brandCityListcake()
        if (res.code === 200) {
          this.cityList = res.data || []
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.getBrandList()
    },

    // 添加品牌
    addPro() {

      this.$router.push({ name: 'AddCakeBrand' }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    // 批量删除
    // 批量删除
    async batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的品牌')
        return
      }

      try {
        await this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个品牌？`, '提示', {
          type: 'warning'
        })

        const ids = this.multipleSelection.map(item => item.id).join(',')
        const params = new FormData()
        params.append('ids', ids)

        const res = await delBrandcake(params)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getBrandList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },

    // 表格选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 修改排序
    async updateSort(row, val) {
      this.$message.success('排序更新成功')
    },

    // 切换显示状态
    // 切换显示状态（带确认框）
    async switchStatus(row, newVal) {
      const targetStatus = newVal ? 1 : 0
      const actionText = targetStatus === 1 ? '显示' : '隐藏'

      try {
        await this.$confirm(`确认将品牌"${row.name}"${actionText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const params = new FormData()
        params.append('id', row.id)
        params.append('type', 'sh')

        const res = await switchBrandcake(params)
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          row.sh = res.data?.sh ?? targetStatus
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          this.$forceUpdate()
        }
      } catch (error) {
        console.error('切换状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.$forceUpdate()
      } finally {
        this.statusChanging = false
      }
    },

    // 切换推荐状态
    // 切换推荐状态（带确认框）
    async switchRecommend(row, newVal, type) {
      const targetStatus = newVal ? 1 : 0

      let actionText = ''
      let apiType = ''
      let fieldName = ''

      if (type === 'tuij') {
        actionText = targetStatus === 1 ? '精选推荐' : '取消精选推荐'
        apiType = 'tuij'
        fieldName = 'tuij'
      } else if (type === 'srtuij') {
        actionText = targetStatus === 1 ? '生日蛋糕推荐' : '取消生日蛋糕推荐'
        apiType = 'srtuij'
        fieldName = 'srtuij'
      }

      try {
        await this.$confirm(`确认将品牌"${row.name}"${actionText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const params = new FormData()
        params.append('id', row.id)
        params.append('type', apiType)

        const res = await switchBrandcake(params)
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          row[fieldName] = targetStatus
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          this.$forceUpdate()
        }
      } catch (error) {
        console.error('切换推荐状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.$forceUpdate()
      } finally {
        this.statusChanging = false
      }
    },
    CakeBranddelivery(row) {
      this.$router.push({ name: 'CakeBranddelivery', query: { id: row.id } })
    },
    // 编辑
    handleEdit(row) {
      // this.$router.push(`/cake/brand/edit/${row.id}`)
      this.$router.push({ name: 'AddCakeBrand', query: { id: row.id } })
    },

    // 删除单个
    // 删除单个
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该品牌？', '提示', {
          type: 'warning'
        })

        const params = new FormData()
        params.append('ids', row.id)

        const res = await delBrandcake(params)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getBrandList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getBrandList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getBrandList()
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

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}

.w120 {
  width: 120px;
}

.brand-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.brand-id {
  font-size: 12px;
  color: #999;
}

.short-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-image {
  width: 60px;
  height: 60px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-table .cell) {
  line-height: 1.4;
}

:deep(.el-input-number--mini) {
  width: 100%;
}
</style>