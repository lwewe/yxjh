<template>
  <div class="list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card serchForm" v-if="addBox">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <el-form-item label="">
          <el-select v-model="searchForm.pid" placeholder="位置" class="w120" clearable>
            <el-option label="首页分类图" :value="1"></el-option>
            <el-option label="首页小图" :value="2"></el-option>
            <el-option label="首页分类" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120" clearable>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" v-if="addBox">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" label-position="right"
        style="text-align: left; width: 90%;">
        <el-form-item label="位置" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择位置" style="width: 100%;">
            <el-option label="首页分类图" :value="1"></el-option>
            <el-option label="首页小图" :value="2"></el-option>
            <el-option label="首页分类" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="小标题" prop="xtitle">
          <el-input v-model="form.xtitle" placeholder="请输入小标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="px">
          <el-input v-model="form.px"></el-input>
          <span class="tips">填写整数，值越大，越靠前</span>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-upload class="upload-demo" action="#" :file-list="fileListImg" :http-request="customImageUpload"
            list-type="picture-card" :limit="1" :on-preview="handlePictureCardPreview" :on-remove="handleImgRemove"
            :disabled="uploadLoading">
            <i v-if="!uploadLoading" class="el-icon-plus"></i>
            <i v-else class="el-icon-loading"></i>
          </el-upload>
          <div class="upload-tip" v-if="form.pid === 1">尺寸：建议 750*240，大小：1M以内</div>
          <div class="upload-tip" v-else-if="form.pid === 2">尺寸：建议 351*571，大小：1M以内</div>
          <div class="upload-tip" v-else>尺寸：建议 100*100，大小：1M以内</div>
        </el-form-item>
        <el-form-item label="发布状态" prop="sh">
          <el-radio-group v-model="form.sh">
            <el-radio :label="1">即时发布</el-radio>
            <el-radio :label="0">暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" prop="add_time">
          <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择发布时间"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="new Date()" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible2" width="50%">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 列表与操作栏 -->
    <el-card class="search-card" v-if="addBox">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加首页分类</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 0">批量删除</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column label="编号" min-width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="排序" min-width="190" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" style='width: 80px;'
              @change="(val) => updatePx(scope.row.id, val)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="图片" min-width="190" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.img" :src="scope.row.img" style="width: 60px; height: 60px; object-fit: cover;">
            <span v-else class="no-image">无图片</span>
          </template>
        </el-table-column>

        <el-table-column label="标题" min-width="200" align="left">
          <template slot-scope="scope">
            {{ scope.row.title }}
            <span v-if="scope.row.xtitle" class="xtitle">({{ scope.row.xtitle }})</span>
            <span class="blueCl">[{{ getPidName(scope.row.pid) }}]</span>
          </template>
        </el-table-column>

        <el-table-column label="添加时间" min-width="180" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
              @change="(val) => updateStatus(scope.row.id, val)"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" active-text=" " inactive-text=" "
              @change="(val) => updateStatus(scope.row.id, val)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="280" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="mini" v-if="scope.row.flag === 1" type="success"
              @click="addBoxs(scope.row.id)">产品</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 关联产品卡片 -->
    <div v-if="!addBox">
      <!-- 已选中的产品区域 -->
      <el-card class="search-card mb16" v-if="productList.length > 0">
        <div class="selected-title">
          已精选 <span class="selected-count">{{ productTotal }}</span> 款产品
          <span class="class-info" v-if="currentClassInfo.title">
            （分类：{{ currentClassInfo.title }} {{ currentClassInfo.xtitle ? '-' + currentClassInfo.xtitle : '' }}）
          </span>
        </div>
        <div class="selected-list">
          <div class="product-item selected" v-for="(item, index) in productList" :key="item.id">
            <span class="delete-icon" @click="removeFromRelated(item.id, index)">×</span>
            <div class="product-content">
              <img :src="item.imageurl" :alt="item.bookname" class="product-image">
              <div class="product-info">
                <div class="product-title">{{ item.bookname }}</div>
                
                <el-tooltip 
  :content="'原价: ¥' + item.price + ' / 售价: ¥' + item.jiage + ' / 协议价: ¥' + item.soldprice" 
  placement="top"
  :disabled="false">
  <div class="product-price">原价: ¥{{ item.price }} / 售价: ¥{{ item.jiage }} / 协议价: ¥{{ item.soldprice }}</div>
