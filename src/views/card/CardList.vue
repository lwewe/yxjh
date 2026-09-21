<template>
  <div class="cardLists">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <el-form-item label="">
          <el-select v-model="searchForm.class1" placeholder="卡券分类" class="w150" clearable>
            <el-option label="影视阅读会员" :value="1"></el-option>
            <el-option label="阅读会员" :value="2"></el-option>
            <el-option label="音乐会员" :value="3"></el-option>
            <el-option label="商城充值/石油卡" :value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120" clearable>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
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

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" style="width: 90%;text-align: left;">
        <el-form-item label="卡券分类" prop="class1">
          <el-select v-model="form.class1" placeholder="请选择卡券分类" style="width: 100%">
            <el-option label="影视阅读会员" :value="1"></el-option>
            <el-option label="阅读会员" :value="2"></el-option>
            <el-option label="音乐会员" :value="3"></el-option>
            <el-option label="商城充值/石油卡" :value="4"></el-option>
          </el-select>
        </el-form-item>

        <!-- 当分类为阅读会员时，显示标识选项 -->
        <el-form-item v-if="form.class1 === 2" label="标识" prop="flag">
          <el-select v-model="form.flag" placeholder="请选择标识" style="width: 100%">
            <el-option label="阅读" :value="1"></el-option>
            <el-option label="工具" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="px">
          <el-input v-model="form.px"></el-input>
          <span>填写整数，值越大越靠前</span>
        </el-form-item>

        <el-form-item label="图片" prop="img">
          <el-upload class="avatar-uploader" action="" :auto-upload="true" :show-file-list="false"
            :http-request="customUpload" :before-upload="beforeImageUpload">
            <img v-if="form.img" :src="form.img" class="contain">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">建议尺寸：200*200px，大小不超过1MB</div>
        </el-form-item>

        <el-form-item label="添加时间" prop="add_time">
          <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <span style="color: #999; font-size: 12px; margin-left: 10px;">不选则自动填充当前时间</span>
        </el-form-item>

        <el-form-item label="发布状态" prop="sh">
          <el-radio-group v-model="form.sh">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加卡券</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 1">批量删除</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="small" @change="(val) => updatePx(scope.row, val)"
              style="width: 100px;">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" style="width: 50px; height: 50px;" fit="contain"
              :preview-src-list="[scope.row.img]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="200" align="left">
          <template slot-scope="scope">

            <div style="display: inline-block;" class="blueCl"> [<span v-if="scope.row.class1 === 1">影视阅读会员</span>
              <span v-else-if="scope.row.class1 === 2">阅读会员</span>
              <span v-else-if="scope.row.class1 === 3">音乐会员</span>
              <span v-else-if="scope.row.class1 === 4">商城充值/石油卡</span>
              <span v-else>-</span>]
            </div>
            <span>{{ scope.row.title }}</span>
            <!-- <div class="sub-info">链接：{{ scope.row.url || '-' }}</div> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="卡券分类" width="140" align="center">
          <template slot-scope="scope">
           
          </template>
        </el-table-column> -->
        <el-table-column label="添加时间" width="180" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
              @change="(val) => updateStatus(scope.row, val)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.per_page"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  kaquanList,
  addKaquan,
  getKaquan,
  editKaquan,
  delKaquan,
  pxKaquan,
  fbKaquan
} from '@/api/modules/zhichong'

