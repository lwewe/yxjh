<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;" v-if="tableshow">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 1" @click="delOptions()">批量删除</el-button>
        <el-button type="primary" @click="handleAdd" size="small" icon="el-icon-plus">添加角色</el-button>
      </div>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%;margin: auto;">

          <el-form ref="form" :model="form" label-width="100px" label-position="right">
            <el-form-item label="角色名称：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="角色描述：">
              <el-input v-model="form.remark" type="textarea"></el-input> <!-- 改：form.remark -->
            </el-form-item>

            <el-form-item label="是否开启：" style="text-align: left;">
              <el-radio-group v-model="form.status"> <!-- 改：form.status -->
                <el-radio :label="1">是</el-radio> <!-- 改：数值 -->
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-if="tableshow" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" width="60" type="index" align="center">
          <!-- <template slot-scope="scope">

            {{ scope.row.date }}
          </template> -->
        </el-table-column>

        <el-table-column label="角色名称" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="开启状态" width="150" align="center">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: space-around;align-items: center;">
              <span>
                {{ scope.row.ips ? '开启' : '关闭' }}
              </span>
              <!-- <el-switch v-model="scope.row.ips" @change="() => handleStatusChange(scope.row)" active-color="#409EFF">
              </el-switch> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" align="center">
          <template slot-scope="scope">
            {{ scope.row.remark }} <!-- 改：ipe → remark -->
          </template>
        </el-table-column>



        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="roleConfig(scope.$index, scope.row)">配置权限</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <div v-if="!tableshow">
        <div class="permission-tree">
          <!-- 顶部操作栏 -->
          <div class="tree-header">
            <div class="select-all">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                全选所有权限
              </el-checkbox>
              <span class="selected-count">已选择 {{ checkedNodeIds.length }} 个权限</span>
            </div>


          </div>



          <!-- 权限树 -->
          <!-- 权限树 -->
          <div class="permission-modules">
            <div v-for="node in currentNodeList" :key="node.id" class="module-item">
              <!-- 一级节点 -->
              <div class="module-header">
                <el-checkbox v-model="node.checked" :indeterminate="node.indeterminate"
                  @change="(val) => handleNodeChange(node, val)">
                  <span class="module-title">{{ node.title }}</span>
                </el-checkbox>
              </div>

              <!-- 子节点容器 -->
              <div class="module-children" v-if="node.children && node.children.length">
                <!-- 二级节点 -->
                <div v-for="child in node.children" :key="child.id" class="child-section">
                  <div class="child-header">
                    <el-checkbox v-model="child.checked" :indeterminate="child.indeterminate"
                      @change="(val) => handleNodeChange(child, val)">
                      <span>{{ child.title }}</span>
                    </el-checkbox>
                  </div>

                  <!-- 三级节点 -->
                  <div class="grandchildren" v-if="child.children && child.children.length">
                    <el-checkbox v-for="grandChild in child.children" :key="grandChild.id" v-model="grandChild.checked"
                      @change="(val) => handleChildChange(child, grandChild, val)" class="child-item">
                      {{ grandChild.title }}
                      <!-- <span class="permission-api" v-if="grandChild.url_api">({{ grandChild.url_api }})</span> -->
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tree-actions mt20">
            <el-button size="small" @click="backToList">返回列表</el-button>
            <el-button type="primary" size="small" @click="savePermission">保存权限</el-button>
          </div>
        </div>
      </div>

    </el-card>

  </div>
</template>

<script>
import {
  roleList, getRole,
  addRole,
  editRole,    // 注意：是 editRole 不是 updateRole
  delRole, roleAccess,
  setAccess
} from '@/api/modules/login'

