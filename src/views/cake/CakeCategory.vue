<template>
  <div class="list-container">
    <template v-if="CakeCategory">
      <!-- 搜索栏 -->
      <el-card class="search-card serchForm" v-if="addBox">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.pid" placeholder="位置" class="w120" clearable>
              <el-option label="首页大图" :value="1"></el-option>
              <el-option label="首页小图" :value="2"></el-option>
              <el-option label="首页推荐分类" :value="3"></el-option>
              <el-option label="节日甄选" :value="4"></el-option>
              <el-option label="送礼优选" :value="5"></el-option>
              <el-option label="首页图标分类" :value="6"></el-option>
              <el-option label="美味推荐" :value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="标题" class="w120" clearable>
              <el-option label="标题" value="title"></el-option>
              <el-option label="小标题" value="xtitle"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序" class="w120" clearable>
              <el-option label="排序" value="px"></el-option>
              <el-option label="添加时间" value="add_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="降序" class="w120" clearable>
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
              <el-option label="已发布" :value="1"></el-option>
              <el-option label="未发布" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 列表与操作栏 -->
      <el-card class="search-card" v-if="addBox">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
            v-if="multipleSelection.length > 1">批量删除</el-button>

          <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog()">添加首页分类</el-button>
        </div>

        <!-- 添加/修改 弹窗 -->
        <el-dialog :title="dialogType === 'add' ? '添加分类' : '修改分类'" :visible.sync="dialogVisible" width="50%"
          :before-close="handleClose">
          <div style="width: 80%; margin: auto;">
            <el-form ref="form" :model="form" label-width="100px" label-position="left">
              <el-form-item label="位置">
                <el-select v-model="form.pid" placeholder="请选择位置" style="width: 100%;">
                  <el-option label="首页大图" :value="1"></el-option>
                  <el-option label="首页小图" :value="2"></el-option>
                  <el-option label="首页推荐分类" :value="3"></el-option>
                  <el-option label="节日甄选" :value="4"></el-option>
                  <el-option label="送礼优选" :value="5"></el-option>
                  <el-option label="首页图标分类" :value="6"></el-option>
                  <el-option label="美味推荐" :value="7"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
              </el-form-item>

              <el-form-item label="小标题">
                <el-input v-model="form.xtitle" placeholder="请输入小标题（选填）"></el-input>
              </el-form-item>

              <el-form-item label="排序">
                <el-input v-model="form.px" style="width: 100%;"
                  placeholder="请输入排序号"></el-input>
              </el-form-item>



              <el-form-item label="图片" style="text-align: left;">
                <el-upload class="upload-demo" action="#" :file-list="fileListImg" :http-request="handleImgUpload"
                  list-type="picture-card" :limit="1" :on-preview="handlePictureCardPreview"
                  :on-remove="handleImgRemove" :disabled="uploadLoading">
                  <i v-if="!uploadLoading" class="el-icon-plus"></i>
                  <i v-else class="el-icon-loading"></i>
                </el-upload>
                <div>尺寸:345*200,大小：1M以内</div>

              </el-form-item>

              <el-form-item label="Banner图" style="text-align: left;">
                <el-upload class="upload-demo" action="#" :file-list="fileListBanner" :http-request="handleBannerUpload"
                  list-type="picture-card" :limit="1" :on-preview="handlePictureCardPreview"
                  :on-remove="handleBannerRemove" :disabled="bannerUploadLoading">
                  <i v-if="!bannerUploadLoading" class="el-icon-plus"></i>
                  <i v-else class="el-icon-loading"></i>
                </el-upload>
                <div>尺寸:750*240,大小：1M以内</div>
              </el-form-item>

              <el-form-item label="标识">
                <el-select v-model="form.flag" placeholder="请选择标识" style="width: 100%;">
                  <el-option label="默认" :value="0"></el-option>
                  <el-option label="有产品" :value="1"></el-option>
                  <el-option label="有分类" :value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="颜色" v-if="form.flag === 2">
                <el-color-picker v-model="form.color" show-alpha></el-color-picker>
                <span style="margin-left: 10px; color: #999;">（有分类时可设置字体颜色）</span>
              </el-form-item>

              <el-form-item label="发布状态" style="text-align: left;">
                <el-radio-group v-model="form.sh">
                  <el-radio :label="1">发布</el-radio>
                  <el-radio :label="0">不发布</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="发布时间">
                <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择发布时间"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                </el-date-picker>
              </el-form-item>

            </el-form>
          </div>
          <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 图片预览弹窗 -->
        <el-dialog :visible.sync="dialogVisible2" width="50%">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-if="tableshow" v-loading="listLoading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection"  min-width="55"></el-table-column>
          <el-table-column label="编号" min-width="80" align="center" prop="id"></el-table-column>
          <el-table-column label="排序" min-width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.px" size="mini" @change="handleSortChange(scope.row)"
                type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="图片" min-width="150" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.img" style="height: 50px; width: 100px; object-fit: contain;" v-if="scope.row.img">
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" prop="" min-width="220">
            <template slot-scope="scope">
            <span class="blueCl">[{{ getPid(scope.row.pid) }}]</span>   {{ scope.row.title }}
            </template>

          </el-table-column>
          <!-- <el-table-column label="小标题" align="center" prop="xtitle"></el-table-column> -->
          <el-table-column label="添加时间" align="center" min-width="180">
            <template slot-scope="scope">
              {{ scope.row.add_time | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="80">

            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="280" align="left" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              <el-button size="mini" type="success" v-if="scope.row.flag == 1"
                @click="addBoxs(scope.row.id)">产品</el-button>
              <el-button size="mini" type="success" v-if="scope.row.flag == 2"
                @click="classiFication(scope.row.id)">分类</el-button>

            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-card>
     
      <!-- 关联产品卡片 -->
      <div v-if="!addBox">
        <!-- <el-button @click="backGo">返回</el-button> -->

        <!-- 已选中的产品区域（顶部） -->
        <el-card class="search-card mb16" v-if="selectedProducts.length > 0">
          <div class="selected-title">已精选 <span class="selected-count">{{ selectedProducts.length }}</span> 款产品</div>
          <div class="selected-list" style="padding-top: 10px;">
            <div class="product-item selected" v-for="(item, index) in selectedProducts" :key="item.id"
              style="position: relative;">
              <span class="delete-icon" @click="removeSelected(index)">×</span>
              <div class="product-content">
                <img :src="item.thumbnailimage || item.image" :alt="item.name || item.title" class="product-image w70">
                <div class="product-info">
                  <div class="product-title">{{ item.name || item.title }}</div>
                  <div class="product-brand" v-if="item.brand_name">品牌: {{ item.brand_name }}</div>
                  <div class="product-price">价格: ¥{{ item.price || item.marketPrice }}</div>
                  <div class="product-type" :class="item.cpbs === 2 ? 'cake' : 'shop'" style="
    position: absolute;
    left: 0;background-color: #409EFF;
    color: #ffffff;font-size: 12px;border-bottom-right-radius: 4px;padding-right: 3px;padding-bottom: 2px;
    top: 0;
">
                    {{ item.cpbs === 2 ? '蛋糕' : '商城' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="submit-area">
            <el-button type="success" size="small" @click="backGo()">返回</el-button>
            <!-- <el-button type="primary" size="small" @click="submitProducts()" :loading="submitLoading">确认提交</el-button> -->
          </div>
        </el-card>

        <!-- ========== 商城+蛋糕 筛选同行 ========== -->
        <el-card class="search-card">
          <div class="filter-area serchForm"
            style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 20px;">
            <!-- 商城筛选 -->
            <div style="flex: 1; min-width: 400px;text-align: left;">

              <el-form :inline="true" :model="shopFilterForm" class="search-form">
                <el-form-item label="商城产品列表">
                  <el-select v-model="shopFilterForm.class1" placeholder="分类" style="width: 110px;" clearable
                    @change="handleShopCategoryChange">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name"
                      :value="String(item.id)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="shopSubCategoryList.length > 0">
                  <el-select v-model="shopFilterForm.class2" placeholder="二级分类" style="width: 110px;" clearable
                    @change="searchShopProducts">
                    <el-option v-for="item in shopSubCategoryList" :key="item.id" :label="item.name"
                      :value="String(item.id)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="shopFilterForm.brand_id" placeholder="品牌" style="width: 110px;" clearable
                    @change="searchShopProducts">
                    <el-option v-for="item in shopBrandList" :key="item.id" :label="item.name"
                      :value="String(item.id)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="shopFilterForm.search_title" placeholder="关键词" style="width: 90px;"
                    @keyup.enter.native="searchShopProducts"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchShopProducts" :loading="shopLoading">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 蛋糕筛选 -->
            <div style="flex: 1; min-width: 300px;">

              <el-form :inline="true" :model="cakeFilterForm" class="search-form">
                <el-form-item label="蛋糕产品列表">
                  <el-select v-model="cakeFilterForm.dgcity_id" placeholder="城市" style="width: 110px;" clearable
                    @change="handleCakeCityChange">
                    <el-option v-for="item in cakeCityList" :key="item.id" :label="item.name"
                      :value="String(item.id)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="cakeFilterForm.dgbrand_id" placeholder="品牌" style="width: 110px;" clearable
                    @change="searchCakeProducts">
                    <el-option v-for="item in cakeBrandList" :key="item.id" :label="item.name"
                      :value="String(item.brand_id || item.id)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="cakeFilterForm.dgsearch_title" placeholder="关键词" style="width: 90px;"
                    @keyup.enter.native="searchCakeProducts"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchCakeProducts" :loading="cakeLoading">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 商城产品列表（只在激活商城时显示） -->
          <div v-if="activeProductType === 'shop'">
            <div class="product-list" v-loading="shopLoading">
              <div v-if="shopProductList.length === 0 && !shopLoading"
                style="text-align: center; width: 100%; padding: 20px;">
                暂无商城产品数据，请点击"查询"按钮
              </div>
              <div class="product-item" v-for="item in shopProductList" :key="item.id"
                :class="{ 'active': isSelected(item) }" @click="toggleSelect(item)" style="position: relative;">
                <span class="select-icon"></span>
                <div class="product-content">
                  <img :src="item.thumbnailimage || item.image" :alt="item.name || item.title" class="product-image">
                  <div class="product-title">{{ item.name || item.title }}</div>
                  <div class="product-brand" v-if="item.brand_name">{{ item.brand_name }}</div>
                  <div class="product-price">市场价: ¥{{ item.marketPrice || item.price }}</div>
                  <div class="product-price">供货价: ¥{{ item.supplyPrice }}</div>
                  <div class="product-type shop"
                    style="position: absolute;left: 0;top: -4px;background-color: #eeeeee;color: #000;">商城</div>
                </div>
              </div>
            </div>
            <div class="loading-more" v-if="shopHasMore">
              <el-button type="success" plain @click="loadMoreShopProducts" :loading="shopLoading">查看更多</el-button>
            </div>
          </div>

          <!-- 蛋糕产品列表（只在激活蛋糕时显示） -->
          <div v-if="activeProductType === 'cake'">
            <div class="product-list" v-loading="cakeLoading">
              <div v-if="cakeProductList.length === 0 && !cakeLoading"
                style="text-align: center; width: 100%; padding: 20px;">
                暂无蛋糕产品数据，请点击"查询"按钮
              </div>
              <div class="product-item" v-for="item in cakeProductList" :key="item.id"
                :class="{ 'active': isSelected(item) }" @click="toggleSelect(item)" style="position: relative;">
                <span class="select-icon"></span>
                <div class="product-content">
                  <img :src="item.thumbnailimage || item.image" :alt="item.name || item.title" class="product-image">
                  <div class="product-title">{{ item.name || item.title }}</div>
                  <div class="product-brand" v-if="item.brand_name">{{ item.brand_name }}</div>
                  <div class="product-price">价格: ¥{{ item.price || item.marketPrice }}</div>
                  <div class="product-type cake"
                    style="position: absolute;left: 0;top: -4px;background-color:#eeeeee;color: #000;">蛋糕</div>
                </div>
              </div>
            </div>
            <div class="loading-more" v-if="cakeHasMore">
              <el-button type="success" plain @click="loadMoreCakeProducts" :loading="cakeLoading">查看更多</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  cakeClassifyDelcake, cakeClassifyUpdatecake,
  classifyListcake, addClassifycake, getClassifycake, cakeClassifyCakePagecake, editClassifycake, delClassifycake, fbClassifycake, pxClassifycake, classifyProductcake, shopTwoFenleicake, dgCityBrandcake, cakeClassifyProductPagecake
} from '@/api/modules/login'

export default {
  name: 'CakeCarousel',
  data() {
    return {
      activeProductType: 'shop',  // 添加这一行
      uploadLoading: false,  // 图片上传loading
      bannerUploadLoading: false,  // Banner上传loading
      addBox: true,
      searchForm: {
        search_key: '',
        search_val: '',
        pid: '',
        px_key: '',
        px_val: '',
        sh: 1
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      form: {
        id: '',
        title: '',
        xtitle: '',
        img: '',
        banner: '',
        pid: 1,
        px: 0,
        sh: 1,
        add_time: '',
        flag: 0,
        color: ''
      },
      fileListImg: [],
      fileListBanner: [],
      dialogVisible: false,
      dialogType: 'add', // 'add' 或 'edit'
      tableshow: true,
      listLoading: false,
      multipleSelection: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // ... 原有数据
      // 商城产品相关
      shopFilterForm: {
        class1: '',
        class2: '',
        brand_id: '',
        search_title: ''
      },
      shopProductList: [],
      shopSubCategoryList: [],
      shopBrandList: [],
      shopPage: 1,
      shopLimit: 30,
      shopTotal: 0,
      shopHasMore: false,
      shopLoading: false,

      // 蛋糕产品相关
      cakeFilterForm: {
        dgcity_id: '',
        dgbrand_id: '',
        dgsearch_title: ''
      },
      cakeProductList: [],
      cakeCityList: [],
      cakeBrandList: [],
      cakePage: 1,
      cakeLimit: 30,
      cakeTotal: 0,
      cakeHasMore: false,
      cakeLoading: false,

      // 已选产品
      selectedProducts: [],
      currentCategoryId: null,

      // 分类相关
      categoryList: [],
      categoryListAll: [],
      cityList: [],

      productLoading: false,
      loadMoreLoading: false,
      submitLoading: false,
    }
  },
  mounted() {
    this.fetchList();
  },
  filters: {
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  methods: {
    // 获取当前时间（用于添加时自动填充）
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 图片上传
    async handleImgUpload(options) {
      const { file } = options;
      this.uploadLoading = true;

      try {
        const url = await this.uploadFile(file);
        if (url) {
          this.form.img = url;
          this.fileListImg = [{ name: 'img', url: url }];
          this.$message.success('图片上传成功');
        }
      } catch (error) {
        console.error('图片上传失败:', error);
        this.$message.error('图片上传失败');
      } finally {
        this.uploadLoading = false;
      }
    },

    // Banner上传
    async handleBannerUpload(options) {
      const { file } = options;
      this.bannerUploadLoading = true;

      try {
        const url = await this.uploadFile(file);
        if (url) {
          this.form.banner = url;
          this.fileListBanner = [{ name: 'banner', url: url }];
          this.$message.success('Banner上传成功');
        }
      } catch (error) {
        console.error('Banner上传失败:', error);
        this.$message.error('Banner上传失败');
      } finally {
        this.bannerUploadLoading = false;
      }
    },

    // 通用文件上传方法
    // 通用文件上传方法
    async uploadFile(file) {
      // 文件类型校验
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!');
        return null;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return null;
      }

      const timestamp = GLOBAL_CONFIG.getTimestamp();
      const sign = GLOBAL_CONFIG.generateSign();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_url', 'upload/cakeclassify');
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO);
      formData.append('timestamp', timestamp);
      formData.append('sign', sign);

      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        // 根据实际返回结构调整
        if (response.data.status === 200 || response.data.code === 200) {
          return response.data.data;
        } else {
          throw new Error(response.data.msg || '上传失败');
        }
      } catch (error) {
        console.error('上传错误:', error);
        // 处理可能的跨域或其他错误
        if (error.response?.data?.status === 200) {
          return error.response.data.data;
        }
        throw error;
      }
    },

    // 图片移除
    handleImgRemove() {
      this.$confirm('确定删除图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.img = '';
        this.fileListImg = [];
        this.$message.success('图片已删除');
      }).catch(() => { });
    },

    // Banner移除
    handleBannerRemove() {
      this.$confirm('确定删除Banner图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.banner = '';
        this.fileListBanner = [];
        this.$message.success('Banner图已删除');
      }).catch(() => { });
    },

    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },

    // ========== 页面切换 ==========
    backGo() {
      this.addBox = true
    },

    goback() {
      this.addBox = true;
      this.currentCategoryId = null;
      this.selectedProducts = [];
    },

    // ========== 打开关联产品页面 ==========
    async addBoxs(id) {
      this.cakeFilterForm.dgbrand_id = '';
      this.cakeFilterForm.dgcity_id = '';
      this.cakeFilterForm.dgbrand_id = '';
      this.cakeFilterForm.dgsearch_title = '';
      this.shopFilterForm.search_title = '';
      this.shopFilterForm.class1 = '';
      this.shopFilterForm.class2 = '';
      this.shopFilterForm.brand_id = '';
      this.currentCategoryId = id;
      this.addBox = false;
      this.selectedProducts = [];


      // 新增：重置激活类型为商城
      this.activeProductType = 'shop';

      this.shopPage = 1;
      this.cakePage = 1;
      this.shopProductList = [];
      this.cakeProductList = [];
      this.shopSubCategoryList = [];
      this.shopBrandList = [];
      this.cakeBrandList = [];

      try {
        const res = await classifyProductcake({ id: id });
        if (res.code === 200 && res.data) {
          const data = res.data;
          this.cakeCityList = data.cake_city || [];
          this.cityList = data.cake_city || [];
          this.categoryListAll = data.shop_fenlei || [];
          this.categoryList = (data.shop_fenlei || []).filter(item => item.flag === 1);
          this.currentClassify = data.cakeclassify || {};

          // 已关联的产品回显到顶部
          const productList = data.product_list || [];
          this.selectedProducts = productList.map(item => ({
            id: item.id,
            name: item.name || item.title,
            title: item.title || item.name,
            image: item.thumbnailimage || item.image_path || item.image,
            thumbnailimage: item.thumbnailimage || item.image_path || item.image,
            price: item.price || item.list_xinghao?.[0]?.price || 0,
            marketPrice: item.marketPrice || item.list_xinghao?.[0]?.price || item.price || 0,
            supplyPrice: item.supplyPrice || item.list_xinghao?.[0]?.ghprice || 0,
            brand_name: item.brand_name || item.list_pinpai?.name || '',
            cpbs: item.cpbs || 1
          }));

          // 修改：只加载商城产品，蛋糕产品显示空状态提示
          this.loadShopProducts();
          // 注释掉自动加载蛋糕产品
          // this.loadCakeProducts(); 
        } else {
          this.$message.error(res.msg || '获取数据失败');
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('网络错误，请稍后重试');
      }
    },

    // ========== 商城产品 ==========
    async handleShopCategoryChange(class1Id) {
      // 新增：切换到商城产品列表
      this.activeProductType = 'shop';
      this.shopFilterForm.class2 = '';
      this.shopFilterForm.brand_id = '';
      this.shopSubCategoryList = [];
      this.shopBrandList = [];

      if (!class1Id) {
        this.searchShopProducts();
        return;
      }

      try {
        const res = await shopTwoFenleicake({ id: class1Id });
        if (res.code === 200 && res.data) {
          this.shopSubCategoryList = res.data.list || [];
          this.shopBrandList = res.data.pingpai_list || [];
        }
      } catch (error) {
        console.error('获取二级分类和品牌失败:', error);
      }

      this.searchShopProducts();
    },
    searchShopProducts() {
      // 新增：切换到商城产品列表
      this.activeProductType = 'shop';
      this.shopPage = 1;
      this.shopProductList = [];
      this.loadShopProducts();
    },
    async loadShopProducts(isLoadMore = false) {
      if (this.shopLoading) return;
      this.shopLoading = true;

      try {
        const params = {
          flid: this.currentCategoryId,
          page: this.shopPage,
          limit: this.shopLimit
        };

        if (this.shopFilterForm.class1) params.class1 = this.shopFilterForm.class1;
        if (this.shopFilterForm.class2) params.class2 = this.shopFilterForm.class2;
        if (this.shopFilterForm.brand_id) params.brand_id = this.shopFilterForm.brand_id;
        if (this.shopFilterForm.search_title) params.search_title = this.shopFilterForm.search_title;

        const res = await cakeClassifyProductPagecake(params);

        if (res.code === 200 && res.data) {
          const productData = res.data.data || [];
          this.shopTotal = res.data.total || 0;

          const newProducts = productData.map(item => ({
            id: item.id,
            name: item.name,
            title: item.name,
            image: item.thumbnailimage,
            thumbnailimage: item.thumbnailimage,
            marketPrice: item.list_xinghao?.[0]?.price || 0,
            supplyPrice: item.list_xinghao?.[0]?.ghprice || 0,
            price: item.list_xinghao?.[0]?.price || 0,
            brand_name: item.list_pinpai?.name || '',
            cpbs: item.cpbs || 1,
            selected: item.selected
          }));

          if (isLoadMore) {
            this.shopProductList = [...this.shopProductList, ...newProducts];
          } else {
            this.shopProductList = newProducts;
          }

          this.shopHasMore = this.shopPage < res.data.last_page;
        }
      } catch (error) {
        console.error('加载商城产品失败:', error);
      } finally {
        this.shopLoading = false;
      }
    },

    loadMoreShopProducts() {
      if (!this.shopHasMore || this.shopLoading) return;
      this.shopPage++;
      this.loadShopProducts(true);
    },

    // ========== 蛋糕产品 ==========
    async handleCakeCityChange(cityId) {
      // 新增：切换到蛋糕产品列表
      this.activeProductType = 'cake';
      this.cakeFilterForm.dgbrand_id = '';
      this.cakeBrandList = [];

      if (!cityId) {
        this.searchCakeProducts();
        return;
      }

      try {
        const res = await dgCityBrandcake({ id: cityId });
        if (res.code === 200) {
          this.cakeBrandList = res.data || [];
        }
      } catch (error) {
        console.error('获取蛋糕品牌失败:', error);
      }

      this.searchCakeProducts();
    },

    searchCakeProducts() {
      // 新增：切换到蛋糕产品列表
      this.activeProductType = 'cake';
      this.cakePage = 1;
      this.cakeProductList = [];
      this.loadCakeProducts();
    },

    async loadCakeProducts(isLoadMore = false) {
      if (this.cakeLoading) return;
      this.cakeLoading = true;

      try {
        const params = {
          flid: this.currentCategoryId,
          page: this.cakePage,
          limit: this.cakeLimit
        };

        if (this.cakeFilterForm.dgcity_id) params.dgcity_id = this.cakeFilterForm.dgcity_id;
        if (this.cakeFilterForm.dgbrand_id) params.dgbrand_id = this.cakeFilterForm.dgbrand_id;
        if (this.cakeFilterForm.dgsearch_title) params.dgsearch_title = this.cakeFilterForm.dgsearch_title;

        const res = await cakeClassifyCakePagecake(params);

        if (res.code === 200 && res.data) {
          const productData = res.data.data || [];
          this.cakeTotal = res.data.total || 0;

          const newProducts = productData.map(item => ({
            id: item.id,
            name: item.title,
            title: item.title,
            image: item.image_path,
            thumbnailimage: item.image_path,
            price: item.price,
            marketPrice: item.price,
            supplyPrice: item.price,
            brand_name: item.brand_name,
            cpbs: item.cpbs || 2,
            label_name: item.label_name,
            selected: item.selected
          }));

          if (isLoadMore) {
            this.cakeProductList = [...this.cakeProductList, ...newProducts];
          } else {
            this.cakeProductList = newProducts;
          }

          this.cakeHasMore = this.cakePage < res.data.last_page;
        }
      } catch (error) {
        console.error('加载蛋糕产品失败:', error);
      } finally {
        this.cakeLoading = false;
      }
    },

    loadMoreCakeProducts() {
      if (!this.cakeHasMore || this.cakeLoading) return;
      this.cakePage++;
      this.loadCakeProducts(true);
    },

    // ========== 选择操作 ==========
    isSelected(item) {
      return this.selectedProducts.some(p => p.id === item.id);
    },

    async toggleSelect(item) {
      const isCurrentlySelected = this.isSelected(item);
      const data_type = item.cpbs || 1; // 1-商城产品 2-蛋糕产品

      try {
        if (isCurrentlySelected) {
          // 已选中 -> 走删除接口
          const res = await cakeClassifyDelcake({
            flid: String(this.currentCategoryId),
            data_type: String(data_type),
            id: String(item.id)
          });

          if (res.code === 200) {
            // 从已选列表中移除
            const index = this.selectedProducts.findIndex(p => p.id === item.id);
            if (index > -1) {
              this.selectedProducts.splice(index, 1);
            }
            this.$message.success('取消选中成功');
          } else {
            this.$message.error(res.msg || '取消选中失败');
          }
        } else {
          // 未选中 -> 走选中接口
          const res = await cakeClassifyUpdatecake({
            flid: String(this.currentCategoryId),
            data_type: String(data_type),
            id: String(item.id)
          });

          if (res.code === 200) {
            // 添加到已选列表
            this.selectedProducts.push({ ...item });
            this.$message.success('选中成功');
          } else {
            this.$message.error(res.msg || '选中失败');
          }
        }
      } catch (error) {
        console.error('操作失败:', error);
        this.$message.error('操作失败，请稍后重试');
      }
    },

    async removeSelected(index) {
      const item = this.selectedProducts[index];
      if (!item) return;

      const data_type = item.cpbs || 1; // 1-商城产品 2-蛋糕产品

      try {
        const res = await cakeClassifyDelcake({
          flid: String(this.currentCategoryId),
          data_type: String(data_type),
          id: String(item.id)
        });

        if (res.code === 200) {
          this.selectedProducts.splice(index, 1);
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.msg || '删除失败');
        }
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败，请稍后重试');
      }
    },

    // async submitProducts() {
    //   if (this.selectedProducts.length === 0) {
    //     this.$message.warning('请至少选择一个产品');
    //     return;
    //   }

    //   this.submitLoading = true;
    //   try {
    //     const productIds = this.selectedProducts.map(item => item.id).join('+') + '+';
    //     // const res = await saveCategoryProducts({ id: this.currentCategoryId, ids: productIds });

    //     this.$message.success(`成功关联 ${this.selectedProducts.length} 个产品`);
    //     this.backGo();
    //     this.fetchList();
    //   } catch (error) {
    //     this.$message.error('提交失败');
    //   } finally {
    //     this.submitLoading = false;
    //   }
    // },

    // ========== 原有方法 ==========
    classiFication(vals) {
      console.log(vals)
      this.$router.push({ name: 'CakeCategoryFl', query: { id: vals } });
    },

    getPid(vals) {
      if (vals == 1) return '首页大图'
      if (vals == 2) return '首页小图'
      if (vals == 3) return '首页推荐分类'
      if (vals == 4) return '节日甄选'
      if (vals == 5) return '送礼优选'
      if (vals == 6) return '首页图标分类'
      if (vals == 7) return '美味推荐'
    },

    async handleSortChange(row) {
      try {
        const res = await pxClassifycake({ id: row.id, px: row.px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
          this.fetchList()
        } else {
          this.$message.error(res.msg || '排序修改失败')
        }
      } catch (error) {
        this.$message.error('排序修改失败')
        this.fetchList()
      }
    },

    async handleStatusChange(row) {
      const statusText = row.sh === 1 ? '取消发布' : '发布';
      try {
        await this.$confirm(`确定${statusText}该分类?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await fbClassifycake({ id: String(row.id) });
        if (res.code === 200) {
          row.sh = res.data.sh;
          this.$message.success('状态修改成功');
          this.fetchList();
        } else {
          row.sh = row.sh === 1 ? 0 : 1
          this.$message.error(res.msg || '状态修改失败');
        }
      } catch (error) {
        row.sh = row.sh === 1 ? 0 : 1
        if (error !== 'cancel' && error !== 'close') {
          this.$message.error('状态修改失败');
        }
      }
    },

    async fetchList() {
      this.listLoading = true;
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          pid: this.searchForm.pid,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          sh: this.searchForm.sh,
          page: this.currentPage,
          limit: this.pageSize
        };
        const res = await classifyListcake(params);
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg || '获取列表失败');
        }
      } catch (error) {
        this.$message.error('网络错误，请稍后重试');
      } finally {
        this.listLoading = false;
      }
    },

    handleSearch() {
      this.currentPage = 1;
      this.fetchList();
    },

    openAddDialog() {
      this.dialogType = 'add';
      this.resetForm();
      // 添加时自动设置当前时间
      this.form.add_time = this.getCurrentTime();
      this.dialogVisible = true;
    },

    async openEditDialog(row) {
      this.dialogType = 'edit';
      this.resetForm();
      this.dialogVisible = true;
      try {
        const res = await getClassifycake({ id: row.id });
        if (res.code === 200) {
          const data = res.data;
          this.form = {
            id: data.id, title: data.title, xtitle: data.xtitle,
            img: data.img, banner: data.banner, pid: data.pid,
            px: data.px, sh: data.sh,
            add_time: this.$options.filters.formatTime(data.add_time),
            flag: data.flag, color: data.color
          };
          if (data.img) this.fileListImg = [{ name: 'img', url: data.img }];
          if (data.banner) this.fileListBanner = [{ name: 'banner', url: data.banner }];
        }
      } catch (error) {
        this.$message.error('获取详情失败');
      }
    },

    async submitForm() {
      if (!this.form.title) {
        this.$message.warning('请输入标题');
        return;
      }
      if (!this.form.px && this.form.px !== 0) {
        this.$message.warning('请输入排序');
        return;
      }

      const apiMethod = this.dialogType === 'add' ? addClassifycake : editClassifycake;

      try {
        // 准备提交参数
        const params = {
          pid: this.form.pid,
          title: this.form.title,
          xtitle: this.form.xtitle || '',
          px: this.form.px,
          sh: this.form.sh,
          flag: this.form.flag || 0,
          add_time: this.form.add_time,
          img: this.form.img || '',      // 图片URL
          banner: this.form.banner || '', // Banner URL
          color: this.form.color || ''
        };

        // 编辑时添加id
        if (this.dialogType === 'edit') {
          params.id = this.form.id;
        }

        const res = await apiMethod(params);

        if (res.code === 200) {
          this.$message.success(res.msg || (this.dialogType === 'add' ? '添加成功' : '修改成功'));
          this.dialogVisible = false;
          this.fetchList(); // 刷新列表
        } else {
          this.$message.error(res.msg || '操作失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('操作失败，请稍后重试');
      }
    },

    handleDelete(id) {
      this.$confirm('确认删除该分类吗？', '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delClassifycake({ ids: id.toString() });
          if (res.code === 200) {
            this.$message.success('删除成功');
            if (this.tableData.length === 1 && this.currentPage > 1) this.currentPage--;
            this.fetchList();
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => { });
    },

    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的项'); return;
      }
      const ids = this.multipleSelection.map(item => item.id).join(',');
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 项吗？`, '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delClassifycake({ ids });
          if (res.code === 200) { this.$message.success('批量删除成功'); this.fetchList(); }
          else { this.$message.error(res.msg || '批量删除失败'); }
        } catch (error) { this.$message.error('批量删除失败'); }
      }).catch(() => { });
    },

    handleClose() { this.dialogVisible = false; this.resetForm(); },

    resetForm() {
      this.form = {
        id: '',
        title: '',
        xtitle: '',
        img: '',
        banner: '',
        pid: 1,
        px: 0,
        sh: 1,
        add_time: '',
        flag: 0,
        color: ''
      };
      this.fileListImg = [];
      this.fileListBanner = [];
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },

    handleSelectionChange(val) { this.multipleSelection = val; },
    handleSizeChange(val) { this.pageSize = val; this.currentPage = 1; this.fetchList(); },
    handleCurrentChange(val) { this.currentPage = val; this.fetchList(); },
  }, computed: {
    CakeCategory() {
      // 只要不是子路由页面，就显示列表
      return this.$route.name === 'CakeCategory' || this.$route.path === '/cake/category'
    }
  },
}
</script>
<style>
.serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.serchForm .el-card__body {
  text-align: left;
}

