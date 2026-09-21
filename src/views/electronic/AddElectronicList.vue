<template>
  <div class="electric-add-list">
    <el-card class="add-card">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="120px" class="mt10">

        <!-- 标题 -->
        <el-form-item label="标题：" prop="title">
          <el-input v-model="productForm.title" placeholder="请输入电子券标题" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="productForm.price"  :controls="true"
            placeholder="请输入价格" style="width: 500px;">
          </el-input>
          <span style="margin-left: 10px; color: #999;">元</span>
        </el-form-item>

        <!-- 限购类型 -->
        <el-form-item label="限购类型：" prop="sj">
          <el-radio-group v-model="productForm.sj">
            <el-radio :label="1">不限购</el-radio>
            <el-radio :label="2">每日限购</el-radio>
            <el-radio :label="3">总限购</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 限购次数 -->
        <el-form-item label="限购次数：" prop="num" v-if="productForm.sj !== 1">
          <el-input-number v-model="productForm.num" :min="1" :max="999" :step="1" placeholder="请输入限购次数"
            style="width: 150px;">
          </el-input-number>
          <span style="margin-left: 10px; color: #999;">
            {{ productForm.sj === 2 ? '次/天' : '次/总' }}
          </span>
        </el-form-item>
        <!-- 品牌选择 -->
        <el-form-item label="品牌：" prop="brand_id">
          <el-select v-model="productForm.brand_id" placeholder="请选择品牌" filterable clearable style="width: 300px;"
            @visible-change="handleBrandVisibleChange">
            <el-option v-for="item in brandList" :key="item.id" :label="item.title" :value="item.id">
              <span>{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px;">
                {{ item.type === 1 ? '饮品' : '烘焙' }}
              </span>
            </el-option>
          </el-select>
          <!-- <el-button type="text" @click="addNewBrand" style="margin-left: 10px;">+ 新增品牌</el-button> -->
        </el-form-item>

        <!-- 价格 -->


        <!-- 城市选择 - 复选框列表 -->
        <el-form-item label="可售城市：" prop="city_id">
           <div class="selected-cities-info">
    <div style="color: #999; font-size: 12px; margin: 1px 0 5px;">
      已选择 <span style="color: #409eff; font-weight: bold;">{{ productForm.city_id.length }}</span> 个城市
    </div>
    <div class="selected-cities-tags" v-if="productForm.city_id.length > 0">
      <el-tag
        v-for="cityId in productForm.city_id"
        :key="cityId"
        closable
        size="small"
        type="info"
        @close="removeCity(cityId)"
        class="city-tag"
      >
        {{ getCityNameById(cityId) }}
      </el-tag>
    </div>
  </div>
          <div class="city-select-container">
            <div class="city-header">
              <el-checkbox :indeterminate="isCityIndeterminate" v-model="checkAllCities"
                @change="handleCheckAllCitiesChange">
                全选所有城市
              </el-checkbox>
             
            </div>

            <div class="city-list" v-loading="cityLoading">
              <!-- 按首字母分组 -->
              <div v-for="group in filteredCityGroups" :key="group.letter" class="city-group">
                <div class="city-group-title">{{ group.letter }}</div>
                <el-checkbox-group v-model="productForm.city_id" @change="handleCityChange">
                  <el-checkbox v-for="city in group.cities" :key="city.id" :label="city.id" class="city-checkbox">
                    {{ city.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div v-if="filteredCityGroups.length === 0" class="city-empty">
                暂无城市数据
              </div>
            </div>
          </div>
          <!-- <div style="color: #999; font-size: 12px; margin-top: 5px;">
            已选择 {{ productForm.city_id.length }} 个城市
          </div> -->

          <!-- 已选城市展示 -->
 

        </el-form-item>

        <!-- 列表图上传 -->
        <el-form-item label="列表图：" prop="img">
          <el-upload class="avatar-uploader" action="" :auto-upload="true" :show-file-list="false"
            :http-request="customImageUpload" :before-upload="beforeImageUpload">
            <img v-if="productForm.img" :src="productForm.img" class="contain" style="width: 175px;object-fit: contain;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div  class="fs12 color666">尺寸:175*175,大小：1M以内</div>
        </el-form-item>

        <!-- 兑换须知（富文本编辑器） -->
        <el-form-item label="兑换须知：" prop="content">
          <div style="border: 1px solid #ccc; width: 95%;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 300px; overflow-y: auto;" v-model="productForm.content" :defaultConfig="editorConfig"
              mode="default" @onCreated="handleEditorCreated" />
          </div>
          <div v-if="uploading" class="upload-tip">
            <i class="el-icon-loading"></i> 正在上传图片... ({{ uploadedCount }}/{{ totalCount }})
          </div>
        </el-form-item>


        <el-form-item label="发布状态：" prop="sh">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">立即发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 添加时间 -->
        <el-form-item label="发布时间：" prop="add_time">
          <el-date-picker v-model="productForm.add_time" type="datetime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

        <!-- 发布状态 -->


        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
          <!-- <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  addCouponscoupons,
  getCouponscoupons,
  editCouponscoupons,
  pinpaiListcoupons,
  chengshiListcoupons
} from '@/api/modules/login'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default {
  name: 'AddElectronicList',
  components: { Editor, Toolbar },
  data() {
    return {
      isEdit: false,
      editId: null,
      submitting: false,

      productForm: {
        title: '',
        brand_id: '',
        price: 0,
        city_id: [],
        img: '',
        content: '',
        sj: 1,
        num: 1,
        add_time: '',
        sh: 1
      },

      rules: {
        title: [
          { required: true, message: '请输入电子券标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' }
        ],
        city_id: [
          { required: true, type: 'array', min: 1, message: '请选择可售城市', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传列表图', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写兑换须知', trigger: 'blur' }
        ],
        add_time: [
          { required: true, message: '请选择添加时间', trigger: 'change' }
        ]
      },

      brandList: [],
      brandLoading: false,

      cityList: [],
      cityLoading: false,

      citySearchKeyword: '',
      checkAllCities: false,
      isCityIndeterminate: false,

      editorRef: null,
      toolbarConfig: {
        excludeKeys: []
      },
      editorConfig: {
        placeholder: '请填写兑换须知，支持图文混排...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.handleWangEditorUpload,
            checkImage: (file) => {
              if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                this.$message.error('只支持 jpg、png、gif、webp 格式')
                return false
              }
              if (file.size > 1024 * 1024) {
                this.$message.error('图片大小不能超过 1MB')
                return false
              }
              return true
            }
          }
        }
      },

      uploading: false,
      uploadedCount: 0,
      totalCount: 0,
      uploadQueue: []
    }
  },
  computed: {
    cityGroups() {
      const groups = {}
      this.cityList.forEach(city => {
        const letter = city.first_letter
        if (!groups[letter]) {
          groups[letter] = []
        }
        groups[letter].push(city)
      })

      const sortedGroups = Object.keys(groups).sort().map(letter => ({
        letter,
        cities: groups[letter]
      }))

      return sortedGroups
    },

    filteredCityGroups() {
      if (!this.citySearchKeyword) {
        return this.cityGroups
      }

      const keyword = this.citySearchKeyword.toLowerCase()
      return this.cityGroups
        .map(group => ({
          ...group,
          cities: group.cities.filter(city =>
            city.name.toLowerCase().includes(keyword) ||
            city.first_letter.toLowerCase().includes(keyword)
          )
        }))
        .filter(group => group.cities.length > 0)
    }
  },
  watch: {
    'productForm.city_id': {
      handler(val) {
        const allVisibleCityIds = this.filteredCityGroups.reduce((ids, group) => {
          return ids.concat(group.cities.map(city => city.id))
        }, [])

        if (allVisibleCityIds.length === 0) {
          this.checkAllCities = false
          this.isCityIndeterminate = false
        } else {
          this.checkAllCities = allVisibleCityIds.every(id => val.includes(id))
          this.isCityIndeterminate =
            !this.checkAllCities &&
            allVisibleCityIds.some(id => val.includes(id))
        }
      },
      deep: true
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.editId = id
      this.getDetail(id)
    }

    this.setDefaultTime()
    this.getBrandList()
    this.getCityList()
  },
  beforeDestroy() {
    if (this.editorRef && this.editorRef.destroy) {
      this.editorRef.destroy()
    }
  },
  methods: {
     // 根据城市ID获取城市名称
  getCityNameById(cityId) {
    const city = this.cityList.find(item => item.id === cityId)
    return city ? city.name : '未知城市'
  },

  // 移除单个城市
  removeCity(cityId) {
    const index = this.productForm.city_id.indexOf(cityId)
    if (index > -1) {
      this.productForm.city_id.splice(index, 1)
    }
  },
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

    async getDetail(id) {
      try {
        const params = new FormData()
        params.append('id', id)

        const res = await getCouponscoupons(params)

        if (res.code === 200 && res.data) {
          const data = res.data
          this.productForm = {
            title: data.title || '',
            brand_id: data.brand_id || '',
            price: data.price || 0,
            city_id: data.city_id ? data.city_id.split(',').filter(item => item && item !== '').map(Number) : [],
            img: data.img || '',
            content: data.content || '',
            sj: data.sj || 1,
            num: data.num || 1,
            add_time: this.formatTimestamp(data.add_time),
            sh: data.sh || 1
          }
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
      }
    },

    formatTimestamp(timestamp) {
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

    async getBrandList() {
      this.brandLoading = true
      try {
        const params = new FormData()
        const res = await pinpaiListcoupons(params)

        if (res.code === 200 && res.data) {
          this.brandList = res.data
        } else {
          this.$message.error(res.msg || '获取品牌列表失败')
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('获取品牌列表失败')
      } finally {
        this.brandLoading = false
      }
    },

    async getCityList() {
      this.cityLoading = true
      try {
        const params = new FormData()
        const res = await chengshiListcoupons(params)

        if (res.code === 200 && res.data) {
          this.cityList = res.data
        } else {
          this.$message.error(res.msg || '获取城市列表失败')
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
        this.$message.error('获取城市列表失败')
      } finally {
        this.cityLoading = false
      }
    },

    handleBrandVisibleChange(visible) {
      if (visible && this.brandList.length === 0) {
        this.getBrandList()
      }
    },

    handleCheckAllCitiesChange(val) {
      const allVisibleCityIds = this.filteredCityGroups.reduce((ids, group) => {
        return ids.concat(group.cities.map(city => city.id))
      }, [])

      if (val) {
        const newIds = [...new Set([...this.productForm.city_id, ...allVisibleCityIds])]
        this.productForm.city_id = newIds
      } else {
        this.productForm.city_id = this.productForm.city_id.filter(
          id => !allVisibleCityIds.includes(id)
        )
      }
    },

    handleCityChange() { },

    addNewBrand() {
      this.$router.push({ name: 'AddBrand' })
    },

    // 列表图上传前验证
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

    // 自定义上传列表图
    async customImageUpload(options) {
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
      formData.append('file_url', 'coupons/listimg')
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
          this.productForm.img = response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(response.data)
        } else {
          this.$message.error(response.data.msg || '上传失败')
          if (onError) onError(new Error(response.data.msg))
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200) {
          this.productForm.img = error.response.data.data
          this.$message.success('图片上传成功')
          if (onSuccess) onSuccess(error.response.data)
        } else {
          console.error('上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
          if (onError) onError(error)
        }
      }
    },

    // 富文本编辑器图片上传
    async handleWangEditorUpload(file, insertFn) {
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'coupons/content')
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
          console.error('上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
        }
      }
    },

    handleEditorCreated(editor) {
      this.editorRef = editor
    },

    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写完整信息')
          return false
        }

        this.submitting = true

        try {
          const params = new FormData()
          params.append('title', this.productForm.title)
          params.append('brand_id', this.productForm.brand_id)
          params.append('price', this.productForm.price)
          params.append('city_id', this.productForm.city_id.join(','))
          params.append('img', this.productForm.img)
          params.append('content', this.productForm.content)
          params.append('sj', this.productForm.sj)
          params.append('num', this.productForm.num)
          params.append('add_time', this.productForm.add_time)
          params.append('sh', this.productForm.sh)

          let res
          if (this.isEdit) {
            params.append('id', this.editId)
            res = await editCouponscoupons(params)
          } else {
            res = await addCouponscoupons(params)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            setTimeout(() => {
              this.$router.push({ name: 'ElectronicList' })
            }, 1500)
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('提交失败，请稍后重试')
        } finally {
          this.submitting = false
        }
      })
    },

    resetForm() {
      this.$refs.productForm.resetFields()
      this.productForm = {
        title: '',
        brand_id: '',
        price: 0,
        city_id: [],
        img: '',
        content: '',
        sj: 1,
        num: 1,
        add_time: this.productForm.add_time,
        sh: 1
      }
      this.citySearchKeyword = ''
    },

    goBack() {
      this.$router.push({ name: 'ElectronicList' })
    }
  }
}
</script>

