<template>
  <div class="order-list-total">
    <template v-if="IsMallOrderTotal">
      <!-- 搜索栏 -->
      <el-card class="search-card serchForm formb0 mallrrdertotal">
        <el-form :inline="true" :model="searchForm" class="search-form txtleft">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w140">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="商城订单号" value="order_no_zi"></el-option>
              <el-option label="商城订单号(第三方)" value="order_key"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="福利卡ID" value="flkid"></el-option>
              <el-option label="福利卡号ID" value="flkhid"></el-option>
              <el-option label="用户手机号" value="uphone"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w140"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w140">
              <el-option label="下单时间" value="add_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width: 160px;">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width: 160px;">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="订单类型" class="w140" clearable>
              <el-option label="蛋糕订单" value="1"></el-option>
              <el-option label="兑换订单" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card class="search-card mt20">
        <div class="txtleft ">

          <el-button type="danger" size="small" @click="batchDelete" v-if="selectedIds.length > 0">批量删除 ({{
            selectedIds.length }})</el-button>
          <el-button type="success" size="small" @click="exportAll">全部导出</el-button>
          <el-button type="warning" size="small" @click="exportYzh">导出云中鹤订单</el-button>
          <el-button type="primary" size="small" @click="batchUpdate" v-if="selectedIds.length > 0">批量更新</el-button>
        </div>

        <div class="table-responsive" v-loading="loading">
          <table class="table table-bordered table-striped with-check" style="margin-top:20px;">
            <thead>
              <tr style="height: 50px;">
                <th width="5%" style="background-color: #e3e7ef; text-align: center;">
                  <input type="checkbox" :checked="isAllSelected" @change="handleSelectAll">
                </th>
                <th colspan="2" style="background-color: #e3e7ef; text-align: left;">订单信息</th>
                <th width="20%" style="background-color: #e3e7ef; text-align: left;">用户</th>
                <th width="10%" style="background-color: #e3e7ef; text-align: center;">金额</th>
                <th width="20%" style="background-color: #e3e7ef; text-align: center;">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="order in orders">
                <!-- 主订单行 -->
                <tr :key="'main-' + order.id">
                  <th width="5%" style="background-color: #eff2f7;">
                    <input type="checkbox" :value="order.id" v-model="selectedIds">
                  </th>
                  <th colspan="2" style="text-align: left; background-color: #eff2f7;">
                    订单号：{{ order.order_no }}
                  </th>
                  <th width="20%" style="text-align: left; background-color: #eff2f7;">
                    下单用户：<a href="javascript:;" style="text-decoration: none;color: #222222;"
                      @click="viewUser(order.uid)">{{ order.uid }}</a>
                    <span v-if="order.lm_flag == 2" class="fs12 blueCl"> - 兑换订单</span>
                    <span v-if="order.dd_flag == 2" class="fs12 blueCl"> - 蛋糕订单</span>
                  </th>
                  <th width="10%" style="background-color: #eff2f7;"><span class="fs10">￥</span>{{ order.zongji }}</th>
                  <th width="20%" style="background-color: #eff2f7;">
                    <span>
                      <!-- <a href="javascript:;"  class="btn btn-info"></a>
                      <a href="javascript:;" class="btn btn-danger">删除</a> -->

                      <el-button size="mini" type="primary" @click="viewOrder(order)">查看</el-button>
                      <el-button size="mini" type="danger" @click="deleteOrder(order.id)">删除</el-button>

                    </span>
                  </th>
                </tr>

                <!-- 子订单 -->
                <template v-if="order.order_list && order.order_list.length">
                  <template v-for="(subOrder, subIdx) in order.order_list">

                    <!-- child_flag == 0 普通子订单 -->
                    <template v-if="subOrder.child_flag == 0">
                      <tr :key="'sub-' + order.id + '-' + subIdx">
                        <th width="5%">&nbsp;&nbsp;</th>
                        <th colspan="2" style="text-align: left;font-size: 12px;">
                          订单号：{{ subOrder.order_no }}
                        </th>
                        <th style="text-align: left;font-size: 12px;">
                          供应商：{{ getSupplierName(subOrder.gid) }}
                        </th>
                        <th style="text-align: left;font-size: 12px;">
                          <span :style="{ color: getStatusColor(subOrder.state) }">
                            {{ getStatusText(subOrder.state) }}
                          </span>
                          <!--  -->



                          <!--  -->
                        </th>
                        <th style="text-align: center;">
                          
                            <el-button v-if="subOrder.flag == 0" size="mini" type="success"
                              @click="updateOrder(order.id)">更新</el-button>
                            <el-button v-if="subOrder.flag == 0 && !subOrder.order_key" size="mini" type="warning"
                              :loading="subOrder._pushing" @click="pushOrder(order.id, subIdx)">推送</el-button>
                          
                        </th>

                      </tr>
                      <tr v-for="(product, pIdx) in subOrder.product"
                        :key="'product-' + order.id + '-' + subIdx + '-' + pIdx">
                        <td width="5%">{{ order.id }}</td>
                        <td width="10%">
                          <img v-if="product.product && product.product.thumbnailimage"
                            :src="product.product.thumbnailimage" class="imglist" @error="handleImgError">
                          <div v-else class="img-placeholder">暂无图片</div>
                        </td>
                        <td width="20%" style="text-align: left;font-size: 12px;">{{ getProductName(product) }}</td>
                        <td width="20%" class="fs12">{{ getProductSpec(product) }} *{{ product.quantity }}</td>
                        <td width="10%" class="fs12"><span class="fs10">￥</span>{{ getProductPrice(product) }}</td>
                        <td width="15%" class="fs12">{{ formatTime(subOrder.add_time) }}</td>
                      </tr>
                    </template>

                    <!-- child_flag == 1 云中鹤子订单 -->
                    <!-- child_flag == 1 云中鹤子订单 -->
                    <template v-if="subOrder.child_flag == 1">
                      <!-- 子订单 -->
                      <tr :key="'yz-sub1-' + order.id + '-' + subIdx">
                        <th width="5%">&nbsp;&nbsp;</th>
                        <th colspan="2" style="text-align: left;font-size: 12px;">
                          订单号：{{ subOrder.order_no }}
                        </th>
                        <th colspan="2" style="text-align: left;font-size: 12px;">
                          商城订单号：{{ subOrder.order_key || '-' }}
                        </th>
                        <th>

                         <el-button v-if="subOrder.flag == 0" size="mini" type="success"
                              @click="updateOrder(order.id)">更新</el-button>
                            <el-button v-if="subOrder.flag == 0 && !subOrder.order_key" size="mini" type="warning"
                              :loading="subOrder._pushing" @click="pushOrder(order.id, subIdx)">推送</el-button>


                        </th>
                      </tr>

                      <!-- 遍历每个云中鹤 child 子订单 -->
                      <template v-for="(child, childIdx) in subOrder.child">
                        <!-- 子订单信息行 -->
                        <tr :key="'yz-child-info-' + order.id + '-' + subIdx + '-' + childIdx">
                          <th width="5%">&nbsp;&nbsp;</th>
                          <th colspan="2" style="text-align: left;font-size: 12px;">
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

                        <!-- 该子订单的产品列表 -->
                        <tr v-for="(product, pIdx) in child.product"
                          :key="'yz-product-' + order.id + '-' + subIdx + '-' + childIdx + '-' + pIdx">
                          <td width="5%">{{ order.id }}</td>
                          <td width="10%">
                            <img v-if="product.product && product.product.thumbnailimage"
                              :src="product.product.thumbnailimage" class="imglist" @error="handleImgError">
                            <div v-else class="img-placeholder">暂无图片</div>
                          </td>
                          <td width="20%" style="text-align: left;font-size: 12px;">
                            {{ getProductName(product) }}
                          </td>
                          <td width="20%" class="fs12">
                            {{ getProductSpec(product) }} *{{ product.quantity }}
                          </td>
                          <td width="10%" class="fs12">
                            <span class="fs10">￥</span>{{ getProductPrice(product) }}
                          </td>
                          <td width="15%" class="fs12">
                            {{ formatTime(subOrder.add_time) }}
                          </td>
                        </tr>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="orders.length === 0 && !loading" class="empty-state">
          <p style="color: #909399; padding: 60px 0; text-align: center;">暂无订单数据</p>
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
      <!-- 分页 -->
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
import { scorderList, delScorder, gxOneScorder, gxAllScorder, exportScorderall, exportYzhorder, subScorder } from '@/api/modules/sorder'
import { showSupplier } from '@/api/modules/login'  // 导入供应商接口


