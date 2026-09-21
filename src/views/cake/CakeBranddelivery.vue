<template>
  <div class="list-container">
    <template>
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.city_id" placeholder="城市" filterable clearable class="w120"
              @change="handleSearch">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120" clearable>
              <el-option label="配送名称" value="name"></el-option>
              <el-option label="编号" value="id"></el-option>
              <el-option label="描述" value="short_description"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"
              @keyup.enter="handleSearch"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" @change="handleSearch" clearable>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable @change="handleSearch">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addDelivery">添加配送范围</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
            v-if="multipleSelection.length > 0">
            批量删除
          </el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          v-loading="loading" @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="39"></el-table-column>

          <el-table-column label="编号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <el-table-column label="城市" width="150" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.city_id || '-' }} -->
              {{ getCityName(scope.row.city_id) }}
            </template>
          </el-table-column>

          <el-table-column label="配送名称" min-width="200" align="left">
            <template slot-scope="scope">
              {{ scope.row.name || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="范围描述" min-width="300" align="left">
            <template slot-scope="scope">
              <div class="short-desc">{{ scope.row.description || '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="250" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" v-if="total > 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-card>


      <!--  -->
      <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
        size="60%">
        <div style="padding: 0px 20px 20px 20px;">
          <!-- <div style="margin-top: 10px;">
            <el-button size="small" type="success" @click="startDrawing">开始绘制</el-button>
            <el-button size="small" type="warning" @click="stopDrawing">清除区域</el-button>
          </div> -->
          <el-card class="search-card">
            <el-form status-icon ref="ruleForm" :model="formData" label-width="100px" style="width: 100%;text-align: left;">
              <el-form-item label="城市:" required>
                <el-select v-model="formData.city_id" placeholder="请选择城市" filterable clearable @change="onCityChange">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="名称：" required>
                <el-input v-model="formData.name" placeholder="请输入配送名称" />
              </el-form-item>

              <el-form-item label="范围描述：">
                <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入范围描述" />
              </el-form-item>

              <el-form-item label="地图：">
                <div id="container" class="bmap-container" style="width: 100%; height: 500px;">
                </div>
                <div style="margin-top: 10px; color: #ff0000; font-size: 12px;">
                  提示：请先选择配送城市，加载地图后双击开始绘制范围，绘制完成后右键退出绘制，最后保存。
                </div>
              </el-form-item>

              <el-form-item class="txtleft">
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="handleClose">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-drawer>
      <!--  -->
    </template>
  </div>
</template>

<script>
import {
  delDeliverycake,
  deliveryListcake,
  brandCityListcake,
  addDeliverycake,
  getDeliverycake,
  editDeliverycake
} from '@/api/modules/login'

export default {
  name: 'DeliveryRangeList',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      drawerTitle: '添加配送范围',
      isEdit: false,  // 是否为编辑模式
      editId: '',     // 编辑时的ID
      // 表单数据
      formData: {
        city_id: '',
        name: '',
        description: '',
        map: ''
      },
      // 地图相关
      map: null,
      overlay: null,
      loading: false,
      tableshow: true,
      multipleSelection: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      brandId: '',
      searchForm: {
        search_key: 'name',
        search_val: '',
        city_id: '',
        px_key: 'id',
        px_val: 'desc'
      },
      cityList: []
    }
  },
  mounted() {
    this.brandId = this.$route.query.id || this.$route.params.id || ''
    this.getDeliveryList()
    this.getCityList()
    this.loadBaiduMapAPI()
  },
  methods: {
    // 加载百度地图API (普通版本，支持编辑)
    loadBaiduMapAPI() {
      if (window.BMap) return
      const script = document.createElement('script')
      script.src = 'https://api.map.baidu.com/api?v=3.0&ak=GUUm4Np0bb3wQvzyS2PSoj8IV2xSbAnw&callback=onBMapCallback'
      script.async = true
      window.onBMapCallback = () => {
        console.log('百度地图加载完成')
      }
      document.head.appendChild(script)
    },

    // 初始化地图
    initMap() {
      if (typeof BMap === 'undefined') {
        setTimeout(() => this.initMap(), 500)
        return
      }
      this.createMap()
    },

    // 创建地图
    createMap() {
      const defaultPoint = new BMap.Point(116.404, 39.915)
      this.map = new BMap.Map('container')
      this.map.centerAndZoom(defaultPoint, 11)
      this.map.enableScrollWheelZoom(true)
      this.map.addControl(new BMap.ScaleControl())
      this.map.addControl(new BMap.NavigationControl())
      console.log('地图创建成功')

      this.initDrawFeature()

      if (this.formData.city_id) {
        this.onCityChange(this.formData.city_id)
      }
    },

    // 初始化绘制功能
    initDrawFeature() {
      const that = this

      // 双击地图生成矩形区域
      this.map.addEventListener("dblclick", function (e) {
        if (that.overlay) {
          that.map.removeOverlay(that.overlay)
        }

        const center = that.map.getCenter()
        const lat = center.lat
        const lng = center.lng
        const delta = 0.03

        const points = [
          new BMap.Point(lng - delta, lat + delta),
          new BMap.Point(lng + delta, lat + delta),
          new BMap.Point(lng + delta, lat - delta),
          new BMap.Point(lng - delta, lat - delta)
        ]

        that.overlay = new BMap.Polygon(points, {
          strokeColor: "#ff0000",
          fillColor: "#ff0000",
          strokeWeight: 3,
          strokeOpacity: 0.8,
          fillOpacity: 0.3,
          enableEditing: true
        })

        that.map.addOverlay(that.overlay)
        that.$message.success('已生成区域，点击顶点或边上的白点拖拽调整形状，右键保存')
      })

      // 右键保存坐标
      this.map.addEventListener("rightclick", function () {
        if (that.overlay) {
          const path = that.overlay.getPath()
          const points = []
          for (let i = 0; i < path.length; i++) {
            points.push({
              lng: path[i].lng,
              lat: path[i].lat
            })
          }
          that.formData.map = JSON.stringify(points)
          that.$message.success(`范围已保存，共 ${points.length} 个顶点`)
          console.log('保存的坐标:', points)
        } else {
          that.$message.warning('请先双击地图生成配送区域')
        }
      })
    },

    // 渲染已保存的地图范围（用于编辑时显示）
    renderSavedMap(mapData) {
      if (!this.map || !mapData || mapData.length === 0) return

      const points = []
      for (let i = 0; i < mapData.length; i++) {
        points.push(new BMap.Point(mapData[i].lng, mapData[i].lat))
      }

      this.overlay = new BMap.Polygon(points, {
        strokeColor: "#ff0000",
        fillColor: "#ff0000",
        strokeWeight: 3,
        strokeOpacity: 0.8,
        fillOpacity: 0.3,
        enableEditing: true
      })

      this.map.addOverlay(this.overlay)

      // 定位到多边形中心
      const bounds = this.overlay.getBounds()
      this.map.centerAndZoom(bounds.getCenter(), 13)
    },

    // 根据城市名称搜索并设置地图中心
    searchCityAndSetCenter(cityName) {
      const that = this
      const myGeo = new BMap.Geocoder()
      myGeo.getPoint(cityName, function (point) {
        if (point) {
          that.map.centerAndZoom(point, 13)
          that.$message.success(`已定位到 ${cityName}`)
        } else {
          that.$message.warning(`未找到 ${cityName} 的位置`)
        }
      }, cityName)
    },

    // 城市选择变化时调用
    onCityChange(val) {
      if (!val) return
      const cityName = this.getCityNameById(val)
      if (cityName && this.map) {
        this.searchCityAndSetCenter(cityName)
      }
    },

    // 手动开始绘制
    startDrawing() {
      if (this.overlay) {
        this.map.removeOverlay(this.overlay)
        this.overlay = null
      }
      this.formData.map = ''
      this.$message.info('请双击地图生成配送区域')
    },

    // 手动停止绘制
    stopDrawing() {
      if (this.overlay) {
        this.map.removeOverlay(this.overlay)
        this.overlay = null
      }
      this.formData.map = ''
      this.$message.info('已清除绘制区域')
    },

    getCityName(cityId) {
      if (!cityId) return '-'
      const city = this.cityList.find(item => item.id == cityId)
      return city ? city.name : cityId
    },

    getCityNameById(cityId) {
      const city = this.cityList.find(item => item.id == cityId)
      return city ? city.name : ''
    },

    // 获取配送范围列表
    async getDeliveryList() {
      this.loading = true
      try {
        const params = {
          id: this.brandId,
          city_id: this.searchForm.city_id || undefined,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val || undefined,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: String(this.currentPage),
          limit: String(this.pageSize)
        }

        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const res = await deliveryListcake(params)
        if (res.code === 200) {
          this.tableData = res.data?.data || res.data?.list || []
          this.total = res.data?.total || res.data?.count || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取配送范围列表失败:', error)
        this.$message.error('网络异常，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 获取城市列表
    async getCityList() {
      try {
        const res = await brandCityListcake()
        if (res.code === 200) {
          this.cityList = res.data || []
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    handleSearch() {
      this.currentPage = 1
      this.getDeliveryList()
    },

    // 添加配送范围
    addDelivery() {
      this.isEdit = false
      this.editId = ''
      this.drawerTitle = '添加配送范围'
      this.formData = {
        city_id: '',
        name: '',
        description: '',
        map: ''
      }
      this.drawer = true
      this.$nextTick(() => {
        this.initMap()
      })
    },

    // 编辑配送范围
    async handleEdit(row) {
      this.isEdit = true
      this.editId = row.id
      this.drawerTitle = '编辑配送范围'
      this.drawer = true

      // 先打开抽屉，初始化地图
      this.$nextTick(async () => {
        this.initMap()

        // 获取详情数据
        try {
          const res = await getDeliverycake({ id: row.id })
          if (res.code === 200) {
            const data = res.data
            this.formData = {
              city_id: data.city_id,
              name: data.name,
              description: data.description || '',
              map: JSON.stringify(data.map)
            }

            // 等待地图初始化完成后渲染区域
            const waitForMap = setInterval(() => {
              if (this.map && data.map && data.map.length > 0) {
                clearInterval(waitForMap)
                this.renderSavedMap(data.map)
              }
            }, 500)
          } else {
            this.$message.error(res.msg || '获取详情失败')
          }
        } catch (error) {
          console.error('获取详情失败:', error)
          this.$message.error('获取详情失败')
        }
      })
    },

    async batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的配送范围')
        return
      }

      try {
        await this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个配送范围？`, '提示', {
          type: 'warning'
        })

        const ids = this.multipleSelection.map(item => item.id).join(',')
        const res = await delDeliverycake({
          ids: ids,
          ppid: this.brandId
        })

        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
          this.getDeliveryList()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该配送范围？', '提示', {
          type: 'warning'
        })

        const res = await delDeliverycake({
          ids: String(row.id),
          ppid: this.brandId
        })

        if (res.code === 200) {
          this.$message.success(res.msg || '删除成功')
          this.getDeliveryList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getDeliveryList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getDeliveryList()
    },

    // 提交表单（添加/编辑）
    async submitForm() {
      if (!this.formData.name) {
        this.$message.warning('请输入配送名称')
        return
      }
      if (!this.formData.city_id) {
        this.$message.warning('请选择城市')
        return
      }
      if (!this.formData.map) {
        this.$message.warning('请在地图上绘制配送范围')
        return
      }

      const params = {
        ppid: this.brandId,
        city_id: this.formData.city_id,
        name: this.formData.name,
        description: this.formData.description || '',
        map: this.formData.map,
        uid: '0'  // 后台添加传0
      }

      try {
        let res
        if (this.isEdit) {
          // 编辑模式
          params.id = this.editId
          res = await editDeliverycake(params)
        } else {
          // 添加模式
          res = await addDeliverycake(params)
        }

        if (res.code === 200) {
          this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
          this.drawer = false
          this.getDeliveryList()
        } else {
          this.$message.error(res.msg || (this.isEdit ? '修改失败' : '添加失败'))
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      }
    },

    handleClose() {
      if (this.map) {
        this.map.clearOverlays()
        this.map = null
      }
      this.overlay = null
      this.drawer = false
    }
  }
}
</script>

<style>
#container {
  position: relative;
  z-index: 1;
}

/* 确保绘制工具栏显示在地图上方 */
.BMapLib_Drawing_Toolbar {
  z-index: 1000 !important;
}

/* 强制显示百度地图绘制工具栏 */
.BMapLib_Drawing_Toolbar {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: absolute !important;
  left: 10px !important;
  top: 10px !important;
  background: #fff !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  padding: 5px !important;
  z-index: 10000 !important;
}

.BMapLib_Drawing_Toolbar div {
  display: inline-block !important;
  width: 24px !important;
  height: 24px !important;
  margin: 0 2px !important;
  cursor: pointer !important;
}

/* 工具栏图标背景 */
.BMapLib_Drawing_Toolbar .BMapLib_polygon {
  background: url('https://api.map.baidu.com/library/DrawingManager/1.4/src/images/polygon.png') no-repeat center !important;
  background-size: contain !important;
}

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
}

.w120 {
  width: 120px;
}

.short-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  word-break: break-all;
  white-space: normal;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-table .cell) {
  line-height: 1.4;
}

/* 百度地图绘制工具栏样式 */
.BMapLib_Drawing {
  z-index: 1000;
}

.BMapLib_Drawing_Toolbar {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>