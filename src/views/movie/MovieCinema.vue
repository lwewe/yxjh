<template>
  <div class="list-container">
    <!-- 搜索表单 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form" @submit.native.prevent>
        <el-form-item label="">
          <el-select v-model="searchForm.cityid" placeholder="城市" class="w150" clearable filterable @change="handleCityChange">
            <el-option 
              v-for="item in cityOptions" 
              :key="item.id" 
              :label="`${item.pinyin}-${item.name} (${item.cityid1}-${item.cityid2})`" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" v-if="diquOptions.length > 0">
          <el-select v-model="searchForm.diquid" placeholder="区/县" class="w150" clearable filterable>
            <el-option 
              v-for="item in diquOptions" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="选择搜索字段" class="w140" clearable filterable>
            <el-option label="影院名称-轩夸" value="name"></el-option>
            <el-option label="影院名称-奇票" value="name1"></el-option>
            <el-option label="影院地址-轩夸" value="address"></el-option>
            <el-option label="影院地址-奇票" value="address1"></el-option>
            <el-option label="影院编码" value="standardid"></el-option>
            <el-option label="影院编码" value="cinemaCode"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <!-- <el-button type="success" @click="handleExport">导出</el-button> -->
          <el-button type="success" size="small" icon="el-icon-top-right" @click="handleExport()">导出</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <!-- 影院列表表格 -->
    <el-card class="search-card">
      <el-table 
        ref="multipleTable" 
        :data="tableData" 
        border 
        style="width: 100%"
        v-loading="loading"
        :row-class-name="tableRowClassName" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
      >
        <el-table-column label="个数" width="60" type="index" align="center"></el-table-column>
        <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>
        
        <el-table-column label="编码1" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.cinemaid1 }} <br> {{    scope.row.cinemaCode   }}
          </template>
        </el-table-column>

        <el-table-column label="编码2" width="120" align="center">
          <template slot-scope="scope">
            <div >
              {{ scope.row.cinemaid2  }}<br>
              <span>{{ scope.row.cinemaCode || scope.row.standardid || '' }}</span>
            </div>
            
          </template>
        </el-table-column>

        <el-table-column label="影院名称" min-width="200" align="left">
          <template slot-scope="scope">
            <div>
              <!-- <span v-if="scope.row.name" style="color: #409eff;">[轩夸]</span>
              <span v-else-if="scope.row.name1" style="color: #e6a23c;">[奇票]</span> -->
              {{ scope.row.name  }} <br> {{  scope.row.name1   }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="城市" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.cityname1  }} <br> {{  scope.row.cityname2   }}
          </template>
        </el-table-column>

        <el-table-column label="影院电话" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone1  }} <br> {{  scope.row.phone2   }}
          </template>
        </el-table-column>

        <el-table-column label="地址" min-width="250" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.address }} <br> {{scope.row.address1  }}</span>
            <div style="font-size: 12px; color: #999;">
              <span title="城市id"> {{ scope.row.city_id || '-' }}</span>
              <span v-if="scope.row.cityid1 || scope.row.cityid2"> ({{ scope.row.cityid1 || 0 }}-{{ scope.row.cityid2 || 0 }})</span>
              <span v-if="scope.row.quid1 || scope.row.quid2"> ({{ scope.row.quid1 || 0 }}-{{ scope.row.quid2 || 0 }})</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="购票状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'Y' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 'Y' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="经纬度" width="190" align="center">
          <template slot-scope="scope">
            <div  >
              {{ scope.row.lon1}} {{ scope.row.lat1   }},<br>
              {{ scope.row.lon2  }}  {{scope.row.lat2}}
            </div>
             
          </template>
        </el-table-column>

        <el-table-column label="下单位置" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.flag === 1 ? '轩夸' : (scope.row.flag === 2 ? '奇票(新接口)' : '-') }}
            <br>
            <el-button size="mini" type="primary" @click="handleDiquList(scope.row)">更改</el-button>
            
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <span class="total-info">共 {{ pagination.total }} 条记录</span>
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pagination.current_page"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pagination.per_page"
          layout="prev, pager, next, jumper, sizes"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { 
  cinemaList, 
  cinemaCityList, 
  cinemaDiquList,
  exportCinema,editCinema
} from '@/api/modules/video'