import * as XLSX from 'xlsx'


export default {
  data() {
    return {
      userDialogVisible: false,
      userDetail: null,
      userLoading: false,
      searchForm: {
        search_key: 'order_no', search_val: '', px_key: 'add_time', px_val: 'desc',
        ks_time: '', end_time: '', type: ''
      },
      orders: [],
      selectedIds: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      supplierMap: {}  // 供应商映射 { id: username }
    }
  },
  async mounted() {
    await this.loadSuppliers()  // 先加载供应商列表
    this.loadData()              // 再加载订单列表
  },
  methods: {
    // 在 methods 中添加以下方法，替换原有的 exportAll 和 exportYzh 方法

    async exportAll() {
      // 如果有选中的订单，询问是否按选中导出
      if (this.selectedIds.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.selectedIds.length} 条订单，是否按选中ID导出？`,
            '导出确认',
            {
              confirmButtonText: '按选中导出',
              cancelButtonText: '按搜索条件',
              type: 'info',
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true
            }
          )
          // 按选中ID导出
          await this.doExport(exportScorderall, {
            ids: this.selectedIds.join(',')
          })
        } catch (action) {
          if (action === 'cancel') {
            // 按搜索条件导出
            await this.doExport(exportScorderall)
          }
        }
      } else {
        // 没有选中，按搜索条件导出
        this.$confirm('确认按当前搜索条件导出全部订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(async () => {
          await this.doExport(exportScorderall)
        }).catch(() => { })
      }
    },

    async exportYzh() {
      // 如果有选中的订单，询问是否按选中导出
      if (this.selectedIds.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.selectedIds.length} 条订单，是否按选中ID导出云中鹤订单？`,
            '导出确认',
            {
              confirmButtonText: '按选中导出',
              cancelButtonText: '按搜索条件',
              type: 'info',
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true
            }
          )
          // 按选中ID导出
          await this.doExport(exportYzhorder, {
            ids: this.selectedIds.join(',')
          })
        } catch (action) {
          if (action === 'cancel') {
            // 按搜索条件导出
            await this.doExport(exportYzhorder)
          }
        }
      } else {
        // 没有选中，按搜索条件导出
        this.$confirm('确认按当前搜索条件导出云中鹤订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(async () => {
          await this.doExport(exportYzhorder)
        }).catch(() => { })
      }
    },

    // 实际导出逻辑
    async doExport(exportApi, extraParams = {}) {
      // 构建业务参数
      const businessParams = {
        ...extraParams
      }

      // 如果没有传 ids，则使用搜索条件
      if (!businessParams.ids) {
        // 搜索字段
        if (this.searchForm.search_key) {
          businessParams.search_key = this.searchForm.search_key
        }
        if (this.searchForm.search_val) {
          businessParams.search_val = this.searchForm.search_val
        }
        // 排序字段
        if (this.searchForm.px_key) {
          businessParams.px_key = this.searchForm.px_key
        }
        if (this.searchForm.px_val) {
          businessParams.px_val = this.searchForm.px_val
        }
        // 时间范围
        if (this.searchForm.ks_time) {
          businessParams.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          businessParams.end_time = this.searchForm.end_time
        }
        // 订单类型
        if (this.searchForm.type) {
          businessParams.type = this.searchForm.type
        }
      }

      try {
        const loading = this.$loading({
          lock: true,
          text: '正在导出数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 调用导出接口
        const res = await exportApi(businessParams)

        loading.close()

        if (res.code === 200 && res.data) {
          const { header, data, filename } = res.data

          if (!header || header.length === 0) {
            this.$message.error('导出数据表头为空')
            return
          }

          if (!data || data.length === 0) {
            this.$message.warning('没有数据可导出')
            return
          }

          // 检查 XLSX 是否可用
          if (typeof XLSX === 'undefined') {
            this.exportAsHtml(header, data, filename)
            return
          }

          // 使用 XLSX 导出
          try {
            const excelData = [header, ...data]
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet(excelData)

            // 设置列宽
            ws['!cols'] = header.map((h) => {
              if (h === '订单号' || h === '商城订单号' || h === '兑换订单号') return { wch: 32 }
              if (h === '产品') return { wch: 40 }
              if (h === '规格') return { wch: 20 }
              if (h === '下单用户ID') return { wch: 12 }
              if (h === '状态') return { wch: 12 }
              return { wch: 12 }
            })

            XLSX.utils.book_append_sheet(wb, ws, '订单列表')
            XLSX.writeFile(wb, filename || 'export.xlsx')
            this.$message.success('导出成功')
          } catch (xlsxError) {
            console.error('XLSX导出失败，降级为HTML导出:', xlsxError)
            this.exportAsHtml(header, data, filename)
          }
        } else {
          this.$message.error(res.msg || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败：' + (error.message || '请稍后重试'))
      }
    },

    // HTML 方式导出（备用方案）
    exportAsHtml(header, data, filename) {
      let html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8">
    <style>
      table { border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
      th { background-color: #4472C4; color: #ffffff; font-weight: bold; padding: 6px 10px; border: 1px solid #999; text-align: center; }
      td { padding: 4px 10px; border: 1px solid #999; }
      tr:nth-child(even) { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    <table>
      <thead><tr>
  `

      header.forEach(h => {
        html += `<th>${this.escapeHtml(String(h))}</th>`
      })

      html += `</tr></thead><tbody>`

      data.forEach(row => {
        html += '<tr>'
        row.forEach(cell => {
          const val = cell !== null && cell !== undefined ? String(cell) : ''
          html += `<td>${this.escapeHtml(val)}</td>`
        })
        html += '</tr>'
      })

      html += `</tbody></table></body></html>`

      const blob = new Blob(['\uFEFF' + html], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename ? filename.replace(/\.xlsx$/i, '.xls') : 'export.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      this.$message.success('导出成功（HTML格式）')
    },

    // HTML 转义
    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }
      return text.replace(/[&<>"']/g, function (m) { return map[m] })
    },
    async pushOrder(orderId, subIdx) {
      try {
        // 给对应子订单添加 loading 状态
        const order = this.orders.find(o => o.id === orderId)
        if (!order) return

        const subOrder = order.order_list[subIdx]
        if (!subOrder) return

        // 使用 Vue.set 或 $set 确保响应式
        this.$set(subOrder, '_pushing', true)

        const res = await subScorder({ id: orderId.toString() })
        if (res.code === 200) {
          this.$message.success(res.msg || '重推成功')
          this.loadData() // 刷新列表
        } else {
          this.$message.error(res.msg || '重推失败')
        }
      } catch (error) {
        this.$message.error('重推失败')
      } finally {
        // 重置 loading 状态
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          const subOrder = order.order_list[subIdx]
          if (subOrder) {
            this.$set(subOrder, '_pushing', false)
          }
        }
      }
    },
    // 获取云中鹤订单状态文本
    getYzhStatusText(status) {
      if (!status) return '未知'
      const map = {
        'waiting_audit': '等待审核',
        'waiting_shipment': '待发货',
        'waiting_confirmed': '待收货',
        'completed': '已完成',
        'canceld': '订单作废',

      }

      return map[status] || status
    },
    // "status": "waiting_audit", //订单状态  waiting_audit-等待审核，waiting_shipment-等待发货，waiting_confirmed-等待确认收货，
    // completed-订单已完成canceld-订单作废
    // 获取云中鹤订单状态颜色
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
    handleSelectAll(e) {
      if (e.target.checked) {
        this.selectedIds = this.orders.map(order => order.id)
      } else {
        this.selectedIds = []
      }
    },
    // 加载供应商列表
    async loadSuppliers() {
      try {
        const res = await showSupplier()
        if (res.code === 200 && res.data && res.data.list) {
          // 构建供应商映射表 { id: username }
          this.supplierMap = {}
          res.data.list.forEach(item => {
            this.supplierMap[item.id] = item.username
          })
        }
      } catch (error) {
        console.error('加载供应商列表失败：', error)
      }
    },

    async loadData() {
      this.loading = true
      try {
        const res = await scorderList({
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          ks_time: this.searchForm.ks_time,
          end_time: this.searchForm.end_time,
          type: this.searchForm.type,
          page: this.currentPage,
          limit: this.pageSize
        })
        if (res.code === 200) {
          this.orders = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      } catch (error) {
        this.$message.error('获取失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() { this.currentPage = 1; this.selectedIds = []; this.loadData() },
    viewOrder(order) { this.$router.push({ name: 'MallOrderTotaldetails', query: { id: order.id } }) },
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
    // 根据 gid 动态获取供应商名称（格式：ID-名称）
    getSupplierName(gid) {
      if (!gid || gid == 0) return '-'
      const name = this.supplierMap[gid]
      if (name) {
        return gid + '-' + name
      }
      return gid + '-未知供应商'
    },

    getChildProducts(subOrder) {
      if (subOrder.child && subOrder.child.length > 0 && subOrder.child[0].product) {
        return subOrder.child[0].product
      }
      if (subOrder.product && subOrder.product.length > 0) {
        return subOrder.product
      }
      return []
    },

    getChildSubOrderNo(subOrder) {
      if (subOrder.child && subOrder.child.length > 0) {
        return subOrder.child[0].key || subOrder.order_no
      }
      return subOrder.order_no
    },

    getProductName(product) {
      return product.product ? product.product.name : '-'
    },

    getProductSpec(product) {
      if (product.xinghao && product.xinghao.xinghao) return product.xinghao.xinghao
      if (product.product && product.product.name) return product.product.name
      return ''
    },

    getProductPrice(product) {
      return product.xinghao ? product.xinghao.price : '0.00'
    },

    async updateOrder(id) {
      try {
        const res = await gxOneScorder({ id: id.toString() })
        if (res.code === 200) {
          this.$message.success(res.msg || '更新成功'); this.loadData()
        } else {
          this.$message.error(res.msg || '更新失败')
        }
      } catch (error) { this.$message.error('更新失败') }
    },

    deleteOrder(id) {
      this.$confirm('您确定要将它删除吗', '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delScorder({ ids: id })
          if (res.code === 200) { this.$message.success('删除成功'); this.loadData() }
          else { this.$message.error(res.msg || '删除失败') }
        } catch (error) { this.$message.error('删除失败') }
      }).catch(() => { })
    },

    batchDelete() {
      if (!this.selectedIds.length) return this.$message.warning('请选择订单')
      this.$confirm(`确定删除 ${this.selectedIds.length} 个订单吗？`, '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delScorder({ ids: this.selectedIds.join(',') })
          if (res.code === 200) { this.$message.success('删除成功'); this.selectedIds = []; this.loadData() }
          else { this.$message.error(res.msg || '删除失败') }
        } catch (error) { this.$message.error('删除失败') }
      }).catch(() => { })
    },

    async batchUpdate() {
      this.$confirm('确定更新所有订单吗？', '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await gxAllScorder()
          if (res.code === 200) { this.$message.success('更新成功'); this.loadData() }
          else { this.$message.error(res.msg || '更新失败') }
        } catch (error) { this.$message.error('更新失败') }
      }).catch(() => { })
    },





    getStatusText(state) {
      // const map = { 0: '待发货', 1: '已发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '退货中', 6: '已退货' }
      const map = { 0: '待发货', 1: '待收货', 2: '已完成', 3: '已取消', }

      return map[state] || '未知'
    },

    getStatusColor(state) {
      const map = { 0: '#ff0000', 1: '#409EFF', 2: '#ff0000', 3: '#ff0000', 4: '#999999', 5: '#ff0000', 6: '#999999' }
      return map[state] || '#ff0000'
    },

    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    },

    handleImgError(e) {
      e.target.style.display = 'none'
      const div = document.createElement('div')
      div.className = 'img-placeholder'; div.textContent = '暂无图片'
      e.target.parentNode.appendChild(div)
    },

    handlePageChange(page) {
      this.currentPage = page; this.selectedIds = []; this.loadData()
    }
  }, computed: {
    IsMallOrderTotal() {
      return this.$route.name === 'MallOrderTotal' || this.$route.path === '/mall-order/total'
    },
    isAllSelected() {
      if (this.orders.length === 0) return false
      return this.selectedIds.length === this.orders.length
    },
    isIndeterminate() {
      return this.selectedIds.length > 0 && this.selectedIds.length < this.orders.length
    }
  }
}
</script>
<style>
.order-list-total .mallrrdertotal {
  .el-card__body {
    padding: 20px 20px 20px 20px;
  }
}
</style>
<style scoped>
.order-list-total {
  font-size: 14px;
}


.search-card {
  margin-bottom: 20px;
}

.batch-bar {
  text-align: left;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fdf6ec;
  border-radius: 4px;
  border: 1px solid #faecd8;
}

.table-responsive {
  overflow-x: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 10px;
  vertical-align: middle;
  border: 1px solid #EBEEF5;
}

.table th {
  font-weight: 500;
}

.imglist {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.img-placeholder {
  width: 100px;
  height: 100px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

.btn {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}

.btn-info {
  background-color: #17a2b8;
  border: 1px solid #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  border: 1px solid #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.empty-state {
  text-align: center;
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

.page-info {
  font-size: 13px;
  color: #606266;
}

.w120 {
  width: 120px;
}

.w140 {
  width: 140px;
}

.mt20 {
  margin-top: 20px;
}

.fs10 {
  font-size: 10px;
}
</style>