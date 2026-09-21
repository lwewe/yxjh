<template>
  <div class="productAdd">
    <el-card class="add-card" v-loading="pageLoading">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="130px" class="product-form mt10">
        <!-- 供应商选择 -->
        <el-form-item label="供应商：" prop="uid" v-if="isadmin == 1">
          <el-select v-model="productForm.uid" placeholder="请选择供应商" filterable style="width: 500px;" clearable>
            <el-option label="后台添加" :value="0"></el-option>
            <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 商品名称 -->
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 所属分类 -->
        <el-form-item label="所属分类：" prop="category">
          <el-select v-model="productForm.class1" filterable placeholder="请选择一级分类" style="width:250px;"
            @change="handleCategory1Change">
            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="productForm.class2" filterable placeholder="请选择二级分类" style="width:250px;"
            :disabled="!productForm.class1">
            <el-option v-for="item in currentSubCategories" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 品牌 -->
        <el-form-item label="品牌：" prop="brand_id">
          <el-select v-model="productForm.brand_id" filterable placeholder="请选择品牌" style="width:500px;">
            <el-option v-for="item in brandList" :key="item.value" :label="item.brand" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 商品条形码 -->
        <el-form-item label="商品条形码：" style="display: none;">
          <el-input v-model="productForm.tm" placeholder="商品条形码无输入0000" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 商品型号/规格 -->
        <el-form-item label="商品型号：">
          <div class="spec-table">

            <el-table :data="productForm.specs" border style="width: 90%" class="sps">
              <el-table-column label="属性" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.shuxing" placeholder="请选择" size="small"
                    @change="handleSpecUpdate(scope.row, scope.$index)">
                    <el-option label="规格" :value="1"></el-option>
                    <el-option label="重量" :value="2"></el-option>
                    <el-option label="颜色" :value="3"></el-option>
                    <el-option label="型号" :value="4"></el-option>
                    <el-option label="口味" :value="5"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.xinghao" placeholder="名称" size="small" maxlength="200"
                    @blur="handleSpecUpdate(scope.row, scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" placeholder="价格" size="small" type="number"
                    @blur="handleSpecUpdate(scope.row, scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="供货价" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ghprice" placeholder="供货价" size="small" type="number"
                    @blur="handleSpecUpdate(scope.row, scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="small" @click="removeSpecRow(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="small" @click="addSpecRow" style="margin-bottom: 10px;">添加一条</el-button>
          </div>
        </el-form-item>

        <!-- 商品状态 -->
        <el-form-item label="商品状态：" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="selling">上架销售中</el-radio>
            <el-radio label="undercarriage">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 商品产地 -->
        <el-form-item label="商品产地：">
          <el-input v-model="productForm.productplace" placeholder="商品产地" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 简要描述 -->
        <el-form-item label="简要描述：">
          <el-input v-model="productForm.features" placeholder="简要描述" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 发货提示 -->
        <el-form-item label="发货提示：">
          <el-input v-model="productForm.deliverymsg" placeholder="发货提示" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 7天无理由退货 -->
        <el-form-item label="7天无理由退货：">
          <el-radio-group v-model="productForm.is7toreturn">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 列表图上传 -->
        <!-- 列表图上传 -->
        <!-- <el-form-item label="列表图：" prop="thumbnailimage">
          <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload"
            :data="{ uploadType: 'thumbnail' }" :before-upload="beforeUpload">
            <img v-if="productForm.thumbnailimage" :src="productForm.thumbnailimage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fs12">尺寸：320*320,大小：1M以内.</span>
        </el-form-item> -->
        <el-form-item label="列表图：" prop="thumbnailimage">
          <CropUpload v-model="productForm.thumbnailimage" :crop-width="320" :crop-height="320" :keep-square="true"
            :max-size="5" upload-path="upload/product" @success="handleThumbnailSuccess" />
          <div class="fs12">尺寸：320*320,大小：1M以内，自动裁剪为正方形</div>
        </el-form-item>


        <!-- 内页图上传 -->
        <!-- 内页图上传 -->
        <el-form-item label="内页图：">
          <el-upload action="#" list-type="picture-card" :http-request="customUploadMultiple"
            :before-upload="beforeUpload" :file-list="productForm.detailImages" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveImage" class="bgImgs">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span class="fs12">尺寸：640*640,大小：1M以内.</span>
        </el-form-item>
        <!-- 商品详情 - 富文本 -->
        <!-- 商品详情 - 富文本 -->
        <el-form-item label="内容：" class="editorsnew">
          <WangEditor v-if="!pageLoading" v-model="productForm.wcontent" style="width: 90%;" />
        </el-form-item>
        <!-- 热销商品 -->
        <el-form-item label="热销商品(首页)：" v-if="isadmin == 1">
          <el-radio-group v-model="productForm.hot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 精选商品 -->
        <el-form-item label="精选商品(首页)：" v-if="isadmin == 1">
          <el-radio-group v-model="productForm.jingxuan">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否审核 -->
        <el-form-item label="是否审核：" v-if="isadmin == 1">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">已审核</el-radio>
            <el-radio :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item label="发布时间：" prop="createtime">
          <el-date-picker v-model="productForm.createtime" type="datetime" placeholder="选择发布时间"
            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm">保存</el-button> -->
          <el-button type="primary" @click="submitForm">{{ isEdit ? '修改' : '保存' }}</el-button>
          <el-button @click="goBack">返回</el-button>

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CropUpload from '@/components/CropUpload'
import WangEditor from '@/components/WangEditor.vue'
// import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import '@wangeditor/editor/dist/css/style.css'
import {
  addProduct, getProduct, editProduct,
  showoneFenLen,   // 新增：获取一级分类
  showtwoFenlen,   // 新增：获取二级分类
  showSupplier,
  addXinghao, editXinghao, delXinghao    // 新增：获取品牌/供应商
} from '@/api/modules/login'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { TimeSelect } from 'element-ui'
export default {
  name: 'AddProduct',
  components: {
    WangEditor, CropUpload

  },
  data() {
    return {
 isadmin: localStorage.getItem('is_super_admin'),
      // data 中新增
      isEdit: false,  // 是否编辑模式
      editId: '',     // 编辑的产品ID
      dialogVisibleImg: false,  // 多图预览
      dialogImageUrl: '',      // 预览图片URL
      //   uploadingCount: 0,       // 正在上传的图片数量
      //  uploadedUrls: [],        // 已上传完成的图片URL

      // wangEditor 相关

      // 供应商列表
      supplierList: [],
      // 分类选项
      categoryOptions: [],
      currentSubCategories: [],
      // 品牌列表
      brandList: [],
      // 表单数据
      productForm: {
        uid: 0,
        name: '',
        class1: '',
        class2: '',
        brand_id: '',
        specs: [{ shuxing: 1, xinghao: '', price: '', ghprice: '' }],
        status: 'selling',
        productplace: '',
        features: '',
        deliverymsg: '全国除港澳台新疆西藏及其他偏远地区不发货',
        is7toreturn: 0,
        thumbnailimage: '',
        detailImages: [],
        wcontent: '',
        hot: 0,
        jingxuan: 0,
        sh: 0,
        createtime: '',
        imgs: ''
      },

      // 验证规则
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        class1: [{ required: true, message: '请选择一级分类', trigger: 'change' }],
        class2: [{ required: true, message: '请选择二级分类', trigger: 'change' }],
        brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
        thumbnailimage: [{ required: true, message: '请上传列表图', trigger: 'change' }],
        createtime: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
      },
      pageLoading: true,  // 改成 true
    }
  },
  async created() {
    setTimeout(() => {
      const elMain = document.querySelector('.el-main')
      if (elMain) {
        elMain.scrollTop = 0
      }
    }, 100)
    // 获取一级分类和品牌
    this.getSupplierList()
    this.getCategoryList()

    // 判断是否编辑模式
    const id = this.$route.params.id
    if (id && id > 0) {
      this.isEdit = true
      this.editId = id
      await this.getProductDetail(id)
    } else {
      this.setDefaultTime()
    }
    this.pageLoading = false  // 加在 created 最底部
  },
  beforeDestroy() {
    // 销毁编辑器
    // if (this.editor == null) return
    // this.editor.destroy()
    // this.editor = null
  },
  methods: {
    // ProductList
    goBack() {
      this.$router.push({ name: 'ProductList' })
    },
    async getSupplierList() {
      try {
        const res = await showSupplier()
        if (res.code === 200) {
          this.supplierList = res.data.list.map(item => ({
            value: item.id,
            label: `${item.id}-${item.username}`
          }))
        }
      } catch (error) {
        console.error('获取供应商列表失败', error)
      }
    },
    async getCategoryList() {
      try {
        const res = await showoneFenLen()
        if (res.code === 200) {
          this.categoryOptions = res.data.list;
        }
      } catch (error) {
        console.log('获取一级分类失败', error)
      }
    },
    async getSubCategories(class1Id) {
      try {
        const res = await showtwoFenlen({ id: class1Id })
        if (res.code === 200) {
          this.currentSubCategories = res.data.list;
        }
      } catch (error) {
        console.log('获取二级分类失败', error)

      }
    },
    async getBrandList(class1Id) {
      try {
        const res = await showtwoFenlen({ id: class1Id })
        if (res.code === 200) {
          this.brandList = res.data.pingpai_list.map(item => ({
            value: item.id,
            brand: item.name
          }))
        }

      } catch (error) {
        console.log('获取品牌列表失败', error)

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
      this.productForm.createtime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    // wangEditor 创建
    // onCreated(editor) {
    //   this.editor = editor;
    // },
    // wangEditor 自定义图片上传
    // 修改 handleWangEditorUpload 方法
    // async handleWangEditorUpload(file, insertFn) {
    //   // 将上传任务加入队列
    //   this.wangEditorUploadQueue.push({ file, insertFn })

    //   // 如果当前没有在上传，则开始处理队列
    //   if (!this.isWangEditorUploading) {
    //     this.processWangEditorQueue()
    //   }
    // },
    // 串行处理上传队列
    // async processWangEditorQueue() {
    //   if (this.wangEditorUploadQueue.length === 0) {
    //     this.isWangEditorUploading = false
    //     return
    //   }

    //   this.isWangEditorUploading = true
    //   const { file, insertFn } = this.wangEditorUploadQueue.shift() // 取出第一个

    //   const timestamp = GLOBAL_CONFIG.getTimestamp()
    //   const sign = GLOBAL_CONFIG.generateSign()

    //   const formData = new FormData()
    //   formData.append('file', file)
    //   formData.append('file_url', 'content')
    //   formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
    //   formData.append('timestamp', timestamp)
    //   formData.append('sign', sign)

    //   try {
    //     const response = await axios({
    //       url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
    //       method: 'post',
    //       data: formData,
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //         'Authorization': 'Bearer ' + localStorage.getItem('token')
    //       }
    //     })

    //     if (response.data.status === 200) {
    //       insertFn(response.data.data)
    //       this.$message.success('上传成功')
    //     } else {
    //       this.$message.error(response.data.msg || '上传失败')
    //     }
    //   } catch (error) {
    //     if (error.response?.data?.status === 200) {
    //       insertFn(error.response.data.data)
    //       this.$message.success('上传成功')
    //     } else {
    //       this.$message.error('上传失败，请稍后重试')
    //     }
    //   }

    //   // 处理队列中的下一个
    //   this.processWangEditorQueue()
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },


    // 获取产品详情

    // 时间戳格式化
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
    // 在 data 中添加


    // 自定义上传方法（与轮播图一致）
    async customUpload(options) {
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
          // 根据上传类型区分是列表图还是内页图
          if (options.data.uploadType === 'detail') {
            // 内页图：需要根据 index 更新
            const index = options.data.index
            this.productForm.detailImages[index].url = response.data.data
          } else {
            // 列表图
            this.productForm.thumbnailimage = response.data.data
          }
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          if (options.data.uploadType === 'detail') {
            const index = options.data.index
            this.productForm.detailImages[index].url = error.response.data.data
          } else {
            this.productForm.thumbnailimage = error.response.data.data
          }
          this.$message.success('上传成功')
          return
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
    // 一级分类变化
    handleCategory1Change(value) {
      this.productForm.class2 = ''
      this.productForm.brand_id = ''  // 清空已选品牌
      if (value) {
        this.getSubCategories(value)  // 动态获取二级分类
        this.getBrandList(value)



      } else {
        this.currentSubCategories = []
        this.brandList = []  // 清空品牌列表
      }
    },

    // 添加规格行
    async addSpecRow() {
      const newRow = {
        shuxing: 1, xinghao: '', price: '', ghprice: '', id: ''
      }
      this.productForm.specs.push(newRow);
      if (this.isEdit) {
        try {
          const res = await addXinghao({
            pid: this.editId,
            shuxing: 1,
            xinghao: '',
            price: '',
            ghprice: ''
          })
          if (res.code === 200) {
            newRow.id = res.data.id
            this.$message.success('新增成功')
          }


        } catch (error) {
          console.error('新增失败', error)
          this.$message.error('新增失败')
        }
      }

    },
    async handleSpecUpdate(row, index) {
      if (!this.isEdit) return
      if (!row.id) return
      try {
        const res = await editXinghao({
          id: row.id,
          pid: this.editId,
          shuxing: row.shuxing,
          xinghao: row.xinghao,
          price: row.price,
          ghprice: row.ghprice
        })

        if (res.code === 200) {
          this.$message.success(res.msg)
        }

      } catch (error) {
        // this.$message.error('修改型号失败');
        console.error('修改失败', error)
      }




    },
    // 删除规格行
    async removeSpecRow(index, row) {
      if (this.productForm.specs.length <= 1) {
        this.$message.warning('至少保留一条规格')
        return
      }

      if (this.isEdit && row.id) {
        try {
          const res = await delXinghao({ id: row.id, pid: this.editId })
          if (res.code === 200) {
            this.productForm.specs.splice(index, 1)
            this.$message.success('删除型号成功')
          } else {
            this.$message.error(res.msg || '删除型号失败')
          }
        } catch (error) {
          this.$message.error('删除型号失败')
        }
      } else {
        this.productForm.specs.splice(index, 1)
      }
    },

    // 列表图上传成功
    handleThumbnailSuccess(res) {
      if (res.code === 200) {
        this.productForm.thumbnailimage = res.data.url
      }
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


    async getProductDetail(id) {
      try {
        const res = await getProduct({ id: String(id) })
        if (res.code === 200) {
          const data = res.data

          const parseImages = (imgsStr) => {
            if (!imgsStr) return []

            // ✅ 先统一清理格式
            let cleanStr = imgsStr
              .replace(/\s+/g, '')           // 去除所有空格
              .replace(/-+/g, '-')           // 多个-替换为单个
              .replace(/^-|-$/g, '')         // 去除首尾的-

            // ✅ 智能分割：在 .png、.jpg、.jpeg、.gif、.webp 后面没有 - 的地方补上
            // 处理类似 "xxx.pngxxx.jpg" 的情况
            cleanStr = cleanStr.replace(/\.(png|jpg|jpeg|gif|webp)(?=https?:\/\/)/gi, '.$1-')

            // ✅ 按 - 分割
            const urls = cleanStr
              .split('-')
              .filter(url => url && url.startsWith('http'))

            console.log('解析出的图片URLs:', urls) // 调试日志

            return urls.map((url, index) => ({
              url: url,
              name: `image_${index + 1}`,
              uid: Date.now() + index
            }))
          }

          const formData = {
            uid: data.uid || 0,
            name: data.name || '',
            class1: data.class1 || '',
            class2: data.class2 ? data.class2 : '',
            brand_id: data.brand_id || '',
            status: data.status || 'selling',
            productplace: data.productplace || '',
            features: data.features || '',
            deliverymsg: data.deliverymsg || '',
            is7toreturn: data.is7toreturn || 0,
            thumbnailimage: data.thumbnailimage || '',
            imgs: data.imgs || '',
            detailImages: parseImages(data.imgs),  // ✅ 使用智能解析
            wcontent: data.wcontent || '',
            hot: data.hot || 0,
            jingxuan: data.jingxuan || 0,
            sh: data.sh || 1,
            createtime: data.createtime ? this.formatTimestamp(data.createtime) : '',
            specs: data.list_xinghao && data.list_xinghao.length > 0
              ? data.list_xinghao.map(item => ({
                id: item.id,
                shuxing: item.shuxing,
                xinghao: item.xinghao,
                price: item.price,
                ghprice: item.ghprice
              }))
              : [{ shuxing: 1, xinghao: '', price: '', ghprice: '' }]
          }

          Object.assign(this.productForm, formData)

          if (data.class1) {
            this.getSubCategories(data.class1)
            this.getBrandList(data.class1)
          }
        }
      } catch (error) {
        console.error('获取产品详情失败:', error)
        this.$message.error('获取产品详情失败')
      }
    },

    async customUploadMultiple(options) {
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

        let imageUrl = ''
        if (response.data?.status === 200) {
          imageUrl = response.data?.data?.url || response.data?.data
        } else if (response.data?.code === 200) {
          imageUrl = response.data?.data?.url || response.data?.data
        }

        if (!imageUrl) {
          this.$message.error('上传失败')
          return Promise.reject(new Error('上传失败'))
        }

        // ✅ 清理旧格式再拼接
        if (this.productForm.imgs && this.productForm.imgs.trim() !== '') {
          let cleanImgs = this.productForm.imgs
            .replace(/\s+/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
          this.productForm.imgs = cleanImgs + '-' + imageUrl
        } else {
          this.productForm.imgs = imageUrl
        }

        // ✅ 同步更新 detailImages
        this.productForm.detailImages.push({
          url: imageUrl,
          name: file.name,
          uid: file.uid
        })

        this.$message.success('上传成功')
        return {
          url: imageUrl,
          name: file.name,
          uid: file.uid
        }
      } catch (error) {
        const data = error?.response?.data
        if (data?.status === 200 || data?.code === 200) {
          const imageUrl = data?.data?.url || data?.data
          if (imageUrl) {
            if (this.productForm.imgs && this.productForm.imgs.trim() !== '') {
              let cleanImgs = this.productForm.imgs
                .replace(/\s+/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
              this.productForm.imgs = cleanImgs + '-' + imageUrl
            } else {
              this.productForm.imgs = imageUrl
            }
            this.productForm.detailImages.push({
              url: imageUrl,
              name: file.name,
              uid: file.uid
            })
            this.$message.success('上传成功')
            return { url: imageUrl, name: file.name, uid: file.uid }
          }
        }
        this.$message.error('上传失败，请稍后重试')
        return Promise.reject(new Error('上传失败'))
      }
    },

    handleRemoveImage(file, fileList) {
      this.productForm.imgs = fileList
        .filter(item => item.url && item.url.trim() !== '')
        .map(item => item.url.trim())
        .join('-')
    },
    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
          return false
        }

        if (!this.productForm.class2) {
          this.$message.error('请选择二级分类')
          return false
        }

        try {
          // ✅ 构建提交数据
          const submitData = {
            id: String(this.editId || ''),
            name: this.productForm.name,
            class1: this.productForm.class1,
            class2: this.productForm.class2,
            brand_id: this.productForm.brand_id,
            status: this.productForm.status,
            thumbnailimage: this.productForm.thumbnailimage,
            createtime: this.productForm.createtime,
            xinghao: JSON.stringify(this.productForm.specs.map(spec => ({
              shuxing: String(spec.shuxing),
              xinghao: spec.xinghao,
              price: String(spec.price),
              ghprice: String(spec.ghprice)
            }))),
            uid: this.productForm.uid,
            productplace: this.productForm.productplace,
            features: this.productForm.features,
            deliverymsg: this.productForm.deliverymsg,
            is7toreturn: this.productForm.is7toreturn,
            imgs: this.productForm.imgs,  // ✅ 直接使用 productForm.imgs
            wcontent: this.productForm.wcontent,
            hot: this.productForm.hot,
            jingxuan: this.productForm.jingxuan,
            sh: this.productForm.sh,
            qianggou: 0,
            qianggou_price: 0
          }

          // ✅ 过滤空值时保留 imgs 和 wcontent
          const requiredFields = ['id', 'name', 'class1', 'class2', 'brand_id', 'status', 'thumbnailimage', 'createtime', 'xinghao']
          const alwaysIncludeFields = ['imgs', 'wcontent']

          Object.keys(submitData).forEach(key => {
            const value = submitData[key]
            if ((value === '' || value === null || value === undefined)
              && !requiredFields.includes(key)
              && !alwaysIncludeFields.includes(key)) {
              delete submitData[key]
            }
          })

          console.log('最终提交数据:', submitData)

          const apiMethod = this.isEdit ? editProduct : addProduct
          const res = await apiMethod(submitData)

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            setTimeout(() => {
              this.$router.push('/product/list')
            }, 1000)
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('操作失败:', error)
          this.$message.error('操作失败，请稍后重试')
        }
      })
    }
  }
}
</script>

<style>
.sps.el-table thead .el-table__cell {
  padding: 0px 0 !important;
}

.editorsnew .el-form-item__content {
  line-height: 20px;
}

.editorsnew .edui-editor.edui-default {
  width: 100% !important;
}

.editorsnew .edui-editor-iframeholder.edui-default {
  min-height: 300px !important;
}

.custom-upload-area {
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-image-btn {
  font-weight: bold;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}
</style>

<style lang="scss" scoped>
.productAdd {
  .add-card {
    .product-form {
      text-align: left;

      .spec-table {
        width: 100%;
      }

      .bgImgs {

        :deep(.el-upload) {

          background-color: #ffffff;

          &:hover {
            border-color: #409EFF;
          }
        }
      }

      .avatar-uploader {
        :deep(.el-upload) {

       //   border: 1px dashed #d9d9d9;
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
}
</style>