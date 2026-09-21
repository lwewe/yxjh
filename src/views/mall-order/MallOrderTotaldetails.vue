<template>
  <div>
    <!-- 顶部操作栏 -->
    <!-- <div class="page-header">
      <el-button icon="el-icon-arrow-left" size="small" @click="goBack">返回</el-button>
      <span class="page-title">订单详情 #{{ $route.query.id }}</span>
      <el-button size="small" type="primary" icon="el-icon-refresh" @click="refreshDetail">刷新</el-button>
    </div> -->
    <el-card>
      <div v-loading="loading" element-loading-text="加载中...">
        <template v-if="orderDetail">
          <div class="table-wrapper">
            <table class="detail-table">
              <tbody>
                <!-- ========== 订单基本信息 ========== -->
                <tr class="main-order-row">
                  <th colspan="2" style="text-align: left; background-color: #e3e7ef;">
                    总订单号：{{ orderDetail.order.order_no }}
                  </th>
                  <th width="20%" style="background-color: #e3e7ef;text-align: left;">
                    下单用户：<a href="javascript:;" style="color: #222222;text-decoration: none;"
                      @click="viewUser(orderDetail.order.uid)">{{
                        orderDetail.order.uid }}</a>
                  </th>
                  <th width="10%" style="background-color: #e3e7ef;">
                    总价：<span class="fs10">￥</span>{{ orderDetail.order.zongji }}
                  </th>
                  <th width="20%" style="background-color: #e3e7ef;">
                    下单时间：{{ formatTime(orderDetail.order.add_time) }}
                  </th>
                </tr>

                <!-- ========== 子订单列表 ========== -->
                <template v-for="(subOrder, subIdx) in orderDetail.orderList">

                  <!-- 子订单标题行 -->
                  <tr :key="'sub-header-' + subIdx" style="background-color: #ebeef5;">
                    <th colspan="2" style="text-align: left;font-size: 12px;">
                      订单号：{{ subOrder.order_no }}
                    </th>
                    <th style="text-align: left;font-size: 12px;">
                      供应商：{{ getSupplierName(subOrder) }}
                    </th>
                    <th colspan="2" style="text-align: left;font-size: 12px;">
                      <span :style="{ color: getStatusColor(subOrder.state) }">
                        {{ getStatusText(subOrder.state) }}
                      </span>
                    </th>
                  </tr>

                  <!-- 云中鹤子订单 -->
                  <!-- 云中鹤子订单（child_flag == 1） -->
                  <template v-if="subOrder.child_flag == 1">
                    <!-- 子订单行 -->
                    <tr :key="'yz1-' + subIdx">
                      <th colspan="2" style="text-align: left;font-size: 12px;">
                        订单号：{{ subOrder.order_no }}
                      </th>
                      <th colspan="3" style="text-align: left;font-size: 12px;">
                        商城订单号：{{ subOrder.order_key || '-' }}
                      </th>
                    </tr>

                    <!-- 遍历每个云中鹤 child -->
                    <template v-for="(child, childIdx) in subOrder.child">
                      <!-- child 信息行 -->
                      <tr :key="'yz2-' + subIdx + '-' + childIdx">
                        <th width="5%">&nbsp;</th>
                        <th style="text-align: left;font-size: 12px;">
                          商城订单号：{{ subOrder.order_key || '-' }}
                        </th>
                        <th style="text-align: left;font-size: 12px;">
                          子订单号：{{ child.key || '-' }}
                        </th>
                        <th colspan="2" style="text-align: left;font-size: 12px;">
                          <span :style="{ color: getYzhStatusColor(child.status) }">
                            {{ getYzhStatusText(child.status) }}
                          </span>
                        </th>
                      </tr>

                      <!-- child 的商品行 -->
                      <tr v-for="(product, pIdx) in (child.product || [])"
                        :key="'yz-p-' + subIdx + '-' + childIdx + '-' + pIdx">
                        <td width="10%">
                          <img v-if="getProductImage(product)" :src="getProductImage(product)" class="product-img"
                            @error="handleImgError">
                          <div v-else class="img-placeholder">暂无图片</div>
                        </td>
                        <td width="20%" style="text-align: left;font-size: 12px;">{{ getProductName(product) }}</td>
                        <td width="20%" class="fs12">{{ getProductSpec(product) }} *{{ product.quantity }}</td>
                        <td width="10%" class="fs12">￥{{ getProductPrice(product) }}</td>
                        <td width="15%" class="fs12">{{ formatTime(subOrder.add_time) }}</td>
                      </tr>

                      <!-- child 的物流信息（如果 API 返回了） -->
                      <template v-if="child.express_flag == 1 && child.express_list">
                        <!-- 物流摘要行 -->
                        <tr :key="'yz-exp-' + subIdx + '-' + childIdx">
                          <td style="text-align: left;font-size: 12px;color: #909399;">
                            物流：{{ child.express_list.shipment_name || '-' }}
                          </td>
                          <td style="text-align: left;font-size: 12px;color: #409EFF;">
                            单号：{{ child.express_list.shipment_order || '-' }}
                          </td>
                          <td colspan="2" style="text-align: left;font-size: 12px;">
                            <span :style="{ color: getExpressStatusColor(child.express_list.status) }">
                              {{ getExpressStatusText(child.express_list.status) }}
                            </span>
                          </td>
                          <td style="text-align: center;">
                            <span v-if="child.express_list.contents && child.express_list.contents.length"
                              class="link-btn link-toggle-track" @click="toggleYzhTrack(child)">
                              {{ child._trackExpanded ? '收起物流' : '展开物流' }}
                            </span>
                          </td>
                        </tr>

                        <!-- 物流轨迹详情（可展开/收缩） -->
                        <template v-if="child._trackExpanded && child.express_list.contents">
                          <tr v-for="(track, tIdx) in child.express_list.contents"
                            :key="'yz-track-' + subIdx + '-' + childIdx + '-' + tIdx">
                            <td
                              style="border: 1px solid #EBEEF5; color: blue; padding: 6px 10px; width: 100px; text-align: center;">
                              <strong v-if="tIdx === 0">物流信息</strong>
                              <span v-else>&nbsp;</span>
                            </td>
                            <td
                              style="border: 1px solid #EBEEF5; padding: 6px; font-size: 12px; width: 150px; text-align: center;">
                              {{ track.time }}
                            </td>
                            <td colspan="3"
                              style="border: 1px solid #EBEEF5; text-align: left; padding: 6px 10px; font-size: 12px;">
                              {{ track.description }}
                            </td>
                          </tr>
                        </template>
                      </template>
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
                    <td width="20%" style="text-align: left;font-size: 12px;">{{ getProductName(product) }}</td>
                    <td width="20%" class="fs12">{{ getProductSpec(product) }} *{{ product.quantity }}</td>
                    <td width="10%" class="fs12">￥{{ getProductPrice(product) }}</td>
                    <td width="15%" class="fs12">{{ formatTime(subOrder.add_time) }}</td>
                  </tr>

                  <!-- 备注 -->
                  <tr :key="'remark-' + subIdx">
                    <td colspan="5" style="text-align: left; padding: 8px 16px;" class="fs12">
                      订单备注：{{ subOrder.remark }}
                    </td>
                  </tr>



                  <!-- 快递详细内容（展开时显示） -->

                  <template v-for="(express, expIdx) in subOrder._expressList">
                    <!-- 快递选择行 -->
                    <tr :key="'kd-' + subIdx + '-' + expIdx">
                      <td style="text-align: left;">
                        <select v-model="express.kdid" class="form-select" style="width:160px;font-size: 12px;">
                          <option :value="0">请选择快递公司</option>
                          <option v-for="exp in expressList" :key="exp.id" :value="exp.id">
                            {{ exp.code }}-{{ exp.name }}
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
                        <!-- 物流信息展开/收缩按钮 -->
                        <span v-if="express.kdid > 0 && express.num"
                          style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <span class="link-btn link-query" @click="queryExpressTrack(subOrder, expIdx)">
                            {{ express._loading ? '查询中...' : '查询物流' }}
                          </span>
                          <span v-if="express._tracks && express._tracks.length" class="link-btn link-toggle-track"
                            @click="toggleTrack(express)">
                            {{ express._trackExpanded ? '收起物流' : '展开物流' }}
                          </span>
                        </span>
                      </td>
                    </tr>

                    <!-- 物流追踪（可单独展开/收缩） -->
                    <template v-if="express._tracks && express._tracks.length && express._trackExpanded">
                      <tr v-for="(track, tIdx) in express._tracks" :key="'track-' + subIdx + '-' + expIdx + '-' + tIdx">
                        <td
                          style="border: 1px solid #EBEEF5; color: blue; padding: 6px 10px; width: 100px; text-align: center;">
                          <strong v-if="tIdx === 0">物流信息</strong>
                          <span v-else>&nbsp;</span>
                        </td>
                        <td
                          style="border: 1px solid #EBEEF5; padding: 6px; font-size: 12px; width: 150px; text-align: center;">
                          {{ track.time }}
                        </td>
                        <td colspan="3"
                          style="border: 1px solid #EBEEF5; text-align: left; padding: 6px 10px; font-size: 12px;">
                          {{ track.context }}
                        </td>
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
                      <div style="display: flex;align-items: center;font-size: 12px;">
                        <!-- <span></span> -->
                        <textarea v-model="subOrder.con" class="form-textarea"
                          style="font-size: 12px; font-family: inherit; color: #606266;" placeholder="后台备注："></textarea>
                      </div>
                    </td>
                    <td style="text-align: center;">
                      <el-button @click="saveKuaidi(subOrder)" size="mini" type="warning" :disabled="subOrder._saving">
                        {{ subOrder._saving ? '保存中...' : '保存' }}
                      </el-button>
                    </td>
                  </tr>
                </template>

                <!-- ========== 收货信息 & 支付信息 ========== -->

              </tbody>
            </table>
          </div>


          <el-card class="mt20">


            <tr v-if="orderDetail.scaddress">
              <td colspan="5">
                <span>收货信息：</span>
                {{ getFullAddress(orderDetail.scaddress) }}
                &nbsp;&nbsp;<span>收货人：</span>{{ orderDetail.scaddress.name }}
                &nbsp;&nbsp;<span>电话：</span>{{ orderDetail.scaddress.phone }}
              </td>
            </tr>

          </el-card>


          <el-card class="mt20">



            <tr v-if="orderDetail.order.fuli_list && orderDetail.order.fuli_list.length">
              <td colspan="5" class="txtleft">
                <div class="mb10">支付信息</div>
                <template v-for="(f, fi) in orderDetail.order.fuli_list">
                  <span v-if="f.id === 'wx'" :key="'wx'"><span class="txtright"
                      style="width: 80px;text-align: right;display: inline-block;">微信支付：</span><span
                      class="price-text"><span class="fs10">￥</span>{{ f.kc }}</span></span>
                  <div v-else :key="fi" style="margin: 10px 0;">
                    <span style="width: 80px;text-align: right;display: inline-block;">福利卡：</span> <span
                      class="dangerCl">【{{ getFuliType(f.pid) }}】</span>{{ f.num || f.id }} <span class="price-text"
                      style="width: 110px;display: inline-block;">扣除：<span class="fs10">￥</span>{{ f.kc }}</span>
                    <span style="padding-left: 10px;width: 110px;display: inline-block;">余额：<span
                        class="fs10">￥</span>{{ f.price }}</span>
                     
                    <el-button type="danger" size="mini" v-if="isadmin == 1" style="margin-left: 10px;margin-right: 10px;"
                      @click="openFuliEdit(f)">修改</el-button>
                  </div>
                </template>
              </td>
            </tr>
          </el-card>



          <fuli-edit-drawer :drawer-visible.sync="fuliDrawerVisible" :fuli-data="currentFuliData"
            @success="onFuliEditSuccess" @close="onFuliEditClose" />


        </template>
        <div v-else-if="!loading" class="empty-state">
          <i class="el-icon-document" style="font-size: 64px; color: #C0C4CC; display: block; margin-bottom: 16px;"></i>
          <p>暂无订单数据</p>
        </div>
      </div>



      <div class="txtleft mt20">
        <el-button @click="goBack">返回</el-button>

      </div>

    </el-card>
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
import { getScorder, editKuaidi, kuaidiQuery } from '@/api/modules/sorder'
import { kuaidiList } from '@/api/modules/sorder'
// 导入组件
import FuliEditDrawer from '@/components/FuliEditDrawer.vue'
export default {
  components: {
    FuliEditDrawer
  },
  data() {
    return {isadmin: localStorage.getItem('is_super_admin'),
      fuliDrawerVisible: false,
      currentFuliData: {},  // 当前要修改的福利卡数据
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      orderDetail: null,
      loading: false,
      expressList: []
    }
  },
  async mounted() {
    await this.loadExpressList()
    this.loadOrderDetail()
  },
  methods: {
    openFuliEdit(fuli) {
      this.currentFuliData = { ...fuli }
      this.fuliDrawerVisible = true
    },

    // 福利卡修改成功回调
    onFuliEditSuccess(data) {
      console.log('福利卡修改成功:', data)
      // 刷新订单详情
      this.refreshDetail()
    },

    // 福利卡修改抽屉关闭回调
    onFuliEditClose() {
      this.currentFuliData = {}
    },
    // 切换云中鹤物流追踪展开/收缩
    toggleYzhTrack(child) {
      this.$set(child, '_trackExpanded', !child._trackExpanded)
    },
    // 云中鹤状态
    getYzhStatusText(status) {
      const map = {
        'pending': '待处理', 'processing': '处理中', 'shipped': '已发货',
        'completed': '已完成', 'cancelled': '已取消', 'returned': '已退货'
      }
      return map[status] || status || '未知'
    },
    getYzhStatusColor(status) {
      const map = {
        'pending': '#E6A23C', 'processing': '#409EFF', 'shipped': '#67C23A',
        'completed': '#ff0000', 'cancelled': '#999999', 'returned': '#F56C6C'
      }
      return map[status] || '#ff0000'
    },

    // 物流状态
    getExpressStatusText(status) {
      const map = {
        'signed': '已签收', 'delivering': '派送中', 'transit': '运输中',
        'picked': '已揽收', 'failed': '派送失败'
      }
      return map[status] || status || '-'
    },
    getExpressStatusColor(status) {
      const map = {
        'signed': '#67C23A', 'delivering': '#409EFF', 'transit': '#E6A23C',
        'picked': '#909399', 'failed': '#F56C6C'
      }
      return map[status] || '#909399'
    },
    getFuliType(pid) {
      const typeMap = {
        1: '超级卡',
        2: '蛋糕卡',
        3: '电影卡',
        4: '图书卡',
        5: '超级券',
        6: '蛋糕券',
        7: '电影券',
        8: '图书券',
        9: '悦享卡',
        10: '商城尊享券',
        11: '电影尊享券',
        12: '蛋糕尊享券',
        13: '提货券',
        14: '工会消费券'
      }
      return typeMap[pid] || '福利卡(' + pid + ')'
    },
    async loadExpressList() {
      try {
        const res = await kuaidiList()
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
        const res = await getScorder({ id })
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
      if (!this.orderDetail?.orderList) return
      this.orderDetail.orderList.forEach(so => {
        const list = []
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
            list.push({ kdid: f.kdid, num: f.num, _tracks: [], _loading: false, _trackExpanded: true })
            hasData = true
          }
        })
        if (!hasData) {
          list.push({ kdid: 0, num: '', _tracks: [], _loading: false, _trackExpanded: true })
        }

        this.$set(so, '_expressList', list)
        // 如果已有快递数据，默认展开
        this.$set(so, '_expressExpanded', hasData)
        this.$set(so, 'con', so.con || '')
        this.$set(so, 'state', so.state ?? 0)
        this.$set(so, '_saving', false)

        if (so.child_flag == 1 && so.child?.length) {
          so.child.forEach(child => {
            this.$set(child, '_trackExpanded', false)
          })
        }
      })
    },

    // 切换快递区域展开/收缩
    toggleExpress(subOrder) {
      this.$set(subOrder, '_expressExpanded', !subOrder._expressExpanded)
    },

    // 切换物流追踪展开/收缩
    toggleTrack(express) {
      this.$set(express, '_trackExpanded', !express._trackExpanded)
    },

    // 获取已填写的快递数量
    getFilledExpressCount(subOrder) {
      return subOrder._expressList.filter(e => e.kdid > 0 || e.num).length
    },

    addExpress(subOrder) {
      if (subOrder._expressList.length >= 5) {
        this.$message.warning('最多添加5个快递')
        return
      }
      subOrder._expressList.push({ kdid: 0, num: '', _tracks: [], _loading: false, _trackExpanded: true })
    },

    removeExpress(subOrder, idx) {
      subOrder._expressList.splice(idx, 1)
      if (subOrder._expressList.length === 0) {
        subOrder._expressList.push({ kdid: 0, num: '', _tracks: [], _loading: false, _trackExpanded: true })
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
        const res = await kuaidiQuery({
          code: expInfo.code,
          num: express.num,
          phone: phone
        })
        if (res.code === 200 && res.data?.msg?.context) {
          const tracks = res.data.msg.context.map(item => ({
            time: this.formatTime(item.time),
            context: item.desc
          }))
          this.$set(express, '_tracks', tracks)
          // 查询到物流后自动展开
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
      // 普通订单 / 兜底
      return so.product || []
    },



    getSupplierName(so) {
      if (so.gongyingshang?.username) {
        return `${so.gongyingshang.id}-${so.gongyingshang.username}`
      }
      return so.gid ? `${so.gid}-未知供应商` : '-'
    },

    getProductImage(p) { return p.product?.thumbnailimage || '' },
    getProductName(p) { return p.product?.name || '-' },
    getProductSpec(p) {
      if (p.xinghao?.xinghao) return p.xinghao.xinghao
      if (p.product?.name) return p.product.name
      return '默认'
    },
    getProductPrice(p) { return p.xinghao?.price || '0.00' },

    getFullAddress(a) {
      if (!a) return '-'
      return [a.province?.name, a.city?.name, a.county?.name, a.town?.name, a.addr].filter(Boolean).join('')
    },

    // 订单状态 flag=0（ 0-待发货，1-待收货，2-已完成，3-已取消）
    getStatusText(s) {
      const m = { 0: '待发货', 1: '已发货', 2: '已完成', 3: '已取消' }
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
          ;['', '1', '2', '3', '4'].forEach(s => {
            params['kdid' + s] = 0
            params['num' + s] = ''
          })
        so._expressList.forEach((exp, i) => {
          const s = i === 0 ? '' : String(i)
          params['kdid' + s] = exp.kdid || 0
          params['num' + s] = exp.num || ''
        })

        const res = await editKuaidi(params)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (e) {
        this.$message.error('保存失败')
      } finally {
        this.$set(so, '_saving', false)
      }
    },

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
    goBack() { this.$router.back() },
    refreshDetail() { this.loadOrderDetail() },

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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
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

/* ====== 快递展开/收缩 ====== */
.express-toggle-row td {
  border: none;
}

.express-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #f0f5ff;
  cursor: pointer;
  user-select: none;
  border-bottom: 2px solid #409EFF;
  transition: background 0.2s;
}

.express-toggle:hover {
  background: #e6f0ff;
}

.toggle-icon {
  font-size: 12px;
  color: #409EFF;
  width: 16px;
  text-align: center;
}

.toggle-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.toggle-count {
  font-weight: 400;
  color: #909399;
  font-size: 12px;
}

.toggle-tip {
  margin-left: auto;
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

.save-btn {
  padding: 6px 16px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.save-btn:hover {
  background: #218838;
}

.save-btn:disabled {
  background: #909399;
  cursor: not-allowed;
}

.price-text {
  /* color: #F56C6C; */
  /* font-weight: 600; */
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #C0C4CC;
  font-size: 16px;
  background: #fff;
  border-radius: 4px;
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