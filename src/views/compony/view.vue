<template>
  <div class="list-container">
    <el-card class="search-card">
      <div style="width: 60%">
        <el-form ref="form" :model="form" label-width="140px" label-position="right">
          <el-form-item label="配置栏目：">
            <el-select v-model="form.type" style="width: 100%" filterable placeholder="请选择配置的网站"
              @change="handleTypeChange">
              <el-option label="蛋糕" value="1"></el-option>
              <el-option label="图书" value="2"></el-option>
              <el-option label="电影" value="3"></el-option>
              <el-option label="奇票" value="4"></el-option>
              <el-option label="肯德基" value="5"></el-option>
              <el-option label="麦当劳" value="6"></el-option>
              <el-option label="星巴克" value="8"></el-option>
              <el-option label="必胜客" value="7"></el-option>
              <el-option label="奈雪" value="9"></el-option>
              <el-option label="瑞幸" value="10"></el-option>
              <el-option label="库迪" value="11"></el-option>
              <el-option label="塔斯汀" value="12"></el-option>
            </el-select>
          </el-form-item>

          <!-- 蛋糕专属 -->
          <el-form-item label="公司名称：" v-if="form.type == 1">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="蛋糕公告：" v-if="form.type == 1">
            <el-input type="textarea" v-model="form.dggonggao" :rows="6"></el-input>
          </el-form-item>
          <el-form-item label="蛋糕搜索关键词：" v-if="form.type == 1">
            <el-input type="textarea" v-model="form.keyword" :rows="6"></el-input>
          </el-form-item>
          <!-- 图书专属 -->
          <el-form-item label="网址：" v-if="form.type == 2">
            <el-input v-model="form.wangzhi"></el-input>
          </el-form-item>
          <el-form-item label="图书搜索关键：" v-if="form.type == 2">
            <el-input type="textarea" v-model="form.keyword2" :rows="6"></el-input>
          </el-form-item>

          <!-- 电影专属 -->
          <el-form-item label="热门城市：" v-if="form.type == 3">
            <el-input type="textarea" v-model="form.dycity" :rows="6"></el-input>
          </el-form-item>

          <!-- 奇票专属 -->
          <el-form-item label="热门城市：" v-if="form.type == 4">
            <el-input type="textarea" v-model="form.city" :rows="6"></el-input>
          </el-form-item>
          <el-form-item label="电影下单模式：" v-if="form.type == 4" style="text-align: left;">
            <el-radio-group v-model="form.dyorder">
              <el-radio :label="1">特惠票</el-radio>
              <el-radio :label="2">全部快速票</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 肯德基专属 -->
          <el-form-item label="限时抢购：" v-if="form.type == 5">
            <el-date-picker v-model="form.qg_time" type="datetime" placeholder="选择截止时间" value-format="timestamp"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>


          <el-form-item label="福利背景颜色：" v-if="form.type == 5" style="text-align: left; ">
            <div class="dflex">
              <el-color-picker v-model="form.flcolor"></el-color-picker>
              <el-input v-model="form.flcolor" style="margin-left: 10px;"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="点餐提示：" v-if="form.type == 5">
            <el-input type="textarea" v-model="form.kdjdcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 5">
            <el-input type="textarea" v-model="form.kdjwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 5">
            <el-input type="textarea" v-model="form.kdjcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 麦当劳专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 6">
            <el-input type="textarea" v-model="form.mdldcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 6">
            <el-input type="textarea" v-model="form.mdlwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 6">
            <el-input type="textarea" v-model="form.mdlcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 星巴克专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 8">
            <el-input type="textarea" v-model="form.xbkdcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 8">
            <el-input type="textarea" v-model="form.xbkwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 8">
            <el-input type="textarea" v-model="form.xbkcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 必胜客专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 7">
            <el-input type="textarea" v-model="form.bskdcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 7">
            <el-input type="textarea" v-model="form.bskwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 7">
            <el-input type="textarea" v-model="form.bskcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 奈雪专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 9">
            <el-input type="textarea" v-model="form.nxdcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 9">
            <el-input type="textarea" v-model="form.nxwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 9">
            <el-input type="textarea" v-model="form.nxcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 瑞幸专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 10">
            <el-input type="textarea" v-model="form.rxdcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 10">
            <el-input type="textarea" v-model="form.rxwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 10">
            <el-input type="textarea" v-model="form.rxcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 库迪专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 11">
            <el-input type="textarea" v-model="form.kddcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 11">
            <el-input type="textarea" v-model="form.kdwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 11">
            <el-input type="textarea" v-model="form.kdcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 塔斯汀专属 -->
          <el-form-item label="点餐提示：" v-if="form.type == 12">
            <el-input type="textarea" v-model="form.tsddcts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="外卖点餐：" v-if="form.type == 12">
            <el-input type="textarea" v-model="form.tsdwmts" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="底部信息：" v-if="form.type == 12">
            <el-input type="textarea" v-model="form.tsdcopyright" :rows="3"></el-input>
          </el-form-item>

          <!-- 公用字段 -->
          <el-form-item label="首页搜索关键词：">
            <el-input v-model="form.keyword1"></el-input>
          </el-form-item>
          <el-form-item label="备案号：">
            <el-input v-model="form.banum"></el-input>
          </el-form-item>
          <el-form-item label="在线客服：">
            <el-input v-model="form.zskf"></el-input>
          </el-form-item>
          <el-form-item label="联系我们：">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="工作时间：">
            <el-input v-model="form.type == 5 ? form.kfcgzsj : form.gzsj"></el-input>
          </el-form-item>
          <el-form-item label="商城公告：">
            <el-input type="textarea" v-model="form.gonggao" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="通用底部信息："
            v-if="form.type != 5 && form.type != 6 && form.type != 7 && form.type != 8 && form.type != 9 && form.type != 10 && form.type != 11 && form.type != 12">
            <el-input type="textarea" v-model="form.copyright" :rows="3"></el-input>
          </el-form-item>

          <el-form-item style="text-align: left">
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { companyIndex, companySave } from '@/api/modules/login'  // 假设有保存接口

