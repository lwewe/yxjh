<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      客户名称：北京媒体协会
    </el-card>
    <!--  -->
    <el-card class="search-card">


      <el-form :model="searchForm" class="search-form" style="text-align: left;" label-width="130px">
        <el-form-item label="首页图标：">
          <el-checkbox :indeterminate="isIndeterminate" v-model="searchForm.status1"
            @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item label="产品分类：">
          <el-checkbox :indeterminate="isIndeterminate1" v-model="searchForm.status2"
            @change="handleCheckAllChange1">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange1">
            <el-checkbox v-for="city in cities1" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item label="首页推荐：">
          <el-checkbox :indeterminate="isIndeterminate" v-model="searchForm.status1"
            @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item label="电影演出：">
          <el-radio-group v-model="searchForm.resource">
            <el-radio label="显示"></el-radio>
            <el-radio label="不显示"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Banner：">
                                 
          <el-checkbox-group v-model="searchForm.type">
            <el-checkbox label="粮油副食" name="type"></el-checkbox>
            <el-checkbox label="休闲零食" name="type"></el-checkbox>
            <el-checkbox label="悦享生活" name="type"></el-checkbox>
            <el-checkbox label="严选好物" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="价格限制：">
          <el-radio-group v-model="searchForm.resource1">
            <el-radio label="显示"></el-radio>
            <el-radio label="不显示"></el-radio>
          </el-radio-group>
        </el-form-item>



        <el-form-item class="mt20">
          <el-button type="primary"  @click="submitForm">保存</el-button>
          
        </el-form-item>



      </el-form>




    </el-card>

  </div>
</template>

<script>
const cityOptions = ['粮油副食', '美味零食', '洗护用品', '肉禽蛋品'];
const cityOptions1 = ['牛奶乳品', '幸福厨房', '家用电器', '美妆护理', '居家生活', '生鲜水果'];
export default {
  name: 'UserManage',  // 修改组件名
  props: {
  },
  data() {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京'],
      checkedCities1: ['上海', '北京'],
      cities: cityOptions,
      cities1: cityOptions1,
      isIndeterminate: true,
      isIndeterminate1: true,
      searchForm: {
        resource1: '',
        resource1: '', type: [],
        status: '',
        status1: '',
        status2: '',

      },
    }
  },
  mounted() {

  },
  created() {
    // this.initMenuList()
  },
  methods: {
    submitForm(){

    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },

    handleCheckAllChange1(val) {
      this.checkedCities1 = val ? cityOptions1 : [];
      this.isIndeterminate1 = false;
    },
    handleCheckedCitiesChange1(value) {
      let checkedCount1 = value.length;
      this.checkAll = checkedCount1 === this.cities1.length;
      this.isIndeterminate1 = checkedCount1 > 0 && checkedCount1 < this.cities1.length;
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