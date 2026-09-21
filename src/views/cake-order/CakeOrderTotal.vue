<template>
  <div class="order-list listForm">
    <template v-if="IsCakeOrderTotal">
      <!-- 搜索栏（保持不变） -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="蛋糕订单号" value="content"></el-option>
              <el-option label="蛋糕订单号(第三方)" value="dg_order_no"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="福利卡ID" value="flkid"></el-option>
              <el-option label="福利卡号ID" value="flkhid"></el-option>
              <el-option label="用户手机号" value="uphone"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
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
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" class="w120"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" class="w120"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.flag" placeholder="订单类型" class="w120">
              <el-option label="全部" value=""></el-option>
              <el-option label="实体卡" value="1"></el-option>
              <el-option label="电子券" value="2"></el-option>
              <el-option label="蛋糕" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="resetSearch()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card mt20">
        <!-- 批量操作 -->
        <div class="batch-bar">
          <el-button type="danger" size="small" v-if="selectedIds.length > 0" @click="batchDelete"
            :loading="deleteLoading">
            批量删除 ({{ selectedIds.length }})
          </el-button>
          <el-button type="success" size="small" @click="exportOrder">导出订单</el-button>
        </div>

        <!-- 订单表格 -->
        <div class="table-responsive" v-loading="loading">
          <table class="table table-bordered table-striped with-check" style="margin-top:0px;margin-bottom: 20px;">
            <tbody v-if="orders.length > 0">
              <template v-for="order in orders">
                <!-- 主订单行 -->
                <!-- 主订单行 - 修改 -->
                <tr :key="'main-' + order.id" class="order-main-row">
                  <th width="5%" style="background-color: #a29f9f;">
                    <input type="checkbox" :value="order.id" v-model="selectedIds">
                  </th>
                  <th colspan="2" style="text-align: left; background-color: #a29f9f;font-size: 14px;">
                    订单号：{{ order.order_no }}
                  </th>
                  <th style="text-align: left; background-color: #a29f9f;font-size: 14px;">
                    下单用户：<a href="javascript:;" @click="viewUser(order.uid)">{{ order.uid }}</a>
                  </th>
                  <!-- 电子券显示兑换ID -->
                  <th v-if="order.flag == 2 && order.ka_ids"
                    style="text-align: left; background-color: #a29f9f;font-size: 14px;">
                    兑换ID: {{ order.ka_ids }}
                  </th>
                  <!-- 蛋糕订单显示价格 -->
                  <th v-else-if="order.flag != 2" :width="order.zongji ? '10%' : 'auto'"
                    style="background-color: #a29f9f;">
                    <span v-if="order.zongji"><span class="fs10">￥</span>{{ order.zongji }}</span>
                  </th>
                  <th width="20%" style="background-color: #a29f9f;">
                    <span>
                      <el-button size="mini" @click="viewOrder(order)" type="primary">查看</el-button>
                      <el-button size="mini" @click="deleteOrder(order.id)" type="danger"
                        :loading="deleteLoading">删除</el-button>
                    </span>
                  </th>
                </tr>

                <!-- 子订单信息行（蛋糕订单） -->


                <!-- 电子券商品明细行 -->
                <tr v-if="order.flag == 2" :key="'product-' + order.id">
                  <td width="5%">{{ order.id }}</td>
                  <td width="10%">
                    <img v-if="order.coupons && order.coupons.img" :src="order.coupons.img" width="50"
                      class="product-img">
                    <div v-else class="img-placeholder">暂无图片</div>
                  </td>
                  <td width="20%" style="text-align: left;">
                    {{ order.coupons ? order.coupons.title : (order.content || '电子券') }}
                  </td>
                  <td width="20%">电子券 * {{ order.num }}</td>
                  <td width="10%">
                    <span class="fs10">￥</span>{{ order.coupons ? order.coupons.price : order.zongji }}
                  </td>
                  <td width="15%">{{ formatTime(order.add_time) }}</td>
                </tr>

                <!-- 蛋糕订单商品明细行 -->
                <!-- 蛋糕订单 - 循环多个子订单 -->
                <template v-if="order.flag == 3 && order.orderinfo && order.orderinfo.length > 0">
                  <template v-for="(info, iIdx) in order.orderinfo">
                    <tr :key="'sub-' + order.id + '-' + iIdx" class="order-sub-row">
                      <th width="5%">&nbsp;&nbsp;</th>
                      <th colspan="2" style="text-align: left;font-size: 12px;">
                        订单号：{{ info.order_no }}
                      </th>
                      <th colspan="3" style="text-align: left;font-size: 12px;"" >
                  <span v-if="info.dg_order_no"> 蛋糕订单号：{{ info.dg_order_no }}</span>
                        <span v-if="info.gid"> 供应商{{ info.gid }} {{ getSupplierName(info) }}</span>

                      </th>
                    </tr>
                    <tr :key="'prod-' + order.id + '-' + iIdx">
                      <td width="5%">{{ order.id }}</td>
                      <td width="10%">
                        <img v-if="getInfoImage(info)" :src="getInfoImage(info)" width="50" class="product-img">
                        <div v-else class="img-placeholder">暂无图片</div>
                      </td>
                      <td width="20%" style="text-align: left;">{{ getInfoName(info, order) }}</td>
                      <td width="20%">{{ getInfoSpec(info) }}</td>
                      <td width="10%"><span class="fs10">￥</span>{{ getInfoPrice(info, order) }}</td>
                      <td width="15%">{{ formatTime(info.add_time) }}</td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" style="text-align: center; padding: 50px;">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
      <!--  -->
      <!-- ==================== 用户详情弹窗 ==================== -->
      <!-- 用户详情弹窗（单列展示） -->
      <!-- 用户详情弹窗（纯展示，不可编辑） -->
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
                <img v-if="userDetail.img" :src="userDetail.img" class="avatar-preview"
                  style="width: 80px;height: 80px;" />
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
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 0 }} 页</div>
      </div>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { orderList, delOrder, exportOrder } from '@/api/modules/dgorder'
