<template>
  <div>
    <el-card>
      <div v-loading="loading" element-loading-text="加载中...">
        <template v-if="orderDetail">
          <div class="table-wrapper">
            <table class="detail-table">
              <tbody>
                <!-- ========== 订单基本信息 ========== -->
                <tr class="main-order-row" style="display: none;">
                  <th colspan="2" style="text-align: left; background-color: #e3e7ef;">
                    总订单号：{{ orderDetail.order.order_no }}
                  </th>
                  <th width="20%" style="background-color: #e3e7ef;text-align: left;">
                    下单用户：<a href="javascript:;" style="color: #222222;text-decoration: none;"
                      @click="viewUser(orderDetail.order.uid)">{{
                        orderDetail.order.uid }}</a>
                  </th>
                  <th width="10%" style="background-color: #e3e7ef;">
                    总价：<span class="fs10">￥</span>{{ orderDetail.order_show.price }}
                  </th>
                  <th width="20%" style="background-color: #e3e7ef;">
                    下单时间：{{ formatTime(orderDetail.order.add_time) }}
                  </th>
                </tr>

                <!-- ========== 子订单列表 ========== -->
                <template v-for="(subOrder, subIdx) in orderList">
                  <!-- 子订单标题行 -->
                  <tr :key="'sub-header-' + subIdx" style="background-color: #ebeef5;">
                    <th style="text-align: left;  font-size: 12px;">
                      下单用户：<a href="javascript:;" style="color: #222222;text-decoration: none;"
                        @click="viewUser(orderDetail.order.uid)">{{
                          orderDetail.order.uid }}</a>
                    </th>
                    <th style="text-align: left;  font-size: 12px;">订单号：{{ subOrder.order_no }}
                    </th>
                    <th style=" font-size: 12px;text-align: left;">
                      供应商：{{ getSupplierName(subOrder) }}
                    </th>
                    <th style=" font-size: 12px;">
                      <span :style="{ color: getStatusColor(subOrder.state) }">{{ getStatusText(subOrder.state)
                      }}</span>
                    </th>
                    <th style=" font-size: 12px;">
                      金额：<span class="fs10">￥</span>{{ orderDetail.order_show.price }}
                    </th>
                  </tr>

                  <!-- 云中鹤子订单（child_flag == 1） -->
                  <template v-if="subOrder.child_flag == 1">
                    <tr :key="'yz1-' + subIdx">
                      <th colspan="2" style="text-align: left;font-size: 12px;">订单号：{{ subOrder.order_no }}</th>
                      <th colspan="3" style="text-align: left;font-size: 12px;">商城订单号：{{ subOrder.order_key || '-' }}
                      </th>
                    </tr>
                    <!-- 遍历每个云中鹤 child -->
                    <template v-for="(child, childIdx) in subOrder.child">
                      <tr :key="'yz2-' + subIdx + '-' + childIdx">
                        <th width="5%">&nbsp;</th>
                        <th style="text-align: left;font-size: 12px;">商城订单号：{{ subOrder.order_key || '-' }}</th>
                        <th style="text-align: left;font-size: 12px;">子订单号：{{ child.key || '-' }}</th>
                        <th colspan="2" style="text-align: left;font-size: 12px;">
                          <span :style="{ color: getYzhStatusColor(child.status) }">
                            {{ getYzhStatusText(child.status) }}
                          </span>
                        </th>
                      </tr>
                    </template>
                  </template>

                  <!-- 商品行 -->
                  <tr v-if="subOrder.child_flag != 1" v-for="(product, pIdx) in getSubOrderProducts(subOrder)"
                    :key="'p-' + subIdx + '-' + pIdx">
                    <td width="10%">
                      <img v-if="getProductImage(product)" :src="getProductImage(product)" class="product-img"
                        @error="handleImgError">
                      <div v-else class="img-placeholder">暂无图片</div>
                    </td>
                    <td width="20%" style="text-align: left;font-size: 12px;cursor: pointer;" class="hoverStyle"  @click="goToProductEdit(product)">{{ getProductName(product) }}</td>
                    <td width="20%" class="fs12">{{ getProductSpec(product) }} *{{ product.quantity }}</td>
                    <td width="10%" class="fs12"><span class="fs10">￥</span>{{ getProductPrice(product) }}</td>
                    <td width="15%" class="fs12">{{ formatTime(subOrder.add_time) }}</td>
                  </tr>

                  <!-- 备注 -->
                  <tr :key="'remark-' + subIdx">
                    <td colspan="5" style="text-align: left; padding: 8px 16px;" class="fs12">
                      订单备注：{{ subOrder.remark }}
                    </td>
                  </tr>

                  <!-- 快递信息 -->
                  <template v-for="(express, expIdx) in subOrder._expressList">
                    <tr :key="'kd-' + subIdx + '-' + expIdx">
                      <td style="text-align: left;">
                        <select v-model="express.kdid" class="form-select" style="width:160px;font-size: 12px;">
                          <option :value="0">请选择快递公司</option>
                          <option v-for="exp in expressList" :key="exp.id" :value="exp.id">{{ exp.code }}-{{ exp.name }}
                          </option>
                        </select>
                      </td>
                      <td style="text-align: left;">
                        <input type="text" v-model="express.num" class="form-input" style="width:160px;font-size: 12px;"
                          placeholder="快递单号">
                      </td>
                      <td style="text-align: center;">
                        <span v-if="subOrder._expressList.length < 5 && expIdx === subOrder._expressList.length - 1"
                          class="link-btn link-add" @click="addExpress(subOrder)">+ 添加快递</span>
                        <span v-if="subOrder._expressList.length > 1" class="link-btn link-del"
                          @click="removeExpress(subOrder, expIdx)" style="margin-left: 8px;">删除</span>
                      </td>
                      <td colspan="2" style="text-align: center;">
                        <span v-if="express.kdid > 0 && express.num"
                          style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <span class="link-btn link-query" @click="queryExpressTrack(subOrder, expIdx)">{{
                            express._loading ? '查询中...' : '查询物流' }}</span>
                          <span v-if="express._tracks && express._tracks.length" class="link-btn link-toggle-track"
                            @click="toggleTrack(express)">{{ express._trackExpanded ? '收起物流' : '展开物流' }}</span>
                        </span>
                      </td>
                    </tr>
                    <!-- 物流追踪 -->
                    <template v-if="express._tracks && express._tracks.length && express._trackExpanded">
                      <tr v-for="(track, tIdx) in express._tracks" :key="'track-' + subIdx + '-' + expIdx + '-' + tIdx">
                        <td
                          style="border: 1px solid #EBEEF5; color: blue; padding: 6px 10px; width: 100px; text-align: center;">
                          <strong v-if="tIdx === 0">物流信息</strong>
                        </td>
                        <td
                          style="border: 1px solid #EBEEF5; padding: 6px; font-size: 12px; width: 150px; text-align: center;">
                          {{ track.time }}</td>
                        <td colspan="3"
                          style="border: 1px solid #EBEEF5; text-align: left; padding: 6px 10px; font-size: 12px;">{{
                            track.context }}</td>
                      </tr>
                    </template>
                  </template>

                  <!-- 操作行 -->
                  <tr :key="'action-' + subIdx">
                    <td style="text-align: left;">
                      <select v-model="subOrder.state" class="form-select" style="width:160px;font-size: 12px;">
                        <option :value="0">未发货</option>
                        <option :value="1">已发货</option>
                        <option :value="2">已完成</option>
                        <option :value="3">已取消</option>

                      </select>
                    </td>
                    <td colspan="3" style="text-align: left;">
                      <textarea v-model="subOrder.con" class="form-textarea"
                        style="font-size: 12px; font-family: inherit; color: #606266;" placeholder="后台备注："></textarea>
                    </td>
                    <td style="text-align: center;">
                      <el-button @click="saveKuaidi(subOrder)" size="mini" type="warning"
                        :disabled="subOrder._saving">{{ subOrder._saving
                          ? '保存中...' : '保存' }}</el-button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- 收货信息 -->
          <el-card class="mt20 " v-if="orderDetail.scaddress">
            <div class="info-section">
              <span class="info-title">收货信息：</span>
              {{ getFullAddress(orderDetail.scaddress) }}
              &nbsp;&nbsp;<span class="info-title">收货人：</span>{{ orderDetail.scaddress.name }}
              &nbsp;&nbsp;<span class="info-title">电话：</span>{{ orderDetail.scaddress.phone }}
            </div>
          </el-card>

          <!-- 支付信息 -->
          <el-card class="mt20" v-if="orderDetail.order.fuli_list && orderDetail.order.fuli_list.length">
            <div class="info-section">
              <div class="info-title">支付信息</div>
              <template v-for="(f, fi) in orderDetail.order.fuli_list">
                <div v-if="f.id === 'wx'" :key="'wx'"><span
                    style="display: inline-block;width: 80px;text-align: right;">微信支付：</span><span
                    class="price-text"><span class="fs10">￥</span>{{ f.kc }}</span></div>
                <span v-else :key="fi">
                  <span style="display: inline-block;width: 80px;text-align: right;">福利卡：</span><span
                    class="dangerCl">【{{ getFuliType(f.pid) }}】</span>{{ f.num || f.id }}
                  <span class="price-text">扣除：<span class="fs10">￥</span>{{ f.kc }}</span>
                  <span style="padding-left: 10px;">余额：<span class="fs10">￥</span>{{ f.price }}</span>

                  <el-button type="danger" size="mini" v-if="isadmin == 1" style="margin-left: 10px;margin-right: 10px;"
                    @click="openFuliEdit(f)">修改</el-button>
                </span>
              </template>
            </div>
          </el-card>
          <fuli-edit-drawer :drawer-visible.sync="fuliDrawerVisible" :fuli-data="currentFuliData"
            @success="onFuliEditSuccess" @close="onFuliEditClose" />
        </template>
        <div v-else-if="!loading" class="empty-state">
          <i class="el-icon-document" style="font-size: 64px; color: #C0C4CC;"></i>
          <p>暂无订单数据</p>
        </div>
      </div>
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
      <div class="txtleft mt20">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDingdan, editDingdankd, ddKuaidiQuery } from '@/api/modules/sorder'
