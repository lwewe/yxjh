<template>
  <div class="category-add">
    <el-card class="add-card">
      <div class="header-title">
        <h3>{{ isEdit ? '修改产品分类' : '添加产品分类' }}</h3>
      </div>

      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="150px" class="product-form mt10">

        <!-- 所属栏目（仅添加子分类时显示） -->
        <el-form-item label="所属栏目：" v-if="isChild">
          <el-input v-model="parentName" disabled style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 位置 -->
        <el-form-item label="位置：" prop="flag">
          <el-select v-model="productForm.flag" placeholder="请选择位置" style="width: 500px;" @change="handleFlagChange">
            <el-option label="商城分类(一级)" :value="1"></el-option>
            <el-option label="卡券分类-电影(会员)" :value="2"></el-option>
            <el-option label="卡券分类-商城(充值)" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 分类名称 -->
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入分类名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item label="图片：" prop="tbimg">
          <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customImageUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.tbimg" :src="productForm.tbimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="upload-tips">尺寸：750*240，大小：1M以内</span>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="productForm.px" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 首页推荐-分类名 -->
        <el-form-item label="首页推荐-分类名：" prop="syname">
          <el-input v-model="productForm.syname" placeholder="请输入首页推荐-分类名" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 首页推荐-分类说明 -->
        <el-form-item label="首页推荐-分类说明：" prop="tag">
          <el-input v-model="productForm.tag" placeholder="请输入首页推荐-分类说明" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 是否推荐（首页） -->
        <el-form-item label="是否推荐（首页）：">
          <el-radio-group v-model="productForm.tuij">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 热销-分类名 -->
        <el-form-item label="热销-分类名：" prop="rxname">
          <el-input v-model="productForm.rxname" placeholder="请输入热销-分类名" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 热销图片上传 -->
        <el-form-item label="热销图片：" prop="rxtbimg">
          <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customHotImageUpload"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.rxtbimg" :src="productForm.rxtbimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="upload-tips">尺寸：320*320，大小：1M以内</span>
        </el-form-item>

        <!-- 是否热销 -->
        <el-form-item label="是否推荐（热销）：">
          <el-radio-group v-model="productForm.rxtuij">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 节日慰问-分类名 -->
        <!-- <el-form-item label="节日慰问-分类名：" prop="name1">
          <el-input v-model="productForm.name1" placeholder="请输入节日慰问-分类名" style="width: 500px;"></el-input>
        </el-form-item> -->

        <!-- 节日慰问的分类排序 -->
        <!-- <el-form-item label="节日慰问排序：" prop="px1">
          <el-input-number v-model="productForm.px1" :min="0" :max="999" controls-position="right"
            style="width: 200px;"></el-input-number>
        </el-form-item> -->

        <!-- 是否发布 -->
        <el-form-item label="是否发布：">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 操作按钮 -->
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
import { addClassificationpro, editClassificationpro, getClassificationpro } from '@/api/modules/login'

