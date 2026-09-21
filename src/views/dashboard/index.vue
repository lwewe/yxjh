<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="dashboard-header">
      <el-col :span="6" v-for="item in statistics" :key="item.title">
        <el-card class="statistics-card" :body-style="{ padding: '20px' }">
          <div class="statistics-item">
            <div class="statistics-icon" :style="{ backgroundColor: item.color }">
              <i :class="item.icon"></i>
            </div>
            <div class="statistics-info">
              <div class="statistics-title">{{ item.title }}</div>
              <div class="statistics-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>



    <el-row :gutter="20" class="dashboard-charts">
      <el-col :span="16">


        <!-- <el-card class="chart-card" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span>待处理事务</span>
          </div>


          <div>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="home-thing1"><span>待备货订单</span> <span>31</span>
 </div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing1"><span>待发货订单</span><span>22</span></div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing1"><span>待处理取消订单</span><span>8</span></div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing1"><span>待处理退款申请</span><span>9</span></div>
              </el-col>
            </el-row>

          </div>
        </el-card> -->


        <!-- <el-card class="chart-card" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span>异常订单提醒</span>
          </div>

          <div>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="home-thing2">
                  <span>超时未发货订单</span> 
                  <span>1</span>
 </div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing2">
               <span>即将超时未发货订单</span>   
                  <span>5</span>
                
                </div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing2">
                <span>超24小时无物流轨迹订单</span>  
                  
<span>1</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="home-thing2">
                <span>优质物流上传错误</span>  
                <span>2</span>
                </div>
              </el-col>
               
            </el-row>
          </div>
        </el-card> -->


        <el-card class="chart-card">
          <div slot="header" class="clearfix">
            <span>常用按钮</span>
          </div>
          <div>

            <template v-if="isAdmin">
              <div class="icon-14" @click="navigateTo('/welfare/list')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>福利卡</div>
              </div>
              <div class="icon-14" @click="navigateTo('/card-book/list')">
                <img src="../../assets/btn_icon2.png" alt="">
                <div>卡册</div>
              </div>
              <div class="icon-14" @click="navigateTo('/voucher/list')">
                <img src="../../assets/btn_icon7.png" alt="">
                <div>权益券</div>
              </div>
              <div class="icon-14" @click="navigateTo('/mall-order/total')">
                <img src="../../assets/btn_icon1.png" alt="">
                <div>商城订单(总)</div>
              </div>
              <div class="icon-14" @click="navigateTo('/mall-order/list')">
                <img src="../../assets/btn_icon2.png" alt="">
                <div>订单列表</div>
              </div>
              <div class="icon-14" @click="navigateTo('/mall-order/exchange')">
                <img src="../../assets/btn_icon4.png" alt="">
                <div>兑换订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/cake-order/channel')">
                <img src="../../assets/btn_icon1.png" alt="">
                <div>渠道订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/cake-order/list')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>蛋糕订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/cake-order/prepay')">
                <img src="../../assets/btn_icon4.png" alt="">
                <div>预付款列表</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/movie')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>电影订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/card')">
                <img src="../../assets/btn_icon4.png" alt="">
                <div>卡券订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/direct')">
                <img src="../../assets/btn_icon6.png" alt="">
                <div>直充订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/show')">
                <img src="../../assets/btn_icon2.png" alt="">
                <div>演出订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/book')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>图书订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/ticket-order/scenic')">
                <img src="../../assets/btn_icon5.png" alt="">
                <div>景区订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/meal-order/qipiao')">
                <img src="../../assets/btn_icon7.png" alt="">
                <div>奇票订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/meal-order/ant')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>蚂蚁订单</div>
              </div>
              <div class="icon-14" @click="navigateTo('/password/change')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>修改密码</div>
              </div>
            </template>

            <!-- ========== 非管理员 ========== -->
            <template v-if="!isAdmin">
              <!-- 商城相关 -->
              <template v-if="canViewMall">
                <div class="icon-14" @click="navigateTo('/product/list')">
                  <img src="../../assets/btn_icon3.png" alt="">
                  <div>产品列表</div>
                </div>
                <!-- <div class="icon-14" @click="navigateTo('/product/category')">
                  <img src="../../assets/btn_icon2.png" alt="">
                  <div>产品分类</div>
                </div> -->
                <div class="icon-14" @click="navigateTo('/mall-order/list')">
                  <img src="../../assets/btn_icon1.png" alt="">
                  <div>商城订单</div>
                </div>
                <div class="icon-14" @click="navigateTo('/mall-order/exchange')">
                  <img src="../../assets/btn_icon4.png" alt="">
                  <div>兑换订单</div>
                </div>
              </template>

              <!-- 蛋糕相关 -->
              <template v-if="canViewCake">
                <div class="icon-14" @click="navigateTo('/cake/list')">
                  <img src="../../assets/btn_icon5.png" alt="">
                  <div>蛋糕产品</div>
                </div>
                <div class="icon-14" @click="navigateTo('/cake/brand')">
                  <img src="../../assets/btn_icon6.png" alt="">
                  <div>品牌列表</div>
                </div>
                <div class="icon-14" @click="navigateTo('/cake-order/list')">
                  <img src="../../assets/btn_icon7.png" alt="">
                  <div>蛋糕订单</div>
                </div>
              </template>

              <!-- 修改密码：所有人可见 -->
              <div class="icon-14" @click="navigateTo('/password/change')">
                <img src="../../assets/btn_icon3.png" alt="">
                <div>修改密码</div>
              </div>
            </template>

          </div>

        </el-card>

      </el-col>
      <el-col :span="8">


        <!-- <el-card class="chart-card" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span>消息通知</span>
          </div>
