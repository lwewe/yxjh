<template>
  <div class="list-container titles">
    <el-card class="search-card">
      <!-- 店铺信息表格 -->
      <el-table :data="shopInfo" border style="width: 100%" :header-cell-style="headerCellStyle" class="mb20">
        <el-table-column prop="label" label="店铺信息" align="center" width="120"></el-table-column>
        <el-table-column prop="value" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.label === '门店名称'">
              {{ scope.row.value }}
              <span class="warningCl ml10">({{ orderData.orderCode == 2 ? '外送' : '自取' }})</span>
            </span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情表格 -->
      <!-- 订单详情表格 -->
      <el-table :data="[orderData]" border style="width: 100%" :header-cell-style="headerCellStyle" class="mb20">
        <el-table-column label="订单号" align="center" width="180">
          <template>{{ orderData.third_orderid }}</template>
        </el-table-column>
        <el-table-column label="点餐订单号" align="center" width="190">
          <template>{{ orderData.orderid }}</template>
        </el-table-column>
        <el-table-column label="下单用户" align="center" width="90">
          <template>{{ orderData.uid }}</template>
        </el-table-column>
        <el-table-column label="商品" align="left" min-width="300">
          <template>
            <div v-for="(item, idx) in goodsDataList" :key="idx" class="goods-item">
              <div class="goods-row">
                <img :src="item.itemImage" alt="" class="goods-img">
                <div class="goods-info">
                  <div class="goods-name">{{ item.itemName }}</div>
                  <div class="goods-spec">{{ item.listname }}</div>
                  <div class="goods-price">
                    <span class="fs10">￥</span>{{ item.amount }} * {{ item.quantity }}
                  </div>
                </div>
                <div class="goods-delivery" v-if="idx === 0">
                  <span class="fs10">￥</span>{{ orderData.deliveryPrice }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="渠道总价" align="center" width="100">
          <template><span class="fs10">￥</span>{{ orderData.price }}</template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" width="160">
          <template>{{ formatTime(orderData.createdtime) }}</template>
        </el-table-column>
        <!-- 时间列 -->
        <el-table-column label="时间" align="center" width="160">

          <template>{{ formatTime(orderData.updatedtime) }}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="110">
          <template>
            <span :class="getStatusClass(orderData.status)">{{ orderData.statusstr }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table v-if="orderData.returnprice > 0" :data="refundInfo" border style="width: 100%" class="mb20"
        :header-cell-style="headerCellStyle">
        <el-table-column prop="label" label="退款信息" align="center" width="160"></el-table-column>
        <el-table-column prop="value" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.label === '退款'">
              <span class="fs10">￥</span>{{ orderData.returnprice }} <span class="ml10">平台</span>
            </span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table> -->
      <!-- 退款商品信息 -->
<div v-if="refundProducts.length > 0" class="mb20">
  <div class="section-title">
    部分餐品出餐失败，退款：<span class="dangerCl"><span class="fs10">￥</span>{{ orderData.returnprice }}</span> 平台价
  </div>
  <el-table :data="refundProducts" border style="width: 100%" :header-cell-style="headerCellStyle">
    <!-- <el-table-column label="商品图片" align="center" width="80">
      <template slot-scope="scope">
        <img :src="getRefundProductImage(scope.row)" alt="" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
             v-if="getRefundProductImage(scope.row)">
        <span v-else>-</span>
      </template>
    </el-table-column> -->
    <el-table-column label="商品名称" align="left"  >
      <template slot-scope="scope">
        <div class="goods-name">{{ scope.row.goodsName }}</div>
        <div class="goods-spec">{{ scope.row.refundGoodsName }}</div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="退款金额" align="center" width="100">
      <template slot-scope="scope">
        <span class="dangerCl">￥{{ scope.row.refundAmount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="原价" align="center" width="100">
      <template slot-scope="scope">
        <span class="fs10">￥</span>{{ getRefundProductOriginPrice(scope.row) }}
      </template>
    </el-table-column> -->
    <el-table-column label="数量" align="center" >
      <template slot-scope="scope">{{ scope.row.refundNum }}</template>
    </el-table-column>
  </el-table>
</div>
      <!-- 取餐信息 -->
      <el-table v-if="takeCodes.length > 0" :data="takeCodes" border style="width: 100%" class="mb20"
        :header-cell-style="headerCellStyle">
        <!-- <el-table-column label="取餐信息" align="center" width="120"></el-table-column> -->
        <el-table-column label="取餐码" align="left">
          <template slot-scope="scope">{{ scope.row }}</template>
        </el-table-column>
      </el-table>

      <!-- 配送信息（外送订单显示） -->
      <div v-if="orderData.orderCode == 2 && hasDeliveryInfo" class="mb20">
        <!-- <div class="section-title">配送信息</div> -->
        <el-table :data="deliveryInfo" border style="width: 100%" :header-cell-style="headerCellStyle">
          <el-table-column prop="label" label="配送信息" align="center" width="120"></el-table-column>
          <el-table-column prop="value" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.label === '快递员位置'">
                <a :href="orderData.courierLocationH5" target="_blank" style="color: #222222;text-decoration: none;"
                  v-if="orderData.courierLocationH5">查看</a>
                <span v-else>-</span>
              </span>
              <span v-else-if="scope.row.label === '配送费'">
                <span class="fs10">￥</span>{{ orderData.deliveryPrice || '0' }}
              </span>
              <span v-else>{{ scope.row.value }}</span>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 返回按钮 -->
      <div class="form-actions txtleft">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMyorder } from '@/api/modules/myorder'

export default {
  name: 'AntOrderdetails',
  data() {
    return {
      loading: false,
      orderData: {},
      addressShow: {},
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
     refundProducts() {
    return this.orderData.refundAll || []
  },
    refundInfo() {
      return [
        { label: '部分餐品出餐失败', value: '' },
        { label: '退款', value: '' }
      ]
    },
    shopInfo() {
      const data = this.orderData
      return [
        { label: '门店名称', value: `${data.storeId || ''} - ${data.storeName || ''}` },
        { label: '门店位置', value: data.storeAddress || '-' }
      ]
    },
    goodsDataList() {
      return this.orderData.goodsdata || []
    },
    takeCodes() {
      if (this.orderData.takeCode && Array.isArray(this.orderData.takeCode)) {
        return this.orderData.takeCode.filter(code => code)
      }
      return []
    },
    hasDeliveryInfo() {
      const addr = this.addressShow
      return addr && (addr.address_id || addr.receiver || addr.mobile)
    },
    deliveryInfo() {
      const addr = this.addressShow
      return [
        { label: '配送状态', value: this.orderData.delivery || '-' },
        { label: '快递员位置', value: '' },
        { label: '配送费', value: '￥' + (this.orderData.deliveryPrice || '0') },
        { label: '联系人', value: `${addr.address_id || '-'} - ${addr.receiver || '-'}` },
        { label: '电话', value: `${addr.mobile || '-'} - ${addr.sex == '1' ? '先生' : '女士'}` },
        { label: '区域', value: addr.area || addr.address || '-' },
        { label: '地址', value: addr.address || '-' },
        { label: '门牌号', value: addr.detail || '-' },
        { label: '经纬度', value: `${addr.lng},${addr.lat}` },
        { label: '时间', value: this.formatTime(addr.created_at) }
      ]
    }
  },
  methods: {
     // 获取退款商品图片（通过goodsId匹配goodsdata中的图片）
  getRefundProductImage(refundItem) {
    const goodsData = this.goodsDataList.find(g => g.linkId == refundItem.goodsId)
    return goodsData ? goodsData.itemImage : ''
  },

  // 获取退款商品的原价显示（优先显示unitPrice）
  getRefundProductOriginPrice(item) {
    return item.unitPrice || item.totalPrice || 0
  },
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        this.$message.error('缺少订单ID')
        return
      }

      this.loading = true
      try {
        const res = await getMyorder({ orderid: id })
        if (res.code === 200) {
          this.orderData = res.data.order_show || {}
          this.addressShow = res.data.address_show || {}
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

    getStatusClass(status) {
      if ([3, 4].includes(Number(status))) return 'successCl'
      if ([0, 1, 2].includes(Number(status))) return 'warningCl'
      if ([5, 7, 10].includes(Number(status))) return 'dangerCl'
      return ''
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
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.goods-price {
  color: #666;
  font-size: 13px;
}

.goods-delivery {
  color: #E6A23C;
  font-weight: 500;
  font-size: 14px;
  margin-left: 15px;
  flex-shrink: 0;
  min-width: 70px;
  text-align: center;
}

.goods-time {
  color: #999;
  font-size: 12px;
  margin-left: 15px;
  flex-shrink: 0;
  min-width: 140px;
  text-align: center;
}

.form-actions {
  padding: 15px 0;
}
</style>