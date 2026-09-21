<template>
  <div class="list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.start_time"
            type="date"
            placeholder="开始时间"
            class="w160"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.end_time"
            type="date"
            placeholder="结束时间"
            class="w160"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.type" placeholder="全部" class="w120">
            <el-option label="全部" value="0"></el-option>
            <el-option label="充值" value="1"></el-option>
            <el-option label="消费" value="2"></el-option>
            <el-option label="退款" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="resetSearch()">重置</el-button> -->
        </el-form-item>
        <el-form-item>
          <span class="tip-text">(只支持查询近30内的数据)</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预付款余额显示 -->
    <el-card class="balance-card" v-if="yufukuan">
      <div class="balance-info">
        <span class="balance-label">预付款剩余金额：</span>
        <span class="balance-amount"> <span style="font-size: 18px;">¥</span> {{ yufukuan }}</span>
      </div>
    </el-card>

    <!-- 表格 -->
    <el-card class="search-card">
      <el-table 
        ref="multipleTable" 
        :data="tableData" 
        border 
        tooltip-effect="dark" 
        style="width: 100%"
        v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        
        <el-table-column label="编号" width="180"  align="center">

          <template slot-scope="scope">
             
              {{ scope.row.id }}
            
          </template>
        </el-table-column>
        
        <el-table-column label="订单类型" align="center" >
          <template slot-scope="scope">
             
              {{ scope.row.order_type }}
            
          </template>
        </el-table-column>
        
        <el-table-column label="金额变动类型" align="center" >
          <template slot-scope="scope">
            <span :style="{ color: getMoneyTypeColor(scope.row.money_type),  }">
              {{ scope.row.money_type }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="订单号" align="center"  >
          <template slot-scope="scope">
            
              <span  >{{ scope.row.out_order_no || '-' }}</span>
            
          </template>
        </el-table-column>
        
        <el-table-column label="金额" align="center" >
          <template slot-scope="scope">
            <span  ><span class="fs10">¥</span>{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="蛋糕叔叔订单号" align="center"  >
          <template slot-scope="scope">
             
              <span  >{{ scope.row.order_no || '-' }}</span>
           
          </template>
        </el-table-column>
        
        <el-table-column label="生成时间" align="center" >
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { expendList } from '@/api/modules/dgorder'

export default {
  name: 'ExpendList',
  data() {
    return {
      searchForm: {
        start_time: this.getDefaultStartTime(),
        end_time: this.getDefaultEndTime(),
        type: '0'
      },
      tableData: [],
      loading: false,
      yufukuan: '0.00'
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    getDefaultStartTime() {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return this.formatDate(date)
    },

    getDefaultEndTime() {
      return this.formatDate(new Date())
    },

    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async loadData() {
      this.loading = true
      try {
        const params = {
          start_time: this.searchForm.start_time,
          end_time: this.searchForm.end_time,
          type: this.searchForm.type || '0'
        }

        const res = await expendList(params)
        
        if (res.code === 200) {
          this.tableData = res.data.yufukuan_list || []
          this.yufukuan = res.data.yufukuan || '0.00'
        } else {
          this.$message.error(res.msg || '获取预付款列表失败')
        }
      } catch (error) {
        console.error('获取预付款列表失败:', error)
        this.$message.error('获取预付款列表失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      if (!this.searchForm.start_time || !this.searchForm.end_time) {
        this.$message.warning('请选择开始时间和结束时间')
        return
      }
      
      const startDate = new Date(this.searchForm.start_time)
      const endDate = new Date(this.searchForm.end_time)
      const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays > 30) {
        this.$message.warning('查询时间范围不能超过30天')
        return
      }
      
      if (startDate > endDate) {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      
      this.loadData()
    },

    resetSearch() {
      this.searchForm = {
        start_time: this.getDefaultStartTime(),
        end_time: this.getDefaultEndTime(),
        type: '0'
      }
      this.loadData()
    },

    getOrderTypeTag(type) {
      const tagMap = {
        '实物': 'warning',
        '门店劵': 'success',
        '电影票': 'info'
      }
      return tagMap[type] || ''
    },

    getMoneyTypeColor(type) {
      const colorMap = {
        '充值': '#67C23A',
        '消费': '#F56C6C',
        '退款': '#409EFF'
      }
      return colorMap[type] || '#303133'
    }
  }
}
</script>

<style>
.serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.serchForm .el-card__body {
  text-align: left;
}

.serchForm .el-input__icon {
  line-height: 36px;
}

.serchForm .el-form-item__content {
  line-height: 36px;
}

.serchForm .el-form-item__label {
  line-height: 36px;
}

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}
</style>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-bottom: 20px;
    
    .balance-info {
      padding: 10px 20px 10px 0;
      display: flex;align-items: center;
      border-radius: 8px;
      color: #fff;
      
      .balance-label {
        font-size: 14px;
        opacity: 0.9;
      }
      
      .balance-amount {
        font-size: 24px;
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }

  .order-no {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #606266;
  }

  .money-text {
    color: #F56C6C;
    font-weight: 500;
    font-size: 14px;
  }

  .tip-text {
    color: #909399;
    font-size: 12px;
  }

  .w120 {
    width: 120px;
  }
  
  .w160 {
    width: 160px;
  }
}
</style>