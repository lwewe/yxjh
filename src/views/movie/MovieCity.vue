<template>
  <div class="list-container">
    <template v-if="moviecitys">
      <!-- 搜索表单 -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-input v-model="searchForm.name" placeholder="请输入城市名称" class="w150" clearable></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.pinyin" placeholder="请输入拼音" class="w150" clearable></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.ishot" placeholder="请选择" class="w120" clearable>
              <el-option label="热门" value="1"></el-option>
              <el-option label="非热门" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="success" size="small" icon="el-icon-refresh" @click="refreshList">刷新</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column label="编号" width="100" prop="id" align="center"></el-table-column>

          <el-table-column label="城市" min-width="250" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="拼音" width="190" align="center">
            <template slot-scope="scope">
              {{ scope.row.pinyin }}
            </template>
          </el-table-column>

          <el-table-column label="轩夸城市ID" width="180" align="center">
            <template slot-scope="scope">
              {{ scope.row.cityid1 }}

            </template>
          </el-table-column>

          <el-table-column label="奇票城市ID" width="180" align="center">
            <template slot-scope="scope">
              {{ scope.row.cityid2 }}
            </template>
          </el-table-column>

          <el-table-column label="热门" width="150" align="center">
            <template slot-scope="scope">
              <el-switch 
  :value="scope.row.ishot === 1"
  active-text=" " 
  inactive-text=" " 
  @change="(val) => updateHotCity(scope.row, val)"
/>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleDiquList(scope.row)">地区列表</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
            :current-page="pagination.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.per_page"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  cityList,
  updateXuankuaCity,
  updateQipiaoCity,
  hotCity,
  diquList
} from '@/api/modules/video'

export default {
  name: 'CityList',
  data() {
    return { statusChanging: false,  // 新增：防止重复提交
      loading: false,
      searchForm: {
        name: '',
        pinyin: '',
        ishot: ''
      },
      tableData: [],
      pagination: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取城市列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
          limit: this.pagination.per_page,
          ...this.searchForm
        }

        // 过滤空值
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await cityList(params)
        if (res.code === 200) {
          this.tableData = res.data.list || []
          // 如果接口返回分页信息
          if (res.data.total) {
            this.pagination.total = res.data.total
          }
          if (res.data.per_page) {
            this.pagination.per_page = res.data.per_page
          }
          if (res.data.current_page) {
            this.pagination.current_page = res.data.current_page
          }
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

    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        name: '',
        pinyin: '',
        ishot: ''
      }
      this.handleSearch()
    },

    // 刷新列表
    refreshList() {
      this.getList()
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination.current_page = page
      this.getList()
    },

    handleSizeChange(size) {
      this.pagination.per_page = size
      this.pagination.current_page = 1
      this.getList()
    },

    // 修改轩夸城市ID
    async updateXuankuaCity(row) {
      if (row.cityid1 === undefined || row.cityid1 === null) return
      try {
        const res = await updateXuankuaCity({
          id: row.id,
          cityid1: row.cityid1
        })
        if (res.code === 200) {
          this.$message.success('轩夸城市ID修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
          this.getList() // 刷新恢复原值
        }
      } catch (error) {
        console.error('修改轩夸城市ID失败:', error)
        this.$message.error('修改失败')
        this.getList()
      }
    },

    // 修改奇票城市ID
    async updateQipiaoCity(row) {
      if (row.cityid2 === undefined || row.cityid2 === null) return
      try {
        const res = await updateQipiaoCity({
          id: row.id,
          cityid2: row.cityid2
        })
        if (res.code === 200) {
          this.$message.success('奇票城市ID修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
          this.getList() // 刷新恢复原值
        }
      } catch (error) {
        console.error('修改奇票城市ID失败:', error)
        this.$message.error('修改失败')
        this.getList()
      }
    },

    // 修改热门状态
     // 修改热门状态（带确认框）
async updateHotCity(row, newVal) {
  // newVal 是布尔值：true=开启(热门), false=关闭(非热门)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '设为热门' : '取消热门'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将城市"${row.name}"${actionText}吗？`, '提示', {
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
    const res = await hotCity({
      id: row.id,
      ishot: targetStatus
    })
    if (res.code === 200) {
      this.$message.success(`${actionText}成功`)
      // 更新本地数据
      row.ishot = targetStatus
    } else {
      this.$message.error(res.msg || `${actionText}失败`)
      // 恢复开关状态（通过视图更新）
      this.$forceUpdate()
    }
  } catch (error) {
    console.error('切换热门状态失败:', error)
    this.$message.error('网络错误，请稍后重试')
    this.$forceUpdate()
  } finally {
    this.statusChanging = false
  }
},

    // 查看地区列表
    handleDiquList(row) {
     
      this.$router.push({ name: 'MovieCitynum', query: { pid: row.id } }).catch(err => { })
    }
  }, computed: {
    moviecitys() {
      return this.$route.name === 'MovieCity' || this.$route.path === '/movie/city'
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