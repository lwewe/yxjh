<template>
  <div class="list-container-showorder titles">
    <template v-if="isShowOrder">
      <el-card class="search-card serchForm newForms">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <!-- 关键词搜索 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
              <el-option label="订单号" value="order_id"></el-option>
              <el-option label="轩夸订单号" value="tradeno"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="下单手机号" value="buyerPhone"></el-option>
              <el-option label="福利卡ID" value="flkid"></el-option>
              <el-option label="福利卡号ID" value="flkhid"></el-option>
              <el-option label="用户手机号" value="uphone"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150"></el-input>
          </el-form-item>

          <!-- 排序 -->
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="下单时间" value="add_time"></el-option>
              <el-option label="过期时间" value="expiretime"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <!-- 时间范围 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" value-format="yyyy-MM-dd"
              class="w120">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" value-format="yyyy-MM-dd"
              class="w120">
            </el-date-picker>
          </el-form-item>

          <!-- 订单状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.state" placeholder="订单状态" class="w120">
              <el-option label="全部" value=""></el-option>
              <el-option label="待支付" value="N"></el-option>
              <el-option label="已取消" value="C"></el-option>
              <el-option label="订单超时" value="E"></el-option>
              <el-option label="已付款" value="P"></el-option>
              <el-option label="通知处理中" value="T"></el-option>
              <el-option label="等待发货" value="D"></el-option>
              <el-option label="已发货" value="DE"></el-option>
              <el-option label="出票成功" value="S"></el-option>
              <el-option label="退款完成" value="R"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button type="success" size="small" @click="exportOrder()">导出订单</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; ">
          <el-button type="danger" size="small" style="margin-bottom: 20px;" @click="batchDelete()"
            v-if="multipleSelection.length > 0">批量删除</el-button>

        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="缩略图" min-width="80" align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.img" :src="scope.row.img" style="width: 50px; height: 50px; object-fit: contain;">
            </template>
          </el-table-column>
          <el-table-column label="影院信息" align="left" min-width="380">
            <template slot-scope="scope">
              <div>演出：{{ scope.row.title }}</div>
              <div>购票人：{{ scope.row.buyerName }}</div>
              <div>放映时间：{{ scope.row.dateDesc }}</div>
              <div>购票人电话：{{ scope.row.buyerPhone }}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" align="left" min-width="180">
            <template slot-scope="scope">
              <div>用户ID：<span   @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span></div>
              <div>快递费：<span class="fs10">￥</span>{{ scope.row.expressfee }}</div>
              <div>服务费：<span class="fs10">￥</span>{{ scope.row.servicefee }}</div>
              <div>票数：{{ scope.row.quantity }}张 <span class="fs10">￥</span>{{ scope.row.total }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单信息" align="left" min-width="240">
            <template slot-scope="scope">
              <div>订单号：{{ scope.row.order_id }}</div>
              <div>标识：{{ scope.row.tradeno }}</div>
              <div>下单时间：{{ formatTime(scope.row.add_time) }}</div>
              <div>过期时间：{{ formatTime(scope.row.expiretime) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="100">
            <template slot-scope="scope">
              <span :style="{ color: getStatusColor(scope.row.orderstatus) }">
                {{ getStatusText(scope.row.orderstatus) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="250" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewOrder(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>

              <el-button size="mini" type="success" style="margin-top:5px;"
                @click="updateOrder(scope.row)">更新订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) }} 页</div>
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { ycorderList, delYcorder, gxYcorder, ycExportOrder } from '@/api/modules/orders'

export default {
  name: 'ShowOrder',
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      searchForm: {
        search_key: 'order_id',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        state: ''
      },
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // ============ 在 methods 中替换和添加以下方法 ============

// 导出订单（带确认框）- 替换原来的 exportOrder 方法
async exportOrder() {
  this.$confirm('确认导出当前搜索条件下的所有演出订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    await this.doExportOrder()
  }).catch(() => {})
},

// 实际导出逻辑
async doExportOrder() {
  try {
    const loading = this.$loading({
      lock: true,
      text: '正在导出数据...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 构建导出参数
    const params = {}

    // 搜索关键词
    if (this.searchForm.search_key && this.searchForm.search_val) {
      params.search_key = this.searchForm.search_key
      params.search_val = this.searchForm.search_val
    }

    // 排序参数
    if (this.searchForm.px_key) {
      params.px_key = this.searchForm.px_key
    }
    if (this.searchForm.px_val) {
      params.px_val = this.searchForm.px_val
    }

    // 时间范围
    if (this.searchForm.ks_time) {
      params.ks_time = this.searchForm.ks_time
    }
    if (this.searchForm.end_time) {
      params.end_time = this.searchForm.end_time
    }

    // 订单状态
    if (this.searchForm.state) {
      params.state = this.searchForm.state
    }

    const res = await ycExportOrder(params)

    loading.close()

    if (res.code === 200 && res.data) {
      const { header, data, filename } = res.data

      if (!header || header.length === 0) {
        this.$message.error('导出数据表头为空')
        return
      }

      if (!data || data.length === 0) {
        this.$message.warning('没有数据可导出')
        return
      }

      // XLSX 库已引入，直接使用
      try {
        const excelData = [header, ...data]
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(excelData)
        ws['!cols'] = header.map(() => ({ wch: 18 }))
        XLSX.utils.book_append_sheet(wb, ws, '演出订单')
        XLSX.writeFile(wb, filename || 'export.xlsx')
        this.$message.success('导出成功')
      } catch (xlsxError) {
        console.error('XLSX导出失败:', xlsxError)
        this.exportAsHtml(header, data, filename)
      }
    } else {
      this.$message.error(res.msg || '导出失败')
    }
  } catch (error) {
    console.error('导出失败:', error)
    this.$message.error('导出失败：' + (error.message || '请稍后重试'))
  }
},

// HTML 方式导出（备用方案）
exportAsHtml(header, data, filename) {
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>演出订单</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
        th { background-color: #4472C4; color: #ffffff; font-weight: bold; padding: 6px 10px; border: 1px solid #999; text-align: center; }
        td { padding: 4px 10px; border: 1px solid #999; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
  `

  header.forEach(h => {
    html += `<th>${this.escapeHtml(String(h))}</th>`
  })

  html += `</tr></thead><tbody>`

  data.forEach(row => {
    html += '<tr>'
    row.forEach(cell => {
      const val = cell !== null && cell !== undefined ? String(cell) : ''
      html += `<td>${this.escapeHtml(val)}</td>`
    })
    html += '</tr>'
  })

  html += `</tbody></table></body></html>`

  const blob = new Blob(['\uFEFF' + html], { 
    type: 'application/vnd.ms-excel;charset=utf-8' 
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename ? filename.replace(/\.xlsx$/i, '.xls') : 'export.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  this.$message.success('导出成功（HTML格式）')
},

// HTML 转义
escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, function(m) { return map[m] })
},
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val
        }
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }
        if (this.searchForm.ks_time) params.ks_time = this.searchForm.ks_time
        if (this.searchForm.end_time) params.end_time = this.searchForm.end_time
        if (this.searchForm.state) params.state = this.searchForm.state

        const res = await ycorderList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.current_page
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() { this.currentPage = 1; this.loadData() },
    handleReset() {
      this.searchForm = { search_key: 'order_id', search_val: '', px_key: 'add_time', px_val: 'desc', ks_time: '', end_time: '', state: '' }
      this.currentPage = 1; this.loadData()
    },
    handlePageChange(page) { this.currentPage = page; this.loadData() },
    handleSelectionChange(val) { this.multipleSelection = val },

    batchDelete() {
      if (!this.multipleSelection.length) return
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个订单吗？`, '提示', { type: 'warning' }).then(async () => {
        const res = await delYcorder({ ids })
        if (res.code === 200) { this.$message.success('删除成功'); this.loadData() }
      }).catch(() => { })
    },
    deleteOrder(row) {
      this.$confirm('确认删除该订单吗？', '提示', { type: 'warning' }).then(async () => {
        const res = await delYcorder({ ids: row.id })
        if (res.code === 200) { this.$message.success('删除成功'); this.loadData() }
      }).catch(() => { })
    },
    updateOrder(row) {
      this.$confirm('确认更新该订单吗？', '提示', { type: 'warning' }).then(async () => {
        const res = await gxYcorder({ id: row.id })
        if (res.code === 200) { this.$message.success('更新成功'); this.loadData() }
      }).catch(() => { })
    },
    
    viewOrder(row) {
      this.$router.push({ name: 'ShowOrderdetails', params: { id: row.id } })
    },


    getStatusText(status) {
      const map = { 'N': '待支付', 'C': '已取消', 'E': '订单超时', 'P': '已付款', 'T': '通知处理中', 'D': '等待发货', 'DE': '已发货', 'S': '出票成功', 'R': '退款完成' }
      return map[status] || status
    },
    getStatusColor(status) {
      const map = { 'N': '#909399', 'C': '#909399', 'E': '#F56C6C', 'P': '#409EFF', 'T': '#E6A23C', 'D': '#E6A23C', 'DE': '#67C23A', 'S': '#67C23A', 'R': '#909399' }
      return map[status] || '#303133'
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    }
  },
  computed: {
    isShowOrder() {
      return this.$route.name === 'ShowOrder' || this.$route.path === '/ticket-order/show'
    }
  }
}
</script>

<style>
.list-container-showorder .titles .el-dialog__title {
  line-height: 16px;
  font-size: 14px;
}
.list-container-showorder .newForms .el-form-item{
  margin-bottom: 0;
}
.list-container-showorder .serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.list-container-showorder  .serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.list-container-showorder .serchForm .el-card__body {
  text-align: left;
}

.list-container-showorder .serchForm .el-input__icon {
  line-height: 36px;
}

.list-container-showorder  .serchForm .el-form-item__content {
  line-height: 36px;
}

.list-container-showorder .serchForm .search-form .el-form-item {
  /* margin-top: 10px !important; */
}

.list-container-showorder  .link-text {
  color: #409EFF;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.list-container-showorder {
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

  .page-info {
    font-size: 13px;
    color: #606266;
  }

  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
  }
}
</style>