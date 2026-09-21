<template>
  <div class="num-list-container">
    <!-- 面包屑导航 -->
  

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <div class="search-form">
        <div class="search-row">
       
          <el-select v-model="searchForm.search_key" class="w120" clearable>
            <el-option label="卡号" value="num"></el-option>
            <el-option label="密码" value="pass"></el-option>
            <el-option label="编号" value="id"></el-option>
            <el-option label="用户ID" value="uid"></el-option>
          </el-select>
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120" clearable></el-input>

          
          <el-select v-model="searchForm.px_key" class="w120" clearable>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="兑换时间" value="dh_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        
          <el-select v-model="searchForm.px_val" class="w120" clearable>
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>

          <el-select v-model="searchForm.sh" class="w120" clearable placeholder="发布状态">
            <el-option label="全部" value="status"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>

          <el-select v-model="searchForm.state" class="w120" clearable placeholder="领取状态">
            <el-option label="全部" value="status"></el-option>
            <el-option label="未领取" value="1"></el-option>
            <el-option label="已领取" value="0"></el-option>
          </el-select>

          <el-button type="primary" @click="handleSearch">查询</el-button>
          
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <div class="table-header">
        <div class="header-left">
          
          <el-button type="danger" size="small" @click="batchDelete" v-if="multipleSelection.length > 1">
            批量删除
          </el-button>
          <el-button type="primary"   icon="el-icon-plus"  size="small" @click="addNum">添加卡</el-button>
           <el-button type="success" size="small" icon="el-icon-download"  @click="downloadTemplate">导入格式</el-button>
        <el-button type="success" size="small" icon="el-icon-download" @click="importNum">导入电子券</el-button>
        </div>
        
      </div>

      <el-table 
        ref="multipleTable" 
        :data="tableData" 
        border 
        tooltip-effect="dark" 
        style="width: 100%"
        @selection-change="handleSelectionChange" 
        v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

        <el-table-column type="selection" width="50" align="center"></el-table-column>
        
        <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="卡号" min-width="200" align="left">
          <template slot-scope="scope">
            <div @click="handleEdit(scope.row)">
              {{ scope.row.num || '-' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="密码/链接" min-width="180" align="left">
          <template slot-scope="scope">
            {{ scope.row.pass || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="用户ID" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.uid || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column label="兑换时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.dh_time) }}
          </template>
        </el-table-column>

        <el-table-column label="发布状态" width="100" align="center">
          <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1"  active-text=" "  inactive-text=" "
                @change="(val) => updateStatus(scope.row, val)">
              </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="券状态" width="100" align="center">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.state === 0 ? '#ff0000' : '#00a65a' }">
              {{ scope.row.state === 0 ? '已领取' : '未领取' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right" align="left">
          <template slot-scope="scope">
            <!-- <el-link type="primary" @click="handleEdit(scope.row)" :underline="false">修改</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)" :underline="false" style="margin-left: 10px;">删除</el-link> -->

            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>


          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <!-- <span class="total-info">共 {{ pagination.total }} 条记录</span>
        <span class="page-info">{{ pagination.current_page }}/{{ pagination.last_page }} 页</span> -->
        <!-- <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pagination.current_page"
          :page-count="pagination.last_page"
          @current-change="handleCurrentChange"
          :hide-on-single-page="false"
        /> -->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.per_page"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
      </div>
    </el-card>

     

    <!-- 添加/编辑弹窗 -->
    <!-- 添加/编辑弹窗 -->
<el-dialog 
  :title="dialogTitle" 
  :visible.sync="dialogVisible" 
  width="50%" 
  @close="resetForm"
  :close-on-click-modal="false"
>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="numForm" 
    label-width="100px" 
    style="padding: 20px 30px;text-align: left;"
  >
    <!-- 卡号 -->
    <el-form-item label="卡号：" prop="num">
      <el-input 
        v-model="form.num" 
        placeholder="卡号" 
        class="input-width"
      ></el-input>
    </el-form-item>

    <!-- 密码/链接 -->
    <el-form-item label="密码/链接：" prop="pass">
      <el-input 
        v-model="form.pass" 
        placeholder="密码/链接" 
        class="input-width" style="width: 76%;margin-right: 10px;"
      ></el-input>
      <el-button 
        type="primary" 
       
        @click="openQrcode" 
        
        icon="el-icon-picture-outline"
      >
        二维码
      </el-button>
    </el-form-item>

    <!-- 券状态（仅修改时显示） -->
    <el-form-item label="券状态：" v-if="isEdit && form.stateInfo">
      <span :style="{ color: form.stateInfo.color }" >
        {{ form.stateInfo.text }}
      </span>
    </el-form-item>

    <!-- 兑换用户（仅修改时显示） -->
    <el-form-item label="兑换用户：" v-if="isEdit && form.uid">
      <span>{{ form.uid }}</span>
    </el-form-item>

    <!-- 兑换时间（仅修改时显示） -->
    <el-form-item label="兑换时间：" v-if="isEdit && form.dh_time_text">
      <span>{{ form.dh_time_text }}</span>
    </el-form-item>

    <!-- 是否发布 -->
    <el-form-item label="是否发布：" prop="sh">
      <el-radio-group v-model="form.sh">
        <el-radio :label="1">即时发布</el-radio>
        <el-radio :label="0">暂不发布</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 发布时间 -->
    <el-form-item label="发布时间：" prop="add_time">
      <el-date-picker
        v-model="form.add_time"
        type="datetime"
        placeholder="选择发布时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="'12:00:00'"
        style="width: 100%;"
      />
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
    <el-button @click="dialogVisible = false" size="medium">取消</el-button>
    <el-button 
      type="primary" 
      @click="submitForm" 
      :loading="submitting"
      size="medium"
    >
      保存
    </el-button>
  </span>
</el-dialog>

    <!-- 导入号码弹窗 -->
  
  </div>
</template>

<script>
import { GLOBAL_CONFIG } from '@/config/global'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { 
  numList, 
  addNum, 
  editNum, 
  getNum, 
  delNum, 
  fbNum, 
  // importNum 
} from '@/api/modules/zhichong'

export default {
  name: 'NumList',
  data() {
    return { statusChanging: false,  // 新增：防止重复提交
      loading: false,
      submitting: false,
      dialogVisible: false,
      importDialogVisible: false,
      dialogTitle: '添加卡',
      isEdit: false,
      currentPid: null,
      specTitle: '',
      fileList: [],
      
      // 搜索表单
      searchForm: {
        search_key: '',     // 搜索关键词key: num-卡号, pass-密码, id-编号, uid-用户ID
        search_val: '',     // 搜索关键词值
        px_key: 'add_time', // 排序字段: add_time-添加时间, dh_time-兑换时间, id-编号
        px_val: 'desc',     // 排序方式: desc-降序, asc-升序
        sh: 'status',             // 发布状态: 1-已发布, 0-未发布
        state: 'status'           // 领取状态: 1-未领取, 0-已领取
      },
      
      pagination: {
        current_page: 1,
        per_page: 20,
        total: 0,
        last_page: 1
      },
      
      tableData: [],
      multipleSelection: [],
      
      form: {
        id: undefined,
        num: '',
        pass: '',
        sh: 1,
        add_time: ''
      },
      
      rules: {
        num: [
          { required: true, message: '请输入卡号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isAllSelected() {
      return this.tableData.length > 0 && this.multipleSelection.length === this.tableData.length
    },
    isIndeterminate() {
      return this.multipleSelection.length > 0 && this.multipleSelection.length < this.tableData.length
    }
  },
  mounted() {
    // 从路由获取参数
    this.currentPid = this.$route.query.id
    this.specTitle = this.$route.query.title || '超市卡'
    
    if (!this.currentPid) {
      this.$message.error('缺少卡券规格参数')
      this.goBack()
    }
    this.getTableData()
  },
  methods: {
     handleSizeChange(val) {
      this.pagination.per_page = val
      this.getTableData()
    },
    downloadTemplate() {
  // 直接打开超市卡模板下载链接
  window.open('https://sc.bjyxfl.com/Public/qfile/kamoban.xls')
},
    // 获取表格数据
     async getTableData() {
  this.loading = true
  try {
    const params = {
      pid: this.currentPid,
      search_key: this.searchForm.search_key,
      search_val: this.searchForm.search_val,
      px_key: this.searchForm.px_key,
      px_val: this.searchForm.px_val,
      sh: this.searchForm.sh,
      state: this.searchForm.state,
      page: this.pagination.current_page,
      limit: this.pagination.per_page
    }
    
    const res = await numList(params)
    
    // 详细的调试信息
    console.log('=== 列表接口响应 ===')
    console.log('完整响应:', res)
    console.log('res.code:', res.code)
    console.log('res.data:', res.data)
    console.log('res.data类型:', typeof res.data)
    
    if (res.code === 200) {
      // 尝试多种可能的数据结构
      let dataList = []
      
      // 情况1: res.data.list.data (分页对象包含data数组)
      if (res.data?.list?.data) {
        dataList = res.data.list.data
        this.pagination.total = res.data.list.total || 0
        this.pagination.current_page = res.data.list.current_page || 1
        this.pagination.last_page = res.data.list.last_page || 1
        console.log('使用 res.data.list.data')
      }
      // 情况2: res.data.data (直接在data下有数组)
      else if (Array.isArray(res.data?.data)) {
        dataList = res.data.data
        this.pagination.total = res.data.total || dataList.length
        console.log('使用 res.data.data')
      }
      // 情况3: res.data 本身就是数组
      else if (Array.isArray(res.data)) {
        dataList = res.data
        this.pagination.total = dataList.length
        console.log('使用 res.data 数组')
      }
      // 情况4: res.data 对象中有其他属性
      else if (res.data && typeof res.data === 'object') {
        // 查找可能的数组属性
        const possibleArrays = Object.keys(res.data).filter(key => Array.isArray(res.data[key]))
        if (possibleArrays.length > 0) {
          dataList = res.data[possibleArrays[0]]
          console.log(`使用 res.data.${possibleArrays[0]}`)
        }
      }
      
      this.tableData = dataList
      console.log('最终表格数据:', this.tableData)
      
      // 获取规格标题
      if (res.data?.gueige?.title) {
        this.specTitle = res.data.gueige.title
      }
    } else {
      this.$message.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    this.$message.error('获取数据失败')
  } finally {
    this.loading = false
  }
},
    
    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.getTableData()
    },
    
    // 重置搜索
    resetSearch() {
      this.searchForm = {
        search_key: '',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: '',
        state: ''
      }
      this.pagination.current_page = 1
      this.getTableData()
    },
    
    // 分页
    handleCurrentChange(val) {
      this.pagination.current_page = val
      this.getTableData()
    },
    
    // 跳转到指定页
    goToPage(page) {
      this.pagination.current_page = page
      this.getTableData()
    },
    
    // 全选/取消全选
    toggleSelectAll(val) {
      if (val) {
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    
    // 设置默认发布时间
    setDefaultTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    
    // 添加号码
    addNum() {
      this.dialogTitle = '添加卡'
      this.isEdit = false
      this.form = {
        id: undefined,
        num: '',
        pass: '',
        sh: 1,
        add_time: this.setDefaultTime()
      }
      this.dialogVisible = true
    },
    
    // 编辑
   // 编辑
async handleEdit(row) {
  this.dialogTitle = '修改卡'
  this.isEdit = true
  try {
    const res = await getNum({ id: row.id, pid: this.currentPid })
    console.log('获取详情响应:', res) // 调试用
    
    if (res.code === 200) {
      // 根据实际返回结构，数据在 res.data.show 中
      const data = res.data.show || res.data
      
      // 处理券状态显示
      let stateInfo = null
      if (data.state !== undefined) {
        stateInfo = {
          text: data.state === 0 ? '已领取' : '未领取',
          color: data.state === 0 ? '#ff0000' : '#00a65a'
        }
      }
      
      this.form = {
        id: data.id,
        num: data.num || '',
        pass: data.pass || '',
        sh: data.sh !== undefined ? data.sh : 1,
        add_time: data.add_time ? this.formatDateTime(data.add_time) : this.setDefaultTime(),
        // 额外的显示信息
        stateInfo: stateInfo,
        uid: data.uid || '',
        dh_time_text: data.dh_time ? this.formatTime(data.dh_time) : ''
      }
      
      this.dialogVisible = true
    } else {
      this.$message.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    this.$message.error('获取详情失败')
  }
},
    // 提交表单
    // 提交表单
submitForm() {
  this.$refs.numForm.validate(async (valid) => {
    if (valid) {
      this.submitting = true
      try {
        const submitData = {
          pid: this.currentPid,
          num: this.form.num,
          pass: this.form.pass,
          sh: this.form.sh,
          add_time: this.form.add_time
        }
        
        // 如果是编辑，添加id
        if (this.isEdit) {
          submitData.id = this.form.id
        }
        
        const apiMethod = this.isEdit ? editNum : addNum
        const res = await apiMethod(submitData)
        
        if (res.code === 200) {
          this.$message.success(this.isEdit ? '修改成功' : '添加成功')
          this.dialogVisible = false
          this.getTableData()
        } else {
          this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
        }
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error(this.isEdit ? '修改失败' : '添加失败')
      } finally {
        this.submitting = false
      }
    }
  })
},
    // 重置表单
    resetForm() {
      this.$refs.numForm && this.$refs.numForm.resetFields()
    },
    
 // 切换发布状态（带确认框）
async updateStatus(row, newVal) {
  // newVal 是布尔值：true=开启(发布), false=关闭(下架)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将卡券${actionText}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    // 用户取消，不做任何操作
    return
  }
  
  if (this.statusChanging) return
  this.statusChanging = true

  try {
    const res = await fbNum({ id: row.id })
    if (res.code === 200) {
      this.$message.success(`${actionText}成功`)
      // 更新本地数据
      row.sh = targetStatus
    } else {
      this.$message.error(res.msg || `${actionText}失败`)
      // 恢复开关状态（通过视图更新）
      this.$forceUpdate()
    }
  } catch (error) {
    console.error('切换状态失败:', error)
    this.$message.error('网络错误，请稍后重试')
    this.$forceUpdate()
  } finally {
    this.statusChanging = false
  }
},
    
    // 批量发布
    async batchPublish() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要发布的数据')
        return
      }
      
      this.$confirm(`确定要发布选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const loading = this.$loading({ lock: true, text: '发布中...' })
        try {
          let successCount = 0
          let failCount = 0
          
          for (const item of this.multipleSelection) {
            try {
              const res = await fbNum({ id: item.id })
              if (res.code === 200) {
                successCount++
                item.sh = res.data.sh
              } else {
                failCount++
              }
            } catch (error) {
              failCount++
            }
          }
          
          loading.close()
          this.$message.success(`发布完成：成功${successCount}条，失败${failCount}条`)
          this.getTableData()
        } catch (error) {
          loading.close()
          this.$message.error('批量发布失败')
        }
      }).catch(() => {})
    },
    
    // 删除单个
    handleDelete(row) {
      this.$confirm('您确定要将它删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNum({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getTableData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.multipleSelection.map(item => item.id).join(',')
          const res = await delNum({ ids: ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getTableData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    
    // 打开二维码页面
    openQrcode() {
      window.open('/admin.php/kaquan/upload', '_blank')
    },
    
   
   // 导入号码 - 触发文件选择
importNum() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx, .xls'
  input.onchange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      this.$message.error('请上传 Excel 文件（.xlsx 或 .xls）')
      return
    }

    try {
      const data = await this.parseExcelFile(file)

      if (!data || data.length === 0) {
        this.$message.warning('文件中没有有效数据')
        return
      }

      this.$confirm(
        `共解析到 ${data.length} 条数据，确认导入吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        await this.submitImport(data)
      }).catch(() => {})

    } catch (error) {
      console.error('解析文件失败:', error)
      this.$message.error(error.message || '解析文件失败，请检查文件格式')
    }
  }
  input.click()
},

// 解析Excel文件
parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })

        if (!jsonData || jsonData.length < 2) {
          reject(new Error('文件数据为空'))
          return
        }

        const headers = jsonData[0].map(h => String(h || '').trim())

        let cardNoIndex = -1    // 卡号
        let passIndex = -1      // 密码/链接

        headers.forEach((header, index) => {
          if (header === '卡号' && cardNoIndex === -1) {
            cardNoIndex = index
          } else if (header === '密码/链接' && passIndex === -1) {
            passIndex = index
          }
        })

        if (cardNoIndex === -1) {
          reject(new Error('文件中缺少"卡号"列'))
          return
        }

        const result = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || row.length === 0) continue

          const cardNo = row[cardNoIndex] ? String(row[cardNoIndex]).trim() : ''
          const pass = passIndex !== -1 && row[passIndex] ? String(row[passIndex]).trim() : ''

          // 卡号必须有值
          if (!cardNo) {
            console.warn(`第 ${i + 1} 行缺少卡号，跳过`)
            continue
          }

          result.push({
            卡号: cardNo,
            '密码/链接': pass
          })
        }

        if (result.length === 0) {
          reject(new Error('没有找到有效数据'))
          return
        }

        resolve(result)
      } catch (error) {
        reject(new Error('解析文件失败：' + error.message))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
},

// 提交导入数据
 // 提交导入数据
async submitImport(data) {
  const loading = this.$loading({
    lock: true,
    text: '正在导入超市卡...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 构建认证参数
    const timestamp = GLOBAL_CONFIG.getTimestamp()
    const apiChannelNo = GLOBAL_CONFIG.API_CHANNEL_NO

    const formData = new FormData()
    formData.append('pid', this.currentPid)
    formData.append('data', JSON.stringify(data))
    formData.append('api_channel_no', apiChannelNo)
    formData.append('timestamp', timestamp)
    formData.append('sign', GLOBAL_CONFIG.generateSign({
      api_channel_no: apiChannelNo,
      timestamp: timestamp
    }))

    const res = await axios({
      url: '/admin/v1/kaquan/importNum',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })

    console.log('导入响应:', res.data)

    if (res.data.status === 200) {
      const count = res.data.count || data.length
      this.$message.success(`导入成功！共导入 ${count} 条超市卡`)
      this.getTableData()
    } else {
      this.$message.error(res.data.msg || '导入失败')
    }
  } catch (error) {
    console.error('导入失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
    this.$message.error('导入失败：' + errorMsg)
  } finally {
    loading.close()
  }
},
 
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp || timestamp === 0) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    
    // 格式化日期时间字符串
    formatDateTime(dateStr) {
      if (!dateStr) return this.setDefaultTime()
      // 如果是时间戳
      if (typeof dateStr === 'number') {
        return this.formatTime(dateStr)
      }
      return dateStr
    }
  }
}
</script>

<style scoped lang="scss">
.num-list-container {
  font-size: 14px;
}

.breadcrumb {
  margin-bottom: 15px;
  padding: 10px 0;
}

.search-card {
  margin-bottom: 20px;
  
  .search-form {
    .search-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }
    
    .search-label {
      color: #666;
    }
    
    .w60 { width: 70px; }
    .w80 { width: 80px; }
    .w90 { width: 90px; }
    .w100 { width: 100px; }
    .ml20 { margin-left: 20px; }
  }
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  
  .status-link {
    cursor: pointer;
    
    &.published {
      color: #00a65a;
    }
    
    &.unpublished {
      color: #ffc107;
    }
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
    
    .total-info {
      color: #666;
      font-size: 14px;
    }
    
    .page-info {
      color: #666;
      font-size: 14px;
    }
  }
}

:deep(.el-link) {
  font-size: 14px;
}


</style>