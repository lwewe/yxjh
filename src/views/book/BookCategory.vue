<template>
  <div class="list-container">
    <!-- 搜索栏 -->
    <!-- <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.catname" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button @click="resetSearch()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->

    <!-- 主内容区 -->
    <el-card class="search-card">
      <!-- <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addCategory()">添加分类</el-button>
      </div> -->

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        v-loading="loading" row-key="id" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column label="编号" min-width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="名称" min-width="250" align="left">
          <template slot-scope="scope">
            <span v-html="scope.row.tmp"></span>{{ scope.row.catname }}
          </template>
        </el-table-column>

        <el-table-column label="标识" min-width="150" prop="catflag" align="center"></el-table-column>

        <el-table-column label="级别" min-width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.flags === 1 ? '一级' : '二级' }}
          </template>
        </el-table-column>



        <el-table-column label="推荐首页" min-width="100" align="center">
          <!-- <template slot-scope="scope">
            <el-switch 
            v-if="scope.row.flags === 1"
              v-model="scope.row.tuij" 
              :active-value="1" 
              :inactive-value="0"
              @change="(val) => updateTuij(scope.row.id, val)"
            ></el-switch>

          </template> -->
          <template slot-scope="scope">
            <el-switch v-if="scope.row.flags === 1" v-model="scope.row.tuij" :active-value="1" :inactive-value="0"
              active-text=" " inactive-text=" " @change="(val) => updateTuij(scope.row.id, val)"></el-switch>
          </template>
        </el-table-column>


      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" style="text-align: left;width: 90%;">
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择上级分类" clearable>
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option v-for="item in parentOptions" :key="item.id" :label="item.catname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catname">
          <el-input v-model="form.catname" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="标识编码" prop="catflag">
          <el-input v-model="form.catflag" placeholder="请输入标识编码"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="px">
          <el-input v-model="form.px"></el-input>
          <span class="tips">填写整数,值越大,越靠前</span>
        </el-form-item>
        <el-form-item label="推荐首页" prop="tuij">
          <el-switch v-model="form.tuij" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center ;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  booksTsflclassList,
  booksTjtsflclass
} from '@/api/modules/video'

export default {
  name: 'BookCategory',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      loading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: '添加分类',
      isEdit: false,
      editId: null,
      page: 1,
      limit: 20,
      total: 0,
      searchForm: {
        catname: ''
      },
      form: {
        pid: 0,
        catname: '',
        catflag: '',
        px: 50,
        tuij: 0
      },
      formRules: {
        catname: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        catflag: [{ required: true, message: '请输入标识编码', trigger: 'blur' }]
      },
      tableData: [],
      parentOptions: []  // 上级分类选项（只显示一级分类）
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {}
        if (this.searchForm.catname) {
          params.catname = this.searchForm.catname
        }
        const res = await booksTsflclassList(params)
        if (res.code === 200) {
          this.tableData = res.data.list || []
          this.total = this.tableData.length
          // 构建上级分类选项（只取一级分类）
          this.parentOptions = this.tableData.filter(item => item.flags === 1)
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        catname: ''
      }
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },

    // 添加分类
    addCategory() {
      this.dialogTitle = '添加分类'
      this.isEdit = false
      this.editId = null
      this.form = {
        pid: 0,
        catname: '',
        catflag: '',
        px: 50,
        tuij: 0
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    // 编辑分类
    handleEdit(row) {
      this.dialogTitle = '修改分类'
      this.isEdit = true
      this.editId = row.id
      this.form = {
        pid: row.pid,
        catname: row.catname,
        catflag: row.catflag,
        px: row.px,
        tuij: row.tuij
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },

    // 提交表单
    async submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.submitLoading = true
        try {
          // TODO: 等待添加/编辑接口
          // 目前只有列表和推荐接口，添加/编辑接口需要补充
          this.$message.warning('请先补充添加/编辑接口')
          this.dialogFormVisible = false
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除分类
    handleDelete(id) {
      this.$confirm('确认删除该分类吗？删除后可能影响子分类，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // TODO: 等待删除接口
          this.$message.warning('请先补充删除接口')
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 修改排序
    async updatePx(id, px) {
      try {
        // TODO: 等待排序修改接口
        console.log('修改排序:', id, px)
        // this.$message.success('排序修改成功')
      } catch (error) {
        console.error('排序修改失败:', error)
      }
    },

    // 修改推荐状态
    // 修改推荐状态（带确认框）
    async updateTuij(id, tuij) {
      const targetStatus = tuij ? 1 : 0
      const actionText = targetStatus === 1 ? '推荐到首页' : '取消首页推荐'

      try {
        await this.$confirm(`确认${actionText}该分类吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，恢复原来的状态
        this.getList()
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await booksTjtsflclass({ id })
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          // 不需要重新获取列表，因为状态已经在界面上通过 v-model 更新了
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换推荐状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    // async updateTuij(id, tuij) {
    //   try {
    //     const res = await booksTjtsflclass({ id })
    //     if (res.code === 200) {
    //       this.$message.success('推荐状态修改成功')
    //     } else {
    //       this.$message.error(res.msg || '状态修改失败')
    //       this.getList() // 刷新恢复状态
    //     }
    //   } catch (error) {
    //     console.error('状态修改失败:', error)
    //     this.$message.error('状态修改失败')
    //     this.getList()
    //   }
    // }
  }
}
</script>

<style scoped>
.w120 {
  width: 120px;
}

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

.list-container {
  font-size: 14px;
}

.list-container .search-card {
  margin-bottom: 20px;
}

.list-container .search-card .search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.list-container .pagination {
  margin-top: 20px;
  text-align: right;
}

.tips {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
</style>