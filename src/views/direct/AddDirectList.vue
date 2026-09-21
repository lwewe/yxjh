<template>
  <div class="adddirectList">
    <el-card class="add-card">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="120px" class="mt10">
        <!-- 商品名称 -->
        <el-form-item label="商品名称：" prop="title">
          <el-input v-model="productForm.title" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 所属品牌 -->
        <el-form-item label="所属品牌：" prop="brand_id">
          <el-select v-model="productForm.brand_id" placeholder="请选择品牌" class="w200" clearable filterable>
            <el-option 
              v-for="item in brandList" 
              :key="item.id" 
              :label="item.title" 
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 名称 -->
        <el-form-item label="名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 商品编码 -->
        <el-form-item label="商品编码：" prop="code">
          <el-input v-model="productForm.code" placeholder="商品编码" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 价格 -->
        <el-form-item label="价格：" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :precision="2" :step="1" style="width: 200px;"></el-input-number>
          <span style="color: #999; margin-left: 10px;">元</span>
        </el-form-item>

        <!-- 平台加/供货价 -->
        <el-form-item label="平台加：" prop="ghprice">
          <el-input-number v-model="productForm.ghprice" :min="0" :precision="2" :step="1" style="width: 200px;"></el-input-number>
          <span style="color: #999; margin-left: 10px;">元</span>
        </el-form-item>

        <!-- 服务费 -->
        <el-form-item label="服务费：">
          <el-input-number v-model="productForm.fw_price" :min="0" :precision="2" style="width: 150px;"></el-input-number>
          <span style="margin: 0 10px;">元</span>
          <el-input-number v-model="productForm.fw_price1" :min="0" :precision="2" style="width: 150px;"></el-input-number>
          <span style="margin-left: 10px;">元</span>
        </el-form-item>

        <!-- 限购 -->
        <el-form-item label="限购：">
          <el-select v-model="productForm.sj" class="w120">
            <el-option label="不限" :value="1"></el-option>
            <el-option label="每日" :value="2"></el-option>
            <el-option label="总限购" :value="3"></el-option>
          </el-select>
          <el-input-number v-model="productForm.num" :min="1" :max="999" style="width: 120px; margin-left: 10px;" placeholder="次数"></el-input-number>
          <span style="color: #999; margin-left: 10px;">次</span>
        </el-form-item>

        <!-- 充值类型 -->
        <el-form-item label="充值类型：" prop="type">
          <el-input v-model="productForm.type" placeholder="充值类型" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 购买须知 -->
        <el-form-item label="购买须知：" prop="content">
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
import { 
  addZhichong, 
  editZhichong, 
  getZhichong,
  pinpaiListZhichong 
} from '@/api/modules/zhichong'

export default {
  name: 'AddZhichong',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      zhichongId: null,
      submitting: false,
      brandList: [],

      editorRef: null,
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入购买须知...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },

      productForm: {
        title: '',
        brand_id: null,
        name: '',
        code: '',
        price: 0,
        ghprice: 0,
        fw_price: 0,
        fw_price1: 0,
        type: '',
        content: '',
        sj: 1,
        num: 1,
        sh: 1,
        add_time: ''
      },

      rules: {
        title: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择所属品牌', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入商品编码', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        ghprice: [
          { required: true, message: '请输入平台加', trigger: 'blur' }
        ],
        add_time: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getBrandList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.zhichongId = parseInt(id)
      this.getZhichongDetail()
    } else {
      this.setDefaultTime()
      // 如果有品牌ID参数，自动选中
      if (this.$route.query.brand_id) {
        this.productForm.brand_id = parseInt(this.$route.query.brand_id)
      }
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

    async getBrandList() {
      try {
        const res = await pinpaiListZhichong()
        if (res.code === 200) {
          this.brandList = res.data || []
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      }
    },

    async getZhichongDetail() {
      try {
        const res = await getZhichong({ id: this.zhichongId })
        if (res.code === 200) {
          const data = res.data
          this.productForm = {
            title: data.title || '',
            brand_id: data.brand_id || null,
            name: data.name || '',
            code: data.code || '',
            price: data.price || 0,
            ghprice: data.ghprice || 0,
            fw_price: data.fw_price || 0,
            fw_price1: data.fw_price1 || 0,
            type: data.type || '',
            content: data.content || '',
            sj: data.sj || 1,
            num: data.num || 1,
            sh: data.sh !== undefined ? data.sh : 1,
            add_time: data.add_time ? this.formatDateTime(data.add_time) : ''
          }
          if (!this.productForm.add_time) {
            this.setDefaultTime()
          }
        } else {
          this.$message.error(res.msg || '获取详情失败')
          this.goBack()
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
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
      formData.append('file_url', 'zhichong/content')
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

    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true
          try {
            const submitData = {
              title: this.productForm.title,
              brand_id: this.productForm.brand_id,
              name: this.productForm.name,
              code: this.productForm.code,
              price: this.productForm.price,
              ghprice: this.productForm.ghprice,
              fw_price: this.productForm.fw_price,
              fw_price1: this.productForm.fw_price1,
              type: this.productForm.type,
              content: this.productForm.content,
              sj: this.productForm.sj,
              num: this.productForm.num,
              sh: this.productForm.sh,
              add_time: this.productForm.add_time
            }

            let res
            if (this.isEdit) {
              submitData.id = this.zhichongId
              res = await editZhichong(submitData)
            } else {
              res = await addZhichong(submitData)
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
.adddirectList {
  text-align: left;

  .add-card {
    .mt10 {
      margin-top: 10px;
    }

    .w200 {
      width: 200px;
    }

    .w120 {
      width: 120px;
    }

    .wangeditor-box {
      width: 90%;
    }
  }
}
</style>