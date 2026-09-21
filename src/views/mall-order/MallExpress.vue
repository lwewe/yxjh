<template>
  <div class="list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w140">
            <el-option label="快递公司" value="name"></el-option>
            <el-option label="快递编号" value="code"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w140"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w140">
            <el-option label="排序" value="sort"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <!-- <el-button @click="resetSearch">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete">
          批量删除 ({{ multipleSelection.length }})
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">添加快递</el-button>
      </div>

      <!-- 添加/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <el-form ref="expressForm" :model="form" :rules="rules" label-width="150px" style="width: 90%;">
          <el-form-item label="快递公司：" prop="name">
            <el-input v-model="form.name" placeholder="请输入快递公司名称"></el-input>
          </el-form-item>
          <el-form-item label="快递编码：" prop="code">
            <el-input v-model="form.code" placeholder="请输入快递公司编码"></el-input>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model="form.sort" :min="0" :max="999" placeholder="请输入排序号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 数据表格 -->
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="tableLoading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="120" prop="id" align="center"></el-table-column>
        <el-table-column label="排序" width="180" prop="sort" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" :min="0" :max="999" style="width: 90px;" size="small"
              @change="(val) => updateSort(scope.row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="快递公司" prop="name" align="center" min-width="150"></el-table-column>
        <el-table-column label="快递公司编号" prop="code" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { expressList, addExpress, getExpress, editExpress, delExpress, editPx } from '@/api/modules/sorder'

export default {
  name: 'ExpressManage',
  data() {
    return {
      searchForm: {
        search_key: 'name',
        search_val: '',
        px_key: 'sort',
        px_val: 'desc'
      },
      form: {
        id: '',
        name: '',
        code: '',
        sort: 0
      },
      rules: {
        name: [{ required: true, message: '请输入快递公司名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      dialogVisible: false,
      dialogTitle: '添加快递',
      isEdit: false,
      submitting: false,
      multipleSelection: [],
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.tableLoading = true
      try {
        const params = {
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await expressList(params)
        if (res.code === 200 && res.data) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('获取列表失败')
        console.error(error)
      } finally {
        this.tableLoading = false
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },

    // 重置
    resetSearch() {
      this.searchForm = {
        search_key: 'name',
        search_val: '',
        px_key: 'sort',
        px_val: 'desc'
      }
      this.handleSearch()
    },

    // 翻页
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 打开添加弹窗
    openAddDialog() {
      this.dialogTitle = '添加快递'
      this.isEdit = false
      this.form = { id: '', name: '', code: '', sort: 0 }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.expressForm && this.$refs.expressForm.clearValidate()
      })
    },

    // 打开编辑弹窗
    async openEditDialog(row) {
      this.dialogTitle = '修改快递'
      this.isEdit = true
      this.dialogVisible = true

      // 先获取最新数据
      try {
        const res = await getExpress({ id: row.id })
        if (res.code === 200 && res.data) {
          this.form = {
            id: res.data.id,
            name: res.data.name,
            code: res.data.code || '',
            sort: res.data.sort
          }
        } else {
          // 获取失败则用表格数据
          this.form = { ...row }
        }
      } catch (error) {
        this.form = { ...row }
      }

      this.$nextTick(() => {
        this.$refs.expressForm && this.$refs.expressForm.clearValidate()
      })
    },

    // 提交表单
    submitForm() {
      this.$refs.expressForm.validate(async (valid) => {
        if (!valid) return

        this.submitting = true
        try {
          const params = {
            name: this.form.name,
            code: this.form.code,
            sort: this.form.sort
          }

          let res
          if (this.isEdit) {
            params.id = this.form.id
            res = await editExpress(params)
          } else {
            res = await addExpress(params)
          }

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
          console.error(error)
        } finally {
          this.submitting = false
        }
      })
    },

    // 修改排序
    async updateSort(row) {
      try {
        const res = await editPx({
          id: row.id,
          sort: row.sort
        })
        if (res.code === 200) {
          this.$message.success(res.msg || '排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.loadData() // 失败时刷新数据
        }
      } catch (error) {
        this.$message.error('排序修改失败')
        this.loadData()
      }
    },

    // 删除单个
    handleDelete(row) {
      this.$confirm('确认删除该快递公司吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delExpress({ ids: row.id })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delExpress({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.multipleSelection = []
            this.loadData()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.$refs.expressForm && this.$refs.expressForm.clearValidate()
    }
  }
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
}

.serchForm .el-card__body {
  padding-top: 10px !important;
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

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .dialog-footer {
    text-align: center;
    display: block;
  }
}

.w120 {
  width: 120px;
}

.w140 {
  width: 140px;
}
</style>