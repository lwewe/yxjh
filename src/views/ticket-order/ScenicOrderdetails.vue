<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 基本信息三列 -->
      <el-table :data="[orderInfo]" border style="width:100%;" :header-cell-style="headerCellStyle">
        <el-table-column label="订单信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">订单号：{{ scope.row.order_no }}</div>
            <div class="info-row">来一票订单号：{{ scope.row.third_orderid || '-' }}</div>
            <div class="info-row">下单时间：{{ formatTime(scope.row.add_time) }}</div>
            <div class="info-row">
              订单状态：<span :style="{ color: getStateColor(scope.row.status) }">{{ scope.row.third_party_status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="景区信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">景区：{{ scope.row.name }}</div>
            <div class="info-row">票种：{{ scope.row.piaotype }}</div>
            <div class="info-row">使用日期：{{ scope.row.use_date }}</div>
            <div class="info-row">订单金额：<span class="fs10">￥</span>{{ scope.row.total_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">
              用户ID：<span @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span>
            </div>
            <div class="info-row">联系人：{{ scope.row.user_name }}</div>
            <div class="info-row">联系电话：{{ scope.row.mobile_number }}</div>
            <div class="info-row">渠道扣款价：<span class="fs10">￥</span>{{ scope.row.deductions_price }}</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 出行与资源信息 -->
      <el-table :data="resourceList" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle">
        <el-table-column label="出行与资源信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">产品ID：{{ orderInfo.product_id }}</div>
            <div class="info-row">资源ID：{{ scope.row.resourceID || '' }}</div>
            <div class="info-row">P_CNAME：{{ getPassengerName() }}</div>
            <div class="info-row">数量：{{ scope.row.quantity || '' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="使用信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">使用日期：{{ scope.row.useDate || '' }}</div>
            <div class="info-row">结束日期：{{ scope.row.endDate || '' }}</div>
            <div class="info-row">天数：{{ scope.row.day || '' }}</div>
            <div class="info-row"> P_ID_CARD：{{ getPassengerIdCard() }}</div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 凭证信息 -->
      <el-table :data="voucherList" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle"
        v-if="voucherList.length > 0">
        <el-table-column label="凭证信息" align="left">
          <template slot-scope="scope">
            <div class="info-row"><span class="info-label">出票信息：</span><span class="info-value">{{ orderInfo.tickinfo ||
              scope.row.productUseMsg }}</span></div>
            <div class="info-row"><span class="info-label">二维码：</span><span class="info-value">{{ scope.row.imageUrl
            }}</span></div>
            <div class="info-row"><span class="info-label">使用日期：</span><span class="info-value">{{ orderInfo.use_date }}
                00:00:00</span></div>
            <div class="info-row"><span class="info-label">截止日期：</span><span class="info-value">{{ orderInfo.use_date }}
                00:00:00</span></div>
            <div class="info-row"><span class="info-label">使用方法：</span><span class="info-value">{{
              scope.row.productUseMsg || getUsageMethod() }}</span></div>
            <div class="info-row"><span class="info-label">数字验证码辅助码：</span><span class="info-value">{{
              scope.row.voucherNO }}</span></div>
            <div class="info-row"><span class="info-label">二维码短链接：</span><span class="info-value">{{
              scope.row.imageShortUrl }}</span></div>
          </template>
        </el-table-column>
        <el-table-column label="二维码" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" style="width:150px;height:150px;object-fit:contain;">
          </template>
        </el-table-column>
      </el-table>

      <!-- 支付信息 -->
      <el-table :data="[orderInfo]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle"
        v-if="fuliList.length > 0 || orderInfo.total_fee > 0">
        <el-table-column label="支付信息" align="left">
          <template slot-scope="scope">
            <div v-for="(item, index) in fuliList" :key="index" class="info-row">
              <span class="info-label1">福利卡：</span>
              <span class="info-value">
                <span class="warningCl">{{ getCardType(item.pid) }}</span>
                {{ item.num }}
                <span>余额：<span class="fs10">￥</span>{{ item.price }}</span>

                扣除 <span class="fs10">￥</span>{{ item.kc || item.deductPrice }}
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
      <FuliEditDrawer :drawer-visible.sync="fuliEditVisible" :fuli-data="currentCard" @success="onFuliEditSuccess"
        @close="onFuliEditClose" />
      <UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />

      <!-- 返回按钮 -->
      <div class="form-actions mt20" style="text-align:left;">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>


  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog'
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { getJqorder } from '@/api/modules/orders'

export default {
  components: { UserDetailDialog, FuliEditDrawer },
  name: 'ScenicOrderdetails',
  data() {
    return {
      userDialogVisible: false,   // 添加
      currentUserId: '',          // 添加
      fuliEditVisible: false,     // 添加
      currentCard: {},            // 添加
      loading: false, orderInfo: {}, fuliList: [],
      // drawer: false, direction: 'rtl',
      headerCellStyle: { background: '#f5f7fa', color: '#606266' },
      // cardInfo: { id: '', kh: '', mm: '', price: '0.00', addtype: '1', addprice: '', gid: null, shop: 0, activeStatus: '已绑定', exchangeUser: '' },
      // categoryOptions: [
      //   { value: 913, label: '913-北京首创大气环境科技股份有限公司-冯伟伦[超级卡]' },
      //   { value: 690, label: '690-北京市大兴区第九幼儿园-韩子翰[超级卡]' }
      // ]
    }
  },
  computed: {
    resourceList() { return this.orderInfo.resource_data || [] },
    voucherList() {
      // 优先从 travel_order_detail 中解析凭证列表
      if (this.orderInfo.travel_order_detail) {
        try {
          const d = typeof this.orderInfo.travel_order_detail === 'string'
            ? JSON.parse(this.orderInfo.travel_order_detail)
            : this.orderInfo.travel_order_detail
          if (Array.isArray(d) && d[0] && d[0].voucherInfoList) {
            return d[0].voucherInfoList
          }
        } catch (e) {
          console.error('解析 travel_order_detail 失败', e)
        }
      }
      // 兜底：如果没有 travel_order_detail，但有 tickinfo 或 qrcode，构造数据
      if (this.orderInfo.tickinfo || this.orderInfo.qrcode) {
        return [{
          imageUrl: this.orderInfo.qrcode || '',
          voucherNO: '',
          productUseMsg: this.orderInfo.tickinfo || '',
          imageShortUrl: ''
        }]
      }
      return []
    }
  },
  mounted() { this.loadOrderDetail() },
  methods: {
    getUsageMethod() {
      if (!this.orderInfo.tickinfo) return ''
      const match = this.orderInfo.tickinfo.match(/使用方法:(.+)/)
      return match ? match[1].trim() : this.orderInfo.tickinfo
    },
    getPassengerIdCard() {
      if (!this.orderInfo.passenger_data || !this.orderInfo.passenger_data.length) return ''
      const pd = this.orderInfo.passenger_data[0]
      if (!pd.questionAnswerList) return ''
      const q = pd.questionAnswerList.find(q => q.questionCode === 'P_ID_CARD')
      return q ? q.answerList[0] : ''
    },
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

    async loadOrderDetail() {
      const orderId = this.$route.params.id
      if (!orderId) { this.$message.error('订单ID不存在'); return }
      this.loading = true
      try {
        const res = await getJqorder({ id: orderId })
        if (res.code === 200) { this.orderInfo = res.data; this.parseFuliData(res.data) }
        else { this.$message.error(res.msg || '获取订单详情失败') }
      } catch (error) { this.$message.error('获取订单详情失败') }
      finally { this.loading = false }
    },
    parseFuliData(data) {
      this.fuliList = []
      if (data.fuli_list && data.fuli_list.length > 0) {
        this.fuliList = data.fuli_list.filter(item => String(item.id) !== 'wx').map(item => ({
          id: item.id, gid: item.gid, num: item.num, pid: item.pid, pass: item.pass, price: item.price, kc: item.kc, uid: item.uid, state: item.state, bd_time: item.bd_time, shop: item.shop
        }))
      } else if (data.fuli) {
        try {
          const d = typeof data.fuli === 'string' ? JSON.parse(data.fuli) : data.fuli
          if (Array.isArray(d)) { this.fuliList = d.filter(i => String(i.id) !== 'wx').map(i => ({ id: i.id, pid: i.pid, price: i.price, kc: i.price, num: i.id, gid: null })) }
        } catch (e) { }
      }
    },
    getPassengerName() {
      if (!this.orderInfo.passenger_data || !this.orderInfo.passenger_data.length) return ''
      const pd = this.orderInfo.passenger_data[0]
      if (!pd.questionAnswerList) return ''
      const q = pd.questionAnswerList.find(q => q.questionCode === 'P_CNAME')
      return q ? q.answerList[0] : ''
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
    getStateColor(s) {
      return { '-1': '#409EFF', 0: '#E6A23C', 1: '#E6A23C', 2: '#67C23A', 3: '#F56C6C', 4: '#F56C6C', 5: '#F56C6C', 6: '#F56C6C', 7: '#67C23A', 8: '#E6A23C' }[s] || '#303133'
    },
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

.link-text {
  color: #409EFF;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.info-row {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  display: inline-block;
  width: 130px;
  color: #606266;
  text-align: right;
  margin-right: 10px;
  vertical-align: top;
}

.info-label1 {
  display: inline-block;
  width: 130px;
  color: #606266;
  text-align: right;
  margin-right: 10px;
}

.info-value {
  color: #303133;
  word-break: break-all;
}

.form-actions {
  text-align: left;
}
</style>