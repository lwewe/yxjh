<template>
  <div class="list-container-bookorder titles">
    <template v-if="isBookOrder">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
              <el-option label="订单号" value="ordersn"></el-option>
              <el-option label="图书订单号" value="orderid"></el-option>
              <el-option label="收件人姓名" value="name"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="下单时间" value="add_time"></el-option>
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
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" value-format="yyyy-MM-dd"
              class="w120"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" value-format="yyyy-MM-dd"
              class="w120"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button type="success" @click="exportOrder()">导出订单</el-button>

            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <!-- <div style="text-align: left; margin-bottom: 20px;">
           <el-button type="danger" size="small" @click="batchDelete()"
            :disabled="multipleSelection.length === 0">批量删除</el-button> 
        </div> -->

        <el-table ref="multipleTable" :data="tableData" border style="width: 100%" v-loading="loading" row-key="id" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->

          <!-- 用户ID -->
          <el-table-column label="用户ID" width="100" align="center">
            <template slot-scope="scope">
              <span class="link-text" @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span>
              <!-- <div style="font-size:12px;color:#909399;">{{ scope.row.name }}</div> -->
              <!-- <div style="font-size:12px;color:#909399;">{{ scope.row.phone }}</div> -->
            </template>
          </el-table-column>

          <!-- 商品信息 -->
          <el-table-column label="商品信息" align="left" min-width="250">
            <template slot-scope="scope">
              <div v-for="(item, idx) in scope.row.info_list" :key="idx" class="book-item dflex">
                <img :src="item.img"
                  style="width:40px;height:40px;object-fit:contain;vertical-align:middle;margin-right:8px;">
                <div class="txtleft">
                  <span>{{ item.name }}</span>
                  <div style="color:#909399;">{{ item.isbn }} * {{ item.quantity }} <span style="color:#666666;"><span
                        class="fs10">￥</span>{{ item.jiage }}</span></div>

                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 订单 -->
          <el-table-column label="订单" min-width="290" align="left">
            <template slot-scope="scope">
              <div>订单号：{{ scope.row.ordersn }}</div>
              <div>图书订单号：{{ scope.row.orderid || '-' }}</div>
              <!-- <div style="font-size:12px;color:#909399;">{{ formatTime(scope.row.add_time) }}</div> -->
            </template>
          </el-table-column>

          <!-- 金额 -->
          <el-table-column label="金额" min-width="100" align="center">
            <template slot-scope="scope">
              <span class="fs10">￥</span>{{ scope.row.havepay }}
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column label="状态" min-width="90" align="center">
            <template slot-scope="scope">
              <span :style="{ color: getStateColor(scope.row.state) }">{{ getStateText(scope.row.state) }}</span>
            </template>
          </el-table-column>


          <el-table-column label="下单时间" min-width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" min-width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewOrder(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>

              <el-button v-if="scope.row.state === 0 && !scope.row.orderid" size="mini" type="success"
                @click="submitOrder(scope.row)">推送</el-button>
              <el-button v-if="[1, 3].includes(scope.row.state)" size="mini" type="warning"
                @click="cancelOrder(scope.row)">取消</el-button>
              <el-button v-if="[1, 2, 3].includes(scope.row.state)" type="success" size="mini"
                @click="updateOrder(scope.row)">更新</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange"></el-pagination>
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) }} 页</div>
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

import { tsorderList, delTsorder, gxTsorder, subTsorder, quxiaoTsorder, tsExportOrder } from '@/api/modules/orders'

