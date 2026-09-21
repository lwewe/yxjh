<template>
  <div class="list-container">
    <template v-if="addelectronic">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.brand_id" placeholder="请选择品牌" clearable filterable class="w150">
              <el-option v-for="item in brandList" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索方式" class="w120">
              <el-option label="标题" value="title"></el-option>
              <el-option label="介绍" value="jieshao"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150" clearable></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="添加时间" value="add_time"></el-option>
              <el-option label="点击数" value="djs"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序规则" class="w120"  >
              <el-option label="升序" value="asc"></el-option>
              <el-option label="降序" value="desc"></el-option>
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
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加电子券</el-button>
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

          <el-table-column label="缩略图" min-width="110" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.img || defaultImg" style="width: 50px; height: 50px; object-fit: contain;" alt="">
            </template>
          </el-table-column>

          <el-table-column label="标题" min-width="200" align="left">
            <template slot-scope="scope">
              <div>
                <span style="color: #409eff; ">[{{ scope.row.brand?.title || '-' }}]</span>
                <span> {{ scope.row.title }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="价格" min-width="100" align="center">
            <template slot-scope="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>

          <el-table-column label="添加时间" min-width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>

          <el-table-column label="发布状态" min-width="100" align="center">
  <template slot-scope="scope">
    <el-switch 
      :value="scope.row.sh === 1"
      active-text=" " 
      inactive-text=" " 
      @change="(val) => handleStatusChange(scope.row, val)"
    />
  </template>
</el-table-column>

          <el-table-column label="点击率" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.djs }}<span class="fs10">次</span>
            </template>
          </el-table-column>

          <el-table-column label="电子券统计" min-width="130" align="center">
            <template slot-scope="scope">
              <div class="fs12">已领取: {{ scope.row.ylq }}</div>
              <div class="fs12">未领取: {{ scope.row.wlq }}</div>
            </template>
          </el-table-column>

          <el-table-column label="限购" min-width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sj === 1">不限购</span>
              <span v-else-if="scope.row.sj === 2">每日{{ scope.row.num }}次</span>
              <span v-else-if="scope.row.sj === 3">总限{{ scope.row.num }}次</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleViewCoupon(scope.row)">电子券</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>

        <!-- 权限树区域（保留原逻辑） -->
        <div v-if="!tableshow">
          <div class="permission-tree">
            <div class="select-all">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                全选所有权限
              </el-checkbox>
              <span class="selected-count">已选择 {{ selectedCount }} 个权限</span>
            </div>
            <el-divider></el-divider>
            <div class="permission-modules">
              <div v-for="module in menuList" :key="module.path" class="module-item">
                <div class="module-header">
                  <el-checkbox v-model="module.checked" :indeterminate="module.indeterminate"
                    @change="(val) => handleModuleChange(module, val)">
                    <i :class="module.meta.icon"></i>
                    <span class="module-title">{{ module.meta.title }}</span>
                  </el-checkbox>
                </div>
                <div class="module-children" v-if="module.children && module.children.length">
                  <el-checkbox-group v-model="module.checkedChildren"
                    @change="(val) => handleChildrenChange(module, val)">
                    <el-checkbox v-for="child in module.children" :key="child.path"
                      :label="getPermissionId(module, child)" class="child-item">
                      {{ child.meta.title }}
                      <span class="permission-path">({{ child.path }})</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="module-children" v-else>
                  <el-checkbox :value="module.checked" @change="(val) => handleModuleChange(module, val)"
                    class="child-item">
                    访问权限
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { couponsListcoupons, delCouponscoupons, fbCouponscoupons } from '@/api/modules/login'
import { menuList } from '@/router/menu'