<div class="new-home">
  <ul>
    <li><span>1、26年春日焕新活动专题</span><span>2026-03-03</span> </li>
    <li><span>2、2026年3月特价品提报</span><span>2026-02-01</span> </li>
    <li><span>3、春节放假挂公告</span><span>2026-01-18</span> </li>
    <li><span>4、授权更新</span><span>2026-01-03</span> </li>
    <li><span>5、2026年2月特价品提报</span><span>2026-01-01</span> </li>
  </ul>
</div>
        </el-card> -->
        <el-card class="chart-card">
          <div slot="header" class="clearfix">
            <span>意见反馈</span>

          </div>
          <div class="new-home" v-loading="feedbackLoading">
            <ul v-if="feedbackList.length > 0">
              <li v-for="(item, index) in feedbackList" :key="item.id" @click="navigateTo('/feedback/list')"
                style="cursor: pointer;">
                <span class="yjfk">

                  {{ index + 1 }}、{{ item.content }}
                </span>
                <span>{{ formatTime(item.add_time) }}</span>
              </li>
            </ul>
            <div v-else style="text-align: center;font-size: 12px; padding:18px; color: #999;">
              暂无意见反馈
            </div>
          </div>
        </el-card>

      </el-col>
    </el-row>


    <!--  -->




    <el-row :gutter="20" class="dashboard-charts">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="clearfix">
            <span>访问量趋势<span class="fs12 color666">（近30天）</span></span>
          </div>
          <div id="trendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="clearfix">
            <span>订单分布</span>
          </div>
          <div id="pieChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import { feedbackList } from '@/api/modules/myorder'
