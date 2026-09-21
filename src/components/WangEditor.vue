<template>
  <div class="wangeditor-box" style="border: 1px solid rgb(204, 204, 204);">
    <Toolbar 
      style="border-bottom: 1px solid #ccc" 
      :editor="editor" 
      :defaultConfig="toolbarConfig"
      :mode="mode" 
    />
    <Editor 
      style="height: 500px; overflow-y: hidden;" 
      v-model="editorContent"
      :defaultConfig="editorConfig" 
      :mode="mode" 
      @onCreated="onCreated"
      @onChange="onChange"
      @onDestroyed="onDestroyed"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      isReady: false, // ✅ 添加编辑器就绪状态
      mode: 'default',
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入商品详情...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },
      wangEditorUploadQueue: [],
      isWangEditorUploading: false,
      editorContent: this.value
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editorContent && this.isReady) {
        this.editorContent = newVal
        this.$nextTick(() => {
          if (this.editor && this.isReady) {
            try {
              this.editor.setHtml(newVal || '')
            } catch (e) {
              console.warn('编辑器设置内容失败:', e)
            }
          }
        })
      }
    },
    editorContent(newVal) {
      if (this.isReady) {
        this.$emit('input', newVal)
      }
    }
  },
  mounted() {
    // ✅ 确保DOM完全渲染后再初始化
    this.$nextTick(() => {
      this.isReady = true
    })
  },
  beforeDestroy() {
    this.isReady = false
    if (this.editor) {
      try {
        this.editor.destroy()
      } catch (e) {
        console.warn('销毁编辑器失败:', e)
      }
      this.editor = null
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = editor
      this.isReady = true
      
      // ✅ 延迟设置内容，确保编辑器完全初始化
      this.$nextTick(() => {
        if (this.value && this.editor) {
          try {
            this.editor.setHtml(this.value)
          } catch (e) {
            console.warn('初始化设置内容失败:', e)
          }
        }
      })
    },
    
    onChange(editor) {
      // ✅ 编辑器内容变化时同步
      if (this.isReady) {
        this.editorContent = editor.getHtml()
        this.$emit('input', this.editorContent)
      }
    },
    
    onDestroyed() {
      this.isReady = false
      this.editor = null
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
      formData.append('file_url', 'content')
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
          const imageUrl = response.data.data?.url || response.data.data
          if (imageUrl && this.isReady) {
            insertFn(imageUrl)
            this.$message.success('上传成功')
          }
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          const imageUrl = error.response.data.data?.url || error.response.data.data
          if (imageUrl && this.isReady) {
            insertFn(imageUrl)
            this.$message.success('上传成功')
          }
        } else {
          this.$message.error('上传失败，请稍后重试')
        }
      }

      this.processWangEditorQueue()
    }
  }
}
</script>

<style scoped>
.wangeditor-box {
  width: 100%;
}
</style>