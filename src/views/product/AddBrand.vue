<template>
  <div class="brand-add-container">
    <el-card class="add-card">
      <!-- 标题 -->
      <div class="page-title">
        <h3>{{ isEdit ? '编辑品牌' : '添加品牌' }}</h3>
      </div>

      <el-form :model="brandForm" :rules="rules" ref="brandForm" label-width="150px" class="brand-form mt10">
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="brandForm.name" placeholder="请输入品牌名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 品牌英文名称 -->
        <el-form-item label="品牌英文名称：" prop="ywname">
          <el-input v-model="brandForm.ywname" placeholder="请输入品牌英文名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 首字母 -->
        <el-form-item label="首字母：" prop="initials">
          <el-input v-model="brandForm.initials" placeholder="请输入首字母（大写）" style="width: 200px;" maxlength="1"
            @input="handleInitialsInput"></el-input>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="brandForm.px"   placeholder="请输入排序值" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 品牌编码（只读） -->
        <el-form-item label="品牌编码：" prop="brandcode">
          <el-input v-model="brandForm.brandcode" placeholder="品牌编码" style="width: 500px;" readonly></el-input>
        </el-form-item>

        <!-- Logo上传 -->
        <el-form-item label="LOGO：" prop="img">
          <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customLogoUpload"
            :before-upload="beforeLogoUpload">
            <img v-if="brandForm.img" :src="brandForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fs12">尺寸：320*320，大小：1M以内</span>
        </el-form-item>

        <!-- 内容（富文本） -->
        <el-form-item label="内容：" class="editorsnew" prop="content">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
              :mode="mode" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="brandForm.content" :defaultConfig="editorConfig"
              :mode="mode" @onCreated="onCreated" />
          </div>
        </el-form-item>

        <!-- 发布状态 -->
        <el-form-item label="是否显示：">
          <el-radio-group v-model="brandForm.sh">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 推荐状态 -->
        <el-form-item label="是否推荐（甄选）：">
          <el-radio-group v-model="brandForm.tuij">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ isEdit ? '保存修改' : '保存' }}
          </el-button>
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
import { addBrand, editBrand, getBrand } from '@/api/modules/login'

export default {
  name: 'AddBrandpro',
  components: { Editor, Toolbar },
  data() {
    return {
      wangEditorUploadQueue: [],  // 上传队列
      isWangEditorUploading: false,  // 是否正在上传
      // 是否编辑模式
      isEdit: false,
      editId: '',
      // 提交加载状态
      submitLoading: false,
      // 上传地址

      // 上传请求头

      // 表单数据
      brandForm: {
        name: '',
        ywname: '',
        initials: '',
        px: 0,
        brandcode: '',
        img: '',
        content: '',
        sh: 1,
        tuij: 0
      },
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        initials: [
          { required: true, message: '请输入首字母', trigger: 'blur' },
          { pattern: /^[A-Z]$/, message: '首字母必须为大写英文字母', trigger: 'blur' }
        ],
        px: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      },
      // 富文本编辑器
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
      }
    }
  },
  created() {
    // 判断是否为编辑模式
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

    // 清空上传队列
    this.wangEditorUploadQueue = []
    this.isWangEditorUploading = false
  },
  methods: {
    // 获取品牌详情（编辑时）
    async getBrandDetail(id) {
      try {
        const res = await getBrand({ id: String(id) })
        if (res.code === 200) {
          const data = res.data
          this.brandForm = {
            name: data.name || '',
            ywname: data.ywname || '',
            initials: data.initials || '',
            px: data.px || 0,
            brandcode: data.brandcode || '',
            img: data.img || '',
            content: data.content || '',
            sh: data.sh !== undefined ? data.sh : 1,
            tuij: data.tuij !== undefined ? data.tuij : 0
          }
        } else {
          this.$message.error(res.msg || '获取品牌详情失败')
        }
      } catch (error) {
        console.error('获取品牌详情失败:', error)
        this.$message.error('网络异常，获取品牌详情失败')
      }
    },

    // 编辑器创建
    onCreated(editor) {
      this.editor = editor
    },

    // 修改富文本图片上传方法
    async handleWangEditorUpload(file, insertFn) {
      // 将上传任务加入队列
      this.wangEditorUploadQueue.push({ file, insertFn })

      // 如果当前没有在上传，则开始处理队列
      if (!this.isWangEditorUploading) {
        this.processWangEditorQueue()
      }
    },

    // 串行处理上传队列
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
      formData.append('file_url', 'brand')  // 品牌目录
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

      // 处理队列中的下一个
      this.processWangEditorQueue()
    },

    // 首字母输入处理（自动转大写）
    handleInitialsInput(val) {
      this.brandForm.initials = val.replace(/[^a-zA-Z]/g, '').toUpperCase()
    },

    // 换成这个
    async customLogoUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'brand')  // 品牌Logo目录
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
          this.brandForm.img = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.brandForm.img = error.response.data.data
          this.$message.success('上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },


    // Logo上传前验证
    beforeLogoUpload(file) {
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

    // 提交表单
    submitForm() {
      this.$refs.brandForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
          return false
        }

        this.submitLoading = true

        try {
          // 构建提交数据
          const submitData = {
            name: this.brandForm.name,
            ywname: this.brandForm.ywname,
            initials: this.brandForm.initials,
            px: String(this.brandForm.px),
            img: this.brandForm.img,
            content: this.brandForm.content,
            sh: String(this.brandForm.sh),
            tuij: String(this.brandForm.tuij)
          }

          let res
          if (this.isEdit) {
            // 编辑品牌
            submitData.id = String(this.editId)
            res = await editBrand(submitData)
          } else {
            // 添加品牌
            res = await addBrand(submitData)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            // 跳转回品牌列表
            this.$router.push({
              name: 'BrandList'
            })
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

    // 返回列表
    goBack() {
      this.$router.push({
        name: 'BrandList'
      })
    }
  }
}
</script>

<style>
.editorsnew .el-form-item__content {
  line-height: 20px;
}
</style>

<style lang="scss" scoped>
.brand-add-container {
  .add-card {
    .page-title {
      text-align: left;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
    }

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
            border-color: #409eff;
          }
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 88px;
          height: 88px;
          line-height: 88px;
          text-align: center;
        }

        .avatar {
          width:88px;
          height: 88px;
          display: block;
        }
      }
    }
  }
}
</style>