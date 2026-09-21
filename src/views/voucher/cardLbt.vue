<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">添加轮播图</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border v-loading="loading"
        @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" @blur="handlePxChange(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="160" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.img" :src="scope.row.img" style="width:120px;height:60px;" fit="contain" :preview-src-list="[scope.row.img]"></el-image>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="150" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="170" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" @change="handleFb(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="isEdit ? '修改轮播图' : '添加轮播图'" :visible.sync="dialogVisible" width="50%" @close="resetForm">
      <el-form :model="lbtForm" ref="lbtFormRef" label-width="100px" style="width:90%;text-align:left;">
        <el-form-item label="标题：" required>
          <el-input v-model="lbtForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="渐变颜色：">
          <el-input v-model="lbtForm.yanse1" placeholder="渐变颜色" style="width:120px;"></el-input>
          <span style="margin:0 5px;">-</span>
          <el-input v-model="lbtForm.yanse2" placeholder="渐变颜色" style="width:120px;"></el-input>
          <span  class="color666 fs12">首页背景渐变颜色</span>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="lbtForm.px" placeholder="排序"></el-input>
          <span class="color666 fs12">填写整数,值越大,越靠前</span>
        </el-form-item>
        <el-form-item label="图片：">
          <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload" :before-upload="beforeUpload">
            <img v-if="lbtForm.img" :src="lbtForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="color666 fs12">尺寸：750*240，大小：1M以内</span>
        </el-form-item>
        <el-form-item label="是否发布：">
          <el-radio-group v-model="lbtForm.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-date-picker v-model="lbtForm.add_time" type="datetime" placeholder="选择发布时间"
            value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display:block;text-align:center;">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { lbtList, addLbt, getLbt, editLbt, delLbt, lbtPx, lbtFb } from '@/api/modules/card'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'CardLbt',
  data() {
    return {
      loading: false,
      submitting: false,
      dialogVisible: false,
      isEdit: false,
      editId: '',
      kid: '',
      tableData: [],
      multipleSelection: [],
      lbtForm: {
        title: '', px: '', img: '', yanse1: '', yanse2: '', sh: 1, add_time: ''
      }
    }
  },
  mounted() {
    this.kid = this.$route.params.id || ''
    this.getList()
  },
  methods: {
    getCurrentTime() {
      const d = new Date()
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0')
    },

    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0')
    },

    async getList() {
      this.loading = true
      try {
        const res = await lbtList({ kid: this.kid })
        if (res.code === 200) {
          this.tableData = res.data.data || []
        }
      } catch (e) { this.$message.error('请求失败') }
      finally { this.loading = false }
    },

    handleSelectionChange(v) { this.multipleSelection = v },

    async handlePxChange(row) {
      try {
        await lbtPx({ id: row.id, px: row.px })
        this.$message.success('排序修改成功')
      } catch (e) { this.$message.error('修改失败') }
    },

    async handleFb(row) {
      try {
        const res = await lbtFb({ id: row.id })
        if (res.code === 200) {
          row.sh = res.data.sh
          this.$message.success(res.msg)
        }
      } catch (e) { this.getList() }
    },

    openAddDialog() {
      this.isEdit = false
      this.editId = ''
      this.lbtForm = { title: '', px: '', img: '', yanse1: '', yanse2: '', sh: 1, add_time: this.getCurrentTime() }
      this.dialogVisible = true
    },

    async openEditDialog(row) {
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await getLbt({ id: row.id })
        if (res.code === 200) {
          const d = res.data
          this.lbtForm = {
            title: d.title || '', px: d.px || '', img: d.img || '',
            yanse1: d.yanse1 || '', yanse2: d.yanse2 || '',
            sh: d.sh !== undefined ? d.sh : 1,
            add_time: d.add_time ? this.formatTime(d.add_time) : this.getCurrentTime()
          }
        }
      } catch (e) { this.$message.error('获取详情失败') }
      this.dialogVisible = true
    },

    async submitForm() {
      if (!this.lbtForm.title) return this.$message.warning('请输入标题')
      this.submitting = true
      try {
        const params = {
          kid: this.kid,
          title: this.lbtForm.title,
          px: String(this.lbtForm.px || 0),
          img: this.lbtForm.img,
          yanse1: this.lbtForm.yanse1,
          yanse2: this.lbtForm.yanse2,
          sh: String(this.lbtForm.sh),
          add_time: this.lbtForm.add_time
        }
        if (this.isEdit) params.id = this.editId

        const api = this.isEdit ? editLbt : addLbt
        const res = await api(params)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getList()
        } else { this.$message.error(res.msg) }
      } catch (e) { this.$message.error('请求失败') }
      finally { this.submitting = false }
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除吗？', '提示', { type: 'warning' })
        const res = await delLbt({ ids: row.id.toString() })
        if (res.code === 200) { this.$message.success(res.msg); this.getList() }
      } catch (e) {}
    },

    // 图片上传（品牌页面方式）
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'card')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)
      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post', data: formData,
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        if (response.data.status === 200) {
          this.lbtForm.img = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.lbtForm.img = error.response.data.data
          this.$message.success('上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isImage) { this.$message.error('只能上传图片文件！'); return false }
      if (!isLt1M) { this.$message.error('图片大小不能超过 1MB！'); return false }
      return true
    },

    resetForm() {
      this.lbtForm = { title: '', px: '', img: '', yanse1: '', yanse2: '', sh: 1, add_time: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;
  .search-card {
    margin-bottom: 20px;
  }
}
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover { border-color: #409eff; }
  }
  .avatar-uploader-icon {
    font-size: 28px; color: #8c939d;
    width: 200px; height: 100px; line-height: 100px; text-align: center;
  }
  .avatar {
    width: 200px; height: 100px; display: block; object-fit: contain;
  }
}
</style>