</el-tooltip>
                <!-- <div class="product-price">原价: ¥{{ item.price }} / 售价: ¥{{ item.jiage }} / 协议价: ¥{{ item.soldprice }}
                </div> -->
                <div class="product-stock">库存: {{ item.stocknum }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="submit-area">
          <el-button type="success" size="small" @click="backGo">返回</el-button>
        </div>
      </el-card>

      <!-- 产品搜索和列表 -->
      <el-card class="search-card">
        <div class="filter-area" style="text-align: left; margin-bottom: 20px;">
          <el-form :inline="true">
            <el-form-item label="">
              <el-select v-model="searchCatflag" placeholder="请选择分类" clearable filterable @change="handleCatflagChange"
                style="width: 200px;">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.catname"
                  :value="item.catflag"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="searchKeyword" placeholder="请输入图书名称" clearable
                @keyup.enter.native="handleSearchKeywordChange" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchProducts">查询</el-button>
              <!-- <el-button @click="resetProductSearch">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>

        <div class="product-list" v-loading="productLoading">
          <div v-if="searchProductList.length === 0 && !productLoading" style="text-align: center; padding: 20px;">
            暂无数据
          </div>
          <div class="product-item" v-for="item in searchProductList" :key="item.id"
            :class="{ 'active': item.selected === 1 }" @click="toggleProductSelect(item)">
            <span class="select-icon"></span>
            <div class="product-content">
              <img :src="item.imageurl" :alt="item.bookname" class="product-image">
              <div class="product-title">{{ item.bookname }}</div>
              <div class="product-price">原价: ¥{{ item.price }} / 售价: ¥{{ item.jiage }} / 协议价: ¥{{ item.soldprice }}
              </div>
              <div class="product-stock">库存: {{ item.stocknum }}</div>
              <!-- <div class="product-type" :class="item.selected === 1 ? 'selected' : ''">
                {{ item.selected === 1 ? '已关联' : '未关联' }}
              </div> -->
            </div>
          </div>
        </div>

        <div class="loading-more" v-if="hasMore && searchProductList.length > 0">
          <el-button type="primary" plain @click="loadMoreProducts" :loading="productLoading">加载更多</el-button>
        </div>


      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  booksTsclassList,
  booksAddTsclass,
  booksGetTsclass,
  booksEditTsclass,
  booksDelTsclass,
  booksFbTsclass,
  booksTsclassBooksList,
  booksTsclassBooksPage,
  booksTsclassBooksUpdate,
  booksTsclassBooksDelete
} from '@/api/modules/video'

