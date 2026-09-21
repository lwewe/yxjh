<template>
  <div class="cake-add-pro">
    <el-card class="add-card txtleft mb20 " v-if="isEdit">
      <div>
        <span class="dangerCl">
          <span v-if="productForm.flag === 0">接口读取</span>
          <span v-if="productForm.flag === 1">后台添加</span>{{ uers ? uers.id : '' }}
        </span>
        {{ uers ? uers.username : '' }}
      </div>
    </el-card>

    <el-card class="add-card" v-loading="pageLoading">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="130px" style="text-align: left;">

        <!-- 商品名称 -->
        <el-form-item label="商品名称：" prop="title">
          <el-input v-model="productForm.title" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="商品描述：" prop="description">
          <el-input v-model="productForm.description" placeholder="商品描述" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 市场价 -->
        <el-form-item label="市场价：" prop="market_price">
          <el-input v-model="productForm.market_price" placeholder="市场价" style="width: 500px;" type="number"></el-input>
        </el-form-item>

        <!-- 售价 -->
        <el-form-item label="售价：" prop="price">
          <el-input v-model="productForm.price" placeholder="售价" style="width: 500px;" type="number"></el-input>
        </el-form-item>

        <!-- 品牌 -->
        <el-form-item label="所属品牌：" prop="brand_id">
          <el-select v-model="productForm.brand_id" filterable placeholder="请选择品牌" style="width:500px;">
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 配送城市 -->
        <el-form-item label="配送城市：" prop="city_ids">
          <el-select v-model="productForm.city_ids" multiple filterable placeholder="请选择配送城市" style="width:500px;"
            @change="handleCityChange">
            <el-option v-for="city in cityList" :key="city.id" :label="city.name" :value="city.id">
            </el-option>
          </el-select>

        </el-form-item>

        <!-- 商品规格 - 动态表格 -->
        <el-form-item label="商品规格：" prop="xinghao">
          <div class="spec-table">
            <el-table :data="productForm.specs" border style="width: 90%">
              <el-table-column label="规格名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" placeholder="如：1磅" size="small"
                    @blur="updateSpec(scope.row, 'name', scope.row.name)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="描述" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" placeholder="规格描述" size="small"
                    @blur="updateSpec(scope.row, 'description', scope.row.description)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" placeholder="价格" size="small"
                    @blur="updateSpec(scope.row, 'price', scope.row.price)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="市场价" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.market_price" placeholder="市场价" size="small"
                    @blur="updateSpec(scope.row, 'market_price', scope.row.market_price)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="结算价" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.clearing_price" placeholder="结算价" size="small"
                    @blur="updateSpec(scope.row, 'clearing_price', scope.row.clearing_price)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="赠品" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gift" placeholder="赠品" size="small"
                    @blur="updateSpec(scope.row, 'gift', scope.row.gift)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="口味" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.tastes" placeholder="多个口味用,分割" size="small"
                    @blur="updateSpec(scope.row, 'tastes', scope.row.tastes)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="120" align="center">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.deleted" :active-value="0" :inactive-value="1" active-text=" "
                    inactive-text=" " @change="handleSwitchStatus(scope.row)" :loading="scope.row.statusLoading"
                    :disabled="scope.row.isNew">
                  </el-switch>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120" fixed="right" align="center">
                <template slot-scope="scope">
                  <!-- <el-button type="danger" size="small" @click="removeSpecRow(scope.$index)">1删除</el-button> -->
                  <el-button type="danger" size="small"
                    @click="handleRemoveSpec(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="small" @click="addSpecRow" style="margin-bottom: 10px;">添加规格</el-button>

          </div>
        </el-form-item>

        <!-- 列表图上传 -->
        <!-- 列表图上传 - 修改 action -->
        <el-form-item label="列表图：" prop="image_path">
          <el-upload class="avatar-uploader" action="#" :http-request="uploadThumbnail" :show-file-list="false"
            :before-upload="beforeThumbnailUpload">
            <img v-if="productForm.image_path" :src="productForm.image_path" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>尺寸：320*320，大小：1M以内。</span>
        </el-form-item>

        <!-- 轮播图上传 -->
        <!-- 轮播图上传 - 修改后 -->
        <!-- 内页图上传 -->
        <el-form-item label="轮播图：">
          <el-upload action="#" list-type="picture-card" :http-request="uploadCarouselMultiple"
            :before-upload="beforeDetailImageUpload" :file-list="productForm.imgs_fileList"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemoveImage" class="bgImgs">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="previewVisible" append-to-body>
            <img width="100%" :src="previewUrl" alt="">
          </el-dialog>
          <span class="fs12">尺寸：640*640,大小：1M以内</span>
        </el-form-item>


        <!-- 标签 -->
        <el-form-item label="标签：" prop="label_name">
          <el-input v-model="productForm.label_name" placeholder="多个标签用,隔开，如：同城配送,当日达" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 富文本编辑器 - 商品详情 -->
        <!-- 富文本编辑器 - 商品详情 -->
        <el-form-item label="内容：" class="editorsnew" prop="content">
          <WangEditor v-if="!pageLoading" v-model="productForm.content" style="width: 90%;" />
        </el-form-item>

        <!-- 是否发布 -->
        <el-form-item label="是否发布："  v-if="isadmin == 1">
          <el-radio-group v-model="productForm.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否审核 -->
        <el-form-item label="是否审核："  v-if="isadmin == 1">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">已审核</el-radio>
            <el-radio :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 添加时间 -->
        <!-- 添加时间 -->
        <el-form-item label="添加时间：">
          <el-date-picker v-model="productForm.createtime" type="datetime" placeholder="选择发布时间"
            format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
          <el-button @click="goBack">返回</el-button>

          <!-- <el-button @click="resetForm">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>



