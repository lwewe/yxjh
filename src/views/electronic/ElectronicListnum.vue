<template>
  <div class="coupon-code-list">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">


        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索方式" class="w120" clearable>
            <el-option label="卡号" value="num"></el-option>
            <el-option label="密码/链接" value="pass"></el-option>
            <el-option label="编号" value="id"></el-option>
            <el-option label="用户ID" value="uid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="到期时间" value="end_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序规则" class="w120" clearable>
            <el-option label="升序" value="asc"></el-option>
            <el-option label="降序" value="desc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.state" placeholder="领取状态" class="w120" clearable>
            <el-option label="未领取" value="0"></el-option>
            <el-option label="已领取" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="resetSearch()" icon="el-icon-refresh-right">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addNum">添加券</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 1">批量删除</el-button>
        <el-button type="success" size="small" icon="el-icon-download" @click="downloadTemplate">导入格式</el-button>
        <el-button type="success" size="small" icon="el-icon-download" @click="importNum">导入电子券</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        v-loading="loading" @selection-change="handleSelectionChange" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

        <el-table-column type="selection" width="39"></el-table-column>

        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column label="卡号" min-width="180" align="left">
          <template slot-scope="scope">
            <span style="font-family: monospace;">{{ scope.row.num }}</span>
          </template>
        </el-table-column>

        <el-table-column label="密码/链接" min-width="150" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.pass && scope.row.pass.startsWith('http')">
              {{ scope.row.pass }}
              <!-- <a :href="scope.row.pass" target="_blank" style="color: #409eff;">查看链接</a> -->
            </span>
            <span v-else>{{ scope.row.pass || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column label="到期时间" width="160" align="center">
          <template slot-scope="scope">
            <span :style="{ color: isExpired(scope.row.end_time) ? '#f56c6c' : '#67c23a' }">
              {{ formatTime(scope.row.end_time) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="发布状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
              @change="(val) => handleStatusChange(scope.row, val)" />
          </template>
        </el-table-column>
        <el-table-column label="领取状态" width="100" align="center" v-if="editId != ''">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state === 0 ? 'success' : 'info'" size="small">
              {{ scope.row.state === 0 ? '未领取' : '已领取' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="领取用户" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.uid && scope.row.uid > 0">
              <el-button type="text" @click="viewUser(scope.row.uid)">UID:{{ scope.row.uid }}</el-button>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="领取时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.dh_time && scope.row.dh_time > 0 ? formatTime(scope.row.dh_time) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" @close="handleDialogClose">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="150px"
        style=" width: 90%; text-align: left;">
        <el-form-item label="卡号：" prop="num">
          <el-input v-model="formData.num" placeholder="请输入卡号"></el-input>
        </el-form-item>

        <el-form-item label="密码/链接：" prop="pass">
          <el-input v-model="formData.pass" placeholder="请输入密码或链接地址" type="textarea" :rows="2"></el-input>
        </el-form-item>

        <el-form-item label="有效日期：" prop="end_time">
          <el-date-picker v-model="formData.end_time" type="date" placeholder="选择有效日期" value-format="yyyy-MM-dd"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领取状态：" prop="state" v-if="isEdit">
          <span v-if="formData.state == 0">未领取</span>
          <span v-if="formData.state == 1">已领取</span>

        </el-form-item>
        <el-form-item label="发布状态：" prop="sh">
          <el-radio-group v-model="formData.sh">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间：" prop="add_time">
          <el-date-picker v-model="formData.add_time" type="datetime" placeholder="选择发布时间"
            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
          </el-date-picker>
        </el-form-item>



      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GLOBAL_CONFIG } from '@/config/global'
import axios from 'axios'
import * as XLSX from 'xlsx'
import {
  numListcoupons,
  addNumcoupons,
  editNumcoupons,
  delNumcoupons,
  getNumcoupons
} from '@/api/modules/login'

export default {
  name: 'CouponCodeList',
  data() {
    return {
      loading: false,
      submitting: false,
      dialogVisible: false,
      dialogTitle: '新增券',
      isEdit: false,
      editId: null,

      searchForm: {
        search_key: 'num',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        state: '',
        sh: ''
      },

      couponInfo: {
        id: '',
        title: '',
        price: 0
      },

      tableData: [],
      page: 1,
      limit: 20,
      total: 0,
      multipleSelection: [],

      formData: {
        state: '',
        num: '',
        pass: '',
        add_time: '',
        end_time: '',
        sh: 1
      },
      statusChanging: false,  // 新增：防止重复提交
      formRules: {
        add_time: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ],
        end_time: [
          { required: true, message: '请选择有效日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const pid = this.$route.query.id
    const title = this.$route.query.title
    if (pid) {
      this.couponInfo.id = pid
      this.couponInfo.title = title || ''
      this.getList()
    } else {
      this.$message.error('缺少电子券ID')
      this.goBack()
    }
  },
  methods: {

    downloadTemplate() {
      // 直接打开模板下载链接
      window.open('https://sc.bjyxfl.com/Public/qfile/quanmoban.xls')
    }, importNum() {
      // 创建文件上传 input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx, .xls'
      input.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // 验证文件类型
        const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        if (fileExt !== 'xlsx' && fileExt !== 'xls') {
          this.$message.error('请上传 Excel 文件（.xlsx 或 .xls）')
          return
        }

        try {
          // 读取并解析 Excel
          const data = await this.parseExcelFile(file)

          if (!data || data.length === 0) {
            this.$message.warning('文件中没有有效数据')
            return
          }

          // 确认导入
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
          }).catch(() => { })

        } catch (error) {
          console.error('解析文件失败:', error)
          this.$message.error(error.message || '解析文件失败，请检查文件格式')
        }
      }
      input.click()
    },
    async submitImport(data) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入电子券...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {

        const timestamp = GLOBAL_CONFIG.getTimestamp()
        const apiChannelNo = GLOBAL_CONFIG.API_CHANNEL_NO

        const signParams = {
          api_channel_no: apiChannelNo,
          timestamp: timestamp
        }
        const sign = GLOBAL_CONFIG.generateSign(signParams)




        const params = new FormData()
        params.append('pid', this.couponInfo.id)
        params.append('data', JSON.stringify(data))

        params.append('api_channel_no', apiChannelNo)
        params.append('timestamp', timestamp)
        params.append('sign', sign)


        const res = await axios({
          url: '/admin/v1/coupons/importNum',
          method: 'POST',
          data: params,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        if (res.data.status === 200) {
          const count = res.data.count || data.length
          this.$message.success(`导入成功！共导入 ${count} 条电子券`)
          this.getList()  // 刷新列表
        } else {
          this.$message.error(res.data.msg || '导入失败')
        }
      } catch (error) {
        console.error('导入失败:', error)
        this.$message.error('导入失败：' + (error.response?.data?.msg || error.message || '请稍后重试'))
      } finally {
        loading.close()
      }
    },
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

            // 获取表头
            const headers = jsonData[0].map(h => String(h || '').trim())

            // 找到列索引
            let cardNoIndex = -1    // 卡号
            let passIndex = -1      // 密码/链接
            let expireIndex = -1    // 到期时间

            headers.forEach((header, index) => {
              if (header === '卡号' && cardNoIndex === -1) {
                cardNoIndex = index
              } else if (header === '密码/链接' && passIndex === -1) {
                passIndex = index
              } else if (header === '到期时间' && expireIndex === -1) {
                expireIndex = index
              }
            })

            if (cardNoIndex === -1) {
              reject(new Error('文件中缺少"卡号"列'))
              return
            }

            // 解析数据
            const result = []
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i]
              if (!row || row.length === 0) continue

              const cardNo = row[cardNoIndex] ? String(row[cardNoIndex]).trim() : ''
              const pass = passIndex !== -1 && row[passIndex] ? String(row[passIndex]).trim() : ''
              const expireTime = expireIndex !== -1 && row[expireIndex] ? String(row[expireIndex]).trim() : ''

              // 卡号必须有值
              if (!cardNo) {
                console.warn(`第 ${i + 1} 行缺少卡号，跳过`)
                continue
              }

              result.push({
                卡号: cardNo,
                '密码/链接': pass,
                到期时间: expireTime
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
    // 获取号码列表
    async getList() {
      this.loading = true
      try {
        const params = new FormData()
        params.append('pid', this.couponInfo.id)
        params.append('page', this.page)
        params.append('limit', this.limit)

        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.append('search_key', this.searchForm.search_key)
          params.append('search_val', this.searchForm.search_val)
        }
        if (this.searchForm.px_key && this.searchForm.px_val) {
          params.append('px_key', this.searchForm.px_key)
          params.append('px_val', this.searchForm.px_val)
        }
        if (this.searchForm.state !== '' && this.searchForm.state !== null) {
          params.append('state', this.searchForm.state)
        }

        const res = await numListcoupons(params)

        if (res.code === 200) {
          this.couponInfo.price = res.data?.coupons?.price || 0
          this.tableData = res.data?.list?.data || []
          this.total = res.data?.list?.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },

    // 判断是否过期
    isExpired(timestamp) {
      if (!timestamp) return false
      const now = Math.floor(Date.now() / 1000)
      return timestamp < now
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        search_key: 'num',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        state: ''
      }
      this.page = 1
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
      this.getList()
    },

    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    // 添加号码
    addNum() {
      this.dialogTitle = '新增券'
      this.isEdit = false
      this.editId = null
      this.formData = {
        num: '',
        pass: '',
        add_time: this.getDefaultTime(),
        end_time: '',
        sh: 1
      }
      this.dialogVisible = true
    },

    // 修改号码
    async handleEdit(row) {
      this.dialogTitle = '修改券'
      this.isEdit = true
      this.editId = row.id

      try {
        const params = new FormData()
        params.append('pid', this.couponInfo.id)
        params.append('id', row.id)

        const res = await getNumcoupons(params)

        if (res.code === 200 && res.data?.show) {
          const data = res.data.show
          this.formData = {
            num: data.num || '',
            pass: data.pass || '',
            add_time: this.formatDateTime(data.add_time),
            end_time: this.formatDate(data.end_time),
            sh: data.sh || 1,
            state: data.state || ''
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

    // 删除号码
    handleDelete(row) {
      this.$confirm(`确认删除号码"${row.num}"吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', row.id)

          const res = await delNumcoupons(params)

          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的号码')
        return
      }

      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个号码吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', ids)

          const res = await delNumcoupons(params)

          if (res.code === 200) {
            this.$message.success(`成功删除 ${this.multipleSelection.length} 个号码`)
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 修改发布状态
    // 修改发布状态（带确认框）
    async handleStatusChange(row, newVal) {
      // newVal 是布尔值：true=开启(发布), false=关闭(下架)
      const targetStatus = newVal ? 1 : 0

      // 确定操作文本
      const actionText = targetStatus === 1 ? '发布' : '下架'

      // 添加确认框
      try {
        await this.$confirm(`确认将卡券"${row.num}"${actionText}吗？`, '提示', {
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
        const params = new FormData()
        params.append('id', row.id)
        params.append('sh', targetStatus)

        const res = await editNumcoupons(params)

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
        console.error('修改状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.$forceUpdate()
      } finally {
        this.statusChanging = false
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return

        this.submitting = true

        try {
          const params = new FormData()
          params.append('pid', this.couponInfo.id)
          params.append('num', this.formData.num || '')
          params.append('pass', this.formData.pass || '')
          params.append('add_time', this.formData.add_time)
          params.append('end_time', this.formData.end_time)
          params.append('sh', this.formData.sh)

          let res
          if (this.isEdit) {
            params.append('id', this.editId)
            res = await editNumcoupons(params)
          } else {
            res = await addNumcoupons(params)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('提交失败')
        } finally {
          this.submitting = false
        }
      })
    },

    // 导出数据
    exportData() {
      this.$message.info('导出功能开发中...')
    },

    // 查看用户
    viewUser(uid) {
      this.$router.push({ name: 'UserDetail', query: { id: uid } })
    },

    // 获取默认时间
    getDefaultTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 时间戳转日期时间字符串
    formatDateTime(timestamp) {
      if (!timestamp) return this.getDefaultTime()
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 时间戳转日期字符串
    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    // 关闭弹窗回调
    handleDialogClose() {
      this.$refs.formRef?.resetFields()
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 返回列表
    goBack() {
      this.$router.push({ name: 'ElectronicList' })
    }
  }
}
</script>

<style scoped>
.coupon-code-list {
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;

  align-items: center;
}

.w100 {
  width: 100px;
}

.w120 {
  width: 120px;
}

.w150 {
  width: 150px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.serchForm .el-form-item {
  margin-bottom: 10px;
}
</style>