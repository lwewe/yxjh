<template>
  <div class="cake-add-brands">
    <el-card class="add-card">
      <el-form :model="brandForm" :rules="rules" ref="brandForm" label-width="150px" class="product-form mt10" >

        <!-- 品牌编码（编辑时显示） -->
        <el-form-item label="品牌编码：" prop="brand_id" v-if="isEdit">
          <el-input v-model="brandForm.brand_id" placeholder="品牌编码" readonly style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 供应商信息（编辑时显示） -->
        <el-form-item label="供应商：" prop="uid" v-if="isEdit">
          <el-input v-model="brandForm.supplierName" placeholder="供应商" readonly style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 开通城市（编辑时显示） -->
        <el-form-item label="开通城市：" prop="city_list" v-if="isEdit">
          <el-input type="textarea" :rows="6" v-model="brandForm.cityNames" placeholder="开通城市" readonly
            style="width: 500px;">
          </el-input>
        </el-form-item>

        <!-- 品牌名称 -->
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="brandForm.name" placeholder="请输入品牌名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 简短描述 -->
        <el-form-item label="简短描述：" prop="short_description">
          <el-input type="textarea" :rows="3" v-model="brandForm.short_description" placeholder="请输入简短描述"
            style="width: 500px;">
          </el-input>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="brandForm.px"  placeholder="请输入排序值" style="width: 500px;">
          </el-input>
          <span class="tips">填写整数,值越大,越靠前</span>
        </el-form-item>

        <!-- LOGO上传 -->


        <!-- LOGO上传 -->
        <el-form-item label="LOGO：" prop="image_path">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="customLogoUpload"
            :before-upload="beforeImageUpload">
            <img v-if="brandForm.image_path" :src="brandForm.image_path" class="avatar logo-avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fs12 tips">尺寸：240*240，大小：1M以内</span>
        </el-form-item>

        <!-- 背景图上传 -->
        <el-form-item label="背景图：" prop="bgimg" class="bg-avtar">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="customBgUpload"
            :before-upload="beforeImageUpload">
            <img v-if="brandForm.bgimg" :src="brandForm.bgimg" class="avatar bg-avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fs12 tips">尺寸：375*180，大小：1M以内</span>
        </el-form-item>

        <!-- 富文本编辑器 - 品牌详情 -->
        <el-form-item label="内容：" class="editorsnew" prop="description">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
              :mode="mode" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="brandForm.description"
              :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
          </div>
        </el-form-item>

        <!-- 是否显示 -->
        <el-form-item label="是否显示：">
          <el-radio-group v-model="brandForm.sh">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 推荐精选 -->
        <el-form-item label="推荐精选：">
          <el-radio-group v-model="brandForm.tuij">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 推荐生日蛋糕 -->
        <el-form-item label="推荐生日蛋糕：">
          <el-radio-group v-model="brandForm.srtuij">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { addBrandcake, getBrandcake, editBrandcake } from '@/api/modules/login'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default {
  name: 'AddCakeBrand',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      editId: '',
      submitLoading: false,

      editor: null,
      mode: 'default',
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入品牌介绍内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },

      wangEditorUploadQueue: [],
      isWangEditorUploading: false,

      brandForm: {
        id: '',
        brand_id:'',
        name: '',
        short_description: '',
        px: 0,
        image_path: '',
        bgimg: '',
        description: '',
        sh: 1,
        tuij: 0,
        srtuij: 0,
        uid: 0,
        supplierName: '',
        cityNames: '',
        city_list: []
      },

      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        px: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.isEdit = true
      this.editId = id
      this.getBrandDetail(id)
    }
  },
  beforeDestroy() {
    if (this.editor == null) return
    this.editor.destroy()
    this.editor = null
    this.wangEditorUploadQueue = []
    this.isWangEditorUploading = false
  },
  methods: {
    async getBrandDetail(id) {
      try {
        const res = await getBrandcake({ id: String(id) })
        if (res.code === 200) {
          const data = res.data
          let cityNames = ''
          if (data.city_list && data.city_list.length > 0) {
            cityNames = data.city_list.map(city => city.name).join('  ')
          }

          this.brandForm = {
            id: data.id || '',
            brand_id:data.brand_id  || '',
            name: data.name || '',
            short_description: data.short_description || '',
            px: data.px || 0,
            image_path: data.image_path || '',
            bgimg: data.bgimg || '',
            description: data.description || '',
            sh: data.sh !== undefined ? data.sh : 1,
            tuij: data.tuij !== undefined ? data.tuij : 0,
            srtuij: data.srtuij !== undefined ? data.srtuij : 0,
            uid: data.uid || 0,
            supplierName: data.gongyingshang ? data.gongyingshang.username : '',
            cityNames: cityNames,
            city_list: data.city_list || []
          }
        } else {
          this.$message.error(res.msg || '获取品牌详情失败')
        }
      } catch (error) {
        console.error('获取品牌详情失败:', error)
        this.$message.error('网络异常，获取品牌详情失败')
      }
    },

    onCreated(editor) {
      this.editor = editor
    },

    async handleWangEditorUpload(file, insertFn) {
      this.wangEditorUploadQueue.push({ file, insertFn })
      if (!this.isWangEditorUploading) {
        this.processWangEditorQueue()
      }
    },

    async processWangEditorQueue() {
      if (this.wangEditorUploadQueue.length === 0) {
        this.isWangEditorUploading = false
        return
      }

      this.isWangEditorUploading = true
      const { file, insertFn } = this.wangEditorUploadQueue.shift()

      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'brand/cakebrand')
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
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          insertFn(error.response.data.data)
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败，请稍后重试')
        }
      }

      this.processWangEditorQueue()
    },

    async customLogoUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'brand/cakebrand')
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
          this.brandForm.image_path = response.data.data
          this.$message.success('LOGO上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.brandForm.image_path = error.response.data.data
          this.$message.success('LOGO上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    async customBgUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'brand/cakebrand')
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
          this.brandForm.bgimg = response.data.data
          this.$message.success('背景图上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.brandForm.bgimg = error.response.data.data
          this.$message.success('背景图上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传图片文件！')
        return false
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB！')
        return false
      }
      return true
    },

    submitForm() {
      this.$refs.brandForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
          return false
        }

        this.submitLoading = true

        try {
          const submitData = {
            name: this.brandForm.name,
            short_description: this.brandForm.short_description || '',
            px: String(this.brandForm.px),
            image_path: this.brandForm.image_path || '',
            bgimg: this.brandForm.bgimg || '',
            description: this.brandForm.description || '',
            sh: String(this.brandForm.sh),
            tuij: String(this.brandForm.tuij),
            srtuij: String(this.brandForm.srtuij),
            uid: '0'
          }

          let res
          if (this.isEdit) {
            submitData.id = String(this.editId)
            res = await editBrandcake(submitData)
          } else {
            res = await addBrandcake(submitData)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            setTimeout(() => {
              this.$router.push({ name: 'CakeBrand' })
            }, 1000)
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('网络异常，提交失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    goBack() {
      this.$router.push({ name: 'CakeBrand' })
    }
  }
}
</script>

<style scoped>
.cake-add-brands {
   :deep(.avatar-uploader .el-upload ){
   border: 1px dashed #d9d9d9;  
   background-color: #ffffff;
  
}
  padding: 20px;
}

.add-card {
  text-align: center;
}

.product-form {
  text-align: left;
   
  margin: 0 auto;
}

.avatar-uploader :deep(.el-upload) {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.logo-avatar {
  width: 100px;
  height: 100px;
}

.bg-avatar {
  width: 200px;
  height: 96px;


}

.bg-avtar {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 96px;
    line-height: 96px;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 96px;
    display: block;
    object-fit: cover;
  }
}

.tips {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}

.fs12 {
  font-size: 12px;
}

.editorsnew :deep(.el-form-item__content) {
  line-height: 20px;
}
</style>