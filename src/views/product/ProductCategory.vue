<template>
  <div class="list-container cateGorys">
    <template v-if="isProductCategory">
      <el-card class="search-card" v-if="flags">
        <!-- 添加按钮 -->
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加产品分类</el-button>
        </div>
        <el-dialog :title="editingId ? '编辑子栏目' : '添加子栏目'" :visible.sync="dialogVisible" width="50%"
          :before-close="handleDialogClose">
          <div style="width: 80%; margin: auto;">
            <el-form ref="addForm" :model="subForm" :rules="subFormRules" label-width="120px" label-position="right">

              <!-- 编辑模式下隐藏所属栏目 -->
              <el-form-item label="所属栏目：" v-if="!editingId">
                <el-input :value="currentParentRow ? currentParentRow.name : ''" disabled></el-input>
              </el-form-item>

              <!-- 编辑模式下显示所属栏目（只读） -->
              <el-form-item label="所属栏目：" v-if="editingId && currentParentRow">
                <el-input :value="currentParentRow.name" disabled></el-input>
              </el-form-item>

              <el-form-item label="分类名称：" prop="name">
                <el-input v-model="subForm.name" placeholder="请输入分类名称"></el-input>
              </el-form-item>

              <el-form-item label="图片：" prop="tbimg" style="text-align: left;">
                <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customImageUpload"
                  :before-upload="beforeImageUpload">
                  <img v-if="subForm.tbimg" :src="subForm.tbimg" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span class="upload-tips">尺寸：750*240，大小：1M以内</span>
              </el-form-item>

              <el-form-item label="排序：" prop="px" style="text-align: left;">
                <el-input v-model="subForm.px"></el-input>
              </el-form-item>

              <el-form-item label="是否发布：" prop="sh" style="text-align: left;">
                <el-radio-group v-model="subForm.sh">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>

            </el-form>
          </div>
          <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
            <el-button @click="handleDialogClose">取 消</el-button>
            <el-button type="primary" @click="submitSubForm" :loading="subFormLoading">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分类表格 -->
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" row-key="id"
          default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableLoading"
          stripe :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="栏目名称" min-width="400" align="left">
            <template slot-scope="scope">
              <div class="category-name">
                <span v-if="scope.row.level === 1" class="first-level">
                  <i class="el-icon-folder-opened"></i>
                  <strong>{{ scope.row.name }}</strong>
                </span>
                <span v-else class="second-level">
                  <i class="el-icon-document"></i>
                  {{ scope.row.name }}
                </span>
                <!-- 标签 -->
                <span v-if="scope.row.isShop" class="tag tag-blue">[商城分类]</span>
                <span v-if="scope.row.isHome" class="tag tag-green">[首页]</span>
                <span v-if="scope.row.isHot" class="tag tag-green">[热销]</span>
                <span v-if="scope.row.type === 'card'" class="tag tag-purple">{{ scope.row.typeText }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="排序" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.sort }}
            </template>
          </el-table-column>

          <el-table-column label="图标" min-width="100" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.icon" :src="scope.row.icon" style="width: 40px; height: 40px;margin: auto;"
                fit="cover">
                <div slot="error" class="image-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <span v-else class="no-image">无</span>
            </template>
          </el-table-column>

          <el-table-column label="热销图标" min-width="100" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.hotIcon" :src="scope.row.hotIcon"
                style="width: 40px; height: 40px;margin: auto;" fit="cover">
                <div slot="error" class="image-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <span v-else class="no-image">无</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" min-width="80" align="center">
            <template slot-scope="scope">
              <div>

                <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                  @change="(val) => handleStatusChange(scope.row, val)">
                </el-switch>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="490" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              <el-button v-if="scope.row.level === 1" size="mini" type="success"
                @click="AddSub(scope.row)">添加子栏目</el-button>
              <el-button v-if="scope.row.level === 1" size="mini" type="warning"
                @click="brandflg(scope.row)">品牌关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- end -->
      </el-card>



      <el-card class="search-card" v-if="!flags">
        <el-form :inline="true" :model="brandSearchForm" class="search-form" style="text-align: left;">
          <el-form-item label="">
            <el-select v-model="brandSearchForm.search_key" placeholder="搜索字段" class="w120" clearable>
              <el-option label="品牌名称" value="name"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="brandSearchForm.search_val" placeholder="关键词" class="w120"
              @keyup.enter.native="searchBrandList"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="brandSearchForm.px_key" placeholder="排序字段" class="w120" clearable>
              <el-option label="排序" value="px"></el-option>
              <el-option label="首字母" value="initials"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="brandSearchForm.px_val" placeholder="排序方式" class="w100" clearable>
              <el-option label="升序" value="asc"></el-option>
              <el-option label="降序" value="desc"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchBrandList">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="search-card" v-if="!flags">
        <!-- 头部 -->

        <!-- 搜索筛选区域 -->


        <div style="text-align: left;" class="dflex flex-between al-center fs14">
          <div><span class="dangerCl fwb">{{ currentCategoryName }}</span> 分配品牌</div>

        </div>
        <!-- 品牌关联内容 -->

        <div class="brand-association mt10">



          <!-- 全选复选框 -->
          <div style="padding: 10px 0; border-bottom: 1px solid #ebeef5; margin-bottom: 15px;text-align: left;">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
              <span style="font-weight: bold;">全选</span>
            </el-checkbox>
            <span style=" color: #909399; font-size: 12px;">
              (已加载 {{ brandOptions.length }} / 共 {{ brandTotal }} 个品牌)
            </span>
          </div>

          <!-- 品牌复选框组 -->
          <div class="brand-checkbox-group" v-loading="brandLoading">
            <el-checkbox-group v-model="checkedBrands" @change="handleCheckedBrandsChange">
              <div v-for="brand in brandOptions" :key="brand.id" class="brand-checkbox-item"
                :class="{ 'checked-item': checkedBrands.includes(brand.id) }">
                <el-checkbox :label="brand.id">
                  {{ brand.name }}
                </el-checkbox>
              </div>
            </el-checkbox-group>

            <!-- 加载更多 -->
            <div style="text-align: center; padding: 15px;" v-if="brandPage < brandLastPage">
              <el-button type="primary" plain size="small" :loading="brandLoadingMore" @click="loadMoreBrands">加载更多 ({{
                brandOptions.length }} / {{ brandTotal }})</el-button>
            </div>

            <div style="text-align: center; padding: 15px; color: #909399; font-size: 12px;"
              v-else-if="brandOptions.length > 0">
              已加载全部品牌
            </div>
          </div>

          <!-- 已选统计 + 保存 -->
          <div
            style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ebeef5; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <el-button type="primary" @click="saveBrandRelation" :loading="saveLoading">保存关联</el-button>
              <el-button @click="backGo">返回</el-button>
            </div>
            <span style="color: #909399;">
              已选择 <span class="dangerCl fwb">{{ checkedBrands.length }}</span> 个品牌
            </span>

          </div>
        </div>
      </el-card>

    </template>
    <router-view></router-view>

  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  classificationList, delClassificationpro, fbClassificationpro,
  editClassificationpro,  // 编辑分类（状态切换用）
  getClassificationpro,   // 获取分类详情（品牌关联用）
  addClassificationpro,
  relationBrand, saveRelationBrand    // 添加子栏目用
} from '@/api/modules/login'
export default {
  name: 'CategoryList',
  GLOBAL_CONFIG: GLOBAL_CONFIG,
  data() {
    return {
      tableLoading: false,
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '', tm1: '', tm2: ''
      },
      // 补充这些
      currentCategoryName: '',    // 当前品牌关联的分类名
      currentCategoryId: null,    // 当前品牌关联的分类ID  
      saveLoading: false,         // 保存加载状态
      brandLoading: false,        // 品牌加载状态
      subFormLoading: false,      // 子栏目提交加载
      subForm: {                  // 子栏目表单
        name: '',
        tbimg: '',
        px: 0,
        sh: 0
      }, subFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        tbimg: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        px: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      currentParentRow: null,
      brandSearchForm: {
        search_key: 'name',   // 搜索字段 name / id
        search_val: '',        // 搜索关键词
        px_key: 'px',          // 排序字段 px / initials / id
        px_val: 'asc'          // 排序方式 asc / desc
      },
      fileList: [],               // 上传文件列表
      // 品牌搜索关键词
      brandPage: 1,               // 品牌当前页
      brandLimit: 20,             // 品牌每页条数
      brandTotal: 0,              // 品牌总数
      brandLastPage: 0,           // 品牌最后一页
      brandLoadingMore: false,    // 品牌加载更多状态
      dialogVisible2: '', dialogImageUrl: '',
      brandOptions: [], checkedBrands: [],
      // 全选状态
      checkAll: false,
      // 半选状态
      isIndeterminate: true,
      flags: true,
      form: {
        name: '',
        resource: '',
        desc: ''
      },
      dialogVisible: false,
      tableData: [], total: 0,              // 总条数
      listLoading: false,    // 列表加载状态
      selectedCategory: null,   // 当前选中的分类
      currentEditRow: null,  // 当前编辑的行数据
      editingId: null,       // 编辑中的ID（区分新增和编辑）
      subFormDetail: {},  // 新增：保存编辑时的完整接口返回数据
    }
  },
  // 新增
  watch: {
    // 监听路由变化，当从子页面返回时刷新列表
    '$route'(to, from) {
      if (to.name === 'ProductList' || to.path === '/product/category') {
        if (from.name && from.name !== 'ProductList') {
          this.fetchClassificationList()
        }
      }
    }
  },
  methods: {
    // 改前：没有这个方法，数据是写死的
    // 改前：没有这个方法

    // 改后：新增方法，将扁平数据转为 Element UI 树形表格需要的结构
    buildTreeData(data) {
      if (!data || data.length === 0) return []

      // 获取一级分类（pid === 0 或 flags === 1）
      const parentList = data.filter(item => item.pid === 0 || item.flags === 1)
      // 获取子分类（pid !== 0 且 flags !== 1）
      const childList = data.filter(item => item.pid !== 0 && item.flags !== 1)

      return parentList.map(parent => ({
        id: parent.id,
        name: parent.name,
        level: parent.flags,              // 层级
        sort: parent.px,                  // 排序
        icon: parent.tbimg,               // 图片
        hotIcon: parent.rxtbimg || '',    // 热销图
        sh: parent.sh,                // 是否发布
        isShop: parent.flag === 1,        // 是否商城分类
        isHome: parent.tuij === 1,        // 是否推荐首页
        isHot: parent.rxtuij === 1,       // 是否热销
        type: parent.flag === 2 || parent.flag === 3 ? 'card' : '',
        typeText: parent.flag === 2 ? '卡券分类-电影(会员)' : parent.flag === 3 ? '卡券分类-商城(充值)' : '',
        children: childList
          .filter(child => child.pid === parent.id)
          .map(child => ({
            id: child.id,
            name: child.name,
            level: child.flags,
            sort: child.px,
            icon: child.tbimg,
            hotIcon: child.rxtbimg || '',
            sh: child.sh,
            pid: child.pid
          }))
      }))
    },
    // 改后：新增方法，调用接口获取数据
    async fetchClassificationList() {
      this.tableLoading = true
      try {
        const res = await classificationList({})
        console.log('获取分类列表响应:', res)
        if (res.code === 200) {
          // 将接口返回的扁平数据转换为树形结构
          this.tableData = this.buildTreeData(res.data)
          this.total = this.tableData.length
          // this.$message.success(res.msg || '获取成功')
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
      } finally {
        this.tableLoading = false
      }
    },
    // 初始化选中的品牌ID
    initCheckedBrands() {
      this.checkedBrands = []
    },

    // 更新全选和半选状态
    updateCheckAllStatus() {
      const checkedCount = this.checkedBrands.length;
      this.checkAll = checkedCount === this.brandOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.brandOptions.length;
    },

    // 全选/全不选
    handleCheckAllChange(val) {
      this.checkedBrands = val ? this.brandOptions.map(brand => brand.id) : [];
      this.isIndeterminate = false;

      // 同步更新brandOptions中的checked状态（可选，如果需要双向同步）
      this.brandOptions.forEach(brand => {
        brand.checked = this.checkedBrands.includes(brand.id);
      });
    },

    // 选中的品牌发生变化
    handleCheckedBrandsChange(value) {
      // 更新全选和半选状态
      this.updateCheckAllStatus();

      // 同步更新brandOptions中的checked状态（可选，如果需要双向同步）
      this.brandOptions.forEach(brand => {
        brand.checked = value.includes(brand.id);
      });
    },
    async customImageUpload(options) {
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

        if (response.data.status === 200) {
          this.subForm.tbimg = response.data.data
          this.$message.success('上传成功')
          // 强制更新视图
          this.$forceUpdate()
          // 触发表单验证
          if (this.$refs.addForm) {
            this.$refs.addForm.validateField('tbimg')
          }
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response?.data?.status === 200) {
          this.subForm.tbimg = error.response.data.data
          this.$message.success('上传成功')
          this.$forceUpdate()
          if (this.$refs.addForm) {
            this.$refs.addForm.validateField('tbimg')
          }
          return
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 图片上传前验证
    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    // 修改 AddSub 方法
    AddSub(row) {
      this.currentParentRow = row
      this.subForm = {
        name: '',
        tbimg: '',
        px: 0,
        sh: ''
      }
      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.addForm) {
          this.$refs.addForm.clearValidate()
        }
      })
      this.dialogVisible = true
    },

    // 修改 submitSubForm 方法
    async submitSubForm() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return false

        this.subFormLoading = true
        try {
          let res

          if (this.editingId) {
            // 编辑模式 - 调用编辑接口
            // const params = {
            //   id: String(this.editingId),
            //   name: this.subForm.name,
            //   tbimg: this.subForm.tbimg,
            //   px: String(this.subForm.px),
            //   sh: String(this.subForm.sh),
            // }
            // res = await editClassificationpro(params)

            const d = this.subFormDetail
            const params = {
              id: String(d.id),
              name: this.subForm.name,
              name1: d.name1,
              syname: d.syname,
              tag: d.tag,
              pid: String(d.pid),
              tbimg: this.subForm.tbimg,
              px: String(this.subForm.px),
              flag: String(d.flag),
              sh: String(this.subForm.sh),
              tuij: String(d.tuij),
              rxname: d.rxname,
              rxtbimg: d.rxtbimg,
              rxtuij: String(d.rxtuij),
              px1: String(d.px1)
            }
            res = await editClassificationpro(params)
          } else {
            // 新增模式 - 原有逻辑
            const params = {
              pid: String(this.currentParentRow.id),
              name: this.subForm.name,
              tbimg: this.subForm.tbimg,
              px: String(this.subForm.px),
              sh: String(this.subForm.sh),
              flag: '0',
              tuij: '0',
              rxtuij: '0',
              rxname: '',
              rxtbimg: '',
              syname: '',
              tag: '',
              px1: '0'
            }
            res = await addClassificationpro(params)
          }

          console.log('提交响应:', res)

          if (res.code === 200) {
            this.$message.success(res.msg || (this.editingId ? '修改成功' : '添加成功'))
            this.handleDialogClose()
            this.fetchClassificationList()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败')
        } finally {
          this.subFormLoading = false
        }
      })
    },
    handleDialogClose() {
      this.dialogVisible = false
      this.editingId = null
      this.currentEditRow = null
      this.currentParentRow = null
      this.subFormDetail = {}  // 新增这行
      this.subForm = {
        name: '',
        tbimg: '',
        px: 0,
        sh: ''
      }
    },
    // 修改 handleClose 方法
    handleClose() {
      this.dialogVisible = false
      this.subForm = {
        name: '',
        tbimg: '',
        px: 0,
        sh: ''
      }
      this.currentParentRow = null
    },
    handlePictureCardPreview() { },
    handleRemove() { },
    // 新增：保存品牌关联的方法
    // 改后：调用编辑接口保存
    async saveBrandRelation() {
      if (this.checkedBrands.length === 0) {
        this.$message.warning('请至少选择一个品牌')
        return
      }
      this.saveLoading = true
      try {
        const params = {
          id: String(this.currentCategoryId),
          brandids: JSON.stringify(this.checkedBrands.map(String))  // JSON 数组字符串
        }

        const res = await saveRelationBrand(params)
        console.log('保存品牌关联响应:', res)

        if (res.code === 200) {
          this.$message.success(res.msg || '品牌关联保存成功')
          this.backGo()
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存品牌关联失败:', error)
        this.$message.error('保存失败，请重试')
      } finally {
        this.saveLoading = false
      }
    },// 新增
    async searchBrandList() {
      this.brandLoading = true
      this.brandPage = 1
      try {
        const res = await relationBrand({
          page: String(this.brandPage),
          limit: String(this.brandLimit),
          search_key: this.brandSearchForm.search_key || '',
          search_val: this.brandSearchForm.search_val || '',
          px_key: this.brandSearchForm.px_key || '',
          px_val: this.brandSearchForm.px_val || ''
        })

        if (res.code === 200 && res.data) {
          this.brandOptions = res.data.data.map(item => ({
            id: item.id,
            name: item.name
          }))
          this.brandTotal = res.data.total
          this.brandLastPage = res.data.last_page
        }
      } catch (error) {
        console.error('搜索品牌失败:', error)
      } finally {
        this.brandLoading = false
      }
    },
    // 新增
    async loadMoreBrands() {
      if (this.brandPage >= this.brandLastPage) return

      this.brandLoadingMore = true
      this.brandPage++

      try {
        const res = await relationBrand({
          page: String(this.brandPage),
          limit: String(this.brandLimit),
          search_key: this.brandSearchForm.search_key || '',
          search_val: this.brandSearchForm.search_val || '',
          px_key: this.brandSearchForm.px_key || '',
          px_val: this.brandSearchForm.px_val || ''
        })

        if (res.code === 200 && res.data) {
          const newBrands = res.data.data.map(item => ({
            id: item.id,
            name: item.name
          }))
          this.brandOptions = [...this.brandOptions, ...newBrands]
        }
      } catch (error) {
        console.error('加载更多品牌失败:', error)
        this.brandPage--
      } finally {
        this.brandLoadingMore = false
      }
    },
    // 添加产品分类
    addPro() {
      // this.$router.push('/product/addcategory')
      this.$router.push({
        name: 'AddCategory',

      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },
    // 改后：调用添加接口

    backGo() {
      this.flags = true
      this.currentCategoryName = ''
      this.currentCategoryId = null
      // 返回时刷新列表
      this.fetchClassificationList()
    },
    // 编辑
    // handleEdit(row) {
    //   console.log('编辑', row)
    //   this.$router.push(`/product/editclassification/id/${row.id}`)
    // },
    handleEdit(row) {
      console.log('编辑分类:', row)
      if (row.level === 1) {
        // 一级分类跳转到编辑页面
        this.$router.push({
          name: 'AddCategory',
          params: { id: row.id }
        })
      } else {
        // 二级分类弹出编辑弹窗，先获取详情
        this.openEditDialog(row)
      }
    },

    // 新增：打开编辑弹窗并获取详情
    async openEditDialog(row) {
      this.currentEditRow = row
      this.editingId = row.id

      try {
        // 调用接口获取详情
        const res = await getClassificationpro({ id: row.id })
        console.log('获取分类详情:', res)

        if (res.code === 200 && res.data) {
          this.subFormDetail = res.data
          // 填充表单数据
          this.subForm = {
            name: res.data.name || '',
            tbimg: res.data.tbimg || '',
            px: Number(res.data.px) || 0,
            sh: Number(res.data.sh)
          }
          // 设置父级信息
          if (row.pid && this.tableData.length > 0) {
            const parentRow = this.tableData.find(item => item.id === row.pid)
            if (parentRow) {
              this.currentParentRow = parentRow
            }
          }
        } else {
          this.$message.error(res.msg || '获取分类详情失败')
          return
        }
      } catch (error) {
        console.error('获取分类详情失败:', error)
        this.$message.error('获取分类详情失败')
        return
      }

      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.addForm) {
          this.$refs.addForm.clearValidate()
        }
      })
      this.dialogVisible = true
    },
    // 删除
    // 改后：调用真实删除接口
    async handleDelete(row) {
      try {
        await this.$confirm('您确定要将它删除吗？删除后数据将无法恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 调用删除接口
        const res = await delClassificationpro({ ids: row.id })
        console.log('删除响应:', res)

        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
          // 重新获取列表
          this.fetchClassificationList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败，请重试')
        }
      }
    },
    // 重置搜索
    resetBrandSearch() {
      this.brandSearchForm = {
        search_key: 'name',
        search_val: '',
        px_key: 'px',
        px_val: 'asc'
      }

    },
    // 改后：根据选中的行数据跳转
    brandflg(row) {
      this.resetBrandSearch()
      this.selectedCategory = row
      this.flags = false
      this.currentCategoryName = row.name
      this.currentCategoryId = row.id
      // 获取该分类已关联的品牌
      this.fetchBrandRelation(row.id)
    },// 改前：没有这个方法

    // 改后：
    // 改后
    async fetchBrandRelation(categoryId) {
      this.brandLoading = true
      this.brandPage = 1
      try {
        // 同时获取品牌列表和分类详情
        const [brandRes, detailRes] = await Promise.all([
          relationBrand({
            page: String(this.brandPage),
            limit: String(this.brandLimit),
            search_key: 'name',
            search_val: '',
            px_key: 'px',
            px_val: 'asc'
          }),
          getClassificationpro({ id: categoryId })  // 还需要这个接口获取已关联的品牌
        ])

        console.log('品牌列表响应:', brandRes)
        console.log('分类详情响应:', detailRes)

        // 处理品牌列表
        if (brandRes.code === 200 && brandRes.data) {
          this.brandOptions = brandRes.data.data.map(item => ({
            id: item.id,
            name: item.name
          }))
          this.brandTotal = brandRes.data.total
          this.brandLastPage = brandRes.data.last_page
        }

        // 处理已关联的品牌ID
        if (detailRes.code === 200 && detailRes.data) {
          const brandStr = detailRes.data.brand || ''
          const brandIds = brandStr ? brandStr.split(',').map(Number) : []
          this.checkedBrands = brandIds
          this.updateCheckAllStatus()
        }
      } catch (error) {
        console.error('获取品牌关联失败:', error)
        this.$message.error('获取品牌关联失败')
      } finally {
        this.brandLoading = false
      }
    },

    // 添加子栏目
    // handleAddSub(row) {
    //   console.log('添加子栏目', row)
    //   this.$router.push(`/admin.php/product/addclassification/id/${row.id}/type/1`)
    // },
    handleAddSub(row) {
      this.dialogVisible = true
      this.subForm.parentName = row.name
      this.subForm.parentId = row.id
    },

    // 品牌关联
    handleBrand(row) {
      console.log('品牌关联', row)
      this.$router.push(`/admin.php/product/brand_association/id/${row.id}`)
    },

    // 状态变更
    // 改后：调用编辑接口更新状态
    // 状态变更（更优雅的版本）
    async handleStatusChange(row, val) {
      // val 是 switch 改变后的值（true/false）
      // 目标状态：true=1(发布), false=0(下架)
      const targetStatus = val ? 1 : 0
      const statusText = targetStatus === 1 ? '发布' : '下架'

      // 保存原始状态
      // const originalStatus = row.sh
      const originalStatus = targetStatus === 1 ? 0 : 1

      try {
        await this.$confirm(`确定${statusText}该分类吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await fbClassificationpro({
          id: String(row.id)
        })

        if (res.code === 200) {
          // 成功：更新状态
          row.sh = res.data.sh
          this.$message.success(res.msg || '状态修改成功')
        } else {
          // 失败：恢复原始状态
          row.sh = originalStatus
          this.$message.error(res.msg || '状态修改失败')
        }
      } catch (error) {
        // 用户取消：恢复原始状态
        row.sh = originalStatus

        if (error !== 'cancel' && error !== 'close') {
          console.error('状态更新失败:', error)
          this.$message.error('状态修改失败')
        }
      }
    }
  }, mounted() {
    // 初始化选中的品牌ID
    this.initCheckedBrands();

    this.fetchClassificationList();    // 页面加载时获取分类列表

  }, computed: {
    isProductCategory() {
      // 只要不是子路由页面，就显示列表
      return this.$route.name === 'ProductList' || this.$route.path === '/product/category'

    }
  }
}
</script>
<style>
.cateGorys .el-table__cell .cell {
  display: flex;
  align-items: center;
}
</style>
<style lang="scss" scoped>
.list-container {

  // padding: 20px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }

  }

  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    color: #222222;
    font-size: 14px;

    .brand-checkbox-item {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }

  .category-name {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;

    .first-level {
      font-weight: bold;

      i {
        margin-right: 5px;
        color: #e6a23c;
      }
    }

    .second-level {
      margin-left: 20px;

      i {
        margin-right: 5px;
        color: #909399;
      }
    }

    .tag {
      display: inline-block;

      font-size: 12px;
      margin-left: 5px;

      &.tag-blue {

        color: #409eff;

      }

      &.tag-green {

        color: #67c23a;

      }

      &.tag-purple {

        color: #8a6de9;

      }
    }
  }

  .no-image {
    color: #999;
    font-size: 12px;
    text-align: center;
    display: inline-block;
    width: 100%;
  }

  .image-error {
    width: 40px;
    height: 40px;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }

  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: cover;
  }
}

.upload-tips {
  color: #ff0000;
  font-size: 12px;
  margin-left: 10px;
}
</style>