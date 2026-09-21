<template>
  <div class="crop-upload">
    <div @click="triggerUpload" class="upload-trigger">
      <slot>
        <div class="default-uploader">
          <img v-if="value" :src="value" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </slot>
    </div>

    <input ref="fileInput" type="file" accept="image/jpeg,image/png" style="display: none" @change="handleFileChange" />

    <el-dialog title="裁剪图片" :visible.sync="cropperVisible" :width="dialogWidth" append-to-body
      :close-on-click-modal="false" @closed="handleDialogClosed">
      <div class="cropper-body">
        <!-- 原图区域 -->
        <div class="cropper-left">
          <div class="cropper-label">原图</div>
          <div class="cropper-area" ref="cropperArea" @mousedown="onMouseDown">
            <img ref="cropperImage" :src="cropperSrc" class="cropper-image" @load="onImageLoad" />
            <div v-if="imageLoaded" class="crop-mask">
              <!-- 遮罩四块 -->
              <div class="mask-top" :style="{ height: cropY + 'px' }"></div>
              <div class="mask-middle">
                <div class="mask-left" :style="{ width: cropX + 'px' }"></div>
                <div class="crop-box" :style="cropBoxStyle" @mousedown.stop="startMove">
                  <!-- 四条边线 -->
                  <div class="border-top"></div>
                  <div class="border-bottom"></div>
                  <div class="border-left"></div>
                  <div class="border-right"></div>
                  <!-- 八个手柄 -->
                  <div class="handle nw" @mousedown.stop="startResize($event, 'nw')"></div>
                  <div class="handle n" @mousedown.stop="startResize($event, 'n')"></div>
                  <div class="handle ne" @mousedown.stop="startResize($event, 'ne')"></div>
                  <div class="handle e" @mousedown.stop="startResize($event, 'e')"></div>
                  <div class="handle se" @mousedown.stop="startResize($event, 'se')"></div>
                  <div class="handle s" @mousedown.stop="startResize($event, 's')"></div>
                  <div class="handle sw" @mousedown.stop="startResize($event, 'sw')"></div>
                  <div class="handle w" @mousedown.stop="startResize($event, 'w')"></div>
                </div>
                <div class="mask-right" :style="{ width: (displayWidth - cropX - cropW) + 'px' }"></div>
              </div>
              <div class="mask-bottom" :style="{ height: (displayHeight - cropY - cropH) + 'px' }"></div>
            </div>
          </div>
        </div>

        <!-- 预览区域 -->
        <div class="cropper-right">
          <div class="cropper-label">预览 ({{ cropWidth }}x{{ cropHeight }})</div>
          <div class="preview-box">
            <div class="preview-image" :style="previewImageStyle"></div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cropperVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCrop" :loading="cropping">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'CropUpload',
  props: {
    value: { type: String, default: '' },
    cropWidth: { type: Number, default: 320 },
    cropHeight: { type: Number, default: 320 },
    keepSquare: { type: Boolean, default: true },
    uploadPath: { type: String, default: 'upload/product' },
    maxSize: { type: Number, default: 5 },
    dialogWidth: { type: String, default: '750px' },
    quality: { type: Number, default: 0.9 }
  },
  data() {
    return {
      cropperVisible: false,
      cropperSrc: '',
      cropping: false,
      cropperFile: null,

      imageLoaded: false,
      naturalWidth: 0,
      naturalHeight: 0,
      displayWidth: 0,
      displayHeight: 0,

      // 裁剪框在图片显示区域的位置（px）
      cropX: 0,
      cropY: 0,
      cropW: 200,
      cropH: 200,

      // 拖拽状态
      isDragging: false,
      dragMode: '', // 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
      startMouseX: 0,
      startMouseY: 0,
      startCrop: {}
    }
  },
  computed: {
    cropBoxStyle() {
      return {
        left: '0px',
        top: '0px',
        width: this.cropW + 'px',
        height: this.cropH + 'px'
      }
    },
    previewImageStyle() {
      if (!this.imageLoaded || !this.cropW) return {}

      const previewW = 200
      const previewH = this.keepSquare ? 200 : (200 * this.cropHeight / this.cropWidth)
      const scaleX = previewW / this.cropW
      const scaleY = previewH / this.cropH

      const bgW = this.displayWidth * scaleX
      const bgH = this.displayHeight * scaleY
      const bgX = -this.cropX * scaleX
      const bgY = -this.cropY * scaleY

      return {
        width: previewW + 'px',
        height: previewH + 'px',
        backgroundImage: `url(${this.cropperSrc})`,
        backgroundSize: `${bgW}px ${bgH}px`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click()
    },

    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file) return

      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        this.$refs.fileInput.value = ''
        return
      }

      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$message.error(`上传图片大小不能超过 ${this.maxSize}MB!`)
        this.$refs.fileInput.value = ''
        return
      }

      this.cropperFile = file
      this.imageLoaded = false
      const reader = new FileReader()
      reader.onload = (event) => {
        this.cropperSrc = event.target.result
        this.cropperVisible = true
      }
      reader.readAsDataURL(file)
      this.$refs.fileInput.value = ''
    },
    onImageLoad() {
      const img = this.$refs.cropperImage
      if (!img) return

      this.naturalWidth = img.naturalWidth
      this.naturalHeight = img.naturalHeight
      this.displayWidth = img.width
      this.displayHeight = img.height

      // 核心修改：去掉 * 0.8，让裁剪框自动铺满
      if (this.keepSquare) {
        const size = Math.min(this.displayWidth, this.displayHeight)
        this.cropW = size
        this.cropH = size
      } else {
        this.cropW = this.displayWidth
        this.cropH = this.displayHeight
      }

      this.cropX = (this.displayWidth - this.cropW) / 2
      this.cropY = (this.displayHeight - this.cropH) / 2

      this.imageLoaded = true

      // 绑定全局事件
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },
    // onImageLoad() {
    //   const img = this.$refs.cropperImage
    //   if (!img) return

    //   this.naturalWidth = img.naturalWidth
    //   this.naturalHeight = img.naturalHeight
    //   this.displayWidth = img.width
    //   this.displayHeight = img.height

    //   // 初始化裁剪框：最大正方形居中
    //   if (this.keepSquare) {
    //     const size = Math.min(this.displayWidth, this.displayHeight) * 0.8
    //     this.cropW = size
    //     this.cropH = size
    //   } else {
    //     this.cropW = this.displayWidth * 0.8
    //     this.cropH = this.displayHeight * 0.8
    //   }

    //   this.cropX = (this.displayWidth - this.cropW) / 2
    //   this.cropY = (this.displayHeight - this.cropH) / 2

    //   this.imageLoaded = true

    //   // 绑定全局事件
    //   document.addEventListener('mousemove', this.onMouseMove)
    //   document.addEventListener('mouseup', this.onMouseUp)
    // },

    startMove(e) {
      this.isDragging = true
      this.dragMode = 'move'
      this.startMouseX = e.clientX
      this.startMouseY = e.clientY
      this.startCrop = { x: this.cropX, y: this.cropY, w: this.cropW, h: this.cropH }
    },

    startResize(e, direction) {
      this.isDragging = true
      this.dragMode = direction
      this.startMouseX = e.clientX
      this.startMouseY = e.clientY
      this.startCrop = { x: this.cropX, y: this.cropY, w: this.cropW, h: this.cropH }
    },

    onMouseMove(e) {
      if (!this.isDragging) return

      const dx = e.clientX - this.startMouseX
      const dy = e.clientY - this.startMouseY

      let { x, y, w, h } = this.startCrop
      const minSize = 50

      if (this.dragMode === 'move') {
        x = Math.max(0, Math.min(x + dx, this.displayWidth - w))
        y = Math.max(0, Math.min(y + dy, this.displayHeight - h))
      } else {
        // 缩放逻辑
        if (this.dragMode.includes('w')) {
          x = Math.max(0, this.startCrop.x + dx)
          w = Math.max(minSize, this.startCrop.w - dx)
          if (x <= 0) { x = 0; w = this.startCrop.x + this.startCrop.w }
        }
        if (this.dragMode.includes('e')) {
          w = Math.max(minSize, Math.min(this.startCrop.w + dx, this.displayWidth - this.startCrop.x))
        }
        if (this.dragMode.includes('n')) {
          y = Math.max(0, this.startCrop.y + dy)
          h = Math.max(minSize, this.startCrop.h - dy)
          if (y <= 0) { y = 0; h = this.startCrop.y + this.startCrop.h }
        }
        if (this.dragMode.includes('s')) {
          h = Math.max(minSize, Math.min(this.startCrop.h + dy, this.displayHeight - this.startCrop.y))
        }

        // 保持正方形
        if (this.keepSquare) {
          const size = Math.min(w, h)
          if (this.dragMode === 'se' || this.dragMode === 'e' || this.dragMode === 's') {
            w = size
            h = size
          } else if (this.dragMode === 'sw' || this.dragMode === 'w' || this.dragMode === 's') {
            x = this.startCrop.x + this.startCrop.w - size
            w = size
            h = size
          } else if (this.dragMode === 'ne' || this.dragMode === 'e' || this.dragMode === 'n') {
            y = this.startCrop.y + this.startCrop.h - size
            w = size
            h = size
          } else if (this.dragMode === 'nw' || this.dragMode === 'w' || this.dragMode === 'n') {
            x = this.startCrop.x + this.startCrop.w - size
            y = this.startCrop.y + this.startCrop.h - size
            w = size
            h = size
          }
        }
      }

      this.cropX = x
      this.cropY = y
      this.cropW = w
      this.cropH = h
    },

    onMouseUp() {
      this.isDragging = false
      this.dragMode = ''
    },

    onMouseDown(e) {
      // 点击遮罩区域不做处理
    },

    async confirmCrop() {
      this.cropping = true
      try {
        // 计算实际裁剪坐标（相对于原图）
        const scaleX = this.naturalWidth / this.displayWidth
        const scaleY = this.naturalHeight / this.displayHeight

        const sx = Math.round(this.cropX * scaleX)
        const sy = Math.round(this.cropY * scaleY)
        const sw = Math.round(this.cropW * scaleX)
        const sh = Math.round(this.cropH * scaleY)

        const croppedFile = await this.cropImage(sx, sy, sw, sh)

        if (croppedFile.size / 1024 / 1024 > 1) {
          this.$message.warning('裁剪后图片超过1M，请缩小裁剪范围')
          this.cropping = false
          return
        }

        const imageUrl = await this.uploadImage(croppedFile)
        this.$emit('input', imageUrl)
        this.$emit('success', imageUrl, croppedFile)
        this.$message.success('上传成功')
        this.cropperVisible = false
      } catch (error) {
        console.error('裁剪上传失败:', error)
        this.$message.error('裁剪上传失败')
      } finally {
        this.cropping = false
      }
    },
    cropImage(sx, sy, sw, sh) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(this.cropperFile)

        img.onload = () => {
          URL.revokeObjectURL(url)
          const canvas = document.createElement('canvas')
          canvas.width = this.cropWidth
          canvas.height = this.cropHeight
          const ctx = canvas.getContext('2d')

          // ====================================================
          // 【核心修复】：先画一个白色的背景垫底
          // 因为裁切出来是 JPEG 格式，不支持透明，如果不填白底就会变成黑色
          // ====================================================
          ctx.fillStyle = '#ffffff'; 
          ctx.fillRect(0, 0, this.cropWidth, this.cropHeight);

          // 在白色背景上绘制原图
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, this.cropWidth, this.cropHeight)
          
          // 转为 JPEG 格式
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], this.cropperFile.name, { type: 'image/jpeg', lastModified: Date.now() }))
            } else {
              reject(new Error('处理失败'))
            }
          }, 'image/jpeg', this.quality)
        }
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('加载失败')) }
        img.src = url
      })
    },
    // cropImage(sx, sy, sw, sh) {
    //   return new Promise((resolve, reject) => {
    //     const img = new Image()
    //     const url = URL.createObjectURL(this.cropperFile)

    //     img.onload = () => {
    //       URL.revokeObjectURL(url)
    //       const canvas = document.createElement('canvas')
    //       canvas.width = this.cropWidth
    //       canvas.height = this.cropHeight
    //       const ctx = canvas.getContext('2d')
    //       ctx.drawImage(img, sx, sy, sw, sh, 0, 0, this.cropWidth, this.cropHeight)
    //       canvas.toBlob((blob) => {
    //         if (blob) {
    //           resolve(new File([blob], this.cropperFile.name, { type: 'image/jpeg', lastModified: Date.now() }))
    //         } else {
    //           reject(new Error('处理失败'))
    //         }
    //       }, 'image/jpeg', this.quality)
    //     }
    //     img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('加载失败')) }
    //     img.src = url
    //   })
    // },

    async uploadImage(file) {
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', this.uploadPath)
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      const response = await axios({
        url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })

      let imageUrl = response.data?.data?.url || response.data?.data || response.data?.url
      if (!imageUrl) throw new Error('未获取到图片地址')
      return imageUrl
    },

    handleDialogClosed() {
      this.cropperSrc = ''
      this.cropperFile = null
      this.imageLoaded = false
      this.isDragging = false
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.crop-upload {
  display: inline-block;
}

.upload-trigger {
  cursor: pointer;
}

.default-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 裁剪布局 */
.cropper-body {
  display: flex;
  gap: 20px;
}

.cropper-left {
  flex: 1;
  min-width: 0;
}

.cropper-right {
  width: 220px;
  flex-shrink: 0;
}

.cropper-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 10px;
  font-weight: 500;
}

