<template>
  <div class="cake-add-brand">
    <el-card class="add-card">


      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="150px" class=" mt10" >
        <!-- 供应商选择 -->


        <!-- 商品名称 -->
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="首字母：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="排序：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="品牌英文名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>



        <!-- 列表图上传 -->
        <el-form-item label="LOGO：" prop="thumbnailimage">
          <el-upload class="avatar-uploader" action="/admin.php/product/upload" :show-file-list="false"
            :on-success="handleThumbnailSuccess" :before-upload="beforeThumbnailUpload">
            <img v-if="productForm.thumbnailimage" :src="productForm.thumbnailimage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span style="color:red;  ">尺寸：320*320,大小：1M以内.</span>
        </el-form-item>



        <!-- 富文本编辑器 - 商品详情 -->
        <el-form-item label="内容：">
          <div style="border: 1px solid #ccc; width: 95%;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 300px; overflow-y: hidden;" v-model="productForm.wcontent"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleEditorCreated" />
          </div>
          <div v-if="uploading" class="upload-tip">
            <i class="el-icon-loading"></i> 正在上传图片... ({{ uploadedCount }}/{{ totalCount }})
          </div>
        </el-form-item>

        <!-- 热销商品 -->
        <el-form-item label="是否显示：">
          <el-radio-group v-model="productForm.hot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 精选商品 -->
        <el-form-item label="是否推荐（甄选）：">
          <el-radio-group v-model="productForm.jingxuan">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>



import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default {
  name: 'AddProduct',
  components: { Editor, Toolbar },
  data() {
    return {
      // 供应商列表（从原有PHP提取）

      // 分类选项（从原有PHP提取一级和二级分类）

      // 品牌列表（部分示例，完整列表太长，实际使用时需完整提取）

      // 表单数据
      productForm: {
        uid: 0,
        name: '',
        category: [],
        brand_id: '',
        specs: [
          {
            shuxing: 1,
            xinghao: '',
            price: '',
            ghprice: ''
          }
        ],
        status: 'selling',
        productplace: '',
        features: '',
        deliverymsg: '全国除港澳台新疆西藏及其他偏远地区不发货',
        is7toreturn: 0,
        thumbnailimage: '',
        detailImages: [{ url: '' }],
        wcontent: '',
        hot: 0,
        jingxuan: 0,
        sh: 1,
        createtime: '',
        flag: 1
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ],
        brand_id: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ]
      },
      // 富文本编辑器配置
      editor: null,
      editorRef: null,
      toolbarConfig: {
        excludeKeys: []
      },
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

      // 上传状态
      uploading: false,
      uploadedCount: 0,
      totalCount: 0,
      uploadQueue: [] // 简单队列
    }
  },
  created() {
    // 设置默认发布时间
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    this.productForm.createtime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor && editor.destroy) {
      editor.destroy()
    }
  },
  methods: {
    handleEditorCreated(editor) {
      this.editorRef = editor
    },

    // 最简单的顺序上传实现
    async customImageUpload(file, insertFn) {
      // 添加到队列
      this.uploadQueue.push({ file, insertFn })
      this.totalCount = this.uploadQueue.length

      // 如果没有正在上传，开始处理队列
      if (!this.uploading) {
        await this.processQueue()
      }
    },
    // 顺序处理队列
    async processQueue() {
      this.uploading = true

      while (this.uploadQueue.length > 0) {
        const item = this.uploadQueue.shift() // 从队列头部取出

        try {
          // 上传当前图片
          const url = await this.uploadImage(item.file)

          // 插入到编辑器
          item.insertFn(url)

          // 更新进度
          this.uploadedCount++

        } catch (error) {
          console.error('上传失败:', error)
          this.$message.error(`图片上传失败: ${item.file.name}`)
        }
      }

      // 上传完成
      this.uploading = false
      this.uploadedCount = 0
      this.totalCount = 0
      this.$message.success('所有图片上传完成')
    },

    // 上传单个图片（使用 Promise）
    uploadImage(file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)

        // 使用 axios 或 fetch
        this.$axios.post('/admin.php/product/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          if (res.data.code === 200) {
            resolve(res.data.data?.url || res.data.url)
          } else {
            reject(new Error(res.data.msg || '上传失败'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 分类变化
    handleCategoryChange(value) {
      console.log('分类变化:', value)
    },

    // 添加规格行
    addSpecRow() {
      this.productForm.specs.push({
        shuxing: 1,
        xinghao: '',
        price: '',
        ghprice: ''
      })
    },

    // 删除规格行
    removeSpecRow(index) {
      if (this.productForm.specs.length > 1) {
        this.productForm.specs.splice(index, 1)
      } else {
        this.$message.warning('至少保留一条规格')
      }
    },

    // 列表图上传统计
    handleThumbnailSuccess(res, file) {
      this.productForm.thumbnailimage = URL.createObjectURL(file.raw)
      // 实际使用时应该使用服务器返回的URL
      // this.productForm.thumbnailimage = res.data.url
    },

    // 列表图上传前验证
    beforeThumbnailUpload(file) {
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

    // 添加内页图行
    addImageRow() {
      this.productForm.detailImages.push({ url: '' })
    },

    // 删除内页图行
    removeImageRow(index) {
      this.productForm.detailImages.splice(index, 1)
    },

    // 内页图上传成功
    handleDetailImageSuccess(res, index) {
      // 实际使用时应该使用服务器返回的URL
      // this.productForm.detailImages[index].url = res.data.url
      // 这里使用临时预览
      this.productForm.detailImages[index].url = URL.createObjectURL(res.raw)
    },

    // 内页图上传前验证
    beforeDetailImageUpload(file) {
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

    // 编辑器创建
    onEditorCreated(editor) {
      this.editor = editor
    },

    // 提交表单
    submitForm() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          // 构建提交数据
          const submitData = {
            ...this.productForm,
            class1: this.productForm.category[0],
            class2: this.productForm.category[1] || 0
          }

          // 处理规格数据
          const shuxing = []
          const xinghao = []
          const price = []
          const ghprice = []

          this.productForm.specs.forEach(spec => {
            shuxing.push(spec.shuxing)
            xinghao.push(spec.xinghao)
            price.push(spec.price)
            ghprice.push(spec.ghprice)
          })

          submitData.shuxing = shuxing
          submitData.xinghao = xinghao
          submitData.price = price
          submitData.ghprice = ghprice

          // 处理内页图
          submitData.imgs = this.productForm.detailImages.map(img => img.url)

          console.log('提交数据:', submitData)

          // 发送请求
          // this.$axios.post('/admin.php/product/addproductdata', submitData).then(res => {
          //   if (res.data.code === 200) {
          //     this.$message.success('添加成功')
          //     this.$router.push('/product/list')
          //   } else {
          //     this.$message.error(res.data.msg || '添加失败')
          //   }
          // })

          // 模拟提交
          this.$message.success('添加成功')
          setTimeout(() => {
            this.$router.push('/product/list')
          }, 1000)
        } else {
          this.$message.error('请填写必填项')
          return false
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.productForm.resetFields()
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
.cake-add-brand {
  // padding: 20px;

  .add-card {
    .product-form {
      text-align: left;

      .spec-table {
        width: 100%;
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
          width: 148px;
          height: 148px;
          line-height: 148px;
          text-align: center;
        }

        .avatar {
          width: 148px;
          height: 148px;
          display: block;
        }
      }

      .detail-images {
        .detail-image-item {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;

          .closed {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            z-index: 1;
          }
        }
      }
    }
  }
}
</style>