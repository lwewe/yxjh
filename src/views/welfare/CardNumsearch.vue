<template>
  <div class="list-container">
    <!-- 搜索区域 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="卡号" value="num"></el-option>
            <el-option label="用户UID" value="uid"></el-option>
            <el-option label="编号(ID)" value="id"></el-option>
            <el-option label="手机号" value="phone"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="请输入搜索内容" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="search-card">
      <div style="text-align: left; display: flex; justify-content: space-between;">
        <div>
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="delOptions()"
            style="margin-bottom: 20px;">批量删除</el-button>
        </div>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="tableLoading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="90" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="卡号" width="300" align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.num }} -->
            <span @click="openCardEdit(scope.row)" style="cursor: pointer;">
              {{ scope.row.num }}
            </span>
            <div class="blueCl fs12" style="font-weight: 400;">{{ getCardType(scope.row.pid) }}</div>
            <div class="dangerCl fs12" style="font-weight: 400;">{{ scope.row.card ? `${scope.row.card.id} -
              ${scope.row.card.company}` : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="密码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.pass }}</template>
        </el-table-column>
        <el-table-column label="价格" width="100" align="center">
          <template slot-scope="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="用户" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.uid" style="cursor: pointer; color: #409EFF;" @click="viewUser(scope.row.uid)">
              {{ scope.row.uid }}
            </span>
            <span v-else>-</span>

          </template>
        </el-table-column>
        <el-table-column label="绑定时间" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.bd_time ? formatTime(scope.row.bd_time) : '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 1" type="info" size="small">未激活</el-tag>
            <el-tag v-else-if="scope.row.state == 2" type="warning" size="small">已激活</el-tag>
            <el-tag v-else-if="scope.row.state == 3" type="success" size="small">已绑定</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="购物卡" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.shop == 1" type="success" size="small">是</el-tag>
            <el-tag v-else type="info" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleRecord(scope.row)">记录</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDeleteOne(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top: 20px; text-align: right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 消费记录抽屉 -->
    <el-drawer title="消费记录" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <!-- 卡片基本信息 -->
          <el-form ref="ruleForm" :model="cardInfo" label-width="100px" style="width: 80%" class="demo-ruleForm">
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="cardInfo.num" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="cardInfo.pass" readonly />
            </el-form-item>
            <el-form-item label="价格：" class="addBorder">
              <el-input v-model="cardInfo.price" readonly />
            </el-form-item>
            <el-form-item label="激活状态：" class="addBorder">
              <el-input :value="getStateText(cardInfo.state)" readonly />
            </el-form-item>
            <el-form-item label="兑换用户：" class="addBorder">
              <el-input :value="cardInfo.uid ? cardInfo.uid + '    兑换时间 ' + formatTime(cardInfo.bd_time) : '未兑换'"
                readonly />
            </el-form-item>
          </el-form>

          <!-- 消费记录列表 -->
          <el-table :data="cardLogList" border style="width: 100%" max-height="300" :header-cell-style="headerCellStyle"
            v-loading="logLoading">
            <el-table-column label="编号" align="center" width="80">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="金额" align="center" width="100">
              <template slot-scope="scope">
                <span :style="{ color: scope.row.flag == 1 || scope.row.flag == 4 ? '#f56c6c' : '#67c23a' }">
                  {{ scope.row.flag == 1 || scope.row.flag == 4 ? '-' : '+' }}{{ scope.row.price }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.flag == 1" class="dangerCl">消费</span>
                <span v-else-if="scope.row.flag == 2" class="greenCl">充值</span>
                <span v-else-if="scope.row.flag == 3" class="dangerCl">后台充值</span>
                <span v-else-if="scope.row.flag == 4" class="blueCl">后台扣除</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="180">
              <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
            </el-table-column>
            <el-table-column label="订单号" align="center">
              <template slot-scope="scope">{{ scope.row.order_no || '-' }}</template>
            </el-table-column>
            <el-table-column label="交易号" align="center">
              <template slot-scope="scope">{{ scope.row.transaction_id || '-' }}</template>
            </el-table-column>
            <el-table-column label="实付金额" align="center" width="100">
              <template slot-scope="scope">{{ scope.row.total_fee || '-' }}</template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div style="margin-top: 20px; text-align: right;">
            <el-pagination @size-change="handleLogSizeChange" @current-change="handleLogCurrentChange"
              :current-page="logCurrentPage" :page-sizes="[10, 20, 50]" :page-size="logPageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="logTotal">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </el-drawer>

    <!-- 修改抽屉 -->
    <el-drawer title="修改卡号" :visible.sync="editDrawer" :direction="direction" :before-close="handleEditClose"
      size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form ref="editFormRef" :model="editForm" label-width="100px" style="width: 80%" class="demo-ruleForm">
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="editForm.num" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="editForm.pass" readonly />
            </el-form-item>

            <!-- 价格调整 -->
            <el-form-item label="价格：" style="text-align: left;">
              <div class="price-control">
                <span class="addBorder">
                  <el-input v-model="editForm.price" placeholder="0.00" style="width: 100px; margin-right: 10px;"
                    readonly />
                </span>
                <el-select v-model="editForm.addtype" style="width: 80px; margin-right: 10px;">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input v-model="editForm.addprice" placeholder="金额" style="width: 100px; margin-right: 10px;" />
                <el-button type="success" @click="saveEditPrice" :loading="priceSubmitting">保存</el-button>
              </div>
            </el-form-item>

            <!-- 分类 -->
            <el-form-item label="分类：">
              <el-select v-model="editForm.gid" filterable placeholder="请选择分类" style="width: 100%">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <!-- 兑换购物卡 -->
            <el-form-item label="兑换购物卡：" style="text-align: left;">
              <el-select v-model="editForm.shop" style="width: 80px;">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>

            <!-- 激活状态 -->
            <el-form-item v-if="editForm.state != 3" label="激活状态：">
              <el-radio-group v-model="editForm.state">
                <el-radio :label="1">未激活</el-radio>
                <el-radio :label="2">已激活</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-else label="激活状态：" class="addBorder">
              <el-input value="已绑定" readonly />
            </el-form-item>

            <!-- 兑换用户 -->
            <el-form-item v-if="editForm.state == 3" label="兑换用户：" class="addBorder">
              <el-input :value="editForm.uid ? editForm.uid + '    兑换时间 ' + formatTime(editForm.bd_time) : '-'"
                readonly />
            </el-form-item>

            <el-form-item class="txtleft">
              <el-button type="primary" @click="submitEditForm" :loading="editSubmitting">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-drawer>
    <UserDetailDialog :visible.sync="userDialogVisible" :user-id="currentUserId" />
    <!-- 福利卡编辑抽屉 -->
    <FuliEditDrawer :drawer-visible.sync="fuliEditVisible" :fuli-data="currentCard" @success="onFuliEditSuccess"
      @close="onFuliEditClose" />
  </div>
</template>

<script>
import UserDetailDialog from '@/components/UserDetailDialog'  //  
import FuliEditDrawer from '@/components/FuliEditDrawer'
import { numSel, xfjl, getNumInfo, editNum, editPrice, delNum } from '@/api/modules/card'

export default {
  components: { FuliEditDrawer, UserDetailDialog },
  name: 'CardSearch',
  data() {
    return {
      userDialogVisible: false,  // 
      currentUserId: '',
      fuliEditVisible: false,   // 添加
      currentCard: {},          // 添加
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266'
      },
      // 分类选项（从 getNumInfo 接口获取，这里作为默认值）
      categoryOptions: [],

      // 消费记录
      cardLogList: [],
      logLoading: false,
      logCurrentPage: 1,
      logPageSize: 10,
      logTotal: 0,

      // 卡片详情
      cardInfo: {
        id: '',
        num: '',
        pass: '',
        price: '',
        state: 1,
        uid: 0,
        bd_time: 0
      },
      drawer: false,

      // 修改表单
      editDrawer: false,
      editSubmitting: false,
      priceSubmitting: false,
      editForm: {
        id: '',
        num: '',
        pass: '',
        price: '',
        addtype: '1',
        addprice: '',
        gid: '',
        shop: 0,
        state: 1,
        uid: 0,
        bd_time: 0
      },

      direction: 'rtl',
      // 搜索表单
      searchForm: {
        search_key: 'num',
        search_val: ''
      },
      // 表格
      tableData: [],
      tableLoading: false,
      multipleSelection: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 当前查看的记录行
      currentRecordRow: null
    }
  },
  methods: {
    viewUser(uid) {
      this.currentUserId = uid
      this.userDialogVisible = true
    },
    // 点击卡号打开福利卡编辑
    openCardEdit(row) {
      this.currentCard = {
        id: row.id,
        num: row.num,
        pass: row.pass,
        price: row.price,
        pid: row.pid,
        gid: row.gid,
        uid: row.uid,
        state: row.state,
        bd_time: row.bd_time,
        shop: row.shop
      }
      this.fuliEditVisible = true
    },

    // 福利卡修改成功回调
    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.getCardList()
    },

    // 福利卡修改关闭回调
    onFuliEditClose() {
      this.currentCard = {}
    },
    // ==================== 获取卡片列表 ====================
    async getCardList() {
      if (!this.searchForm.search_val.trim()) {
        this.$message.warning('请输入搜索内容')
        return
      }

      this.tableLoading = true
      try {
        const formData = new FormData()
        formData.append('search_key', this.searchForm.search_key)
        formData.append('search_val', this.searchForm.search_val)
        formData.append('page', this.currentPage)
        formData.append('limit', this.pageSize)

        const res = await numSel(formData)

        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.current_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取卡片列表失败:', error)
        this.$message.error('网络错误，请重试')
      } finally {
        this.tableLoading = false
      }
    },

    // ==================== 搜索相关 ====================
    handleSearch() {
      this.currentPage = 1
      this.getCardList()
    },

    resetSearch() {
      this.searchForm = {
        search_key: 'num',
        search_val: ''
      }
      this.currentPage = 1
      this.tableData = []
      this.total = 0
    },

    // ==================== 分页 ====================
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      if (this.searchForm.search_val.trim()) {
        this.getCardList()
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getCardList()
    },

    // ==================== 表格选择 ====================
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // ==================== 消费记录抽屉 ====================
    handleRecord(row) {
      this.currentRecordRow = row
      this.cardInfo = {
        id: row.id,
        num: row.num,
        pass: row.pass,
        price: row.price,
        state: row.state,
        uid: row.uid,
        bd_time: row.bd_time
      }
      this.logCurrentPage = 1
      this.drawer = true
      this.getCardLog()
    },

    async getCardLog() {
      if (!this.currentRecordRow) return
      this.logLoading = true
      try {
        const formData = new FormData()
        formData.append('gid', this.currentRecordRow.gid || '')
        formData.append('id', this.currentRecordRow.id)
        formData.append('page', this.logCurrentPage)
        formData.append('limit', this.logPageSize)

        const res = await xfjl(formData)
        if (res.code === 200) {
          const data = res.data
          const listData = data.list || {}
          this.cardLogList = listData.data || []
          this.logTotal = listData.total || 0

          // 更新卡片信息
          if (data.card_num) {
            this.cardInfo = {
              id: data.card_num.id,
              num: data.card_num.num,
              pass: this.currentRecordRow.pass,
              price: data.card_num.price,
              state: data.card_num.state,
              uid: data.card_num.uid,
              bd_time: this.currentRecordRow.bd_time
            }
          }
        } else {
          this.$message.error(res.msg || '获取消费记录失败')
        }
      } catch (error) {
        console.error('获取消费记录失败:', error)
        this.$message.error('网络错误')
      } finally {
        this.logLoading = false
      }
    },

    handleLogSizeChange(val) {
      this.logPageSize = val
      this.logCurrentPage = 1
      this.getCardLog()
    },

    handleLogCurrentChange(val) {
      this.logCurrentPage = val
      this.getCardLog()
    },

    handleClose() {
      this.drawer = false
      this.cardLogList = []
      this.logTotal = 0
      this.currentRecordRow = null
    },

    // ==================== 修改抽屉 ====================
    async handleEdit(row) {
      try {
        const res = await getNumInfo({ id: row.id })
        if (res.code === 200) {
          const d = res.data
          const numData = d.num || {}

          this.editForm = {
            id: numData.id || row.id,
            num: numData.num || row.num,
            pass: numData.pass || row.pass,
            gid: numData.gid || row.gid || '',
            price: numData.price || row.price,
            addtype: '1',
            addprice: '',
            shop: numData.shop !== undefined ? numData.shop : (row.shop || 0),
            state: numData.state || row.state,
            uid: numData.uid || row.uid || 0,
            bd_time: numData.bd_time || row.bd_time || 0
          }

          // 设置分类选项
          const cardList = d.card_list || []
          this.categoryOptions = cardList.map(item => ({
            value: item.id,
            label: item.id + '-' + item.company + '-' + item.sale + '[' + this.getCardType(item.pid) + ']'
          }))

          this.editDrawer = true
        }
      } catch (e) {
        // 接口失败用行数据
        this.editForm = {
          id: row.id,
          num: row.num,
          pass: row.pass,
          gid: row.gid || '',
          price: row.price || '',
          addtype: '1',
          addprice: '',
          shop: row.shop || 0,
          state: row.state,
          uid: row.uid || 0,
          bd_time: row.bd_time || 0
        }
        this.editDrawer = true
      }
    },

    // 保存价格
    async saveEditPrice() {
      if (!this.editForm.addprice || isNaN(this.editForm.addprice)) {
        this.$message.warning('请输入有效金额')
        return
      }
      this.priceSubmitting = true
      try {
        const formData = new FormData()
        formData.append('id', this.editForm.id)
        formData.append('addtype', this.editForm.addtype)
        formData.append('addprice', this.editForm.addprice)

        const res = await editPrice(formData)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          if (res.data && res.data.price !== undefined) {
            this.editForm.price = res.data.price
          }
          this.editForm.addprice = ''
          this.getCardList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.priceSubmitting = false
      }
    },

    // 提交修改表单
    async submitEditForm() {
      this.editSubmitting = true
      try {
        const formData = new FormData()
        formData.append('id', this.editForm.id)
        formData.append('gid', this.editForm.gid)
        formData.append('shop', String(this.editForm.shop))
        // 只有未绑定时才传 state
        if (this.editForm.state != 3) {
          formData.append('state', String(this.editForm.state))
        }

        // 如果有调整金额，先调价格接口
        if (this.editForm.addprice && !isNaN(this.editForm.addprice)) {
          const priceFormData = new FormData()
          priceFormData.append('id', this.editForm.id)
          priceFormData.append('addtype', this.editForm.addtype)
          priceFormData.append('addprice', this.editForm.addprice)
          await editPrice(priceFormData)
          this.editForm.addprice = ''
        }

        const res = await editNum(formData)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          this.editDrawer = false
          this.getCardList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.editSubmitting = false
      }
    },

    handleEditClose() {
      this.editDrawer = false
    },

    // ==================== 删除操作 ====================
    async handleDeleteOne(row) {
      this.$confirm(`确定删除卡号 ${row.num} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const formData = new FormData()
          formData.append('ids', String(row.id))
          const res = await delNum(formData)
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getCardList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    async delOptions() {
      const ids = this.multipleSelection.map(item => item.id)
      this.$confirm(`确定删除选中的 ${ids.length} 张卡吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const formData = new FormData()
          formData.append('ids', ids.join(','))
          const res = await delNum(formData)
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.getCardList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // ==================== 工具方法 ====================
    formatTime(timestamp) {
      if (!timestamp || timestamp === 0) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    getStateText(state) {
      const stateMap = { 1: '未激活', 2: '已激活', 3: '已绑定' }
      return stateMap[state] || '未知'
    },

    getCardType(pid) {
      const typeMap = {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      }
      return typeMap[pid] || '未知'
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

.dangerCl {
  color: #f56c6c;
  font-weight: bold;
}

.blueCl {
  color: #409eff;
  font-weight: bold;
}

.greenCl {
  color: #67c23a;
  font-weight: bold;
}

.addBorder .el-input__inner {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.price-control {
  display: flex;
  align-items: center;
}

.w200 .el-input__inner {
  width: 200px;
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