<template>
  <div class="cardbookList">
    <template v-if="CardBookList">
      <!-- 搜索表单 -->
      <el-card class="search-card serchForm formsTop" v-if="CardBookList && addBox">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w130">
              <el-option label="开卡客户名称" value="company"></el-option>
              <el-option label="销售人" value="sale"></el-option>
              <el-option label="标题" value="title"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="制卡时间" value="add_time"></el-option>
              <el-option label="截止日期" value="end_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120">
              <el-option label="全部" value=""></el-option>
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 添加/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose"
        :close-on-click-modal="false">
        <el-form ref="albumForm" :model="form" :rules="rules" label-width="130px" style="text-align: left; width: 90%;">
          <el-form-item label="开卡客户名称：" prop="company">
            <el-input v-model="form.company" placeholder="请输入开卡客户名称"></el-input>
          </el-form-item>
          <el-form-item label="销售人：" prop="sale">
            <el-input v-model="form.sale" placeholder="请输入销售人"></el-input>
          </el-form-item>
          <el-form-item label="数量：">
            <el-input v-model="form.geshu" placeholder="请输入数量" type="number"></el-input>
          </el-form-item>
          <el-form-item label="卡册标题：">
            <el-input v-model="form.title" placeholder="请输入卡册标题"></el-input>
          </el-form-item>
          <el-form-item label="页面形式：" prop="tid">
            <el-select v-model="form.tid" placeholder="请选择页面形式" style="width: 100%;">
              <el-option v-for="item in albumFromList" :key="item.id" :label="`[模板${item.mb_id}] ${item.title}`"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>



          <el-form-item label="Banner：">
            <el-upload class="avatar-uploader" action="#" :http-request="customUpload" :data="uploadData"
              :show-file-list="false" :before-upload="beforeBannerUpload">
              <img v-if="form.img" :src="form.img" class="avatar" style="width: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="upload-tip">建议尺寸：750*400，大小不超过1M</span>
          </el-form-item>


          <el-form-item label="是否发布：">
            <el-radio-group v-model="form.sh">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否签名：">
            <el-radio-group v-model="form.sfqm">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="兑换方式：">
            <el-radio-group v-model="form.dhfa">
              <el-radio :label="0">兑换一次</el-radio>
              <el-radio :label="1">兑换多次</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="兑换次数：" v-if="form.dhfa === 1">
            <el-input-number v-model="form.num" :min="1" :max="99" placeholder="请输入兑换次数"></el-input-number>
          </el-form-item> -->
          <el-form-item label="兑换方式：">
            <el-radio-group v-model="form.dhfa">
              <el-radio :label="0">无分类(次数1 用兑换1次的连接，次数2 用兑换多次的链接)</el-radio>
              <el-radio :label="1">有分类(按分类兑换多次，兑换次数填写1，用兑换1次的连接)</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="兑换次数：" prop="num">
            <el-input-number v-model="form.num" :min="1" :max="99" placeholder="请输入兑换次数"></el-input-number> 
            <el-button type="primary" style="margin-left: 10px;" @click="oneClick()">兑换一次</el-button>
            <el-button type="primary" @click="moreClick()">兑换多次</el-button>
          </el-form-item>
          <el-form-item label="制卡时间：" prop="add_time">
            <el-date-picker style="width: 100%;" v-model="form.add_time" type="datetime" placeholder="选择制卡时间"
              value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="截止日期：" prop="end_time">
            <el-date-picker style="width: 100%;" v-model="form.end_time" type="datetime" placeholder="选择截止日期"
              value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="公告：">
            <el-input v-model="form.gonggao" type="textarea" :rows="3" placeholder="请输入公告内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAlbum" :loading="submitLoading">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 表格卡片 -->
      <el-card class="search-card mt20" v-if="CardBookList && addBox">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="batchDelete()">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addAlbum()">添加卡册</el-button>
        </div>

        <!-- 表格 - 按照原始表格结构 -->
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <!-- 复选框 -->
          <el-table-column type="selection" width="50" align="center"></el-table-column>

          <!-- 编号 -->
          <el-table-column label="编号" width="60" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <!-- 缩略图 -->
          <el-table-column label="缩略图" width="80" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.img" :src="scope.row.img" style="width: 50px; height: 35px; border-radius: 3px;"
                fit="contain" :preview-src-list="[scope.row.img]" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <span v-else style="color: #ccc; font-size: 12px;">-</span>
            </template>
          </el-table-column>

          <!-- 开卡客户名称 -->
          <el-table-column label="开卡客户名称" min-width="180" align="left">
            <template slot-scope="scope">
              <div class="company-info">
                <span class="company-name" @click="handleEdit(scope.row)" :title="scope.row.company">
                  {{ scope.row.company }}
                </span>
                <span v-if="scope.row.geshu" class="card-count dangerCl fs12">
                  ({{ scope.row.geshu }})
                </span>
              </div>
            </template>
          </el-table-column>

          <!-- 销售人 -->
          <el-table-column label="销售人" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.sale || '-' }}
            </template>
          </el-table-column>

          <!-- 卡册标题 -->
          <el-table-column label="卡册标题" min-width="120" align="left">
            <template slot-scope="scope">
              <div class="title-info">
                <span class="album-title" @click="handleEdit(scope.row)" v-if="scope.row.title">
                  <span v-html="scope.row.title"></span>
                  <!-- {{ scope.row.title }} -->
                </span>
                <span v-if="scope.row.tid_name" class="template-name">
                  ({{ scope.row.tid_name }})
                </span>
              </div>
            </template>
          </el-table-column>

          <!-- 制卡/截止时间 -->
          <el-table-column label="制卡/截止时间" width="180" align="center">
            <template slot-scope="scope">
              <div class="time-info">
                <div class="time-row" title="制卡时间">

                  {{ scope.row.add_time | formatDateTime }}
                </div>
                <div class="time-row end-time" title="截止日期">

                  {{ scope.row.end_time | formatDateTime }}
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 精选产品 -->
          <el-table-column label="精选产品" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goToProduct(scope.row)" class="product-count-btn">
                {{ getProductCount(scope.row.pid) }}
              </el-button>
            </template>
          </el-table-column>

          <!-- 兑换次数 -->
          <el-table-column label="兑换次数" width="80" align="center">
            <template slot-scope="scope">
              <span class="exchange-count">{{ scope.row.num || 1 }}</span>
            </template>
          </el-table-column>

          <!-- 是否发布 -->
          <el-table-column label="是否发布" width="90" align="center">
            <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
                @change="(val) => togglePublish(scope.row, val)">
              </el-switch>

            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <div class="action-buttons">
                <el-button size="mini" type="primary" @click="cardNum(scope.row)">卡号</el-button>
                <el-button size="mini" type="info" v-if="scope.row.dhfa === 1"
                  @click="goToProductnew(scope.row)">分类</el-button>
                <el-button size="mini" type="success" v-else @click="goToProduct(scope.row)">产品</el-button>


                <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div style="margin-top: 20px; text-align: right;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-card>


      <!--  -->


      <!-- ========== 关联产品视图 ========== -->
      <div v-if="!addBox">
        <!-- 返回按钮 -->


        <!-- 已选中的产品区域 -->
        <el-card class="search-card mb16" v-if="selectedProducts.length > 0">
          <div class="selected-title">
            已精选 <span class="selected-count">{{ selectedProducts.length }}</span> 款产品
          </div>
          <div class="selected-list">
            <div class="product-item selected" v-for="(item, index) in selectedProducts" :key="item.id"
              style="position: relative;">
              <span class="delete-icon" @click="removeSelected(index, item)">×</span>
              <div class="product-content">
                <img :src="item.thumbnailimage" :alt="item.name" class="product-image w70" />
                <div class="product-info">
                  <div class="product-title">{{ item.name }}</div>
                  <div class="product-price">售价：¥{{ item.price }}</div>
                  <div class="product-price">供货价：¥{{ item.ghprice }}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center; ">
            <el-button type="success" size="small" @click="backGo">返回</el-button>
          </div>
        </el-card>

        <!-- 搜索筛选 -->
        <el-card class="search-card serchForm newMb0">
          <el-form :inline="true" :model="productSearchForm" class="search-form">
            <el-form-item label="">
              <el-select v-model="productSearchForm.class1" placeholder="一级分类" class="w120" clearable
                @change="handleClass1Change">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name"
                  :value="String(item.id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="productSearchForm.class2" placeholder="二级分类" class="w120" clearable>
                <el-option v-for="item in filteredSubCategoryList" :key="item.id" :label="item.name"
                  :value="String(item.id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="productSearchForm.search_key" placeholder="搜索类型" class="w120">
                <el-option label="商品名称" value="name"></el-option>
                <el-option label="商品产地" value="productplace"></el-option>
                <el-option label="简要描述" value="features"></el-option>
                <el-option label="编号" value="id"></el-option>
                <el-option label="供应商编号" value="uid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="productSearchForm.search_val" placeholder="关键词" class="w120"
                @keyup.enter.native="handleProductSearch"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="productSearchForm.price_type" placeholder="全部价格" class="w120" clearable>
                <el-option label="全部价格" value="0"></el-option>
                <el-option label="100" value="100"></el-option>
                <el-option label="150" value="150"></el-option>
                <el-option label="200" value="200"></el-option>
                <el-option label="300" value="300"></el-option>
                <el-option label="400" value="400"></el-option>
                <el-option label="500" value="500"></el-option>
                <el-option label="600" value="600"></el-option>
                <el-option label="700" value="700"></el-option>
                <el-option label="800" value="800"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker v-model="productSearchForm.ks_time" type="date" placeholder="开始时间" class="w120"
                value-format="yyyy-MM-dd" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker v-model="productSearchForm.end_time" type="date" placeholder="结束时间" class="w120"
                value-format="yyyy-MM-dd" clearable></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleProductSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 产品列表 -->
        <el-card class="search-card mt20">
          <div class="product-list" v-loading="productLoading">
            <div v-if="productList.length === 0 && !productLoading"
              style="text-align: center; width: 100%; padding: 20px;">
              暂无产品数据，请点击"查询"按钮
            </div>
            <div class="product-item" v-for="item in productList" :key="item.id"
              :class="{ active: item.selected === 1 }" @click="toggleProductSelect(item)">
              <span class="select-icon"></span>
              <div class="product-content">
                <img :src="item.thumbnailimage" :alt="item.name" class="product-image" />
                <div class="product-title">{{ item.name }}</div>
                <div class="product-price">售价：¥{{ item.price }}</div>
                <div class="product-ghprice">供货价: ¥{{ item.ghprice }}</div>
              </div>
            </div>
          </div>
          <div class="loading-more" v-if="productHasMore">
            <el-button type="success" plain @click="loadMoreProducts" :loading="loadMoreLoading">查看更多</el-button>
          </div>
        </el-card>
      </div>

      <!-- end -->
    </template>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { albumList, addAlbum, getAlbum, editAlbum, delAlbum, fbAlbum, albumFrom, kaceProduct, kcProductPage, kcProductUpdate, kcProductDel } from '@/api/modules/kcard'

