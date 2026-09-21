<template>
  <div class="list-container">
    <el-card class="search-card serchForm">
      <span class="sizeCl6">客户名称：</span> {{ cardInfo.company || '' }}
    </el-card>

    <el-card class="search-card">
      <el-form :model="purviewForm" class="search-form" style="text-align: left;" label-width="130px"
        v-loading="loading">
        <!-- 首页图标 -->
        <el-form-item label="首页图标：">
          <el-checkbox :indeterminate="sytbIndeterminate" v-model="sytbCheckAll"
            @change="handleSytbCheckAll">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="purviewForm.sytb" @change="handleSytbChange">
            <el-checkbox v-for="item in sytubiaoList" :label="item.id" :key="item.id">{{ item.title }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 产品分类 -->
        <!-- <el-form-item label="产品分类：">
          <el-checkbox :indeterminate="cpflIndeterminate" v-model="cpflCheckAll" @change="handleCpflCheckAll">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="purviewForm.cpfl" @change="handleCpflChange">
            <el-checkbox v-for="item in productFenFu" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->

        <!-- 产品分类 -->
        <el-form-item label="产品分类：">
          <el-checkbox :indeterminate="cpflIndeterminate" v-model="cpflCheckAll"
            @change="handleCpflCheckAll">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <div v-for="parent in productFenFu" :key="parent.id" style="margin-bottom: 8px;">
            <el-checkbox :value="purviewForm.cpfl.includes(parent.id)"
              @change="(val) => handleCpflSingleChange(parent.id, val)">
              <strong>{{ parent.name }}</strong>
            </el-checkbox>
            <!-- 二级分类，仅在该一级分类被勾选时展示 -->
            <span v-if="purviewForm.cpfl.includes(parent.id)" style="margin-left: 20px;">
              <el-checkbox v-for="child in getChildrenByPid(parent.id)" :key="child.id" :label="child.id"
                v-model="purviewForm.cpzl" @change="handleCpflChange">
                {{ child.name }}
              </el-checkbox>
            </span>
          </div>
        </el-form-item>
        <!-- 首页推荐 -->
        <el-form-item label="首页推荐：">
          <el-checkbox :indeterminate="sytjIndeterminate" v-model="sytjCheckAll"
            @change="handleSytjCheckAll">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="purviewForm.sytj" @change="handleSytjChange">
            <el-checkbox v-for="item in productFenSytj" :label="item.id" :key="item.id">{{ item.syname || item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 电影演出 -->
        <el-form-item label="电影演出：">
          <el-radio-group v-model="purviewForm.yc">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Banner(产品) - 节日慰问下的子分类 -->
        <el-form-item label="Banner：">
          <el-checkbox-group v-model="purviewForm.lbfl">
            <el-checkbox v-for="item in lbflOptions" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 价格限制 -->
        <el-form-item label="价格限制：">
          <el-radio-group v-model="purviewForm.pricexz">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1">限制500以上产品</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="mt20">
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { purview, editPurview } from '@/api/modules/card'

export default {
  name: 'PerView',
  data() {
    return {
      loading: false,
      submitting: false,
      kid: '',
      cardInfo: {},
      // 接口返回的原始数据
      sytubiaoList: [],      // 首页图标列表
      productFenFu: [],      // 产品一级分类
      productFenSytj: [],    // 首页推荐
      lanmuList: [],         // 栏目列表
      productFenAll: [],     // 所有产品分类
      // 表单
      purviewForm: {
        sytb: [],     // 首页图标id
        cpfl: [],     // 产品一级分类id
        cpzl: [],     // 产品二级分类id
        sytj: [],     // 首页推荐id
        yc: 0,        // 电影演出
        lbfl: [],     // Banner分类
        pricexz: 0,   // 价格限制
        lanmu: ''     // 栏目id
      },
      // 全选状态
      sytbCheckAll: false,
      sytbIndeterminate: false,
      cpflCheckAll: false,
      cpflIndeterminate: false,
      sytjCheckAll: false,
      sytjIndeterminate: false
    }
  },
  computed: {
    // Banner选项 - 分类162(节日慰问)下的子类
    lbflOptions() {
      return this.productFenAll.filter(item => item.pid === 162)
    }
  },
  mounted() {
    this.kid = this.$route.params.id || ''
    if (this.kid) this.getPurview()
  },
  methods: {
    async getPurview() {
      this.loading = true
      try {
        const res = await purview({ kid: this.kid })
        if (res.code === 200) {
          const data = res.data
          this.cardInfo = data.card || {}
          this.sytubiaoList = data.sytubiao || []
          this.productFenFu = data.product_fen_fu || []
          this.productFenSytj = data.product_fen_sytj || []
          this.productFenAll = data.product_fen_all || []

          // 回显已保存的权限
          const check = data.checkpurview || {}
          this.purviewForm = {
            sytb: check.sytb ? check.sytb.split(',').map(Number) : [],
            cpfl: check.cpfl ? check.cpfl.split(',').map(Number) : [],
            cpzl: check.cpzl ? check.cpzl.split(',').map(Number) : [],
            sytj: check.sytj ? check.sytj.split(',').map(Number) : [],
            yc: check.yc !== undefined ? check.yc : 0,
            lbfl: check.lbfl ? check.lbfl.split(',').map(Number) : [],
            pricexz: check.pricexz !== undefined ? check.pricexz : 0,
            lanmu: check.lanmu || ''
          }
          this.updateCheckAllState()
        }
      } catch (e) { this.$message.error('请求失败') }
      finally { this.loading = false }
    },

    // ===== 全选/反选逻辑 =====
    updateCheckAllState() {
      const sytbLen = this.purviewForm.sytb.length
      this.sytbCheckAll = sytbLen === this.sytubiaoList.length
      this.sytbIndeterminate = sytbLen > 0 && sytbLen < this.sytubiaoList.length

      const cpflLen = this.purviewForm.cpfl.length
      this.cpflCheckAll = cpflLen === this.productFenFu.length
      this.cpflIndeterminate = cpflLen > 0 && cpflLen < this.productFenFu.length

      const sytjLen = this.purviewForm.sytj.length
      this.sytjCheckAll = sytjLen === this.productFenSytj.length
      this.sytjIndeterminate = sytjLen > 0 && sytjLen < this.productFenSytj.length
    },

    handleSytbCheckAll(val) {
      this.purviewForm.sytb = val ? this.sytubiaoList.map(i => i.id) : []
      this.sytbIndeterminate = false
    },
    handleSytbChange() { this.updateCheckAllState() },

    // handleCpflCheckAll(val) {
    //   this.purviewForm.cpfl = val ? this.productFenFu.map(i => i.id) : []
    //   this.cpflIndeterminate = false
    // },
    handleCpflChange() { this.updateCheckAllState() },
    // 获取某个一级分类下的二级分类
    getChildrenByPid(pid) {
      return this.productFenAll.filter(item => item.pid === pid)
    },

    // 单个一级分类勾选变化
    handleCpflSingleChange(pid, checked) {
      if (checked) {
        if (!this.purviewForm.cpfl.includes(pid)) {
          this.purviewForm.cpfl.push(pid)
        }
      } else {
        const index = this.purviewForm.cpfl.indexOf(pid)
        if (index > -1) {
          this.purviewForm.cpfl.splice(index, 1)
        }
        // 取消一级分类时，同步取消该分类下的所有二级分类
        const childrenIds = this.getChildrenByPid(pid).map(c => c.id)
        this.purviewForm.cpzl = this.purviewForm.cpzl.filter(id => !childrenIds.includes(id))
      }
      this.updateCheckAllState()
    },

    // 修改原有的 handleCpflCheckAll 方法
    handleCpflCheckAll(val) {
      if (val) {
        // 全选：勾选所有一级分类
        this.purviewForm.cpfl = this.productFenFu.map(i => i.id)
        // 全选：勾选所有对应的二级分类（父级在一级分类中的）
        this.purviewForm.cpzl = this.productFenAll
          .filter(item => this.purviewForm.cpfl.includes(item.pid))
          .map(i => i.id)
      } else {
        this.purviewForm.cpfl = []
        this.purviewForm.cpzl = []
      }
      this.cpflIndeterminate = false
    },
    handleSytjCheckAll(val) {
      this.purviewForm.sytj = val ? this.productFenSytj.map(i => i.id) : []
      this.sytjIndeterminate = false
    },
    handleSytjChange() { this.updateCheckAllState() },

    // ===== 提交 =====
    async submitForm() {
      this.submitting = true
      try {
        const params = {
          kid: this.kid,
          sytb: this.purviewForm.sytb.join(','),
          cpfl: this.purviewForm.cpfl.join(','),
          cpzl: this.purviewForm.cpzl.join(','),
          sytj: this.purviewForm.sytj.join(','),
          yc: String(this.purviewForm.yc),
          lbfl: this.purviewForm.lbfl.join(','),
          pricexz: String(this.purviewForm.pricexz),
          lanmu: this.purviewForm.lanmu
        }
        const res = await editPurview(params)
        if (res.code === 200) {
          this.$message.success(res.msg || '保存成功')
          this.$router.back()  // 返回上一页
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      } catch (e) { this.$message.error('请求失败') }
      finally { this.submitting = false }
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
}

.mt20 {
  margin-top: 20px;
}
</style>