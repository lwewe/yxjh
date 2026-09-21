<template>
  <div class="list-container-qporder">
    <template v-if="isQipiaoOrder">
      <el-card class="formsTop">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <!-- 搜索字段选择 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w140" clearable>
              <el-option label="点餐订单号" value="orderCustomId"></el-option>
              <el-option label="下单手机号" value="userMobile"></el-option>
            </el-select>
          </el-form-item>

          <!-- 关键词 -->
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
          </el-form-item>

          <!-- 开始时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.startTime" type="date" placeholder="开始时间" class="w150" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>

          <!-- 结束时间 -->
          <el-form-item label="">
            <el-date-picker v-model="searchForm.endTime" type="date" placeholder="结束时间" class="w150" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>

          <!-- 平台标识 -->
          <el-form-item label="">
            <el-select v-model="searchForm.orderType" placeholder="平台标识" class="w120" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="肯德基" value="1"></el-option>
              <el-option label="麦当劳" value="2"></el-option>
              <el-option label="星巴克" value="4"></el-option>
              <el-option label="奈雪的茶" value="8"></el-option>
              <el-option label="瑞幸咖啡" value="16"></el-option>
              <el-option label="库迪" value="64"></el-option>
            </el-select>
          </el-form-item>

          <!-- 订单状态 -->
          <el-form-item label="">
            <el-select v-model="searchForm.orderState" placeholder="订单状态" class="w130" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="等待支付" value="0"></el-option>
              <el-option label="订单已付" value="1"></el-option>
              <el-option label="等待出码" value="2"></el-option>
              <el-option label="订单成功" value="3"></el-option>
              <el-option label="订单失败" value="4"></el-option>
              <el-option label="订单取消" value="5"></el-option>
              <el-option label="订单退款" value="6"></el-option>
              <el-option label="未付取消" value="7"></el-option>
              <el-option label="部分退款" value="8"></el-option>
              <el-option label="订单锁定" value="9"></el-option>
              <el-option label="客服处理中" value="10"></el-option>
              <el-option label="等待配送" value="11"></el-option>
              <el-option label="配送中" value="12"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="handleReset()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
      <el-card class="search-card mt20">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <!-- 订单号 + 平台 -->
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.entPara }}</div>
              <div class="color999 fs12">({{ scope.row.orderTypeName }})</div>
            </template>
          </el-table-column>

          <!-- 商品 -->
          <el-table-column label="商品" align="left" min-width="320">
            <template slot-scope="scope">
              <div v-for="(item, idx) in getProductsInfo(scope.row)" :key="idx" class="goods-item">
                <div class="goods-row">
                  <img :src="item.imageUrl" alt="" class="goods-img">
                  <div class="goods-info">
                    <div class="blackCl">{{ item.nameCn }}</div>
                    <div class="color999 fs12">{{ item.spec }}</div>
                    <div class="goods-price-row">
                      <span class="goods-amount"><span class="fs10">￥</span>{{ item.orgPrice }} * {{ item.quantity }}</span>
                      <span class="goods-settle"><span class="fs10">￥</span>{{ item.EpPrice }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 点餐订单号 -->
          <el-table-column label="点餐订单号" align="center"  min-width="190">
            <template slot-scope="scope">{{ scope.row.orderCustomId }}</template>
          </el-table-column>

          <!-- 总价 -->
          <el-table-column label="总价" align="center"  min-width="100">
            <template slot-scope="scope">
              <span class="fs10">￥</span>{{ scope.row.totalUserPrice }}
            </template>
          </el-table-column>

          <!-- 佣金 -->
          <el-table-column label="佣金" align="center"  min-width="80">
            <template slot-scope="scope">
              <span class="fs10">￥</span>{{ scope.row.epCommission }}
            </template>
          </el-table-column>

          <!-- 订单状态 -->
          <el-table-column label="订单状态" align="center"  min-width="120">
            <template slot-scope="scope">
              <span :class="getStateClass(scope.row.orderState)">{{ scope.row.orderStateName }}</span>
              <br>
              <span class="fs12 color999">{{ scope.row.eatTypeName }}</span>
            </template>
          </el-table-column>

          <!-- 下单时间 -->
          <el-table-column label="下单时间" align="center"  min-width="160">
            <template slot-scope="scope">{{ formatTimeStr(scope.row.createTime) }}</template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作"  min-width="80" fixed="right" align="center">
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
import { qporderList } from '@/api/modules/myorder'

export default {
  name: 'QipiaoOrder',
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      searchForm: {
        search_key: 'orderCustomId',
        search_val: '',
        startTime: '',
        endTime: '',
        orderType: 'status',
        orderState: 'status'
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
          search_key: this.searchForm.search_key || 'orderCustomId',
          search_val: this.searchForm.search_val || '',
          startTime: this.searchForm.startTime || '',
          endTime: this.searchForm.endTime || '',
          orderType: this.searchForm.orderType,
          orderState: this.searchForm.orderState
        }

        const res = await qporderList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取奇票订单列表失败:', error)
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
        search_key: 'orderCustomId',
        search_val: '',
        startTime: '',
        endTime: '',
        orderType: 'status',
        orderState: 'status'
      }
      this.currentPage = 1
      this.loadData()
    },

    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

  viewDetail(row) {
  this.$router.push({ name: 'QipiaoOrderdetails', params: { id: row.id } })
},
    // 解析 productsInfo JSON 字符串
    getProductsInfo(row) {
      if (!row.productsInfo) return []
      try {
        return typeof row.productsInfo === 'string' ? JSON.parse(row.productsInfo) : row.productsInfo
      } catch (e) {
        return []
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
    }
  },
  computed: {
    isQipiaoOrder() {
      return this.$route.name === 'QipiaoOrder' || this.$route.path === '/meal-order/qipiao'
    }
  }
}
</script>

<style>
.list-container-qporder .formsTop .el-card__body {
  padding: 20px 20px 0 20px;
}
</style>

<style scoped>
.list-container-qporder {
  font-size: 14px;
}



.mt20 { margin-top: 20px; }

.w130 { width: 130px; }
.w140 { width: 140px; }
.w150 { width: 150px; }

.fs10 { font-size: 10px; }
.fs12 { font-size: 12px; }

.blackCl { color: #333; font-weight: 500; }
.color999 { color: #999; }
.successCl { color: #67C23A; }
.warningCl { color: #E6A23C; }
.dangerCl { color: #F56C6C; }

.goods-item {
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.goods-item:last-child { border-bottom: none; }

.goods-row { display: flex; align-items: center; }

.goods-img {
  width: 50px; height: 50px;
  object-fit: cover; border-radius: 4px; flex-shrink: 0;
}

.goods-info {
  flex: 1; text-align: left; margin-left: 10px; min-width: 0;
}

.goods-price-row { margin-top: 2px; }

.goods-amount { color: #333; font-weight: 500; font-size: 13px; }

.goods-settle {
  color: #E6A23C; font-weight: 500; font-size: 13px; margin-left: 15px;
}

.pagination {
  background: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-info { font-size: 13px; color: #606266; }

.search-card { margin-bottom: 20px; }
</style>