<style scoped>
.electric-add-list {
  text-align: left;
  /* 已选城市标签样式 */
.selected-cities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  /* padding: 8px; */
  /* background-color: #ffffff; */
  /* border: 1px solid #f5f7fa; */
  /* border-radius: 4px; */
  width: 97%;
  margin-bottom: 10px;
}

.city-tag {
  cursor: pointer;
}

.city-tag :deep(.el-tag__close) {
  color: #909399;
}

.city-tag :deep(.el-tag__close:hover) {
  color: #fff;
  background-color: #909399;
}

/* 标签滚动条样式 */
.selected-cities-tags::-webkit-scrollbar {
  width: 4px;
}

.selected-cities-tags::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.selected-cities-tags::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
}

.add-card {
  padding: 20px;
}

.avatar-uploader :deep(.el-upload) {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  display: inline-block;
}

.avatar {
  width: 148px;
  height: 148px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  margin-top: 10px;
  color: #409EFF;
  font-size: 12px;
}

/* 城市选择器样式 */
/* 城市选择器样式 */
.city-select-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  width: 97%;
  background-color: #fff;
}

.city-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}

.city-list {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏横向滚动条 */
  padding: 0 10px;
}

.city-group {
  margin-bottom: 15px;
  overflow: hidden;
  /* 清除浮动 */
}

.city-group-title {
  font-weight: bold;
  font-size: 14px;
  color: #409eff;
  padding: 5px 0;
  border-left: 3px solid #409eff;
  padding-left: 10px;
  margin-bottom: 10px;
  background-color: #f5f7fa;
}

/* 关键修改：复选框样式 - 超出隐藏 */
.city-checkbox {
  display: inline-block;
  width: 130px;
  /* 固定宽度 */
  margin: 8px 0;
  overflow: hidden;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  white-space: nowrap;
  /* 强制不换行 */
  vertical-align: middle;
  transition: all 0.2s ease;
}

/* hover时显示完整内容 */


/* 深度选择器确保el-checkbox内部文字也超出隐藏 */
.city-checkbox :deep(.el-checkbox__label) {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}


.city-empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* 滚动条样式 */
.city-list::-webkit-scrollbar {
  width: 6px;
}

.city-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.city-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.city-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>