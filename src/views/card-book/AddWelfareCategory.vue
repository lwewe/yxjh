<template>
  <div class="addcardbookcategory">
    <el-card class="add-card">

      <el-form :model="brandForm" ref="brandForm" label-width="150px" class="brand-form mt10">
        <!-- 模板选择 -->
        <el-form-item label="模板：" prop="mb_id">
          <el-select v-model="brandForm.mb_id" @change="handleMbChange" placeholder="请选择模板" style="width: 500px;">
            <el-option label="模板一" :value="1"></el-option>
            <el-option label="模板二" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item label="标题：" prop="title">
          <el-input v-model="brandForm.title" placeholder="请输入标题" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 名称字体颜色 -->
        <el-form-item label="名称字体颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.titfontcolor"></el-color-picker>
          <el-input v-model="brandForm.titfontcolor" placeholder="#27639b"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 名称背景颜色 -->
        <el-form-item label="名称背景颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.titbgcolor"></el-color-picker>
          <el-input v-model="brandForm.titbgcolor" placeholder="#b3d7fb"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- banner上传 -->
        <el-form-item label="banner：">
          <el-upload class="avatar-uploader" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'banner')" :before-upload="beforeUpload">
            <img v-if="brandForm.banner" :src="brandForm.banner" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="dangerCl">尺寸：1125*1206 大小：1M以内</span>
        </el-form-item>
        <!-- 分类字体颜色 -->
        <el-form-item label="分类字体颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.flmrfontcolor"></el-color-picker>
          <el-input v-model="brandForm.flmrfontcolor" placeholder="#666666"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 分类背景颜色 -->
        <el-form-item label="分类背景颜色：" class="flexBox">
          <el-color-picker v-model="brandForm.flmrbgcolor"></el-color-picker>
          <el-input v-model="brandForm.flmrbgcolor" placeholder="#ffffff"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 选中分类字体 -->
        <el-form-item label="选中分类字体：" class="flexBox">
          <el-color-picker v-model="brandForm.xzflfontcolor"></el-color-picker>
          <el-input v-model="brandForm.xzflfontcolor" placeholder="#ffffff"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 选中分类背景 -->
        <el-form-item label="选中分类背景：" class="flexBox">
          <el-color-picker v-model="brandForm.xzflbgcolor"></el-color-picker>
          <el-input v-model="brandForm.xzflbgcolor" placeholder="#3ea5ff"
            style="width: 150px; margin-left: 10px;"></el-input>
        </el-form-item>

        <!-- 米面粮油 -->
        <el-form-item label="米面粮油：">
          <el-upload class="avatar-uploader-small" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'img')" :before-upload="beforeUpload">
            <img v-if="brandForm.img" :src="brandForm.img" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
          </el-upload>
          <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
        </el-form-item>

        <!-- 休闲零食 -->
        <el-form-item label="休闲零食：">
          <el-upload class="avatar-uploader-small" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'img1')" :before-upload="beforeUpload">
            <img v-if="brandForm.img1" :src="brandForm.img1" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
          </el-upload>
          <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
        </el-form-item>

        <!-- 清洁洗护 -->
        <el-form-item label="清洁洗护：">
          <el-upload class="avatar-uploader-small" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'img2')" :before-upload="beforeUpload">
            <img v-if="brandForm.img2" :src="brandForm.img2" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
          </el-upload>
          <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
        </el-form-item>

        <!-- 悦享生活 -->
        <el-form-item label="悦享生活：">
          <el-upload class="avatar-uploader-small" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'img3')" :before-upload="beforeUpload">
            <img v-if="brandForm.img3" :src="brandForm.img3" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
          </el-upload>
          <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
        </el-form-item>

        <!-- 严选好物 -->
        <el-form-item label="严选好物：">
          <el-upload class="avatar-uploader-small" action="" :auto-upload="true" :show-file-list="false"
            :http-request="file => customUpload(file, 'img4')" :before-upload="beforeUpload">
            <img v-if="brandForm.img4" :src="brandForm.img4" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
          </el-upload>
          <span class="dangerCl">尺寸：621*147 大小：1M以内</span>
        </el-form-item>


        <!-- 模板一专属字段 -->
        <template v-if="brandForm.mb_id === 1">
          <el-form-item label="背景图：">
            <el-upload class="avatar-uploader" action="" :auto-upload="true" :show-file-list="false"
              :http-request="file => customUpload(file, 'bgimg')" :before-upload="beforeUpload">
              <img v-if="brandForm.bgimg" :src="brandForm.bgimg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="dangerCl">尺寸：1125*969 大小：1M以内</span>
          </el-form-item>

          <el-form-item label="背景颜色：" class="flexBox">
            <el-color-picker v-model="brandForm.bgcolor"></el-color-picker>
            <el-input v-model="brandForm.bgcolor" placeholder="#b4d7fb"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>
        </template>

        <!-- 模板二专属字段 -->
        <template v-if="brandForm.mb_id === 2">
          <el-form-item label="整体背景颜色：" class="flexBox">
            <el-color-picker v-model="brandForm.ztbgcolor"></el-color-picker>
            <el-input v-model="brandForm.ztbgcolor" placeholder="#c5e6bb"
              style="width: 150px; margin-left: 10px;"></el-input>
            <span style="margin: 0 10px;">-</span>
            <el-color-picker v-model="brandForm.ztbgcolor1"></el-color-picker>
            <el-input v-model="brandForm.ztbgcolor1" placeholder="#f3fbf1"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>

          <el-form-item label="分类背景颜色：" class="flexBox">
            <el-color-picker v-model="brandForm.flbgcolor"></el-color-picker>
            <el-input v-model="brandForm.flbgcolor" placeholder="#fbfdfc"
              style="width: 150px; margin-left: 10px;"></el-input>
            <span style="margin: 0 10px;">-</span>
            <el-color-picker v-model="brandForm.flbgcolor1"></el-color-picker>
            <el-input v-model="brandForm.flbgcolor1" placeholder="#e8ffea"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>

          <el-form-item label="分类框阴影：" class="flexBox">
            <el-color-picker v-model="brandForm.flyycolor"></el-color-picker>
            <el-input v-model="brandForm.flyycolor" placeholder="#abd2a5"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>

          <el-form-item label="产品框阴影：" class="flexBox">
            <el-color-picker v-model="brandForm.cpyycolor"></el-color-picker>
            <el-input v-model="brandForm.cpyycolor" placeholder="#ddf2de"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>

          <el-form-item label="产品标题背景：" class="flexBox">
            <el-color-picker v-model="brandForm.cpbtbgcolor"></el-color-picker>
            <el-input v-model="brandForm.cpbtbgcolor" placeholder="#f2fdf2"
              style="width: 150px; margin-left: 10px;"></el-input>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
          <!-- <el-button @click="resetForm">重置</el-button> -->
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { addTuji, getTuji, editTuji } from '@/api/modules/kcard'

