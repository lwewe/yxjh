<template>
  <div class="order-detail">
    <el-card class="detail-card" v-loading="loading">
      <!-- <div slot="header" class="detail-header">
        <span class="header-title">查看订单详情</span>
        <el-button type="default" size="small" icon="el-icon-back" @click="goBack">返回</el-button>
      </div> -->

      <div v-if="order">
        <!-- 蛋糕订单 -->
        <template v-if="orderShow">
          <table class="detail-table">
            <tbody>
              <!-- 订单信息行 -->
              <tr>
                <th colspan="2" style="text-align: left;     background: rgb(245, 247, 250);">
                  订单号：{{ orderShow.order_no }}&nbsp;&nbsp;
                  下单用户：<span @click="viewUser(order.uid)" style="cursor: pointer;">{{ order.uid }}</span>
                </th>
                <th style="text-align: left;     background: rgb(245, 247, 250);">金额：<span class="price-text"><span
                      class="fs10">￥</span>{{ orderShow.total || order.zongji }}</span></th>
                <th style="text-align: left;background: rgb(245, 247, 250);">供应商：{{ orderShow.gid }}{{ supplierName }}
                </th>
                <th style="text-align: left;     background: rgb(245, 247, 250);">
                  <span :style="{ color: getStateColor(orderShow.state), fontWeight: 'bold' }">{{
                    getStateText(orderShow.state) }}</span>
                </th>
              </tr>

              <!-- 产品行 -->
              <!-- <tr>
                <td width="10%">
                  <img :src="getProductImage()" width="50" style="border-radius: 4px;" @error="handleImageError">
                </td>
                <td width="20%" style="text-align: left;">{{ getProductName() }}</td>
                <td width="15%">{{ getProductSpec() }}</td>
                <td width="20%"><span class="price-text" title="原价"><span class="fs10">￥</span>{{ getProductPrice() }}</span></td>
                <td width="10%">{{ formatTime(orderShow.add_time) }}</td>
              </tr>
              
             
              <tr>
                <td style="text-align: left;">配送日期：{{ getShipDate() }}</td>
                <td style="text-align: left;">配送时间：{{ getShipTime() }}</td>
                <td colspan="3" style="text-align: left;">订单备注：{{ getBuyerMsg() }}</td>
              </tr> -->
              <!-- 产品行 - 循环展示所有产品 -->
              <template v-for="(item, index) in contentList">
                <tr :key="'product-' + index">
                  <td width="10%" style="text-align: center;">
                    <img :src="item.product?.image_path || ''" width="50" style="border-radius: 4px;"
                      @error="handleImageError">
                  </td>
                  <td width="20%" style="text-align: left;">{{ item.product?.title || '-' }}</td>
                  <td width="15%">{{ (item.xinghao?.name || '') + ' * ' + (item.quantity || 1) }}</td>
                  <td width="20%"><span class="price-text" title="单价"><span class="fs10">￥</span>{{ item.xinghao?.price
                    || '0.00' }}</span></td>
                  <td width="10%">{{ formatTime(item.add_time) }}</td>
                </tr>
                <!-- 每个产品单独的配送信息 -->
                <tr :key="'ship-' + index">
                  <td style="text-align: left;" colspan="1">配送日期：{{ item.ship_date || '' }}</td>
                  <td style="text-align: left;" colspan="1">配送时间：{{ item.ship_time_text || '' }}</td>
                  <td style="text-align: left;" colspan="2">订单备注：{{ item.buyer_msg || '' }}</td>

                </tr>
              </template>
              <!-- 编辑行 -->
              <tr>
                <td style="text-align: left;">
                  <el-select v-model="editForm.state" size="small" style="width: 90px;">
                    <el-option label="待确认" value="0"></el-option>
                    <el-option label="未发货" value="1"></el-option>
                    <el-option label="已发货" value="2"></el-option>
                    <el-option label="已完成" value="3"></el-option>
                    <el-option label="已取消" value="4"></el-option>
                  </el-select>
                </td>
                <td style="text-align: left;">
                  <el-select v-model="editForm.kdid" size="small" style="width: 140px;">
                    <el-option label="请选择快递公司" value="0"></el-option>
                    <el-option label="商家配送" value="100"></el-option>
                    <el-option v-for="kd in kuaidiList" :key="kd.id" :label="kd.code + '-' + kd.name"
                      :value="kd.id"></el-option>
                  </el-select>
                </td>
                <td colspan="2" style="text-align: center;">
                  <el-input v-model="editForm.num" size="small" placeholder="快递单号"></el-input>
                </td>
                <td rowspan="2" style="text-align: center; vertical-align: middle;">
                  <el-button type="success" size="small" @click="saveKuaidi" :loading="saveLoading">保存</el-button>
                </td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: left;">

                  <el-input v-model="editForm.con" type="textarea" :rows="2" size="small" placeholder="后台备注"
                    style="width: 80%;"></el-input>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 物流信息 -->
          <div class="logistics-box" v-if="logistics.length > 0">
            <div class="logistics-header"><i class="el-icon-truck"></i> 物流信息</div>
            <el-timeline style="padding: 15px 20px;">
              <el-timeline-item v-for="(item, i) in logistics" :key="i" :timestamp="formatTime(item.time)"
                placement="top" :color="i === 0 ? '#67C23A' : undefined">
                {{ item.desc }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>

        <!-- 收货信息 -->
        <el-card class=" " v-if="order.address">
          <div class=" ">收货信息</div>
          <div class="panel-body">
            <div><span class="gray-label">姓名：</span>{{ order.address.name || '-'}}</div>
            <div><span class="gray-label">电话：</span>{{ order.address.phone || '-' }}</div>
            <div><span class="gray-label">收货地址：</span>{{ order.address.province || '-' }}{{ order.address.city }}{{
              order.address.area
              }}{{ order.address.addr }}</div>
          </div>
        </el-card>

        <!-- 支付信息 -->
        <el-card class="mt20">
          <div> 支付信息</div>
          <div class="panel-body">
            <div v-if="order.total_fee > 0">
              <span class="gray-label">微信支付：</span><span class="price-text"><span class="fs10">￥</span>{{
                order.total_fee
                }}</span>
            </div>
            <div v-if="order.fuli_list && order.fuli_list.length > 0">
              <div v-for="card in order.fuli_list" :key="card.id" v-if="card.id !== 'wx'" style="margin-bottom: 10px;">
                <span class="gray-label">福利卡：</span>
                <!-- <span class="dangerCl">蛋糕卡</span> -->
                <span class="dangerCl">{{ getCardTypeNameByPid(card.pid) }}</span>

                {{ card.num }} <span style="display: inline-block; width: 120px;padding-left: 10px;">余额： <span
                    class="fs10">￥</span>{{ card.price }} </span>
                扣除 <span class="price-text"><span class="fs10">￥</span>{{ card.kc }}</span>

                <el-button type="danger" size="mini"  v-if="isadmin == 1"  style="margin-left: 10px;margin-right: 10px;"
                  @click="openFuliEdit(card)">修改</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div v-if="!order && !loading" style="text-align: center; padding: 80px 0; color: #909399;">
        暂无订单数据
      </div>
    </el-card>
    <fuli-edit-drawer :drawer-visible.sync="fuliDrawerVisible" :fuli-data="currentFuliData" @success="onFuliEditSuccess"
      @close="onFuliEditClose" />
    <!-- 用户详情弹窗 -->
    <el-dialog title="用户详情" :visible.sync="userDialogVisible" width="50%" :before-close="closeUserDialog">
      <div v-loading="userLoading" style="width: 80%;margin: auto;text-align: left;">
        <template v-if="userDetail">
          <el-form label-width="130px" label-position="right">
            <el-form-item label="用户ID：">
              <el-input v-model="userDetail.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="userDetail.phone" readonly></el-input>
            </el-form-item>
            <el-form-item label="微信：">
              <el-input :value="userDetail.openid || '未绑定'" readonly></el-input>
            </el-form-item>
            <el-form-item label="头像：" style="text-align: left;">
              <img v-if="userDetail.img" :src="userDetail.img"
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
              <span v-else style="color: #909399;">暂无头像</span>
            </el-form-item>
            <el-form-item label="用户状态：">
              <el-tag :type="userDetail.sh == 0 ? 'success' : 'danger'" size="small">
                {{ userDetail.sh == 0 ? '正常' : '禁用' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="注册时间：">
              <el-input :value="formatTime(userDetail.add_time)" readonly></el-input>
            </el-form-item>
            <el-form-item label="最后登录：">
              <el-input :value="formatTime(userDetail.login_time)" readonly></el-input>
            </el-form-item>
            <el-form-item label="登录次数：">
              <el-input :value="userDetail.num || 0" readonly></el-input>
            </el-form-item>
            <el-form-item label="蛋叔ID：">
              <template v-if="userDetail.api_id === 0">
                <el-tag type="warning" size="small">未关联</el-tag>
              </template>
              <el-input v-else :value="userDetail.api_id" readonly></el-input>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDingdan, ddKuaidiList, ddKuaidiQuery, editDingdankd } from '@/api/modules/dgorder'
import { showSupplier } from '@/api/modules/login'
import FuliEditDrawer from '@/components/FuliEditDrawer.vue'  //  新增
export default {
  components: {
    FuliEditDrawer  //  新增
  },
  name: 'CakeOrderListdetails',
  data() {
    return {
      isadmin: localStorage.getItem('is_super_admin'),
      fuliDrawerVisible: false,   // 新增
      currentFuliData: {},        //  新增
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      order: null,
      orderShow: null,
      kuaidiList: [],
      logistics: [],
      supplierMap: {},
      loading: false,
      saveLoading: false,
      editForm: { state: '0', kdid: '0', num: '', con: '' },
      cardTypeMap: {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      },
      cardColorMap: {
        1: 'danger', 2: 'danger', 3: 'warning', 4: 'info',
        5: 'success', 6: 'success', 7: 'warning', 8: 'info',
        9: 'primary', 10: '', 11: 'warning',
        12: 'danger', 13: 'primary', 14: 'success'
      }
    }
  },
  computed: {
    contentList() {
      if (!this.orderShow?.content) return []
      let data = this.orderShow.content
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) { return [] }
      }
      return Array.isArray(data) ? data : []
    },
    supplierName() {
      if (!this.orderShow || !this.orderShow.gid) return ''
      const gid = String(this.orderShow.gid)
      return this.supplierMap[gid] ? '-' + this.supplierMap[gid] : ''
    }
  },
  mounted() {
    this.loadDetail()
    this.loadKuaidiList()
    this.loadSupplierList()
  },
  methods: {
    openFuliEdit(fuli) {
      this.currentFuliData = { ...fuli }
      this.fuliDrawerVisible = true
    },

    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.loadOrderDetail()  // 刷新订单详情
    },

    onFuliEditClose() {
      this.currentFuliData = {}
    },
    getCardTypeNameByPid(pid) {
      return this.cardTypeMap[pid] || '福利卡'
    },
    async loadDetail() {
      const id = this.$route.query.id
      if (!id) { this.$message.error('缺少订单ID'); return }
      this.loading = true
      try {
        const res = await getDingdan({ id })
        if (res.code === 200) {
          this.order = res.data.order
          this.orderShow = res.data.order_show
          if (res.data.address) this.order.address = res.data.address
          this.editForm = {
            state: String(this.orderShow.state || 0),
            kdid: String(this.orderShow.kdid || 0),
            num: this.orderShow.num || '',
            con: this.orderShow.con || ''
          }
        }
      } catch (e) { this.$message.error('获取失败') }
      finally { this.loading = false }
    },

    async loadKuaidiList() {
      try {
        const res = await ddKuaidiList()
        if (res.code === 200) this.kuaidiList = res.data || []
      } catch (e) { }
    },

    async loadSupplierList() {
      try {
        const res = await showSupplier()
        if (res.code === 200 && res.data.list) {
          this.supplierMap = {}
          res.data.list.forEach(item => {
            this.supplierMap[String(item.id)] = item.username
          })
        }
      } catch (e) { }
    },

    async saveKuaidi() {
      this.saveLoading = true
      try {
        const res = await editDingdankd({
          id: this.orderShow.id,
          state: this.editForm.state,
          kdid: this.editForm.kdid,
          num: this.editForm.num,
          con: this.editForm.con
        })
        if (res.code === 200) {
          this.$message.success('保存成功')
          setTimeout(() => this.loadDetail(), 500)
        } else { this.$message.error(res.msg || '保存失败') }
      } catch (e) { this.$message.error('保存失败') }
      finally { this.saveLoading = false }
    },

    getContentData() {
      if (!this.orderShow?.content) return null
      let data = this.orderShow.content
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) { return null }
      }
      return Array.isArray(data) && data.length > 0 ? data[0] : null
    },

    getProductImage() { return this.getContentData()?.product?.image_path || '' },
    getProductName() { return this.getContentData()?.product?.title || '-' },
    getProductSpec() {
      const c = this.getContentData()
      return c?.xinghao?.name ? `${c.xinghao.name} * ${c.quantity || 1}` : '-'
    },
    getProductPrice() { return this.getContentData()?.xinghao?.price || this.orderShow?.total || '0.00' },
    getShipDate() { return this.getContentData()?.ship_date || '' },
    getShipTime() { return this.getContentData()?.ship_time_text || '' },
    getBuyerMsg() { return this.getContentData()?.buyer_msg || '' },

    getStateText(s) {
      const m = { '0': '待确认', '1': '未发货', '2': '已发货', '3': '已完成', '4': '已取消' }
      return m[String(s)] || '未知'
    },
    getStateColor(s) {
      const m = { '0': '#E6A23C', '1': '#409EFF', '2': '#67C23A', '3': '#909399', '4': '#F56C6C' }
      return m[String(s)] || '#303133'
    },
    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    // ✅ 改成
    async viewUser(uid) {
      this.userDialogVisible = true
      this.userDetail = null
      this.userLoading = true
      try {
        const { getRegister } = await import('@/api/modules/zhichong')
        const res = await getRegister({ id: uid })
        if (res.code === 200) {
          this.userDetail = res.data
        } else {
          this.$message.error('获取用户信息失败')
        }
      } catch (error) {
        this.$message.error('获取用户信息失败')
      } finally {
        this.userLoading = false
      }
    },

    closeUserDialog() {
      this.userDialogVisible = false
      this.userDetail = null
    },


    goBack() { this.$router.go(-1) },
    handleImageError(e) { e.target.style.display = 'none' }
  }
}
</script>

<style scoped>
.order-detail {
  /* padding: 20px;  */
  background: #f5f7fa;
  /* min-height: 100vh; */
}

.detail-card {
  text-align: left;
  /* max-width: 1100px; margin: 0 auto; */
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.detail-table th,
.detail-table td {
  padding: 8px 12px;
  border: 1px solid #EBEEF5;
  vertical-align: middle;
  font-size: 13px;
}

.price-text {
  color: #222222;
}

.panel-box {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #EBEEF5;
  background: #fafafa;
}

.panel-title i {
  margin-right: 6px;
  color: #409EFF;
}

.panel-body {
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.8;
}

.gray-label {
  color: #666666;
  width: 70px;
  text-align: right;
  display: inline-block;
}

.logistics-box {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.logistics-header {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #EBEEF5;
  background: #fafafa;
}

.logistics-header i {
  margin-right: 6px;
  color: #67C23A;
}
</style>