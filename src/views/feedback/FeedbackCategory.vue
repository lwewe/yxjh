<template>
  <div class="list-container-feedback ">
    <el-card class="formsTop">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <!-- 位置 -->
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="位置" class="w120" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="栏目1" value="1"></el-option>
            <el-option label="栏目2" value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 搜索字段 -->
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
            <el-option label="标题" value="title"></el-option>
            <el-option label="介绍" value="content"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 关键词 -->
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
        </el-form-item>

        <!-- 排序字段 -->
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 排序方式 -->
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w100">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <!-- 发布状态 -->
        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
            <el-option label="全部" value="status"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="handleReset()">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加/修改弹窗 -->
    <el-dialog :title="isEdit ? '修改分类' : '添加分类'" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div style="width: 80%; margin: auto;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right"
          style="text-align: left;">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="位置：" prop="pid">
            <el-select v-model="form.pid" placeholder="请选择位置" style="width: 100%;">
              <el-option label="栏目1" :value="1"></el-option>
              <el-option label="栏目2" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="介绍：">
            <el-input v-model="form.content" type="textarea" :rows="3"></el-input>
          </el-form-item>

          <el-form-item label="排序：">
            <el-input v-model="form.px" placeholder="填写整数,值越大,越靠前."></el-input>
          </el-form-item>

          <el-form-item label="添加时间：">
            <el-date-picker v-model="form.add_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="图片：" style="text-align: left;">
            <div style="display: flex; line-height: 20px;">
              <el-upload class="avatar-uploader" action="#" :http-request="customUpload" :show-file-list="false"
                :before-upload="beforeUpload">
                <img v-if="form.img" :src="form.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="margin-left: 10px;">尺寸：33*33,大小：1M以内.</span>
            </div>
          </el-form-item>

          <el-form-item label="是否发布：">
            <el-radio-group v-model="form.sh">
              <el-radio :label="1">发布</el-radio>
              <el-radio :label="0">不发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-card class="search-card mt20">
      <div class="txtleft mb10">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete">
          批量删除 ({{ multipleSelection.length }})
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAdd">添加分类</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="编号"  min-width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>

        <el-table-column label="排序" min-width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" style="width: 60px;" @blur="updatePx(scope.row)"
              @keyup.enter.native="updatePx(scope.row)">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="图片"  min-width="100" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.img" :src="scope.row.img" style="width: 40px; height: 40px; object-fit: contain;"
              alt="">
          </template>
        </el-table-column>

        <el-table-column label="标题"  min-width="200" align="left">
          <template slot-scope="scope">
            <span :class="scope.row.pid == 1 ? 'blueCl' : 'successCl'">[栏目{{ scope.row.pid }}]</span>
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="介绍" min-width="300" align="center">
          <template slot-scope="scope">{{ scope.row.content }}</template>
        </el-table-column>

        <el-table-column label="添加时间" align="center"  min-width="170">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>

        <el-table-column label="状态" align="center"  min-width="100">
          <template slot-scope="scope">
            <span :class="scope.row.sh == 1 ? 'successCl' : 'dangerCl'">
              {{ scope.row.sh == 1 ? '已发布' : '未发布' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作"  min-width="300" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openEdit(scope.row)">修改</el-button>
            <el-button size="mini" :type="scope.row.sh == 1 ? 'warning' : 'success'" @click="togglePublish(scope.row)">
              {{ scope.row.sh == 1 ? '取消发布' : '发布' }}
            </el-button>
            <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
        :current-page="currentPage" @current-change="handlePageChange">
      </el-pagination>
      <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 1 }} 页</div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { yjclassList, addYjclass, getYjclass, editYjclass, delYjclass, fbYjclass, pxYjclass } from '@/api/modules/myorder'

