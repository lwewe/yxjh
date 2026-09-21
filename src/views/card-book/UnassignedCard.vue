<template>
  <div class="list-container">
    <!-- 搜索表单 -->
    <el-card class="search-card serchForm">
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
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="exportCount" placeholder="导出数量" class="w120"></el-input>
          <el-button type="success" style="height: 36px;margin-left: 10px;" icon="el-icon-top-right"
            @click="handleExport()">导出</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- 表格卡片 -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;display: flex;justify-content: space-between;">
        <div>
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1"
            @click="delOptions()">批量删除</el-button>
          <el-button type="primary" size="small" @click="showAddCardDialog()">生成卡册</el-button>
          <el-button type="primary" size="small" @click="showBatchDialog()">批量分配到卡册</el-button>

        </div>

      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="卡号" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column label="密码" align="center">
          <template slot-scope="scope">
            {{ scope.row.pass }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="150">
          <template slot-scope="scope">

            <el-input v-model="scope.row.editName" size="small" style="width: 100px;" @blur="saveName(scope.row)"
              @keyup.enter.native="saveName(scope.row)"></el-input>

          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" width="150">
          <template slot-scope="scope">

            <el-input v-model="scope.row.editPhone" size="small" style="width: 100px;" @blur="savePhone(scope.row)"
              @keyup.enter.native="savePhone(scope.row)"></el-input>

          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px; text-align: right;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>


    <!-- 生成福利卡弹窗 -->
    <el-dialog title="生成卡册" :visible.sync="addCardDialogVisible" width="600px" :close-on-click-modal="false">
      <el-form :model="addCardForm" label-width="100px" style='width: 90%;'>
        <el-form-item label="生成数量">
          <!-- <el-input v-model="addCardForm.number" placeholder="请输入生成数量" type="number" :min="1"></el-input> -->
          <el-input-number v-model="addCardForm.number" :min="1" :max="10000"></el-input-number>
          <span style="margin-left:10px;">张</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="addCardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCard()" :loading="addCardLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量分配卡册弹窗 -->
    <el-dialog title="批量分配到卡册" :visible.sync="batchDialogVisible" width="50%" :close-on-click-modal="false">
      <el-form :model="batchForm" label-width="100px" style="width: 90%;text-align: left;">
        <el-form-item label="选择卡册">
          <el-select v-model="batchForm.gid" placeholder="请选择卡册" style="width: 100%;" filterable clearable>
            <el-option v-for="item in cardAlbumList" :key="item.id"
              :label="`${item.company} - ${item.sale} (${item.geshu}张)`" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配方式">
          <el-radio-group v-model="batchForm.flag">
            <el-radio label="1">按ID范围</el-radio>
            <el-radio label="2">按选中项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始ID" v-if="batchForm.flag === '1'">
          <el-input v-model="batchForm.start_id" placeholder="请输入开始ID"></el-input>
        </el-form-item>
        <el-form-item label="结束ID" v-if="batchForm.flag === '1'">
          <el-input v-model="batchForm.end_id" placeholder="请输入结束ID"></el-input>
        </el-form-item>
        <!-- <el-form-item label="已选中" v-if="batchForm.flag === '2'">
          <el-tag 
            v-for="item in multipleSelection" 
            :key="item.id" 
            style="margin-right: 5px; margin-bottom: 5px;"
            closable
            @close="removeSelection(item)"
          >
            {{ item.num }} (ID:{{ item.id }})
          </el-tag>
          <span v-if="multipleSelection.length === 0" style="color: #999;">暂无选中项，请先勾选表格数据</span>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="batchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBatch()" :loading="batchLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import {
  kaList,
  addKa,
  delKa,
  editName,
  editPhone,
  cardList,
  kaBatchPid, kaExport
} from '@/api/modules/kcard'

