<template>
  <div class="list-container-cardorder titles">
    <template v-if="isCards">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <!-- 关键词搜索 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="卡券订单号" value="sp_order_no"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="充值手机号" value="phone"></el-option>
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
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w100">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <!-- 时间范围 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" value-format="yyyy-MM-dd" class="w120">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" value-format="yyyy-MM-dd" class="w120">
            </el-date-picker>
          </el-form-item>

          <!-- 类型 -->
          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="类型" class="w120">
              <el-option label="全部" value=""></el-option>
              <el-option label="蜂助手" value="1"></el-option>
              <el-option label="后台" value="2"></el-option>
              <el-option label="亿奇达" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
             <el-button type="success"   @click="exportOrder()">导出订单</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left;  ">
          <el-button type="danger" size="small" style="margin-bottom: 20px;" @click="batchDelete()"  v-if="multipleSelection.length >1 ">批量删除</el-button>
          
          <!-- <el-button type="warning" size="small" @click="balanceMy()">亿奇达余额<i class="el-icon-coin el-icon--right"></i></el-button> -->
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="缩略图" min-width="80" align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.gueige && scope.row.gueige.img" :src="scope.row.gueige.img" style="width: 50px; height: 50px; object-fit: contain;">
            </template>
          </el-table-column>
          <el-table-column label="下单位置" min-width="90" align="center">
            <template slot-scope="scope">
              {{ getTypeText(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="卡券信息" align="center" min-width="240">
            <template slot-scope="scope">
              <div class="txtleft" v-if="scope.row.gueige">
                <div>名称：{{ scope.row.gueige.title }}</div>
                <div>规格：{{ scope.row.gueige.gueige }}</div>
                <div>数量：{{ scope.row.number }}</div>
                <div>单价：{{ scope.row.danjia }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总金额" align="center" min-width="100">
            <template slot-scope="scope">
              <span class="fs10">￥</span>{{ scope.row.total_fee }}
            </template>
          </el-table-column>
          <el-table-column label="用户信息" align="left" min-width="200">
            <template slot-scope="scope">
              <div>用户ID：<span   @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span></div>
              <div>手机号：{{ scope.row.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单信息" align="left" min-width="280">
            <template slot-scope="scope">
              <div>订单号：{{ scope.row.order_no }}</div>
              <div v-if="scope.row.sp_order_no">卡券订单号：{{ scope.row.sp_order_no }}</div>
              <div>时间：{{ formatTime(scope.row.add_time) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="left" min-width="120">
            <template slot-scope="scope">
              <div>
                订单：
                <span :style="{ color: scope.row.state == 2 ? '#67C23A' : scope.row.state == 1 ? '#E6A23C' : '#909399' }">
                  {{ getStateText(scope.row.state) }}
                </span>
              </div>
              <div v-if="scope.row.type == 1 || scope.row.type == 3">
                接口：
                <span :style="{ color: scope.row.flag == 1 ? '#67C23A' : '#F56C6C' }">
                  {{ scope.row.flag == 1 ? '成功' : '失败' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewOrder(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>
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

      <!-- 亿奇达余额弹窗 -->
      <el-dialog title="亿奇达余额" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-table :data="tableData2" border style="width: 100%">
          <el-table-column prop="ye" label="账户余额" align="center"></el-table-column>
          <el-table-column prop="je" label="额度" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </template>
    <router-view />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { kqorderList, delKqorder, kqExportOrder } from '@/api/modules/orders'

export default {
  name: 'CardOrder',
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      searchForm: {
        search_key: 'order_no',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        type: ''
      },
      tableData2: [{ ye: '5866.03', je: '0' }],
      dialogVisible: false,
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    
// 导出订单（带确认框）
async exportOrder() {
  this.$confirm('确认导出当前搜索条件下的所有卡券订单吗？', '提示', {
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

    // 类型
    if (this.searchForm.type) {
      params.type = this.searchForm.type
    }

    const res = await kqExportOrder(params)

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

      // 检查 XLSX 库是否可用
      if (typeof XLSX === 'undefined') {
        this.exportAsHtml(header, data, filename)
        return
      }

      try {
        const excelData = [header, ...data]
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(excelData)
        ws['!cols'] = header.map(() => ({ wch: 18 }))
        XLSX.utils.book_append_sheet(wb, ws, '卡券订单')
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
              <x:Name>卡券订单</x:Name>
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
        if (this.searchForm.ks_time) {
          params.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          params.end_time = this.searchForm.end_time
        }
        if (this.searchForm.type) {
          params.type = this.searchForm.type
        }

        const res = await kqorderList(params)
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

    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    handleReset() {
      this.searchForm = {
        search_key: 'order_no',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        type: ''
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

    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的订单')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个订单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKqorder({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    deleteOrder(row) {
      this.$confirm('确认删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKqorder({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    

    viewOrder(row) {
      this.$router.push({ name: 'CardOrderdetails', params: { id: row.id } })
    },

    balanceMy() {
      this.dialogVisible = true
    },

    handleClose() {
      this.dialogVisible = false
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    getTypeText(type) {
      const map = { 1: '蜂助手', 2: '后台', 3: '亿奇达' }
      return map[type] || ''
    },

    getStateText(state) {
      const map = { 1: '未支付', 2: '已支付', 3: '已取消' }
      return map[state] || ''
    }
  },
  computed: {
    isCards() {
      return this.$route.name === 'CardOrder' || this.$route.path === '/ticket-order/card'
    }
  }
}
</script>

<style>
 .list-container-cardorder .serchForm .el-form-item{
margin-bottom: 0;
 }
</style>

<style lang="scss" scoped>
.list-container-cardorder {
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

  .txtleft {
    text-align: left;
  }
}
</style>