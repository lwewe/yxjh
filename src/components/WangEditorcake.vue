<template>
  <div class="wangeditor-wrapper" v-if="isMounted">
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
        @onError="onError"
      />
    </div>
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
      isReady: false,
      isMounted: false,
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
      editorContent: '',
      initTimer: null
    }
  },
  watch: {
    value: {
      handler(newVal) {
        // 跳过初始化阶段和相同内容的更新
        if (!this.isReady || newVal === this.editorContent) return
        
        const safeVal = newVal || '<p></p>'
        
        this.$nextTick(() => {
          if (this.editor && this.isReady) {
            try {
              const currentHtml = this.editor.getHtml()
              if (currentHtml !== safeVal) {
                this.editor.setHtml(safeVal)
              }
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
    this.initTimer = setTimeout(() => {
      this.isMounted = true
      // 初始化为安全值
      this.editorContent = this.value || '<p></p>'
      this.$nextTick(() => {
        this.isReady = true
      })
    }, 150)
  },
  beforeDestroy() {
    if (this.initTimer) {
      clearTimeout(this.initTimer)
      this.initTimer = null
    }
    
    this.isReady = false
    this.isMounted = false
    
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
      
      // ✅ 只有外部传入了有效且不同的内容时才设置
      if (this.value && this.value.trim() !== '') {
        const currentHtml = editor.getHtml()
        if (currentHtml !== this.value) {
          this.$nextTick(() => {
            try {
              if (this.editor && this.isReady) {
                this.editor.setHtml(this.value)
              }
            } catch (e) {
              console.warn('初始化设置内容失败:', e)
            }
          })
        }
      }
    },
    
    onChange(editor) {
      if (this.isReady && editor) {
        try {
          const html = editor.getHtml()
          if (html !== this.editorContent) {
            this.editorContent = html
            this.$emit('input', html)
          }
        } catch (e) {
          console.warn('编辑器获取内容失败:', e)
        }
      }
    },
    
    onDestroyed() {
      this.isReady = false
      this.editor = null
    },
    
    // ✅ 新增：错误处理
    onError(error) {
      console.error('编辑器错误:', error)
      // 尝试恢复
      this.recoverEditor()
    },
    
    // ✅ 新增：编辑器恢复方法
    recoverEditor() {
      if (this.recovering) return
      this.recovering = true
      
      this.isReady = false
      this.isMounted = false
      
      if (this.editor) {
        try {
          this.editor.destroy()
        } catch (e) {}
        this.editor = null
      }
      
      setTimeout(() => {
        this.recovering = false
        this.isMounted = true
        this.editorContent = this.value || '<p></p>'
        this.$nextTick(() => {
          this.isReady = true
        })
      }, 300)
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
          if (imageUrl && this.isReady && this.editor) {
            insertFn(imageUrl)
          }
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          const imageUrl = error.response.data.data?.url || error.response.data.data
          if (imageUrl && this.isReady && this.editor) {
            insertFn(imageUrl)
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
.wangeditor-wrapper {
  width: 100%;
}

.wangeditor-box {
  width: 100%;
}
</style>