export default {
  name: 'FeedbackCategory',
  data() {
    return {
      uploadData: {
        file_url: 'upload/feedback/fl',
      },
      loading: false,
      submitting: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      isEdit: false,
      searchForm: {
        pid: '',
        search_key: 'title',
        search_val: '',
        px_key: 'px',
        px_val: 'desc',
        sh: 'status'
      },
      form: {
        title: '', pid: 1, content: '', px: '', add_time: '', img: '', sh: 1
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择位置', trigger: 'change' }]
      },
      dialogVisible: false,
      multipleSelection: [],
      tableData: [],

    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async updatePx(row) {
      try {
        const res = await pxYjclass({ id: row.id, px: row.px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
          this.loadData() // 恢复原值
        }
      } catch (error) {
        console.error('修改排序失败:', error)
        this.loadData()
      }
    },
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/feedback/fl')
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

        if (response.data.status === 200 || response.data.code === 200) {
          this.form.img = response.data.data
          this.$message.success('上传成功')
        } else {
          // 兼容不同返回格式
          if (response.data.code === 200) {
            this.form.img = response.data.data
            this.$message.success('上传成功')
          } else {
            this.$message.error(response.data.msg || '上传失败')
          }
        }
      } catch (error) {
        if (error.response?.data?.code === 200) {
          this.form.img = error.response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败')
        }
      }
    },

    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isImage) { this.$message.error('只能上传 JPG/PNG 格式!'); return false }
      if (!isLt1M) { this.$message.error('图片大小不能超过 1MB!'); return false }
      return true
    },

    async loadData() {
      this.loading = true
      try {
        const res = await yjclassList({
          page: this.currentPage,
          limit: this.pageSize,
          pid: this.searchForm.pid || '',
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val || '',
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          sh: this.searchForm.sh
        })
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        }
      } catch (error) {
        console.error('获取列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    handleSearch() { this.currentPage = 1; this.loadData() },

    handleReset() {
      this.searchForm = { pid: '', search_key: 'title', search_val: '', px_key: 'px', px_val: 'desc', sh: 'status' }
      this.currentPage = 1
      this.loadData()
    },

    handlePageChange(page) { this.currentPage = page; this.loadData() },

    handleSelectionChange(val) { this.multipleSelection = val },

    // openAdd - 只取日期
    openAdd() {
      this.isEdit = false
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      this.form = { title: '', pid: 1, content: '', px: '', add_time: currentDate, img: '', sh: 1 }
      this.dialogVisible = true
    },
    async openEdit(row) {
      this.isEdit = true
      try {
        const res = await getYjclass({ id: row.id })
        if (res.code === 200) {
          const data = res.data
          if (data.add_time && typeof data.add_time === 'number') {
            const date = new Date(data.add_time * 1000)
            const pad = n => String(n).padStart(2, '0')
            data.add_time = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
          }
          this.form = { ...data }
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
      this.dialogVisible = true
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.submitting = true
        try {
          const params = {
            id: this.form.id,
            title: this.form.title,
            pid: this.form.pid,
            content: this.form.content,
            px: this.form.px,
            img: this.form.img,
            sh: this.form.sh,
            add_time: this.form.add_time
          }
          // 截取日期部分
          if (params.add_time && typeof params.add_time === 'string') {
            params.add_time = params.add_time.substring(0, 10)
          }
          const api = this.isEdit ? editYjclass : addYjclass
          const res = await api(params)
          if (res.code === 200) {
            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        } finally {
          this.submitting = false
        }
      })
    },


    async togglePublish(row) {
      try {
        const res = await fbYjclass({ id: row.id })
        if (res.code === 200) {
          row.sh = res.data.sh
          this.$message.success('状态修改成功')
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    async deleteItem(id) {
      try {
        await this.$confirm('确认删除吗？', '提示', { type: 'warning' })
        const res = await delYjclass({ ids: String(id) })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        }
      } catch (error) {
        if (error !== 'cancel') this.$message.error('删除失败')
      }
    },

    async batchDelete() {
      try {
        await this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条记录吗？`, '提示', { type: 'warning' })
        const ids = this.multipleSelection.map(item => item.id).join(',')
        const res = await delYjclass({ ids })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.multipleSelection = []
          this.loadData()
        }
      } catch (error) {
        if (error !== 'cancel') this.$message.error('删除失败')
      }
    },





    handleClose() { this.dialogVisible = false },

    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }
  }
}
</script>
<style>
.list-container-feedback .formsTop .el-card__body {
  padding: 20px 20px 0 20px;
}
</style>
<style scoped>
.list-container-feedback {
  font-size: 14px;
   
}


.mt20 {
  margin-top: 20px;
}

.mb10 {
  margin-bottom: 10px;
}

.txtleft {
  text-align: left;
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

.blueCl {
  color: #409EFF;
}

.successCl {
  color: #67C23A;
}

.dangerCl {
  color: #F56C6C;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.pagination {
  background: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-info {
  font-size: 13px;
  color: #606266;
}
</style>