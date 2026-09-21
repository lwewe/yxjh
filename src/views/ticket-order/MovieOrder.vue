<template>
  <div class="list-container titles">
    <template v-if="isMovies">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <!-- 搜索字段 + 关键词输入框 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
              <el-option label="订单号" value="order_id"></el-option>
              <el-option label="供应商订单号" value="tradeno"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="手机号" value="mobile"></el-option>
              <el-option label="影院" value="cinemaname"></el-option>
              <el-option label="影片" value="moviename"></el-option>
              <el-option label="城市" value="cityname"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150"></el-input>
          </el-form-item>

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

          <el-form-item label="">
            <el-select v-model="searchForm.state" placeholder="订单状态" class="w120">
              <el-option label="全部状态" value=""></el-option>
              <el-option label="待支付" value="N"></el-option>
              <el-option label="已取消" value="C"></el-option>
              <el-option label="订单超时" value="E"></el-option>
              <el-option label="已付款" value="P"></el-option>
              <el-option label="通知处理中" value="T"></el-option>
              <el-option label="出票成功" value="S"></el-option>
              <el-option label="出票失败" value="F"></el-option>
              <el-option label="退款完成" value="R"></el-option>
              <el-option label="正在出票" value="11"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="下单渠道" class="w120">
              <el-option label="全部渠道" value=""></el-option>
              <el-option label="轩夸(旧接口)" value="1"></el-option>
              <el-option label="奇票(新接口)" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.order_position" placeholder="下单位置" class="w120">
              <el-option label="全部位置" value=""></el-option>
              <el-option label="福利卡" value="0"></el-option>
              <el-option label="权益券" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button type="success"   @click="exportOrder()">导出订单</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; ">
          <el-button type="danger"  style="margin-bottom: 20px;" size="small" @click="batchDelete()"
            v-if="multipleSelection.length > 1">批量删除</el-button>
          
          <!-- <el-button type="warning" size="small" @click="balanceMy(1)">轩夸商户余额<i
              class="el-icon-coin el-icon--right"></i></el-button>
          <el-button type="warning" size="small" @click="balanceMy(2)">奇票商户余额<i
              class="el-icon-coin el-icon--right"></i></el-button> -->
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
              <div v-if="scope.row.type == 2" class="blueCl">奇票(新接口)</div>
              <div v-else class="warningCl">轩夸(旧接口)</div>
            </template>
          </el-table-column>
          <el-table-column label="缩略图" min-width="100" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.movielogo" alt="" style="width: 60px;">
            </template>
          </el-table-column>
          <el-table-column label="影院信息" align="center" min-width="380">
            <template slot-scope="scope">
              <div class="dflex al-center">
                <div class="txtleft ml10">
                  <div>影院：{{ scope.row.cinemaname }}</div>
                  <div>影厅：{{ scope.row.roomname }}</div>
                  <div>影片：{{ scope.row.moviename }}</div>
                  <div>版本：{{ scope.row.edition }}</div>
                  <div>放映时间：{{ scope.row.playtime }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" align="left" min-width="220">
            <template slot-scope="scope">
              <div>用户ID：{{ scope.row.uid }}</div>
              <div>手机号：{{ scope.row.mobile }}</div>
              <div>座位：{{ scope.row.seats }}</div>
              <div>票数：{{ scope.row.quantity }}张</div>
              <div v-if="scope.row.type == 1">
                <span v-for="(item, index) in parseSeatsPrice(scope.row.seats_price)" :key="index">
                  {{ item.seat }} {{ item.price }}点
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单信息" align="left" min-width="280">
            <template slot-scope="scope">
              <div>订单号：{{ scope.row.order_id }}</div>
              <div>标识：{{ scope.row.tradeno }}</div>
              <div>下单时间：{{ formatTime(scope.row.add_time) }}</div>
              <div>过期时间：{{ formatTime(scope.row.expiretime) }}</div>
              <!-- <div>展示金额：{{ scope.row.showamount }}</div> -->
              <!-- <div>结算金额：{{ scope.row.settleamount }}</div> -->
              <div v-if="scope.row.type == 2">佣金：{{ scope.row.commission }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" align="center" min-width="120">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.orderstatus)">
                {{ getStatusText(scope.row.orderstatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewOrder(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>
              <el-button size="mini" type="warning" @click="updateOrder(scope.row)">
                {{ scope.row.type == 1 ? '更新轩夸' : '更新奇票' }}
              </el-button>
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

      <el-dialog :title="titles" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-table :data="tableData2" border style="width: 100%">
          <el-table-column prop="ye" label="业务" align="center"></el-table-column>
          <el-table-column prop="je" label="金额" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </template>
    <router-view />
  </div>
</template>

<script>
import { dyorderList, delDyorder, gxxkDyorder, gxqpDyorder, dyExportOrder } from '@/api/modules/orders'

export default {
  name: 'MovieOrder',
  data() {
    return {
      titles: '',
      tableData2: [{ ye: '演出', je: '1637.9' }, { ye: '电影', je: '1896.25' }],
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
        state: '',
        type: '',
        order_position: ''
      },
      dialogVisible: false,
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 在 methods 中添加以下方法

    // 导出订单（带确认框）
    async exportOrder() {
      this.$confirm('确认导出当前搜索条件下的所有电影订单吗？', '提示', {
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

        // 下单渠道
        if (this.searchForm.type) {
          params.type = this.searchForm.type
        }

        // 下单位置
        if (this.searchForm.order_position) {
          params.order_position = this.searchForm.order_position
        }

        // 搜索条件（与列表查询保持一致）
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }

        const res = await dyExportOrder(params)

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
            XLSX.utils.book_append_sheet(wb, ws, '电影订单')
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
              <x:Name>电影订单</x:Name>
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
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val
        }

        // 关键词搜索
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
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

        // 下单渠道
        if (this.searchForm.type) {
          params.type = this.searchForm.type
        }

        // 下单位置
        if (this.searchForm.order_position) {
          params.order_position = this.searchForm.order_position
        }

        const res = await dyorderList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.current_page
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        this.$message.error('获取数据失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        search_key: 'order_id',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        state: '',
        type: '',
        order_position: ''
      }
      this.currentPage = 1
      this.loadData()
    },

    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 批量删除
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
          const res = await delDyorder({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 删除单个订单
    deleteOrder(row) {
      this.$confirm('确认删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delDyorder({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 更新订单
    updateOrder(row) {
      const title = row.type == 1 ? '更新轩夸订单' : '更新奇票订单'
      this.$confirm(`确认${title}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let res
          if (row.type == 1) {
            res = await gxxkDyorder({ id: row.id })
          } else {
            res = await gxqpDyorder({ id: row.id })
          }
          if (res.code === 200) {
            this.$message.success('更新成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          this.$message.error('更新失败')
        }
      }).catch(() => { })
    },

   

    // 查看订单详情
    viewOrder(row) {
      this.$router.push({ name: 'MovieOrderdetails', params: { id: row.id }, query: { data: JSON.stringify(row) } })
    },

    // 商户余额
    balanceMy(val) {
      if (val == 1) {
        this.titles = '轩夸商户余额'
      } else {
        this.titles = '奇票商户余额'
      }
      this.dialogVisible = true
    },

    handleClose() {
      this.dialogVisible = false
    },

    // 格式化时间戳
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

    // 解析座位价格
    parseSeatsPrice(seatsPrice) {
      if (!seatsPrice) return []
      return seatsPrice.split(',').map(item => {
        const [seat, price] = item.split('|')
        return { seat, price }
      })
    },

    // 获取订单状态文本
    getStatusText(status) {
      const statusMap = {
        'N': '待支付',
        'C': '已取消',
        'E': '订单超时',
        'P': '已付款',
        'T': '通知处理中',
        'S': '出票成功',
        'F': '出票失败',
        'R': '退款完成',
        '11': '正在出票'
      }
      return statusMap[status] || status
    },

    // 获取订单状态标签类型
    getStatusType(status) {
      const typeMap = {
        'N': 'info',
        'C': 'info',
        'E': 'warning',
        'P': '',
        'T': 'warning',
        'S': 'success',
        'F': 'danger',
        'R': 'info',
        '11': 'warning'
      }
      return typeMap[status] || 'info'
    }
  },
  computed: {
    isMovies() {
      return this.$route.name === 'MovieOrder' || this.$route.path === '/ticket-order/movie'
    }
  }
}
</script>

<style>
.titles .el-dialog__title {
  line-height: 16px;
  font-size: 14px;
}

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

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}

.blueCl {
  color: #409EFF;
  font-size: 12px;
}

.warningCl {
  color: #E6A23C;
  font-size: 12px;
}
</style>

<style lang="scss" scoped>
.list-container {
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

  .txtleft {
    text-align: left;
  }

  .ml10 {
    margin-left: 10px;
  }

  .dflex {
    display: flex;
  }

  .al-center {
    align-items: center;
  }
}
</style>