<template>
  <div class="list-container titles drawers" v-loading="loading">
    <el-card class="search-card">
      <!-- 订单基本信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column label="下单位置" align="center">
          <template slot-scope="scope">
            {{ scope.row.order_position == 0 ? '福利卡' : '权益券' }}
          </template>
        </el-table-column>
        <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
        <el-table-column prop="tradeno" label="第三方订单号" align="center"></el-table-column>
        <el-table-column prop="opiid" label="场次ID" align="center"></el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.orderstatus)">
              {{ getStatusText(scope.row.orderstatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 影院和用户信息 -->
      <el-table :data="[orderInfo]" border style="width: 100%" class="mt20" :header-cell-style="headerCellStyle">
        <el-table-column prop="cityname" label="城市名称" align="center" width="110"></el-table-column>
        <el-table-column label="影片" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.moviename }}</div>
            <div>{{ scope.row.edition }}</div>
          </template>
        </el-table-column>
        <el-table-column label="影院信息" align="center" width="290">
          <template slot-scope="scope">
            <div class="txtleft">影院名称：{{ scope.row.cinemaname }}</div>
            <div class="txtleft">影厅名称：{{ scope.row.roomname }}</div>
            <div class="txtleft">放映时间：{{ scope.row.playtime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="座位信息" align="center" width="290">
          <template slot-scope="scope">
            <div class="txtleft">座位数量：{{ scope.row.quantity }}</div>
            <div class="txtleft">座位信息：{{ scope.row.seats }}</div>
            <div class="txtleft">座位价格：{{ scope.row.seats_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <div>展示金额：{{ scope.row.showamount }}</div>
            <div>结算金额：{{ scope.row.settleamount }}</div>
            <div v-if="scope.row.type == 2">佣金：{{ scope.row.commission }}</div>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center">
          <template slot-scope="scope">
            <div>{{ formatTime(scope.row.expiretime) }}</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情和支付信息 -->
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="grid-content bg-purple mt20 border1">
            <div class="pd10 lh3">
              <div class="w100 dflex txtleft">
                <div class="w90 txtright">取票码：</div>
                <div class="flex1 sizeCl6">{{ getTicketCodes() }}</div>
              </div>
              <div class="w100 dflex txtleft">
                <div class="w90 txtright">订单状态：</div>
                <div class="flex1 sizeCl6">{{ getStatusText(orderInfo.orderstatus) }}</div>
              </div>
              <div class="w100 dflex txtleft">
                <div class="w90 txtright">取票短信：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.smscontent || '无' }}</div>
              </div>
              <div class="w100 dflex txtleft" v-if="orderInfo.type == 1">
                <div class="w90 txtright">退款原因：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.refundreason || '无' }}</div>
              </div>
              <div class="w100 dflex txtleft" v-if="orderInfo.type == 2">
                <div class="w90 txtright">退款金额：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.refundreason || '0.00' }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple mt20 border1">
            <div class="pd10 lh3">
              <!-- 福利卡支付列表 -->
              <template v-if="fuliList.length > 0">
                <div v-for="(item, index) in fuliList" :key="index" class="w100 dflex txtleft">
                  <div class="w90 txtright">
                    {{ item.id === 'wx' ? '微信支付：' : '福利卡支付：' }}
                  </div>
                  <div class="flex1 sizeCl6">
                    <span v-if="item.id !== 'wx'" class="warningCl">
                      [{{ getCardType(item.gid) }}]
                    </span>
                    {{ item.id !== 'wx' ? item.num : '' }}
                    <span v-if="item.id !== 'wx'">（<span class="fs10">￥</span>{{ item.price }}）</span>
                    扣除 <span class="fs10">￥</span>{{ item.kc || item.deductPrice }}
                  </div>
                </div>
              </template>
              <div v-else class="w100 dflex txtleft">
                <div class="w90 txtright">支付信息：</div>
                <div class="flex1 sizeCl6">无支付信息</div>
              </div>
              
              <!-- 微信支付 -->
              <div v-if="orderInfo.total_fee > 0" class="w100 dflex txtleft">
                <div class="w90 txtright">微信支付：</div>
                <div class="flex1 sizeCl6"><span class="fs10">￥</span>{{ orderInfo.total_fee }}</div>
              </div>
              <div v-if="orderInfo.transaction_id" class="w100 dflex txtleft">
                <div class="w90 txtright">交易流水号：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.transaction_id }}</div>
              </div>
              
              <!-- 权益券信息 -->
              <div v-if="orderInfo.order_position == 1 && orderInfo.quan_gid > 0" class="w100 dflex txtleft">
                <div class="w90 txtright">权益券ID：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.quan_gid }}</div>
              </div>
              
              <!-- 折扣 -->
              <div class="w100 dflex txtleft">
                <div class="w90 txtright">折扣：</div>
                <div class="flex1 sizeCl6">{{ orderInfo.discount }}%</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 修改福利卡抽屉 -->
    <el-drawer 
      title="修改福利卡" 
      :visible.sync="drawer" 
      :direction="direction" 
      :before-close="handleClose" 
      size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form 
            status-icon 
            ref="ruleForm" 
            :model="cardInfo" 
            label-width="100px" 
            style="width: 80%"
            class="demo-ruleForm">
            
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="cardInfo.kh" readonly />
            </el-form-item>
            
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="cardInfo.mm" readonly />
            </el-form-item>
            
            <el-form-item label="价格：" style="text-align: left;">
              <div class="price-control">
                <span class="addBorder">
                  <el-input 
                    v-model="cardInfo.price" 
                    placeholder="0.00" 
                    style="width: 100px;margin-right: 10px;" 
                    readonly />
                </span>
                <span class="price-spacer"></span>
                <el-select v-model="cardInfo.addtype" style="width: 80px;margin-right: 10px;">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input 
                  v-model="cardInfo.addprice" 
                  placeholder="价格" 
                  style="width: 100px;margin-right: 10px;" />
                <el-button type="success" @click="savePrice">保存</el-button>
              </div>
            </el-form-item>
            
            <el-form-item label="分类：">
              <el-select v-model="cardInfo.gid" filterable placeholder="请选择分类" style="width: 100%">
                <el-option 
                  v-for="item in categoryOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="兑换购物卡：" style="text-align: left;">
              <el-select v-model="cardInfo.shop" style="width: 80px;">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="激活状态：" class="addBorder">
              <el-input v-model="cardInfo.activeStatus" readonly />
            </el-form-item>
            
            <el-form-item label="兑换用户：" class="addBorder">
              <el-input v-model="cardInfo.exchangeUser" readonly />
            </el-form-item>
            
            <el-form-item style="display: none">
              <el-input v-model="cardInfo.id" />
            </el-form-item>
            
            <el-form-item class="txtleft">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>

          <!-- 卡操作记录 -->
          <el-table 
            :data="cardLogs" 
            border 
            style="width: 100%" 
            max-height="300" 
            :header-cell-style="headerCellStyle">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="price" label="价格" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1" class="dangerCl">后台充值</span>
                <span v-else-if="scope.row.type == 2" class="blueCl">后台扣除</span>
                <span v-else>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="200">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
            <el-table-column prop="trade_no" label="交易号" align="center"></el-table-column>
            <el-table-column prop="amount" label="实付金额" align="center"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getDyorder } from '@/api/modules/orders'

