<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.status1" placeholder="品牌名称" class="w120">
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
          <el-select v-model="searchForm.status2" placeholder="排序" class="w120">
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
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 品牌复选框区域 -->
    <el-card class="search-card">
      <el-checkbox-group v-model="selectedBrands" class="brand-checkbox-group">
        <el-checkbox v-for="item in brandOptions" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 保存按钮 -->
      <div class="save-btn-wrapper">
        <el-button type="primary" @click="handleSave()"  :loading="saveLoading">
          {{ saveLoading ? '保存中...' : '保存' }}
        </el-button>
        <!-- <el-button @click="handleReset()">重置</el-button> -->
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'UserManage',
  props: {},
  data() {
    return {
      searchForm: {
        keyword: '',
        status: '',
        status1: '',
        status2: '',
        status3: '',
        status4: '',
        tm1: '',
        tm2: ''
      },
      brandOptions: [
        { label: 'AA节日慰问', value: 3091 },
        { label: '以岭', value: 2704 },
        { label: '连花', value: 2705 },
        { label: '科沁万佳', value: 2706 },
        { label: '吉得利', value: 2707 },
        { label: '森田药妆', value: 2708 },
        { label: '天府菜油', value: 2709 },
        { label: '熊猫炒堂', value: 2710 },
        { label: '上水井', value: 2711 },
        { label: '宁化府', value: 2712 },
        { label: '三都港', value: 2714 },
        { label: '海之围场', value: 2715 },
        { label: '鲜逢', value: 2716 },
        { label: '谷心', value: 2718 },
        { label: '绿之源', value: 2722 },
        { label: '金嫂子', value: 2723 },
        { label: '焦亚', value: 2724 },
        { label: 'BRS卜任舒', value: 2725 },
        { label: '小佑烟火记', value: 2726 },
        { label: '宁鲜汇', value: 2727 },
        { label: '赤豪', value: 2728 },
        { label: '淘鲜拾光', value: 2729 },
        { label: '茧艾', value: 2632 },
        { label: '幽螺莎星', value: 2633 },
        { label: '泡泡出彩', value: 2634 },
        { label: '润荷', value: 2635 },
        { label: '水卫仕', value: 2636 },
        { label: '瑜然美', value: 2637 },
        { label: '金沙河', value: 2638 },
        { label: '贡苑', value: 2640 }
      ],
      selectedBrands: [],
      saveLoading: false
    }
  },
  mounted() {},
  created() {},
  methods: {
    handleSearch() {
      console.log('查询条件:', this.searchForm)
    },

    // 保存方法
    handleSave() {
      if (this.selectedBrands.length === 0) {
        this.$message.warning('请至少选择一个品牌')
        return
      }

      this.saveLoading = true

      // 模拟接口请求
      setTimeout(() => {
        console.log('保存的品牌IDs:', this.selectedBrands)
        this.$message.success('保存成功')
        this.saveLoading = false
      }, 1000)

      // 实际接口调用示例：
      // this.$axios.post('/api/saveBrands', {
      //   brandIds: this.selectedBrands
      // }).then(res => {
      //   this.$message.success('保存成功')
      //   this.saveLoading = false
      // }).catch(() => {
      //   this.saveLoading = false
      // })
    },

    // 重置方法
    handleReset() {
      this.selectedBrands = []
    }
  },
  computed: {},
  watch: {}
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

  .brand-checkbox-group {
    text-align: left;

    :deep(.el-checkbox) {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
      line-height: 32px;
    }

    :deep(.el-checkbox__label) {
      font-size: 14px;
      color: #333;
    }

    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #409EFF;
    }
  }

  .save-btn-wrapper {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
    text-align: left;
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>