<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 基本信息三列 -->
      <el-table :data="[orderInfo]" border style="width:100%;" :header-cell-style="headerCellStyle">
        <el-table-column label="订单信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">订单号：{{ scope.row.order_id }}</div>
            <div class="info-row">轩夸订单号：{{ scope.row.tradeno || '-' }}</div>
            <div class="info-row">下单时间：{{ formatTime(scope.row.add_time) }}</div>
            <div class="info-row">过期时间：{{ formatTime(scope.row.expiretime) }}</div>
            <div class="info-row">
              订单状态：<span :style="{ color: getStateColor(scope.row.orderstatus) }">{{
                getStatusText(scope.row.orderstatus) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="演出信息" align="left">
          <template slot-scope="scope">
            <!-- <div class="info-row">演出：{{ scope.row.title }}</div> -->
            <div class="info-row">价格描述：{{ scope.row.priceDesc }}</div>
            <div class="info-row">场次描述：{{ scope.row.dateDesc }}</div>
            <div class="info-row">购票数量：{{ scope.row.quantity }}</div>
            <div class="info-row">单价：<span class="fs10">￥</span>{{ scope.row.price }}</div>
            <div class="info-row">取票方式：{{ scope.row.deliveryTypeName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">
              用户ID：
              <span @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span>


            </div>
            <div class="info-row">购票人：{{ scope.row.buyerName }}</div>
            <div class="info-row">联系电话：{{ scope.row.buyerPhone }}</div>

            <div class="info-row">经纬度：{{ scope.row.venueLng }},{{ scope.row.venueLat }}</div>
            <div class="info-row">选座状态：{{ scope.row.seatSelectType == 0 ? '机选' : '在线选座' }}</div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 场馆与金额信息 -->
      <el-table :data="[orderInfo]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle">
        <el-table-column label="场馆信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">演出：{{ scope.row.title }}</div>
            <div class="info-row">场馆名称：{{ scope.row.venuesname }}</div>
            <div class="info-row">场馆地址：{{ scope.row.venuesaddress }}</div>
            <!-- <div class="info-row"></div> -->
            <div class="info-row">演出类型：{{ scope.row.classifyName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="金额信息" align="left">
          <template slot-scope="scope">
            <div class="info-row">订单总金额：<span class="fs10">￥</span>{{ scope.row.total }}</div>
            <div class="info-row">服务费：<span class="fs10">￥</span>{{ scope.row.servicefee }}</div>
            <div class="info-row">快递费：<span class="fs10">￥</span>{{ scope.row.expressfee }}</div>

            <template v-if="scope.row.expressName || scope.row.expressCode">
              <div class="info-row">快递公司：{{ scope.row.expressName }} <span>快递单号：{{ scope.row.expressCode }}</span></div>

            </template>
            <div class="info-row" v-if="scope.row.address">收货地址：{{ scope.row.address }}</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 凭证信息 -->
      <el-table :data="[orderInfo]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle">
        <el-table-column label="凭证信息" align="left">
          <template slot-scope="scope">
            <!-- 有座位信息列表 -->
            <template v-if="scope.row.seatInfoList && scope.row.seatInfoList.length > 0">
              <div v-for="(seat, index) in scope.row.seatInfoList" :key="index">
                <div v-if="index > 0" style="border-top: 1px dashed #DCDFE6; margin: 5px 0;"></div>
                <div class="info-row">
                  <span class="info-label">座位信息：</span>
                  <span class="info-value">{{ seat.fullSeatName || '座位信息:' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">二维码原始值：</span>
                  <span class="info-value">{{ seat.qrCode || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">取票码值：</span>
                  <span class="info-value">{{ seat.ticketCode || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">是否验票：</span>
                  <span class="info-value">{{ seat.validateStatus ? '是' : '否' }}</span>
                </div>
              </div>
            </template>
            <!-- 没有座位信息列表 -->
            <template v-else>
              <div class="info-row">
                <span class="info-label">座位信息：</span>
                <span class="info-value">座位信息:</span>
              </div>
              <div class="info-row">
                <span class="info-label">二维码原始值：</span>
                <span class="info-value">-</span>
              </div>
              <div class="info-row">
                <span class="info-label">取票码值：</span>
                <span class="info-value">-</span>
              </div>
              <div class="info-row">
                <span class="info-label">是否验票：</span>
                <span class="info-value">否</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="海报" align="center" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="width:150px;height:150px;object-fit:contain;" v-if="scope.row.img">
            <span v-else>暂无海报</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 支付信息（有福利卡或微信支付时显示） -->
      <el-table :data="[orderInfo]" border style="width:100%;margin-top:20px;" :header-cell-style="headerCellStyle"
        v-if="showPaymentInfo">
        <el-table-column label="支付信息" align="left">
          <template slot-scope="scope">
            <!-- 福利卡列表 -->
            <div v-for="(item, index) in fuliList" :key="'fuli_' + index" class="info-row">
              <span class="info-label1">福利卡：</span>
              <span class="info-value">
                <span class="warningCl">{{ getCardType(item.pid) }}</span>
                {{ item.num }}
                <span v-if="item.price !== undefined && item.price !== null">余额：<span class="fs10">￥</span>{{ item.price
                  }}</span>
                扣除 <span class="fs10">￥</span>{{ item.kc }}
                <el-button type="primary" size="mini" @click="openFuliEdit(item)">修改</el-button>

              </span>
            </div>
            <!-- 微信支付 -->
            <div v-if="getWxPayAmount() > 0" class="info-row">
              <span class="info-label1">微信支付：</span>
              <span class="info-value"><span class="fs10">￥</span>{{ getWxPayAmount() }}</span>
            </div>
            <!-- 交易号 -->
            <div v-if="scope.row.transaction_id" class="info-row">
              <span class="info-label1">交易号：</span>
              <span class="info-value">{{ scope.row.transaction_id }}</span>
            </div>
            <!-- 纯微信支付（无福利卡） -->
            <div v-if="fuliList.length === 0 && scope.row.total_fee > 0" class="info-row">
              <span class="info-label1">微信支付：</span>
              <span class="info-value"><span class="fs10">￥</span>{{ scope.row.total_fee || scope.row.total }}</span>
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
import { getYcorder } from '@/api/modules/orders'

export default {
  components: { UserDetailDialog, FuliEditDrawer },
  name: 'YcOrderdetails',
  data() {
    return {
      userDialogVisible: false,
      currentUserId: '',
      fuliEditVisible: false,    // 添加这行
      currentCard: {},            // 添加这行
      loading: false,
      orderInfo: {},
      fuliList: [],
      // drawer: false,
      // direction: 'rtl',
      headerCellStyle: { background: '#f5f7fa', color: '#606266' },
      // cardInfo: {
      //   id: '',
      //   num: '',
      //   pass: '',
      //   price: '0.00',
      //   addtype: '1',
      //   addprice: '',
      //   gid: null,
      //   shop: 0,
      //   stateText: '已绑定',
      //   exchangeUser: ''
      // },
      // categoryOptions: [
      //   { value: 417, label: '417-福利卡[超级卡]' },
      //   { value: 913, label: '913-北京首创大气环境科技股份有限公司-冯伟伦[超级卡]' },
      //   { value: 912, label: '912-北京市丰台怡海幼儿园工会委员会-冯伟伦[蛋糕卡]' },
      //   { value: 690, label: '690-北京市大兴区第九幼儿园-韩子翰[超级卡]' }
      // ],
      tableData5: []
    }
  },
  computed: {
    // showPaymentInfo() {
    //   return this.fuliList.length > 0 ||
    //     this.orderInfo.total_fee > 0 ||
    //     this.getWxPayAmount() > 0
    // }
    showPaymentInfo() {
      // 只有以下状态才显示支付信息
      const validStatus = ['N', 'P', 'T', 'D', 'DE', 'S', 'R']
      if (!validStatus.includes(this.orderInfo.orderstatus)) {
        return false
      }

      return this.fuliList.length > 0 ||
        this.orderInfo.total_fee > 0 ||
        this.getWxPayAmount() > 0
    }
  },
  mounted() {
    this.loadOrderDetail()
  },
  methods: {

    async loadOrderDetail() {
      const orderId = this.$route.params.id
      if (!orderId) {
        this.$message.error('订单ID不存在')
        return
      }
      this.loading = true
      try {
        const res = await getYcorder({ id: orderId })
        if (res.code === 200) {
          this.orderInfo = res.data
          this.parseFuliData(res.data)
        } else {
          this.$message.error(res.msg || '获取订单详情失败')
        }
      } catch (error) {
        this.$message.error('获取订单详情失败')
      } finally {
        this.loading = false
      }
    },
    parseFuliData(data) {
      this.fuliList = []

      if (data.fuli_list && Array.isArray(data.fuli_list) && data.fuli_list.length > 0) {
        this.fuliList = data.fuli_list
          .filter(item => String(item.id) !== 'wx')
          .map(item => ({
            id: item.id,
            gid: item.gid,
            pid: item.pid,  // 添加这行
            num: item.num,
            pass: item.pass,
            price: item.price,
            kc: item.kc,
            uid: item.uid,
            state: item.state,
            bd_time: item.bd_time,
            shop: item.shop,
            zf_type: item.zf_type
          }))
        return
      }

      if (data.fuli && typeof data.fuli === 'string' && data.fuli.trim() !== '') {
        try {
          const d = JSON.parse(data.fuli)
          if (Array.isArray(d)) {
            this.fuliList = d
              .filter(i => String(i.id) !== 'wx')
              .map(i => ({
                id: i.id,
                price: i.price,
                kc: i.price,
                pid: i.pid,  // 添加这行
                num: i.id,
                gid: null
              }))
          }
        } catch (e) {
          console.error('解析福利卡数据失败', e)
        }
      }
    },
    getWxPayAmount() {
      if (this.orderInfo.data) {
        try {
          const dataObj = typeof this.orderInfo.data === 'string'
            ? JSON.parse(this.orderInfo.data)
            : this.orderInfo.data
          return parseFloat(dataObj.wxprice) || 0
        } catch (e) {
          console.error('解析微信支付金额失败', e)
        }
      }
      return this.orderInfo.total_fee || 0
    },
    // 新方法 - 卡类型映射
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
    getStatusText(status) {
      const statusMap = {
        'N': '待支付',
        'C': '已取消',
        'P': '已付款',
        'T': '已通知主办方，等待处理',
        'D': '等待发货',
        'DE': '已发货',
        'S': '出票成功',
        'R': '退款完成',
        'E': '订单超时'
      }
      return statusMap[status] || status || '未知状态'
    },
    getStateColor(status) {
      const colorMap = {
        'N': '#E6A23C',  // 橙色 - 待支付
        'C': '#909399',  // 灰色 - 已取消
        'P': '#409EFF',  // 蓝色 - 已付款
        'T': '#409EFF',  // 蓝色 - 已通知主办方
        'D': '#E6A23C',  // 橙色 - 等待发货
        'DE': '#409EFF', // 蓝色 - 已发货
        'S': '#67C23A',  // 绿色 - 出票成功
        'R': '#F56C6C',  // 红色 - 退款完成
        'E': '#909399'   // 灰色 - 订单超时
      }
      return colorMap[status] || '#303133'
    },
    showUserDetail(uid) {
      this.currentUserId = uid
      this.userDialogVisible = true
    },
    openFuliEdit(card) {
      this.currentCard = { ...card }
      this.fuliEditVisible = true
    },
    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.loadOrderDetail()
    },
    onFuliEditClose() {
      this.currentCard = {}
    },
    // openEditDrawer(card) {
    //   this.cardInfo = {
    //     id: card.id || '',
    //     num: card.num || '',
    //     pass: card.pass || '',
    //     price: card.price || '0.00',
    //     addtype: '1',
    //     addprice: '',
    //     gid: card.gid || null,
    //     shop: card.shop || 0,
    //     stateText: card.state == 3 ? '已绑定' : '未绑定',
    //     exchangeUser: card.uid ? `${card.uid} 兑换时间${this.formatTime(card.bd_time)}` : ''
    //   }
    //   this.drawer = true
    // },
    // savePrice() {
    //   this.$message.success('价格已保存')
    //   this.drawer = false
    // },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       console.log('提交数据：', this.cardInfo)
    //       this.$message.success('保存成功')
    //       this.drawer = false
    //     } else {
    //       console.log('验证失败')
    //       return false
    //     }
    //   })
    // },
    goBack() {
      this.$router.go(-1)
    },
    // handleClose() {
    //   this.drawer = false
    // },
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

.dangerCl {
  color: #F56C6C;
}

.blueCl {
  color: #409EFF;
}

.link-text {
  color: #409EFF;
  cursor: pointer;
}

.fs10 {
  font-size: 10px;
}
</style>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.info-row {
  padding: 8px 12px;
  text-align: left;

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

.price-control {
  display: flex;
  align-items: center;
}
</style>