<template>
  <div class="list-container-user">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.key" placeholder="搜索类型" class="w120">
            <el-option label="用户名" value="username"></el-option>
            <el-option label="编号" value="id"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="请输入供应商名称" class="w150"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-card">


      <!-- 操作按钮 -->
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
          @click="handleBatchDelete">批量删除</el-button>
        <el-button type="primary" @click="handleAdd" size="small" icon="el-icon-plus">添加用户</el-button>
      </div>

      <!-- 添加/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%; margin: auto;">
          <el-form ref="userForm" :model="form" :rules="formRules" label-width="120px" label-position="right">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item label="密码：" prop="password" v-if="!isEdit">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>

            <el-form-item label="密码：" v-if="isEdit">
              <el-input v-model="form.password" type="password" placeholder="不修改请留空" show-password></el-input>
            </el-form-item>

            <el-form-item label="所属用户组：" prop="role_id">
              <el-select v-model="form.role_id" style="width: 100%;" filterable placeholder="请选择所属用户组">
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 表格 -->
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="tableLoading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="用户名" align="center" prop="username"></el-table-column>
        <el-table-column label="上次登录时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.logintime) }}
          </template>
        </el-table-column>
        <el-table-column label="上次登录IP" align="center" prop="loginip">
          <template slot-scope="scope">
            {{ scope.row.loginip || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="所属用户组" align="center" prop="role_name">
          <template slot-scope="scope">
            {{ scope.row.role_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { userList, addUser, getUser, editUser, delUser, roleList } from '@/api/modules/login'


export default {
  name: 'UserManage',

  data() {
    return {
      searchForm: {
        search_val: '', key: 'username'
      },
      form: {
        username: '',
        password: '',
        role_id: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请选择所属用户组', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogTitle: '添加用户',
      isEdit: false,
      editUserId: null,
      submitLoading: false,
      multipleSelection: [],
      tableData: [],
      tableLoading: false,
      roleOptions: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    }
  },

  mounted() {
    this.getRoleList()
    this.getUserList()
  },

  methods: {
    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 获取角色列表
    async getRoleList() {
      try {
        const res = await roleList({ page: 1, limit: 100 })
        if (res.code === 200) {
          this.roleOptions = res.data.list || res.data || []
        }
      } catch (error) {
        console.error('获取角色列表失败:', error)
      }
    },

    // 获取用户列表
    async getUserList() {
      this.tableLoading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search_key: this.searchForm.key,                 // ← 新增
          search_val: this.searchForm.search_val  // ← 修改
        }
        const res = await userList(params)
        if (res.code === 200) {
          const listData = res.data.list || res.data  // ← 新增兼容
          this.tableData = listData.data || listData || []  // ← 修改

          this.pagination.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取用户列表失败')
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.tableLoading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.getUserList()
    },

    // 重置搜索
    handleReset() {
      this.searchForm.username = ''
      this.pagination.page = 1
      this.getUserList()
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.getUserList()
    },

    // 页码改变
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getUserList()
    },

    // 表格选中变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 添加用户
    handleAdd() {
      this.dialogTitle = '添加用户'
      this.isEdit = false
      this.editUserId = null
      this.form = {
        username: '',
        password: '',
        role_id: ''
      }
      this.formRules.password[0].required = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm && this.$refs.userForm.clearValidate()
      })
    },

    // 编辑用户
    async handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.isEdit = true
      this.editUserId = row.id
      try {
        const res = await getUser({ id: row.id })
        if (res.code === 200) {
          this.form = {
            username: res.data.username,
            password: '',
            role_id: res.data.role_id
          }
          this.formRules.password[0].required = false
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.userForm && this.$refs.userForm.clearValidate()
          })
        } else {
          this.$message.error(res.msg || '获取用户信息失败')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.$message.error('获取用户信息失败')
      }
    },

    // 提交表单
    handleSubmit() {
      this.$refs.userForm.validate(async (valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          let res
          const params = {
            username: this.form.username,
            role_id: this.form.role_id
          }

          if (this.isEdit) {
            params.user_id = this.editUserId
            if (this.form.password) {
              params.password = this.form.password
            }
            res = await editUser(params)
          } else {
            params.password = this.form.password
            res = await addUser(params)
          }

          if (res.code === 200) {
            this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
            this.dialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '编辑失败' : '添加失败'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('提交失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除用户
    handleDelete(row) {
      this.$confirm(`确认删除用户 "${row.username}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delUser({ ids: String(row.id) })
          if (res.code === 200) {
            this.$message.success('删除成功')
            if (this.tableData.length === 1 && this.pagination.page > 1) {
              this.pagination.page--
            }
            this.getUserList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 批量删除
    handleBatchDelete() {
      const ids = this.multipleSelection.map(item => item.id).join(',')
      const names = this.multipleSelection.map(item => item.username).join('、')

      this.$confirm(`确认删除以下用户吗？<br>${names}`, '批量删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async () => {
        try {
          const res = await delUser({ ids })
          if (res.code === 200) {
            this.$message.success('批量删除成功')
            if (this.multipleSelection.length === this.tableData.length && this.pagination.page > 1) {
              this.pagination.page--
            }
            this.getUserList()
            this.multipleSelection = []
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.$refs.userForm && this.$refs.userForm.resetFields()
    }
  }
}
</script>

<style>
.list-container-user .serchForm {
  text-align: left;
}
</style>
<style lang="scss" scoped>
.list-container-user {
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
}
</style>