export default {
  name: 'KaCardList',
  data() {
    return {
      loading: false,
      // 搜索表单
      searchForm: {
        search_key: 'num',
        search_val: '',
        px_key: 'id',
        px_val: 'desc'
      },
      exportCount: '',
      startId: '',
      endId: '',
      price: '',

      // 表格数据
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 30,
      total: 0,

      // 生成卡弹窗
      addCardDialogVisible: false,
      addCardLoading: false,
      addCardForm: {
        number: ''
      },

      // 批量分配弹窗
      batchDialogVisible: false,
      batchLoading: false,
      batchType: '1',
      batchForm: {
        gid: '',
        flag: '1',
        start_id: '',
        end_id: '',
        ids: ''
      },
      cardAlbumList: [] // 卡册列表
    }
  },
  mounted() {
    this.getKaList()
    this.getCardAlbumList()
  },
  methods: {
    // ========== 获取卡号列表 ==========
    async getKaList() {
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
        const res = await kaList(params)
        if (res.code === 200) {
          // 为每行数据添加编辑状态
          this.tableData = res.data.data.map(item => ({
            ...item,
            isEditName: false,
            isEditPhone: false,
            editName: item.name || '',
            editPhone: item.phone || ''
          }))
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // ========== 获取卡册列表 ==========
    async getCardAlbumList() {
      try {
        const res = await cardList()
        if (res.code === 200) {
          this.cardAlbumList = res.data || []
        }
      } catch (error) {
        console.error('获取卡册列表失败', error)
      }
    },

    // ========== 搜索 ==========
    handleSearch() {
      this.currentPage = 1
      this.getKaList()
    },

    // ========== 导出 ==========
    // ============ 导出相关方法 ============

    // 导出 - 触发确认
    async handleExport() {
      // 如果有选中的卡，询问是否按选中导出
      if (this.multipleSelection.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.multipleSelection.length} 张卡，是否按选中ID导出？`,
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
        this.$confirm('确认按当前搜索条件导出所有卡信息吗？', '提示', {
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
      // 构建业务参数
      const businessParams = { ...extraParams }

      // 如果有导出数量限制（优先级2：shuliang）
      if (this.exportCount && !businessParams.ids) {
        businessParams.shuliang = this.exportCount
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

        // 动态导入导出接口
        const { kaExport } = await import('@/api/modules/kcard')
        const res = await kaExport(businessParams)

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
              if (h === '卡号' || h === '二维码内容') return { wch: 30 }
              if (h === '密码') return { wch: 15 }
              return { wch: 12 }
            })

            XLSX.utils.book_append_sheet(wb, ws, '福利卡列表')
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
              <x:Name>福利卡列表</x:Name>
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

    // ========== 修改价格 ==========
    editPrice() {
      if (!this.startId || !this.endId || !this.price) {
        this.$message.warning('请填写完整信息')
        return
      }
      this.$confirm('确定修改价格吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 调用修改价格接口
        this.$message.success('修改成功')
      }).catch(() => { })
    },

    // ========== 生成福利卡弹窗 ==========
    showAddCardDialog() {
      this.addCardForm.number = ''
      this.addCardDialogVisible = true
    },

    // 提交生成
    async submitAddCard() {
      if (!this.addCardForm.number || this.addCardForm.number < 1) {
        this.$message.warning('请输入正确的生成数量')
        return
      }

      this.$confirm(`确认生成 ${this.addCardForm.number} 张福利卡吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.addCardLoading = true
        try {
          const res = await addKa({ number: this.addCardForm.number })
          if (res.code === 200) {
            this.$message.success(res.msg || '生成成功')
            this.addCardDialogVisible = false
            this.getKaList()
          } else {
            this.$message.error(res.msg || '生成失败')
          }
        } catch (error) {
          this.$message.error('生成失败')
          console.error(error)
        } finally {
          this.addCardLoading = false
        }
      }).catch(() => { })
    },

    // ========== 批量分配卡册弹窗 ==========
    showBatchDialog() {
      if (this.cardAlbumList.length === 0) {
        this.getCardAlbumList()
      }
      this.batchForm = {
        gid: '',
        flag: '1',
        start_id: '',
        end_id: '',
        ids: ''
      }
      this.batchDialogVisible = true
    },

    // 移除选中项
    removeSelection(item) {
      this.multipleSelection = this.multipleSelection.filter(i => i.id !== item.id)
      this.$refs.multipleTable.toggleRowSelection(item, false)
    },

    // 提交分配
    async submitBatch() {
      // 验证
      if (!this.batchForm.gid) {
        this.$message.warning('请选择卡册')
        return
      }

      if (this.batchForm.flag === '1') {
        if (!this.batchForm.start_id || !this.batchForm.end_id) {
          this.$message.warning('请填写开始ID和结束ID')
          return
        }
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择要分配的卡号')
          return
        }
        this.batchForm.ids = this.multipleSelection.map(item => item.id).join(',')
      }

      this.$confirm('确定将卡号分配到所选卡册吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.batchLoading = true
        try {
          const params = {
            gid: this.batchForm.gid,
            flag: this.batchForm.flag
          }
          if (this.batchForm.flag === '1') {
            params.start_id = this.batchForm.start_id
            params.end_id = this.batchForm.end_id
          } else {
            params.ids = this.batchForm.ids
          }

          const res = await kaBatchPid(params)
          if (res.code === 200) {
            this.$message.success(res.msg || '分配成功')
            this.batchDialogVisible = false
            this.getKaList()
          } else {
            this.$message.error(res.msg || '分配失败')
          }
        } catch (error) {
          this.$message.error('分配失败')
          console.error(error)
        } finally {
          this.batchLoading = false
        }
      }).catch(() => { })
    },

    // ========== 编辑姓名 ==========
    editNameClick(row) {
      row.editName = row.name || ''
      row.isEditName = true
      this.$nextTick(() => {
        // 自动聚焦到输入框
        const inputs = document.querySelectorAll('.el-input__inner')
        inputs[inputs.length - 2]?.focus()
      })
    },

    async saveName(row) {
      const newName = row.editName?.trim()
      if (newName === row.name) {
        row.isEditName = false
        return
      }

      try {
        const res = await editName({ id: row.id, name: newName })
        if (res.code === 200) {
          row.name = newName
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (error) {
        this.$message.error('修改失败')
        console.error(error)
      } finally {
        row.isEditName = false
      }
    },

    // ========== 编辑手机号 ==========
    editPhoneClick(row) {
      row.editPhone = row.phone || ''
      row.isEditPhone = true
    },

    async savePhone(row) {
      const newPhone = row.editPhone?.trim()
      if (newPhone === row.phone) {
        row.isEditPhone = false
        return
      }

      try {
        const res = await editPhone({ id: row.id, phone: newPhone })
        if (res.code === 200) {
          row.phone = newPhone
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (error) {
        this.$message.error('修改失败')
        console.error(error)
      } finally {
        row.isEditPhone = false
      }
    },

    // ========== 批量删除 ==========
    delOptions() {
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确定删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKa({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getKaList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
          console.error(error)
        }
      }).catch(() => { })
    },

    // ========== 单个删除 ==========
    handleDelete(index, row) {
      this.$confirm(`确认删除卡号 ${row.num} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKa({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getKaList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
          console.error(error)
        }
      }).catch(() => { })
    },

    // ========== 表格选择 ==========
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // ========== 分页 ==========
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getKaList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getKaList()
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