export default {
  name: 'ElectronicList',
  data() {
    return {
      loading: false,
      searchForm: {
        brand_id: '',
        search_key: 'title',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: ''
      },
      brandList: [], // 品牌列表
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      multipleSelection: [],
      tableshow: true,
      menuList: menuList || [],
      checkAll: false,
      isIndeterminate: false,
      selectedCount: 0,
      statusChanging: false,  // 新增：防止重复提交
      defaultImg: require('@/assets/14.png') // 默认图片
    }
  },
  computed: {
    addelectronic() {
      return this.$route.name === 'AddDirectBrand' || this.$route.path === '/electronic/list'
    }
  },
  mounted() {
    this.getList()
    this.getBrandList()
  },
  methods: {
    // 获取电子券列表
    async getList() {
      this.loading = true
      try {
        const params = new FormData()
        params.append('page', this.page)
        params.append('limit', this.limit)

        if (this.searchForm.brand_id) {
          params.append('brand_id', this.searchForm.brand_id)
        }
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.append('search_key', this.searchForm.search_key)
          params.append('search_val', this.searchForm.search_val)
        }
        if (this.searchForm.px_key && this.searchForm.px_val) {
          params.append('px_key', this.searchForm.px_key)
          params.append('px_val', this.searchForm.px_val)
        }
        if (this.searchForm.sh !== '' && this.searchForm.sh !== null && this.searchForm.sh !== undefined) {
          params.append('sh', this.searchForm.sh)
        }

        const res = await couponsListcoupons(params)

        if (res.code === 200) {
          this.tableData = res.data?.data || []
          this.total = res.data?.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 获取品牌列表
    async getBrandList() {
      try {
        // 如果品牌接口已经引入，可以调用
        // const res = await brandList({ page: 1, limit: 100 })
        // if (res.code === 200) {
        //   this.brandList = res.data?.data || []
        // }

        // 临时方案：从现有数据中提取品牌
        if (this.tableData.length > 0) {
          const brands = new Map()
          this.tableData.forEach(item => {
            if (item.brand && !brands.has(item.brand.id)) {
              brands.set(item.brand.id, item.brand)
            }
          })
          this.brandList = Array.from(brands.values())
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      }
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        brand_id: '',
        search_key: 'title',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: ''
      }
      this.page = 1
      this.getList()
    },

    // 分页-每页条数变化
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
      this.getList()
    },

    // 分页-当前页变化
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    // 添加电子券
    addPro() {
      this.$router.push({ name: 'AddElectronicList' }).catch(err => { })
    },

    // 修改发布状态
    // 修改发布状态（带确认框）
async handleStatusChange(row, newVal) {
  // newVal 是布尔值：true=开启(发布), false=关闭(下架)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将电子券"${row.title}"${actionText}吗？`, '提示', {
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
    const res = await fbCouponscoupons({ id: row.id })
    if (res.code === 200) {
      this.$message.success(`${actionText}成功`)
      // 更新本地数据
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

    // 删除电子券
    handleDelete(row) {
      this.$confirm(`确认删除电子券"${row.title}"吗？删除后无法恢复！`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', row.id)

          const res = await delCouponscoupons(params)

          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getList() // 刷新列表
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 查看电子券码详情
    handleViewCoupon(row) {
      this.$router.push({
        name: 'ElectronicListnum',
        query: { id: row.id }
      })
    },

    // 编辑电子券
    handleEdit(row) {
      this.$router.push({
        name: 'AddElectronicList',
        query: { id: row.id }
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的电子券')
        return
      }

      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个电子券吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', ids)

          const res = await delCouponscoupons(params)

          if (res.code === 200) {
            this.$message.success(`成功删除 ${this.multipleSelection.length} 个电子券`)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 权限树相关方法
    handleCheckAllChange(val) {
      // 保留原有逻辑
    },

    handleModuleChange(module, val) {
      // 保留原有逻辑
    },

    handleChildrenChange(module, val) {
      // 保留原有逻辑
    },

    getPermissionId(module, child) {
      return `${module.path}_${child.path}`
    }
  },
  watch: {
    '$route.name'(newName) {
      if (newName === 'ElectronicList') {
        this.getList()
      }
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

.w100 {
  width: 100px;
}

.w150 {
  width: 150px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
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
}
</style>