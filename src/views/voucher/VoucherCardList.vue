<template>
  <div class="qwlfaersList">
    <template v-if="showList">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="开卡客户名称" value="company"></el-option>
              <el-option label="销售人" value="sale"></el-option>
              <el-option label="数量" value="geshu"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="制券时间" value="add_time"></el-option>
              <el-option label="有效日期" value="end_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="是否发布" class="w120" clearable>
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>

        </el-form>
      </el-card>

      <!-- 添加/编辑权益券弹窗 -->
      <el-dialog :title="isEdit ? '修改权益券' : '添加权益券'" :visible.sync="dialogVisible" width="50%"
        :before-close="handleClose">
        <el-form ref="cardForm" :model="cardForm" label-width="166px" style="width: 90%;text-align: left;">
          <el-form-item label="开卡客户名称：" required>
            <el-input v-model="cardForm.company" placeholder="请输入开卡客户名称"></el-input>
          </el-form-item>
          <el-form-item label="销售人：" required>
            <el-input v-model="cardForm.sale" placeholder="请输入销售人"></el-input>
          </el-form-item>
          <el-form-item label="下单次数：">
            <el-input v-model="cardForm.cishu" placeholder="请输入下单次数" type="number"></el-input>
          </el-form-item>
          <el-form-item label="限制价格：">
            <el-input v-model="cardForm.price" placeholder="请输入限制价格" type="number"></el-input>
          </el-form-item>
          <el-form-item label="是否限制价格：">
            <el-radio-group v-model="cardForm.flag">
              <el-radio :label="1">限制(只展示限制价格以下的影片)</el-radio>
              <el-radio :label="0">不限制(影片全部展示,价格超了微信支付)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限制每日整体购买次数：">
            <el-input v-model="cardForm.num" placeholder="请输入限制次数" type="number"></el-input>
          </el-form-item>
          <el-form-item label="制券时间：" required>
            <el-date-picker v-model="cardForm.add_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="有效日期：" required>
            <el-date-picker v-model="cardForm.end_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否发布：">
            <el-radio-group v-model="cardForm.sh">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCard" :loading="submitting">保 存</el-button>
        </span>
      </el-dialog>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="batchDelete()">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">添加权益券</el-button>
          <el-button type="success" size="small" @click="goQuanNumSel">券号查询</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="39"></el-table-column>
          <el-table-column label="编号" width="70" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="开卡客户名称" min-width="160" align="left">
            <template slot-scope="scope">
              {{ scope.row.company }}
              <span class="dangerCl fs12">({{ scope.row.geshu || 0 }})</span>
            </template>
          </el-table-column>
          <el-table-column label="销售人" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.sale }}</template>
          </el-table-column>
          <el-table-column label="下单次数" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.cishu || '-' }}</template>
          </el-table-column>
          <el-table-column label="价格" width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.price || '-' }}
              <span v-if="scope.row.flag == 1" class="blueCl fs12" title="只展示限制价格以下的影片"> (限制)</span>
              <span v-else class="blueCl fs12" title="影片全部展示,价格超了微信支付"> (不限制)</span>
            </template>
          </el-table-column>
          <el-table-column label="整体次数" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.num || 0 }}</template>
          </el-table-column>
          <el-table-column label="制券时间" width="120" align="center">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>
          <el-table-column label="有效日期" width="120" align="center">
            <template slot-scope="scope">{{ formatTime(scope.row.end_time) }}</template>
          </el-table-column>

          <el-table-column label="是否发布" width="90" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
                @change="(val) => updateStatus(scope.row, val)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="220" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="viewQuanNum(scope.row)">券号</el-button>
              <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 20px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </el-card>
    </template>
    <router-view />
  </div>
</template>

<script>
import { exchangeList, addExchange, getExchange, editExchange, delExchange, fbExchange } from '@/api/modules/exchange'

export default {
  name: 'ExchangeList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      loading: false,
      submitting: false,
      isEdit: false,
      editId: '',
      dialogVisible: false,
      cardForm: {
        company: '',
        sale: '',
        cishu: '',
        price: '',
        flag: 0,
        num: '',
        add_time: '',
        end_time: '',
        sh: 1
      },
      searchForm: {
        search_key: 'company',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 修改发布状态（带确认框）
    async updateStatus(row, val) {
      const targetStatus = val ? 1 : 0
      const actionText = targetStatus === 1 ? '发布' : '下架'

      try {
        await this.$confirm(`确认${actionText}该权益券吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，恢复原来的状态
        this.getList()
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await fbExchange({ id: row.id })
        if (res.code === 200) {
          row.sh = res.data.sh !== undefined ? res.data.sh : targetStatus
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换发布状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    // 时间戳转日期
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },

    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        if (this.searchForm.sh !== '') {
          params.sh = this.searchForm.sh
        }
        const res = await exchangeList(params)
        if (res.code === 200) {
          const listData = res.data.list || res.data
          this.tableData = listData.data
          this.total = listData.total
          this.currentPage = listData.current_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.currentPage = 1
      this.getList()
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 打开添加弹窗
    openAddDialog() {
      this.isEdit = false
      this.editId = ''
      this.cardForm = {
        company: '',
        sale: '',
        cishu: '',
        price: '',
        flag: 0,
        num: '',
        add_time: '',
        end_time: '',
        sh: 1
      }
      this.dialogVisible = true
    },

    // 打开编辑弹窗
    async openEditDialog(row) {
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await getExchange({ id: row.id })
        if (res.code === 200) {
          const data = res.data
          this.cardForm = {
            company: data.company || '',
            sale: data.sale || '',
            cishu: data.cishu || '',
            price: data.price || '',
            flag: data.flag !== undefined ? data.flag : 0,
            num: data.num || '',
            add_time: data.add_time ? this.formatTime(data.add_time) : '',
            end_time: data.end_time ? this.formatTime(data.end_time) : '',
            sh: data.sh !== undefined ? data.sh : 1
          }
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
      this.dialogVisible = true
    },

    // 提交
    async submitCard() {
      if (!this.cardForm.company) {
        this.$message.warning('请输入开卡客户名称')
        return
      }
      if (!this.cardForm.sale) {
        this.$message.warning('请输入销售人')
        return
      }
      if (!this.cardForm.end_time) {
        this.$message.warning('请选择有效日期')
        return
      }
      this.submitting = true
      try {
        const params = { ...this.cardForm }
        if (this.isEdit) {
          params.id = this.editId
        }
        const apiMethod = this.isEdit ? editExchange : addExchange
        const res = await apiMethod(params)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },

    handleClose() {
      this.dialogVisible = false
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm('确认删除该权益券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delExchange({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('请求失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }
      this.$confirm('确认删除选中数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        try {
          const res = await delExchange({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('请求失败')
        }
      }).catch(() => { })
    },

    // 查看券号
    viewQuanNum(row) {
      this.$router.push({ name: 'VoudNum', params: { id: row.id } })
    },

    // 券号查询
    goQuanNumSel() {
      this.$router.push({ name: 'VouNumsearch' })
    }
  },
  computed: {
    showList() {
      return this.$route.path === '/voucher/list'
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
.qwlfaersList {
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