import { showSupplier } from '@/api/modules/login'  // 根据实际路径调整
import { getRegister } from '@/api/modules/zhichong'
export default {
  data() {
    return {
      userDialogVisible: false,   // 弹窗显示/隐藏
      userDetail: null,            // 用户详情数据
      userLoading: false,          // 弹窗加载状态
      defaultUserImg: require('../../assets/111.png'),  // 默认头像
      supplierMap: {},  // 加这行
      searchForm: {

        search_key: 'order_no',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        flag: ''
      },
      orders: [],
      selectedIds: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      loading: false,
      deleteLoading: false
    }
  },
  mounted() {
    this.loadData()
    this.loadSupplierList()  // ← 加这行
  },
  methods: {
    async exportOrder() {
      // 如果有选中的订单，询问是否按选中导出
      if (this.selectedIds.length > 0) {
        try {
          await this.$confirm(
            `您已选中 ${this.selectedIds.length} 条订单，是否按选中ID导出？<br/>`,
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
          await this.doExportOrder({
            ids: this.selectedIds.join(',')
          })
        } catch (action) {
          if (action === 'cancel') {
            // 按搜索条件导出
            await this.doExportOrder()
          }
        }
      } else {
        // 没有选中，按搜索条件导出
        try {
          await this.$confirm('确认按当前搜索条件导出全部订单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
          await this.doExportOrder()
        } catch (e) {
          // 用户取消
        }
      }
    },

    // 实际导出逻辑
    // 实际导出逻辑
async doExportOrder(extraParams = {}) {
  // ✅ 所有参数都写，没有选择就传空字符串
  const businessParams = {
    ...extraParams,
    search_key: this.searchForm.search_key || '',
    search_val: this.searchForm.search_val || '',
    px_key: this.searchForm.px_key || '',
    px_val: this.searchForm.px_val || '',
    ks_time: this.searchForm.ks_time || '',
    end_time: this.searchForm.end_time || '',
    flag: this.searchForm.flag || '',
    page: '1',
    limit: '600'
  }

  let loading = null
  try {
    loading = this.$loading({
      lock: true,
      text: '正在导出数据...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const res = await exportOrder(businessParams)
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
      if (typeof XLSX === 'undefined') {
        this.exportAsHtml(header, data, filename)
        return
      }

      try {
        const excelData = [header, ...data]
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(excelData)

        const colWidths = header.map((h) => {
          if (h === '订单号') return { wch: 26 }
          if (h === '蛋糕订单号') return { wch: 26 }
          if (h === '下单用户ID') return { wch: 14 }
          if (h === '下单时间') return { wch: 20 }
          if (h === '产品') return { wch: 25 }
          if (h === '规格') return { wch: 12 }
          if (h === '数量') return { wch: 8 }
          if (h === '单价') return { wch: 10 }
          if (h === '小计') return { wch: 10 }
          if (h === '订单状态') return { wch: 12 }
          if (h === '结算价格') return { wch: 12 }
          return { wch: 12 }
        })
        ws['!cols'] = colWidths

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
    if (loading) loading.close()
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
    getInfoImage(info) {
      try {
        const list = info.orderinfo_list
        if (list && list[0] && list[0].product && list[0].product[0]) {
          return list[0].product[0].image_path || ''
        }
        const ct = typeof info.content === 'string' ? JSON.parse(info.content) : info.content
        if (Array.isArray(ct) && ct[0] && ct[0].product) {
          return ct[0].product.image_path || ''
        }
      } catch (e) { }
      return ''
    },
    getInfoName(info, order) {
      try {
        const list = info.orderinfo_list
        if (list && list[0] && list[0].product && list[0].product[0]) {
          return list[0].product[0].product_name
        }
        const ct = typeof info.content === 'string' ? JSON.parse(info.content) : info.content
        if (Array.isArray(ct) && ct[0] && ct[0].product) {
          return ct[0].product.title
        }
      } catch (e) { }
      return (order && order.content) || '蛋糕订单'
    },
    getInfoSpec(info) {
      try {
        const list = info.orderinfo_list
        if (list && list[0] && list[0].product && list[0].product[0]) {
          const p = list[0].product[0]
          return `${p.spec_name} * ${p.quantity || 1}`
        }
        const ct = typeof info.content === 'string' ? JSON.parse(info.content) : info.content
        if (Array.isArray(ct) && ct[0] && ct[0].xinghao) {
          return `${ct[0].xinghao.name} * ${ct[0].quantity || 1}`
        }
      } catch (e) { }
      return '-'
    },
    getInfoPrice(info, order) {
      try {
        const list = info.orderinfo_list
        if (list && list[0]) {
          if (list[0].product && list[0].product[0]) return list[0].product[0].price
          return list[0].final_amount || '0.00'
        }
        const ct = typeof info.content === 'string' ? JSON.parse(info.content) : info.content
        if (Array.isArray(ct) && ct[0] && ct[0].xinghao) {
          return ct[0].xinghao.price || '0.00'
        }
      } catch (e) { }
      return (order && order.zongji) || '0.00'
    },
    // 加载订单数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }
        if (this.searchForm.px_key) {
          params.px_key = this.searchForm.px_key
          params.px_val = this.searchForm.px_val
        }
        if (this.searchForm.ks_time) {
          params.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          params.end_time = this.searchForm.end_time
        }
        if (this.searchForm.flag) {
          params.flag = this.searchForm.flag
        }

        const res = await orderList(params)
        if (res.code === 200) {
          this.orders = res.data.data || []
          this.total = res.data.total || 0
          this.currentPage = res.data.current_page || 1
        } else {
          this.$message.error(res.msg || '获取订单列表失败')
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取订单列表失败')
      } finally {
        this.loading = false
      }
    },

    // 获取订单类型文本
    getOrderTypeText(flag) {
      const typeMap = {
        '1': '实体卡订单',
        '2': '电子券订单',
        '3': '蛋糕订单'
      }
      return typeMap[flag] || '未知类型'
    },

    // 获取蛋糕产品名称
    getCakeProductName(order) {
      try {
        if (order.orderinfo && order.orderinfo[0]) {
          const orderinfo = order.orderinfo[0]
          // 尝试从本地产品信息获取
          if (orderinfo.content) {
            let contentData = orderinfo.content
            // 如果是字符串，尝试解析
            if (typeof contentData === 'string') {
              try {
                contentData = JSON.parse(contentData)
              } catch (e) {
                // 如果不是JSON，检查是否是数组字符串
                if (contentData.startsWith('[')) {
                  try {
                    contentData = JSON.parse(contentData)
                  } catch (e2) {
                    return order.content || '蛋糕订单'
                  }
                }
              }
            }

            // 如果是数组，取第一个元素
            if (Array.isArray(contentData) && contentData.length > 0) {
              const item = contentData[0]
              if (item.product && item.product.title) {
                return item.product.title
              }
            }
          }

          // 尝试从蛋糕叔叔订单信息获取
          if (orderinfo.orderinfo_list && orderinfo.orderinfo_list[0] && orderinfo.orderinfo_list[0].product) {
            const products = orderinfo.orderinfo_list[0].product
            if (products && products[0]) {
              return products[0].product_name
            }
          }
        }
      } catch (e) {
        console.error('解析产品名称失败:', e)
      }
      return order.content || '蛋糕订单'
    },

    // 获取蛋糕产品规格
    getCakeProductSpec(order) {
      try {
        if (order.orderinfo && order.orderinfo[0]) {
          const orderinfo = order.orderinfo[0]
          if (orderinfo.content) {
            let contentData = orderinfo.content
            if (typeof contentData === 'string') {
              try {
                contentData = JSON.parse(contentData)
              } catch (e) {
                if (contentData.startsWith('[')) {
                  try {
                    contentData = JSON.parse(contentData)
                  } catch (e2) {
                    return '-'
                  }
                }
              }
            }

            if (Array.isArray(contentData) && contentData.length > 0) {
              const item = contentData[0]
              if (item.xinghao && item.xinghao.name) {
                return `${item.xinghao.name} * ${item.quantity || 1}`
              }
            }
          }

          // 从蛋糕叔叔订单信息获取规格
          if (orderinfo.orderinfo_list && orderinfo.orderinfo_list[0] && orderinfo.orderinfo_list[0].product) {
            const products = orderinfo.orderinfo_list[0].product
            if (products && products[0]) {
              return `${products[0].spec_name} * ${products[0].quantity || 1}`
            }
          }
        }
      } catch (e) {
        console.error('解析产品规格失败:', e)
      }
      return '-'
    },

    // 获取蛋糕产品图片
    getCakeProductImage(order) {
      try {
        if (order.orderinfo && order.orderinfo[0]) {
          const orderinfo = order.orderinfo[0]
          if (orderinfo.content) {
            let contentData = orderinfo.content
            if (typeof contentData === 'string') {
              try {
                contentData = JSON.parse(contentData)
              } catch (e) {
                if (contentData.startsWith('[')) {
                  try {
                    contentData = JSON.parse(contentData)
                  } catch (e2) {
                    return null
                  }
                }
              }
            }

            if (Array.isArray(contentData) && contentData.length > 0) {
              const item = contentData[0]
              if (item.product && item.product.image_path) {
                return item.product.image_path
              }
            }
          }

          // 从蛋糕叔叔订单信息获取图片
          if (orderinfo.orderinfo_list && orderinfo.orderinfo_list[0] && orderinfo.orderinfo_list[0].product) {
            const products = orderinfo.orderinfo_list[0].product
            if (products && products[0] && products[0].image_path) {
              return products[0].image_path
            }
          }
        }
      } catch (e) {
        console.error('解析产品图片失败:', e)
      }
      return null
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.selectedIds = []
      this.loadData()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        search_key: '',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        flag: ''
      }
      this.handleSearch()
    },

    // 批量删除
    async batchDelete() {
      if (this.selectedIds.length === 0) return
      try {
        await this.$confirm(`确定删除选中的 ${this.selectedIds.length} 个订单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.deleteLoading = true
        const ids = this.selectedIds.join(',')
        const res = await delOrder({ ids })
        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
          this.selectedIds = []
          this.loadData()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除失败:', error)
          this.$message.error('删除失败')
        }
      } finally {
        this.deleteLoading = false
      }
    },

    // 单个删除
    async deleteOrder(id) {
      try {
        await this.$confirm('确定删除该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.deleteLoading = true
        const res = await delOrder({ ids: id })
        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
          this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id)
          this.loadData()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除订单失败:', error)
          this.$message.error('删除失败')
        }
      } finally {
        this.deleteLoading = false
      }
    },

    // 查看订单
    viewOrder(order) {
      this.$router.push({
        name: 'CakeOrderTotaldetails',
        query: { id: order.id }
      })
    },

    // 查看用户
    async viewUser(uid) {
      this.userDialogVisible = true
      this.userDetail = null
      this.userLoading = true
      try {
        const res = await getRegister({ id: uid })  // 直接用顶部导入的
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

    // ✅ 新增
    handleUserImgError(e) {
      e.target.src = this.defaultUserImg
    },


    // 分页切换
    handlePageChange(page) {
      this.currentPage = page
      this.selectedIds = []
      this.loadData()
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }, computed: {
    IsCakeOrderTotal() {
      return this.$route.name === 'total' || this.$route.path === '/cake-order/total'
    }
  },
}
</script>

<style>
.listForm .el-card__body,
.el-main {
  padding: 20px 20px 0 20px !important;
}
</style>

<style scoped>
.order-list {
  font-size: 14px;
}

.batch-bar {
  text-align: left;
  margin-bottom: 20px;
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

.with-check th,
.with-check td {
  border: 1px solid #EBEEF5;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.img-placeholder {
  width: 50px;
  height: 50px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

.order-main-row th {
  background-color: #e2e5e9 !important;
  color: #606266;
  font-weight: 600;
}

.order-main-row a {
  color: #606266;
  text-decoration: none;
}

.order-sub-row {
  background-color: #fafafa;
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

.mt20 {
  margin-top: 20px;
}

.fs10 {
  font-size: 12px;
}

/* ========== 用户详情弹窗样式（与用户管理页一致） ========== */
</style>