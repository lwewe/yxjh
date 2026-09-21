<template>
  <div class="list-containerclass">
    <el-card class="search-card serchForm">
      <span class="sizeCl6">客户名称：</span> {{ shows.company || '' }}
    </el-card>
    <!-- 分类列表 -->
    <el-card class="search-card" v-if="addBox">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
          @click="batchDelete()">批量删除</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">添加合卡分类</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border v-loading="loading"
        @selection-change="handleSelectionChange" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" @blur="handlePxChange(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="150" align="left">
          <template slot-scope="scope">{{ scope.row.title }}

            <span v-if="scope.row.flag === 0" class="blueCl">[节日慰问(档位)]</span>
            <span v-if="scope.row.flag === 1" class="blueCl">[产品分类(单品)]</span>

          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="170" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
              @change="handleFbClassify(scope.row)"></el-switch>
          </template>
        </el-table-column> -->

        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" active-text=" " inactive-text=" "
              @change="handleFbClassify(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="权限" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.flag === 0 ? '节日慰问' : '产品分类' }}</template>
        </el-table-column> -->
        <el-table-column label="操作" min-width="260" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="addBoxs(scope.row.id)">关联产品</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="isEdit ? '修改合卡分类' : '添加合卡分类'" :visible.sync="dialogVisible" width="50%" @close="resetForm">
      <el-form :model="categoryForm" :rules="rules" ref="formRef" label-width="120px"
        style="width: 90%;text-align: left;">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="categoryForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="px">
          <el-input v-model.number="categoryForm.px" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="flag">
          <el-select v-model="categoryForm.flag" placeholder="请选择权限" @change="onFlagChange">
            <el-option label="节日慰问(档位)" :value="0"></el-option>
            <el-option label="产品分类(单品-适用模板二)" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类：" prop="cpfl" v-if="categoryForm.flag === 1">
          <el-checkbox-group v-model="cpflArray">
            <el-checkbox v-for="item in productCategoryList" :key="item.id" :label="item.id">{{ item.name
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否发布：">
          <el-radio-group v-model="categoryForm.sh">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="添加时间：" prop="add_time">
          <el-date-picker v-model="categoryForm.add_time" type="datetime" placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block;text-align: center;">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
      </span>
    </el-dialog>

    <!-- 关联产品页 -->
    <div v-if="!addBox">
      <el-card class="search-card mb16" v-if="selectedProducts.length > 0">

        <div class="dflex al-center mb20">
          <el-select v-model="currentHeKaId" placeholder="请选择方案" @change="switchHeKa" style="width:200px;">
            <el-option v-for="item in hekaList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
          <div class="selected-title ml10">已精选 <span class="selected-count">{{ selectedProducts.length }}</span> 款产品
          </div>
        </div>

        <div class="selected-list">
          <div class="product-item selected" v-for="(item, index) in selectedProducts" :key="item.id">
            <span class="delete-icon" @click="removeSelected(index)">×</span>
            <div class="product-content">
              <img :src="item.thumbnailimage || item.image" class="product-image w70">
              <div class="product-info">
                <div class="product-title">{{ item.name }}</div>
                <div class="product-price">¥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="submit-area">
          <el-button type="success" size="small" @click="backGo()">返回</el-button>
        </div>
      </el-card>

      <el-card class="search-card">
        <div class="filter-area serchForm">
          <el-form :inline="true" class="search-form" style='text-align: left;'>
            <el-form-item label="">
              <el-select v-model="filterForm.class1" placeholder="一级分类" clearable @change="handleClass1Change"
                style="width:130px;">
                <el-option v-for="item in fenleiFuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="filterForm.class2" placeholder="二级分类" clearable style="width:130px;">
                <el-option v-for="item in fenleiZiList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="filterForm.search_key" placeholder="搜索字段" style="width:120px;">
                <el-option label="商品名称" value="name"></el-option>
                <el-option label="商品产地" value="productplace"></el-option>
                <el-option label="简要描述" value="features"></el-option>
                <el-option label="编号" value="id"></el-option>
                <el-option label="供应商编号" value="uid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="filterForm.search_val" placeholder="关键词" size="small" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="filterForm.price_type" placeholder="价格" clearable style="width:110px;">
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
              <el-date-picker v-model="filterForm.ks_time" type="date" placeholder="开始时间" value-format="yyyy-MM-dd"
                style="width:130px;"></el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker v-model="filterForm.end_time" type="date" placeholder="结束时间" value-format="yyyy-MM-dd"
                style="width:130px;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchProducts">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="product-list" v-loading="productLoading">
          <div class="product-item" v-for="item in productList" :key="item.id" :class="{ 'active': item.selected == 1 }"
            @click="toggleSelect(item)">
            <span class="select-icon"></span>
            <div class="product-content">
              <img :src="item.thumbnailimage || item.image" class="product-image">
              <div class="product-title">{{ item.name }}</div>
              <div class="product-price">¥{{ item.price }}</div>
            </div>
          </div>
          <div v-if="productList.length === 0 && !productLoading" style="text-align:center;padding:20px;">暂无数据</div>
        </div>
        <div class="pagination" style="text-align:right;margin-top:20px;">
          <el-pagination background @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { classifyList, addClassify, editClassify, delClassify, getClassify, pxClassify, fbClassify, classifyProduct, cardClassifyProductPage, cardClassifyUpdate, cardClassifyDel, productFenLen } from '@/api/modules/card'

export default {
  name: 'ClassFiy',
  data() {
    return {
      shows: "", statusChanging: false,  // 新增：防止重复点击
      hekaList: [],       // 新增
      currentHeKaId: '',  // 新增
      kid: '',
      loading: false, submitLoading: false, isEdit: false, editId: '',
      dialogVisible: false, addBox: true,
      categoryForm: { title: '', px: '', flag: 0, sh: 1, add_time: '' },
      cpflArray: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      },
      tableData: [], multipleSelection: [],

      // 关联产品
      currentCategoryId: null,
      selectedProducts: [],
      productList: [],
      productLoading: false,
      currentPage: 1, pageSize: 30, total: 0,
      filterForm: {
        class1: '', class2: '', search_key: 'name', search_val: '',
        price_type: '', ks_time: '', end_time: ''
      },
      fenleiFuList: [],   // 一级分类
      fenleiZiList: [],   // 二级分类

      productCategoryList: [
        { id: 1, name: '休闲零食' }, { id: 2, name: '粮油副食' }, { id: 3, name: '乳饮调冲' },
        { id: 4, name: '清洁护理' }, { id: 6, name: '水果' }, { id: 7, name: '生鲜水产' },
        { id: 8, name: '肉禽蛋品' }, { id: 10, name: '厨房用具' }, { id: 11, name: '母婴用品' },
        { id: 12, name: '家居家纺' }, { id: 13, name: '家电数码' }, { id: 14, name: '美妆护肤' },
        { id: 15, name: '箱包配饰' }, { id: 16, name: '运动户外' }, { id: 17, name: '汽车用品' }
      ]
    }
  },
  mounted() {
    this.kid = this.$route.params.id || ''
    this.getList()
  },
  methods: {
    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0')
    },
    getCurrentTime() {
      const d = new Date()
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0')
    },

    // ========== 列表 ==========
    async getList() {
      this.loading = true
      try {
        const res = await classifyList({ kid: this.kid })
        if (res.code === 200) {
          this.tableData = res.data.list || []

          this.shows = res.data.show
        }
      } catch (e) { this.$message.error('请求失败') }
      finally { this.loading = false }
    },

    // async handleFbClassify(row) {
    //   try {
    //     const res = await fbClassify({ id: row.id })
    //     if (res.code === 200) { row.sh = res.data.sh; this.$message.success(res.msg) }
    //   } catch (e) { this.getList() }
    // },
    // 修改发布状态（带确认框）
    async handleFbClassify(row) {
      const targetStatus = row.sh ? 1 : 0
      const actionText = targetStatus === 1 ? '发布' : '下架'

      try {
        await this.$confirm(`确认${actionText}该合卡分类吗？`, '提示', {
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
        const res = await fbClassify({ id: row.id })
        if (res.code === 200) {
          row.sh = res.data.sh
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换发布状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    async handlePxChange(row) {
      try {
        await pxClassify({ id: row.id, px: row.px })
        this.$message.success('排序修改成功')
      } catch (e) { this.$message.error('修改失败') }
    },

    openAddDialog() {
      this.isEdit = false; this.editId = ''
      this.categoryForm = { title: '', px: '', flag: 0, sh: 1, add_time: this.getCurrentTime() }
      this.cpflArray = []; this.dialogVisible = true
      this.$nextTick(() => { if (this.$refs.formRef) this.$refs.formRef.clearValidate() })
    },

    async openEditDialog(row) {
      this.isEdit = true; this.editId = row.id
      try {
        const res = await getClassify({ id: row.id })
        if (res.code === 200) {
          const d = res.data
          this.categoryForm = { title: d.title, px: d.px, flag: d.flag, sh: d.sh, add_time: d.add_time ? this.formatTime(d.add_time) : this.getCurrentTime() }
          this.cpflArray = d.cpfl ? d.cpfl.split(',').filter(Boolean).map(Number) : []
        }
      } catch (e) { this.$message.error('获取详情失败') }
      this.dialogVisible = true
    },

    submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        if (this.categoryForm.flag === 1 && this.cpflArray.length === 0) {
          this.$message.warning('请选择产品分类'); return
        }
        this.submitLoading = true
        try {
          const params = {
            kid: this.kid, title: this.categoryForm.title, px: String(this.categoryForm.px),
            flag: String(this.categoryForm.flag), sh: String(this.categoryForm.sh),
            add_time: this.categoryForm.add_time,
            cpfl: this.categoryForm.flag === 1 ? this.cpflArray.join(',') : ''
          }
          if (this.isEdit) params.id = this.editId
          const api = this.isEdit ? editClassify : addClassify
          const res = await api(params)
          if (res.code === 200) { this.$message.success(res.msg); this.dialogVisible = false; this.getList() }
          else { this.$message.error(res.msg || '操作失败') }
        } catch (e) { this.$message.error('请求失败') }
        finally { this.submitLoading = false }
      })
    },

    onFlagChange(val) { if (val === 0) this.cpflArray = [] },
    resetForm() { this.categoryForm = { title: '', px: '', flag: 0, sh: 1, add_time: '' }; this.cpflArray = [] },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除吗？', '提示', { type: 'warning' })
        const res = await delClassify({ ids: row.id.toString() })
        if (res.code === 200) { this.$message.success(res.msg); this.getList() }
      } catch (e) { }
    },
    async batchDelete() {
      if (!this.multipleSelection.length) return this.$message.warning('请先选择')
      try {
        await this.$confirm('确认删除吗？', '提示', { type: 'warning' })
        const ids = this.multipleSelection.map(i => i.id).join(',')
        const res = await delClassify({ ids })
        if (res.code === 200) { this.$message.success(res.msg); this.getList() }
      } catch (e) { }
    },
    async switchHeKa(id) {
      this.currentHeKaId = id
      this.currentCategoryId = id
      this.currentPage = 1
      this.filterForm = { class1: '', class2: '', search_key: 'name', search_val: '', price_type: '', ks_time: '', end_time: '' }
      this.fenleiZiList = []
      try {
        const res = await classifyProduct({ id, kid: this.kid })
        if (res.code === 200) {
          const d = res.data
          this.fenleiFuList = d.list_fenlei_fu || []
          this.selectedProducts = (d.product_list || []).map(item => ({
            id: item.id, name: item.name, thumbnailimage: item.thumbnailimage || '',
            image: item.thumbnailimage || '', price: item.price || ''
          }))
          // 设置默认一级分类
          if (this.fenleiFuList.length > 0) {
            this.filterForm.class1 = this.fenleiFuList[0].id
          }
        }
      } catch (e) { }
      this.loadProducts()
    },
    handleSelectionChange(val) { this.multipleSelection = val },

    // ========== 关联产品 ==========
    backGo() { this.addBox = true; this.selectedProducts = []; this.fenleiZiList = []; this.getList() },

    async addBoxs(classifyId) {
      this.currentCategoryId = classifyId
      this.addBox = false
      this.filterForm = { class1: '', class2: '', search_key: 'name', search_val: '', price_type: '', ks_time: '', end_time: '' }
      this.fenleiZiList = []
      this.currentPage = 1

      try {
        const res = await classifyProduct({ id: classifyId, kid: this.kid })
        if (res.code === 200) {
          const d = res.data
          this.fenleiFuList = d.list_fenlei_fu || []
          this.hekaList = d.heka_list || []
          this.currentHeKaId = d.heka ? d.heka.id : ''
          this.selectedProducts = (d.product_list || []).map(item => ({
            id: item.id, name: item.name, thumbnailimage: item.thumbnailimage || '',
            image: item.thumbnailimage || '', price: item.price || ''
          }))
          // 设置默认一级分类（取第一个）
          if (this.fenleiFuList.length > 0) {
            this.filterForm.class1 = this.fenleiFuList[0].id
          }
        }
      } catch (e) { }
      this.loadProducts()
    },

    // 一级分类切换 → 加载二级分类
    async handleClass1Change(val) {
      this.filterForm.class2 = ''
      this.fenleiZiList = []
      if (!val) return
      try {
        const res = await productFenLen({ pid: val })
        if (res.code === 200) {
          this.fenleiZiList = res.data.list || []
        }
      } catch (e) { }
    },

    // 加载产品列表
    async loadProducts() {
      this.productLoading = true
      try {
        const selectedIds = this.selectedProducts.map(p => p.id).join(',')
        const params = {
          id: this.currentCategoryId,
          ids: selectedIds,
          class1: this.filterForm.class1 || '',
          class2: this.filterForm.class2 || '',
          search_key: this.filterForm.search_key || 'name',
          search_val: this.filterForm.search_val || '',
          price_type: this.filterForm.price_type || '',
          ks_time: this.filterForm.ks_time || '',
          end_time: this.filterForm.end_time || '',
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await cardClassifyProductPage(params)
        if (res.code === 200) {
          const productData = res.data.product || res.data
          this.productList = productData.data || []
          this.total = productData.total || 0
        }
      } catch (e) { }
      finally { this.productLoading = false }
    },

    searchProducts() { this.currentPage = 1; this.loadProducts() },
    handlePageChange(val) { this.currentPage = val; this.loadProducts() },

    // 切换选中
    async toggleSelect(item) {
      if (item.selected == 1) {
        // 取消选中
        try {
          const res = await cardClassifyDel({ id: this.currentCategoryId, gid: item.id })
          if (res.code === 200) {
            this.selectedProducts = this.selectedProducts.filter(p => p.id !== item.id)
            item.selected = 0
          }
        } catch (e) { }
      } else {
        // 选中
        try {
          const res = await cardClassifyUpdate({ id: this.currentCategoryId, gid: item.id })
          if (res.code === 200) {
            this.selectedProducts.push({
              id: item.id, name: item.name,
              thumbnailimage: item.thumbnailimage, image: item.thumbnailimage,
              price: item.price
            })
            item.selected = 1

            this.$message.success(res.msg)
          }
        } catch (e) { }
      }
    },

    // 从已选列表移除
    async removeSelected(index) {
      const item = this.selectedProducts[index]
      try {
        const res = await cardClassifyDel({ id: this.currentCategoryId, gid: item.id })
        if (res.code === 200) {
          this.selectedProducts.splice(index, 1)
          // 同步更新产品列表的选中状态
          const p = this.productList.find(p => p.id === item.id)
          if (p) p.selected = 0

          this.$message.success(res.msg)

        }
      } catch (e) { }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-containerclass {
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.mb16 {
  margin-bottom: 16px;
}

.selected-title {
  // margin-bottom: 15px;
  font-size: 14px;
}

.selected-count {
  color: #f56c6c;
  font-weight: bold;
}

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
    border: 2px solid #eee;
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

      .product-price {
        margin-top: 2px;
        font-size: 12px;
        text-align: left;
        color: #666;
      }
    }
  }
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  max-height: 340px;
  overflow-y: auto;
  padding: 5px 20px 0 0px;

  .product-item.selected {
    position: relative;
    width: 100px;
    border-radius: 6px;
    border: 2px solid #409EFF;

    .delete-icon {
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

      &:hover {
        background: #f78989;
      }
    }

    .product-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
    }

    .product-image.w70 {
      width: 76px;
      height: 76px;
    }

    .product-title {
      font-size: 11px;
      line-height: 1.3;
      height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-price {
      font-size: 10px;
    }
  }
}

.submit-area {
  text-align: center;
}

.w70 {
  width: 70px !important;
  height: 70px !important;
}
</style>