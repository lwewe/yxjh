<template>
  <div class="list-container-antorder">
    <template v-if="isAntorder">
      <el-card class="formsTop">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <!-- 搜索字段选择 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w130" clearable>
              <el-option label="点餐订单号" value="orderid"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="下单手机号" value="phone"></el-option>
            </el-select>
          </el-form-item>

          <!-- 关键词 -->
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
          </el-form-item>

          <!-- 开始时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始时间" class="w150" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>

          <!-- 结束时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束时间" class="w150" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>

          <!-- 平台标识 -->
          <el-form-item label="">
            <el-select v-model="searchForm.pf" placeholder="平台标识" class="w130" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="肯德基" value="kfc"></el-option>
              <el-option label="麦当劳" value="mdl"></el-option>
              <el-option label="必胜客" value="bsk"></el-option>
              <el-option label="星巴克" value="xbk"></el-option>
              <el-option label="奈雪的茶" value="nx"></el-option>
            </el-select>
          </el-form-item>

          <!-- 订单状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.packFlag" placeholder="订单状态" class="w140" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="待付款" value="0"></el-option>
              <el-option label="已付款待出餐" value="1"></el-option>
              <el-option label="出餐中" value="2"></el-option>
              <el-option label="出餐成功" value="3"></el-option>
              <el-option label="确认收货" value="4"></el-option>
              <el-option label="出餐失败退款" value="5"></el-option>
              <el-option label="订单关闭" value="10"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
    <!-- 表格 -->
<el-card class="search-card mt20">
  <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
    <!-- 订单号 + 平台 -->
    <el-table-column label="订单号" align="center" width="220">
      <template slot-scope="scope">
        <div>{{ scope.row.third_orderid }}</div>
        <div class="color999 fs12">({{ getPfName(scope.row.pf) }})</div>
        <div class="dangerCl fs12" v-if="scope.row.returnprice > 0">有退款</div>
      </template>
    </el-table-column>

    <!-- 点餐订单号 -->
    <el-table-column label="点餐订单号" align="center" min-width="200">
      <template slot-scope="scope">{{ scope.row.orderid }}</template>
    </el-table-column>

    <!-- 下单用户 -->
    <el-table-column label="下单用户" align="center" min-width="90">
      <template slot-scope="scope">{{ scope.row.uid }}</template>
    </el-table-column>

  

    <!-- 商品 + 结算价 + 配送费 -->
 <!-- 商品 + 结算价 + 配送费 -->
<el-table-column label="商品" align="left" min-width="320">
  <template slot-scope="scope">
    <div v-for="(item, idx) in scope.row.goodsdata" :key="idx" class="goods-item">
      <div class="goods-row">
        <img :src="item.itemImage" alt="" class="goods-img">
        <div class="goods-info">
          <div class="blackCl">{{ item.itemName }}</div>
          <div class="color999 fs12">{{ item.listname }}</div>
          <div class="goods-price-row">
            <span class="goods-amount"><span class="fs10">￥</span>{{ item.amount }} * {{ item.quantity }}</span>
            <span class="goods-delivery" v-if="idx === 0"><span class="fs10">￥</span>{{ scope.row.deliveryPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
</el-table-column>
  <!-- 总价 -->
    <el-table-column label="总价" align="center" min-width="100">
      <template slot-scope="scope">
        <span class="fs10">￥</span>{{ scope.row.price }}
      </template>
    </el-table-column>

    <!-- 订单状态 -->
    <el-table-column label="订单状态" align="center" min-width="130">
      <template slot-scope="scope">
        <span :class="getStatusClass(scope.row.status)">{{ scope.row.statusstr }}</span>
        <div class="fs12 color999">外送</div>
      </template>
    </el-table-column>
    <!-- 时间 -->
    <el-table-column label="时间" align="center" min-width="160">
      <template slot-scope="scope">
        <div class="fs12 color999">{{ formatTime(scope.row.updatedtime) }}</div>
        <div class="fs12 color999">{{ formatTime(scope.row.createdtime) }}</div>
      </template>
    </el-table-column>

    <!-- 操作 -->
    <el-table-column label="操作" min-width="80" fixed="right" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 1 }} 页</div>
      </div>
    </template>

    <router-view></router-view>
  </div>
</template>

<script>
import { myorderList } from '@/api/modules/myorder'

export default {
  name: 'AntOrder',
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      searchForm: {
        search_key: 'orderid',
        search_val: '',
        starttime: '',
        endtime: '',
        pf: 'status',
        packFlag: 'status'
      },
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
      async loadData() {
  this.loading = true
  try {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      search_key: this.searchForm.search_key || 'orderid',
      search_val: this.searchForm.search_val || '',
      starttime: this.searchForm.starttime || '',
      endtime: this.searchForm.endtime || '',
      pf: this.searchForm.pf,
      packFlag: this.searchForm.packFlag
    }

    const res = await myorderList(params)
    console.log('接口返回:', res)  // 添加日志查看返回结构
    
    if (res.code === 200) {
      this.tableData = res.data.list || []
      this.total = res.data.total || 0
      console.log('total:', this.total, 'currentPage:', this.currentPage)  // 确认分页数据
    } else {
      this.$message.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取蚂蚁订单列表失败:', error)
    this.$message.error('获取数据失败')
  } finally {
    this.loading = false
  }
},

    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    handleReset() {
      this.searchForm = {
        search_key: 'orderid',
        search_val: '',
        starttime: '',
        endtime: '',
        pf: 'status',
        packFlag: 'status'
      }
      this.currentPage = 1
      this.loadData()
    },

    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    viewDetail(row) {
      this.$router.push({ name: 'AntOrderdetails', params: { id: row.orderid } })
    },

    getPfName(pf) {
      const map = {
        kfc: '肯德基', mdl: '麦当劳', bsk: '必胜客',
        xbk: '星巴克', nx: '奈雪的茶'
      }
      return map[pf] || pf
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
    }
  },
  computed: {
    isAntorder() {
      return this.$route.name === 'AntOrder' || this.$route.path === '/meal-order/ant'
    }
  }
}
</script>
<style>
.list-container-antorder  .formsTop .el-card__body {
  padding: 20px 20px 0 20px;
}

</style>

<style scoped>
.pagination {
  background: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}
.list-container-antorder {
  font-size: 14px;
}


.mt20 {
  margin-top: 20px;
}

.w130 { width: 130px; }
.w140 { width: 140px; }
.w150 { width: 150px; }

.dflex { display: flex; }
.al-center { align-items: center; }
.txtleft { text-align: left; }
.ml10 { margin-left: 10px; }
.fs10 { font-size: 10px; }
.fs12 { font-size: 12px; }

.blackCl { color: #333; font-weight: 500; }
.color666 { color: #666; }
.color999 { color: #999; }
.successCl { color: #67C23A; }
.warningCl { color: #E6A23C; }
.dangerCl { color: #F56C6C; }

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
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  text-align: left;
  margin-left: 10px;
  min-width: 0;
}

.goods-price-row {
  margin-top: 2px;
}

.goods-amount {
  color: #333;
  font-weight: 500;
  font-size: 13px;
}

.goods-delivery {
  color: #E6A23C;
  font-weight: 500;
  font-size: 13px;
  margin-left: 15px;
}

.goods-times {
  margin-left: 15px;
  flex-shrink: 0;
  min-width: 150px;
  text-align: center;
  line-height: 1.6;
}
</style>