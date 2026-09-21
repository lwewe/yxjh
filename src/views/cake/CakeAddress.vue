<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" @click="fetchCityList" :loading="loading" style="display: none;">
          刷新列表
        </el-button>
        <el-button type="primary" size="small" @click="handleUpdateCity" :loading="loading">
          更新地址
        </el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        v-loading="loading">
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column label="首字母" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.first_letter }}
          </template>
        </el-table-column>

        <el-table-column label="城市名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="热门城市" width="320" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.tuij" :active-value="1" :inactive-value="0"
              @change="(val) => handleSwitchChange(scope.row, val)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <div class="pagination" v-if="total > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div> -->
    </el-card>
  </div>
</template>

<script>

import { cityListcake, switchCitycake, handleUpdateCity } from '@/api/modules/login'

export default {
  name: 'CityList',  // 修改组件名
  data() {
    return {
      loading: false,
      tableData: [],
      allCityData: [], // 存储所有城市数据
      currentPage: 1,
      pageSize: 20,
      total: 0,
      // 保留原有的一些数据（如果需要可以删除）
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '',
        tm1: '',
        tm2: ''
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      form: {
        name: '',
        resource: '',
        desc: '',
        date: ''
      },
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: []
    }
  },
  mounted() {
    this.fetchCityList()
  },
  methods: {
    // 更新蛋糕城市 - 对接第三方全部更新
    async handleUpdateCity() {
      this.$confirm(
        '确定要更新地址？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await handleUpdateCity()
          if (res.code === 200) {
            this.$message.success(res.msg || '蛋糕城市更新成功')
            // 更新成功后刷新列表
            this.fetchCityList()
          } else {
            this.$message.error(res.msg || '蛋糕城市更新失败')
          }
        } catch (error) {
          console.error('更新蛋糕城市失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    // 获取城市列表
    async fetchCityList() {
      this.loading = true
      try {
        const res = await cityListcake()

        if (res.code === 200) {
          this.allCityData = res.data
          this.total = this.allCityData.length
          this.tableData = res.data
          // this.updateTableData()
        } else {
          this.$message.error(res.msg || '获取城市列表失败')
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
        this.$message.error('网络请求失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 更新表格数据（分页）
    updateTableData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      this.tableData = this.allCityData.slice(start, end)
    },

    // 切换页码
    handleCurrentChange(page) {
      this.currentPage = page
      this.updateTableData()
    },

    // 切换热门城市状态
    async handleSwitchChange(row, val) {
      // 反推之前的值（用于失败回滚）
      const previousVal = val === 1 ? 0 : 1

      // 状态文本映射
      const typeTextMap = {
        tuij: val === 1 ? '设为热门城市' : '取消热门城市'
      }

      try {
        // 弹出确认框
        await this.$confirm(`确定${typeTextMap.tuij}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await switchCitycake({
          id: row.id
        })

        if (res.code === 200) {
          // 使用后端返回的值更新
          row.tuij = res.data.tuij

          // 同步更新allCityData
          const indexInAll = this.allCityData.findIndex(item => item.id === row.id)
          if (indexInAll !== -1) {
            this.allCityData[indexInAll].tuij = res.data.tuij
          }

          this.$message.success(res.msg || '状态修改成功')
        } else {
          // 更新失败，回滚状态
          row.tuij = previousVal
          this.$message.error(res.msg || '修改失败')
        }
      } catch (error) {
        // 用户取消或请求失败，回滚状态
        row.tuij = previousVal
        if (error !== 'cancel') {
          console.error('切换热门状态失败:', error)
          this.$message.error('网络请求失败，请稍后重试')
        }
      }
    },

    // 原有的方法（如果不需要可以删除）
    handleClose() {
      this.dialogVisible = false;
    },
    handleRemove() {

    },
    handlePictureCardPreview() { },
    handleDelete(index, row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
      }).catch(() => { })
      console.log(index, row);
    },
    addPro() {
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
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

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>