<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.status1" placeholder="结算状态">
            <el-option label="全部" value="shanghai"></el-option>
            <el-option label="未申请" value="beijing"></el-option>
            <el-option label="商户已确认" value="beijing"></el-option>
            <el-option label="已确认" value="beijing"></el-option>
            <el-option label="发票已开" value="beijing"></el-option>
            <el-option label="发票已收" value="beijing"></el-option>
            <el-option label="付款成功" value="beijing"></el-option>
            <el-option label="付款中" value="beijing"></el-option>
            <el-option label="付款驳回" value="beijing"></el-option>
            

          </el-select>
        </el-form-item>
        <el-form-item label="">
          <!-- <el-select v-model="searchForm.status2" placeholder="结算时间">
            <el-option label="标题" value="shanghai"></el-option>
            <el-option label="编号" value="beijing"></el-option>
          </el-select> -->
          <el-date-picker v-model="searchForm.status2" type="month" placeholder="选择月">
          </el-date-picker>


        </el-form-item>

        <el-form-item label="">
          <el-date-picker v-model="date1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-card">
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">
        <el-table-column label="ID" width="60" type="index" align="center">
        </el-table-column>
        <el-table-column label="结算月" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="商户名称" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="发货金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p1 }}
          </template>
        </el-table-column>
        <el-table-column label="退款金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p }}
          </template>
        </el-table-column>
        <el-table-column label="罚款金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p2 }}
          </template>
        </el-table-column>
        <el-table-column label="工单奖励" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p3 }}
          </template>
        </el-table-column>
        <el-table-column label="赔付金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p4 }}
          </template>
        </el-table-column>
        <el-table-column label="售后垫付运费" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p4 }}
          </template>
        </el-table-column>
        <el-table-column label="结算金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p5 }}
          </template>
        </el-table-column>
        <el-table-column label="实际结算金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p11 }}
          </template>
        </el-table-column>
        <el-table-column label="差异金额" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p6 }}
          </template>
        </el-table-column>
        <el-table-column label="结算状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p3 }}
          </template>
        </el-table-column>
        <el-table-column label="商户确认时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.p22 }}
          </template>
        </el-table-column>
        <el-table-column label="付款申请时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.p33 }}
          </template>
        </el-table-column>
        <el-table-column label="确认时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.p11 }}
          </template>
        </el-table-column>
        <el-table-column label="最后更新时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.p22 }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.p3 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="720" align="center" fixed="right">
          <template slot-scope="scope">

            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">订单导出</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">导出售后垫付运费</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看订单</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">工单奖励明细</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">提交差异</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">结账申请</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">发票信息</el-button>
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
    return {date1:"",
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
        date: '39515',
        name: '2026年03月',
        ips: '重庆经韬成业商贸有限公司',
        ipe: '5576.00', num: '136.00',p:'20.00',
        p1: '5415.80', p2: '0.00',p3:'付款中',p4:'0.00',p5:'3',p6:'-',
        p11: '2026-04-02 10:37:23', p22: '2026-04-02 10:37:23',p33:'2026-04-07 10:00:44',
      },{
        date: '39515',
        name: '2026年03月',
        ips: '重庆经韬成业商贸有限公司',
        ipe: '5576.00', num: '136.00',p:'20.00',
        p1: '5415.80', p2: '0.00',p3:'付款中',p4:'0.00',p5:'3',p6:'-',
        p11: '2026-04-02 10:37:23', p22: '2026-04-02 10:37:23',p33:'2026-04-07 10:00:44',
      },{
        date: '39515',
        name: '2026年03月',
        ips: '重庆经韬成业商贸有限公司',
        ipe: '5576.00', num: '136.00',p:'20.00',
        p1: '5415.80', p2: '0.00',p3:'付款中',p4:'0.00',p5:'3',p6:'-',
        p11: '2026-04-02 10:37:23', p22: '2026-04-02 10:37:23',p33:'2026-04-07 10:00:44',
      }
    
    
    ]
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
.serchForm .el-input__icon {
    line-height: 30px !important;
}
.serchForm .el-date-editor .el-range-separator {

    line-height: 30px !important;
    width: 8% !important;
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