import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'  // 添加这一行
import { addGoodscake, getGoodscake, editGoodscake, goodsCityListcake, goodsBrandListcake, addSpecscake, editSpecscake, delSpecscake, switchSpecsStatuscake } from '@/api/modules/login'
// import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import '@wangeditor/editor/dist/css/style.css'
import WangEditor from '@/components/WangEditorcake.vue'

export default {
  name: 'AddProcake',
  components: { WangEditor },
  data() {
    return { isadmin: localStorage.getItem('is_super_admin'),
      pageLoading: true,  // 改成 true
      uers: '',
      specUpdating: false,  // 防止规格重复提交
      previewVisible: false,
      previewUrl: '',
      isEdit: false,  // 是否是编辑模式
      productId: null, // 编辑时的产品ID
      submitting: false,

      // 富文本编辑器
      // editor: null,
      // mode: 'default',
      // toolbarConfig: { excludeKeys: ['emotion'] },
      // editorConfig: {
      //   placeholder: '请输入商品详情内容...',
      //   MENU_CONF: {
      //     uploadImage: {
      //       customUpload: this.handleWangEditorUpload
      //     }
      //   }
      // },

      // 城市列表
      cityList: [],

      // 品牌列表
      brandList: [],

      // 表单数据
      productForm: {
        title: '',           // 商品名称
        description: '',     // 商品描述
        market_price: '',    // 市场价
        price: '',           // 售价
        brand_id: '',        // 品牌id
        city_ids: [],        // 配送城市数组
        label_name: '',      // 标签 多个,隔开
        content: '',         // 详情内容
        status: 0,           // 是否发布 1-是 0-否
        sh: 0,               // 是否审核 1-审核 0-未审核
        createtime: '',      // 添加时间（时间戳）
        image_path: '',      // 列表图
        imgs: '',              // 存储用 - 连接的URL字符串
        imgs_fileList: [],
        specs: [], flag: ''            // 规格列表
      },

      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        market_price: [{ required: true, message: '请输入市场价', trigger: 'blur' }],
        price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
        brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        city_ids: [{ required: true, message: '请选择配送城市', trigger: 'change' }]
      },

      // 上传队列
      // wangEditorUploadQueue: [],
      // isWangEditorUploading: false
    }
  },
  async created() {
    setTimeout(() => {
      const elMain = document.querySelector('.el-main')
      if (elMain) {
        elMain.scrollTop = 0
      }
    }, 100)
    this.productForm.createtime = Date.now()
    this.getCityList()
    const id = this.$route.query.id || this.$route.params.id
    console.log('获取到的ID:', id)  // ✅ 调试日志
    await this.getBrandList()
    if (id && id !== 'null' && id !== 'undefined' && id !== '') {
      this.isEdit = true
      this.productId = Number(id)  // ✅ 转为数字
      console.log('编辑模式，产品ID:', this.productId)

      this.getProductDetail(this.productId)
    } else {
      console.log('新增模式')
      if (this.productForm.specs.length === 0) {
        this.addSpecRow()
      }
    }
    this.pageLoading = false
  },
  beforeDestroy() {

  },
  methods: {
    // 内页图上传
    async uploadCarouselMultiple(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/product')
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

        // 兼容多种返回格式
        let imageUrl = ''
        if (response.data?.data?.url) {
          imageUrl = response.data.data.url
        } else if (typeof response.data?.data === 'string') {
          imageUrl = response.data.data
        } else if (response.data?.url) {
          imageUrl = response.data.url
        }

        if (!imageUrl) {
          this.$message.error('上传失败：未获取到图片地址')
          return Promise.reject(new Error('未获取到图片地址'))
        }

        // 统一添加图片
        this.addImage(imageUrl, file)
        this.$message.success('上传成功')

        return {
          url: imageUrl,
          name: file.name,
          uid: file.uid
        }
      } catch (error) {
        const data = error?.response?.data
        if (data?.status === 200 || data?.code === 200) {
          let imageUrl = data?.data?.url || data?.data || data?.url
          if (imageUrl) {
            this.addImage(imageUrl, file)
            this.$message.success('上传成功')
            return { url: imageUrl, name: file.name, uid: file.uid }
          }
        }
        this.$message.error('上传失败，请稍后重试')
        return Promise.reject(error)
      }
    },
    // 添加图片（同时更新 imgs 和 fileList）
    addImage(imageUrl, file) {
      // 更新 imgs 字符串
      if (this.productForm.imgs && this.productForm.imgs.trim() !== '') {
        const cleanImgs = this.productForm.imgs.replace(/\s+/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
        this.productForm.imgs = cleanImgs + '-' + imageUrl
      } else {
        this.productForm.imgs = imageUrl
      }

      // 同步更新 fileList
      this.productForm.imgs_fileList.push({
        url: imageUrl,
        name: file ? file.name : 'image',
        uid: file ? file.uid : Date.now()
      })
    },
    // 切换规格上下架状态
    async handleSwitchStatus(spec) {
      // 新增的规格不能切换状态
      if (!spec.ggid || spec.isNew) {
        this.$message.warning('请先保存商品后再操作')
        // 恢复原来的状态
        spec.deleted = spec.deleted === 0 ? 1 : 0
        return
      }

      // 保存旧状态，用于失败时恢复
      const oldStatus = spec.deleted === 0 ? 1 : 0

      // 设置加载状态
      this.$set(spec, 'statusLoading', true)

      try {
        const params = new FormData()
        params.append('ggid', String(spec.ggid))
        params.append('pid', String(this.productId))

        const res = await switchSpecsStatuscake(params)

        if (res.code === 200) {
          // 更新为服务器返回的最新状态
          this.$set(spec, 'deleted', res.data.deleted)
          const statusText = res.data.deleted === 0 ? '上架' : '下架'
          this.$message.success(`规格已${statusText}`)
        } else {
          this.$message.error(res.msg || '状态修改失败')
          // 恢复原来的状态
          this.$set(spec, 'deleted', oldStatus)
        }
      } catch (error) {
        console.error('切换规格状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 恢复原来的状态
        this.$set(spec, 'deleted', oldStatus)
      } finally {
        this.$set(spec, 'statusLoading', false)
      }
    },
    goBack() {
      this.$router.push({ name: 'CakeList' })
    },
    // 添加规格行
    addSpecRow() {
      const newSpec = {
        name: '',
        description: '',
        price: '',
        market_price: '',
        clearing_price: '',
        gift: '',
        tastes: '',
        ggid: null,  // 新增规格没有 ggid
        isNew: true,  // 标记为新增
        deleted: 0,  // 新增：默认上架
        statusLoading: false  // 新增：切换状态的加载标识
      }
      this.productForm.specs.push(newSpec)

      // 编辑模式下，立即调用添加规格接口
      if (this.isEdit && this.productId) {
        this.addSpecToServer(newSpec, this.productForm.specs.length - 1)
      }
    },

    // 新增规格到服务器
    async addSpecToServer(spec, index) {
      if (this.specUpdating) return
      this.specUpdating = true

      try {
        const params = new FormData()
        params.append('pid', this.productId)

        const res = await addSpecscake(params)
        if (res.code === 200) {
          spec.ggid = res.data.id
          spec.isNew = false
          this.$message.success('规格添加成功')
        } else {
          this.$message.error(res.msg || '规格添加失败')
          // 添加失败，移除这一行
          this.productForm.specs.splice(index, 1)
        }
      } catch (error) {
        console.error('添加规格失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.productForm.specs.splice(index, 1)
      } finally {
        this.specUpdating = false
      }
    },

    // 规格字段变化时更新（blur 事件）
    async updateSpec(spec, field, value) {
      // 更新本地数据
      spec[field] = value

      // 编辑模式下，且有 ggid（已存在的规格），调用修改接口
      if (this.isEdit && spec.ggid && !spec.isNew) {
        if (this.specUpdating) return
        this.specUpdating = true

        try {
          const params = new FormData()
          params.append('pid', this.productId)
          params.append('ggid', spec.ggid)
          params.append('name', spec.name || '')
          params.append('description', spec.description || '')
          params.append('price', spec.price || '')
          params.append('market_price', spec.market_price || '')
          params.append('clearing_price', spec.clearing_price || '')
          params.append('gift', spec.gift || '')
          params.append('tastes', spec.tastes || '')
          // params.append('deleted', spec.deleted !== undefined ? spec.deleted : '0')
          params.append('deleted', spec.deleted !== undefined ? String(spec.deleted) : '0')  // 包含状态

          const res = await editSpecscake(params)
          if (res.code !== 200) {
            this.$message.error(res.msg || '规格修改失败')
          } else {
            this.$message.success(res.msg)

          }
        } catch (error) {
          console.error('修改规格失败:', error)
          this.$message.error('网络错误，请稍后重试')
        } finally {
          this.specUpdating = false
        }
      }
    },



    // 城市选择变化时重新加载品牌列表
    handleCityChange(selectedCities) {
      // 如果选择了城市，可以根据第一个城市来筛选品牌
      if (selectedCities && selectedCities.length > 0) {
        this.getBrandList(selectedCities[0])
      } else {
        this.getBrandList()
      }
    },
    // 轮播图上传


    // 列表图上传方法
    // 列表图上传
    async uploadThumbnail(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/product')  // 产品图路径
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
          this.productForm.image_path = response.data.data
          this.$message.success('上传成功')
        } else if (response.data.code === 200) {
          this.productForm.image_path = response.data.data.url || response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        console.error('上传失败:', error)
        if (error.response?.data?.status === 200 || error.response?.data?.code === 200) {
          this.productForm.image_path = error.response.data.data.url || error.response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败，请稍后重试')
        }
      }
    },
    // 内页图预览
    handlePictureCardPreview(file) {
      this.previewUrl = file.url
      this.previewVisible = true
    },

    // 内页图上传


    // 删除内页图
    // 删除内页图
    handleRemoveImage(file, fileList) {
      this.productForm.imgs = fileList
        .filter(item => item.url && item.url.trim() !== '')
        .map(item => item.url.trim())
        .join('-')
      console.log('删除后 imgs:', this.productForm.imgs)
    },
    // 获取城市列表
    async getCityList() {
      try {
        const res = await goodsCityListcake()
        if (res.code === 200) {
          this.cityList = res.data || []
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    // 获取品牌列表
    // 获取品牌列表（与 CakeList 保持一致）
    async getBrandList(cityId = '') {
      try {
        const params = new FormData()
        // 判断是否为管理员
        const isAdmin = localStorage.getItem('is_super_admin') === '1'

        if (isAdmin) {
          params.append('flag', '1')
          if (cityId) {
            params.append('city_id', cityId)
          }
        } else {
          // 供应商模式
          params.append('flag', '3')
          const uid = this.$store.state?.user?.userInfo?.uid || localStorage.getItem('uid') || ''
          if (uid) {
            params.append('uid', uid)
          }
        }

        const res = await goodsBrandListcake(params)
        if (res.code === 200) {
          this.brandList = (res.data || []).map(item => ({
            value: Number(item.id),
            label: item.name
          }))
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      }
    },

    // 获取产品详情（编辑模式）
    // 获取产品详情（编辑模式）
    async getProductDetail(id) {
      try {
        const params = new FormData()
        params.append('id', id)
        const res = await getGoodscake(params)
        if (res.code === 200) {
          const data = res.data
          this.uers = res.data.user;
          // 处理内页图 - 从 imgs 字符串解析为 fileList 格式
          let imgsFileList = []
          if (data.imgs) {
            const cleanImgs = data.imgs.replace(/\s+/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
            const urls = cleanImgs.split('-').filter(url => url && url.startsWith('http'))


            imgsFileList = urls.map((url, index) => ({
              url: url,
              name: `image_${index}`,
              uid: Date.now() + index
            }))
          } else if (data.banner && data.banner.length > 0) {
            imgsFileList = data.banner.map((item, index) => ({
              url: item.l_path || item.m_path,
              name: `image_${index}`,
              uid: Date.now() + index
            }))
          }


          let createtime = Date.now()
          if (data.createtime && data.createtime > 1000000000) {
            createtime = data.createtime * 1000  // ✅ 秒转毫秒
          } else if (data.createtime && data.createtime > 0) {
            createtime = data.createtime
          }

          this.productForm = {
            title: data.title || '',
            description: data.description || '',
            market_price: data.market_price || '',
            price: data.price || '',
            brand_id: data.brand_id ? Number(data.brand_id) : '',
            city_ids: this.parseCityIds(data.city_ids || ''),
            label_name: data.label_name || '',
            content: data.content || '',
            status: data.status !== undefined ? data.status : 1,
            sh: data.sh !== undefined ? data.sh : 1,

            createtime: createtime,
            image_path: data.image_path || '',
            imgs: data.imgs || '',
            imgs_fileList: imgsFileList,
            specs: [],
            flag: data.flag
          }

          // 处理规格数据
          if (data.list_xinghao && data.list_xinghao.length > 0) {
            this.productForm.specs = data.list_xinghao.map(item => ({
              ggid: item.ggid,
              name: item.name || '',
              description: item.description || '',
              price: item.price || '',
              market_price: item.market_price || '',
              clearing_price: item.clearing_price || '',
              gift: item.gift || '',
              tastes: item.tastes || '',  // 口味字段
              isNew: false,  // 已有的规格
              deleted: item.deleted !== undefined ? Number(item.deleted) : 0,  // 新增：上下架状态
              statusLoading: false  // 新增：切换状态的加载标识
            }))
          } else {
            this.addSpecRow()
          }

          // 编辑模式下，如果品牌有值，根据品牌所在城市重新获取品牌列表（可选）
          if (this.productForm.brand_id) {
            // 可以获取品牌详情或者不处理
          }
        }
      } catch (error) {
        console.error('获取产品详情失败:', error)
        this.$message.error('获取产品详情失败')
      }
    },
    formatTimestampForPicker(timestamp) {
      if (!timestamp) return ''
      // 如果 timestamp 是秒级时间戳，转换为毫秒
      const date = new Date(timestamp * 1000)
      return date
    },
    // 格式化显示时间（用于调试）
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    // 解析城市ID字符串 "+2+111+65+"
    parseCityIds(cityIdsStr) {
      if (!cityIdsStr) return []
      const matches = cityIdsStr.match(/\d+/g)
      return matches ? matches.map(Number) : []
    },

    // 富文本图片上传



    // 添加规格行


    // 删除规格行
    removeSpecRow(index) {
      if (this.productForm.specs.length > 1) {
        this.productForm.specs.splice(index, 1)
      } else {
        this.$message.warning('至少保留一条规格')
      }
    },// 带确认的删除方法
    async handleRemoveSpec(index, spec) {
      try {
        await this.$confirm('确定要删除该规格吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 设置加载状态
        this.$set(spec, 'deleting', true)

        if (spec.ggid && !spec.isNew && this.isEdit) {
          const params = new FormData()
          params.append('pid', this.productId)
          params.append('ggid', spec.ggid)

          const res = await delSpecscake(params)
          if (res.code === 200) {
            this.$message.success('规格删除成功')
            this.productForm.specs.splice(index, 1)
            if (this.productForm.specs.length === 0) {
              this.addSpecRow()
            }
          } else {
            this.$message.error(res.msg || '规格删除失败')
          }
        } else {
          // 新增规格直接移除
          this.productForm.specs.splice(index, 1)
          if (this.productForm.specs.length === 0) {
            this.addSpecRow()
          }
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除规格失败:', error)
          this.$message.error('网络错误，请稍后重试')
        }
      } finally {
        this.$set(spec, 'deleting', false)
      }
    },

    beforeThumbnailUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type.startsWith('image/')
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },








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

    // 提交表单
    // 提交表单
    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
          return
        }

        // 验证规格数据
        const validSpecs = this.productForm.specs.filter(spec => spec.name && spec.name.trim() !== '')
        if (validSpecs.length === 0) {
          this.$message.error('请至少添加一条规格并填写规格名称')
          return
        }

        // 检查每个规格的必填字段
        for (let i = 0; i < validSpecs.length; i++) {
          const spec = validSpecs[i]
          if (!spec.price || spec.price === '') {
            this.$message.error(`规格"${spec.name}"的价格不能为空`)
            return
          }
          if (!spec.market_price || spec.market_price === '') {
            this.$message.error(`规格"${spec.name}"的市场价不能为空`)
            return
          }
          if (!spec.clearing_price || spec.clearing_price === '') {
            this.$message.error(`规格"${spec.name}"的结算价不能为空`)
            return
          }
        }

        this.submitting = true

        try {
          const params = new FormData()
          if (this.isEdit && this.productId) {
            params.append('id', String(this.productId))
            console.log('编辑模式，提交ID:', this.productId)
          } else {
            console.log('新增模式')
          }
          // 添加基本参数
          params.append('title', this.productForm.title)
          params.append('description', this.productForm.description || '')
          params.append('market_price', this.productForm.market_price)
          params.append('price', this.productForm.price)
          params.append('brand_id', this.productForm.brand_id)
          params.append('label_name', this.productForm.label_name || '')
          params.append('content', this.productForm.content || '')
          params.append('status', this.productForm.status)
          params.append('sh', this.productForm.sh)

          // 时间戳转换：毫秒 -> 秒
          const timestampSeconds = this.productForm.createtime
            ? Math.floor(Number(this.productForm.createtime) / 1000)
            : Math.floor(Date.now() / 1000)
          params.append('createtime', timestampSeconds)

          // 处理城市ID
          if (this.productForm.city_ids && this.productForm.city_ids.length > 0) {
            const cityIdsStr = '+' + this.productForm.city_ids.join('+') + '+'
            params.append('city_ids', cityIdsStr)
          }

          // 处理列表图
          if (this.productForm.image_path) {
            params.append('image_path', this.productForm.image_path)
          }


          // 处理内页图 - 直接使用 imgs 字符串
          if (this.productForm.imgs) {
            params.append('imgs', this.productForm.imgs)
          }

          // 提交表单中的规格处理 - 统一处理
          const specsToSubmit = validSpecs.map(spec => ({
            name: spec.name,
            description: spec.description || '',
            price: String(spec.price),
            market_price: String(spec.market_price),
            clearing_price: String(spec.clearing_price),
            gift: spec.gift || '',
            tastes: spec.tastes || '',
            deleted: spec.deleted !== undefined ? String(spec.deleted) : '0'  // 包含状态
          }))

          const xinghaoJson = JSON.stringify(specsToSubmit)
          console.log('提交的规格数据:', xinghaoJson)
          params.append('xinghao', xinghaoJson)

          let res
          if (this.isEdit && this.productId) {
            res = await editGoodscake(params)  // 编辑接口
          } else {
            res = await addGoodscake(params)   // 新增接口
          }
          if (res.code === 200) {
            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
            setTimeout(() => {
              this.$router.push('/cake/list')
            }, 1500)
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('网络错误，请稍后重试')
        } finally {
          this.submitting = false
        }
      })
    },


  }
}
</script>


<style lang="scss" scoped>
.cake-add-pro {
  .add-card {


    :deep(.el-table th.el-table__cell) {
      padding: 1px 0
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
        font-size: 14px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }

      .avatar {
        width: 88px;
        height: 88px;
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
          cursor: pointer;
          background: #f56c6c;
          color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

  }
}
</style>