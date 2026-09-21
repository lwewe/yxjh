<template>
  <div class="list-container">
    <template v-if="IsMallOrderLists">
      <!-- 搜索栏 -->
      <el-card class="search-card serchForm formb0">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w140">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="供应商ID" value="gid"></el-option>
              <el-option label="快递单号" value="num"></el-option>
              <el-option label="商品编码" value="cpid"></el-option>
              <el-option label="用户手机号" value="uphone"></el-option>

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
          <!-- 订单状态  - 全部，0-待发货，1-待收货，2-已完成，3-已取消 -->

          <el-form-item label="">
            <el-select v-model="searchForm.state" placeholder="订单状态" class="w120" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="待发货" value="0"></el-option>
              <el-option label="待收货" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
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

          <!-- 订单类型  - 全部，1-商城订单，2-兑换订单 -->
          <el-form-item label="">
            <el-select v-model="searchForm.lm_flag" placeholder="订单类型" class="w120" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="商城订单" value="1"></el-option>
              <el-option label="兑换订单" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card class="search-card">
        <div class="mb20 txtleft">
          <!-- <el-button type="success" @click="exportDingdan" size="mini">导出订单</el-button> -->
          <el-button type="success" size="small" @click="exportDingdan">导出订单</el-button>
          <el-button type="warning" size="small" @click="handleImportFile">导入订单</el-button>

        </div>

        <el-table ref="multipleTable" :data="tableData" border v-loading="tableLoading" style="width: 100%" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column label="编号" align="center" width="80" prop="id"></el-table-column>

          <el-table-column label="订单号" align="center" min-width="230">
            <template slot-scope="scope">
              <span>{{ scope.row.order_no }}</span>
            </template>
          </el-table-column>

          <el-table-column label="商品" align="center" min-width="380">
            <template slot-scope="scope">
              <div class="product-cell" v-if="scope.row.product && scope.row.product.length">
                <div class="dflex al-center" v-for="(product, pIdx) in scope.row.product" :key="pIdx">
                  <img v-if="product.product && product.product.thumbnailimage" :src="product.product.thumbnailimage"
                    class="product-img" @error="handleImgError">
                  <div v-else class="img-placeholder">暂无</div>
                  <div class="txtleft ml10 fs12">
                    <div class="product-name">{{ product.product ? product.product.name : '-' }}</div>
                    <span>
                      {{ getProductSpec(product) }}<span class="blueCl"> * {{ product.quantity }}</span>
                    </span>
                    <div class="fs12"><span class="fs10">￥</span>{{ getProductPrice(product) }}</div>
                  </div>
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <!-- <el-table-column label="下单用户" align="center" width="80" prop="uid"></el-table-column> -->
          <el-table-column label="下单用户" align="center" min-width="80">
            <template slot-scope="scope">
              <a href="javascript:;" @click="viewUser(scope.row.uid)" style="color: #222; text-decoration: none;">
                {{ scope.row.uid }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" min-width="100">
            <template slot-scope="scope">
              <div><span class="fs10">￥</span>{{ scope.row.price }}</div>
            </template>
          </el-table-column>

          <el-table-column label="供应商" align="center" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.gongyingshang ? scope.row.gongyingshang.id + '-' + scope.row.gongyingshang.username : '-' }}
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" min-width="90">
            <template slot-scope="scope">
              <el-tag :type="getStateType(scope.row.state)" size="small">
                {{ getStateText(scope.row.state) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="下单时间" align="center" min-width="160">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 用户详情弹窗 -->
      <el-dialog title="用户详情" :visible.sync="userDialogVisible" width="50%" :before-close="closeUserDialog">
        <div v-loading="userLoading" style="width: 80%;margin: auto;text-align: left;">
          <template v-if="userDetail">
            <el-form label-width="130px" label-position="right">
              <el-form-item label="用户ID：">
                <el-input v-model="userDetail.id" readonly></el-input>
              </el-form-item>
              <el-form-item label="手机号：">
                <el-input v-model="userDetail.phone" readonly></el-input>
              </el-form-item>
              <el-form-item label="微信：">
                <el-input :value="userDetail.openid || '未绑定'" readonly></el-input>
              </el-form-item>
              <el-form-item label="头像：" style="text-align: left;">
                <img v-if="userDetail.img" :src="userDetail.img"
                  style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
                <span v-else style="color: #909399;">暂无头像</span>
              </el-form-item>
              <el-form-item label="用户状态：">
                <el-tag :type="userDetail.sh == 0 ? 'success' : 'danger'" size="small">
                  {{ userDetail.sh == 0 ? '正常' : '禁用' }}
                </el-tag>
              </el-form-item>
              <el-form-item label="注册时间：">
                <el-input :value="formatTime(userDetail.add_time)" readonly></el-input>
              </el-form-item>
              <el-form-item label="最后登录：">
                <el-input :value="formatTime(userDetail.login_time)" readonly></el-input>
              </el-form-item>
              <el-form-item label="登录次数：">
                <el-input :value="userDetail.num || 0" readonly></el-input>
              </el-form-item>
              <el-form-item label="蛋叔ID：">
                <template v-if="userDetail.api_id === 0">
                  <el-tag type="warning" size="small">未关联</el-tag>
                </template>
                <el-input v-else :value="userDetail.api_id" readonly></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </el-dialog>
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
import { dingdanList, delDingdan, exportDingdan, importDingdan } from '@/api/modules/sorder'

export default {
  name: 'DingdanList',
  data() {
    return {
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      tableLoading: false,
      searchForm: {
        search_key: 'order_no',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        state: 'status',
        lm_flag: 'status'
      },
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async viewUser(uid) {
      this.userDialogVisible = true
      this.userDetail = null
      this.userLoading = true
      try {
        const { getRegister } = await import('@/api/modules/zhichong')
        const res = await getRegister({ id: uid })
        if (res.code === 200) {
          this.userDetail = res.data
        } else {
          this.$message.error('获取用户信息失败')
        }
      } catch (error) {
        this.$message.error('获取用户信息失败')
      } finally {
        this.userLoading = false
      }
    },

    closeUserDialog() {
      this.userDialogVisible = false
      this.userDetail = null
    },
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
        '确认导入该文件中的订单数据吗？<br/>系统将自动识别表头进行导入',
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
        text: '正在导入订单数据...',
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

        // 调用导入接口
        const res = await importDingdan({ data: JSON.stringify(jsonData) })
        console.log('② 接口返回:', JSON.stringify(res))

        loading.close()
        console.log('③ loading 已关闭')

        const isSuccess = res.status === 200 || res.status === 201 || res.code === 200
        if (isSuccess) {
          const count = res.count || (res.data && res.data.count) || 0
          this.$message.success(`导入成功，共导入 ${count} 条数据`)
          this.loadData()
        } else {
          this.$message.error(res.msg || res.message || '导入失败')
        }



      } catch (error) {

        loading.close()

        // 只要 status 是 200 或 201，就是成功，不管 message 说什么
        if (error && (error.status === 200 || error.status === 201)) {
          const count = error.count || (error.data && error.data.count) || 0
          this.$message.success(`导入成功，共导入 ${count} 条数据`)
          this.loadData()
        } else {
          this.$message.error('导入失败：' + (error.message || error.msg || '请稍后重试'))
        }
      } finally {
        this.$refs.fileInput.value = ''
      }
    },

    // 读取导入文件（支持 xls、xlsx、csv）

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
                const item = {}
                headers.forEach((header, index) => {
                  if (!header) return // 跳过空表头
                  // 始终保留字段，值存在就用，不存在就设为空字符串
                  const cellValue = cols[index] !== undefined && cols[index] !== null
                    ? String(cols[index]).trim()
                    : ''
                  item[header] = cellValue
                })
                jsonData.push(item)
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
                  if (!header) return // 跳过空表头
                  // 始终保留字段，值存在就用，不存在就设为空字符串
                  const cellValue = row[index] !== undefined && row[index] !== null
                    ? String(row[index]).trim()
                    : ''
                  item[header] = cellValue
                })
                jsonData.push(item)
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
    // 加载数据 - 对接接口
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
          lm_flag: this.searchForm.lm_flag,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await dingdanList(params)
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
      this.loadData()
    },

    // 翻页
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    // 查看详情
    viewDetail(row) {
      this.$router.push({ name: 'MallOrderListdetails', query: { id: row.id } })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delDingdan({ id: row.id })
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

    // 导出

    // ============ 导入订单（新增功能） ============
    // importKhorder() {
    //   this.$message.info('导入订单功能开发中')
    // },

    // ============ 导出订单（替换原有方法） ============
    async exportDingdan() {
      try {
        await this.$confirm('确认按当前搜索条件导出订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        await this.doExportDingdan()
      } catch (e) {
        // 用户取消
      }
    },

    // 实际导出逻辑
    async doExportDingdan() {
      // 构建业务参数
      const businessParams = {}

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
      // 订单类型 (lm_flag)
      if (this.searchForm.lm_flag !== '') {
        businessParams.lm_flag = this.searchForm.lm_flag
      }

      try {
        const loading = this.$loading({
          lock: true,
          text: '正在导出数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 调用导出接口
        const res = await exportDingdan(businessParams)

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

            // 设置列宽 - 根据导出表头优化
            // ws['!cols'] = header.map((h) => {
            //   if (h === '订单号') return { wch: 28 }
            //   if (h === '供应商') return { wch: 30 }
            //   if (h === '产品') return { wch: 35 }
            //   if (h === '规格') return { wch: 25 }
            //   if (h === '地址') return { wch: 40 }
            //   if (h === '姓名') return { wch: 12 }
            //   if (h === '手机号') return { wch: 16 }
            //   if (h === '下单用户ID') return { wch: 14 }
            //   if (h === '下单时间') return { wch: 20 }
            //   if (h === '状态') return { wch: 10 }
            //   if (h.startsWith('快递公司') || h.startsWith('快递单号')) return { wch: 16 }
            //   if (h === '用户备注' || h === '后台备注') return { wch: 20 }
            //   if (h === '单价' || h === '小计' || h === '供货价') return { wch: 12 }
            //   if (h === '数量') return { wch: 8 }
            //   return { wch: 12 }
            // })
            // 设置列宽 - 根据导出表头优化
            const colWidths = header.map((h) => {
              if (h === '订单号') return { wch: 16 }
              if (h === '供应商') return { wch: 16 }
              if (h === '下单用户ID') return { wch: 14 }
              if (h === '下单时间') return { wch: 10 }
              if (h === '姓名') return { wch: 10 }
              if (h === '手机号') return { wch: 16 }
              if (h === '地址') return { wch: 15 }
              if (h === '产品') return { wch: 10 }
              if (h === '规格') return { wch: 18 }
              if (h === '供货价') return { wch: 10 }
              if (h === '数量') return { wch: 8 }
              if (h === '单价') return { wch: 10 }
              if (h === '小计') return { wch: 10 }
              if (h === '状态') return { wch: 10 }
              if (h.startsWith('快递公司')) return { wch: 14 }
              if (h.startsWith('快递单号')) return { wch: 18 }
              if (h === '用户备注') return { wch: 12 }
              if (h === '后台备注') return { wch: 12 }
              return { wch: 12 }
            })
            ws['!cols'] = colWidths

            XLSX.utils.book_append_sheet(wb, ws, '订单列表')
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


    getProductSpec(product) {
      if (product.xinghao && product.xinghao.xinghao) return product.xinghao.xinghao
      if (product.product && product.product.name) return product.product.name
      return '默认'
    },

    getProductPrice(product) {
      return product.xinghao ? product.xinghao.price : '0.00'
    },

    getStateText(state) {
      const map = { 0: '待发货', 1: '待收货', 2: '已完成', 3: '已取消' }
      return map[state] || '未知'
    },

    getStateType(state) {
      const map = { 0: 'warning', 1: 'primary', 2: 'success', 3: 'info' }
      return map[state] || 'info'
    },

    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    },

    handleImgError(e) {
      e.target.style.display = 'none'
      const div = document.createElement('div')
      div.className = 'img-placeholder'
      div.textContent = '暂无'
      div.style.cssText = 'width:60px;height:60px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;font-size:12px;color:#909399;border-radius:4px;'
      e.target.parentNode.appendChild(div)
    }
  }, computed: {
    IsMallOrderLists() {
      return this.$route.name === 'MallOrderList' || this.$route.path === '/mall-order/list'
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

  .product-cell {
    .dflex {
      display: flex;
    }

    .al-center {
      align-items: center;
    }

    .txtleft {
      text-align: left;
    }

    .ml10 {
      margin-left: 10px;
    }

    .mt10 {
      margin-top: 10px;
    }
  }

  .product-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .img-placeholder {
    width: 60px;
    height: 60px;
    background: #f5f7fa;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #909399;
    flex-shrink: 0;
  }

  .product-name {
    color: #303133;
    font-size: 13px;
    // max-width: 200px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    margin-bottom: 2px;
  }

  .blueCl {
    color: #409EFF;
    font-size: 12px;
  }

  .fs10 {
    font-size: 10px;
  }

  .w120 {
    width: 120px;
  }

  .w140 {
    width: 140px;
  }
}
</style>