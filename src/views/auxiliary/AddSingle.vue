<template>
  <div class="auxiliay-add">
    <el-card class="add-card">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="product-form mt10"
        style="text-align: left;">
        <!-- 页面位置（只读） -->
        <el-form-item label="页面位置：">
          <el-input :value="form.name" readonly style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="网站标题：">
          <el-input v-model="form.webtitle" style="width: 500px;"></el-input>
          <span style="color: red; margin-left: 10px;">SEO优化信息</span>
        </el-form-item>

        <el-form-item label="网站关键字：">
          <el-input v-model="form.webkeys" style="width: 500px;"></el-input>
          <span style="color: red; margin-left: 10px;">SEO优化信息</span>
        </el-form-item>

        <el-form-item label="网站描述：">
          <el-input v-model="form.webdesc" type="textarea" :rows="3" style="width: 500px;"></el-input>
          <span style="color: red; margin-left: 10px;">SEO优化信息</span>
        </el-form-item>

        <!-- 富文本编辑器 -->
        <el-form-item label="内容：">
          <div style="border: 1px solid #ccc; width: 95%;">
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
            <Editor style="height: 400px; overflow-y: hidden;" v-model="form.content" :defaultConfig="editorConfig"
              mode="default" @onCreated="handleEditorCreated" />
          </div>
          <div v-if="uploading" class="upload-tip">
            <i class="el-icon-loading"></i> 正在上传图片... ({{ uploadedCount }}/{{ totalCount }})
          </div>
        </el-form-item>

        <el-form-item label="发布时间：">
          <el-date-picker v-model="form.add_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 500px;" />
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
import request from '@/api/modules/request'  // 添加这一行
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { getSingle, editSingle } from '@/api/modules/myorder'

export default {
  name: 'AddSingle',
  components: { Editor, Toolbar },
  data() {
    return {
      uploading: false,
      uploadedCount: 0,
      totalCount: 0,
      uploadQueue: [],
      submitting: false,
      form: { id: '', name: '', title: '', webtitle: '', webkeys: '', webdesc: '', content: '', add_time: '' },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      editorRef: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入商品详情...',
        MENU_CONF: {
          uploadImage: {
            // 使用 async/await 保证顺序上传
            customUpload: this.customImageUpload,
            // 文件验证
            checkImage: (file) => {
              // 检查类型
              if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                this.$message.error('只支持 jpg、png、gif、webp 格式')
                return false
              }
              // 检查大小（1MB）
              if (file.size > 1024 * 1024) {
                this.$message.error('图片大小不能超过 1MB')
                return false
              }
              return true
            }
          }
        }
      },
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id && id != 0) this.loadDetail(id)
    else this.setDefaultTime()
  },
  beforeDestroy() {
    if (this.editorRef && this.editorRef.destroy) this.editorRef.destroy()
  },
  methods: {
    // 最简单的顺序上传实现
    async customImageUpload(file, insertFn) {
      this.uploadQueue.push({ file, insertFn })
      this.totalCount = this.uploadQueue.length
      if (!this.uploading) {
        await this.processQueue()
      }
    },
    // 顺序处理队列
    async processQueue() {
      this.uploading = true
      while (this.uploadQueue.length > 0) {
        const item = this.uploadQueue.shift()
        try {
          const url = await this.uploadImage(item.file)
          item.insertFn(url)
          this.uploadedCount++
        } catch (error) {
          console.error('上传失败:', error)
          this.$message.error(`图片上传失败: ${item.file.name}`)
        }
      }
      this.uploading = false
      this.uploadedCount = 0
      this.totalCount = 0
      this.$message.success('所有图片上传完成')
    },
    // 上传单个图片
  // 上传单个图片
uploadImage(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    
    request({
      url: '/admin/v1/upload',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      // 后端返回: { data: "图片url", status: 200 }
      if (res.status === 200 && res.data) {
        resolve(res.data)  // res.data 直接就是图片URL
      } else {
        reject(new Error(res.msg || '上传失败'))
      }
    }).catch(err => {
      reject(err)
    })
  })
},
    setDefaultTime() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      this.form.add_time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    async loadDetail(id) {
      try {
        const res = await getSingle({ id })
        if (res.code === 200) {
          const data = res.data
          if (data.add_time) {
            const d = new Date(data.add_time * 1000)
            const pad = n => String(n).padStart(2, '0')
            data.add_time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
          }
          this.form = {
            id: data.id,
            name: data.name,
            title: data.title,
            webtitle: data.webtitle || '',
            webkeys: data.webkeys || '',
            webdesc: data.webdesc || '',
            content: data.content || '',
            add_time: data.add_time
          }
        }
      } catch (error) { this.$message.error('获取详情失败') }
    },
    handleEditorCreated(editor) { this.editorRef = editor },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.submitting = true
        try {
          const params = {
            id: this.form.id,
            name: this.form.name,
            title: this.form.title,
            webtitle: this.form.webtitle,
            webkeys: this.form.webkeys,
            webdesc: this.form.webdesc,
            content: this.form.content,
            add_time: this.form.add_time
          }
          const res = await editSingle(params)
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$router.push('/auxiliary/page')
          } else {
            this.$message.error(res.msg || '保存失败')
          }
        } catch (error) { this.$message.error('保存失败') }
        finally { this.submitting = false }
      })
    },
    goBack() { this.$router.push('/auxiliary/page') }
  }
}
</script>