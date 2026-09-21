<template>
  <div>
    <el-card v-loading="loading" shadow="never">
      <template v-if="orderDetail">

        <!-- 供应商 -->
        <el-table
          :data="[{ k: '供应商', v: orderDetail.user ? orderDetail.user.id + ' - ' + orderDetail.user.username : '-' }]"
          border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="k" />
          <el-table-column prop="v" />
        </el-table>

        <!-- 基本信息（5行合并）- 卡册链接在 val2 列 -->
        <el-table :data="basicRows" border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="label" />
          <el-table-column max-width="400">
            <template slot-scope="s">
              <span v-if="s.row.color" :style="{ color: s.row.color }">{{ s.row.val }}</span>
              <span v-else>{{ s.row.val }}</span>
            </template>
          </el-table-column>
          <el-table-column width="110" align="center" class-name="label-col" prop="label2" />
          <!-- ✅ 卡册链接在这里（val2列） -->
          <el-table-column>
            <template slot-scope="s">
              <span v-if="s.row.isCardLink" class="link-text" @click="goToCardEdit">{{ s.row.val2 }}</span>
              <span v-else>{{ s.row.val2 }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 商品明细 - 产品标题链接在 val 列 -->
        <el-table v-if="orderDetail.product" :data="productRows" border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="label" />
          <!-- ✅ 产品标题链接在这里（val列） -->
          <el-table-column max-width="400">
            <template slot-scope="s">
              <span v-if="s.row.isProductLink" class="link-text" @click="goToProductEdit">{{ s.row.val }}</span>
              <span v-else>{{ s.row.val }}</span>
            </template>
          </el-table-column>
          <el-table-column width="110" align="center" class-name="label-col" prop="label2" />
          <el-table-column prop="val2" />
        </el-table>

        <!-- 收货信息（3行合并） -->
        <el-table :data="addressRows" border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="label" />
          <el-table-column prop="val" />
        </el-table>

        <!-- 订单状态 -->
        <el-table :data="[{ k: '订单状态' }]" border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="k" />
          <el-table-column>
            <el-select v-model="orderDetail.order.state" size="small" style="width:150px;">
              <el-option :value="1" label="未发货" /><el-option :value="2" label="已发货" /><el-option :value="3"
                label="已取消" />
            </el-select>
          </el-table-column>
        </el-table>

        <!-- 后台备注 -->
        <el-table :data="[{ k: '后台备注' }]" border :show-header="false" class="info-table mb10">
          <el-table-column width="110" align="center" class-name="label-col" prop="k" />
          <el-table-column>
            <el-input v-model="orderDetail.order.con" type="textarea" :rows="3" placeholder="后台备注" />
          </el-table-column>
        </el-table>
        <div class="txtleft mb10" v-if="expressList.length < 5">
          <el-button size="mini" type="primary" @click="addExpress">+ 添加快递</el-button>
        </div>
        <!-- 快递（动态） -->
        <template v-for="(exp, idx) in expressList">
          <el-table :data="[{ k: '快递公司' + (idx + 1) }]" border :show-header="false" class="info-table mb10"
            :key="'kd-' + idx">
            <el-table-column width="110" align="center" class-name="label-col" prop="k" />
            <el-table-column>
              <el-select v-model="exp.kdid" size="small" filterable style="width:200px;">
                <el-option :value="0" label="请选择快递公司" />
                <el-option v-for="e in expressData" :key="e.id" :value="e.id" :label="e.code + '-' + e.name" />
              </el-select>
              <el-button size="mini" type="danger" @click="removeExpress(idx)" v-if="expressList.length > 1"
                style="margin-left:8px;">删除</el-button>
            </el-table-column>
          </el-table>
          <el-table :data="[{ k: '快递单号' + (idx + 1) }]" border :show-header="false" class="info-table mb10"
            :key="'num-' + idx">
            <el-table-column width="110" align="center" class-name="label-col" prop="k" />
            <el-table-column>
              <el-input v-model="exp.num" size="small" placeholder="快递单号" style="width:200px;" />
              <el-button size="mini" @click="queryTrack(idx)" :loading="exp._trackLoading"
                v-if="exp.kdid > 0 && exp.num" style="margin-left:8px;">查询物流</el-button>
            </el-table-column>
          </el-table>
          <el-table v-if="exp._tracks && exp._tracks.length" :data="[{ k: '物流' + (idx + 1) }]" border
            :show-header="false" class="info-table mb10" :key="'track-' + idx">
            <el-table-column width="110" align="center" class-name="label-col">
              <template slot-scope="s">
                <span class="track-toggle" @click="exp._trackShow = !exp._trackShow">
                  <i :class="exp._trackShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />{{ s.row.k }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <div v-show="exp._trackShow">
                <div v-for="(t, ti) in exp._tracks" :key="ti" class="track-row">
                  <span class="track-time">{{ t.time }}</span><span class="track-desc">{{ t.context }}</span>
                </div>
              </div>
            </el-table-column>
          </el-table>
        </template>

        <div class="txtleft mt20">
          <el-button type="success" @click="saveData" :loading="saving">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>

      </template>
      <div v-else-if="!loading" class="empty-state">暂无订单数据</div>
    </el-card>
  </div>
</template>

<script>
import { getKhorder, editKhorderkd, khKuaidiQuery } from '@/api/modules/sorder'
import { khKuaidiList } from '@/api/modules/sorder'

export default {
  data() {
    return {
      orderDetail: null, loading: false, saving: false, expressData: [],
      expressList: [{ kdid: 0, num: '', _tracks: [], _trackLoading: false, _trackShow: true }]
    }
  },
  computed: {
    basicRows() {
      const o = this.orderDetail?.order || {}
      const d = this.orderDetail
      return [
        { label: '订单编号', val: o.orderid, label2: '下单日期', val2: this.formatTime(o.add_time) },
        // ✅ 第2行加 isCardLink: true
        { label: '订单状态', val: this.getStateText(o.state), color: this.getStateColor(o.state), label2: '卡册', val2: d?.card ? d.card.id + ' - ' + d.card.company : '', isCardLink: true },
        { label: '规格', val: d?.xinghao ? d.xinghao.xinghao : '', label2: '购买账号', val2: d?.kahao ? d.kahao.id + ' - ' + d.kahao.num : '' },
        { label: '快递公司', val: this.getExpressInfo(o), label2: '', val2: '' },
        { label: '客户备注', val: o.content || '', label2: '', val2: '' }
      ]
    },
    productRows() {
      const d = this.orderDetail
      return [
        // ✅ 第1行加 isProductLink: true
        {
          label: '产品标题',
          val: d?.product ? d.product.id + ' - ' + d.product.name : '-',
          label2: '品牌',
          val2: d?.pinpai ? d.pinpai.name : '-',
          isProductLink: true
        },
        { label: '产品型号', val: d?.xinghao ? d.xinghao.xinghao : '-' },
        {
          label: '供货价',
          val: d?.xinghao ? d.xinghao.ghprice : '-',
          label2: '市场价',
          val2: d?.xinghao ? d.xinghao.price : '-'
        }
      ]
    },
    addressRows() {
      const o = this.orderDetail?.order || {}
      return [
        { label: '收货人名', val: o.name },
        { label: '联系手机', val: o.phone },
        { label: '详细地址', val: (o.diqu || '') + (o.address || '') }
      ]
    }
  },
  async mounted() { await this.loadExpressData(); this.loadOrderDetail() },
  methods: {
    // 跳转到产品编辑页
    goToProductEdit() {
      const productId = this.orderDetail?.product?.id
      if (productId) {
        // this.$router.push({ name: 'AddProduct', params: { id: productId } })
        this.$router.push({
          name: 'AddPro',
          params: { id: productId }
        }).catch(err => {
          console.log('路由跳转错误:', err)
        })
      }
    },

    // 跳转到卡册列表页
    goToCardEdit() {
      
         const cardId = this.orderDetail?.card?.id
  if (cardId) {
    // 跳转到卡册列表页，并传递 editId 参数
    this.$router.push({ 
      name: 'CardBookList', 
      query: { editId: cardId } 
    })
  } else {
    this.$message.warning('未找到卡册信息')
  }
    },
    async loadExpressData() { try { const r = await khKuaidiList(); if (r.code === 200 && r.data) this.expressData = (Array.isArray(r.data) ? r.data : []).sort((a, b) => b.sort - a.sort) } catch (e) { } },
    async loadOrderDetail() {
      const id = this.$route.query.id; if (!id) { this.$router.back(); return }
      this.loading = true
      try { const r = await getKhorder({ id }); if (r.code === 200) { this.orderDetail = r.data; this.initExpress() } else this.$message.error(r.msg || '获取失败') }
      catch (e) { this.$message.error('获取失败') } finally { this.loading = false }
    },
    initExpress() {
      const o = this.orderDetail.order
      const arr = [{ kdid: o.kdid || 0, num: (o.num || '').trim() }, { kdid: o.kdid1 || 0, num: (o.num1 || '').trim() }, { kdid: o.kdid2 || 0, num: (o.num2 || '').trim() }, { kdid: o.kdid3 || 0, num: (o.num3 || '').trim() }, { kdid: o.kdid4 || 0, num: (o.num4 || '').trim() }]
      const list = []; arr.forEach(f => { if (f.kdid > 0 || f.num) list.push({ ...f, _tracks: [], _trackLoading: false, _trackShow: true }) })
      if (list.length === 0) list.push({ kdid: 0, num: '', _tracks: [], _trackLoading: false, _trackShow: true })
      this.expressList = list
    },
    getExpressInfo(o) { if (!o.kdid || !o.num) return ''; const e = this.expressData.find(x => x.id == o.kdid); return (e ? e.name : '未知') + ' - ' + (o.num || '').trim() },
    addExpress() { if (this.expressList.length >= 5) { this.$message.warning('最多5个'); return } this.expressList.push({ kdid: 0, num: '', _tracks: [], _trackLoading: false, _trackShow: true }) },
    removeExpress(idx) { this.expressList.splice(idx, 1); if (!this.expressList.length) this.addExpress() },
    async queryTrack(idx) {
      const exp = this.expressList[idx]; if (!exp.kdid || !exp.num) { this.$message.warning('请选择快递公司并填写单号'); return }
      const ei = this.expressData.find(e => e.id == exp.kdid); if (!ei) { this.$message.warning('未找到快递公司'); return }
      exp._trackLoading = true
      try {
        const r = await khKuaidiQuery({ code: ei.code, num: exp.num, phone: this.orderDetail.order.phone || '' })
        if (r.code === 200 && r.data?.msg?.context) { exp._tracks = r.data.msg.context.map(i => ({ time: this.formatTime(i.time), context: i.desc })); exp._trackShow = true }
        else { exp._tracks = []; this.$message.warning('暂无物流信息') }
      } catch (e) { this.$message.error('查询失败') } finally { exp._trackLoading = false }
    },
    getStateText(s) { return { 1: '未发货', 2: '已发货', 3: '已取消' }[s] || '未知' },
    getStateColor(s) { return { 1: '#ff0000', 2: '#409EFF', 3: '#999999' }[s] || '#ff0000' },
    async saveData() {
      const o = this.orderDetail.order; this.saving = true
      try {
        const p = { id: o.id, state: o.state, con: o.con || '' };['', '1', '2', '3', '4'].forEach((s, i) => { p['kdid' + s] = this.expressList[i]?.kdid || 0; p['num' + s] = this.expressList[i]?.num || '' })
        const r = await editKhorderkd(p); if (r.code === 200) this.$message.success(r.msg || '修改成功'); else this.$message.error(r.msg || '保存失败')
      } catch (e) { this.$message.error('保存失败') } finally { this.saving = false }
    },
    goBack() { this.$router.back() },
    formatTime(ts) { if (!ts) return '-'; const d = new Date(ts * 1000), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}` }
  }
}
</script>

<style scoped>
.khorder-detail {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh
}

.mb10 {
  margin-bottom: 10px
}

.mt20 {
  margin-top: 20px
}

.txtcenter {
  text-align: center
}

.info-table {
  font-size: 13px;
  width: 100%;
}

.info-table :deep(td) {
  padding: 8px 12px !important;
  border-color: #ebeef5 !important
}

.info-table :deep(.label-col) {
  background: #ebeef5 !important;
  font-weight: 500;
  color: #222222
}

/* ✅ 链接样式 */
.link-text {text-decoration: none;
  /* color: #409EFF; */
  cursor: pointer;
}

.link-text:hover {

  color: #347bcd;
 text-decoration: none;
}

.track-toggle {
  /* color: #409EFF; */
  cursor: pointer;
  user-select: none
}

/* .track-toggle:hover {
  color: #66b1ff
} */

.track-toggle i {
  font-size: 12px;
  margin-right: 4px
}

.track-row {
  display: flex;
  padding: 2px 0;
  font-size: 12px;
  line-height: 1.6;
  border-bottom: 1px dashed #ebeef5
}

.track-row:last-child {
  border-bottom: none
}

.track-time {
  color: #909399;
  min-width: 140px;
  flex-shrink: 0
}

.track-desc {
  color: #606266;
  flex: 1
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #C0C4CC
}
</style>