export default {
  name: 'UserManage',  // 修改组件名
  props: {
    // 初始选中的权限
    value: {
      type: Array,
      default: () => []
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRoleId: null,      // ✅ 新增：当前配置权限的角色ID
      currentNodeList: [],      // ✅ 新增：权限树数据（替代 menuList）
      checkedNodeIds: [],       // ✅ 新增：已选中的节点ID
      dialogImageUrl: '',
      form: {
        pid: 0,
        id: null,        // 新增：编辑时的ID
        name: '',
        status: 1,       // 改：原来叫 resource
        remark: ''       // 改：原来叫 desc
      },
      dialogVisible: false,
      dialogTitle: '添加角色',  // 新增：对话框标题
      isEdit: false,           // 新增：是否编辑模式

      checkAll: false,
      isIndeterminate: false,
      tableshow: true,
      multipleSelection: [],
      tableData: []      // 改：清空为数组
    }
  },
  mounted() {

  },
  created() {

    this.getRoleList();
  },
  methods: {
    // 修改 collectCheckedNodesWithLevel 方法
    collectCheckedNodesWithLevel(nodes) {
      let result = []
      let addedIds = new Set() // 用于去重

      const traverse = (nodeList) => {
        nodeList.forEach(node => {
          // 判断节点是否应该被包含：节点本身被选中，或者有任何后代被选中
          if (node.checked || this.hasCheckedDescendant(node)) {
            if (!addedIds.has(node.id)) {
              result.push({
                node_id: node.id,
                level: node.level
              })
              addedIds.add(node.id)
            }
          }

          // 递归处理子节点
          if (node.children && node.children.length) {
            traverse(node.children)
          }
        })
      }

      traverse(nodes)
      return result
    },

    // 新增：检查节点是否有被选中的后代节点
    hasCheckedDescendant(node) {
      if (!node.children || node.children.length === 0) {
        return false
      }

      return node.children.some(child => {
        return child.checked || this.hasCheckedDescendant(child)
      })
    },

    // 修改 savePermission 方法，使用修正后的收集方法
    async savePermission() {
      try {
        // 获取所有需要保存的节点（包括父节点）
        const access = this.collectCheckedNodesWithLevel(this.currentNodeList)

        console.log('准备提交的权限数据:', access) // 调试用

        const res = await setAccess({
          rid: this.currentRoleId,
          access: JSON.stringify(access)
        })

        if (res.code === 200) {
          this.$message.success('权限设置成功')
          this.tableshow = true
          this.getRoleList()
        } else {
          this.$message.error(res.msg || '权限设置失败')
        }
      } catch (error) {
        console.error('保存权限失败:', error)
        this.$message.error('权限设置失败')
      }
    },

    // 同时需要修改 handleNodeChange，确保选中逻辑正确
    handleNodeChange(node, checked) {
      // 设置当前节点状态
      node.checked = checked
      node.indeterminate = false

      // 递归设置所有子节点
      if (node.children && node.children.length) {
        this.setChildrenChecked(node.children, checked)
      }

      // 更新父节点状态
      this.updateParentStatus(node)

      this.updateCheckedIds()
      this.updateCheckAllStatus()
    },

    // 修改 handleChildChange，确保选中子节点时父节点也被标记
    handleChildChange(parent, child, checked) {
      child.checked = checked
      child.indeterminate = false

      // 更新父节点状态
      if (checked) {
        // 如果选中子节点，父节点也应该被标记为选中
        parent.checked = true
        parent.indeterminate = false
        // 继续向上更新祖先节点
        this.updateAncestorStatus(parent)
      } else {
        // 如果取消选中，检查是否还有其他子节点被选中
        const checkedCount = parent.children.filter(c => c.checked).length
        if (checkedCount > 0) {
          parent.checked = true
          parent.indeterminate = false
        } else {
          parent.checked = false
          parent.indeterminate = false
          // 继续向上更新祖先节点
          this.updateAncestorStatus(parent)
        }
      }

      this.updateCheckedIds()
      this.updateCheckAllStatus()
    },

    // 新增：向上更新祖先节点状态
    updateAncestorStatus(node) {
      const findParentAndUpdate = (nodes, targetId) => {
        for (let n of nodes) {
          if (n.children && n.children.some(c => c.id === targetId)) {
            // 检查当前节点的子节点状态
            const checkedCount = n.children.filter(c => c.checked).length
            if (checkedCount > 0) {
              n.checked = true
              n.indeterminate = false
            } else {
              n.checked = false
              n.indeterminate = false
            }
            // 继续向上查找
            findParentAndUpdate(nodes, n.id)
            return
          }
          if (n.children) {
            findParentAndUpdate(n.children, targetId)
          }
        }
      }

      findParentAndUpdate(this.currentNodeList, node.id)
    },

    // 修改 updateParentStatus 方法
    updateParentStatus(node) {
      const findParent = (nodes, targetId) => {
        for (let n of nodes) {
          if (n.children && n.children.some(c => c.id === targetId)) {
            const checkedCount = n.children.filter(c => c.checked).length
            if (checkedCount > 0) {
              n.checked = true
              n.indeterminate = false
            } else {
              n.checked = false
              n.indeterminate = false
            }
            // 继续向上更新
            this.updateParentStatus(n)
            return
          }
          if (n.children) {
            findParent(n.children, targetId)
          }
        }
      }

      findParent(this.currentNodeList, node.id)
    },

    // 修改 buildPermissionTree，确保初始化时正确处理
    buildPermissionTree(nodes) {
      return nodes.map(node => {
        const newNode = {
          ...node,
          checked: node.access === 1,
          indeterminate: false
        }

        if (node.children && node.children.length) {
          newNode.children = this.buildPermissionTree(node.children)

          // 检查子节点状态，更新当前节点
          const hasCheckedChild = newNode.children.some(c => c.checked)
          if (hasCheckedChild && !newNode.checked) {
            newNode.checked = true
          }
        }

        return newNode
      })
    },
    backToList() {
      this.tableshow = true
      this.getRoleList()  // 刷新列表
    },
    // 新增：向上递归更新父节点状态

    // 处理节点变化（一级/二级）


    // 新增：递归设置子节点选中状态
    setChildrenChecked(children, checked) {
      children.forEach(child => {
        child.checked = checked
        child.indeterminate = false
        if (child.children && child.children.length) {
          this.setChildrenChecked(child.children, checked)
        }
      })
    },
    // 处理子节点变化
    
    // 处理全选
    handleCheckAllChange(checked) {
      this.setAllNodesChecked(this.currentNodeList, checked)
      this.updateCheckedIds()
      this.checkAll = checked
      this.isIndeterminate = false
    }
    ,
    // 递归设置所有节点选中状态
    setAllNodesChecked(nodes, checked) {
      nodes.forEach(node => {
        node.checked = checked
        node.indeterminate = false
        if (node.children && node.children.length) {
          this.setAllNodesChecked(node.children, checked)
        }
      })
    },

    // 更新已选中的ID列表
    updateCheckedIds() {
      this.checkedNodeIds = this.collectCheckedIds(this.currentNodeList)
    }
    ,
    // 收集所有选中的节点ID
    collectCheckedIds(nodes) {
      let ids = []
      nodes.forEach(node => {
        if (node.checked) {
          ids.push(node.id)
        }
        if (node.children && node.children.length) {
          ids = ids.concat(this.collectCheckedIds(node.children))
        }
      })
      return ids
    }
    ,
    // 更新全选状态
    updateCheckAllStatus() {
      const totalNodes = this.countAllNodes(this.currentNodeList)
      this.checkAll = this.checkedNodeIds.length === totalNodes && totalNodes > 0
      this.isIndeterminate = this.checkedNodeIds.length > 0 && this.checkedNodeIds.length < totalNodes
    },

    // 统计所有节点数量
    countAllNodes(nodes) {
      let count = 0
      nodes.forEach(node => {
        count++
        if (node.children && node.children.length) {
          count += this.countAllNodes(node.children)
        }
      })
      return count
    },
    // 收集所有选中节点的 id 和 level


    async getRoleList() {
      const res = await roleList();
      if (res.code == 200) {
        this.tableData = res.data.map(item => ({
          ...item, ips: item.status === 1
        }))
      }
    },

    // ② 提交表单（添加/修改）
    async handleSubmit() {
      const api = this.isEdit ? editRole : addRole  // 改：updateRole → editRole
      const res = await api(this.form)
      if (res.code === 200) {
        this.$message.success(this.isEdit ? '修改成功' : '添加成功')
        this.dialogVisible = false
        this.getRoleList()
      }
    },

    // ③ 删除单个
    async handleDelete(index, row) {
      try {
        await this.$confirm('确认删除吗？', '提示', {
          type: 'warning'
        })
        const res = await delRole({ ids: row.id })  // 改：deleteRole → delRole
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getRoleList()
        }
      } catch (error) {
        // 用户取消
      }
    },

    // ④ 批量删除（没有批量接口，循环调用）
    // ④ 批量删除
    async delOptions() {
      try {
        await this.$confirm(`确认删除选中的${this.multipleSelection.length}个角色吗？`, '提示', {
          type: 'warning'
        })

        const ids = this.multipleSelection.map(item => item.id).join(',')
        const res = await delRole({ ids: ids })  // 传递逗号分隔的字符串

        if (res.code === 200) {
          this.$message.success('批量删除成功')
          this.getRoleList()
        }
      } catch (error) {
        // 用户取消或删除失败
      }
    },

    // ⑤ 状态切换（没有单独的状态接口，调用修改接口）
    // ✅ 方法签名正确，但调用时需要注意
    async handleStatusChange(row) {
      const res = await editRole({
        id: row.id,
        status: row.ips ? 1 : 0,
        pid: 0,
        name: row.name,      // 可能需要传完整数据
        remark: row.remark
      })

      if (res.code !== 200) {
        row.ips = !row.ips
        this.$message.error('状态更新失败')
      } else {
        this.$message.success('状态更新成功')
        this.getRoleList();
      }
    },
    handleClose() {
      this.dialogVisible = false;
      // 清空表单
      this.form = {
        id: null,
        name: '',
        status: 1,
        remark: ''
      }
    },




    // 处理全选变化


    // 配置权限 - 点击按钮时调用
    async roleConfig(index, row) {
      this.currentRoleId = row.id
      this.tableshow = false

      // 调用接口获取该角色的权限
      const res = await roleAccess({ rid: row.id })
      if (res.code === 200) {
        // 处理权限树数据
        this.currentNodeList = this.buildPermissionTree(res.data.nodelist)
        // 获取已选中的节点ID
        this.checkedNodeIds = this.getCheckedIds(res.data.nodelist)
      }
    },// 构建权限树（添加选中状态）


    // 获取所有 access=1 的节点ID
    getCheckedIds(nodes) {
      let ids = []
      nodes.forEach(node => {
        if (node.access === 1) {
          ids.push(node.id)
        }
        if (node.children && node.children.length) {
          ids = ids.concat(this.getCheckedIds(node.children))
        }
      })
      return ids
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
      this.dialogTitle = '修改角色'
      this.isEdit = true;

      this.getRole(row.id)
      // this.form = {
      //   id: row.id,
      //   name: row.name,
      //   status: row.status,
      //   remark: row.remark,
      //   pid: 0,
      // }
      this.dialogVisible = true;


    },
    async getRole(id) {
      const res = await getRole({ id });
      if (res.code == 200) {
        this.form = res.data;
      }
    },
    // 
    handleAdd() {
      this.dialogTitle = '添加角色'
      this.isEdit = false
      this.form = {
        id: null,
        name: '',
        status: 1,
        remark: '',
        pid: 0,
      }
      this.dialogVisible = true
    },

  }, computed: {
    // 已选中的权限数量
    selectedCount() {
      return this.checkedNodeIds.length
    }
  },
  watch: {

  },
}
</script>

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

