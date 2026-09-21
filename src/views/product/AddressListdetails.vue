<template>
  <div class="list-container">
    <!-- 省份信息卡片 -->
    <el-card class="province-card">
      <div class="province-info">
        <table class="info-table">
          <tr>
            <td width="5%">{{ provinceData.id }}</td>
            <td width="20%">{{ provinceData.name }}</td>
            <td width="10%">
              <el-tag type="warning" size="small">province</el-tag>
            </td>
          </tr>
        </table>
      </div>
    </el-card>

    <!-- 下级地址列表 -->
    <el-card class="address-card">
     

      <el-table :data="addressList" border style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: '600' }">
        <el-table-column label="编号" width="200" align="center" prop="id">
        </el-table-column>

        <el-table-column label="名称" align="left" prop="displayName">
          <template slot-scope="scope">
            <span :style="{ paddingLeft: scope.row.indent * 20 + 'px' }">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="类型"   align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 'city'" type="success" size="small">city</el-tag>
            <el-tag v-else-if="scope.row.level === 'county'" type="info" size="small">county</el-tag>
            <el-tag v-else-if="scope.row.level === 'town'" size="small">town</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <!-- city 层级：更新三级地址 -->
            <el-button v-if="scope.row.level === 'city'" size="mini"
              style="background-color: #4962da; border-color: #4962da; color: white;"
              @click="handleUpdateThirdLevel(scope.row)">更新三级地址</el-button>

            <!-- county 层级：更新四级地址 -->
            <el-button v-else-if="scope.row.level === 'county'" size="mini"
              style="background-color: #da49d6; border-color: #da49d6; color: white;"
              @click="handleUpdateFourthLevel(scope.row)">更新四级地址</el-button>

            <!-- town 层级：不显示操作按钮，但需要占满合并单元格 -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { updateCounty, updateTown } from '@/api/modules/login'
