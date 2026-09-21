<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
      
        <el-form-item label="">
          <el-select v-model="searchForm.status1" placeholder="卡号" class="w120">
            <el-option label="首页" value="shanghai"></el-option>
            <el-option label="精选" value="beijing"></el-option>
            <el-option label="尊享卡" value="beijing"></el-option>
            <el-option label="甄选品牌" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.keyword" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
       
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        
         
      </el-form>
    </el-card>
    <!--  -->
    <el-card class="search-card">
      <div style="text-align: left; display: flex;justify-content: space-between;">
        <div>
          <el-button type="danger" size="small" v-if="multipleSelection.length > 1" 
            @click="delOptions()" style="margin-bottom: 20px;">批量删除</el-button>
           
        </div>
         
      </div>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-if="tableshow">
        <el-table-column type="selection" width="39">
        </el-table-column>
        <el-table-column label="编号" width="90" type="index" align="center">
        </el-table-column>
        <el-table-column label="卡号" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.fb1 }}
          </template>
        </el-table-column>
        <el-table-column label="密码" align="center">
          <template slot-scope="scope">
            {{ scope.row.jg }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
             {{ scope.row.jg }}
          </template>
        </el-table-column>
<el-table-column label="手机号" align="center">
          <template slot-scope="scope">
              {{ scope.row.jg }}
          </template>
        </el-table-column>

 

<el-table-column label="状态" align="center">
          <template slot-scope="scope">
              {{ scope.row.jg }}
          </template>
        </el-table-column>
 
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<el-drawer title="我是标题" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="60%">

      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form status-icon ref="ruleForm" :model="cardInfo" label-width="100px" style="width: 80%"
            class="demo-ruleForm ">
            <!-- 卡号：只读 -->
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="cardInfo.kh" readonly />
            </el-form-item>
            <!-- 密码：只读 -->
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="cardInfo.mm" readonly />
            </el-form-item>
            <!-- 价格：带增减操作 -->
            <el-form-item label="价格：" style="text-align: left;">
              <div class="price-control">
                <!-- <span class="current-price"> -->
                <!-- <span class="fs10">¥ </span>{{ cardInfo.price }}</span> -->
                <span class="addBorder">
                  <el-input v-model="cardInfo.price" placeholder="0.00" style="width: 100px;margin-right: 10px;"
                    readonly />
                </span>
                <span class="price-spacer"></span>
                <el-select v-model="cardInfo.addtype" style="width: 80px;margin-right: 10px;">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input v-model="cardInfo.addprice" placeholder="价格" style="width: 100px;margin-right: 10px;" />
                <el-button type="success" @click="savePrice">保存</el-button>
              </div>
            </el-form-item>
            <!-- 分类：下拉选择（完整选项） -->
            <el-form-item label="分类：">
              <el-select v-model="cardInfo.gid" filterable placeholder="请选择分类" style="width: 100%">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- 兑换购物卡：是/否下拉 -->
            <el-form-item label="兑换购物卡：" style="text-align: left;">
              <el-select v-model="cardInfo.shop" style="width: 80px; ">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
            <!-- 激活状态：只读 -->
            <el-form-item label="激活状态：" class="addBorder">
              <el-input v-model="cardInfo.activeStatus" readonly />
            </el-form-item>
            <!-- 兑换用户：只读 -->
            <el-form-item label="兑换用户：" class="addBorder">
              <el-input v-model="cardInfo.exchangeUser" readonly />
            </el-form-item>
            <!-- 隐藏字段：卡ID -->
            <el-form-item style="display: none">
              <el-input v-model="cardInfo.id" />
            </el-form-item>
            <el-form-item class="txtleft">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>
          <!--  -->

          <el-table :data="tableData5" border style="width: 100%" max-height="300" :header-cell-style="headerCellStyle">
            <el-table-column prop="bhh" label="编号" align="center">
            </el-table-column>
            <el-table-column prop="jgg" label="价格" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.ztt == '后台充值'" class="dangerCl">后台充值</span>
                <span v-if="scope.row.ztt == '后台扣除'" class="blueCl">后台扣除</span>
              </template>
            </el-table-column>
            <el-table-column prop="sj" label="时间" align="center" width="200">
            </el-table-column>
            <el-table-column prop="dd" label="订单号" align="center">
            </el-table-column>
            <el-table-column prop="jy" label="交易号" align="center">
            </el-table-column>
            <el-table-column prop="sf" label="实付金额" align="center">
            </el-table-column>
          </el-table>
          <!--  -->
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'UserManage',  // 修改组件名
  props: {

  },
  data() {
    return {
       headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266'
      }, // 分类选项（从原 HTML 提取）
      categoryOptions: [
        { value: 913, label: '913-北京首创大气环境科技股份有限公司-冯伟伦[超级卡]' },
        { value: 912, label: '912-北京市丰台怡海幼儿园工会委员会-冯伟伦[蛋糕卡]' },
        { value: 911, label: '911-生态环境部环境与经济政策研究中心工会-赵文吉[超级卡]' },
        { value: 910, label: '910-延期卡-超级卡-延期卡[超级卡]' },
        { value: 909, label: '909-北京好生活网络科技有限公司-冯思齐[超级卡]' },
        { value: 908, label: '908-北京市通州区东里幼儿园-赵文吉[蛋糕卡]' },
        { value: 907, label: '907-北京市丰台怡海幼儿园工会委员会-韩子翰[蛋糕卡]' },
        { value: 906, label: '906-延期卡-蛋糕卡-延期卡[蛋糕卡]' },
        { value: 905, label: '905-北京永林中西医结合医院有限公司工会委员会-冯思齐[超级卡]' },
        { value: 904, label: '904-延期卡-蛋糕卡-延期卡[蛋糕卡]' },
        // ... 更多选项（您需要从原 HTML 中完整复制）
        { value: 690, label: '690-北京市大兴区第九幼儿园-韩子翰[超级卡]' }
      ],
      tableData5: [{
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台扣除',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台扣除',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台扣除',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }, {
        bhh: '229635					',
        jgg: '5.00',
        ztt: '后台充值',
        sj: '2026-04-14 10:27:21	',
        dd: '-',
        jy: '-',
        sf: '0.00',
      }],cardInfo: {
        id: '257536',
        kh: 'YL202410257536',
        mm: '344641',
        price: '0.00',
        addtype: '1',
        addprice: '',
        gid: 690,
        shop: 0,
        activeStatus: '已绑定',
        exchangeUser: '53910    兑换时间2025-12-10 08:37:23'
      },
      drawer: false,
      direction: 'rtl',
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      status2: '',
      cardNum: '',
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

      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: [{
        dj: '5', fb: '0.00', fb1: 'YL202603311007', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '1', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '158458', times: 'A',
        name: '超级管理员',
        ips: '开启', sh: false, sj: false,
        ipe: '超级管理员',
        tj: false, jx: true, status: '已审核', status1: '已上架',

      }, {
        dj: '5', fb: '0.00', fb1: 'YL202603311007', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '2', sh: true, sj: true, spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '158458', times: 'A',
        name: '商城供应商', status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加商城产品，查看商城订单，查看兑换订单',
        ip: '0.0.0.0',
        tj: false, jx: true,
        sp: '超级管理员',
      }, {
        dj: '5', fb: '0.00', fb1: 'YL202603311007', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '3', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '158458', times: 'A',
        name: '蛋糕供应商', sh: true, sj: true, status: '已审核', status1: '已上架',
        ips: '开启',
        ipe: '可添加蛋糕产品，添加蛋糕品牌，查看蛋糕订单可添加商城产品，查看商城订单，查看兑换订单，',
        ip: '0.0.0.0',
        sp: '超级管理员',
        tj: false, jx: true

      }, {
        dj: '5', fb: '0.00', fb1: 'YL202603311007', yj: '[节日慰问]', yj1: '[清洁洗护]',
        date: '4', spmc: '熊猫炒堂', ghj: 'Jmane home aels', jg: '158458', times: 'A',
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
    handleClose() {
      this.drawer = false
    },
    delOptions() {

    },
    ssignedCard() {
      this.$confirm('确定分配吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => { })
    },
    editPrice(index, row) {
      this.$confirm('确定修改价格吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => { })
    },
    addCards(index, row) {
      if (this.cardNum == '') {
        this.$message({
          message: '请输入需要生成福利卡数量',
          type: 'warning'
        });
      } else {
        this.$confirm('确认生成' + this.cardNum + '张福利卡吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => { })

      }

    },
    savePrice(){},
    handleDelete(index, row) {
       this.drawer = true
    },
    handleSearch() { },

    addPro() {
      // this.dialogVisible = false;
      this.$router.push('/product/addbrand')
    },
    // 初始化菜单列表，添加选中状态


    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
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