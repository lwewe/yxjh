<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="券号" value="num"></el-option>
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
            <el-option label="升序" value="asc"></el-option>
            <el-option label="降序" value="desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
           <el-input v-model="exportNum" placeholder="导出数量" class="w120"></el-input>
          <el-button type="success"  style="margin-left: 10px;" icon="el-icon-top-right" @click="handleExport()">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 生成券弹窗 -->
    <el-dialog title="生成券" :visible.sync="addQuanDialogVisible" width="500px">
      <el-form :model="addQuanForm" label-width="120px" style="width: 90%;text-align: left;">
        <el-form-item label="生成数量">
          <el-input-number v-model="addQuanForm.number" :min="1" :max="10000"></el-input-number>
          <span style="margin-left:10px;">张</span>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block;text-align: center;">
        <el-button @click="addQuanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddQuan">确定生成</el-button>
      </span>
    </el-dialog>

    <!-- 批量分配到权益券弹窗 -->
    <el-dialog title="批量分配到权益券" :visible.sync="assignDialogVisible" width="50%">
      <el-form :model="assignForm" label-width="120px" style="width: 90%;text-align: left;">
        <el-form-item label="分配方式">
          <el-radio-group v-model="assignForm.flag">
            <el-radio label="1">按ID范围</el-radio>
            <el-radio label="2">按选中ID</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始ID" v-if="assignForm.flag === '1'">
          <el-input v-model="assignForm.start_id" placeholder="请输入开始ID"></el-input>
        </el-form-item>
        <el-form-item label="结束ID" v-if="assignForm.flag === '1'">
          <el-input v-model="assignForm.end_id" placeholder="请输入结束ID"></el-input>
        </el-form-item>
        <el-form-item label="选择权益券">
          <el-select v-model="assignForm.gid" placeholder="请选择权益券" filterable style="width: 100%;">
            <el-option v-for="item in quanQyqOptions" :key="item.id"
              :label="item.company + ' - ' + item.sale + ' (数量:' + (item.geshu || '0') + ')'" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单次数">
          <el-input v-model="assignForm.cishu" placeholder="请输入下单次数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block;text-align: center;">
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确定分配</el-button>
      </span>
    </el-dialog>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;display: flex;justify-content: space-between;">
        <div>
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="delOptions()">批量删除</el-button>
          <el-button type="primary" size="small" @click="openAddQuanDialog">生成券</el-button>
          <el-button type="primary" size="small" @click="openAssignDialog">批量分配到权益券</el-button>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="39">
        </el-table-column>
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="券号"   align="center">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column label="密码" align="center">
          <template slot-scope="scope">
            {{ scope.row.pass }}
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination" style="text-align: right; margin-top: 20px;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage"  
          :page-sizes="[10, 20, 30, 50]"   
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { quanList, addQuan, delQuan, quanExport, quanQyqList, quanBatchPid } from '@/api/modules/exchange'

export default {
  name: 'QuanManage',
  data() {
    return {  exportNum: '',  // 导出数量
      loading: false,
      // 生成券弹层
      addQuanDialogVisible: false,
      addQuanForm: {
        number: 1
      },
      // 批量分配弹层
      assignDialogVisible: false,
      assignForm: {
        flag: '1',
        gid: '',
        cishu: '',
        start_id: '',
        end_id: '',
        ids: ''
      },
      quanQyqOptions: [],
      // 搜索表单
      searchForm: {
        search_key: 'num',
        search_val: '',
        px_key: 'id',
        px_val: 'desc'
      },
      // 分页
      currentPage: 1,
      pageSize: 30,
      total: 0,
      // 表格
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
      async handleExport() {
    // 如果有选中的券，询问是否按选中导出
    if (this.multipleSelection.length > 0) {
      try {
        await this.$confirm(
          `您已选中 ${this.multipleSelection.length} 条券信息，是否按选中ID导出？`,
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
      this.$confirm('确认按当前搜索条件导出所有券信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        await this.doExport()
      }).catch(() => {})
    }
  },

  // 实际导出逻辑
  async doExport(extraParams = {}) {
    // 构建业务参数
    const businessParams = { ...extraParams }

    // 如果有导出数量限制（优先级2：shuliang）
    if (this.exportNum && !businessParams.ids) {
      businessParams.shuliang = this.exportNum
    }

    // 如果没有传 ids 且没有 shuliang，则使用搜索条件
    if (!businessParams.ids && !businessParams.shuliang) {
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
    }

    try {
      const loading = this.$loading({
        lock: true,
        text: '正在导出数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // 调用权益券导出接口
      const { quanExport } = await import('@/api/modules/exchange')
      const res = await quanExport(businessParams)

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
            if (h === '券号' || h === '二维码内容') return { wch: 30 }
            if (h === '密码') return { wch: 15 }
            return { wch: 12 }
          })

          XLSX.utils.book_append_sheet(wb, ws, '权益券列表')
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
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>权益券列表</x:Name>
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
    // 获取权益券列表
    async getQuanQyqList() {
      try {
        const res = await quanQyqList()
        if (res.code === 200) {
          this.quanQyqOptions = res.data
        }
      } catch (error) {
        this.$message.error('获取权益券列表失败')
      }
    },

    // 打开批量分配弹窗
    openAssignDialog() {
      const hasSelection = this.multipleSelection.length > 0

      this.assignForm = {
        flag: hasSelection ? '2' : '1',
        gid: '',
        cishu: '',
        start_id: '',
        end_id: '',
        ids: hasSelection ? this.multipleSelection.map(item => item.id).join(',') : ''
      }

      this.getQuanQyqList()
      this.assignDialogVisible = true
    },

    // 确认批量分配
    async confirmAssign() {
      if (!this.assignForm.gid) {
        this.$message.warning('请选择权益券')
        return
      }
      if (!this.assignForm.cishu) {
        this.$message.warning('请输入下单次数')
        return
      }

      if (this.assignForm.flag === '1') {
        if (!this.assignForm.start_id || !this.assignForm.end_id) {
          this.$message.warning('请输入开始ID和结束ID')
          return
        }
      } else {
        if (!this.assignForm.ids) {
          this.$message.warning('请先在表格中勾选要分配的券，或切换到"按ID范围"模式')
          return
        }
      }

      const params = {
        gid: this.assignForm.gid,
        cishu: this.assignForm.cishu,
        flag: this.assignForm.flag
      }
      if (this.assignForm.flag === '1') {
        params.start_id = this.assignForm.start_id
        params.end_id = this.assignForm.end_id
      } else {
        params.ids = this.assignForm.ids
      }

      try {
        const res = await quanBatchPid(params)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.assignDialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '分配失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      }
    },

    // 获取列表数据
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
        const res = await quanList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.current_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    // 查询
    handleSearch() {
      this.currentPage = 1
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    // 表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 打开生成券弹窗
    openAddQuanDialog() {
      this.addQuanForm = { number: 1 }
      this.addQuanDialogVisible = true
    },

    // 确认生成券
    async confirmAddQuan() {
      if (!this.addQuanForm.number || this.addQuanForm.number < 1) {
        this.$message.warning('请输入有效数量')
        return
      }
      try {
        const res = await addQuan({ number: this.addQuanForm.number })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.addQuanDialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '生成失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      }
    },

    // 批量删除
    delOptions() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的券')
        return
      }
      this.$confirm('确定删除选中的券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        try {
          const res = await delQuan({ ids })
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

    // 单个删除
    handleDelete(index, row) {
      this.$confirm('确认删除该券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delQuan({ ids: row.id.toString() })
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

    // 导出
   
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
.list-container {
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