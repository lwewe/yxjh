<template>
  <div class="list-container">
    <template v-if="addpro">
      <el-card class="search-card serchForm">

        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.city_id" placeholder="城-市" class="w120" clearable filterable>
              <el-option v-for="city in cityList" :key="city.id" :label="city.name" :value="String(city.id)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.brand_id" placeholder="品牌" class="w120" clearable filterable>
              <el-option v-for="brand in brandList" :key="brand.id" :label="brand.name" :value="String(brand.id)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120">
              <el-option label="商品名称" value="title"></el-option>
              <el-option label="商品信息" value="description"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="供应商编号" value="uid"></el-option>
              <el-option label="商品ID（蛋糕叔叔）" value="goods_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
              <el-option label="添加时间" value="createtime"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="点击率" value="djs"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.shzt" placeholder="商品状态" class="w120" clearable>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
              <el-option label="预售" value="2"></el-option>
              <el-option label="可自提" value="3"></el-option>
              <el-option label="可配送" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="审核状态" class="w120" clearable>
              <el-option label="已审核" value="1"></el-option>
              <el-option label="未审核" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="danger" @click="handleUpdateAllGoods" style="display: none;">更新全部</el-button>
            <el-button type="warning" @click="handleUpdateGoodsCity" style="display: none;">更新商品可售卖城市</el-button>
            <el-button type="warning" @click="handleUpdateGoodsDetail" style="display: none;">更新商品详情</el-button>
            <el-button type="danger" @click="handleUpdateAllGoodsData" style="display: none;">更新全部产品数据</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro">添加产品</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" v-if="multipleSelection.length > 1"
            @click="batchDelete">
            批量删除
          </el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" min-width="39"></el-table-column>
          <el-table-column label="编号" min-width="60" prop="id" align="center"></el-table-column>
          <el-table-column label="缩略图" min-width="90" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.image_path" style="width: 60px; height: 60px; object-fit: cover;" alt="">
            </template>
          </el-table-column>
          <el-table-column label="商品名称" min-width="200" prop="title" align="left"></el-table-column>

          <!-- 修改规格列 -->
          <el-table-column label="价格/市场/结算" align="left" min-width="220">
            <template slot-scope="scope">
              <div v-if="scope.row.gueige && scope.row.gueige.length > 0" class="spec-list">
                <div v-for="(spec, idx) in scope.row.gueige" :key="idx" class="spec-item">
                  <div class="spec-info">
                    <div class="spec-price">
                      <span class="price-value">¥{{ spec.price }}/¥{{ spec.market_price }}/¥{{ spec.clearing_price ||
                        '-' }}</span>
                    </div>
                  </div>
                  <div class="spec-status">
                    <el-switch v-model="spec.deleted" :active-value="0" :inactive-value="1" active-text=""
                      inactive-text=""
                      @change="(val) => changeSpecStatus(scope.row.id, spec.ggid, val, spec.spec_name)" />
                  </div>
                </div>
              </div>
              <span v-else class="no-spec">暂无规格</span>
            </template>
          </el-table-column>



          <el-table-column label="添加时间" min-width="160" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.createtime) }}
            </template>
          </el-table-column>

          <el-table-column label="发布" min-width="160" align="center">
            <template slot-scope="scope">

              <div v-if="scope.row.uid === 0">
                <div class="fs12">接口</div>
                <div class="fs12">
                  {{ scope.row.goods_id || '-' }}

                </div>
              </div>

              <div v-else>
                <div class="fs12">后台 ID{{ scope.row.uid }}</div>
                <div class="fs12">
                  {{ scope.row.supplier_name || '-' }}

                </div>
              </div>


            </template>
          </el-table-column>
          <el-table-column label="发布状态" align="center" min-width="100">
            <template slot-scope="scope">
              <el-switch :value="scope.row.status === 1" active-text=" " inactive-text=" "
                @change="(val) => changeSwitchStatus(scope.row, 'status', val)" />
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" min-width="100">
            <template slot-scope="scope">
              <el-switch :value="scope.row.sh === 1" active-text=" " inactive-text=" "
                @change="(val) => changeSwitchStatus(scope.row, 'sh', val)" />
            </template>
          </el-table-column>
          <el-table-column label="配送/自提/预售" min-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.can_ship === 1 ? '是' : '否' }}/</span>
              <span>{{ scope.row.can_take === 1 ? '是' : '否' }}/</span>
              <span>{{ scope.row.is_yushou === 1 ? '是' : '否' }} </span>

            </template>
          </el-table-column>
          <el-table-column label="点击率" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.djs || 0 }}次
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>

              <el-button size="mini" type="primary" v-if="scope.row.uid === 0"
                @click="handleUpdateOneGoods(scope.row)">更新</el-button>

            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" v-if="total > 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <!-- <router-view></router-view> -->
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import {
  goodsListcake, showSuppliercake, switchStatuscake, switchSpecsStatuscake,
  delGoodscake,
  goodsCityListcake,
  goodsBrandListcake, updateOneGoods,
  updateAllGoods,
  updateGoodsCity,
  updateGoodsDetail,
  updateAllGoodsData
} from '@/api/modules/login'

