<template>
  <div class="brand-add-container">
    <el-card class="add-card">
      <el-form :model="brandForm" ref="brandForm" label-width="150px" class="brand-form mt10">
        <!-- 模板选择 -->
        <el-form-item label="模板：" prop="mb_id">
          <el-select v-model="brandForm.mb_id" @change="showmb" placeholder="请选择模板" style="width: 500px;">
            <el-option label="模板一" :value="1"></el-option>
            <el-option label="模板二" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item label="标题：" prop="title">
          <el-input v-model="brandForm.title" placeholder="标题" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- banner上传（通用） -->
        <el-form-item label="banner：">
          <el-upload class="avatar-uploader" action="#" :http-request="res => customUpload(res, 'banner')"
            :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="brandForm.banner" :src="brandForm.banner" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="dangerCl">尺寸：1125*1206 大小：1M以内</span>
        </el-form-item>

        <!-- 模板一：分类背景 / 模板二：方案背景 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '分类背景：' : '方案背景：'">
          <el-upload class="avatar-uploader" action="#" :http-request="res => customUpload(res, 'flbanner')"
            :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="brandForm.flbanner" :src="brandForm.flbanner" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="dangerCl">尺寸：1125*1206 大小：1M以内</span>
        </el-form-item>

        <!-- 模板一专属：5个分类图片 -->
        <template v-if="brandForm.mb_id === 1">
          <el-form-item label="米面粮油：">
            <el-upload class="avatar-uploader-small" action="#" :http-request="res => customUpload(res, 'img')"
              :show-file-list="false" :before-upload="beforeUpload">
              <img v-if="brandForm.img" :src="brandForm.img" class="avatar-small">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
          </el-form-item>

          <el-form-item label="休闲零食：">
            <el-upload class="avatar-uploader-small" action="#" :http-request="res => customUpload(res, 'img1')"
              :show-file-list="false" :before-upload="beforeUpload">
              <img v-if="brandForm.img1" :src="brandForm.img1" class="avatar-small">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
          </el-form-item>

          <el-form-item label="清洁洗护：">
            <el-upload class="avatar-uploader-small" action="#" :http-request="res => customUpload(res, 'img2')"
              :show-file-list="false" :before-upload="beforeUpload">
              <img v-if="brandForm.img2" :src="brandForm.img2" class="avatar-small">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
          </el-form-item>

          <el-form-item label="悦享生活：">
            <el-upload class="avatar-uploader-small" action="#" :http-request="res => customUpload(res, 'img3')"
              :show-file-list="false" :before-upload="beforeUpload">
              <img v-if="brandForm.img3" :src="brandForm.img3" class="avatar-small">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
          </el-form-item>

          <el-form-item label="严选好物：">
            <el-upload class="avatar-uploader-small" action="#" :http-request="res => customUpload(res, 'img4')"
              :show-file-list="false" :before-upload="beforeUpload">
              <img v-if="brandForm.img4" :src="brandForm.img4" class="avatar-small">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
          </el-form-item>
        </template>

        <!-- 模板一：分类字体颜色 / 模板二：方案字体颜色 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '分类字体颜色：' : '方案字体颜色：'" class="flexBox">
          <el-color-picker v-model="brandForm.flmrfontcolor"></el-color-picker>
          <el-input v-model="brandForm.flmrfontcolor" placeholder="#666666" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 模板一：选中分类字体 / 模板二：选中分类颜色 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '选中分类字体：' : '选中分类颜色：'" class="flexBox">
          <el-color-picker v-model="brandForm.xzflfontcolor"></el-color-picker>
          <el-input v-model="brandForm.xzflfontcolor" placeholder="#ffffff" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 模板一：分类边框颜色 / 模板二：分类颜色 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '分类边框颜色：' : '分类颜色：'" class="flexBox">
          <el-color-picker v-model="brandForm.flbkbgcolor"></el-color-picker>
          <el-input v-model="brandForm.flbkbgcolor" placeholder="#62B447" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 模板一：产品框阴影 / 模板二：分类选中背景颜色 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '产品框阴影：' : '分类选中背景颜色：'" class="flexBox">
          <el-color-picker v-model="brandForm.cpkbgcolor"></el-color-picker>
          <el-input v-model="brandForm.cpkbgcolor" placeholder="#A7DB9F" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 模板一：背景图 / 模板二：分类背景图 -->
        <el-form-item :label="brandForm.mb_id === 1 ? '背景图：' : '分类背景图：'">
          <el-upload class="avatar-uploader" action="#" :http-request="res => customUpload(res, 'bgimg')" 
            :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="brandForm.bgimg" :src="brandForm.bgimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="dangerCl">尺寸：1125*969 大小：1M以内</span>
        </el-form-item>

        <!-- 模板一：背景颜色 / 模板二：背景颜色 -->
        <el-form-item label="背景颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.bgcolor"></el-color-picker>
          <el-input v-model="brandForm.bgcolor" placeholder="#C0E4B4" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 福利卡背景图（通用） -->
        <el-form-item label="福利卡背景图：">
          <el-upload class="avatar-uploader" action="#" :http-request="res => customUpload(res, 'flkbgimg')" 
            :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="brandForm.flkbgimg" :src="brandForm.flkbgimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="dangerCl">大小：1M以内</span>
        </el-form-item>

        <!-- 福利卡字体颜色（通用） -->
        <el-form-item label="福利卡字体颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.flkztcolor"></el-color-picker>
          <el-input v-model="brandForm.flkztcolor" placeholder="#292929" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 福利卡权益颜色（通用） -->
        <el-form-item label="福利卡权益颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.flkqyztcolor"></el-color-picker>
          <el-input v-model="brandForm.flkqyztcolor" placeholder="#2A7313" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 福利卡按钮背景色（通用） -->
        <el-form-item label="福利卡按钮背景色：" class="flexBox">
          <el-color-picker v-model="brandForm.flkbgcolor"></el-color-picker>
          <el-input v-model="brandForm.flkbgcolor" placeholder="#2A7313" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 福利卡按钮字体（通用） -->
        <el-form-item label="福利卡按钮字体：" class="flexBox">
          <el-color-picker v-model="brandForm.flkanztcolor"></el-color-picker>
          <el-input v-model="brandForm.flkanztcolor" placeholder="#ffffff" style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">{{ isEdit ? '保存修改' : '保存' }}</el-button>
          <el-button @click="resetForm">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addTuji, getTuji, editTuji } from '@/api/modules/card'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'BrandAdd',
  data() {
    return {
      isEdit: false,
      editId: '',
      submitting: false,
      brandForm: {
        mb_id: 1,
        title: '',
        banner: '',
        flbanner: '',
        img: '',
        img1: '',
        img2: '',
        img3: '',
        img4: '',
        flmrfontcolor: '#666666',
        xzflfontcolor: '#ffffff',
        flbkbgcolor: '#62B447',
        cpkbgcolor: '#A7DB9F',
        bgimg: '',
        bgcolor: '#C0E4B4',
        flkbgimg: '',
        flkztcolor: '#292929',
        flkqyztcolor: '#2A7313',
        flkbgcolor: '#2A7313',
        flkanztcolor: '#ffffff'
      }
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id && id > 0) {
      this.isEdit = true
      this.editId = id
      this.getDetail(id)
    }
  },
  methods: {
    showmb(val) {
      // 切换模板时，清空对应字段
      if (val === 2) {
        // 切换到模板二，清空模板一专属字段
        this.brandForm.img = ''
        this.brandForm.img1 = ''
        this.brandForm.img2 = ''
        this.brandForm.img3 = ''
        this.brandForm.img4 = ''
      }
    },

    async getDetail(id) {
      try {
        const res = await getTuji({ id })
        if (res.code === 200) {
          const data = res.data
          this.brandForm = {
            mb_id: data.mb_id || 1,
            title: data.title || '',
            banner: data.banner || '',
            flbanner: data.flbanner || '',
            img: data.img || '',
            img1: data.img1 || '',
            img2: data.img2 || '',
            img3: data.img3 || '',
            img4: data.img4 || '',
            flmrfontcolor: data.flmrfontcolor || '#666666',
            xzflfontcolor: data.xzflfontcolor || '#ffffff',
            flbkbgcolor: data.flbkbgcolor || '#62B447',
            cpkbgcolor: data.cpkbgcolor || '#A7DB9F',
            bgimg: data.bgimg || '',
            bgcolor: data.bgcolor || '#C0E4B4',
            flkbgimg: data.flkbgimg || '',
            flkztcolor: data.flkztcolor || '#292929',
            flkqyztcolor: data.flkqyztcolor || '#2A7313',
            flkbgcolor: data.flkbgcolor || '#2A7313',
            flkanztcolor: data.flkanztcolor || '#ffffff'
          }
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      }
    },

    async customUpload(options, field) {
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
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        if (response.data.status === 200) {
          this.brandForm[field] = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.brandForm[field] = error.response.data.data
          this.$message.success('上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    async submitForm() {
      if (!this.brandForm.title) {
        this.$message.warning('请输入标题')
        return
      }

      this.submitting = true
      try {
        const params = { ...this.brandForm }
        if (this.isEdit) {
          params.id = this.editId
        }

        const apiMethod = this.isEdit ? editTuji : addTuji
        const res = await apiMethod(params)

        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$router.back()
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      // this.$router.push({ name: 'WelfareCategory' }).catch(err => { })
      this.$router.push({ name: 'WelfareCategory', query: { refresh: Date.now() } }).catch(err => { })
    }
  }
}
</script>

<style>
.brand-add-container .flexBox .el-form-item__content {
  display: flex;
}
</style>

<style lang="scss" scoped>
.brand-add-container {
  .add-card {
    .brand-form {
      text-align: left;

      .avatar-uploader {
        :deep(.el-upload) {
           border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: #409EFF;
          }
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 199px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }

        .avatar {
          width: 199px;
          height: 100px;
          display: block;
          object-fit: contain;
        }
      }

      .avatar-uploader-small {
        :deep(.el-upload) {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: #409EFF;
          }
        }

        .avatar-uploader-icon-small {
          font-size: 20px;
          color: #8c939d;
          width: 199px;
          height: 60px;
          line-height: 60px;
          text-align: center;
        }

        .avatar-small {
          width: 199px;
          height: 60px;
          object-fit: contain;
          display: block;
        }
      }

      .dangerCl {
        color: #999;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
}
</style>