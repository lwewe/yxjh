 <template>
 <div class="directadddbrand">
    <el-card class="add-card">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="120px" class="mt10">
        <!-- 位置/品牌类型 -->
        <el-form-item label="位置：" prop="pid">
          <el-radio-group v-model="productForm.pid">
            <el-radio :label="1">直充品牌</el-radio>
            <el-radio :label="2">商城-生活服务</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item label="标题：" prop="title">
          <el-input v-model="productForm.title" placeholder="请输入标题" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="productForm.px" style="width: 500px;"></el-input>
          <span style="color: #666666; margin-left: 10px;">填写整数,值越大,越靠前.</span>
        </el-form-item>

        <!-- LOGO上传 -->
        <el-form-item label="图片：" prop="img">
          <el-upload 
            class="avatar-uploader" 
            action=""
            :auto-upload="true"
            :show-file-list="false" 
            :http-request="customUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.img" :src="productForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="color666 fs12">尺寸:160*160,大小：1M以内.</span>
        </el-form-item>

        <!-- 使用说明 -->
        <el-form-item label="使用说明：" prop="content">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 300px; overflow-y: hidden;" v-model="productForm.content"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleEditorCreated" />
          </div>
        </el-form-item>

        <!-- 是否发布 -->
        <el-form-item label="是否发布：" prop="sh">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item label="发布时间：" prop="add_time">
          <el-date-picker v-model="productForm.add_time" type="datetime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="'12:00:00'" style="width: 300px;">
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
import { addBrandZhichong, editBrandZhichong, getBrandZhichong } from '@/api/modules/zhichong'

export default {
  name: 'AddElectronicBrand',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      brandId: null,
      submitting: false,

      editorRef: null,
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入使用说明...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },

      productForm: {
        pid: 1,           // 1-直充品牌 2-商城-生活服务
        title: '',
        px: 50,
        img: '',
        content: '',
        sh: 1,            // 1-即时发布 0-暂不发布
        add_time: ''
      },

      rules: {
        pid: [
          { required: true, message: '请选择位置', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 50, message: '标题不能超过50个字符', trigger: 'blur' }
        ],
        px: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        add_time: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
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
        const res = await getBrandZhichong({ id: this.brandId })
        if (res.code === 200) {
          const data = res.data
          this.productForm = {
            pid: data.pid !== undefined ? data.pid : 1,
            title: data.title || '',
            px: data.px || 50,
            img: data.img || '',
            content: data.content || '',
            sh: data.sh !== undefined ? data.sh : 1,
            add_time: data.add_time ? this.formatDateTime(data.add_time) : ''
          }
          if (!this.productForm.add_time) {
            this.setDefaultTime()
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

    async handleWangEditorUpload(file, insertFn) {
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'zhichong/brand')
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

    async customUpload(options) {
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
      formData.append('file_url', 'zhichong/brand')
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
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.productForm.img = error.response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('上传失败:', error)
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
            const submitData = {
              pid: this.productForm.pid,
              title: this.productForm.title,
              px: this.productForm.px,
              img: this.productForm.img,
              content: this.productForm.content,
              sh: this.productForm.sh,
              add_time: this.productForm.add_time
            }

            let res
            if (this.isEdit) {
              submitData.id = this.brandId
              res = await editBrandZhichong(submitData)
            } else {
              res = await addBrandZhichong(submitData)
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
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.directadddbrand {
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

    .wangeditor-box {
      width: 90%;
    }
  }
}
</style>