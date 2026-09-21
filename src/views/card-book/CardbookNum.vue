<template>
  <div class="cardbookNum">
    <!-- 搜索表单 -->
    <el-card class="search-card serchForm pb0">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="卡号" value="num"></el-option>
            <el-option label="姓名" value="name"></el-option>
            <el-option label="手机号" value="phone"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
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
          <el-select v-model="searchForm.state" placeholder="状态" class="w120">
            <el-option label="全部" value="status"></el-option>
            <el-option label="未激活" value="1"></el-option>
            <el-option label="已激活" value="2"></el-option>
            <el-option label="已兑换" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>




          <el-button type="success" icon="el-icon-top-right" @click="handleExport()">导出信息</el-button>
          <el-button type="warning" @click="handleDownloadTemplate()">导入格式</el-button>
          <el-button type="primary" @click="handleImportPhone()">导入手机号</el-button>


        </el-form-item>
        <input ref="fileInput" type="file" accept=".xls,.xlsx" style="display: none" @change="handleFileChange" />
      </el-form>
    </el-card>


    <el-card class="mb20">

      <div class="dflex flex-between">
        <div class="info-left">
          <span class="info-label">卡册信息：</span>
          <span v-if="kaceInfo.company">{{ kaceInfo.company }}</span>
          <span v-else>加载中...</span>
        </div>
        <div class=" ">
          <span>卡数量：{{ kaceInfo.geshu || 0 }} </span>

          <span>已绑定：{{ statistics.ybd || 0 }} </span>

          <span>未绑定：{{ statistics.wbd || 0 }} </span>
          <span v-if="kaceInfo.title" class="template-tag ml10">[{{ kaceInfo.title }}]</span>
        </div>
      </div>
    </el-card>
    <!-- 表格卡片 -->
    <el-card class="search-card">
      <!-- 卡册信息栏 -->


      <!-- 操作按钮 -->
      <div class="action-bar">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete()">
          批量删除
        </el-button>
        <el-button type="success" @click="batchActivate(2)" size="small">激活</el-button>
        <el-button type="warning" @click="batchActivate(1)" size="small">取消激活</el-button>
      </div>

      <!-- 表格 -->
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="90" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="卡号" width="280" align="center">
          <template slot-scope="scope">{{ scope.row.num }}</template>
        </el-table-column>
        <el-table-column label="密码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.pass }}</template>
        </el-table-column>
        <el-table-column label="姓名" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" size="mini" @blur="saveName(scope.row)"
              @keyup.enter.native="saveName(scope.row)" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phone" size="mini" @blur="savePhone(scope.row)"
              @keyup.enter.native="savePhone(scope.row)" placeholder=""></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span class="state-tag" :class="getStateClass(scope.row.state)" @click="toggleState(scope.row)">
              {{ getStateText(scope.row.state) }}
            </span>
          </template>
        </el-table-column> -->

        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span class="state-tag" :class="getStateClass(scope.row.state)" @click="toggleState(scope.row)">
              {{ getStateText(scope.row.state) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top:20px;text-align:right">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 查看/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" style="width: 90%;">
        <el-form-item label="卡号：">
          <el-input v-model="editForm.num" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="editForm.pass" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="editForm.name" :disabled="!isEditMode" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="editForm.phone" :disabled="!isEditMode" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="editForm.state" :disabled="!isEditMode || editForm.state === 3" style="width:100%">
            <el-option label="未激活" :value="1"></el-option>
            <el-option label="已激活" :value="2"></el-option>
            <el-option label="已兑换" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配卡册：" v-if="isEditMode">
          <el-select v-model="editForm.pid" :disabled="editForm.state === 3" style="width:100%" filterable
            placeholder="请选择卡册">
            <el-option v-for="item in kaceList" :key="item.id"
              :label="`${item.company} - ${item.sale} (${item.geshu}张)`" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前卡册：" v-if="!isEditMode">
          <el-input :value="currentKaceName" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block;text-align: center;">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="isEditMode" type="primary" @click="submitEdit" :loading="submitLoading">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { numList, getNum, editNum, delNum, jhNum, jihuo, qxjihuo, editName, editPhone, importData, exportNumPid } from '@/api/modules/kcard'

export default {
  name: 'CardNumberList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      loading: false,
      submitLoading: false,
      pid: null,

      searchForm: {
        search_key: 'num',
        search_val: '',
        px_key: 'id',
        px_val: 'desc',
        state: 'status'
      },

      kaceInfo: {},
      statistics: { shuliang: 0, ybd: 0, wbd: 0 },
      kaceList: [],

      multipleSelection: [],
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 弹窗
      dialogVisible: false,
      dialogTitle: '查看卡号',
      isEditMode: false,
      editForm: { id: null, num: '', pass: '', name: '', phone: '', state: 1, pid: null }
    }
  },

  computed: {
    currentKaceName() {
      if (!this.editForm.pid) return ''
      const kace = this.kaceList.find(item => item.id === this.editForm.pid)
      return kace ? `${kace.company} - ${kace.sale}` : ''
    }
  },

  mounted() {

    this.pid = this.$route.params.id
    if (this.pid) this.getNumList()
  },

  methods: {

    async handleExport() {
      // 如果有选中的卡，询问是否按选中导出
      if (this.multipleSelection.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.multipleSelection.length} 条卡号，是否按选中ID导出`,
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
          await this.doExport({
            ids: this.multipleSelection.map(item => item.id).join(',')
          })
        } catch (action) {
          if (action === 'cancel') {
            // 按搜索条件导出
            await this.doExport()
          }
          // action === 'close' 则直接关闭，不做任何操作
        }
      } else {
        // 没有选中，按搜索条件导出
        this.$confirm('确认按当前搜索条件导出所有卡号信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(async () => {
          await this.doExport()
        }).catch(() => { })
      }
    },

    // 实际导出逻辑
    async doExport(extraParams = {}) {
      // 构建业务参数，必须传 pid
      const businessParams = {
        pid: this.pid,
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
        // 状态
        if (this.searchForm.state && this.searchForm.state !== 'status') {
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
        const { exportNumPid } = await import('@/api/modules/kcard')
        const res = await exportNumPid(businessParams)

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

            // 设置列宽
            ws['!cols'] = header.map((h) => {
              if (h === '卡号' || h === '兑换订单号') return { wch: 28 }
              if (h === '密码') return { wch: 12 }
              if (h === '姓名' || h === '手机号') return { wch: 16 }
              if (h === '状态') return { wch: 10 }
              return { wch: 10 }
            })

            XLSX.utils.book_append_sheet(wb, ws, '卡号列表')
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

    // ============ 导入相关方法 ============

    // 下载导入模板
    handleDownloadTemplate() {
      const templateUrl = 'https://sc.bjyxfl.com/Public/file/phone.xls'
      const link = document.createElement('a')
      link.href = templateUrl
      link.download = 'phone.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.$message.success('模板下载中...')
    },

    // 触发文件选择
    handleImportPhone() {
      this.$refs.fileInput.click()
    },

    // 文件选择变化
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      const validExtensions = ['.xls', '.xlsx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

      if (!validExtensions.includes(fileExtension)) {
        this.$message.error('请上传 .xls 或 .xlsx 格式的文件')
        this.$refs.fileInput.value = ''
        return
      }

      this.$confirm('确认导入该文件中的手机号数据吗？', '导入确认', {
        confirmButtonText: '确定导入',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.processImportFile(file)
      }).catch(() => {
        this.$refs.fileInput.value = ''
      })
    },

    // 处理导入文件
    async processImportFile(file) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        // 读取文件
        const data = await this.readExcelFile(file)

        if (!data || data.length === 0) {
          this.$message.warning('文件中没有数据')
          loading.close()
          this.$refs.fileInput.value = ''
          return
        }

        // 调用导入接口
        const { importData } = await import('@/api/modules/kcard')
        const res = await importData({ data: JSON.stringify(data) })

        loading.close()

        if (res.status === 200 || res.code === 200) {
          const count = res.count || 0
          this.$message.success(`导入成功，共导入 ${count} 条数据`)
          this.getNumList() // 刷新列表
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

    // 读取 Excel 文件
    readExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })

            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            // 转换为 JSON 格式
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            if (jsonData.length <= 1) {
              resolve([])
              return
            }

            // 获取表头（第一行）
            const headers = jsonData[0]

            // 将数据转换为接口需要的格式
            const result = []
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i]
              if (!row || row.length === 0) continue

              const item = {}
              headers.forEach((header, index) => {
                if (header && row[index] !== undefined && row[index] !== null && row[index] !== '') {
                  item[header] = String(row[index]).trim()
                }
              })

              // 只有包含卡号和手机号的行才导入
              if (Object.keys(item).length > 0) {
                result.push(item)
              }
            }

            resolve(result)
          } catch (error) {
            reject(new Error('文件解析失败：' + error.message))
          }
        }

        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }

        reader.readAsArrayBuffer(file)
      })
    },
    async getNumList() {
      this.loading = true
      try {
        const params = {
          pid: this.pid,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          state: this.searchForm.state,
          page: this.currentPage,
          limit: this.pageSize
        }
        Object.keys(params).forEach(k => { if (params[k] === '' || params[k] === null) delete params[k] })

        const res = await numList(params)
        if (res.code === 200) {
          this.kaceInfo = res.data.kace || {}
          this.statistics = { shuliang: res.data.shuliang || 0, ybd: res.data.ybd || 0, wbd: res.data.wbd || 0 }
          this.tableData = (res.data.list?.data || []).map(item => ({
            ...item, _oldName: item.name || '',   // 保存原始值用于对比
            _oldPhone: item.phone || '', isEditName: false, isEditPhone: false, editName: item.name || '', editPhone: item.phone || ''
          }))
          this.total = res.data.list?.total || 0
        } else this.$message.error(res.msg || '获取列表失败')
      } catch (e) { this.$message.error('请求失败') } finally { this.loading = false }
    },

    handleSearch() { this.currentPage = 1; this.getNumList() },

    // 行内编辑姓名
    startEditName(row) { row.editName = row.name || ''; row.isEditName = true },
    async saveName(row) {
      const v = row.name?.trim() || ''
      if (v === row._oldName) return  // 值没变，不请求
      try {
        const formData = new FormData()
        formData.append('id', String(row.id))
        formData.append('name', v)

        const res = await editName(formData)
        if (res.code === 200) {
          row._oldName = v
          this.$message.success('修改成功')
        } else {
          row.name = row._oldName || ''  // 恢复原值
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        row.name = row._oldName || ''
        this.$message.error('修改失败')
      }
    },

    // 行内编辑手机号
    startEditPhone(row) { row.editPhone = row.phone || ''; row.isEditPhone = true },
    // 行内编辑手机号
    async savePhone(row) {
      const v = row.phone?.trim() || ''
      if (v === row._oldPhone) return
      try {
        const formData = new FormData()
        formData.append('id', String(row.id))
        formData.append('phone', v)

        const res = await editPhone(formData)
        if (res.code === 200) {
          row._oldPhone = v
          this.$message.success('修改成功')
        } else {
          row.phone = row._oldPhone || ''
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        row.phone = row._oldPhone || ''
        this.$message.error('修改失败')
      }
    },

    // 切换激活状态（单个）
    // 切换激活状态（单个）
    // async toggleState(row) {
    //   // ✅ state === 3 不允许操作
    //   if (row.state === 3) {
    //     this.$message.warning('已兑换的卡不能修改状态')
    //     return
    //   }

    //   const action = row.state === 2 ? '取消激活' : '激活'

    //   try {
    //     await this.$confirm(`确认${action}该卡号吗？`, '提示', { type: 'warning' })

    //     const res = await jhNum({ id: row.id.toString() })
    //     if (res.code === 200) {
    //       row.state = res.data.state
    //       this.$message.success('状态修改成功')
    //     } else {
    //       this.$message.error(res.msg || '操作失败')
    //     }
    //   } catch (e) {
    //     if (e !== 'cancel') this.$message.error('操作失败')
    //   }
    // },
    // 切换激活状态（单个，带确认框和防抖）
    async toggleState(row) {
      // state === 3 不允许操作
      if (row.state === 3) {
        this.$message.warning('已兑换的卡不能修改状态')
        return
      }

      const targetStatus = row.state === 2 ? 2 : 1
      const actionText = targetStatus === 2 ? '激活' : '取消激活'

      try {
        await this.$confirm(`确认${actionText}该卡号吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，不执行任何操作
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await jhNum({ id: row.id.toString() })
        if (res.code === 200) {
          row.state = res.data.state
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getNumList()
        }
      } catch (error) {
        console.error('切换激活状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getNumList()
      } finally {
        this.statusChanging = false
      }
    },
    // 批量激活/取消激活
    // async batchActivate(state) {
    //   if (this.multipleSelection.length === 0) { this.$message.warning('请先选择卡号'); return }
    //   const ids = this.multipleSelection.map(i => i.id).join(',')
    //   const text = state === 2 ? '激活' : '取消激活'
    //   this.$confirm(`确认${text}选中的${this.multipleSelection.length}条数据吗？`, '提示', { type: 'warning' }).then(async () => {
    //     try {
    //       const res = state === 2 ? await jihuo({ ids }) : await qxjihuo({ ids })
    //       if (res.code === 200) { this.$message.success(res.msg || `${text}成功`); this.getNumList() }
    //       else this.$message.error(res.msg || `${text}失败`)
    //     } catch (e) { this.$message.error(`${text}失败`) }
    //   }).catch(() => { })
    // },
    // 批量激活/取消激活
    async batchActivate(state) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择卡号')
        return
      }

      // 检查是否有已兑换的卡（状态为3）
      const hasUsed = this.multipleSelection.some(item => item.state === 3)
      if (hasUsed) {
        this.$message.warning('已兑换的卡不能修改状态，请取消选择已兑换的卡')
        return
      }

      const text = state === 2 ? '激活' : '取消激活'

      // 激活时检查是否已激活，取消激活时检查是否未激活
      if (state === 2) {
        const hasActivated = this.multipleSelection.some(item => item.state === 2)
        if (hasActivated) {
          this.$message.warning('已激活的卡无需再次激活，请取消选择已激活的卡')
          return
        }
      } else {
        const hasNotActivated = this.multipleSelection.some(item => item.state === 1)
        if (hasNotActivated) {
          this.$message.warning('未激活的卡无需取消激活，请取消选择未激活的卡')
          return
        }
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      try {
        await this.$confirm(`确认${text}选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const loading = this.$loading({
          lock: true,
          text: `正在${text}中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        const res = state === 2 ? await jihuo({ ids }) : await qxjihuo({ ids })
        loading.close()

        if (res.code === 200) {
          this.$message.success(res.msg || `${text}成功`)
          this.$refs.multipleTable.clearSelection()
          this.getNumList()
        } else {
          this.$message.error(res.msg || `${text}失败`)
        }
      } catch (e) {
        if (e !== 'cancel') {
          console.error(`批量${text}失败:`, e)
          const errorMsg = e?.response?.data?.msg || e?.message || `${text}失败，请稍后重试`
          this.$message.error(errorMsg)
        }
      }
    },

    // 查看
    async handleView(row) {
      this.dialogTitle = '查看卡号'
      this.isEditMode = false
      try {
        const res = await getNum({ id: row.id.toString() })
        if (res.code === 200) {
          this.editForm = {
            id: res.data.num.id,
            num: res.data.num.num,
            pass: res.data.num.pass,
            name: res.data.num.name || '',
            phone: res.data.num.phone || '',
            state: res.data.num.state,
            pid: res.data.num.pid
          }
          this.kaceList = res.data.kace_list || []
          this.dialogVisible = true
        } else this.$message.error(res.msg || '获取详情失败')
      } catch (e) { this.$message.error('获取详情失败') }
    },

    // 编辑
    async handleEdit(row) {
      this.dialogTitle = '修改卡号'
      this.isEditMode = true
      try {
        const res = await getNum({ id: row.id.toString() })
        if (res.code === 200) {
          this.editForm = {
            id: res.data.num.id,
            num: res.data.num.num,
            pass: res.data.num.pass,
            name: res.data.num.name || '',
            phone: res.data.num.phone || '',
            state: res.data.num.state,
            pid: res.data.num.pid
          }
          this.kaceList = res.data.kace_list || []
          this.dialogVisible = true
        } else this.$message.error(res.msg || '获取详情失败')
      } catch (e) { this.$message.error('获取详情失败') }
    },

    // 提交修改
    async submitEdit() {
      this.submitLoading = true
      try {
        const params = {
          id: this.editForm.id,
          name: this.editForm.name,
          phone: this.editForm.phone,
          state: this.editForm.state,
          pid: this.editForm.pid
        }
        const res = await editNum(params)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          this.dialogVisible = false
          this.getNumList()
        } else this.$message.error(res.msg || '修改失败')
      } catch (e) { this.$message.error('修改失败') } finally { this.submitLoading = false }
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`确认删除卡号${row.num}吗？`, '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delNum({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            if (this.tableData.length === 1 && this.currentPage > 1) this.currentPage--
            this.getNumList()
          } else this.$message.error(res.msg || '删除失败')
        } catch (e) { this.$message.error('删除失败') }
      }).catch(() => { })
    },

    // batchDelete() {
    //   const ids = this.multipleSelection.map(i => i.id).join(',')
    //   this.$confirm(`确认删除选中的${this.multipleSelection.length}条数据吗？`, '提示', { type: 'warning' }).then(async () => {
    //     try {
    //       const res = await delNum({ ids })
    //       if (res.code === 200) { this.$message.success(res.msg || '删除成功'); this.getNumList() }
    //       else this.$message.error(res.msg || '删除失败')
    //     } catch (e) { this.$message.error('删除失败') }
    //   }).catch(() => { })
    // },

    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择卡号')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条数据吗？此操作不可恢复！`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: '正在删除中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        try {
          const res = await delNum({ ids })
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.$refs.multipleTable.clearSelection()
            this.getNumList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (e) {
          loading.close()
          console.error('批量删除失败:', e)
          const errorMsg = e?.response?.data?.msg || e?.message || '删除失败，请稍后重试'
          this.$message.error(errorMsg)
        }
      }).catch(() => { })
    },

    getStateClass(state) { return { 1: 'state-default', 2: 'state-active', 3: 'state-used' }[state] || '' },
    getStateText(state) { return { 1: '未激活', 2: '已激活', 3: '已兑换' }[state] || '未知' },

    handleSelectionChange(v) { this.multipleSelection = v },
    handleSizeChange(v) { this.pageSize = v; this.currentPage = 1; this.getNumList() },
    handleCurrentChange(v) { this.currentPage = v; this.getNumList() }
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