export default {
  name: 'CardBookList',
  data() {
    return {
      uploadData: {
        file_url: 'upload/kahao',  // 根据你的上传路径调整
      },
      loading: false,
      submitLoading: false,
      uploadUrl: '/admin.php/kahao/upload',

      searchForm: {
        search_key: 'company',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: ''
      },

      dialogVisible: false,
      dialogTitle: '添加卡册',
      isEdit: false,
      editId: null,

      form: {
        company: '',
        sale: '',
        geshu: '',
        title: '',
        img: '',
        tid: '',
        sh: 1,
        sfqm: 0,
        dhfa: 0,
        num: 1,
        add_time: '',
        end_time: '',
        gonggao: ''
      },

      rules: {
        company: [{ required: true, message: '请输入开卡客户名称', trigger: 'blur' }],
        sale: [{ required: true, message: '请输入销售人', trigger: 'blur' }],
        add_time: [{ required: true, message: '请选择制卡时间', trigger: 'change' }],
        end_time: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        tid: [{ required: true, message: '请选择页面形式', trigger: 'change' }]
      },

      albumFromList: [],
      multipleSelection: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // ===== 关联产品相关数据 =====
      addBox: true,           // 控制列表/产品视图切换
      currentKid: null,       // 当前卡册ID

      productSearchForm: {
        class1: '',
        class2: '',
        search_key: 'name',
        search_val: '',
        price_type: '0'
      },

      categoryList: [],       // 一级分类
      subCategoryList: [],    // 二级分类（全部）
      filteredSubCategoryList: [], // 根据一级分类筛选的二级分类
      productList: [],        // 产品列表
      selectedProducts: [],   // 已选产品

      productPage: 1,
      productPageSize: 30,
      productTotal: 0,
      productLastPage: 1,
      productHasMore: false,
      productLoading: false,
      loadMoreLoading: false
      //end关联产品相
    }
  },

  filters: {
    formatDateTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  },

  mounted() {
    this.getAlbumList()
    this.getAlbumFromList()
    //  ：检查是否需要自动打开编辑弹窗
    this.checkAutoEdit()
  },

  methods: {
    oneClick(){
       window.open('http://yxfmm.bjyxfl.com/exchange/')
    },
    moreClick(){
       window.open('http://yxfmm.bjyxfl.com/exchange2/')

    },
    checkAutoEdit() {
      const editId = this.$route.query.editId
      if (editId) {
        // 清除 query 参数，防止刷新重复触发
        this.$router.replace({ query: {} })

        // 调用编辑方法（需要构造一个包含 id 的 row 对象）
        this.handleEdit({ id: editId })
      }
    },
    async customUpload(options) {
      const { file } = options

      // 生成签名参数
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/kahao')  // 根据你的上传路径调整
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
          this.form.img = response.data.data
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
            this.form.img = data.data
            this.$message.success('上传成功')
            return
          }
        }

        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 修改上传前校验
    beforeBannerUpload(file) {
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
    async getAlbumList() {
      this.loading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        if (this.searchForm.sh !== '') {
          params.sh = this.searchForm.sh
        }

        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await albumList(params)
        if (res.code === 200) {
          const listData = res.data.list || res.data
          // 处理数据，添加模板名称
          const dataList = (listData.data || []).map(item => {
            const template = this.albumFromList.find(t => t.id === item.tid)
            return {
              ...item,
              tid_name: template ? template.title : ''
            }
          })
          this.tableData = dataList
          this.total = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
        console.error('获取卡册列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async getAlbumFromList() {
      try {
        const res = await albumFrom()
        if (res.code === 200) {
          this.albumFromList = res.data || []
          // 重新处理表格数据的模板名称
          this.tableData = this.tableData.map(item => {
            const template = this.albumFromList.find(t => t.id === item.tid)
            return { ...item, tid_name: template ? template.title : '' }
          })
        }
      } catch (error) {
        console.error('获取页面形式失败:', error)
      }
    },

    handleSearch() {
      this.currentPage = 1
      this.getAlbumList()
    },

    addAlbum() {
      this.dialogTitle = '添加卡册'
      this.isEdit = false
      this.editId = null
      this.resetForm()
      this.dialogVisible = true
    },

    async handleEdit(row) {
      this.dialogTitle = '修改卡册'
      this.isEdit = true
      this.editId = row.id

      try {
        const res = await getAlbum({ id: row.id.toString() })
        if (res.code === 200) {
          const data = res.data
          this.form = {
            company: data.company || '',
            sale: data.sale || '',
            geshu: data.geshu || '',
            title: data.title || '',
            img: data.img || '',
            tid: data.tid || '',
            sh: data.sh !== undefined ? data.sh : 1,
            sfqm: data.sfqm !== undefined ? data.sfqm : 0,
            dhfa: data.dhfa !== undefined ? data.dhfa : 0,
            num: data.num || 1,
            add_time: data.add_time ? this.timestampToDateTime(data.add_time) : '',
            end_time: data.end_time ? this.timestampToDateTime(data.end_time) : '',
            gonggao: data.gonggao || ''
          }
          this.dialogVisible = true
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        this.$message.error('获取详情失败')
        console.error('获取详情失败:', error)
      }
    },

    submitAlbum() {
      this.$refs.albumForm.validate(async (valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          const params = { ...this.form }

          let res
          if (this.isEdit) {
            params.id = this.editId
            res = await editAlbum(params)
          } else {
            res = await addAlbum(params)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || '保存成功')
            this.dialogVisible = false
            this.getAlbumList()
          } else {
            this.$message.error(res.msg || '保存失败')
          }
        } catch (error) {
          this.$message.error('保存失败')
          console.error('保存失败:', error)
        } finally {
          this.submitLoading = false
        }
      })
    },

    async togglePublish(row) {
      this.$confirm(`确认${row.sh === 1 ? '取消发布' : '发布'}该卡册吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await fbAlbum({ id: row.id.toString() })
          if (res.code === 200) {
            row.sh = res.data.sh
            this.$message.success('状态修改成功')
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
          console.error('发布操作失败:', error)
        }
      }).catch(() => { })
    },

    handleDelete(row) {
      this.$confirm(`确认删除该卡册吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delAlbum({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            if (this.tableData.length === 1 && this.currentPage > 1) {
              this.currentPage--
            }
            this.getAlbumList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
          console.error('删除失败:', error)
        }
      }).catch(() => { })
    },

    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delAlbum({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getAlbumList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
          console.error('批量删除失败:', error)
        }
      }).catch(() => { })
    },



    beforeBannerUpload(file) {
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

    getProductCount(pid) {
      if (!pid) return 0
      // pid格式: "121568+130714+130707+"
      const pids = pid.split('+').filter(id => id)
      return pids.length
    },

    cardNum(row) {
      this.$router.push({
        name: 'CardbookNum',
        params: { id: row.id }
      })
    },

    goToProduct(row) {
      this.currentKid = row.id
      this.addBox = false
      this.initProductData()
    },
    goToProductnew(row) {
      this.$router.push({
        name: 'ClassFiynew',
        params: { id: row.id }
      })
    },

    handleClose() {
      this.dialogVisible = false
      this.resetForm()
    },

    resetForm() {
      this.form = {
        company: '',
        sale: '',
        geshu: '',
        title: '',
        img: '',
        tid: '',
        sh: 1,
        sfqm: 0,
        dhfa: 0,
        num: 1,
        add_time: '',
        end_time: '',
        gonggao: ''
      }
      this.$nextTick(() => {
        if (this.$refs.albumForm) {
          this.$refs.albumForm.clearValidate()
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getAlbumList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getAlbumList()
    },

    timestampToDateTime(timestamp) {
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
    // ========== 新增：关联产品相关方法 ==========

    // 返回列表
    backGo() {
      this.addBox = true
      this.currentKid = null
      this.selectedProducts = []
      this.productList = []
    },

    // 初始化产品数据
    // 初始化产品数据
    async initProductData() {
      // 重置筛选
      this.productSearchForm = {
        class1: '',
        class2: '',
        search_key: 'name',
        search_val: '',
        price_type: '0'
      }
      this.productPage = 1
      this.productList = []
      this.selectedProducts = []

      try {
        const res = await kaceProduct({ kid: this.currentKid })
        if (res.code === 200) {
          const data = res.data

          // 已选产品
          this.selectedProducts = (data.product_list || []).map(item => ({
            id: item.id,
            name: item.name,
            thumbnailimage: item.thumbnailimage,
            price: item.price,
            ghprice: item.ghprice
          }))

          // 分类数据
          this.categoryList = data.list_fenlei_fu || []
          this.subCategoryList = data.list_fenlei || []
          this.filteredSubCategoryList = data.list_fenlei || []

          // ✅ 新增：初始化完成后自动加载产品列表
          this.loadProducts()
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('初始化失败:', error)
        this.$message.error('网络错误')
      }
    },

    // 一级分类改变
    handleClass1Change(val) {
      this.productSearchForm.class2 = ''
      if (val) {
        this.filteredSubCategoryList = this.subCategoryList.filter(
          item => String(item.pid) === val
        )
      } else {
        this.filteredSubCategoryList = this.subCategoryList
      }
      this.handleProductSearch()
    },

    // 产品搜索
    handleProductSearch() {
      this.productPage = 1
      this.productList = []
      this.loadProducts()
    },

    // 加载产品
    // 加载产品
    async loadProducts(isLoadMore = false) {
      if (this.productLoading || this.loadMoreLoading) return

      if (isLoadMore) {
        this.loadMoreLoading = true
      } else {
        this.productLoading = true
      }

      try {
        const ids = this.selectedProducts.map(item => item.id).join('+') +
          (this.selectedProducts.length > 0 ? '+' : '')

        const params = {
          kid: this.currentKid,
          ids: ids,
          page: this.productPage,
          limit: this.productPageSize  // ✅ 加上 limit 参数
        }

        if (this.productSearchForm.class1) params.class1 = this.productSearchForm.class1
        if (this.productSearchForm.class2) params.class2 = this.productSearchForm.class2
        if (this.productSearchForm.search_val) {
          params.search_key = this.productSearchForm.search_key
          params.search_val = this.productSearchForm.search_val
        }
        if (this.productSearchForm.price_type && this.productSearchForm.price_type !== '0') {
          params.price_type = this.productSearchForm.price_type
        }

        const res = await kcProductPage(params)

        if (res.code === 200) {
          const productData = res.data.product
          const list = productData.data || []

          if (isLoadMore) {
            this.productList = [...this.productList, ...list]
          } else {
            this.productList = list
          }

          this.productTotal = productData.total || 0
          this.productLastPage = productData.last_page || 1
          this.productHasMore = this.productPage < this.productLastPage
        } else {
          this.$message.error(res.msg || '加载失败')
        }
      } catch (error) {
        console.error('加载产品失败:', error)
        this.$message.error('加载失败')
      } finally {
        this.productLoading = false
        this.loadMoreLoading = false
      }
    },

    // 加载更多
    loadMoreProducts() {
      if (!this.productHasMore) return
      this.productPage++
      this.loadProducts(true)
    },

    // 切换产品选中
    async toggleProductSelect(item) {
      const isSelected = item.selected === 1

      try {
        if (isSelected) {
          const res = await kcProductDel({ kid: this.currentKid, gid: String(item.id) })
          if (res.code === 200) {
            item.selected = 0
            const index = this.selectedProducts.findIndex(p => p.id === item.id)
            if (index > -1) this.selectedProducts.splice(index, 1)
            this.$message.success('取消成功')
          } else {
            this.$message.error(res.msg || '取消失败')
          }
        } else {
          const res = await kcProductUpdate({ kid: this.currentKid, gid: String(item.id) })
          if (res.code === 200) {
            item.selected = 1
            this.selectedProducts.push({
              id: item.id,
              name: item.name,
              thumbnailimage: item.thumbnailimage,
              price: item.price,
              ghprice: item.ghprice
            })
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.msg || '添加失败')
          }
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败')
      }
    },

    // 从已选区删除
    async removeSelected(index, item) {
      try {
        const res = await kcProductDel({ kid: this.currentKid, gid: String(item.id) })
        if (res.code === 200) {
          this.selectedProducts.splice(index, 1)
          const productItem = this.productList.find(p => p.id === item.id)
          if (productItem) productItem.selected = 0
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        this.$message.error('删除失败')
      }
    }

  },

  computed: {
    CardBookList() {
      return this.$route.path === '/card-book/list'
    }
  }
}
</script>

<style>
.cardbookList .newMb0 .el-form-item {
  margin-bottom: 0px;
}

.cardbookList .serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.cardbookList .serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.cardbookList .serchForm .el-card__body {
  text-align: left;
}
</style>

<style scoped>
.cardbookList .formsTop .search-form :deep(.el-form-item) {
  margin-bottom: 0;


}


.cardbookList {
  .avatar-uploader {
    :deep(.el-upload) {

      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }


    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      font-size: 20px;
      color: #8c939d;
      width: 100px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 60px;
      display: block;
      object-fit: contain;
    }
  }
}




/* ===== 新增：产品列表样式 ===== */

.selected-title {
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}

.selected-count {
  color: #f56c6c;
  font-weight: bold;
}

/* 产品列表通用样式 */
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

      .product-price,
      .product-ghprice {
        margin-top: 2px;
        font-size: 12px;
        text-align: left;
        color: #666;
      }
    }
  }
}

/* 已选产品列表样式 */
.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  max-height: 340px;
  overflow-y: auto;
  padding: 5px;

  .product-item.selected {
    width: 100px;
    border-radius: 6px;
    border: 2px solid #409EFF;

    .delete-icon {
      position: absolute;
      top: -6px;
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

      .product-price {
        font-size: 10px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
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
</style>