export default {
  name: 'MovieOrderdetails',
  data() {
    return {
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
    // 加载订单详情
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
          
          // 解析福利卡列表
          if (res.data.fuli_list && res.data.fuli_list.length > 0) {
            this.fuliList = res.data.fuli_list.map(item => ({
              ...item,
              num: item.num || '',
              deductPrice: item.kc || '0.00'
            }))
          } else if (res.data.fuli) {
            // 解析 fuli 字段
            try {
              const fuliData = typeof res.data.fuli === 'string' 
                ? JSON.parse(res.data.fuli) 
                : res.data.fuli
              
              if (Array.isArray(fuliData)) {
                this.fuliList = fuliData.map(item => ({
                  id: item.id,
                  price: item.price,
                  kc: item.price,
                  num: item.id === 'wx' ? '' : item.id,
                  gid: null
                }))
              }
            } catch (e) {
              console.error('解析福利卡信息失败', e)
            }
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

    // 获取取票码
    getTicketCodes() {
      if (!this.orderInfo.ticketcodelist || this.orderInfo.ticketcodelist.length === 0) {
        return '无'
      }
      
      try {
        const ticketList = typeof this.orderInfo.ticketcodelist === 'string'
          ? JSON.parse(this.orderInfo.ticketcodelist)
          : this.orderInfo.ticketcodelist
        
        if (Array.isArray(ticketList)) {
          const codes = ticketList.map(item => {
            if (Array.isArray(item)) {
              return item.map(ticket => ticket.value).join(', ')
            }
            return item.value || ''
          })
          return codes.join('; ') || '无'
        }
      } catch (e) {
        console.error('解析取票码失败', e)
      }
      return this.orderInfo.ticketcode || '无'
    },

    // 获取卡类型
    getCardType(gid) {
      if (!gid) return '商城尊享券'
      const category = this.categoryOptions.find(item => item.value == gid)
      return category ? category.label.split('[')[1]?.replace(']', '') || '商城尊享券' : '商城尊享券'
    },

    // 打开修改福利卡抽屉
    openEditDrawer(card) {
      this.cardInfo = {
        id: card.id || '',
        kh: card.num || '',
        mm: card.pass || '',
        price: card.price || '0.00',
        addtype: '1',
        addprice: '',
        gid: card.gid || null,
        shop: card.shop || 0,
        activeStatus: card.state == 3 ? '已绑定' : '未绑定',
        exchangeUser: card.uid ? `${card.uid} 兑换时间${this.formatTime(card.bd_time)}` : ''
      }
      this.drawer = true
    },

    // 保存价格修改
    savePrice() {
      // TODO: 调用修改卡余额接口
      this.$message.success('保存成功')
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO: 调用保存接口
          this.$message.success('保存成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleClose() {
      this.drawer = false
    },

    // 格式化时间戳
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

    // 获取订单状态文本
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

    // 获取订单状态标签类型
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

.sizeCl6 {
  color: #606266;
}

.fs10 {
  font-size: 12px;
}
</style>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.border1 {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.pd10 {
  padding: 10px;
}

.lh3 {
  line-height: 2;
}

.w100 {
  width: 100%;
}

.dflex {
  display: flex;
}

.txtleft {
  text-align: left;
}

.txtright {
  text-align: right;
}

.w90 {
  width: 90px;
  flex-shrink: 0;
}

.flex1 {
  flex: 1;
}

.bg-purple {
  // background: #d3dce6;
}
</style>