<template>
  <div class="list-container-mealorder titles">
    <template v-if="isMealOrderList">
      <el-card class="formsTop">
        <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
          <!-- 新增：搜索字段选择 -->
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120" clearable>
              <el-option label="订单号" value="third_orderid"></el-option>
              <el-option label="点餐订单号" value="orderid"></el-option>
              <el-option label="用户ID" value="uid"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="下单手机号" value="phone"></el-option>
              <el-option label="福利卡ID" value="flkid"></el-option>
              <el-option label="福利卡号ID" value="flkhid"></el-option>
              <el-option label="用户手机号" value="uphone"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.keyword" placeholder="关键词" class="w120" clearable></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
              <el-option label="下单时间" value="add_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>






          <el-form-item label="">
            <el-date-picker v-model="searchForm.ks_time" type="date" placeholder="开始时间" class="w150"
              value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>

          <el-form-item label="">
            <el-date-picker v-model="searchForm.end_time" type="date" placeholder="结束时间" class="w150"
              value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.type" placeholder="订单渠道" class="w140" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="蚂蚁星球" value="1"></el-option>
              <el-option label="奇票" value="2"></el-option>
              <el-option label="岚廷(无忧点单)" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.pf" placeholder="订单栏目" class="w140" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="肯德基" value="kfc"></el-option>
              <el-option label="麦当劳" value="mdl"></el-option>
              <el-option label="必胜客" value="bsk"></el-option>
              <el-option label="星巴克" value="xbk"></el-option>
              <el-option label="奈雪的茶" value="nx"></el-option>
              <el-option label="瑞幸咖啡" value="rxkf"></el-option>
              <el-option label="库迪" value="kd"></el-option>
              <el-option label="塔斯汀" value="tas"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.packFlag" placeholder="下单类型" class="w120" clearable>
              <el-option label="全部" value="status"></el-option>
              <el-option label="堂食" value="0"></el-option>
              <el-option label="打包" value="1"></el-option>
              <el-option label="外送" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button type="success" @click="exportOrder()" style="display: none;">导出</el-button>

          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
      <el-card class="search-card mt20">
        <div style="text-align: left;">
          <el-button style="margin-bottom: 20px;" type="danger" size="small" @click="delOptions()"
            v-if="multipleSelection.length > 1">批量删除</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>

          <el-table-column label="渠道" min-width="90" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.type == 2 ? 'blueCl' : 'warningCl'">
                {{ getTypeName(scope.row.type) }}<br>{{ getPfName(scope.row.pf) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="订单号" min-width="180" align="center">
            <template slot-scope="scope">{{ scope.row.third_orderid }}</template>
          </el-table-column>

          <!-- <el-table-column label="商品" align="center" min-width="350">
            <template slot-scope="scope">
              <div v-for="(item, idx) in scope.row.goods_list" :key="idx" class="dflex al-center mb10">
                <img :src="item.imageUrl || item.itemImage" alt=""
                  style="width: 60px; height: 60px; object-fit: cover;">
                <div class="txtleft ml10">
                  <div class="blackCl">{{ item.nameCn || item.itemName }}</div>
                  <span class="color999">{{ item.config || item.listname }}</span>
                  <div class="color666 fs12">
                    <span>原价：<span class="fs10">￥</span>{{ item.oPrice || item.sumprice }} * {{ item.quantity }}</span>
                    <span class="pl20">平台价：<span class="fs10">￥</span>{{ item.sellPrice || item.amount }} * {{
                      item.quantity }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column> -->
           <el-table-column label="商品" align="center" min-width="350">
  <template slot-scope="scope">
    <!-- 岚廷 type=3：使用 products_list -->
    <template v-if="scope.row.type == 3">
      <div v-for="(item, idx) in scope.row.products_list" :key="idx" class="dflex al-center mb10">
        <img :src="item.goodsImage" alt="" style="width: 60px; height: 60px; object-fit: cover;">
        <div class="txtleft ml10">
          <div class="blackCl">{{ item.goodsName }}</div>
          <span class="color999">{{ item.specName }}</span>
          <div class="color666 fs12">
            <!-- 原价除以100 -->
            <span>原价：<span class="fs10">￥</span>{{ (item.originalPrice / 100).toFixed(2) }} * {{ item.quantity }}</span>
            <!-- 平台价除以100 -->
            <span class="pl20">平台价：<span class="fs10">￥</span>{{ (item.salesPrice / 100).toFixed(2) }} * {{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </template>
    <!-- 其他平台：使用 goods_list -->
    <template v-else>
      <div v-for="(item, idx) in scope.row.goods_list" :key="idx" class="dflex al-center mb10">
        <img :src="item.imageUrl || item.itemImage" alt="" style="width: 60px; height: 60px; object-fit: cover;">
        <div class="txtleft ml10">
          <div class="blackCl">{{ item.nameCn || item.itemName }}</div>
          <span class="color999">{{ item.config || item.listname }}</span>
          <div class="color666 fs12">
            <span>原价：<span class="fs10">￥</span>{{ item.oPrice || item.sumprice }} * {{ item.quantity }}</span>
            <span class="pl20">平台价：<span class="fs10">￥</span>{{ item.sellPrice || item.amount }} * {{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </template>
  </template>
</el-table-column>
          <el-table-column label="点餐订单号" align="center" min-width="180">
            <template slot-scope="scope">{{ scope.row.orderid }}</template>
          </el-table-column>

          <el-table-column label="总价" align="center" min-width="100">
            <template slot-scope="scope">
              <span class="fs10">￥</span>{{ scope.row.zongji }}
            </template>
          </el-table-column>

          <el-table-column label="下单用户" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.uid }}</div>
              <div class="fs12 color999">{{ scope.row.phone }}</div>
            </template>
          </el-table-column>

          <el-table-column label="订单状态" align="center" min-width="120">
            <template slot-scope="scope">
              <span :class="getStatusClass(scope.row.status)">{{ scope.row.statusstr }}</span>
              <br>
              <span class="color999">{{ getPackFlagName(scope.row.packFlag) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="下单时间" align="center" min-width="160">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>

          <el-table-column label="操作" min-width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="viewDetail(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <div class="page-info">共 {{ total }} 条记录 {{ currentPage }}/{{ Math.ceil(total / pageSize) || 1 }} 页</div>
      </div>
    </template>

    <!-- 子路由 -->
    <router-view />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

import { orderList, delOrder, dcExportOrder } from '@/api/modules/myorder'

export default {
  name: 'MealOrderList',
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        search_key: 'third_orderid',  // 新增：默认按订单号搜索
        keyword: '',
        type: 'status',
        pf: 'status',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        packFlag: 'status'
      },
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // ============ 在 methods 中添加以下方法 ============

    // 导出订单（带确认框）
    async exportOrder() {
      this.$confirm('确认导出当前搜索条件下的所有点餐订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        await this.doExportOrder()
      }).catch(() => { })
    },

    // 实际导出逻辑
    async doExportOrder() {
      try {
        const loading = this.$loading({
          lock: true,
          text: '正在导出数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 构建导出参数
        const params = {}

        // 关键词（优先判断手机号，否则作为普通搜索）
        if (this.searchForm.keyword) {
          const searchKey = this.searchForm.search_key || 'third_orderid'
          params[searchKey] = this.searchForm.keyword
        }

        // 订单渠道
        if (this.searchForm.type && this.searchForm.type !== 'status') {
          params.type = this.searchForm.type
        }

        // 订单栏目
        if (this.searchForm.pf && this.searchForm.pf !== 'status') {
          params.pf = this.searchForm.pf
        }

        // 下单类型
        if (this.searchForm.packFlag && this.searchForm.packFlag !== 'status') {
          params.packFlag = this.searchForm.packFlag
        }

        // 排序参数
        if (this.searchForm.px_key) {
          params.px_key = this.searchForm.px_key
        }
        if (this.searchForm.px_val) {
          params.px_val = this.searchForm.px_val
        }

        // 时间范围
        if (this.searchForm.ks_time) {
          params.ks_time = this.searchForm.ks_time
        }
        if (this.searchForm.end_time) {
          params.end_time = this.searchForm.end_time
        }

        const res = await dcExportOrder(params)

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

          // XLSX 库已引入，直接使用
          try {
            const excelData = [header, ...data]
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet(excelData)
            ws['!cols'] = header.map(() => ({ wch: 18 }))
            XLSX.utils.book_append_sheet(wb, ws, '点餐订单')
            XLSX.writeFile(wb, filename || 'export.xlsx')
            this.$message.success('导出成功')
          } catch (xlsxError) {
            console.error('XLSX导出失败:', xlsxError)
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
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>点餐订单</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
        th { background-color: #4472C4; color: #ffffff; font-weight: bold; padding: 6px 10px; border: 1px solid #999; text-align: center; }
        td { padding: 4px 10px; border: 1px solid #999; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
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
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          ks_time: this.searchForm.ks_time || '',
          end_time: this.searchForm.end_time || '',
          type: this.searchForm.type,
          pf: this.searchForm.pf,
          packFlag: this.searchForm.packFlag
        }

        // 如果有关键词，根据情况传递（可能是订单号或手机号）
        // 搜索条件
        if (this.searchForm.keyword) {
          params.search_key = this.searchForm.search_key || 'third_orderid'
          params.search_val = this.searchForm.keyword
        }

        const res = await orderList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
          this.currentPage = res.data.current_page || 1
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        keyword: '',
        type: 'status',
        pf: 'status',
        px_key: 'add_time',
        px_val: 'desc',
        ks_time: '',
        end_time: '',
        packFlag: 'status'
      }
      this.currentPage = 1
      this.loadData()
    },

    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 批量删除
    delOptions() {
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条订单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delOrder({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm('确认删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delOrder({ ids: row.id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 查看详情
    viewDetail(row) {
      this.$router.push({ name: 'MealOrderListdetails', params: { id: row.id }, query: { data: JSON.stringify(row) } })
    },

    // 获取渠道名称
    getTypeName(type) {
      const map = { 1: '蚂蚁星球', 2: '奇票', 3: '岚廷' }
      return map[type] || '未知'
    },

    // 获取栏目名称
    getPfName(pf) {
      const map = {
        kfc: '肯德基', mdl: '麦当劳', bsk: '必胜客',
        xbk: '星巴克', nx: '奈雪的茶', rxkf: '瑞幸咖啡',
        kd: '库迪', tas: '塔斯汀'
      }
      return map[pf] || pf
    },

    // 获取下单类型名称
    getPackFlagName(flag) {
      const map = { 0: '堂食', 1: '打包', 2: '外送' }
      return map[flag] || ''
    },

    // 获取状态样式类
    getStatusClass(status) {
      if ([3, 4].includes(status)) return 'successCl'
      if ([0, 1].includes(status)) return 'warningCl'
      if ([5, 7, 10].includes(status)) return 'dangerCl'
      return ''
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
  },
  computed: {
    isMealOrderList() {
      return this.$route.name === 'MealOrderList' || this.$route.path === '/meal-order/list'
    }
  }
}
</script>

<style>
.list-container-mealorder .formsTop .el-card__body {
  padding: 20px 20px 0 20px;

}
</style>

<style scoped>
.list-container-mealorder {
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.w120 {
  width: 120px;
}

.w140 {
  width: 140px;
}

.w150 {
  width: 150px;
}

.w180 {
  width: 180px;
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

.mb10 {
  margin-bottom: 10px;
}

.pl20 {
  padding-left: 20px;
}

.fs10 {
  font-size: 10px;
}

.fs12 {
  font-size: 12px;
}

.blackCl {
  color: #333;
  font-weight: 500;
}

.color666 {
  color: #666;
}

.color999 {
  color: #222222;
  font-size: 12px;
}

.blueCl {
  color: #409EFF;
}

.warningCl {
  color: #E6A23C;
}

.successCl {
  color: #67C23A;
}

.dangerCl {
  color: #F56C6C;
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

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}
</style>