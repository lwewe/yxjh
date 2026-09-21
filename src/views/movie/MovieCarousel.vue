<template>
  <div class="list-container">
    <!-- 搜索表单 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="请选择栏目" class="w120" clearable>
            <el-option label="影片" :value="1"></el-option>
            <el-option label="影院" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="请选择" class="w120" clearable>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="请输入关键词" class="w150" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="请选择" class="w120" clearable>
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="请选择" class="w120" clearable>
            <el-option label="升序" value="asc"></el-option>
            <el-option label="降序" value="desc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="请选择" class="w120" clearable>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="handleDialogClose">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" style="text-align: left; width: 90%;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="栏目" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择栏目">
            <el-option label="影片" :value="1"></el-option>
            <el-option label="影院" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="px">
          <el-input v-model="form.px" ></el-input>
          <span >填写整数,值越大,越靠前.</span>
        </el-form-item>

        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址，如：/filmdetail?id=123"></el-input>
        </el-form-item>

        <el-form-item label="图片" prop="img" required>
          <el-upload class="avatar-uploader" action="" :auto-upload="true" :show-file-list="false"
            :http-request="customUpload" :before-upload="beforeImageUpload">
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">尺寸：750*400，大小：1M以内</div>
        </el-form-item>

        <el-form-item label="发布时间" prop="add_time">
          <el-date-picker v-model="form.add_time" type="datetime" placeholder="请选择发布时间"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="'12:00:00'">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="发布状态" prop="sh">
          <el-radio-group v-model="form.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加轮播图</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 1">批量删除</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" type="number" @blur="updatePx(scope.row)"
              style="width: 80px"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="图片" width="240" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" style="width: 180px; height: 60px;" fit="contain"
              :preview-src-list="[scope.row.img]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="标题" min-width="200" align="left">

          <template slot-scope="scope">

            <span class="blueCl">[{{ scope.row.pid === 1 ? '影片' : '影院' }}]</span>{{ scope.row.title }}

          </template>
        </el-table-column>



        <!-- <el-table-column label="链接地址" min-width="200" prop="url" align="center" show-overflow-tooltip></el-table-column> -->

        <el-table-column label="添加时间" width="180" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="130" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.sh  === 1"  active-text=" "  inactive-text=" " @change="(val) => updateStatus(scope.row,val)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="pagination.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.per_page"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { navList, addNav, getNav, editNav, delNav, pxNav, fbNav } from '@/api/modules/video'
import { GLOBAL_CONFIG } from '@/config/global' // 根据实际路径调整

export default {
  name: 'BannerList',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: '添加轮播图',
      isEdit: false,
      searchForm: {
        pid: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      },
      form: {
        id: '',
        title: '',
        pid: 1,
        px: 50,
        url: '',
        img: '',
        add_time: '',
        sh: 1
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择栏目', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        add_time: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ]
      },
      tableData: [],
      multipleSelection: [],
      pagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      }, statusChanging: false,  // 新增：防止重复提交
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
          limit: this.pagination.per_page,
          ...this.searchForm
        }
        // 过滤空值
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await navList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total
          this.pagination.per_page = res.data.per_page
          this.pagination.current_page = res.data.current_page
          this.pagination.last_page = res.data.last_page
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
      this.pagination.current_page = 1
      this.getList()
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination.current_page = page
      this.getList()
    },

    handleSizeChange(size) {
      this.pagination.per_page = size
      this.pagination.current_page = 1
      this.getList()
    },

    // 添加
    addPro() {
      this.isEdit = false
      this.dialogTitle = '添加轮播图'
      this.form = {
        id: '',
        title: '',
        pid: 1,
        px: 50,
        url: '',
        img: '',
        add_time: this.getCurrentDateTime(),
        sh: 1
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },

    // 修改
    async handleEdit(row) {
      this.isEdit = true
      this.dialogTitle = '修改轮播图'
      try {
        const res = await getNav({ id: row.id })
        if (res.code === 200) {
          this.form = {
            id: res.data.id,
            title: res.data.title,
            pid: res.data.pid,
            px: res.data.px,
            url: res.data.url,
            img: res.data.img,
            add_time: this.formatDateTime(new Date(res.data.add_time * 1000)),
            sh: res.data.sh
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
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          const apiMethod = this.isEdit ? editNav : addNav
          const submitData = { ...this.form }

          // 如果是修改，确保id存在
          if (this.isEdit && !submitData.id) {
            this.$message.error('缺少必要参数')
            return
          }

          const res = await apiMethod(submitData)
          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error(this.isEdit ? '修改失败' : '添加失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNav({ ids: row.id })
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
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNav({ ids: ids })
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
    async updatePx(row) {
      if (!row.px && row.px !== 0) return
      try {
        const res = await pxNav({ id: row.id, px: row.px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '排序修改失败')
        }
      } catch (error) {
        console.error('修改排序失败:', error)
        this.$message.error('修改排序失败')
      }
    },

    // 修改状态
    // 修改状态（带确认框）
async updateStatus(row, newVal) {
  // newVal 是布尔值：true=开启(发布), false=关闭(下架)
  const targetStatus = newVal ? 1 : 0
  
  // 确定操作文本
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将轮播图${actionText}吗？`, '提示', {
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
    const res = await fbNav({ id: row.id })
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

    // 自定义上传方法 - 按照您提供的示例修改
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
      formData.append('file_url', 'video/nav') // 轮播图上传路径
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

        // 注意：这里使用 status 而不是 code，与您的示例保持一致
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
        // 处理可能的状态码在错误响应中的情况
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

    // 上传前校验
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

    // 弹窗关闭回调
    handleDialogClose() {
      this.form = {
        id: '',
        title: '',
        pid: 1,
        px: 50,
        url: '',
        img: '',
        add_time: '',
        sh: 1
      }
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
    },

    // 表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 获取当前日期时间
    getCurrentDateTime() {
      const now = new Date()
      return this.formatDateTime(now)
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      return this.formatDateTime(date)
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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

.w120 {
  width: 120px;
}

.w150 {
  width: 150px;
}

.avatar-uploader .el-upload {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.avatar {
  width: 150px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
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

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .image-slot {
    width: 80px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #909399;
  }
}
</style>