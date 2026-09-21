<template>
  <div class="list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-input v-model="searchForm.uid" placeholder="用户ID" class="w120" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker v-model="searchForm.cj_time" type="datetime" placeholder="创建时间" class="w180"
            value-format="timestamp" format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker v-model="searchForm.bg_time" type="datetime" placeholder="变更时间" class="w180"
            value-format="timestamp" format="yyyy-MM-dd HH:mm:ss">
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
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        v-loading="loading" stripe :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">



        <el-table-column label="订单ID" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" min-width="200">
          <template slot-scope="scope">

            <span>{{ scope.row.order_no }}</span>

          </template>
        </el-table-column>

        <el-table-column label="商品" min-width="380" align="center">
          <template slot-scope="scope">
            <div class="dflex al-center" v-if="scope.row.order_detail && scope.row.order_detail[0]">
              <img :src="scope.row.order_detail[0].image_path" alt=""
                style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"
                @error="handleImageError($event)">
              <div class="txtleft ml10">
                <div class="product-name">{{ scope.row.order_detail[0].product_name }}</div>
                <span class="blueCl">
                  {{ scope.row.order_detail[0].spec_name }} * {{ scope.row.order_detail[0].quantity }}
                </span>
              </div>
            </div>
            <div v-else class="dflex al-center">
              <div class="img-placeholder" style="width: 80px; height: 80px;">暂无图片</div>
              <div class="txtleft ml10">
                <div>-</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌" align="center" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>


        <el-table-column label="下单用户" align="center" min-width="100">
          <template slot-scope="scope">
            <a href="javascript:;" @click="viewUser(scope.row.uid)" class="user-link">
              {{ scope.row.uid }}
            </a>
          </template>
        </el-table-column>



        <el-table-column label="价格" align="center" min-width="110">
          <template slot-scope="scope">
            <span class="price-text">
              <span class="fs10">￥</span>{{ scope.row.final_amount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span :style="{ color: getStatusColor(scope.row.status) }" size="small">
              {{ getStatusText(scope.row.status) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="下单时间" align="center" min-width="130">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>


      </el-table>

      <!-- 加载更多按钮 -->
      <div class="loading-more" v-if="hasMore && tableData.length > 0">
        <el-button type="success" @click="loadMore" :loading="loadingMore" size="small">
          查看更多
        </el-button>
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
  </div>
</template>

<script>
import { dgssOrderList } from '@/api/modules/dgorder'

export default {
  name: 'ChannelOrderList',
  data() {
    return {
       userDialogVisible: false,
    userDetail: null,
    userLoading: false,
      searchForm: {
        uid: '',
        cj_time: '',
        bg_time: ''
      },
      tableData: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      loading: false,
      loadingMore: false,
      hasMore: false,
      multipleSelection: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData(type = 'search') {
      if (type === 'search') {
        this.currentPage = 1
        this.loading = true
      } else {
        this.loadingMore = true
      }

      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }

        if (this.searchForm.uid) {
          params.uid = this.searchForm.uid
        }
        if (this.searchForm.cj_time) {
          params.cj_time = this.searchForm.cj_time
        }
        if (this.searchForm.bg_time) {
          params.bg_time = this.searchForm.bg_time
        }

        const res = await dgssOrderList(params)

        if (res.code === 200) {
          const data = res.data
          if (type === 'loadMore') {
            this.tableData = [...this.tableData, ...(data.order_list || [])]
          } else {
            this.tableData = data.order_list || []
          }

          this.total = data.order_total || 0

          // 判断是否还有更多数据
          this.hasMore = this.tableData.length < this.total
        } else {
          this.$message.error(res.msg || '获取渠道订单列表失败')
        }
      } catch (error) {
        console.error('获取渠道订单列表失败:', error)
        this.$message.error('获取渠道订单列表失败')
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },

    // 搜索
    handleSearch() {
      this.loadData('search')
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        uid: '',
        cj_time: '',
        bg_time: ''
      }
      this.handleSearch()
    },

    // 加载更多
    loadMore() {
      this.currentPage++
      this.loadData('loadMore')
    },

    // 分页切换
    handlePageChange(page) {
      this.currentPage = page
      this.loadData('search')
    },

    // 表格选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getStatusColor(status) {
      const colorMap = {
        '0': '#E6A23C',  // 待确认 - 橙色
        '1': '#F56C6C',  // 待收货 - 红色
        '2': '#67C23A',  // 已完成 - 绿色
        '3': '#909399',  // 已退款 - 灰色
        '4': '#C0C4CC'   // 已取消 - 浅灰色
      }
      return colorMap[status] || '#303133'
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': '待确认',
        '1': '待收货',
        '2': '已完成',
        '3': '已退款',
        '4': '已取消'
      }
      return statusMap[status] || '未知'
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        '0': 'warning',
        '1': 'danger',
        '2': 'success',
        '3': 'info',
        '4': 'info'
      }
      return typeMap[status] || 'info'
    },

    // 查看用户
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

// ✅ 新增（这个页面之前没有 formatTime，需要加上）
formatTime(timestamp) {
  if (!timestamp || timestamp == 0) return '未登录'
  const date = new Date(timestamp * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
},
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        path: '/dgorder/detail',
        query: { id: row.id, type: 'channel' }
      })
    },

    // 查看快递
    viewExpress(row) {
      this.$router.push({
        path: '/dgorder/express',
        query: { id: row.id }
      })
    },

    // 图片加载失败处理
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGNUY3RkEiLz48dGV4dCB4PSI0MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTA5Mzk5IiBmb250LXNpemU9IjEyIj7mmoLml6Dlm77niYc8L3RleHQ+PC9zdmc+'
    }
  }
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

  .product-name {
    font-size: 13px;
    color: #303133;
    margin-bottom: 5px;
    // max-width: 180px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }

  .blueCl {
    color: #409EFF;
    font-size: 12px;
  }

  .price-text {
    // color: #ff0000;
    font-weight: 500;
  }

  .fs10 {
    font-size: 10px;
  }

  .user-link {
    color: #222222;
    text-decoration: none;
    cursor: pointer;


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

  .loading-more {
    text-align: center;
    padding: 20px 0;
    background: #fff;
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }

  .w120 {
    width: 120px;
  }

  .w180 {
    width: 180px;
  }
}
</style>