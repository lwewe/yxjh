<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="位置" class="w120" clearable>
            <el-option label="Banner" :value="1"></el-option>
            <el-option label="热卖榜好书" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120" clearable>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120" clearable></el-input>
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
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
            <el-option label="全部" value="status"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="resetSearch()">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" style="text-align: left; width: 90%;">
        <el-form-item label="位置" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择位置">
            <el-option label="Banner" :value="1"></el-option>
            <el-option label="热卖榜好书" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="px">
          <el-input v-model="form.px"></el-input>
        </el-form-item>

        <el-form-item label="图片" prop="img">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="customImageUpload"
            :before-upload="beforeUpload">
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">
            <span v-if="form.pid === 1">尺寸：750*240</span>
            <span v-else>尺寸：100*100</span>
            ，大小：1M以内，支持jpg、png格式
          </div>
        </el-form-item>
        <el-form-item label="发布状态" prop="sh">
          <!-- <el-switch v-model="form.sh" :active-value="1" :inactive-value="0" ></el-switch> -->
          <el-radio-group v-model="form.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 在弹窗中添加时间选择器 -->
        <el-form-item label="发布时间" prop="add_time">
          <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择发布时间"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="new Date()"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加轮播图</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 1">批量删除</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column label="编号" min-width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="排序" min-width="180" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" style="width: 80px;"
              @change="(val) => updatePx(scope.row.id, val)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="图片" min-width="190" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" style="width: 100px; height: 50px;" fit="contain"
              :preview-src-list="[scope.row.img]"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="标题" min-width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="链接地址" min-width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.url || '-' }}
          </template>
        </el-table-column> -->

        <el-table-column label="添加时间" min-width="180" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
              @change="(val) => updateStatus(scope.row, val)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  booksNavList,
  booksAddNav,
  booksGetNav,
  booksEditNav,
  booksDelNav,
  booksPxNav,
  booksFbNav
} from '@/api/modules/video'

export default {
  name: 'BannerManage',
  data() {
    return {
      statusChanging: false,  // 新增
      loading: false,
      submitLoading: false,  // 添加提交loading
      dialogFormVisible: false,
      dialogTitle: '添加轮播图',
      isEdit: false,
      editId: null,
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        pid: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: 'status'
      },
      form: {
        pid: 1,
        title: '',
        url: '',
        img: '',
        px: 0,
        sh: 1,
        add_time: ''
      },
      formRules: {
        pid: [{ required: true, message: '请选择位置', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
        add_time: [{ required: true, message: '请选择发布时间', trigger: 'change' }]  // 添加时间验证
      },

      multipleSelection: [],
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 自定义图片上传
    async customImageUpload(options) {
      const { file } = options

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
      formData.append('file_url', 'upload/tsnav')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const token = localStorage.getItem('token')
        const response = await axios({
          url: '/admin/v1/upload/image',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        })

        loading.close()

        // 根据返回格式判断：status === 200 且 data 是图片地址
        if (response.data.status === 200 && response.data.data) {
          this.form.img = response.data.data
          this.$message.success('图片上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        loading.close()
        // 兼容错误响应中的成功情况
        if (error.response?.data?.status === 200 && error.response?.data?.data) {
          this.form.img = error.response.data.data
          this.$message.success('图片上传成功')
        } else {
          console.error('图片上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
        }
      }
    },
    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
        // 过滤空值
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })
        const res = await booksNavList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
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

    // 搜索
    handleSearch() {
      this.page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        pid: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      }
      this.page = 1
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    // 添加
    addPro() {
      this.dialogTitle = '添加轮播图'
      this.isEdit = false
      this.editId = null
      const now = new Date()
      const formattedTime = this.formatDateTime(now)
      this.form = {
        pid: 1,
        title: '',
        url: '',
        img: '',
        px: 0,
        sh: 1,
        add_time: formattedTime
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    // 编辑
    async handleEdit(row) {
      this.dialogTitle = '修改轮播图'
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await booksGetNav({ id: row.id })
        if (res.code === 200) {
          const addTime = res.data.add_time
            ? this.formatDateTime(new Date(res.data.add_time * 1000))
            : this.formatDateTime(new Date())

          this.form = {
            pid: res.data.pid,
            title: res.data.title,
            url: res.data.url || '',
            img: res.data.img,
            px: res.data.px,
            sh: res.data.sh,
            add_time: addTime
          }
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.formRef && this.$refs.formRef.clearValidate()
          })
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
      }
    },

    // 格式化日期时间（返回 YYYY-MM-DD HH:mm:ss）
    formatDateTime(date) {
      if (!date || isNaN(date.getTime())) {
        return ''
      }
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },

    // 提交表单
    async submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.submitLoading = true
        try {
          let res
          const submitData = { ...this.form }
          if (!submitData.add_time) {
            submitData.add_time = this.formatDateTime(new Date())
          }

          if (this.isEdit) {
            res = await booksEditNav({ id: this.editId, ...submitData })
          } else {
            res = await booksAddNav(submitData)
          }
          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除
    handleDelete(id, index) {
      this.$confirm('确认删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelNav({ ids: id })
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
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条轮播图吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelNav({ ids })
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

    // 修改排序
    async updatePx(id, px) {
      try {
        const res = await booksPxNav({ id, px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '排序修改失败')
        }
      } catch (error) {
        console.error('排序修改失败:', error)
        this.$message.error('排序修改失败')
      }
    },

    // 修改状态
    // 修改状态（带确认框）
    async updateStatus(row, newVal) {
      const targetStatus = newVal ? 1 : 0
      const actionText = targetStatus === 1 ? '发布' : '下架'

      try {
        await this.$confirm(`确认将轮播图${actionText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await booksFbNav({ id: row.id })
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          row.sh = targetStatus
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
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


    // 自定义图片上传

    // 上传前校验
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
.w120 {
  width: 120px;
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

.list-container {
  font-size: 14px;
}

.list-container .search-card {
  margin-bottom: 20px;
}

.list-container .search-card .search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.list-container .pagination {
  margin-top: 20px;
  text-align: right;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader .avatar {
  width: 150px;
  height: 100px;
  display: block;
  object-fit: cover;
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}

.avatar-uploader .avatar-uploader-icon:hover {
  border-color: #409EFF;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>