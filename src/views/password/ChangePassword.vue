<template>
  <div class="list-container-password">
    <el-card class="search-card">
      <div style="width: 60%;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right">
          <el-form-item label="账号：">
            <div style="text-align: left;">admin</div>
          </el-form-item>

          <el-form-item label="旧密码：" prop="old_password">
            <el-input v-model="form.old_password" type="password" show-password></el-input>
          </el-form-item>

          <el-form-item label="新密码：" prop="new_password">
            <el-input v-model="form.new_password" type="password" show-password></el-input>
          </el-form-item>

          <el-form-item label="确认密码：" prop="confirm_password">
            <el-input v-model="form.confirm_password" type="password" show-password></el-input>
          </el-form-item>

          <el-form-item label="验证码：" prop="code" class="txtleft">
            <div class="dflex al-center">
              <el-input v-model="form.code" class="w120" placeholder="验证码"></el-input>
              <div class="captcha-img" @click="getCaptcha" title="点击刷新">
                <img v-if="captchaImg" :src="captchaImg" alt="验证码" style="height: 36px; cursor: pointer;">
                <span v-else style="line-height: 36px; padding: 0 15px; color: #999;">加载中...</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item style="text-align: left;">
            <el-button type="primary" @click="onSubmit" :loading="submitting">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCode, updatePassword } from '@/api/modules/myorder'

export default {
  name: 'ViewConfig',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      captchaImg: '',
      captchaKey: '',
      submitting: false,
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
        code: ''
      },
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        confirm_password: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    async getCaptcha() {
      try {
        const res = await getCode()
        if (res.code === 200) {
          this.captchaImg = res.data.img
          this.captchaKey = res.data.key
          this.form.code = ''
        } else {
          this.$message.error(res.msg || '获取验证码失败')
        }
      } catch (error) {
        console.error('获取验证码失败:', error)
        this.$message.error('获取验证码失败')
      }
    },

    // 提交
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        this.submitting = true
        try {
          const res = await updatePassword({
            old_password: this.form.old_password,
            new_password: this.form.new_password,
            confirm_password: this.form.confirm_password,
            code: this.form.code,
            code_key: this.captchaKey
          })

          if (res.code === 200) {
            this.$message.success(res.msg || '密码修改成功')
            this.form.old_password = ''
            this.form.new_password = ''
            this.form.confirm_password = ''
            this.form.code = ''
            this.getCaptcha()
          } else {
            this.$message.error(res.msg || '密码修改失败')
            this.getCaptcha()
          }
        } catch (error) {
          console.error('修改密码失败:', error)
          this.$message.error('修改密码失败')
          this.getCaptcha()
        } finally {
          this.submitting = false
        }
      })
    }
  }
}
</script>

<style scoped>
.list-container-password {
  font-size: 14px;
   
}

.dflex { display: flex; }
.al-center { align-items: center; }
.w120 { width: 120px; }

.captcha-img {
  margin-left: 10px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  height: 38px;
}
</style>