export default {
  name: 'DashboardPage',  // 修改组件名
  filters: {
    statusFilter(status) {
      const statusMap = {
        '待付款': 'danger',
        '已付款': 'success',
        '已完成': 'info',
        '已取消': 'warning'
      }
      return statusMap[status] || ''
    }
  },
  data() {
    return {
      roleId: parseInt(localStorage.getItem('role_id') || '0'),  // ← 加 parseInt
      roleName: localStorage.getItem('role_name') || '',
      isSuperAdmin: localStorage.getItem('is_super_admin') === '1',  // ← 改成布尔值
      feedbackList: [],
      feedbackLoading: false,
      statistics: [
        { title: '今日订单金额', value: '2026.28', icon: 'el-icon-view', color: '#409EFF' },
        { title: '订单总数', value: '85', icon: 'el-icon-s-order', color: '#67C23A' },
        { title: '用户总数', value: '65389', icon: 'el-icon-user', color: '#E6A23C' },
        { title: '商品总数', value: '16287', icon: 'el-icon-goods', color: '#F56C6C' }
      ],
      recentOrders: [
        { orderNo: '202401010001', productName: '商品A', amount: '299.00', status: '待付款', createTime: '2024-01-01 10:00' },
        { orderNo: '202401010002', productName: '商品B', amount: '399.00', status: '已付款', createTime: '2024-01-01 11:00' },
        { orderNo: '202401010003', productName: '商品C', amount: '199.00', status: '已完成', createTime: '2024-01-01 12:00' },
        { orderNo: '202401010004', productName: '商品D', amount: '499.00', status: '已付款', createTime: '2024-01-01 13:00' },
        { orderNo: '202401010005', productName: '商品E', amount: '599.00', status: '已取消', createTime: '2024-01-01 14:00' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
      if (this.isAdmin) {
        this.loadFeedbackList()
      }
    })
  },
  computed: {
    isAdmin() {
      return this.roleId === 1 || this.isSuperAdmin
    },
    canViewMall() {
      return this.isAdmin || [28, 30, 46].includes(this.roleId)
    },
    canViewCake() {
      return this.isAdmin || [29, 30, 47].includes(this.roleId)
    },
    canViewAllOrders() {
      return this.isAdmin
    },
    canViewFeedback() {
      return this.isAdmin
    }
  },
  methods: {
    // 新增：加载反馈列表
    async loadFeedbackList() {
      this.feedbackLoading = true
      try {
        const params = {
          pid: '',
          page: 1,
          limit: 7,
          px_key: 'add_time',
          px_val: 'desc',
          sh: 'status'
        }
        const res = await feedbackList(params)  // ✅ 使用已导入的方法
        if (res.code === 200) {
          this.feedbackList = res.data.data || []
        }
      } catch (error) {
        console.error('获取反馈失败:', error)
      } finally {
        this.feedbackLoading = false
      }
    },

    // 新增：格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    },

    navigateTo(path) {
      this.$router.push(path)
    },
    initCharts() {
      // 生成最近30天的日期
      const getLast30Days = () => {
        const dates = []
        const today = new Date()
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          dates.push(`${month}-${day}`)
        }
        return dates
      }

      // 生成随机访问量数据（模拟真实波动）
      const generateRandomData = () => {
        const data = []
        let baseValue = 200 // 基础值
        for (let i = 0; i < 30; i++) {
          // 添加一些随机波动，模拟真实的访问量变化
          const random = Math.floor(Math.random() * 150) + 50 // 50-200的随机波动
          const weekendEffect = (i % 7 === 0 || i % 7 === 6) ? -30 : 0 // 周末访问量略低
          const value = Math.max(100, baseValue + random + weekendEffect)
          data.push(value)
          // 让数据有一定的趋势性
          baseValue += Math.floor(Math.random() * 20) - 10
        }
        return data
      }

      // 趋势图
      const trendChart = this.$echarts.init(document.getElementById('trendChart'))
      const dates = getLast30Days()
      const visitData = generateRandomData()

      trendChart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0]
            return `${data.name}<br/>访问量：${data.value} 次`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLabel: {
            rotate: 45,
            interval: 4 // 每隔4天显示一个标签，避免重叠
          }
        },
        yAxis: {
          type: 'value',
          name: '访问量(次)'
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            data: visitData,
            smooth: true,
            symbol: 'none', // 不显示数据点
            lineStyle: {
              width: 2,
              color: '#409EFF'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                  { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
                ]
              }
            }
          }
        ]
      })

      // 饼图（保持不变）
      const pieChart = this.$echarts.init(document.getElementById('pieChart'))
      pieChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: '订单分布',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 235, name: '电子产品' },
              { value: 274, name: '服装鞋帽' },
              { value: 310, name: '食品饮料' },
              { value: 335, name: '图书音像' },
              { value: 400, name: '其他' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })

      window.addEventListener('resize', () => {
        trendChart.resize()
        pieChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .yjfk {
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    padding-right: 10px;
  }

  .dashboard-header {
    margin-bottom: 20px;

    .statistics-card {
      .statistics-item {
        display: flex;
        align-items: center;

        .statistics-icon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;

          i {
            font-size: 24px;
            color: #fff;
          }
        }

        .statistics-info {
          text-align: right;
          flex: 1;

          .statistics-title {
            font-size: 14px;
            color: #999;
            margin-bottom: 5px;
          }

          .statistics-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
        }
      }
    }
  }

  .home-thing1 {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    background-color: #fef0f0;
    line-height: 50px;
    border-radius: 6px;
    padding: 0 20px;
  }

  .home-thing1:hover {
    cursor: pointer;
    background-color: #fde2e2;
  }

  .home-thing2:hover {
    cursor: pointer;
    background-color: #faecd8;
  }

  .home-thing2 {
    font-size: 14px;
    padding: 0 20px;
    background-color: #fdf6ec;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    line-height: 50px;
  }

  .home-thing3 {
    background-color: #fef0f0;
  }

  .home-thing4 {
    background-color: #f4f4f5;
  }

  .icon-14 {
    width: 16.6%;
    float: left;
    opacity: 0.8;
    margin-top: 1px;
    margin-bottom: 20px;
    font-size: 14px;

  }

  .icon-14:hover {
    cursor: pointer;
    opacity: 1;

  }

  .new-home li {
    font-size: 14px;
    display: flex;
    justify-content: space-between;

    span {
      color: #333333;
      line-height: 2;
    }

    span:last-child {
      color: #666666;
    }
  }

  .dashboard-charts {
    margin-bottom: 20px;

    .chart-card {
      .clearfix {
        text-align: left;
      }

      :deep(.el-card__header) {
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style>