export default {
  name: 'BookOrder',
  data() {
    return {
      total: 0, pageSize: 10, currentPage: 1, loading: false,
      searchForm: { search_key: 'ordersn', search_val: '', px_key: 'add_time', px_val: 'desc', ks_time: '', end_time: '' },
      multipleSelection: [], tableData: []
    }
  },
  mounted() { this.loadData() },
  methods: {

    async exportOrder() {
      this.$confirm('确认导出当前搜索条件下的所有图书订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        await this.doExportOrder()
      }).catch(() => { })
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

        const res = await tsExportOrder(params)

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
            XLSX.utils.book_append_sheet(wb, ws, '图书订单')
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
              <x:Name>图书订单</x:Name>
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
      return text.replace(/[&<>"']/g, function (m) { return map[m] })
    },
    async loadData() {
      this.loading = true
      try {
        const params = { page: this.currentPage, limit: this.pageSize, px_key: this.searchForm.px_key, px_val: this.searchForm.px_val }
        if (this.searchForm.search_key && this.searchForm.search_val) { params.search_key = this.searchForm.search_key; params.search_val = this.searchForm.search_val }
        if (this.searchForm.ks_time) params.ks_time = this.searchForm.ks_time
        if (this.searchForm.end_time) params.end_time = this.searchForm.end_time
        const res = await tsorderList(params)
        if (res.code === 200) { this.tableData = res.data.data; this.total = res.data.total; this.currentPage = res.data.current_page }
      } catch (error) { this.$message.error('获取数据失败') }
      finally { this.loading = false }
    },
    handleSearch() { this.currentPage = 1; this.loadData() },
    handleReset() { this.searchForm = { search_key: 'ordersn', search_val: '', px_key: 'add_time', px_val: 'desc', ks_time: '', end_time: '' }; this.currentPage = 1; this.loadData() },
    handlePageChange(page) { this.currentPage = page; this.loadData() },
    handleSelectionChange(val) { this.multipleSelection = val },

    batchDelete() {
      if (!this.multipleSelection.length) return
      const ids = this.multipleSelection.map(i => i.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个订单吗？`, '提示', { type: 'warning' }).then(async () => {
        await delTsorder({ ids }); this.$message.success('删除成功'); this.loadData()
      }).catch(() => { })
    },
    deleteOrder(row) {
      this.$confirm('确认删除该订单吗？', '提示', { type: 'warning' }).then(async () => {
        await delTsorder({ ids: row.id }); this.$message.success('删除成功'); this.loadData()
      }).catch(() => { })
    },
    updateOrder(row) {
      this.$confirm('确认更新该订单吗？', '提示', { type: 'warning' }).then(async () => {
        await gxTsorder({ id: row.id }); this.$message.success('更新成功'); this.loadData()
      }).catch(() => { })
    },
    submitOrder(row) {
      this.$confirm('确认推送该订单吗？（会真实下单）', '提示', { type: 'warning' }).then(async () => {
        await subTsorder({ id: row.id }); this.$message.success('推送成功'); this.loadData()
      }).catch(() => { })
    },
    cancelOrder(row) {
      this.$confirm('确认取消该订单吗？', '提示', { type: 'warning' }).then(async () => {
        await quxiaoTsorder({ id: row.id }); this.$message.success('取消成功'); this.loadData()
      }).catch(() => { })
    },


    viewOrder(row) { this.$router.push({ name: 'BookOrderdetails', params: { id: row.id } }) },

    parsePackages(packages) {
      try { return typeof packages === 'string' ? JSON.parse(packages) : packages } catch (e) { return [] }
    },
    getStateText(state) {
      const map = { 0: '已支付', 1: '推送成功', 2: '已发货', 3: '处理中', 4: '已取消', 5: '已完成' }
      return map[state] || ''
    },
    getStateColor(state) {
      const map = { 0: '#409EFF', 1: '#E6A23C', 2: '#67C23A', 3: '#E6A23C', 4: '#909399', 5: '#909399' }
      return map[state] || '#303133'
    },
    formatTime(t) {
      if (!t) return ''
      const d = new Date(t * 1000)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    }
  },
  computed: {
    isBookOrder() { return this.$route.name === 'BookOrder' || this.$route.path === '/ticket-order/book' }
  }
}
</script>

<style>
.list-container-bookorder .serchForm .el-form-item {
  margin-bottom: 0;
}
</style>

<style lang="scss" scoped>
.list-container-bookorder {
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