<template>
  <div class="list-container titles">
    <el-card class="search-card">
      <!-- 基本信息表格 -->
      <el-table :data="basicInfo" border style="width: 100%" :header-cell-style="headerCellStyle" class="mb20">
        <el-table-column prop="label" label="基本信息" align="center" width="120"></el-table-column>
        <el-table-column prop="value" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.label === '门店名称'">
              {{ scope.row.value }}
              <span class="warningCl ml10">({{ packFlagName }})</span>
            </span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情表格 -->
      <el-table :data="orderDetailTable" border style="width: 100%" :header-cell-style="headerCellStyle" class="mb20">
        <el-table-column label="订单号" align="center" width="180">
          <template slot-scope="scope">{{ scope.row.third_orderid }}</template>
        </el-table-column>
        <el-table-column label="点餐订单号" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.orderid }}</template>
        </el-table-column>
        <el-table-column label="下单用户" align="center" width="100">
          <template slot-scope="scope">
          <span 
      v-if="scope.row.uid"
      style="cursor: pointer; color: #409EFF;" 
      @click="viewUser(scope.row.uid)"
    >
      {{ scope.row.uid }}
    </span>
    <span v-else>-</span>
            
          </template>
        </el-table-column>
        <el-table-column label="商品" align="left" min-width="350">
          <template slot-scope="scope">
            <!-- type=2 奇票商品 -->
            <div v-if="orderData.type == 2">
              <div v-for="(item, idx) in productsInfoList" :key="idx" class="goods-item">
                <div class="goods-row">
                  <img :src="item.imageUrl" alt="" class="goods-img">
                  <div class="goods-info">
                    <div class="goods-name">{{ item.nameCn }}</div>
                    <div class="goods-spec">{{ item.spec }}</div>
                    <div class="goods-price">
                      <span class="fs10">￥</span>{{ item.orgPrice || item.selPrice }} * {{ item.quantity }}
                    </div>
                  </div>
                  <div class="goods-cost-col">
                    <span class="fs10">￥</span>{{ item.EpPrice }}
                  </div>
                </div>
              </div>
            </div>
            <!-- type=1 蚂蚁星球商品 -->
            <div v-else-if="orderData.type == 1">
              <div v-for="(item, idx) in goodsDataList" :key="idx" class="goods-item">
                <div class="goods-row">
                  <img :src="item.itemImage" alt="" class="goods-img">
                  <div class="goods-info">
                    <div class="goods-name">{{ item.itemName }}</div>
                    <div class="goods-spec">{{ item.listname }}</div>
                    <div class="goods-price">
                      <span class="fs10">￥</span>{{ item.discountPrice || item.sumprice }} * {{ item.quantity }}
                    </div>
                  </div>
                  <div class="goods-cost-col">
                    <span class="fs10">￥</span>{{ item.amount }}
                  </div>
                </div>
              </div>
            </div>
            <!-- type=3 岚廷商品 -->
            <!-- type=3 岚廷商品 -->
            <div v-else-if="orderData.type == 3">
              <div v-for="(item, idx) in ltProductsList" :key="idx" class="goods-item">
                <div class="goods-row">
                  <img :src="item.goodsImage" alt="" class="goods-img">
                  <div class="goods-info">
                    <div class="goods-name">{{ item.goodsName }}</div>
                    <div class="goods-spec">{{ item.specName }}</div>
                    <div class="goods-price">
                      <span class="fs10">￥</span>{{ (item.originalPrice / 100).toFixed(2) }} * {{ item.quantity }}
                    </div>
                  </div>
                  <div class="goods-cost-col">
                    <span class="fs10">￥</span>{{ (item.salesPrice / 100).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总价" align="center" width="100">
          <template slot-scope="scope">
            <span class="fs10">￥</span>{{ scope.row.zongji }}
          </template>
        </el-table-column>
        <!-- type=2 奇票显示佣金 -->
        <el-table-column v-if="orderData.type == 2" label="佣金" align="center" width="80">
          <template slot-scope="scope">
            <span class="fs10">￥</span>{{ order_show.epCommission }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" width="160">
          <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="120">
          <template slot-scope="scope">
            <span :class="getStatusClass(orderStatus)">{{ orderStatusStr }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <!-- 退款商品信息 -->
     <!-- 退款商品信息 -->
<div v-if="hasRefundInfo" class="mb20">
  <!-- 岚廷 type=3 -->
  <template v-if="orderData.type == 3">
    <div class="section-title">部分餐品出餐失败</div>
    <el-table :data="refundProducts" border style="width: 100%" :header-cell-style="headerCellStyle">
      <el-table-column label="商品名称" align="left" min-width="200">
        <template slot-scope="scope">{{ scope.row.goodsName }}</template>
      </el-table-column>
      <el-table-column label="商品金额" align="center" width="120">
        <template slot-scope="scope">
          <span class="fs10">￥</span>{{ (scope.row.goodsAmount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="退款商品名称" align="left" min-width="200">
        <template slot-scope="scope">{{ scope.row.refundGoodsName }}</template>
      </el-table-column>
      <el-table-column label="退款成本" align="center" width="100">
        <template slot-scope="scope">
          <span class="fs10">￥</span>{{ (scope.row.refundCostPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center" width="100">
        <template slot-scope="scope">
          <span class="dangerCl"><span class="fs10">￥</span>{{ (scope.row.refundAmount / 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </template>

  <!-- 其他平台 type=1、type=2 -->
  <template v-else>
    <div class="section-title">
      退款商品（退款金额：<span class="dangerCl"><span class="fs10">￥</span>{{ refundAmount }}</span>）
    </div>
    <el-table :data="refundProducts" border style="width: 100%" :header-cell-style="headerCellStyle">
      <el-table-column label="商品名称" align="left">
        <template slot-scope="scope">
          <div>
            <div class="goods-name">{{ getRefundProductName(scope.row) }}</div>
            <div class="goods-spec" v-if="getRefundProductSpec(scope.row)">
              {{ getRefundProductSpec(scope.row) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">{{ getRefundProductQuantity(scope.row) }}</template>
      </el-table-column>
    </el-table>
  </template>
</div>
      <!-- 取餐信息 -->
      <el-table v-if="takeCodes.length > 0" :data="[{ code: takeCodes.join('，') }]" border style="width: 100%"
        class="mb20" :header-cell-style="headerCellStyle">
        <!-- <el-table-column label="取餐信息" align="center" width="120"></el-table-column> -->
        <el-table-column label="取餐码" align="left">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
      </el-table>

      <!-- 配送信息（外送订单显示） -->
      <div v-if="orderData.packFlag == 2 && hasDeliveryInfo" class="mb20">
        <!-- <div class="section-title">配送信息</div> -->
        <el-table :data="deliveryInfo" border style="width: 100%" :header-cell-style="headerCellStyle">
          <el-table-column prop="label" label="配送信息" align="center" width="120"></el-table-column>
          <el-table-column prop="value" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.label === '快递员位置'">
                <a :href="order_show.courierLocationH5" target="_blank"
                  style="color: #666666;cursor: pointer;text-decoration: none;"
                  v-if="order_show.courierLocationH5">查看</a>
                <span v-else>-</span>
              </span>
              <span v-else-if="scope.row.label === '经纬度'">
                {{ addressShow.lng }},{{ addressShow.lat }}
              </span>
              <span v-else-if="scope.row.label === '地址创建'">
                {{ formatTime(addressShow.created_at) }}
              </span>
              <span v-else>{{ scope.row.value }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 支付信息 -->
      <div class="payment-info mb20" v-if="fuliList.length > 0">
        <div class="pay-title"><strong>支付信息</strong></div>
        <div class="pay-content" v-for="item in fuliList" :key="item.id">
          <span class="warningCl">{{ getCardType(item.pid) }}</span>
          {{ item.num }}
          余额：<span class="fs10">￥</span>{{ item.price }}
          扣除： <span class="fs10">￥</span>{{ item.kc }}

          <el-button type="danger" size="mini" v-if="isadmin == 1" style="margin-left: 10px;margin-right: 10px;"
            @click="openFuliEdit(item)">修改</el-button>
        </div>
      </div>
      <UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />
      <fuli-edit-drawer :drawer-visible.sync="fuliDrawerVisible" :fuli-data="currentFuliData"
        @success="onFuliEditSuccess" @close="onFuliEditClose" />
      <!-- 返回按钮 -->
      <div class="form-actions txtleft">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog.vue'  //   新增
import { getOrder } from '@/api/modules/myorder'
import FuliEditDrawer from '@/components/FuliEditDrawer.vue'
export default {
  components: {
    FuliEditDrawer,UserDetailDialog  
  },
  name: 'MealOrderListdetails',
  data() {
    return {
       userDialogVisible: false,  //  新增
    currentUserId: '',         //  新增
      fuliDrawerVisible: false,   // 新增
      currentFuliData: {},        // 新增
      isadmin: localStorage.getItem('is_super_admin'),
      loading: false,
      orderData: {},
      order_show: {},
      addressShow: {},
      fuliList: [],
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266'
      }
    }
  },
  mounted() {
    this.loadData()
  },
  computed: {
    // 退款金额
    // 岚廷商品列表
    ltProductsList() {
      return this.order_show.orderDetails || []
    },
    refundAmount() {
      if (this.orderData.type == 1) {
        const price = this.order_show.returnprice
        return price && price != 0 && price != '0.00' ? price : 0
      }
      if (this.orderData.type == 2) {
        const amount = this.order_show.refundAmount
        return amount && amount != 0 && amount != '0.00' ? amount : 0
      }
      if (this.orderData.type == 3) {
        // 岚廷：直接用 orderData.returnprice
        const price = this.orderData.returnprice
        return price && price != 0 && price != '0.00' ? price : 0
      }
      return 0
    },

    // 退款商品列表
    refundProducts() {
      if (this.orderData.type == 1) {
        // 蚂蚁星球：order_show.refundAll
        return this.order_show.refundAll || []
      }
      if (this.orderData.type == 2) {
        // 奇票：productsInfo中hasRefund=true的商品
        return this.productsInfoList.filter(item => item.hasRefund)
      }
      if (this.orderData.type == 3) {
        // 岚廷：order_show.refundList
        return this.order_show.refundList || []
      }
      return []
    },

    // 是否显示退款信息
    hasRefundInfo() {
      return this.refundAmount > 0 && this.refundProducts.length > 0
    },
    // 订单状态：type=1 优先用 order_show
    orderStatus() {
      if (this.orderData.type == 1) {
        return this.order_show.status || this.orderData.status
      }
      return this.orderData.status
    },
    // 订单状态文字
    orderStatusStr() {
      if (this.orderData.type == 1) {
        return this.order_show.statusstr || this.orderData.statusstr
      }
      return this.orderData.statusstr
    },
    basicInfo() {
      const data = this.orderData
      const show = this.order_show

      // 门店名称组合：根据 type 不同
      let storeNameValue = ''

      if (data.type == 2) {
        // type=2: shopCode - storeName (cityName)
        const shopCode = show.shopCode || data.storeId || ''
        const cityName = show.cityName || ''
        storeNameValue = `${shopCode} - ${data.storeName || ''} (${cityName})`
      } else if (data.type == 1) {
        // type=1: storeId - storeName
        const storeId = show.storeId || data.storeId || ''
        storeNameValue = `${storeId} - ${data.storeName || ''}`
      } else {
        storeNameValue = data.storeName || ''
      }

      return [
        { label: '下单位置', value: this.getTypeName(data.type) },
        { label: '栏目', value: this.getPfName(data.pf) },
        { label: '店铺信息', value: '' },
        { label: '门店名称', value: storeNameValue },
        { label: '门店位置', value: data.storeAddress || '-' }
      ]
    },
    hasDeliveryInfo() {
      const addr = this.addressShow
      return addr && (addr.address_id || addr.receiver || addr.mobile)
    },
    deliveryInfo() {
      const addr = this.addressShow
      return [
        { label: '配送状态', value: this.order_show.delivery || '-' },
        { label: '快递员位置', value: '' },
        { label: '配送费', value: '￥' + (this.order_show.deliveryPrice || '0') },
        { label: '联系人', value: `${addr.address_id || '-'} - ${addr.receiver || '-'}` },
        { label: '电话', value: `${addr.mobile || '-'} - ${addr.sex == '1' ? '先生' : '女士'}` },
        { label: '区域', value: addr.area || addr.address || '-' },
        { label: '地址', value: addr.address || '-' },
        { label: '门牌号', value: addr.detail || '-' },
        { label: '经纬度', value: '' },
        { label: '地址创建', value: '' }
      ]
    },
    orderDetailTable() {
      if (!this.orderData.id) return []
      return [this.orderData]
    },
    productsInfoList() {
      return this.order_show.productsInfo || []
    },
    goodsDataList() {
      return this.order_show.goodsdata || []
    },
    takeCodes() {
      if (this.order_show.codes) {
        const codes = this.order_show.codes.split(',').filter(code => code.trim())
        if (codes.length > 0) return codes
      }
      if (this.order_show.takeCode && Array.isArray(this.order_show.takeCode)) {
        return this.order_show.takeCode.filter(code => code)
      }
      return []
    },
    packFlagName() {
      const map = { 0: '堂食', 1: '打包', 2: '外送' }
      return map[this.orderData.packFlag] || ''
    }
  },
  methods: {
viewUser(uid) {
  this.currentUserId = uid
  this.userDialogVisible = true
},
    // 获取退款商品退款金额
    getRefundProductAmount(item) {
      // 蚂蚁星球：refundAmount
      if (this.orderData.type == 1) {
        return item.refundAmount || 0
      }
      // 奇票
      return item.refundAmount || 0
    },

    // 获取退款商品原价
    getRefundProductOriginPrice(item) {
      // 蚂蚁星球：unitPrice
      if (this.orderData.type == 1) {
        return item.unitPrice || item.totalPrice || 0
      }
      // 奇票
      return item.orgPrice || item.selPrice || 0
    },

    getRefundProductName(item) {
      if (this.orderData.type == 1) {
        return item.goodsName || item.refundGoodsName || item.itemName || ''
      }
      if (this.orderData.type == 2) {
        return item.nameCn || ''
      }
      // 岚廷
      if (this.orderData.type == 3) {
        return item.goodsName || item.refundGoodsName || ''
      }
      return ''
    },

    getRefundProductSpec(item) {
      if (this.orderData.type == 1 && item.refundGoodsName) {
        return item.refundGoodsName
      }
      if (this.orderData.type == 2) {
        return item.spec || item.config || ''
      }
      // 岚廷
      if (this.orderData.type == 3) {
        return item.refundGoodsName || ''
      }
      return ''
    },

    getRefundProductAmount(item) {
      if (this.orderData.type == 1) {
        return item.refundAmount || 0
      }
      if (this.orderData.type == 2) {
        return item.refundAmount || 0
      }
      // 岚廷：金额是分，需要除以100
      if (this.orderData.type == 3) {
        return item.refundAmount ? (item.refundAmount / 100).toFixed(2) : 0
      }
      return 0
    },

    getRefundProductQuantity(item) {
      if (this.orderData.type == 1) {
        return item.refundNum || 1
      }
      if (this.orderData.type == 2) {
        return item.quantity || 1
      }
      // 岚廷：默认1
      if (this.orderData.type == 3) {
        return 1
      }
      return 1
    },

    // 获取退款商品图片
    getRefundProductImage(item) {
      // 蚂蚁星球：refundAll中没有图片字段，需要从goodsdata中匹配
      if (this.orderData.type == 1 && item.goodsId) {
        const goodsData = this.goodsDataList.find(g => g.linkId == item.goodsId)
        if (goodsData) {
          return goodsData.itemImage || ''
        }
      }
      // 奇票
      return item.imageUrl || ''
    },







    // 获取退款商品数量

    openFuliEdit(fuli) {
      this.currentFuliData = { ...fuli }
      this.fuliDrawerVisible = true
    },

    // 福利卡修改成功回调
    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.loadData()  // 刷新订单详情
    },

    // 福利卡弹窗关闭
    onFuliEditClose() {
      this.currentFuliData = {}
    },
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        this.$message.error('缺少订单ID')
        return
      }

      this.loading = true
      try {
        const res = await getOrder({ id })
        if (res.code === 200) {
          this.orderData = res.data.order || {}
          this.order_show = res.data.order_show || {}
          this.addressShow = res.data.address_show || {}
          this.fuliList = res.data.order?.fuli_list || []
        } else {
          this.$message.error(res.msg || '获取订单详情失败')
        }
      } catch (error) {
        console.error('获取订单详情失败:', error)
        this.$message.error('获取订单详情失败')
      } finally {
        this.loading = false
      }
    },

    getTypeName(type) {
      const map = { 1: '蚂蚁星球', 2: '奇票', 3: '岚廷' }
      return map[type] || '未知'
    },

    getPfName(pf) {
      const map = {
        kfc: '肯德基', mdl: '麦当劳', bsk: '必胜客',
        xbk: '星巴克', nx: '奈雪的茶', rxkf: '瑞幸咖啡',
        kd: '库迪', tas: '塔斯汀'
      }
      return map[pf] || pf
    },

    getCardType(pid) {
      const map = { 1: '超级卡', 2: '蛋糕卡', 6: '蛋糕卡' }
      return map[pid] || '福利卡'
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

    getStatusClass(status) {
      if ([3, 4].includes(status)) return 'successCl'
      if ([0, 1, 2, 11, 12, 13].includes(status)) return 'warningCl'
      if ([5, 7, 10, 20, 40].includes(status)) return 'dangerCl'
      return ''
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.list-container {
  font-size: 14px;
  padding: 20px;
}

.mb20 {
  margin-bottom: 20px;
}

.ml10 {
  margin-left: 10px;
}

.txtcenter {
  text-align: center;
}

.fs10 {
  font-size: 10px;
}

.warningCl {
  color: #E6A23C;
}

.dangerCl {
  color: #F56C6C;
}

.successCl {
  color: #67C23A;
}

.section-title {
  background: #f5f7fa;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-bottom: none;
  font-weight: bold;
  font-size: 14px;
}

.goods-item {
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-row {
  display: flex;
  align-items: center;
}

.goods-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  text-align: left;
}

.goods-name {
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.goods-spec {
  color: #666666;
  font-size: 12px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.goods-price {
  color: #666;
  font-size: 13px;
}

.goods-cost-col {
  color: #E6A23C;
  font-weight: 500;
  font-size: 14px;
  margin-left: 20px;
  flex-shrink: 0;
  min-width: 80px;
  text-align: center;
}

.payment-info {
  text-align: left;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pay-title {
  background: #f5f7fa;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
}

.pay-content {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.pay-content:last-child {
  border-bottom: none;
}

.form-actions {
  padding: 15px 0;
}
</style>