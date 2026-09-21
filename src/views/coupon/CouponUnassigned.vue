<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.status1" placeholder="券号" class="w120">
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
          <el-select v-model="searchForm.status2" placeholder="编号" class="w120">
            <el-option label="标题" value="shanghai"></el-option>
            <el-option label="编号" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.status2" placeholder="降序" class="w120">
            <el-option label="标题" value="shanghai"></el-option>
            <el-option label="编号" value="beijing"></el-option>
          </el-select>
        </el-form-item>

 
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button type="success" @click="handleSearch()">导出</el-button>

        </el-form-item>
      </el-form>
    </el-card>
    <!--  -->
    <el-card class="search-card">

      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" @click="batchDelete" class="mr10" v-if="multipleSelection.length > 1">
          批量删除 ({{ multipleSelection.length }})
        </el-button>

        <el-input v-model="input" size="small" placeholder="请输入生成张数" style="width: 140px;margin-right: 10px;"></el-input>
        <el-button type="primary" size="small">
          生成
        </el-button>


        <el-input v-model="input1" size="small" placeholder="开始ID" style="width: 160px;margin-left: 10px;"></el-input>
        <el-input v-model="input2" size="small" placeholder="结束ID" style="width:160px;margin-left: 10px;"></el-input>
        <el-input v-model="input3" size="small" placeholder="价格" style="width: 90px;margin-left: 10px;"></el-input>
        <el-button type="primary" size="small" style="margin-left: 10px;">
          修改价格
        </el-button>
        <el-button type="primary" size="small" @click="dialogVisible = true">
          批量分配
        </el-button>

      </div>
<!--  -->
      <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="60%"
  :before-close="handleClose">
  <div>
    <el-form ref="form" :model="form" label-width="80px">
   
  <el-form-item label="影厅类型" style="text-align: left;">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="VIP" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>


 <el-form-item label="电影类型" style="text-align: left;">
    <el-checkbox-group v-model="form.type2">
      <el-checkbox label="普通" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="城市" style="text-align: left;">
    <el-checkbox-group v-model="form.type1">
      <el-checkbox label="全部" name="type"></el-checkbox>
       
    </el-checkbox-group>
  </el-form-item>
 
</el-form>
  </div>
  <div slot="footer" class="dialog-footer" style="text-align: center;">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">批量分配</el-button>
  </div>
</el-dialog>
<!--  -->
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-if="tableshow">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column label="编号" width="90" type="index" align="center">

        </el-table-column>



        <el-table-column label="券号" width="420" align="center">
          <template slot-scope="scope">
            <div class="txtleft">
              {{ scope.row.spmc }}
            </div>

          </template>
        </el-table-column>


        <el-table-column label="密码" align="center" width="190">
          <template slot-scope="scope">
            {{ scope.row.times }}
          </template>
        </el-table-column>


        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            未查看
          </template>
        </el-table-column>




        <el-table-column label="操作" width="230" fixed="right" align="center">
          <template slot-scope="scope">

            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>




    </el-card>

  </div>
</template>

<script>
import { menuList } from '@/router/menu'
export default {
  name: 'UserManage',  // 修改组件名
  props: {

  },
  data() {
    return {
      form: {
           
          type: [],
          type1: [],
          type2: [],
          
        },
      input1:'',
      input2:'',
      input3:'',
      input:'',
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
      // form: {
      //   name: '',
      //   resource: '',
      //   desc: ''
      // },
      menuList: [],
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: [{
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '1', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '超级管理员',
        ips: '开启', sh: false, sj: false,
        ipe: '超级管理员',
        tj: false, jx: true, status: '已审核', status1: '已上架',

      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '2', sh: true, sj: true, spmc: '联系客服怎么没有反应啊？客服页面根本没有。在这上面买的东西都没有详细的记录，想问问客服都联系不上...', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '商城供应商', status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加商城产品，查看商城订单，查看兑换订单',
        ip: '0.0.0.0',
        tj: false, jx: true,
        sp: '超级管理员',
      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '3', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
        name: '蛋糕供应商', sh: true, sj: true, status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单可添加商城产品，查看商城订单，查看兑换订单，',
        ip: '0.0.0.0',
        sp: '超级管理员',
        tj: false, jx: true

      }, {
        dj: '5', fb: '后台 ID:184', fb1: '北京如果未来科技有限公司', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '4', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '25.36', times: 'A',
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
    handleClose(done) {
       this.dialogVisible = false;
      },
    batchDelete() { },
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