<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0" @click="batchDelete">批量删除</el-button>
        <el-button type="primary" @click="handleAdd" size="small" icon="el-icon-plus">添加节点</el-button>
       
      </div>

      <!-- 添加/编辑节点弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%; margin: auto;">
          <el-form ref="nodeForm" :model="nodeForm" :rules="formRules" label-width="120px" label-position="right">

            <el-form-item label="节点名称：" prop="title">
              <el-input v-model="nodeForm.title" placeholder="请输入节点名称"></el-input>
            </el-form-item>

            <el-form-item label="状态：" prop="status" style="text-align: left;">
              <el-radio-group v-model="nodeForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="类型：" prop="level">
              <el-select v-model="nodeForm.level" style="width: 100%;" placeholder="请选择节点类型">
                <el-option label="项目" :value="1"></el-option>
                <el-option label="模块" :value="2"></el-option>
                <el-option label="操作" :value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="父节点：" prop="pid">
              <el-select v-model="nodeForm.pid" style="width: 100%;" placeholder="请选择父节点" filterable clearable>
                <el-option label="根节点" :value="0"></el-option>
                <el-option v-for="item in flatNodeList" :key="item.id" :label="getNodeLabel(item)" :value="item.id"
                  :disabled="isParentDisabled(item.id)">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否显示：" prop="lmxs" style="text-align: left;">
              <el-radio-group v-model="nodeForm.lmxs">
                <el-radio :label="0">不显示</el-radio>
                <el-radio :label="1">显示</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="前端路径：" prop="url">
              <el-input v-model="nodeForm.url" placeholder="请输入前端路由路径"></el-input>
            </el-form-item>

            <el-form-item label="API路径：" prop="url_api">
              <el-input v-model="nodeForm.url_api" placeholder="请输入API接口路径"></el-input>
            </el-form-item>

            <el-form-item label="排序：" prop="sort" style="text-align: left;">
              <el-input-number v-model="nodeForm.sort" :min="1" :max="999"></el-input-number>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 树形表格 -->
      <el-table ref="multipleTable" :data="tableData" border row-key="id" default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="权限ID"  align="center" prop="id" min-width="100"></el-table-column>

        <el-table-column label="权限结构" align="center" prop="title" min-width="180">
          <template slot-scope="scope">

            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="API路径" align="center" prop="url_api" show-overflow-tooltip min-width="250"></el-table-column>
        <el-table-column label="前端路径" align="center" prop="url" show-overflow-tooltip min-width="250"></el-table-column>

        <el-table-column label="排序"  align="center" prop="sort" min-width="150"></el-table-column>

        <el-table-column label="类型"  align="center" min-width="150">
          <template slot-scope="scope">
            <el-tag :type="getLevelTagType(scope.row.level)" size="small" effect="plain" style="margin-right: 8px;">
              {{ getLevelText(scope.row.level) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="显示" align="center" min-width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.lmxs === 1 ? 'success' : 'info'" size="small">
              {{ scope.row.lmxs === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  nodeList,
  addNode,
  getNode,
  editNode,
  delNode
} from '@/api/modules/login'  // 根据实际路径调整

export default {
  name: 'NodeManage',

  data() {
    return {
      // 表单数据
      nodeForm: {
        id: null,
        title: '',
        status: 1,
        sort: 1,
        pid: 0,
        level: 1,
        lmxs: 0,
        url: '',
        url_api: ''
      },
      // 表单校验规则
      formRules: {
        title: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        lmxs: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogTitle: '添加节点',
      submitLoading: false,
      isEdit: false,  // 是否为编辑模式

      multipleSelection: [],
      tableData: [],

      // 扁平化的节点列表（用于父节点选择）
      flatNodeList: []
    }
  },

  mounted() {
    this.fetchNodeList()
  },

  methods: {
    // 获取节点列表
    async fetchNodeList() {
      try {
        const res = await nodeList({})
        if (res.code === 200) {
          this.tableData = res.data || []
          this.flattenNodeList(this.tableData)
        } else {
          this.$message.error(res.msg || '获取节点列表失败')
        }
      } catch (error) {
        console.error('获取节点列表失败:', error)
        this.$message.error('获取节点列表失败')
      }
    },

    // 将树形数据扁平化
    flattenNodeList(data) {
      this.flatNodeList = []
      const flatten = (list) => {
        list.forEach(item => {
          this.flatNodeList.push({
            id: item.id,
            title: item.title,
            level: item.level,
            pid: item.pid
          })
          if (item.children && item.children.length) {
            flatten(item.children)
          }
        })
      }
      flatten(data)
    },

    // 获取节点标签（显示层级缩进）
    getNodeLabel(item) {
      const prefix = '　'.repeat((item.level - 1) * 2)
      const levelText = ['', '项目', '模块', '操作'][item.level] || ''
      return `${prefix}├─ [${levelText}] ${item.title}`
    },

    // 判断父节点是否可选（编辑时不能选自己或子节点）
    isParentDisabled(nodeId) {
      if (!this.isEdit || !this.nodeForm.id) return false
      if (nodeId === this.nodeForm.id) return true

      // 检查是否是子节点
      const checkChildren = (list, targetId) => {
        for (const item of list) {
          if (item.id === targetId) return true
          if (item.children && item.children.length) {
            if (checkChildren(item.children, targetId)) return true
          }
        }
        return false
      }

      const findNode = (list, id) => {
        for (const item of list) {
          if (item.id === id) return item
          if (item.children) {
            const found = findNode(item.children, id)
            if (found) return found
          }
        }
        return null
      }

      const currentNode = findNode(this.tableData, this.nodeForm.id)
      if (currentNode) {
        return checkChildren(currentNode.children || [], nodeId)
      }
      return false
    },

    // 获取等级标签类型
    getLevelTagType(level) {
      const types = { 1: 'danger', 2: 'warning', 3: 'info' }
      return types[level] || 'info'
    },

    // 获取等级文本
    getLevelText(level) {
      const texts = { 1: '项目', 2: '模块', 3: '操作' }
      return texts[level] || '未知'
    },

    // 添加节点
    handleAdd() {
      this.dialogTitle = '添加节点'
      this.isEdit = false
      this.nodeForm = {
        id: null,
        title: '',
        status: 1,
        sort: 1,
        pid: 0,
        level: 1,
        lmxs: 0,
        url: '',
        url_api: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.nodeForm && this.$refs.nodeForm.clearValidate()
      })
    },

    // 编辑节点
    async handleEdit(row) {
      this.dialogTitle = '修改节点'
      this.isEdit = true

      try {
        const res = await getNode({ id: row.id })
        if (res.code === 200) {
          this.nodeForm = { ...res.data }
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.nodeForm && this.$refs.nodeForm.clearValidate()
          })
        } else {
          this.$message.error(res.msg || '获取节点信息失败')
        }
      } catch (error) {
        console.error('获取节点信息失败:', error)
        this.$message.error('获取节点信息失败')
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.nodeForm.validate(async (valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          const apiMethod = this.isEdit ? editNode : addNode
          const res = await apiMethod(this.nodeForm)

          if (res.code === 200) {
            this.$message.success(res.msg || (this.isEdit ? '修改成功' : '添加成功'))
            this.dialogVisible = false
            this.fetchNodeList()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          console.error('操作失败:', error)
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 删除节点
    handleDelete(row) {
      this.$confirm(`确定删除节点"${row.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNode({ ids: String(row.id) })
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.fetchNodeList()
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
    batchDelete() {
      const ids = this.multipleSelection.map(item => item.id)
      if (ids.length === 0) {
        this.$message.warning('请选择要删除的节点')
        return
      }

      this.$confirm(`确定删除选中的 ${ids.length} 个节点吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNode({ ids: ids.join(',') })
          if (res.code === 200) {
            this.$message.success(res.msg || '批量删除成功')
            this.fetchNodeList()
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 状态切换
    async handleStatusChange(row) {
      try {
        const res = await editNode({
          id: row.id,
          title: row.title,
          status: row.status,
          sort: row.sort,
          pid: row.pid,
          level: row.level,
          lmxs: row.lmxs,
          url: row.url || '',
          url_api: row.url_api || ''
        })
        if (res.code === 200) {
          this.$message.success('状态更新成功')
        } else {
          row.status = row.status === 1 ? 0 : 1  // 回滚
          this.$message.error(res.msg || '状态更新失败')
        }
      } catch (error) {
        row.status = row.status === 1 ? 0 : 1  // 回滚
        this.$message.error('状态更新失败')
      }
    },

    // 关闭弹窗
    handleClose(done) {
      this.$refs.nodeForm.resetFields()
      done()
    },

    // 表格选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
  }

  :deep(.el-table) {
    .el-table__row--level-1 {
      background-color: #f9f9f9;
    }
  }
}

.dialog-footer {
  .el-button {
    margin: 0 10px;
  }
}
</style>