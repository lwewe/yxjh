<template>
  <div class="list-container-aux ">
    <el-card class="formsTop">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w130">
            <el-option label="位置" value="name"></el-option>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w100">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="handleReset()">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog :title="isEdit ? '修改广告位' : '新增广告位'" :visible.sync="dialogVisible" width="50%"
      :before-close="handleClose">
      <div style="width: 80%; margin: auto;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right">
          <el-form-item label="图片位置：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="图片：" style="text-align: left;">
            <div style="display: flex; line-height: 20px;">
              <el-upload class="avatar-uploader" action="#" :http-request="customUpload" :show-file-list="false"
                :before-upload="beforeUpload">
                <img v-if="form.img" :src="form.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="margin-left: 10px;">尺寸：{{ form.cc || '512*345' }},大小：1M以内.</span>
            </div>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-date-picker v-model="form.add_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;" />
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
      <!-- <div class="txtleft mb10">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAdd">新增广告</el-button>
      </div> -->

      <el-table :data="tableData" border v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="缩略图" min-width="140" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.img" :src="scope.row.img" style="width: 90px; height: 60px; object-fit: contain;"
              alt="">
          </template>
        </el-table-column>
        <el-table-column label="图片位置" min-width="180" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="标题" min-width="150" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="尺寸" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.cc }}</template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="170" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
import { bannerList, getBanner, editBanner } from '@/api/modules/myorder'

export default {
  name: 'BannerList',
  data() {
    return {
      loading: false,
      submitting: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      isEdit: false,
      searchForm: { search_key: 'name', search_val: '', px_key: 'id', px_val: 'desc' },
      form: { id: '', name: '', title: '', img: '', add_time: '', cc: '' },
      rules: {
        name: [{ required: true, message: '请输入图片位置', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      dialogVisible: false,
      tableData: []
    }
  },
  mounted() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await bannerList({
          page: this.currentPage, limit: this.pageSize,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val || '',
          px_key: this.searchForm.px_key, px_val: this.searchForm.px_val
        })
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        }
      } catch (error) { console.error('获取列表失败:', error) }
      finally { this.loading = false }
    },
    handleSearch() { this.currentPage = 1; this.loadData() },
    handleReset() {
      this.searchForm = { search_key: 'name', search_val: '', px_key: 'id', px_val: 'desc' }
      this.currentPage = 1; this.loadData()
    },
    handlePageChange(page) { this.currentPage = page; this.loadData() },

    openAdd() {
      this.isEdit = false
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      this.form = {
        id: '', name: '', title: '', img: '', cc: '',
        add_time: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      }
      this.dialogVisible = true
    },
    async openEdit(row) {
      this.isEdit = true
      try {
        const res = await getBanner({ id: row.id })
        if (res.code === 200) {
          const data = res.data
          if (data.add_time && typeof data.add_time === 'number') {
            const d = new Date(data.add_time * 1000)
            const pad = n => String(n).padStart(2, '0')
            data.add_time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
          }
          this.form = { ...data }
        }
      } catch (error) { this.$message.error('获取详情失败') }
      this.dialogVisible = true
    },
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/banner')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)
      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post', data: formData,
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        if (response.data.code === 200 || response.data.status === 200) {
          this.form.img = response.data.data
          this.$message.success('上传成功')
        } else { this.$message.error(response.data.msg || '上传失败') }
      } catch (error) {
        if (error.response?.data?.code === 200) { this.form.img = error.response.data.data; this.$message.success('上传成功') }
        else { this.$message.error('上传失败') }
      }
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) { this.$message.error('图片大小不能超过 1MB!'); return false }
      return true
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.submitting = true
        try {
          const res = await editBanner(this.form)
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.dialogVisible = false
            this.loadData()
          } else { this.$message.error(res.msg || '保存失败') }
        } catch (error) { this.$message.error('保存失败') }
        finally { this.submitting = false }
      })
    },
    handleClose() { this.dialogVisible = false },
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }
  }
}
</script>
<style>
.list-container-aux  .formsTop .el-card__body {
  padding: 20px 20px 0 20px;
}

</style>
<style scoped>
.list-container-aux {
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

.w130 {
  width: 130px;
}

.w150 {
  width: 150px;
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

.search-card {
  margin-bottom: 20px;
}
</style>