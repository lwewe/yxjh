<template>
  <div class="list-container">

    <!--  -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 1" @click="delOptions()">批量删除</el-button>

        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加合卡分类</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="39">
        </el-table-column>
        <el-table-column label="编号" width="90" type="index" align="center">
        </el-table-column>
        <el-table-column label="排序" width="190" type="index" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mb" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="标题" width="230" align="center">
          <template slot-scope="scope">
            <span class="blueCl">{{ scope.row.mb }}</span> {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.sp }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.jx">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="260" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">关联产品</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>

export default {
  name: 'UserManage',  // 修改组件名
  props: {
  },
  data() {
    return {
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

      // dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,

      multipleSelection: [],
      tableData: [{
        dj: '5', mb: '21', fb: '端午节', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '1', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '2024-08-29 17:31:38',
        ips: '开启', sh: false, sj: false,
        sp: '2024-08-29 17:31:38',
        tj: false, jx: true, status: '节日慰问(档位)', status1: '已上架',

      }, {
        dj: '5', mb: '21', fb: '端午节', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '2', sh: true, sj: true, spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '商城供应商', status: '节日慰问(档位)', status1: '已上架',
        ips: '开启',
        ipe: '可添加商城产品，查看商城订单，查看兑换订单',
        ip: '0.0.0.0',
        tj: false, jx: true,
        sp: '2024-08-29 17:31:38',
      }, {
        dj: '5', fb: '端午节', mb: '21', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '3', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '蛋糕供应商', sh: true, sj: true, status: '节日慰问(档位)', status1: '已上架',
        ips: '开启',
        ipe: '可添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单可添加商城产品，查看商城订单，查看兑换订单，',
        ip: '0.0.0.0',
        sp: '2024-08-29 17:31:38',
        tj: false, jx: false

      }, {
        dj: '5', fb: '端午节', mb: '21', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '4', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '供应商', sh: true, sj: true, status: '节日慰问(档位)', status1: '已上架',
        ips: '开启',
        ipe: '查看商城订单，查看兑换订单，添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单',
        ip: '0.0.0.0',
        sp: '2024-08-29 17:31:38',
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
      this.$router.push('/product/addbrand')
    },
    // 初始化菜单列表，添加选中状态


    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
  }, computed: {
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