export default {
  name: 'BrandAdd',
  data() {
    return {
      isEdit: false,
      editId: null,
      submitLoading: false,

      brandForm: {
        mb_id: 2,
        title: '',
        titfontcolor: '#27639b',
        titbgcolor: '#b3d7fb',
        banner: '',
        flmrfontcolor: '#666666',
        flmrbgcolor: '#ffffff',
        xzflfontcolor: '#ffffff',
        xzflbgcolor: '#3ea5ff',
        img: '',
        img1: '',
        img2: '',
        img3: '',
        img4: '',
        bgimg: '',
        bgcolor: '#b4d7fb',
        ztbgcolor: '#c5e6bb',
        ztbgcolor1: '#f3fbf1',
        flbgcolor: '#fbfdfc',
        flbgcolor1: '#e8ffea',
        flyycolor: '#abd2a5',
        cpyycolor: '#ddf2de',
        cpbtbgcolor: '#f2fdf2'
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
    // ========== 获取详情（编辑模式） ==========
    async getDetail(id) {
      try {
        const res = await getTuji({ id: id.toString() })
        if (res.code === 200) {
          const data = res.data
          this.brandForm = {
            mb_id: data.mb_id || 2,
            title: data.title || '',
            titfontcolor: data.titfontcolor || '#27639b',
            titbgcolor: data.titbgcolor || '#b3d7fb',
            banner: data.banner || '',
            flmrfontcolor: data.flmrfontcolor || '#666666',
            flmrbgcolor: data.flmrbgcolor || '#ffffff',
            xzflfontcolor: data.xzflfontcolor || '#ffffff',
            xzflbgcolor: data.xzflbgcolor || '#3ea5ff',
            img: data.img || '',
            img1: data.img1 || '',
            img2: data.img2 || '',
            img3: data.img3 || '',
            img4: data.img4 || '',
            bgimg: data.bgimg || '',
            bgcolor: data.bgcolor || '#b4d7fb',
            ztbgcolor: data.ztbgcolor || '#c5e6bb',
            ztbgcolor1: data.ztbgcolor1 || '#f3fbf1',
            flbgcolor: data.flbgcolor || '#fbfdfc',
            flbgcolor1: data.flbgcolor1 || '#e8ffea',
            flyycolor: data.flyycolor || '#abd2a5',
            cpyycolor: data.cpyycolor || '#ddf2de',
            cpbtbgcolor: data.cpbtbgcolor || '#f2fdf2'
          }
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        this.$message.error('获取详情失败')
        console.error('获取详情失败:', error)
      }
    },

    // ========== 模板切换 ==========
    handleMbChange(val) {
      console.log('模板切换:', val)
    },

    // ========== 自定义上传 ==========
    async customUpload(options, field) {
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
      formData.append('file_url', 'kahao/tuji')
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
          this.brandForm[field] = response.data.data
          this.$message.success('上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.brandForm[field] = error.response.data.data
          this.$message.success('上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

    // ========== 上传前校验 ==========
    beforeUpload(file) {
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

    // ========== 构建提交参数 ==========
    buildSubmitParams() {
      const form = this.brandForm
      const params = {
        mb_id: form.mb_id,
        title: form.title,
        titfontcolor: form.titfontcolor,
        titbgcolor: form.titbgcolor,
        banner: form.banner,
        flmrfontcolor: form.flmrfontcolor,
        flmrbgcolor: form.flmrbgcolor,
        xzflfontcolor: form.xzflfontcolor,
        xzflbgcolor: form.xzflbgcolor,
        img: form.img,
        img1: form.img1,
        img2: form.img2,
        img3: form.img3,
        img4: form.img4
      }

      if (form.mb_id === 1) {
        params.bgimg = form.bgimg
        params.bgcolor = form.bgcolor
      } else {
        params.ztbgcolor = form.ztbgcolor
        params.ztbgcolor1 = form.ztbgcolor1
        params.flbgcolor = form.flbgcolor
        params.flbgcolor1 = form.flbgcolor1
        params.flyycolor = form.flyycolor
        params.cpyycolor = form.cpyycolor
        params.cpbtbgcolor = form.cpbtbgcolor
      }

      if (this.isEdit) {
        params.id = this.editId
      }

      return params
    },

    // ========== 提交表单 ==========
    async submitForm() {
      if (!this.brandForm.title) {
        this.$message.warning('请输入标题')
        return
      }

      this.submitLoading = true
      try {
        const params = this.buildSubmitParams()
        console.log('提交数据:', params)

        let res
        if (this.isEdit) {
          res = await editTuji(params)
        } else {
          res = await addTuji(params)
        }

        if (res.code === 200) {
          this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
          setTimeout(() => {
            this.goBack()
          }, 500)
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (error) {
        this.$message.error('保存失败')
        console.error('保存失败:', error)
      } finally {
        this.submitLoading = false
      }
    },

    // ========== 重置表单 ==========
    resetForm() {
      if (this.isEdit) {
        this.getDetail(this.editId)
      } else {
        this.brandForm = {
          mb_id: 2,
          title: '',
          titfontcolor: '#27639b',
          titbgcolor: '#b3d7fb',
          banner: '',
          flmrfontcolor: '#666666',
          flmrbgcolor: '#ffffff',
          xzflfontcolor: '#ffffff',
          xzflbgcolor: '#3ea5ff',
          img: '', img1: '', img2: '', img3: '', img4: '',
          bgimg: '', bgcolor: '#b4d7fb',
          ztbgcolor: '#c5e6bb', ztbgcolor1: '#f3fbf1',
          flbgcolor: '#fbfdfc', flbgcolor1: '#e8ffea',
          flyycolor: '#abd2a5', cpyycolor: '#ddf2de', cpbtbgcolor: '#f2fdf2'
        }
      }
    },

    // ========== 返回列表 ==========
    goBack() {
      this.$router.push({ name: 'CardBookCategory' }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    }
  }
}
</script>

<style>
.addcardbookcategory .flexBox .el-form-item__content {
  display: flex;
}
</style>

<style lang="scss" scoped>
.addcardbookcategory {
  .add-card {
    .page-title {
      text-align: left;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 0;
        color: #303133;
      }
    }

    .brand-form {
      text-align: left;

      .dangerCl {
        color: #f56c6c;
        font-size: 12px;
        margin-left: 10px;
      }

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
          height: 100px;
          line-height: 100px;
          text-align: center;
        }

        .avatar-small {
          width: 199px;
          height: 100px;
          display: block;
          object-fit: contain;
        }
      }
    }
  }
}
</style>