export default {
  name: 'HomeCategoryManage',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      uploadLoading: false,
      fileListImg: [],
      dialogVisible2: false,
      dialogImageUrl: '',
      // 关联产品相关
      currentClassId: null,
      currentClassInfo: {},
      productList: [],
      productTotal: 0,
      searchProductList: [],
      searchTotal: 0,
      searchPage: 1,
      searchLimit: 30,
      searchCatflag: '',
      searchKeyword: '',
      productLoading: false,
      hasMore: true,
      categoryList: [],
      addBox: true,
      loading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: '添加首页分类',
      isEdit: false,
      editId: null,
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        pid: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      },
      form: {
        pid: 1,
        title: '',
        xtitle: '',
        url: '',
        img: '',
        px: 0,
        sh: 1,
        add_time: ''
      },
      formRules: {
        pid: [{ required: true, message: '请选择位置', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
        add_time: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
      },
      multipleSelection: [],
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取位置名称
    getPidName(pid) {
      const map = { 1: '首页分类图', 2: '首页小图', 3: '首页分类' }
      return map[pid] || ''
    },

    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },

    // 图片移除
    handleImgRemove() {
      this.$confirm('确定删除图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.img = ''
        this.fileListImg = []
        this.$message.success('图片已删除')
      }).catch(() => { })
    },

    // 点击产品关联
    async addBoxs(id) {
      this.currentClassId = id
      this.addBox = false
      await this.getRelatedProducts(id)
    },

    // 获取已关联的产品列表
    async getRelatedProducts(flid) {
      this.productLoading = true
      try {
        const res = await booksTsclassBooksList({ pid: flid })
        if (res.code === 200) {
          this.currentClassInfo = res.data.tsClass || {}
          this.productList = res.data.product_list || []
          this.productTotal = res.data.count || 0
          this.categoryList = res.data.product_fen || []
          await this.searchProducts()
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      } catch (error) {
        console.error('获取关联产品失败:', error)
        this.$message.error('获取失败')
      } finally {
        this.productLoading = false
      }
    },

    // 搜索产品
    async searchProducts(isLoadMore = false) {
      if (!isLoadMore) {
        this.searchPage = 1
        this.searchProductList = []
        this.hasMore = true
      }
      if (!this.hasMore) return

      this.productLoading = true
      try {
        const params = {
          flid: this.currentClassId,
          page: this.searchPage,
          limit: this.searchLimit
        }
        if (this.searchCatflag) params.catflag = this.searchCatflag
        if (this.searchKeyword) params.search_title = this.searchKeyword

        const res = await booksTsclassBooksPage(params)
        if (res.code === 200) {
          const newList = res.data.data || []
          if (isLoadMore) {
            this.searchProductList = [...this.searchProductList, ...newList]
          } else {
            this.searchProductList = newList
          }
          this.searchTotal = res.data.total || 0
          this.hasMore = this.searchProductList.length < this.searchTotal
          this.searchPage++
        } else {
          this.$message.error(res.msg || '搜索失败')
        }
      } catch (error) {
        console.error('搜索产品失败:', error)
        this.$message.error('搜索失败')
      } finally {
        this.productLoading = false
      }
    },

    // 加载更多
    loadMoreProducts() {
      this.searchProducts(true)
    },

    // 切换产品选中状态
    // 切换产品选中状态（直接操作，不需要确认）
    async toggleProductSelect(product) {
      const isSelected = product.selected === 1

      try {
        let res
        if (isSelected) {
          // 删除关联
          res = await booksTsclassBooksDelete({
            flid: this.currentClassId,
            id: product.id
          })
        } else {
          // 添加关联
          res = await booksTsclassBooksUpdate({
            flid: this.currentClassId,
            id: product.id
          })
        }

        if (res.code === 200) {
          this.$message.success(res.msg || (isSelected ? '取消关联成功' : '关联成功'))
          // 刷新已关联列表和当前搜索结果
          await this.getRelatedProducts(this.currentClassId)
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败')
      }
    },

    // 从已关联列表中移除
    // 从已关联列表中移除（直接移除，不需要确认）
    async removeFromRelated(productId, index) {
      try {
        const res = await booksTsclassBooksDelete({
          flid: this.currentClassId,
          id: productId
        })
        if (res.code === 200) {
          this.$message.success('移除成功')
          this.productList.splice(index, 1)
          this.productTotal--
        } else {
          this.$message.error(res.msg || '移除失败')
        }
      } catch (error) {
        console.error('移除失败:', error)
        this.$message.error('移除失败')
      }
    },

    // 返回上一页
    backGo() {
      this.addBox = true
      this.currentClassId = null
      this.currentClassInfo = {}
      this.productList = []
      this.searchProductList = []
      this.searchCatflag = ''
      this.searchKeyword = ''
      this.searchPage = 1
      this.hasMore = true
    },

    // 重置搜索
    resetProductSearch() {
      this.searchCatflag = ''
      this.searchKeyword = ''
      this.searchProducts()
    },

    // 中图法分类变化
    handleCatflagChange() {
      this.searchProducts()
    },

    // 搜索关键词变化
    handleSearchKeywordChange() {
      this.searchProducts()
    },

    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })
        const res = await booksTsclassList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.page = 1
      this.getList()
    },

    resetSearch() {
      this.searchForm = {
        pid: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: ''
      }
      this.page = 1
      this.getList()
    },

    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    addPro() {
      this.dialogTitle = '添加首页分类'
      this.isEdit = false
      this.editId = null
      const now = new Date()
      const formattedTime = this.formatDateTime(now)
      this.form = {
        pid: 1,
        title: '',
        xtitle: '',
        url: '',
        img: '',
        px: 0,
        sh: 1,
        add_time: formattedTime
      }
      this.fileListImg = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    async handleEdit(row) {
      this.dialogTitle = '修改首页分类'
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await booksGetTsclass({ id: row.id })
        if (res.code === 200) {
          const addTime = res.data.add_time
            ? this.formatDateTime(new Date(res.data.add_time * 1000))
            : this.formatDateTime(new Date())

          this.form = {
            pid: res.data.pid,
            title: res.data.title,
            xtitle: res.data.xtitle || '',
            url: res.data.url || '',
            img: res.data.img || '',
            px: res.data.px,
            sh: res.data.sh,
            add_time: addTime
          }
          if (res.data.img) {
            this.fileListImg = [{ name: 'img', url: res.data.img }]
          } else {
            this.fileListImg = []
          }
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.formRef && this.$refs.formRef.clearValidate()
          })
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        this.$message.error('获取详情失败')
      }
    },

    formatDateTime(date) {
      if (!date || isNaN(date.getTime())) {
        return ''
      }
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },

    async submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.submitLoading = true
        try {
          const submitData = { ...this.form }
          if (!submitData.add_time) {
            submitData.add_time = this.formatDateTime(new Date())
          }

          let res
          if (this.isEdit) {
            res = await booksEditTsclass({ id: this.editId, ...submitData })
          } else {
            res = await booksAddTsclass(submitData)
          }
          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    handleDelete(id) {
      this.$confirm('确认删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelTsclass({ ids: id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条分类吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelTsclass({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    async updatePx(id, px) {
      try {
        const res = await booksEditTsclass({ id, px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.getList()
        }
      } catch (error) {
        console.error('排序修改失败:', error)
        this.$message.error('排序修改失败')
        this.getList()
      }
    },

    // async updateStatus(id, sh) {
    //   try {
    //     const res = await booksFbTsclass({ id })
    //     if (res.code === 200) {
    //       this.$message.success('状态修改成功')
    //     } else {
    //       this.$message.error(res.msg || '状态修改失败')
    //       this.getList()
    //     }
    //   } catch (error) {
    //     console.error('状态修改失败:', error)
    //     this.$message.error('状态修改失败')
    //     this.getList()
    //   }
    // },
    // 修改状态（带确认框）
    async updateStatus(id, sh) {
      const targetStatus = sh ? 1 : 0
      const actionText = targetStatus === 1 ? '发布' : '下架'

      try {
        await this.$confirm(`确认将分类${actionText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，恢复原来的状态
        this.getList()
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await booksFbTsclass({ id })
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          // 不需要重新获取列表，因为状态已经在界面上通过 v-model 更新了
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    async customImageUpload(options) {
      const { file } = options

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
      formData.append('file_url', 'upload/tsclass')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const token = localStorage.getItem('token')
        const response = await axios({
          url: '/admin/v1/upload/image',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        })

        loading.close()

        if (response.data.status === 200 && response.data.data) {
          this.form.img = response.data.data
          this.fileListImg = [{ name: 'img', url: response.data.data }]
          this.$message.success('图片上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        loading.close()
        if (error.response?.data?.status === 200 && error.response?.data?.data) {
          this.form.img = error.response.data.data
          this.fileListImg = [{ name: 'img', url: error.response.data.data }]
          this.$message.success('图片上传成功')
        } else {
          console.error('图片上传失败:', error)
          this.$message.error('上传失败，请稍后重试')
        }
      }
    },

    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
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

    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.w120 {
  width: 120px;
}

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

.list-container {
  font-size: 14px;
}

.list-container .search-card {
  margin-bottom: 20px;
}

.list-container .search-card .search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.list-container .pagination {
  margin-top: 20px;
  text-align: right;
}

.upload-demo :deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
  background-color: #ffffff;
}

.upload-demo :deep(.el-icon-loading) {
  font-size: 28px;
  color: #409EFF;
}

.upload-demo :deep(.el-upload-list__item) {
  width: 100px;
  height: 100px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.tips {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.xtitle {
  font-size: 12px;
  color: #999;
}

.no-image {
  color: #999;
  font-size: 12px;
}

.blueCl {
  color: #409EFF;
  font-size: 12px;
  margin-left: 5px;
}

/* 关联产品样式 */
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
  max-height: 340px;
  overflow-y: auto;
  padding: 5px;
}

.product-item.selected {
  width: 100px;
  border-radius: 6px;
  border: 2px solid #409EFF;
  position: relative;
  cursor: pointer;
}

.product-item.selected .delete-icon {
  position: absolute;
  top: -7px;
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

.product-item.selected .delete-icon:hover {
  background: #f78989;
}

.product-item.selected .product-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.product-item.selected .product-image {
  width: 76px;
  height: 76px;
  display: block;
  margin: 0 auto 6px auto;
  object-fit: cover;
}

.product-item.selected .product-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
}

.product-item.selected .product-title {
  font-size: 11px;
  line-height: 1.3;
  height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-item.selected .product-price,
.product-item.selected .product-stock {
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 产品列表样式 */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding-top: 20px;
}

.product-list .product-item {
  position: relative;
  width: 162px;
  cursor: pointer;
  border: 2px solid #eeeeee;
  border-radius: 4px;
  transition: all 0.3s;
}

.product-list .product-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.product-list .product-item.active {
  border-color: #67C23A;
  background-color: #f0f9eb;
}

.product-list .product-item .select-icon {
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

.product-list .product-item.active .select-icon {
  background: #67C23A;
  border-color: #67C23A;
}

.product-list .product-item.active .select-icon::after {
  content: "✓";
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 18px;
}

.product-list .product-item .product-content {
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.product-list .product-item .product-image {
  width: 136px;
  height: 136px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.product-list .product-item .product-title {
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

.product-list .product-item .product-price,
.product-list .product-item .product-stock {
  margin-top: 2px;
  font-size: 12px;
  text-align: left;
  color: #666;
}

.product-list .product-item .product-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;
  display: inline-block;
  margin-top: 4px;
}

.product-list .product-item .product-type.selected {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.loading-more {
  text-align: center;
  padding: 20px;
}

.submit-area {
  text-align: center;
}

.mb16 {
  margin-bottom: 16px;
}
</style>