.cardbookNum .search-card.pb0 .el-card__body {
  padding-bottom: 0;
}
</style>

<style lang="scss" scoped>
.cardbookNum {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
  }

  .kace-info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f7fa;
    padding: 12px 16px;
    margin-bottom: 15px;
    border-radius: 4px;
    flex-wrap: wrap;
    gap: 10px;

    .stat-divider {
      color: #dcdfe6;
      margin: 0 8px;
    }

    .text-success {
      color: #67c23a;
    }

    .text-danger {
      color: #f56c6c;
    }

    .template-tag {
      color: #ff0000;
      font-weight: bold;
    }

    .ml10 {
      margin-left: 10px;
    }
  }

  .action-bar {
    margin-bottom: 15px;
    text-align: left;
  }

  .editable-cell {
    cursor: pointer;
    padding: 2px 5px;
    border-radius: 2px;
    min-width: 60px;
    display: inline-block;

    &:hover {
      background: #f0f2f5;
    }
  }

  .state-tag {
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    transition: .3s;

    &.state-default {
      background: #f4f4f5;
      color: #909399;
      border: 1px solid #e9e9eb;
    }

    &.state-active {
      background: #f0f9eb;
      color: #67c23a;
      border: 1px solid #c2e7b0;
    }

    &.state-used {
      //  background: #fdf6ec;
      color: #e6a23c;
      //  border: 1px solid #f5dab1;

      cursor: not-allowed; // ✅ 改成 not-allowed
      pointer-events: none; // ✅ 禁止点击事件
    }

    &:hover:not(.state-used) {
      transform: scale(1.05);
    }
  }

  :deep(.el-table) {
    .el-table__body-wrapper td {
      font-weight: normal !important;

      .cell {
        font-weight: normal !important;
      }
    }
  }
}
</style>
