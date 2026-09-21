<template>
  <div class="list-container">
    <template v-if="isGiftpackList">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.status1" placeholder="产品来源" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.status2" placeholder="分类" class="w120">
              <el-option label="标题" value="shanghai"></el-option>
              <el-option label="编号" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">

            <el-select v-model="searchForm.status1" placeholder="商品名称" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.keyword" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">

            <el-select v-model="searchForm.status1" placeholder="添加时间" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.keyword" placeholder="顺序" class="w120"></el-input>
          </el-form-item>

          <el-form-item label="">

            <el-select v-model="searchForm.status1" placeholder="商品状态" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="">

            <el-select v-model="searchForm.status1" placeholder="审核状态" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="searchForm.keyword" placeholder="价格" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.tm1" type="date" placeholder="开始时间" class="w136">
            </el-date-picker>

          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="searchForm.tm2" type="date" placeholder="开始时间" class="w136">
            </el-date-picker>
          </el-form-item>



          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>

          </el-form-item>
        </el-form>
      </el-card>
      <!--  -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1"
            @click="delOptions()">批量删除</el-button>

          <el-button type="primary" size="small" icon="el-icon-plus" @click="addPros(1)">添加礼包</el-button>
          <!-- <el-button type="success" size="small" icon="el-icon-bottom-right" @click="addPro()">导入</el-button>
          <el-button type="success" size="small" icon="el-icon-top-right" @click="addPro()">导出</el-button>
          <el-button type="warning" size="small" icon="el-icon-unlock" @click="addPro()">审核</el-button>
          <el-button type="warning" size="small" icon="el-icon-upload2" @click="addPro()">上架</el-button>
          <el-button type="warning" size="small" icon="el-icon-download" @click="addPro()">下架</el-button> -->
        </div>


        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-if="tableshow">
          <el-table-column type="selection" width="39">
          </el-table-column>
          <el-table-column label="编号" width="60" type="index" align="center">
            <!-- <template slot-scope="scope">

            {{ scope.row.date }}
          </template> -->
          </el-table-column>
          <el-table-column label="缩略图" width="90" align="center">
            <template slot-scope="scope">
              <img src="../../assets/l1.png" style=" width:   60px" alt="">

            </template>
          </el-table-column>
           
          <el-table-column label="商品名称" width="380" align="left">
            <template slot-scope="scope">
              <!-- <span style="color: #409eff;">{{ scope.row.yj }}</span> -->
               <span style="color: #67c23a;">{{ scope.row.yj1
              }}</span> {{ scope.row.spmc }}
            </template>
          </el-table-column>

          <el-table-column label="对比" width="80" align="left">
            <template slot-scope="scope">
              对比
            </template>
          </el-table-column>



          <el-table-column label="价格-供货价" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.ghj }} - {{ scope.row.jg }}
            </template>
          </el-table-column>

          <el-table-column label="添加时间" width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.times }}
            </template>
          </el-table-column>
          <el-table-column label="发布" align="center">
            <template slot-scope="scope">

              <div>{{ scope.row.fb }}</div>
              <div>{{ scope.row.fb1 }}</div>
            </template>
          </el-table-column>
          <el-table-column label="上架" align="center" width="65">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sj">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="审核" align="center" width="65">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.status }}</div>
              <div>{{ scope.row.status1 }}</div>
            </template>
          </el-table-column>

          <el-table-column label="推荐" width="105" align="center">
            <template slot-scope="scope">
              <div class="dflex flex-between al-center">
                <span>热销：</span><el-switch v-model="scope.row.tj">
                </el-switch>
              </div>
              <div class="dflex flex-between al-center mt4">
                <span>精选：</span><el-switch v-model="scope.row.jx">
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="点击率" width="70" align="center">
            <template slot-scope="scope">
              {{ scope.row.dj }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div v-if="!tableshow">
          <div class="permission-tree">
            <!-- 全选按钮 -->
            <div class="select-all">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                全选所有权限
              </el-checkbox>
              <span class="selected-count">已选择 {{ selectedCount }} 个权限</span>
            </div>

            <el-divider></el-divider>

            <!-- 权限列表 - 按模块分组 -->
            <div class="permission-modules">
              <div v-for="module in menuList" :key="module.path" class="module-item">
                <!-- 模块标题（一级导航） -->
                <div class="module-header">
                  <el-checkbox v-model="module.checked" :indeterminate="module.indeterminate"
                    @change="(val) => handleModuleChange(module, val)">
                    <i :class="module.meta.icon"></i>
                    <span class="module-title">{{ module.meta.title }}</span>
                  </el-checkbox>
                </div>

                <!-- 子权限列表（二级导航） -->
                <div class="module-children" v-if="module.children && module.children.length">
                  <el-checkbox-group v-model="module.checkedChildren"
                    @change="(val) => handleChildrenChange(module, val)">
                    <el-checkbox v-for="child in module.children" :key="child.path"
                      :label="getPermissionId(module, child)" class="child-item">
                      {{ child.meta.title }}
                      <span class="permission-path">({{ child.path }})</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <!-- 无子权限的模块 -->
                <div class="module-children" v-else>
                  <el-checkbox :value="module.checked" @change="(val) => handleModuleChange(module, val)"
                    class="child-item">
                    访问权限
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>


        </div>


      </el-card></template>
    <router-view />
  </div>
</template>

<script>
import { menuList } from '@/router/menu'
export default {
  name: 'GiftpackList',  // 修改组件名
  props: {

  },
  data() {
    return {
      addBox: true,
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '', tm1: '', tm2: ''
      },
      dialogImageUrl: '',
      // dialogVisible2: false,
      form: {
        name: '',
        resource: '',
        desc: ''
      },
      menuList: [],
      // dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: [{
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[礼包]', yj1: '[礼包组合]',
        date: '1', spmc: '[奥妙（OMO）]  奥妙焕新洁净礼盒F（OMO-JQ2606）+', ghj: '185.00', jg: '25.36', times: '2026-03-09 14:10:15',
        name: '超级管理员',
        ips: '开启', sh: false, sj: false,
        ipe: '超级管理员',
        tj: false, jx: true, status: '已审核', status1: '已上架',

      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[礼包组合]',
        date: '2', sh: true, sj: true, spmc: '[奥妙（OMO）]  奥妙焕新洁净礼盒F（OMO-JQ2606）+力士水润丝滑洗护套装（洗发乳400g、润发精华素160g、水光柔亮小礼盒）', ghj: '185.00', jg: '25.36', times: '2026-03-09 14:10:15',
        name: '商城供应商', status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加商城产品，查看商城订单，查看兑换订单',
        ip: '0.0.0.0',
        tj: false, jx: true,
        sp: '超级管理员',
      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[礼包组合]',
        date: '3', spmc: '[奥妙（OMO）]  奥妙焕新洁净礼盒F（OMO-JQ2606）+力士水润丝滑洗护套装（洗发乳400g、润发精华素160g、水光柔亮小礼盒）', ghj: '185.00', jg: '25.36', times: '2026-03-09 14:10:15',
        name: '蛋糕供应商', sh: true, sj: true, status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单可添加商城产品，查看商城订单，查看兑换订单，',
        ip: '0.0.0.0',
        sp: '超级管理员',
        tj: false, jx: true

      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[礼包组合]',
        date: '4', spmc: '[奥妙（OMO）]  奥妙焕新洁净礼盒F（OMO-JQ2606）+力士水润丝滑洗护套装（洗发乳400g、润发精华素160g、水光柔亮小礼盒）', ghj: '185.00', jg: '25.36', times: '2026-03-09 14:10:15',
        name: '供应商', sh: true, sj: true, status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '查看商城订单，查看兑换订单，添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单',
        ip: '0.0.0.0',
        sp: '超级管理员',
        tj: false, jx: true

      }]
    }
  },
  mounted() {

  },
  created() {
    // this.initMenuList()
  },
  methods: {
    delOptions() {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => { })
    },
    handleDelete(index, row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
      }).catch(() => { })
    },
    handleSearch() { },

    addPro() {

      // this.dialogVisible = false;
      // this.$router.push('/product/addproduct')

    },
    addPros() {

      this.$router.push({
        name: 'AddPack',
        params: { id: 1 }
      }).catch(err => {
        console.log('路由跳转错误:', err)
      })
    },
    // 初始化菜单列表，添加选中状态


    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },

  }, computed: {
    isGiftpackList() {
      // 只要不是子路由页面，就显示列表
      return this.$route.name === 'GiftpackList' || this.$route.path === '/combopack/list'
    }
  },
  watch: {

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
  /* 产品列表 */
}

.serchForm .el-card__body {
  padding-top: 10px !important;
  /* 产品列表 */
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

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>