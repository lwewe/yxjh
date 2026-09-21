<template>
  <div class="cakeCarouslist">
    <!-- 搜索区域 -->
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120" clearable>
            <el-option label="标题" value="title"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
            <el-option label="排序" value="px"></el-option>
            <el-option label="添加时间" value="add_time"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="发布状态" class="w120" clearable>
            <el-option label="全部" value="status"></el-option>
            <el-option label="已发布" value="1"></el-option>
             
            <el-option label="未发布" value="0"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <!-- <el-button @click="resetSearch()">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
         <el-button type="danger" size="small" icon="el-icon-delete" v-if="multipleSelection.length >1" @click="batchDelete()"
          :disabled="multipleSelection.length === 0">批量删除</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPro()">添加轮播图</el-button>
       
      </div>

      <!-- 添加/编辑轮播图弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="width: 80%;margin: auto;">
          <el-form ref="form" :model="form" :rules="formRules" label-width="100px" label-position="left">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>

            <el-form-item label="链接地址">
              <el-input v-model="form.url" placeholder="请输入链接地址"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="px">
              <el-input v-model="form.px" placeholder="请输入排序数字" type="number"></el-input>
            </el-form-item>

            <el-form-item label="图片" style="text-align: left;" prop="img">
              <el-upload class="avatar-uploader" :show-file-list="false" action="#" :http-request="customUpload"
                :before-upload="beforeUpload">
                <img v-if="form.img" :src="form.img" class="avatar" style="object-fit: contain;">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               
              </el-upload>
               <div class="fs12">尺寸:750*240,大小：1M以内</div>
            </el-form-item>

            <el-form-item label="是否发布" style="text-align: left;" prop="sh">
              <el-radio-group v-model="form.sh">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="发布时间" prop="add_time">
              <el-date-picker style="width: 100%;" v-model="form.add_time" format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()" :loading="submitLoading">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="tableLoading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="编号" width="80" prop="id" align="center"></el-table-column>

        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" @change="handleSortChange(scope.row)" type="number">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="图片" width="180" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="height: 50px;" alt="" v-if="scope.row.img">
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>

        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
              @change="handleStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current_page" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.per_page"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import {
  navListcake,
  addNavcake,
  getNavcake,
  editNavcake,
  delNavcake,
  editPxcake,
  editFbcake
} from '@/api/modules/login'

