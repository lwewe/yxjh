<template>
  <div class="list-container cateGorys">
    <el-card class="search-card">
      <!-- 添加按钮 -->
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加分类</el-button>
      </div>

      <!-- 分类表格 -->
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" row-key="id"
        default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column label="分类名称" min-width="450" align="left">
          <template slot-scope="scope">
            <div class="category-name">
              <span v-html="scope.row.tmp"></span>
              <span v-if="scope.row.flags === 1" class="first-level">
                <i class="el-icon-folder-opened"></i>
                <strong>{{ scope.row.name }}</strong>
              </span>
              <span v-else class="second-level">
                <i class="el-icon-document"></i>
                {{ scope.row.name }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="图片" min-width="160" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.tbimg" :src="scope.row.tbimg" style="width: 50px; height: 50px;" fit="cover"
              :preview-src-list="[scope.row.tbimg]"></el-image>
            <span v-else class="no-image">无图片</span>
          </template>
        </el-table-column>

        <el-table-column label="排序" min-width="250" align="left">
          <template slot-scope="scope"> 
            <el-input v-model="scope.row.px" size="mini"  style="width: 120px;"
              @change="(val) => updatePx(scope.row.id, val)"></el-input>
          </template>
        </el-table-column>

        <!-- <el-table-column label="链接地址" min-width="250" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.url">{{ scope.row.url }}</span>
            <span v-else class="no-image">-</span>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" min-width="300" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button v-if="scope.row.flags === 1" size="mini" type="success"
              @click="addSub(scope.row)">添加子分类</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" label-position="right"
        style="text-align: left;width: 90%;">
        <el-form-item label="所属分类：" prop="pid">
          <div v-if="form.pid && getParentName(form.pid)" style="text-align: left; padding-left: 10px;">
            <span style="color: #000; font-weight: bold;">{{ getParentName(form.pid) }}</span>
            <input type="hidden" v-model="form.pid">
          </div>
          <el-select v-else v-model="form.pid" placeholder="请选择所属分类"   >
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- <el-option v-for="item in parentOptions" :key="item.id" :label="item.name" :value="item.id"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>

        <el-form-item label="图片：" prop="tbimg">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="customImageUpload"
            :before-upload="beforeUpload">
            <img v-if="form.tbimg" :src="form.tbimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">尺寸：75*75，大小：1M以内，支持jpg、png格式</div>
        </el-form-item>

        <el-form-item label="链接地址：" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址"></el-input>
        </el-form-item>

        <el-form-item label="排序：" prop="px">
          <el-input v-model="form.px" ></el-input>
          <span class="tips">填写整数,值越大,越靠前</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;display: block;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  booksClassifyList,
  booksAddClassify,
  booksGetClassify,
  booksEditClassify,
  booksDelClassify,
  booksPxClassify
} from '@/api/modules/video'

export default {
  name: 'CategoryList',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '添加分类',
      isEdit: false,
      editId: null,
      form: {
        pid: 0,
        name: '',
        tbimg: '',
        url: '',
        px: 50
      },
      formRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      },
      tableData: [],
      parentOptions: []  // 上级分类选项（一级分类）
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
        const res = await booksClassifyList({})
        if (res.code === 200) {
          this.tableData = this.buildTree(res.data.list || [])
          // 构建上级分类选项（只取一级分类）
          this.parentOptions = (res.data.list || []).filter(item => item.flags === 1)
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

    // 构建树形结构
    buildTree(list) {
      const tree = []
      const map = {}

      list.forEach(item => {
        map[item.id] = { ...item, children: [] }
      })

      list.forEach(item => {
        if (item.pid === 0) {
          tree.push(map[item.id])
        } else if (map[item.pid]) {
          map[item.pid].children.push(map[item.id])
        }
      })

      return tree
    },

    // 获取父级名称
    getParentName(pid) {
      const parent = this.parentOptions.find(item => item.id === pid)
      return parent ? parent.name : ''
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },

    // 添加分类
    addPro() {
      this.dialogTitle = '添加分类'
      this.isEdit = false
      this.editId = null
      this.form = {
        pid: 0,
        name: '',
        tbimg: '',
        url: '',
        px: 50
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    // 添加子分类
    addSub(row) {
      this.dialogTitle = '添加子分类'
      this.isEdit = false
      this.editId = null
      this.form = {
        pid: row.id,
        name: '',
        tbimg: '',
        url: '',
        px: 50
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    // 编辑分类
    async handleEdit(row) {
      this.dialogTitle = '修改分类'
      this.isEdit = true
      this.editId = row.id

      try {
        const res = await booksGetClassify({ id: row.id })
        if (res.code === 200) {
          this.form = {
            pid: res.data.pid,
            name: res.data.name,
            tbimg: res.data.tbimg || '',
            url: res.data.url || '',
            px: res.data.px
          }
          this.dialogVisible = true
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

    // 提交表单
    async submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.submitLoading = true
        try {
          const submitData = {
            pid: this.form.pid,
            name: this.form.name,
            url: this.form.url || '',
            tbimg: this.form.tbimg || '',
            px: this.form.px
          }

          let res
          if (this.isEdit) {
            submitData.id = this.editId
            res = await booksEditClassify(submitData)
          } else {
            res = await booksAddClassify(submitData)
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
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除分类
    handleDelete(id) {
      this.$confirm('确认删除该分类吗？删除后可能影响子分类，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelClassify({ ids: id })
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
        const res = await booksPxClassify({ id, px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.getList()
        }
      } catch (error) {
        console.error('排序修改失败:', error)
        this.$message.error('排序修改失败')
        this.getList()
      }
    },

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
      formData.append('file_url', 'upload/tsproduct')
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

        if (response.data.status === 200 && response.data.data) {
          this.form.tbimg = response.data.data
          this.$message.success('图片上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200 && error.response?.data?.data) {
          this.form.tbimg = error.response.data.data
          this.$message.success('图片上传成功')
        } else {
          console.error('图片上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
        }
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
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.cateGorys .el-table__cell .cell {
  display: flex;
  align-items: center;
}

.list-container .search-card {
  margin-bottom: 20px;
}

.category-name {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.category-name .first-level {
  font-weight: bold;
}

.category-name .first-level i {
  margin-right: 5px;
  color: #e6a23c;
}

.category-name .second-level {
  margin-left: 0;
}

.category-name .second-level i {
  margin-right: 5px;
  color: #909399;
}

.no-image {
  color: #999;
  font-size: 12px;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  display: block;
  object-fit: cover;
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
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

.tips {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
</style>