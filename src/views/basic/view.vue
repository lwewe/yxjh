<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="width: 60%;">
        <el-form ref="form" :model="form" label-width="120px" label-position="right" :rules="rules">
          <el-form-item label="选择网站：" prop="siteType">
            <el-select v-model="form.siteType" style="width: 100%;" placeholder="请选择配置的网站" @change="handleSiteChange">
              <el-option label="悦享聚汇" value="list"></el-option>
              <el-option label="悦享福满满" value="list2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="网站名称：" prop="webname">
            <el-input v-model="form.webname" placeholder="请输入网站名称"></el-input>
          </el-form-item>

          <el-form-item label="网站标题：" prop="webtitle">
            <el-input v-model="form.webtitle" placeholder="请输入网站标题"></el-input>
          </el-form-item>


          <el-form-item label="网站LOGO：" style="text-align: left;">
            <div class="logo-container" style="display: flex;line-height: 20px;">
              
              <el-upload class="logo-uploader" action="#" :http-request="customUpload" :data="uploadData"
                :show-file-list="false" :before-upload="beforeUpload">
                <img v-if="form.weblogo" :src="form.weblogo" class="logo-preview" @error="handleImageError" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
 
                <span  >尺寸:125*70,大小：1M以内</span>

            

            </div>
          </el-form-item>

          <el-form-item label="网站关键字：" prop="webkeys">
            <el-input v-model="form.webkeys" placeholder="请输入网站关键字，多个关键字用逗号分隔"></el-input>
          </el-form-item>

          <el-form-item label="网站描述：" prop="webdesc">
            <el-input type="textarea" v-model="form.webdesc" :rows="4" placeholder="请输入网站描述"></el-input>
          </el-form-item>

          <el-form-item style="text-align: left;">
            <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
            <!-- <el-button @click="onReset">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>




<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { getWebConfig, saveWebConfig } from '@/api/modules/login'
import request from '@/api/modules/login'

export default {
  name: 'ViewConfig',
  data() {
    return {
      uploadData: {
        file_url: 'upload/weblogo',  // 根据文档要求传递上传路径
      },
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        siteType: 'list', // list: 悦享聚汇, list2: 悦享福满满
        webname: '',
        webtitle: '',
        webkeys: '',
        webdesc: '',
        weblogo: ''
      },
      rules: {
        siteType: [
          { required: true, message: '请选择网站', trigger: 'change' }
        ],
        webname: [
          { required: true, message: '请输入网站名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        webtitle: [
          { required: true, message: '请输入网站标题', trigger: 'blur' }
        ],
        webkeys: [
          { required: true, message: '请输入网站关键字', trigger: 'blur' }
        ],
        webdesc: [
          { required: true, message: '请输入网站描述', trigger: 'blur' }
        ]
      },
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  mounted() {
    this.getConfigData()
  },
  methods: {
    // 自定义上传方法
    async customUpload(options) {
      const { file } = options

      // 生成签名参数
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/weblogo')
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

        console.log('上传响应:', response.data)

        if (response.data.status === 200) {
          this.form.weblogo = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        console.error('上传失败:', error)

        // 检查响应数据
        if (error.response && error.response.data) {
          const data = error.response.data
          if (data.status === 200) {
            this.form.weblogo = data.data
            this.$message.success('上传成功')
            return
          }
        }

        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 上传前校验
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    handleImageError(e) {
      console.error('图片加载失败:', this.form.weblogo)
    },

    // 获取配置数据
     // 获取配置数据
async getConfigData() {
  this.loading = true
  try {
    const response = await getWebConfig()
    console.log('获取配置响应:', response)

    if (response.code === 200 && response.data) {
      // 直接使用接口返回的数据结构
      this.siteConfigs = {
        list: response.data.list || {
          webname: '',
          webtitle: '',
          webkeys: '',
          webdesc: '',
          weblogo: ''
        },
        list2: response.data.list2 || {
          webname: '',
          webtitle: '',
          webkeys: '',
          webdesc: '',
          weblogo: ''
        }
      }

      // 初始化表单显示第一个网站（悦享聚汇）
      const currentConfig = this.siteConfigs.list
      this.form.webname = currentConfig.webname || ''
      this.form.webtitle = currentConfig.webtitle || ''
      this.form.webkeys = currentConfig.webkeys || ''
      this.form.webdesc = currentConfig.webdesc || ''
      this.form.weblogo = currentConfig.weblogo || ''
      
      console.log('初始化表单数据:', this.form)
    } else {
      this.$message.error(response.msg || '获取配置失败')
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    this.$message.error('获取配置失败，请稍后重试')
  } finally {
    this.loading = false
  }
},

    // 切换网站
    handleSiteChange(value) {
      const config = this.siteConfigs[value]
      if (config) {
        this.form.webname = config.webname || ''
        this.form.webtitle = config.webtitle || ''
        this.form.webkeys = config.webkeys || ''
        this.form.webdesc = config.webdesc || ''
        this.form.weblogo = config.weblogo || ''
      }
    },

    // 保存配置
    // 保存配置
async onSubmit() {
  this.$refs.form.validate(async (valid) => {
    if (valid) {
      this.loading = true
      try {
        // 先更新内存中的配置
        this.siteConfigs[this.form.siteType] = {
          webname: this.form.webname,
          webtitle: this.form.webtitle,
          webkeys: this.form.webkeys,
          webdesc: this.form.webdesc,
          weblogo: this.form.weblogo
        }

        // 构建接口需要的参数 - 同时提交两个网站的全部配置
        const params = {
          // 悦享聚汇
          webname: this.siteConfigs.list.webname || '',
          webtitle: this.siteConfigs.list.webtitle || '',
          webkeys: this.siteConfigs.list.webkeys || '',
          webdesc: this.siteConfigs.list.webdesc || '',
          weblogo: this.siteConfigs.list.weblogo || '',
          // 悦享福满满
          webname2: this.siteConfigs.list2.webname || '',
          webtitle2: this.siteConfigs.list2.webtitle || '',
          webkeys2: this.siteConfigs.list2.webkeys || '',
          webdesc2: this.siteConfigs.list2.webdesc || '',
          weblogo2: this.siteConfigs.list2.weblogo || ''
        }

        const response = await saveWebConfig(params)
        console.log('保存响应:', response)

        if (response.code === 200) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(response.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败，请稍后重试')
      } finally {
        this.loading = false
      }
    }
  })
},
    // 重置表单
    onReset() {
      this.form = {
        siteType: 'list',
        webname: '',
        webtitle: '',
        webkeys: '',
        webdesc: '',
        weblogo: ''
      }
      this.getConfigData()
    }
  }
}
</script>
<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
    padding: 20px;

    :deep(.el-form-item) {
      margin-bottom: 22px;
    }
  }
}

.logo-container {
  display: flex;
  // align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  flex-direction: column;

  .logo-preview {
    width: 125px;
    height: 70px;
    object-fit: contain;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .logo-uploader {
    display: inline-block;
  }
}
</style>