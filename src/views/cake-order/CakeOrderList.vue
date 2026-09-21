<template>
  <div class="list-container">
    <template v-if="IsCakeOrderList">
      <!-- 搜索栏 -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="供应商ID" value="gid"></el-option>
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
            <el-select v-model="searchForm.state" placeholder="订单状态" class="w120">
              <el-option label="全部" value=""></el-option>
              <el-option label="待确认" value="0"></el-option>
              <el-option label="未发货" value="1"></el-option>
              <el-option label="已发货" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="已取消" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" class="w140"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" class="w140"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <!-- <el-button @click="resetSearch()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
      <el-card class="search-card">
      <div class="txtleft mb20">
        <el-button type="success" size="small" @click="exportOrder">导出订单</el-button>
      </div>  
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

          <el-table-column label="订单号" align="center" min-width="200">
            <template slot-scope="scope">
             
                <span>{{ scope.row.order_no }}</span>
            
            </template>
          </el-table-column>

          <el-table-column label="商品" align="center" min-width="350">
            <template slot-scope="scope">
              <div class="  al-center" v-if="scope.row.productList && scope.row.productList.length > 0">
                <div v-for="(product, pIdx) in scope.row.productList" :key="pIdx" class="product-item">
                  <div class="dflex al-center" :class="{ 'mt10': pIdx > 0 }">
                    <img v-if="product.image" :src="product.image"
                      style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"
                      @error="handleImageError($event)">
                    <div v-else class="img-placeholder" style="width: 80px; height: 80px;">暂无图片</div>
                    <div class="txtleft ml10">
                      <div class="product-name">{{ product.title }}</div>
                      <span class="blueCl">{{ product.spec }} * {{ product.quantity }}</span>
                      <div>原价：<span class="fs10">￥</span>{{ product.market_price }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>

          <el-table-column label="下单用户" align="center" min-width="80">
            <template slot-scope="scope">
              <a href="javascript:;" @click="viewUser(scope.row.uid)" class="user-link">
                {{ scope.row.uid }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" min-width="110">
            <template slot-scope="scope">
              <span><span class="fs10">￥</span>{{ scope.row.total }}</span>
            </template>
          </el-table-column>

          <el-table-column label="供应商" align="center" min-width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.gid_name">{{ scope.row.gid }}-{{ scope.row.gid_name }}</span>
              <span v-else>{{ scope.row.gid || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" min-width="100">
            <template slot-scope="scope">
              <span :style="{ color: getStateColor(scope.row.state) }">
                {{ getStateText(scope.row.state) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="下单时间" align="center" min-width="160">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" align="center" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
<!-- 用户详情弹窗（纯展示） -->
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
          <img v-if="userDetail.img" :src="userDetail.img" style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
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
import { dingdanList, delDingdan,gysExportOrder  } from '@/api/modules/dgorder'

export default {
  name: 'DingdanList',
  data() {
    return { userDialogVisible: false,
    userDetail: null,
    userLoading: false,
      searchForm: {
        search_key: 'order_no',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        state: '',
        ks_time: '',
        end_time: ''
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      deleteLoading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
     // ============ 导出订单（替换原有方法） ============
    async exportOrder() {
      try {
        await this.$confirm('确认按当前搜索条件导出订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        await this.doExportOrder()
      } catch (e) {
        // 用户取消
      }
    },

    // 实际导出逻辑
    async doExportOrder() {
      // 构建业务参数
      const businessParams = {}

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
      // 订单状态
      if (this.searchForm.state !== '') {
        businessParams.state = this.searchForm.state
      }

      try {
        const loading = this.$loading({
          lock: true,
          text: '正在导出数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 调用导出接口
        const res = await gysExportOrder(businessParams)

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
              if (h === '订单号') return { wch: 28 }
              if (h === '产品') return { wch: 30 }
              if (h === '规格') return { wch: 18 }
              if (h === '下单用户ID') return { wch: 14 }
              if (h === '下单时间') return { wch: 20 }
              if (h === '订单状态') return { wch: 12 }
              if (h === '单价' || h === '小计') return { wch: 12 }
              if (h === '数量') return { wch: 8 }
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

    // ... 其他方法保持不变 ...
   
    // 加载数据
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
        if (this.searchForm.state !== '') {
          params.state = this.searchForm.state
        }
        if (this.searchForm.ks_time) {
          params.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          params.end_time = this.searchForm.end_time
        }

        const res = await dingdanList(params)

        if (res.code === 200) {
          const data = res.data
          // 处理数据，提取商品信息
          this.tableData = (data.data || []).map(item => this.formatOrderData(item))
          this.total = data.total || 0
          this.currentPage = data.current_page || 1
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

    // 格式化订单数据
    formatOrderData(item) {
      const productList = []

      if (item.content && Array.isArray(item.content)) {
        item.content.forEach(contentItem => {
          if (contentItem.product) {
            productList.push({
              image: contentItem.product.image_path,
              title: contentItem.product.title,
              spec: contentItem.xinghao ? contentItem.xinghao.name : '-',
              quantity: contentItem.quantity || 1,
              market_price: contentItem.xinghao ? contentItem.xinghao.market_price : '0.00',
              price: contentItem.xinghao ? contentItem.xinghao.price : '0.00'
            })
          }
        })
      }

      return {
        ...item,
        productList,
        gid_name: item.gid ? this.getSupplierName(item.gid) : ''
      }
    },

    // 获取供应商名称（可以根据实际情况维护一个映射表或调用接口）
    getSupplierName(gid) {
      const supplierMap = {
        '107': '北京一行良品科技有限公司（蛋糕）'
        // 可以继续添加其他供应商
      }
      return supplierMap[gid] || ''
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    // 重置
    resetSearch() {
      this.searchForm = {
        search_key: '',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        state: '',
        ks_time: '',
        end_time: ''
      }
      this.handleSearch()
    },

    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    // 查看详情
    viewDetail(row) {
      this.$router.push({
        name: 'CakeOrderListdetails',
        query: { id: row.id }
      })
    },

    // 删除订单
    async deleteOrder(row) {
      try {
        await this.$confirm('确定删除该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.deleteLoading = true
        const res = await delDingdan({ id: row.id })

        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
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

    // 获取状态文本
    getStateText(state) {
      const stateMap = {
        '0': '待确认',
        '1': '未发货',
        '2': '已发货',
        '3': '已完成',
        '4': '已取消'
      }
      return stateMap[state] || '未知'
    },

    // 获取状态颜色
    getStateColor(state) {
      const colorMap = {
        '0': '#E6A23C',
        '1': '#409EFF',
        '2': '#67C23A',
        '3': '#909399',
        '4': '#F56C6C'
      }
      return colorMap[state] || '#303133'
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
    },

    // 图片加载失败
    handleImageError(event) {
      event.target.style.display = 'none'
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.style.display = 'flex'
      }
    }
  },
  computed: {
    IsCakeOrderList() {
      return this.$route.name === 'list' || this.$route.path === '/cake-order/list'
    }
  },
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

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}
</style>

<style lang="scss" scoped>
.list-container {
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

  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .dflex {
    display: flex;
  }

  .al-center {
    align-items: center;
  }

  .txtleft {
    text-align: left;
  }

  .ml10 {
    margin-left: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .product-item {
    width: 100%;
    display: flex;
  }

  .product-name {
    font-size: 13px;
    color: #303133;
    margin-bottom: 5px;
    max-width: 200px;
  }

  .blueCl {
    color: #409EFF;
    font-size: 12px;
  }

  .money-text {
    color: #F56C6C;
    font-weight: 500;
  }

  .fs10 {
    font-size: 10px;
  }

  .user-link {
    color: #222222;
    text-decoration: none;
    cursor: pointer;

    &:hover {
    cursor: pointer;

      // text-decoration: underline;
    }
  }

  .img-placeholder {
    background: #f5f7fa;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #909399;
  }

  .w120 {
    width: 120px;
  }

  .w140 {
    width: 140px;
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>