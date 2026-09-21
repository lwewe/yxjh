<template>
  <div class="list-container">
    <template v-if="cardspec">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">


          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="请选择类型" class="w120" clearable>
              <el-option label="蜂助手" :value="1"></el-option>
              <el-option label="本地" :value="2"></el-option>
              <el-option label="亿奇达" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.class1" placeholder="请选择分类" class="w150" clearable filterable>
              <el-option v-for="item in classList" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="选择字段" class="w120" clearable>
              <el-option label="标题" value="title"></el-option>
              <el-option label="规格" value="gueige"></el-option>
              <el-option label="充值类型" value="cztype"></el-option>
              <el-option label="开票" value="kaipiao"></el-option>
              <el-option label="SKU" value="sku"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150" clearable></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
              <el-option label="排序" value="px"></el-option>
              <el-option label="添加时间" value="add_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
              <el-option label="升序" value="asc"></el-option>
              <el-option label="降序" value="desc"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="danger" @click="handleUpdateYiqida" style="margin-left: 10px;display: none;">更新亿奇达产品</el-button>


          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加规格</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
            v-if="multipleSelection.length > 1">批量删除</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>

          <el-table-column label="缩略图" width="100" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.img || defaultImg" style="width: 60px;height: 60px;object-fit: cover;" alt="">
            </template>
          </el-table-column>

          <el-table-column label="位置" width="100" align="center">
            <template slot-scope="scope">

              <span v-if="scope.row.type == 1">蜂助手</span>
              <span v-if="scope.row.type == 2">本地</span>
              <span v-if="scope.row.type == 3">亿奇达</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.px" size="mini" type="number" @blur="updateSort(scope.row)"
                style="width: 80px;">
              </el-input>
            </template>
          </el-table-column>

          <el-table-column label="名称" min-width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="blueCl">[{{ scope.row.kaquan_show.title }}]</span> {{ scope.row.title }}
            </template>
          </el-table-column>

          <el-table-column label="规格" width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.gueige || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="SKU" width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.sku || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="刊例价-折扣-供货价" width="200" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.price }}元/{{ scope.row.zk_price }}%/{{ scope.row.ghprice }}元</div>
            </template>
          </el-table-column>


          <el-table-column label="添加时间" width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }} <br>
              {{ formatTime(scope.row.end_time) }}
            </template>
          </el-table-column>

          <el-table-column label="发布状态" width="90" align="center">
            <template slot-scope="scope">

              <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
                @change="(val) => updateStatus(scope.row, val)">
              </el-switch>

            </template>
          </el-table-column>




          <el-table-column label="操作" width="260" fixed="right" align="center">
            <template slot-scope="scope">

              <el-button size="mini" type="success" v-if="scope.row.type == 2"
                @click="addPronum(scope.row)">超市卡</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" style="margin-top: 20px; text-align: right;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
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
import { gueigeList, delGueige, pxGueige, fbGueige, kqGueigeList, updateYiqida } from '@/api/modules/zhichong'


export default {
  name: 'SpecList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复提交
      loading: false,
      defaultImg: require('@/assets/15.png'),
      searchForm: {
        type: '',
        class1: '',
        search_key: 'title',
        search_val: '',
        px_key: 'px',
        px_val: 'asc',
        sh: 'status'
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
      },
      tableData: [],
      multipleSelection: [],
      classList: [] // 卡券分类列表
    }
  },
  mounted() {
    this.getClassList()
    this.getTableData()
  },
  methods: {
    // 更新亿奇达产品 - 对接第三方全部更新
    async handleUpdateYiqida() {
      this.$confirm(
        '确定要更新亿奇达数据吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await updateYiqida()
          if (res.code === 200) {
            this.$message.success(res.msg || '亿奇达产品更新成功')
            // 刷新列表
            this.pagination.current_page = 1
            this.getTableData()
          } else {
            this.$message.error(res.msg || '亿奇达产品更新失败')
          }
        } catch (error) {
          console.error('更新亿奇达产品失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    // 更新发布状态（带确认框）
    async updateStatus(row, newVal) {
      // newVal 是布尔值：true=开启(发布), false=关闭(下架)
      const targetStatus = newVal ? 1 : 0

      // 确定操作文本
      const actionText = targetStatus === 1 ? '发布' : '下架'

      // 添加确认框
      try {
        await this.$confirm(`确认将规格${actionText}吗？`, '提示', {
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
        const res = await fbGueige({ id: row.id })
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
        console.error('切换状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.$forceUpdate()
      } finally {
        this.statusChanging = false
      }
    },
    // 获取卡券分类列表
    async getClassList() {
      try {
        const res = await kqGueigeList()
        if (res.code === 200) {
          this.classList = res.data
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
      }
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const params = {
          type: this.searchForm.type,
          class1: this.searchForm.class1,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          sh: this.searchForm.sh,
          page: this.pagination.current_page,
          limit: this.pagination.per_page
        }

        const res = await gueigeList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.pagination.total = res.data.total
          this.pagination.per_page = res.data.per_page
          this.pagination.current_page = res.data.current_page
          this.pagination.last_page = res.data.last_page
        }
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.getTableData()
    },

    // 重置搜索


    // 分页
    handleSizeChange(val) {
      this.pagination.per_page = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pagination.current_page = val
      this.getTableData()
    },

    // 更新排序
    async updateSort(row) {
      if (!row.px && row.px !== 0) return
      try {
        const res = await pxGueige({ id: row.id, px: row.px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        }
      } catch (error) {
        this.$message.error('排序修改失败')
        this.getTableData() // 刷新恢复原值
      }
    },

    // 上下架切换
    async toggleStatus(row) {
      try {
        const res = await fbGueige({ id: row.id, status: row.status })
        if (res.code === 200) {
          this.$message.success('状态修改成功')
        }
      } catch (error) {
        this.$message.error('状态修改失败')
        row.status = row.status === 1 ? 0 : 1 // 回滚
      }
    },

    // 发布/取消发布
    async handlePublish(row) {
      const action = row.sh === 1 ? '取消发布' : '发布'
      this.$confirm(`确认${action}该规格吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await fbGueige({ id: row.id })
          if (res.code === 200) {
            this.$message.success(`${action}成功`)
            this.getTableData()
          }
        } catch (error) {
          this.$message.error(`${action}失败`)
        }
      }).catch(() => { })
    },

    // 删除单个
    handleDelete(row) {
      this.$confirm('确认删除该规格吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delGueige({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getTableData()
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delGueige({ ids: ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getTableData()
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 编辑
    handleEdit(row) {
      this.$router.push({
        name: 'AddCardSpec',
        query: { id: row.id }
      })
    },
    addPronum(row) {


      this.$router.push({
        name: 'CardSpecnum',
        query: { id: row.id }
      })

    },
    // 添加规格
    addPro() {

      this.$router.push({
        name: 'AddCardSpec',

      }).catch(err => { })
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }, computed: {
    cardspec() {
      return this.$route.name === 'CardSpec' || this.$route.path === '/card/spec'
    }
  }
}
</script>

<style scoped>
.list-container {
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.search-card .search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.w100 {
  width: 100px;
}

.w120 {
  width: 120px;
}

.w150 {
  width: 150px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>