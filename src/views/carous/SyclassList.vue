<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="栏目" class="w120">
            <el-option label="图标" value="2"></el-option>
            <el-option label="分类" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
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
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="delOptions()">批量删除</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog()">添加分类</el-button>
      </div>

      <!-- 添加/修改弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%;margin: auto;">
          <el-form ref="form" :model="form" label-width="150px" label-position="right">
            <el-form-item label="标题：">
              <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="栏目：">
              <el-select v-model="form.pid" placeholder="请选择栏目" style="width:100%">
                <el-option label="图标" :value="2"></el-option>
                <el-option label="分类" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="链接地址：">
              <el-input v-model="form.url" placeholder="请输入链接地址"></el-input>
            </el-form-item>
            <el-form-item label="福满满链接地址：">
              <el-input v-model="form.fmmurl" placeholder="请输入福满满链接地址"></el-input>
            </el-form-item>
            <el-form-item label="尊享链接地址：">
              <el-input v-model="form.zxurl" placeholder="请输入尊享链接地址"></el-input>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="form.px" placeholder="请输入排序值"></el-input>
            </el-form-item>


            <el-form-item label="图片：" style="text-align: left;">


              <el-upload class="logo-uploader" action="#" :http-request="customUpload" :data="uploadData"
                :show-file-list="false" :before-upload="beforeUpload">
                <img v-if="form.img" :src="form.img" class="logo-preview" />

                <i v-else class="el-icon-plus avatar-uploader-icon" />


              </el-upload>
              <div>尺寸：240*240,大小：1M以内</div>
            </el-form-item>







            <el-form-item label="是否发布：" style="text-align: left;">
              <el-radio-group v-model="form.sh">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布时间：">
              <!-- formatTime(scope.row.add_time) -->
              <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择发布时间"
                value-format="yyyy-MM-dd HH:mm:ss" style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id" width="90" align="center"></el-table-column>
        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" placeholder="排序" size="small" @blur="handleEditPx(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="190" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="width: 60px;height:60px;object-fit:cover;" alt="">
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.pid === 2" class="blueCl">[图标]</span>
            <span v-if="scope.row.pid === 3" class="blueCl">[分类]</span>{{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="190" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" active-color="#409EFF"
              @change="handleEditFb(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" style="margin-top:20px;text-align:right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  syclassList,
  addSyclass,
  getSyclass,
  editSyclass,
  delSyclass,
  syclasseditPx,
  syclasseditFb
} from '@/api/modules/login'

export default {
  name: 'SyclassManage',
  data() {
    return {
      searchForm: {
        search_key: '',
        search_val: '',
        pid: '',
        px_key: '',
        px_val: '',
        sh: ''
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      dialogTitle: '添加分类',
      isEdit: false,
      editId: '',
      form: {
        title: '',
        url: '',
        fmmurl: '',
        zxurl: '',
        px: '',
        pid: 2,
        sh: 1,
        img: '',
        add_time: ''
      },
      fileList: [],
      dialogVisible: false,
      multipleSelection: [],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      uploadData: {
        file_url: 'upload/syclass',  // 根据文档要求传递上传路径
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 自定义上传方法
    async customUpload(options) {
      const { file } = options

      // 生成签名参数
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/syclass')
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

        console.log('上传响应:', response.data)

        if (response.data.status === 200) {
          this.form.img = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        console.error('上传失败:', error)

        // 检查响应数据
        if (error.response && error.response.data) {
          const data = error.response.data
          if (data.status === 200) {
            this.form.img = data.data
            this.$message.success('上传成功')
            return
          }
        }

        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 上传前校验
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    handleImageError(e) {
      console.error('图片加载失败:', this.form.img)
    },
    // 时间戳格式化
    formatTime(timestamp) {
      if (!timestamp || timestamp === 0) return '-'
      const date = new Date(timestamp * 1000)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1).toString().padStart(2, '0') + '-'
      const D = date.getDate().toString().padStart(2, '0') + ' '
      const h = date.getHours().toString().padStart(2, '0') + ':'
      const m = date.getMinutes().toString().padStart(2, '0') + ':'
      const s = date.getSeconds().toString().padStart(2, '0')
      return Y + M + D + h + m + s
    },

    // 获取列表数据
    async getList() {
      try {
        const params = {
          page: this.page,
          limit: this.limit
        }
        if (this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }
        if (this.searchForm.pid !== '') {
          params.pid = this.searchForm.pid
        }
        if (this.searchForm.px_key) {
          params.px_key = this.searchForm.px_key
          params.px_val = this.searchForm.px_val
        }
        if (this.searchForm.sh !== '') {
          params.sh = this.searchForm.sh
        }

        const res = await syclassList(params)
        console.log('接口返回数据：', res)
        // res 直接就是 { code: 200, msg: '获取成功', data: {...} }
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败：', error)
        this.$message.error('获取列表失败')
      }
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.getList()
    },

    // 重置搜索
    handleReset() {
      this.searchForm = {
        search_key: 'title',
        search_val: '',
        pid: '',
        px_key: 'px',
        px_val: 'desc',
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
    // 🔧 将时间戳（秒）转为日期字符串，用于编辑回显
    timestampToDateStr(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1).toString().padStart(2, '0')
      const D = date.getDate().toString().padStart(2, '0')
      const h = date.getHours().toString().padStart(2, '0')
      const m = date.getMinutes().toString().padStart(2, '0')
      const s = date.getSeconds().toString().padStart(2, '0')
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    },

    // 🔧 获取当前时间的日期字符串，用于新增
    getCurrentDateStr() {
      return this.timestampToDateStr(Math.floor(Date.now() / 1000))
    },

    // 打开添加弹窗
    openAddDialog() {




      this.dialogTitle = '添加分类'
      this.isEdit = false
      this.editId = ''
      this.form = {
        title: '',
        url: '',
        fmmurl: '',
        zxurl: '',
        px: '',
        pid: 2,
        sh: 1,
        img: '',
        add_time: this.getCurrentDateStr()
      }
      this.fileList = []
      this.dialogVisible = true
    },

    // 打开编辑弹窗
    async openEditDialog(row) {
      this.dialogTitle = '修改分类'
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await getSyclass({ id: row.id })
        console.log('获取详情返回：', res)
        // 统一判断 res.code === 200
        if (res.code === 200) {
          this.form = { ...res.data }
          this.form.add_time = this.timestampToDateStr(this.form.add_time)
          this.fileList = this.form.img ? [{ url: this.form.img }] : []
          this.dialogVisible = true
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败：', error)
        this.$message.error('获取详情失败')
      }
    },

    // 提交表单
    async submitForm() {
      try {
        const apiMethod = this.isEdit ? editSyclass : addSyclass
        const params = { ...this.form }
        if (this.isEdit) {
          params.id = this.editId
        }
        const res = await apiMethod(params)
        console.log('提交表单返回：', res)
        if (res.code === 200) {
          this.$message.success(this.isEdit ? '修改成功' : '添加成功')
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        console.error('操作失败：', error)
        this.$message.error('操作失败')
      }
    },

    // 修改排序
    async handleEditPx(row) {
      try {
        const res = await syclasseditPx({ id: row.id, px: row.px })
        console.log('修改排序返回：', res)
        if (res.code === 200) {
          this.$message.success('排序修改成功');
          this.getList();
        } else {
          this.$message.error(res.msg || '排序修改失败')
        }
      } catch (error) {
        this.$message.error('排序修改失败')
      }
    },

    // 快速切换发布状态
    // async handleEditFb(row) {
    //   try {
    //     const res = await syclasseditFb({ id: row.id })
    //     console.log('切换状态返回：', res)
    //     if (res.code === 200) {
    //       this.$message.success('状态修改成功');
    //       this.getList();
    //     } else {
    //       this.$message.error(res.msg || '状态修改失败')
    //       this.getList()
    //     }
    //   } catch (error) {
    //     this.$message.error('状态修改失败')
    //     this.getList()
    //   }
    // },
    // 快速切换发布状态（带刷新版本）
    // 快速切换发布状态（带刷新版本）
    async handleEditFb(row) {
      // ⚠️ 注意：el-switch 触发 change 时，row.sh 已经变成了新值
      // 所以 currentSh 是切换后的值，previousSh 是切换前的值
      const currentSh = row.sh; // 已经是切换后的新值
      const previousSh = currentSh === 1 ? 0 : 1; // 反推切换前的值
      const statusText = currentSh === 1 ? '发布' : '取消发布';

      try {
        await this.$confirm(`确定${statusText}该分类?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const res = await syclasseditFb({ id: String(row.id) });

        if (res.code === 200) {
          // 接口返回成功，使用后端返回的状态
          row.sh = res.data.sh;
          this.$message.success('状态修改成功');
          this.getList(); // 刷新列表
        } else {
          // 失败则回滚到之前的状态
          row.sh = previousSh;
          this.$message.error(res.msg || '状态修改失败');
        }
      } catch (error) {
        // 取消或失败都回滚
        row.sh = previousSh;
        if (error !== 'cancel' && error !== 'close') {
          this.$message.error('状态修改失败');
        }
      }
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
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
          const res = await delSyclass({ ids })
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

    // 单个删除
    handleDelete(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delSyclass({ ids: row.id.toString() })
          console.log('删除返回：', res)
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

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.form = {
        title: '',
        url: '',
        fmmurl: '',
        zxurl: '',
        px: '',
        pid: 2,
        sh: 1,
        img: '',
        add_time: ''
      }
      this.fileList = []
    },

    // 图片相关
    handleRemove(file, fileList) {
      this.form.img = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    handleUploadSuccess(response, file, fileList) {
      // 根据实际上传接口返回的图片地址赋值
      // this.form.img = response.data.url
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

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}

// .logo-container {
//   display: flex;
//   // align-items: center;
//   gap: 15px;
//   flex-wrap: wrap;
//   flex-direction: column;

//   .logo-preview {
//     width: 60px;
//     height: 60px;
//     object-fit: contain;
//     // border: 1px solid #dcdfe6;
//     border-radius: 4px;
//   }

//   .logo-uploader {
//     display: inline-block;
//   }
// }

.logo-uploader {
  width: 80px;
  height: 80px;
  line-height: 78px;
  text-align: center;
  border: 1px dashed #eaecee;
  border-radius: 4px;
}

.logo-preview {
  width: 80px;
  height: 80px;
  object-fit: contain;

  border-radius: 4px;
}
</style>