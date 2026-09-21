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
              <span class="warningCl ml10">({{ orderData.eatTypeName }})</span>
            </span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情表格 -->
      <el-table :data="[orderData]" border style="width: 100%" :header-cell-style="headerCellStyle" class="mb20">
        <el-table-column label="订单号" align="center" width="180">
          <template>{{ orderData.entPara }}</template>
        </el-table-column>
        <el-table-column label="点餐订单号" align="center" width="200">
          <template>{{ orderData.orderCustomId }}</template>
        </el-table-column>
        <el-table-column label="商品" align="left" min-width="350">
          <template>
            <div v-for="(item, idx) in productsInfoList" :key="idx" class="goods-item">
              <div class="goods-row">
                <img :src="item.imageUrl" alt="" class="goods-img">
                <div class="goods-info">
                  <div class="goods-name">{{ item.nameCn }}</div>
                  <div class="goods-spec">{{ item.spec }}</div>
                  <div class="goods-price">
                    <span class="fs10">￥</span>{{ item.orgPrice }} * {{ item.quantity }}
                  </div>
                </div>
                <div class="goods-settle">
                  <span class="fs10">￥</span>{{ item.EpPrice }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总价" align="center" width="100">
          <template><span class="fs10">￥</span>{{ orderData.totalUserPrice }}</template>
        </el-table-column>
        <el-table-column label="佣金" align="center" width="80">
          <template><span class="fs10">￥</span>{{ orderData.epCommission }}</template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" width="160">
          <template>{{ formatTimeStr(orderData.createTime) }}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="120">
          <template>
            <span :class="getStateClass(orderData.orderState)">{{ orderData.orderStateName }}</span>
          </template>
        </el-table-column>
      </el-table>
<!-- 退款商品信息 -->
<div v-if="refundProducts.length > 0" class="mb20">
  <div class="section-title">
    部分餐品出餐失败，退款：<span class="dangerCl"><span class="fs10">￥</span>{{ orderData.refundAmount }}</span> 原价
  </div>
  <el-table :data="refundProducts" border style="width: 100%" :header-cell-style="headerCellStyle">
   
    <el-table-column label="商品名称" align="left"  >
      <template slot-scope="scope">
        <div class="goods-name">{{ scope.row.nameCn }}</div>
        <div class="goods-spec" v-if="scope.row.spec">{{ scope.row.spec }}</div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="退款金额" align="center" width="100">
      <template slot-scope="scope">
        <span class="dangerCl">￥{{ scope.row.refundAmount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="原价" align="center" width="100">
      <template slot-scope="scope">
        <span class="fs10">￥</span>{{ scope.row.orgPrice || scope.row.selPrice }}
      </template>
    </el-table-column> -->
    <el-table-column label="数量" align="center" >
      <template slot-scope="scope">{{ scope.row.quantity }}</template>
    </el-table-column>
  </el-table>
</div>
      <!-- 取餐信息 -->
      <el-table v-if="orderData.codes" :data="[{code: orderData.codes}]" border style="width: 100%" class="mb20" :header-cell-style="headerCellStyle">
        <el-table-column label="取餐信息" align="center" width="120"></el-table-column>
        <el-table-column label="取餐码" align="left">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
      </el-table>

      <!-- 返回按钮 -->
      <div class="form-actions txtleft">
        <el-button   @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getQporder } from '@/api/modules/myorder'

export default {
  name: 'QipiaoOrderdetails',
  data() {
    return {
      loading: false,
      orderData: {},
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
    return this.productsInfoList.filter(item => item.hasRefund)
  },
    shopInfo() {
      const data = this.orderData
      return [
        { label: '栏目', value: data.orderTypeName || '-' },
        { label: '门店名称', value: `${data.shopCode || ''} - ${data.shopName || ''} (${data.cityName || ''})` },
        { label: '门店位置', value: data.address || '-' }
      ]
    },
    productsInfoList() {
      if (!this.orderData.productsInfo) return []
      try {
        return typeof this.orderData.productsInfo === 'string' 
          ? JSON.parse(this.orderData.productsInfo) 
          : this.orderData.productsInfo
      } catch (e) {
        return []
      }
    }
  },
  methods: {
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        this.$message.error('缺少订单ID')
        return
      }

      this.loading = true
      try {
        const res = await getQporder({ id })
        if (res.code === 200) {
          this.orderData = res.data.order_show || {}
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

    getStateClass(state) {
      if ([3].includes(Number(state))) return 'successCl'
      if ([0, 1, 2, 11, 12].includes(Number(state))) return 'warningCl'
      if ([4, 5, 6, 7].includes(Number(state))) return 'dangerCl'
      return ''
    },

    formatTimeStr(timeStr) {
      if (!timeStr) return '-'
      return timeStr.replace('T', ' ').substring(0, 19)
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

.mb20 { margin-bottom: 20px; }
.ml10 { margin-left: 10px; }
.txtcenter { text-align: center; }
.fs10 { font-size: 10px; }

.warningCl { color: #E6A23C; }
.dangerCl { color: #F56C6C; }
.successCl { color: #67C23A; }

.goods-item {
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.goods-item:last-child { border-bottom: none; }

.goods-row {
  display: flex;
  align-items: center;
}

.goods-img {
  width: 60px; height: 60px;
  object-fit: cover; border-radius: 4px; margin-right: 10px; flex-shrink: 0;
}

.goods-info {
  flex: 1; text-align: left;
}

.goods-name {
  color: #333; font-weight: 500; margin-bottom: 4px;
}

.goods-spec {
  color: #999; font-size: 12px; margin-bottom: 4px; line-height: 1.4;
}

.goods-price {
  color: #666; font-size: 13px;
}

.goods-settle {
  color: #E6A23C; font-weight: 500; font-size: 14px;
  margin-left: 20px; flex-shrink: 0; min-width: 80px; text-align: center;
}

.form-actions {
  padding: 15px 0;
}
</style>