export default {
  name: 'CakeList',
  data() {
    return {
      specStatusChanging: false,
      flgs: '',
      loading: false,
      searchForm: {
        city_id: '',
        brand_id: '',
        search_key: 'title',
        search_val: '',
        px_key: 'createtime',
        px_val: 'desc',
        shzt: '',
        sh: ''
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      page: 1,
      limit: 20,
      cityList: [],      // 城市列表
      brandList: [],     // 品牌列表
      statusChanging: false,  // 防止重复提交
      supplierMap: {}
    }
  },


  mounted() {
    this.flgs = localStorage.getItem('is_super_admin')
    this.showSuppliercake()
    this.getGoodsList()
    this.getCityList()
    this.getBrandList()
  },
  computed: {
    addpro() {
      return this.$route.name === 'CakeList' || this.$route.path === '/cake/list'
    }
  },
  watch: {
    'searchForm.city_id'(newVal) {
      this.searchForm.brand_id = ''
      this.getBrandList(newVal)
    },
    // ✅ 监听路由变化
    '$route'(to, from) {
      // 当从编辑页返回列表时，刷新数据
      if (to.name === 'CakeList' && from.name === 'AddProcake') {
        this.getGoodsList()
      }
    },
    // ✅ 监听 addpro，处理浏览器回退
    addpro(val) {
      if (val) {
        this.getGoodsList()
      }
    }
  },
  methods: {

    // 更新全部产品
    async handleUpdateAllGoods() {
      this.$confirm(
        '确定要更新全部产品吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await updateAllGoods()
          if (res.code === 200) {
            this.$message.success(res.msg || '全部产品更新成功')
            this.page = 1
            this.getGoodsList()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          console.error('更新全部产品失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => { })
    },

    // 更新商品可售卖城市
    async handleUpdateGoodsCity() {
      this.$confirm(
        '确定要更新商品可售卖城市吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await updateGoodsCity()
          if (res.code === 200) {
            this.$message.success(res.msg || '商品可售卖城市更新成功')
            this.page = 1
            this.getGoodsList()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          console.error('更新商品可售卖城市失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => { })
    },

    // 更新商品详情
    async handleUpdateGoodsDetail() {
      this.$confirm(
        '确定要更新商品详情吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await updateGoodsDetail()
          if (res.code === 200) {
            this.$message.success(res.msg || '商品详情更新成功')
            this.page = 1
            this.getGoodsList()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          console.error('更新商品详情失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => { })
    },

    // 更新全部产品数据
    async handleUpdateAllGoodsData() {
      this.$confirm(
        '确定要更新全部产品数据吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this.loading = true
        try {
          const res = await updateAllGoodsData()
          if (res.code === 200) {
            this.$message.success(res.msg || '全部产品数据更新成功')
            this.page = 1
            this.getGoodsList()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          console.error('更新全部产品数据失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        } finally {
          this.loading = false
        }
      }).catch(() => { })
    },
    // 更新单品 - 对接第三方更新单个商品
    async handleUpdateOneGoods(row) {
      this.$confirm(
        `确定要更新商品"${row.title}"的数据吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          // 传递商品ID，用于更新单个商品
          const params = new FormData()
          params.append('id', row.id)
          // 如果有第三方商品ID（goods_id），也一并传递
          if (row.goods_id) {
            params.append('goods_id', row.goods_id)
          }

          const res = await updateOneGoods(params)

          if (res.code === 200) {
            this.$message.success(res.msg || `商品"${row.title}"更新成功`)
            // 刷新列表
            this.getGoodsList()
          } else {
            this.$message.error(res.msg || '更新失败')
          }
        } catch (error) {
          console.error('更新单品失败:', error)
          const errorMsg = error.response?.data?.msg || error.message || '请稍后重试'
          this.$message.error('更新失败：' + errorMsg)
        }
      }).catch(() => {
        // 用户取消操作
      })
    },

    async changeSpecStatus(productId, specId, newStatus, specName) {
      const action = newStatus === 0 ? '上架' : '下架'
      const specText = specName || '该规格'

      // 添加确认框
      try {
        await this.$confirm(`确认${action}${specText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，回滚开关状态
        const product = this.tableData.find(item => item.id === productId)
        if (product && product.gueige) {
          const spec = product.gueige.find(s => s.ggid === specId)
          if (spec) {
            spec.deleted = newStatus === 0 ? 1 : 0
          }
        }
        return
      }

      if (this.specStatusChanging) {
        this.$message.warning('请勿重复操作')
        return
      }

      this.specStatusChanging = true

      try {
        const params = new FormData()
        params.append('ggid', specId)
        params.append('pid', productId)

        const res = await switchSpecsStatuscake(params)

        if (res.code === 200) {
          this.$message.success(`${action}成功`)

          // 更新本地数据中的规格状态
          const product = this.tableData.find(item => item.id === productId)
          if (product && product.gueige) {
            const spec = product.gueige.find(s => s.ggid === specId)
            if (spec) {
              spec.deleted = res.data.deleted
            }
          }
        } else {
          // 修改失败，回滚开关状态
          const product = this.tableData.find(item => item.id === productId)
          if (product && product.gueige) {
            const spec = product.gueige.find(s => s.ggid === specId)
            if (spec) {
              spec.deleted = newStatus === 0 ? 1 : 0
            }
          }
          this.$message.error(res.msg || `${action}失败`)
        }
      } catch (error) {
        console.error('规格状态修改失败:', error)

        // 网络错误，回滚开关状态
        const product = this.tableData.find(item => item.id === productId)
        if (product && product.gueige) {
          const spec = product.gueige.find(s => s.ggid === specId)
          if (spec) {
            spec.deleted = newStatus === 0 ? 1 : 0
          }
        }
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.specStatusChanging = false
      }
    },

    // 修改状态（发布状态/审核状态）- 带确认
    // 修改状态（发布状态/审核状态）- 带确认
    async changeSwitchStatus(row, type, newVal) {
      // newVal 是布尔值：true=开启, false=关闭
      const targetStatus = newVal ? 1 : 0

      // 确定操作类型和文本
      let actionText = ''
      if (type === 'status') {
        actionText = targetStatus === 1 ? '上架' : '下架'
      } else if (type === 'sh') {
        actionText = targetStatus === 1 ? '审核通过' : '取消审核'
      }

      // 添加确认框
      try {
        await this.$confirm(`确认将商品${actionText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，不做任何操作（开关本身没有变化）
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const params = new FormData()
        params.append('id', row.id)
        params.append('type', type)

        const res = await switchStatuscake(params)
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          // 更新本地数据
          row[type] = res.data[type]
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
        }
      } catch (error) {
        console.error('状态修改失败:', error)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.statusChanging = false
      }
    },

    // 获取产品列表
    async getGoodsList() {
      this.loading = true
      try {
        const params = new FormData()
        params.append('page', this.page)
        params.append('limit', this.limit)

        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.append('search_key', this.searchForm.search_key)
          params.append('search_val', this.searchForm.search_val)
        }
        if (this.searchForm.city_id) params.append('city_id', this.searchForm.city_id)
        if (this.searchForm.brand_id) params.append('brand_id', this.searchForm.brand_id)
        if (this.searchForm.shzt) params.append('shzt', this.searchForm.shzt)
        if (this.searchForm.sh) params.append('sh', this.searchForm.sh)
        if (this.searchForm.px_key) params.append('px_key', this.searchForm.px_key)
        if (this.searchForm.px_val) params.append('px_val', this.searchForm.px_val)

        const res = await goodsListcake(params)
        if (res.code === 200) {
          const list = res.data.data || []
          this.tableData = list.map(item => ({
            ...item,
            supplier_name: this.supplierMap[item.uid] || '-',
            gueige: item.gueige || []
          }))
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取产品列表失败:', error)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    // 获取gys
    async showSuppliercake() {
      try {
        const res = await showSuppliercake()
        if (res.code === 200) {
          this.supplierMap = {}
            ; (res.data.list || []).forEach(item => {
              this.supplierMap[item.id] = item.username
            })
        }
      } catch (error) {
        console.error('获取供应商列表失败:', error)
      }
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
    // 在 methods 中修改 getBrandList
    // async getBrandList(cityId = '') {
    //   try {
    //     const params = new FormData()
    //     // 判断是否为管理员 (flgs === '1')
    //     const isAdmin = this.flgs === '1'

    //     if (isAdmin) {
    //       params.append('flag', '1')
    //       if (cityId) {
    //         params.append('city_id', cityId)
    //       }
    //     } else {
    //       // 供应商模式
    //       params.append('flag', '3')
    //       // 根据实际项目获取当前供应商的uid
    //       const uid = this.$store.state?.user?.userInfo?.uid || localStorage.getItem('uid') || ''
    //       if (uid) {
    //         params.append('uid', uid)
    //       }
    //     }

    //     const res = await goodsBrandListcake
    //       (params)
    //     if (res.code === 200) {
    //       this.brandList = res.data || []
    //     }
    //   } catch (error) {
    //     console.error('获取品牌列表失败:', error)
    //   }
    // },
    getSupplierUid() {
      // user_info.id 就是 uid
      let uid = ''

      // 1. 从 Vuex store 中获取
      if (this.$store.state?.user?.userInfo?.id) {
        uid = this.$store.state.user.userInfo.id
        console.log('从 Vuex 获取到 uid:', uid)
        return String(uid)
      }

      // 2. 从 localStorage 获取 uid（登录时保存的）
      uid = localStorage.getItem('uid')
      if (uid && uid !== 'undefined' && uid !== 'null') {
        console.log('从 localStorage 获取到 uid:', uid)
        return String(uid)
      }

      // 3. 从 localStorage 获取 user_id（备用）
      uid = localStorage.getItem('user_id')
      if (uid && uid !== 'undefined' && uid !== 'null') {
        console.log('使用 user_id 作为 uid:', uid)
        return String(uid)
      }

      console.warn('未找到有效的 UID')
      return ''
    },
    async getBrandList(cityId = '') {
      try {
        const params = new FormData()
        const isAdmin = this.flgs === '1'

        console.log('获取品牌列表 - 用户类型:', isAdmin ? '管理员' : '供应商')

        if (isAdmin) {
          // 管理员模式
          params.append('flag', '1')
          if (cityId || this.searchForm.city_id) {
            params.append('city_id', cityId || this.searchForm.city_id)
          }
        } else {
          // 供应商模式
          params.append('flag', '3')

          const uid = this.getSupplierUid()
          console.log('供应商 UID:', uid)

          if (!uid) {
            console.error('供应商UID不存在！')
            this.$message.warning('未获取到供应商信息，请重新登录')
            return
          }

          params.append('uid', uid)

          // 供应商模式下也支持城市筛选
          if (cityId || this.searchForm.city_id) {
            params.append('city_id', cityId || this.searchForm.city_id)
          }
        }

        console.log('品牌列表请求参数:', {
          flag: params.get('flag'),
          uid: params.get('uid'),
          city_id: params.get('city_id')
        })

        const res = await goodsBrandListcake(params)
        console.log('品牌列表接口返回:', res)

        if (res.code === 200) {
          this.brandList = res.data || []
          console.log('品牌列表获取成功，数量:', this.brandList.length)
        } else {
          console.error('获取品牌列表失败:', res.msg)
          this.$message.error(res.msg || '获取品牌列表失败')
        }
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('网络错误，请稍后重试')
      }
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.getGoodsList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        city_id: '',
        brand_id: '',
        search_key: 'title',
        search_val: '',
        px_key: 'createtime',
        px_val: 'desc',
        shzt: '',
        sh: ''
      }
      this.page = 1
      this.getGoodsList()
    },

    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
      this.getGoodsList()
    },

    handleCurrentChange(val) {
      this.page = val
      this.getGoodsList()
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },



    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    addPro() {
      this.$router.push({ name: 'AddProcake' }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },

    handleEdit(row) {
      console.log('查看', row)
      // 跳转到详情页
      this.$router.push({ name: 'AddProcake', query: { id: row.id } })
    },

    // 单个删除
    handleDelete(row, index) {
      this.$confirm('确认删除该产品吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', row.id)
          const res = await delGoodscake(params)
          if (res.code === 200) {
            this.tableData.splice(index, 1)
            this.$message.success('删除成功')
            // 如果当前页没有数据了，且不是第一页，则刷新上一页
            if (this.tableData.length === 0 && this.page > 1) {
              this.page--
              this.getGoodsList()
            }
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('网络错误，请稍后重试')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的产品')
        return
      }

      const ids = this.multipleSelection.map(item => item.id).join(',')
      const names = this.multipleSelection.map(item => item.title).join('、')

      this.$confirm(`确认删除以下 ${this.multipleSelection.length} 个产品吗？<br/>${names}`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async () => {
        try {
          const params = new FormData()
          params.append('ids', ids)
          const res = await delGoodscake(params)
          if (res.code === 200) {
            this.$message.success(`成功删除 ${this.multipleSelection.length} 个产品`)
            this.getGoodsList()  // 刷新列表
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('网络错误，请稍后重试')
        }
      }).catch(() => { })
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

  .more-spec {
    font-size: 12px;
    color: #909399;
    margin-left: 4px;
  }
}

.w120 {
  width: 120px;
}

// 在 .w120 样式后面添加
.spec-list {
  .spec-item {
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    .spec-info {
      flex: 1;

      .spec-name {
        font-weight: 500;
        color: #303133;
        margin-right: 8px;
      }

      .spec-price {
        font-size: 12px;
        color: #606266;
        margin-top: 2px;

        .price-label {
          margin-right: 4px;
        }

        // .price-value {
        //   color: #e6a23c;
        // }
      }
    }

    .spec-status {
      margin-left: 12px;

      :deep(.el-switch__label) {
        font-size: 12px;
      }
    }
  }
}

.no-spec {
  color: #909399;
  font-size: 12px;
}

.fs12 {
  font-size: 12px;
}
</style>