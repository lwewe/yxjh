<template>
  <div class="list-container">
    <template v-if="IsMallExchange">
      <!-- 搜索栏 -->
      <el-card class="search-card serchForm formb0">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w140">
              <el-option label="订单编号" value="orderid"></el-option>
              <el-option label="收件人" value="name"></el-option>
              <el-option label="手机号" value="phone"></el-option>
              <el-option label="地区" value="diqu"></el-option>
              <el-option label="详细地址" value="address"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="快递单号" value="num"></el-option>

              <template v-if="isAdmin">

                <el-option label="卡号ID" value="kid"></el-option>
                <el-option label="产品编号" value="gid"></el-option>
                <el-option label="供应商编号" value="gyid"></el-option>
                <el-option label="卡册ID" value="kcid"></el-option>


              </template>






            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w140"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w140">
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
            <el-select v-model="searchForm.state" placeholder="订单状态" class="w120" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="未发货" value="1"></el-option>
              <el-option label="已发货" value="2"></el-option>
              <el-option label="已取消" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width: 160px;">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width: 160px;">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete">
            批量删除 ({{ multipleSelection.length }})
          </el-button>
          <el-button type="success" size="small" @click="exportKhorder">导出订单</el-button>
          <el-button type="warning" size="small" @click="handleImportFile">导入订单</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border v-loading="tableLoading" style="width: 100%"
          @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号" width="88" prop="id" align="center"></el-table-column>

          <el-table-column label="订单编号" align="center" min-width="230">
            <template slot-scope="scope">
              <div class="order-no">{{ scope.row.orderid }}</div>
              <div class="dangerCl">ID:{{ scope.row.gyid }}</div>
              <div class="blueCl">{{ scope.row.user ? scope.row.user.username : '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="收件人" align="center" min-width="110">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>

          <el-table-column label="客户地址" align="center" min-width="250">
            <template slot-scope="scope">
              {{ scope.row.diqu }}{{ scope.row.address }}
            </template>
          </el-table-column>

          <el-table-column label="手机号" align="center" min-width="130">
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>

          <el-table-column label="下单时间" align="center" min-width="160">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>

          <el-table-column label="状态" min-width="90" align="center">
            <template slot-scope="scope">
              <span :style="{ color: getStateColor(scope.row.state) }">
                {{ getStateText(scope.row.state) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="280" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="sendSms(scope.row)">发送短信</el-button>
              <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
      <input ref="fileInput" type="file" accept=".xls,.xlsx,.csv" style="display: none" @change="handleFileChange" />
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { khorderList, delKhorder, smsKhorder, exportKhorder, importKhorder } from '@/api/modules/sorder'

export default {
  name: 'KhorderList',
  data() {
    return {
       roleId: parseInt(localStorage.getItem('role_id') || '0'),
    isSuperAdmin: localStorage.getItem('is_super_admin') === '1',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      tableLoading: false,
      searchForm: {
        search_key: 'orderid',
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
    // 触发文件选择
    handleImportFile() {
      this.$refs.fileInput.click()
    },

    // 文件选择变化
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      const validExtensions = ['.xls', '.xlsx', '.csv']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

      if (!validExtensions.includes(fileExtension)) {
        this.$message.error('请上传 .xls、.xlsx 或 .csv 格式的文件')
        this.$refs.fileInput.value = ''
        return
      }

      this.$confirm(
        '确认导入该文件中的兑换订单数据吗？<br/>系统将自动识别表头进行导入',
        '导入确认',
        {
          confirmButtonText: '确定导入',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(async () => {
        await this.processImportFile(file)
      }).catch(() => {
        this.$refs.fileInput.value = ''
      })
    },

    // 处理导入文件
    async processImportFile(file) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入兑换订单数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        // 读取文件
        const jsonData = await this.readImportFile(file)

        if (!jsonData || jsonData.length === 0) {
          this.$message.warning('文件中没有有效数据')
          loading.close()
          this.$refs.fileInput.value = ''
          return
        }

        // 调用导入接口（传递 JSON 字符串）
        const res = await importKhorder({ data: JSON.stringify(jsonData) })

        loading.close()

        if (res.status === 200 || res.code === 200) {
          const count = res.count || 0
          this.$message.success(`导入成功，共导入 ${count} 条数据`)
          this.loadData() // 刷新列表
        } else {
          this.$message.error(res.msg || '导入失败')
        }
      } catch (error) {
        loading.close()
        console.error('导入失败:', error)
        this.$message.error('导入失败：' + (error.message || '请稍后重试'))
      } finally {
        this.$refs.fileInput.value = ''
      }
    },

    // 读取导入文件（支持 xls、xlsx、csv）
    readImportFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

        reader.onload = (e) => {
          try {
            let jsonData = []

            if (fileExtension === '.csv') {
              // 处理 CSV 文件
              const text = e.target.result
              const rows = text.split('\n').filter(row => row.trim())

              if (rows.length < 2) {
                resolve([])
                return
              }

              // 解析表头
              const headers = rows[0].split(/[,，]/).map(h => h.trim().replace(/^"|"$/g, ''))

              // 解析数据行
              for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(/[,，]/).map(col => col.trim().replace(/^"|"$/g, ''))
                if (cols.length > 0 && cols.some(c => c)) {
                  const item = {}
                  headers.forEach((header, index) => {
                    if (header && cols[index] !== undefined) {
                      item[header] = cols[index] || ''
                    }
                  })
                  jsonData.push(item)
                }
              }
            } else {
              // 处理 Excel 文件
              const data = new Uint8Array(e.target.result)
              const workbook = XLSX.read(data, { type: 'array' })
              const firstSheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[firstSheetName]

              // 转换为数组格式
              const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

              if (rawData.length < 2) {
                resolve([])
                return
              }

              const headers = rawData[0].map(h => String(h || '').trim())
              for (let i = 1; i < rawData.length; i++) {
                const row = rawData[i]
                if (!row || row.length === 0) continue

                const item = {}
                headers.forEach((header, index) => {
                  if (header && row[index] !== undefined && row[index] !== null) {
                    item[header] = String(row[index]).trim()
                  }
                })

                if (Object.keys(item).length > 0) {
                  jsonData.push(item)
                }
              }
            }

            resolve(jsonData)
          } catch (error) {
            reject(new Error('文件解析失败：' + error.message))
          }
        }

        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }

        // 根据文件类型选择读取方式
        if (fileExtension === '.csv') {
          reader.readAsText(file, 'UTF-8')
        } else {
          reader.readAsArrayBuffer(file)
        }
      })
    },
    // ============ 导出兑换订单（替换原有方法） ============
    async exportKhorder() {
      // 如果有选中的订单，询问是否按选中导出
      if (this.multipleSelection.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.multipleSelection.length} 条订单，是否按选中ID导出？`,
            '导出确认',
            {
              confirmButtonText: '按选中导出',
              cancelButtonText: '按搜索条件',
              type: 'info',
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true
            }
          )
          // 按选中ID导出
          await this.doExportKhorder({
            ids: this.multipleSelection.map(item => item.id).join(',')
          })
        } catch (action) {
          if (action === 'cancel') {
            // 按搜索条件导出
            await this.doExportKhorder()
          }
        }
      } else {
        // 没有选中，按搜索条件导出
        try {
          await this.$confirm('确认按当前搜索条件导出全部兑换订单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
          await this.doExportKhorder()
        } catch (e) {
          // 用户取消
        }
      }
    },

    // 实际导出逻辑
    async doExportKhorder(extraParams = {}) {
      // 构建业务参数
      const businessParams = {
        ...extraParams
      }

      // 如果没有传 ids，则使用搜索条件
      if (!businessParams.ids) {
        // 搜索字段
        if (this.searchForm.search_key) {
          businessParams.search_key = this.searchForm.search_key
        }
        if (this.searchForm.search_val) {
          businessParams.search_val = this.searchForm.search_val
        }
        // 排序字段
        if (this.searchForm.px_key) {
          businessParams.px_key = this.searchForm.px_key
        }
        if (this.searchForm.px_val) {
          businessParams.px_val = this.searchForm.px_val
        }
        // 时间范围
        if (this.searchForm.ks_time) {
          businessParams.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          businessParams.end_time = this.searchForm.end_time
        }
        // 订单状态
        if (this.searchForm.state !== '') {
          businessParams.state = this.searchForm.state
        }
      }

      try {
        const loading = this.$loading({
          lock: true,
          text: '正在导出数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 调用导出接口
        const res = await exportKhorder(businessParams)

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

          // 检查 XLSX 是否可用
          if (typeof XLSX === 'undefined') {
            this.exportAsHtml(header, data, filename)
            return
          }

          // 使用 XLSX 导出
          try {
            const excelData = [header, ...data]
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet(excelData)

            const colWidths = header.map((h) => {
              if (h === '订单编号') return { wch: 20 }
              if (h === '编号') return { wch: 10 }
              if (h === '收件人') return { wch: 10 }
              if (h === '手机号') return { wch: 10 }
              if (h === '收货地址') return { wch: 10 }
              if (h === '选择规格' || h === '全部规格') return { wch: 12 }
              if (h === '客户备注' || h === '用户备注' || h === '后台备注') return { wch: 16 }
              if (h === '产品名称') return { wch: 15 }
              if (h === '购买账号') return { wch: 10 }
              if (h === '卡册名称') return { wch: 11 }
              if (h === '供货商') return { wch: 12 }
              if (h === '下单时间') return { wch: 12 }
              if (h === '订单状态') return { wch: 11 }
              if (h.startsWith('快递公司')) return { wch: 11 }
              if (h.startsWith('快递单号')) return { wch: 10 }
              if (h === '产品ID') return { wch: 12 }
              if (h === '数量') return { wch: 10 }
              if (h === '供货价') return { wch: 14 }
              return { wch: 14 }
            })
            ws['!cols'] = colWidths

            XLSX.utils.book_append_sheet(wb, ws, '兑换订单')
            XLSX.writeFile(wb, filename || 'export.xlsx')
            this.$message.success('导出成功')
          } catch (xlsxError) {
            console.error('XLSX导出失败，降级为HTML导出:', xlsxError)
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
        <style>
          table { border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
          th { background-color: #4472C4; color: #ffffff; font-weight: bold; padding: 6px 10px; border: 1px solid #999; text-align: center; }
          td { padding: 4px 10px; border: 1px solid #999; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>
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
      this.tableLoading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          ks_time: this.searchForm.ks_time,
          end_time: this.searchForm.end_time,
          state: this.searchForm.state,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await khorderList(params)
        if (res.code === 200 && res.data) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
          this.tableData = []
          this.total = 0
        }
      } catch (error) {
        this.$message.error('获取列表失败')
        console.error(error)
        this.tableData = []
        this.total = 0
      } finally {
        this.tableLoading = false
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.multipleSelection = []
      this.loadData()
    },

    // 翻页
    handlePageChange(page) {
      this.currentPage = page
      this.multipleSelection = []
      this.loadData()
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKhorder({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.multipleSelection = []
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm('确认删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKhorder({ ids: row.id })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 发送短信
    async sendSms(row) {
      try {
        const res = await smsKhorder({ id: row.id })
        if (res.code === 200) {
          this.$message.success(res.msg || '发送成功')
        } else {
          this.$message.error(res.msg || '发送失败')
        }
      } catch (error) {
        // this.$message.error('发送失败')
      }
    },

    // 查看详情
    viewDetail(row) {
      this.$router.push({ name: 'MallExchangedetails', query: { id: row.id } })
    },

    // 导出
    // async exportKhorder() {
    //   try {
    //     const params = { ...this.searchForm }
    //     const res = await exportKhorder(params)
    //     if (res.code === 200) {
    //       this.$message.success('导出成功')
    //       if (res.data && res.data.url) {
    //         window.open(res.data.url)
    //       }
    //     } else {
    //       this.$message.error(res.msg || '导出失败')
    //     }
    //   } catch (error) {
    //     this.$message.error('导出失败')
    //   }
    // },

    // 导入
    importKhorder() {
      // 创建文件选择器
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx,.xls,.csv'
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
          const res = await importKhorder(formData)
          if (res.code === 200) {
            this.$message.success(res.msg || '导入成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '导入失败')
          }
        } catch (error) {
          this.$message.error('导入失败')
        }
      }
      input.click()
    },

    // 状态文本
    getStateText(state) {
      const map = { 1: '未发货', 2: '已发货', 3: '已取消' }

      return map[state] || '未知'
    },

    // 状态颜色
    getStateColor(state) {
      const map = { 1: '#ff0000', 2: '#409EFF', 3: '#999999' }
      return map[state] || '#ff0000'
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }
  }, computed: {
    isAdmin() {
      return this.roleId === 1 || this.isSuperAdmin
    },
    IsMallExchange() {
      return this.$route.name === 'MallExchange' || this.$route.path === '/mall-order/exchange'
    }
  }
}
</script>

<style>
.formb0 .el-form-item {
  margin-bottom: 0px;
  margin-top: 10px !important;
}

.formb0 .el-card__body,
.el-main {
  padding: 10px 20px 16px 20px;
}

.formb0 {
  padding: 0px 10px 0 0px;
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
</style>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

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

  .search-card {
    margin-bottom: 20px;
  }

  .order-no {
    color: #303133;
    font-size: 13px;
    word-break: break-all;
  }

  .dangerCl {
    color: #ff0000;
    font-size: 12px;
  }

  .blueCl {
    color: #0033cc;
    font-size: 12px;
  }

  .w120 {
    width: 120px;
  }

  .w140 {
    width: 140px;
  }
}
</style>