<template>
  <div class="carousList">
    <template v-if="isCarouselManage">
      <!-- 搜索区域 -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="queryParams" class="search-form">
          <el-form-item label="">
            <el-select v-model="queryParams.pid" placeholder="请选择位置" clearable @change="handleSearch" class="w120">
              <el-option label="首页" value="1" />
              <el-option label="精选" value="2" />
              <el-option label="尊享卡" value="3" />
              <el-option label="甄选品牌" value="4" />
              <el-option label="爱心助农" value="5" />



            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="queryParams.search_key" style="width: 120px">
              <el-option label="标题" value="title" />
              <el-option label="编号" value="id" />
            </el-select>
            <el-input v-model="queryParams.search_val" placeholder="请输入搜索内容" clearable
              style="width: 160px; margin-left: 10px" @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="queryParams.px_key" placeholder="排序" clearable @change="handleSearch" class="w120">
              <el-option value="px" label="排序" />
              <el-option value="add_time" label="添加时间" />
              <el-option value="id" label="编号" />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="queryParams.px_val" placeholder="降序" clearable @change="handleSearch" class="w120">
              <el-option value="desc" label="降序" />
              <el-option value="asc" label="升序" />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="queryParams.sh" placeholder="发布状态" clearable @change="handleSearch" class="w120">
              <el-option label="已发布" value="1" />
              <el-option label="未发布" value="0" />
              <el-option label="全部" value="status" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <!-- 操作区域 -->
      <el-card class="table-card txtleft">
        <div class="table-header">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1"
            @click="delOptions()">批量删除</el-button>

          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">
            添加轮播图
          </el-button>
        </div>

        <!-- 表格 -->


        <el-table v-loading="loading" ref="multipleTable" :data="tableData" border stripe tooltip-effect="dark"
          style="width: 100%;margin-top: 20px;" @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号" width="80" align="center" />

          <el-table-column label="排序" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.px" size="mini" @blur="pxEdit(scope.row)">

              </el-input>
            </template>
          </el-table-column>

          <el-table-column prop="img" label="图片" width="190" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.img" :src="scope.row.img" :preview-src-list="[scope.row.img]" fit="contain"
                style="width: 80px; height: 50px; border-radius: 4px" />
              <span v-else style="color: #999">暂无</span>
            </template>
          </el-table-column>

          <el-table-column label="标题" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="blueCl">[{{ getSp(scope.row.pid) }}]</span>
              <span v-if="scope.row.fulika" class="dangerCl">[{{ scope.row.fulika ? scope.row.fulika.company :
                ''}}]</span> {{ scope.row.title }}
            </template>

          </el-table-column>



          <el-table-column prop="add_time" label="添加时间" width="160" align="center">
            <template slot-scope="scope">
              {{ parseTime(scope.row.add_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="sh" label="发布状态" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                @change="handleChangeStatus(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" align="left" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                删除
              </el-button>
              <el-button size="small" v-if="scope.row.pid == 4 || scope.row.pid == 2 || scope.row.pid == 5"
                type="success" @click="classiFication(scope.row)">
                分类列表
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-show="total > 0" :current-page="queryParams.page" :page-sizes="[10, 20, 30, 50]"
          :page-size="queryParams.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          style="margin-top: 20px; text-align: right" />
      </el-card>

      <!-- 添加/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <!-- :close-on-click-modal="false"  @close="resetForm"-->
        <div style="width: 80%;margin: auto;">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small">
            <el-form-item label="栏目" prop="pid">
              <el-select v-model="formData.pid" placeholder="请选择位置" style="width: 100%">
                <el-option label="首页" :value="1" />
                <el-option label="精选" :value="2" />
                <el-option label="尊享卡" :value="3" />
                <el-option label="甄选品牌" :value="4" />
                <el-option label="爱心助农" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="渐变颜色" prop="yanse1" class="txtleft">
              <div class="color-row dflex">
                <div class="color-item dflex">
                  <el-input v-model="formData.yanse1"></el-input>
                  <!-- <el-color-picker v-model="formData.yanse1" show-alpha /> -->
                  <!-- <span class="color-label">
                    {{ (formData.pid === 1 || formData.pid === 3) ? '背景渐变颜色' : '字体颜色' }}
                  </span> -->
                </div>
                <div class="color-item dflex ml15">
                  <el-input v-model="formData.yanse2"></el-input>

                  <!-- <el-color-picker v-model="formData.yanse2" show-alpha />
                  <span class="color-label">
                    {{ (formData.pid === 1 || formData.pid === 3) ? '背景渐变颜色' : '背景颜色' }}
                  </span> -->
                </div>
              </div>
            </el-form-item>
            <el-form-item label="链接地址" prop="url">
              <el-input v-model="formData.url" placeholder="请输入链接地址" />
            </el-form-item>
            <el-form-item :label="(formData.pid === 1 || formData.pid === 3) ? 'Banner图(首页)' : '首页图'" prop="img"
              class="txtleft">
              <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload"
                :data="{ uploadType: 'img' }" :before-upload="beforeUpload">
                <img v-if="formData.img" :src="formData.img" class="avatar"
                  :class="{ 'img1': formData.pid === 2, 'img2': formData.pid != 2 }" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="form-tip fs12">
                <!-- {{ (formData.pid === 1 || formData.pid === 3)
                  ? 'pid=1,3 的banner图'
                  : 'pid=2,4 的首页图'
                }} -->
                尺寸：750*240 (精选：351*571),大小：1M以内.
              </div>
            </el-form-item>
            <el-form-item v-if="formData.pid === 2 || formData.pid === 4 || formData.pid === 5" label="内页Banner"
              prop="banner" class="txtleft">
              <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload"
                :data="{ uploadType: 'banner' }" :before-upload="beforeUpload">
                <img v-if="formData.banner" :src="formData.banner" class="avatar"
                  :class="{ 'img1': formData.pid === 2, 'img2': formData.pid != 2 }" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="form-tip fs12">尺寸：750*240 (精选：351*571),大小：1M以内.</div>
              <!-- <div class="form-tip">pid=2,4 的内页banner，pid=1,3未用到</div> -->
            </el-form-item>
            <el-form-item label="排序" prop="px" class="txtleft">
              <el-input v-model="formData.px" />
            </el-form-item>
            <el-form-item label="发布状态" prop="sh" class="txtleft">
              <el-radio-group v-model="formData.sh">
                <el-radio :label="1">发布</el-radio>
                <el-radio :label="0">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 替换现有的 dflex 部分 -->


            <el-form-item label="添加时间" prop="add_time">
              <el-date-picker v-model="formData.add_time" type="datetime" placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
              确 定
            </el-button>
          </div>
        </div>
      </el-dialog>
    </template>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  navList,
  addNav,
  getNav,
  editNav,
  delNav,
  editPx,
  editFb
} from '@/api/modules/login'

export default {
  name: 'Nav',
  data() {
    return {
      uploadData: {
        file_url: 'upload/nav',  // 轮播图上传路径
      },
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      tableData: [],
      total: 0,

      queryParams: {
        search_key: '',
        search_val: '',
        pid: '',
        px_key: '',
        px_val: '',
        sh: 'status',
        page: 1,
        limit: 10
      },
      formData: {
        id: '',
        title: '',
        url: '#',
        add_time: '',
        sh: 1,
        img: '',
        banner: '',
        px: 99,
        pid: 1,
        yanse1: '',
        yanse2: ''
      },
      formRules: {
        pid: [{ required: true, message: '请选择位置', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
        add_time: [{ required: true, message: '请选择添加时间', trigger: 'change' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  computed: {
    isCarouselManage() {
      // 只要不是子路由页面，就显示列表
      return this.$route.name === 'CarouselList' || this.$route.path === '/carous/page'
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false

    },
    // 表格多选
    getSp(vals) {
      if (vals == 1) {
        return '首页'
      }
      if (vals == 2) {
        return '精选'
      }
      if (vals == 3) {
        return '尊享卡'
      }
      if (vals == 4) {
        return '甄选品牌'
      } if (vals == 5) {
        return '爱心助农'
      }

    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 自定义上传方法（公用）
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/nav')  // 轮播图路径
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

        if (response.data.status === 200) {
          // 用 uploadType 区分是首页图还是内页图
          if (options.data.uploadType === 'banner') {
            this.formData.banner = response.data.data
          } else {
            this.formData.img = response.data.data
          }
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          if (options.data.uploadType === 'banner') {
            this.formData.banner = error.response.data.data
          } else {
            this.formData.img = error.response.data.data
          }
          this.$message.success('上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 上传前校验
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      return true
    },

    // 图片加载失败处理
    handleImageError(e) {
      console.error('图片加载失败:', e.target.src)
    },
    // 获取列表数据
    getList() {
      this.loading = true
      navList(this.queryParams)
        .then((res) => {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0

          // 按排序字段排序显示
          this.tableData.sort((a, b) => {
            if (this.queryParams.px_val === 'asc') {
              return a.px - b.px
            } else {
              return b.px - a.px
            }
          })
        })
        .catch(() => {
          this.$message.error('获取列表失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1;
      this.getList()
    },
    // 重置搜索
    resetQuery() {
      this.queryParams = {
        search_key: 'title',
        search_val: '',
        pid: '1',
        px_key: 'px',
        px_val: 'asc',
        sh: '0',
        page: 1,
        limit: 10
      }
      this.handleSearch()
    },
    // 分页
    handleSizeChange(val) {
      this.queryParams.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getList()
    },
    // 添加
    handleAdd() {
      this.dialogTitle = '添加轮播图'
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.resetFields()
        this.formData = {
          id: '',
          title: '',
          url: '#',
          add_time: this.formatDateTime(new Date()),
          sh: 1,
          img: '',
          banner: '',
          px: 99,
          pid: 1,
          yanse1: '',
          yanse2: ''
        }
      })
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑轮播图'
      this.isEdit = true

      // 获取详情
      getNav({ id: row.id })
        .then((res) => {
          const data = res.data || row
          this.formData = {
            id: data.id,
            title: data.title || '',
            url: data.url || '#',
            add_time: this.parseTime(data.add_time),
            sh: data.sh,
            img: data.img || '',
            banner: data.banner || '',
            px: data.px || 99,
            pid: data.pid || 1,
            yanse1: data.yanse1 || '',
            yanse2: data.yanse2 || ''
          }
          this.dialogVisible = true
        })
        .catch(() => {
          // 如果获取失败，直接用列表数据
          this.formData = {
            id: row.id,
            title: row.title || '',
            url: row.url || '#',
            add_time: this.parseTime(row.add_time),
            sh: row.sh,
            img: row.img || '',
            banner: row.banner || '',
            px: row.px || 99,
            pid: row.pid || 1,
            yanse1: row.yanse1 || '',
            yanse2: row.yanse2 || ''
          }
          this.dialogVisible = true
        })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return

        this.submitLoading = true
        const params = { ...this.formData }
        // 转换pid为字符串
        params.pid = String(params.pid)
        params.sh = String(params.sh)
        params.px = String(params.px)

        const apiMethod = this.isEdit ? editNav : addNav

        apiMethod(params)
          .then(() => {
            this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
            this.dialogVisible = false
            this.getList()
          })
          .catch(() => {
            this.$message.error(this.isEdit ? '编辑失败' : '添加失败')
          })
          .finally(() => {
            this.submitLoading = false
          })
      })
    },

    // 批量删除
    delOptions() {
      this.$confirm('确认删除选中项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        try {
          const res = await delNav({ ids })
          console.log('批量删除返回：', res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },
    classiFication(vals) {
      this.$router.push({ name: 'AddclassiFication', query: { pid: vals.id } });
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定删除轮播图"${row.title || row.id}"吗？`, '提示', {
        type: 'warning'
      })
        .then(() => {
          return delNav({ ids: String(row.id) })
        })
        .then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
        .catch(() => { })
    },
    // 交换排序值
    pxEdit(row1) {
      const params1 = { id: String(row1.id), px: String(row1.px) }


      Promise.all([editPx(params1)])
        .then(() => {
          this.$message.success('排序调整成功')
          this.getList()
        })
        .catch(() => {
          this.$message.error('排序调整失败')
        })
    },
    // 修改发布状态
    handleChangeStatus(row) {
      const statusText = row.sh === 1 ? '发布' : '取消发布'
      this.$confirm(`确定${statusText}该轮播图?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          return editFb({
            id: String(row.id)

          })
        })
        .then(() => {
          this.$message.success(`${statusText}成功`);
          this.getList()
        })
        .catch(() => {
          // 恢复原状态
          // row.sh = row.sh === 1 ? 0 : 1
          // this.$message.error('发布状态--失败')
          this.getList()

        })
    },
    // 关闭弹窗重置
    resetForm() {
      this.$refs.formRef && this.$refs.formRef.resetFields()
    },
    // 时间格式化
    parseTime(time) {
      if (!time) return ''
      const date = new Date(
        typeof time === 'number' && time.toString().length === 10
          ? time * 1000
          : time
      )
      return this.formatDateTime(date)
    },
    formatDateTime(date) {
      if (!date || isNaN(date.getTime())) return ''
      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const d = date.getDate().toString().padStart(2, '0')
      const h = date.getHours().toString().padStart(2, '0')
      const mm = date.getMinutes().toString().padStart(2, '0')
      const s = date.getSeconds().toString().padStart(2, '0')
      return `${y}-${m}-${d} ${h}:${mm}:${s}`
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

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
  /* 产品列表 */
}

.serchForm .el-card__body {
  padding-top: 10px !important;
  /* 产品列表 */
}
</style>
<style lang="scss" scoped>
.carousList {
  .avatar-uploader {
    width: 102px;
    height: 102px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #eaecee;
    border-radius: 4px;
  }

  .img2 {
    width: 100%;
    max-height: 100px;
  }

  .img1 {
    width: 100%;
    max-height: 100px;
  }

  .el-upload img {
    //   width: 100px;
    //   height: 100px;
    object-fit: contain;
  }

  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>