export default {
  name: 'KaquanList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复提交
      loading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: '添加卡券',
      isEdit: false,
      searchForm: {
        class1: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      },
      form: {
        id: '',
        class1: 1,
        title: '',
        url: '',
        px: 50,
        img: '',
        add_time: '',
        sh: 1,
        flag: 0
      },
      formRules: {
        class1: [{ required: true, message: '请选择卡券分类', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        add_time: [{ required: true, message: '请选择添加时间', trigger: 'change' }],
        sh: [{ required: true, message: '请选择发布状态', trigger: 'change' }]
      },
      pageInfo: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.pageInfo.current_page,
          limit: this.pageInfo.per_page,
          ...this.searchForm
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await kaquanList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.pageInfo.total = res.data.total
          this.pageInfo.per_page = res.data.per_page
          this.pageInfo.current_page = res.data.current_page
          this.pageInfo.last_page = res.data.last_page
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

    // 查询
    handleSearch() {
      this.pageInfo.current_page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        class1: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      }
      this.handleSearch()
    },

    // 添加卡券
    addPro() {
      this.dialogTitle = '添加卡券'
      this.isEdit = false
      this.form = {
        id: '',
        class1: 1,
        title: '',
        url: '',
        px: 50,
        img: '',
        add_time: this.getCurrentDateTime(),
        sh: 1,
        flag: 0
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },

    // 编辑
    async handleEdit(row) {
      this.dialogTitle = '修改卡券'
      this.isEdit = true

      this.loading = true
      try {
        const res = await getKaquan({ id: String(row.id) })
        if (res.code === 200) {
          const data = res.data
          this.form = {
            id: data.id,
            class1: data.class1,
            title: data.title,
            url: data.url || '',
            px: data.px,
            img: data.img,
            add_time: this.formatDateTime(data.add_time),
            sh: data.sh,
            flag: data.flag || 0
          }
          this.dialogFormVisible = true
          this.$nextTick(() => {
            if (this.$refs.formRef) {
              this.$refs.formRef.clearValidate()
            }
          })
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
      } finally {
        this.loading = false
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          const submitData = {
            class1: String(this.form.class1),
            title: this.form.title,
            url: this.form.url || '',
            img: this.form.img,
            add_time: this.form.add_time || this.getCurrentDateTime(),
            px: String(this.form.px),
            sh: String(this.form.sh)
          }

          // 如果分类是阅读会员，添加flag参数
          if (this.form.class1 === 2 && this.form.flag) {
            submitData.flag = String(this.form.flag)
          }

          let res
          if (this.isEdit) {
            submitData.id = String(this.form.id)
            res = await editKaquan(submitData)
          } else {
            res = await addKaquan(submitData)
          }

          if (res.code === 200) {
            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error(this.isEdit ? '修改失败:' : '添加失败:', error)
          this.$message.error(this.isEdit ? '修改失败' : '添加失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 自定义图片上传
    async customUpload(options) {
      const { file, onSuccess, onError } = options

      const loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'kaquan')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        loading.close()

        if (response.data.status === 200) {
          this.form.img = response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.form.img = error.response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

    // 图片上传前校验
    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    // 获取当前时间
    getCurrentDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 格式化时间戳为日期时间字符串
    formatDateTime(timestamp) {
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

    // 格式化时间显示
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 更新排序
    async updatePx(row, val) {
      try {
        const res = await pxKaquan({
          id: row.id,
          px: val
        })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.getList()
        }
      } catch (error) {
        console.error('修改排序失败:', error)
        this.$message.error('修改排序失败')
        this.getList()
      }
    },

    // 更新发布状态
    // 更新发布状态（带确认框）
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
        const res = await fbKaquan({ id: row.id })
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
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该卡券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKaquan({ ids: row.id })
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
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delKaquan({ ids: ids })
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

    // 分页
    handleSizeChange(val) {
      this.pageInfo.per_page = val
      this.pageInfo.current_page = 1
      this.getList()
    },

    handleCurrentChange(val) {
      this.pageInfo.current_page = val
      this.getList()
    },

    // 选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.cardLists {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
  }

  .search-form :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .w100 {
    width: 100px;
  }

  .w150 {
    width: 150px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .sub-info {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }

  .avatar-uploader :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader :deep(.el-upload:hover) {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    object-fit: cover;
  }

  .upload-tip {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }

  .image-slot {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #909399;
  }
}
</style>