<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="券号" value="num"></el-option>
            <el-option label="用户UID" value="uid"></el-option>
            <el-option label="编号" value="id"></el-option>
            <el-option label="用户手机号" value="phone"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="search-card">
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        v-loading="loading">
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="券号" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.num }}</template>
        </el-table-column>
        <el-table-column label="密码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.pass }}</template>
        </el-table-column>
        <el-table-column label="下单次数" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.cishu }}</template>
        </el-table-column>
        <el-table-column label="用户" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.uid || '-' }}</template>
        </el-table-column>
        <el-table-column label="绑定时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.bd_time ? formatTime(scope.row.bd_time) : '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="stateType(scope.row.state)" size="small">{{ stateName(scope.row.state) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="卡状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.flag == 1 ? 'success' : 'info'" size="small">
              {{ scope.row.flag == 1 ? '已分配' : '未分配' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权益券信息" min-width="200" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.exchange">
              {{ scope.row.exchange.company }} - {{ scope.row.exchange.sale }} (数量:{{ scope.row.exchange.geshu }})
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openDetail(scope.row)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 20px;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer title="券号详情" :visible.sync="drawer" :direction="direction" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form :model="cardInfo" label-width="120px" style="width: 80%">
            <el-form-item label="券号：">
              <el-input v-model="cardInfo.num" readonly />
            </el-form-item>
            <el-form-item label="密码：">
              <el-input v-model="cardInfo.pass" readonly />
            </el-form-item>
            <el-form-item label="下单次数：" style="text-align: left;">
              <div class="price-control">
                <span style="margin-right: 10px;">{{ cardInfo.cishu }}</span>
                <el-select v-model="cardInfo.addtype" style="width: 80px; margin-right: 10px;" 
                  :disabled="cardInfo.state != 3">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input v-model="cardInfo.addcishu" placeholder="次数" 
                  style="width: 100px; margin-right: 10px;" 
                  :disabled="cardInfo.state != 3" type="number" />
                <el-button type="success" @click="saveCishu" 
                  :disabled="cardInfo.state != 3" :loading="savingCishu">保存</el-button>
              </div>
            </el-form-item>
            <el-form-item label="权益券：">
              <el-select v-model="cardInfo.gid" filterable placeholder="请选择权益券" style="width: 100%">
                <el-option v-for="item in exchangeOptions" :key="item.id"
                  :label="item.id + '-' + item.company + '-' + item.sale + '[' + item.geshu + ']'"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-input :value="stateName(cardInfo.state)" readonly />
            </el-form-item>
            <el-form-item label="绑定用户：" v-if="cardInfo.uid">
              <el-input :value="cardInfo.uid + '    绑定时间' + (cardInfo.bd_time ? formatTime(cardInfo.bd_time) : '')" readonly />
            </el-form-item>
            <el-form-item style="display: none">
              <el-input v-model="cardInfo.id" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEdit" :loading="submitting">保存修改</el-button>
            </el-form-item>
          </el-form>

          <!-- 消费记录 -->
          <el-table :data="recordData" border style="width: 100%" max-height="300" 
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
            <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
            <el-table-column prop="cishu" label="次数" align="center" width="80"></el-table-column>
            <el-table-column label="类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1" style="color: #f56c6c;">后台充值</span>
                <span v-else style="color: #409eff;">后台扣除</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" align="center" width="180"></el-table-column>
            <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { quanSel, getQuanInfo, editQuan, editCishu, xfjl } from '@/api/modules/exchange'

export default {
  name: 'QuanSel',
  data() {
    return {
      loading: false,
      submitting: false,
      savingCishu: false,
      drawer: false,
      direction: 'rtl',
      searchForm: {
        search_key: 'num',
        search_val: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      exchangeOptions: [],
      cardInfo: {
        id: '',
        num: '',
        pass: '',
        cishu: 0,
        addtype: '1',
        addcishu: '',
        gid: '',
        state: '',
        uid: '',
        bd_time: ''
      },
      recordData: []
    }
  },
  mounted() {
    // 初始不加载，等点击查询
  },
  methods: {
    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0')
    },
    stateName(s) { return { 1: '未激活', 2: '已激活', 3: '已绑定' }[s] || '未知' },
    stateType(s) { return { 1: 'info', 2: 'success', 3: 'warning' }[s] || '' },

    // 搜索
    async handleSearch() {
      if (!this.searchForm.search_val) {
        this.$message.warning('请输入关键词')
        return
      }
      this.currentPage = 1
      this.getList()
    },

    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await quanSel(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '查询失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    handleSizeChange(v) { this.pageSize = v; this.currentPage = 1; this.getList() },
    handleCurrentChange(v) { this.currentPage = v; this.getList() },

    // 打开详情抽屉
    async openDetail(row) {
      try {
        // 获取券号详细信息
        const res = await getQuanInfo({ id: row.id })
        if (res.code === 200) {
          const numData = res.data.num
          this.exchangeOptions = res.data.exchange_list || []
          this.cardInfo = {
            id: numData.id,
            num: numData.num,
            pass: numData.pass,
            cishu: numData.cishu || 0,
            addtype: '1',
            addcishu: '',
            gid: numData.gid || '',
            state: numData.state,
            uid: numData.uid || '',
            bd_time: numData.bd_time || ''
          }
        }

        // 获取消费记录
        const xfjlRes = await xfjl({ id: row.id })
        if (xfjlRes.code === 200) {
          this.recordData = xfjlRes.data.data || []
        }

        this.drawer = true
      } catch (e) {
        this.$message.error('请求失败')
      }
    },

    // 保存下单次数（已绑定状态）
    async saveCishu() {
      if (!this.cardInfo.addcishu) {
        this.$message.warning('请输入次数')
        return
      }
      this.savingCishu = true
      try {
        const res = await editCishu({
          id: this.cardInfo.id,
          addtype: this.cardInfo.addtype,
          addcishu: this.cardInfo.addcishu
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.cardInfo.cishu = res.data.cishu
          this.cardInfo.addcishu = ''
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.savingCishu = false
      }
    },

    // 提交修改
    async submitEdit() {
      this.submitting = true
      try {
        const params = { id: this.cardInfo.id, gid: this.cardInfo.gid }
        // 未绑定状态才传 cishu 和 state
        if (this.cardInfo.state != 3) {
          params.cishu = this.cardInfo.cishu
          params.state = String(this.cardInfo.state)
        }
        const res = await editQuan(params)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.drawer = false
          this.getList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },

    handleClose() {
      this.drawer = false
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
}
</style>