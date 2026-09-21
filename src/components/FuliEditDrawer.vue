<template>
  <el-drawer title="修改福利卡" :visible.sync="visible" :direction="'rtl'" :before-close="handleClose" size="60%">
    <div style="padding: 0px 20px 0px 20px;">
      <el-card class="search-card">
        <el-form status-icon ref="ruleForm" :model="editForm" label-width="100px" style="width: 80%; text-align: left;"
          class="demo-ruleForm">
          <!-- 卡号：只读 -->
          <el-form-item label="卡号：" class="addBorder">
            <el-input v-model="editForm.num" readonly />
          </el-form-item>

          <!-- 密码：只读 -->
          <el-form-item label="密码：" class="addBorder">
            <el-input v-model="editForm.pass" readonly />
          </el-form-item>

          <!-- 已删除提示 -->
          <el-form-item v-if="editForm.del == 1" label="" style="text-align: left;">
            <span style="color: #ff0000">卡已删除</span>
          </el-form-item>

          <!-- 价格：已绑定只读 + 调整 -->
          <el-form-item label="价格：" style="text-align: left;">
            <div class="price-control">
              <span class="addBorder">
                <el-input v-model="editForm.price" placeholder="0.00" style="width: 100px; margin-right: 10px;"
                  readonly />
              </span>
              <span class="price-spacer"></span>
              <el-select v-model="editForm.addtype" style="width: 80px; margin-right: 10px;">
                <el-option label="增加" value="1" />
                <el-option label="减少" value="2" />
              </el-select>
              <el-input v-model="editForm.addprice" placeholder="金额" style="width: 100px; margin-right: 10px;" />
              <el-button type="success" @click="savePrice" :loading="priceSubmitting">
                保存
              </el-button>
            </div>
          </el-form-item>

          <!-- 分类：下拉选择 -->
          <el-form-item label="分类：">
            <el-select v-model="editForm.gid" filterable placeholder="请选择分类" style="width: 100%">
              <el-option v-for="item in cardList" :key="item.id"
                :label="item.id + '-' + item.company + '-' + item.sale + '[' + getPidName(item.pid) + ']'"
                :value="item.id" />
            </el-select>
          </el-form-item>

          <!-- 兑换购物卡：是/否下拉 -->
          <el-form-item label="兑换购物卡：" style="text-align: left;">
            <el-select v-model="editForm.shop" style="width: 80px;">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>

          <!-- 激活状态 -->
          <el-form-item label="激活状态：" v-if="editForm.state != 3">
            <el-radio-group v-model="editForm.state">
              <el-radio :label="1">未激活</el-radio>
              <el-radio :label="2">已激活</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="激活状态：" v-else class="addBorder">
            <el-input value="已绑定" readonly />
          </el-form-item>

          <!-- 兑换用户：已绑定时显示 -->
          <el-form-item v-if="editForm.state == 3" label="兑换用户：" class="addBorder">
            <el-input v-model="editForm.exchangeUser" readonly />
          </el-form-item>

          <!-- 隐藏字段：卡ID -->
          <el-form-item style="display: none">
            <el-input v-model="editForm.id" />
          </el-form-item>

          <!-- 保存按钮 -->
          <el-form-item class="txtleft"  >
            <el-button type="primary" @click="submitForm"   :loading="submitting">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>


      <div>
        <div style=" line-height: 4;text-align: left;">消费记录</div>
        <el-table :data="recordTableData" border style="width: 100%" max-height="300"
          :header-cell-style="headerCellStyle" v-loading="recordLoading">
          <el-table-column prop="bhh" label="编号" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column prop="jgg" label="金额" align="center">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.flag == 1 || scope.row.flag == 4 ? '#f56c6c' : '#67c23a' }">
                {{ scope.row.flag == 1 || scope.row.flag == 4 ? '-' : '+' }}{{ scope.row.price }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.flag == 3" class="dangerCl">后台充值</span>
              <span v-else-if="scope.row.flag == 4" class="blueCl">后台扣除</span>
              <span v-else-if="scope.row.flag == 1">消费</span>
              <span v-else-if="scope.row.flag == 2">充值</span>
            </template>
          </el-table-column>
          <el-table-column prop="sj" label="时间" align="center" width="200">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>
          <el-table-column prop="dd" label="订单号" align="center">
            <template slot-scope="scope">{{ scope.row.order_no || '-' }}</template>
          </el-table-column>
          <el-table-column prop="jy" label="交易号" align="center">
            <template slot-scope="scope">{{ scope.row.transaction_id || '-' }}</template>
          </el-table-column>
          <el-table-column prop="sf" label="实付金额" align="center">
            <template slot-scope="scope">{{ scope.row.total_fee || '-' }}</template>
          </el-table-column>
        </el-table>

        <div style="text-align:right;margin-top:20px;">
          <el-pagination background @size-change="handleRecordSizeChange" @current-change="handleRecordCurrentChange"
            :current-page="recordCurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="recordPageSize"
            layout="total,sizes,prev,pager,next,jumper" :total="recordTotal">
          </el-pagination>
        </div>
      </div>

    </div>
  </el-drawer>
</template>

 <script>
import { getNumInfo, editNum, editPrice } from '@/api/modules/card'
import { xfjl } from '@/api/modules/card'
export default {
  name: 'FuliEditDrawer',
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    },
    fuliData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      submitting: false,
      priceSubmitting: false,
      cardList: [],
      // 消费记录相关
      recordTableData: [],
      recordLoading: false,
      recordCurrentPage: 1,
      recordPageSize: 10,
      recordTotal: 0,
      editForm: {
        id: '',
        num: '',
        pass: '',
        gid: '',
        price: '',
        addtype: '1',
        addprice: '',
        shop: 0,
        state: 1,
        del: 0,
        uid: 0,
        bd_time: 0,
        exchangeUser: '-'
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.drawerVisible
      },
      set(val) {
        this.$emit('update:drawerVisible', val)
      }
    }
  },
  watch: {
    drawerVisible(val) {
      if (val && this.fuliData.id) {
        this.openEdit(this.fuliData)
      }
    }
  },
  methods: {
    getPidName(pid) {
      const m = {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      }
      return m[pid] || ''
    },

    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      const pad = n => String(n).padStart(2, '0')
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    },

    resetForm() {
      this.editForm = {
        id: '',
        num: '',
        pass: '',
        gid: '',
        price: '',
        addtype: '1',
        addprice: '',
        shop: 0,
        state: 1,
        del: 0,
        uid: 0,
        bd_time: 0,
        exchangeUser: '-'
      }
      this.cardList = []
      // 重置记录相关
      this.recordTableData = []
      this.recordTotal = 0
      this.recordCurrentPage = 1
    },

    handleClose(done) {
      this.resetForm()
      this.$emit('update:drawerVisible', false)
      this.$emit('close')
      if (typeof done === 'function') {
        done()
      }
    },

    // 获取消费记录（独立方法，用于分页切换）
   

    // 修改：合并获取卡信息和消费记录
   
    // 分页切换
    handleRecordSizeChange(val) {
      this.recordPageSize = val
      this.recordCurrentPage = 1
      this.fetchRecords()
    },

    handleRecordCurrentChange(val) {
      this.recordCurrentPage = val
      this.fetchRecords()
    },

    // 表头样式
    headerCellStyle() {
      return {
        background: '#f5f7fa',
        color: '#606266'
      }
    },

   async fetchRecords() {
      if (!this.editForm.id) return
      
      this.recordLoading = true
      try {
        const params = {
          gid: String(this.editForm.gid || ''),  // 卡册ID
          id: String(this.editForm.id),           // 卡ID
          page: String(this.recordCurrentPage),
          limit: String(this.recordPageSize)
        }

        const res = await xfjl(params)
        console.log('xfjl 接口返回:', res)
        
        if (res.code === 200) {
          const data = res.data
          const listData = data.list || {}
          this.recordTableData = listData.data || []
          this.recordTotal = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取消费记录失败')
          this.recordTableData = []
          this.recordTotal = 0
        }
      } catch (e) {
        console.error('获取消费记录失败', e)
        this.recordTableData = []
        this.recordTotal = 0
      } finally {
        this.recordLoading = false
      }
    },

    // 修改 openEdit 方法
    async openEdit(row) {
      try {
        const res = await getNumInfo({ id: row.id })
        
        if (res.code === 200) {
          const d = res.data
          const numData = d.num || {}

          this.editForm = {
            id: numData.id || row.id,
            num: numData.num || row.num || row.id,
            pass: numData.pass || row.pass || '',
            gid: numData.gid || row.gid || '',  // 保存 gid
            price: numData.price || row.price || '0',
            addtype: '1',
            addprice: '',
            shop: numData.shop !== undefined ? numData.shop : (row.shop || 0),
            state: numData.state || row.state || 1,
            del: numData.del || 0,
            uid: numData.uid || row.uid || 0,
            bd_time: numData.bd_time || row.bd_time || 0,
            exchangeUser: numData.uid
              ? (numData.uid + '  兑换时间 ' + this.formatTime(numData.bd_time))
              : '-'
          }

          this.cardList = d.card_list || []
          
          // 获取消费记录
          this.recordCurrentPage = 1
          await this.fetchRecords()
        }
      } catch (e) {
        console.error('获取卡信息失败', e)
        // 错误处理
        this.editForm = {
          id: row.id,
          num: row.num || row.id || '',
          pass: row.pass || '',
          gid: row.gid || '',
          price: row.price || '0',
          addtype: '1',
          addprice: '',
          shop: row.shop || 0,
          state: row.state || 1,
          del: 0,
          uid: row.uid || 0,
          bd_time: row.bd_time || 0,
          exchangeUser: row.uid
            ? (row.uid + '  兑换时间 ' + this.formatTime(row.bd_time))
            : '-'
        }
        this.recordTableData = []
        this.recordTotal = 0
      }
    },

    // 价格调整后刷新记录
    async savePrice() {
      if (!this.editForm.addprice) {
        this.$message.warning('请输入调整金额')
        return
      }
      this.priceSubmitting = true
      try {
        const params = {
          id: this.editForm.id,
          addtype: this.editForm.addtype,
          addprice: this.editForm.addprice
        }

        const res = await editPrice(params)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          if (res.data && res.data.price !== undefined) {
            this.editForm.price = res.data.price
          }
          this.editForm.addprice = ''
          
          // 价格调整后刷新消费记录
          this.recordCurrentPage = 1
          await this.fetchRecords()
          
          this.$emit('success', {
            id: this.editForm.id,
            price: res.data?.price
          })
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.priceSubmitting = false
      }
    },

    // 分页切换
    handleRecordSizeChange(val) {
      this.recordPageSize = val
      this.recordCurrentPage = 1
      this.fetchRecords()
    },

    handleRecordCurrentChange(val) {
      this.recordCurrentPage = val
      this.fetchRecords()
    },

    async submitForm() {
      this.submitting = true
      try {
        const formData = new FormData()
        formData.append('id', String(this.editForm.id))
        formData.append('gid', String(this.editForm.gid))
        formData.append('shop', String(this.editForm.shop))

        if (this.editForm.state != 3) {
          formData.append('state', String(this.editForm.state))
          formData.append('price', String(this.editForm.price))
        }

        const res = await editNum(formData)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          this.$emit('success', this.editForm)
          this.handleClose()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
<style scoped>
.price-control {
  display: flex;
  align-items: center;
}

.price-spacer {
  /* 间距占位 */
}
</style>