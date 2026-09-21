<template>
  <div class="list-container">
    <template v-if="isProductListPage">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <!-- 产品来源 -->
          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="产品来源" class="w110" clearable filterable>
              <el-option label="系统-云中鹤" value="system"></el-option>
              <el-option label="供应商-云中鹤" value="provider"></el-option>
              <el-option label="京东-云中鹤" value="jindong"></el-option>
              <el-option label="京东2-云中鹤" value="xinfutong"></el-option>
              <el-option label="网易严选-云中鹤" value="wangyi"></el-option>
              <el-option label="接口读取" value="1"></el-option>
              <el-option label="系统(全部)" value="2"></el-option>
              <el-option label="系统-供应商(添加)" value="3"></el-option>
              <el-option label="系统-管理员(添加)" value="4"></el-option>
              <el-option label="热销" value="5"></el-option>
              <el-option label="抢购" value="6"></el-option>
              <el-option label="精选" value="7"></el-option>
              <el-option label="热门" value="8"></el-option>
              <el-option label="品牌旗舰" value="9"></el-option>
              <el-option label="新品专区" value="10"></el-option>
              <el-option label="未设置分类产品" value="11"></el-option>
              <el-option label="未设置品牌产品" value="12"></el-option>
            </el-select>
          </el-form-item>

          <!-- 一级分类 -->
          <el-form-item label="">
            <el-select v-model="searchForm.class1" placeholder="分类" class="w110" clearable @change="handleClass1Change"
              filterable>
              <el-option v-for="item in class1List" :key="item.id" :label="item.name" :value="item.id"></el-option>

            </el-select>
          </el-form-item>

          <!-- 二级分类（联动） -->
          <el-form-item label="" v-if="searchForm.class1">
            <el-select v-model="searchForm.class2" placeholder="二级分类" class="w120" clearable filterable>
              <el-option v-for="item in class2List" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 品牌（联动） -->
          <el-form-item label="" v-if="searchForm.class1">
            <el-select v-model="searchForm.brand_id" placeholder="品牌" class="w120" clearable filterable>
              <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 搜索字段选择 + 关键词 -->
          <el-form-item label="">
            <!-- <span class="search-label">按</span> -->
            <el-select v-model="searchForm.search_key" class="w110" filterable clearable>
              <el-option label="商品名称" value="name"></el-option>
              <el-option label="商品产地" value="productplace"></el-option>
              <el-option label="简要描述" value="features"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="供应商编号" value="uid"></el-option>
              <el-option label="商品ID(云中鹤)" value="productid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>

          <!-- 排序字段 + 排序方式 -->
          <el-form-item label="">
            <!-- <span class="search-label">按</span> -->
            <el-select v-model="searchForm.px_key" class="w110" filterable clearable>
              <el-option label="添加时间" value="createtime"></el-option>
              <el-option label="修改时间" value="edit_time"></el-option>
              <el-option label="点击数" value="djs"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <!-- <span class="search-label">进行</span> -->
            <el-select v-model="searchForm.px_val" class="w90" clearable>
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <!-- 商品状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.shzt" placeholder="商品状态" class="w110" clearable>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>

          <!-- 审核状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="审核状态" class="w110" clearable>
              <el-option label="已审核" value="1"></el-option>
              <el-option label="未审核" value="0"></el-option>
            </el-select>
          </el-form-item>



          <!-- 价格区间 -->
          <el-form-item label="">
            <el-select v-model="searchForm.price_type" placeholder="价格" class="w100" clearable filterable>
              <el-option label="100以下" value="100"></el-option>
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

          <!-- 开始时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" class="w130"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <!-- 结束时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" class="w130"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleUpdateProduct()" style="display: none;">更新产品</el-button>

          </el-form-item>
        </el-form>
      </el-card>
      <el-dialog :title="tiles" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div style="margin: auto;text-align: center;">
          <!-- 一级分类 -->
          <el-form :model="form" class="dflex" style="    justify-content: center;">
            <el-form-item label="">
              <el-select v-model="form.class1" placeholder="分类" class=" " clearable @change="handleClass1Change1"
                filterable>
                <el-option v-for="item in class1List" :key="item.id" :label="item.name" :value="item.id"></el-option>

              </el-select>
            </el-form-item>

            <!-- 二级分类（联动） -->
            <el-form-item label="" v-if="plxg == 1">
              <el-select v-model="form.class2" placeholder="二级分类" class=" " clearable filterable>
                <el-option v-for="item in class2List" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" v-if="plxg == ''">
              <el-select v-model="form.brand_id" placeholder="品牌" clearable filterable>
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
        <div slot="footer" class="dialog-footer txtcenter">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savepiliangUpdateClass()" v-if="plxg == 1">确 定</el-button>
          <el-button type="primary" @click="savepiliangUpdateBrand()" v-if="plxg == ''">确 定</el-button>


        </div>
      </el-dialog>
      <!-- 表格操作按钮 -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1"
            @click="batchDelete()">批量删除</el-button>

          <el-button type="primary" size="small" v-if="multipleSelection.length > 1"
            @click="dialogVisibleone(1)">修改分类</el-button>

          <el-button type="primary" size="small" v-if="multipleSelection.length > 1"
            @click="dialogVisibleone(2)">修改品牌</el-button>

          <el-button type="primary" size="small" icon="el-icon-plus" @click="addProduct()">添加产品</el-button>
          <el-button type="success" size="small" icon="el-icon-bottom-right" @click="importProduct()">导入</el-button>
          <el-button type="success" size="small" icon="el-icon-top-right" @click="exportProduct()">导出</el-button>
          <el-button type="warning" size="small" icon="el-icon-unlock" @click="batchAudit()"
            v-if="isadmin == 1">审核</el-button>
          <el-button type="warning" size="small" icon="el-icon-upload2" @click="idsshangjia()">上架</el-button>
          <el-button type="warning" size="small" icon="el-icon-download" @click="idsxiajia()">下架</el-button>
        </div>

        <!-- 表格 -->
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="39">
          </el-table-column>
          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="缩略图" width="90" align="center">
            <template slot-scope="scope">
              <el-image style="width: 60px; height: 60px" :src="scope.row.thumbnailimage" fit="contain"
                :preview-src-list="[scope.row.thumbnailimage]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" min-width="280" align="left">
            <template slot-scope="scope">
              <div @click="handleEdit(scope.row)" class="ahvers"> {{ scope.row.name }}</div>

              <span class="successCl fs12"> {{ class1Map[scope.row.class1] }}</span>
              <span>-</span>
              <span class="successCl fs12">{{ class2Map[scope.row.class2] }}</span>
              <span>-</span><span class="blueCl fs12">{{ scope.row.list_pinpai ? scope.row.list_pinpai.name : '' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="市场价/供货价" min-width="140" align="left">
            <template slot-scope="scope">
              <div v-if="scope.row.list_xinghao && scope.row.list_xinghao.length > 0">
                <div v-for="item in scope.row.list_xinghao" :key="item.id" class="xinghao-item">
                  <span>
                    <span style="display: inline-block;width:60px;"> <span class="fs10">¥</span> {{ item.price }}</span>
                    <span style="font-weight: 600;"><span class="fs10">¥</span>{{ item.ghprice }}</span> </span>
                </div>
                <!-- <div v-if="scope.row.list_xinghao.length > 2" class="more-text">
                  共{{ scope.row.list_xinghao.length }}个型号...
                </div> -->
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" min-width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.createtime) }}
            </template>
          </el-table-column>
          <el-table-column label="发布" min-width="190" align="center">
            <template slot-scope="scope">
              <div>后台 ID:{{ scope.row.uid }}</div>
              <div>{{ scope.row.gongyingshang ? scope.row.gongyingshang.username : '-' }}</div>
            </template>
          </el-table-column>
          <!-- 上架状态 -->
          <el-table-column label="上架" align="center" width="70">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-value="selling" inactive-value="undercarriage"
                @change="(val) => handleSwitchChange(scope.row, 'status', val)">
              </el-switch>
            </template>
          </el-table-column>

          <!-- 审核状态 -->
          <el-table-column label="审核" align="center" width="70">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                @change="(val) => handleSwitchChange(scope.row, 'sh', val)">
              </el-switch>
            </template>
          </el-table-column>

          <!-- 热销 -->
          <el-table-column label="热销" width="70" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.hot" :active-value="1" :inactive-value="0"
                @change="(val) => handleSwitchChange(scope.row, 'hot', val)">
              </el-switch>
            </template>
          </el-table-column>

          <!-- 精选 -->
          <el-table-column label="精选" width="70" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.jingxuan" :active-value="1" :inactive-value="0"
                @change="(val) => handleSwitchChange(scope.row, 'jingxuan', val)">
              </el-switch>
            </template>
          </el-table-column>


          <el-table-column label="点击率" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.djs }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import * as XLSX from 'xlsx'
import {
  productList,
  delProduct,
  switchStatus,
  batchAudit,
  batchUp,
  batchDown,
  updateYunzhongheProduct,
  showoneFenLen,    // 添加
  showtwoFenlen,    // 添加
  showSupplier,      // 添加
  piliangUpdateClass,
  exportGoods, importGoods,
  piliangUpdateBrand
} from '@/api/modules/login'

export default {
  name: 'ProductList',
  data() {
    return {
      isadmin: localStorage.getItem('is_super_admin'),
      class1Map: {},  // { 1: '食品饮料', 4: '日用百货', ... }
      class2Map: {},  // { 19: '休闲零食', 48: '沐浴露', ... }
      plxg: '',
      tiles: '修改',
      dialogVisible: false,
      class1List: [],
      loading: false,
      form: {
        brand_id: '',      // 产品来源
        class1: '',
        class2: '',
      },
      searchForm: {
        type: '',
        class1: '',
        class2: '',
        brand_id: '',
        search_key: 'name',    // 原 search_bzb → search_key
        search_val: '',        // 原 bzb → search_val
        px_key: 'createtime',  // 原 search_tdb → px_key
        px_val: 'desc',        // 原 order → px_val
        shzt: '',
        sh: '',
        sshot: '',
        ssjingxuan: '',
        price_type: '',
        ks_time: '',
        end_time: ''
      },
      pageInfo: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 0
      },
      multipleSelection: [],
      tableData: [],
      class2List: [],   // 二级分类列表
      brandList: []     // 品牌列表
    }
  },
  created() {
    this.getClass1List().then(() => { this.getAllClass2Map() })
    this.getList()
  }, watch: {
    '$route'(to, from) {
      // 从 AddPro 返回时刷新
      if (from.name === 'AddPro') {
        this.getList()
      }
    }
  },
  methods: {
    // 在 methods 中添加
    async handleUpdateProduct() {
      // 如果有选中的产品，使用选中的产品ID
      if (this.multipleSelection.length > 0) {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        await this.doUpdateProduct(ids)
      } else {
        // 如果没有选中，使用当前搜索条件进行批量更新
        this.$confirm(
          '批量更新所有符合条件的产品，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          await this.doUpdateProduct('')  // 传空字符串表示更新所有符合搜索条件的产品
        }).catch(() => { })
      }
    },

    async doUpdateProduct(ids) {
      this.loading = true
      try {
        const params = {}

        // 如果传入了ids，则只更新选中的产品
        if (ids) {
          params.ids = ids
        } else {
          // 否则传递搜索条件，让后端根据条件更新
          const fields = [
            'type', 'class1', 'class2', 'brand_id',
            'search_key', 'search_val', 'px_key', 'px_val',
            'shzt', 'sh', 'sshot', 'ssjingxuan',
            'price_type', 'ks_time', 'end_time'
          ]

          fields.forEach(field => {
            if (this.searchForm[field] !== '' && this.searchForm[field] !== null && this.searchForm[field] !== undefined) {
              params[field] = this.searchForm[field]
            }
          })
        }

        const res = await updateYunzhongheProduct(params)

        if (res.code === 200) {
          this.$message.success(res.msg || '更新产品信息成功')
          // 刷新列表
          this.getList()
        } else {
          this.$message.error(res.msg || '更新产品信息失败')
        }
      } catch (error) {
        console.error('更新产品信息失败:', error)
        this.$message.error('更新产品信息失败')
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    async savepiliangUpdateClass() {
      try {

        const ids = this.multipleSelection.map(item => item.id).join(',')


        const res = await piliangUpdateClass({ ids: ids, class1: this.form.class1, class2: this.form.class2 });
        if (res.code === 200) {
          this.$message.success('成功')
          this.dialogVisible = false
          this.getList()

        }
      } catch (error) {
        this.dialogVisible = false
        console.error(error)

      }
    },
    async savepiliangUpdateBrand() {
      try {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        const res = await piliangUpdateBrand({ ids: ids, brand_id: this.form.brand_id });
        if (res.code === 200) {
          this.$message.success('成功')
          this.dialogVisible = false;
          this.getList()

        }
      } catch (error) {
        this.dialogVisible = false
        console.error(error)
      }
    },
    dialogVisibleone(val) {
      this.dialogVisible = true
      this.form.class1 = ''
      this.form.class2 = ''
      this.form.brand_id = ''

      if (val == 1) {
        this.tiles = '批量修改分类';
        this.plxg = 1;
      }
      if (val == 2) {
        this.tiles = '批量修改品牌';
        this.plxg = '';


      }
    },
    async getClass1List() {
      try {
        const res = await showoneFenLen()
        if (res.code === 200) {
          this.class1List = res.data.list

          res.data.list.forEach(item => {
            this.class1Map[item.id] = item.name
          })
        }
      } catch (error) {
        console.error('获取一级分类失败', error)
      }
    },
    async getAllClass2Map() {
      try {
        for (const item of this.class1List) {
          const res = await showtwoFenlen({ id: item.id })
          if (res.code === 200 && res.data.list) {
            res.data.list.forEach(sub => {
              this.class2Map[sub.id] = sub.name
            })
          }
        }
      } catch (error) {
        console.error('获取二级分类映射失败', error)
      }
    },
    async getClass2List(class1Id) {
      try {
        const res = await showtwoFenlen({ id: class1Id })
        if (res.code === 200) {
          this.class2List = res.data.list
        }
      } catch (error) {
        console.error('获取二级分类失败', error)
      }
    },
    async getBrandList(class1Id) {
      try {
        const res = await showtwoFenlen({ id: class1Id })
        if (res.code === 200) {
          this.brandList = res.data.pingpai_list;
        }
      } catch (error) {
        console.error('获取品牌失败', error)
      }
    },
    // 一级分类改变时，加载二级分类和品牌
    handleClass1Change(val) {
      this.searchForm.class2 = ''
      this.searchForm.brand_id = ''
      if (val) {
        this.getClass2List(val)
        this.getBrandList(val)
      } else {
        this.class2List = []
        this.brandList = []
      }
    },
    handleClass1Change1(val) {
      this.form.class2 = ''
      this.form.brand_id = ''
      if (val) {
        this.getClass2List(val)
        this.getBrandList(val)
      } else {
        this.class2List = []
        this.brandList = []
      }

    },



    // 获取产品列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.pageInfo.current_page,
          limit: this.pageInfo.per_page
        }

        const fields = [
          'type', 'class1', 'class2', 'brand_id',
          'search_key', 'search_val', 'px_key', 'px_val',
          'shzt', 'sh', 'sshot', 'ssjingxuan',
          'price_type', 'ks_time', 'end_time'
        ]

        fields.forEach(field => {
          if (this.searchForm[field] !== '' && this.searchForm[field] !== null && this.searchForm[field] !== undefined) {
            params[field] = this.searchForm[field]  // ✅ 用 params
          }
        })

        console.log('请求参数:', params)

        const res = await productList(params)
        console.log('返回数据:', res)

        if (res.code === 200) {
          this.tableData = res.data.data
          this.pageInfo = {
            current_page: res.data.current_page,
            per_page: res.data.per_page,
            total: res.data.total,
            last_page: res.data.last_page
          }
        } else {
          this.$message.error(res.msg || '获取产品列表失败')
        }
      } catch (error) {
        console.error('获取产品列表失败', error)
        this.$message.error('获取产品列表失败')
      } finally {
        this.loading = false
      }
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 查询
    handleSearch() {
      this.pageInfo.current_page = 1
      this.getList()
    },

    // 重置搜索


    // 分页大小改变
    handleSizeChange(val) {
      this.pageInfo.per_page = val
      this.getList()
    },

    // 页码改变
    handleCurrentChange(val) {
      this.pageInfo.current_page = val
      this.getList()
    },

    // 选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 切换状态
    // 通用状态切换方法
    async handleSwitchChange(row, type, val) {
      // 反推之前的值
      let previousVal
      if (type === 'status') {
        previousVal = val === 'selling' ? 'undercarriage' : 'selling'
      } else {
        previousVal = val === 1 ? 0 : 1
      }

      // 状态文本映射
      const typeTextMap = {
        status: val === 'selling' ? '上架' : '下架',
        sh: val === 1 ? '审核通过' : '取消审核',
        hot: val === 1 ? '设为热销' : '取消热销',
        jingxuan: val === 1 ? '设为精选' : '取消精选'
      }

      try {
        await this.$confirm(`确定${typeTextMap[type]}该产品吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await switchStatus({
          id: String(row.id),
          type: type
        })

        if (res.code === 200) {
          // 使用后端返回的值更新
          const fieldMap = { status: 'status', sh: 'sh', hot: 'hot', jingxuan: 'jingxuan' }
          row[fieldMap[type]] = res.data[fieldMap[type]]
          this.$message.success(res.msg || '状态修改成功')
          this.getList()
        } else {
          row[fieldMap[type]] = previousVal
          this.$message.error(res.msg || '状态修改失败')
        }
      } catch (error) {
        const fieldMap = { status: 'status', sh: 'sh', hot: 'hot', jingxuan: 'jingxuan' }
        row[fieldMap[type]] = previousVal
        if (error !== 'cancel' && error !== 'close') {
          this.$message.error('状态修改失败')
        }
      }
    },

    // 编辑
    handleEdit(row) {
      this.$router.push({
        name: 'AddPro',
        params: { id: row.id }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delProduct({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的产品')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的${this.multipleSelection.length}个产品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delProduct({ ids: ids })
          if (res.code === 200) {
            this.$message.success('批量删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          console.error('批量删除失败', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 添加产品
    addProduct() {
      this.$router.push({
        name: 'AddPro'
        // params: { id: 0 }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    // 导入
    // 导入（只修改供货价）
    importProduct() {
      // 创建文件上传 input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx, .xls'
      input.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // 验证文件类型
        const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        if (fileExt !== 'xlsx' && fileExt !== 'xls') {
          this.$message.error('请上传 Excel 文件（.xlsx 或 .xls）')
          return
        }

        // this.$message.info('正在解析文件...')

        try {
          // 读取 Excel 文件
          const data = await this.parseExcelForPrice(file)

          if (!data || data.length === 0) {
            this.$message.warning('文件中没有有效数据')
            return
          }

          // 确认导入
          this.$confirm(
            `共解析到 ${data.length} 条数据，确认导入吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              dangerouslyUseHTMLString: true
            }
          ).then(async () => {
            await this.submitImportPrice(data)
          }).catch(() => { })

        } catch (error) {
          console.error('解析文件失败:', error)
          this.$message.error(error.message || '解析文件失败，请检查文件格式')
        }
      }
      input.click()
    },

    // 解析 Excel 文件（只提取编号、规格编号、供货价）
    parseExcelForPrice(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })

            if (!jsonData || jsonData.length < 2) {
              reject(new Error('文件数据为空'))
              return
            }

            // 获取表头（第一行）
            const headers = jsonData[0].map(h => String(h || '').trim())

            // 找到需要的列索引
            let idIndex = -1           // 编号
            let specIdIndex = -1       // 规格编号
            let supplyPriceIndex = -1  // 供货价

            headers.forEach((header, index) => {
              if (header === '编号' && idIndex === -1) {
                idIndex = index
              } else if (header === '规格编号' && specIdIndex === -1) {
                specIdIndex = index
              } else if (header === '供货价' && supplyPriceIndex === -1) {
                supplyPriceIndex = index
              }
            })

            // 检查必要列是否存在
            if (idIndex === -1) {
              reject(new Error('文件中缺少"编号"列'))
              return
            }
            if (specIdIndex === -1) {
              reject(new Error('文件中缺少"规格编号"列'))
              return
            }
            if (supplyPriceIndex === -1) {
              reject(new Error('文件中缺少"供货价"列'))
              return
            }

            // 解析数据行（从第2行开始）
            const result = []
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i]
              if (!row || row.length === 0) continue

              const id = row[idIndex] ? String(row[idIndex]).trim() : ''
              const specId = row[specIdIndex] ? String(row[specIdIndex]).trim() : ''
              let supplyPrice = row[supplyPriceIndex] !== undefined && row[supplyPriceIndex] !== ''
                ? String(row[supplyPriceIndex]).trim()
                : ''

              // 验证必要字段
              if (!id) {
                console.warn(`第 ${i + 1} 行缺少编号，跳过`)
                continue
              }
              if (!specId) {
                console.warn(`第 ${i + 1} 行缺少规格编号，跳过`)
                continue
              }
              if (!supplyPrice) {
                console.warn(`第 ${i + 1} 行供货价为空，跳过`)
                continue
              }

              // 验证供货价是否为数字（允许小数）
              if (isNaN(Number(supplyPrice))) {
                console.warn(`第 ${i + 1} 行供货价格式错误：${supplyPrice}，跳过`)
                continue
              }

              result.push({
                编号: id,
                规格编号: specId,
                供货价: supplyPrice
              })
            }

            if (result.length === 0) {
              reject(new Error('没有找到有效数据，请确保填写了编号、规格编号和供货价'))
              return
            }

            console.log('解析到的数据:', result)
            resolve(result)
          } catch (error) {
            reject(new Error('解析文件失败：' + error.message))
          }
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsArrayBuffer(file)
      })
    },

    // 提交导入数据（只修改供货价）
    async submitImportPrice(data) {
      const loading = this.$loading({
        lock: true,
        text: '正在更新供货价...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        // 构建认证参数
        const timestamp = GLOBAL_CONFIG.getTimestamp()
        const apiChannelNo = GLOBAL_CONFIG.API_CHANNEL_NO

        const signParams = {
          api_channel_no: apiChannelNo,
          timestamp: timestamp
        }
        const sign = GLOBAL_CONFIG.generateSign(signParams)

        // 构建 FormData
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        formData.append('api_channel_no', apiChannelNo)
        formData.append('timestamp', timestamp)
        formData.append('sign', sign)

        const response = await axios({
          url: '/admin/v1/product/importGoods',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        console.log('导入响应:', response.data)

        if (response.data.status === 200) {
          const count = response.data.count || data.length
          this.$message.success(`导入成功！共更新 ${count} 条数据的供货价`)
          // 刷新列表
          this.getList()
        } else {
          this.$message.error(response.data.msg || '导入失败')
        }
      } catch (error) {
        console.error('导入失败:', error)
        const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
        this.$message.error('导入失败：' + errorMsg)
      } finally {
        loading.close()
      }
    },

    // 导出
    // 导出 - 调试版本
    async exportProduct() {
      // 检查 XLSX
      if (typeof XLSX === 'undefined') {
        this.$message.error('XLSX库未加载')
        return
      }

      // 构建业务参数
      const businessParams = {}

      // ========== 新增：选中的产品ID ==========
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        // 如果有选中的产品，导出选中的
        const ids = this.multipleSelection.map(item => item.id).join(',')
        businessParams.ids = ids
        console.log('导出选中的产品ID:', ids)
      }
      // ======================================

      const fields = [
        'type', 'class1', 'class2', 'brand_id',
        'search_key', 'search_val', 'px_key', 'px_val',
        'shzt', 'sh', 'price_type', 'ks_time', 'end_time'
      ]

      fields.forEach(field => {
        if (this.searchForm[field] !== '' && this.searchForm[field] !== null && this.searchForm[field] !== undefined) {
          businessParams[field] = this.searchForm[field]
        }
      })
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const apiChannelNo = GLOBAL_CONFIG.API_CHANNEL_NO

      const signParams = {
        ...businessParams,
        api_channel_no: apiChannelNo,
        timestamp: timestamp
      }

      const sign = GLOBAL_CONFIG.generateSign(signParams)

      const formData = new FormData()

      Object.keys(businessParams).forEach(key => {
        if (businessParams[key] !== '' && businessParams[key] !== null && businessParams[key] !== undefined) {
          formData.append(key, businessParams[key])
        }
      })

      formData.append('api_channel_no', apiChannelNo)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const response = await axios({
          url: '/admin/v1/product/exportGoods',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        console.log('=== 导出响应 ===')
        console.log('code:', response.data.code)
        console.log('data:', response.data.data)

        if (response.data.code === 200 && response.data.data) {
          const { header, data, filename } = response.data.data

          console.log('header:', header)
          console.log('data长度:', data ? data.length : 0)
          console.log('前3条数据:', data ? data.slice(0, 3) : [])

          if (!header || header.length === 0) {
            this.$message.error('导出数据表头为空')
            return
          }

          if (!data || data.length === 0) {
            this.$message.warning('没有数据可导出')
            return
          }

          try {
            // 方法1：使用 XLSX
            const excelData = [header, ...data]
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet(excelData)
            ws['!cols'] = header.map(() => ({ wch: 15 }))
            XLSX.utils.book_append_sheet(wb, ws, '产品列表')
            XLSX.writeFile(wb, filename || 'export.xlsx')
            this.$message.success('导出成功')
          } catch (xlsxError) {
            console.error('XLSX错误:', xlsxError)

            // 方法2：如果 XLSX 失败，使用 HTML 表格导出
            let html = '<table border="1">'
            html += '<tr>'
            header.forEach(h => {
              html += `<th>${h}</th>`
            })
            html += '</tr>'
            data.forEach(row => {
              html += '<tr>'
              row.forEach(cell => {
                html += `<td>${cell !== null && cell !== undefined ? cell : ''}</td>`
              })
              html += '</tr>'
            })
            html += '</table>'

            const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename ? filename.replace('.xlsx', '.xls') : 'export.xls'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            this.$message.success('导出成功（备用方式）')
          }
        } else {
          this.$message.error(response.data.msg || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败：' + (error.message || '请稍后重试'))
      }
    },

    // 批量审核
    async batchAudit() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要审核的产品')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      try {
        const res = await batchAudit({ ids: ids })
        if (res.code === 200) {
          this.$message.success('批量审核成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '批量审核失败')
        }
      } catch (error) {
        console.error('批量审核失败', error)
        this.$message.error('批量审核失败')
      }
    },

    // 批量上架
    async idsshangjia() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要上架的产品')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      try {
        const res = await batchUp({ ids: ids })
        if (res.code === 200) {
          this.$message.success('批量上架成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '批量上架失败')
        }
      } catch (error) {
        console.error('批量上架失败', error)
        this.$message.error('批量上架失败')
      }
    },

    // 批量下架
    async idsxiajia() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要下架的产品')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      try {
        const res = await batchDown({ ids: ids })
        if (res.code === 200) {
          this.$message.success('批量下架成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '批量下架失败')
        }
      } catch (error) {
        console.error('批量下架失败', error)
        this.$message.error('批量下架失败')
      }
    }
  },

  computed: {
    isProductListPage() {
      return this.$route.name === 'ProductList' || this.$route.path === '/product/list'
    }
  }
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

.serchForm .el-form-item__label {
  line-height: 36px;
}

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}

.search-label {
  font-size: 14px;
  color: #606266;
  margin-right: 5px;
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

  .xinghao-item {
    margin-bottom: 2px;
    font-size: 12px;
    color: #606266;
    line-height: 18px;
  }

  .more-text {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
  }

  .blueCl {
    color: #409eff;
  }
}

.w90 {
  width: 90px;
}

.w100 {
  width: 100px;
}

.w110 {
  width: 110px;
}

.w120 {
  width: 120px;
}

.w130 {
  width: 130px;
}

.ahvers:hover {
  color: #347bcd;
  cursor: pointer;
}
</style>