export default {
  name: 'CinemaList',
  data() {
    return { locationChanging: false,  // 新增：防止重复提交
      loading: false,
      searchForm: {
        cityid: '',
        diquid: '',
        search_key: '',
        search_val: '',
        px_key: 'id',
        px_val: 'desc'
      },
      tableData: [],
      pagination: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      cityOptions: [],
      diquOptions: []
    }
  },
  created() {
    this.getCityList()
    this.getList()
    
    // 从URL参数获取初始值
    if (this.$route.query.cityid) {
      this.searchForm.cityid = this.$route.query.cityid
    }
    if (this.$route.query.diquid) {
      this.searchForm.diquid = this.$route.query.diquid
    }
    if (this.$route.query.search_key) {
      this.searchForm.search_key = this.$route.query.search_key
    }
    if (this.$route.query.search_val) {
      this.searchForm.search_val = this.$route.query.search_val
    }
  },
  methods: {
    // 更改影院下单位置（带确认框）
async handleDiquList(row) {
  // 当前下单位置文本
  const currentFlag = row.flag === 1 ? '轩夸' : (row.flag === 2 ? '奇票(新接口)' : '未设置')
  // 目标下单位置
  const targetFlag = row.flag === 1 ? 2 : 1
  const targetFlagText = targetFlag === 1 ? '轩夸' : '奇票(新接口)'
  
  // 添加确认框
  try {
    await this.$confirm(`确认将影院"${row.name || row.name1}"的下单位置更改吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    // 用户取消，不做任何操作
    return
  }
  
  if (this.locationChanging) return
  this.locationChanging = true

  try {
    // 导入接口
    
    const res = await editCinema({ id: row.id })
    
    if (res.code === 200) {
      this.$message.success(`下单位置修改成功，当前为：${res.data.flag === 1 ? '轩夸' : '奇票(新接口)'}`)
      // 更新本地数据
      row.flag = res.data.flag
      // 刷新表格
      this.getList()
    } else {
      this.$message.error(res.msg)
    }
  } catch (error) {
    console.error('修改下单位置失败:', error)
    // this.$message.error(error)
  } finally {
    this.locationChanging = false
  }
},
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.flag === 2) {
        return 'qipiao-row'
      }
      return ''
    },

    // 获取城市列表
    async getCityList() {
      try {
        const res = await cinemaCityList()
        if (res.code === 200) {
          this.cityOptions = res.data.list || []
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    // 城市选择变化
    async handleCityChange(val) {
      this.searchForm.diquid = ''
      if (val) {
        try {
          const res = await cinemaDiquList({ id: val })
          if (res.code === 200) {
            this.diquOptions = res.data.list || []
          }
        } catch (error) {
          console.error('获取地区列表失败:', error)
          this.diquOptions = []
        }
      } else {
        this.diquOptions = []
      }
      this.handleSearch()
    },

    // 获取影院列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
          limit: this.pagination.per_page,
          ...this.searchForm
        }

        // 过滤空值
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await cinemaList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total
          this.pagination.per_page = res.data.per_page
          this.pagination.current_page = res.data.current_page
          this.pagination.last_page = res.data.last_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current_page = 1
      this.getList()
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination.current_page = page
      this.getList()
    },

    handleSizeChange(size) {
      this.pagination.per_page = size
      this.pagination.current_page = 1
      this.getList()
    },

    // 导出
     
 // 导出
async handleExport() {
  // 影院列表没有多选功能，直接按搜索条件导出
  this.$confirm('确认导出当前搜索条件下的所有影院数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    await this.doExport()
  }).catch(() => {})
},

 // 实际导出逻辑
async doExport(extraParams = {}) {
  // 构建业务参数
  const businessParams = { ...extraParams }

  // ===== 修改这里：使用影院列表的字段 =====
  // 城市和地区
  if (this.searchForm.cityid) {
    businessParams.cityid = this.searchForm.cityid
  }
  if (this.searchForm.diquid) {
    businessParams.diquid = this.searchForm.diquid
  }
  
  // 搜索字段和关键词
  if (this.searchForm.search_key) {
    businessParams.search_key = this.searchForm.search_key
  }
  if (this.searchForm.search_val) {
    businessParams.search_val = this.searchForm.search_val
  }
  
  // 排序字段和排序方式
  if (this.searchForm.px_key) {
    businessParams.px_key = this.searchForm.px_key
  }
  if (this.searchForm.px_val) {
    businessParams.px_val = this.searchForm.px_val
  }

  try {
    const loading = this.$loading({
      lock: true,
      text: '正在导出数据...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 调用影院导出接口
    const res = await exportCinema(businessParams)

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
        ws['!cols'] = header.map(() => ({ wch: 18 }))
        XLSX.utils.book_append_sheet(wb, ws, '影院列表')
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
              <x:Name>产品列表</x:Name>
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
  return text.replace(/[&<>"']/g, function(m) { return map[m] })
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

.w100 {
  width: 100px;
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

/* 奇票行样式 */
 
</style>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;

    .total-info {
      color: #606266;
      font-size: 13px;
    }
  }
}
</style>