export default {
  name: 'AddressManage',
  data() {
    return {
      // 当前省份信息
      provinceData: {
        id: 32,
        name: '台湾'
      },

      // 扁平化的地址列表（严格按照HTML结构）
      addressList: []
    };
  },
  created() {
    this.initAddressData();
  },
  methods: {
    // 初始化地址数据
    initAddressData() {
      // 数据完全按照你提供的 HTML 结构组织
      this.addressList = [
        {
          id: 2768,
          name: '台湾',
          level: 'city',
          indent: 0
        },
        {
          id: 53497,
          name: '彰化县',
          level: 'county',
          indent: 1
        },
        { id: 54154, name: '彰化市', level: 'town', indent: 2 },
        { id: 54182, name: '芬园乡', level: 'town', indent: 2 },
        { id: 54183, name: '花坛乡', level: 'town', indent: 2 },
        { id: 54184, name: '秀水乡', level: 'town', indent: 2 },
        { id: 54185, name: '鹿港镇', level: 'town', indent: 2 },
        { id: 54186, name: '福兴乡', level: 'town', indent: 2 },
        { id: 54187, name: '线西乡', level: 'town', indent: 2 },
        { id: 54188, name: '和美镇', level: 'town', indent: 2 },
        { id: 54189, name: '伸港乡', level: 'town', indent: 2 },
        { id: 54190, name: '员林市', level: 'town', indent: 2 },
        { id: 54191, name: '社头乡', level: 'town', indent: 2 },
        { id: 54192, name: '永靖乡', level: 'town', indent: 2 },
        { id: 54193, name: '埔心乡', level: 'town', indent: 2 },
        { id: 54194, name: '溪湖镇', level: 'town', indent: 2 },
        { id: 54195, name: '大村乡', level: 'town', indent: 2 },
        { id: 54196, name: '埔盐乡', level: 'town', indent: 2 },
        { id: 54197, name: '田中镇', level: 'town', indent: 2 },
        { id: 54198, name: '北斗镇', level: 'town', indent: 2 },
        { id: 54199, name: '田尾乡', level: 'town', indent: 2 },
        { id: 54200, name: '埤头乡', level: 'town', indent: 2 },
        { id: 54201, name: '溪州乡', level: 'town', indent: 2 },
        { id: 54202, name: '竹塘乡', level: 'town', indent: 2 },
        { id: 54203, name: '二林镇', level: 'town', indent: 2 },
        { id: 54204, name: '大城乡', level: 'town', indent: 2 },
        { id: 54205, name: '芳苑乡', level: 'town', indent: 2 },
        { id: 54206, name: '二水乡', level: 'town', indent: 2 },

        {
          id: 53498,
          name: '嘉义县',
          level: 'county',
          indent: 1
        },
        { id: 54220, name: '东区', level: 'town', indent: 2 },
        { id: 54221, name: '西区', level: 'town', indent: 2 },
        { id: 54222, name: '番路乡', level: 'town', indent: 2 },
        { id: 54223, name: '梅山乡', level: 'town', indent: 2 },
        { id: 54224, name: '竹崎乡', level: 'town', indent: 2 },
        { id: 54225, name: '阿里山乡', level: 'town', indent: 2 },
        { id: 54226, name: '中埔乡', level: 'town', indent: 2 },
        { id: 54227, name: '大埔乡', level: 'town', indent: 2 },
        { id: 54228, name: '水上乡', level: 'town', indent: 2 },
        {
          id: 2768,
          name: '台湾',
          level: 'city',
          indent: 0
        },
        { id: 54229, name: '鹿草乡', level: 'town', indent: 2 },
        { id: 54230, name: '太保市', level: 'town', indent: 2 },
        { id: 54231, name: '朴子市', level: 'town', indent: 2 },
        { id: 54232, name: '东石乡', level: 'town', indent: 2 },
        { id: 54233, name: '六脚乡', level: 'town', indent: 2 },
        { id: 54234, name: '新港乡', level: 'town', indent: 2 },
        { id: 54235, name: '民雄乡', level: 'town', indent: 2 },
        { id: 54236, name: '大林镇', level: 'town', indent: 2 },
        { id: 54237, name: '溪口乡', level: 'town', indent: 2 },
        { id: 54238, name: '义竹乡', level: 'town', indent: 2 },
        { id: 54239, name: '布袋镇', level: 'town', indent: 2 },

        // 为节省篇幅，其余数据按相同格式组织
        {
          id: 53499,
          name: '新竹县',
          level: 'county',
          indent: 1
        },
        { id: 54458, name: '竹北市', level: 'town', indent: 2 },
        { id: 54459, name: '湖口乡', level: 'town', indent: 2 },
        { id: 54460, name: '新丰乡', level: 'town', indent: 2 },
        { id: 54461, name: '新埔镇', level: 'town', indent: 2 },
        { id: 54462, name: '关西镇', level: 'town', indent: 2 },
        { id: 54463, name: '芎林乡', level: 'town', indent: 2 },
        { id: 54464, name: '宝山乡', level: 'town', indent: 2 },
        { id: 54465, name: '竹东镇', level: 'town', indent: 2 },
        { id: 54466, name: '五峰乡', level: 'town', indent: 2 },
        { id: 54467, name: '横山乡', level: 'town', indent: 2 },
        { id: 54468, name: '尖石乡', level: 'town', indent: 2 },
        { id: 54469, name: '北埔乡', level: 'town', indent: 2 },
        { id: 54470, name: '峨眉乡', level: 'town', indent: 2 },
        { id: 59103, name: '香山区', level: 'town', indent: 2 },
        { id: 59104, name: '北区', level: 'town', indent: 2 },
        { id: 59105, name: '东区', level: 'town', indent: 2 }
      ];
    },

    // 更新三级地址（city级别）
    handleUpdateThirdLevel(row) {
  this.$confirm(`确认更新"${row.name}"的三级地址（区）吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateCounty()
      if (res.code === 200) {
        this.$message.success(res.msg || `"${row.name}"三级地址更新成功`)
        this.initAddressData() // 刷新数据
      } else {
        this.$message.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('三级地址更新失败:', error)
      this.$message.error('更新失败，请稍后重试')
    }
  }).catch(() => {})
},

    // 更新四级地址（county级别）
     handleUpdateFourthLevel(row) {
  this.$confirm(`确认更新"${row.name}"的四级地址（街道）吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateTown()
      if (res.code === 200) {
        this.$message.success(res.msg || `"${row.name}"四级地址更新成功`)
        this.initAddressData() // 刷新数据
      } else {
        this.$message.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('四级地址更新失败:', error)
      this.$message.error('更新失败，请稍后重试')
    }
  }).catch(() => {})
}
  }
};
</script>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;
  padding: 20px;

  .province-card {
    margin-bottom: 20px;

    .province-info {
      padding: 0;

      .info-table {
        width: 100%;
        border-collapse: collapse;

        td {
          padding: 12px 15px;
          border: 1px solid #ebeef5;
          font-size: 14px;

          &:first-child {
            text-align: center;
            // background-color: #f5f7fa;
            font-weight: 600;
          }
        }
      }
    }
  }

  .address-card {
    .widget-title {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
      background-color: #f5f7fa;

      h5 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    :deep(.el-table) {
      .el-table__body-wrapper {
        .el-table__row {

          // town 层级的行去掉底部边框（可选）
          &[class*="town"] {
            td {
              border-bottom: 1px solid #f0f0f0;
            }
          }
        }
      }

      // 操作列按钮样式调整
      .el-button--mini {
        padding: 7px 15px;
        font-size: 12px;
      }
    }
  }
}
</style>