/* 原图区域 */
.cropper-area {
  position: relative;
  display: inline-block;
  user-select: none;
  max-width: 100%;
  max-height: 400px;
  overflow: hidden;
}

.cropper-image {
  display: block;
  max-width: 100%;
  max-height: 400px;
}

/* 遮罩层 */
.crop-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.mask-top {
  background: rgba(0, 0, 0, 0.5);
}

.mask-bottom {
  background: rgba(0, 0, 0, 0.5);
}

.mask-middle {
  display: flex;
}

.mask-left {
  background: rgba(0, 0, 0, 0.5);
}

.mask-right {
  background: rgba(0, 0, 0, 0.5);
}

/* 裁剪框 */
.crop-box {
  position: relative;
  cursor: move;
  pointer-events: all;
  outline: 2px dashed #fff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.5);
}

.border-top,
.border-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 33.33%;
}

.border-top {
  top: 0;
}

.border-bottom {
  bottom: 0;
}

.border-left,
.border-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 33.33%;
}

.border-left {
  left: 0;
}

.border-right {
  right: 0;
}

/* 手柄 */
.handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1px solid #409EFF;
  pointer-events: all;
  z-index: 10;
}

.handle.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.handle.n {
  top: -4px;
  left: 50%;
  margin-left: -4px;
  cursor: n-resize;
}

.handle.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.handle.e {
  top: 50%;
  right: -4px;
  margin-top: -4px;
  cursor: e-resize;
}

.handle.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.handle.s {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
  cursor: s-resize;
}

.handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.handle.w {
  top: 50%;
  left: -4px;
  margin-top: -4px;
  cursor: w-resize;
}

/* 预览 */
.preview-box {
  width: 200px;
  height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
}

.preview-image {
  width: 100%;
  height: 100%;
}
</style>