export default {
  name: 'ComponyConfig',

  data() {
    return {
      form: {
        type: '1',
        name: '',
        phone: '',
        wangzhi: '',
        keyword: '',
        keyword1: '',
        keyword2: '',
        city: '',
        dycity: '',
        qg_time: '',
        gonggao: '',
        dggonggao: '',
        flcolor: '#eeda97',
        banum: '',
        zskf: '',
        email: '',
        gzsj: '',
        kfcgzsj: '',
        kdjdcts: '',
        kdjwmts: '',
        kdjcopyright: '',
        mdldcts: '',
        mdlwmts: '',
        mdlcopyright: '',
        xbkdcts: '',
        xbkwmts: '',
        xbkcopyright: '',
        bskdcts: '',
        bskwmts: '',
        bskcopyright: '',
        nxdcts: '',
        nxwmts: '',
        nxcopyright: '',
        rxdcts: '',
        rxwmts: '',
        rxcopyright: '',
        kddcts: '',
        kdwmts: '',
        kdcopyright: '',
        tsddcts: '',
        tsdwmts: '',
        tsdcopyright: '',
        copyright: '',
        dyorder: 2
      }
    }
  },

  mounted() {
    this.getCompanyConfig()
  },

  methods: {
    async getCompanyConfig() {
  try {
    const res = await companyIndex()
    if (res.code === 200) {
      // 后端返回的是10位秒级时间戳，转为13位毫秒级给日期选择器
      if (res.data.qg_time && typeof res.data.qg_time === 'number') {
        // 如果是10位秒级，转为13位毫秒级
         
        if (res.data.qg_time.toString().length === 10) {
          res.data.qg_time = res.data.qg_time * 1000
        }
      }
      this.form = { ...this.form, ...res.data }
      this.form.flcolor = '#' + res.data.flcolor
      console.log('前端显示时间(毫秒):', this.form.qg_time)
    }
  } catch (error) {
    console.error('获取配置失败', error)
    this.$message.error('获取配置失败')
  }
},
    handleTypeChange(val) {
      console.log('切换到栏目:', val)
    },

    getFieldsByType(type) {
      const commonFields = [
        'type', 'name', 'phone', 'wangzhi', 'keyword1', 'banum',
        'zskf', 'email', 'gzsj', 'gonggao', 'copyright'
      ]

      const typeFieldsMap = {
        '1': ['dggonggao', 'keyword'],
        '2': ['keyword2'],
        '3': ['dycity'],
        '4': ['city', 'dyorder'],
        '5': ['qg_time', 'flcolor', 'kfcgzsj', 'kdjdcts', 'kdjwmts', 'kdjcopyright'],
        '6': ['mdldcts', 'mdlwmts', 'mdlcopyright'],
        '7': ['bskdcts', 'bskwmts', 'bskcopyright'],
        '8': ['xbkdcts', 'xbkwmts', 'xbkcopyright'],
        '9': ['nxdcts', 'nxwmts', 'nxcopyright'],
        '10': ['rxdcts', 'rxwmts', 'rxcopyright'],
        '11': ['kddcts', 'kdwmts', 'kdcopyright'],
        '12': ['tsddcts', 'tsdwmts', 'tsdcopyright']
      }

      return [...commonFields, ...(typeFieldsMap[type] || [])]
    },

    // 提交保存
   async onSubmit() {
  try {
    const submitData = JSON.parse(JSON.stringify(this.form))
    
    // 将时间戳转换为日期字符串
    if (submitData.qg_time) {
      let timestamp = submitData.qg_time
      // 如果是13位毫秒级，转为10位秒级
      if (timestamp.toString().length === 13) {
        timestamp = Math.floor(timestamp / 1000)
      }
      // 转换为日期字符串格式 YYYY-MM-DD HH:mm:ss
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      submitData.qg_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    } else {
      submitData.qg_time = ''
    }
    
    const fields = this.getFieldsByType(this.form.type)
    const filteredData = {}
    fields.forEach(key => {
      if (submitData[key] !== undefined && submitData[key] !== '') {
        filteredData[key] = submitData[key]
      }
    })
    
    console.log('提交数据:', filteredData)
    
    const res = await companySave(filteredData)
    if (res.code === 200) {
      this.$message.success('保存成功')
      this.getCompanyConfig()
    } else {
      this.$message.error(res.msg || '保存失败')
    }
  } catch (error) {
    console.error('保存失败', error)
    this.$message.error('保存失败')
  }
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
}
</style>