export default {
  name: 'AddCategory',
  data() {
    return {
      // 是否是编辑模式
      isEdit: false,
      // 是否是添加子分类
      isChild: false,
      // 父分类名称
      parentName: '',
      // 编辑时的分类ID
      editId: null,
      // 提交加载状态
      submitLoading: false,
      // 上传地址
      // uploadUrl: process.env.VUE_APP_BASE_API + '/admin/v1/product/uploadImg',

      // 表单数据
      productForm: {
        name: '',         // 分类名
        name1: '',        // 节日慰问-分类名
        syname: '',       // 首页推荐-分类名
        tag: '',          // 首页推荐-分类说明
        pid: 0,           // 父类id
        tbimg: '',        // 图片
        px: 0,            // 排序
        flag: 1,          // 位置 1-商城分类(一级)，2-卡券分类-电影(会员)，3-卡券分类-商城(充值)
        sh: 0,            // 是否发布
        tuij: 0,          // 是否推荐(首页) 1-是，0-否
        rxname: '',       // 热销-分类名
        rxtbimg: '',      // 热销-图
        rxtuij: 0,        // 是否热销 1-是，0-否
        px1: 0            // 节日慰问的分类排序
      },

      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        flag: [
          { required: true, message: '请选择位置', trigger: 'change' }
        ],
        tbimg: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        px: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },

  // created() {
  //   // 判断是编辑还是添加
  //   this.isEdit = this.$route.name === 'EditClassification'

  //   // 判断是否是添加子分类
  //   if (this.$route.query.pid) {
  //     this.isChild = true
  //     this.productForm.pid = parseInt(this.$route.query.pid)
  //     this.parentName = this.$route.query.parentName || ''
  //   }

  //   // 如果有分类ID参数，则是编辑模式
  //   if (this.$route.params.id) {
  //     this.editId = this.$route.params.id
  //     this.getClassificationDetail()
  //   }
  // },
  created() {
    // 判断是编辑还是添加：有 id 参数就是编辑模式
    this.isEdit = !!this.$route.params.id

    // 判断是否是添加子分类
    if (this.$route.query.pid) {
      this.isChild = true
      this.productForm.pid = parseInt(this.$route.query.pid)
      this.parentName = this.$route.query.parentName || ''
    }

    // 如果有分类ID参数，则是编辑模式，获取详情
    if (this.$route.params.id) {
      this.editId = this.$route.params.id
      this.getClassificationDetail()
    }

    // 调试日志，方便排查
    console.log('页面模式:', this.isEdit ? '编辑模式' : '新增模式', 'ID:', this.editId)
  },
  methods: {
    // 获取分类详情（编辑时使用）
    async getClassificationDetail() {
      try {
        const res = await getClassificationpro({ id: this.editId })
        console.log('获取分类详情:', res)

        if (res.code === 200 && res.data) {
          const data = res.data
          // 将接口数据填充到表单
          this.productForm = {
            name: data.name || '',
            name1: data.name1 || '',
            syname: data.syname || '',
            tag: data.tag || '',
            pid: data.pid || 0,
            tbimg: data.tbimg || '',
            px: data.px || 0,
            flag: data.flag || 1,
            sh: data.sh !== undefined ? data.sh : 1,
            tuij: data.tuij !== undefined ? data.tuij : 0,
            rxname: data.rxname || '',
            rxtbimg: data.rxtbimg || '',
            rxtuij: data.rxtuij !== undefined ? data.rxtuij : 0,
            px1: data.px1 || 0
          }

          // 如果有父分类，显示父分类名称
          if (data.pid && data.pid > 0) {
            this.isChild = true
            // 可以调用接口获取父分类名称，这里简化处理
            this.parentName = '父分类ID: ' + data.pid
          }
        }
      } catch (error) {
        console.error('获取分类详情失败:', error)
        this.$message.error('获取分类详情失败')
      }
    },

    // 位置选择变化
    handleFlagChange(value) {
      console.log('位置变化:', value)
      // 根据位置可以做一些联动处理
      if (value === 1) {
        // 商城分类(一级)，pid应该为0
        if (!this.isChild) {
          this.productForm.pid = 0
        }
      }
    },

    // 图片上传成功


    async customImageUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/product')  // 分类图片目录
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
          this.productForm.tbimg = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.productForm.tbimg = error.response.data.data
          this.$message.success('上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    }, async customHotImageUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/product')  // 热销图片目录
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
          this.productForm.rxtbimg = response.data.data
          this.$message.success('热销图片上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.productForm.rxtbimg = error.response.data.data
          this.$message.success('热销图片上传成功')
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },
    // 图片上传前验证
    beforeImageUpload(file) {
      // 验证图片类型
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }

      // 验证图片大小
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }

      return true
    },

    // 提交表单
    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
          return false
        }

        this.submitLoading = true

        try {
          // 构建提交参数
          const params = {
            name: this.productForm.name,
            name1: this.productForm.name1,
            syname: this.productForm.syname,
            tag: this.productForm.tag,
            pid: String(this.productForm.pid),     // 转为字符串
            tbimg: this.productForm.tbimg,
            px: String(this.productForm.px),        // 转为字符串
            flag: String(this.productForm.flag),    // 转为字符串
            sh: String(this.productForm.sh),        // 转为字符串
            tuij: String(this.productForm.tuij),    // 转为字符串
            rxname: this.productForm.rxname,
            rxtbimg: this.productForm.rxtbimg,
            rxtuij: String(this.productForm.rxtuij), // 转为字符串
            px1: String(this.productForm.px1)        // 转为字符串
          }

          // 编辑时添加id
          if (this.isEdit) {
            params.id = String(this.editId)
          }

          console.log('提交参数:', params)

          let res
          if (this.isEdit) {
            // 调用编辑接口
            res = await editClassificationpro(params)
          } else {
            // 调用添加接口
            res = await addClassificationpro(params)
          }

          console.log('提交响应:', res)

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            // 返回列表页
            this.$router.push('/product/category')
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败，请重试')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 返回
    goBack() {
      this.$router.push('/product/category')
    }
  }
}
</script>

<style lang="scss" scoped>
.category-add {
  .add-card {
    .header-title {
      text-align: left;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ebeef5;

      h3 {
        margin: 0;
        color: #303133;
        font-size: 18px;
      }
    }

    .product-form {
      text-align: left;

      .upload-tips {

        font-size: 12px;
        margin-left: 10px;
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
          width: 88px;
          height: 88px;
          line-height: 88px;
          text-align: center;
        }

        .avatar {
          width: 88px;
          height: 88px;
          display: block;
          object-fit: cover;
        }
      }
    }
  }
}
</style>