.permission-tree {
  background: #fff;
  border-radius: 4px;
  padding: 20px;

  .select-all {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .selected-count {
      font-size: 14px;
      color: #909399;

      &::before {
        content: '✓';
        color: #67C23A;
        margin-right: 5px;
        font-weight: bold;
      }
    }
  }

  .permission-modules {
    .module-item {
      margin-bottom: 20px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      .module-header {
        text-align: left;
        padding: 12px 15px;
        background: #f5f7fa;
        border-bottom: 1px solid #ebeef5;

        .el-checkbox {
          font-weight: 500;

          i {
            margin-right: 5px;
            color: #409EFF;
          }

          .module-title {
            font-size: 15px;

          }
        }
      }

      .module-children {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        flex-direction: column;

        .child-item {
          // width: calc(20% - 12px); // 每行5个
          // min-width: 120px;
          margin-right: 20px;

          .permission-path {
            font-size: 12px;
            color: #909399;
            margin-left: 5px;
          }

          &:hover {
            .permission-path {
              color: #409EFF;
            }
          }
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .permission-tree {
    .permission-modules {
      .module-item {
        .module-children {
          .child-item {
            // width: calc(25% - 12px); // 每行4个
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .permission-tree {
    .permission-modules {
      .module-item {
        .module-children {
          .child-item {
            // width: calc(33.33% - 10px); // 每行3个
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .permission-tree {
    .permission-modules {
      .module-item {
        .module-children {
          .child-item {
            // width: calc(50% - 8px); // 每行2个
          }
        }
      }
    }
  }
}

.permission-modules {
  .module-item {
    .module-children {
      .child-section {
        margin-bottom: 15px;
        padding: 10px;
        background: #fafafa;
        border-radius: 4px;

        .child-header {
          padding: 5px 0;
          font-weight: 500;
          text-align: left;
        }

        .grandchildren {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 10px 0 0 20px;

          .child-item {



            .permission-api {
              font-size: 11px;
              color: #909399;
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>