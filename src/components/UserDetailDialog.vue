<template>
  <el-dialog 
    title="用户详情" 
    :visible.sync="dialogVisible" 
    width="50%" 
    :before-close="handleClose">
    <div v-loading="loading" style="width: 80%; margin: auto; text-align: left;">
      <template v-if="userDetail">
        <el-form label-width="130px" label-position="right">
          <el-form-item label="用户ID：">
            <el-input v-model="userDetail.id" readonly></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="userDetail.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input :value="userDetail.openid || '未绑定'" readonly></el-input>
          </el-form-item>
          <el-form-item label="头像：" style="text-align: left;">
            <img 
              v-if="userDetail.img" 
              :src="userDetail.img"
              style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
            <span v-else style="color: #909399;">暂无头像</span>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-tag :type="userDetail.sh == 0 ? 'success' : 'danger'" size="small">
              {{ userDetail.sh == 0 ? '正常' : '禁用' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="注册时间：">
            <el-input :value="formatTime(userDetail.add_time)" readonly></el-input>
          </el-form-item>
          <el-form-item label="最后登录：">
            <el-input :value="formatTime(userDetail.login_time)" readonly></el-input>
          </el-form-item>
          <el-form-item label="登录次数：">
            <el-input :value="userDetail.num || 0" readonly></el-input>
          </el-form-item>
          <el-form-item label="蛋叔ID：">
            <template v-if="userDetail.api_id === 0">
              <el-tag type="warning" size="small">未关联</el-tag>
            </template>
            <el-input v-else :value="userDetail.api_id" readonly></el-input>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { getRegister } from '@/api/modules/zhichong'
export default {
  name: 'UserDetailDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      userDetail: null
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    userId(val) {
      if (val) {
        this.loadUserDetail(val)
      }
    },visible(val) {
      if (val && this.userId) {
        this.loadUserDetail(this.userId)
      }
    }
  },
  methods: {
     async loadUserDetail(id) {
      if (!id) return  // 👈 新增判断
      
      this.loading = true
      this.userDetail = null  // 👈 新增：每次打开清空旧数据
      
      try {
        const res = await getRegister({ id })  // 👈 改为真实接口
        if (res.code === 200) {
          this.userDetail = res.data
        } else {
          this.$message.error(res.msg || '获取用户详情失败')
        }
      } catch (error) {
        console.error('获取用户详情失败:', error)
        this.$message.error('获取用户详情失败')
      } finally {
        this.loading = false
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>