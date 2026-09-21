<template>
  <div class="kaquan-add">
    <el-card class="add-card">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="mt10">
        <!-- 接口类型 -->
        <el-form-item label="接口类型：" prop="type">
          <el-select v-model="form.type" style="width: 200px;" @change="onTypeChange">
            <el-option label="蜂助手" :value="1" />
            <el-option label="本地" :value="2" />
            <el-option label="亿奇达" :value="3" />
          </el-select>
        </el-form-item>

        <!-- 所属卡券 + 位置 同一行 -->
        <el-form-item label="所属卡券：" prop="class1">
          <el-select v-model="form.class1" placeholder="请选择卡券" filterable clearable style="width: 250px;">
            <el-option
              v-for="item in cardList"
              :key="item.id"
              :label="item.id + '-' + item.title"
              :value="item.id"
            />
          </el-select>
          <el-select v-model="form.weizhi" placeholder="请选择位置" clearable style="width: 180px; margin-left: 10px;">
            <el-option label="影视阅读会员" :value="1" />
            <el-option label="阅读会员" :value="2" />
            <el-option label="音乐会员" :value="3" />
            <el-option label="商城充值/石油卡" :value="4" />
          </el-select>
        </el-form-item>

        <!-- 名称 -->
        <el-form-item label="名称：" prop="title">
          <el-input v-model="form.title" placeholder="名称" style="width: 500px;" />
        </el-form-item>

        <!-- 规格 -->
        <el-form-item label="规格：" prop="gueige">
          <el-input v-model="form.gueige" placeholder="规格" style="width: 500px;" />
        </el-form-item>

        <!-- 链接地址 -->
        <el-form-item label="链接地址：" prop="url">
          <el-input v-model="form.url" placeholder="链接地址 直充用的url" style="width: 500px;" />
        </el-form-item>

        <!-- 限购 -->
        <el-form-item label="限购：" prop="sj">
          <el-select v-model="form.sj" style="width: 120px;">
            <el-option label="不限" :value="1" />
            <el-option label="每日" :value="2" />
            <el-option label="总限购" :value="3" />
          </el-select>
          <el-input-number v-model="form.num" :min="0" :max="999" style="width: 120px; margin-left: 10px;" placeholder="次数" />
          <span style="margin-left: 10px; color: #999;">次</span>
        </el-form-item>

        <!-- 有效日期（本地类型显示） -->
        <el-form-item label="有效日期：" prop="end_time" v-if="form.type === 2">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 200px;"
          />
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序：" prop="px">
          <el-input v-model="form.px"  style="width: 500px;" />
          <span style="color: #666666; margin-left: 10px;">填写整数,值越大,越靠前.</span>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片：" prop="img">
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="true"
            :show-file-list="false"
            :http-request="customUpload"
            :before-upload="beforeImageUpload"
          >
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span  class="fs12 color666">尺寸：516*522, 大小：1M以内</span>
        </el-form-item>

        <!-- 刊例价 -->
        <el-form-item label="刊例价：" prop="price">
          <el-input-number v-model="form.price" :precision="2" :step="1" :min="0" style="width: 150px;" />
          <span style="margin-left: 10px;">元</span>
        </el-form-item>

        <!-- 蜂助手/亿奇达 专属字段 (type=1或3时显示) -->
        <template v-if="form.type !== 2">
          <el-form-item label="供货折扣：" prop="zk_price">
            <el-input-number v-model="form.zk_price" :precision="2" :step="1" :min="0" :max="100" style="width: 150px;" />
            <span style="margin-left: 10px;">%</span>
          </el-form-item>

          <el-form-item label="供货价：" prop="ghprice">
            <el-input-number v-model="form.ghprice" :precision="2" :step="1" :min="0" style="width: 150px;" />
            <span style="margin-left: 10px;">元</span>
          </el-form-item>

          <el-form-item label="充值类型：" prop="cztype">
            <el-input v-model="form.cztype" placeholder="充值类型" style="width: 500px;" />
          </el-form-item>

          <el-form-item label="开票：" prop="kaipiao">
            <el-input v-model="form.kaipiao" placeholder="开票" style="width: 500px;" />
          </el-form-item>

          <el-form-item label="sku：" prop="sku">
            <el-input v-model="form.sku" placeholder="sku" style="width: 500px;" />
          </el-form-item>
        </template>

        <!-- 服务费（两列布局） -->
        <el-form-item label="服务费：" prop="fw_price">
          <el-input-number v-model="form.fw_price" :precision="2" :step="0.5" :min="0" style="width: 150px;" />
          <span style="margin-left: 10px;">元</span>
          <el-input-number v-model="form.fw_price1" :precision="2" :step="0.5" :min="0" style="width: 150px; margin-left: 20px;" />
          <span style="margin-left: 10px;">元</span>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注：" prop="beizhu">
          <el-input v-model="form.beizhu" placeholder="备注" style="width: 500px;" />
        </el-form-item>

        <!-- 内容（富文本） -->
        <el-form-item label="内容：" prop="content">
          <div class="wangeditor-box" style="width: 90%; border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
            <Editor style="height: 300px; overflow-y: hidden;" v-model="form.content" :defaultConfig="editorConfig" mode="default" @onCreated="handleEditorCreated" />
          </div>
        </el-form-item>

        <!-- 是否发布 -->
        <el-form-item label="是否发布：" prop="sh">
          <el-radio-group v-model="form.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否推荐首页 -->
        <el-form-item label="是否推荐首页：" prop="tuij">
          <el-radio-group v-model="form.tuij">
            <el-radio :label="1">推荐</el-radio>
            <el-radio :label="0">一般</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item label="发布时间：" prop="add_time">
          <el-date-picker
            v-model="form.add_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="'12:00:00'"
            style="width: 300px;"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="submitForm" :loading="submitting">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { 
  addGueige, 
  editGueige, 
  getGueige, 
  kqGueigeList 
} from '@/api/modules/zhichong'

