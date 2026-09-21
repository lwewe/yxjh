<template>
  <div class="list-container">
     
    <el-card class="search-card">

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">

        <el-table-column label="订单ID" width="60" type="index" align="center">
        </el-table-column>
        <el-table-column label="订单明细ID" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="渠道订单ID" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>

        <el-table-column label="渠道" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>


         <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
         <el-table-column label="结算金额" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
         <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
         <el-table-column label="商品发货状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
         <el-table-column label="退款状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
 <el-table-column label="最后更新时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>


        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">

            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">详情</el-button>

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
      dialogImageUrl: '',
      dialogVisible2: false,
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '', tm1: '', tm2: ''
      },
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: [{
        date: '1',
        name: '超级管理员',
        ips: '开启',
        ipe: false, num: 1,

      }, {
        date: '2',
        name: '商城供应商', num: 1,
        ips: '开启',
        ipe: true,
        ip: '0.0.0.0',
        sp: '超级管理员',
      }, {
        date: '3',
        name: '蛋糕供应商', num: 1,
        ips: '开启',
        ipe: false,
        ip: '0.0.0.0',
        sp: '超级管理员',
      }, {
        date: '4',
        name: '供应商',
        ips: '开启',
        ipe: true, num: 1,
        ip: '0.0.0.0',
        sp: '超级管理员',
      }]
    }
  },
  mounted() {

  },
  created() {

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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },

    handleClose() {
      this.dialogVisible = false;
    },



    // roleConfig() {
    //   this.tableshow = !this.tableshow;
    // },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
      }).catch(() => { })
    }
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