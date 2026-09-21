<template>
  <div class="list-container">
    <!-- 主列表卡片 -->
    <el-card class="search-card" v-if="addBox">
      <div style="text-align: left; margin-bottom: 20px;display: flex; justify-content: space-between;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addClassification">添加关联分类</el-button>
        <el-button type="success" size="small" @click="goback()">返回</el-button>
      </div>
      <el-dialog title="添加轮播图" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%;margin: auto;">
          <el-form ref="formRef" :model="form" :rules="formRules" label-width="130px" label-position="right">
            <el-form-item label="标题：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="小标题：">
              <el-input v-model="form.xtitle"></el-input>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="form.px"></el-input>
            </el-form-item>
            <el-form-item label="是否发布：" style="text-align: left;">
              <el-radio-group v-model="form.sh">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布时间：">
              <el-date-picker v-model="form.add_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="甄选-分类图：" style="text-align: left;">
              <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload"
                :before-upload="beforeUpload">
                <img v-if="form.img" :src="form.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-if="tableshow" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="60" type="index" align="center"></el-table-column>
        <el-table-column label="排序" width="90" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" placeholder="请输入内容" size="small"
              @blur="pxClassification(scope.row)"></el-input>
          </template>
        </el-table-column>
        <!-- 表格图片列 -->
        <el-table-column label="图片" width="200" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.img" :src="scope.row.img" style="width: 177px;height: 53px;" alt="">
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>

        <!-- 标题列 -->
        <el-table-column label="标题" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <!-- 添加时间列 -->
        <el-table-column label="添加时间" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.add_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="状态">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: space-around;">
              <!-- <el-switch style="display: block"
                v-model="scope.row.ipe" active-color="#409EFF" active-text="" inactive-text="">
              </el-switch> -->
              <el-switch style="display: block" v-model="scope.row.ipe" active-color="#409EFF"
                @change="handleShChange(scope.row)">
              </el-switch>

            </div>

          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="addBoxs(scope.$index, scope.row)">关联产品</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 关联产品卡片 -->
    <div v-if="!addBox">


      <!-- 已选中的产品区域 -->

      <el-card class="search-card mb16" v-if="selectedProducts.length > 0">
        <div class="selected-title">已精选 <span class="selected-count">{{ selectedProducts.length }}</span> 款产品</div>
        <div class="selected-list">
          <div class="product-item selected" v-for="(item, index) in selectedProducts" :key="item.id">
            <span class="delete-icon" @click="removeSelected(index)">×</span>
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
          <el-button type="success" size="small" @click="goback()">取消返回</el-button>
          <el-button type="primary" size="small" @click="submitProducts()">确认提交</el-button>
        </div>
      </el-card>


      <el-card class="search-card">
        <!-- 搜索筛选区域 -->
        <div class="filter-area serchForm">
          <el-form :inline="true" :model="filterForm" class="search-form">
            <!-- 一级分类 -->
            <el-form-item label="">
              <el-select v-model="filterForm.class1" placeholder="一级分类" @change="handleCategoryChange"
                style="width: 120px;" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name"
                  :value="String(item.id)"></el-option>
              </el-select>
            </el-form-item>

            <!-- 二级分类 -->
            <el-form-item v-if="subCategoryList.length > 0">
              <el-select v-model="filterForm.class2" placeholder="二级分类" style="width: 120px;" clearable
                @change="searchProducts">
                <el-option v-for="item in subCategoryList" :key="item.id" :label="item.name"
                  :value="String(item.id)"></el-option>
              </el-select>
            </el-form-item>

            <!-- 搜索关键词 -->
            <el-form-item>
              <el-input v-model="filterForm.search_val" placeholder="关键词" style="width: 120px;"
                @keyup.enter.native="searchProducts"></el-input>
            </el-form-item>

            <!-- 价格排序 -->
            <el-form-item>
              <el-select v-model="filterForm.sort_price_type" placeholder="价格排序" style="width: 120px;" clearable
                @change="searchProducts">
                <el-option label="价格升序" value="1"></el-option>
                <el-option label="价格降序" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchProducts">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 产品列表 -->
        <div class="product-list">
          <div class="product-item" v-for="item in productList" :key="item.id" :class="{ 'active': isSelected(item) }"
            @click="toggleSelect(item)">
            <span class="select-icon"></span>
            <div class="product-content">
              <img :src="item.image" :alt="item.title" class="product-image">
              <div class="product-title">{{ item.title }}</div>
              <div class="marketPrice">市场价: ¥{{ item.marketPrice }}</div>
              <div class="supplyPrice">供货价: ¥{{ item.supplyPrice }}</div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="loading-more" v-if="hasMore">
          <el-button type="success" plain @click="loadMore">查看更多</el-button>
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  classiFication,
  addClassification,
  editClassification,
  delClassification,
  pxClassification, fbClassification,
  navClassificationProducts,  // 获取已关联产品
  saveNavClassifications,      // 保存关联产品
  navProductPages,             // 产品分页加载
  showSyFenLens               // 显示分类
} from '@/api/modules/login'
export default {
  name: 'UserManage',
  data() {
    return {
      // 关联产品相关数据
      filterForm: {
        class1: '',        // 一级分类
        class2: '',        // 二级分类
        search_key: 'name', // 搜索类型
        search_val: '',     // 搜索关键词
        sort_price_type: '' // 价格排序 1-升序 2-降序
      },
      // 分类列表
      categoryList: [],       // 一级分类列表
      subCategoryList: [],    // 二级分类列表
      selectedProducts: [],   // 已选产品
      productList: [],        // 产品列表
      productTotal: 0,        // 产品总数
      productPage: 1,         // 当前页
      productLimit: 30,       // 每页数量
      hasMore: true,          // 是否有更多

      // 当前编辑行信息
      currentEditId: null,
      currentEditTitle: '',
      currentEditXtitle: '',
      currentEditImg: '',
      currentEditAddTime: '',
      currentEditSh: 1,
      currentEditPx: 1,
      //guanlianjieshu
      formRules: {
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        add_time: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
      },
      pid: '',  // 添加这个变量
      addBox: true,
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '',
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      form: {
        name: '',       // 标题
        xtitle: '',     // 小标题
        img: '',        // 图片
        sh: '1',        // 是否发布 1/0
        px: '',         // 排序
        add_time: ''    // 添加时间
      },
      isEdit: false,    // 是否编辑模式
      editId: null,     // 编辑时的id
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: [],



      selectedProducts: [],
      productList: [],

      // 新增：关联产品时记录当前行信息
      currentEditId: null,
      currentEditTitle: '',
      currentEditXtitle: '',
      currentEditImg: '',
      currentEditAddTime: '',
      currentEditSh: 1,
      currentEditPx: 1,
    }
  },
  mounted() {
    this.pid = this.$route.query.pid;
    console.log('接收到的 pid:', this.pid);

    this.classiFications();
  },
  methods: {
    // 自定义上传方法
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'home/editclassification')
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
          this.form.img = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        // 处理可能的跨域或其他错误
        if (error.response?.data?.status === 200) {
          this.form.img = error.response.data.data
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
    async pxClassification(row) {
      try {
        const res = await pxClassification({ id: row.id, px: row.px });
        if (res.code === 200) {
          this.$message.success('排序修改成功');
          this.classiFications();
        } else {
          this.$message.error(res.msg || '排序修改失败')
        }
      } catch (error) {
        this.$message.error('排序修改失败')
      }
    },
    // 在打开弹窗前重置表单
    addClassification() {
      this.isEdit = false;
      this.editId = null;
      this.form = {
        name: '',
        xtitle: '',
        img: '',
        sh: '1',
        px: '',
        add_time: ''
      };
      this.dialogVisible = true;
    },
    // 弹窗确定按钮
    // handleDialogConfirm 方法改为使用 async/await 方式验证
    async handleDialogConfirm() {
      // 先验证
      try {
        await this.$refs.formRef.validate();
      } catch (error) {
        // 验证失败，直接返回
        return;
      }

      const params = {
        title: this.form.name,
        xtitle: this.form.xtitle || '',
        img: this.form.img || '',
        add_time: this.form.add_time,
        sh: this.form.sh,
        px: this.form.px || '1',
        pid: this.pid
      };

      try {
        if (this.isEdit) {
          params.id = this.editId;
          const res = await editClassification(params);
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.dialogVisible = false;
            this.classiFications();
          } else {
            this.$message.error(res.msg || '修改失败');
          }
        } else {
          const res = await addClassification(params);
          if (res.code === 200) {
            this.$message.success('添加成功');
            this.dialogVisible = false;
            this.classiFications();
          } else {
            this.$message.error(res.msg || '添加失败');
          }
        }
      } catch (error) {
        this.$message.error('操作失败');
      }
    },
    // 切换发布状态
    // async handleShChange(row) {
    //   try {
    //     const res = await fbClassification({ id: row.id });

    //     if (res.code === 200) {
    //       // 根据接口返回的状态更新本地数据
    //       const newSh = res.data.sh;  // 1 或 0
    //       row.ipe = newSh == 1;       // true=已发布 false=未发布
    //       row.sh = newSh;             // 更新sh值
    //       this.$message.success('状态修改成功');
    //       this.classiFications()
    //     } else {
    //       // 失败则回滚开关状态
    //       row.ipe = !row.ipe;
    //       this.$message.error(res.msg || '状态修改失败');
    //     }
    //   } catch (error) {
    //     // 异常则回滚开关状态
    //     row.ipe = !row.ipe;
    //     this.$message.error('状态修改失败');
    //   }
    // },


    async handleShChange(row) {
      // 获取切换后的状态文本
      const statusText = !row.ipe ? '取消发布' : '发布';

      try {
        await this.$confirm(`确定${statusText}该分类?`, '提示', {
          type: 'warning'
        });

        const res = await fbClassification({ id: String(row.id) });

        if (res.code === 200) {
          // 根据接口返回的状态更新
          row.sh = res.data.sh;
          row.ipe = res.data.sh == 1;
          this.$message.success('状态修改成功');
          this.classiFications(); // 刷新列表
        } else {
          // 失败则回滚开关状态
          row.ipe = !row.ipe;
          this.$message.error(res.msg || '状态修改失败');
        }
      } catch (error) {
        // 取消或失败都回滚开关状态
        row.ipe = !row.ipe;
        if (error !== 'cancel') {
          this.$message.error('状态修改失败');
        }
      }
    },


    async classiFications() {
      const res = await classiFication({ pid: this.pid });
      console.log(res)
      if (res.code === 200 && res.data) {
        this.tableData = (res.data.list || []).map(item => {
          // 时间戳转日期字符串
          let addTimeStr = '';
          if (item.add_time) {
            const date = new Date(item.add_time * 1000); // 注意：如果是秒级时间戳需要*1000
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            addTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }

          return {
            id: item.id,
            title: item.title,
            xtitle: item.xtitle,
            img: item.img,
            add_time: addTimeStr,  // 显示用的格式化时间
            add_time_stamp: item.add_time,  // 保存原始时间戳
            sh: item.sh,
            pid: item.pid,
            px: item.px,  // 排序值
            gid: item.gid,  // 产品id串

            // 用于 el-switch
            ipe: item.sh == 1
          };
        });
      }
    },
    goback() {
      this.$router.push('/carous/list')
    },
    addBoxs(index, row) {
      this.currentEditId = row.id;
      this.currentEditTitle = row.title;
      this.currentEditXtitle = row.xtitle;
      this.currentEditImg = row.img;
      this.currentEditAddTime = row.add_time;
      this.currentEditSh = row.sh;
      this.currentEditPx = row.px;

      this.addBox = false;

      // 重置分页
      this.productPage = 1;
      this.productList = [];

      // 加载分类列表
      this.loadCategoryList();
      // 加载已关联产品
      this.loadSelectedProducts(row.id);
      // 加载产品列表（首次加载，替换数据）
      this.loadProductList(false);
    },
    // 加载一级分类列表
    async loadCategoryList() {
      try {
        const res = await showSyFenLens({ pid: 0 });
        if (res.code === 200) {
          this.categoryList = (res.data.list || []).filter(item => item.flag == 1);
        }
      } catch (error) {
        console.error('获取分类失败', error);
      }
    },



    // 加载已关联产品
    async loadSelectedProducts(id) {
      try {
        const res = await navClassificationProducts({ id: String(id) });
        if (res.code === 200 && res.data && res.data.product_all) {
          this.selectedProducts = res.data.product_all.map(item => ({
            id: item.id,
            title: item.name,
            image: item.thumbnailimage,
            marketPrice: item.price,
            supplyPrice: item.ghprice,
            brand_id: item.brand_id
          }));
        }
      } catch (error) {
        console.error('获取已关联产品失败', error);
        this.selectedProducts = [];
      }
    },

    // 加载产品列表（分页）
    // 加载产品列表（分页）
    async loadProductList(isLoadMore = false) {
      try {
        const params = {
          id: String(this.currentEditId),
          page: String(this.productPage),
          limit: String(this.productLimit)
        };

        // 添加已选产品ids
        if (this.selectedProducts.length > 0) {
          params.ids = this.selectedProducts.map(p => p.id).join('+') + '+';
        }

        // 一级分类
        if (this.filterForm.class1) {
          params.class1 = String(this.filterForm.class1);
        }

        // 二级分类
        if (this.filterForm.class2) {
          params.class2 = String(this.filterForm.class2);
        }

        // 搜索关键词
        if (this.filterForm.search_val) {
          params.search_key = this.filterForm.search_key;
          params.search_val = this.filterForm.search_val;
        }

        // 价格排序
        if (this.filterForm.sort_price_type) {
          params.sort_price_type = String(this.filterForm.sort_price_type);
        }

        const res = await navProductPages(params);

        if (res.code === 200 && res.data && res.data.product) {
          const productData = res.data.product;

          // 转换数据
          const newProducts = (productData.data || []).map(item => ({
            id: item.id,
            title: item.name,
            image: item.thumbnailimage,
            marketPrice: item.price,
            supplyPrice: item.ghprice,
            brand_id: item.brand_id,
            selected: item.selected  // 1-已选择 0-未选择
          }));

          // 如果是加载更多，追加数据；否则替换数据
          if (isLoadMore) {
            this.productList = [...this.productList, ...newProducts];
          } else {
            this.productList = newProducts;
          }

          this.productTotal = productData.total || 0;
          this.hasMore = this.productPage < productData.last_page;
        }
      } catch (error) {
        console.error('获取产品列表失败', error);
      }
    },



    // 加载更多（追加数据）

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.isEdit = true;
      this.editId = row.id;
      this.form.name = row.title;
      this.form.xtitle = row.xtitle;
      this.form.img = row.img;
      this.form.sh = String(row.sh);  // 转为字符串
      this.form.px = row.px;
      this.form.add_time = row.add_time;  // 已经是格式化后的日期字符串
      this.dialogVisible = true;
    },
    async handleDelete(index, row) {
      try {
        await this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await delClassification({ id: row.id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.classiFications()  // 刷新列表
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },


    async handleCategoryChange(value) {
      this.filterForm.class2 = '';
      this.subCategoryList = [];
      if (value) {
        const res = await showSyFenLens({ pid: value });
        if (res.code === 200) {
          this.subCategoryList = res.data.list || [];
        }
      }
      this.productPage = 1;
      this.loadProductList(false);  // 注意这里传 false
    },

    // 搜索产品
    searchProducts() {
      this.productPage = 1;
      this.loadProductList(false);  // 替换数据
    },

    // 加载更多
    loadMore() {
      this.productPage++;
      this.loadProductList(true);
    },

    // 切换选择产品
    toggleSelect(product) {
      const index = this.selectedProducts.findIndex(p => p.id === product.id);
      if (index === -1) {
        // 添加到选中
        this.selectedProducts.push({
          id: product.id,
          title: product.title,
          image: product.image,
          marketPrice: product.marketPrice,
          supplyPrice: product.supplyPrice,
          brand_id: product.brand_id
        });
      } else {
        // 从选中移除
        this.selectedProducts.splice(index, 1);
      }

      // 更新产品列表中的选中状态
      const listItem = this.productList.find(p => p.id === product.id);
      if (listItem) {
        listItem.selected = index === -1 ? 1 : 0;
      }
    },

    // 判断是否选中
    isSelected(product) {
      return this.selectedProducts.some(p => p.id === product.id);
    },

    // 从已选列表移除
    removeSelected(index) {
      const removedId = this.selectedProducts[index].id;
      this.selectedProducts.splice(index, 1);

      // 更新产品列表中的状态
      const listItem = this.productList.find(p => p.id === removedId);
      if (listItem) {
        listItem.selected = 0;
      }
    },

    async submitProducts() {
      if (this.selectedProducts.length === 0) {
        this.$message.warning('请选择至少一个产品');
        return;
      }

      const ids = this.selectedProducts.map(p => p.id).join('+') + '+';

      try {
        const res = await saveNavClassifications({
          id: String(this.currentEditId),
          ids: ids
        });

        if (res.code === 200) {
          this.$message.success(`关联成功，已精选 ${this.selectedProducts.length} 款产品`);
          this.addBox = true;
          this.classiFications();
        } else {
          this.$message.error(res.msg || '关联失败');
        }
      } catch (error) {
        this.$message.error('关联失败');
      }
    }
  }
}
</script>

<style scoped>
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

/* 筛选区域样式 */
.filter-area {
  text-align: left;

}

/* 产品列表区域 */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  /* padding: 10px; */
}

.loading-more {
  text-align: center;
  padding: 20px;
}



/* 已选区域的产品特殊样式 */
.selected-list .product-item {
  width: 100px;
}

.selected-list .product-content {
  position: relative;
}

/* 已选区域的产品特殊样式 */
.selected-list .product-item {
  width: 100px;
  /* 更窄的宽度 */
  height: auto;
}

.selected-list .product-content {
  position: relative;
  display: flex;
  flex-direction: column;
  /* 竖向布局 */
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
  /* 标题可以居中 */
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
  /* 价格可以居中 */
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: contain;
}
</style>