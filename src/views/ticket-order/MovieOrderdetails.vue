<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 订单基本信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column label="下单位置" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? '轩夸(旧接口)' : '奇票(新接口)' }}
          </template>
        </el-table-column>
        <el-table-column prop="order_id" label="订单号" align="center" width="220"></el-table-column>
        <el-table-column prop="tradeno" label="轩夸订单号" align="center" width="220"></el-table-column>
        <el-table-column prop="opiid" label="场次ID" align="center"></el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getStatusColor(scope.row.orderstatus) }">
              {{ getStatusText(scope.row.orderstatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 影院和座位信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column prop="cityname" label="城市名称" align="center" width="120"></el-table-column>
        <el-table-column label="影片" align="center" min-width="150">
          <template slot-scope="scope">
            <div class="txtleft">影片名称：{{ scope.row.moviename }}</div>
            <div class="txtleft">版本：{{ scope.row.edition }}</div>
          </template>
        </el-table-column>
        <el-table-column label="影院信息" align="center" width="450">
          <template slot-scope="scope">
            <div class="txtleft">影院名称：{{ scope.row.cinemaname }}</div>
            <div class="txtleft">影厅名称：{{ scope.row.roomname }}</div>
            <div class="txtleft">放映时间：{{ scope.row.playtime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="座位信息" align="center" width="280">
          <template slot-scope="scope">
            <div class="txtleft">座位数量：{{ scope.row.quantity }}</div>
            <div class="txtleft">座位信息：{{ scope.row.seats }}</div>
            <div class="txtleft">座位价格：{{ scope.row.seats_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="center" min-width="150">
          <template slot-scope="scope">
            <div class="txtleft">用户ID：
              <span @click="showUserDetail(scope.row.uid)" style="cursor: pointer;"> {{ scope.row.uid }}</span>
            </div>
            <div class="txtleft">展示金额：{{ scope.row.showamount }}</div>
            <div class="txtleft">结算金额：{{ scope.row.settleamount }}</div>
            <div v-if="scope.row.type == 2" class="txtleft">佣金：{{ scope.row.commission }}</div>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.expiretime) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 取票信息 - 占一整行 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column label="取票信息" align="left">
          <template slot-scope="scope">
            <div class="info-row dflex">

              <div style="width: 50%;">
                <span class="info-label">取票码：</span>
                <span class="info-value">{{ getTicketCodes() }}</span>
              </div>
              <div>
                <span class="info-label">订单状态：</span>
                <span class="info-value">{{ getStatusText(scope.row.orderstatus) }}</span>
              </div>
            </div>


            <div class="info-row dflex">
              <div style="width: 50%;">
                <span class="info-label">下单时间：</span>
                <span class="info-value">{{ formatTime(scope.row.add_time) }}</span>

              </div>
              <div>
                <span class="info-label">过期时间：</span>
                <span class="info-value">{{ formatTime(scope.row.expiretime) }}</span>
              </div>

            </div>
            <div class="info-row">
              <span class="info-label">取票短信：</span>
              <span class="info-value">{{ scope.row.smscontent || '无' }}</span>
            </div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 支付信息 - 占一整行 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle"
        v-if="fuliList.length > 0 || orderInfo.total_fee > 0">
        <el-table-column label="支付信息" align="left">
          <template slot-scope="scope">

            <div v-if="fuliList.length > 0 || scope.row.total_fee > 0">
              <!-- 福利卡列表 -->
              <div v-for="(item, index) in fuliList" :key="index" class="info-row">
                <span class="info-label">福利卡：</span>
                <span class="info-value">
                  <span class="warningCl " style="font-size: 14px;">{{ getCardType(item.pid) }}</span>
                  {{ item.num }}
                  <span>余额： <span class="fs10">￥</span>{{ item.price }}</span>
                  扣除： <span class="fs10">￥</span>{{ item.kc || item.deductPrice }}
                  <!-- <el-button type="primary" size="mini" @click="openEditDrawer(item)" v-if="item.id !== 'wx'">
                    修改
                  </el-button> -->
                  <el-button type="primary" size="mini" @click="openFuliEdit(item)" v-if="String(item.id) !== 'wx'">
                    修改
                  </el-button>
                </span>
              </div>
              <!-- 微信支付 -->
              <div v-if="scope.row.total_fee > 0" class="info-row">
                <span class="info-label">微信支付：</span>
                <span class="info-value"><span class="fs10">￥</span>{{ scope.row.total_fee }}</span>
              </div>
              <!-- 交易流水号 -->

            </div>
            <div v-else class="info-row">
              <span class="info-value">&nbsp;</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 返回按钮 -->
      <div class="form-actions mt20" style="text-align: left;">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>

    <UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />
    <FuliEditDrawer :drawer-visible.sync="fuliEditVisible" :fuli-data="currentCard" @success="onFuliEditSuccess"
      @close="onFuliEditClose" />
  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog'
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { getDyorder } from '@/api/modules/orders'

export default {
  components: { UserDetailDialog, FuliEditDrawer },
  name: 'MovieOrderdetails',
  data() {
    return {
      fuliEditVisible: false,
      currentCard: {},
      userDialogVisible: false,  // 添加
      currentUserId: '',         // 添加
      loading: false,
      orderInfo: {},
      fuliList: [],
      cardLogs: [],
      drawer: false,
      direction: 'rtl',
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266'
      },
      cardInfo: {
        id: '',
        kh: '',
        mm: '',
        price: '0.00',
        addtype: '1',
        addprice: '',
        gid: null,
        shop: 0,
        activeStatus: '已绑定',
        exchangeUser: ''
      },
      categoryOptions: [
        { value: 913, label: '913-北京首创大气环境科技股份有限公司-冯伟伦[超级卡]' },
        { value: 912, label: '912-北京市丰台怡海幼儿园工会委员会-冯伟伦[蛋糕卡]' },
        { value: 911, label: '911-生态环境部环境与经济政策研究中心工会-赵文吉[超级卡]' },
        { value: 910, label: '910-延期卡-超级卡-延期卡[超级卡]' },
        { value: 909, label: '909-北京好生活网络科技有限公司-冯思齐[超级卡]' },
        { value: 908, label: '908-北京市通州区东里幼儿园-赵文吉[蛋糕卡]' },
        { value: 907, label: '907-北京市丰台怡海幼儿园工会委员会-韩子翰[蛋糕卡]' },
        { value: 906, label: '906-延期卡-蛋糕卡-延期卡[蛋糕卡]' },
        { value: 905, label: '905-北京永林中西医结合医院有限公司工会委员会-冯思齐[超级卡]' },
        { value: 904, label: '904-延期卡-蛋糕卡-延期卡[蛋糕卡]' },
        { value: 690, label: '690-北京市大兴区第九幼儿园-韩子翰[超级卡]' }
      ]
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
    getStatusColor(status) {
      const colorMap = {
        'N': '#909399',  // 待支付 - 灰色
        'C': '#909399',  // 已取消 - 灰色
        'E': '#E6A23C',  // 订单超时 - 橙色
        'P': '#409EFF',  // 已付款 - 蓝色
        'T': '#E6A23C',  // 通知处理中 - 橙色
        'S': '#67C23A',  // 出票成功 - 绿色
        'F': '#F56C6C',  // 出票失败 - 红色
        'R': '#909399',  // 退款完成 - 灰色
        '11': '#E6A23C'  // 正在出票 - 橙色
      }
      return colorMap[status] || '#303133'
    },
    async loadOrderDetail() {
      const orderId = this.$route.params.id
      if (!orderId) {
        this.$message.error('订单ID不存在')
        return
      }

      this.loading = true
      try {
        const res = await getDyorder({ id: orderId })
        if (res.code === 200) {
          this.orderInfo = res.data
          this.parseFuliData(res.data)
          if (res.data.fuli_list && res.data.fuli_list.length > 0) {
            // this.loadCardLogs(res.data.fuli_list[0].id)
          }
        } else {
          this.$message.error(res.msg || '获取订单详情失败')
        }
      } catch (error) {
        this.$message.error('获取订单详情失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    parseFuliData(data) {
      this.fuliList = []
      if (data.fuli_list && data.fuli_list.length > 0) {
        this.fuliList = data.fuli_list.filter(item => item.id !== 'wx').map(item => ({
          id: item.id,
          gid: item.gid,
          num: item.num, pid: item.pid,  // 添加
          pass: item.pass,
          price: item.price,
          kc: item.kc,
          uid: item.uid,
          state: item.state,
          bd_time: item.bd_time,
          shop: item.shop
        }))
      } else if (data.fuli) {
        try {
          const fuliData = typeof data.fuli === 'string' ? JSON.parse(data.fuli) : data.fuli
          if (Array.isArray(fuliData)) {
            this.fuliList = fuliData
              .filter(item => item.id !== 'wx')
              .map(item => ({
                id: item.id, pid: item.pid,  // 添加
                price: item.price,
                kc: item.price,
                num: item.id,
                gid: null
              }))
          }
        } catch (e) {
          console.error('解析福利卡信息失败', e)
        }
      }
    },

    // async loadCardLogs(cardId) {
    //   this.cardLogs = [
    //     { bhh: '229635', jgg: '5.00', ztt: '后台充值', sj: '2026-04-14 10:27:21', dd: '-', jy: '-', sf: '0.00' },
    //     { bhh: '229636', jgg: '10.00', ztt: '后台扣除', sj: '2026-04-14 11:30:15', dd: '-', jy: '-', sf: '0.00' }
    //   ]
    // },

    getTicketCodes() {
      if (!this.orderInfo.ticketcodelist || this.orderInfo.ticketcodelist.length === 0) {
        return '无'
      }
      try {
        const ticketList = typeof this.orderInfo.ticketcodelist === 'string'
          ? JSON.parse(this.orderInfo.ticketcodelist)
          : this.orderInfo.ticketcodelist
        if (Array.isArray(ticketList)) {
          const codes = []
          ticketList.forEach(item => {
            if (Array.isArray(item)) {
              item.forEach(ticket => {
                codes.push(`${ticket.name}：${ticket.value}`)
              })
            }
          })
          return codes.join('  ') || '无'
        }
      } catch (e) {
        console.error('解析取票码失败', e)
      }
      return this.orderInfo.ticketcode || '无'
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
    // 添加以下两个方法
    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.loadOrderDetail()  // 刷新订单详情
    },

    onFuliEditClose() {
      this.currentCard = {}
    },
    openFuliEdit(card) {
  this.currentCard = { ...card }
  this.fuliEditVisible = true
},
    // openEditDrawer(card) {
    //   this.cardInfo = {
    //     id: card.id || '',
    //     kh: card.num || '',
    //     mm: card.pass || '',
    //     price: card.price || '0.00',
    //     addtype: '1',
    //     addprice: '',
    //     gid: card.gid || null,
    //     shop: card.shop || 0,
    //     activeStatus: card.state == 3 ? '已绑定' : '未绑定',
    //     exchangeUser: card.uid ? `${card.uid} 兑换时间${this.formatTime(card.bd_time)}` : ''
    //   }
    //  this.fuliEditVisible = true
    // },



    goBack() {
      this.$router.go(-1)
    },

    // handleClose() {
    //   this.drawer = false
    // },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    getStatusText(status) {
      const statusMap = {
        'N': '待支付',
        'C': '已取消',
        'E': '订单超时',
        'P': '已付款',
        'T': '通知处理中',
        'S': '出票成功',
        'F': '出票失败',
        'R': '退款完成',
        '11': '正在出票'
      }
      return statusMap[status] || status
    },

    getStatusType(status) {
      const typeMap = {
        'N': 'info',
        'C': 'info',
        'E': 'warning',
        'P': '',
        'T': 'warning',
        'S': 'success',
        'F': 'danger',
        'R': 'info',
        '11': 'warning'
      }
      return typeMap[status] || 'info'
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

.blueCl {
  color: #409EFF;
}

.warningCl {
  color: #E6A23C;
}

.dangerCl {
  color: #F56C6C;
}
</style>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.info-row {
  padding: 10px 15px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    display: inline-block;
    width: 100px;
    // font-weight: bold;
    color: #606266;
    text-align: right;
    margin-right: 10px;
  }

  .info-value {
    color: #303133;
    word-break: break-all;
  }
}

.txtleft {
  text-align: left;
}

.form-actions {
  text-align: left;
}
</style>