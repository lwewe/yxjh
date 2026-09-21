<template>
  <div class="order-detail">
    <el-card class="detail-card" v-loading="loading">

      <div v-if="order">
        <!-- ========== 电子券订单 ========== -->
        <template v-if="order.flag == 2">
          <table class="detail-table">
            <tbody>
              <tr>
                <th colspan="2" style="text-align: left;">订单号：{{ order.order_no }}</th>
                <th style="text-align: left;">下单用户：<span type="primary" style="cursor: pointer;"
                    @click="viewUser(order.uid)">{{ order.uid
                    }}</span></th>
                <th style="text-align: left;" v-if="order.ka_ids">兑换ID: {{ order.ka_ids }}</th>
                <th colspan="2" style="text-align: left;">下单时间：{{ formatTime(order.add_time) }}</th>
              </tr>
              <tr>
                <td width="5%">{{ order.id }}</td>
                <td width="10%">
                  <img v-if="order.coupons && order.coupons.img" :src="order.coupons.img" width="50"
                    style="border-radius: 4px;">
                  <div v-else class="img-placeholder">暂无图片</div>
                </td>
                <td width="20%" style="text-align: left;">
                  {{ order.coupons ? order.coupons.title : (order.content || '电子券') }}
                </td>
                <td width="20%">电子券 * {{ order.num }}</td>
                <td width="10%"><span class="price-text"><span class="fs10">￥</span>{{ order.zongji
                }}</span></td>
                <td width="15%">{{ formatTime(order.add_time) }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ========== 蛋糕订单 ========== -->
        <template v-if="order.flag == 3 && order.orderinfo">
          <div v-for="(info, idx) in order.orderinfo" :key="idx" class="cake-section">

            <!-- 板块1：订单基本信息 -->
            <table class="detail-table">
              <tbody>
                <tr>
                  <th colspan="2" style="text-align: left; background-color: #e8eaed;">订单号：{{ order.order_no }}</th>
                  <th width="15%" style="background-color: #e8eaed;">下单用户：<span @click="viewUser(order.uid)">{{
                    order.uid }}</span></th>
                  <th width="10%" style="background-color: #e8eaed;">总价：<span class="price-text"><span
                        class="fs10">￥</span>{{ order.zongji
                        }}</span></th>
                  <th width="18%" style="background-color: #e8eaed;">下单时间：{{ formatTime(order.add_time) }}</th>
                </tr>
                <tr>
                  <th colspan="2" style="text-align: left;font-size: 12px;">订单号：{{ info.order_no }}</th>
                  <!-- <th colspan="2" style="text-align: left;">
                    供应商：{{ info.gid }}{{ getSupplierName(info) }}
                  </th> -->
                  <th colspan="2" style="text-align: left;font-size: 12px;" v-if="info.gid && info.gid != 0">
                    供应商：{{ info.gid }}{{ getSupplierName(info) }}
                  </th>
                  <th colspan="2" style="text-align: left;font-size: 12px;" v-else>
                    蛋糕订单号：{{ info.dg_order_no }}
                    <!-- gid 为 0 时不显示供应商 -->
                  </th>
                  <!-- <th style="text-align: left;font-size: 12px;">
                    <span :style="{ color: getStateColor(info.state), }">{{ getStateText(info.state)
                      }}</span>
                  </th> -->

                  <!-- <th style="text-align: left;font-size: 12px;">
                    <span :style="{ color: getStateColor(getOrderStatus(info)) }">--{{ getStateText(getOrderStatus(info))
                      }}</span>
                  </th> -->

                  <!-- <th style="text-align: left;font-size: 12px;"> -->
                 
                    <!-- 主状态（供应商侧 0-4） -->
                    <!-- <span :style="{ color: getStateColor(getOrderStatus(info)) }">
                     {{ getStateText(getOrderStatus(info)) }}
                    </span> -->
                    <!-- 蛋叔侧状态（0-3），有才显示 -->
                    <!-- <span v-if="getDgStatus(info) !== ''" style="margin-left: 6px; color: #909399; font-size: 12px;">
                      <span :style="{ color: getDgStatusColor(getDgStatus(info)) }">{{
                        getDgStatusText(getDgStatus(info)) }}</span>
                    </span> -->
                  <!-- </th> -->


                  <th style="text-align: left;font-size: 12px;">
  <span :style="{ color: getDisplayStatusColor(info) }">
    {{ getDisplayStatusText(info) }}
  </span>
  <!-- 供应商订单额外标注一下来源 -->
  <span v-if="info.gid && info.gid != 0" style="margin-left: 6px; color: #909399; font-size: 12px;">
    (供应商)
  </span>
</th>

                  <!-- <th colspan="3" style="text-align: left;" v-if="info.dg_order_no">蛋糕订单号：{{ info.dg_order_no }}</th> -->
                </tr>
                <!-- 产品 -->
                <template v-if="info.orderinfo_list && info.orderinfo_list[0] && info.orderinfo_list[0].product">
                  <tr v-for="(product, pIdx) in info.orderinfo_list[0].product" :key="'p-' + pIdx">
                    <td width="8%"><img :src="product.image_path" width="50" style="border-radius: 4px;"
                        @error="handleImageError"></td>
                    <td width="22%" style="text-align: left;">{{ product.product_name }}</td>
                    <td width="18%">{{ product.spec_name }} * {{ product.quantity || 1 }}</td>
                    <td width="10%"><span class="price-text"><span class="fs10">￥</span>{{ product.price }}</span></td>
                    <td width="15%">{{ info.orderinfo_list[0].created_at || formatTime(info.add_time) }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td width="8%"><img :src="getCakeImage(info)" width="50" style="border-radius: 4px;"
                        @error="handleImageError"></td>
                    <td width="22%" style="text-align: left;">{{ getCakeName(info) }}</td>
                    <td width="18%">{{ getCakeSpec(info) }}</td>
                    <td width="10%"><span class="price-text"><span class="fs10">￥</span>{{ getCakePrice(info) }}</span>
                    </td>
                    <td width="15%">{{ formatTime(info.add_time) }}</td>
                  </tr>
                </template>
              </tbody>
            </table>

            <!-- 板块2：下单人 + 收货 + 配送 + 备注 -->
            <!-- 板块2：下单人 + 收货/自提 + 配送 + 备注 -->
            <table class="detail-table">
              <tbody>
                <tr v-if="getBuyerPhone(info)">
                  <td colspan="2" style="text-align: left;">{{ getBuyerPhone(info) || '-' }}</td>
                  <td colspan="1" style="text-align: right;" v-if="getShipAmount(info)">
                    配送费：<span class="price-text"><span class="fs10">￥</span>{{ getShipAmount(info) }}</span>
                  </td>
                  <!-- <td colspan="1" style="text-align: left;">
                    <span :style="{ color: getStateColor(info.state) }">{{ getStateText(info.state) }}</span>
                  </td> -->

                  <!-- <td colspan="1" style="text-align: left;">
                    <span :style="{ color: getStateColor(getOrderStatus(info)) }">{{ getStateText(getOrderStatus(info))
                      }}</span>
                  </td> -->
                  <td colspan="1" style="text-align: left;">
                    <!-- <span :style="{ color: getStateColor(getOrderStatus(info)) }">
                      {{ getStateText(getOrderStatus(info)) }}
                    </span> -->
                    <span v-if="getDgStatus(info) !== ''" style="margin-left: 6px; color: #909399; font-size: 12px;">
                      <span :style="{ color: getDgStatusColor(getDgStatus(info)) }">{{
                        getDgStatusText(getDgStatus(info))
                        }}</span>
                    </span>
                  </td>


                </tr>

                <!-- ================= 门店自提 ================= -->
                <template v-if="isShopSelfPick(info)">
                  <tr>
                    <td colspan="2" style="text-align: left;">自提门店：{{ getTakeShopName(info) }}</td>
                    <td colspan="2" style="text-align: left;">下单人：{{ getReceiverPhone(info) || '-' }}</td>
                  </tr>
                  <tr>
                    <td colspan="5" style="text-align: left;">自提地址：{{ getTakeShopAddr(info) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align: left;">取货方式：门店自提</td>
                    <td colspan="2" style="text-align: left;" v-if="getTastesName(info)">口味：{{ getTastesName(info) }}
                    </td>
                  </tr>
                  <tr v-if="getShipDate(info) || getShipTime(info) || getBuyerMsg(info)">
                    <td colspan="2" style="text-align: left;" v-if="getShipDate(info)">取货日期：{{ getShipDate(info) }}</td>
                    <td colspan="2" style="text-align: left;" v-if="getShipTime(info)">取货时间：{{ getShipTime(info) }}</td>
                    <td colspan="3" style="text-align: left;" v-if="getBuyerMsg(info)">用户备注：{{ getBuyerMsg(info) }}</td>
                  </tr>
                </template>

                <!-- ================= 配送 / 快递 ================= -->
                <template v-else>
                  <tr v-if="getReceiverInfo(info)">
                    <td colspan="2">收货信息：{{ getReceiverName(info) }}&nbsp;&nbsp;&nbsp;{{ getReceiverPhone(info) }}</td>
                    <td colspan="3">收货地址：{{ getReceiverAddr(info) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align: left;">配送方式：{{ getShipType(info) }}</td>
                    <td colspan="2" style="text-align: left;" v-if="getTastesName(info)">口味：{{ getTastesName(info) }}
                    </td>
                  </tr>
                  <tr v-if="getShipDate(info) || getShipTime(info) || getBuyerMsg(info)">
                    <td colspan="2" style="text-align: left;" v-if="getShipDate(info)">配送日期：{{ getShipDate(info) }}</td>
                    <td colspan="2" style="text-align: left;" v-if="getShipTime(info)">配送时间：{{ getShipTime(info) }}</td>
                    <td colspan="3" style="text-align: left;" v-if="getBuyerMsg(info)">用户备注：{{ getBuyerMsg(info) }}</td>
                  </tr>
                </template>

                <tr v-if="getSellerMsg(info)">
                  <td colspan="5" style="text-align: left;">卖家留言：{{ getSellerMsg(info) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- 板块3：编辑操作 -->
            <table class="detail-table" v-if="info.gid && info.gid != 0">
              <tbody>
                <tr>
                  <td style="text-align: left; width: 15%;">
                    <el-select v-model="editForms[idx].state" size="small" style="width: 100px;">
                      <el-option label="待确认" value="0"></el-option>
                      <el-option label="未发货" value="1"></el-option>
                      <el-option label="已发货" value="2"></el-option>
                      <el-option label="已完成" value="3"></el-option>
                      <el-option label="已取消" value="4"></el-option>
                    </el-select>

                  </td>
                  <td style="text-align: left; width: 20%;">
                    <el-select v-model="editForms[idx].kdid" size="small" style="width: 160px;">
                      <el-option label="请选择快递公司" value="0"></el-option>
                      <el-option label="商家配送" value="100"></el-option>
                      <el-option v-for="kd in kuaidiList" :key="kd.id" :label="kd.code + '-' + kd.name"
                        :value="String(kd.id)"></el-option>
                    </el-select>
                  </td>
                  <td colspan="2" style="text-align: center;">
                    <el-input v-model="editForms[idx].num" size="small" placeholder="快递单号"></el-input>
                  </td>
                  <td rowspan="2" style="text-align: center; vertical-align: middle; width: 10%;">
                    <el-button type="success" size="small" @click="saveKuaidi(info.id, idx)"
                      :loading="saveLoading">保存</el-button>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: left;">

                    <el-input v-model="editForms[idx].con" type="textarea" :rows="2" size="small" placeholder="后台备注"
                      style="width: 80%;"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 物流轨迹 -->
            <!-- <div class="logistics-box" v-if="logisticsMap[idx] && logisticsMap[idx].length > 0">
              <div class="logistics-header"><i class="el-icon-truck"></i> 物流信息</div>
              <el-timeline style="padding: 15px 20px;">
                <el-timeline-item v-for="(item, i) in logisticsMap[idx]" :key="i" :timestamp="formatTime(item.time)"
                  placement="top" :color="i === 0 ? '#67C23A' : undefined">
                  {{ item.desc }}
                </el-timeline-item>
              </el-timeline>
            </div> -->
<div class="logistics-box" v-if="hasLogistics(info)">
  <div class="logistics-header">
    <i class="el-icon-truck"></i> 物流信息
    <span v-if="getExpressCp(info)" style="margin-left: 12px; font-weight: normal; color: #666;">
      {{ getExpressCp(info) }}：{{ getExpressNo(info) }}
    </span>
  </div>
  <el-timeline style="padding: 15px 20px;">
    <el-timeline-item
      v-for="(item, i) in getLogisticsList(info)"
      :key="i"
      :timestamp="item.AcceptTime"
      placement="top"
      :color="i === 0 ? '#67C23A' : undefined">
      {{ item.AcceptStation }}
    </el-timeline-item>
  </el-timeline>
</div>

          </div>
        </template>
        <!-- ========== 收货信息 ========== -->
        <el-card v-if="order.address">
          <div>收货信息</div>
          <div class="panel-body">
            <div><span class="gray-label">姓名：</span>{{ order.address.name }}</div>
            <div><span class="gray-label">电话：</span>{{ order.address.phone }}</div>
            <div><span class="gray-label">收货地址：</span>{{ order.address.province }}{{ order.address.city }}{{
              order.address.area
              }}{{ order.address.addr }}</div>
          </div>
        </el-card>
        <!-- ========== 支付信息（独立板块） ========== -->
        <el-card class="mt20">
          <div> 支付信息</div>
          <div class="panel-body">
            <div v-if="order.total_fee > 0" style="margin-bottom: 6px;">
              <span class="gray-label">微信支付：</span><span class="price-text"><span class="fs10">￥</span>{{
                order.total_fee
              }}</span>
            </div>
            <div v-if="order.fuli_list && order.fuli_list.length > 0">
              <div v-for="card in order.fuli_list" :key="card.id" v-if="card.id !== 'wx'">
                <span class="gray-label">福利卡：</span>

                <span class="dangerCl">{{ getCardTypeNameByPid(card.pid) }}</span>

                {{ card.num }}
                <span style="display: inline-block; width: 120px;padding-left: 10px;">余额： <span class="fs10">￥</span>{{
                  card.price }} </span>
                扣除 <span class="price-text"><span class="fs10">￥</span>{{ card.kc }}</span>
                <el-button type="danger" size="mini" v-if="isadmin == 1" style="margin-left: 10px;margin-right: 10px;"
                  @click="openFuliEdit(card)">修改 </el-button>
              </div>
            </div>
            <div v-if="!order.total_fee && (!order.fuli_list || order.fuli_list.length === 0)" style="color: #909399;">
              暂无支付信息
            </div>
          </div>
        </el-card>

      </div>

      <div v-if="!order && !loading" style="text-align: center; padding: 80px 0; color: #909399;">
        <i class="el-icon-document" style="font-size: 60px; color: #dcdfe6;"></i>
        <p style="margin-top: 10px;">暂无订单数据</p>
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
import { getOrder, kuaidiList, kuaidiQuery, editKuaidi } from '@/api/modules/dgorder'
import { showSupplier } from '@/api/modules/login'  // 根据实际路径调整
import FuliEditDrawer from '@/components/FuliEditDrawer.vue'  // 👈 新增
export default {
  components: {
    FuliEditDrawer  // 👈 新增
  },
  name: 'CakeOrderTotaldetails',
  data() {
    return {
      isadmin: localStorage.getItem('is_super_admin'),

      fuliDrawerVisible: false,   // 👈 新增
      currentFuliData: {},
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      order: null,
      kuaidiList: [],
      logisticsMap: {},
      loading: false,
      saveLoading: false,
      editForms: [],
      supplierMap: {}, cardTypeMap: {
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
  mounted() {
    this.loadDetail()
    this.loadKuaidiList()
    this.loadSupplierList()  // ← 加这行
  },
  methods: {
    // 当前订单实际要显示的状态值
getDisplayStatus(info) {
  // 蛋糕叔叔订单（无供应商）→ 用蛋叔侧 status（0-3）
  if (!info?.gid || info.gid == 0) {
    const d = this.getOrderInfoData(info)
    if (d?.status !== undefined && d?.status !== null && d?.status !== '') {
      return { value: d.status, type: 'dg' }
    }
  }
  // 供应商订单 → 用 state（0-4）
  return { value: info?.state ?? '', type: 'supplier' }
},

getDisplayStatusText(info) {
  const { value, type } = this.getDisplayStatus(info)
  return type === 'dg' ? this.getDgStatusText(value) : this.getStateText(value)
},

getDisplayStatusColor(info) {
  const { value, type } = this.getDisplayStatus(info)
  return type === 'dg' ? this.getDgStatusColor(value) : this.getStateColor(value)
},
    // 是否有物流
hasLogistics(info) {
  const w = info?.wuliu_list
  return w && w.hasData == 1 && Array.isArray(w.contents) && w.contents.length > 0
},

// 物流轨迹列表
getLogisticsList(info) {
  const w = info?.wuliu_list
  return Array.isArray(w?.contents) ? w.contents : []
},

// 物流公司
getExpressCp(info) {
  return info?.wuliu_list?.express_cp || ''
},

// 快递单号
getExpressNo(info) {
  return info?.wuliu_list?.express_no || ''
},
    // 蛋叔侧状态（orderinfo_list[0].status）
    getDgStatus(info) {
      const d = this.getOrderInfoData(info)
      return d?.status ?? ''
    },
    getDgStatusText(s) {
      const m = { '0': '待确认', '1': '已确认', '2': '已完成', '3': '已取消' }
      return m[String(s)] || ''
    },
    getDgStatusColor(s) {
      const m = { '0': '#E6A23C', '1': '#409EFF', '2': '#67C23A', '3': '#909399' }
      return m[String(s)] || '#909399'
    },
    // 是否门店自提
    isShopSelfPick(info) {
      return this.getOrderInfoData(info)?.ship_type === 'shop'
    },

    // 自提门店名称
    getTakeShopName(info) {
      const d = this.getOrderInfoData(info)
      return d?.take_shop_name || ''
    },

    // 自提门店地址（自提时 addr 字段就是门店地址）
    getTakeShopAddr(info) {
      const d = this.getOrderInfoData(info)
      if (!d) return ''
      // 优先用 take_shop_name 对应的地址，若 addr 有值直接用
      return d.addr || [d.province, d.city, d.area, d.addr].filter(Boolean).join('')
    },

    // 口味（从 content JSON 中取）
    getTastesName(info) {
      const raw = this.getOrderInfoData(info)?.content
      if (!raw) return ''
      try {
        const obj = typeof raw === 'string' ? JSON.parse(raw) : raw
        return obj?.tastes_name || ''
      } catch (e) {
        return ''
      }
    },


    openFuliEdit(fuli) {
      this.currentFuliData = { ...fuli }
      this.fuliDrawerVisible = true
    },

    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      this.loadOrderDetail()  // 刷新订单详情
    },
    // getOrderStatus(info) {
    //   const d = this.getOrderInfoData(info)
    //   return d?.status ?? ''
    // },
    getOrderStatus(info) {
      return info?.state ?? ''
    },

    onFuliEditClose() {
      this.currentFuliData = {}
    },
    // 根据 pid 获取卡类型名称
    getCardTypeNameByPid(pid) {
      return this.cardTypeMap[pid] || '福利卡'
    },
    async loadSupplierList() {
      try {
        const res = await showSupplier()
        if (res.code === 200 && res.data.list) {
          res.data.list.forEach(item => {
            this.supplierMap[item.id] = item.username
            this.supplierMap[String(item.id)] = item.username
          })
        }
      } catch (e) {
        console.error('获取供应商列表失败:', e)
      }
    },
    getSupplierName(info) {
      // 优先从接口获取的供应商列表匹配
      if (!info.gid || info.gid == 0) return ''
      // 只从接口获取的供应商列表匹配
      if (this.supplierMap[info.gid]) {
        return '-' + this.supplierMap[info.gid]
      }
      return ''
    },
    async loadDetail() {
      const id = this.$route.query.id
      if (!id) { this.$message.error('缺少订单ID'); return }
      this.loading = true
      try {
        const res = await getOrder({ id })
        if (res.code === 200) {
          this.order = res.data.order
          if (this.order.orderinfo) {

            this.editForms = this.order.orderinfo.map(info => ({
              state: String(info.state ?? 0),
              kdid: String(info.kdid || 0),
              num: info.num || '',
              con: info.con || ''
            }))
            // this.editForms = this.order.orderinfo.map(info => ({
            //   state: String(info.state || 0),
            //   kdid: String(info.kdid || 0),
            //   num: info.num || '',
            //   con: info.con || ''
            // }))


          }
        } else { this.$message.error(res.msg || '获取失败') }
      } catch (e) { this.$message.error('获取失败') }
      finally { this.loading = false }
    },

    async loadKuaidiList() {
      try {
        const res = await kuaidiList()
        if (res.code === 200) this.kuaidiList = res.data || []
      } catch (e) { }
    },

    async saveKuaidi(infoId, idx) {
      this.saveLoading = true
      try {
        const f = this.editForms[idx]
        const res = await editKuaidi({ id: infoId, state: f.state, kdid: f.kdid, num: f.num, con: f.con })
        if (res.code === 200) {
          this.$message.success('保存成功')
        } else { this.$message.error(res.msg || '保存失败') }
      } catch (e) { this.$message.error('保存失败') }
      finally { this.saveLoading = false }
    },

    getOrderInfoData(info) {
      return info?.orderinfo_list?.[0] || null
    }, getContentData(info) {
      if (Array.isArray(info.content) && info.content.length > 0) {
        return info.content[0]
      }
      return null
    },
    getCakeImage(info) {
      // 先尝试 orderinfo_list
      const d = this.getOrderInfoData(info)
      if (d?.product?.[0]?.image_path) return d.product[0].image_path
      // 再尝试 content 数组
      const c = this.getContentData(info)
      if (c?.product?.image_path) return c.product.image_path
      return ''
    },
    getCakeName(info) {
      const d = this.getOrderInfoData(info)
      if (d?.product?.[0]?.product_name) return d.product[0].product_name
      const c = this.getContentData(info)
      if (c?.product?.title) return c.product.title
      return this.order.content || '-'
    },
    getCakeSpec(info) {
      const d = this.getOrderInfoData(info)
      if (d?.product?.[0]) return `${d.product[0].spec_name} * ${d.product[0].quantity || 1}`
      const c = this.getContentData(info)
      if (c?.xinghao?.name) return `${c.xinghao.name} * ${c.quantity || 1}`
      return '-'
    },
    getCakePrice(info) {
      const d = this.getOrderInfoData(info)
      if (d?.product?.[0]?.price) return d.product[0].price
      if (d?.final_amount) return d.final_amount
      const c = this.getContentData(info)
      if (c?.xinghao?.price) return c.xinghao.price
      return this.order.zongji || '0.00'
    },
    getShipDate(info) {
      const d = this.getOrderInfoData(info)
      if (d?.ship_date) return d.ship_date
      const c = this.getContentData(info)
      return c?.ship_date || ''
    }, getSellerMsg(info) {
      const d = this.getOrderInfoData(info)
      return d?.seller_msg || ''
    },
    getShipTime(info) {
      const d = this.getOrderInfoData(info)
      if (d?.ship_time_text) return d.ship_time_text
      const c = this.getContentData(info)
      return c?.ship_time_text || ''
    },
    getBuyerMsg(info) {
      const d = this.getOrderInfoData(info)
      if (d?.buyer_msg) return d.buyer_msg
      const c = this.getContentData(info)
      return c?.buyer_msg || ''
    },
    getBuyerPhone(info) {
      const d = this.getOrderInfoData(info)
      return d?.buyer_phone || d?.phone || ''
    },
    getShipAmount(info) {
      const a = this.getOrderInfoData(info)?.ship_amount
      return a && +a > 0 ? a : ''
    },
    // getShipType(info) {
    //   const m = { 'delivery': '商家配送', 'same': '快递', 'express': '快递', 'self': '门店自提' }
    //   const t = this.getOrderInfoData(info)?.ship_type
    //   return t ? m[t] || t : ''
    // },
    getShipType(info) {
      const m = {
        'delivery': '商家配送',
        'same': '快递',
        'express': '快递',
        'shop': '门店自提',
        'self': '门店自提'
      }
      const t = this.getOrderInfoData(info)?.ship_type
      return t ? m[t] || t : ''
    },
    // 配送类型:deliverv-商家配送(可选择配送时间)，shop-门店自提(可选择配送时间),same-快递配送规则接口没返回可选配送时间,正常上架状态的商品)

    getReceiverInfo(info) {
      const d = this.getOrderInfoData(info)
      return d?.name || d?.addr
    },
    getReceiverName(info) { return this.getOrderInfoData(info)?.name || '' },
    getReceiverPhone(info) {
      const d = this.getOrderInfoData(info)
      return d?.phone || d?.buyer_phone || ''
    },
    getReceiverAddr(info) {
      const d = this.getOrderInfoData(info)
      return d ? [d.province, d.city, d.area, d.addr].filter(Boolean).join('') : ''
    },
    // getStateText(s) {
    //   const m = { '0': '待确认', '1': '已确认', '2': '已完成', '3': '已取消' }
    //   return m[String(s)] || '未知'
    // },
    // getStateColor(s) {
    //   const m = { '0': '#E6A23C', '1': '#409EFF', '2': '#67C23A', '3': '#909399' }
    //   return m[String(s)] || '#303133'
    // },
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

    // ✅ 新增
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
  /* padding: 20px; */
  background: #f5f7fa;
  /* min-height: 100vh; */
}

.detail-card {
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  text-align: left;
  padding-bottom: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

/* 表格 */
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

.detail-table th {
  font-weight: 500;
}

.price-text {
  color: #222222;
  /* font-weight: 600; */
}

.red-label {
  color: #ff0000;
  font-weight: bold;
}

.gray-label {
  color: #666666;
  width: 70px;
  text-align: right;
  display: inline-block;
}

/* 面板 */
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

/* 物流 */
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

.img-placeholder {
  width: 50px;
  height: 50px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
  border-radius: 4px;
}

.cake-section {
  margin-bottom: 8px;
}
</style>