export default {
  name: 'CakeCarousel',
  data() {
    return {
      searchForm: {
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        sh: 'status',
        page: 1,
        limit: 10
      },
      dialogTitle: '添加轮播图',
      submitLoading: false,
      tableLoading: false,
      dialogVisible: false,
      form: {
        id: '',
        title: '',
        url: '',
        px: '',
        img: '',
        sh: '1',
        add_time: ''
      },
      formRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        px: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        sh: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
        add_time: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      multipleSelection: [],
      tableData: [],
      pageInfo: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 图片上传
    // 图片上传
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/cakenav')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        // 添加调试日志，查看响应数据结构
        console.log('上传响应完整数据:', response.data)
        console.log('响应状态:', response.data.status)
        console.log('响应code:', response.data.code)
        console.log('响应data:', response.data.data)

        const resData = response.data

        // 根据实际返回的数据结构调整
        if (resData.status === 200 || resData.code === 200) {
          // 尝试多种可能的数据路径
          const imgUrl = resData.data?.url || resData.data || resData.data_url
          console.log('获取到的图片URL:', imgUrl)

          this.form.img = imgUrl
          this.$message.success('上传成功')
        } else {
          this.$message.error(resData.msg || resData.message || '上传失败')
          this.form.img = ''
        }
      } catch (error) {
        console.error('上传失败:', error)
        if (error.response && error.response.data) {
          console.log('错误响应数据:', error.response.data)
          const errData = error.response.data
          if (errData.status === 200 || errData.code === 200) {
            const imgUrl = errData.data?.url || errData.data || errData.data_url
            this.form.img = imgUrl
            this.$message.success('上传成功')
            return
          }
        }
        this.$message.error('上传失败，请稍后重试')
        this.form.img = ''
      }
    },

    // 图片上传前验证
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },

    // 获取列表数据
    async getList() {
      this.tableLoading = true
      try {
        const params = { ...this.searchForm }
        const res = await navListcake(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.pageInfo = {
            total: res.data.total,
            per_page: res.data.per_page,
            current_page: res.data.current_page,
            last_page: res.data.last_page
          }
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('获取列表失败')
      } finally {
        this.tableLoading = false
      }
    },

    // 搜索
    handleSearch() {
      this.searchForm.page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        search_key: 'title',
        search_val: '',
        px_key: 'px',
        px_val: 'desc',
        sh: '',
        page: 1,
        limit: 10
      }
      this.getList()
    },

    // 添加
    addPro() {
      this.dialogTitle = '添加轮播图'
      this.form = {
        id: '',
        title: '',
        url: '',
        px: '',
        img: '',
        sh: '1',
        add_time: this.getCurrentTime()
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 编辑
    // 编辑
    async handleEdit(row) {
      this.dialogTitle = '修改轮播图'
      try {
        const res = await getNavcake({ id: row.id })
        if (res.code === 200) {
          // 将时间戳转换为日期字符串
          let addTimeValue = res.data.add_time
          if (typeof addTimeValue === 'number') {
            const date = new Date(addTimeValue * 1000)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            addTimeValue = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          }

          this.form = {
            id: res.data.id,
            title: res.data.title,
            url: res.data.url,
            px: res.data.px,
            img: res.data.img,
            sh: String(res.data.sh),
            add_time: addTimeValue  // 使用转换后的字符串
          }
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            const params = { ...this.form }

            // 直接提交，add_time 已经是字符串格式

            let res
            if (params.id) {
              res = await editNavcake(params)
            } else {
              res = await addNavcake(params)
            }

            if (res.code === 200) {
              this.$message.success(params.id ? '修改成功' : '添加成功')
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          } catch (error) {
            this.$message.error('操作失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNavcake({ ids: String(row.id) })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
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
        this.$message.warning('请选择要删除的项')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm('确认批量删除选中的轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delNavcake({ ids })
          if (res.code === 200) {
            this.$message.success('批量删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '批量删除失败')
          }
        } catch (error) {
          this.$message.error('批量删除失败')
        }
      }).catch(() => { })
    },

    // 排序修改
    async handleSortChange(row) {
      try {
        const res = await editPxcake({
          id: row.id,
          px: row.px
        })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '排序修改失败')

        }
      } catch (error) {
        this.$message.error('排序修改失败')
        this.getList()
      }
    },

    // 状态切换
    // async handleStatusChange(row) {
    //   try {
    //     const res = await editFbcake({ id: row.id })
    //     if (res.code === 200) {
    //       this.$message.success('状态修改成功')
    //       row.sh = res.data.sh
    //     } else {
    //       this.$message.error(res.msg || '状态修改失败')
    //       row.sh = row.sh === 1 ? 0 : 1
    //     }
    //   } catch (error) {
    //     this.$message.error('状态修改失败')
    //     row.sh = row.sh === 1 ? 0 : 1
    //   }
    // },
    async handleStatusChange(row) {

      const currentSh = row.sh; // 已经是切换后的新值
      const previousSh = currentSh === 1 ? 0 : 1; // 反推切换前的值
      const statusText = currentSh === 1 ? '发布' : '取消发布';

      try {
        await this.$confirm(`确定${statusText}该分类?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const res = await editFbcake({ id: String(row.id) });

        if (res.code === 200) {
          // 接口返回成功，使用后端返回的状态
          row.sh = res.data.sh;
          this.$message.success('状态修改成功');
          this.getList(); // 刷新列表
        } else {
          // 失败则回滚到之前的状态
          row.sh = row.sh === 1 ? 0 : 1
          this.$message.error(res.msg || '状态修改失败');
        }
      } catch (error) {
        // 取消或失败都回滚
        row.sh = row.sh === 1 ? 0 : 1
        if (error !== 'cancel' && error !== 'close') {
          this.$message.error('状态修改失败');
        }
      }
    },

    // 表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 分页
    handleSizeChange(val) {
      this.searchForm.limit = val
      this.searchForm.page = 1
      this.getList()
    },

    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getList()
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
    },




    // 格式化时间戳
    formatTime(value) {
      if (!value) return '-'

      // 如果是时间戳数字，转换
      if (typeof value === 'number') {
        const date = new Date(value * 1000)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      // 如果是字符串，直接返回
      return value
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
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

.avatar-uploader .el-upload {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

/* .avatar-uploader-icon {//zheshi这是控制总的
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 82px;
  line-height: 82px;
  text-align: center;
} */

.avatar {
  width: 178px;
  height: 82px;
  display: block;
  object-fit: contain;
}
</style>

<style lang="scss" scoped>
.cakeCarouslist {
  font-size: 14px;
 :deep(.avatar-uploader .el-upload ){
   border: 1px dashed #d9d9d9;  
   width: 178px;
    height:78px;
    line-height:78px;background-color: #ffffff;
  
}
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

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>