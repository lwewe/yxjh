<template>
  <div class="list-container">
     <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.status1" placeholder="手机号" class="w120">
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
            <el-select v-model="searchForm.status2" placeholder="注册时间" class="w120">
              <el-option label="标题" value="shanghai"></el-option>
              <el-option label="编号" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.status1" placeholder="降序" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>

       
          <el-form-item label="">

            <el-select v-model="searchForm.status1" placeholder="用户状态" class="w120">
              <el-option label="首页" value="shanghai"></el-option>
              <el-option label="精选" value="beijing"></el-option>
              <el-option label="尊享卡" value="beijing"></el-option>
              <el-option label="甄选品牌" value="beijing"></el-option>
            </el-select>
          </el-form-item>
         
  
  


          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>

          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="handleSearch()">导入信息</el-button>

          </el-form-item>
        </el-form>
      </el-card>
    <!--  -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 1" @click="delOptions()">批量删除</el-button>

        <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible = true">添加用户</el-button>
      </div>

      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%;margin: auto;">

          <el-form ref="form" :model="form" label-width="130px" label-position="right">

            <el-form-item label="标题：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="栏目：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="链接地址：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="福满满链接地址：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="排序：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>


            <el-form-item label="图片：" style="text-align: left;">
              <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">尺寸：240*240,大小：1M以内.</div>

              </el-upload>
              <el-dialog :visible.sync="dialogVisible2">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>



            <el-form-item label="是否发布：" style="text-align: left;">
              <el-radio-group v-model="form.resource">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布时间：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="编号" width="60" type="index" align="center">

        </el-table-column>


        <el-table-column label="缩略图" width="100" align="center">
          <template slot-scope="scope">
            <img src="../../assets/111.png" style="width: 60px;" alt="">

          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="170" align="center">
          <template slot-scope="scope">

            <el-switch v-model="scope.row.ipe">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="最后登录" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="次数" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="蛋叔ID" align="center">
          <template slot-scope="scope">
            {{ scope.row.ips }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="480" align="center" fixed="right">
          <template slot-scope="scope">

            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">收货地址</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">购物车</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">福利卡</el-button>
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
      dialogVisible2: false,
      form: {
        name: '',
        resource: '',
        desc: ''
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
.serchForm  .el-card__body{padding-top: 10px !important; /* 产品列表 */ }
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