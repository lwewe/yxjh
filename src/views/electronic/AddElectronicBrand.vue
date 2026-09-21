<template>
  <div class="electricbrands">
    <el-card class="add-card">
       

      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="120px" class="mt10">
        <!-- 品牌类型 -->
        <el-form-item label="品牌类型：" prop="type">
          <el-radio-group v-model="productForm.type">
            <el-radio :label="1">咖啡</el-radio>
            <el-radio :label="2">蛋糕</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 品牌名称 -->
        <el-form-item label="品牌名称：" prop="title">
          <el-input v-model="productForm.title" placeholder="请输入品牌名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="productForm.px" style="width: 500px;"></el-input>
          <span style="color: #999; margin-left: 10px;">填写整数,值越大,越靠前</span>
        </el-form-item>

        <!-- 颜色 -->
        <el-form-item label="颜色：" prop="yanse">
          <el-input v-model="productForm.yanse" placeholder="请输入颜色值，如：#FFD3D3" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- LOGO上传 -->
        <el-form-item label="LOGO：" prop="img">
          <el-upload 
            class="avatar-uploader" 
            action=""
            :auto-upload="true"
            :show-file-list="false" 
            :http-request="customLogoUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.img" :src="productForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">尺寸：160*160，大小：1M以内</div>
        </el-form-item>

        <!-- Banner上传 -->
        <el-form-item label="Banner：" prop="banner">
          <el-upload 
            class="avatar-uploader" 
            action=""
            :auto-upload="true"
            :show-file-list="false" 
            :http-request="customBannerUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.banner" :src="productForm.banner" class="avatar banner-avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-tip">尺寸：750*300，大小：1M以内</div>
        </el-form-item>

        <!-- 背景图上传 -->
        <el-form-item label="背景图：" prop="bgimg">
          <el-upload 
            class="avatar-uploader bg-upload" 
            action=""
            :auto-upload="true"
            :show-file-list="false" 
            :http-request="customBgUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.bgimg" :src="productForm.bgimg" class="avatar bg-avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon bg-icon"></i>
          </el-upload>
          <div class="upload-tip">尺寸：512*308，大小：1M以内</div>
        </el-form-item>

        <!-- 品牌介绍 -->
        <el-form-item label="品牌介绍：" prop="introduce">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 300px; overflow-y: hidden;" v-model="productForm.introduce"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleEditorCreated" />
          </div>
        </el-form-item>

        <!-- 商品详情/流程 -->
        <el-form-item label="商品详情/流程：" prop="content">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="contentEditorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 300px; overflow-y: hidden;" v-model="productForm.content"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleContentEditorCreated" />
          </div>
        </el-form-item>

        <!-- 发布状态 -->
        <el-form-item label="发布状态：" prop="sh">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 添加时间 -->
        <el-form-item label="发布时间：" prop="add_time">
          <el-date-picker v-model="productForm.add_time" type="datetime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="'12:00:00'" style="width: 500px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { addBrandcoupons, editBrandcoupons, getBrandcoupons } from '@/api/modules/login'

