<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 订单基本信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column prop="order_no" label="订单号" align="center" width="220"></el-table-column>
        <el-table-column prop="zc_order_no" label="直充订单号" align="center" width="220"></el-table-column>
        <el-table-column label="总金额" align="center"  >
          <template slot-scope="scope">
            <span class="fs10">￥</span>{{ scope.row.total_fee }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center"  >
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

      <!-- 商品信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column prop="id" label="订单ID" align="center" width="110"></el-table-column>
        <el-table-column label="品牌" align="center" width="110">
          <template slot-scope="scope">
            <img v-if="scope.row.brand && scope.row.brand.img" :src="scope.row.brand.img"
              style="width: 50px; height: 50px; object-fit: contain;">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.zhichong ? scope.row.zhichong.title : '' }}
          </template>
        </el-table-column>
        <el-table-column label="商品编码" align="center" >
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center" ></el-table-column>
        <el-table-column prop="price" label="单价" align="center"  ></el-table-column>
      </el-table>

      <!-- 用户信息 - 占一整行 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column label="用户信息" align="left">
          <template slot-scope="scope">
            <div class="info-row dflex">

              <div style="width: 30%;">
                <span class="info-label">充值账户：</span>
                <span class="info-value">{{ scope.row.phone }}</span>
              </div>

              <div class="">
                <span class="info-label">用户ID：</span>
                <span class="info-value">
                  <span    @click="showUserDetail(scope.row.uid)">{{ scope.row.uid }}</span>
                </span>
              </div>
            </div>
            <div class="info-row dflex">
              <div style="width: 30%;">


                <span class="info-label">用户：</span>
                <span  >{{ scope.row.phone }}</span>
              </div>

              <div>
                <span class="info-label">订单状态：</span>
                <span class="info-value"  >
                  {{ getStateText(scope.row.state) }}
                </span>
              </div>

            </div>

            <div class="info-row">
              <span class="info-label">下单时间：</span>
              <span class="info-value">{{ formatTime(scope.row.add_time) }}</span>
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
                <span class=" ">{{ getCardType(item.pid) }}</span>
                {{ item.num }}
                <span>余额：<span class="fs10">￥</span>{{ item.price }}</span>
                
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
        <el-button  @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import UserDetailDialog from '@/components/UserDetailDialog'
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { getZcorder } from '@/api/modules/orders'

export default {
  components: { UserDetailDialog, FuliEditDrawer },
  name: 'DirectOrderdetails',
  data() {
    return {
      loading: false,
      orderInfo: {},userDialogVisible: false,   // 添加
    currentUserId: '',          // 添加
    fuliEditVisible: false,     // 添加
    currentCard: {},            // 添加
      fuliList: [],
      headerCellStyle: { background: '#f5f7fa', color: '#606266' },
       
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
      if (!orderId) { this.$message.error('订单ID不存在'); return }
      this.loading = true
      try {
        const res = await getZcorder({ id: orderId })
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
        this.fuliList = data.fuli_list.filter(item => String(item.id) !== 'wx').map(item => ({
          id: item.id, gid: item.gid, num: item.num, pass: item.pass,
          price: item.price, kc: item.kc, uid: item.uid,   pid: item.pid,  // 添加
          state: item.state, bd_time: item.bd_time, shop: item.shop
        }))
      } else if (data.fuli) {
        try {
          const fuliData = typeof data.fuli === 'string' ? JSON.parse(data.fuli) : data.fuli
          if (Array.isArray(fuliData)) {
            this.fuliList = fuliData.filter(item => item.id !== 'wx').map(item => ({
              id: item.id,   pid: item.pid, price: item.price, kc: item.price, num: item.id, gid: null
            }))
          }
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

    goBack() { this.$router.go(-1) },

    getStateText(state) {
      return { 1: '失败', 2: '成功', 3: '已取消' }[state] || ''
    },
    getStateColor(state) {
      return { 1: '#F56C6C', 2: '#67C23A', 3: '#909399' }[state] || '#303133'
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    }
  }
}
</script>
<style scoped>
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