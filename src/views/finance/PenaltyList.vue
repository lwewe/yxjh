<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">

        <el-form-item label="">
          <el-input v-model="searchForm.keyword" placeholder="罚款ID" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.keyword" placeholder="订单id" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.status1" placeholder="请选择类型">
            <el-option label="首页" value="shanghai"></el-option>
            <el-option label="精选" value="beijing"></el-option>
            <el-option label="尊享卡" value="beijing"></el-option>
            <el-option label="甄选品牌" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.status2" placeholder="请选择申诉状态">
            <el-option label="标题" value="shanghai"></el-option>
            <el-option label="编号" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="searchForm.keyword" placeholder="创建时间" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.keyword" placeholder="更新时间" class="w120"></el-input>
        </el-form-item>




        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>

        </el-form-item>


      </el-form>
    </el-card>

    <el-card class="search-card">

      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" @click="addPro()">导出</el-button>
        <el-button type="primary" size="small" @click="addPro()">批量申诉</el-button>
        <el-button type="primary" size="small" @click="addPro()">批量回复</el-button>

      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">

        <el-table-column label="id" width="60" type="index" align="center">
        </el-table-column>
        <el-table-column label="订单id" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column label="渠道" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.ipe }}
          </template>
        </el-table-column>

        <el-table-column label="罚款金额" align="center">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>


        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            {{ scope.row.p }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.p2 }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.p }}
          </template>
        </el-table-column>




        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">

            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">申诉进度</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">申诉</el-button>

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
        date: '19897',
        name: '重庆经韬', p2: '申诉被拒', p3: '2023-11-13 08:58:29',
        ips: '7153780',
        ipe: '超时无物流轨迹', num: '10.00', p: "2023-11-11 10:00:21"

      }, {
        date: '19897',
        name: '重庆经韬', p2: '申诉被拒', p3: '2023-11-13 08:58:29',
        ips: '7153780',
        ipe: '超时无物流轨迹', num: '10.00', p: "2023-11-11 10:00:21"
      }, {
        date: '19897',
        name: '重庆经韬', p2: '申诉被拒', p3: '2023-11-13 08:58:29',
        ips: '7153780',
        ipe: '超时无物流轨迹', num: '10.00', p: "2023-11-11 10:00:21"
      }, {
        date: '19897',
        name: '重庆经韬', p2: '申诉被拒', p3: '2023-11-13 08:58:29',
        ips: '7153780',
        ipe: '超时无物流轨迹', num: '10.00', p: "2023-11-11 10:00:21"
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