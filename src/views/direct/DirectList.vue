<template>

  <div class="list-container">
    <template v-if="IsDirectList">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <!-- 品牌筛选 -->
          <el-form-item label="">
            <el-select v-model="searchForm.brand_id" placeholder="请选择品牌" class="w150" clearable filterable>
              <el-option v-for="item in brandList" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 搜索类型 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="标题" value="title"></el-option>
              <el-option label="充值类型" value="type"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 关键词 -->
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>

          <!-- 排序字段 -->
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="添加时间" value="add_time"></el-option>
              <el-option label="点击数" value="djs"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 排序方式 -->
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <!-- 发布状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
              <el-option label="已发布" :value="1"></el-option>
              <el-option label="未发布" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加直充</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete()"
            v-if="multipleSelection.length > 1">批量删除</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" min-width="39"></el-table-column>
          <el-table-column label="编号" min-width="60" prop="id" align="center"></el-table-column>

          <!-- 商品名称（带品牌标识） -->
          <el-table-column label="商品名称" min-width="400" align="left">
            <template slot-scope="scope">
              <span class='blueCl'>[{{ getBrandName(scope.row.brand_id) }}]</span>
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" min-width="120" align="center" prop="name"></el-table-column>

          <el-table-column label="编码" min-width="130" align="center" prop="code"></el-table-column>

          <el-table-column label="价格" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>

          <el-table-column label="供货价" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.ghprice }}
            </template>
          </el-table-column>

          <el-table-column label="添加时间" min-width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>

          <el-table-column label="状态" min-width="100" align="center">
  <template slot-scope="scope">
    <el-switch 
      :value="scope.row.sh === 1"
      active-text=" " 
      inactive-text=" " 
      @change="(val) => toggleStatus(scope.row, val)"
    />
  </template>
</el-table-column>

          <el-table-column label="点击率" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.djs || 0 }}<span style="font-size: 12px;">次</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" style="margin-top: 20px; text-align: right;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <router-view></router-view>
  </div>


</template>

<script>
import {
  zhichongList,
  delZhichong,
  fbZhichong,
  brandListzhichong, 
} from '@/api/modules/zhichong'

export default {
  name: 'ZhichongList',
  data() {
    return { statusChanging: false,  // 新增：防止重复提交
      loading: false,
      brandList: [],        // 品牌列表（用于筛选和显示品牌名）
      searchForm: {
        brand_id: '',     // 品牌id
        search_key: 'title', // 搜索类型: title-标题, type-充值类型, id-编号
        search_val: '',      // 关键词
        px_key: 'add_time',  // 排序字段: add_time-添加时间, djs-点击数, id-编号
        px_val: 'desc',      // 排序方式: desc-降序, asc-升序
        sh: null,            // 发布状态: 1-已发布, 0-未发布
        page: 1,
        limit: 10
      },
      pageInfo: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created() {
    this.getBrandList()
    this.getZhichongList()
  },
  mounted() {

  },
  methods: {
    // 获取品牌列表
    async getBrandList() {
      try {
        const res = await brandListzhichong({ brand_id: '',   limit: 999 })
        if (res.code === 200) {
          this.brandList = res.data.data || []
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      }
    },

    // 获取直充列表
    async getZhichongList() {
      // if (!this.searchForm.brand_id) {
      //   this.tableData = []
      //   this.pageInfo.total = 0
      //   return
      // }

      this.loading = true
      try {
        const params = {
          brand_id: this.searchForm.brand_id,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          sh: this.searchForm.sh,
          page: this.searchForm.page,
          limit: this.searchForm.limit
        }
        // 过滤掉空值
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key]
          }
        })

        const res = await zhichongList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.pageInfo = {
            total: res.data.total,
            per_page: res.data.per_page,
            current_page: res.data.current_page,
            last_page: res.data.last_page
          }
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取直充列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 根据品牌ID获取品牌名称
    getBrandName(brandId) {
      const brand = this.brandList.find(item => item.id === brandId)
      return brand ? brand.title : '未知品牌'
    },

    // 查询
    handleSearch() {
      this.searchForm.page = 1
      this.getZhichongList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        brand_id: null,
        search_key: 'title',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: null,
        page: 1,
        limit: 10
      }
      this.getZhichongList()
    },

    // 切换发布状态
// 切换发布状态（带确认框）
async toggleStatus(row, newVal) {
  // newVal 是布尔值：true=开启(发布), false=关闭(下架)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将直充商品${actionText}吗？`, '提示', {
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
    const res = await fbZhichong({ id: row.id })
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
    // 删除单个直充
    handleDelete(id, index) {
      this.$confirm('确认删除该直充商品吗？删除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delZhichong({ ids: id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.tableData.splice(index, 1)
            if (this.tableData.length === 0 && this.pageInfo.current_page > 1) {
              this.searchForm.page = this.pageInfo.current_page - 1
              this.getZhichongList()
            }
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的直充商品')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个直充商品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delZhichong({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getZhichongList()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 编辑直充
    handleEdit(row) {
      this.$router.push({
        name: 'AddDirectList',
        query: { id: row.id }
      }).catch(err => { })
    },

    // 添加直充
    addPro() {

      this.$router.push({
        name: 'AddDirectList',

      }).catch(err => { })
    },

    // 多选处理
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 分页
    handleSizeChange(val) {
      this.searchForm.limit = val
      this.searchForm.page = 1
      this.getZhichongList()
    },

    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getZhichongList()
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
    }
  },
  watch: {
    'searchForm.brand_id'(newVal) {
      if (newVal) {
        this.searchForm.page = 1
        this.getZhichongList()
      } else {
        this.tableData = []
        this.pageInfo.total = 0
      }
    }
  }, computed: {
    IsDirectList() {
      return this.$route.name === 'ElectronicList' || this.$route.path === '/direct/list'
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
      text-align: left;

      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .w80 {
    width: 80px;
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
}
</style>