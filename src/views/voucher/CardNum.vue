<template>
  <div class="cardnums">
    <el-card class="search-card serchForm formStop">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="券号" value="num"></el-option>
            <el-option label="用户UID" value="uid"></el-option>
            <el-option label="订单id" value="order_id"></el-option>
            <el-option label="下单次数" value="cishu"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.state" placeholder="状态" class="w120" clearable>
            <el-option label="未激活" value="1"></el-option>
            <el-option label="已激活" value="2"></el-option>
            <el-option label="已绑定" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button type="success" icon="el-icon-top-right" @click="handleExport()"
            style="display: none;">导出</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <!-- 权益券信息 -->
    <el-card class="mb20 mt20" v-if="exchangeInfo">
      <div class="txtleft dflex flex-between">
        <div>
          <span class="sizeCl6">开卡客户名称：</span>{{ exchangeInfo.company }}
        </div>
        <div>
          <span class="sizeCl6">券数量：</span>{{ exchangeInfo.geshu || 0 }}
          <span class="sizeCl6 ml10">已绑定：</span>{{ ybd || 0 }}
          <span class="sizeCl6 ml10">未绑定：</span>{{ wbd || 0 }}
          <span class="sizeCl6 ml10">已分配：</span>{{ shuliang || 0 }}
        </div>
      </div>
    </el-card>

    <!-- 修改弹窗 -->
    <el-dialog title="修改券号" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" label-width="120px" style="width: 90%;text-align: left;">
        <el-form-item label="券号：">
          <span>{{ editForm.num }}</span>
        </el-form-item>
        <el-form-item label="密码：">
          <span>{{ editForm.pass }}</span>
        </el-form-item>
        <el-form-item label="下单次数：" v-if="editForm.state == 3">
          <span id="new_cishu">{{ editForm.cishu || 0 }}</span>
          <span style="margin-left: 30px;">
            <el-select v-model="editForm.addtype" style="width: 80px;">
              <el-option label="增加" value="1"></el-option>
              <el-option label="减少" value="2"></el-option>
            </el-select>
            <el-input v-model="editForm.addcishu" placeholder="下单次数" style="width: 120px; margin-left: 5px;"
              type="number"></el-input>
            <el-button type="success" style="margin-left: 5px;" @click="submitEditCishu"
              :loading="submittingCishu">保存</el-button>
          </span>
        </el-form-item>
        <el-form-item label="下单次数：" v-else>
          <el-input v-model="editForm.cishu" placeholder="请输入下单次数" type="number"></el-input>
        </el-form-item>
        <el-form-item label="权益券：">
          <el-select v-model="editForm.gid" placeholder="请选择权益券" filterable style="width: 100%;">
            <el-option v-for="item in exchangeList" :key="item.id"
              :label="item.id + '-' + item.company + '-' + item.sale + '[' + item.geshu + ']'"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活状态：" v-if="editForm.state == 3">
          <span>已绑定</span>
        </el-form-item>
        <el-form-item label="激活状态：" v-else>
          <el-radio-group v-model="editForm.state">
            <el-radio :label="1">未激活</el-radio>
            <el-radio :label="2">已激活</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="绑定用户：" v-if="editForm.uid">
          <span>{{ editForm.uid }} &nbsp;&nbsp;&nbsp;绑定时间 {{ editForm.bd_time ? formatTime(editForm.bd_time) : ''
            }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block;text-align: center;">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="submitting" v-if="editForm.state != 3">保存</el-button>
      </span>
    </el-dialog>

    <el-card class="search-card">
      <div class="dflex al-center txtleft mb10">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
          @click="batchDelete()">批量删除</el-button>
        <el-button type="success" size="small" @click="batchJihuo()"
          :disabled="!multipleSelection.length">激活</el-button>
        <el-button type="warning" size="small" @click="batchQxjihuo()"
          :disabled="!multipleSelection.length">取消激活</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="券号" width="190" align="center">
          <template slot-scope="scope">{{ scope.row.num }}</template>
        </el-table-column>
        <el-table-column label="密码" width="190" align="center">
          <template slot-scope="scope">{{ scope.row.pass }}</template>
        </el-table-column>
        <el-table-column label="剩余下单次数" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.cishu }}</template>
        </el-table-column>
        <el-table-column label="用户" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.uid || '-' }}</template>
        </el-table-column>
        <el-table-column label="绑定时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.bd_time ? formatTime(scope.row.bd_time) : '-' }}</template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="stateType(scope.row.state)" size="small">{{ stateName(scope.row.state) }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.state !== 3" v-model="scope.row.state" :active-value="2" :inactive-value="1"
              active-text=" " inactive-text=" " @change="handleStateChange(scope.row)">
            </el-switch>
            <el-tag v-else type="warning" size="small">已绑定</el-tag>
          </template>
        </el-table-column>

        <!-- <el-table-column label="限制价格" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.flag == 1" class="blueCl">限制</span>
            <span v-else class="blueCl">不限制</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" min-width="250" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="openRecord(scope.row)">记录</el-button>
            <el-button size="mini" type="primary" @click="openEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:20px;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 消费记录抽屉 -->
    <el-drawer title="消费记录" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <!-- 券信息 -->
          <el-form :model="recordInfo" label-width="100px" style="width: 80%; text-align: left;" class="record-form">
            <el-form-item label="券号：" class="addBorder">
              <el-input v-model="recordInfo.num" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="recordInfo.pass" readonly />
            </el-form-item>
            <el-form-item label="下单次数：" class="addBorder">
              <el-input v-model="recordInfo.cishu" readonly />
            </el-form-item>
            <el-form-item label="激活状态：" class="addBorder">
              <el-input :value="stateName(recordInfo.state)" readonly />
            </el-form-item>
            <el-form-item v-if="recordInfo.state == 3" label="绑定用户：" class="addBorder">
              <el-input :value="recordInfo.uid ? recordInfo.uid + '    绑定时间 ' + formatTime(recordInfo.bd_time) : '-'"
                readonly />
            </el-form-item>
          </el-form>

          <!-- 消费记录表格 -->
          <el-table :data="recordTableData" border style="width: 100%" max-height="300"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" v-loading="recordLoading">
            <el-table-column label="编号" align="center" width="80">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="下单次数" align="center" width="100">
              <template slot-scope="scope">
                <span :style="{ color: scope.row.flag == 1 || scope.row.flag == 4 ? '#f56c6c' : '#67c23a' }">
                  {{ scope.row.flag == 1 || scope.row.flag == 4 ? '-' : '+' }}{{ scope.row.cishu }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.flag == 1" class="dangerCl">消费</span>
                <span v-else-if="scope.row.flag == 2" class="greenCl">充值</span>
                <span v-else-if="scope.row.flag == 3" class="dangerCl">后台充值</span>
                <span v-else-if="scope.row.flag == 4" class="blueCl">后台扣除</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="180">
              <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
            </el-table-column>
            <el-table-column label="订单号" align="center">
              <template slot-scope="scope">{{ scope.row.order_no || '-' }}</template>
            </el-table-column>
            <el-table-column label="交易号" align="center">
              <template slot-scope="scope">{{ scope.row.transaction_id || '-' }}</template>
            </el-table-column>
            <el-table-column label="实付金额" align="center" width="100">
              <template slot-scope="scope">{{ scope.row.total_fee || '-' }}</template>
            </el-table-column>
          </el-table>

          <div style="text-align:right;margin-top:20px;">
            <el-pagination background @size-change="handleRecordSizeChange" @current-change="handleRecordCurrentChange"
              :current-page="recordCurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="recordPageSize"
              layout="total,sizes,prev,pager,next,jumper" :total="recordTotal">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <el-dialog title="选择导出类型" :visible.sync="exportDialogVisible" width="50%" :close-on-click-modal="false">
      <el-form label-width="100px" style="width: 90%; margin: 0 auto;">
        <el-form-item label="导出类型：">
          <el-radio-group v-model="exportFlag">
            <el-radio label="1">券信息</el-radio>
            <el-radio label="2">次数信息</el-radio>
            <el-radio label="3">用户绑券信息</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block; text-align: center;">
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport" :loading="exportLoading">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { exchangeQuanList, getQuanInfo, editQuan, editCishu, delQyQuan, jihuo, qxjihuo, xfjl, exportQuangid, fbQuan } from '@/api/modules/exchange'

export default {
  name: 'ExchangeQuanNum',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      exportDialogVisible: false,
      exportLoading: false,
      exportFlag: '1',  // 1-券信息，2-次数信息，3-用户绑券信息
      drawer: false,
      direction: 'rtl',
      loading: false,
      submitting: false,
      submittingCishu: false,
      editDialogVisible: false,
      // 搜索
      searchForm: { search_key: 'num', search_val: '', state: '' },
      currentPage: 1, pageSize: 20, total: 0,
      multipleSelection: [], tableData: [],
      // 权益券信息
      exchangeInfo: null, shuliang: 0, ybd: 0, wbd: 0,
      // 修改弹窗
      editForm: { id: '', num: '', pass: '', gid: '', cishu: '', state: 1, uid: '', bd_time: '', addtype: '1', addcishu: '' },
      exchangeList: [],
      // 消费记录
      recordLoading: false,
      recordInfo: { num: '', pass: '', cishu: '', state: 1, uid: 0, bd_time: 0 },
      recordTableData: [],
      recordCurrentPage: 1,
      recordPageSize: 10,
      recordTotal: 0,
      currentRecordRow: null
    }
  },
  mounted() {
    const gid = this.$route.params.id
    if (gid) this.getList()
  },
  methods: {
    // 快速切换激活状态（带确认框）
    async handleStateChange(row) {
      // 已绑定的券不允许修改状态
      if (row.state === 3) {
        this.$message.warning('已绑定的券不能修改激活状态')
        this.getList()
        return
      }

      const targetStatus = row.state === 2 ? 2 : 1
      const actionText = targetStatus === 2 ? '激活' : '取消激活'

      try {
        await this.$confirm(`确认${actionText}该券号吗？`, '提示', {
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
        const res = await fbQuan({ id: row.id })
        if (res.code === 200) {
          row.state = res.data.state
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换激活状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    // ============ 导出相关方法 ============

    // 打开导出类型选择弹窗
    handleExport() {
      this.exportFlag = '1'
      this.exportDialogVisible = true
    },

    // 确认导出
    async confirmExport() {
      this.exportDialogVisible = false
      await this.doExport()
    },

    // 实际导出逻辑
    async doExport() {
      const gid = this.$route.params.id
      if (!gid) {
        this.$message.warning('缺少权益券ID')
        return
      }

      const exportTypeText = {
        '1': '券信息',
        '2': '次数信息',
        '3': '用户绑券信息'
      }

      const flagText = this.multipleSelection.length > 0
        ? `（已选中 ${this.multipleSelection.length} 条）`
        : ''

      try {
        await this.$confirm(
          `确认导出当前权益券的<b>${exportTypeText[this.exportFlag]}</b>${flagText}吗？`,
          '导出确认',
          {
            confirmButtonText: '确定导出',
            cancelButtonText: '取消',
            type: 'info',
            dangerouslyUseHTMLString: true
          }
        )
      } catch {
        return
      }

      this.exportLoading = true
      const loading = this.$loading({
        lock: true,
        text: '正在导出数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const params = {
          gid: gid,
          flag: this.exportFlag
        }

        // 如果有选中的券号，传 ids
        if (this.multipleSelection.length > 0) {
          params.ids = this.multipleSelection.map(item => item.id).join(',')
        }

        // 动态导入导出接口
        const { exportQuangid } = await import('@/api/modules/exchange')
        const res = await exportQuangid(params)

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

          // 使用 XLSX 导出
          if (typeof XLSX !== 'undefined') {
            try {
              const excelData = [header, ...data]
              const wb = XLSX.utils.book_new()
              const ws = XLSX.utils.aoa_to_sheet(excelData)

              // 根据不同导出类型设置列宽
              ws['!cols'] = header.map((h) => {
                if (h === '券号' || h === '二维码内容') return { wch: 30 }
                if (h === '密码') return { wch: 15 }
                if (h === '姓名' || h === '手机号') return { wch: 16 }
                if (h === '用户UID' || h === '绑定时间') return { wch: 18 }
                if (h === '次数' || h === '剩余次数') return { wch: 12 }
                return { wch: 12 }
              })

              const sheetName = exportTypeText[this.exportFlag]
              XLSX.utils.book_append_sheet(wb, ws, sheetName)
              XLSX.writeFile(wb, filename || 'export.xlsx')
              this.$message.success('导出成功')
            } catch (xlsxError) {
              console.error('XLSX导出失败，降级为HTML导出:', xlsxError)
              this.exportAsHtml(header, data, filename)
            }
          } else {
            // XLSX 不可用，降级为 HTML 导出
            this.exportAsHtml(header, data, filename)
          }
        } else {
          this.$message.error(res.msg || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败：' + (error.message || '请稍后重试'))
      } finally {
        this.exportLoading = false
        loading.close()
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
    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0')
    },
    stateName(s) { return { 1: '未激活', 2: '已激活', 3: '已绑定' }[s] || '' },
    stateType(s) { return { 1: 'info', 2: 'success', 3: 'warning' }[s] || '' },

    async getList() {
      this.loading = true
      const gid = this.$route.params.id
      try {
        const params = {
          gid: gid,
          search_key: this.searchForm.search_key || undefined,
          search_val: this.searchForm.search_val || undefined,
          px_key: 'id',
          px_val: 'desc',
          state: this.searchForm.state || 'status',
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await exchangeQuanList(params)
        if (res.code === 200) {
          this.exchangeInfo = res.data.exchange || {}
          this.shuliang = res.data.shuliang || 0
          this.ybd = res.data.ybd || 0
          this.wbd = res.data.wbd || 0
          const listData = res.data.list
          this.tableData = listData.data || []
          this.total = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() { this.currentPage = 1; this.getList() },
    handleSizeChange(v) { this.pageSize = v; this.currentPage = 1; this.getList() },
    handleCurrentChange(v) { this.currentPage = v; this.getList() },
    handleSelectionChange(v) { this.multipleSelection = v },

    async openEdit(row) {
      try {
        const res = await getQuanInfo({ id: row.id })
        if (res.code === 200) {
          const numData = res.data.num
          this.exchangeList = res.data.exchange_list || []
          this.editForm = {
            id: numData.id,
            num: numData.num,
            pass: numData.pass,
            gid: numData.gid || '',
            cishu: numData.cishu || '',
            state: numData.state,
            uid: numData.uid || '',
            bd_time: numData.bd_time || '',
            addtype: '1',
            addcishu: ''
          }
          this.editDialogVisible = true
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      }
    },

    async submitEdit() {
      if (this.editForm.state == 3) return
      this.submitting = true
      try {
        const res = await editQuan({
          id: this.editForm.id,
          gid: this.editForm.gid,
          cishu: this.editForm.cishu,
          state: String(this.editForm.state)
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.editDialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },

    async submitEditCishu() {
      if (!this.editForm.addcishu) {
        this.$message.warning('请输入次数')
        return
      }
      this.submittingCishu = true
      try {
        const res = await editCishu({
          id: this.editForm.id,
          addtype: this.editForm.addtype,
          addcishu: this.editForm.addcishu
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.editForm.cishu = res.data.cishu
          this.editForm.addcishu = ''
          this.getList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.submittingCishu = false
      }
    },

    handleDelete(row) {
      this.$confirm('确认删除该券号吗？', '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delQyQuan({ ids: row.id.toString() })
          if (res.code === 200) { this.$message.success(res.msg); this.getList() }
          else this.$message.error(res.msg || '删除失败')
        } catch (e) { this.$message.error('请求失败') }
      }).catch(() => { })
    },

    // batchDelete() {
    //   if (!this.multipleSelection.length) return this.$message.warning('请先选择券号')
    //   this.$confirm('确认删除选中券号吗？', '提示', { type: 'warning' }).then(async () => {
    //     const ids = this.multipleSelection.map(i => i.id).join(',')
    //     try {
    //       const res = await delQyQuan({ ids })
    //       if (res.code === 200) { this.$message.success(res.msg); this.getList() }
    //       else this.$message.error(res.msg || '删除失败')
    //     } catch (e) { this.$message.error('请求失败') }
    //   }).catch(() => { })
    // },
    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择券号')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 张券吗？此操作不可恢复！`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在删除中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        delQyQuan({ ids }).then(res => {
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.$refs.multipleTable.clearSelection()
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        }).catch(err => {
          loading.close()
          console.error('批量删除失败:', err)
          const errorMsg = err?.response?.data?.msg || err?.message || '删除失败，请稍后重试'
          this.$message.error(errorMsg)
        })
      }).catch(() => {
        // 用户取消操作
      })
    },

    batchJihuo() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择券号')
        return
      }

      // 检查是否有已绑定的券（状态为3）
      const hasBinded = this.multipleSelection.some(item => item.state === 3)
      if (hasBinded) {
        this.$message.warning('已绑定的券不能激活，请取消选择已绑定的券')
        return
      }

      // 检查是否有已经激活的券（状态为2）
      const hasActivated = this.multipleSelection.some(item => item.state === 2)
      if (hasActivated) {
        this.$message.warning('已激活的券无需再次激活，请取消选择已激活的券')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      this.$confirm(`确认激活选中的 ${this.multipleSelection.length} 张券吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在激活中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        jihuo({ ids }).then(res => {
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '激活成功')
            this.$refs.multipleTable.clearSelection()
            this.getList()
          } else {
            this.$message.error(res.msg || '激活失败')
          }
        }).catch(err => {
          loading.close()
          console.error('批量激活失败:', err)
          const errorMsg = err?.response?.data?.msg || err?.message || '激活失败，请稍后重试'
          this.$message.error(errorMsg)
        })
      }).catch(() => {
        // 用户取消操作
      })
    },

    batchQxjihuo() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择券号')
        return
      }

      // 检查是否有已绑定的券（状态为3）
      const hasBinded = this.multipleSelection.some(item => item.state === 3)
      if (hasBinded) {
        this.$message.warning('已绑定的券不能取消激活，请取消选择已绑定的券')
        return
      }

      // 检查是否有未激活的券（状态为1）
      const hasNotActivated = this.multipleSelection.some(item => item.state === 1)
      if (hasNotActivated) {
        this.$message.warning('未激活的券无需取消激活，请取消选择未激活的券')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      this.$confirm(`确认取消激活选中的 ${this.multipleSelection.length} 张券吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在取消激活...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        qxjihuo({ ids }).then(res => {
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '取消激活成功')
            this.$refs.multipleTable.clearSelection()
            this.getList()
          } else {
            this.$message.error(res.msg || '取消激活失败')
          }
        }).catch(err => {
          loading.close()
          console.error('批量取消激活失败:', err)
          const errorMsg = err?.response?.data?.msg || err?.message || '取消激活失败，请稍后重试'
          this.$message.error(errorMsg)
        })
      }).catch(() => {
        // 用户取消操作
      })
    },

    // ==================== 消费记录 ====================
    openRecord(row) {
      this.currentRecordRow = row
      this.recordInfo = {
        num: row.num || '',
        pass: row.pass || '',
        cishu: row.cishu || '',
        state: row.state,
        uid: row.uid || 0,
        bd_time: row.bd_time || 0
      }
      this.recordCurrentPage = 1
      this.drawer = true
      this.getRecordList()
    },

    async getRecordList() {
      if (!this.currentRecordRow) return
      this.recordLoading = true
      try {
        const formData = new FormData()
        formData.append('gid', String(this.currentRecordRow.gid || this.$route.params.id))
        formData.append('id', String(this.currentRecordRow.id))
        formData.append('page', String(this.recordCurrentPage))
        formData.append('limit', String(this.recordPageSize))

        const res = await xfjl(formData)
        if (res.code === 200) {
          const data = res.data
          // 更新券信息 - 全部转字符串
          if (data.exchange_num) {
            this.recordInfo = {
              num: data.exchange_num.num || '',
              pass: this.currentRecordRow.pass || '',
              cishu: String(data.exchange_num.cishu || 0),   // ← 转字符串
              state: Number(data.exchange_num.state) || 1,    // ← 保持数字
              uid: data.exchange_num.uid || 0,
              bd_time: this.currentRecordRow.bd_time || 0
            }
          }
          const listData = data.list || {}
          this.recordTableData = listData.data || []
          this.recordTotal = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取消费记录失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.recordLoading = false
      }
    },

    handleRecordSizeChange(v) {
      this.recordPageSize = v
      this.recordCurrentPage = 1
      this.getRecordList()
    },

    handleRecordCurrentChange(v) {
      this.recordCurrentPage = v
      this.getRecordList()
    },

    handleClose(done) {
      this.recordTableData = []
      this.recordTotal = 0
      this.currentRecordRow = null
      done()
    }
  }
}
</script>

<style scoped>
.cardnums .formStop .el-form-item {
  margin-bottom: 0px;
}

.mb20 {
  margin-bottom: 20px;
}

.mt20 {
  margin-top: 20px;
}

.ml10 {
  margin-left: 10px;
}

.txtleft {
  text-align: left;
}

.dflex {
  display: flex;
}

.flex-between {
  justify-content: space-between;
}

.al-center {
  align-items: center;
}

.sizeCl6 {
  color: #666;
  font-weight: bold;
}

.mb10 {
  margin-bottom: 10px;
}

.dangerCl {
  color: #f56c6c;
  font-weight: bold;
}

.blueCl {
  color: #409eff;
  font-weight: bold;
}

.greenCl {
  color: #67c23a;
  font-weight: bold;
}

.addBorder .el-input__inner {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.record-form .el-form-item {
  margin-bottom: 18px;
}
</style>