import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'KaquanGueigeAdd',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      recordId: null,
      submitting: false,
      cardList: [],

      editorRef: null,
      toolbarConfig: {
        excludeKeys: ['emotion']
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload
          }
        }
      },

      form: {
        id: undefined,
        type: 1,              // 接口类型 1-蜂助手 2-本地 3-亿奇达
        class1: undefined,    // 所属卡券
        weizhi: 1,            // 位置
        title: '',            // 名称
        gueige: '',           // 规格
        url: '#',             // 链接地址
        sj: 1,                // 限购类型 1-不限 2-每日 3-总限购
        num: 0,               // 限购次数
        end_time: '',         // 有效日期
        px: 50,               // 排序
        img: '',              // 图片
        price: 0,             // 刊例价
        zk_price: undefined,  // 供货折扣
        ghprice: 0,           // 供货价
        cztype: '',           // 充值类型
        kaipiao: '',          // 开票
        sku: '',              // sku
        fw_price: 0,          // 服务费
        fw_price1: 0,         // 服务费2
        beizhu: '',           // 备注
        content: '',          // 内容
        sh: 1,                // 是否发布 1-发布 0-未发布
        tuij: 0,              // 是否推荐 1-推荐 0-一般
        add_time: ''          // 发布时间
      },

      rules: {
        type: [{ required: true, message: '请选择接口类型', trigger: 'change' }],
        class1: [{ required: true, message: '请选择所属卡券', trigger: 'change' }],
        weizhi: [{ required: true, message: '请选择位置', trigger: 'change' }],
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        gueige: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        price: [{ required: true, message: '请输入刊例价', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
        add_time: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
      }
    }
  },

  watch: {
    'form.type'(newVal) {
      if (newVal === 2) {
        // 本地类型：清空不需要的字段
        this.form.sku = ''
        this.form.zk_price = undefined
        this.form.ghprice = 0
        this.form.cztype = ''
        this.form.kaipiao = ''
      }
    }
  },

  created() {
    this.loadCardList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.recordId = parseInt(id)
      this.loadDetail()
    }
    if (!this.form.add_time) {
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
      this.form.add_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    onTypeChange() {
      // 类型切换时的处理
    },

    async loadCardList() {
      try {
        const res = await kqGueigeList()
        if (res.code === 200) {
          this.cardList = res.data || []
        }
      } catch (error) {
        console.error('获取卡券列表失败:', error)
      }
    },

    async loadDetail() {
      try {
        const res = await getGueige({ id: this.recordId })
        if (res.code === 200) {
          const data = res.data
          this.form = {
            id: data.id,
            type: data.type,
            class1: data.class1,
            weizhi: data.weizhi,
            title: data.title || '',
            gueige: data.gueige || '',
            url: data.url || '#',
            sj: data.sj !== undefined ? data.sj : 1,
            num: data.num !== undefined ? data.num : 0,
            end_time: data.end_time && data.end_time !== 0 ? this.formatDate(data.end_time) : '',
            px: data.px !== undefined ? data.px : 50,
            img: data.img || '',
            price: data.price !== undefined ? data.price : 0,
            zk_price: data.zk_price !== undefined ? parseFloat(data.zk_price) : undefined,
            ghprice: data.ghprice !== undefined ? data.ghprice : 0,
            cztype: data.cztype || '',
            kaipiao: data.kaipiao || '',
            sku: data.sku || '',
            fw_price: data.fw_price !== undefined ? data.fw_price : 0,
            fw_price1: data.fw_price1 !== undefined ? data.fw_price1 : 0,
            beizhu: data.beizhu || '',
            content: data.content || '',
            sh: data.sh !== undefined ? data.sh : 1,
            tuij: data.tuij !== undefined ? data.tuij : 0,
            add_time: data.add_time ? this.formatDateTime(data.add_time) : ''
          }
          if (!this.form.add_time) {
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

    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    handleEditorCreated(editor) {
      this.editorRef = editor
    },

    async handleWangEditorUpload(file, insertFn) {
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'kaquan/gueige')
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
      formData.append('file_url', 'kaquan/gueige')
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
          this.form.img = response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.form.img = error.response.data.data
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
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          this.submitting = true
          try {
            const submitData = {
              type: this.form.type,
              class1: this.form.class1,
              weizhi: this.form.weizhi,
              title: this.form.title,
              gueige: this.form.gueige,
              url: this.form.url,
              sj: this.form.sj,
              num: this.form.num,
              px: this.form.px,
              img: this.form.img,
              price: this.form.price,
              fw_price: this.form.fw_price,
              fw_price1: this.form.fw_price1,
              beizhu: this.form.beizhu,
              content: this.form.content,
              sh: this.form.sh,
              tuij: this.form.tuij,
              add_time: this.form.add_time
            }

            // 本地类型：添加 end_time
            if (this.form.type === 2 && this.form.end_time) {
              submitData.end_time = this.form.end_time
            }

            // 蜂助手/亿奇达类型：添加额外字段
            if (this.form.type !== 2) {
              submitData.sku = this.form.sku
              submitData.zk_price = this.form.zk_price
              submitData.ghprice = this.form.ghprice
              submitData.cztype = this.form.cztype
              submitData.kaipiao = this.form.kaipiao
            }

            let res
            if (this.isEdit) {
              submitData.id = this.form.id
              res = await editGueige(submitData)
            } else {
              res = await addGueige(submitData)
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
.kaquan-add {
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
        width: 130px;
        height: 130px;
        line-height: 130px;
        text-align: center;
      }

      .avatar {
        width: 130px;
        height: 130px;
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