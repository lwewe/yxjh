<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 图书明细表格 -->

      <el-table :data="infoList" border style="width: 100%" :header-cell-style="headerCellStyle"
        :span-method="mergeRow">
        <!-- 订单号 -->
        <el-table-column label="订单号" align="left" width="220">
          <template slot-scope="scope">{{ orderShow.ordersn }}</template>
        </el-table-column>
        <!-- 下单用户 -->
        <el-table-column label="下单用户" align="center" width="100">
          <template slot-scope="scope">
            <span @click="showUserDetail(orderShow.uid)">{{ orderShow.uid }}</span>
          </template>
        </el-table-column>
        <!-- 图片 -->
        <el-table-column width="80">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="width:50px;height:50px;object-fit:contain;">
          </template>
        </el-table-column>
        <!-- 书名 -->
        <el-table-column label="书名" align="left" min-width="280">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <!-- 书号/数量 -->
        <el-table-column label="书号/数量" align="center" width="160">
          <template slot-scope="scope">{{ scope.row.isbn }} * {{ scope.row.quantity }}</template>
        </el-table-column>
        <!-- 协议价 -->
        <el-table-column label="协议价" align="center" width="90">
          <template slot-scope="scope"><span class="fs10">￥</span>{{ scope.row.sellprice }}</template>
        </el-table-column>
        <!-- 原价 -->
        <el-table-column label="原价" align="center" width="90">
          <template slot-scope="scope"><span class="fs10">￥</span>{{ scope.row.price }}</template>
        </el-table-column>
        <!-- 售价 -->
        <el-table-column label="售价" align="center" width="90">
          <template slot-scope="scope"><span class="fs10">￥</span>{{ scope.row.jiage }}</template>
        </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" align="center" width="170">
          <template slot-scope="scope">{{ formatTime(orderShow.add_time) }}</template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" align="center" width="90">
          <template slot-scope="scope">
            <span :style="{ color: getStateColor(orderShow.state) }">{{ orderShow.status_text }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 快递信息 -->
      <el-table v-if="orderShow.packages && orderShow.packages.length > 0" :data="orderShow.packages" border
        style="width:100%;margin-top:-1px;" :header-cell-style="headerCellStyle">
        <el-table-column label="快递单号" align="center">
          <template slot-scope="scope">{{ scope.row.delivery_no }}</template>
        </el-table-column>
        <el-table-column label="快递公司" align="center">
          <template slot-scope="scope">{{ scope.row.delivery_name }}</template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.delivery_time) }}</template>
        </el-table-column>
      </el-table>

      <!-- 订单备注 -->
      <div style="padding:10px;background:#fff;border:1px solid #ebeef5;border-top:none;">
        订单备注：{{ orderShow.remark || '无' }}
      </div>

      <!-- 价格信息 -->
      <el-table :data="[orderShow]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle">
        <el-table-column label="价格信息" align="left">
          <template slot-scope="scope">
            <div class="dflex">


              <div class="info-row"><span class="info-label">协议价金额：</span><span class="info-value"><span
                    class="fs10">￥</span>{{ scope.row.jine
                    }}</span></div>
              <div class="info-row"><span class="info-label">原价总金额：</span><span class="info-value"><span
                    class="fs10">￥</span>{{ scope.row.price
                    }}</span></div>
              <div class="info-row"><span class="info-label">售价总金额：</span><span class="info-value"><span
                    class="fs10">￥</span>{{ scope.row.havepay
                    }}</span></div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 收货信息 -->
      <el-table :data="[orderShow]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle">
        <el-table-column label="收货信息" align="left">
          <template slot-scope="scope">
            <div class="info-row"><span class="info-label">买家昵称：</span><span class="info-value">{{ scope.row.nicheng
            }}</span></div>
            <div class="info-row"><span class="info-label">姓名：</span><span class="info-value">{{ scope.row.name
            }}</span></div>
            <div class="info-row"><span class="info-label">电话：</span><span class="info-value">{{ scope.row.phone
            }}</span></div>
            <div class="info-row"><span class="info-label">收货地址：</span><span class="info-value">{{ scope.row.province
            }}{{ scope.row.city }}{{ scope.row.area }} {{ scope.row.address }}</span></div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 支付信息 -->
      <el-table :data="[orderShow]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle"
        v-if="fuliList.length > 0 || orderShow.total_fee > 0">
        <el-table-column label="支付信息" align="left">
          <template slot-scope="scope">
            <div v-for="(item, index) in fuliList" :key="index" class="info-row">
              <span class="info-label">福利卡：</span>
              <span class="info-value">
                <span class="warningCl">{{ getCardType(item.pid) }}</span>
                {{ item.num }}

                <span class="pl10 dspb ">余额：<span class="fs10">￥</span>{{ item.price }} </span>
                <span class="pl10 dspb">扣除： <span class="fs10">￥</span>{{ item.kc || item.deductPrice }}</span>

                <el-button type="primary" size="mini" @click="openFuliEdit(item)">修改</el-button>
              </span>
            </div>
            <div v-if="scope.row.total_fee > 0" class="info-row">
              <span class="info-label">微信支付：</span>
              <span class="info-value"><span class="fs10">￥</span>{{ scope.row.total_fee }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
<FuliEditDrawer :drawer-visible.sync="fuliEditVisible" :fuli-data="currentCard" 
  @success="onFuliEditSuccess" @close="onFuliEditClose" />
<UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />
      <!-- 返回按钮 -->
      <div class="form-actions mt20" style="text-align:left;">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>

    <!-- 修改福利卡抽屉 -->

  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog'
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { getTsorder } from '@/api/modules/orders'

export default {
   components: { UserDetailDialog, FuliEditDrawer },
  name: 'BookOrderdetails',
  data() {
    return {
      userDialogVisible: false,   // 添加
    currentUserId: '',          // 添加
    fuliEditVisible: false,     // 添加
    currentCard: {},            // 添加
    loading: false,
    orderShow: {},
    infoList: [],
    fuliList: [],
    headerCellStyle: { background: '#f5f7fa', color: '#606266' },
      loading: false,
      orderShow: {},
      infoList: [],
      fuliList: [],
      // drawer: false,
      // direction: 'rtl',
      headerCellStyle: { background: '#f5f7fa', color: '#606266' },
      // cardInfo: { id: '', kh: '', mm: '', price: '0.00', addtype: '1', addprice: '', gid: null, shop: 0, activeStatus: '已绑定', exchangeUser: '' },
      // categoryOptions: [
      //   { value: 913, label: '913-北京首创大气环境科技股份有限公司-冯伟伦[超级卡]' },
      //   { value: 690, label: '690-北京市大兴区第九幼儿园-韩子翰[超级卡]' }
      // ]
    }
  },
  mounted() {


    this.loadOrderDetail()
  },
  methods: {
    showUserDetail(uid) {
    this.currentUserId = uid
    this.userDialogVisible = true
  },
  
  // 添加
  openFuliEdit(card) {
    this.currentCard = { ...card }
    this.fuliEditVisible = true
  },
  
  // 添加
  onFuliEditSuccess(data) {
    console.log('福利卡修改成功:', data)
    this.loadOrderDetail()
  },
  
  // 添加
  onFuliEditClose() {
    this.currentCard = {}
  },
    mergeRow({ row, column, rowIndex, columnIndex }) {
      // 订单号(0)、下单用户(1)、下单时间(8)、状态(9) 合并
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 8 || columnIndex === 9) {
        if (rowIndex === 0) {
          return { rowspan: this.infoList.length, colspan: 1 }
        }
        return { rowspan: 0, colspan: 0 }
      }
    },
    getStateColor(s) {
      return { 0: '#409EFF', 1: '#E6A23C', 2: '#67C23A', 3: '#E6A23C', 4: '#909399', 5: '#909399' }[s] || '#303133'
    },
    async loadOrderDetail() {
      const orderId = this.$route.params.id
      if (!orderId) { this.$message.error('订单ID不存在'); return }
      this.loading = true
      try {
        const res = await getTsorder({ id: orderId })
        if (res.code === 200) {
          this.orderShow = res.data.order_show
          this.infoList = res.data.info_list || []
          this.parseFuliData(res.data.order_show)
        } else { this.$message.error(res.msg || '获取订单详情失败') }
      } catch (error) { this.$message.error('获取订单详情失败') }
      finally { this.loading = false }
    },
    parseFuliData(data) {
      this.fuliList = []
      if (data.fuli_list && data.fuli_list.length > 0) {
        this.fuliList = data.fuli_list.filter(item => String(item.id) !== 'wx').map(item => ({
          id: item.id, gid: item.gid, num: item.num, pass: item.pass, pid: item.pid,  // 添加
          price: item.price, kc: item.kc, uid: item.uid, state: item.state, bd_time: item.bd_time, shop: item.shop
        }))
      } else if (data.fuli) {
        try {
          const d = typeof data.fuli === 'string' ? JSON.parse(data.fuli) : data.fuli
          if (Array.isArray(d)) { this.fuliList = d.filter(i => i.id !== 'wx').map(i => ({ id: i.id, pid: i.pid, price: i.price, kc: i.price, num: i.id, gid: null })) }
        } catch (e) { }
      }
    },
    getCardType(pid) {
      const cardTypeMap = {
        1: '超级卡',
        2: '蛋糕卡',
        3: '电影卡',
        4: '图书卡',
        5: '超级券',
        6: '蛋糕券',
        7: '电影券',
        8: '图书券',
        9: '悦享卡',
        10: '商城尊享券',
        11: '电影尊享券',
        12: '蛋糕尊享券',
        13: '提货券',
        14: '工会消费券'
      }
      if (!pid && pid !== 0) return '未知卡类型'
      return cardTypeMap[pid] || '未知卡类型'
    },
    // openEditDrawer(card) {
    //   this.cardInfo = { id: card.id || '', kh: card.num || '', mm: card.pass || '', price: card.price || '0.00', addtype: '1', addprice: '', gid: card.gid || null, shop: card.shop || 0, activeStatus: card.state == 3 ? '已绑定' : '未绑定', exchangeUser: card.uid ? `${card.uid} 兑换时间${this.formatTime(card.bd_time)}` : '' }
    //   this.drawer = true
    // },
    // savePrice() { this.$message.success('保存成功') },
    // submitForm() { this.$message.success('保存成功') },
    goBack() { this.$router.go(-1) },
    // handleClose() { this.drawer = false },
    formatTime(t) {
      if (!t) return ''
      const d = new Date(t * 1000)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    }
  }
}
</script>

<style>
.addBorder .el-input__inner {
  border: 1px solid #f3f3f3;
}

.drawers .el-drawer__header {
  margin-bottom: 10px;
}

.warningCl {
  color: #E6A23C;
}
</style>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.info-row {
  padding: 10px 15px;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    display: inline-block;
    width: 110px;

    color: #606266;
    text-align: right;
    margin-right: 10px;
  }

  .info-value {
    color: #303133;
  }
}

.order-summary {
  padding: 10px 15px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 14px;
  font-weight: bold;
}

.ml30 {
  margin-left: 30px;
}

.link-text {
  color: #409EFF;
  cursor: pointer;
}
</style>