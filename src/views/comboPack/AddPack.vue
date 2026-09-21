<template>
  <div class="add-pack">
    <el-card class="add-card">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="160px" class="product-form mt10">
        <!-- 供应商选择 -->
        <el-form-item label="供应商：" prop="uid">
          <el-select v-model="productForm.uid" placeholder="请选择供应商" filterable style="width: 500px;">
            <el-option label="后台添加" :value="0"></el-option>
            <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 商品名称 -->
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="productForm.name" placeholder="商品名称" style="width: 500px;"></el-input>
        </el-form-item>

        

        

     

        <!-- 商品状态 -->
        <el-form-item label="商品状态：" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="selling">上架销售中</el-radio>
            <el-radio label="undercarriage">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 礼包商品区域 -->
        <el-form-item label="添加礼包商品：">
          <div class="gift-packages-container">
            <div v-for="(giftPackage, index) in productForm.giftPackages" :key="index" class="gift-package-item">
              <div class="gift-package-header">
                <span class="gift-package-title">礼包商品{{ index + 1 }}</span>
                <el-button type="danger" size="small" icon="el-icon-delete" 
                  @click="removeGiftPackage(index)" v-if="productForm.giftPackages.length > 1">
                  删除礼包
                </el-button>
              </div>
              
              <!-- 已选商品展示 -->
              <div class="selected-gift-products" v-if="giftPackage.selectedProducts.length > 0">
                <div class="gift-product-list">
                  <div class="gift-product-item" v-for="(item, idx) in giftPackage.selectedProducts" :key="item.id">
                    <img :src="item.image" class="gift-product-img">
                    <div class="gift-product-info">
                      <div class="gift-product-title">{{ item.title }}</div>
                      <div class="gift-product-price">市场价: ¥{{ item.marketPrice }}</div>
                      <div class="gift-product-price">供货价: ¥{{ item.supplyPrice }}</div>
                    </div>
                    <el-button type="text" class="remove-btn" @click="removeSelectedGift(index, idx)">移除</el-button>
                  </div>
                </div>
              </div>
              <div v-else class="empty-gift-products">
                暂无已选礼包商品，请点击"选择商品"进行添加
              </div>

              <!-- 选择商品按钮和价格设置 -->
              <div class="gift-package-actions">
                <el-button type="primary" size="small" @click="openGiftDrawer(index)">选择商品</el-button>
                <el-form-item label="打包价格：" :prop="`giftPackages.${index}.price`" label-width="120px" style="margin-bottom: 0;">
                  <el-input v-model="giftPackage.price" placeholder="请输入礼包打包价格" style="width: 200px;" type="number"></el-input>
                </el-form-item>
              </div>
            </div>
            
            <el-button type="primary" plain @click="addGiftPackage" class="add-gift-btn">
              <i class="el-icon-plus"></i> 添加礼包商品
            </el-button>
          </div>
        </el-form-item>

        <!-- 商品产地 -->
        <el-form-item label="商品产地：" prop="productplace">
          <el-input v-model="productForm.productplace" placeholder="商品产地" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 简要描述 -->
        <el-form-item label="简要描述：" prop="features">
          <el-input v-model="productForm.features" placeholder="简要描述" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 发货提示 -->
        <el-form-item label="发货提示：" prop="deliverymsg">
          <el-input v-model="productForm.deliverymsg" placeholder="发货提示" style="width: 500px;"></el-input>
        </el-form-item>

        <!-- 7天无理由退货 -->
        <el-form-item label="7天无理由退货：">
          <el-radio-group v-model="productForm.is7toreturn">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>


        <!-- 内页图上传 -->
        <el-form-item label="主图：">
          <el-button type="primary" size="small" @click="addImageRow" style="margin-bottom: 10px;">添加一条</el-button>

          <div class="detail-images">
            <div v-for="(item, index) in productForm.detailImages" :key="index" class="detail-image-item">
              <el-upload class="avatar-uploader" action="/admin.php/product/upload" :show-file-list="false"
                :on-success="(res) => handleDetailImageSuccess(res, index)" :before-upload="beforeDetailImageUpload">
                <img v-if="item.url" :src="item.url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="closed el-icon-close" size="small" @click="removeImageRow(index)"
                v-if="productForm.detailImages.length > 1"></div>
            </div>
          </div>
          <span style="color:red;">尺寸：640*640,大小：1M以内.</span>
        </el-form-item>

        <!-- 列表图上传 -->
        <el-form-item label="详情图：" prop="thumbnailimage">
          <el-upload class="avatar-uploader" action="/admin.php/product/upload" :show-file-list="false"
            :on-success="handleThumbnailSuccess" :before-upload="beforeThumbnailUpload">
            <img v-if="productForm.thumbnailimage" :src="productForm.thumbnailimage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span style="color:red;">尺寸：320*320,大小：1M以内.</span>
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
        <el-form-item label="热销商品(首页)：">
          <el-radio-group v-model="productForm.hot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 精选商品 -->
        <el-form-item label="精选商品(首页)：">
          <el-radio-group v-model="productForm.jingxuan">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否审核 -->
        <el-form-item label="是否审核：">
          <el-radio-group v-model="productForm.sh">
            <el-radio :label="1">已审核</el-radio>
            <el-radio :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item label="发布时间：">
          <el-date-picker v-model="productForm.createtime" type="datetime" placeholder="选择发布时间"
            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 礼包商品选择抽屉 -->
    <el-drawer :title="`选择礼包商品${currentGiftIndex + 1}的商品`" :visible.sync="drawer" :direction="direction" 
      size="60%" :before-close="handleClose">
      <div class="pd20">
        <!-- 已选中的产品区域 -->
        <el-card class="search-card mb16" v-if="tempSelectedProducts.length > 0">
          <div class="selected-title">已精选 <span class="selected-count">{{ tempSelectedProducts.length }}</span> 款产品</div>
          <div class="selected-list">
            <div class="product-item selected" v-for="(item, index) in tempSelectedProducts" :key="item.id">
              <span class="delete-icon" @click="removeTempSelected(index)">×</span>
              <div class="product-content">
                <img :src="item.image" :alt="item.title" class="product-image w70">
                <div class="product-info">
                  <div class="product-title">{{ item.title }}</div>
                  <div class="market-price">市场价:{{ item.marketPrice }}</div>
                  <div class="supply-price">供货价:{{ item.supplyPrice }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="submit-area">
            <el-button type="success" size="small" @click="cancelSelect">取消返回</el-button>
            <el-button type="primary" size="small" @click="confirmSelect">确认提交</el-button>
          </div>
        </el-card>

        <el-card class="search-card">
          <!-- 搜索筛选区域 -->
          <div class="filter-area serchForm">
            <el-form :inline="true" :model="filterForm" class="search-form">
              <el-form-item label="">
                <el-select v-model="filterForm.category1" placeholder="分类" @change="handleCategoryChange"
                  style="width: 120px;">
                  <el-option label="休闲零食" value="1"></el-option>
                  <el-option label="粮油副食" value="2"></el-option>
                  <el-option label="乳饮调冲" value="3"></el-option>
                  <el-option label="清洁护理" value="4"></el-option>
                  <el-option label="运动户外" value="16"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="filterForm.category2" placeholder="二级分类" style="width: 100px;" v-if="showCategory2">
                  <el-option label="户外装备" value="161"></el-option>
                  <el-option label="运动器材" value="162"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="filterForm.brand" placeholder="品牌" style="width: 100px;" v-if="showBrand">
                  <el-option label="趣游帮" value="qyb"></el-option>
                  <el-option label="思凯乐" value="skl"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="filterForm.keyword" placeholder="关键词" style="width: 120px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="filterForm.sort" placeholder="按价格升序" style="width: 120px;">
                  <el-option label="按价格升序" value="1"></el-option>
                  <el-option label="按价格降序" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="filterForm.sort1" placeholder="礼包单品" style="width: 120px;">
                  <el-option label="礼包单品" value="1"></el-option>
                   
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchProducts">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 产品列表区域 -->
          <div class="product-list">
            <div class="product-item" v-for="item in productList" :key="item.id" 
              :class="{ 'active': isTempSelected(item) }" @click="toggleTempSelect(item)">
              <span class="select-icon"></span>
              <div class="product-content">
                <img :src="item.image" :alt="item.title" class="product-image">
                <div class="product-title">{{ item.title }}</div>
                <div class="marketPrice">市场价:{{ item.marketPrice }}</div>
                <div class="supplyPrice">供货价:{{ item.supplyPrice }}</div>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div class="loading-more" v-if="hasMore">
            <el-button type="success" plain @click="loadMore">查看更多</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>
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
      // 关联产品相关数据
      filterForm: {
        category1: '16',
        category2: '',
        brand: '',
        keyword: '',
        sort: '1',sort1:''
      },
      showCategory2: false,
      showBrand: false,
      tempSelectedProducts: [], // 临时选中的商品
      productList: [],
      allProducts: [],
      hasMore: true,
      pageSize: 20,
      currentPage: 1,
      
      // 抽屉相关
      drawer: false,
      direction: 'rtl',
      currentGiftIndex: -1, // 当前编辑的礼包索引
      
      // 供应商列表
      supplierList: [
        { value: 7, label: '7-admin' },
        { value: 8, label: '8-test1' },
        { value: 10, label: '10-LICUN' },
        // ... 保持原有供应商列表
      ],
      
      // 分类选项
      categoryOptions: [
        {
          id: 1,
          name: '休闲零食',
          children: [
            { id: 101, name: '膨化食品' },
            { id: 102, name: '坚果炒货' },
            { id: 103, name: '肉干肉脯' }
          ]
        },
        {
          id: 2,
          name: '粮油副食',
          children: [
            { id: 201, name: '米面杂粮' },
            { id: 202, name: '食用油' },
            { id: 203, name: '调味品' }
          ]
        },
        {
          id: 3,
          name: '乳饮调冲',
          children: [
            { id: 38, name: '乳制品' },
            { id: 39, name: '冲调饮品' },
            { id: 40, name: '蜂蜜' },
            { id: 41, name: '饮料果汁' },
            { id: 43, name: '冲泡茶饮' },
            { id: 44, name: '麦片代餐' },
            { id: 45, name: '咖啡' }
          ]
        },
        {
          id: 4,
          name: '清洁护理',
          children: []
        },
      ], 
      currentSubCategories: [],
      
      // 品牌列表
      brandList: [
        { value: 1093, label: 'A-澳蜜世界' },
        { value: 1874, label: 'A-ANCHOR（美国安佳）' },
        // ... 保持原有品牌列表
      ],
      
      // 表单数据
      productForm: {
        tm: '',
        uid: 0,
        name: '',
        category: '',
        category1: '',
        brand_id: '',
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
        flag: 1,
        giftPackages: [
          {
            selectedProducts: [],
            price: ''
          }
        ]
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
            customUpload: this.customImageUpload,
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

      // 上传状态
      uploading: false,
      uploadedCount: 0,
      totalCount: 0,
      uploadQueue: []
    }
  },
  created() {
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
  mounted() {
    this.initProductData();
  },
  methods: {
    // 一级分类变化
    handleCategory1Change(value) {
      this.productForm.category = ''
      const selectedCategory = this.categoryOptions.find(item => item.id === value)
      this.currentSubCategories = selectedCategory ? selectedCategory.children : []
    },
    
    // 移除礼包中的商品
    removeSelectedGift(packageIndex, productIndex) {
      this.productForm.giftPackages[packageIndex].selectedProducts.splice(productIndex, 1);
    },
    
    // 添加礼包
    addGiftPackage() {
      this.productForm.giftPackages.push({
        selectedProducts: [],
        price: ''
      });
    },
    
    // 删除礼包
    removeGiftPackage(index) {
      this.productForm.giftPackages.splice(index, 1);
    },
    
    // 打开礼包商品选择抽屉
    openGiftDrawer(index) {
      this.currentGiftIndex = index;
      // 复制当前礼包的商品到临时选中列表
      this.tempSelectedProducts = [...this.productForm.giftPackages[index].selectedProducts];
      this.drawer = true;
    },
    
    // 初始化产品数据
    initProductData() {
      this.allProducts = [
        { id: 132205, title: '奥妙焕新洁净礼盒F（OMO-JQ2606）+力士水润丝滑洗护套装（洗发乳400g、润发精华素160g、水光柔亮小礼盒）', marketPrice: '120.00', supplyPrice: '0.00', image: require('../../assets/p2.png'), category: '4' },
        { id: 132204, title: '联合利华力士洗护礼盒A（LH-LS2601）+2026苏菲裸感s超熟睡组合（YXJH2026030901）', marketPrice: '120.00', supplyPrice: '0.00', image: require('../../assets/p3.png'), category: '4' },
        { id: 132200, title: '长寿花甄味礼享玉米胚芽油5L', marketPrice: '118.00', supplyPrice: '88.00', image: require('../../assets/p1.png'), category: '2' },
        { id: 132210, title: '长寿花甄味礼享玉米胚芽油5L', marketPrice: '118.00', supplyPrice: '88.00', image: require('../../assets/p4.png'), category: '2' },
        { id: 132199, title: '长寿花甄味尊享玉米油5L', marketPrice: '124.00', supplyPrice: '93.00', image: require('../../assets/p5.png'), category: '2' },
        { id: 132198, title: '长寿花金胚精榨玉米油5L', marketPrice: '150.00', supplyPrice: '112.00', image: 'https://img.alicdn.com/i1/725677994/O1CN01YEIMUl28vIqMd87Bg_!!725677994.jpg', category: '2' },
        { id: 118731, title: '趣游帮 YB30多功能聚拢款折叠推车', marketPrice: '599.00', supplyPrice: '299.00', image: require('../../assets/p4.png'), category: '16' },
        { id: 118729, title: '趣游帮户外折叠椅便携式星月椅（Q310）', marketPrice: '297.00', supplyPrice: '99.00', image: require('../../assets/p3.png'), category: '16' },
        { id: 118713, title: '趣游帮（Y19-T）60方管脚架木纹蛋卷方桌', marketPrice: '248.00', supplyPrice: '86.00', image: require('../../assets/p2.png'), category: '16' },
        { id: 118710, title: '趣游帮(Y056)两门双层公园帐篷', marketPrice: '471.00', supplyPrice: '170.00', image: require('../../assets/p8.png'), category: '16' },
        { id: 117996, title: '思凯乐户外 Scaler 多功能单肩背包 荧光绿', marketPrice: '128.00', supplyPrice: '81.21', image: require('../../assets/p7.png'), category: '16' },
        { id: 117939, title: '思凯乐户外 Scaler 铝合金折叠登山杖z9921023 红色', marketPrice: '228.00', supplyPrice: '118.13', image: require('../../assets/p6.png'), category: '16' }
      ];
      
      this.loadProducts();
    },
    
    loadProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      const filteredProducts = this.filterProducts();
      this.productList = filteredProducts.slice(0, end);
      this.hasMore = end < filteredProducts.length;
    },
    
    filterProducts() {
      let filtered = [...this.allProducts];
      
      if (this.filterForm.category1) {
        filtered = filtered.filter(p => p.category === this.filterForm.category1);
      }
      
      if (this.filterForm.keyword) {
        const keyword = this.filterForm.keyword.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword));
      }
      
      if (this.filterForm.sort === '1') {
        filtered.sort((a, b) => parseFloat(a.supplyPrice) - parseFloat(b.supplyPrice));
      } else if (this.filterForm.sort === '2') {
        filtered.sort((a, b) => parseFloat(b.supplyPrice) - parseFloat(a.supplyPrice));
      }
      
      return filtered;
    },
    
    handleCategoryChange(value) {
      this.showCategory2 = value === '16';
      this.showBrand = value === '16';
      this.currentPage = 1;
      this.loadProducts();
    },
    
    searchProducts() {
      this.currentPage = 1;
      this.loadProducts();
    },
    
    loadMore() {
      this.currentPage++;
      this.loadProducts();
    },
    
    // 临时选中判断
    isTempSelected(product) {
      return this.tempSelectedProducts.some(p => p.id === product.id);
    },
    
    // 切换临时选中
    toggleTempSelect(product) {
      const index = this.tempSelectedProducts.findIndex(p => p.id === product.id);
      if (index === -1) {
        this.tempSelectedProducts.push({ ...product });
      } else {
        this.tempSelectedProducts.splice(index, 1);
      }
    },
    
    // 移除临时选中的商品
    removeTempSelected(index) {
      this.tempSelectedProducts.splice(index, 1);
    },
    
    // 确认选择
    confirmSelect() {
      // 将临时选中的商品保存到对应的礼包中
      this.productForm.giftPackages[this.currentGiftIndex].selectedProducts = [...this.tempSelectedProducts];
      this.$message.success('已精选 ' + this.tempSelectedProducts.length + ' 款礼包商品');
      this.drawer = false;
    },
    
    // 取消选择
    cancelSelect() {
      this.tempSelectedProducts = [];
      this.drawer = false;
    },
    
    handleClose() {
      this.drawer = false;
      this.tempSelectedProducts = [];
    },
    
    handleEditorCreated(editor) {
      this.editorRef = editor
    },

    async customImageUpload(file, insertFn) {
      this.uploadQueue.push({ file, insertFn })
      this.totalCount = this.uploadQueue.length
      if (!this.uploading) {
        await this.processQueue()
      }
    },
    
    async processQueue() {
      this.uploading = true
      while (this.uploadQueue.length > 0) {
        const item = this.uploadQueue.shift()
        try {
          const url = await this.uploadImage(item.file)
          item.insertFn(url)
          this.uploadedCount++
        } catch (error) {
          console.error('上传失败:', error)
          this.$message.error(`图片上传失败: ${item.file.name}`)
        }
      }
      this.uploading = false
      this.uploadedCount = 0
      this.totalCount = 0
      this.$message.success('所有图片上传完成')
    },

    uploadImage(file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
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

    handleThumbnailSuccess(res, file) {
      this.productForm.thumbnailimage = URL.createObjectURL(file.raw)
    },

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

    addImageRow() {
      this.productForm.detailImages.push({ url: '' })
    },

    removeImageRow(index) {
      this.productForm.detailImages.splice(index, 1)
    },

    handleDetailImageSuccess(res, index) {
      this.productForm.detailImages[index].url = URL.createObjectURL(res.raw)
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

    onEditorCreated(editor) {
      this.editor = editor
    },

    submitForm() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          const submitData = {
            ...this.productForm,
            class1: this.productForm.category[0],
            class2: this.productForm.category[1] || 0,
            giftPackages: this.productForm.giftPackages
          }
          
          console.log('提交数据:', submitData)
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

.add-pack .el-drawer__header {
  margin-bottom: 0px;
}
</style>

<style lang="scss" scoped>
.add-pack {
  .add-card {
    .product-form {
      text-align: left;
      
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

// 礼包商品样式
.gift-packages-container {
  width: 100%;
  
  .gift-package-item {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #fafafa;
    
    .gift-package-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e4e7ed;
      
      .gift-package-title {
        font-size: 14px;
        font-weight: bold;
        color: #409EFF;
      }
    }
    
    .gift-package-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e4e7ed;
    }
  }
  
  .add-gift-btn {
    width: 100%;
    margin-top: 10px;
  }
}

.selected-gift-products {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  width: 100%;
  overflow-x: auto;
}

.gift-product-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.gift-product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  position: relative;
   width: 150px;
  flex-shrink: 0;
}

.gift-product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.gift-product-info {
  flex: 1;
  text-align: center;
  width: 100%;
}

.gift-product-title {
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
}

.gift-product-price {
  font-size: 12px;
  color: #666666;
  text-align: center;
  line-height: 1.6;
}

.remove-btn {
  color: #f56c6c;
  font-size: 12px;
  padding: 0 8px;
  margin-top: 5px;
}

.empty-gift-products {
  color: #909399;
  font-size: 13px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
  width: 100%;
}

.selected-title {
  margin-bottom: 15px;
  font-size: 14px;
}

.selected-count {
  color: #f56c6c;
  font-weight: bold;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.product-item {
  position: relative;
  width: 162px;
  cursor: pointer;
  border: 2px solid #eeeeee;
  border-radius: 4px;
  transition: all 0.3s;
}

.product-item.selected {
  border-color: #409EFF;
}

.product-item.active {
  border-color: #67C23A;
  background-color: #f0f9eb;
}

.product-content {
  position: relative;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.marketPrice {
  margin-top: 2px;
}

.marketPrice,
.supplyPrice {
  font-size: 12px;
  text-align: left;
  color: #666;
}

.product-image {
  width: 136px;
  height: 136px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  font-size: 12px;
}

.product-title {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.4;
  height: 33px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
}

.delete-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #f56c6c;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
}

.delete-icon:hover {
  background: #f78989;
}

.select-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  z-index: 10;
}

.product-item.active .select-icon {
  background: #67C23A;
  border-color: #67C23A;
}

.product-item.active .select-icon::after {
  content: "✓";
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 18px;
}

.submit-area {
  text-align: center;
}

.filter-area {
  text-align: left;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.loading-more {
  text-align: center;
  padding: 20px;
}

.selected-list .product-item {
  width: 100px;
}

.selected-list .product-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.selected-list .product-image.w70 {
  width: 76px;
  height: 76px;
  display: block;
  margin: 0 auto 6px auto;
  flex-shrink: 0;
}

.selected-list .product-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.selected-list .product-title {
  font-size: 11px;
  line-height: 1.3;
  height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 0;
  text-align: left;
}

.selected-list .market-price,
.selected-list .supply-price {
  font-size: 10px;
  color: #666;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
</style>