.serchForm .el-input__icon {
  line-height: 36px;
}

.serchForm .el-form-item__content {
  line-height: 36px;
}
</style>
<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}

// 选中产品的标题样式
.selected-title {
  margin-bottom: 15px;
  font-size: 14px;
}

.selected-count {
  color: #f56c6c;
  font-weight: bold;
}

// 产品列表通用样式
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding-top: 20px;

  .product-item {
    position: relative;
    width: 162px;
    cursor: pointer;
    border: 2px solid #eeeeee;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      border-color: #67C23A;
      background-color: #f0f9eb;
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

    &.active .select-icon {
      background: #67C23A;
      border-color: #67C23A;
    }

    &.active .select-icon::after {
      content: "✓";
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      line-height: 18px;
    }

    .product-content {
      position: relative;
      padding: 10px;
      background: #fff;
      border-radius: 4px;

      .product-image {
        width: 136px;
        height: 136px;
        object-fit: cover;
        display: block;
        margin: 0 auto;
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

      .product-brand,
      .product-price,
      .marketPrice,
      .supplyPrice {
        margin-top: 2px;
        font-size: 12px;
        text-align: left;
        color: #666;
      }

      .product-type {
        font-size: 12px;
        padding: 2px 8px;
        border-top-left-radius: 2px;
        display: inline-block;
        margin-top: 4px;

        &.cake {
          background-color: #fdf6ec;
          color: #e6a23c;
        }

        &.shop {
          background-color: #ecf5ff;
          color: #409eff;
        }
      }
    }
  }
}

