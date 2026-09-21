<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 订单基本信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column label="下单位置" align="center" width="130">
          <template slot-scope="scope">
            {{ getTypeText(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="order_no" label="订单号" align="center" width="240"></el-table-column>
        <el-table-column prop="sp_order_no" label="卡券订单号" align="center" width="240"></el-table-column>
        <el-table-column label="总金额" align="center">
          <template slot-scope="scope">
            <span class="fs10">￥</span>{{ scope.row.total_fee }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getStateColor(scope.row.state) }">
              {{ getStateText(scope.row.state) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 卡券信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column prop="id" label="订单ID" align="center" width="130"></el-table-column>
        <el-table-column label="卡券" align="center" width="100">
          <template slot-scope="scope">
            <img v-if="scope.row.gueige && scope.row.gueige.img" :src="scope.row.gueige.img"
              style="width: 60px; height: 60px; object-fit: contain;">
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" width="260">
          <template slot-scope="scope">
            {{ scope.row.gueige ? scope.row.gueige.title : '' }}
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">
            {{ scope.row.gueige ? scope.row.gueige.gueige : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="danjia" label="单价" align="center"></el-table-column>
        <el-table-column label="用户ID" align="center">
          <template slot-scope="scope">
            <span  @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值手机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone || '-' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情 - 占一整行 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column label="订单详情" align="left">
          <template slot-scope="scope">
            <div class="info-row dflex">
              <div style="width: 30%;">
                <span class="info-label">用户ID：</span>
                <span class="info-value">{{ scope.row.uid }}</span>

              </div>


              <div>
                <span class="info-label">用户：</span>
                <span >{{ scope.row.phone }}</span>
              </div>
            </div>


            <div class="info-row dflex">

              <div style="width: 30%;">


                <span class="info-label">订单状态：</span>
                <span class="info-value"  >
                  {{ getStateText(scope.row.state) }}
                </span>
              </div>


              <div>
                <span class="info-label">接口状态：</span>
                <span class="info-value"  >
                  {{ scope.row.flag == 1 ? '成功' : '失败' }}
                </span>
              </div>
            </div>
            <div class="info-row">
              <span class="info-label">下单时间：</span>
              <span class="info-value">{{ formatTime(scope.row.add_time) }}</span>
            </div>
            <div v-if="scope.row.sp_order_msg" class="info-row">
              <span class="info-label">说明：</span>
              <span class="info-value">{{ scope.row.sp_order_msg }}</span>
            </div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 支付信息 - 占一整行 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle"
        v-if="fuliList.length > 0 || orderInfo.wxtotal_fee > 0">
        <el-table-column label="支付信息" align="left">
          <template slot-scope="scope">
            <div v-for="(item, index) in fuliList" :key="index" class="info-row">
              <span class="info-label">福利卡：</span>
              <span class="info-value">
                <span class="warningCl">{{ getCardType(item.pid) }}</span>
              {{ item.num }} <span>余额：<span class="fs10">￥</span>{{ item.price }}</span> 
                
                扣除 <span class="fs10">￥</span>{{ item.kc || item.deductPrice }}
                <el-button type="primary" size="mini" @click="openFuliEdit(item)">修改</el-button>
              </span>
            </div>
            <div v-if="scope.row.wxtotal_fee > 0" class="info-row">
              <span class="info-label">微信支付：</span>
              <span class="info-value"><span class="fs10">￥</span>{{ scope.row.wxtotal_fee }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
<FuliEditDrawer :drawer-visible.sync="fuliEditVisible" :fuli-data="currentCard" 
  @success="onFuliEditSuccess" @close="onFuliEditClose" />
<UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />
      <!-- 返回按钮 -->
      <div class="form-actions mt20" style="text-align: left;">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>


  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog'
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { getKqorder } from '@/api/modules/orders'

export default {
   components: { UserDetailDialog, FuliEditDrawer },
  name: 'CardOrderdetails',
  data() {
    return {
        userDialogVisible: false,   // 添加
    currentUserId: '',          // 添加
    fuliEditVisible: false,     // 添加
    currentCard: {},            // 添加
      loading: false,
      orderInfo: {},
      fuliList: [],
      // cardLogs: [],
      // drawer: false,
      // direction: 'rtl',
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266'
      },
       
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
    async loadOrderDetail() {
      const orderId = this.$route.params.id
      if (!orderId) {
        this.$message.error('订单ID不存在')
        return
      }
      this.loading = true
      try {
        const res = await getKqorder({ id: orderId })
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
      if (data.fuli_list && data.fuli_list.length > 0) {
        this.fuliList = data.fuli_list.map(item => ({
          id: item.id,
          gid: item.gid,      pid: item.pid,  // 添加
          num: item.num,
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
                id: item.id,      pid: item.pid,  // 添加
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
    //   this.drawer = true
    // },

    // savePrice() { this.$message.success('保存成功') },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) { this.$message.success('保存成功') }
    //   })
    // },
    goBack() { this.$router.go(-1) },
    // handleClose() { this.drawer = false },

    getTypeText(type) {
      const map = { 1: '蜂助手', 2: '后台', 3: '亿奇达' }
      return map[type] || ''
    },
    getStateText(state) {
      const map = { 1: '未支付', 2: '已支付', 3: '已取消' }
      return map[state] || ''
    },
    getStateColor(state) {
      const map = { 1: '#E6A23C', 2: '#67C23A', 3: '#909399' }
      return map[state] || '#303133'
    },
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
    }
  }
}
</script>
<style scoped>
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
    /* font-weight: bold; */
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