export default {
  name: 'AddElectronicBrand',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      brandId: null,
      submitting: false,
      uploadLoading: false,

      // 富文本编辑器
      editorRef: null,
      contentEditorRef: null,
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入品牌介绍...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },

      // 表单数据
      productForm: {
        type: 2,
        title: '',
        yanse: '#FFD3D3',
        add_time: '',
        sh: 1,
        px: 50,
        img: '',
        banner: '',
        bgimg: '',
        introduce: '',
        content: ''
      },

      // 表单验证规则
      rules: {
        type: [
          { required: true, message: '请选择品牌类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { max: 50, message: '品牌名称不能超过50个字符', trigger: 'blur' }
        ],
        px: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        yanse: [
          { required: true, message: '请输入颜色', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传LOGO', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.brandId = parseInt(id)
      this.getBrandDetail()
    }
    if (!this.productForm.add_time) {
      this.setDefaultTime()
    }
  },
  beforeDestroy() {
    if (this.editorRef && this.editorRef.destroy) {
      this.editorRef.destroy()
    }
    if (this.contentEditorRef && this.contentEditorRef.destroy) {
      this.contentEditorRef.destroy()
    }
  },
  methods: {
    setDefaultTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      this.productForm.add_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    async getBrandDetail() {
      try {
        const res = await getBrandcoupons({ id: this.brandId })
        if (res.code === 200) {
          const data = res.data
          this.productForm = {
            type: data.type || 2,
            title: data.title || '',
            yanse: data.yanse || '#FFD3D3',
            add_time: this.formatDateTime(data.add_time) || this.setDefaultTime(),
            sh: data.sh !== undefined ? data.sh : 1,
            px: data.px || 50,
            img: data.img || '',
            banner: data.banner || '',
            bgimg: data.bgimg || '',
            introduce: data.introduce || '',
            content: data.content || ''
          }
        } else {
          this.$message.error(res.msg || '获取品牌详情失败')
          this.goBack()
        }
      } catch (error) {
        console.error('获取品牌详情失败:', error)
        this.$message.error('获取品牌详情失败')
        this.goBack()
      }
    },

    formatDateTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    handleEditorCreated(editor) {
      this.editorRef = editor
    },

    handleContentEditorCreated(editor) {
      this.contentEditorRef = editor
    },

    // 富文本编辑器图片上传
    async handleWangEditorUpload(file, insertFn) {
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'couponsbrand/brand')
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
          insertFn(response.data.data)
          this.$message.success('图片上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          insertFn(error.response.data.data)
          this.$message.success('图片上传成功')
        } else {
          this.$message.error('上传失败，请稍后重试')
        }
      }
    },

    // LOGO上传
    async customLogoUpload(options) {
      const { file, onSuccess, onError } = options
      
      // 显示上传中提示
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
      formData.append('file_url', 'couponsbrand/brand')
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
          this.productForm.img = response.data.data
          this.$message.success('LOGO上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.productForm.img = error.response.data.data
          this.$message.success('LOGO上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('LOGO上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

    // Banner上传
    async customBannerUpload(options) {
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
      formData.append('file_url', 'couponsbrand/brand')
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
          this.productForm.banner = response.data.data
          this.$message.success('Banner上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.productForm.banner = error.response.data.data
          this.$message.success('Banner上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('Banner上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

    // 背景图上传
    async customBgUpload(options) {
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
      formData.append('file_url', 'couponsbrand/brand')
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
          this.productForm.bgimg = response.data.data
          this.$message.success('背景图上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.productForm.bgimg = error.response.data.data
          this.$message.success('背景图上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('背景图上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

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

    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true
          try {
            const submitData = { ...this.productForm }

            let res
            if (this.isEdit) {
              submitData.id = this.brandId
              res = await editBrandcoupons(submitData)
            } else {
              res = await addBrandcoupons(submitData)
            }

            if (res.code === 200) {
              this.$message.success(this.isEdit ? '修改成功' : '添加成功')
              this.goBack()
            } else {
              this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
            }
          } catch (error) {
            console.error('提交失败:', error)
            this.$message.error(this.isEdit ? '修改失败' : '添加失败')
          } finally {
            this.submitting = false
          }
        } else {
          this.$message.error('请填写必填项')
        }
      })
    },

    goBack() {
      this.$router.push({ name: 'ElectronicBrand' }).catch(err => {})
    }
  }
}
</script>

<style>
.sps.el-table thead .el-table__cell {
  padding: 0px 0 !important;
}
</style>

<style lang="scss" scoped>
.electricbrands {
  text-align: left;

  .add-card {
    .mt10 {
      margin-top: 10px;
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
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }

      .avatar {
        width: 120px;
        height: 120px;
        display: block;
        object-fit: cover;
      }
    }

    .banner-avatar {
      width: 200px;
      height: 80px;
    }

    .bg-upload {
      :deep(.avatar-uploader-icon) {
        width: 200px;
        height: 120px;
        line-height: 120px;
      }

      .bg-avatar {
        width: 200px;
        height: 120px;
        object-fit: contain;
      }
    }

    .upload-tip {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }

    .wangeditor-box {
      width: 90%;
    }
  }
}
</style>