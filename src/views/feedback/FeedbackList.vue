<template>
  <div class="list-container-feedlist ">
    <el-card class="formsTop">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <!-- 意见分类 -->
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="意见分类" class="w140" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 搜索字段 -->
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w130">
            <el-option label="反馈内容" value="content"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 关键词 -->
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
        </el-form-item>

        <!-- 排序字段 -->
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w130">
            <el-option label="反馈时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 排序方式 -->
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w100">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <!-- 查看状态 -->
        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="查看状态" class="w120" clearable>
            <el-option label="全部" value="status"></el-option>
            <el-option label="已查看" value="1"></el-option>
            <el-option label="未查看" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
           
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog title="反馈详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div style="width: 80%; margin: auto;" v-loading="detailLoading">
        <el-form ref="form" :model="detailForm" label-width="120px" label-position="right" style="text-align: left;">
          <el-form-item label="反馈用户：">
            <el-input :value="detailForm.uid" readonly></el-input>
          </el-form-item>

          <el-form-item label="意见分类：">
            <el-input :value="getCategoryName(detailForm.pid)" readonly></el-input>
          </el-form-item>

          <!-- <el-form-item label="图片：" style="text-align: left;" v-if="detailForm.img">
            <el-image style="width: 100px; height: 100px;" :src="detailForm.img" :preview-src-list="[detailForm.img]">
            </el-image>
          </el-form-item> -->
<el-form-item label="图片：" style="text-align: left;" v-if="getImgList(detailForm.img).length > 0">
  <el-image 
    v-for="(img, index) in getImgList(detailForm.img)" 
    :key="index"
    style="max-width: 100px; height: 100px; margin-right: 10px;object-fit: fill;" 
    :src="img" 
    :preview-src-list="getImgList(detailForm.img)">
  </el-image>
</el-form-item>
          <el-form-item label="反馈内容：">
            <el-input :value="detailForm.content" readonly type="textarea" :rows="3"></el-input>
          </el-form-item>

          <el-form-item label="反馈时间：">
            <el-input :value="formatTime(detailForm.add_time)" readonly></el-input>
          </el-form-item>

          <el-form-item label="是否查看：">
            <el-radio-group v-model="detailForm.sh" :disabled="detailForm.sh == 1">
              <el-radio :label="0">未查看</el-radio>
              <el-radio :label="1">已查看</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注：">
            <el-input v-model="detailForm.con" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFeedback" :loading="saving">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-card class="search-card mt20">
      <div class="txtleft mb10">
        <el-button type="danger" size="small" @click="batchDelete" v-if="multipleSelection.length > 0">
          批量删除 ({{ multipleSelection.length }})
        </el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="编号"  min-width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>

        <el-table-column label="反馈用户" align="center"  min-width="100">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>

        <el-table-column label="反馈栏目"  min-width="160" align="center">
          <template slot-scope="scope">{{ getCategoryName(scope.row.pid) }}</template>
        </el-table-column>

        <el-table-column label="反馈内容" min-width="300" align="center">
          <template slot-scope="scope">
            <div class="txtleft">{{ scope.row.content }}</div>
          </template>
        </el-table-column>

        <el-table-column label="反馈时间" align="center"  min-width="170">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>

        <el-table-column label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span :class="scope.row.sh == 0 ? 'dangerCl' : 'successCl'">
              {{ scope.row.sh == 1 ? '已查看' : '未查看' }}
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作"  min-width="260" fixed="right" align="center">
  <template slot-scope="scope">
    <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
    <el-button 
      size="mini" 
      :type="scope.row.sh == 1 ? 'warning' : 'success'" 
      @click="toggleStatus(scope.row)">
      {{ scope.row.sh == 1 ? '标为未查看' : '标为已查看' }}
    </el-button>
    <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
  </template>
</el-table-column>

      </el-table>
    </el-card>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
        :current-page="currentPage" @current-change="handlePageChange">
      </el-pagination>
      <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 1 }} 页</div>
    </div>
  </div>
</template>

<script>
import { feedbackList, getFeedback, editFeedback, delFeedback, showFenLen ,ckFeedback} from '@/api/modules/myorder'

export default {
  name: 'FeedbackList',
  data() {
    return {
      loading: false,
      detailLoading: false,
      saving: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        pid: '',
        search_key: 'content',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: 'status'
      },
      categoryList: [],
      multipleSelection: [],
      tableData: [],
      dialogVisible: false,
      detailForm: {}
    }
  },
  mounted() {
    this.loadCategory()
    this.loadData()
  },
  methods: {
    // 将 img 字符串按 '-' 分割成数组
getImgList(imgStr) {
  if (!imgStr) return []
  return imgStr.split('-').filter(url => url)  // filter 过滤空字符串
},
    // 快速切换查看状态
async toggleStatus(row) {
  try {
    const res = await ckFeedback({ id: row.id })
    if (res.code === 200) {
      row.sh = res.data.sh
      this.$message.success('状态修改成功')
    } else {
      this.$message.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('切换状态失败:', error)
    this.$message.error('操作失败')
  }
},
    // 加载分类列表
    async loadCategory() {
      try {
        const res = await showFenLen()
        if (res.code === 200) {
          this.categoryList = res.data || []
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    },

    // 加载列表
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          pid: this.searchForm.pid || '',
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val || '',
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          sh: this.searchForm.sh
        }

        const res = await feedbackList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    handleReset() {
      this.searchForm = {
        pid: '',
        search_key: 'content',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: 'status'
      }
      this.currentPage = 1
      this.loadData()
    },

    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 查看详情
    async viewDetail(row) {
      this.dialogVisible = true
      this.detailLoading = true
      try {
        const res = await getFeedback({ id: row.id })
        if (res.code === 200) {
          this.detailForm = res.data || {}
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
      } finally {
        this.detailLoading = false
      }
    },

    // 保存反馈
    async saveFeedback() {
      this.saving = true
      try {
        const res = await editFeedback({
          id: this.detailForm.id,
          sh: this.detailForm.sh,
          con: this.detailForm.con || ''
        })
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.loadData()
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      } finally {
        this.saving = false
      }
    },

    // 删除
    async deleteItem(id) {
      try {
        await this.$confirm('确认删除吗？', '提示', { type: 'warning' })
        const res = await delFeedback({ ids: String(id) })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },

    // 批量删除
    async batchDelete() {
      try {
        await this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条记录吗？`, '提示', { type: 'warning' })
        const ids = this.multipleSelection.map(item => item.id).join(',')
        const res = await delFeedback({ ids })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.multipleSelection = []
          this.loadData()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },

    handleClose() {
      this.dialogVisible = false
    },

    getCategoryName(pid) {
      const item = this.categoryList.find(c => c.id == pid)
      return item ? item.title : '未知分类'
    },

    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }
  }
}
</script>
<style>
.list-container-feedlist .formsTop .el-card__body { padding: 20px 20px 0 20px; }</style>
<style scoped>
.list-container-feedlist { font-size: 14px;  }



.mt20 { margin-top: 20px; }
.mb10 { margin-bottom: 10px; }
.txtleft { text-align: left; }

.w100 { width: 100px; }
.w120 { width: 120px; }
.w130 { width: 130px; }
.w140 { width: 140px; }
.w150 { width: 150px; }

.dangerCl { color: #F56C6C; }
.successCl { color: #67C23A; }

.pagination {
  background: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-info { font-size: 13px; color: #606266; }
</style>