import { kuaidiList,ddKuaidiList } from '@/api/modules/sorder'
import FuliEditDrawer from '@/components/FuliEditDrawer.vue'
export default {
  components: {
    FuliEditDrawer
  },
  data() {

    return {
      isadmin: localStorage.getItem('is_super_admin'),
      fuliDrawerVisible: false,
      currentFuliData: {},
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      orderDetail: null,
      loading: false,
      expressList: []
    }
  },

  computed: {
    // 🔥 关键修改：根据数据结构自动判断
    // 有 order_show = 单个子订单（钉单），包装成数组
    // 有 orderList = 多个子订单（总订单），直接使用
    orderList() {
      if (!this.orderDetail) return []
      if (this.orderDetail.order_show) {
        return [this.orderDetail.order_show]
      }
      return this.orderDetail.orderList || []
    }
  },

  async mounted() {
    await this.loadExpressList()
    this.loadOrderDetail()
  },

  methods: {
    goToProductEdit(product) {
  const productId = product?.pid || product?.product?.id
  if (!productId) {
    this.$message.warning('无法获取商品ID')
    return
  }
  this.$router.push({
    name: 'AddPro',
    params: { id: productId }
  })
},
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
    getYzhStatusText(status) {
      const map = {
        'pending': '待处理',
        'processing': '处理中',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消',
        'returned': '已退货'
      }
      return map[status] || status || '未知'
    },

    getYzhStatusColor(status) {
      const map = {
        'pending': '#E6A23C',
        'processing': '#409EFF',
        'shipped': '#67C23A',
        'completed': '#ff0000',
        'cancelled': '#999999',
        'returned': '#F56C6C'
      }
      return map[status] || '#ff0000'
    },

    getFuliType(pid) {
      const typeMap = {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券', 12: '蛋糕尊享券',
        13: '提货券', 14: '工会消费券'
      }
      return typeMap[pid] || '福利卡(' + pid + ')'
    },

    async loadExpressList() {
      try {
        const res = await ddKuaidiList()
        if (res.code === 200 && res.data) {
          this.expressList = (Array.isArray(res.data) ? res.data : []).sort((a, b) => b.sort - a.sort)
        }
      } catch (e) {
        console.error('加载快递公司失败：', e)
      }
    },

    async loadOrderDetail() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.error('缺少订单ID')
        this.$router.back()
        return
      }

      this.loading = true
      try {
        const res = await getDingdan({ id })
        console.log('接口返回:', res)

        if (res.code === 200) {
          this.orderDetail = res.data
          this.initExpressData()
        } else {
          this.$message.error(res.msg || '获取订单详情失败')
        }
      } catch (e) {
        this.$message.error('获取订单详情失败')
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    initExpressData() {
      const list = this.orderList
      list.forEach(so => {
        const expressArr = []
        const fields = [
          { kdid: so.kdid || 0, num: so.num || '' },
          { kdid: so.kdid1 || 0, num: so.num1 || '' },
          { kdid: so.kdid2 || 0, num: so.num2 || '' },
          { kdid: so.kdid3 || 0, num: so.num3 || '' },
          { kdid: so.kdid4 || 0, num: so.num4 || '' }
        ]

        let hasData = false
        fields.forEach(f => {
          if (f.kdid > 0 || f.num) {
            expressArr.push({
              kdid: f.kdid,
              num: f.num,
              _tracks: [],
              _loading: false,
              _trackExpanded: true
            })
            hasData = true
          }
        })

        if (!hasData) {
          expressArr.push({
            kdid: 0,
            num: '',
            _tracks: [],
            _loading: false,
            _trackExpanded: true
          })
        }

        this.$set(so, '_expressList', expressArr)
        this.$set(so, 'con', so.con || '')
        this.$set(so, 'state', so.state ?? 0)
        this.$set(so, '_saving', false)
      })
    },

    toggleTrack(express) {
      this.$set(express, '_trackExpanded', !express._trackExpanded)
    },

    addExpress(subOrder) {
      if (subOrder._expressList.length >= 5) {
        this.$message.warning('最多添加5个快递')
        return
      }
      subOrder._expressList.push({
        kdid: 0,
        num: '',
        _tracks: [],
        _loading: false,
        _trackExpanded: true
      })
    },

    removeExpress(subOrder, idx) {
      subOrder._expressList.splice(idx, 1)
      if (subOrder._expressList.length === 0) {
        subOrder._expressList.push({
          kdid: 0,
          num: '',
          _tracks: [],
          _loading: false,
          _trackExpanded: true
        })
      }
    },

    async queryExpressTrack(subOrder, expIdx) {
      const express = subOrder._expressList[expIdx]
      if (!express.kdid || !express.num) {
        this.$message.warning('请先选择快递公司并填写快递单号')
        return
      }

      const expInfo = this.expressList.find(e => e.id == express.kdid)
      if (!expInfo) {
        this.$message.warning('未找到该快递公司信息')
        return
      }

      const phone = subOrder.mobile || this.orderDetail?.scaddress?.phone || ''
      if (!phone) {
        this.$message.warning('缺少收货人手机号，无法查询物流')
        return
      }

      this.$set(express, '_loading', true)
      try {
        const res = await ddKuaidiQuery({
          code: expInfo.code,
          num: express.num,
          phone
        })

        if (res.code === 200 && res.data?.msg?.context) {
          const tracks = res.data.msg.context.map(item => ({
            time: this.formatTime(item.time),
            context: item.desc
          }))
          this.$set(express, '_tracks', tracks)
          this.$set(express, '_trackExpanded', true)
          if (tracks.length === 0) {
            this.$message.info('暂无物流信息')
          }
        } else {
          this.$set(express, '_tracks', [])
          this.$message.warning(res.data?.msg || res.msg || '暂无物流信息')
        }
      } catch (e) {
        this.$set(express, '_tracks', [])
        this.$message.error('查询物流失败')
      } finally {
        this.$set(express, '_loading', false)
      }
    },

    getSubOrderProducts(so) {
      // 云中鹤订单：合并所有 child 的 product
      if (so.child_flag == 1 && so.child?.length) {
        let products = []
        so.child.forEach(child => {
          if (child.product?.length) {
            products = products.concat(child.product)
          }
        })
        if (products.length > 0) return products
      }
      return so.product || []
    },

    getSupplierName(so) {
      if (so.gongyingshang?.username) {
        return `${so.gongyingshang.id}-${so.gongyingshang.username}`
      }
      return so.gid ? `${so.gid}-未知供应商` : '-'
    },

    getProductImage(p) {
      return p.product?.thumbnailimage || ''
    },

    getProductName(p) {
      return p.product?.name || '-'
    },

    getProductSpec(p) {
      if (p.xinghao?.xinghao) return p.xinghao.xinghao
      if (p.product?.name) return p.product.name
      return '默认'
    },

    getProductPrice(p) {
      return p.xinghao?.price || '0.00'
    },

    getFullAddress(a) {
      if (!a) return '-'
      return [a.province?.name, a.city?.name, a.county?.name, a.town?.name, a.addr].filter(Boolean).join('')
    },

    getStatusText(s) {
      const m = { 0: '未发货', 1: '已发货', 2: '已完成', 3: '已取消' }
      return m[s] || '未知'
    },

    getStatusColor(s) {
      const m = { 0: '#ff0000', 1: '#409EFF', 2: '#ff0000', 3: '#999999' }
      return m[s] || '#ff0000'
    },
    async saveKuaidi(so) {
      this.$set(so, '_saving', true)
      try {
        const params = {
          id: so.id,
          state: so.state,
          con: so.con || ''
        }



        // 🔥 手动设置快递字段，避免 forEach 问题
        params.kdid = 0
        params.num = ''
        params.kdid1 = 0
        params.num1 = ''
        params.kdid2 = 0
        params.num2 = ''
        params.kdid3 = 0
        params.num3 = ''
        params.kdid4 = 0
        params.num4 = ''



        // 🔥 安全地填充快递数据
        if (so._expressList && Array.isArray(so._expressList)) {

          so._expressList.forEach((exp, i) => {

            if (i === 0) {
              params.kdid = exp.kdid || 0
              params.num = exp.num || ''
            } else if (i === 1) {
              params.kdid1 = exp.kdid || 0
              params.num1 = exp.num || ''
            } else if (i === 2) {
              params.kdid2 = exp.kdid || 0
              params.num2 = exp.num || ''
            } else if (i === 3) {
              params.kdid3 = exp.kdid || 0
              params.num3 = exp.num || ''
            } else if (i === 4) {
              params.kdid4 = exp.kdid || 0
              params.num4 = exp.num || ''
            }
          })
        } else {

        }


        const res = await editDingdankd(params)



        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (e) {
        console.error('保存异常:', e)

        this.$message.error('保存失败: ' + e.message)
      } finally {
        this.$set(so, '_saving', false)
      }
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

    goBack() {
      this.$router.back()
    },

    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      const p = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
    },

    handleImgError(e) {
      e.target.style.display = 'none'
      const div = document.createElement('div')
      div.className = 'img-placeholder'
      div.textContent = '暂无图片'
      e.target.parentNode.appendChild(div)
    }
  }
}
</script>

<style scoped>
.order-detail-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.detail-table th,
.detail-table td {
  padding: 10px;
  vertical-align: middle;
  border: 1px solid #EBEEF5;
}

.detail-table th {
  font-weight: 500;
}

.main-order-row th {
  font-size: 14px;
  color: #000;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.img-placeholder {
  width: 80px;
  height: 80px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

/* ====== 表单样式 ====== */
.form-select,
.form-input,
.form-textarea {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  padding: 4px 8px;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #409EFF;
}

.form-textarea {
  height: 60px;
  width: 70%;
  resize: vertical;
}

/* ====== 按钮链接 ====== */
.link-btn {
  cursor: pointer;
  font-size: 12px;
}

.link-add {
  color: #409EFF;
}

.link-del {
  color: #F56C6C;
}

.link-query {
  color: #67C23A;
}

.link-toggle-track {
  color: #E6A23C;
}

.link-btn:hover {
  text-decoration: none;
}

/* ====== 信息区域 ====== */
.info-section {
  text-align: left;
  font-size: 14px;
  line-height: 2;
}

/* ====== 通用 ====== */
.price-text {
  padding-left: 10px;
}

.dangerCl {
  color: #F56C6C;
}

.fs10 {
  font-size: 10px;
}

.fs12 {
  font-size: 12px;
}

.mt20 {
  margin-top: 20px;
}

.txtleft {
  text-align: left;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #C0C4CC;
  font-size: 16px;
}

a {
  color: #409EFF;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}
</style>