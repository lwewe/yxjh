<template>
  <div class="list-container">
    <template v-if="isAddressList">
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="delOptions()">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh-right" @click="updateAddress('province')">更新一级地址</el-button>
          <el-button type="danger" size="small" icon="el-icon-refresh-right" @click="updateAddress('all')">更新全部地址（*配置低的服务器，不建议使用）</el-button>
        </div>

        

        <!-- 表格 -->
        <el-table 
          ref="multipleTable" 
          :data="tableData" 
          border 
          tooltip-effect="dark" 
          style="width: 100%" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          v-loading="loading"
        >
          
          
          
          <el-table-column label="编号" min-width="120" prop="id" align="center"></el-table-column>
          
          <el-table-column label="名称" min-width="180" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          
          <el-table-column label="类型" min-width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.type }}
              <el-tag :type="getTypeTagType(scope.row.type)" size="small">
                {{ getTypeName(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <!-- <el-table-column label="父级ID" width="120" prop="pid" align="center"></el-table-column> -->
          
          <el-table-column label="操作" min-width="380" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewChildren(scope.row)">查看</el-button>
              <el-button size="mini" type="warning" @click="updateChildren(scope.row)">更新二级地址</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" style="margin-top: 20px; text-align: right;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { addressList,updateProvince,
  updateCity,
  updateCounty,
  updateTown,
  updateAddress } from '@/api/modules/login'

export default {
  name: 'AddressList',
  data() {
    return {
      loading: false,           // 加载状态
      tableData: [],            // 表格数据
      multipleSelection: [],    // 多选选中的行
      dialogVisible: false,     // 弹窗显示状态
      searchForm: {             // 搜索表单
        name: '',
        type: ''
      },
      pageInfo: {               // 分页信息
        page: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  computed: {
    isAddressList() {
      // 只要不是子路由页面，就显示列表
      return this.$route.name === 'AddressList' || this.$route.path === '/product/address'
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    // 获取地址列表
    async getAddressList() {
      this.loading = true
      try {
        const params = {
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
          ...this.searchForm
        }
        const res = await addressList(params)
        if (res.code === 200) {
          this.tableData = res.data.list || []
          this.pageInfo.total = res.data.total || this.tableData.length
        } else {
          this.$message.error(res.msg || '获取地址列表失败')
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
        this.$message.error('获取地址列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    searchAddress() {
      this.pageInfo.page = 1
      this.getAddressList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        name: '',
        type: ''
      }
      this.pageInfo.page = 1
      this.getAddressList()
    },

    // 每页条数变化
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.pageInfo.page = 1
      this.getAddressList()
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getAddressList()
    },

    // 更新地址
    // updateAddress(type) {
    //   const msg = type === 'province' ? '确认更新一级地址吗？' : '确认更新全部地址吗？此操作可能较耗时！'
    //   this.$confirm(msg, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async () => {
    //     // TODO: 调用更新接口
    //     this.$message.success('更新任务已提交')
    //   }).catch(() => {})
    // },

// 修改后
updateAddress(type) {
  const configMap = {
    province: {
      msg: '确认更新一级地址（省）吗？',
      api: updateProvince,
      successMsg: '一级地址更新成功'
    },
    city: {
      msg: '确认更新二级地址（市）吗？',
      api: updateCity,
      successMsg: '二级地址更新成功'
    },
    county: {
      msg: '确认更新三级地址（区）吗？',
      api: updateCounty,
      successMsg: '三级地址更新成功'
    },
    town: {
      msg: '确认更新四级地址（街道）吗？',
      api: updateTown,
      successMsg: '四级地址更新成功'
    },
    all: {
      msg: '确认更新全部地址吗？此操作可能较耗时，低配置服务器不建议使用！',
      api: updateAddress,
      successMsg: '全部地址更新成功'
    }
  }

  const config = configMap[type]
  if (!config) {
    this.$message.error('未知的更新类型')
    return
  }

  this.$confirm(config.msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await config.api()
      if (res.code === 200) {
        this.$message.success(res.msg || config.successMsg)
        this.getAddressList() // 刷新列表
      } else {
        this.$message.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('地址更新失败:', error)
      this.$message.error('更新失败，请稍后重试')
    }
  }).catch(() => {})
},
    // 查看下级地址
    viewChildren(row) {
      this.$router.push({
        name: 'AddressListdetails',
        query: { 
          pid: row.id, 
          name: row.name,
          type: row.type
        }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    // 更新下级地址
    // updateChildren(row) {
    //   this.$confirm(`确认更新"${row.name}"的下级地址吗？`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async () => {
    //     // TODO: 调用更新下级地址接口
    //     this.$message.success('更新任务已提交')
    //   }).catch(() => {})
    // },
    updateChildren(row) {
  this.$confirm(`确认更新"${row.name}"的下级地址吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateCity()  // 更新二级地址
      if (res.code === 200) {
        this.$message.success(res.msg || '二级地址更新成功')
        this.getAddressList()
      } else {
        this.$message.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('地址更新失败:', error)
      this.$message.error('更新失败，请稍后重试')
    }
  }).catch(() => {})
},

    // 批量删除
    delOptions() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // TODO: 调用删除接口，传入 this.multipleSelection 中的 id
        // const ids = this.multipleSelection.map(item => item.id)
        this.$message.success('删除成功')
        this.getAddressList() // 刷新列表
      }).catch(() => {})
    },

    // 获取类型名称（显示用）
    getTypeName(type) {
      const typeMap = {
        'province': '省',
        'city': '市',
        'county': '区',
        'town': '街道'
      }
      return typeMap[type] || type
    },

    // 获取类型标签样式
    getTypeTagType(type) {
      const typeMap = {
        'province': 'danger',
        'city': 'warning',
        'county': 'success',
        'town': 'info'
      }
      return typeMap[type] || ''
    },

    // 表格多选变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      margin-bottom: 20px;
      
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }

    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>