// 已选产品列表样式
.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  max-height: 340px; // ✅ 新增：最大高度 300px
  overflow-y: auto; // ✅ 新增：超过高度显示滚动条
  padding: 5px;

  .product-item.selected {
    width: 100px;
    border-radius: 6px;
    border: 2px solid #409EFF;

    .delete-icon {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20%;
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

      &:hover {
        background: #f78989;
      }
    }

    .product-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;

      .product-image.w70 {
        width: 76px;
        height: 76px;
        display: block;
        margin: 0 auto 6px auto;
        flex-shrink: 0;
      }

      .product-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 3px;
        text-align: left;
      }

      .product-title {
        font-size: 11px;
        line-height: 1.3;
        height: 28px;
        margin-top: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }

      .product-brand,
      .product-price,
      .market-price,
      .supply-price {
        font-size: 10px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.submit-area {
  text-align: center;
}

.loading-more {
  text-align: center;
  padding: 20px;
}

.mb16 {
  margin-bottom: 16px;
}

.w70 {
  width: 70px !important;
  height: 70px !important;
}

.mb16 {
  margin-bottom: 16px;
}

/* 添加到 style 标签中 */
.upload-demo {
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;background-color: #ffffff;
  }

  :deep(.el-icon-loading) {
    font-size: 28px;
    color: #409EFF;
  }

  :deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}
</style>